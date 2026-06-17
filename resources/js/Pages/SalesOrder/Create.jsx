import React, { useState } from 'react';
import ModuleLayout from '@/Layouts/ModuleLayout';
import InputError from '@/Components/InputError';
import { Head, useForm, Link } from '@inertiajs/react';

export default function Create({ auth, products }) {
    const { data, setData, post, errors, processing } = useForm({
        customer_name: '',
        order_date: new Date().toISOString().split('T')[0],
        items: [] // List of { product_id, quantity, unit_price, discount, name, sku, qty_available }
    });

    const handleAddProductRow = () => {
        setData('items', [
            ...data.items,
            { product_id: '', quantity: 1, unit_price: 0, discount: 0, name: '', sku: '', qty_available: 0 }
        ]);
    };

    const handleRemoveProductRow = (index) => {
        const updated = [...data.items];
        updated.splice(index, 1);
        setData('items', updated);
    };

    const handleItemChange = (index, field, value) => {
        const updated = [...data.items];
        if (field === 'product_id') {
            const prod = products.find(p => String(p.id) === String(value));
            if (prod) {
                updated[index].product_id = prod.id;
                updated[index].name = prod.name;
                updated[index].sku = prod.sku;
                updated[index].unit_price = prod.selling_price; // Default selling price
                updated[index].qty_available = prod.qty_available;
            } else {
                updated[index].product_id = '';
                updated[index].name = '';
                updated[index].sku = '';
                updated[index].unit_price = 0;
                updated[index].qty_available = 0;
            }
        } else if (field === 'quantity') {
            updated[index].quantity = parseInt(value, 10) || 1;
        } else if (field === 'unit_price') {
            updated[index].unit_price = parseFloat(value) || 0;
        } else if (field === 'discount') {
            updated[index].discount = parseFloat(value) || 0;
        }
        setData('items', updated);
    };

    const getSOTotal = () => {
        return data.items.reduce((sum, item) => sum + (item.quantity * (item.unit_price - item.discount)), 0);
    };

    const isStockSufficient = (item) => {
        if (!item.product_id) return true;
        return item.quantity <= item.qty_available;
    };

    const hasStockErrors = () => {
        return data.items.some(item => !isStockSufficient(item));
    };

    const onSubmit = (e) => {
        e.preventDefault();
        if (data.items.length === 0) {
            alert("Please add at least one line item to this Sales Order.");
            return;
        }
        if (hasStockErrors()) {
            alert("Some items have quantities exceeding available stock. Please correct them first.");
            return;
        }
        post(route('sales-order.store'));
    };

    const crumbs = [
        { title: 'Sales', route: '/sales' },
        { title: 'Sales Orders', route: '/sales-order' },
        { title: 'Create Sales Order' }
    ];

    const formatCurrency = (val) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(val);
    };

    return (
        <ModuleLayout currentModule="sales" breadcrumbs={crumbs}>
            <Head title="Create Sales Order" />

            {/* Header Block */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6 shadow-sm flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-gray-900 font-display">Create Sales Order</h1>
                    <p className="text-xs text-gray-500 mt-1">Book a new outbound order and reserve available inventory</p>
                </div>
                <Link
                    href={route('sales-order.index')}
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 hover:bg-gray-50 text-xs font-semibold text-gray-600 rounded-lg transition-colors"
                >
                    <i className="ri-arrow-left-line" />
                    Back
                </Link>
            </div>

            {/* Form layout split */}
            <form onSubmit={onSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Card: Customer & Details */}
                <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-6">
                    <h3 className="text-sm font-bold text-gray-800 border-b border-gray-100 pb-2 mb-4">
                        Order Specifications
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-semibold text-gray-700 block mb-1">Customer / Client Name *</label>
                            <input
                                type="text"
                                value={data.customer_name}
                                onChange={(e) => setData('customer_name', e.target.value)}
                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                                required
                            />
                            <InputError message={errors.customer_name} className="mt-1" />
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-gray-700 block mb-1">Order Date *</label>
                            <input
                                type="date"
                                value={data.order_date}
                                onChange={(e) => setData('order_date', e.target.value)}
                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                                required
                            />
                            <InputError message={errors.order_date} className="mt-1" />
                        </div>
                    </div>

                    {/* Dynamic line items block */}
                    <div className="space-y-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Line items list</h4>
                            <button
                                type="button"
                                onClick={handleAddProductRow}
                                className="px-3 py-1.5 border border-indigo-650 border-indigo-500 hover:bg-indigo-50 text-indigo-700 text-[11px] font-bold rounded-lg transition-colors flex items-center gap-1"
                            >
                                <i className="ri-add-line" />
                                Add Item Row
                            </button>
                        </div>

                        {data.items.length > 0 ? (
                            <div className="space-y-3">
                                {data.items.map((item, idx) => {
                                    const stockSufficient = isStockSufficient(item);
                                    return (
                                        <div key={idx} className="flex gap-4 items-end bg-gray-50 p-4 rounded-xl border border-gray-100 relative">
                                            
                                            {/* Product selector */}
                                            <div className="flex-1 min-w-[200px]">
                                                <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Product</label>
                                                <select
                                                    value={item.product_id}
                                                    onChange={(e) => handleItemChange(idx, 'product_id', e.target.value)}
                                                    className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-lg outline-none bg-white"
                                                    required
                                                >
                                                    <option value="">Select Product</option>
                                                    {products.map((p) => (
                                                        <option key={p.id} value={p.id}>{p.name} ({p.sku}) &bull; Qty: {p.qty_available}</option>
                                                    ))}
                                                </select>
                                                {item.product_id && (
                                                    <span className="text-[10px] font-semibold text-gray-400 mt-1 block">
                                                        Available Stock: <span className={item.qty_available > 0 ? 'text-indigo-600' : 'text-amber-600'}>{item.qty_available}</span>
                                                    </span>
                                                )}
                                            </div>

                                            {/* Order Qty */}
                                            <div className="w-24">
                                                <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Quantity</label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={item.quantity}
                                                    onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                                                    className={`w-full px-3 py-1.5 text-xs border rounded-lg outline-none ${
                                                        stockSufficient ? 'border-gray-250 border-gray-200' : 'border-amber-500 bg-amber-50 text-amber-900 focus:border-amber-500'
                                                    }`}
                                                    required
                                                />
                                            </div>

                                            {/* Unit price */}
                                            <div className="w-28">
                                                <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Unit Price ($)</label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    value={item.unit_price}
                                                    onChange={(e) => handleItemChange(idx, 'unit_price', e.target.value)}
                                                    className="w-full px-3 py-1.5 text-xs border border-gray-250 border-gray-200 rounded-lg outline-none"
                                                    required
                                                />
                                            </div>

                                            {/* Discount */}
                                            <div className="w-24">
                                                <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Discount ($)</label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    value={item.discount}
                                                    onChange={(e) => handleItemChange(idx, 'discount', e.target.value)}
                                                    className="w-full px-3 py-1.5 text-xs border border-gray-250 border-gray-200 rounded-lg outline-none"
                                                />
                                            </div>

                                            <div className="w-24 text-right pr-2">
                                                <span className="text-[10px] font-bold text-gray-400 block mb-1">Line Total</span>
                                                <span className="text-xs font-extrabold text-gray-900">
                                                    {formatCurrency(item.quantity * (item.unit_price - item.discount))}
                                                </span>
                                            </div>

                                            {/* Remove Row Button */}
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveProductRow(idx)}
                                                className="w-7 h-7 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors flex items-center justify-center absolute -top-1.5 -right-1.5 shadow-sm border border-red-100"
                                            >
                                                <i className="ri-delete-bin-line text-xs" />
                                            </button>
                                        </div>
                                    );
                                })}

                                {hasStockErrors() && (
                                    <div className="bg-amber-50 border border-amber-100 text-amber-800 p-3 rounded-lg text-xs flex gap-2">
                                        <i className="ri-alert-line text-lg" />
                                        <div>
                                            <span className="font-bold">Quantity Exceeds Available Stock:</span> One or more items exceed warehouse quantities. Please check available stock levels.
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-center py-12 border-2 border-dashed border-gray-150 border-gray-100 rounded-xl bg-gray-50/50">
                                <i className="ri-hand-coin-line text-gray-300 text-3xl block mb-2" />
                                <span className="text-xs text-gray-400 block mb-4">No products added to this sales order yet.</span>
                                <button
                                    type="button"
                                    onClick={handleAddProductRow}
                                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
                                >
                                    Add Line Item
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end gap-2 border-t border-gray-100 pt-4 mt-6">
                        <Link
                            href={route('sales-order.index')}
                            className="px-4 py-2 border border-gray-200 hover:bg-gray-50 text-xs font-semibold text-gray-600 rounded-lg transition-colors"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors disabled:opacity-50"
                        >
                            Save Sales Order
                        </button>
                    </div>
                </div>

                {/* Right Card: Summary Panel */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-2">Order Summary</h3>
                        
                        <div className="space-y-3.5 text-xs">
                            <div className="flex justify-between py-1 border-b border-gray-50">
                                <span className="text-gray-500 font-medium">Customer:</span>
                                <span className="font-bold text-gray-800">{data.customer_name || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between py-1 border-b border-gray-50">
                                <span className="text-gray-500 font-medium">Date:</span>
                                <span className="font-bold text-gray-800">{data.order_date || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between py-1 border-b border-gray-50">
                                <span className="text-gray-500 font-medium">Total Items:</span>
                                <span className="font-bold text-gray-800">{data.items.reduce((sum, item) => sum + item.quantity, 0)}</span>
                            </div>
                            <div className="flex justify-between items-baseline pt-3 border-t border-gray-100">
                                <span className="text-gray-500 font-bold uppercase tracking-wider text-[10px]">Net Payable:</span>
                                <span className="text-xl font-black text-indigo-600">{formatCurrency(getSOTotal())}</span>
                            </div>
                        </div>
                    </div>
                </div>

            </form>
        </ModuleLayout>
    );
}
