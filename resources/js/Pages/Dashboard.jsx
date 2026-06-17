import React, { useState } from 'react';
import ModuleLayout from '@/Layouts/ModuleLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard({
    auth,
    totalProducts,
    totalCategories,
    totalUsers,
    totalSuppliers,
    lowStockCount,
    totalInventoryValue,
    pendingPOs,
    totalMovements,
    timeframeStats = {}
}) {
    const [timeframe, setTimeframe] = useState('today');

    // Simple currency formatter
    const formatCurrency = (val) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(val);
    };

    // Extract stats for current timeframe
    const currentStats = timeframeStats[timeframe] || {
        dispatches: 0,
        revenue: 0.0,
        movements: 0,
        pos_raised: 0,
        new_products: 0,
        new_suppliers: 0,
        new_users: 0,
    };

    // Module definitions corresponding to Attachment 1 layout
    const modules = [
        {
            title: 'Catalog Overview',
            desc: 'Manage products, categories, units, and barcode SKUs.',
            icon: 'ri-box-3-line',
            route: '/product',
            badge: 'ACTIVE',
            metric1: { label: 'PRODUCTS', value: totalProducts },
            metric2: { label: 'NEW PRODUCTS', value: currentStats.new_products },
            bgColor: 'bg-indigo-50 text-indigo-600',
        },
        {
            title: 'Supplier Management',
            desc: 'Manage vendor details, order terms, and supply histories.',
            icon: 'ri-contacts-book-line',
            route: '/supplier',
            badge: 'ACTIVE',
            metric1: { label: 'ACTIVE SUPPLIERS', value: totalSuppliers },
            metric2: { label: 'NEW SUPPLIERS', value: currentStats.new_suppliers },
            bgColor: 'bg-indigo-50 text-indigo-600',
        },
        {
            title: 'Purchasing',
            desc: 'Raise purchase orders, track deliveries, and ingest stock.',
            icon: 'ri-file-list-3-line',
            route: '/purchasing',
            badge: 'ACTIVE',
            metric1: { label: 'PENDING POS', value: pendingPOs },
            metric2: { 
                label: timeframe === 'today' ? 'TODAY POS RAISED' : timeframe === 'this week' ? 'WEEK POS RAISED' : 'MONTH POS RAISED', 
                value: currentStats.pos_raised 
            },
            bgColor: 'bg-indigo-50 text-indigo-600',
        },
        {
            title: 'Sales & Dispatch',
            desc: 'Record customer sales, reserve inventory, and dispatch goods.',
            icon: 'ri-hand-coin-line',
            route: '/sales',
            badge: 'ACTIVE',
            metric1: { 
                label: timeframe === 'today' ? 'TODAY REVENUE' : timeframe === 'this week' ? 'WEEK REVENUE' : 'MTD REVENUE', 
                value: formatCurrency(currentStats.revenue) 
            },
            metric2: { 
                label: timeframe === 'today' ? 'TODAY DISPATCH' : timeframe === 'this week' ? 'WEEK DISPATCH' : 'MONTH DISPATCH', 
                value: currentStats.dispatches 
            },
            bgColor: 'bg-indigo-50 text-indigo-600',
        },
        {
            title: 'Stock Engine',
            desc: 'Monitor current levels, perform manual adjustments, and view logs.',
            icon: 'ri-database-line',
            route: '/stock',
            badge: 'ACTIVE',
            metric1: { label: 'STOCK VALUE', value: formatCurrency(totalInventoryValue) },
            metric2: { 
                label: timeframe === 'today' ? 'TODAY MOVEMENTS' : timeframe === 'this week' ? 'WEEK MOVEMENTS' : 'MONTH MOVEMENTS', 
                value: currentStats.movements 
            },
            bgColor: 'bg-indigo-50 text-indigo-600',
        },
        {
            title: 'Reports & Analytics',
            desc: 'Generate stock summary, valuations, and audit logs.',
            icon: 'ri-file-chart-line',
            route: '/report',
            badge: 'ACTIVE',
            metric1: { label: 'REPORTS AVAILABLE', value: 8 },
            metric2: { label: 'EXPORTS', value: 'Excel/PDF' },
            bgColor: 'bg-indigo-50 text-indigo-600',
        },
        {
            title: 'AI Analytics',
            desc: 'Run cognitive forecasting, margin auditing, and replenishment analysis.',
            icon: 'ri-brain-line',
            route: '/analytics',
            badge: 'ACTIVE',
            metric1: { label: 'MODELS AVAILABLE', value: 3 },
            metric2: { label: 'AI AUDITS', value: 'Real-time' },
            bgColor: 'bg-indigo-50 text-indigo-600',
        },
        {
            title: 'Admin Settings',
            desc: 'Manage system configurations, user CRUD, and RBAC matrix.',
            icon: 'ri-user-settings-line',
            route: '/user',
            badge: 'ADMIN ONLY',
            metric1: { label: 'TOTAL USERS', value: totalUsers },
            metric2: { label: 'NEW USERS', value: currentStats.new_users },
            bgColor: 'bg-indigo-50 text-indigo-600',
        }
    ];

    // Determine greeting
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 18) return 'Good Afternoon';
        return 'Good Evening';
    };

    return (
        <ModuleLayout currentModule="dashboard" breadcrumbs={[]}>
            <Head title="System Dashboard" />

            {/* Welcome Greeting Banner (Attachment 1 style) */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs bg-gray-100 text-gray-500 font-medium px-2 py-0.5 rounded-full flex items-center gap-1">
                            <i className="ri-calendar-line" />
                            {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        <span className="text-xs bg-gray-100 text-gray-500 font-medium px-2 py-0.5 rounded-full flex items-center gap-1">
                            <i className="ri-apps-line" />
                            8 Active Modules
                        </span>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        {getGreeting()}, {auth?.user?.name || 'System User'} 👋
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Here's what's happening with your inventory operations
                    </p>
                </div>

                {/* Timeframe Toggle Filter */}
                <div className="flex bg-gray-100 p-1 rounded-lg self-start md:self-center">
                    {['today', 'this week', 'this month'].map((time) => (
                        <button
                            key={time}
                            onClick={() => setTimeframe(time)}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-md capitalize transition-all ${
                                timeframe === time
                                    ? 'bg-white text-indigo-600 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-900'
                            }`}
                        >
                            {time}
                        </button>
                    ))}
                </div>
            </div>

            {/* Core General KPIs Statistics Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {/* Stat 1: Active Products */}
                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-1">
                        Active Products
                    </span>
                    <span className="text-3xl font-bold text-gray-900 block mb-2">{totalProducts}</span>
                    <span className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full font-medium">
                        In catalog
                    </span>
                </div>

                {/* Stat 2: Low-Stock Alerts */}
                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-1">
                        Low Stock Items
                    </span>
                    <span className="text-3xl font-bold text-gray-900 block mb-2">{lowStockCount}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                        lowStockCount > 0 ? 'bg-amber-100 text-amber-700 animate-pulse' : 'bg-green-100 text-green-700'
                    }`}>
                        {lowStockCount > 0 ? 'Needs attention' : 'All good'}
                    </span>
                </div>

                {/* Stat 3: Timeframe Dispatches */}
                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-1">
                        {timeframe === 'today' ? "Today's Dispatches" : timeframe === 'this week' ? "This Week's Dispatches" : "This Month's Dispatches"}
                    </span>
                    <span className="text-3xl font-bold text-gray-900 block mb-2">{currentStats.dispatches}</span>
                    <span className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full font-medium">
                        Completed orders
                    </span>
                </div>

                {/* Stat 4: Timeframe Revenue */}
                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-1">
                        {timeframe === 'today' ? "Today's Revenue" : timeframe === 'this week' ? "This Week's Revenue" : "Revenue (MTD)"}
                    </span>
                    <span className="text-3xl font-bold text-gray-900 block mb-2 truncate">
                        {formatCurrency(currentStats.revenue)}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full font-medium">
                        {timeframe === 'today' ? "Today" : timeframe === 'this week' ? "This week" : "Month to date"}
                    </span>
                </div>
            </div>

            {/* System Modules Header */}
            <div className="mb-4">
                <h2 className="text-lg font-bold text-gray-900">System Modules</h2>
            </div>

            {/* System Modules Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {modules.map((mod, index) => (
                    <Link
                        key={index}
                        href={mod.route}
                        className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between group border-b-2 hover:border-b-indigo-500"
                    >
                        {/* Module Top Row */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <div className={`w-10 h-10 rounded-lg ${mod.bgColor} flex items-center justify-center text-xl`}>
                                    <i className={mod.icon} />
                                </div>
                                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                                    mod.badge === 'ADMIN ONLY' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
                                }`}>
                                    {mod.badge}
                                </span>
                            </div>

                            {/* Module Details */}
                            <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors mb-2">
                                {mod.title}
                            </h3>
                            <p className="text-xs text-gray-500 leading-relaxed mb-4">
                                {mod.desc}
                            </p>
                        </div>

                        {/* Module Bottom Stats */}
                        <div className="border-t border-gray-100 pt-3 grid grid-cols-2 gap-2">
                            <div>
                                <span className="text-[9px] font-semibold text-gray-400 block tracking-wider uppercase">
                                    {mod.metric1.label}
                                </span>
                                <span className="text-sm font-bold text-gray-800">
                                    {mod.metric1.value}
                                </span>
                            </div>
                            <div>
                                <span className="text-[9px] font-semibold text-gray-400 block tracking-wider uppercase">
                                    {mod.metric2.label}
                                </span>
                                <span className="text-sm font-bold text-gray-800">
                                    {mod.metric2.value}
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </ModuleLayout>
    );
}
