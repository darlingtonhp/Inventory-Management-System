import React, { useState } from 'react';
import ModuleLayout from '@/Layouts/ModuleLayout';
import { Head } from '@inertiajs/react';
import axios from 'axios';

export default function Analytics({
    hasOpenAIKey,
    hasDeepSeekKey,
    totalProducts,
    lowStockCount,
    totalValuation
}) {
    const [selectedModel, setSelectedModel] = useState('local');
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [warningMsg, setWarningMsg] = useState('');

    const suggestions = [
        { label: "Stock Margin analysis", text: "What is our current stock margin analysis?" },
        { label: "Stock replenishment", text: "Generate a list of recommended replenishment orders" },
        { label: "Anomalies & warnings", text: "Find anomalies or stock count warnings in the current warehouse database" },
        { label: "Supplier performance advice", text: "Given active partners and pending POs, provide an audit on supplier risk levels" }
    ];

    const formatCurrency = (val) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(val);
    };

    const handleSuggestionClick = (text) => {
        setQuery(text);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setErrorMsg('');
        setWarningMsg('');
        setResponse('');

        try {
            const res = await axios.post(route('analytics.query'), {
                query: query,
                model: selectedModel
            });

            if (res.data.error) {
                setWarningMsg(res.data.error);
            }
            setResponse(res.data.response);
        } catch (err) {
            setErrorMsg(err.response?.data?.message || 'Something went wrong while executing the AI request.');
        } finally {
            setLoading(false);
        }
    };

    // Custom client-side micro-markdown parser
    const renderMarkdown = (text) => {
        if (!text) return null;
        const lines = text.split('\n');
        let inTable = false;
        let inList = false;
        let tableRows = [];
        let listItems = [];
        let renderedElements = [];

        lines.forEach((line, index) => {
            // Table checking
            if (line.trim().startsWith('|')) {
                inTable = true;
                if (inList && listItems.length > 0) {
                    inList = false;
                    renderedElements.push(
                        <ul key={`list-${index}`} className="list-disc pl-5 mb-4 space-y-1.5 text-gray-700">
                            {listItems}
                        </ul>
                    );
                    listItems = [];
                }
                const cols = line.split('|').map(c => c.trim()).filter((c, i, arr) => i > 0 && i < arr.length - 1);
                if (line.includes('---')) return;
                tableRows.push(cols);
                return;
            } else if (inTable) {
                inTable = false;
                if (tableRows.length > 0) {
                    const headers = tableRows[0];
                    const body = tableRows.slice(1);
                    renderedElements.push(
                        <div key={`table-${index}`} className="overflow-x-auto my-4 rounded-xl border border-gray-200 shadow-sm">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        {headers.map((h, i) => (
                                            <th key={i} className="px-4 py-2 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100">
                                    {body.map((row, ri) => (
                                        <tr key={ri} className="hover:bg-gray-50">
                                            {row.map((val, ci) => (
                                                <td key={ci} className="px-4 py-2.5 text-xs text-gray-700 font-medium">{val}</td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    );
                    tableRows = [];
                }
            }

            // List checking
            if (line.trim().startsWith('- ')) {
                if (!inList) {
                    inList = true;
                    listItems = [];
                }
                const content = line.substring(2);
                listItems.push(
                    <li key={`li-${index}`} className="text-xs text-gray-700 leading-relaxed">
                        {parseFormatting(content)}
                    </li>
                );
                return;
            } else if (inList) {
                inList = false;
                renderedElements.push(
                    <ul key={`list-${index}`} className="list-disc pl-5 mb-4 space-y-1.5 text-gray-700">
                        {listItems}
                    </ul>
                );
                listItems = [];
            }

            // Headers
            if (line.startsWith('### ')) {
                renderedElements.push(
                    <h3 key={index} className="text-sm font-bold text-gray-900 mt-5 mb-2 flex items-center gap-1.5">
                        {parseFormatting(line.substring(4))}
                    </h3>
                );
                return;
            }
            if (line.startsWith('#### ')) {
                renderedElements.push(
                    <h4 key={index} className="text-xs font-bold text-gray-800 mt-4 mb-1.5">
                        {parseFormatting(line.substring(5))}
                    </h4>
                );
                return;
            }
            if (line.startsWith('## ')) {
                renderedElements.push(
                    <h2 key={index} className="text-md font-bold text-indigo-700 mt-6 mb-3 pb-1 border-b border-gray-100">
                        {parseFormatting(line.substring(3))}
                    </h2>
                );
                return;
            }

            // Horizontal Rule
            if (line.trim() === '---') {
                renderedElements.push(<hr key={index} className="my-5 border-gray-150" />);
                return;
            }

            // Normal Text
            if (line.trim()) {
                renderedElements.push(
                    <p key={index} className="text-xs text-gray-600 leading-relaxed mb-3">
                        {parseFormatting(line)}
                    </p>
                );
            }
        });

        // Handle remaining lists
        if (inList && listItems.length > 0) {
            renderedElements.push(
                <ul key="list-end" className="list-disc pl-5 mb-4 space-y-1.5 text-gray-700">
                    {listItems}
                </ul>
            );
        }
        // Handle remaining tables
        if (tableRows.length > 0) {
            const headers = tableRows[0];
            const body = tableRows.slice(1);
            renderedElements.push(
                <div key="table-end" className="overflow-x-auto my-4 rounded-xl border border-gray-200 shadow-sm">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                {headers.map((h, i) => (
                                    <th key={i} className="px-4 py-2.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {body.map((row, ri) => (
                                <tr key={ri} className="hover:bg-gray-50">
                                    {row.map((val, ci) => (
                                        <td key={ci} className="px-4 py-2.5 text-xs text-gray-700 font-medium">{val}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            );
        }

        return renderedElements;
    };

    const parseFormatting = (text) => {
        const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/);
        return parts.map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={i} className="font-bold text-gray-900">{part.slice(2, -2)}</strong>;
            }
            if (part.startsWith('*') && part.endsWith('*')) {
                return <em key={i} className="italic text-gray-800">{part.slice(1, -1)}</em>;
            }
            return part;
        });
    };

    return (
        <ModuleLayout currentModule="analytics" breadcrumbs={[{ label: 'AI Analytics', route: '/analytics' }]}>
            <Head title="AI Analytics Auditor" />

            {/* Welcome banner */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs bg-indigo-50 text-indigo-600 font-medium px-2 py-0.5 rounded-full flex items-center gap-1">
                            <i className="ri-brain-line" />
                            AI Auditor v1.0
                        </span>
                        <span className="text-xs bg-gray-100 text-gray-500 font-medium px-2 py-0.5 rounded-full">
                            Harare Hub Node
                        </span>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        AI Analytics & Audits
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Conversational cognitive ledger analyzer. Run deep stock checks and forecasting.
                    </p>
                </div>
            </div>

            {/* Basic stats section */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                        Warehouse Valuation
                    </span>
                    <span className="text-2xl font-bold text-gray-900 block mb-1">{formatCurrency(totalValuation)}</span>
                    <span className="text-[10px] text-gray-500">Retail price ledger</span>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                        Low Stock Levels
                    </span>
                    <span className="text-2xl font-bold text-gray-900 block mb-1">{lowStockCount}</span>
                    <span className="text-[10px] text-gray-500">Items below threshold</span>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                        Catalog Size
                    </span>
                    <span className="text-2xl font-bold text-gray-900 block mb-1">{totalProducts}</span>
                    <span className="text-[10px] text-gray-500">Active products listed</span>
                </div>
            </div>

            {/* AI Model Selector */}
            <div className="mb-6">
                <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">
                    Select Brain Model
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* DeepSeek */}
                    <div 
                        onClick={() => setSelectedModel('deepseek')}
                        className={`border rounded-xl p-4 cursor-pointer transition-all flex items-center justify-between ${
                            selectedModel === 'deepseek'
                                ? 'bg-indigo-50 border-indigo-400 shadow-sm'
                                : 'bg-white border-gray-200 hover:border-gray-300'
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-xl text-blue-600 font-bold">
                                D
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-gray-900">DeepSeek R1</h4>
                                <p className="text-[10px] text-gray-500">Cognitive reasoning agent</p>
                            </div>
                        </div>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                            hasDeepSeekKey ? 'bg-green-150 text-green-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                            {hasDeepSeekKey ? 'READY' : 'OFFLINE'}
                        </span>
                    </div>

                    {/* OpenAI */}
                    <div 
                        onClick={() => setSelectedModel('openai')}
                        className={`border rounded-xl p-4 cursor-pointer transition-all flex items-center justify-between ${
                            selectedModel === 'openai'
                                ? 'bg-indigo-50 border-indigo-400 shadow-sm'
                                : 'bg-white border-gray-200 hover:border-gray-300'
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center text-xl text-green-600 font-bold">
                                O
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-gray-900">OpenAI GPT-4o</h4>
                                <p className="text-[10px] text-gray-500">Smart analytical agent</p>
                            </div>
                        </div>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                            hasOpenAIKey ? 'bg-green-150 text-green-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                            {hasOpenAIKey ? 'READY' : 'OFFLINE'}
                        </span>
                    </div>

                    {/* Local Fallback Rules Engine */}
                    <div 
                        onClick={() => setSelectedModel('local')}
                        className={`border rounded-xl p-4 cursor-pointer transition-all flex items-center justify-between ${
                            selectedModel === 'local'
                                ? 'bg-indigo-50 border-indigo-400 shadow-sm'
                                : 'bg-white border-gray-200 hover:border-gray-300'
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-xl text-gray-600 font-bold">
                                L
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-gray-900">Local Audit</h4>
                                <p className="text-[10px] text-gray-500">Calculated database rules</p>
                            </div>
                        </div>
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-green-150 text-green-700">
                            ONLINE
                        </span>
                    </div>
                </div>
            </div>

            {/* Input Prompt Section */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
                            Auditor Conversation Input
                        </label>
                        <div className="relative">
                            <textarea
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                rows={3}
                                placeholder="Ask the AI inventory manager about stock margin, replenishment, supplier warnings..."
                                className="w-full border-gray-200 rounded-lg focus:border-indigo-400 focus:ring-indigo-400 text-xs py-3 px-4 resize-none pr-12 shadow-inner"
                            />
                            <button
                                type="submit"
                                disabled={loading || !query.trim()}
                                className="absolute bottom-3.5 right-3 w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-500 transition-colors disabled:opacity-30 disabled:hover:bg-indigo-600"
                            >
                                {loading ? (
                                    <i className="ri-loader-4-line animate-spin text-lg" />
                                ) : (
                                    <i className="ri-send-plane-2-line text-lg" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Suggestions */}
                    <div>
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
                            Quick Inquiries:
                        </span>
                        <div className="flex flex-wrap gap-2">
                            {suggestions.map((s, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() => handleSuggestionClick(s.text)}
                                    className="text-[10px] bg-slate-50 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 font-semibold px-2.5 py-1.5 rounded-md border border-gray-200/60 hover:border-indigo-200 transition-all"
                                >
                                    {s.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </form>
            </div>

            {/* Warning Message if Key fallback is active */}
            {warningMsg && (
                <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl text-xs mb-6 flex items-start gap-2 animate-fade-in">
                    <i className="ri-alert-line text-amber-500 text-sm mt-0.5" />
                    <div>
                        <span className="font-bold block">Key Missing Warning</span>
                        {warningMsg}
                    </div>
                </div>
            )}

            {/* Error Message */}
            {errorMsg && (
                <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl text-xs mb-6 flex items-start gap-2 animate-fade-in">
                    <i className="ri-error-warning-line text-red-500 text-sm mt-0.5" />
                    <div>
                        <span className="font-bold block">Auditor Error</span>
                        {errorMsg}
                    </div>
                </div>
            )}

            {/* AI Response Display */}
            {(response || loading) && (
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm animate-fade-in">
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                                <i className="ri-brain-line text-lg" />
                            </div>
                            <div>
                                <h3 className="text-xs font-bold text-gray-900">Auditor Ledger Analysis</h3>
                                <p className="text-[9px] text-gray-500">Live response data</p>
                            </div>
                        </div>

                        {loading && (
                            <span className="text-[10px] text-indigo-600 font-semibold animate-pulse flex items-center gap-1">
                                <i className="ri-loader-4-line animate-spin" /> Gathering context & analyzing...
                            </span>
                        )}
                    </div>

                    <div className="prose max-w-none">
                        {loading ? (
                            <div className="space-y-3 pt-2">
                                <div className="h-3.5 bg-gray-100 rounded-md animate-pulse w-3/4" />
                                <div className="h-3.5 bg-gray-100 rounded-md animate-pulse w-5/6" />
                                <div className="h-3.5 bg-gray-100 rounded-md animate-pulse w-2/3" />
                                <div className="h-3.5 bg-gray-100 rounded-md animate-pulse w-1/2" />
                            </div>
                        ) : (
                            renderMarkdown(response)
                        )}
                    </div>
                </div>
            )}
        </ModuleLayout>
    );
}
