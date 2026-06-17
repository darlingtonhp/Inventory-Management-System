import React from 'react';
import ModuleLayout from '@/Layouts/ModuleLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Show({ auth, order, success, error }) {
    const crumbs = [
        { title: 'Sales', route: '/sales' },
        { title: 'Sales Orders', route: '/sales-order' },
        { title: order.reference }
    ];

    const formatCurrency = (val) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(val);
    };

    const getSoTotal = () => {
        if (!order.items) return 0;
        return order.items.reduce((sum, item) => sum + (item.quantity * (item.unit_price - item.discount)), 0);
    };

    // Confirm Order (Draft -> Confirmed)
    const confirmOrder = () => {
        if (!window.confirm("Confirm this order? This will reserve stock and prepare for dispatch.")) {
            return;
        }
        router.put(route('sales-order.update', order.id), { status: 'Confirmed' });
    };

    // Cancel Order (Draft/Confirmed -> Cancelled)
    const cancelOrder = () => {
        if (!window.confirm("Cancel this Sales Order? Any reserved stock will be released back to inventory.")) {
            return;
        }
        router.put(route('sales-order.update', order.id), { status: 'Cancelled' });
    };

    // Dispatch Goods (Confirmed -> Dispatched)
    const dispatchOrder = () => {
        if (!window.confirm("Dispatch this Sales Order? This will deduct stock from the warehouse inventory and mark the order as dispatched.")) {
            return;
        }
        router.post(route('sales-order.dispatch', order.id));
    };

    // Timeline nodes
    const timeline = [
        { name: 'Draft', done: true, current: order.status === 'Draft' },
        { name: 'Confirmed', done: order.status !== 'Draft', current: order.status === 'Confirmed' },
        { name: 'Dispatched', done: order.status === 'Dispatched', current: order.status === 'Dispatched' }
    ];

    return (
        <ModuleLayout currentModule="sales" breadcrumbs={crumbs}>
            <Head title={`Sales Order: ${order.reference}`} />

            {/* Notification Banners */}
            {success && (
                <div className="bg-emerald-500 text-white px-4 py-3 rounded-lg shadow-sm mb-6 flex items-center gap-2">
                    <i className="ri-checkbox-circle-line text-lg" />
                    <span className="text-sm font-medium">{success}</span>
                </div>
            )}
            {error && (
                <div className="bg-amber-500 text-white px-4 py-3 rounded-lg shadow-sm mb-6 flex items-center gap-2">
                    <i className="ri-error-warning-line text-lg" />
                    <span className="text-sm font-medium">{error}</span>
                </div>
            )}

            {/* Header Toolbar */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6 shadow-sm flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center">
                        <i className="ri-hand-coin-line text-indigo-600 text-xl" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-lg font-bold text-gray-900">{order.reference}</h1>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                order.status === 'Dispatched' ? 'bg-emerald-50 text-emerald-700' :
                                order.status === 'Confirmed' ? 'bg-indigo-50 text-indigo-700' :
                                order.status === 'Cancelled' ? 'bg-red-50 text-red-700' :
                                'bg-gray-100 text-gray-650 text-gray-600'
                            }`}>
                                {order.status}
                            </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">Customer: <span className="font-semibold text-gray-800">{order.customer_name}</span></p>
                    </div>
                </div>

                <div className="flex gap-2">
                    {order.status === 'Draft' && (
                        <>
                            <button
                                onClick={confirmOrder}
                                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1"
                            >
                                <i className="ri-checkbox-circle-line" />
                                Confirm Order
                            </button>
                            <button
                                onClick={cancelOrder}
                                className="px-3.5 py-2 border border-red-205 border-red-200 hover:bg-red-50 text-red-600 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
                            >
                                <i className="ri-close-circle-line" />
                                Cancel Order
                            </button>
                        </>
                    )}

                    {order.status === 'Confirmed' && (
                        <>
                            <button
                                onClick={dispatchOrder}
                                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1"
                            >
                                <i className="ri-truck-line" />
                                Dispatch Goods
                            </button>
                            <button
                                onClick={cancelOrder}
                                className="px-3.5 py-2 border border-gray-250 border-gray-200 hover:bg-gray-55 text-gray-600 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
                            >
                                <i className="ri-close-circle-line" />
                                Cancel SO
                            </button>
                        </>
                    )}

                    <Link
                        href={route('sales-order.index')}
                        className="px-3.5 py-2 border border-gray-200 hover:bg-gray-55 text-xs font-semibold text-gray-600 rounded-lg transition-colors flex items-center gap-1.5"
                    >
                        <i className="ri-arrow-left-line" />
                        Back to List
                    </Link>
                </div>
            </div>

            {/* Timeline */}
            {order.status !== 'Cancelled' && (
                <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6 shadow-sm max-w-4xl">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Lifecycle timeline</h3>
                    <div className="flex items-center justify-between relative max-w-sm mx-auto py-2">
                        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-150 -translate-y-1/2 z-0" />
                        
                        {timeline.map((t, idx) => (
                            <div key={idx} className="relative z-10 flex flex-col items-center gap-1">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                                    t.current ? 'bg-indigo-600 text-white ring-4 ring-indigo-55 ring-indigo-50' :
                                    t.done ? 'bg-indigo-600 text-white' :
                                    'bg-gray-100 text-gray-400'
                                }`}>
                                    {t.done ? <i className="ri-check-line" /> : idx + 1}
                                </div>
                                <span className={`text-[10px] font-bold uppercase tracking-wider ${
                                    t.current ? 'text-indigo-600' : 'text-gray-400'
                                }`}>
                                    {t.name}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Split layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Details list card */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-2">Sales Info</h3>
                        
                        <div className="space-y-3.5 text-xs">
                            <div>
                                <span className="text-gray-400 font-medium block mb-0.5">Customer / Client Name</span>
                                <span className="font-bold text-gray-800 text-sm block">{order.customer_name}</span>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <span className="text-gray-400 font-medium block mb-0.5">Order Date</span>
                                    <span className="font-semibold text-gray-800">{order.order_date}</span>
                                </div>
                                <div>
                                    <span className="text-gray-400 font-medium block mb-0.5">Dispatch Date</span>
                                    <span className="font-semibold text-gray-800">{order.dispatch_date || 'Not Dispatched'}</span>
                                </div>
                            </div>

                            <div>
                                <span className="text-gray-400 font-medium block mb-0.5">Created By</span>
                                <span className="font-semibold text-gray-800">{order.creator?.name || 'System'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Items details table */}
                <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                    <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                        <h3 className="text-sm font-bold text-gray-800">Order Items</h3>
                        <span className="text-xs text-gray-400">Products booked under this order</span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-600">
                            <thead className="text-[11px] font-bold text-gray-400 bg-gray-50 uppercase border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4">SKU</th>
                                    <th className="px-6 py-4">Product Name</th>
                                    <th className="px-6 py-4 text-center">Quantity</th>
                                    <th className="px-6 py-4 text-right">Unit Price</th>
                                    <th className="px-6 py-4 text-right">Discount</th>
                                    <th className="px-6 py-4 text-right">Line Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {order.items && order.items.map((item, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 text-xs font-mono text-gray-500">{item.product?.sku}</td>
                                        <td className="px-6 py-4 font-bold text-gray-900">
                                            {item.product ? (
                                                <Link href={route('product.show', item.product.id)} className="hover:text-indigo-600">
                                                    {item.product.name}
                                                </Link>
                                            ) : '-'}
                                        </td>
                                        <td className="px-6 py-4 text-center font-bold text-gray-800">{item.quantity}</td>
                                        <td className="px-6 py-4 text-right text-gray-550">{formatCurrency(item.unit_price)}</td>
                                        <td className="px-6 py-4 text-right text-amber-600 font-semibold">{formatCurrency(item.discount)}</td>
                                        <td className="px-6 py-4 text-right font-black text-gray-950">{formatCurrency(item.quantity * (item.unit_price - item.discount))}</td>
                                    </tr>
                                ))}
                                <tr className="bg-indigo-50/20 font-bold border-t-2 border-indigo-100">
                                    <td colSpan="5" className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wide">Total Order Revenue:</td>
                                    <td className="px-6 py-4 text-right text-lg font-black text-indigo-600">{formatCurrency(getSoTotal())}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </ModuleLayout>
    );
}
