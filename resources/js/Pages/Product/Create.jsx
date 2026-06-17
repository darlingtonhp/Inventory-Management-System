import React from 'react';
import ModuleLayout from '@/Layouts/ModuleLayout';
import InputError from '@/Components/InputError';
import { Head, useForm, Link } from '@inertiajs/react';

export default function Create({ auth, categories }) {
    const { data, setData, post, errors, processing } = useForm({
        name: '',
        category_id: '',
        sku: '',
        unit: 'pcs',
        cost_price: '0.00',
        selling_price: '0.00',
        reorder_level: '10',
        max_level: '',
        status: 'Active',
        image: null,
    });

    const onSubmit = (e) => {
        e.preventDefault();
        // Since we are uploading a file (image), we post it as standard form data
        post(route('product.store'));
    };

    const crumbs = [
        { title: 'Catalog', route: '/product' },
        { title: 'Products', route: '/product' },
        { title: 'Add Product' }
    ];

    return (
        <ModuleLayout currentModule="catalog" breadcrumbs={crumbs}>
            <Head title="Add Product" />

            {/* Header Block */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6 shadow-sm flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-gray-900">Add New Product</h1>
                    <p className="text-xs text-gray-500 mt-1">Insert a new stock item into your catalog system</p>
                </div>
                <Link
                    href={route('product.index')}
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 hover:bg-gray-50 text-xs font-semibold text-gray-600 rounded-lg transition-colors"
                >
                    <i className="ri-arrow-left-line" />
                    Back
                </Link>
            </div>

            {/* Form Container */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm max-w-4xl">
                <form onSubmit={onSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* 1. Details Section */}
                        <div className="space-y-4 md:col-span-2">
                            <h3 className="text-sm font-bold text-gray-800 border-b border-gray-100 pb-2">
                                Product details
                            </h3>
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-gray-700 block mb-1">Product Name *</label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                                required
                            />
                            <InputError message={errors.name} className="mt-1" />
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-gray-700 block mb-1">Category *</label>
                            <select
                                value={data.category_id}
                                onChange={(e) => setData('category_id', e.target.value)}
                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none bg-white"
                                required
                            >
                                <option value="">Select Category</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                            <InputError message={errors.category_id} className="mt-1" />
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-gray-700 block mb-1">SKU / Barcode (Leave empty to auto-generate)</label>
                            <input
                                type="text"
                                value={data.sku}
                                onChange={(e) => setData('sku', e.target.value)}
                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                            />
                            <InputError message={errors.sku} className="mt-1" />
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-gray-700 block mb-1">Unit of Measure *</label>
                            <input
                                type="text"
                                value={data.unit}
                                onChange={(e) => setData('unit', e.target.value)}
                                placeholder="e.g. pcs, kg, box"
                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                                required
                            />
                            <InputError message={errors.unit} className="mt-1" />
                        </div>

                        {/* 2. Pricing Section */}
                        <div className="space-y-4 md:col-span-2 pt-2">
                            <h3 className="text-sm font-bold text-gray-800 border-b border-gray-100 pb-2">
                                Pricing & Valuations
                            </h3>
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-gray-700 block mb-1">Cost Price ($) *</label>
                            <input
                                type="number"
                                step="0.01"
                                value={data.cost_price}
                                onChange={(e) => setData('cost_price', e.target.value)}
                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                                required
                            />
                            <InputError message={errors.cost_price} className="mt-1" />
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-gray-700 block mb-1">Selling Price ($) *</label>
                            <input
                                type="number"
                                step="0.01"
                                value={data.selling_price}
                                onChange={(e) => setData('selling_price', e.target.value)}
                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                                required
                            />
                            <InputError message={errors.selling_price} className="mt-1" />
                        </div>

                        {/* 3. Inventory Thresholds Section */}
                        <div className="space-y-4 md:col-span-2 pt-2">
                            <h3 className="text-sm font-bold text-gray-800 border-b border-gray-100 pb-2">
                                Stock Settings
                            </h3>
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-gray-700 block mb-1">Reorder Level (Alert Threshold) *</label>
                            <input
                                type="number"
                                value={data.reorder_level}
                                onChange={(e) => setData('reorder_level', e.target.value)}
                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                                required
                            />
                            <InputError message={errors.reorder_level} className="mt-1" />
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-gray-700 block mb-1">Maximum Stock Level</label>
                            <input
                                type="number"
                                value={data.max_level}
                                onChange={(e) => setData('max_level', e.target.value)}
                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                            />
                            <InputError message={errors.max_level} className="mt-1" />
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-gray-700 block mb-1">Catalog Status *</label>
                            <select
                                value={data.status}
                                onChange={(e) => setData('status', e.target.value)}
                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none bg-white"
                                required
                            >
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                            <InputError message={errors.status} className="mt-1" />
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-gray-700 block mb-1">Product Image (optional)</label>
                            <input
                                type="file"
                                onChange={(e) => setData('image', e.target.files[0])}
                                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                            />
                            <InputError message={errors.image} className="mt-1" />
                        </div>

                    </div>

                    {/* Actions Row */}
                    <div className="flex justify-end gap-2 border-t border-gray-100 pt-4">
                        <Link
                            href={route('product.index')}
                            className="px-4 py-2 border border-gray-200 hover:bg-gray-50 text-xs font-semibold text-gray-600 rounded-lg transition-colors"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors disabled:opacity-50"
                        >
                            Save Product
                        </button>
                    </div>
                </form>
            </div>
        </ModuleLayout>
    );
}
