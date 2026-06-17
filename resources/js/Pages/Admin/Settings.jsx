import React from 'react';
import ModuleLayout from '@/Layouts/ModuleLayout';
import { Head, useForm } from '@inertiajs/react';

export default function Settings({ auth, settings, success }) {
    // Sync default keys with form state
    const { data, setData, post, processing } = useForm({
        company_name: settings.company_name || 'Smart Inventory Ltd',
        currency: settings.currency || 'USD',
        date_format: settings.date_format || 'Y-m-d',
        timezone: settings.timezone || 'UTC',
        default_reorder_level: settings.default_reorder_level || '15',
    });

    const onSubmit = (e) => {
        e.preventDefault();
        post(route('admin.settings.save'), {
            onSuccess: () => {
                alert('System settings updated successfully.');
            }
        });
    };

    const crumbs = [
        { title: 'Admin Settings', route: '/user' },
        { title: 'Global Configurations' }
    ];

    return (
        <ModuleLayout currentModule="admin" breadcrumbs={crumbs}>
            <Head title="Global Configurations" />

            {/* Notification Banner */}
            {success && (
                <div className="bg-emerald-500 text-white px-4 py-3 rounded-lg shadow-sm mb-6 flex items-center gap-2">
                    <i className="ri-checkbox-circle-line text-lg" />
                    <span className="text-sm font-medium">{success}</span>
                </div>
            )}

            {/* Configs form */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm max-w-2xl">
                <h3 className="text-sm font-bold text-gray-800 border-b border-gray-100 pb-3 mb-5 flex items-center gap-1.5 font-display">
                    <i className="ri-settings-4-line text-indigo-600 text-base" />
                    System Preferences
                </h3>

                <form onSubmit={onSubmit} className="space-y-4">
                    <div>
                        <label className="text-xs font-semibold text-gray-700 block mb-1">Company / Organization Name *</label>
                        <input
                            type="text"
                            value={data.company_name}
                            onChange={(e) => setData('company_name', e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-indigo-500 outline-none"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-semibold text-gray-700 block mb-1">System Base Currency *</label>
                            <select
                                value={data.currency}
                                onChange={(e) => setData('currency', e.target.value)}
                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-indigo-500 outline-none bg-white font-medium"
                                required
                            >
                                <option value="USD">USD ($) - US Dollar</option>
                                <option value="ZWG">ZWG - Zimbabwe Gold</option>
                                <option value="ZWL">ZWL - Zimbabwe Dollar</option>
                                <option value="EUR">EUR (€) - Euro</option>
                                <option value="GBP">GBP (£) - British Pound</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-700 block mb-1">Global Default Reorder Alert Threshold *</label>
                            <input
                                type="number"
                                value={data.default_reorder_level}
                                onChange={(e) => setData('default_reorder_level', e.target.value)}
                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-indigo-500 outline-none"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-semibold text-gray-700 block mb-1">System Display Date Format *</label>
                            <select
                                value={data.date_format}
                                onChange={(e) => setData('date_format', e.target.value)}
                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-indigo-500 outline-none bg-white font-medium"
                                required
                            >
                                <option value="Y-m-d">YYYY-MM-DD (e.g. 2026-06-17)</option>
                                <option value="d/m/Y">DD/MM/YYYY (e.g. 17/06/2026)</option>
                                <option value="m-d-Y">MM-DD-YYYY (e.g. 06-17-2026)</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-700 block mb-1">System Base Timezone *</label>
                            <select
                                value={data.timezone}
                                onChange={(e) => setData('timezone', e.target.value)}
                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-indigo-500 outline-none bg-white font-medium"
                                required
                            >
                                <option value="UTC">UTC / Greenwich Mean Time</option>
                                <option value="Africa/Harare">Africa/Harare (ZAST - GMT+2)</option>
                                <option value="Africa/Johannesburg">Africa/Johannesburg (GMT+2)</option>
                                <option value="America/New_York">America/New_York (EST/EDT)</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-end border-t border-gray-100 pt-4 mt-6">
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors disabled:opacity-50 flex items-center gap-1.5"
                        >
                            <i className="ri-save-line" />
                            Save Configuration Preferences
                        </button>
                    </div>
                </form>
            </div>
        </ModuleLayout>
    );
}
