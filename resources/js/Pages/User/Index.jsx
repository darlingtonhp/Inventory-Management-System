import React, { useState } from 'react';
import ModuleLayout from '@/Layouts/ModuleLayout';
import Pagination from '@/Components/Pagination';
import { Head, Link, router } from '@inertiajs/react';

export default function Index({ auth, users, roles, queryParams = null, success, error }) {
    queryParams = queryParams || {};
    const [search, setSearch] = useState(queryParams.name || '');
    const [roleId, setRoleId] = useState(queryParams.role_id || '');
    const [activeMenuId, setActiveMenuId] = useState(null);

    const crumbs = [
        { title: 'Admin Settings', route: '/user' },
        { title: 'Users Directory' }
    ];

    const handleFilterChange = (name, value) => {
        if (value) {
            queryParams[name] = value;
        } else {
            delete queryParams[name];
        }
        router.get(route('user.index'), queryParams);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        handleFilterChange('name', search);
    };

    const deleteUser = (user) => {
        if (auth.user.id === user.id) {
            alert("You cannot delete your own profile.");
            return;
        }
        if (!window.confirm(`Are you sure you want to delete user ${user.name}?`)) {
            return;
        }
        router.delete(route('user.destroy', user.id));
    };

    return (
        <ModuleLayout currentModule="admin" breadcrumbs={crumbs}>
            <Head title="Users Directory" />

            {/* Success and Error banners */}
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

            {/* Toolbar filter panel */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6 shadow-sm">
                <form onSubmit={handleSearchSubmit} className="flex flex-wrap items-end gap-4">
                    {/* Search by Name */}
                    <div className="flex-1 min-w-[240px]">
                        <label className="text-xs font-semibold text-gray-500 block mb-1">Search User</label>
                        <div className="relative">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by name, email..."
                                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:border-indigo-500 outline-none"
                            />
                            <i className="ri-search-line text-gray-400 absolute left-3 top-2.5 text-base" />
                        </div>
                    </div>

                    {/* Role Filter */}
                    <div className="w-48">
                        <label className="text-xs font-semibold text-gray-500 block mb-1">Role Type</label>
                        <select
                            value={roleId}
                            onChange={(e) => {
                                setRoleId(e.target.value);
                                handleFilterChange('role_id', e.target.value);
                            }}
                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-indigo-500 outline-none bg-white font-medium"
                        >
                            <option value="">All Roles</option>
                            {roles.map((r) => (
                                <option key={r.id} value={r.id}>{r.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <Link
                            href={route('user.create')}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-775 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
                        >
                            <i className="ri-user-add-line" />
                            Add User
                        </Link>
                    </div>
                </form>
            </div>

            {/* Users Table */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-600">
                        <thead className="text-[11px] font-bold text-gray-400 bg-gray-50 uppercase border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4">User Name</th>
                                <th className="px-6 py-4">Email Address</th>
                                <th className="px-6 py-4">Role Permission</th>
                                <th className="px-6 py-4">Created Date</th>
                                <th className="px-6 py-4 text-center">Status</th>
                                <th className="px-6 py-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                            {users.data.length > 0 ? (
                                users.data.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 font-bold text-gray-900">{user.name}</td>
                                        <td className="px-6 py-4 text-gray-500 text-xs">{user.email}</td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 uppercase">
                                                {user.role_name}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 text-xs">{user.created_at}</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                                user.is_active ? 'bg-indigo-50 text-indigo-700' : 'bg-gray-100 text-gray-550 text-gray-600'
                                            }`}>
                                                {user.is_active ? 'Active' : 'Deactivated'}
                                            </span>
                                        </td>
                                        
                                        {/* Actions dropdown */}
                                        <td className="px-6 py-4 text-center relative">
                                            <button
                                                onClick={() => setActiveMenuId(activeMenuId === user.id ? null : user.id)}
                                                className="w-8 h-8 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white inline-flex items-center justify-center shadow-sm transition-colors focus:outline-none"
                                            >
                                                <i className="ri-more-fill text-lg" />
                                            </button>

                                            {activeMenuId === user.id && (
                                                <>
                                                    <div className="fixed inset-0 z-40" onClick={() => setActiveMenuId(null)} />
                                                    <div className="absolute right-6 mt-1 w-32 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50 text-left">
                                                        <Link
                                                            href={route('user.edit', user.id)}
                                                            className="flex items-center gap-2 px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50 transition-colors"
                                                        >
                                                            <i className="ri-edit-line text-gray-400" />
                                                            Edit User
                                                        </Link>
                                                        {auth.user.id !== user.id && (
                                                            <button
                                                                onClick={() => {
                                                                    setActiveMenuId(null);
                                                                    deleteUser(user);
                                                                }}
                                                                className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-red-650 text-red-600 hover:bg-red-50 text-left transition-colors"
                                                            >
                                                                <i className="ri-delete-bin-line" />
                                                                Delete
                                                            </button>
                                                        )}
                                                    </div>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-xs text-gray-400">
                                        No users matching active filters.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Table Footer */}
                {users.meta && (
                    <div className="p-5 border-t border-gray-100 flex items-center justify-between flex-wrap gap-4">
                        <span className="text-xs text-gray-500 font-semibold">
                            Showing {users.meta.from || 0} to {users.meta.to || 0} of {users.meta.total || 0} entries
                        </span>
                        <Pagination links={users.meta.links} />
                    </div>
                )}
            </div>
        </ModuleLayout>
    );
}
