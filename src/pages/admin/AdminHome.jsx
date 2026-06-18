import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    LayoutDashboard, Users, BookOpen, Palette, Video, Award,
    MessageCircle, Star, TrendingUp, Calendar, Mail, Building2,
    Eye, Clock, BarChart3, AlertCircle, CheckCircle2,
    ArrowUpRight, ArrowDownRight, Activity, Globe
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { userAPI, programAPI, artworkAPI, videoAPI, communityAPI, blogAPI, certificateAPI, contactAPI, corporateAPI, eventAPI } from '@/api';

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
};

const fallbackStats = {
    totalUsers: 1247,
    newUsersThisWeek: 34,
    totalPrograms: 15,
    activePrograms: 8,
    pendingArtworks: 12,
    pendingVideos: 5,
    pendingCommunityPosts: 8,
    totalBlogPosts: 45,
    totalCertificates: 89,
    contactInquiries: 23,
    corporateLeads: 7,
    totalEvents: 6,
};

const fallbackRecentActivity = [
    { id: 1, type: 'user', message: 'New member registered: Arun Kumar', time: '15 min ago', icon: Users, color: 'text-blue-600' },
    { id: 2, type: 'artwork', message: 'Artwork submitted for review: "Mysore Palace Sketch"', time: '30 min ago', icon: Palette, color: 'text-purple-600' },
    { id: 3, type: 'video', message: 'Video submitted: "Warli Painting Tutorial"', time: '1 hour ago', icon: Video, color: 'text-red-600' },
    { id: 4, type: 'contact', message: 'New inquiry from corporate partner: Tata CSR', time: '2 hours ago', icon: Mail, color: 'text-amber-600' },
    { id: 5, type: 'community', message: 'Community post flagged for review', time: '3 hours ago', icon: AlertCircle, color: 'text-orange-600' },
    { id: 6, type: 'program', message: 'New program enrollment: Mindfulness Through Art', time: '4 hours ago', icon: BookOpen, color: 'text-green-600' },
    { id: 7, type: 'blog', message: 'Blog post draft saved: "The Art of Kalamkari"', time: '5 hours ago', icon: MessageCircle, color: 'text-indigo-600' },
    { id: 8, type: 'certificate', message: 'Certificate issued: Heritage Art Basics #89', time: '6 hours ago', icon: Award, color: 'text-heritage-gold' },
];

