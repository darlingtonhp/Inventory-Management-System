import React, { useState } from 'react';
import ModuleLayout from '@/Layouts/ModuleLayout';
import { Head, Link } from '@inertiajs/react';

export default function Show({ auth, supplier }) {
    const [activeTab, setActiveTab] = useState('products');

    const crumbs = [
        { title: 'Suppliers', route: '/supplier' },
        { title: supplier.name }
    ];

    const formatCurrency = (val) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(val);
    };

    const getPoTotal = (po) => {
        if (!po.items) return 0;
        return po.items.reduce((sum, item) => sum + (item.ordered_qty * item.unit_cost), 0);
    };

    return (
        <ModuleLayout currentModule="suppliers" breadcrumbs={crumbs}>
            <Head title={`Supplier Profile: ${supplier.name}`} />

            {/* Header Toolbar */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6 shadow-sm flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                        <i className="ri-building-line text-indigo-600 text-2xl" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-xl font-bold text-gray-900">{supplier.name}</h1>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                supplier.is_active ? 'bg-indigo-50 text-indigo-700' : 'bg-gray-100 text-gray-600'
                            }`}>
                                {supplier.is_active ? 'Active' : 'Inactive'}
                            </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Payment Terms: <span className="font-semibold text-gray-800">{supplier.payment_terms || 'N/A'}</span></p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Link
                        href={route('supplier.edit', supplier.id)}
                        className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
                    >
                        <i className="ri-edit-line" />
                        Edit Vendor
                    </Link>
                    <Link
                        href={route('supplier.index')}
                        className="px-3.5 py-2 border border-gray-200 hover:bg-gray-50 text-xs font-semibold text-gray-600 rounded-lg transition-colors flex items-center gap-1.5"
                    >
                        <i className="ri-arrow-left-line" />
                        Back to List
                    </Link>
                </div>
            </div>

            {/* Split layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Column: Vendor Profile Details */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-2">Vendor Details</h3>
                        
                        <div className="space-y-3.5 text-xs">
                            <div>
                                <span className="text-gray-400 font-medium block mb-0.5">Contact Person</span>
                                <span className="font-bold text-gray-800 text-sm">{supplier.contact_person || 'No representative name'}</span>
                            </div>
                            
                            <div>
                                <span className="text-gray-400 font-medium block mb-0.5">Email Address</span>
                                {supplier.email ? (
                                    <a href={`mailto:${supplier.email}`} className="font-semibold text-indigo-600 hover:underline">{supplier.email}</a>
                                ) : (
                                    <span className="text-gray-400">Not specified</span>
                                )}
                            </div>

                            <div>
                                <span className="text-gray-400 font-medium block mb-0.5">Phone Number</span>
                                <span className="font-bold text-gray-800">{supplier.phone || 'Not specified'}</span>
                            </div>

                            <div>
                                <span className="text-gray-400 font-medium block mb-0.5">Registered Address</span>
                                <span className="font-semibold text-gray-750 text-gray-700 whitespace-pre-line leading-relaxed block bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                                    {supplier.address || 'No physical address listed.'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Tabbed Lists */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                        {/* Tab Headers */}
                        <div className="border-b border-gray-100 bg-gray-50/50 flex">
                            <button
                                onClick={() => setActiveTab('products')}
                                className={`px-5 py-3.5 text-xs font-bold transition-colors border-b-2 flex items-center gap-1.5 ${
                                    activeTab === 'products'
                                        ? 'border-indigo-600 text-indigo-600'
                                        : 'border-transparent text-gray-550 text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                <i className="ri-box-3-line" />
                                Certified Products ({supplier.products ? supplier.products.length : 0})
                            </button>
                            <button
                                onClick={() => setActiveTab('orders')}
                                className={`px-5 py-3.5 text-xs font-bold transition-colors border-b-2 flex items-center gap-1.5 ${
                                    activeTab === 'orders'
                                        ? 'border-indigo-600 text-indigo-600'
                                        : 'border-transparent text-gray-550 text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                <i className="ri-file-list-3-line" />
                                Purchase Orders History ({supplier.purchase_orders ? supplier.purchase_orders.length : 0})
                            </button>
                        </div>

                        {/* Tab Contents */}
                        <div className="p-1">
                            {activeTab === 'products' ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left text-gray-600">
                                        <thead className="text-[11px] font-bold text-gray-400 bg-gray-50 uppercase border-b border-gray-100">
                                            <tr>
                                                <th className="px-6 py-3">SKU</th>
                                                <th className="px-6 py-3">Product Name</th>
                                                <th className="px-6 py-3">Cost Price</th>
                                                <th className="px-6 py-3 font-semibold text-center">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {supplier.products && supplier.products.length > 0 ? (
                                                supplier.products.map((p) => (
                                                    <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                                                        <td className="px-6 py-3.5 font-semibold text-gray-800 text-xs">{p.sku}</td>
                                                        <td className="px-6 py-3.5 font-bold text-gray-900">{p.name}</td>
                                                        <td className="px-6 py-3.5 text-gray-500 font-medium">{formatCurrency(p.cost_price)}</td>
                                                        <td className="px-6 py-3.5 text-center">
                                                            <Link href={route('product.show', p.id)} className="text-indigo-600 hover:text-indigo-750 font-bold text-xs hover:underline">
                                                                View details
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="4" className="px-6 py-8 text-center text-xs text-gray-400">
                                                        No certified products mapped to this supplier.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left text-gray-600">
                                        <thead className="text-[11px] font-bold text-gray-400 bg-gray-50 uppercase border-b border-gray-100">
                                            <tr>
                                                <th className="px-6 py-3">Reference</th>
                                                <th className="px-6 py-3">Order Date</th>
                                                <th className="px-6 py-3 text-right">Order Total</th>
                                                <th className="px-6 py-3 text-center">Status</th>
                                                <th className="px-6 py-3 text-center">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {supplier.purchase_orders && supplier.purchase_orders.length > 0 ? (
                                                supplier.purchase_orders.map((po) => (
                                                    <tr key={po.id} className="hover:bg-gray-50/50 transition-colors">
                                                        <td className="px-6 py-3.5 font-bold text-gray-800 text-xs">{po.reference}</td>
                                                        <td className="px-6 py-3.5 text-gray-500 text-xs">{po.order_date}</td>
                                                        <td className="px-6 py-3.5 text-right font-bold text-gray-900">{formatCurrency(getPoTotal(po))}</td>
                                                        <td className="px-6 py-3.5 text-center">
                                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                                                po.status === 'Fully Received' ? 'bg-emerald-50 text-emerald-700' :
                                                                po.status === 'Partially Received' ? 'bg-amber-50 text-amber-700' :
                                                                po.status === 'Submitted' ? 'bg-indigo-50 text-indigo-700' :
                                                                'bg-gray-100 text-gray-600'
                                                            }`}>
                                                                {po.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-3.5 text-center">
                                                            <Link href={route('purchase-order.show', po.id)} className="text-indigo-600 hover:text-indigo-750 font-bold text-xs hover:underline">
                                                                Open order
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="5" className="px-6 py-8 text-center text-xs text-gray-400">
                                                        No purchase order histories.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </ModuleLayout>
    );
}
