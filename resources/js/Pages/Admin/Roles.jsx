import React, { useState, useEffect } from 'react';
import ModuleLayout from '@/Layouts/ModuleLayout';
import { Head, useForm } from '@inertiajs/react';

export default function Roles({ auth, roles, modules, success }) {
    const [selectedRole, setSelectedRole] = useState(roles[0] || null);

    // Form state to sync permission inputs
    const { data, setData, post, processing } = useForm({
        permissions: [] // Array of { id, module, can_view, can_create, can_edit, can_delete }
    });

    useEffect(() => {
        if (selectedRole && selectedRole.permissions) {
            setData('permissions', selectedRole.permissions.map(p => ({
                id: p.id,
                module: p.module,
                can_view: !!p.can_view,
                can_create: !!p.can_create,
                can_edit: !!p.can_edit,
                can_delete: !!p.can_delete,
            })));
        }
    }, [selectedRole]);

    const handleCheckboxChange = (idx, field, checked) => {
        const updated = [...data.permissions];
        updated[idx][field] = checked;
        setData('permissions', updated);
    };

    const onSubmit = (e) => {
        e.preventDefault();
        post(route('admin.roles.save'), {
            onSuccess: () => {
                alert('Permissions matrix updated successfully.');
            }
        });
    };

    const crumbs = [
        { title: 'Admin Settings', route: '/user' },
        { title: 'Roles & Access Control' }
    ];

    return (
        <ModuleLayout currentModule="admin" breadcrumbs={crumbs}>
            <Head title="Roles & Permissions Matrix" />

            {/* Notification Banner */}
            {success && (
                <div className="bg-emerald-500 text-white px-4 py-3 rounded-lg shadow-sm mb-6 flex items-center gap-2">
                    <i className="ri-checkbox-circle-line text-lg" />
                    <span className="text-sm font-medium">{success}</span>
                </div>
            )}

            {/* Split layout: Roles sidebar + Permissions table */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                
                {/* Left panel: Roles list selector */}
                <div className="lg:col-span-1 space-y-4">
                    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-3">Roles / Groups</span>
                        <div className="space-y-1">
                            {roles.map((r) => {
                                const isSelected = selectedRole?.id === r.id;
                                return (
                                    <button
                                        key={r.id}
                                        onClick={() => setSelectedRole(r)}
                                        className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-colors flex items-center justify-between ${
                                            isSelected
                                                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100'
                                                : 'text-gray-650 text-gray-600 hover:bg-indigo-50 hover:text-indigo-650'
                                        }`}
                                    >
                                        <span>{r.name}</span>
                                        <i className="ri-arrow-right-s-line text-base opacity-70" />
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Right panel: Permissions checklist grid */}
                <div className="lg:col-span-3">
                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                            <div>
                                <h2 className="text-sm font-bold text-gray-900 font-display">Permissions Matrix &bull; {selectedRole?.name}</h2>
                                <p className="text-[11px] text-gray-550 text-gray-500 mt-0.5">Control view, create, edit, and delete capabilities by functional module</p>
                            </div>
                        </div>

                        <form onSubmit={onSubmit}>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left text-gray-600">
                                    <thead className="text-[10px] font-bold text-gray-400 bg-gray-50 uppercase border-b border-gray-100 select-none">
                                        <tr>
                                            <th className="px-6 py-4">Module Name</th>
                                            <th className="px-6 py-4 text-center">View Allowed</th>
                                            <th className="px-6 py-4 text-center">Create Allowed</th>
                                            <th className="px-6 py-4 text-center">Edit Allowed</th>
                                            <th className="px-6 py-4 text-center">Delete Allowed</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {data.permissions.map((perm, idx) => (
                                            <tr key={perm.id} className="hover:bg-gray-50/50 transition-colors">
                                                {/* Module Slug */}
                                                <td className="px-6 py-4 font-bold text-gray-800 uppercase text-xs tracking-wide">
                                                    {perm.module}
                                                </td>

                                                {/* View Checkbox */}
                                                <td className="px-6 py-4 text-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={perm.can_view}
                                                        onChange={(e) => handleCheckboxChange(idx, 'can_view', e.target.checked)}
                                                        className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-gray-300 transition-shadow"
                                                    />
                                                </td>

                                                {/* Create Checkbox */}
                                                <td className="px-6 py-4 text-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={perm.can_create}
                                                        onChange={(e) => handleCheckboxChange(idx, 'can_create', e.target.checked)}
                                                        className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-gray-300 transition-shadow"
                                                    />
                                                </td>

                                                {/* Edit Checkbox */}
                                                <td className="px-6 py-4 text-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={perm.can_edit}
                                                        onChange={(e) => handleCheckboxChange(idx, 'can_edit', e.target.checked)}
                                                        className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-gray-300 transition-shadow"
                                                    />
                                                </td>

                                                {/* Delete Checkbox */}
                                                <td className="px-6 py-4 text-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={perm.can_delete}
                                                        onChange={(e) => handleCheckboxChange(idx, 'can_delete', e.target.checked)}
                                                        className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-gray-300 transition-shadow"
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors disabled:opacity-50 flex items-center gap-1.5"
                                >
                                    <i className="ri-save-line" />
                                    Save Permissions Matrix
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

            </div>
        </ModuleLayout>
    );
}
