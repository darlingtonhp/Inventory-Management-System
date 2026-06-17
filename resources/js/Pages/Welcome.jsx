import React from 'react';
import { Head, Link } from '@inertiajs/react';

export default function Welcome({ auth }) {
    return (
        <div className="relative min-h-screen flex items-center justify-center bg-slate-950 overflow-hidden font-sans p-4 sm:p-6 md:p-8">
            <Head title="Welcome to Smart Inventory" />

            {/* Backdrop Image with Scale and Ambient Blur */}
            <div className="absolute inset-0 z-0">
                <img
                    src="/images/welcome_background.jpg"
                    alt="Warehouse Hub background"
                    className="w-full h-full object-cover opacity-30 scale-105 animate-pulse-slow"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900/90 to-indigo-950/40 z-0" />
            </div>

            {/* Premium Glowing Spheres */}
            <div className="absolute -top-32 -left-32 w-[30rem] h-[30rem] rounded-full bg-indigo-600/20 blur-[120px] pointer-events-none animate-pulse-slow z-0" />
            <div className="absolute -bottom-32 -right-32 w-[35rem] h-[35rem] rounded-full bg-purple-600/15 blur-[120px] pointer-events-none animate-pulse-slow z-0" style={{ animationDelay: '4s' }} />

            {/* Giant Welcome Glassmorphic Console Frame */}
            <div className="relative z-10 w-full max-w-4xl bg-slate-900/40 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 md:p-14 shadow-2xl overflow-hidden animate-fade-in-up">
                
                {/* Visual grid line accents on the container */}
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />

                {/* Status bar top row */}
                <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/5 text-[10px] tracking-widest text-indigo-300 font-bold uppercase">
                    <div className="flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        Harare Main Hub Node
                    </div>
                    <div className="hidden sm:flex items-center gap-4">
                        <span>SYS STATUS: OPERATIONAL</span>
                        <span className="text-white/30">•</span>
                        <span>LATENCY: 12ms</span>
                    </div>
                </div>

                {/* Hero Section */}
                <div className="flex flex-col items-center text-center mb-10">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/15 shadow-xl flex items-center justify-center mb-6 group hover:border-indigo-400/50 transition-all duration-300 hover:scale-105">
                        <i className="ri-box-3-line text-white text-3xl animate-pulse-slow" />
                    </div>
                    
                    <span className="text-[10px] font-bold text-indigo-400 tracking-[0.3em] uppercase mb-2">
                        Zimbabwe Logistics & Catalog Engine
                    </span>
                    
                    <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-none mb-6">
                        Smart <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-indigo-300 to-purple-400">Inventory Engine</span>
                    </h1>
                    
                    <p className="max-w-xl text-sm sm:text-base text-slate-300 leading-relaxed">
                        A gorgeous module-based system for real-time catalog tracking, supplier partners, sales dispatch, PO pipelines, and AI analytics audits.
                    </p>
                </div>

                {/* Interactive Grid Feature Items */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                    
                    {/* Item 1 */}
                    <div className="bg-white/[0.02] backdrop-blur-sm border border-white/5 rounded-2xl p-5 text-left transition-all hover:bg-white/[0.05] hover:border-white/15 hover:-translate-y-0.5 group">
                        <div className="w-9 h-9 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-4 text-indigo-400 group-hover:bg-indigo-500/20 group-hover:text-indigo-300 transition-all">
                            <i className="ri-folders-line text-lg" />
                        </div>
                        <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-1">Catalog Management</h3>
                        <p className="text-[11px] text-slate-400 leading-normal">
                            Hierarchical categories mapping with unit measures, soft deletions and barcode SKUs.
                        </p>
                    </div>

                    {/* Item 2 */}
                    <div className="bg-white/[0.02] backdrop-blur-sm border border-white/5 rounded-2xl p-5 text-left transition-all hover:bg-white/[0.05] hover:border-white/15 hover:-translate-y-0.5 group">
                        <div className="w-9 h-9 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-4 text-indigo-400 group-hover:bg-indigo-500/20 group-hover:text-indigo-300 transition-all">
                            <i className="ri-shield-user-line text-lg" />
                        </div>
                        <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-1">Secure RBAC</h3>
                        <p className="text-[11px] text-slate-400 leading-normal">
                            Granular multi-role dashboard panels, strict user access matrix, and action audit logging.
                        </p>
                    </div>

                    {/* Item 3 */}
                    <div className="bg-white/[0.02] backdrop-blur-sm border border-white/5 rounded-2xl p-5 text-left transition-all hover:bg-white/[0.05] hover:border-white/15 hover:-translate-y-0.5 group">
                        <div className="w-9 h-9 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-4 text-indigo-400 group-hover:bg-indigo-500/20 group-hover:text-indigo-300 transition-all">
                            <i className="ri-brain-line text-lg" />
                        </div>
                        <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-1">AI Analytics</h3>
                        <p className="text-[11px] text-slate-400 leading-normal">
                            DeepSeek and OpenAI powered asset forecasting, stock optimization, and audit recommendations.
                        </p>
                    </div>
                </div>

                {/* Call To Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    {auth.user ? (
                        <Link
                            href={route('dashboard')}
                            className="w-full sm:w-auto px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg tracking-wider uppercase transition-all hover:shadow-indigo-500/20 text-center"
                        >
                            Open Dashboard console
                        </Link>
                    ) : (
                        <>
                            <Link
                                href={route('login')}
                                className="w-full sm:w-auto px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg tracking-wider uppercase transition-all hover:scale-[1.02] text-center"
                            >
                                Secure Portal Sign-In
                            </Link>
                            <Link
                                href={route('register')}
                                className="w-full sm:w-auto px-8 py-3.5 border border-white/10 hover:border-white/20 hover:bg-white/5 text-white text-xs font-bold rounded-xl tracking-wider uppercase transition-colors text-center"
                            >
                                Register Operator
                            </Link>
                        </>
                    )}
                </div>

                {/* Footnote */}
                <div className="mt-10 pt-6 border-t border-white/5 text-center text-[10px] text-slate-500 tracking-wider">
                    SIMS Logistics &bull; Harare, Zimbabwe &bull; Powered by Laravel, Inertia, and React
                </div>
            </div>
        </div>
    );
}