export default function AdminHome() {
    const [stats, setStats] = useState(fallbackStats);
    const [recentActivity, setRecentActivity] = useState(fallbackRecentActivity);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardStats = async () => {
            try {
                const results = await Promise.allSettled([
                    userAPI.getAll(),
                    programAPI.getAll(),
                    artworkAPI.getAllAdmin(),
                    videoAPI.getAllAdmin(),
                    communityAPI.getAllAdmin(),
                    blogAPI.getAll(),
                    certificateAPI.getAllAdmin(),
                    contactAPI.getAllAdmin(),
                    corporateAPI.getAllAdmin(),
                    eventAPI.getAllAdmin(),
                ]);

                const newStats = { ...fallbackStats };

                if (results[0].status === 'fulfilled') {
                    const d = results[0].value.data;
                    newStats.totalUsers = d.total || (d.data && d.data.length) || 0;
                }
                if (results[1].status === 'fulfilled') {
                    const d = results[1].value.data;
                    const progs = d.data || [];
                    newStats.totalPrograms = d.total || progs.length;
                    newStats.activePrograms = progs.filter(p => p.status === 'active').length;
                }
                if (results[2].status === 'fulfilled') {
                    const d = results[2].value.data;
                    newStats.pendingArtworks = (d.data || []).filter(a => a.status === 'pending').length;
                }
                if (results[3].status === 'fulfilled') {
                    const d = results[3].value.data;
                    newStats.pendingVideos = (d.data || []).filter(v => v.status === 'pending').length;
                }
                if (results[4].status === 'fulfilled') {
                    const d = results[4].value.data;
                    newStats.pendingCommunityPosts = (d.data || []).filter(c => c.status === 'pending').length;
                }
                if (results[5].status === 'fulfilled') {
                    const d = results[5].value.data;
                    newStats.totalBlogPosts = d.total || (d.data && d.data.length) || 0;
                }
                if (results[6].status === 'fulfilled') {
                    const d = results[6].value.data;
                    newStats.totalCertificates = d.total || (d.data && d.data.length) || 0;
                }
                if (results[7].status === 'fulfilled') {
                    const d = results[7].value.data;
                    newStats.contactInquiries = (d.data || []).filter(c => c.status === 'unread' || c.status === 'new').length;
                }
                if (results[8].status === 'fulfilled') {
                    const d = results[8].value.data;
                    newStats.corporateLeads = d.total || (d.data && d.data.length) || 0;
                }
                if (results[9].status === 'fulfilled') {
                    const d = results[9].value.data;
                    newStats.totalEvents = d.total || (d.data && d.data.length) || 0;
                }

                setStats(newStats);
            } catch (err) {
                console.error('Failed to fetch admin stats:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardStats();
    }, []);

    const pendingItems = [
        { label: 'Artwork Approvals', count: stats.pendingArtworks, link: '/admin/artworks', icon: Palette, color: 'from-purple-500 to-pink-600' },
        { label: 'Video Approvals', count: stats.pendingVideos, link: '/admin/videos', icon: Video, color: 'from-red-500 to-orange-600' },
        { label: 'Community Posts', count: stats.pendingCommunityPosts, link: '/admin/community', icon: MessageCircle, color: 'from-green-500 to-emerald-600' },
        { label: 'Contact Inquiries', count: stats.contactInquiries, link: '/admin/contact', icon: Mail, color: 'from-amber-500 to-yellow-600' },
    ];

    const overviewCards = [
        { label: 'Total Users', value: stats.totalUsers, change: '+12%', up: true, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Active Programs', value: stats.activePrograms, change: '+3', up: true, icon: BookOpen, color: 'text-green-600', bg: 'bg-green-50' },
        { label: 'Blog Posts', value: stats.totalBlogPosts, change: '+5', up: true, icon: MessageCircle, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        { label: 'Certificates Issued', value: stats.totalCertificates, change: '+8', up: true, icon: Award, color: 'text-amber-600', bg: 'bg-amber-50' },
        { label: 'Corporate Leads', value: stats.corporateLeads, change: '+2', up: true, icon: Building2, color: 'text-purple-600', bg: 'bg-purple-50' },
        { label: 'Events', value: stats.totalEvents, change: '+1', up: true, icon: Calendar, color: 'text-red-600', bg: 'bg-red-50' },
    ];

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-2">
                        <Skeleton className="h-7 w-56" />
                        <Skeleton className="h-4 w-96" />
                    </div>
                    <div className="flex gap-2">
                        <Skeleton className="h-10 w-28 rounded-sm" />
                        <Skeleton className="h-10 w-28 rounded-sm" />
                    </div>
                </div>
                <Separator />
                <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="bg-surface rounded-xl shadow-md border border-heritage-creamDark p-4 space-y-3">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-8 w-16" />
                            <Skeleton className="h-4 w-24" />
                        </div>
                    ))}
                </div>
                <div className="grid lg:grid-cols-2 gap-6">
                    <div className="bg-surface rounded-xl shadow-md border border-heritage-creamDark p-5 space-y-4">
                        <Skeleton className="h-6 w-40" />
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="flex items-center justify-between">
                                <Skeleton className="h-4 w-40" />
                                <Skeleton className="h-7 w-14 rounded-full" />
                            </div>
                        ))}
                    </div>
                    <div className="bg-surface rounded-xl shadow-md border border-heritage-creamDark p-5 space-y-4">
                        <Skeleton className="h-6 w-44" />
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="flex items-center justify-between">
                                <Skeleton className="h-4 w-44" />
                                <Skeleton className="h-7 w-14 rounded-full" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div {...fadeInUp}>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                            <LayoutDashboard className="w-6 h-6 text-heritage-gold" />
                            Admin Dashboard
                        </h1>
                        <p className="text-muted-foreground mt-1">Overview of Adyom Foundation platform activity</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge variant="gold" className="text-sm">Admin Access</Badge>
                        <Badge variant="outline" className="text-xs">
                            <Activity className="w-3 h-3 mr-1 text-green-600" />
                            All Systems Active
                        </Badge>
                    </div>
                </div>
            </motion.div>

            <Separator />

            {/* Pending Approvals Alert */}
            <motion.div {...fadeInUp}>
                <Card className="bg-gradient-to-r from-heritage-terracotta/10 to-heritage-gold/10 border-heritage-gold/40">
                    <CardContent className="p-6">
                        <h3 className="font-semibold text-foreground flex items-center gap-2 mb-4">
                            <AlertCircle className="w-5 h-5 text-heritage-gold" />
                            Pending Approvals
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {pendingItems.map((item) => (
                                <a key={item.label} href={item.link} className="block">
                                    <div className="p-4 rounded-lg bg-white/70 hover:bg-white transition-colors group">
                                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                                            <item.icon className="w-4 h-4 text-white" />
                                        </div>
                                        <p className="text-2xl font-bold text-heritage-terracottaDark">{item.count}</p>
                                        <p className="text-xs text-muted-foreground">{item.label}</p>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Overview Stats */}
            <motion.div {...fadeInUp}>
                <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {overviewCards.map((card) => (
                        <Card key={card.label} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-4">
                                <div className={`w-8 h-8 rounded-lg ${card.bg} flex items-center justify-center mb-2`}>
                                    <card.icon className={`w-4 h-4 ${card.color}`} />
                                </div>
                                <p className="text-2xl font-bold text-foreground">{card.value}</p>
                                <p className="text-xs text-muted-foreground">{card.label}</p>
                                <p className={`text-xs mt-1 flex items-center gap-1 ${card.up ? 'text-green-600' : 'text-red-600'}`}>
                                    {card.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                    {card.change} this week
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </motion.div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Recent Activity */}
                <motion.div {...fadeInUp} className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center gap-2">
                                    <Activity className="w-5 h-5 text-heritage-gold" />
                                    Recent Activity
                                </CardTitle>
                                <Button variant="ghostGold" size="sm">View All</Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {recentActivity.map((activity) => (
                                <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                                        <activity.icon className={`w-4 h-4 ${activity.color}`} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-foreground">{activity.message}</p>
                                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                                    </div>
                                    <Badge variant="outline" className="text-xs capitalize">{activity.type}</Badge>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Quick Stats */}
                <motion.div {...fadeInUp}>
                    <Card className="heritage-border">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BarChart3 className="w-5 h-5 text-heritage-gold" />
                                Platform Health
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-green-700">User Engagement</span>
                                    <span className="text-sm font-bold text-green-700">92%</span>
                                </div>
                                <div className="w-full h-2 rounded-full bg-green-200 mt-2">
                                    <div className="h-2 rounded-full bg-green-500" style={{ width: '92%' }} />
                                </div>
                            </div>
                            <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-blue-700">Content Moderation</span>
                                    <span className="text-sm font-bold text-blue-700">87%</span>
                                </div>
                                <div className="w-full h-2 rounded-full bg-blue-200 mt-2">
                                    <div className="h-2 rounded-full bg-blue-500" style={{ width: '87%' }} />
                                </div>
                            </div>
                            <div className="p-3 rounded-lg bg-purple-50 border border-purple-200">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-purple-700">Program Completion</span>
                                    <span className="text-sm font-bold text-purple-700">78%</span>
                                </div>
                                <div className="w-full h-2 rounded-full bg-purple-200 mt-2">
                                    <div className="h-2 rounded-full bg-purple-500" style={{ width: '78%' }} />
                                </div>
                            </div>
                            <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-amber-700">Response Rate</span>
                                    <span className="text-sm font-bold text-amber-700">95%</span>
                                </div>
                                <div className="w-full h-2 rounded-full bg-amber-200 mt-2">
                                    <div className="h-2 rounded-full bg-amber-500" style={{ width: '95%' }} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Growth Chart Placeholder */}
            <motion.div {...fadeInUp}>
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-heritage-gold" />
                                Growth Overview (Last 6 Months)
                            </CardTitle>
                            <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">Users</Badge>
                                <Badge variant="outline" className="text-xs">Enrollments</Badge>
                                <Badge variant="outline" className="text-xs">Revenue</Badge>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="h-48 flex items-end justify-between gap-2 px-4">
                            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, i) => {
                                const heights = [30, 45, 55, 70, 85, 95];
                                return (
                                    <div key={month} className="flex-1 flex flex-col items-center gap-1">
                                        <div className="w-full flex gap-1">
                                            <div className="flex-1 rounded-t bg-blue-400" style={{ height: `${heights[i]}%` }} />
                                            <div className="flex-1 rounded-t bg-green-400" style={{ height: `${heights[i] * 0.7}%` }} />
                                            <div className="flex-1 rounded-t bg-heritage-gold" style={{ height: `${heights[i] * 0.5}%` }} />
                                        </div>
                                        <span className="text-xs text-muted-foreground">{month}</span>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="flex items-center gap-4 mt-3 text-xs">
                            <span className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-blue-400" /> Users</span>
                            <span className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-green-400" /> Enrollments</span>
                            <span className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-heritage-gold" /> Revenue</span>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
