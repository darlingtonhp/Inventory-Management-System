<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\PurchasingController;
use App\Http\Controllers\PurchaseOrderController;
use App\Http\Controllers\SalesController;
use App\Http\Controllers\SalesOrderController;
use App\Http\Controllers\StockController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\AnalyticsController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return inertia('Welcome');
});

Route::middleware(["auth", "verified"])->group(function () {
    // 1. Core General Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // 9. AI Analytics Module
    Route::get('/analytics', [AnalyticsController::class, 'index'])->name('analytics.index');
    Route::post('/analytics/query', [AnalyticsController::class, 'query'])->name('analytics.query');

    // 2. Catalog Module (Products & Categories)
    Route::resource('product', ProductController::class);
    Route::resource('category', CategoryController::class);

    // 3. Suppliers Module
    Route::resource('supplier', SupplierController::class);

    // 4. Purchasing Module (POs)
    Route::get('/purchasing', [PurchasingController::class, 'dashboard'])->name('purchasing.dashboard');
    Route::resource('purchase-order', PurchaseOrderController::class);
    Route::post('/purchase-order/{id}/receive', [PurchaseOrderController::class, 'receive'])->name('purchase-order.receive');

    // 5. Sales Module (SOs)
    Route::get('/sales', [SalesController::class, 'dashboard'])->name('sales.dashboard');
    Route::resource('sales-order', SalesOrderController::class);
    Route::post('/sales-order/{id}/dispatch', [SalesOrderController::class, 'dispatch'])->name('sales-order.dispatch');

    // 6. Stock Engine Module (Levels, log, adjust)
    Route::get('/stock', [StockController::class, 'dashboard'])->name('stock.dashboard');
    Route::get('/stock/current', [StockController::class, 'current'])->name('stock.current');
    Route::get('/stock/movements', [StockController::class, 'movements'])->name('stock.movements');
    Route::post('/stock/adjust', [StockController::class, 'adjust'])->name('stock.adjust');

    // 7. Reports Module
    Route::get('/report', [ReportController::class, 'index'])->name('report.index');
    Route::get('/report/run', [ReportController::class, 'run'])->name('report.run');

    // 8. Admin Settings Module (Users, Roles, Audit Logs, Settings)
    Route::resource('user', UserController::class);
    Route::get('/admin/roles', [AdminController::class, 'roles'])->name('admin.roles');
    Route::post('/admin/roles/save', [AdminController::class, 'saveRoles'])->name('admin.roles.save');
    Route::get('/admin/audit-logs', [AdminController::class, 'auditLogs'])->name('admin.audit-logs');
    Route::get('/admin/settings', [AdminController::class, 'settings'])->name('admin.settings');
    Route::post('/admin/settings/save', [AdminController::class, 'saveSettings'])->name('admin.settings.save');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
