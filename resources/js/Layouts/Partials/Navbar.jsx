import React, { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';

export default function Navbar({ onMenuToggle, breadcrumbs = [] }) {
    const { auth, lowStockCount = 0, lowStockItems = [] } = usePage().props;
    const user = auth?.user;
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [alertsOpen, setAlertsOpen] = useState(false);

    const handleLogout = () => {
        router.post(route('logout'));
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(() => {});
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    };

    return (
        <header className="h-16 sticky top-0 z-30 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm">
            {/* Left Section: Menu Toggle & Breadcrumbs */}
            <div className="flex items-center gap-4">
                <button
                    onClick={onMenuToggle}
                    className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:text-indigo-600 hover:border-indigo-200 md:hidden transition-colors"
                >
                    <i className="ri-menu-line text-lg" />
                </button>

                {/* Breadcrumb Trail */}
                <nav className="flex" aria-label="Breadcrumb">
                    <ol className="inline-flex items-center space-x-1 md:space-x-2">
                        <li className="inline-flex items-center">
                            <Link href="/dashboard" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors">
                                <i className="ri-home-4-line mr-1.5 text-base" />
                                Home
                            </Link>
                        </li>
                        {breadcrumbs.map((crumb, index) => (
                            <li key={index}>
                                <div className="flex items-center">
                                    <i className="ri-arrow-right-s-line text-gray-400 text-lg mx-0.5" />
                                    {crumb.route ? (
                                        <Link
                                            href={crumb.route}
                                            className="ml-1 text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors"
                                        >
                                            {crumb.title}
                                        </Link>
                                    ) : (
                                        <span className="ml-1 text-sm font-medium text-gray-800">
                                            {crumb.title}
                                        </span>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ol>
                </nav>
            </div>

            {/* Right Section: Actions & Avatar */}
            <div className="flex items-center gap-4">
                {/* Fullscreen Toggle */}
                <button
                    onClick={toggleFullscreen}
                    className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-gray-50 rounded-full transition-colors hidden sm:inline-flex"
                    title="Toggle Fullscreen"
                >
                    <i className="ri-fullscreen-line text-xl" />
                </button>

                {/* Theme Selector Icon */}
                <button
                    className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-gray-50 rounded-full transition-colors"
                    title="Change Palette"
                >
                    <i className="ri-palette-line text-xl" />
                </button>

                {/* Notifications Alert Bell */}
                <div className="relative">
                    <button
                        onClick={() => {
                            setAlertsOpen(!alertsOpen);
                            setDropdownOpen(false);
                        }}
                        className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-gray-55 rounded-full transition-colors relative focus:outline-none block"
                        title="Stock Alerts"
                    >
                        <i className="ri-notification-3-line text-xl" />
                        {lowStockCount > 0 && (
                            <>
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-600 rounded-full animate-ping" />
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-600 rounded-full" />
                            </>
                        )}
                    </button>

                    {alertsOpen && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setAlertsOpen(false)} />
                            <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50 text-left animate-fade-in-down">
                                <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Stock Alerts ({lowStockCount})</span>
                                    {lowStockCount > 0 && (
                                        <span className="text-[9px] bg-indigo-50 text-indigo-700 font-bold px-1.5 py-0.5 rounded-md">Low Level</span>
                                    )}
                                </div>
                                <div className="max-h-60 overflow-y-auto divide-y divide-gray-100">
                                    {lowStockItems.length > 0 ? (
                                        lowStockItems.map((item) => (
                                            <Link
                                                key={item.id}
                                                href={route('product.show', item.id)}
                                                onClick={() => setAlertsOpen(false)}
                                                className="block px-4 py-2.5 hover:bg-gray-50 transition-colors"
                                            >
                                                <div className="flex justify-between items-start gap-2 mb-0.5">
                                                    <span className="text-xs font-bold text-gray-900 truncate block">{item.name}</span>
                                                    <span className="text-[9px] font-mono bg-amber-50 text-amber-700 font-bold px-1 py-0.5 rounded flex-shrink-0">
                                                        {item.on_hand} {item.unit}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center text-[9px] text-gray-400">
                                                    <span>SKU: {item.sku}</span>
                                                    <span>Limit: {item.reorder_level} {item.unit}</span>
                                                </div>
                                            </Link>
                                        ))
                                    ) : (
                                        <div className="px-4 py-6 text-center text-xs text-gray-400">
                                            <i className="ri-checkbox-circle-line text-lg block mb-1 text-emerald-500" />
                                            All stock levels are adequate.
                                        </div>
                                    )}
                                </div>
                                <Link
                                    href={route('stock.current')}
                                    onClick={() => setAlertsOpen(false)}
                                    className="block text-center py-2 border-t border-gray-100 text-[10px] font-bold text-indigo-600 hover:text-indigo-750 hover:bg-gray-50 transition-colors"
                                >
                                    Manage All Inventory
                                </Link>
                            </div>
                        </>
                    )}
                </div>

                {/* Vertical Divider */}
                <div className="h-6 w-px bg-gray-200" />

                {/* User Profile Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="flex items-center gap-2 focus:outline-none"
                    >
                        <div className="w-8 h-8 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center font-bold text-indigo-700 uppercase">
                            {user?.name ? user.name.charAt(0) : 'U'}
                        </div>
                        <span className="text-sm font-medium text-gray-700 hidden md:inline-block">
                            {user?.name || 'User'}
                        </span>
                        <i className={`ri-arrow-down-s-line text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {dropdownOpen && (
                        <>
                            {/* Overlay Click Target */}
                            <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50 animate-fade-in-down">
                                <div className="px-4 py-2 border-b border-gray-100">
                                    <p className="text-xs text-gray-400">Signed in as</p>
                                    <p className="text-sm font-medium text-gray-800 truncate">{user?.email}</p>
                                </div>
                                <Link
                                    href="/profile"
                                    onClick={() => setDropdownOpen(false)}
                                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    <i className="ri-user-line text-gray-400" />
                                    <span>My Profile</span>
                                </Link>
                                <button
                                    onClick={() => {
                                        setDropdownOpen(false);
                                        handleLogout();
                                    }}
                                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left transition-colors"
                                >
                                    <i className="ri-logout-box-r-line" />
                                    <span>Log Out</span>
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
