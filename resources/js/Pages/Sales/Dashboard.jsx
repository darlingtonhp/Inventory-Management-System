import React from 'react';
import ModuleLayout from '@/Layouts/ModuleLayout';
import { Head, Link } from '@inertiajs/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function SalesDashboard({
    draftSOs,
    confirmedSOs,
    dispatchedSOs,
    mtdSales,
    chartData = [],
    recentDispatches = []
}) {
    const crumbs = [
        { title: 'Sales', route: '/sales' },
        { title: 'Dashboard' }
    ];

    const formatCurrency = (val) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(val);
    };

    return (
        <ModuleLayout currentModule="sales" breadcrumbs={crumbs}>
            <Head title="Sales Dashboard" />

            {/* Header Card */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6 shadow-sm flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-gray-900">Sales & Dispatch Dashboard</h1>
                    <p className="text-xs text-gray-500 mt-1">Overview of sales orders, reserved stock, and delivery logs</p>
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
                        <i className="ri-file-edit-line" />
                    </div>
                    <div>
                        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">Draft Orders</span>
                        <span className="text-2xl font-bold text-gray-900">{draftSOs}</span>
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-yellow-50 text-yellow-600 flex items-center justify-center text-lg">
                        <i className="ri-shield-user-line" />
                    </div>
                    <div>
                        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">Confirmed (Reserved)</span>
                        <span className="text-2xl font-bold text-gray-900">{confirmedSOs}</span>
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center text-lg">
                        <i className="ri-truck-line" />
                    </div>
                    <div>
                        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">Dispatched</span>
                        <span className="text-2xl font-bold text-gray-900">{dispatchedSOs}</span>
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-700 flex items-center justify-center text-lg">
                        <i className="ri-money-dollar-circle-line" />
                    </div>
                    <div>
                        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">MTD Sales Value</span>
                        <span className="text-2xl font-bold text-gray-900 truncate">{formatCurrency(mtdSales)}</span>
                    </div>
                </div>
            </div>

            {/* Operations Actions Bar */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 shadow-sm flex items-center justify-between flex-wrap gap-4">
                <span className="text-sm font-semibold text-gray-700">Quick Operations:</span>
                <div className="flex gap-2">
                    <Link
                        href="/sales-order/create"
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
                    >
                        <i className="ri-file-add-line" />
                        Create Sales Order
                    </Link>
                </div>
            </div>

            {/* Sales Trends Chart & Recent Dispatches */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Sales Chart Card */}
                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm lg:col-span-2">
                    <h3 className="font-bold text-gray-800 text-sm mb-4">Sales Trend (Last 30 Days)</h3>
                    {chartData.length > 0 ? (
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                                    <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="#9ca3af" />
                                    <YAxis tick={{ fontSize: 10 }} stroke="#9ca3af" />
                                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                                    <Line type="monotone" dataKey="sales" stroke="#6366f1" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="h-64 flex items-center justify-center text-xs text-gray-400">
                            No sales records in the current period.
                        </div>
                    )}
                </div>

                {/* Recent Dispatches Card */}
                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
                    <div>
                        <h3 className="font-bold text-gray-800 text-sm mb-4">Recent Dispatches Log</h3>
                        <div className="space-y-4 max-h-60 overflow-y-auto pr-1">
                            {recentDispatches.length > 0 ? (
                                recentDispatches.map((so, index) => (
                                    <div key={index} className="flex justify-between items-start border-b border-gray-50 pb-2">
                                        <div>
                                            <Link href={`/sales-order/${so.id}`} className="text-xs font-semibold text-indigo-600 hover:underline">
                                                {so.reference}
                                            </Link>
                                            <p className="text-[10px] text-gray-400 mt-0.5">{so.customer_name}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-xs font-bold text-gray-800">{formatCurrency(so.total)}</span>
                                            <span className="block text-[9px] text-gray-400 mt-1">
                                                {so.date}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-xs text-gray-400 text-center py-8">No recent dispatches.</p>
                            )}
                        </div>
                    </div>
                    <Link href="/sales-order" className="text-xs text-indigo-600 font-semibold hover:underline block text-center mt-4 border-t border-gray-100 pt-3">
                        View All Sales Orders
                    </Link>
                </div>
            </div>
        </ModuleLayout>
    );
}
