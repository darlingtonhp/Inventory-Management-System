<?php

namespace App\Http\Controllers;

use App\Models\SalesOrder;
use App\Models\SalesOrderItem;
use App\Models\Product;
use App\Models\Inventory;
use App\Models\StockMovement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SalesOrderController extends Controller
{
    public function index()
    {
        $orders = SalesOrder::with('items')
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return inertia('SalesOrder/Index', [
            'orders' => $orders,
            'success' => session('success'),
        ]);
    }

    public function create()
    {
        // Fetch active products with available quantities
        $products = Product::where('status', 'Active')
            ->with('inventory')
            ->get()
            ->map(function ($prod) {
                $qtyAvailable = $prod->inventory ? ($prod->inventory->quantity_on_hand - $prod->inventory->quantity_reserved) : 0;
                return [
                    'id' => $prod->id,
                    'name' => $prod->name,
                    'sku' => $prod->sku,
                    'selling_price' => (float)$prod->selling_price,
                    'qty_available' => $qtyAvailable,
                    'unit' => $prod->unit
                ];
            });

        return inertia('SalesOrder/Create', [
            'products' => $products,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_name' => 'required|string|max:255',
            'order_date' => 'required|date',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.unit_price' => 'required|numeric|min:0',
            'items.*.discount' => 'nullable|numeric|min:0',
        ]);

        // Validate stock availability before creating order
        foreach ($validated['items'] as $item) {
            $inventory = Inventory::where('product_id', $item['product_id'])->first();
            $qtyAvailable = $inventory ? ($inventory->quantity_on_hand - $inventory->quantity_reserved) : 0;
            
            if ($item['quantity'] > $qtyAvailable) {
                $product = Product::find($item['product_id']);
                return redirect()->back()->withErrors([
                    'items' => 'Insufficient stock for product: ' . ($product ? $product->name : 'ID ' . $item['product_id']) . '. Available: ' . $qtyAvailable
                ]);
            }
        }

        DB::transaction(function () use ($validated) {
            // Generate SO reference: SO-YYYY-NNNN
            $year = date('Y', strtotime($validated['order_date']));
            $count = SalesOrder::whereYear('order_date', $year)->count() + 1;
            $reference = 'SO-' . $year . '-' . str_pad($count, 4, '0', STR_PAD_LEFT);

            $so = SalesOrder::create([
                'reference' => $reference,
                'customer_name' => $validated['customer_name'],
                'status' => 'Draft',
                'order_date' => $validated['order_date'],
                'created_by' => auth()->id(),
            ]);

            foreach ($validated['items'] as $item) {
                SalesOrderItem::create([
                    'sales_order_id' => $so->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'discount' => $item['discount'] ?? 0.00,
                ]);
            }
        });

        return redirect()->route('sales-order.index')->with('success', 'Sales Order created successfully.');
    }

    public function show($id)
    {
        $order = SalesOrder::with(['items.product', 'creator'])->findOrFail($id);
        return inertia('SalesOrder/Show', [
            'order' => $order,
            'success' => session('success'),
            'error' => session('error'),
        ]);
    }

    public function update(Request $request, SalesOrder $salesOrder)
    {
        $validated = $request->validate([
            'status' => 'required|string|in:Draft,Confirmed,Cancelled',
        ]);

        DB::transaction(function () use ($validated, $salesOrder) {
            $oldStatus = $salesOrder->status;
            $newStatus = $validated['status'];

            if ($oldStatus === 'Draft' && $newStatus === 'Confirmed') {
                // Reserve stock
                foreach ($salesOrder->items as $item) {
                    $inventory = Inventory::where('product_id', $item->product_id)->first();
                    if ($inventory) {
                        $inventory->quantity_reserved += $item->quantity;
                        $inventory->save();
                    }
                }
            } elseif ($oldStatus === 'Confirmed' && $newStatus === 'Cancelled') {
                // Undo stock reservation
                foreach ($salesOrder->items as $item) {
                    $inventory = Inventory::where('product_id', $item->product_id)->first();
                    if ($inventory) {
                        $inventory->quantity_reserved = max(0, $inventory->quantity_reserved - $item->quantity);
                        $inventory->save();
                    }
                }
            }

            $salesOrder->update(['status' => $newStatus]);
        });

        return redirect()->route('sales-order.show', $salesOrder->id)->with('success', 'Order status updated successfully.');
    }

    // Dispatch Goods Endpoint
    public function dispatch(Request $request, $id)
    {
        $so = SalesOrder::findOrFail($id);

        if ($so->status !== 'Confirmed') {
            return redirect()->back()->with('error', 'Only confirmed orders can be dispatched.');
        }

        DB::transaction(function () use ($so) {
            foreach ($so->items as $item) {
                $inventory = Inventory::where('product_id', $item->product_id)->first();
                if ($inventory) {
                    // Deduct from both on_hand and reserved
                    $inventory->quantity_on_hand -= $item->quantity;
                    $inventory->quantity_reserved = max(0, $inventory->quantity_reserved - $item->quantity);
                    $inventory->last_updated = now();
                    $inventory->save();

                    // Log stock movement (Stock Out)
                    StockMovement::create([
                        'product_id' => $item->product_id,
                        'type' => 'Stock Out',
                        'quantity' => $item->quantity,
                        'reference_type' => SalesOrder::class,
                        'reference_id' => $so->id,
                        'notes' => 'Sales dispatch for SO: ' . $so->reference,
                        'user_id' => auth()->id(),
                    ]);
                }
            }

            $so->status = 'Dispatched';
            $so->dispatch_date = now();
            $so->save();
        });

        return redirect()->route('sales-order.show', $so->id)->with('success', 'Sales Order items successfully dispatched.');
    }

    public function destroy(SalesOrder $salesOrder)
    {
        if ($salesOrder->status !== 'Draft') {
            return redirect()->back()->with('error', 'Only draft sales orders can be deleted.');
        }

        $salesOrder->items()->delete();
        $salesOrder->delete();

        return redirect()->route('sales-order.index')->with('success', 'Sales Order deleted successfully.');
    }
}
