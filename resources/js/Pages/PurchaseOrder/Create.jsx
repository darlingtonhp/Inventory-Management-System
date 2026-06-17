import React, { useState, useEffect } from 'react';
import ModuleLayout from '@/Layouts/ModuleLayout';
import InputError from '@/Components/InputError';
import { Head, useForm, Link } from '@inertiajs/react';

export default function Create({ auth, suppliers, products }) {
    const [step, setStep] = useState(1);
    const { data, setData, post, errors, processing } = useForm({
        supplier_id: '',
        order_date: new Date().toISOString().split('T')[0],
        expected_date: '',
        notes: '',
        items: [] // List of { product_id, ordered_qty, unit_cost, sku, name }
    });

    const [selectedSupplier, setSelectedSupplier] = useState(null);

    useEffect(() => {
        if (data.supplier_id) {
            const found = suppliers.find(s => String(s.id) === String(data.supplier_id));
            setSelectedSupplier(found);
        } else {
            setSelectedSupplier(null);
        }
    }, [data.supplier_id, suppliers]);

    const handleAddProductRow = () => {
        setData('items', [
            ...data.items,
            { product_id: '', ordered_qty: 1, unit_cost: 0, name: '', sku: '' }
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
                updated[index].unit_cost = prod.cost_price; // Default to default cost price
            } else {
                updated[index].product_id = '';
                updated[index].name = '';
                updated[index].sku = '';
                updated[index].unit_cost = 0;
            }
        } else if (field === 'ordered_qty') {
            updated[index].ordered_qty = parseInt(value, 10) || 1;
        } else if (field === 'unit_cost') {
            updated[index].unit_cost = parseFloat(value) || 0;
        }
        setData('items', updated);
    };

    const getPOTotal = () => {
        return data.items.reduce((sum, item) => sum + (item.ordered_qty * item.unit_cost), 0);
    };

    const validateStep1 = () => {
        if (!data.supplier_id || !data.order_date) {
            alert("Please select a supplier and order date to proceed.");
            return false;
        }
        return true;
    };

    const validateStep2 = () => {
        if (data.items.length === 0) {
            alert("Please add at least one product to this Purchase Order.");
            return false;
        }
        const hasEmptyProduct = data.items.some(item => !item.product_id);
        if (hasEmptyProduct) {
            alert("Please select a valid product for all rows.");
            return false;
        }
        return true;
    };

    const onSubmit = (e) => {
        e.preventDefault();
        post(route('purchase-order.store'));
    };

    const crumbs = [
        { title: 'Purchasing', route: '/purchasing' },
        { title: 'Purchase Orders', route: '/purchase-order' },
        { title: 'Raise PO' }
    ];

    const formatCurrency = (val) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(val);
    };

    return (
        <ModuleLayout currentModule="purchasing" breadcrumbs={crumbs}>
            <Head title="Raise Purchase Order" />

            {/* Header Block */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6 shadow-sm flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-gray-900">Raise Purchase Order (PO)</h1>
                    <p className="text-xs text-gray-500 mt-1">Create a vendor procurement request to replenish stock levels</p>
                </div>
                <Link
                    href={route('purchase-order.index')}
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 hover:bg-gray-50 text-xs font-semibold text-gray-600 rounded-lg transition-colors"
                >
                    <i className="ri-arrow-left-line" />
                    Back
                </Link>
            </div>

            {/* Wizard Steps indicator */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6 shadow-sm max-w-4xl">
                <div className="flex items-center justify-between relative max-w-xl mx-auto">
                    {/* Background Progress Bar */}
                    <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-150 -translate-y-1/2 z-0" />
                    <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-indigo-600 -translate-y-1/2 z-0 transition-all duration-300" style={{ width: `${(step - 1) * 50}%` }} />

                    {/* Step 1 Node */}
                    <div className="relative z-10 flex flex-col items-center gap-1">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                            step >= 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'
                        }`}>
                            1
                        </div>
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Vendor details</span>
                    </div>

                    {/* Step 2 Node */}
                    <div className="relative z-10 flex flex-col items-center gap-1">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                            step >= 2 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'
                        }`}>
                            2
                        </div>
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Add Items</span>
                    </div>

                    {/* Step 3 Node */}
                    <div className="relative z-10 flex flex-col items-center gap-1">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                            step >= 3 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'
                        }`}>
                            3
                        </div>
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Review & Save</span>
                    </div>
                </div>
            </div>

            {/* Error banners */}
            {Object.keys(errors).length > 0 && (
                <div className="bg-red-50 border border-red-150 border-red-100 text-red-800 px-4 py-3 rounded-lg shadow-sm mb-6 max-w-4xl">
                    <span className="text-xs font-bold block mb-1">Please correct the following errors:</span>
                    <ul className="list-disc pl-5 text-[11px] space-y-0.5 font-medium">
                        {Object.entries(errors).map(([key, val]) => (
                            <li key={key}>{val}</li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Form Wizard Container */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm max-w-4xl">
                
                {/* STEP 1: Select Supplier & Metadata */}
                {step === 1 && (
                    <div className="space-y-6">
                        <h3 className="text-sm font-bold text-gray-800 border-b border-gray-100 pb-2">Step 1: Select Supplier & Schedule</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-xs font-semibold text-gray-700 block mb-1">Select Supplier *</label>
                                <select
                                    value={data.supplier_id}
                                    onChange={(e) => setData('supplier_id', e.target.value)}
                                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none bg-white"
                                    required
                                >
                                    <option value="">Choose a Supplier</option>
                                    {suppliers.map((s) => (
                                        <option key={s.id} value={s.id}>{s.name} ({s.payment_terms || 'No terms'})</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-semibold text-gray-700 block mb-1">Order Date *</label>
                                    <input
                                        type="date"
                                        value={data.order_date}
                                        onChange={(e) => setData('order_date', e.target.value)}
                                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-700 block mb-1">Expected Date</label>
                                    <input
                                        type="date"
                                        value={data.expected_date}
                                        onChange={(e) => setData('expected_date', e.target.value)}
                                        min={data.order_date}
                                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                                    />
                                </div>
                            </div>

                            <div className="md:col-span-2">
                                <label className="text-xs font-semibold text-gray-700 block mb-1">Internal Notes / Instructions</label>
                                <textarea
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    rows="4"
                                    placeholder="Provide warehouse receipt instructions, shipping marks, or vendor agreements..."
                                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none resize-none"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 border-t border-gray-100 pt-4 mt-6">
                            <button
                                type="button"
                                onClick={() => {
                                    if (validateStep1()) setStep(2);
                                }}
                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-750 hover:bg-indigo-750 hover:bg-indigo-750 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1"
                            >
                                Continue to items
                                <i className="ri-arrow-right-line" />
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 2: Add Items */}
                {step === 2 && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                            <h3 className="text-sm font-bold text-gray-800">Step 2: Add Products & Costs</h3>
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
                                {data.items.map((item, idx) => (
                                    <div key={idx} className="flex gap-4 items-end bg-gray-50 p-4 rounded-xl border border-gray-100 relative">
                                        <div className="flex-1 min-w-[200px]">
                                            <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Product</label>
                                            <select
                                                value={item.product_id}
                                                onChange={(e) => handleItemChange(idx, 'product_id', e.target.value)}
                                                className="w-full px-3 py-1.5 text-xs border border-gray-250 border-gray-200 rounded-lg outline-none bg-white"
                                            >
                                                <option value="">Select Product</option>
                                                {products.map((p) => (
                                                    <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="w-28">
                                            <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Ordered Qty</label>
                                            <input
                                                type="number"
                                                min="1"
                                                value={item.ordered_qty}
                                                onChange={(e) => handleItemChange(idx, 'ordered_qty', e.target.value)}
                                                className="w-full px-3 py-1.5 text-xs border border-gray-250 border-gray-200 rounded-lg outline-none"
                                            />
                                        </div>

                                        <div className="w-32">
                                            <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Unit Cost ($)</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={item.unit_cost}
                                                onChange={(e) => handleItemChange(idx, 'unit_cost', e.target.value)}
                                                className="w-full px-3 py-1.5 text-xs border border-gray-250 border-gray-200 rounded-lg outline-none"
                                            />
                                        </div>

                                        <div className="w-24 text-right pr-2">
                                            <span className="text-[10px] font-bold text-gray-400 block mb-1">Line Total</span>
                                            <span className="text-xs font-extrabold text-gray-900">
                                                {formatCurrency(item.ordered_qty * item.unit_cost)}
                                            </span>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => handleRemoveProductRow(idx)}
                                            className="w-7 h-7 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors flex items-center justify-center absolute -top-1.5 -right-1.5 shadow-sm border border-red-100"
                                        >
                                            <i className="ri-delete-bin-line text-xs" />
                                        </button>
                                    </div>
                                ))}

                                <div className="p-4 border border-dashed border-gray-200 rounded-xl flex items-center justify-between bg-indigo-50/10">
                                    <span className="text-xs font-bold text-gray-500 uppercase">Estimated PO Total:</span>
                                    <span className="text-lg font-black text-indigo-600">{formatCurrency(getPOTotal())}</span>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-12 border-2 border-dashed border-gray-100 rounded-xl bg-gray-50/50">
                                <i className="ri-shopping-cart-2-line text-gray-300 text-3xl block mb-2" />
                                <span className="text-xs text-gray-400 block mb-4">No products added to this purchase order yet.</span>
                                <button
                                    type="button"
                                    onClick={handleAddProductRow}
                                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
                                >
                                    Add First Item Row
                                </button>
                            </div>
                        )}

                        <div className="flex justify-between gap-2 border-t border-gray-100 pt-4 mt-6">
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="px-4 py-2 border border-gray-200 hover:bg-gray-50 text-xs font-semibold text-gray-600 rounded-lg transition-colors flex items-center gap-1"
                            >
                                <i className="ri-arrow-left-line" />
                                Back to details
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    if (validateStep2()) setStep(3);
                                }}
                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1"
                            >
                                Review order
                                <i className="ri-arrow-right-line" />
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 3: Review PO Details */}
                {step === 3 && (
                    <div className="space-y-6 animate-fade-in">
                        <h3 className="text-sm font-bold text-gray-800 border-b border-gray-100 pb-2">Step 3: Review & Finalize</h3>
                        
                        <div className="bg-gray-50 border border-gray-100 p-5 rounded-xl text-xs grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <span className="text-gray-400 block mb-0.5">Supplier / Vendor:</span>
                                <span className="font-bold text-gray-800 text-sm">{selectedSupplier?.name}</span>
                            </div>
                            <div>
                                <span className="text-gray-400 block mb-0.5">Order Date & expected Date:</span>
                                <span className="font-semibold text-gray-800">
                                    {data.order_date} &rarr; {data.expected_date || 'No delivery target'}
                                </span>
                            </div>
                            <div className="md:col-span-2 pt-2 border-t border-gray-200/50">
                                <span className="text-gray-400 block mb-0.5">Internal notes / instructions:</span>
                                <span className="font-medium text-gray-600 italic block whitespace-pre-wrap">
                                    {data.notes || 'No notes listed.'}
                                </span>
                            </div>
                        </div>

                        {/* Review items table */}
                        <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
                            <table className="w-full text-sm text-left text-gray-600">
                                <thead className="text-[10px] font-bold text-gray-400 bg-gray-50 uppercase border-b border-gray-100">
                                    <tr>
                                        <th className="px-6 py-3">SKU</th>
                                        <th className="px-6 py-3">Product</th>
                                        <th className="px-6 py-3 text-center">Ordered Qty</th>
                                        <th className="px-6 py-3 text-right">Unit Cost</th>
                                        <th className="px-6 py-3 text-right">Line Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {data.items.map((item, idx) => (
                                        <tr key={idx}>
                                            <td className="px-6 py-3 text-xs font-mono text-gray-500">{item.sku}</td>
                                            <td className="px-6 py-3 font-semibold text-gray-900">{item.name}</td>
                                            <td className="px-6 py-3 text-center font-bold text-gray-800">{item.ordered_qty}</td>
                                            <td className="px-6 py-3 text-right text-gray-500">{formatCurrency(item.unit_cost)}</td>
                                            <td className="px-6 py-3 text-right font-bold text-gray-950">{formatCurrency(item.ordered_qty * item.unit_cost)}</td>
                                        </tr>
                                    ))}
                                    <tr className="bg-indigo-50/20 font-bold border-t-2 border-indigo-100">
                                        <td colSpan="4" className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wide">Total Order Cost:</td>
                                        <td className="px-6 py-4 text-right text-lg font-black text-indigo-600">{formatCurrency(getPOTotal())}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="flex justify-between gap-2 border-t border-gray-100 pt-4 mt-6">
                            <button
                                type="button"
                                onClick={() => setStep(2)}
                                className="px-4 py-2 border border-gray-200 hover:bg-gray-50 text-xs font-semibold text-gray-600 rounded-lg transition-colors flex items-center gap-1"
                            >
                                <i className="ri-arrow-left-line" />
                                Back to items
                            </button>
                            <button
                                type="button"
                                onClick={onSubmit}
                                disabled={processing}
                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5 disabled:opacity-50"
                            >
                                <i className="ri-file-check-line" />
                                Save & Raise Purchase Order
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </ModuleLayout>
    );
}
