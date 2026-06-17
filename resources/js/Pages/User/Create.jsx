import React from 'react';
import ModuleLayout from '@/Layouts/ModuleLayout';
import InputError from '@/Components/InputError';
import { Head, useForm, Link } from '@inertiajs/react';

export default function Create({ auth, roles }) {
    const { data, setData, post, errors, processing } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role_id: '',
        is_active: '1'
    });

    const onSubmit = (e) => {
        e.preventDefault();
        post(route('user.store'));
    };

    const crumbs = [
        { title: 'Admin Settings', route: '/user' },
        { title: 'Users Directory', route: '/user' },
        { title: 'Add User' }
    ];

    return (
        <ModuleLayout currentModule="admin" breadcrumbs={crumbs}>
            <Head title="Add System User" />

            {/* Header Block */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6 shadow-sm flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-gray-900">Add New Operator</h1>
                    <p className="text-xs text-gray-500 mt-1">Register a new system user and configure security levels</p>
                </div>
                <Link
                    href={route('user.index')}
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 hover:bg-gray-50 text-xs font-semibold text-gray-600 rounded-lg transition-colors"
                >
                    <i className="ri-arrow-left-line" />
                    Back
                </Link>
            </div>

            {/* Form card */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm max-w-2xl">
                <form onSubmit={onSubmit} className="space-y-4">
                    <div>
                        <label className="text-xs font-semibold text-gray-700 block mb-1">Full Name *</label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-indigo-500 outline-none"
                            required
                        />
                        <InputError message={errors.name} className="mt-1" />
                    </div>

                    <div>
                        <label className="text-xs font-semibold text-gray-700 block mb-1">Email Address *</label>
                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-indigo-500 outline-none"
                            required
                        />
                        <InputError message={errors.email} className="mt-1" />
                    </div>

                    <div>
                        <label className="text-xs font-semibold text-gray-700 block mb-1">Role Permissions Group *</label>
                        <select
                            value={data.role_id}
                            onChange={(e) => setData('role_id', e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-indigo-500 outline-none bg-white"
                            required
                        >
                            <option value="">Select a Role Group</option>
                            {roles.map((r) => (
                                <option key={r.id} value={r.id}>{r.name}</option>
                            ))}
                        </select>
                        <InputError message={errors.role_id} className="mt-1" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-semibold text-gray-700 block mb-1">Account Password *</label>
                            <input
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-indigo-500 outline-none"
                                required
                            />
                            <InputError message={errors.password} className="mt-1" />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-700 block mb-1">Confirm Password *</label>
                            <input
                                type="password"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-indigo-500 outline-none"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-semibold text-gray-700 block mb-1">Status Activation *</label>
                        <select
                            value={data.is_active}
                            onChange={(e) => setData('is_active', e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-indigo-500 outline-none bg-white"
                            required
                        >
                            <option value="1">Active (Permit login access)</option>
                            <option value="0">Deactivated (Block login access)</option>
                        </select>
                        <InputError message={errors.is_active} className="mt-1" />
                    </div>

                    <div className="flex justify-end gap-2 border-t border-gray-100 pt-4 mt-6">
                        <Link
                            href={route('user.index')}
                            className="px-4 py-2 border border-gray-200 hover:bg-gray-50 text-xs font-semibold text-gray-600 rounded-lg transition-colors"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors disabled:opacity-50"
                        >
                            Create Operator
                        </button>
                    </div>
                </form>
            </div>
        </ModuleLayout>
    );
}
