"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, ShoppingCart, TrendingUp, AlertTriangle, ArrowUpRight, ArrowDownRight, MoreHorizontal } from 'lucide-react';
import ScenarioSimulator from './ScenarioSimulator';

interface DashboardProps {
    data: any;
}

export default function Dashboard({ data }: DashboardProps) {
    const { kpis, insights, trends, data_quality_score } = data;

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(val);
    };

    const formatNumber = (val: number) => {
        return new Intl.NumberFormat("en-US", { notation: "compact", compactDisplay: "short" }).format(val);
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* KPI Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Revenue Card */}
                <div className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-gray-100 relative overflow-hidden group hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Gross Volume</p>
                            <h3 className="text-3xl font-bold text-gray-900 mt-1">{formatCurrency(kpis.total_sales)}</h3>
                        </div>
                        <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-blue-50 transition-colors">
                            <DollarSign className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                        </div>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                        <span className="flex items-center text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded-full">
                            <ArrowUpRight className="w-3 h-3 mr-1" /> 12%
                        </span>
                        <span className="text-gray-400 ml-2">vs last period</span>
                    </div>
                </div>

                {/* Orders Card */}
                <div className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-gray-100 relative overflow-hidden group hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total Transactions</p>
                            <h3 className="text-3xl font-bold text-gray-900 mt-1">{formatNumber(kpis.total_orders)}</h3>
                        </div>
                        <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-purple-50 transition-colors">
                            <ShoppingCart className="w-5 h-5 text-gray-400 group-hover:text-purple-500 transition-colors" />
                        </div>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                        <span className="flex items-center text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded-full">
                            <ArrowUpRight className="w-3 h-3 mr-1" /> 5.4%
                        </span>
                        <span className="text-gray-400 ml-2">vs last period</span>
                    </div>
                </div>

                {/* AOV Card */}
                <div className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-gray-100 relative overflow-hidden group hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Avg. Order Value</p>
                            <h3 className="text-3xl font-bold text-gray-900 mt-1">{formatCurrency(kpis.avg_order_value)}</h3>
                        </div>
                        <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-orange-50 transition-colors">
                            <TrendingUp className="w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors" />
                        </div>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                        <span className="flex items-center text-red-600 font-medium bg-red-50 px-2 py-0.5 rounded-full">
                            <ArrowDownRight className="w-3 h-3 mr-1" /> 2.1%
                        </span>
                        <span className="text-gray-400 ml-2">vs last period</span>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Main Chart */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">Revenue Trend</h3>
                            <p className="text-sm text-gray-500">Monthly breakdown of successful payments</p>
                        </div>
                        <button className="p-1 hover:bg-gray-100 rounded-lg">
                            <MoreHorizontal className="w-5 h-5 text-gray-400" />
                        </button>
                    </div>

                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={trends} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#3B82F6" stopOpacity={1} />
                                        <stop offset="100%" stopColor="#2563EB" stopOpacity={0.8} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis
                                    dataKey="date"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fill: '#6B7280' }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fill: '#6B7280' }}
                                    tickFormatter={(val) => `$${val}`}
                                />
                                <Tooltip
                                    cursor={{ fill: '#F9FAFB' }}
                                    contentStyle={{
                                        borderRadius: '12px',
                                        border: 'none',
                                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                                        padding: '12px'
                                    }}
                                />
                                <Bar
                                    dataKey="sales"
                                    fill="url(#colorSales)"
                                    radius={[6, 6, 0, 0]}
                                    barSize={40}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Insights Panel (Zentra Style Gradient) */}
                <div className="relative bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-2xl shadow-lg text-white overflow-hidden flex flex-col justify-between">
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl transform translate-x-10 -translate-y-10"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500 opacity-20 rounded-full blur-xl transform -translate-x-5 translate-y-5"></div>

                    <div>
                        <div className="flex items-center gap-2 mb-2 opacity-80">
                            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                            <span className="text-xs font-semibold uppercase tracking-wider">AI Insights</span>
                        </div>
                        <h3 className="text-2xl font-bold leading-tight mb-4">
                            {insights.length > 0 ? "Analytics Report Ready" : "No patterns detected"}
                        </h3>

                        <div className="space-y-4 relative z-10">
                            {insights.slice(0, 3).map((insight: string, idx: number) => (
                                <p key={idx} className="text-sm text-blue-50 leading-relaxed border-l-2 border-blue-400 pl-3">
                                    {insight.replace(/^[^\:]+:/, '').trim()}
                                </p>
                            ))}
                        </div>
                    </div>

                    <button className="mt-8 w-full bg-white text-blue-600 font-semibold py-3 rounded-xl hover:bg-blue-50 transition-colors shadow-sm">
                        View Full Report
                    </button>
                </div>
            </div>

            {/* Scenario Simulator */}
            <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4 px-1">Growth Simulator</h3>
            <ScenarioSimulator currentSales={kpis.total_sales} />
        </div>
    );
}
