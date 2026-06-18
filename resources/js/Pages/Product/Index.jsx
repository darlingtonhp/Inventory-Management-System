import React, { useState } from 'react';
import ModuleLayout from '@/Layouts/ModuleLayout';
import Pagination from '@/Components/Pagination';
import { Head, Link, router } from '@inertiajs/react';

export default function Index({ auth, products, categories, queryParams = null, success }) {
    queryParams = queryParams || {};
    const [search, setSearch] = useState(queryParams.search || '');
    const [status, setStatus] = useState(queryParams.status || '');
    const [categoryId, setCategoryId] = useState(queryParams.category_id || '');
    const [perPage, setPerPage] = useState(queryParams.per_page || '10');
    const [activeMenuId, setActiveMenuId] = useState(null);

    const handleFilterChange = (name, value) => {
        if (value) {
            queryParams[name] = value;
        } else {
            delete queryParams[name];
        }
        router.get(route('product.index'), queryParams);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        handleFilterChange('search', search);
    };

    const deleteProduct = (product) => {
        if (!window.confirm(`Are you sure you want to delete ${product.name}?`)) {
            return;
        }
        router.delete(route('product.destroy', product.id));
    };

    const crumbs = [
        { title: 'Catalog', route: '/product' },
        { title: 'Products' }
    ];

    const formatCurrency = (val) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(val);
    };

    return (
        <ModuleLayout currentModule="catalog" breadcrumbs={crumbs}>
            <Head title="Products Directory" />

            {/* Success message banner */}
            {success && (
                <div className="bg-emerald-500 text-white px-4 py-3 rounded-lg shadow-sm mb-6 flex items-center gap-2">
                    <i className="ri-checkbox-circle-line text-lg" />
                    <span className="text-sm font-medium">{success}</span>
                </div>
            )}

            {/* Top Toolbar Controls Card (Attachment 3 style) */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6 shadow-sm">
                <form onSubmit={handleSearchSubmit} className="flex flex-wrap items-end gap-4">
                    {/* Search Field */}
                    <div className="flex-1 min-w-[240px]">
                        <label className="text-xs font-semibold text-gray-500 block mb-1">Search</label>
                        <div className="relative">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by name, SKU..."
                                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
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
                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none bg-white"
                        >
                            <option value="">All Categories</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Status Filter */}
                    <div className="w-40">
                        <label className="text-xs font-semibold text-gray-500 block mb-1">Status</label>
                        <select
                            value={status}
                            onChange={(e) => {
                                setStatus(e.target.value);
                                handleFilterChange('status', e.target.value);
                            }}
                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none bg-white"
                        >
                            <option value="">All Statuses</option>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>

                    {/* Per Page Size Selector */}
                    <div className="w-24">
                        <label className="text-xs font-semibold text-gray-500 block mb-1">Per Page</label>
                        <select
                            value={perPage}
                            onChange={(e) => {
                                setPerPage(e.target.value);
                                handleFilterChange('per_page', e.target.value);
                            }}
                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none bg-white"
                        >
                            <option value="10">10</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                        </select>
                    </div>

                    {/* Create Action Button */}
                    <div>
                        <Link
                            href={route('product.create')}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
                        >
                            <i className="ri-add-line" />
                            Add Product
                        </Link>
                    </div>
                </form>
            </div>

            {/* Products Data Table Card (Attachment 3 style) */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-600">
                        <thead className="text-[11px] font-bold text-gray-400 bg-gray-50 uppercase border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4">SKU / Code</th>
                                <th className="px-6 py-4">Product</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">Cost Price</th>
                                <th className="px-6 py-4">Selling Price</th>
                                <th className="px-6 py-4">Qty on Hand</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {products.data.length > 0 ? (
                                products.data.map((product) => {
                                    const isLowStock = product.quantity <= product.reorder_level;
                                    return (
                                        <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                                            {/* SKU Code */}
                                            <td className="px-6 py-4 font-semibold text-gray-800 text-xs">
                                                {product.sku}
                                            </td>

                                            {/* Product details */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-gray-100 border border-gray-200 flex-shrink-0 overflow-hidden flex items-center justify-center">
                                                        {product.image_path ? (
                                                            <img src={product.image_path} alt={product.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <i className="ri-image-line text-gray-400 text-lg" />
                                                        )}
                                                    </div>
                                                    <Link href={route('product.show', product.id)} className="font-semibold text-gray-900 hover:text-indigo-600 transition-colors block">
                                                        {product.name}
                                                    </Link>
                                                </div>
                                            </td>

                                            {/* Category Name */}
                                            <td className="px-6 py-4 text-gray-500 font-medium">
                                                {product.category_name || '-'}
                                            </td>

                                            {/* Cost price */}
                                            <td className="px-6 py-4 text-gray-500 font-medium">
                                                {formatCurrency(product.cost_price)}
                                            </td>

                                            {/* Selling price */}
                                            <td className="px-6 py-4 font-bold text-gray-800">
                                                {formatCurrency(product.selling_price)}
                                            </td>

                                            {/* Qty on Hand with Alerts */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <span className={`font-bold text-sm ${isLowStock ? 'text-amber-600' : 'text-gray-800'}`}>
                                                        {product.quantity}
                                                    </span>
                                                    <span className="text-gray-400 text-xs font-semibold uppercase">{product.unit}</span>
                                                    {isLowStock && (
                                                        <span className="w-2 h-2 rounded-full bg-amber-500" title="Low stock warning" />
                                                    )}
                                                </div>
                                            </td>

                                            {/* Status Badge */}
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                                    product.status === 'Active' ? 'bg-indigo-50 text-indigo-700' : 'bg-gray-100 text-gray-600'
                                                }`}>
                                                    {product.status}
                                                </span>
                                            </td>

                                            {/* Action Dropdown Menu (Attachment 3 style in Indigo) */}
                                            <td className="px-6 py-4 text-center relative">
                                                <button
                                                    onClick={() => setActiveMenuId(activeMenuId === product.id ? null : product.id)}
                                                    className="w-8 h-8 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white inline-flex items-center justify-center shadow-sm transition-colors focus:outline-none"
                                                >
                                                    <i className="ri-more-fill text-lg" />
                                                </button>

                                                {activeMenuId === product.id && (
                                                    <>
                                                        {/* Click-away overlay */}
                                                        <div className="fixed inset-0 z-40" onClick={() => setActiveMenuId(null)} />
                                                        <div className="absolute right-6 mt-1 w-32 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50 text-left animate-fade-in-down">
                                                            <Link
                                                                href={route('product.show', product.id)}
                                                                className="flex items-center gap-2 px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50 transition-colors"
                                                            >
                                                                <i className="ri-eye-line text-gray-400" />
                                                                View details
                                                            </Link>
                                                            <Link
                                                                href={route('product.edit', product.id)}
                                                                className="flex items-center gap-2 px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50 transition-colors"
                                                            >
                                                                <i className="ri-edit-line text-gray-400" />
                                                                Edit product
                                                            </Link>
                                                            <button
                                                                onClick={() => {
                                                                    setActiveMenuId(null);
                                                                    deleteProduct(product);
                                                                }}
                                                                className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 text-left transition-colors"
                                                            >
                                                                <i className="ri-delete-bin-line" />
                                                                Delete
                                                            </button>
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
                                        No products matched the active filters.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Table Footer / Pagination */}
                {products.meta && (
                    <div className="p-5 border-t border-gray-100 flex items-center justify-between flex-wrap gap-4">
                        <span className="text-xs text-gray-500 font-semibold">
                            Showing {products.meta.from || 0} to {products.meta.to || 0} of {products.meta.total || 0} entries
                        </span>
                        <Pagination links={products.meta.links} />
                    </div>
                )}
            </div>
        </ModuleLayout>
    );
}
