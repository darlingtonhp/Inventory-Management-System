import React, { useState } from 'react';
import { usePage } from '@inertiajs/react';
import Sidebar from './Partials/Sidebar';
import Navbar from './Partials/Navbar';

export default function ModuleLayout({ children, currentModule = 'dashboard', breadcrumbs = [] }) {
    const { auth } = usePage().props;
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Dynamic Left Sidebar */}
            <div className={`${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out fixed inset-y-0 left-0 z-40 w-64`}>
                <Sidebar user={auth?.user} currentModule={currentModule} />
            </div>

            {/* Mobile Sidebar Overlay Click target */}
            {mobileSidebarOpen && (
                <div
                    onClick={() => setMobileSidebarOpen(false)}
                    className="fixed inset-0 bg-gray-900/40 z-30 md:hidden"
                />
            )}

            {/* Main Content Area */}
            <div className="flex-1 md:pl-64 flex flex-col">
                {/* Navbar */}
                <Navbar onMenuToggle={() => setMobileSidebarOpen(!mobileSidebarOpen)} breadcrumbs={breadcrumbs} />

                {/* Page Content Body */}
                <main className="flex-1 p-6 overflow-y-auto">
                    {children}
                </main>

                {/* Sticky compact Footer */}
                <footer className="h-12 bg-white border-t border-gray-200 flex items-center justify-between px-6 text-xs text-gray-500">
                    <div>
                        © {new Date().getFullYear()} Smart Inventory Ltd - Zimbabwe Inventory Management.
                    </div>
                    <div className="flex gap-4">
                        <a href="#" className="hover:text-indigo-600">Documentation</a>
                        <a href="#" className="hover:text-indigo-600">Support</a>
                    </div>
                </footer>
            </div>
        </div>
    );
}
