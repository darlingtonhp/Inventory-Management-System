import React, { useState } from 'react';
import ModuleLayout from '@/Layouts/ModuleLayout';
import { Head } from '@inertiajs/react';
import axios from 'axios';

export default function Index({ auth, categories, suppliers, users }) {
    const [reportType, setReportType] = useState('stock_summary');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [supplierId, setSupplierId] = useState('');
    const [userId, setUserId] = useState('');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState(null);

    const crumbs = [
        { title: 'Reports', route: '/report' },
        { title: 'Reports Selector' }
    ];

    const formatCurrency = (val) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(val);
    };

    const runReport = (e) => {
        e.preventDefault();
        setLoading(true);
        setResults(null);

        axios.get(route('report.run'), {
            params: {
                type: reportType,
                start_date: startDate,
                end_date: endDate,
                category_id: categoryId,
                supplier_id: supplierId,
                user_id: userId,
            }
        })
        .then(response => {
            setResults(response.data.results || []);
        })
        .catch(err => {
            console.error(err);
            alert('Failed to generate report. Please verify inputs.');
        })
        .finally(() => {
            setLoading(false);
        });
    };

    const printReport = () => {
        window.print();
    };

    // Columns structure based on report type
    const getReportColumns = () => {
        switch (reportType) {
            case 'stock_summary':
                return ['SKU Code', 'Product Name', 'Category', 'On Hand Qty', 'Reserved Qty', 'Status'];
            case 'stock_movement':
                return ['Timestamp', 'SKU Code', 'Product Name', 'Movement Type', 'Qty Shift', 'Operator', 'Notes'];
            case 'low_stock':
                return ['SKU Code', 'Product Name', 'Category', 'On Hand Qty', 'Reorder Threshold', 'Status'];
            case 'purchase_order':
                return ['PO Reference', 'Supplier / Vendor', 'Order Date', 'Creator Name', 'Status'];
            case 'sales_order':
                return ['SO Reference', 'Customer Name', 'Order Date', 'Creator Name', 'Status'];
            case 'inventory_valuation':
                return ['SKU Code', 'Product Name', 'Qty On Hand', 'Cost Price', 'Selling Price', 'Valuation (Cost)', 'Valuation (Retail)'];
            case 'audit_log':
                return ['Timestamp', 'User', 'Action Activity', 'Module Type', 'Target ID', 'IP Address'];
            default:
                return [];
        }
    };

    const getReportTitle = () => {
        const titles = {
            stock_summary: 'Stock Status Summary Report',
            stock_movement: 'Warehouse Stock Movements Ledger Report',
            low_stock: 'Critical Low Stock Level Alerts Report',
            purchase_order: 'Procurement Purchase Orders Audit Report',
            sales_order: 'Sales Orders Reconciliation Report',
            inventory_valuation: 'Warehouse Inventory Asset Valuation Report',
            audit_log: 'System Audit Security logs Report'
        };
        return titles[reportType] || 'System Report';
    };

    return (
        <ModuleLayout currentModule="reports" breadcrumbs={crumbs}>
            <Head title="System Reports Manager" />

            {/* Print styles override */}
            <style dangerouslySetInnerHTML={{__html: `
                @media print {
                    aside, header, nav, footer, .no-print {
                        display: none !important;
                    }
                    main {
                        padding: 0 !important;
                        margin: 0 !important;
                    }
                    body {
                        background-color: white !important;
                    }
                    .print-container {
                        border: none !important;
                        box-shadow: none !important;
                        padding: 0 !important;
                    }
                }
            `}} />

            {/* Selector and Filters Form (HIDDEN DURING PRINT) */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6 shadow-sm no-print">
                <form onSubmit={runReport} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Report Type */}
                        <div>
                            <label className="text-xs font-semibold text-gray-500 block mb-1">Select Report Type *</label>
                            <select
                                value={reportType}
                                onChange={(e) => {
                                    setReportType(e.target.value);
                                    setResults(null);
                                }}
                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-indigo-500 outline-none bg-white font-semibold"
                                required
                            >
                                <option value="stock_summary">Stock Status Summary</option>
                                <option value="stock_movement">Warehouse Movements Ledger</option>
                                <option value="low_stock">Low Stock Alerts</option>
                                <option value="purchase_order">Purchase Orders Register</option>
                                <option value="sales_order">Sales Orders Register</option>
                                <option value="inventory_valuation">Asset Valuation Ledger</option>
                                <option value="audit_log">System Audit Logs</option>
                            </select>
                        </div>

                        {/* Date Filters (Relevant for movements, POs, SOs, audit logs) */}
                        {['stock_movement', 'purchase_order', 'sales_order', 'audit_log'].includes(reportType) && (
                            <>
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 block mb-1">Start Date</label>
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-indigo-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 block mb-1">End Date</label>
                                    <input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-indigo-500 outline-none"
                                    />
                                </div>
                            </>
                        )}

                        {/* Category Filter (Relevant for stock summary and valuation) */}
                        {['stock_summary', 'inventory_valuation'].includes(reportType) && (
                            <div>
                                <label className="text-xs font-semibold text-gray-500 block mb-1">Category Filter</label>
                                <select
                                    value={categoryId}
                                    onChange={(e) => setCategoryId(e.target.value)}
                                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-indigo-500 outline-none bg-white"
                                >
                                    <option value="">All Categories</option>
                                    {categories.map((c) => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Supplier Filter (Relevant for POs) */}
                        {reportType === 'purchase_order' && (
                            <div>
                                <label className="text-xs font-semibold text-gray-500 block mb-1">Supplier Filter</label>
                                <select
                                    value={supplierId}
                                    onChange={(e) => setSupplierId(e.target.value)}
                                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-indigo-500 outline-none bg-white"
                                >
                                    <option value="">All Suppliers</option>
                                    {suppliers.map((s) => (
                                        <option key={s.id} value={s.id}>{s.name}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* User / operator Filter (Relevant for movements, audit logs) */}
                        {['stock_movement', 'audit_log'].includes(reportType) && (
                            <div>
                                <label className="text-xs font-semibold text-gray-500 block mb-1">operator / User Filter</label>
                                <select
                                    value={userId}
                                    onChange={(e) => setUserId(e.target.value)}
                                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-indigo-500 outline-none bg-white"
                                >
                                    <option value="">All Users</option>
                                    {users.map((u) => (
                                        <option key={u.id} value={u.id}>{u.name}</option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5 disabled:opacity-50"
                        >
                            {loading ? (
                                <i className="ri-loader-4-line animate-spin" />
                            ) : (
                                <i className="ri-play-line" />
                            )}
                            Run Report Query
                        </button>
                    </div>
                </form>
            </div>

            {/* RESULTS VIEW */}
            {results !== null ? (
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm print-container">
                    {/* Report header meta */}
                    <div className="p-6 border-b border-gray-100 flex items-center justify-between flex-wrap gap-4">
                        <div>
                            <h2 className="text-lg font-bold text-gray-950 font-display">{getReportTitle()}</h2>
                            <p className="text-xs text-gray-500 mt-1">
                                Generated on: {new Date().toLocaleString()} &bull; Operator: {auth?.user?.name || 'System Admin'}
                            </p>
                        </div>
                        <div className="flex gap-2 no-print">
                            <button
                                onClick={printReport}
                                className="px-3.5 py-2 border border-gray-250 border-gray-200 hover:bg-gray-50 text-gray-750 text-gray-600 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
                            >
                                <i className="ri-printer-line" />
                                Print Report
                            </button>
                        </div>
                    </div>

                    {/* Report details table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-600">
                            <thead className="text-[11px] font-bold text-gray-400 bg-gray-50 uppercase border-b border-gray-100">
                                <tr>
                                    {getReportColumns().map((col, idx) => (
                                        <th key={idx} className="px-6 py-3.5">{col}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-150 divide-gray-100 text-xs">
                                {results.length > 0 ? (
                                    results.map((row, idx) => {
                                        // Render rows dynamically based on the report type
                                        if (reportType === 'stock_summary') {
                                            return (
                                                <tr key={idx} className="hover:bg-gray-50/20 font-medium">
                                                    <td className="px-6 py-3 font-mono font-bold text-gray-800">{row.sku}</td>
                                                    <td className="px-6 py-3 font-bold text-gray-900">{row.name}</td>
                                                    <td className="px-6 py-3 text-gray-500">{row.category || '-'}</td>
                                                    <td className="px-6 py-3 font-bold text-gray-800">{row.qty_on_hand}</td>
                                                    <td className="px-6 py-3 text-gray-500">{row.qty_reserved}</td>
                                                    <td className="px-6 py-3"><span className="text-[10px] font-bold uppercase">{row.status}</span></td>
                                                </tr>
                                            );
                                        }
                                        if (reportType === 'stock_movement') {
                                            return (
                                                <tr key={idx} className="hover:bg-gray-50/20 font-medium">
                                                    <td className="px-6 py-3 text-gray-500 whitespace-nowrap">{row.date}</td>
                                                    <td className="px-6 py-3 font-mono font-bold text-gray-800">{row.sku}</td>
                                                    <td className="px-6 py-3 font-bold text-gray-900">{row.product}</td>
                                                    <td className="px-6 py-3">
                                                        <span className={`inline-flex px-1.5 py-0.5 rounded-full text-[9px] font-bold ${
                                                            row.type === 'Stock In' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                                                        }`}>{row.type}</span>
                                                    </td>
                                                    <td className={`px-6 py-3 font-bold text-center ${row.qty > 0 ? 'text-emerald-600' : 'text-amber-600'}`}>
                                                        {row.qty > 0 ? `+${row.qty}` : row.qty}
                                                    </td>
                                                    <td className="px-6 py-3 text-gray-700 font-semibold">{row.operator}</td>
                                                    <td className="px-6 py-3 text-gray-500 max-w-xs truncate">{row.notes}</td>
                                                </tr>
                                            );
                                        }
                                        if (reportType === 'low_stock') {
                                            return (
                                                <tr key={idx} className="hover:bg-gray-50/20 font-medium bg-amber-50/10">
                                                    <td className="px-6 py-3 font-mono font-bold text-amber-700">{row.sku}</td>
                                                    <td className="px-6 py-3 font-bold text-gray-900">{row.name}</td>
                                                    <td className="px-6 py-3 text-gray-500">{row.category || '-'}</td>
                                                    <td className="px-6 py-3 font-black text-amber-600">{row.qty_on_hand}</td>
                                                    <td className="px-6 py-3 font-bold text-gray-800">{row.reorder_level}</td>
                                                    <td className="px-6 py-3"><span className="text-[10px] font-bold text-amber-700 uppercase">{row.status}</span></td>
                                                </tr>
                                            );
                                        }
                                        if (reportType === 'purchase_order') {
                                            return (
                                                <tr key={idx} className="hover:bg-gray-50/20 font-medium">
                                                    <td className="px-6 py-3 font-mono font-bold text-gray-900">{row.ref}</td>
                                                    <td className="px-6 py-3 font-bold text-gray-900">{row.supplier}</td>
                                                    <td className="px-6 py-3 text-gray-500 whitespace-nowrap">{row.date}</td>
                                                    <td className="px-6 py-3 text-gray-700">{row.created_by}</td>
                                                    <td className="px-6 py-3"><span className="text-[10px] font-bold uppercase">{row.status}</span></td>
                                                </tr>
                                            );
                                        }
                                        if (reportType === 'sales_order') {
                                            return (
                                                <tr key={idx} className="hover:bg-gray-50/20 font-medium">
                                                    <td className="px-6 py-3 font-mono font-bold text-gray-900">{row.ref}</td>
                                                    <td className="px-6 py-3 font-bold text-gray-900">{row.client}</td>
                                                    <td className="px-6 py-3 text-gray-500 whitespace-nowrap">{row.date}</td>
                                                    <td className="px-6 py-3 text-gray-700">{row.created_by}</td>
                                                    <td className="px-6 py-3"><span className="text-[10px] font-bold uppercase">{row.status}</span></td>
                                                </tr>
                                            );
                                        }
                                        if (reportType === 'inventory_valuation') {
                                            return (
                                                <tr key={idx} className="hover:bg-gray-50/20 font-medium">
                                                    <td className="px-6 py-3 font-mono font-bold text-gray-800">{row.sku}</td>
                                                    <td className="px-6 py-3 font-bold text-gray-900">{row.name}</td>
                                                    <td className="px-6 py-3 font-bold text-gray-800">{row.qty}</td>
                                                    <td className="px-6 py-3 text-gray-500">{formatCurrency(row.cost)}</td>
                                                    <td className="px-6 py-3 text-gray-500">{formatCurrency(row.selling)}</td>
                                                    <td className="px-6 py-3 font-bold text-indigo-650 text-indigo-600">{formatCurrency(row.valuation_cost)}</td>
                                                    <td className="px-6 py-3 font-black text-gray-900">{formatCurrency(row.valuation_selling)}</td>
                                                </tr>
                                            );
                                        }
                                        if (reportType === 'audit_log') {
                                            return (
                                                <tr key={idx} className="hover:bg-gray-50/20 font-medium">
                                                    <td className="px-6 py-3 text-gray-500 whitespace-nowrap">{row.date}</td>
                                                    <td className="px-6 py-3 font-bold text-gray-900">{row.user}</td>
                                                    <td className="px-6 py-3 text-gray-700 font-semibold">{row.action}</td>
                                                    <td className="px-6 py-3 text-gray-500">{row.type}</td>
                                                    <td className="px-6 py-3 font-mono text-gray-800">{row.id}</td>
                                                    <td className="px-6 py-3 text-gray-500 font-semibold">{row.ip}</td>
                                                </tr>
                                            );
                                        }
                                        return null;
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="20" className="px-6 py-12 text-center text-xs text-gray-400">
                                            No record matches found inside the selected date range.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="bg-white border border-gray-200 border-dashed rounded-xl p-12 text-center text-xs text-gray-400 shadow-sm no-print">
                    <i className="ri-file-chart-line text-4xl block mb-2 text-gray-300" />
                    Select a report configuration and filter parameters above, then click "Run Report Query".
                </div>
            )}
        </ModuleLayout>
    );
}
