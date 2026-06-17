<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use App\Models\User;
use App\Models\Supplier;
use App\Models\PurchaseOrder;
use App\Models\SalesOrder;
use App\Models\StockMovement;
use App\Models\Inventory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        // 1. Core General Stats
        $totalProducts = Product::count();
        $totalCategories = Category::count();
        $totalUsers = User::count();
        $totalSuppliers = Supplier::count();

        // Low stock count: products where inventory on_hand <= reorder_level
        $lowStockCount = Product::whereHas('inventory', function ($q) {
            $q->whereRaw('inventory.quantity_on_hand <= products.reorder_level');
        })->count();

        // Total inventory valuation at selling price
        $totalInventoryValue = Inventory::join('products', 'inventory.product_id', '=', 'products.id')
            ->sum(DB::raw('inventory.quantity_on_hand * products.selling_price'));

        // Pending POs
        $pendingPOs = PurchaseOrder::whereIn('status', ['Submitted', 'Partially Received'])->count();
        
        // Total movements count
        $totalMovements = StockMovement::count();

        // Timeframe-specific stats
        $timeframeStats = [
            'today' => [
                'dispatches' => (int) SalesOrder::where('status', 'Dispatched')
                    ->whereDate('dispatch_date', today())
                    ->count(),
                'revenue' => (float) SalesOrder::whereIn('status', ['Dispatched', 'Completed'])
                    ->whereDate('order_date', today())
                    ->join('sales_order_items', 'sales_orders.id', '=', 'sales_order_items.sales_order_id')
                    ->sum(DB::raw('sales_order_items.quantity * (sales_order_items.unit_price - sales_order_items.discount)')),
                'movements' => (int) StockMovement::whereDate('created_at', today())->count(),
                'pos_raised' => (int) PurchaseOrder::whereDate('order_date', today())->count(),
                'new_products' => (int) Product::whereDate('created_at', today())->count(),
                'new_suppliers' => (int) Supplier::whereDate('created_at', today())->count(),
                'new_users' => (int) User::whereDate('created_at', today())->count(),
            ],
            'this week' => [
                'dispatches' => (int) SalesOrder::where('status', 'Dispatched')
                    ->whereBetween('dispatch_date', [now()->startOfWeek()->toDateString(), now()->endOfWeek()->toDateString()])
                    ->count(),
                'revenue' => (float) SalesOrder::whereIn('status', ['Dispatched', 'Completed'])
                    ->whereBetween('order_date', [now()->startOfWeek()->toDateString(), now()->endOfWeek()->toDateString()])
                    ->join('sales_order_items', 'sales_orders.id', '=', 'sales_order_items.sales_order_id')
                    ->sum(DB::raw('sales_order_items.quantity * (sales_order_items.unit_price - sales_order_items.discount)')),
                'movements' => (int) StockMovement::whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()])->count(),
                'pos_raised' => (int) PurchaseOrder::whereBetween('order_date', [now()->startOfWeek()->toDateString(), now()->endOfWeek()->toDateString()])->count(),
                'new_products' => (int) Product::whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()])->count(),
                'new_suppliers' => (int) Supplier::whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()])->count(),
                'new_users' => (int) User::whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()])->count(),
            ],
            'this month' => [
                'dispatches' => (int) SalesOrder::where('status', 'Dispatched')
                    ->whereBetween('dispatch_date', [now()->startOfMonth()->toDateString(), now()->endOfMonth()->toDateString()])
                    ->count(),
                'revenue' => (float) SalesOrder::whereIn('status', ['Dispatched', 'Completed'])
                    ->whereBetween('order_date', [now()->startOfMonth()->toDateString(), now()->endOfMonth()->toDateString()])
                    ->join('sales_order_items', 'sales_orders.id', '=', 'sales_order_items.sales_order_id')
                    ->sum(DB::raw('sales_order_items.quantity * (sales_order_items.unit_price - sales_order_items.discount)')),
                'movements' => (int) StockMovement::whereBetween('created_at', [now()->startOfMonth(), now()->endOfMonth()])->count(),
                'pos_raised' => (int) PurchaseOrder::whereBetween('order_date', [now()->startOfMonth()->toDateString(), now()->endOfMonth()->toDateString()])->count(),
                'new_products' => (int) Product::whereBetween('created_at', [now()->startOfMonth(), now()->endOfMonth()])->count(),
                'new_suppliers' => (int) Supplier::whereBetween('created_at', [now()->startOfMonth(), now()->endOfMonth()])->count(),
                'new_users' => (int) User::whereBetween('created_at', [now()->startOfMonth(), now()->endOfMonth()])->count(),
            ],
        ];

        return inertia('Dashboard', [
            'totalProducts' => $totalProducts,
            'totalCategories' => $totalCategories,
            'totalUsers' => $totalUsers,
            'totalSuppliers' => $totalSuppliers,
            'lowStockCount' => $lowStockCount,
            'totalInventoryValue' => (float)$totalInventoryValue,
            'pendingPOs' => $pendingPOs,
            'totalMovements' => $totalMovements,
            'timeframeStats' => $timeframeStats,
        ]);
    }
}
