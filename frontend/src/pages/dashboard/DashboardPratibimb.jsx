import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
    Calendar, CheckCircle2, Circle, Link as LinkIcon,
    Sparkles, Loader2, Flame, ChevronLeft, ChevronRight,
    ExternalLink, BookOpen, Zap
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { dashboardAPI, userAPI } from '@/api';
import { useAuth } from '@/context/AuthContext';

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
};

const TOTAL_DAYS = 41;

export default function DashboardPratibimb() {
    const { user } = useAuth();
    const [programId, setProgramId] = useState(null);
    const [attendance, setAttendance] = useState([]);
    const [liveSessions, setLiveSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [markingAttendance, setMarkingAttendance] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [streakCount, setStreakCount] = useState(0);

    const getLocalAttendance = () => {
        if (!user?._id) return [];
        const stored = localStorage.getItem(`pratibimb_attendance_${user._id}`);
        if (stored) {
            try {
                return JSON.parse(stored).map(a => ({
                    date: new Date(a.date),
                    marked: true
                }));
            } catch (e) {
                return [];
            }
        }
        return [];
    };

    const saveLocalAttendance = (newAttendance) => {
        if (!user?._id) return;
        localStorage.setItem(`pratibimb_attendance_${user._id}`, JSON.stringify(newAttendance));
    };

    const calculateStreak = (dates) => {
        if (!dates.length) { setStreakCount(0); return; }
        const sorted = dates.sort((a, b) => b - a);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        const latestDate = new Date(sorted[0]);
        latestDate.setHours(0, 0, 0, 0);

        if (latestDate.getTime() !== today.getTime() && latestDate.getTime() !== yesterday.getTime()) {
            setStreakCount(0);
            return;
        }

        let streak = 1;
        for (let i = 1; i < sorted.length; i++) {
            const curr = new Date(sorted[i - 1]);
            curr.setHours(0, 0, 0, 0);
            const prev = new Date(sorted[i]);
            prev.setHours(0, 0, 0, 0);
            const diff = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
            if (diff === 1) {
                streak++;
            } else {
                break;
            }
        }
        setStreakCount(streak);
    };

    const fetchData = useCallback(async () => {
        try {
            let attData = getLocalAttendance();
            let sessions = [
                { title: 'Week 1: Introduction to Pratibimb', link: 'https://meet.google.com/new', date: new Date(), module: 'Foundation' },
                { title: 'Week 2: Canvas Preparation', link: 'https://meet.google.com/new', date: new Date(Date.now() + 7*24*60*60*1000), module: 'Technique' },
            ];

            try {
                const progRes = await userAPI.getMyPrograms();
                const programs = progRes.data?.data || progRes.data?.programs || [];
                const pratibimb = programs.find(
                    p => (p.program?.category || p.program?.programType || p.category || p.programType || '').toLowerCase() === 'pratibimb'
                );

                if (pratibimb) {
                    const pid = pratibimb.program?._id || pratibimb.program || pratibimb._id;
                    setProgramId(pid);

                    try {
                        const attRes = await dashboardAPI.getAttendance(pid);
                        const apiAtt = attRes.data?.data || [];
                        if (apiAtt.length > 0) {
                            attData = apiAtt.map(a => ({
                                date: new Date(a.date),
                                marked: true,
                            }));
                        }
                    } catch (e) {
                        console.log('Using local attendance');
                    }

                    const apiSessions = [];
                    const mods = pratibimb.program?.modules || pratibimb.modules || [];
                    mods.forEach(mod => {
                        if (mod.sessions) {
                            mod.sessions.forEach(s => {
                                apiSessions.push({
                                    title: s.title || mod.title,
                                    link: s.link || s.meetingLink || '#',
                                    date: s.date || null,
                                    module: mod.title,
                                });
                            });
                        }
                    });
                    if (apiSessions.length > 0) sessions = apiSessions;
                }
            } catch (err) {
                console.log('Using fallback local data');
            }

            setAttendance(attData);
            calculateStreak(attData.map(a => new Date(a.date)));
            setLiveSessions(sessions);
        } finally {
            setLoading(false);
        }
    }, [user?._id]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleMarkAttendance = async () => {
        if (markingAttendance) return;
        setMarkingAttendance(true);
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const newAttendance = [...attendance, { date: today, marked: true }];
        
        // Always save to local storage for immediate/fallback feedback
        saveLocalAttendance(newAttendance);
        setAttendance(newAttendance);
        calculateStreak([...newAttendance.map(a => a.date)]);

        // Try hitting backend if program ID exists
        if (programId) {
            try {
                await dashboardAPI.markAttendance({ programId });
            } catch (err) {
                console.log('Backend sync failed, local state updated.');
            }
        }
        
        setMarkingAttendance(false);
    };

    const isTodayMarked = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return attendance.some(a => {
            const d = new Date(a.date);
            d.setHours(0, 0, 0, 0);
            return d.getTime() === today.getTime();
        });
    };

    const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

    const renderCalendarGrid = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const totalDays = daysInMonth(year, month);
        const firstDay = firstDayOfMonth(year, month);
        const monthName = currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });

        const days = [];
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="aspect-square" />);
        }
        for (let d = 1; d <= totalDays; d++) {
            const date = new Date(year, month, d);
            date.setHours(0, 0, 0, 0);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const isToday = date.getTime() === today.getTime();
            const isPast = date.getTime() < today.getTime();
            const isFuture = date.getTime() > today.getTime();

            const attended = attendance.some(a => {
                const ad = new Date(a.date);
                ad.setHours(0, 0, 0, 0);
                return ad.getTime() === date.getTime();
            });

            let bgClass = 'bg-gray-100 text-gray-400';
            let icon = null;
            if (attended) {
                bgClass = 'bg-green-500 text-white shadow-sm';
                icon = <CheckCircle2 className="w-4 h-4" />;
            } else if (isToday) {
                bgClass = 'bg-heritage-gold text-white shadow-md ring-2 ring-offset-2 ring-heritage-gold';
            } else if (isPast) {
                bgClass = 'bg-red-50 text-red-300';
                icon = <Circle className="w-3 h-3" />;
            }

            days.push(
                <div
                    key={d}
                    className={`aspect-square rounded-xl flex flex-col items-center justify-center text-sm font-semibold transition-all ${bgClass} ${isFuture ? 'opacity-40' : ''}`}
                >
                    {icon || <span>{d}</span>}
                </div>
            );
        }
        return { days, monthName };
    };

    const { days, monthName } = renderCalendarGrid();
    const completedDays = attendance.length;

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-heritage-gold" />
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <motion.div {...fadeInUp} className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-heritage-terracottaDark flex items-center gap-2">
                        <Sparkles className="w-8 h-8 text-heritage-gold" />
                        Pratibimb
                    </h1>
                    <p className="text-muted-foreground mt-1 text-lg">Your 41-Day Creative Sadhana</p>
                </div>
                <div className="flex items-center gap-3">
                    {streakCount > 0 && (
                        <Badge variant="gold" className="text-sm px-3 py-1 flex items-center gap-1 shadow-sm">
                            <Flame className="w-4 h-4" /> {streakCount} Day Streak
                        </Badge>
                    )}
                    <Badge variant="outline" className="text-sm px-3 py-1 shadow-sm">
                        Day {completedDays} of {TOTAL_DAYS}
                    </Badge>
                </div>
            </motion.div>

            <Separator />

            <div className="grid lg:grid-cols-2 gap-6">
                <motion.div {...fadeInUp} className="space-y-6">
                    <Card className="border-none shadow-md">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between flex-wrap gap-4">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800">Daily Attendance</h3>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {isTodayMarked()
                                            ? "You're all set for today. Great job!"
                                            : "Don't forget to mark your practice for today."}
                                    </p>
                                </div>
                                <Button
                                    size="lg"
                                    variant={isTodayMarked() ? 'outline' : 'gold'}
                                    disabled={isTodayMarked() || markingAttendance}
                                    onClick={handleMarkAttendance}
                                    className="min-w-[160px] shadow-sm"
                                >
                                    {markingAttendance ? (
                                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                    ) : isTodayMarked() ? (
                                        <CheckCircle2 className="w-5 h-5 mr-2" />
                                    ) : (
                                        <Zap className="w-5 h-5 mr-2" />
                                    )}
                                    {isTodayMarked() ? 'Completed' : 'Mark Attendance'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-md">
                        <CardHeader className="pb-4">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-xl flex items-center gap-2">
                                    <Calendar className="w-6 h-6 text-heritage-gold" />
                                    Calendar
                                </CardTitle>
                                <div className="flex items-center gap-1 bg-gray-50 rounded-lg p-1">
                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}>
                                        <ChevronLeft className="w-4 h-4" />
                                    </Button>
                                    <span className="text-sm font-bold text-gray-700 min-w-[100px] text-center">
                                        {monthName}
                                    </span>
                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}>
                                        <ChevronRight className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-7 gap-2 mb-2">
                                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                                    <div key={d} className="text-center text-xs font-bold text-gray-400 py-1 uppercase tracking-wider">
                                        {d}
                                    </div>
                                ))}
                            </div>
                            <div className="grid grid-cols-7 gap-2">
                                {days}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div {...fadeInUp} transition={{ delay: 0.1 }}>
                    <Card className="border-none shadow-md h-full">
                        <CardHeader>
                            <CardTitle className="text-xl flex items-center gap-2">
                                <LinkIcon className="w-6 h-6 text-heritage-gold" />
                                Live Sessions
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {liveSessions.map((session, i) => (
                                <a 
                                    key={i} 
                                    href={session.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-heritage-gold/30 hover:bg-heritage-creamLight/30 transition-all group"
                                >
                                    <div className="w-12 h-12 rounded-full bg-heritage-cream flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                        <BookOpen className="w-6 h-6 text-heritage-terracotta" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-base font-bold text-gray-800 truncate group-hover:text-heritage-terracottaDark transition-colors">{session.title}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            {session.module && (
                                                <Badge variant="secondary" className="text-xs">{session.module}</Badge>
                                            )}
                                            {session.date && (
                                                <span className="text-xs font-medium text-gray-500">
                                                    {new Date(session.date).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-heritage-gold group-hover:text-white text-gray-400 transition-colors">
                                        <ExternalLink className="w-4 h-4" />
                                    </div>
                                </a>
                            ))}
                            {liveSessions.length === 0 && (
                                <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                    <p className="text-gray-500 font-medium">No live sessions scheduled yet.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}