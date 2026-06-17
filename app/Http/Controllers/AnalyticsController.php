<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use App\Models\Supplier;
use App\Models\PurchaseOrder;
use App\Models\SalesOrder;
use App\Models\StockMovement;
use App\Models\Inventory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;

class AnalyticsController extends Controller
{
    public function index()
    {
        $hasOpenAIKey = !empty(env('OPENAI_API_KEY'));
        $hasDeepSeekKey = !empty(env('DEEPSEEK_API_KEY'));

        $totalProducts = Product::count();
        $lowStockCount = Product::whereHas('inventory', function ($q) {
            $q->whereRaw('inventory.quantity_on_hand <= products.reorder_level');
        })->count();

        $valuation = Inventory::join('products', 'inventory.product_id', '=', 'products.id')
            ->sum(DB::raw('inventory.quantity_on_hand * products.selling_price'));

        return inertia('Analytics/Index', [
            'hasOpenAIKey' => $hasOpenAIKey,
            'hasDeepSeekKey' => $hasDeepSeekKey,
            'totalProducts' => $totalProducts,
            'lowStockCount' => $lowStockCount,
            'totalValuation' => (float)$valuation,
        ]);
    }

    public function query(Request $request)
    {
        $request->validate([
            'query' => 'required|string',
            'model' => 'required|string',
        ]);

        $query = $request->input('query');
        $model = $request->input('model');

        // GATHER DATABASE CONTEXT FOR AI
        $totalProducts = Product::count();
        $lowStock = Product::whereHas('inventory', function ($q) {
            $q->whereRaw('inventory.quantity_on_hand <= products.reorder_level');
        })->with(['inventory'])->get();
        
        $lowStockCount = $lowStock->count();

        $valuation = Inventory::join('products', 'inventory.product_id', '=', 'products.id')
            ->sum(DB::raw('inventory.quantity_on_hand * products.selling_price'));
            
        $costValuation = Inventory::join('products', 'inventory.product_id', '=', 'products.id')
            ->sum(DB::raw('inventory.quantity_on_hand * products.cost_price'));

        $suppliersCount = Supplier::count();
        $pendingPOs = PurchaseOrder::whereIn('status', ['Submitted', 'Partially Received'])->count();
        
        $mtdRevenue = SalesOrder::whereIn('status', ['Dispatched', 'Completed'])
            ->whereMonth('order_date', now()->month)
            ->whereYear('order_date', now()->year)
            ->join('sales_order_items', 'sales_orders.id', '=', 'sales_order_items.sales_order_id')
            ->sum(DB::raw('sales_order_items.quantity * (sales_order_items.unit_price - sales_order_items.discount)'));

        $recentMovements = StockMovement::with(['product'])
            ->orderBy('id', 'desc')
            ->limit(5)
            ->get()
            ->map(function($m) {
                $productName = $m->product ? $m->product->name : 'Unknown Product';
                return "- {$m->created_at->toDateString()}: {$productName} ({$m->type}) qty: {$m->quantity} [Ref: {$m->notes}]";
            })->implode("\n");

        $lowStockList = $lowStock->map(function($p) {
            $qtyOnHand = $p->inventory ? $p->inventory->quantity_on_hand : 0;
            return "- {$p->name} (SKU: {$p->sku}) - Current Qty: {$qtyOnHand} (Reorder Level: {$p->reorder_level})";
        })->implode("\n");

        // System Prompt
        $systemPrompt = "You are the AI Inventory Auditor for Smart Inventory Management System in Harare, Zimbabwe.
You analyze database summaries and respond to manager inquiries.
Current System Statistics:
- Catalog Products: {$totalProducts}
- Total Catalog Value (Retail): \$" . number_format($valuation, 2) . "
- Total Cost Valuation: \$" . number_format($costValuation, 2) . "
- Current Margin: \$" . number_format($valuation - $costValuation, 2) . "
- Active Supplier Partners: {$suppliersCount}
- Pending Purchase Orders: {$pendingPOs}
- Sales Revenue MTD: \$" . number_format($mtdRevenue, 2) . "
- Low Stock Alerts: {$lowStockCount}

Low Stock Products list:
{$lowStockList}

Recent Stock Movements:
{$recentMovements}

INSTRUCTIONS:
1. Provide a professional, concise, direct response answering the user query.
2. If the user asks for stock advice, suggest specific reorder quantities.
3. Keep the tone helpful, technical, and formatted with clean Markdown headers, bullet points, and tables where appropriate.";

        $responseContent = '';
        $apiKey = '';

        if ($model === 'openai') {
            $apiKey = env('OPENAI_API_KEY');
            if (empty($apiKey)) {
                return response()->json([
                    'error' => 'OpenAI API Key is not configured in .env file. Falling back to local audit engine.',
                    'fallback' => true,
                    'response' => $this->localAudit($query, $lowStock, $valuation, $costValuation, $recentMovements)
                ]);
            }

            try {
                $response = Http::withHeaders([
                    'Authorization' => 'Bearer ' . $apiKey,
                    'Content-Type' => 'application/json'
                ])->timeout(30)->post('https://api.openai.com/v1/chat/completions', [
                    'model' => 'gpt-4o-mini',
                    'messages' => [
                        ['role' => 'system', 'content' => $systemPrompt],
                        ['role' => 'user', 'content' => $query]
                    ],
                    'temperature' => 0.7
                ]);

                if ($response->successful()) {
                    $responseContent = $response->json('choices.0.message.content');
                } else {
                    throw new \Exception($response->json('error.message') ?? 'API request failed');
                }
            } catch (\Exception $e) {
                return response()->json([
                    'error' => 'OpenAI API Error: ' . $e->getMessage() . '. Falling back to local audit.',
                    'fallback' => true,
                    'response' => $this->localAudit($query, $lowStock, $valuation, $costValuation, $recentMovements)
                ]);
            }
        } elseif ($model === 'deepseek') {
            $apiKey = env('DEEPSEEK_API_KEY');
            if (empty($apiKey)) {
                return response()->json([
                    'error' => 'DeepSeek API Key is not configured in .env file. Falling back to local audit engine.',
                    'fallback' => true,
                    'response' => $this->localAudit($query, $lowStock, $valuation, $costValuation, $recentMovements)
                ]);
            }

            try {
                $response = Http::withHeaders([
                    'Authorization' => 'Bearer ' . $apiKey,
                    'Content-Type' => 'application/json'
                ])->timeout(30)->post('https://api.deepseek.com/v1/chat/completions', [
                    'model' => 'deepseek-chat',
                    'messages' => [
                        ['role' => 'system', 'content' => $systemPrompt],
                        ['role' => 'user', 'content' => $query]
                    ],
                    'temperature' => 0.7
                ]);

                if ($response->successful()) {
                    $responseContent = $response->json('choices.0.message.content');
                } else {
                    throw new \Exception($response->json('error.message') ?? 'DeepSeek API request failed');
                }
            } catch (\Exception $e) {
                return response()->json([
                    'error' => 'DeepSeek Error: ' . $e->getMessage() . '. Falling back to local audit.',
                    'fallback' => true,
                    'response' => $this->localAudit($query, $lowStock, $valuation, $costValuation, $recentMovements)
                ]);
            }
        } else {
            // Local Audit fallback
            $responseContent = $this->localAudit($query, $lowStock, $valuation, $costValuation, $recentMovements);
        }

        return response()->json([
            'response' => $responseContent,
            'model_used' => $model,
            'fallback' => false
        ]);
    }

