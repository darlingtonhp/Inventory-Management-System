import React, { useEffect, useRef } from 'react';
import { Link, usePage, router } from '@inertiajs/react';

const SIDEBAR_SCROLL_KEY = 'ims-sidebar-scroll';

export default function Sidebar({ user, currentModule = 'dashboard' }) {
    const { url } = usePage();
    const menuInnerRef = useRef(null);

    // Normalize path for active states
    const pathname = (url || '').split('?')[0].replace(/\/$/, '') || '/';

    // Persist sidebar scroll position
    useEffect(() => {
        const el = menuInnerRef.current;
        if (!el) return;

        const saveScroll = () => {
            try {
                sessionStorage.setItem(SIDEBAR_SCROLL_KEY, String(el.scrollTop));
            } catch (_) {}
        };

        const restoreScroll = () => {
            try {
                const saved = sessionStorage.getItem(SIDEBAR_SCROLL_KEY);
                if (saved !== null) {
                    const top = parseInt(saved, 10);
                    if (Number.isFinite(top)) {
                        requestAnimationFrame(() => {
                            if (menuInnerRef.current) menuInnerRef.current.scrollTop = top;
                        });
                    }
                }
            } catch (_) {}
        };

        const debouncedSave = (() => {
            let t;
            return () => {
                clearTimeout(t);
                t = setTimeout(saveScroll, 150);
            };
        })();

        el.addEventListener('scroll', debouncedSave, { passive: true });

        const removeBefore = router.on('before', () => {
            saveScroll();
        });
        const removeFinish = router.on('finish', () => {
            restoreScroll();
        });

        restoreScroll();

        return () => {
            el.removeEventListener('scroll', debouncedSave);
            removeBefore();
            removeFinish();
        };
    }, [currentModule]);

    const handleLogout = (e) => {
        e.preventDefault();
        router.post(route('logout'));
    };

    const isActive = (path) => {
        const base = (path || '').replace(/\/$/, '') || '/';
        if (base === '/dashboard' || base === '') {
            return pathname === '/dashboard' || pathname === '/';
        }
        return pathname === base || pathname.startsWith(base + '/');
    };

    // Define menus for each module
    const menus = {
        dashboard: [
            { title: 'Dashboard', icon: 'ri-dashboard-3-line', route: '/dashboard', exact: true },
            { header: 'Account Settings' },
            { title: 'Change Password', icon: 'ri-lock-password-line', route: '/profile' },
            { title: 'Multi-Factor Auth', icon: 'ri-shield-keyhole-line', route: '/profile' }, // Fallback to profile edit
            { header: 'Session' },
            { title: 'Logout', icon: 'ri-logout-box-r-line', isLogout: true }
        ],
        catalog: [
            { title: 'Catalog Overview', icon: 'ri-home-4-line', route: '/product', exact: true },
            { header: 'Inventory Items' },
            { title: 'Products List', icon: 'ri-box-3-line', route: '/product' },
            { title: 'Categories', icon: 'ri-folder-open-line', route: '/category' },
            { header: 'Actions' },
            { title: 'Add Product', icon: 'ri-add-box-line', route: '/product/create' }
        ],
        suppliers: [
            { title: 'Suppliers List', icon: 'ri-contacts-book-line', route: '/supplier', exact: true },
            { header: 'Actions' },
            { title: 'Add Supplier', icon: 'ri-user-add-line', route: '/supplier/create' }
        ],
        purchasing: [
            { title: 'Purchasing Dashboard', icon: 'ri-dashboard-line', route: '/purchasing', exact: true },
            { header: 'Purchase Orders' },
            { title: 'All Purchase Orders', icon: 'ri-file-list-3-line', route: '/purchase-order' },
            { title: 'Raise PO', icon: 'ri-file-add-line', route: '/purchase-order/create' }
        ],
        sales: [
            { title: 'Sales Dashboard', icon: 'ri-dashboard-line', route: '/sales', exact: true },
            { header: 'Sales Orders' },
            { title: 'All Sales Orders', icon: 'ri-hand-coin-line', route: '/sales-order' },
            { title: 'Create Sales Order', icon: 'ri-file-add-line', route: '/sales-order/create' }
        ],
        stock: [
            { title: 'Stock Dashboard', icon: 'ri-dashboard-line', route: '/stock', exact: true },
            { header: 'Stock Management' },
            { title: 'Current Stock levels', icon: 'ri-database-line', route: '/stock/current' },
            { title: 'Movements Log', icon: 'ri-history-line', route: '/stock/movements' }
        ],
        reports: [
            { title: 'Reports Selector', icon: 'ri-file-chart-line', route: '/report', exact: true }
        ],
        analytics: [
            { title: 'AI Analytics Console', icon: 'ri-brain-line', route: '/analytics', exact: true },
            { header: 'System Links' },
            { title: 'System Dashboard', icon: 'ri-dashboard-3-line', route: '/dashboard' },
            { title: 'Reports Selector', icon: 'ri-file-chart-line', route: '/report' }
        ],
        admin: [
            { title: 'Users Directory', icon: 'ri-user-settings-line', route: '/user', exact: true },
            { header: 'System Configurations' },
            { title: 'Roles & Permissions', icon: 'ri-shield-user-line', route: '/admin/roles' },
            { title: 'Audit Logs', icon: 'ri-survey-line', route: '/admin/audit-logs' },
            { title: 'Global Settings', icon: 'ri-settings-4-line', route: '/admin/settings' }
        ]
    };

    const moduleTitles = {
        dashboard: 'DASHBOARD',
        catalog: 'CATALOG',
        suppliers: 'SUPPLIERS',
        purchasing: 'PURCHASING',
        sales: 'SALES',
        stock: 'STOCK ENGINE',
        reports: 'REPORTS',
        admin: 'ADMIN SETTINGS',
        analytics: 'AI ANALYTICS'
    };

    const menuItems = menus[currentModule] || menus.dashboard;
    const isSubModule = currentModule !== 'dashboard';

    return (
        <aside
            id="layout-menu"
            className="w-64 fixed inset-y-0 left-0 z-40 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 transform md:translate-x-0"
        >
            {/* Sidebar Module Header */}
            <div className="h-16 flex items-center px-6 border-b border-gray-200 gap-3">
                {isSubModule && (
                    <Link
                        href="/dashboard"
                        className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:text-indigo-600 hover:border-indigo-200 transition-colors"
                        title="Back to System Dashboard"
                    >
                        <i className="ri-arrow-left-line text-lg" />
                    </Link>
                )}
                <span className="font-bold text-gray-800 text-sm tracking-wider uppercase">
                    {moduleTitles[currentModule]}
                </span>
            </div>

            {/* Menu Items Container */}
            <div
                ref={menuInnerRef}
                className="flex-1 overflow-y-auto py-4 px-3 space-y-1 select-none scrollbar-thin"
            >
                <ul>
                    {menuItems.map((item, index) => {
                        if (item.header) {
                            return (
                                <li key={index} className="pt-4 pb-2 px-3">
                                    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
                                        {item.header}
                                    </span>
                                </li>
                            );
                        }

                        if (item.isLogout) {
                            return (
                                <li key={index}>
                                    <a
                                        href="#"
                                        onClick={handleLogout}
                                        className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
                                    >
                                        <i className={`${item.icon} text-lg`} />
                                        <span>{item.title}</span>
                                    </a>
                                </li>
                            );
                        }

                        const active = item.exact
                            ? pathname === item.route
                            : isActive(item.route);

                        return (
                            <li key={index}>
                                <Link
                                    href={item.route}
                                    className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                                        active
                                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100 font-semibold'
                                            : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-600'
                                    }`}
                                >
                                    <i className={`${item.icon} text-lg ${active ? 'text-white' : 'text-gray-400 hover:text-indigo-600'}`} />
                                    <span>{item.title}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </aside>
    );
}
