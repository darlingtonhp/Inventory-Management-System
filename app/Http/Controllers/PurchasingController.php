<?php

namespace App\Http\Controllers;

use App\Models\PurchaseOrder;
use App\Models\PurchaseOrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PurchasingController extends Controller
{
    public function dashboard()
    {
        $pendingPOs = PurchaseOrder::where('status', 'Draft')->count();
        $submittedPOs = PurchaseOrder::where('status', 'Submitted')->count();
        $partiallyReceivedPOs = PurchaseOrder::where('status', 'Partially Received')->count();
        $fullyReceivedPOs = PurchaseOrder::where('status', 'Fully Received')->count();

        // Spend chart data: group by month for the last 6 months
        $isMysql = DB::connection()->getDriverName() === 'mysql';
        $monthFormat = $isMysql
            ? "DATE_FORMAT(purchase_order_items.created_at, '%Y-%m')"
            : "strftime('%Y-%m', purchase_order_items.created_at)";

        $chartData = PurchaseOrderItem::select(
                DB::raw("$monthFormat as month_key"),
                DB::raw("sum(ordered_qty * unit_cost) as spend")
            )
            ->join('purchase_orders', 'purchase_order_items.purchase_order_id', '=', 'purchase_orders.id')
            ->whereIn('purchase_orders.status', ['Submitted', 'Partially Received', 'Fully Received'])
            ->where('purchase_order_items.created_at', '>=', now()->subMonths(6))
            ->groupBy('month_key')
            ->orderBy('month_key')
            ->get()
            ->map(function ($item) {
                $dateObj = \DateTime::createFromFormat('Y-m', $item->month_key);
                return [
                    'month' => $dateObj ? $dateObj->format('M Y') : $item->month_key,
                    'spend' => (float)$item->spend,
                ];
            });

        // Recent orders
        $recentOrders = PurchaseOrder::with('supplier', 'items')
            ->orderBy('created_at', 'desc')
            ->take(10)
            ->get()
            ->map(function ($po) {
                $total = $po->items->sum(function ($item) {
                    return $item->ordered_qty * $item->unit_cost;
                });
                return [
                    'id' => $po->id,
                    'reference' => $po->reference,
                    'supplier_name' => $po->supplier?->name,
                    'status' => $po->status,
                    'total' => (float)$total,
                    'date' => $po->created_at->format('Y-m-d'),
                ];
            });

        return inertia('Purchasing/Dashboard', [
            'pendingPOs' => $pendingPOs,
            'submittedPOs' => $submittedPOs,
            'partiallyReceivedPOs' => $partiallyReceivedPOs,
            'fullyReceivedPOs' => $fullyReceivedPOs,
            'chartData' => $chartData,
            'recentOrders' => $recentOrders,
        ]);
    }
}
