import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
    Calendar, CheckCircle2, Circle, Camera, Upload, Link as LinkIcon,
    Sparkles, Loader2, Flame, Award, Clock, ChevronLeft, ChevronRight,
    Image, ExternalLink, Users, Zap, Star, BookOpen, Palette
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { dashboardAPI, userAPI } from '@/api';

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
};

const TOTAL_DAYS = 41;

/**
 * DashboardPratibimb — The dedicated Pratibimb (Reflection) 41-Day Sadhana Dashboard.
 *
 * Features:
 *  - 41-day calendar grid showing attendance status
 *  - Daily attendance marking (POST /api/dashboard/attendance)
 *  - Canvas progress photo upload
 *  - Live session links
 *  - Completion tracker with progress bar
 *  - Streak counter
 */
export default function DashboardPratibimb() {
    const [programId, setProgramId] = useState(null);
    const [attendance, setAttendance] = useState([]);
    const [canvasPhotos, setCanvasPhotos] = useState([]);
    const [liveSessions, setLiveSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [markingAttendance, setMarkingAttendance] = useState(false);
    const [error, setError] = useState(null);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [streakCount, setStreakCount] = useState(0);
    const [uploadingPhoto, setUploadingPhoto] = useState(false);

    // Fetch Pratibimb program and attendance data
    const fetchData = useCallback(async () => {
        try {
            // Find the Pratibimb program from user's enrolled programs
            const progRes = await userAPI.getMyPrograms();
            const programs = progRes.data?.data || progRes.data?.programs || [];
            const pratibimb = programs.find(
                p => (p.program?.category || p.program?.programType || p.category || p.programType || '').toLowerCase() === 'pratibimb'
            );

            if (pratibimb) {
                const pid = pratibimb.program?._id || pratibimb.program || pratibimb._id;
                setProgramId(pid);

                // Fetch attendance
                try {
                    const attRes = await dashboardAPI.getAttendance(pid);
                    const attData = attRes.data?.data || [];
                    setAttendance(attData.map(a => ({
                        date: new Date(a.date),
                        marked: a.marked || true,
                    })));
                    // Calculate streak
                    calculateStreak(attData.map(a => new Date(a.date)));
                } catch (attErr) {
                    console.log('Using fallback attendance:', attErr.message);
                }

                // Set live sessions from program modules
                const sessions = [];
                if (pratibimb.program?.modules) {
                    pratibimb.program.modules.forEach(mod => {
                        if (mod.sessions) {
                            mod.sessions.forEach(s => {
                                sessions.push({
                                    title: s.title || mod.title,
                                    link: s.link || s.meetingLink || '#',
                                    date: s.date || null,
                                    module: mod.title,
                                });
                            });
                        }
                    });
                } else if (pratibimb.modules) {
                    pratibimb.modules.forEach(mod => {
                        if (mod.sessions) {
                            mod.sessions.forEach(s => {
                                sessions.push({
                                    title: s.title || mod.title,
                                    link: s.link || s.meetingLink || '#',
                                    date: s.date || null,
                                    module: mod.title,
                                });
                            });
                        }
                    });
                }
                setLiveSessions(sessions);
            }
        } catch (err) {
            console.log('Using fallback Pratibimb data:', err.message);
            setError('Could not load Pratibimb data. Using demo mode.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const calculateStreak = (dates) => {
        if (!dates.length) { setStreakCount(0); return; }
        const sorted = dates.sort((a, b) => b - a);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        const latestDate = new Date(sorted[0]);
        latestDate.setHours(0, 0, 0, 0);

        // Streak must include today or yesterday
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

    const handleMarkAttendance = async () => {
        if (!programId || markingAttendance) return;
        setMarkingAttendance(true);
        try {
            const res = await dashboardAPI.markAttendance({ programId });
            const newCount = res.data?.data?.attendanceCount || attendance.length + 1;
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            setAttendance(prev => [...prev, { date: today, marked: true }]);
            calculateStreak([...attendance.map(a => a.date), today]);
        } catch (err) {
            if (err.response?.data?.message?.includes('already marked')) {
                setError('Attendance already marked for today');
            } else {
                setError('Failed to mark attendance');
            }
            setTimeout(() => setError(null), 3000);
        } finally {
            setMarkingAttendance(false);
        }
    };

    const handlePhotoUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploadingPhoto(true);
        // Simulate upload — in production this would use Cloudinary or similar
        try {
            const reader = new FileReader();
            reader.onload = (event) => {
                setCanvasPhotos(prev => [{
                    id: Date.now(),
                    url: event.target.result,
                    date: new Date(),
                    caption: `Canvas Progress — Day ${attendance.length + 1}`,
                }, ...prev]);
            };
            reader.readAsDataURL(file);
        } catch (err) {
            console.error('Photo upload failed:', err);
        } finally {
            setUploadingPhoto(false);
        }
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

    // Calendar helpers
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

            let bgClass = 'bg-heritage-creamLight/50 text-muted-foreground';
            let icon = null;
            if (attended) {
                bgClass = 'bg-green-500 text-white';
                icon = <CheckCircle2 className="w-3 h-3" />;
            } else if (isToday) {
                bgClass = 'bg-heritage-gold text-white ring-2 ring-heritage-gold/50';
            } else if (isPast) {
                bgClass = 'bg-red-100 text-red-400';
                icon = <Circle className="w-3 h-3" />;
            }

            days.push(
                <div
                    key={d}
                    className={`aspect-square rounded-md flex flex-col items-center justify-center text-xs font-medium transition-all ${bgClass} ${isFuture ? 'opacity-40' : ''}`}
                    title={`${monthName} ${d}${attended ? ' — Attended' : isPast ? ' — Missed' : ''}`}
                >
                    {icon || <span>{d}</span>}
                    {attended && <span className="text-[10px] leading-none">{d}</span>}
                </div>
            );
        }
        return { days, monthName };
    };

    const { days, monthName } = renderCalendarGrid();

    const completedDays = attendance.length;
    const progressPercent = Math.round((completedDays / TOTAL_DAYS) * 100);
    const daysRemaining = TOTAL_DAYS - completedDays;

    // Fallback live sessions
    const displaySessions = liveSessions.length > 0 ? liveSessions : [
        { title: 'Week 1: Introduction to Pratibimb', link: '#', date: null, module: 'Foundation' },
        { title: 'Week 2: Canvas Preparation', link: '#', date: null, module: 'Technique' },
        { title: 'Week 3: Color & Composition', link: '#', date: null, module: 'Practice' },
        { title: 'Week 4: Midpoint Review', link: '#', date: null, module: 'Review' },
        { title: 'Week 5: Advanced Techniques', link: '#', date: null, module: 'Mastery' },
        { title: 'Week 6: Final Exhibition Prep', link: '#', date: null, module: 'Exhibition' },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-heritage-gold" />
                <span className="ml-3 text-muted-foreground">Loading Pratibimb dashboard...</span>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div {...fadeInUp}>
                <div className="flex items-center justify-between flex-wrap gap-3">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                            <Sparkles className="w-6 h-6 text-heritage-gold" />
                            Pratibimb — The Reflection
                        </h1>
                        <p className="text-muted-foreground mt-1">41-Day Sadhana · Track your daily practice and creative journey</p>
                    </div>
                    <div className="flex items-center gap-2">
                        {streakCount >= 3 && (
                            <Badge variant="gold" className="text-sm flex items-center gap-1">
                                <Flame className="w-4 h-4" /> {streakCount} Day Streak!
                            </Badge>
                        )}
                        <Badge variant="outline" className="text-sm">
                            Day {completedDays} of {TOTAL_DAYS}
                        </Badge>
                    </div>
                </div>
            </motion.div>

            <Separator />

            {/* Error Toast */}
            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm"
                >
                    {error}
                </motion.div>
            )}

            {/* Top Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <motion.div {...fadeInUp}>
                    <Card className="bg-gradient-to-br from-heritage-terracotta to-red-800 text-white">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Calendar className="w-5 h-5" />
                                <span className="text-sm opacity-80">Completed</span>
                            </div>
                            <p className="text-3xl font-bold">{completedDays}</p>
                            <p className="text-xs opacity-80 mt-1">of {TOTAL_DAYS} days</p>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div {...fadeInUp} transition={{ delay: 0.1 }}>
                    <Card className="bg-gradient-to-br from-heritage-gold to-amber-600 text-white">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Flame className="w-5 h-5" />
                                <span className="text-sm opacity-80">Streak</span>
                            </div>
                            <p className="text-3xl font-bold">{streakCount}</p>
                            <p className="text-xs opacity-80 mt-1">consecutive days</p>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div {...fadeInUp} transition={{ delay: 0.2 }}>
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Award className="w-5 h-5 text-heritage-gold" />
                                <span className="text-sm text-muted-foreground">Progress</span>
                            </div>
                            <p className="text-3xl font-bold text-foreground">{progressPercent}%</p>
                            <div className="w-full h-1.5 rounded-full bg-heritage-terracotta/20 mt-2">
                                <div
                                    className="h-1.5 rounded-full bg-gradient-to-r from-heritage-terracotta to-heritage-gold transition-all"
                                    style={{ width: `${progressPercent}%` }}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div {...fadeInUp} transition={{ delay: 0.3 }}>
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Clock className="w-5 h-5 text-heritage-terracottaDark" />
                                <span className="text-sm text-muted-foreground">Remaining</span>
                            </div>
                            <p className="text-3xl font-bold text-foreground">{daysRemaining}</p>
                            <p className="text-xs text-muted-foreground mt-1">days to go</p>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Calendar Grid — takes 2 columns */}
                <div className="lg:col-span-2 space-y-4">
                    {/* Attendance Button */}
                    <motion.div {...fadeInUp}>
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between flex-wrap gap-3">
                                    <div>
                                        <h3 className="font-semibold text-foreground">Today's Attendance</h3>
                                        <p className="text-sm text-muted-foreground">
                                            {isTodayMarked()
                                                ? '✓ You have completed today\'s practice. Keep the momentum!'
                                                : 'Mark your daily sadhana practice to stay on track.'}
                                        </p>
                                    </div>
                                    <Button
                                        variant={isTodayMarked() ? 'outline' : 'gold'}
                                        disabled={isTodayMarked() || markingAttendance}
                                        onClick={handleMarkAttendance}
                                        className="min-w-[140px]"
                                    >
                                        {markingAttendance ? (
                                            <Loader2 className="w-4 h-4 animate-spin mr-1" />
                                        ) : isTodayMarked() ? (
                                            <CheckCircle2 className="w-4 h-4 mr-1" />
                                        ) : (
                                            <Zap className="w-4 h-4 mr-1" />
                                        )}
                                        {isTodayMarked() ? 'Done for Today' : 'Mark Attendance'}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Calendar */}
                    <motion.div {...fadeInUp}>
                        <Card>
                            <CardHeader className="pb-2">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <Calendar className="w-5 h-5 text-heritage-gold" />
                                        41-Day Calendar
                                    </CardTitle>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}
                                        >
                                            <ChevronLeft className="w-4 h-4" />
                                        </Button>
                                        <span className="text-sm font-medium text-foreground min-w-[120px] text-center">
                                            {monthName}
                                        </span>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}
                                        >
                                            <ChevronRight className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {/* Day headers */}
                                <div className="grid grid-cols-7 gap-1 mb-2">
                                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                                        <div key={d} className="text-center text-xs font-medium text-muted-foreground py-1">
                                            {d}
                                        </div>
                                    ))}
                                </div>
                                {/* Day grid */}
                                <div className="grid grid-cols-7 gap-1">
                                    {days}
                                </div>

                                {/* Legend */}
                                <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground flex-wrap">
                                    <div className="flex items-center gap-1">
                                        <div className="w-3 h-3 rounded bg-green-500" />
                                        <span>Attended</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <div className="w-3 h-3 rounded bg-red-100 border border-red-200" />
                                        <span>Missed</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <div className="w-3 h-3 rounded bg-heritage-gold" />
                                        <span>Today</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <div className="w-3 h-3 rounded bg-heritage-creamLight/50" />
                                        <span>Upcoming</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Canvas Progress Photos */}
                    <motion.div {...fadeInUp}>
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Image className="w-5 h-5 text-heritage-gold" />
                                    Canvas Progress Photos
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="mb-4">
                                    <label className="cursor-pointer">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handlePhotoUpload}
                                            className="hidden"
                                            disabled={uploadingPhoto}
                                        />
                                        <div className="border-2 border-dashed border-heritage-terracotta/30 rounded-lg p-6 text-center hover:border-heritage-gold/50 transition-colors">
                                            {uploadingPhoto ? (
                                                <Loader2 className="w-8 h-8 animate-spin text-heritage-gold mx-auto" />
                                            ) : (
                                                <>
                                                    <Camera className="w-8 h-8 text-heritage-terracottaDark mx-auto mb-2" />
                                                    <p className="text-sm text-muted-foreground">
                                                        Upload a photo of your canvas progress
                                                    </p>
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        Click or drag & drop
                                                    </p>
                                                </>
                                            )}
                                        </div>
                                    </label>
                                </div>

                                {canvasPhotos.length > 0 ? (
                                    <div className="grid grid-cols-3 gap-3">
                                        {canvasPhotos.map(photo => (
                                            <div key={photo.id} className="relative group rounded-lg overflow-hidden aspect-square">
                                                <img
                                                    src={photo.url}
                                                    alt={photo.caption}
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end p-2">
                                                    <p className="text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                                                        {photo.caption}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-6">
                                        <p className="text-sm text-muted-foreground">
                                            No photos uploaded yet. Document your canvas journey!
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                {/* Right Sidebar */}
                <div className="space-y-4">
                    {/* Live Sessions */}
                    <motion.div {...fadeInUp}>
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <LinkIcon className="w-5 h-5 text-heritage-gold" />
                                    Live Sessions
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {displaySessions.map((session, i) => (
                                    <div key={i} className="flex items-start gap-3 p-2 rounded-lg hover:bg-heritage-creamLight/50 transition-colors">
                                        <div className="w-8 h-8 rounded-full bg-heritage-terracotta/10 flex items-center justify-center flex-shrink-0">
                                            <BookOpen className="w-4 h-4 text-heritage-terracottaDark" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-foreground">{session.title}</p>
                                            {session.module && (
                                                <p className="text-xs text-muted-foreground">{session.module}</p>
                                            )}
                                            {session.date && (
                                                <p className="text-xs text-muted-foreground">
                                                    {new Date(session.date).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })}
                                                </p>
                                            )}
                                        </div>
                                        <a
                                            href={session.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-heritage-gold hover:text-heritage-terracottaDark transition-colors"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                        </a>
                                    </div>
                                ))}
                            </CardContent>
                            <CardFooter className="pt-0">
                                <p className="text-xs text-muted-foreground">
                                    Join live sessions to connect with mentors and fellow practitioners
                                </p>
                            </CardFooter>
                        </Card>
                    </motion.div>

                    {/* Quick Tips */}
                    <motion.div {...fadeInUp} transition={{ delay: 0.1 }}>
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Star className="w-5 h-5 text-heritage-gold" />
                                    Sadhana Tips
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {[
                                    { icon: Palette, text: 'Set aside a dedicated time each day for your practice' },
                                    { icon: Users, text: 'Share your progress with the community for accountability' },
                                    { icon: Camera, text: 'Document your canvas at the same angle each day' },
                                    { icon: Sparkles, text: 'Reflect on what you learned after each session' },
                                ].map((tip, i) => {
                                    const TipIcon = tip.icon;
                                    return (
                                        <div key={i} className="flex items-start gap-2">
                                            <TipIcon className="w-4 h-4 text-heritage-terracottaDark mt-0.5 flex-shrink-0" />
                                            <p className="text-sm text-muted-foreground">{tip.text}</p>
                                        </div>
                                    );
                                })}
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Completion Tracker */}
                    <motion.div {...fadeInUp} transition={{ delay: 0.2 }}>
                        <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Award className="w-5 h-5 text-purple-600" />
                                    Completion Tracker
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center">
                                    <div className="relative w-24 h-24 mx-auto mb-3">
                                        <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
                                            <circle
                                                cx="50" cy="50" r="42"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="8"
                                                className="text-purple-200"
                                            />
                                            <circle
                                                cx="50" cy="50" r="42"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="8"
                                                strokeLinecap="round"
                                                className="text-purple-600"
                                                strokeDasharray={`${2 * Math.PI * 42}`}
                                                strokeDashoffset={`${2 * Math.PI * 42 * (1 - progressPercent / 100)}`}
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span className="text-2xl font-bold text-purple-700">{progressPercent}%</span>
                                        </div>
                                    </div>
                                    <p className="text-sm font-medium text-purple-800">
                                        {completedDays >= TOTAL_DAYS
                                            ? '🎉 Sadhana Complete! Congratulations!'
                                            : `${daysRemaining} days until completion`}
                                    </p>
                                    {completedDays >= TOTAL_DAYS && (
                                        <Badge variant="success" className="mt-2">
                                            Certificate Available
                                        </Badge>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}