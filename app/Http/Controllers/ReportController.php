<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use App\Models\Supplier;
use App\Models\PurchaseOrder;
use App\Models\SalesOrder;
use App\Models\StockMovement;
use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    public function index()
    {
        return inertia('Report/Index', [
            'categories' => Category::all(),
            'suppliers' => Supplier::all(),
            'users' => User::all(),
        ]);
    }

    public function run(Request $request)
    {
        $type = $request->type;
        $startDate = $request->start_date;
        $endDate = $request->end_date;
        $categoryId = $request->category_id;
        $supplierId = $request->supplier_id;
        $userId = $request->user_id;

        $results = [];

        switch ($type) {
            case 'stock_summary':
                $query = Product::with(['category', 'inventory']);
                if ($categoryId) $query->where('category_id', $categoryId);
                
                $results = $query->get()->map(function($prod) {
                    return [
                        'sku' => $prod->sku,
                        'name' => $prod->name,
                        'category' => $prod->category?->name,
                        'qty_on_hand' => $prod->inventory ? $prod->inventory->quantity_on_hand : 0,
                        'qty_reserved' => $prod->inventory ? $prod->inventory->quantity_reserved : 0,
                        'status' => $prod->status
                    ];
                });
                break;

            case 'stock_movement':
                $query = StockMovement::with(['product', 'user']);
                if ($startDate) $query->whereDate('created_at', '>=', $startDate);
                if ($endDate) $query->whereDate('created_at', '<=', $endDate);
                if ($userId) $query->where('user_id', $userId);

                $results = $query->get()->map(function($move) {
                    return [
                        'date' => $move->created_at->format('Y-m-d H:i'),
                        'sku' => $move->product?->sku,
                        'product' => $move->product?->name,
                        'type' => $move->type,
                        'qty' => $move->quantity,
                        'operator' => $move->user?->name,
                        'notes' => $move->notes
                    ];
                });
                break;

            case 'low_stock':
                $results = Product::whereHas('inventory', function ($q) {
                        $q->whereRaw('inventory.quantity_on_hand <= products.reorder_level');
                    })
                    ->with(['category', 'inventory'])
                    ->get()
                    ->map(function($prod) {
                        return [
                            'sku' => $prod->sku,
                            'name' => $prod->name,
                            'category' => $prod->category?->name,
                            'qty_on_hand' => $prod->inventory ? $prod->inventory->quantity_on_hand : 0,
                            'reorder_level' => $prod->reorder_level,
                            'status' => $prod->status
                        ];
                    });
                break;

            case 'purchase_order':
                $query = PurchaseOrder::with(['supplier', 'creator']);
                if ($startDate) $query->whereDate('order_date', '>=', $startDate);
                if ($endDate) $query->whereDate('order_date', '<=', $endDate);
                if ($supplierId) $query->where('supplier_id', $supplierId);

                $results = $query->get()->map(function($po) {
                    return [
                        'ref' => $po->reference,
                        'supplier' => $po->supplier?->name,
                        'status' => $po->status,
                        'date' => $po->order_date,
                        'created_by' => $po->creator?->name
                    ];
                });
                break;

            case 'sales_order':
                $query = SalesOrder::with(['creator']);
                if ($startDate) $query->whereDate('order_date', '>=', $startDate);
                if ($endDate) $query->whereDate('order_date', '<=', $endDate);

                $results = $query->get()->map(function($so) {
                    return [
                        'ref' => $so->reference,
                        'client' => $so->customer_name,
                        'status' => $so->status,
                        'date' => $so->order_date,
                        'created_by' => $so->creator?->name
                    ];
                });
                break;

            case 'inventory_valuation':
                $query = Product::with(['category', 'inventory']);
                if ($categoryId) $query->where('category_id', $categoryId);

                $results = $query->get()->map(function($prod) {
                    $qty = $prod->inventory ? $prod->inventory->quantity_on_hand : 0;
                    return [
                        'sku' => $prod->sku,
                        'name' => $prod->name,
                        'qty' => $qty,
                        'cost' => $prod->cost_price,
                        'selling' => $prod->selling_price,
                        'valuation_cost' => $qty * $prod->cost_price,
                        'valuation_selling' => $qty * $prod->selling_price,
                    ];
                });
                break;

            case 'audit_log':
                $query = AuditLog::with('user');
                if ($startDate) $query->whereDate('created_at', '>=', $startDate);
                if ($endDate) $query->whereDate('created_at', '<=', $endDate);
                if ($userId) $query->where('user_id', $userId);

                $results = $query->get()->map(function($log) {
                    return [
                        'date' => $log->created_at->format('Y-m-d H:i'),
                        'user' => $log->user?->name ?? 'System',
                        'action' => $log->action,
                        'type' => $log->model_type,
                        'id' => $log->model_id,
                        'ip' => $log->ip_address,
                    ];
                });
                break;
        }

        return response()->json([
            'results' => $results,
        ]);
    }
}
