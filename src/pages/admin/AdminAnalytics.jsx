import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
};

// Simple bar chart component
function BarChart({ data, height = 200, barColor = 'heritage-terracotta', labelColor = 'heritage-gold' }) {
    const max = Math.max(...data.map(d => d.value));
    return (
        <div className="flex items-end gap-2 justify-between" style={{ height }}>
            {data.map((d, i) => (
                <div key={i} className="flex flex-col items-center gap-1 flex-1">
                    <span className={`text-xs font-semibold text-${labelColor}`}>{d.value > 999 ? `${(d.value / 1000).toFixed(1)}k` : d.value}</span>
                    <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${(d.value / max) * (height - 40)}px` }}
                        transition={{ duration: 0.8, delay: i * 0.05 }}
                        className={`w-full bg-${barColor} rounded-t-md min-h-[4px]`}
                        style={{ backgroundColor: barColor === 'heritage-terracotta' ? '#8B0000' : '#D9A441' }}
                    />
                    <span className="text-xs text-gray-500 truncate">{d.label}</span>
                </div>
            ))}
        </div>
    );
}

// Line chart simulation using SVG
function LineChart({ data, height = 200, color = '#8B0000', gradientId = 'maroonGrad' }) {
    const max = Math.max(...data.map(d => d.value));
    const min = Math.min(...data.map(d => d.value));
    const range = max - min || 1;
    const w = 600;
    const h = height - 30;
    const points = data.map((d, i) => ({
        x: (i / (data.length - 1)) * w,
        y: h - ((d.value - min) / range) * (h - 20) - 10
    }));
    const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    const areaD = pathD + ` L ${w} ${h} L 0 ${h} Z`;

    return (
        <div style={{ width: '100%', height }}>
            <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
                <defs>
                    <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                        <stop offset="100%" stopColor={color} stopOpacity="0.05" />
                    </linearGradient>
                </defs>
                <path d={areaD} fill={`url(#${gradientId})`} />
                <path d={pathD} fill="none" stroke={color} strokeWidth="3" />
                {points.map((p, i) => (
                    <circle key={i} cx={p.x} cy={p.y} r="4" fill={color} stroke="white" strokeWidth="2" />
                ))}
            </svg>
            <div className="flex justify-between mt-1">
                {data.map((d, i) => (
                    <span key={i} className="text-xs text-gray-500">{d.label}</span>
                ))}
            </div>
        </div>
    );
}

// Donut chart using CSS
function DonutChart({ segments, size = 120, centerLabel, centerValue }) {
    const total = segments.reduce((s, seg) => s + seg.value, 0);
    let cumulative = 0;
    const gradientStops = segments.map(seg => {
        const start = (cumulative / total) * 100;
        cumulative += seg.value;
        const end = (cumulative / total) * 100;
        return `${seg.color} ${start}% ${end}%`;
    }).join(', ');

    return (
        <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
            <div
                className="rounded-full"
                style={{
                    width: size,
                    height: size,
                    background: `conic-gradient(${gradientStops})`,
                }}
            />
            <div
                className="absolute rounded-full bg-white flex flex-col items-center justify-center"
                style={{ width: size * 0.6, height: size * 0.6 }}
            >
                <span className="text-lg font-bold text-heritage-terracottaDark">{centerValue}</span>
                <span className="text-xs text-gray-500">{centerLabel}</span>
            </div>
        </div>
    );
}

// Progress ring component
function ProgressRing({ percentage, size = 80, color = '#8B0000', label }) {
    const strokeWidth = 6;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className="flex flex-col items-center gap-1">
            <div className="relative" style={{ width: size, height: size }}>
                <svg width={size} height={size} className="-rotate-90">
                    <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#e5e7eb" strokeWidth={strokeWidth} />
                    <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth={strokeWidth}
                        strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
                        style={{ transition: 'stroke-dashoffset 1s ease' }} />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-bold" style={{ color }}>{percentage}%</span>
                </div>
            </div>
            <span className="text-xs text-gray-500">{label}</span>
        </div>
    );
}

export default function AdminAnalytics() {
    const [timeRange, setTimeRange] = useState('30d');
    const [activeTab, setActiveTab] = useState('overview');
    const [leaderboard, setLeaderboard] = useState([]);
    const [topSubmitters, setTopSubmitters] = useState([]);
    const [mostInnovative, setMostInnovative] = useState([]);
    const [leaderboardLoading, setLeaderboardLoading] = useState(false);

    useEffect(() => {
        if (activeTab !== 'leaderboard') return;
        setLeaderboardLoading(true);
        const { dashboardAPI } = require('@/api');
        Promise.allSettled([
            dashboardAPI.getLeaderboard(),
            dashboardAPI.getTopSubmitters(),
            dashboardAPI.getMostInnovative(),
        ]).then(([lb, ts, mi]) => {
            if (lb.status === 'fulfilled') setLeaderboard(lb.value.data.data || []);
            if (ts.status === 'fulfilled') setTopSubmitters(ts.value.data.data || []);
            if (mi.status === 'fulfilled') setMostInnovative(mi.value.data.data || []);
        }).finally(() => setLeaderboardLoading(false));
    }, [activeTab]);

    // Mock analytics data
    const userGrowthData = [
        { label: 'Jan', value: 120 },
        { label: 'Feb', value: 185 },
        { label: 'Mar', value: 240 },
        { label: 'Apr', value: 310 },
        { label: 'May', value: 420 },
        { label: 'Jun', value: 580 },
        { label: 'Jul', value: 750 },
        { label: 'Aug', value: 920 },
        { label: 'Sep', value: 1100 },
        { label: 'Oct', value: 1350 },
        { label: 'Nov', value: 1580 },
        { label: 'Dec', value: 1850 },
    ];

    const contentSubmissionData = [
        { label: 'Jan', value: 45 },
        { label: 'Feb', value: 62 },
        { label: 'Mar', value: 78 },
        { label: 'Apr', value: 95 },
        { label: 'May', value: 130 },
        { label: 'Jun', value: 145 },
        { label: 'Jul', value: 180 },
        { label: 'Aug', value: 210 },
        { label: 'Sep', value: 195 },
        { label: 'Oct', value: 240 },
        { label: 'Nov', value: 280 },
        { label: 'Dec', value: 320 },
    ];

    const engagementData = [
        { label: 'Mon', value: 340 },
        { label: 'Tue', value: 520 },
        { label: 'Wed', value: 480 },
        { label: 'Thu', value: 610 },
        { label: 'Fri', value: 750 },
        { label: 'Sat', value: 890 },
        { label: 'Sun', value: 720 },
    ];

    const revenueData = [
        { label: 'Q1', value: 45000 },
        { label: 'Q2', value: 68000 },
        { label: 'Q3', value: 82000 },
        { label: 'Q4', value: 95000 },
    ];

    const userTypeSegments = [
        { label: 'Members', value: 1200, color: '#8B0000' },
        { label: 'Artists', value: 350, color: '#D9A441' },
        { label: 'Corporate', value: 180, color: '#4A7C59' },
        { label: 'Guests', value: 120, color: '#6B7280' },
    ];

    const contentTypeSegments = [
        { label: 'Artworks', value: 420, color: '#8B0000' },
        { label: 'Videos', value: 180, color: '#D9A441' },
        { label: 'Blog Posts', value: 95, color: '#4A7C59' },
        { label: 'Community', value: 340, color: '#7C3AED' },
        { label: 'Learning', value: 120, color: '#2563EB' },
    ];

    const moderationSegments = [
        { label: 'Approved', value: 780, color: '#4A7C59' },
        { label: 'Pending', value: 120, color: '#D9A441' },
        { label: 'Rejected', value: 50, color: '#DC2626' },
    ];

    const programEnrollmentData = [
        { label: 'Mindful Art', value: 280 },
        { label: 'Folk Art', value: 195 },
        { label: 'Heritage Walk', value: 145 },
        { label: 'Digital Art', value: 120 },
        { label: 'Meditation', value: 310 },
        { label: 'Workshop', value: 90 },
    ];

    const topPages = [
        { page: '/programs/mindful-art', views: 3420, unique: 2180, avgTime: '4:32' },
        { page: '/gallery', views: 2890, unique: 1950, avgTime: '3:18' },
        { page: '/about', views: 2100, unique: 1800, avgTime: '2:45' },
        { page: '/programs', views: 1850, unique: 1420, avgTime: '3:05' },
        { page: '/blog/heritage-preservation', views: 1620, unique: 1280, avgTime: '5:12' },
        { page: '/artisan-connect', views: 1400, unique: 1100, avgTime: '2:58' },
        { page: '/corporate', views: 980, unique: 720, avgTime: '3:42' },
        { page: '/contact', views: 850, unique: 680, avgTime: '1:55' },
    ];

    const emailMetrics = [
        { type: 'Welcome Email', sent: 1850, opened: 1420, clicked: 380, openRate: '76.8%', clickRate: '20.5%' },
        { type: 'Program Notification', sent: 2400, opened: 1680, clicked: 520, openRate: '70.0%', clickRate: '21.7%' },
        { type: 'Event Reminder', sent: 980, opened: 810, clicked: 290, openRate: '82.7%', clickRate: '29.6%' },
        { type: 'Certificate Issued', sent: 620, opened: 580, clicked: 180, openRate: '93.5%', clickRate: '29.0%' },
        { type: 'Community Digest', sent: 3200, opened: 2100, clicked: 640, openRate: '65.6%', clickRate: '20.0%' },
    ];

    const kpiCards = [
        { title: 'Total Users', value: '1,850', change: '+23.5%', changeType: 'up', icon: '👥', color: 'heritage-terracotta' },
        { title: 'Active Members', value: '1,200', change: '+18.2%', changeType: 'up', icon: '✅', color: 'heritage-gold' },
        { title: 'Content Items', value: '1,155', change: '+32.1%', changeType: 'up', icon: '🎨', color: 'heritage-terracotta' },
        { title: 'Monthly Revenue', value: '₹95K', change: '+15.8%', changeType: 'up', icon: '💰', color: 'heritage-gold' },
        { title: 'Avg Engagement', value: '8.4 min', change: '+5.2%', changeType: 'up', icon: '📊', color: 'heritage-terracotta' },
        { title: 'Completion Rate', value: '72%', change: '+8.5%', changeType: 'up', icon: '🏆', color: 'heritage-gold' },
        { title: 'Pending Reviews', value: '120', change: '-12.3%', changeType: 'down', icon: '⏳', color: 'heritage-terracotta' },
        { title: 'Bounce Rate', value: '24.5%', change: '-3.8%', changeType: 'down', icon: '📉', color: 'heritage-gold' },
    ];

    const timeRangeOptions = [
        { value: '7d', label: 'Last 7 Days' },
        { value: '30d', label: 'Last 30 Days' },
        { value: '90d', label: 'Last 90 Days' },
        { value: '1y', label: 'Last Year' },
        { value: 'all', label: 'All Time' },
    ];

    const tabs = [
        { value: 'overview', label: 'Overview' },
        { value: 'users', label: 'Users' },
        { value: 'content', label: 'Content' },
        { value: 'engagement', label: 'Engagement' },
        { value: 'email', label: 'Email' },
        { value: 'leaderboard', label: '🏆 Leaderboard' },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div {...fadeInUp} className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-heritage-terracottaDark">Analytics & Insights</h1>
                    <p className="text-gray-500 mt-1">Platform performance metrics and growth indicators</p>
                </div>
                <div className="flex gap-2">
                    {timeRangeOptions.map(opt => (
                        <button
                            key={opt.value}
                            onClick={() => setTimeRange(opt.value)}
                            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${timeRange === opt.value
                                    ? 'bg-heritage-terracotta text-text-main'
                                    : 'bg-white text-gray-600 border border-gray-200 hover:border-heritage-terracotta/30'
                                }`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            </motion.div>

            {/* Tabs */}
            <motion.div {...fadeInUp} className="flex gap-1 bg-white rounded-lg p-1 border border-gray-100 shadow-sm">
                {tabs.map(tab => (
                    <button
                        key={tab.value}
                        onClick={() => setActiveTab(tab.value)}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === tab.value
                                ? 'bg-heritage-terracotta text-text-main'
                                : 'text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </motion.div>

            {/* KPI Cards */}
            <motion.div {...fadeInUp} className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {kpiCards.map((kpi, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: i * 0.05 }}
                        className="bg-white rounded-lg border border-gray-100 shadow-sm p-4"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-2xl">{kpi.icon}</span>
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${kpi.changeType === 'up'
                                    ? 'bg-green-50 text-green-600'
                                    : 'bg-blue-50 text-blue-600'
                                }`}>
                                {kpi.change}
                            </span>
                        </div>
                        <div className="text-xl font-bold text-gray-900">{kpi.value}</div>
                        <div className="text-sm text-gray-500">{kpi.title}</div>
                    </motion.div>
                ))}
            </motion.div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
                <div className="space-y-6">
                    {/* Charts Row 1 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* User Growth */}
                        <motion.div {...fadeInUp} className="bg-white rounded-lg border border-gray-100 shadow-sm p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-heritage-terracottaDark">User Growth</h3>
                                <span className="text-xs text-gray-500">Monthly registrations</span>
                            </div>
                            <LineChart data={userGrowthData} height={220} color="#8B0000" gradientId="userGrowthGrad" />
                        </motion.div>

                        {/* Content Submissions */}
                        <motion.div {...fadeInUp} className="bg-white rounded-lg border border-gray-100 shadow-sm p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-heritage-terracottaDark">Content Submissions</h3>
                                <span className="text-xs text-gray-500">Monthly submissions</span>
                            </div>
                            <LineChart data={contentSubmissionData} height={220} color="#D9A441" gradientId="contentGrad" />
                        </motion.div>
                    </div>

                    {/* Charts Row 2 */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* User Types Donut */}
                        <motion.div {...fadeInUp} className="bg-white rounded-lg border border-gray-100 shadow-sm p-6">
                            <h3 className="text-lg font-semibold text-heritage-terracottaDark mb-4">User Distribution</h3>
                            <div className="flex items-center gap-4">
                                <DonutChart segments={userTypeSegments} size={140} centerLabel="Total" centerValue="1,850" />
                                <div className="space-y-2">
                                    {userTypeSegments.map((seg, i) => (
                                        <div key={i} className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: seg.color }} />
                                            <span className="text-sm text-gray-600">{seg.label}: {seg.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>

                        {/* Content Types Donut */}
                        <motion.div {...fadeInUp} className="bg-white rounded-lg border border-gray-100 shadow-sm p-6">
                            <h3 className="text-lg font-semibold text-heritage-terracottaDark mb-4">Content Distribution</h3>
                            <div className="flex items-center gap-4">
                                <DonutChart segments={contentTypeSegments} size={140} centerLabel="Items" centerValue="1,155" />
                                <div className="space-y-2">
                                    {contentTypeSegments.map((seg, i) => (
                                        <div key={i} className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: seg.color }} />
                                            <span className="text-sm text-gray-600">{seg.label}: {seg.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>

                        {/* Moderation Status */}
                        <motion.div {...fadeInUp} className="bg-white rounded-lg border border-gray-100 shadow-sm p-6">
                            <h3 className="text-lg font-semibold text-heritage-terracottaDark mb-4">Moderation Status</h3>
                            <div className="flex items-center gap-4">
                                <DonutChart segments={moderationSegments} size={140} centerLabel="Total" centerValue="950" />
                                <div className="space-y-2">
                                    {moderationSegments.map((seg, i) => (
                                        <div key={i} className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: seg.color }} />
                                            <span className="text-sm text-gray-600">{seg.label}: {seg.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Revenue & Program Enrollment */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Revenue */}
                        <motion.div {...fadeInUp} className="bg-white rounded-lg border border-gray-100 shadow-sm p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-heritage-terracottaDark">Revenue Overview</h3>
                                <span className="text-xs text-gray-500">Quarterly revenue (₹)</span>
                            </div>
                            <BarChart data={revenueData} height={200} barColor="heritage-gold" />
                        </motion.div>

                        {/* Program Enrollment */}
                        <motion.div {...fadeInUp} className="bg-white rounded-lg border border-gray-100 shadow-sm p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-heritage-terracottaDark">Program Enrollment</h3>
                                <span className="text-xs text-gray-500">Active enrollments</span>
                            </div>
                            <BarChart data={programEnrollmentData} height={200} barColor="heritage-terracotta" />
                        </motion.div>
                    </div>

                    {/* Platform Health */}
                    <motion.div {...fadeInUp} className="bg-white rounded-lg border border-gray-100 shadow-sm p-6">
                        <h3 className="text-lg font-semibold text-heritage-terracottaDark mb-6">Platform Health Indicators</h3>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 justify-items-center">
                            <ProgressRing percentage={92} color="#8B0000" label="Server Uptime" />
                            <ProgressRing percentage={78} color="#D9A441" label="User Satisfaction" />
                            <ProgressRing percentage={72} color="#4A7C59" label="Completion Rate" />
                            <ProgressRing percentage={85} color="#2563EB" label="Email Delivery" />
                            <ProgressRing percentage={68} color="#7C3AED" label="Community Activity" />
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* User Growth Over Time */}
                        <motion.div {...fadeInUp} className="bg-white rounded-lg border border-gray-100 shadow-sm p-6">
                            <h3 className="text-lg font-semibold text-heritage-terracottaDark mb-4">Registration Trend</h3>
                            <LineChart data={userGrowthData} height={240} color="#8B0000" gradientId="userRegGrad" />
                        </motion.div>

                        {/* User Distribution */}
                        <motion.div {...fadeInUp} className="bg-white rounded-lg border border-gray-100 shadow-sm p-6">
                            <h3 className="text-lg font-semibold text-heritage-terracottaDark mb-4">User Type Breakdown</h3>
                            <div className="flex items-center justify-center gap-6">
                                <DonutChart segments={userTypeSegments} size={180} centerLabel="Total" centerValue="1,850" />
                                <div className="space-y-3">
                                    {userTypeSegments.map((seg, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: seg.color }} />
                                            <div>
                                                <span className="text-sm font-medium text-gray-900">{seg.label}</span>
                                                <span className="text-sm text-gray-500 ml-2">{seg.value} ({((seg.value / 1850) * 100).toFixed(1)}%)</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* User Activity Stats */}
                    <motion.div {...fadeInUp} className="bg-white rounded-lg border border-gray-100 shadow-sm p-6">
                        <h3 className="text-lg font-semibold text-heritage-terracottaDark mb-4">User Activity Overview</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { label: 'Daily Active', value: '420', icon: '☀️', color: '#D9A441' },
                                { label: 'Weekly Active', value: '980', icon: '📅', color: '#8B0000' },
                                { label: 'Monthly Active', value: '1,200', icon: '📆', color: '#4A7C59' },
                                { label: 'New This Month', value: '185', icon: '🆕', color: '#2563EB' },
                            ].map((stat, i) => (
                                <div key={i} className="bg-gray-50 rounded-lg p-4 text-center border-l-4" style={{ borderColor: stat.color }}>
                                    <span className="text-2xl">{stat.icon}</span>
                                    <div className="text-xl font-bold text-gray-900 mt-2">{stat.value}</div>
                                    <div className="text-sm text-gray-500">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* User Retention */}
                    <motion.div {...fadeInUp} className="bg-white rounded-lg border border-gray-100 shadow-sm p-6">
                        <h3 className="text-lg font-semibold text-heritage-terracottaDark mb-4">User Retention Rates</h3>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 justify-items-center">
                            <ProgressRing percentage={85} color="#8B0000" label="Week 1" />
                            <ProgressRing percentage={72} color="#D9A441" label="Week 2" />
                            <ProgressRing percentage={58} color="#4A7C59" label="Month 1" />
                            <ProgressRing percentage={42} color="#2563EB" label="Month 3" />
                            <ProgressRing percentage={28} color="#7C3AED" label="Month 6" />
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Content Tab */}
            {activeTab === 'content' && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Content Submissions Trend */}
                        <motion.div {...fadeInUp} className="bg-white rounded-lg border border-gray-100 shadow-sm p-6">
                            <h3 className="text-lg font-semibold text-heritage-terracottaDark mb-4">Submission Trend</h3>
                            <LineChart data={contentSubmissionData} height={240} color="#D9A441" gradientId="contentSubGrad" />
                        </motion.div>

                        {/* Content Type Distribution */}
                        <motion.div {...fadeInUp} className="bg-white rounded-lg border border-gray-100 shadow-sm p-6">
                            <h3 className="text-lg font-semibold text-heritage-terracottaDark mb-4">Content Type Breakdown</h3>
                            <div className="flex items-center justify-center gap-6">
                                <DonutChart segments={contentTypeSegments} size={180} centerLabel="Items" centerValue="1,155" />
                                <div className="space-y-3">
                                    {contentTypeSegments.map((seg, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: seg.color }} />
                                            <div>
                                                <span className="text-sm font-medium text-gray-900">{seg.label}</span>
                                                <span className="text-sm text-gray-500 ml-2">{seg.value} ({((seg.value / 1155) * 100).toFixed(1)}%)</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Moderation Overview */}
                    <motion.div {...fadeInUp} className="bg-white rounded-lg border border-gray-100 shadow-sm p-6">
                        <h3 className="text-lg font-semibold text-heritage-terracottaDark mb-4">Moderation Pipeline</h3>
                        <div className="grid grid-cols-3 gap-4">
                            {[
                                { label: 'Approved', value: 780, total: 950, color: '#4A7C59', icon: '✅' },
                                { label: 'Pending Review', value: 120, total: 950, color: '#D9A441', icon: '⏳' },
                                { label: 'Rejected', value: 50, total: 950, color: '#DC2626', icon: '❌' },
                            ].map((item, i) => (
                                <div key={i} className="bg-gray-50 rounded-lg p-4 border-l-4" style={{ borderColor: item.color }}>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-xl">{item.icon}</span>
                                        <span className="text-sm font-medium text-gray-700">{item.label}</span>
                                    </div>
                                    <div className="text-2xl font-bold text-gray-900">{item.value}</div>
                                    <div className="mt-2">
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div className="h-2 rounded-full" style={{ width: `${(item.value / item.total) * 100}%`, backgroundColor: item.color }} />
                                        </div>
                                        <span className="text-xs text-gray-500 mt-1">{((item.value / item.total) * 100).toFixed(1)}% of total</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Top Content */}
                    <motion.div {...fadeInUp} className="bg-white rounded-lg border border-gray-100 shadow-sm p-6">
                        <h3 className="text-lg font-semibold text-heritage-terracottaDark mb-4">Top Performing Content</h3>
                        <div className="space-y-3">
                            {[
                                { title: 'Madhubani Art Collection', type: 'Artwork', views: 4200, likes: 380, author: 'Priya Sharma' },
                                { title: 'Heritage Preservation Documentary', type: 'Video', views: 3100, likes: 290, author: 'Ravi Kumar' },
                                { title: 'The Art of Mindful Living', type: 'Blog', views: 2800, likes: 220, author: 'Ananya Iyer' },
                                { title: 'Warli Painting Tutorial', type: 'Learning', views: 2100, likes: 180, author: 'Meena Patel' },
                                { title: 'Community Art Challenge #12', type: 'Community', views: 1800, likes: 420, author: 'Various Artists' },
                            ].map((content, i) => (
                                <div key={i} className="flex items-center gap-4 bg-gray-50 rounded-lg p-3 border border-gray-100">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-heritage-terracotta/10 text-heritage-terracottaDark flex items-center justify-center text-sm font-bold">
                                        {i + 1}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-medium text-gray-900 truncate">{content.title}</div>
                                        <div className="text-xs text-gray-500">{content.author} · {content.type}</div>
                                    </div>
                                    <div className="flex items-center gap-4 text-xs text-gray-500">
                                        <span>👁 {content.views.toLocaleString()}</span>
                                        <span>❤️ {content.likes}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Engagement Tab */}
            {activeTab === 'engagement' && (
                <div className="space-y-6">
                    {/* Weekly Engagement */}
                    <motion.div {...fadeInUp} className="bg-white rounded-lg border border-gray-100 shadow-sm p-6">
                        <h3 className="text-lg font-semibold text-heritage-terracottaDark mb-4">Weekly Engagement Pattern</h3>
                        <BarChart data={engagementData} height={240} barColor="heritage-terracotta" />
                    </motion.div>

                    {/* Top Pages Table */}
                    <motion.div {...fadeInUp} className="bg-white rounded-lg border border-gray-100 shadow-sm p-6">
                        <h3 className="text-lg font-semibold text-heritage-terracottaDark mb-4">Top Pages by Traffic</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-100">
                                        <th className="text-left text-xs font-medium text-gray-500 py-3 px-2">#</th>
                                        <th className="text-left text-xs font-medium text-gray-500 py-3 px-2">Page</th>
                                        <th className="text-right text-xs font-medium text-gray-500 py-3 px-2">Pageviews</th>
                                        <th className="text-right text-xs font-medium text-gray-500 py-3 px-2">Unique</th>
                                        <th className="text-right text-xs font-medium text-gray-500 py-3 px-2">Avg Time</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {topPages.map((page, i) => (
                                        <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                                            <td className="py-3 px-2 text-sm font-medium text-heritage-terracottaDark">{i + 1}</td>
                                            <td className="py-3 px-2 text-sm text-gray-900 font-medium">{page.page}</td>
                                            <td className="py-3 px-2 text-sm text-gray-600 text-right">{page.views.toLocaleString()}</td>
                                            <td className="py-3 px-2 text-sm text-gray-600 text-right">{page.unique.toLocaleString()}</td>
                                            <td className="py-3 px-2 text-sm text-gray-600 text-right">{page.avgTime}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>

                    {/* Engagement Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Session Metrics */}
                        <motion.div {...fadeInUp} className="bg-white rounded-lg border border-gray-100 shadow-sm p-6">
                            <h3 className="text-lg font-semibold text-heritage-terracottaDark mb-4">Session Metrics</h3>
                            <div className="space-y-4">
                                {[
                                    { label: 'Avg Session Duration', value: '8.4 min', percentage: 84, color: '#8B0000' },
                                    { label: 'Pages per Session', value: '4.2', percentage: 70, color: '#D9A441' },
                                    { label: 'Return Visitor Rate', value: '62%', percentage: 62, color: '#4A7C59' },
                                    { label: 'Mobile Traffic', value: '45%', percentage: 45, color: '#2563EB' },
                                ].map((metric, i) => (
                                    <div key={i} className="flex items-center gap-4">
                                        <ProgressRing percentage={metric.percentage} size={60} color={metric.color} />
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">{metric.label}</div>
                                            <div className="text-lg font-bold" style={{ color: metric.color }}>{metric.value}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Device & Browser Breakdown */}
                        <motion.div {...fadeInUp} className="bg-white rounded-lg border border-gray-100 shadow-sm p-6">
                            <h3 className="text-lg font-semibold text-heritage-terracottaDark mb-4">Device Breakdown</h3>
                            <div className="space-y-4">
                                {[
                                    { label: 'Desktop', value: '55%', icon: '🖥️', color: '#8B0000', width: '55%' },
                                    { label: 'Mobile', value: '38%', icon: '📱', color: '#D9A441', width: '38%' },
                                    { label: 'Tablet', value: '7%', icon: '📲', color: '#4A7C59', width: '7%' },
                                ].map((device, i) => (
                                    <div key={i}>
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-sm text-gray-700">{device.icon} {device.label}</span>
                                            <span className="text-sm font-semibold" style={{ color: device.color }}>{device.value}</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-3">
                                            <div className="h-3 rounded-full transition-all" style={{ width: device.width, backgroundColor: device.color }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <h4 className="text-sm font-semibold text-gray-700 mt-6 mb-3">Top Browsers</h4>
                            <div className="space-y-2">
                                {[
                                    { label: 'Chrome', value: '68%', color: '#8B0000' },
                                    { label: 'Safari', value: '18%', color: '#D9A441' },
                                    { label: 'Firefox', value: '8%', color: '#4A7C59' },
                                    { label: 'Edge', value: '6%', color: '#2563EB' },
                                ].map((browser, i) => (
                                    <div key={i} className="flex items-center justify-between">
                                        <span className="text-xs text-gray-600">{browser.label}</span>
                                        <div className="flex items-center gap-2">
                                            <div className="w-24 bg-gray-200 rounded-full h-1.5">
                                                <div className="h-1.5 rounded-full" style={{ width: browser.value, backgroundColor: browser.color }} />
                                            </div>
                                            <span className="text-xs font-medium text-gray-700">{browser.value}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            )}

            {/* Email Tab */}
            {activeTab === 'email' && (
                <div className="space-y-6">
                    {/* Email KPIs */}
                    <motion.div {...fadeInUp} className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { label: 'Total Sent', value: '10,050', icon: '📤', color: '#8B0000' },
                            { label: 'Avg Open Rate', value: '74.4%', icon: '👁️', color: '#D9A441' },
                            { label: 'Avg Click Rate', value: '22.5%', icon: '🖱️', color: '#4A7C59' },
                            { label: 'Bounce Rate', value: '2.3%', icon: '↩️', color: '#DC2626' },
                        ].map((kpi, i) => (
                            <div key={i} className="bg-white rounded-lg border border-gray-100 shadow-sm p-4 border-l-4" style={{ borderColor: kpi.color }}>
                                <span className="text-2xl">{kpi.icon}</span>
                                <div className="text-xl font-bold text-gray-900 mt-2">{kpi.value}</div>
                                <div className="text-sm text-gray-500">{kpi.label}</div>
                            </div>
                        ))}
                    </motion.div>

                    {/* Email Campaign Table */}
                    <motion.div {...fadeInUp} className="bg-white rounded-lg border border-gray-100 shadow-sm p-6">
                        <h3 className="text-lg font-semibold text-heritage-terracottaDark mb-4">Email Campaign Performance</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-100">
                                        <th className="text-left text-xs font-medium text-gray-500 py-3 px-2">Campaign Type</th>
                                        <th className="text-right text-xs font-medium text-gray-500 py-3 px-2">Sent</th>
                                        <th className="text-right text-xs font-medium text-gray-500 py-3 px-2">Opened</th>
                                        <th className="text-right text-xs font-medium text-gray-500 py-3 px-2">Clicked</th>
                                        <th className="text-right text-xs font-medium text-gray-500 py-3 px-2">Open Rate</th>
                                        <th className="text-right text-xs font-medium text-gray-500 py-3 px-2">Click Rate</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {emailMetrics.map((email, i) => (
                                        <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                                            <td className="py-3 px-2 text-sm font-medium text-gray-900">{email.type}</td>
                                            <td className="py-3 px-2 text-sm text-gray-600 text-right">{email.sent.toLocaleString()}</td>
                                            <td className="py-3 px-2 text-sm text-gray-600 text-right">{email.opened.toLocaleString()}</td>
                                            <td className="py-3 px-2 text-sm text-gray-600 text-right">{email.clicked.toLocaleString()}</td>
                                            <td className="py-3 px-2 text-right">
                                                <span className="text-sm font-medium text-green-600">{email.openRate}</span>
                                            </td>
                                            <td className="py-3 px-2 text-right">
                                                <span className="text-sm font-medium text-blue-600">{email.clickRate}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>

                    {/* Email Delivery Health */}
                    <motion.div {...fadeInUp} className="bg-white rounded-lg border border-gray-100 shadow-sm p-6">
                        <h3 className="text-lg font-semibold text-heritage-terracottaDark mb-4">Email Delivery Health</h3>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 justify-items-center">
                            <ProgressRing percentage={97.7} color="#8B0000" label="Delivery Rate" />
                            <ProgressRing percentage={74.4} color="#D9A441" label="Open Rate" />
                            <ProgressRing percentage={22.5} color="#4A7C59" label="Click Rate" />
                            <ProgressRing percentage={2.3} color="#DC2626" label="Bounce Rate" />
                            <ProgressRing percentage={0.8} color="#6B7280" label="Spam Rate" />
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Export Section */}
            <motion.div {...fadeInUp} className="bg-white rounded-lg border border-gray-100 shadow-sm p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-heritage-terracottaDark">Export Reports</h3>
                        <p className="text-sm text-gray-500 mt-1">Download detailed analytics reports for offline analysis</p>
                    </div>
                    <div className="flex gap-3">
                        {[
                            { label: 'User Report', icon: '👥', format: 'CSV' },
                            { label: 'Content Report', icon: '🎨', format: 'CSV' },
                            { label: 'Revenue Report', icon: '💰', format: 'CSV' },
                            { label: 'Full Report', icon: '📊', format: 'PDF' },
                        ].map((report, i) => (
                            <button
                                key={i}
                                className="flex items-center gap-2 px-4 py-2 bg-heritage-terracotta/5 text-heritage-terracottaDark rounded-md hover:bg-heritage-terracotta/10 transition-colors border border-heritage-terracotta/20"
                            >
                                <span>{report.icon}</span>
                                <span className="text-sm font-medium">{report.label}</span>
                                <span className="text-xs text-gray-500">({report.format})</span>
                            </button>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* TODO: Replace all mock data with real API calls */}
            <div className="text-center text-xs text-gray-400 py-4">
                Analytics data shown is for demonstration purposes. Connect to backend API for real metrics.
            </div>

            {/* Leaderboard Tab */}
            {activeTab === 'leaderboard' && (
                <div className="space-y-6">
                    {leaderboardLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="w-8 h-8 rounded-full border-4 border-heritage-gold border-t-transparent animate-spin" />
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-3 gap-6">
                            {/* Top Attendees */}
                            <motion.div {...fadeInUp} className="bg-white rounded-lg border border-gray-100 shadow-sm p-6">
                                <h3 className="text-lg font-semibold text-heritage-terracottaDark mb-4 flex items-center gap-2">
                                    🏅 Top Attendees
                                </h3>
                                {leaderboard.length === 0 ? (
                                    <p className="text-sm text-gray-400 text-center py-6">No attendance data yet.</p>
                                ) : (
                                    <div className="space-y-3">
                                        {leaderboard.slice(0, 10).map((entry, i) => (
                                            <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                                                <span className="text-lg">{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`}</span>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-900 truncate">{entry.name || entry.user?.name || 'Unknown'}</p>
                                                    <p className="text-xs text-gray-500">{entry.attendanceCount || entry.count || 0} sessions</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </motion.div>

                            {/* Top Submitters */}
                            <motion.div {...fadeInUp} className="bg-white rounded-lg border border-gray-100 shadow-sm p-6">
                                <h3 className="text-lg font-semibold text-heritage-terracottaDark mb-4 flex items-center gap-2">
                                    🎨 Top Submitters
                                </h3>
                                {topSubmitters.length === 0 ? (
                                    <p className="text-sm text-gray-400 text-center py-6">No submission data yet.</p>
                                ) : (
                                    <div className="space-y-3">
                                        {topSubmitters.slice(0, 10).map((entry, i) => (
                                            <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                                                <span className="text-lg">{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`}</span>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-900 truncate">{entry.name || entry.user?.name || 'Unknown'}</p>
                                                    <p className="text-xs text-gray-500">{entry.submissionCount || entry.count || 0} artworks</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </motion.div>

                            {/* Most Innovative */}
                            <motion.div {...fadeInUp} className="bg-white rounded-lg border border-gray-100 shadow-sm p-6">
                                <h3 className="text-lg font-semibold text-heritage-terracottaDark mb-4 flex items-center gap-2">
                                    ⭐ Most Innovative
                                </h3>
                                {mostInnovative.length === 0 ? (
                                    <p className="text-sm text-gray-400 text-center py-6">No innovative artworks awarded yet.</p>
                                ) : (
                                    <div className="space-y-3">
                                        {mostInnovative.slice(0, 10).map((entry, i) => (
                                            <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                                                <span className="text-lg">{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`}</span>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-900 truncate">{entry.title || entry.artwork?.title || 'Untitled'}</p>
                                                    <p className="text-xs text-gray-500">by {entry.artistName || entry.artist?.name || 'Unknown'}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}