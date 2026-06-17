import React from 'react';
import ModuleLayout from '@/Layouts/ModuleLayout';
import { Head, Link } from '@inertiajs/react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export default function StockDashboard({
    totalSKUs,
    lowStockAlerts,
    totalQtyOnHand,
    totalQtyReserved,
    lowStockItems = [],
    chartData = [],
    recentAdjustments = []
}) {
    const crumbs = [
        { title: 'Stock Engine', route: '/stock' },
        { title: 'Dashboard' }
    ];

    const COLORS = ['#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

    return (
        <ModuleLayout currentModule="stock" breadcrumbs={crumbs}>
            <Head title="Stock Engine Dashboard" />

            {/* Header Card */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6 shadow-sm flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-gray-900">Stock Engine Dashboard</h1>
                    <p className="text-xs text-gray-500 mt-1">Overview of stock quantities, reservations, and low-stock alerts</p>
                </div>
                <Link
                    href="/dashboard"
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 hover:bg-gray-50 text-xs font-semibold text-gray-600 rounded-lg transition-colors"
                >
                    <i className="ri-arrow-left-line" />
                    Back
                </Link>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-lg">
                        <i className="ri-barcode-line" />
                    </div>
                    <div>
                        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">Total SKUs</span>
                        <span className="text-2xl font-bold text-gray-900">{totalSKUs}</span>
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center text-lg">
                        <i className="ri-error-warning-line animate-pulse" />
                    </div>
                    <div>
                        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">Low Stock Alerts</span>
                        <span className="text-2xl font-bold text-gray-900 text-red-600">{lowStockAlerts}</span>
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center text-lg">
                        <i className="ri-hand-heart-line" />
                    </div>
                    <div>
                        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">Quantities On Hand</span>
                        <span className="text-2xl font-bold text-gray-900">{totalQtyOnHand}</span>
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-yellow-50 text-yellow-600 flex items-center justify-center text-lg">
                        <i className="ri-bookmark-line" />
                    </div>
                    <div>
                        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">Quantities Reserved</span>
                        <span className="text-2xl font-bold text-gray-900">{totalQtyReserved}</span>
                    </div>
                </div>
            </div>

            {/* Operations Actions Bar */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 shadow-sm flex items-center justify-between flex-wrap gap-4">
                <span className="text-sm font-semibold text-gray-700">Quick Operations:</span>
                <div className="flex gap-2">
                    <Link
                        href="/stock/current"
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
                    >
                        <i className="ri-equalizer-line" />
                        Record Stock Adjustment
                    </Link>
                    <Link
                        href="/stock/movements"
                        className="px-4 py-2 border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
                    >
                        <i className="ri-history-line" />
                        View Movements Log
                    </Link>
                </div>
            </div>

            {/* Low stock alerts & Pie Chart Value Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Low Stock Alerts Progress */}
                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm lg:col-span-2">
                    <h3 className="font-bold text-gray-800 text-sm mb-4">Stock Attention Required (Low Stock Items)</h3>
                    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                        {lowStockItems.length > 0 ? (
                            lowStockItems.map((item, index) => {
                                const percent = Math.min(100, Math.round((item.qty / (item.reorder_level || 1)) * 100));
                                return (
                                    <div key={index} className="border-b border-gray-50 pb-3">
                                        <div className="flex justify-between items-center mb-1 text-xs">
                                            <span className="font-semibold text-gray-800">{item.name}</span>
                                            <span className="text-gray-500 font-medium">
                                                Qty: <strong className="text-red-500">{item.qty}</strong> / Reorder: {item.reorder_level} ({item.unit})
                                            </span>
                                        </div>
                                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                style={{ width: `${percent}%` }}
                                                className={`h-full rounded-full ${percent < 50 ? 'bg-red-500' : 'bg-amber-500'}`}
                                            />
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="py-12 flex flex-col items-center justify-center text-gray-400">
                                <i className="ri-checkbox-circle-fill text-green-500 text-4xl mb-2" />
                                <p className="text-xs">No low stock items detected. All levels are secure!</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Pie Chart Card */}
                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
                    <div>
                        <h3 className="font-bold text-gray-800 text-sm mb-2">Value by Category</h3>
                        {chartData.length > 0 ? (
                            <div className="h-56 flex items-center justify-center">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={chartData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={50}
                                            outerRadius={70}
                                            paddingAngle={3}
                                            dataKey="value"
                                        >
                                            {chartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                                        <Legend verticalAlign="bottom" height={36} iconSize={8} iconType="circle" wrapperStyle={{ fontSize: 10 }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="h-56 flex items-center justify-center text-xs text-gray-400">
                                No category stock valuation metrics.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </ModuleLayout>
    );
}