    private function localAudit($query, $lowStock, $valuation, $costValuation, $recentMovements)
    {
        $lowStockRows = '';
        foreach ($lowStock as $p) {
            $qtyOnHand = $p->inventory ? $p->inventory->quantity_on_hand : 0;
            $lowStockRows .= "| {$p->name} | {$p->sku} | {$qtyOnHand} | {$p->reorder_level} | " . ($p->reorder_level * 3) . " |\n";
        }
        if (empty($lowStockRows)) {
            $lowStockRows = "| None | - | - | - | - |\n";
        }

        $margin = $valuation - $costValuation;
        $marginPercent = $valuation > 0 ? ($margin / $valuation) * 100 : 0;

        return "### 🖥️ Local Audit Engine Analysis (API Offline)

Your query: *\"{$query}\"* was processed by the system's local rule-based audit engine because no API keys were found or the model request timed out.

---

#### 📦 Stock replenishment & Alert Dashboard
The following items have stock quantities equal to or below the reorder threshold and require restocking:

| Product Name | SKU | Quantity On Hand | Reorder Level | Recommended Order Qty |
| :--- | :--- | :---: | :---: | :---: |
{$lowStockRows}

#### 💰 Financial Ledger & Valuations
- **Asset Worth (Selling Price):** \$" . number_format($valuation, 2) . "
- **Asset Acquisition Cost:** \$" . number_format($costValuation, 2) . "
- **Latent Gross Margin:** \$" . number_format($margin, 2) . " (" . number_format($marginPercent, 1) . "%)

#### 📈 Recent Activity Summary
The last logged stock movements on this server:
```markdown
{$recentMovements}
```

*Note: Configure `OPENAI_API_KEY` or `DEEPSEEK_API_KEY` in the project `.env` file to unlock cognitive insights and predictive conversational forecasting.*";
    }
}
