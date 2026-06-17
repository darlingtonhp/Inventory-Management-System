import React, { useState } from 'react';
import ModuleLayout from '@/Layouts/ModuleLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Index({ auth, suppliers, success }) {
    const crumbs = [
        { title: 'Suppliers', route: '/supplier' }
    ];

    const deleteSupplier = (supplier) => {
        if (!window.confirm(`Are you sure you want to delete supplier "${supplier.name}"?`)) {
            return;
        }
        router.delete(route('supplier.destroy', supplier.id));
    };

    return (
        <ModuleLayout currentModule="suppliers" breadcrumbs={crumbs}>
            <Head title="Suppliers Directory" />

            {/* Success message banner */}
            {success && (
                <div className="bg-emerald-500 text-white px-4 py-3 rounded-lg shadow-sm mb-6 flex items-center gap-2">
                    <i className="ri-checkbox-circle-line text-lg" />
                    <span className="text-sm font-medium">{success}</span>
                </div>
            )}

            {/* Header Block */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6 shadow-sm flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h1 className="text-xl font-bold text-gray-900 font-display">Suppliers Registry</h1>
                    <p className="text-xs text-gray-500 mt-1">Manage vendor contact profiles, payment terms, and product associations</p>
                </div>
                <Link
                    href={route('supplier.create')}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
                >
                    <i className="ri-user-add-line" />
                    Add Supplier
                </Link>
            </div>

            {/* Suppliers Grid or Table */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-600">
                        <thead className="text-[11px] font-bold text-gray-400 bg-gray-50 uppercase border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4">Supplier Name</th>
                                <th className="px-6 py-4">Contact Representative</th>
                                <th className="px-6 py-4">Email</th>
                                <th className="px-6 py-4">Phone</th>
                                <th className="px-6 py-4">Payment Terms</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {suppliers.length > 0 ? (
                                suppliers.map((supplier) => (
                                    <tr key={supplier.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <Link href={route('supplier.show', supplier.id)} className="font-semibold text-gray-900 hover:text-indigo-600 transition-colors block">
                                                {supplier.name}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4 text-gray-700 font-medium">
                                            {supplier.contact_person || '-'}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 text-xs">
                                            {supplier.email || '-'}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 text-xs">
                                            {supplier.phone || '-'}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 text-xs font-semibold">
                                            {supplier.payment_terms || '-'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                                supplier.is_active ? 'bg-indigo-50 text-indigo-700' : 'bg-gray-100 text-gray-650 text-gray-605 text-gray-600'
                                            }`}>
                                                {supplier.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link
                                                    href={route('supplier.show', supplier.id)}
                                                    className="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center justify-center"
                                                    title="View Profile"
                                                >
                                                    <i className="ri-eye-line text-sm" />
                                                </Link>
                                                <Link
                                                    href={route('supplier.edit', supplier.id)}
                                                    className="p-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center justify-center"
                                                    title="Edit Supplier"
                                                >
                                                    <i className="ri-edit-line text-sm" />
                                                </Link>
                                                <button
                                                    onClick={() => deleteSupplier(supplier)}
                                                    className="p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center justify-center"
                                                    title="Delete Supplier"
                                                >
                                                    <i className="ri-delete-bin-line text-sm" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="px-6 py-12 text-center text-xs text-gray-400">
                                        No suppliers registered. Click the button above to register one.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </ModuleLayout>
    );
}
