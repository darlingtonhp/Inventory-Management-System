import React from 'react';
import ModuleLayout from '@/Layouts/ModuleLayout';
import Pagination from '@/Components/Pagination';
import { Head, Link } from '@inertiajs/react';

export default function Show({ auth, product, movements }) {
    const crumbs = [
        { title: 'Catalog', route: '/product' },
        { title: 'Products', route: '/product' },
        { title: product.name }
    ];

    const formatCurrency = (val) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(val);
    };

    const isLowStock = product.quantity <= product.reorder_level;

    return (
        <ModuleLayout currentModule="catalog" breadcrumbs={crumbs}>
            <Head title={`Product Details: ${product.name}`} />

            {/* Header Toolbar */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6 shadow-sm flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-gray-100 border border-gray-200 flex-shrink-0 overflow-hidden flex items-center justify-center">
                        {product.image_path ? (
                            <img src={product.image_path} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                            <i className="ri-image-line text-gray-400 text-2xl" />
                        )}
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-xl font-bold text-gray-900">{product.name}</h1>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                product.status === 'Active' ? 'bg-indigo-50 text-indigo-700' : 'bg-gray-100 text-gray-600'
                            }`}>
                                {product.status}
                            </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">SKU: <span className="font-semibold text-gray-800">{product.sku}</span> &bull; Category: <span className="font-semibold text-gray-800">{product.category_name || 'Unassigned'}</span></p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Link
                        href={route('product.edit', product.id)}
                        className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-750 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
                    >
                        <i className="ri-edit-line" />
                        Edit Product
                    </Link>
                    <Link
                        href={route('product.index')}
                        className="px-3.5 py-2 border border-gray-200 hover:bg-gray-50 text-xs font-semibold text-gray-600 rounded-lg transition-colors flex items-center gap-1.5"
                    >
                        <i className="ri-arrow-left-line" />
                        Back to List
                    </Link>
                </div>
            </div>

            {/* Split layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Product Stats & Specifications */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Live Inventory Status Card */}
                    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">Stock Level Status</h3>
                        
                        <div className="flex items-baseline gap-2 mb-2">
                            <span className={`text-4xl font-extrabold tracking-tight ${isLowStock ? 'text-amber-600' : 'text-gray-900'}`}>
                                {product.quantity}
                            </span>
                            <span className="text-gray-400 font-bold text-sm uppercase">{product.unit}</span>
                        </div>

                        {isLowStock ? (
                            <div className="bg-amber-50 border border-amber-100 text-amber-800 px-3 py-2 rounded-lg text-xs flex items-start gap-2 mb-4">
                                <i className="ri-alert-line text-lg flex-shrink-0" />
                                <div>
                                    <span className="font-bold">Low Stock Alert:</span> This product is currently below or equal to the reorder trigger level of {product.reorder_level} {product.unit}.
                                </div>
                            </div>
                        ) : (
                            <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 px-3 py-2 rounded-lg text-xs flex items-start gap-2 mb-4">
                                <i className="ri-checkbox-circle-line text-lg flex-shrink-0" />
                                <div>
                                    <span className="font-bold">Stock Adequate:</span> Current level is above the minimum threshold of {product.reorder_level} {product.unit}.
                                </div>
                            </div>
                        )}

                        <div className="space-y-3 pt-2 text-xs">
                            <div className="flex justify-between py-1.5 border-b border-gray-50">
                                <span className="text-gray-500 font-medium">Reorder Alert Threshold</span>
                                <span className="font-bold text-gray-800">{product.reorder_level} {product.unit}</span>
                            </div>
                            <div className="flex justify-between py-1.5 border-b border-gray-50">
                                <span className="text-gray-500 font-medium">Maximum Stock Level</span>
                                <span className="font-bold text-gray-800">{product.max_level ? `${product.max_level} ${product.unit}` : 'Not Defined'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Financial Valuations */}
                    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">Pricing & Margins</h3>
                        
                        <div className="space-y-4">
                            <div>
                                <span className="text-xs text-gray-400 font-medium block">Cost Price (COGS)</span>
                                <span className="text-lg font-bold text-gray-800">{formatCurrency(product.cost_price)}</span>
                            </div>
                            <div>
                                <span className="text-xs text-gray-400 font-medium block">Selling Price</span>
                                <span className="text-lg font-bold text-indigo-600">{formatCurrency(product.selling_price)}</span>
                            </div>
                            
                            {/* Calculated Gross Margin */}
                            <div className="pt-2 border-t border-gray-100">
                                <span className="text-xs text-gray-400 font-medium block">Gross Profit Margin</span>
                                {product.selling_price > 0 ? (
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-sm font-bold text-emerald-600">
                                            {formatCurrency(product.selling_price - product.cost_price)}
                                        </span>
                                        <span className="text-xs font-bold text-emerald-600 bg-emerald-55 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                                            {(((product.selling_price - product.cost_price) / product.selling_price) * 100).toFixed(1)}%
                                        </span>
                                    </div>
                                ) : (
                                    <span className="text-gray-400 text-xs">N/A</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stock Movements Log */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="text-sm font-bold text-gray-850 text-gray-800 flex items-center gap-1.5">
                                <i className="ri-history-line text-indigo-600 text-base" />
                                Stock Movements Ledger
                            </h3>
                            <span className="text-xs text-gray-400">Showing recent activity log</span>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-600">
                                <thead className="text-[11px] font-bold text-gray-400 bg-gray-50 uppercase border-b border-gray-100">
                                    <tr>
                                        <th className="px-6 py-4">Timestamp</th>
                                        <th className="px-6 py-4">Adjustment Type</th>
                                        <th className="px-6 py-4 text-center">Qty Shift</th>
                                        <th className="px-6 py-4">operator</th>
                                        <th className="px-6 py-4">Transaction / Notes</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {movements.data.length > 0 ? (
                                        movements.data.map((move) => {
                                            const isQtyPositive = move.quantity > 0;
                                            return (
                                                <tr key={move.id} className="hover:bg-gray-50/50 transition-colors">
                                                    <td className="px-6 py-4 text-xs font-medium text-gray-500 whitespace-nowrap">
                                                        {new Date(move.created_at).toLocaleString()}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                                            move.type === 'Stock In' ? 'bg-emerald-50 text-emerald-700' :
                                                            move.type === 'Stock Out' ? 'bg-amber-50 text-amber-700' :
                                                            'bg-indigo-50 text-indigo-755 text-indigo-700'
                                                        }`}>
                                                            {move.type}
                                                        </span>
                                                    </td>
                                                    <td className={`px-6 py-4 text-center font-bold whitespace-nowrap ${
                                                        isQtyPositive ? 'text-emerald-600' : 'text-amber-600'
                                                    }`}>
                                                        {isQtyPositive ? `+${move.quantity}` : move.quantity}
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-700 text-xs font-semibold whitespace-nowrap">
                                                        {move.user ? move.user.name : 'System'}
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-500 text-xs max-w-xs truncate">
                                                        {move.notes}
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-12 text-center text-xs text-gray-400">
                                                No stock movements recorded yet.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {movements.meta && (
                            <div className="p-5 border-t border-gray-100 flex items-center justify-between flex-wrap gap-4">
                                <span className="text-xs text-gray-500 font-semibold">
                                    Showing {movements.meta.from || 0} to {movements.meta.to || 0} of {movements.meta.total || 0} entries
                                </span>
                                <Pagination links={movements.meta.links} />
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </ModuleLayout>
    );
}
