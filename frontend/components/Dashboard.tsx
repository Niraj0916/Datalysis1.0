"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { DollarSign, ShoppingCart, TrendingUp, ArrowUpRight, ArrowDownRight, MoreHorizontal, Users, Sparkles, Calendar, Download, UserPlus, Zap, AlertTriangle, CheckCircle } from 'lucide-react';
import ScenarioSimulator from './ScenarioSimulator';

interface DashboardProps {
    data: any;
}

export default function Dashboard({ data }: DashboardProps) {
    const { kpis, insights, trends, data_quality_score, segments, customers, domain } = data;

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(val);
    };

    const formatNumber = (val: number) => {
        return new Intl.NumberFormat("en-US", { notation: "compact", compactDisplay: "short" }).format(val);
    };

    // Use real customers from data, fallback to empty array
    const recentCustomers = customers || [];

    const recentActivity = [
        { id: 1, type: "signup", title: "New enterprise customer signed up", desc: "Nexus Corp joined with a team of 45", time: "3 min ago", icon: UserPlus, color: "blue" },
        { id: 2, type: "upgrade", title: "Subscription upgraded", desc: "Orion Labs moved from Pro to Enterprise", time: "18 min ago", icon: Zap, color: "emerald" },
        { id: 3, type: "alert", title: "Churn risk detected", desc: "3 accounts show declining engagement", time: "1 hr ago", icon: AlertTriangle, color: "amber" },
        { id: 4, type: "survey", title: "NPS survey completed", desc: "128 responses collected, avg score 72", time: "2 hrs ago", icon: CheckCircle, color: "indigo" },
        { id: 5, type: "target", title: "Monthly target reached", desc: "Revenue goal exceeded by 12%", time: "5 hrs ago", icon: TrendingUp, color: "emerald" },
    ];

    const engagementMetrics = [
        { name: "Email Open Rate", value: 68 },
        { name: "Feature Adoption", value: 54 },
        { name: "Support Resolved", value: 92 },
        { name: "Onboarding Complete", value: 79 },
    ];

    const satisfactionData = [
        { name: "Very Satisfied", value: 45, color: "#10B981" },
        { name: "Satisfied", value: 30, color: "#3B82F6" },
        { name: "Neutral", value: 15, color: "#94A3B8" },
        { name: "Dissatisfied", value: 10, color: "#EF4444" },
    ];

    const segmentChartData = [
        { name: "Enterprise", value: 3400, color: "#2563EB" },
        { name: "Mid-Market", value: 4200, color: "#60A5FA" },
        { name: "SMB", value: 2800, color: "#10B981" },
        { name: "Startup", value: 1900, color: "#34D399" },
    ];

    // Domain Configurations for dynamic UI
    const DOMAIN_CONFIG: any = {
        finance: {
            title: "Financial Insights",
            subtitle: "Revenue & transaction analysis",
            kpis: [
                { label: "Total Transactions", icon: ShoppingCart, color: "blue", format: "number" },
                { label: "Total Revenue", icon: DollarSign, color: "indigo", format: "currency" },
                { label: "Profit Margin", icon: TrendingUp, color: "emerald", format: "percent" },
                { label: "Market Score", icon: Sparkles, color: "amber", format: "text" }
            ],
            growthTitle: "Revenue & Market Growth"
        },
        health: {
            title: "Health Analytics",
            subtitle: "Patient vitals & wellness tracking",
            kpis: [
                { label: "Unique Patients", icon: Users, color: "blue", format: "number" },
                { label: "Avg Heart Rate (BPM)", icon: Zap, color: "rose", format: "number" },
                { label: "Recovery Rate", icon: TrendingUp, color: "emerald", format: "percent" },
                { label: "Wellness Score", icon: Sparkles, color: "amber", format: "text" }
            ],
            growthTitle: "Metric Trends & Patient Growth"
        },
        weather: {
            title: "Climate Overview",
            subtitle: "Environmental & weather patterns",
            kpis: [
                { label: "Reported Stations", icon: Users, color: "blue", format: "number" },
                { label: "Avg Temperature", icon: Zap, color: "orange", format: "number" },
                { label: "Precipitation Rate", icon: TrendingUp, color: "blue", format: "percent" },
                { label: "UV Severity", icon: Sparkles, color: "amber", format: "text" }
            ],
            growthTitle: "Environmental Variances"
        },
        business: {
            title: "Customer Insights",
            subtitle: "End-to-end analytics overview",
            kpis: [
                { label: "Total Customers", icon: Users, color: "blue", format: "number" },
                { label: "Total Revenue", icon: DollarSign, color: "indigo", format: "currency" },
                { label: "Retention Rate", icon: TrendingUp, color: "blue", format: "percent" },
                { label: "Satisfaction", icon: Sparkles, color: "amber", format: "text" }
            ],
            growthTitle: "Revenue & Customer Growth"
        }
    };

    const activeConfig = DOMAIN_CONFIG[domain] || DOMAIN_CONFIG.business;

    const kpiDisplayData = [
        { ...activeConfig.kpis[0], value: formatNumber(kpis.total_customers || 12486), trend: "+12.5%", isUp: true },
        {
            ...activeConfig.kpis[1],
            value: activeConfig.kpis[1].format === 'currency' ? formatCurrency(kpis.total_sales) : (kpis.total_sales?.toFixed(1) || "0"),
            trend: "+8.2%",
            isUp: true
        },
        { ...activeConfig.kpis[2], value: "94.2%", trend: "+2.1%", isUp: true },
        { ...activeConfig.kpis[3], value: "4.8 / 5", trend: "-0.1", isUp: false }
    ];

    return (
        <div className="space-y-8 animate-fade-in pb-12">

            {/* Dashboard Header Redesign */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-1">
                <div>
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">{activeConfig.title}</h2>
                    <p className="text-sm text-gray-400 font-semibold mt-1">{activeConfig.subtitle}</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm font-bold text-gray-600 shadow-sm transition-all hover:bg-gray-50 cursor-pointer">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        Last 30 days
                        <MoreHorizontal className="w-4 h-4 ml-6 text-gray-400" />
                    </div>
                    <button className="flex items-center bg-white border border-gray-200 rounded-xl px-6 py-2 text-sm font-bold text-gray-900 shadow-sm transition-all hover:bg-gray-50">
                        Export
                    </button>
                </div>
            </div>

            {/* Redesigned KPI Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {kpiDisplayData.map((kpi, i) => (
                    <div key={i} className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group">
                        <div className="flex justify-between items-start mb-4">
                            <p className="text-sm font-bold text-gray-400">{kpi.label}</p>
                            <div className={`p-2 bg-${kpi.color}-50 rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                                <kpi.icon className={`w-5 h-5 text-${kpi.color}-500`} />
                            </div>
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 mb-4">{kpi.value}</h3>
                        <div className="flex items-center gap-1 text-xs font-bold transition-all">
                            {kpi.isUp ? (
                                <span className="flex items-center text-emerald-500 font-black">
                                    <ArrowUpRight className="w-3 h-3 mr-0.5" /> {kpi.trend}
                                </span>
                            ) : (
                                <span className="flex items-center text-rose-500 font-black">
                                    <ArrowDownRight className="w-3 h-3 mr-0.5" /> {kpi.trend}
                                </span>
                            )}
                            <span className="text-gray-400 ml-1">vs last month</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Revenue & Customer Growth (Wavy Area Chart) */}
                <div className="lg:col-span-2 bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
                    <h3 className="text-xl font-bold text-gray-900 mb-8 tracking-tight">{activeConfig.growthTitle}</h3>
                    <div className="h-80 w-full ml-[-20px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trends} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                                <XAxis
                                    dataKey="date"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 11, fill: '#94A3B8', fontWeight: 600 }}
                                    dy={15}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 11, fill: '#94A3B8', fontWeight: 600 }}
                                    tickFormatter={(val) => `$${val > 999 ? (val / 1000).toFixed(1) + 'k' : val}`}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', padding: '12px' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="sales"
                                    stroke="#3B82F6"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorRevenue)"
                                />
                                <Area
                                    type="monotone"
                                    dataKey="users"
                                    stroke="#10B981"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorUsers)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Satisfaction Breakdown (Donut) */}
                <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 flex flex-col justify-between">
                    <h3 className="text-xl font-bold text-gray-900 mb-8 tracking-tight">Satisfaction Breakdown</h3>
                    <div className="h-64 w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={satisfactionData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {satisfactionData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="space-y-4 mt-8">
                        {satisfactionData.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                    <span className="text-sm font-bold text-gray-500">{item.name}</span>
                                </div>
                                <span className="text-sm font-black text-gray-900">{item.value}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Second Row: Customer Segments & Engagement Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Customer Segments (Bar Chart) */}
                <div className="lg:col-span-2 bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
                    <h3 className="text-xl font-bold text-gray-900 mb-8 tracking-tight">Customer Segments</h3>
                    <div className="h-72 w-full ml-[-20px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={segmentChartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 11, fill: '#94A3B8', fontWeight: 600 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 11, fill: '#94A3B8', fontWeight: 600 }}
                                />
                                <Tooltip />
                                <Bar dataKey="value" radius={[10, 10, 0, 0]} barSize={40}>
                                    {segmentChartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Engagement Metrics (Progress Bars) */}
                <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
                    <h3 className="text-xl font-bold text-gray-900 mb-8 tracking-tight">Engagement Metrics</h3>
                    <div className="space-y-8">
                        {engagementMetrics.map((metric, idx) => (
                            <div key={idx} className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-bold text-gray-500">{metric.name}</span>
                                    <span className="text-sm font-black text-gray-900">{metric.value}%</span>
                                </div>
                                <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-blue-600 rounded-full transition-all duration-1000 ease-out shadow-sm"
                                        style={{ width: `${metric.value}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Third Row: Recent Customers & Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Recent Customers Table */}
                <div className="lg:col-span-2 bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
                    <h3 className="text-xl font-bold text-gray-900 mb-8 tracking-tight">Recent Customers</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left border-b border-gray-50">
                                    <th className="pb-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Customer</th>
                                    <th className="pb-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">Segment</th>
                                    <th className="pb-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">LTV</th>
                                    <th className="pb-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">Status</th>
                                    <th className="pb-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Last Seen</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {recentCustomers.length > 0 ? (
                                    recentCustomers.map((customer: any, idx: number) => (
                                        <tr key={idx} className="group hover:bg-gray-50/50 transition-colors duration-200">
                                            <td className="py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-xs shadow-sm group-hover:scale-110 transition-transform">
                                                        {customer.initials || "??"}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-black text-gray-900 leading-tight">{customer.name || "N/A"}</p>
                                                        <p className="text-xs font-semibold text-gray-400 mt-0.5">{customer.email || "No email"}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 text-center">
                                                <span className="text-xs font-bold text-gray-400">{customer.segment || "General"}</span>
                                            </td>
                                            <td className="py-4 text-center">
                                                <span className="text-sm font-black text-gray-900">{formatCurrency(customer.ltv || 0)}</span>
                                            </td>
                                            <td className="py-4 text-center">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${customer.status === "Active" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
                                                    customer.status === "At Risk" ? "bg-amber-50 text-amber-600 border border-amber-100" :
                                                        "bg-rose-50 text-rose-600 border border-rose-100"
                                                    }`}>
                                                    {customer.status || "Active"}
                                                </span>
                                            </td>
                                            <td className="py-4 text-right">
                                                <span className="text-xs font-bold text-gray-400">{customer.lastSeen || "Recently"}</span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="py-12 text-center text-gray-400 font-semibold text-sm">
                                            No customer data found in this file.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Recent Activity List */}
                <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
                    <h3 className="text-xl font-bold text-gray-900 mb-8 tracking-tight">Recent Activity</h3>
                    <div className="space-y-8">
                        {recentActivity.map((activity, idx) => (
                            <div key={activity.id} className="flex gap-5 group cursor-pointer">
                                <div className={`flex-shrink-0 w-12 h-12 rounded-2xl bg-${activity.color}-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                                    <activity.icon className={`w-5 h-5 text-${activity.color}-500`} />
                                </div>
                                <div className="space-y-1">
                                    <div className="flex justify-between items-start gap-4">
                                        <h4 className="text-[13px] font-black text-gray-900 leading-snug group-hover:text-blue-600 transition-colors">{activity.title}</h4>
                                        <span className="flex-shrink-0 text-[10px] font-bold text-gray-400 whitespace-nowrap mt-0.5 uppercase tracking-wide">{activity.time}</span>
                                    </div>
                                    <p className="text-[12px] font-semibold text-gray-400 leading-normal">{activity.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Scenario Simulator */}
            <div className="pt-4">
                <SceneTitle title="Growth Simulator" />
                <ScenarioSimulator currentSales={kpis.total_sales} />
            </div>
        </div>
    );
}

// Subcomponent for Section Titles to keep clean
function SceneTitle({ title }: { title: string }) {
    return (
        <div className="flex items-center gap-4 mb-8">
            <div className="h-px flex-1 bg-gray-100" />
            <h3 className="text-xl font-black text-gray-900 tracking-tight px-4 uppercase text-[12px] tracking-[0.2em]">{title}</h3>
            <div className="h-px flex-1 bg-gray-100" />
        </div>
    )
}
