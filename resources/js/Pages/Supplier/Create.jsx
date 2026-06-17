import React, { useState } from 'react';
import ModuleLayout from '@/Layouts/ModuleLayout';
import InputError from '@/Components/InputError';
import { Head, useForm, Link } from '@inertiajs/react';

export default function Create({ auth, products }) {
    const { data, setData, post, errors, processing } = useForm({
        name: '',
        contact_person: '',
        email: '',
        phone: '',
        address: '',
        payment_terms: 'Net 30',
        is_active: '1',
        products: [] // Array of product IDs linked to this supplier
    });

    const [searchTerm, setSearchTerm] = useState('');

    const onSubmit = (e) => {
        e.preventDefault();
        post(route('supplier.store'));
    };

    const handleProductToggle = (productId) => {
        const currentProducts = [...data.products];
        const index = currentProducts.indexOf(productId);
        if (index > -1) {
            currentProducts.splice(index, 1);
        } else {
            currentProducts.push(productId);
        }
        setData('products', currentProducts);
    };

    const filteredProducts = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const crumbs = [
        { title: 'Suppliers', route: '/supplier' },
        { title: 'Add Supplier' }
    ];

    return (
        <ModuleLayout currentModule="suppliers" breadcrumbs={crumbs}>
            <Head title="Add Supplier" />

            {/* Header Block */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6 shadow-sm flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-gray-900">Add Supplier</h1>
                    <p className="text-xs text-gray-500 mt-1">Register a new vendor profile and map catalogs</p>
                </div>
                <Link
                    href={route('supplier.index')}
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 hover:bg-gray-50 text-xs font-semibold text-gray-600 rounded-lg transition-colors"
                >
                    <i className="ri-arrow-left-line" />
                    Back
                </Link>
            </div>

            {/* Form layout split */}
            <form onSubmit={onSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left card: Details */}
                <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
                    <h3 className="text-sm font-bold text-gray-800 border-b border-gray-100 pb-2 mb-4">
                        Vendor Information
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="text-xs font-semibold text-gray-700 block mb-1">Company / Supplier Name *</label>
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
                            <label className="text-xs font-semibold text-gray-700 block mb-1">Contact Person</label>
                            <input
                                type="text"
                                value={data.contact_person}
                                onChange={(e) => setData('contact_person', e.target.value)}
                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                            />
                            <InputError message={errors.contact_person} className="mt-1" />
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-gray-700 block mb-1">Email Address</label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                            />
                            <InputError message={errors.email} className="mt-1" />
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-gray-700 block mb-1">Phone Number</label>
                            <input
                                type="text"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                            />
                            <InputError message={errors.phone} className="mt-1" />
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-gray-700 block mb-1">Payment Terms</label>
                            <select
                                value={data.payment_terms}
                                onChange={(e) => setData('payment_terms', e.target.value)}
                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none bg-white"
                            >
                                <option value="Cash on Delivery">Cash on Delivery</option>
                                <option value="Net 15">Net 15</option>
                                <option value="Net 30">Net 30</option>
                                <option value="Net 60">Net 60</option>
                                <option value="Letter of Credit">Letter of Credit</option>
                            </select>
                            <InputError message={errors.payment_terms} className="mt-1" />
                        </div>

                        <div className="md:col-span-2">
                            <label className="text-xs font-semibold text-gray-700 block mb-1">Address</label>
                            <textarea
                                value={data.address}
                                onChange={(e) => setData('address', e.target.value)}
                                rows="3"
                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none resize-none"
                            />
                            <InputError message={errors.address} className="mt-1" />
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-gray-700 block mb-1">Vendor Status *</label>
                            <select
                                value={data.is_active}
                                onChange={(e) => setData('is_active', e.target.value)}
                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none bg-white"
                                required
                            >
                                <option value="1">Active</option>
                                <option value="0">Inactive</option>
                            </select>
                            <InputError message={errors.is_active} className="mt-1" />
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 border-t border-gray-100 pt-4 mt-6">
                        <Link
                            href={route('supplier.index')}
                            className="px-4 py-2 border border-gray-200 hover:bg-gray-50 text-xs font-semibold text-gray-600 rounded-lg transition-colors"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors disabled:opacity-50"
                        >
                            Save Supplier
                        </button>
                    </div>
                </div>

                {/* Right card: Linked Products mapping */}
                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col h-[600px]">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 border-b border-gray-100 pb-2">
                        Linked Products ({data.products.length})
                    </h3>
                    <p className="text-[11px] text-gray-400 mb-4">Select the products this supplier is certified to supply</p>

                    <div className="relative mb-3">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Filter product list..."
                            className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:border-indigo-500 outline-none"
                        />
                        <i className="ri-search-line text-gray-400 absolute left-2.5 top-2 text-sm" />
                    </div>

                    <div className="flex-1 overflow-y-auto divide-y divide-gray-50 border border-gray-100 rounded-lg p-2 bg-gray-50/50">
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map((p) => {
                                const isChecked = data.products.includes(p.id);
                                return (
                                    <label key={p.id} className="flex items-center gap-2.5 py-2 px-1.5 hover:bg-white rounded-md cursor-pointer transition-colors">
                                        <input
                                            type="checkbox"
                                            checked={isChecked}
                                            onChange={() => handleProductToggle(p.id)}
                                            className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                        />
                                        <div className="min-w-0">
                                            <span className="text-xs font-semibold text-gray-800 block truncate">{p.name}</span>
                                            <span className="text-[10px] text-gray-400 font-mono">{p.sku}</span>
                                        </div>
                                    </label>
                                );
                            })
                        ) : (
                            <div className="text-center text-xs text-gray-400 py-8">
                                No products found.
                            </div>
                        )}
                    </div>
                </div>

            </form>
        </ModuleLayout>
    );
}
