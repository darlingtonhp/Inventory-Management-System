import React, { useState } from 'react';
import ModuleLayout from '@/Layouts/ModuleLayout';
import Pagination from '@/Components/Pagination';
import { Head, Link, router } from '@inertiajs/react';

export default function Movements({ auth, movements, queryParams = null }) {
    queryParams = queryParams || {};
    const [search, setSearch] = useState(queryParams.search || '');
    const [type, setType] = useState(queryParams.type || '');

    const crumbs = [
        { title: 'Stock Engine', route: '/stock' },
        { title: 'Movements Ledger Log' }
    ];

    const handleFilterChange = (name, value) => {
        if (value) {
            queryParams[name] = value;
        } else {
            delete queryParams[name];
        }
        router.get(route('stock.movements'), queryParams);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        handleFilterChange('search', search);
    };

    return (
        <ModuleLayout currentModule="stock" breadcrumbs={crumbs}>
            <Head title="Stock Movements Ledger" />

            {/* Top Filter Toolbar */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6 shadow-sm">
                <form onSubmit={handleSearchSubmit} className="flex flex-wrap items-end gap-4">
                    {/* Search by Product */}
                    <div className="flex-1 min-w-[240px]">
                        <label className="text-xs font-semibold text-gray-500 block mb-1">Search Product</label>
                        <div className="relative">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search product name or SKU..."
                                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:border-indigo-500 outline-none"
                            />
                            <i className="ri-search-line text-gray-400 absolute left-3 top-2.5 text-base" />
                        </div>
                    </div>

                    {/* Filter by Type */}
                    <div className="w-48">
                        <label className="text-xs font-semibold text-gray-500 block mb-1">Movement Type</label>
                        <select
                            value={type}
                            onChange={(e) => {
                                setType(e.target.value);
                                handleFilterChange('type', e.target.value);
                            }}
                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-indigo-500 outline-none bg-white"
                        >
                            <option value="">All Movements</option>
                            <option value="Stock In">Stock In (Procurement/GRN)</option>
                            <option value="Stock Out">Stock Out (Sales Dispatch)</option>
                            <option value="Adjustment">Manual Adjustments</option>
                            <option value="Return">Returns</option>
                            <option value="Transfer">Transfers</option>
                        </select>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-750 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-colors flex items-center gap-1.5"
                        >
                            <i className="ri-filter-2-line" />
                            Apply Filter
                        </button>
                    </div>
                </form>
            </div>

            {/* Movements Log Table Card */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-600">
                        <thead className="text-[11px] font-bold text-gray-400 bg-gray-50 uppercase border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4">Timestamp</th>
                                <th className="px-6 py-4">SKU / Code</th>
                                <th className="px-6 py-4">Product Name</th>
                                <th className="px-6 py-4">Movement Type</th>
                                <th className="px-6 py-4 text-center">Quantity Shift</th>
                                <th className="px-6 py-4">Operator</th>
                                <th className="px-6 py-4">Transaction / Notes</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                            {movements.data.length > 0 ? (
                                movements.data.map((move) => {
                                    const isPositive = move.quantity > 0;
                                    return (
                                        <tr key={move.id} className="hover:bg-gray-50/50 transition-colors">
                                            {/* Timestamp */}
                                            <td className="px-6 py-4 text-xs font-semibold text-gray-500 whitespace-nowrap">
                                                {new Date(move.created_at).toLocaleString()}
                                            </td>

                                            {/* SKU */}
                                            <td className="px-6 py-4 font-mono text-xs text-gray-500 whitespace-nowrap">
                                                {move.product?.sku}
                                            </td>

                                            {/* Name */}
                                            <td className="px-6 py-4 font-bold text-gray-950">
                                                {move.product ? (
                                                    <Link href={route('product.show', move.product.id)} className="hover:text-indigo-650 hover:text-indigo-600">
                                                        {move.product.name}
                                                    </Link>
                                                ) : '-'}
                                            </td>

                                            {/* Type Badge */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                                    move.type === 'Stock In' ? 'bg-emerald-50 text-emerald-700' :
                                                    move.type === 'Stock Out' ? 'bg-amber-50 text-amber-700' :
                                                    'bg-indigo-50 text-indigo-700'
                                                }`}>
                                                    {move.type}
                                                </span>
                                            </td>

                                            {/* Quantity Shift */}
                                            <td className={`px-6 py-4 text-center font-extrabold whitespace-nowrap ${
                                                isPositive ? 'text-emerald-600' : 'text-amber-600'
                                            }`}>
                                                {isPositive ? `+${move.quantity}` : move.quantity}
                                            </td>

                                            {/* Operator */}
                                            <td className="px-6 py-4 text-xs font-semibold text-gray-600 whitespace-nowrap">
                                                {move.user ? move.user.name : 'System'}
                                            </td>

                                            {/* Notes / Reference */}
                                            <td className="px-6 py-4 text-xs text-gray-500 max-w-sm truncate">
                                                {move.notes}
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="7" className="px-6 py-12 text-center text-xs text-gray-400">
                                        No stock movements match the active filters.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Table Footer */}
                {movements.meta && (
                    <div className="p-5 border-t border-gray-100 flex items-center justify-between flex-wrap gap-4">
                        <span className="text-xs text-gray-500 font-semibold">
                            Showing {movements.meta.from || 0} to {movements.meta.to || 0} of {movements.meta.total || 0} entries
                        </span>
                        <Pagination links={movements.meta.links} />
                    </div>
                )}
            </div>
        </ModuleLayout>
    );
}
