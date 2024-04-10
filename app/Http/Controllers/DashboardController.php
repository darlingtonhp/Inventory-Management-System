<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Transaction;
use App\Models\User;
use App\Models\Order;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    // Retrieve the authenticated user
    public function index()
    {
        $user  = auth()->user();
        // Retrieve total counts
        $totalProducts = Product::count();
        $totalUsers = User::count();
        $totalTransactions = Transaction::count();
        $totalOrders = Order::count();

        return inertia('Dashboard', [
            'user' => $user,
            'totalProducts' => $totalProducts,
            'totalUsers' => $totalUsers,
            'totalTransactions' => $totalTransactions,
            'totalOrders' => $totalOrders,

        ]);
    }
}
