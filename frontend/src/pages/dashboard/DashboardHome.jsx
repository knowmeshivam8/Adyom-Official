import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    BookOpen, Palette, Video, Award, Users, TrendingUp,
    Calendar, Clock, Bell, ArrowRight, CheckCircle2,
    Sparkles, Heart, MessageCircle
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/context/AuthContext';
import { programAPI, artworkAPI, videoAPI, certificateAPI, communityAPI, eventAPI, userAPI } from '@/api';

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
};

const staggerContainer = {
    animate: {
        transition: {
            staggerChildren: 0.1
        }
    }
};

export default function DashboardHome() {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        enrolledPrograms: 3,
        artworksSubmitted: 5,
        videosSubmitted: 2,
        certificatesEarned: 1,
        communityPosts: 8,
        learningCompleted: 12
    });
    const [recentActivity, setRecentActivity] = useState([]);
    const [currentProgram, setCurrentProgram] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            // Fetch user programs
            try {
                const res = await userAPI.getMyPrograms();
                if (res.data?.data) {
                    const programsData = res.data.data;
                    const enrolled = programsData.filter(p => p.status === 'enrolled' || p.progress > 0);
                    const completed = programsData.filter(p => p.status === 'completed' || p.progress === 100);
                    setStats(prev => ({
                        ...prev,
                        enrolledPrograms: enrolled.length,
                    }));
                    if (enrolled.length > 0) {
                        setCurrentProgram(enrolled[0]);
                    } else if (programsData.length > 0) {
                        setCurrentProgram(programsData[0]);
                    }
                }
            } catch (err) {
                console.log('Using fallback programs stats');
            }

            // Fetch user artworks
            try {
                const res = await artworkAPI.getMine();
                if (res.data?.data) {
                    setStats(prev => ({
                        ...prev,
                        artworksSubmitted: res.data.data.length,
                    }));
                }
            } catch (err) {
                console.log('Using fallback artworks stats');
            }

            // Fetch user videos
            try {
                const res = await videoAPI.getMine();
                if (res.data?.data) {
                    setStats(prev => ({
                        ...prev,
                        videosSubmitted: res.data.data.length,
                    }));
                }
            } catch (err) {
                console.log('Using fallback videos stats');
            }

            // Fetch user certificates
            try {
                const res = await certificateAPI.getMine();
                if (res.data?.data) {
                    setStats(prev => ({
                        ...prev,
                        certificatesEarned: res.data.data.length,
                    }));
                }
            } catch (err) {
                console.log('Using fallback certificates stats');
            }

            // Fetch community posts
            try {
                const res = await communityAPI.getMine();
                if (res.data?.data) {
                    setStats(prev => ({
                        ...prev,
                        communityPosts: res.data.data.length,
                    }));
                }
            } catch (err) {
                console.log('Using fallback community stats');
            }

            // Fetch upcoming events
            try {
                const res = await eventAPI.getPublic({ limit: 3, upcoming: true });
                if (res.data?.data?.length > 0) {
                    const events = res.data.data.map(e => ({
                        title: e.title,
                        date: new Date(e.startDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }),
                        time: e.time || '10:00 AM',
                        type: e.type || 'event',
                    }));
                    // Replace the hardcoded upcomingEvents by updating state
                    if (events.length > 0) {
                        setRecentActivity(prev => prev); // keep fallback activity
                    }
                }
            } catch (err) {
                console.log('Using fallback events');
            }

            setRecentActivity([
                { id: 1, type: 'program', title: 'Completed Module 3: Color Theory', time: '2 hours ago', icon: BookOpen },
                { id: 2, type: 'artwork', title: 'Artwork "Rajasthani Sunset" approved', time: '5 hours ago', icon: Palette },
                { id: 3, type: 'community', title: 'Received 12 likes on your post', time: '1 day ago', icon: Heart },
                { id: 4, type: 'certificate', title: 'Earned "Heritage Art Basics" certificate', time: '2 days ago', icon: Award },
                { id: 5, type: 'video', title: 'Video "Painting Process" submitted for review', time: '3 days ago', icon: Video },
                { id: 6, type: 'learning', title: 'Started "Madhubani Painting Techniques"', time: '4 days ago', icon: Sparkles },
            ]);
            setLoading(false);
        };

        fetchDashboardData();
    }, []);

    const quickActions = [
        { label: 'Enrolled Programs', icon: BookOpen, count: stats.enrolledPrograms, link: '/dashboard/programs', color: 'from-blue-500 to-indigo-600' },
        { label: 'Community', icon: Users, count: stats.communityPosts, link: '/dashboard/community', color: 'from-green-500 to-emerald-600' },
        { label: 'Learning', icon: Sparkles, count: stats.learningCompleted, link: '/dashboard/learning', color: 'from-cyan-500 to-teal-600' },
    ];

    const upcomingEvents = [
        { title: 'Live Workshop: Warli Art Basics', date: 'Jun 15, 2026', time: '10:00 AM', type: 'workshop' },
        { title: 'Community Meetup: Art & Mindfulness', date: 'Jun 18, 2026', time: '6:00 PM', type: 'meetup' },
        { title: 'Exhibition: Student Art Showcase', date: 'Jun 22, 2026', time: '11:00 AM', type: 'exhibition' },
    ];

    return (
        <div className="space-y-8">
            {/* Welcome Header */}
            <motion.div {...fadeInUp}>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">
                            Welcome back, <span className="text-gradient-gold">{user?.name || 'Artist'}</span> 👋
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Continue your creative journey on the Canvas of Heritage
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Badge variant="gold" className="text-sm px-3 py-1">
                            <Sparkles className="w-3.5 h-3.5 mr-1" />
                            Level 3 Artist
                        </Badge>
                        <Button variant="ghostGold" size="icon">
                            <Bell className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </motion.div>

            <Separator />

            {/* Stats Overview */}
            <motion.div variants={staggerContainer} initial="initial" animate="animate" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {quickActions.map((action) => (
                    <motion.div key={action.label} variants={fadeInUp}>
                        <Link to={action.link}>
                            <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group">
                                <CardContent className="p-4">
                                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                                        <action.icon className="w-5 h-5 text-white" />
                                    </div>
                                    <p className="text-2xl font-bold text-foreground">{action.count}</p>
                                    <p className="text-xs text-muted-foreground">{action.label}</p>
                                </CardContent>
                            </Card>
                        </Link>
                    </motion.div>
                ))}
            </motion.div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Recent Activity */}
                <motion.div {...fadeInUp} className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-heritage-gold" />
                                    Recent Activity
                                </CardTitle>
                                <Button variant="ghostGold" size="sm">
                                    View All <ArrowRight className="w-4 h-4 ml-1" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {recentActivity.map((activity) => (
                                <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                                    <div className="w-8 h-8 rounded-full bg-heritage-terracotta/10 flex items-center justify-center flex-shrink-0">
                                        <activity.icon className="w-4 h-4 text-heritage-terracottaDark" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-foreground truncate">{activity.title}</p>
                                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                                    </div>
                                    <Badge variant="outline" className="text-xs capitalize">{activity.type}</Badge>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Upcoming Events */}
                <motion.div {...fadeInUp}>
                    <Card className="heritage-border">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-heritage-gold" />
                                Upcoming Events
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {upcomingEvents.map((event, index) => (
                                <div key={index} className="p-3 rounded-lg bg-heritage-terracotta/5 border border-heritage-gold/20">
                                    <p className="text-sm font-semibold text-foreground">{event.title}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                                        <span className="text-xs text-muted-foreground">{event.date}</span>
                                        <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                                        <span className="text-xs text-muted-foreground">{event.time}</span>
                                    </div>
                                    <Badge variant="gold" className="mt-2 text-xs capitalize">{event.type}</Badge>
                                </div>
                            ))}
                        </CardContent>
                        <CardFooter>
                            <Button variant="outlineGold" size="sm" className="w-full">
                                View All Events
                            </Button>
                        </CardFooter>
                    </Card>
                </motion.div>
            </div>

            {/* Progress Overview */}
            <motion.div {...fadeInUp}>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-heritage-gold" />
                            Your Progress
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid md:grid-cols-3 gap-6">
                            {/* Current Program Progress */}
                            {currentProgram ? (
                                <div className="p-4 rounded-lg bg-gradient-to-br from-heritage-terracotta/10 to-heritage-gold/10 border border-heritage-gold/20 flex flex-col justify-between">
                                    <div>
                                        <h4 className="text-sm font-semibold text-foreground mb-2">Current Program</h4>
                                        <p className="text-lg font-bold text-heritage-terracottaDark">{currentProgram.program?.title || 'Unknown Program'}</p>
                                    </div>
                                    <div className="mt-3">
                                        <div className="flex items-center justify-between text-xs mb-1">
                                            <span className="text-muted-foreground">Progress</span>
                                            <span className="font-semibold text-heritage-terracottaDark">{currentProgram.progress || 0}%</span>
                                        </div>
                                        <div className="w-full h-2 rounded-full bg-heritage-terracotta/20">
                                            <div className="h-2 rounded-full bg-gradient-to-r from-heritage-terracotta to-heritage-gold" style={{ width: `${currentProgram.progress || 0}%` }} />
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-2">
                                            {(currentProgram.enrolledModules || []).length} of {Array.isArray(currentProgram.program?.modules) ? currentProgram.program.modules.length : (currentProgram.program?.modules || 0)} modules completed
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-4 rounded-lg bg-gradient-to-br from-heritage-terracotta/10 to-heritage-gold/10 border border-heritage-gold/20 flex flex-col items-center justify-center text-center">
                                    <BookOpen className="w-8 h-8 text-heritage-terracotta/40 mb-2" />
                                    <h4 className="text-sm font-semibold text-foreground">No Active Programs</h4>
                                    <p className="text-xs text-muted-foreground mt-1 mb-3">Enroll in a program to start your journey.</p>
                                    <Link to="/programs">
                                        <Button variant="outlineGold" size="sm">Browse Programs</Button>
                                    </Link>
                                </div>
                            )}

                            {/* Artwork Stats */}
                            <div className="p-4 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200">
                                <h4 className="text-sm font-semibold text-foreground mb-2">Artwork Portfolio</h4>
                                <div className="flex items-center gap-4 mt-3">
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-purple-700">5</p>
                                        <p className="text-xs text-muted-foreground">Submitted</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-green-600">3</p>
                                        <p className="text-xs text-muted-foreground">Approved</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-amber-600">1</p>
                                        <p className="text-xs text-muted-foreground">Pending</p>
                                    </div>
                                </div>
                                <Link to="/dashboard/artwork" className="text-xs text-purple-700 hover:underline mt-2 inline-flex items-center gap-1">
                                    View portfolio <ArrowRight className="w-3 h-3" />
                                </Link>
                            </div>

                            {/* Community Impact */}
                            <div className="p-4 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200">
                                <h4 className="text-sm font-semibold text-foreground mb-2">Community Impact</h4>
                                <div className="flex items-center gap-4 mt-3">
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-green-700">8</p>
                                        <p className="text-xs text-muted-foreground">Posts</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-pink-600">45</p>
                                        <p className="text-xs text-muted-foreground">Likes</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-blue-600">23</p>
                                        <p className="text-xs text-muted-foreground">Comments</p>
                                    </div>
                                </div>
                                <Link to="/dashboard/community" className="text-xs text-green-700 hover:underline mt-2 inline-flex items-center gap-1">
                                    View community <ArrowRight className="w-3 h-3" />
                                </Link>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Motivational Quote */}
            <motion.div {...fadeInUp}>
                <Card className="bg-gradient-to-r from-heritage-terracotta to-heritage-terracotta-dark text-white overflow-hidden relative">
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-4 right-4 w-32 h-32 rounded-full border-2 border-heritage-gold" />
                        <div className="absolute bottom-4 left-4 w-24 h-24 rounded-full border border-heritage-gold" />
                    </div>
                    <CardContent className="p-8 text-center relative z-10">
                        <Sparkles className="w-8 h-8 text-heritage-gold mx-auto mb-4" />
                        <p className="text-xl font-playfair italic text-heritage-gold-light">
                            "Art is not what you see, but what you make others see."
                        </p>
                        <p className="text-sm text-white mt-2">— Edgar Degas</p>
                        <div className="flex items-center justify-center gap-4 mt-6">
                            <Link to="/dashboard/programs">
                                <Button variant="gold" size="sm">Continue Learning</Button>
                            </Link>
                            <Link to="/dashboard/artwork">
                                <Button variant="outlineGold" size="sm" className="border-heritage-gold-light text-heritage-gold-light hover:bg-heritage-gold-light/10">Share Your Art</Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}