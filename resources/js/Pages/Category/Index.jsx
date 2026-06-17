import React, { useState } from 'react';
import ModuleLayout from '@/Layouts/ModuleLayout';
import { Head, useForm, router, Link } from '@inertiajs/react';
import InputError from '@/Components/InputError';

export default function Index({ auth, categories, parentCategories, success, error }) {
    const { data, setData, post, put, reset, errors, processing } = useForm({
        name: '',
        description: '',
        parent_id: '',
    });

    const [editingCategory, setEditingCategory] = useState(null);

    const crumbs = [
        { title: 'Catalog', route: '/product' },
        { title: 'Categories' }
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingCategory) {
            put(route('category.update', editingCategory.id), {
                onSuccess: () => {
                    setEditingCategory(null);
                    reset();
                }
            });
        } else {
            post(route('category.store'), {
                onSuccess: () => reset()
            });
        }
    };

    const startEdit = (cat) => {
        setEditingCategory(cat);
        setData({
            name: cat.name,
            description: cat.description || '',
            parent_id: cat.parent_id || '',
        });
    };

    const cancelEdit = () => {
        setEditingCategory(null);
        reset();
    };

    const deleteCategory = (cat) => {
        if (!window.confirm(`Are you sure you want to delete category "${cat.name}"?`)) {
            return;
        }
        router.delete(route('category.destroy', cat.id));
    };

    return (
        <ModuleLayout currentModule="catalog" breadcrumbs={crumbs}>
            <Head title="Manage Categories" />

            {/* Notification Banners */}
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Categories Table (Left side) */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex items-center justify-between">
                        <div>
                            <h1 className="text-lg font-bold text-gray-900 font-display">Product Categories</h1>
                            <p className="text-xs text-gray-500 mt-0.5">Organize your inventory catalog with hierarchical tagging</p>
                        </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-600">
                                <thead className="text-[11px] font-bold text-gray-400 bg-gray-50 uppercase border-b border-gray-100">
                                    <tr>
                                        <th className="px-6 py-4">Category Name</th>
                                        <th className="px-6 py-4">Parent Category</th>
                                        <th className="px-6 py-4">Description</th>
                                        <th className="px-6 py-4 text-center">Products Count</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {categories.length > 0 ? (
                                        categories.map((cat) => (
                                            <tr key={cat.id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-6 py-4 font-semibold text-gray-800">
                                                    {cat.name}
                                                </td>
                                                <td className="px-6 py-4 text-gray-500 font-medium">
                                                    {cat.parent ? (
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] bg-indigo-50 text-indigo-700 font-bold">
                                                            {cat.parent.name}
                                                        </span>
                                                    ) : (
                                                        <span className="text-gray-400 text-xs">None (Root)</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-gray-500 text-xs max-w-xs truncate">
                                                    {cat.description || '-'}
                                                </td>
                                                <td className="px-6 py-4 text-center font-bold text-gray-800">
                                                    {cat.products_count}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={() => startEdit(cat)}
                                                            className="p-1.5 bg-indigo-55 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center justify-center"
                                                            title="Edit Category"
                                                        >
                                                            <i className="ri-edit-line text-sm" />
                                                        </button>
                                                        <button
                                                            onClick={() => deleteCategory(cat)}
                                                            className="p-1.5 bg-red-600 hover:bg-red-750 text-white hover:bg-red-700 rounded-lg transition-colors flex items-center justify-center"
                                                            title="Delete Category"
                                                        >
                                                            <i className="ri-delete-bin-line text-sm" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-12 text-center text-xs text-gray-400">
                                                No categories defined. Build your catalog using the form on the right.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Create/Edit form (Right side) */}
                <div>
                    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm sticky top-6">
                        <h2 className="text-sm font-bold text-gray-800 border-b border-gray-100 pb-3 mb-4 flex items-center gap-1.5">
                            <i className="ri-folder-add-line text-indigo-600 text-base" />
                            {editingCategory ? 'Edit Category' : 'Create New Category'}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="text-xs font-semibold text-gray-700 block mb-1">Category Name *</label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="e.g. Electrical, Plumbing, Tools"
                                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                                    required
                                />
                                <InputError message={errors.name} className="mt-1" />
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-gray-700 block mb-1">Parent Category (Optional)</label>
                                <select
                                    value={data.parent_id}
                                    onChange={(e) => setData('parent_id', e.target.value)}
                                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none bg-white"
                                >
                                    <option value="">None (Top-Level Category)</option>
                                    {parentCategories
                                        .filter(p => !editingCategory || p.id !== editingCategory.id)
                                        .map((p) => (
                                            <option key={p.id} value={p.id}>{p.name}</option>
                                        ))}
                                </select>
                                <InputError message={errors.parent_id} className="mt-1" />
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-gray-700 block mb-1">Description</label>
                                <textarea
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Enter category notes or specifications..."
                                    rows="4"
                                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none resize-none"
                                />
                                <InputError message={errors.description} className="mt-1" />
                            </div>

                            <div className="pt-2 flex gap-2">
                                {editingCategory && (
                                    <button
                                        type="button"
                                        onClick={cancelEdit}
                                        className="flex-1 px-4 py-2 border border-gray-200 hover:bg-gray-50 text-xs font-semibold text-gray-600 rounded-lg transition-colors"
                                    >
                                        Cancel
                                    </button>
                                )}
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors disabled:opacity-50"
                                >
                                    {editingCategory ? 'Update Category' : 'Save Category'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </ModuleLayout>
    );
}
