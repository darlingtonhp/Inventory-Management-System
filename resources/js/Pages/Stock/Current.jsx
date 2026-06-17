import React, { useState } from 'react';
import ModuleLayout from '@/Layouts/ModuleLayout';
import Pagination from '@/Components/Pagination';
import { Head, useForm, Link, router } from '@inertiajs/react';
import InputError from '@/Components/InputError';

export default function Current({ auth, items, categories, queryParams = null, success, error }) {
    queryParams = queryParams || {};
    const [search, setSearch] = useState(queryParams.search || '');
    const [categoryId, setCategoryId] = useState(queryParams.category_id || '');
    const [showAdjustModal, setShowAdjustModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    // Form for manual stock adjustments
    const { data, setData, post, processing, errors, reset } = useForm({
        product_id: '',
        type: 'Adjustment',
        quantity: '0',
        notes: ''
    });

    const crumbs = [
        { title: 'Stock Engine', route: '/stock' },
        { title: 'Current Stock Levels' }
    ];

    const handleFilterChange = (name, value) => {
        if (value) {
            queryParams[name] = value;
        } else {
            delete queryParams[name];
        }
        router.get(route('stock.current'), queryParams);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        handleFilterChange('search', search);
    };

    const openAdjustModal = (item) => {
        setSelectedItem(item);
        setData({
            product_id: item.id,
            type: 'Adjustment',
            quantity: '0',
            notes: ''
        });
        setShowAdjustModal(true);
    };

    const handleAdjustSubmit = (e) => {
        e.preventDefault();
        post(route('stock.adjust'), {
            onSuccess: () => {
                setShowAdjustModal(false);
                reset();
            }
        });
    };

    return (
        <ModuleLayout currentModule="stock" breadcrumbs={crumbs}>
            <Head title="Current Stock Levels" />

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

            {/* Toolbar Filter controls */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6 shadow-sm">
                <form onSubmit={handleSearchSubmit} className="flex flex-wrap items-end gap-4">
                    
                    {/* Search Field */}
                    <div className="flex-1 min-w-[240px]">
                        <label className="text-xs font-semibold text-gray-500 block mb-1">Search Product</label>
                        <div className="relative">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by name, SKU..."
                                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:border-indigo-500 outline-none"
                            />
                            <i className="ri-search-line text-gray-400 absolute left-3 top-2.5 text-base" />
                        </div>
                    </div>

                    {/* Category Filter */}
                    <div className="w-48">
                        <label className="text-xs font-semibold text-gray-500 block mb-1">Category</label>
                        <select
                            value={categoryId}
                            onChange={(e) => {
                                setCategoryId(e.target.value);
                                handleFilterChange('category_id', e.target.value);
                            }}
                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-indigo-500 outline-none bg-white"
                        >
                            <option value="">All Categories</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-indigo-650 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-colors flex items-center gap-1.5"
                        >
                            <i className="ri-filter-2-line" />
                            Apply Filter
                        </button>
                    </div>
                </form>
            </div>

            {/* Current Stock Levels Table Card */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-600">
                        <thead className="text-[11px] font-bold text-gray-400 bg-gray-50 uppercase border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4">SKU Code</th>
                                <th className="px-6 py-4">Product</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4 text-center">Reorder Threshold</th>
                                <th className="px-6 py-4 text-center">On Hand Qty</th>
                                <th className="px-6 py-4 text-center">Reserved Qty</th>
                                <th className="px-6 py-4 text-center">Available Qty</th>
                                <th className="px-6 py-4 text-center">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {items.data.length > 0 ? (
                                items.data.map((item) => {
                                    const isLowStock = item.on_hand <= item.reorder_level;
                                    return (
                                        <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                                            {/* SKU */}
                                            <td className="px-6 py-4 font-semibold text-gray-800 text-xs">
                                                {item.sku}
                                            </td>

                                            {/* Name */}
                                            <td className="px-6 py-4">
                                                <Link href={route('product.show', item.id)} className="font-bold text-gray-900 hover:text-indigo-600 block">
                                                    {item.name}
                                                </Link>
                                            </td>

                                            {/* Category */}
                                            <td className="px-6 py-4 text-gray-500 font-medium">
                                                {item.category_name || '-'}
                                            </td>

                                            {/* Reorder Level */}
                                            <td className="px-6 py-4 text-center font-bold text-gray-700">
                                                {item.reorder_level} <span className="text-[10px] text-gray-400 uppercase font-semibold">{item.unit}</span>
                                            </td>

                                            {/* On hand */}
                                            <td className="px-6 py-4 text-center">
                                                <span className={`font-black text-sm ${isLowStock ? 'text-amber-600' : 'text-gray-950'}`}>
                                                    {item.on_hand}
                                                </span>{' '}
                                                <span className="text-[10px] text-gray-400 uppercase font-semibold">{item.unit}</span>
                                            </td>

                                            {/* Reserved */}
                                            <td className="px-6 py-4 text-center font-semibold text-gray-500 text-xs">
                                                {item.reserved} <span className="text-[10px] text-gray-400 uppercase font-semibold">{item.unit}</span>
                                            </td>

                                            {/* Available */}
                                            <td className="px-6 py-4 text-center">
                                                <span className={`font-extrabold text-sm ${item.available <= 0 ? 'text-amber-600' : 'text-indigo-600'}`}>
                                                    {item.available}
                                                </span>{' '}
                                                <span className="text-[10px] text-gray-400 uppercase font-semibold">{item.unit}</span>
                                            </td>

                                            {/* Status Badge */}
                                            <td className="px-6 py-4 text-center">
                                                {isLowStock ? (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700">
                                                        <span className="w-1 h-1 rounded-full bg-amber-55 bg-amber-500" />
                                                        Low stock
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700">
                                                        <span className="w-1 h-1 rounded-full bg-indigo-500" />
                                                        Adequate
                                                    </span>
                                                )}
                                            </td>

                                            {/* Manual adjustment actions trigger */}
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => openAdjustModal(item)}
                                                    className="px-2.5 py-1.5 border border-indigo-200 hover:border-indigo-300 hover:bg-indigo-50 text-indigo-700 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ml-auto"
                                                >
                                                    <i className="ri-settings-line" />
                                                    Adjust Stock
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="9" className="px-6 py-12 text-center text-xs text-gray-400">
                                        No active products found in warehouse inventories.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Table Footer */}
                {items.meta && (
                    <div className="p-5 border-t border-gray-100 flex items-center justify-between flex-wrap gap-4">
                        <span className="text-xs text-gray-500 font-semibold">
                            Showing {items.meta.from || 0} to {items.meta.to || 0} of {items.meta.total || 0} entries
                        </span>
                        <Pagination links={items.meta.links} />
                    </div>
                )}
            </div>

            {/* MANUAL ADJUSTMENT MODAL DIALOG */}
            {showAdjustModal && selectedItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/40 backdrop-blur-xs animate-fade-in">
                    <div className="bg-white rounded-xl shadow-xl border border-gray-200 w-full max-w-md overflow-hidden">
                        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="font-bold text-gray-900 flex items-center gap-1.5 text-sm font-display">
                                <i className="ri-settings-line text-indigo-650 text-indigo-600" />
                                Manual Stock Adjustment
                            </h3>
                            <button
                                onClick={() => setShowAdjustModal(false)}
                                className="w-8 h-8 hover:bg-gray-100 text-gray-400 hover:text-gray-600 rounded-lg flex items-center justify-center transition-colors"
                            >
                                <i className="ri-close-line text-lg" />
                            </button>
                        </div>

                        <form onSubmit={handleAdjustSubmit} className="space-y-4 p-6">
                            {/* Product Info */}
                            <div className="bg-gray-50 border border-gray-100 p-3 rounded-lg text-xs">
                                <div className="font-bold text-gray-900 mb-0.5">{selectedItem.name}</div>
                                <div className="text-gray-400 font-mono">SKU: {selectedItem.sku} &bull; On Hand: {selectedItem.on_hand} {selectedItem.unit}</div>
                            </div>

                            {/* Adjustment Type */}
                            <div>
                                <label className="text-xs font-semibold text-gray-700 block mb-1">Adjustment Type *</label>
                                <select
                                    value={data.type}
                                    onChange={(e) => setData('type', e.target.value)}
                                    className="w-full px-3 py-2 text-sm border border-gray-250 border-gray-200 rounded-lg outline-none bg-white"
                                    required
                                >
                                    <option value="Adjustment">Standard Stock Adjustment</option>
                                    <option value="Return">Customer/Vendor Return</option>
                                    <option value="Transfer">Internal Stock Transfer</option>
                                </select>
                                <InputError message={errors.type} className="mt-1" />
                            </div>

                            {/* Quantity Shift */}
                            <div>
                                <label className="text-xs font-semibold text-gray-700 block mb-1">Quantity Shift *</label>
                                <input
                                    type="number"
                                    value={data.quantity}
                                    onChange={(e) => setData('quantity', e.target.value)}
                                    placeholder="Use negative values to deduct (e.g. -5), positive to add"
                                    className="w-full px-3 py-2 text-sm border border-gray-250 border-gray-200 rounded-lg outline-none font-semibold"
                                    required
                                />
                                <span className="text-[10px] text-gray-400 block mt-1">Use a negative integer (e.g. -5) to deduct, or positive (e.g. 5) to add.</span>
                                <InputError message={errors.quantity} className="mt-1" />
                            </div>

                            {/* Notes */}
                            <div>
                                <label className="text-xs font-semibold text-gray-700 block mb-1">Reason / Notes *</label>
                                <textarea
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    rows="3"
                                    placeholder="Describe why this adjustment is being performed (e.g. damaged goods, audit discrepancy)..."
                                    className="w-full px-3 py-2 text-xs border border-gray-250 border-gray-200 rounded-lg outline-none resize-none"
                                    required
                                />
                                <InputError message={errors.notes} className="mt-1" />
                            </div>

                            <div className="pt-2 border-t border-gray-100 flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setShowAdjustModal(false)}
                                    className="px-4 py-2 border border-gray-250 border-gray-200 hover:bg-gray-100 text-xs font-semibold text-gray-600 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors disabled:opacity-50"
                                >
                                    Perform Adjustment
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </ModuleLayout>
    );
}
