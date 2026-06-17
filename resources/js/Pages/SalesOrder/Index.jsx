import React, { useState } from 'react';
import ModuleLayout from '@/Layouts/ModuleLayout';
import Pagination from '@/Components/Pagination';
import { Head, Link, router } from '@inertiajs/react';

export default function Index({ auth, orders, success }) {
    const [activeMenuId, setActiveMenuId] = useState(null);

    const crumbs = [
        { title: 'Sales', route: '/sales' },
        { title: 'Sales Orders' }
    ];

    const formatCurrency = (val) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(val);
    };

    const getSoTotal = (so) => {
        if (!so.items) return 0;
        return so.items.reduce((sum, item) => sum + (item.quantity * (item.unit_price - item.discount)), 0);
    };

    const deleteSO = (so) => {
        if (!window.confirm(`Are you sure you want to delete draft SO ${so.reference}?`)) {
            return;
        }
        router.delete(route('sales-order.destroy', so.id));
    };

    return (
        <ModuleLayout currentModule="sales" breadcrumbs={crumbs}>
            <Head title="Sales Orders" />

            {/* Success message banner */}
            {success && (
                <div className="bg-emerald-500 text-white px-4 py-3 rounded-lg shadow-sm mb-6 flex items-center gap-2">
                    <i className="ri-checkbox-circle-line text-lg" />
                    <span className="text-sm font-medium">{success}</span>
                </div>
            )}

            {/* Header Block */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6 shadow-sm flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h1 className="text-xl font-bold text-gray-900 font-display">Sales Orders Directory</h1>
                    <p className="text-xs text-gray-500 mt-1">Manage outbound customer order lifecycles, stock reservations, and dispatches</p>
                </div>
                <Link
                    href={route('sales-order.create')}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
                >
                    <i className="ri-file-add-line" />
                    Create Sales Order
                </Link>
            </div>

            {/* Orders Table */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-600">
                        <thead className="text-[11px] font-bold text-gray-400 bg-gray-50 uppercase border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4">SO Reference</th>
                                <th className="px-6 py-4">Customer Name</th>
                                <th className="px-6 py-4">Order Date</th>
                                <th className="px-6 py-4">Dispatch Date</th>
                                <th className="px-6 py-4 text-center">Items Count</th>
                                <th className="px-6 py-4 text-right">Order Total</th>
                                <th className="px-6 py-4 text-center">Status</th>
                                <th className="px-6 py-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {orders.data.length > 0 ? (
                                orders.data.map((order) => {
                                    const total = getSoTotal(order);
                                    return (
                                        <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                                            {/* SO Reference */}
                                            <td className="px-6 py-4 font-bold text-gray-950 text-xs">
                                                <Link href={route('sales-order.show', order.id)} className="hover:text-indigo-600">
                                                    {order.reference}
                                                </Link>
                                            </td>

                                            {/* Customer Name */}
                                            <td className="px-6 py-4 font-semibold text-gray-900">
                                                {order.customer_name}
                                            </td>

                                            {/* Order Date */}
                                            <td className="px-6 py-4 text-gray-500 text-xs">
                                                {order.order_date}
                                            </td>

                                            {/* Dispatch Date */}
                                            <td className="px-6 py-4 text-gray-500 text-xs">
                                                {order.dispatch_date || 'Not dispatched'}
                                            </td>

                                            {/* Items count */}
                                            <td className="px-6 py-4 text-center font-semibold text-gray-800 text-xs">
                                                {order.items ? order.items.length : 0}
                                            </td>

                                            {/* Total cost */}
                                            <td className="px-6 py-4 text-right font-bold text-gray-900">
                                                {formatCurrency(total)}
                                            </td>

                                            {/* Status Badge */}
                                            <td className="px-6 py-4 text-center">
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                                    order.status === 'Dispatched' ? 'bg-emerald-50 text-emerald-700' :
                                                    order.status === 'Confirmed' ? 'bg-indigo-50 text-indigo-700' :
                                                    order.status === 'Cancelled' ? 'bg-red-50 text-red-700' :
                                                    'bg-gray-100 text-gray-650 text-gray-600'
                                                }`}>
                                                    {order.status}
                                                </span>
                                            </td>

                                            {/* Action Dropdown Menu */}
                                            <td className="px-6 py-4 text-center relative">
                                                <button
                                                    onClick={() => setActiveMenuId(activeMenuId === order.id ? null : order.id)}
                                                    className="w-8 h-8 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold inline-flex items-center justify-center shadow-sm transition-colors focus:outline-none"
                                                >
                                                    ...
                                                </button>

                                                {activeMenuId === order.id && (
                                                    <>
                                                        <div className="fixed inset-0 z-40" onClick={() => setActiveMenuId(null)} />
                                                        <div className="absolute right-6 mt-1 w-32 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50 text-left">
                                                            <Link
                                                                href={route('sales-order.show', order.id)}
                                                                className="flex items-center gap-2 px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50 transition-colors"
                                                            >
                                                                <i className="ri-eye-line text-gray-400" />
                                                                Open order
                                                            </Link>
                                                            {order.status === 'Draft' && (
                                                                <button
                                                                    onClick={() => {
                                                                        setActiveMenuId(null);
                                                                        deleteSO(order);
                                                                    }}
                                                                    className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-red-650 text-red-650 text-red-600 hover:bg-red-50 text-left transition-colors"
                                                                >
                                                                    <i className="ri-delete-bin-line" />
                                                                    Delete Draft
                                                                </button>
                                                            )}
                                                        </div>
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="8" className="px-6 py-12 text-center text-xs text-gray-400">
                                        No sales orders found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Table Footer */}
                {orders.meta && (
                    <div className="p-5 border-t border-gray-100 flex items-center justify-between flex-wrap gap-4">
                        <span className="text-xs text-gray-500 font-semibold">
                            Showing {orders.meta.from || 0} to {orders.meta.to || 0} of {orders.meta.total || 0} entries
                        </span>
                        <Pagination links={orders.meta.links} />
                    </div>
                )}
            </div>
        </ModuleLayout>
    );
}
