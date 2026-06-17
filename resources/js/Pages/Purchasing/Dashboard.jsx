import React from 'react';
import ModuleLayout from '@/Layouts/ModuleLayout';
import { Head, Link } from '@inertiajs/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function PurchasingDashboard({
    pendingPOs,
    submittedPOs,
    partiallyReceivedPOs,
    fullyReceivedPOs,
    chartData = [],
    recentOrders = []
}) {
    // Breadcrumbs matching design
    const crumbs = [
        { title: 'Purchasing', route: '/purchasing' },
        { title: 'Dashboard' }
    ];

    return (
        <ModuleLayout currentModule="purchasing" breadcrumbs={crumbs}>
            <Head title="Purchasing Dashboard" />

            {/* Header Card (Attachment 2 style) */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6 shadow-sm flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-gray-900">Purchasing Dashboard</h1>
                    <p className="text-xs text-gray-500 mt-1">Overview of purchase orders, deliveries, and supplier activities</p>
                </div>
                <Link
                    href="/dashboard"
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 hover:bg-gray-50 text-xs font-semibold text-gray-600 rounded-lg transition-colors"
                >
                    <i className="ri-arrow-left-line" />
                    Back
                </Link>
            </div>

            {/* Stats row: 4 cards with icons and counts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-lg">
                        <i className="ri-file-warning-line" />
                    </div>
                    <div>
                        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">Draft Orders</span>
                        <span className="text-2xl font-bold text-gray-900">{pendingPOs}</span>
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-yellow-50 text-yellow-600 flex items-center justify-center text-lg">
                        <i className="ri-send-plane-line" />
                    </div>
                    <div>
                        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">Submitted to Suppliers</span>
                        <span className="text-2xl font-bold text-gray-900">{submittedPOs}</span>
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-lg">
                        <i className="ri-truck-line" />
                    </div>
                    <div>
                        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">Partially Received</span>
                        <span className="text-2xl font-bold text-gray-900">{partiallyReceivedPOs}</span>
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center text-lg">
                        <i className="ri-checkbox-circle-line" />
                    </div>
                    <div>
                        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">Fully Received</span>
                        <span className="text-2xl font-bold text-gray-900">{fullyReceivedPOs}</span>
                    </div>
                </div>
            </div>

            {/* Quick action bar */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 shadow-sm flex items-center justify-between flex-wrap gap-4">
                <span className="text-sm font-semibold text-gray-700">Quick Operations:</span>
                <div className="flex gap-2">
                    <Link
                        href="/purchase-order/create"
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
                    >
                        <i className="ri-file-add-line" />
                        Raise Purchase Order
                    </Link>
                    <Link
                        href="/supplier/create"
                        className="px-4 py-2 border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
                    >
                        <i className="ri-user-add-line" />
                        Add New Supplier
                    </Link>
                </div>
            </div>

            {/* Spend Chart & Recent PO List */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Spend Chart Card */}
                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm lg:col-span-2">
                    <h3 className="font-bold text-gray-800 text-sm mb-4">Spend Insight (Last 6 Months)</h3>
                    {chartData.length > 0 ? (
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                                    <XAxis dataKey="month" tick={{ fontSize: 10 }} stroke="#9ca3af" />
                                    <YAxis tick={{ fontSize: 10 }} stroke="#9ca3af" />
                                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                                    <Bar dataKey="spend" fill="#6366f1" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="h-64 flex items-center justify-center text-xs text-gray-400">
                            No spend details available yet.
                        </div>
                    )}
                </div>

                {/* Recent Orders log */}
                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
                    <div>
                        <h3 className="font-bold text-gray-800 text-sm mb-4">Recent POs Activity</h3>
                        <div className="space-y-4 max-h-60 overflow-y-auto pr-1">
                            {recentOrders.length > 0 ? (
                                recentOrders.map((po, index) => (
                                    <div key={index} className="flex justify-between items-start border-b border-gray-50 pb-2">
                                        <div>
                                            <Link href={`/purchase-order/${po.id}`} className="text-xs font-semibold text-indigo-600 hover:underline">
                                                {po.reference}
                                            </Link>
                                            <p className="text-[10px] text-gray-400 mt-0.5">{po.supplier_name}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-xs font-bold text-gray-800">${po.total}</span>
                                            <span className={`block text-[9px] font-semibold mt-1 px-1.5 py-0.5 rounded-full ${
                                                po.status === 'Fully Received' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                                {po.status}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-xs text-gray-400 text-center py-8">No recent activity logged.</p>
                            )}
                        </div>
                    </div>
                    <Link href="/purchase-order" className="text-xs text-indigo-600 font-semibold hover:underline block text-center mt-4 border-t border-gray-100 pt-3">
                        View All Orders
                    </Link>
                </div>
            </div>
        </ModuleLayout>
    );
}
