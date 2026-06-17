import React from 'react';
import ModuleLayout from '@/Layouts/ModuleLayout';
import Pagination from '@/Components/Pagination';
import { Head } from '@inertiajs/react';

export default function AuditLogs({ auth, logs }) {
    const crumbs = [
        { title: 'Admin Settings', route: '/user' },
        { title: 'System Audit Logs' }
    ];

    return (
        <ModuleLayout currentModule="admin" breadcrumbs={crumbs}>
            <Head title="System Audit Logs" />

            <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6 shadow-sm">
                <h1 className="text-xl font-bold text-gray-900 font-display">System Audit Security Trail</h1>
                <p className="text-xs text-gray-500 mt-1">Real-time ledger recording user activities, record mutations, and configuration shifts</p>
            </div>

            {/* Audit Logs Table Card */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-600">
                        <thead className="text-[11px] font-bold text-gray-400 bg-gray-50 uppercase border-b border-gray-100 select-none">
                            <tr>
                                <th className="px-6 py-4">Timestamp</th>
                                <th className="px-6 py-4">Operator User</th>
                                <th className="px-6 py-4">Action Activity</th>
                                <th className="px-6 py-4">Module Type</th>
                                <th className="px-6 py-4 text-center">Target ID</th>
                                <th className="px-6 py-4">IP Address</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                            {logs.data.length > 0 ? (
                                logs.data.map((log) => (
                                    <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                                        {/* Timestamp */}
                                        <td className="px-6 py-3.5 text-xs font-semibold text-gray-500 whitespace-nowrap">
                                            {new Date(log.created_at).toLocaleString()}
                                        </td>

                                        {/* User */}
                                        <td className="px-6 py-3.5 font-bold text-gray-900">
                                            {log.user ? log.user.name : 'System / Guest'}
                                        </td>

                                        {/* Action */}
                                        <td className="px-6 py-3.5 font-semibold text-gray-800">
                                            {log.action}
                                        </td>

                                        {/* Model Type */}
                                        <td className="px-6 py-3.5 text-xs font-mono text-gray-500">
                                            {log.model_type ? log.model_type.replace('App\\Models\\', '') : 'System Config'}
                                        </td>

                                        {/* Model ID */}
                                        <td className="px-6 py-3.5 text-center font-bold font-mono text-xs text-gray-600">
                                            {log.model_id || '-'}
                                        </td>

                                        {/* IP Address */}
                                        <td className="px-6 py-3.5 text-xs font-mono text-gray-500">
                                            {log.ip_address || '127.0.0.1'}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-xs text-gray-400">
                                        No audit trail activities recorded in the system.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Table Footer */}
                {logs.meta && (
                    <div className="p-5 border-t border-gray-100 flex items-center justify-between flex-wrap gap-4">
                        <span className="text-xs text-gray-500 font-semibold">
                            Showing {logs.meta.from || 0} to {logs.meta.to || 0} of {logs.meta.total || 0} entries
                        </span>
                        <Pagination links={logs.meta.links} />
                    </div>
                )}
            </div>
        </ModuleLayout>
    );
}
