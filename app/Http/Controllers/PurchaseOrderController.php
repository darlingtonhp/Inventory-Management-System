<?php

namespace App\Http\Controllers;

use App\Models\PurchaseOrder;
use App\Models\PurchaseOrderItem;
use App\Models\Supplier;
use App\Models\Product;
use App\Models\Inventory;
use App\Models\StockMovement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PurchaseOrderController extends Controller
{
    public function index()
    {
        $orders = PurchaseOrder::with('supplier', 'items')
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return inertia('PurchaseOrder/Index', [
            'orders' => $orders,
            'success' => session('success'),
        ]);
    }

    public function create()
    {
        return inertia('PurchaseOrder/Create', [
            'suppliers' => Supplier::where('is_active', true)->get(),
            'products' => Product::where('status', 'Active')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'supplier_id' => 'required|exists:suppliers,id',
            'order_date' => 'required|date',
            'expected_date' => 'nullable|date|after_or_equal:order_date',
            'notes' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.ordered_qty' => 'required|integer|min:1',
            'items.*.unit_cost' => 'required|numeric|min:0',
        ]);

        DB::transaction(function () use ($validated, $request) {
            // Generate PO reference format PO-YYYY-NNNN
            $year = date('Y', strtotime($validated['order_date']));
            $count = PurchaseOrder::whereYear('order_date', $year)->count() + 1;
            $reference = 'PO-' . $year . '-' . str_pad($count, 4, '0', STR_PAD_LEFT);

            $po = PurchaseOrder::create([
                'supplier_id' => $validated['supplier_id'],
                'reference' => $reference,
                'status' => 'Draft',
                'order_date' => $validated['order_date'],
                'expected_date' => $validated['expected_date'],
                'notes' => $validated['notes'],
                'created_by' => auth()->id(),
            ]);

            foreach ($validated['items'] as $item) {
                PurchaseOrderItem::create([
                    'purchase_order_id' => $po->id,
                    'product_id' => $item['product_id'],
                    'ordered_qty' => $item['ordered_qty'],
                    'received_qty' => 0,
                    'unit_cost' => $item['unit_cost'],
                ]);
            }
        });

        return redirect()->route('purchase-order.index')->with('success', 'Purchase Order raised successfully.');
    }

    public function show($id)
    {
        $order = PurchaseOrder::with(['supplier', 'items.product', 'creator'])->findOrFail($id);
        return inertia('PurchaseOrder/Show', [
            'order' => $order,
            'success' => session('success'),
            'error' => session('error'),
        ]);
    }

    public function update(Request $request, PurchaseOrder $purchaseOrder)
    {
        $validated = $request->validate([
            'status' => 'required|string|in:Draft,Submitted,Cancelled',
        ]);

        $purchaseOrder->update($validated);

        return redirect()->route('purchase-order.show', $purchaseOrder->id)->with('success', 'Order status updated successfully.');
    }

    // Goods Receipt Endpoint
    public function receive(Request $request, $id)
    {
        $po = PurchaseOrder::findOrFail($id);

        if (!in_array($po->status, ['Submitted', 'Partially Received'])) {
            return redirect()->back()->with('error', 'Cannot receive goods on this order status.');
        }

        $validated = $request->validate([
            'items' => 'required|array|min:1',
            'items.*.item_id' => 'required|exists:purchase_order_items,id',
            'items.*.receive_qty' => 'required|integer|min:0',
        ]);

        DB::transaction(function () use ($validated, $po) {
            $fullyReceived = true;

            foreach ($validated['items'] as $itemData) {
                $item = PurchaseOrderItem::findOrFail($itemData['item_id']);
                $receiveQty = $itemData['receive_qty'];

                if ($receiveQty > 0) {
                    $item->received_qty += $receiveQty;
                    $item->save();

                    // Update real-time quantity in inventory table
                    $inventory = Inventory::firstOrCreate(
                        ['product_id' => $item->product_id],
                        ['quantity_on_hand' => 0, 'quantity_reserved' => 0]
                    );
                    $inventory->quantity_on_hand += $receiveQty;
                    $inventory->last_updated = now();
                    $inventory->save();

                    // Log stock movement (Stock In)
                    StockMovement::create([
                        'product_id' => $item->product_id,
                        'type' => 'Stock In',
                        'quantity' => $receiveQty,
                        'reference_type' => PurchaseOrder::class,
                        'reference_id' => $po->id,
                        'notes' => 'PO Goods Receipt: ' . $po->reference,
                        'user_id' => auth()->id(),
                    ]);
                }

                if ($item->received_qty < $item->ordered_qty) {
                    $fullyReceived = false;
                }
            }

            // Update PO status
            $po->status = $fullyReceived ? 'Fully Received' : 'Partially Received';
            $po->save();
        });

        return redirect()->route('purchase-order.show', $po->id)->with('success', 'Goods received and inventory levels updated.');
    }

    public function destroy(PurchaseOrder $purchaseOrder)
    {
        if ($purchaseOrder->status !== 'Draft') {
            return redirect()->back()->with('error', 'Only draft purchase orders can be deleted.');
        }

        $purchaseOrder->items()->delete();
        $purchaseOrder->delete();

        return redirect()->route('purchase-order.index')->with('success', 'Purchase Order deleted successfully.');
    }
}
