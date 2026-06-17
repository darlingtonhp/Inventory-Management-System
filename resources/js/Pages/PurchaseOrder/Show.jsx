import React, { useState } from 'react';
import ModuleLayout from '@/Layouts/ModuleLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';

export default function Show({ auth, order, success, error }) {
    const [showReceiveModal, setShowReceiveModal] = useState(false);

    // Form for receiving items
    const { data, setData, post, processing, errors, reset } = useForm({
        items: (order.items || []).map(item => ({
            item_id: item.id,
            product_name: item.product?.name || '',
            sku: item.product?.sku || '',
            ordered_qty: item.ordered_qty,
            received_qty: item.received_qty,
            receive_qty: Math.max(0, item.ordered_qty - item.received_qty), // Default to remaining
        }))
    });

    const crumbs = [
        { title: 'Purchasing', route: '/purchasing' },
        { title: 'Purchase Orders', route: '/purchase-order' },
        { title: order.reference }
    ];

    const formatCurrency = (val) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(val);
    };

    const getPoTotal = () => {
        if (!order.items) return 0;
        return order.items.reduce((sum, item) => sum + (item.ordered_qty * item.unit_cost), 0);
    };

    // Submit PO to vendor (status -> Submitted)
    const submitOrder = () => {
        if (!window.confirm("Submit this Purchase Order? Once submitted, it will be sent to the supplier, and stock can be received.")) {
            return;
        }
        router.put(route('purchase-order.update', order.id), { status: 'Submitted' });
    };

    // Cancel PO (status -> Cancelled)
    const cancelOrder = () => {
        if (!window.confirm("Are you sure you want to cancel this Purchase Order?")) {
            return;
        }
        router.put(route('purchase-order.update', order.id), { status: 'Cancelled' });
    };

    // Submit received goods
    const handleReceiveSubmit = (e) => {
        e.preventDefault();
        post(route('purchase-order.receive', order.id), {
            onSuccess: () => {
                setShowReceiveModal(false);
                reset();
            }
        });
    };

    const handleReceiveQtyChange = (idx, val) => {
        const updated = [...data.items];
        updated[idx].receive_qty = Math.max(0, parseInt(val, 10) || 0);
        setData('items', updated);
    };

    // Define timeline nodes
    const timeline = [
        { name: 'Draft', done: true, current: order.status === 'Draft' },
        { name: 'Submitted', done: order.status !== 'Draft', current: order.status === 'Submitted' },
        { name: 'Partially Received', done: order.status === 'Partially Received' || order.status === 'Fully Received', current: order.status === 'Partially Received' },
        { name: 'Fully Received', done: order.status === 'Fully Received', current: order.status === 'Fully Received' }
    ];

    return (
        <ModuleLayout currentModule="purchasing" breadcrumbs={crumbs}>
            <Head title={`Purchase Order: ${order.reference}`} />

            {/* Notification banners */}
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

            {/* Header toolbar */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6 shadow-sm flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center">
                        <i className="ri-file-list-3-line text-indigo-600 text-xl" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-lg font-bold text-gray-900">{order.reference}</h1>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                order.status === 'Fully Received' ? 'bg-emerald-50 text-emerald-700' :
                                order.status === 'Partially Received' ? 'bg-amber-50 text-amber-700' :
                                order.status === 'Submitted' ? 'bg-indigo-50 text-indigo-700' :
                                order.status === 'Cancelled' ? 'bg-red-50 text-red-700' :
                                'bg-gray-100 text-gray-600'
                            }`}>
                                {order.status}
                            </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">Supplier: <span className="font-semibold text-gray-800">{order.supplier?.name}</span></p>
                    </div>
                </div>

                <div className="flex gap-2">
                    {order.status === 'Draft' && (
                        <>
                            <button
                                onClick={submitOrder}
                                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-750 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1"
                            >
                                <i className="ri-mail-send-line" />
                                Submit to Supplier
                            </button>
                            <button
                                onClick={cancelOrder}
                                className="px-3.5 py-2 border border-red-200 hover:bg-red-50 text-red-650 text-red-650 text-red-600 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
                            >
                                <i className="ri-close-circle-line" />
                                Cancel Order
                            </button>
                        </>
                    )}

                    {(order.status === 'Submitted' || order.status === 'Partially Received') && (
                        <>
                            <button
                                onClick={() => setShowReceiveModal(true)}
                                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1"
                            >
                                <i className="ri-download-line" />
                                Receive Goods
                            </button>
                            <button
                                onClick={cancelOrder}
                                className="px-3.5 py-2 border border-gray-200 hover:bg-gray-50 text-gray-600 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
                            >
                                <i className="ri-close-circle-line" />
                                Cancel PO
                            </button>
                        </>
                    )}

                    <Link
                        href={route('purchase-order.index')}
                        className="px-3.5 py-2 border border-gray-200 hover:bg-gray-50 text-xs font-semibold text-gray-600 rounded-lg transition-colors flex items-center gap-1.5"
                    >
                        <i className="ri-arrow-left-line" />
                        Back to List
                    </Link>
                </div>
            </div>

            {/* Timeline display */}
            {order.status !== 'Cancelled' && (
                <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6 shadow-sm max-w-4xl">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Lifecycle timeline</h3>
                    <div className="flex items-center justify-between relative max-w-xl mx-auto py-2">
                        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-150 -translate-y-1/2 z-0" />
                        
                        {timeline.map((t, idx) => (
                            <div key={idx} className="relative z-10 flex flex-col items-center gap-1">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                                    t.current ? 'bg-indigo-600 text-white ring-4 ring-indigo-50' :
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
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-2">PO Information</h3>
                        
                        <div className="space-y-3.5 text-xs">
                            <div>
                                <span className="text-gray-400 font-medium block mb-0.5">Supplier Company</span>
                                <span className="font-bold text-gray-800 text-sm block">
                                    {order.supplier ? (
                                        <Link href={route('supplier.show', order.supplier.id)} className="text-indigo-600 hover:underline">
                                            {order.supplier.name}
                                        </Link>
                                    ) : 'Unassigned'}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <span className="text-gray-400 font-medium block mb-0.5">Order Date</span>
                                    <span className="font-semibold text-gray-800">{order.order_date}</span>
                                </div>
                                <div>
                                    <span className="text-gray-400 font-medium block mb-0.5">Delivery Target</span>
                                    <span className="font-semibold text-gray-800">{order.expected_date || 'N/A'}</span>
                                </div>
                            </div>

                            <div>
                                <span className="text-gray-400 font-medium block mb-0.5">Raised By</span>
                                <span className="font-semibold text-gray-800">{order.creator?.name || 'System'}</span>
                            </div>

                            <div>
                                <span className="text-gray-400 font-medium block mb-0.5">Vendor Terms</span>
                                <span className="font-semibold text-gray-800">{order.supplier?.payment_terms || 'Net 30'}</span>
                            </div>

                            <div>
                                <span className="text-gray-400 font-medium block mb-0.5">Purchase Order Notes</span>
                                <span className="font-medium text-gray-600 whitespace-pre-wrap block bg-gray-50 p-2.5 rounded-lg border border-gray-100 italic">
                                    {order.notes || 'No internal receipt instructions added.'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Items details table */}
                <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                    <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                        <h3 className="text-sm font-bold text-gray-800">Procured Line Items</h3>
                        <span className="text-xs text-gray-400">Items inside this procurement order</span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-600">
                            <thead className="text-[11px] font-bold text-gray-400 bg-gray-50 uppercase border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4">SKU</th>
                                    <th className="px-6 py-4">Product Name</th>
                                    <th className="px-6 py-4 text-center">Ordered Qty</th>
                                    <th className="px-6 py-4 text-center">Received Qty</th>
                                    <th className="px-6 py-4 text-right">Unit Cost</th>
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
                                        <td className="px-6 py-4 text-center font-bold text-gray-800">{item.ordered_qty}</td>
                                        <td className={`px-6 py-4 text-center font-bold ${
                                            item.received_qty >= item.ordered_qty ? 'text-emerald-600' :
                                            item.received_qty > 0 ? 'text-amber-600' :
                                            'text-gray-400'
                                        }`}>
                                            {item.received_qty}
                                        </td>
                                        <td className="px-6 py-4 text-right text-gray-550">{formatCurrency(item.unit_cost)}</td>
                                        <td className="px-6 py-4 text-right font-black text-gray-950">{formatCurrency(item.ordered_qty * item.unit_cost)}</td>
                                    </tr>
                                ))}
                                <tr className="bg-indigo-50/20 font-bold border-t-2 border-indigo-100">
                                    <td colSpan="5" className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wide">Total Order Cost:</td>
                                    <td className="px-6 py-4 text-right text-lg font-black text-indigo-600">{formatCurrency(getPoTotal())}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>

            {/* RECEIVE GOODS MODAL DIALOG */}
            {showReceiveModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/40 backdrop-blur-xs animate-fade-in">
                    <div className="bg-white rounded-xl shadow-xl border border-gray-200 w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
                        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="font-bold text-gray-900 flex items-center gap-1.5 text-sm">
                                <i className="ri-download-line text-indigo-600" />
                                Goods Receipt (GRN): {order.reference}
                            </h3>
                            <button
                                onClick={() => setShowReceiveModal(false)}
                                className="w-8 h-8 hover:bg-gray-100 text-gray-400 hover:text-gray-600 rounded-lg flex items-center justify-center transition-colors"
                            >
                                <i className="ri-close-line text-lg" />
                            </button>
                        </div>

                        <form onSubmit={handleReceiveSubmit} className="flex flex-col flex-1 overflow-hidden">
                            <div className="p-6 overflow-y-auto space-y-4 flex-1">
                                <p className="text-xs text-gray-500 mb-2">Input the quantities received from the vendor. Quantities will automatically add to current on-hand warehouse inventory.</p>
                                
                                <div className="space-y-3">
                                    {data.items.map((item, idx) => {
                                        const remaining = Math.max(0, item.ordered_qty - item.received_qty);
                                        return (
                                            <div key={idx} className="flex gap-4 items-center bg-gray-50 p-3 rounded-lg border border-gray-100 text-xs">
                                                <div className="flex-1 min-w-0">
                                                    <span className="font-bold text-gray-800 block truncate">{item.product_name}</span>
                                                    <span className="text-[10px] text-gray-400 font-mono">SKU: {item.sku} &bull; Ordered: {item.ordered_qty} &bull; Prev Received: {item.received_qty}</span>
                                                </div>
                                                <div className="w-32">
                                                    <label className="text-[10px] font-bold text-gray-400 block mb-0.5">Receiving Qty</label>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        max={remaining}
                                                        value={item.receive_qty}
                                                        onChange={(e) => handleReceiveQtyChange(idx, e.target.value)}
                                                        className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded-lg outline-none"
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setShowReceiveModal(false)}
                                    className="px-4 py-2 border border-gray-250 border-gray-200 hover:bg-gray-100 text-xs font-semibold text-gray-600 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors disabled:opacity-50"
                                >
                                    Confirm Receipt
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </ModuleLayout>
    );
}
