<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use App\Models\Inventory;
use App\Models\StockMovement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StockController extends Controller
{
    public function dashboard()
    {
        $totalSKUs = Product::count();
        
        $lowStockAlerts = Product::whereHas('inventory', function ($q) {
            $q->whereRaw('inventory.quantity_on_hand <= products.reorder_level');
        })->count();

        $totalQtyOnHand = Inventory::sum('quantity_on_hand');
        $totalQtyReserved = Inventory::sum('quantity_reserved');

        // Low stock items list with quantities and progress details
        $lowStockItems = Product::whereHas('inventory', function ($q) {
                $q->whereRaw('inventory.quantity_on_hand <= products.reorder_level');
            })
            ->join('inventory', 'products.id', '=', 'inventory.product_id')
            ->select('products.name', 'products.unit', 'products.reorder_level', 'inventory.quantity_on_hand as qty')
            ->get();

        // Chart data: stock valuation by category
        $chartData = Category::select('categories.name as name', DB::raw('sum(inventory.quantity_on_hand * products.selling_price) as value'))
            ->join('products', 'categories.id', '=', 'products.category_id')
            ->join('inventory', 'products.id', '=', 'inventory.product_id')
            ->groupBy('categories.name')
            ->get()
            ->map(function ($item) {
                return [
                    'name' => $item->name,
                    'value' => (float)$item->value,
                ];
            });

        return inertia('Stock/Dashboard', [
            'totalSKUs' => $totalSKUs,
            'lowStockAlerts' => $lowStockAlerts,
            'totalQtyOnHand' => (int)$totalQtyOnHand,
            'totalQtyReserved' => (int)$totalQtyReserved,
            'lowStockItems' => $lowStockItems,
            'chartData' => $chartData,
        ]);
    }

    public function current(Request $request)
    {
        $query = Product::with(['category', 'inventory'])->where('status', 'Active');

        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('sku', 'like', '%' . $request->search . '%');
            });
        }

        if ($request->category_id) {
            $query->where('category_id', $request->category_id);
        }

        $items = $query->paginate(10)->through(function ($prod) {
            return [
                'id' => $prod->id,
                'name' => $prod->name,
                'sku' => $prod->sku,
                'category_name' => $prod->category?->name,
                'unit' => $prod->unit,
                'reorder_level' => $prod->reorder_level,
                'on_hand' => $prod->inventory ? $prod->inventory->quantity_on_hand : 0,
                'reserved' => $prod->inventory ? $prod->inventory->quantity_reserved : 0,
                'available' => $prod->inventory ? ($prod->inventory->quantity_on_hand - $prod->inventory->quantity_reserved) : 0,
            ];
        });

        return inertia('Stock/Current', [
            'items' => $items,
            'categories' => Category::all(),
            'queryParams' => $request->query() ?: null,
            'success' => session('success'),
            'error' => session('error'),
        ]);
    }

    public function movements(Request $request)
    {
        $query = StockMovement::with(['product', 'user']);

        if ($request->search) {
            $query->whereHas('product', function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('sku', 'like', '%' . $request->search . '%');
            });
        }

        if ($request->type) {
            $query->where('type', $request->type);
        }

        $movements = $query->orderBy('created_at', 'desc')->paginate(15);

        return inertia('Stock/Movements', [
            'movements' => $movements,
            'queryParams' => $request->query() ?: null,
        ]);
    }

    // Manual Stock Adjustment
    public function adjust(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'type' => 'required|string|in:Adjustment,Return,Transfer',
            'quantity' => 'required|integer', // negative to adjust down, positive to adjust up
            'notes' => 'required|string',
        ]);

        DB::transaction(function () use ($validated) {
            $inventory = Inventory::firstOrCreate(
                ['product_id' => $validated['product_id']],
                ['quantity_on_hand' => 0, 'quantity_reserved' => 0]
            );

            // Prevent negative on-hand inventory
            if ($inventory->quantity_on_hand + $validated['quantity'] < 0) {
                throw new \Exception('Insufficient inventory on-hand to deduct this quantity.');
            }

            $inventory->quantity_on_hand += $validated['quantity'];
            $inventory->last_updated = now();
            $inventory->save();

            StockMovement::create([
                'product_id' => $validated['product_id'],
                'type' => $validated['type'],
                'quantity' => $validated['quantity'],
                'notes' => $validated['notes'],
                'user_id' => auth()->id(),
            ]);
        });

        return redirect()->back()->with('success', 'Stock adjusted successfully.');
    }
}
