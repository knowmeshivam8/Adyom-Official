import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BookOpen, Sparkles, PlayCircle, CheckCircle2, Clock,
    Lock, Download, Star, Filter, Search, ChevronRight,
    GraduationCap, Lightbulb, Palette, Music, TreePine,
    Eye, FileText, Video as VideoIcon, Loader2, X,
    Send, Camera, Activity, Award, Layers, Upload
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { learningAPI, artworkAPI, programAPI, dashboardAPI } from '@/api';
import SecureVideoPlayer from '@/components/ui/SecureVideoPlayer';
import { useAuth } from '@/context/AuthContext';

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
};

export default function DashboardLearning() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('library');
    const [search, setSearch] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');
    const [learningItems, setLearningItems] = useState([]);
    const [progress, setProgress] = useState([]);
    const [loading, setLoading] = useState(true);

    // Module assignment state
    const [enrolledPrograms, setEnrolledPrograms] = useState([]);
    const [selectedProgram, setSelectedProgram] = useState(null);
    const [moduleSubmissions, setModuleSubmissions] = useState({});
    const [showSubmissionModal, setShowSubmissionModal] = useState(false);
    const [submissionModule, setSubmissionModule] = useState(null);
    const [submissionType, setSubmissionType] = useState('artwork');
    const [submissionImages, setSubmissionImages] = useState([]);
    const [submissionTitle, setSubmissionTitle] = useState('');
    const [submissionDescription, setSubmissionDescription] = useState('');
    const [submitting, setSubmitting] = useState(false);

    // Video player modal state
    const [activeVideo, setActiveVideo] = useState(null);
    const [showVideoModal, setShowVideoModal] = useState(false);

    const openVideoPlayer = useCallback((item) => {
        const enrolledProgram = user?.enrolledPrograms?.find(
            ep => String(ep.program?._id || ep.program) === String(item.programId || item.program)
        );
        const programId = item.programId || item.program || enrolledProgram?.program?._id || enrolledProgram?.program || '';

        setActiveVideo({
            videoUrl: item.videoUrl || item.content || '',
            videoId: String(item._id || item.id),
            programId: String(programId),
            moduleTitle: item.moduleTitle || item.title || '',
            sessionIndex: item.sessionIndex || 0,
            poster: item.thumbnail || item.imageUrl || null,
        });
        setShowVideoModal(true);
    }, [user]);

    const closeVideoPlayer = useCallback(() => {
        setShowVideoModal(false);
        setTimeout(() => setActiveVideo(null), 300);
    }, []);

    const enrolledProgramIds = useMemo(() => {
        if (!user?.enrolledPrograms) return new Set();
        return new Set(
            user.enrolledPrograms.map(ep => String(ep.program?._id || ep.program))
        );
    }, [user]);

    // Fetch enrolled Chaitanya/Sparsh programs and their module submissions
    useEffect(() => {
        const fetchModuleData = async () => {
            if (!user?.enrolledPrograms || user.enrolledPrograms.length === 0) return;

            const chaitanyaSparshEnrollments = user.enrolledPrograms.filter(ep => {
                const prog = ep.program;
                const type = prog?.programType || prog?.category || '';
                return ['Chaitanya', 'Sparsh', 'chaitanya', 'sparsh', 'KalaPath', 'kalapath', 'kala-path', 'KalaVritti', 'kalavritti', 'kala-vritti', 'Pratibimb', 'pratibimb'].includes(type);
            });

            if (chaitanyaSparshEnrollments.length === 0) return;

            const programs = [];
            for (const ep of chaitanyaSparshEnrollments) {
                const progId = ep.program?._id || ep.program;
                try {
                    const progRes = await programAPI.getById(progId);
                    const prog = progRes.data.data || progRes.data;
                    if (prog) {
                        // Fetch module submissions
                        let submissions = {};
                        try {
                            const subRes = await learningAPI.getModuleSubmissions(progId);
                            submissions = subRes.data.data || {};
                        } catch (e) { /* ignore */ }

                        programs.push({
                            ...prog,
                            enrollment: ep,
                            submissions,
                        });
                    }
                } catch (e) { /* ignore */ }
            }
            setEnrolledPrograms(programs);
            if (programs.length > 0 && !selectedProgram) {
                setSelectedProgram(programs[0]);
                setModuleSubmissions(programs[0].submissions);
            }
        };

        fetchModuleData();
    }, [user]);

    useEffect(() => {
        const fetchLearningData = async () => {
            try {
                const res = await learningAPI.getAll({ status: 'published' });
                const apiItems = res.data.data || [];
                if (apiItems.length > 0) {
                    setLearningItems(apiItems.map(item => ({
                        id: item._id || item.id,
                        title: item.title || 'Learning Resource',
                        category: item.category || 'General',
                        type: item.type || 'article',
                        level: item.level || 'Beginner',
                        duration: item.duration || '30 min',
                        instructor: item.instructor || 'Instructor',
                        rating: item.rating || 4.5,
                        enrolled: item.enrolledCount || item.enrolled || 0,
                        description: item.description || '',
                        gradient: item.image ? '' : 'from-heritage-terracotta to-red-800',
                        imageUrl: item.image || null,
                        videoUrl: item.videoUrl || null,
                        moduleTitle: item.moduleTitle || '',
                        sessionIndex: item.sessionIndex || 0,
                        programId: item.program || '',
                    })));
                }
            } catch (err) {
                console.log('Using fallback learning data:', err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchLearningData();
    }, []);

    // Handle marking attendance for Pratibimb
    const handleMarkAttendance = async () => {
        if (!selectedProgram || selectedProgram.programType !== 'Pratibimb') return;
        setSubmitting(true);
        try {
            const res = await dashboardAPI.markAttendance({ programId: selectedProgram._id });
            if (res.data.success) {
                // Update local state to reflect new attendance
                const newAttendanceCount = res.data.data.attendanceCount;
                setEnrolledPrograms(prev => prev.map(p => {
                    if (p._id === selectedProgram._id) {
                        return {
                            ...p,
                            enrollment: {
                                ...p.enrollment,
                                attendance: [...(p.enrollment.attendance || []), { date: new Date(), marked: true }]
                            }
                        };
                    }
                    return p;
                }));
                // Also update selectedProgram
                setSelectedProgram(prev => ({
                    ...prev,
                    enrollment: {
                        ...prev.enrollment,
                        attendance: [...(prev.enrollment.attendance || []), { date: new Date(), marked: true }]
                    }
                }));
                alert('Attendance marked successfully for today!');
            }
        } catch (error) {
            console.error('Attendance error:', error);
            alert(error.response?.data?.message || 'Failed to mark attendance.');
        } finally {
            setSubmitting(false);
        }
    };

    // Handle program selection change
    const handleProgramChange = (program) => {
        setSelectedProgram(program);
        setModuleSubmissions(program.submissions || {});
    };

    // Open submission modal
    const openSubmission = (module, type) => {
        setSubmissionModule(module);
        setSubmissionType(type);
        setSubmissionTitle('');
        setSubmissionDescription('');
        setSubmissionImages([]);
        setShowSubmissionModal(true);
    };

    // Submit module assignment
    const handleSubmitAssignment = async () => {
        if (!selectedProgram || !submissionModule) return;
        setSubmitting(true);
        try {
            // First, submit the artwork if images are provided
            let artworkId = null;
            if (submissionImages.length > 0) {
                // For simplicity, we use the first image URL as the artwork submission
                const artworkData = {
                    title: submissionTitle || `${submissionModule.artFormName || submissionModule.moduleTitle} - ${submissionType === 'artwork' ? 'Artwork' : 'Activity'}`,
                    description: submissionDescription || `${submissionType} submission for ${submissionModule.artFormName || submissionModule.moduleTitle}`,
                    program: selectedProgram._id,
                    programModuleId: submissionModule.moduleId,
                    moduleName: submissionModule.artFormName || submissionModule.moduleTitle,
                    submissionType: submissionType,
                    category: 'folk-art',
                    images: submissionImages.map(url => ({ url, caption: '' })),
                };

                const artRes = await artworkAPI.submit(artworkData);
                artworkId = artRes.data.data?._id || artRes.data?._id;
            }

            // Record module submission
            await learningAPI.submitModuleAssignment({
                programId: selectedProgram._id,
                moduleId: submissionModule.moduleId,
                moduleTitle: submissionModule.artFormName || submissionModule.moduleTitle,
                submissionType: submissionType,
                artworkId: artworkId,
            });

            // Refresh module submissions
            const subRes = await learningAPI.getModuleSubmissions(selectedProgram._id);
            const newSubmissions = subRes.data.data || {};

            setModuleSubmissions(newSubmissions);
            setEnrolledPrograms(prev =>
                prev.map(p => p._id === selectedProgram._id ? { ...p, submissions: newSubmissions } : p)
            );

            setShowSubmissionModal(false);
        } catch (err) {
            console.error('Submission failed:', err);
            alert('Failed to submit assignment. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const categories = ['all', 'Folk Art', 'Painting', 'Mindfulness', 'Music & Art', 'Textile Art', 'Wellness'];

    const filteredItems = learningItems.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) ||
            item.description.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    const getTypeIcon = (type) => {
        switch (type) {
            case 'video': return VideoIcon;
            case 'article': return FileText;
            case 'course': return GraduationCap;
            default: return BookOpen;
        }
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-2">
                        <Skeleton className="h-7 w-60" />
                        <Skeleton className="h-4 w-96" />
                    </div>
                    <Skeleton className="h-7 w-48 rounded-full" />
                </div>
                <Separator />
                <div className="flex flex-col md:flex-row gap-4">
                    <Skeleton className="h-10 w-full md:w-72 rounded-sm" />
                    <div className="flex flex-wrap gap-2">
                        <Skeleton className="h-10 w-24 rounded-sm" />
                        <Skeleton className="h-10 w-24 rounded-sm" />
                        <Skeleton className="h-10 w-24 rounded-sm" />
                    </div>
                </div>
                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2 space-y-4">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="bg-surface rounded-xl shadow-md border border-heritage-creamDark p-5 space-y-3">
                                <Skeleton className="h-5 w-2/3" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-5/6" />
                                <div className="flex gap-2">
                                    <Skeleton className="h-6 w-20 rounded-full" />
                                    <Skeleton className="h-6 w-24 rounded-full" />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="space-y-4">
                        <div className="bg-surface rounded-xl shadow-md border border-heritage-creamDark p-5 space-y-3">
                            <Skeleton className="h-5 w-1/2" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-5/6" />
                            <Skeleton className="h-10 w-full rounded-sm" />
                        </div>
                        <div className="bg-surface rounded-xl shadow-md border border-heritage-creamDark p-5 space-y-3">
                            <Skeleton className="h-5 w-2/3" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                        </div>
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
                            <Sparkles className="w-6 h-6 text-heritage-gold" />
                            Learning Dashboard
                        </h1>
                        <p className="text-muted-foreground mt-1">Access your program modules, submit assignments, and track progress</p>
                    </div>
                    <Badge variant="gold" className="text-sm">
                        {enrolledPrograms.length} Program{enrolledPrograms.length !== 1 ? 's' : ''} Enrolled
                    </Badge>
                </div>
            </motion.div>

            <Separator />

            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="w-full justify-start">
                    <TabsTrigger value="modules" active={activeTab === 'modules'} onClick={() => setActiveTab('modules')}>
                        <Layers className="w-4 h-4 mr-1" /> My Modules
                    </TabsTrigger>
                    <TabsTrigger value="library" active={activeTab === 'library'} onClick={() => setActiveTab('library')}>
                        <BookOpen className="w-4 h-4 mr-1" /> Library
                    </TabsTrigger>
                    <TabsTrigger value="submissions" active={activeTab === 'submissions'} onClick={() => setActiveTab('submissions')}>
                        <CheckCircle2 className="w-4 h-4 mr-1" /> Submissions
                    </TabsTrigger>
                </TabsList>

                {/* Modules Tab — Chaitanya/Sparsh module progress */}
                <TabsContent value="modules" active={activeTab === 'modules'} className="space-y-4 mt-6">
                    {enrolledPrograms.length === 0 ? (
                        <div className="text-center py-12">
                            <Layers className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-semibold">No enrolled programs found</h3>
                            <p className="text-muted-foreground mt-1">Enroll in a Chaitanya or Sparsh program to see your modules here.</p>
                        </div>
                    ) : (
                        <>
                            {/* Program selector */}
                            <div className="flex gap-2 flex-wrap">
                                {enrolledPrograms.map(prog => (
                                    <Button
                                        key={prog._id}
                                        variant={selectedProgram?._id === prog._id ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => handleProgramChange(prog)}
                                    >
                                        {prog.title || prog.programType}
                                    </Button>
                                ))}
                            </div>

                            {selectedProgram && (
                                <>
                                    {/* Progress bar */}
                                    <Card>
                                        <CardContent className="p-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <h3 className="font-semibold">{selectedProgram.title}</h3>
                                                <Badge variant="gold">
                                                    {moduleSubmissions.completedModules?.length || 0}/{selectedProgram.modules?.filter(m => m.isActive).length || 0} Modules
                                                </Badge>
                                            </div>
                                            <div className="w-full h-3 rounded-full bg-heritage-terracotta/20">
                                                <div
                                                    className="h-3 rounded-full bg-gradient-to-r from-heritage-terracotta to-heritage-gold transition-all"
                                                    style={{ width: `${moduleSubmissions.progress || 0}%` }}
                                                />
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-1">{moduleSubmissions.progress || 0}% complete</p>
                                        </CardContent>
                                    </Card>

                                    {/* Pratibimb 41-Day Tracker */}
                                    {selectedProgram.programType === 'Pratibimb' && (
                                        <div className="space-y-6">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-xl font-heading font-bold text-heritage-terracottaDark">Your 41-Day Sadhana</h3>
                                                <Button variant="gold" onClick={handleMarkAttendance} disabled={submitting}>
                                                    <CheckCircle2 className="w-4 h-4 mr-2" /> Mark Today's Attendance
                                                </Button>
                                            </div>
                                            
                                            <div className="grid grid-cols-5 sm:grid-cols-7 md:grid-cols-9 gap-2">
                                                {Array.from({ length: 41 }).map((_, i) => {
                                                    const dayNumber = i + 1;
                                                    const attendanceData = selectedProgram.enrollment?.attendance || [];
                                                    const isAttended = dayNumber <= attendanceData.length;
                                                    const isCurrent = dayNumber === attendanceData.length + 1;
                                                    
                                                    let bgColor = 'bg-white border-heritage-terracotta/20';
                                                    let textColor = 'text-heritage-terracottaDark';
                                                    if (isAttended) {
                                                        bgColor = 'bg-green-100 border-green-200';
                                                        textColor = 'text-green-800';
                                                    } else if (isCurrent) {
                                                        bgColor = 'bg-heritage-gold border-heritage-gold text-white';
                                                        textColor = 'text-white';
                                                    }

                                                    return (
                                                        <div 
                                                            key={i} 
                                                            className={`aspect-square rounded-md border flex flex-col items-center justify-center cursor-pointer transition-transform hover:scale-105 ${bgColor} ${isCurrent ? 'ring-2 ring-offset-2 ring-heritage-gold' : ''}`}
                                                            onClick={() => {
                                                                if (dayNumber <= 5) {
                                                                    // Main session video simulation
                                                                    const vidUrl = (selectedProgram.modules?.[0]?.sessions?.[dayNumber - 1]?.videoUrl) || 'https://www.w3schools.com/html/mov_bbb.mp4';
                                                                    openVideo(vidUrl, `Day ${dayNumber} - Main Session`, 'pratibimb-main');
                                                                } else {
                                                                    // Warmup video (loops 6 unique videos)
                                                                    const warmupVideos = [
                                                                        'https://test-videos.co.uk/vids/sintel/mp4/h264/360/Sintel_360_10s_1MB.mp4',
                                                                        'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4',
                                                                        'https://test-videos.co.uk/vids/sintel/mp4/h264/360/Sintel_360_10s_1MB.mp4',
                                                                        'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4',
                                                                        'https://test-videos.co.uk/vids/sintel/mp4/h264/360/Sintel_360_10s_1MB.mp4',
                                                                        'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4',
                                                                    ];
                                                                    const vidIndex = (dayNumber - 6) % 6;
                                                                    openVideo(warmupVideos[vidIndex], `Day ${dayNumber} - Warmup Practice`, 'pratibimb-warmup');
                                                                }
                                                            }}
                                                        >
                                                            <span className={`text-xs sm:text-sm font-bold ${textColor}`}>Day</span>
                                                            <span className={`text-lg sm:text-xl font-heading font-bold ${textColor}`}>{dayNumber}</span>
                                                            {isAttended && <CheckCircle2 className="w-3 h-3 text-green-600 mt-1" />}
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            <div className="bg-heritage-creamLight p-4 rounded-lg border border-heritage-gold/20 flex flex-col md:flex-row items-center justify-between gap-4 mt-6">
                                                <div>
                                                    <h4 className="font-semibold text-heritage-terracottaDark">Upload Today's Progress</h4>
                                                    <p className="text-sm text-text-main">Capture and upload a photo of your canvas to track your 41-day journey.</p>
                                                </div>
                                                <Button 
                                                    variant="outlineGold" 
                                                    onClick={() => openSubmission({
                                                        moduleId: 'pratibimb-daily',
                                                        moduleTitle: `Day ${(selectedProgram.enrollment?.attendance?.length || 0) + 1} Progress`,
                                                        artFormName: 'Pratibimb Sadhana',
                                                    }, 'artwork')}
                                                >
                                                    <Camera className="w-4 h-4 mr-2" /> Upload Photo
                                                </Button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Module list for all programs including Pratibimb */}
                                    <div className="space-y-3">
                                        <h3 className="text-xl font-heading font-bold text-heritage-terracottaDark mt-8 mb-4">Program Modules</h3>
                                        {(selectedProgram.modules || [])
                                                    .filter(m => m.isActive)
                                                    .sort((a, b) => (a.order || 0) - (b.order || 0))
                                                    .map((mod, i) => {
                                                const status = (moduleSubmissions.moduleStatuses || []).find(
                                                    ms => ms.moduleId === mod._id
                                                );
                                                const isComplete = status?.isCompleted;
                                                const artworkDone = status?.artworkSubmitted;
                                                const activityDone = status?.activitySubmitted;

                                                const isKalaPath = selectedProgram?.programType === 'KalaPath';
                                                const enrolledModules = selectedProgram?.enrollment?.enrolledModules || [];
                                                const isModuleUnlocked = !isKalaPath || enrolledModules.includes(mod._id);

                                                return (
                                                    <motion.div key={mod._id || i} {...fadeInUp}>
                                                        <Card className={`${isComplete ? 'border-green-200 bg-green-50/30' : ''} ${!isModuleUnlocked ? 'opacity-60' : ''}`}>
                                                            <CardContent className="p-4">
                                                                <div className="flex items-start justify-between">
                                                                    <div className="flex items-start gap-3">
                                                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold ${isComplete ? 'bg-green-100 text-green-700' : 'bg-heritage-terracotta/10 text-heritage-terracottaDark'}`}>
                                                                            {mod.order || i + 1}
                                                                        </div>
                                                                        <div>
                                                                            <h4 className="font-semibold">{mod.artFormName || mod.title}</h4>
                                                                            <p className="text-xs text-muted-foreground">{mod.artFormType && `${mod.artFormType} art`} · {(mod.sessions || []).length} sessions</p>
                                                                            <div className="flex items-center gap-3 mt-2">
                                                                                <span className={`text-xs flex items-center gap-1 ${artworkDone ? 'text-green-600' : 'text-muted-foreground'}`}>
                                                                                    {artworkDone ? <CheckCircle2 className="w-3 h-3" /> : <Camera className="w-3 h-3" />}
                                                                                    Artwork
                                                                                </span>
                                                                                <span className={`text-xs flex items-center gap-1 ${activityDone ? 'text-green-600' : 'text-muted-foreground'}`}>
                                                                                    {activityDone ? <CheckCircle2 className="w-3 h-3" /> : <Activity className="w-3 h-3" />}
                                                                                    Activity
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex flex-col gap-2">
                                                                        {!isModuleUnlocked ? (
                                                                            <Badge variant="outline" className="text-heritage-gold border-heritage-gold">
                                                                                <Lock className="w-3 h-3 mr-1" /> Locked
                                                                            </Badge>
                                                                        ) : (
                                                                            <>
                                                                                {!artworkDone && (
                                                                                    <Button
                                                                                        size="sm"
                                                                                        variant="outline"
                                                                                        onClick={() => openSubmission({
                                                                                            moduleId: mod._id,
                                                                                            moduleTitle: mod.title,
                                                                                            artFormName: mod.artFormName || mod.title,
                                                                                        }, 'artwork')}
                                                                                    >
                                                                                        <Upload className="w-3 h-3 mr-1" /> Submit Artwork
                                                                                    </Button>
                                                                                )}
                                                                                {!activityDone && (
                                                                                    <Button
                                                                                        size="sm"
                                                                                        variant="outline"
                                                                                        onClick={() => openSubmission({
                                                                                            moduleId: mod._id,
                                                                                            moduleTitle: mod.title,
                                                                                            artFormName: mod.artFormName || mod.title,
                                                                                        }, 'activity')}
                                                                                    >
                                                                                        <Upload className="w-3 h-3 mr-1" /> Submit Activity
                                                                                    </Button>
                                                                                )}
                                                                                {isComplete && (
                                                                                    <Badge variant="success" className="justify-center">
                                                                                        <CheckCircle2 className="w-3 h-3 mr-1" /> Complete
                                                                                    </Badge>
                                                                                )}
                                                                            </>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </CardContent>
                                                        </Card>
                                                    </motion.div>
                                                );
                                            })}
                                            </div>
                                        </>
                                    )}
                        </>
                    )}
                </TabsContent>

                {/* Library Tab */}
                <TabsContent value="library" active={activeTab === 'library'} className="space-y-4 mt-6">
                    <motion.div {...fadeInUp}>
                        <div className="flex items-center gap-3 flex-wrap">
                            <div className="relative flex-1 min-w-[200px]">
                                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search learning resources..." className="pl-9" />
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                                {categories.map(cat => (
                                    <Button
                                        key={cat}
                                        variant={filterCategory === cat ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => setFilterCategory(cat)}
                                        className="capitalize"
                                    >
                                        {cat === 'all' ? 'All' : cat}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredItems.map((item) => {
                            const TypeIcon = getTypeIcon(item.type);
                            return (
                                <motion.div key={item.id} {...fadeInUp}>
                                    <Card className="hover:shadow-md transition-all group">
                                        {item.imageUrl ? (
                                            <div className="h-28 relative overflow-hidden">
                                                <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                                                <div className="absolute bottom-3 left-3 flex items-center gap-2">
                                                    <Badge className="bg-white/90 text-heritage-terracottaDark text-xs capitalize">{item.type}</Badge>
                                                    <Badge className="bg-white/90 text-heritage-terracottaDark text-xs">{item.level}</Badge>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className={`h-28 bg-gradient-to-br ${item.gradient} relative`}>
                                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                                                <div className="absolute bottom-3 left-3 flex items-center gap-2">
                                                    <Badge className="bg-white/90 text-heritage-terracottaDark text-xs capitalize">{item.type}</Badge>
                                                    <Badge className="bg-white/90 text-heritage-terracottaDark text-xs">{item.level}</Badge>
                                                </div>
                                            </div>
                                        )}
                                        <CardContent className="p-4">
                                            <h4 className="font-semibold text-foreground mb-1">{item.title}</h4>
                                            <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                                            <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                                                <span>{item.instructor}</span>
                                                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{item.duration}</span>
                                            </div>
                                        </CardContent>
                                        <CardFooter className="p-4 pt-0">
                                            {item.type === 'video' && item.videoUrl ? (
                                                <Button variant="gold" size="sm" className="w-full" onClick={() => openVideoPlayer(item)}>
                                                    <PlayCircle className="w-4 h-4 mr-1" /> Watch Video
                                                </Button>
                                            ) : (
                                                <Button variant="outlineGold" size="sm" className="w-full">
                                                    Start Learning <ChevronRight className="w-4 h-4 ml-1" />
                                                </Button>
                                            )}
                                        </CardFooter>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </div>

                    {filteredItems.length === 0 && (
                        <div className="text-center py-12">
                            <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-semibold">No resources found</h3>
                            <p className="text-muted-foreground mt-1">Try adjusting your search or filter criteria</p>
                        </div>
                    )}
                </TabsContent>

                {/* Submissions Tab */}
                <TabsContent value="submissions" active={activeTab === 'submissions'} className="space-y-4 mt-6">
                    {enrolledPrograms.length === 0 ? (
                        <div className="text-center py-12">
                            <CheckCircle2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-semibold">No programs enrolled</h3>
                            <p className="text-muted-foreground mt-1">Enroll in a program to track your submissions here.</p>
                        </div>
                    ) : (
                        enrolledPrograms.map(prog => {
                            const completedModules = (prog.submissions.moduleStatuses || []).filter(ms => ms.isCompleted);
                            const totalModules = (prog.submissions.moduleStatuses || []).length;

                            return (
                                <Card key={prog._id}>
                                    <CardContent className="p-4">
                                        <h3 className="font-semibold mb-2">{prog.title}</h3>
                                        <div className="flex items-center gap-2 mb-3">
                                            <Badge variant="gold">{completedModules.length}/{totalModules} modules completed</Badge>
                                            <Badge variant="outline">{prog.submissions.progress || 0}% progress</Badge>
                                        </div>

                                        {(prog.submissions.moduleStatuses || []).map((ms, i) => (
                                            <div key={i} className="flex items-center justify-between py-2 border-t border-muted">
                                                <div className="flex items-center gap-2">
                                                    {ms.isCompleted ? (
                                                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                                                    ) : (
                                                        <Clock className="w-4 h-4 text-muted-foreground" />
                                                    )}
                                                    <span className="text-sm">{ms.artFormName || ms.moduleTitle}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs">
                                                    <span className={ms.artworkSubmitted ? 'text-green-600' : 'text-muted-foreground'}>
                                                        Artwork: {ms.artworkSubmitted ? '✓' : '✗'}
                                                    </span>
                                                    <span className={ms.activitySubmitted ? 'text-green-600' : 'text-muted-foreground'}>
                                                        Activity: {ms.activitySubmitted ? '✓' : '✗'}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>
                            );
                        })
                    )}

                    {/* Certificate eligibility */}
                    {selectedProgram && (
                        <Card className="bg-gradient-to-r from-heritage-gold/5 to-amber-50 border-heritage-gold/20">
                            <CardContent className="p-4">
                                <h4 className="font-semibold flex items-center gap-2 mb-2">
                                    <Award className="w-5 h-5 text-heritage-gold" />
                                    Certificate Eligibility
                                </h4>
                                <div className="grid grid-cols-3 gap-3 text-center text-sm">
                                    <div className="p-2 rounded bg-white/70">
                                        <p className="font-bold text-heritage-terracottaDark">
                                            {moduleSubmissions.completedModules?.length || 0}/3
                                        </p>
                                        <p className="text-xs text-muted-foreground">Excellence (3)</p>
                                    </div>
                                    <div className="p-2 rounded bg-white/70">
                                        <p className="font-bold text-heritage-terracottaDark">
                                            {moduleSubmissions.completedModules?.length || 0}/6
                                        </p>
                                        <p className="text-xs text-muted-foreground">Excellence (6)</p>
                                    </div>
                                    <div className="p-2 rounded bg-white/70">
                                        <p className="font-bold text-heritage-terracottaDark">
                                            {moduleSubmissions.completedModules?.length || 0}/{selectedProgram.modules?.filter(m => m.isActive).length || 7}
                                        </p>
                                        <p className="text-xs text-muted-foreground">Completion</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>
            </Tabs>

            {/* Submission Modal */}
            <AnimatePresence>
                {showSubmissionModal && submissionModule && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div className="absolute inset-0 bg-black/60" onClick={() => setShowSubmissionModal(false)} />
                        <motion.div
                            className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl z-10 p-6"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold">
                                    Submit {submissionType === 'artwork' ? 'Artwork' : 'Activity Work'}
                                </h3>
                                <button onClick={() => setShowSubmissionModal(false)} className="text-muted-foreground hover:text-foreground">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm font-medium mb-1 block">Module Name *</p>
                                    <Input 
                                        value={submissionModule.artFormName || submissionModule.title || 'Selected Module'} 
                                        disabled 
                                        className="bg-muted text-muted-foreground"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium mb-1 block">Title</label>
                                    <Input
                                        value={submissionTitle}
                                        onChange={e => setSubmissionTitle(e.target.value)}
                                        placeholder={`${submissionType === 'artwork' ? 'Artwork' : 'Activity'} title`}
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium mb-1 block">Description</label>
                                    <Input
                                        value={submissionDescription}
                                        onChange={e => setSubmissionDescription(e.target.value)}
                                        placeholder="Describe your work..."
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium mb-1 block">Image URL</label>
                                    <Input
                                        placeholder="https://example.com/image.jpg"
                                        onChange={e => setSubmissionImages(e.target.value ? [e.target.value] : [])}
                                    />
                                    <p className="text-xs text-muted-foreground mt-1">Paste the URL of your artwork image</p>
                                </div>

                                <div className="flex gap-2 pt-2">
                                    <Button
                                        variant="gold"
                                        className="flex-1"
                                        onClick={handleSubmitAssignment}
                                        disabled={submitting}
                                    >
                                        {submitting ? (
                                            <Loader2 className="w-4 h-4 animate-spin mr-1" />
                                        ) : (
                                            <Send className="w-4 h-4 mr-1" />
                                        )}
                                        Submit
                                    </Button>
                                    <Button variant="outline" onClick={() => setShowSubmissionModal(false)}>
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Video Player Modal */}
            <AnimatePresence>
                {showVideoModal && activeVideo && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div className="absolute inset-0 bg-black/80" onClick={closeVideoPlayer} />
                        <motion.div
                            className="relative w-full max-w-4xl bg-black rounded-xl overflow-hidden shadow-2xl z-10"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                        >
                            <div className="flex items-center justify-between px-4 py-3 bg-black/90 border-b border-white/10">
                                <div className="flex items-center gap-3 min-w-0">
                                    <PlayCircle className="w-5 h-5 text-heritage-gold flex-shrink-0" />
                                    <div className="min-w-0">
                                        <h3 className="text-white font-semibold text-sm truncate">{activeVideo.moduleTitle}</h3>
                                        <p className="text-white/50 text-xs">Progress is being tracked automatically</p>
                                    </div>
                                </div>
                                <button onClick={closeVideoPlayer} className="text-white/60 hover:text-white transition-colors p-1 rounded hover:bg-white/10">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="aspect-video">
                                <SecureVideoPlayer
                                    videoUrl={activeVideo.videoUrl}
                                    videoId={activeVideo.videoId}
                                    programId={activeVideo.programId}
                                    moduleTitle={activeVideo.moduleTitle}
                                    sessionIndex={activeVideo.sessionIndex}
                                    poster={activeVideo.poster}
                                    onComplete={() => console.log('Video completed:', activeVideo.moduleTitle)}
                                />
                            </div>
                            <div className="px-4 py-2 bg-black/90 border-t border-white/10 flex items-center justify-between">
                                <p className="text-white/40 text-xs">Protected content — downloading or recording is not permitted</p>
                                <Button variant="ghost" size="sm" className="text-white/60 hover:text-white hover:bg-white/10" onClick={closeVideoPlayer}>
                                    Close Player
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
