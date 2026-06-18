<?php

namespace App\Http\Controllers;

use App\Models\SalesOrder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SalesController extends Controller
{
    public function dashboard()
    {
        $draftSOs = SalesOrder::where('status', 'Draft')->count();
        $confirmedSOs = SalesOrder::where('status', 'Confirmed')->count();
        $dispatchedSOs = SalesOrder::where('status', 'Dispatched')->count();

        // MTD Revenue
        $mtdSales = SalesOrder::whereIn('status', ['Dispatched', 'Completed'])
            ->whereMonth('order_date', now()->month)
            ->whereYear('order_date', now()->year)
            ->join('sales_order_items', 'sales_orders.id', '=', 'sales_order_items.sales_order_id')
            ->sum(DB::raw('sales_order_items.quantity * (sales_order_items.unit_price - sales_order_items.discount)'));

        // Chart data: daily sales for the last 30 days
        $isMysql = DB::connection()->getDriverName() === 'mysql';
        $dateFormat = $isMysql
            ? "DATE_FORMAT(sales_orders.order_date, '%m-%d')"
            : "strftime('%m-%d', sales_orders.order_date)";

        $chartData = SalesOrder::select(
                DB::raw("$dateFormat as date_key"),
                DB::raw("sum(sales_order_items.quantity * (sales_order_items.unit_price - sales_order_items.discount)) as sales")
            )
            ->join('sales_order_items', 'sales_orders.id', '=', 'sales_order_items.sales_order_id')
            ->whereIn('sales_orders.status', ['Confirmed', 'Dispatched', 'Completed'])
            ->where('sales_orders.order_date', '>=', now()->subDays(30))
            ->groupBy('date_key')
            ->orderBy('date_key')
            ->get()
            ->map(function ($item) {
                return [
                    'date' => $item->date_key,
                    'sales' => (float)$item->sales,
                ];
            });

        // Recent dispatches
        $recentDispatches = SalesOrder::with('items')
            ->where('status', 'Dispatched')
            ->orderBy('dispatch_date', 'desc')
            ->take(10)
            ->get()
            ->map(function ($so) {
                $total = $so->items->sum(function ($item) {
                    return $item->quantity * ($item->unit_price - $item->discount);
                });
                return [
                    'id' => $so->id,
                    'reference' => $so->reference,
                    'customer_name' => $so->customer_name,
                    'total' => (float)$total,
                    'date' => $so->dispatch_date ? date('Y-m-d', strtotime($so->dispatch_date)) : $so->order_date,
                ];
            });

        return inertia('Sales/Dashboard', [
            'draftSOs' => $draftSOs,
            'confirmedSOs' => $confirmedSOs,
            'dispatchedSOs' => $dispatchedSOs,
            'mtdSales' => (float)$mtdSales,
            'chartData' => $chartData,
            'recentDispatches' => $recentDispatches,
        ]);
    }
}
