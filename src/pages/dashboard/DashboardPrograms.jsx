import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    BookOpen, Clock, CheckCircle2, PlayCircle, Lock,
    ArrowRight, ChevronRight, Star, BarChart3, Trophy,
    Calendar, MapPin, Users
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { programAPI, userAPI } from '@/api';

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
};

const fallbackPrograms = {
    enrolled: [
        {
            id: 1, title: 'Heritage Art Basics', slug: 'heritage-art-basics',
            category: 'Painting', level: 'Beginner', progress: 65,
            modulesCompleted: 4, totalModules: 6,
            nextModule: 'Module 5: Madhubani Techniques',
            instructor: 'Priya Sharma', duration: '8 weeks',
            image: 'from-heritage-terracotta to-red-800'
        },
        {
            id: 2, title: 'Mindfulness Through Art', slug: 'mindfulness-art',
            category: 'Mindfulness', level: 'Intermediate', progress: 30,
            modulesCompleted: 2, totalModules: 7,
            nextModule: 'Module 3: Meditation & Color',
            instructor: 'Anita Desai', duration: '6 weeks',
            image: 'from-purple-700 to-indigo-800'
        },
        {
            id: 3, title: 'Warli Folk Art Mastery', slug: 'warli-folk-art',
            category: 'Folk Art', level: 'Advanced', progress: 10,
            modulesCompleted: 1, totalModules: 8,
            nextModule: 'Module 2: Traditional Patterns',
            instructor: 'Ravi Bhil', duration: '10 weeks',
            image: 'from-amber-700 to-orange-800'
        },
    ],
    available: [
        {
            id: 4, title: 'Kalamkari Textile Art', slug: 'kalamkari-textile',
            category: 'Textile Art', level: 'Intermediate', price: 2500,
            modules: 6, instructor: 'Lakshmi Rao', duration: '8 weeks',
            image: 'from-green-700 to-emerald-800', enrolled: 156
        },
        {
            id: 5, title: 'Miniature Painting Techniques', slug: 'miniature-painting',
            category: 'Painting', level: 'Advanced', price: 3500,
            modules: 10, instructor: 'Rajesh Kumar', duration: '12 weeks',
            image: 'from-blue-700 to-cyan-800', enrolled: 89
        },
        {
            id: 6, title: 'Art Therapy for Wellness', slug: 'art-therapy-wellness',
            category: 'Wellness', level: 'Beginner', price: 1500,
            modules: 5, instructor: 'Dr. Meena Iyer', duration: '4 weeks',
            image: 'from-teal-700 to-green-800', enrolled: 234
        },
        {
            id: 7, title: 'Pattachitra Storytelling', slug: 'pattachitra-storytelling',
            category: 'Folk Art', level: 'Intermediate', price: 2000,
            modules: 7, instructor: 'Sujata Das', duration: '6 weeks',
            image: 'from-pink-700 to-rose-800', enrolled: 112
        },
    ],
    completed: [
        {
            id: 8, title: 'Introduction to Indian Art Forms', slug: 'intro-indian-art',
            category: 'General', level: 'Beginner', completedDate: 'May 15, 2026',
            grade: 'A+', certificate: true,
            image: 'from-heritage-gold to-amber-600'
        },
    ]
};

export default function DashboardPrograms() {
    const [activeTab, setActiveTab] = useState('enrolled');
    const [programs, setPrograms] = useState(fallbackPrograms);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPrograms = async () => {
            try {
                // Fetch enrolled/completed programs (user's own)
                const enrolledRes = await userAPI.getMyPrograms();
                const enrolledData = enrolledRes.data?.data || [];

                // Separate active vs completed enrollments
                const enrolled = enrolledData
                    .filter(p => p.status !== 'completed')
                    .map(p => ({
                        id: p._id || p.id,
                        programId: p.program?._id?.toString() || p.program?.toString() || '',
                        title: p.program?.title || p.title || 'Program',
                        slug: p.program?.slug || p.slug || '',
                        category: p.program?.programType || p.program?.category || p.category || 'General',
                        level: p.program?.level || p.level || 'all',
                        progress: p.progress || 0,
                        modulesCompleted: p.completedModules?.length || p.modulesCompleted || 0,
                        totalModules: Array.isArray(p.program?.modules) ? p.program.modules.length : (p.program?.totalModules || p.totalModules || 6),
                        nextModule: p.program?.modules?.find(m => !p.completedModules?.includes(m._id?.toString()))?.title || 'Next Module',
                        instructor: p.program?.instructor?.name || (typeof p.program?.instructor === 'string' ? p.program.instructor : 'Adyom Instructor'),
                        duration: p.program?.duration || p.duration || '',
                        image: p.program?.image ? '' : 'from-heritage-terracotta to-red-800',
                        imageUrl: p.program?.image || null,
                        programType: p.program?.programType || '',
                    }));

                const completed = enrolledData
                    .filter(p => p.status === 'completed')
                    .map(p => ({
                        id: p._id || p.id,
                        programId: p.program?._id?.toString() || '',
                        title: p.program?.title || p.title || 'Program',
                        slug: p.program?.slug || p.slug || '',
                        category: p.program?.programType || p.program?.category || p.category || 'General',
                        level: p.program?.level || p.level || 'all',
                        completedDate: p.completedDate ? new Date(p.completedDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Recently',
                        grade: p.grade || 'A',
                        certificate: p.certificate || false,
                        image: p.program?.image ? '' : 'from-heritage-gold to-amber-600',
                        imageUrl: p.program?.image || null,
                    }));

                // Fetch all published programs for available tab
                const availableRes = await programAPI.getAll({ isPublished: true });
                const availableData = availableRes.data?.data || [];

                // Filter out programs the user is already enrolled in (using program._id)
                const enrolledProgramIds = new Set(enrolled.map(p => p.programId).filter(Boolean));
                const available = availableData
                    .filter(p => !enrolledProgramIds.has((p._id || p.id)?.toString()))
                    .map(p => ({
                        id: p._id || p.id,
                        title: p.title || 'Program',
                        slug: p.slug || '',
                        category: p.programType || p.category || 'General',
                        level: p.level || 'all',
                        price: p.price || 0,
                        isFree: p.isFree || false,
                        modules: Array.isArray(p.modules) ? p.modules.length : (p.totalModules || 0),
                        instructor: p.instructor?.name || (typeof p.instructor === 'string' ? p.instructor : 'Adyom Instructor'),
                        duration: p.duration || '',
                        image: p.image ? '' : 'from-green-700 to-emerald-800',
                        imageUrl: p.image || null,
                        enrolled: p.currentEnrollments || p.enrolledCount || 0,
                    }));

                setPrograms({ enrolled, available, completed });
            } catch (err) {
                console.error('Error fetching programs:', err);
                setPrograms(fallbackPrograms);
            } finally {
                setLoading(false);
            }
        };
        fetchPrograms();
    }, []);

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-2">
                        <Skeleton className="h-7 w-48" />
                        <Skeleton className="h-4 w-72" />
                    </div>
                    <Skeleton className="h-7 w-56 rounded-full" />
                </div>
                <Separator />
                <div className="flex flex-wrap gap-2">
                    <Skeleton className="h-10 w-28 rounded-sm" />
                    <Skeleton className="h-10 w-28 rounded-sm" />
                    <Skeleton className="h-10 w-28 rounded-sm" />
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="bg-surface rounded-xl shadow-md overflow-hidden border border-heritage-creamDark">
                            <Skeleton className="h-40 w-full rounded-none" />
                            <div className="p-5 space-y-3">
                                <Skeleton className="h-5 w-4/5" />
                                <Skeleton className="h-4 w-full" />
                                <div className="flex gap-2">
                                    <Skeleton className="h-6 w-20 rounded-full" />
                                    <Skeleton className="h-6 w-24 rounded-full" />
                                </div>
                                <Skeleton className="h-10 w-full rounded-sm" />
                            </div>
                        </div>
                    ))}
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
                            <BookOpen className="w-6 h-6 text-heritage-gold" />
                            My Programs
                        </h1>
                        <p className="text-muted-foreground mt-1">Track your learning journey and discover new programs</p>
                    </div>
                    <Badge variant="gold" className="text-sm">
                        {programs.enrolled?.length || 0} Enrolled · {programs.completed?.length || 0} Completed
                    </Badge>
                </div>
            </motion.div>

            <Separator />

            {/* Tabs */}
            <motion.div {...fadeInUp}>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="w-full justify-start">
                        <TabsTrigger value="enrolled" active={activeTab === 'enrolled'} onClick={() => setActiveTab('enrolled')}>
                            <PlayCircle className="w-4 h-4 mr-1" /> In Progress ({programs.enrolled?.length || 0})
                        </TabsTrigger>
                        <TabsTrigger value="available" active={activeTab === 'available'} onClick={() => setActiveTab('available')}>
                            <BookOpen className="w-4 h-4 mr-1" /> Available
                        </TabsTrigger>
                        <TabsTrigger value="completed" active={activeTab === 'completed'} onClick={() => setActiveTab('completed')}>
                            <CheckCircle2 className="w-4 h-4 mr-1" /> Completed ({programs.completed?.length || 0})
                        </TabsTrigger>
                    </TabsList>

                    {/* Enrolled Programs */}
                    <TabsContent value="enrolled" active={activeTab === 'enrolled'} className="space-y-4 mt-6">
                        {programs.enrolled?.length === 0 && (
                            <div className="text-center py-12 border border-dashed rounded-lg">
                                <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                                <h3 className="text-lg font-medium text-foreground">No enrolled programs</h3>
                                <p className="text-muted-foreground mb-4">You are not enrolled in any programs yet.</p>
                                <Button variant="outlineGold" onClick={() => setActiveTab('available')}>
                                    Browse Available Programs
                                </Button>
                            </div>
                        )}
                        {programs.enrolled?.map((program) => (
                            <motion.div key={program.id} {...fadeInUp}>
                                <Card className="hover:shadow-md transition-shadow">
                                    <CardContent className="p-6">
                                        <div className="flex items-start gap-4">
                                            {program.imageUrl ? (
                                                <img src={program.imageUrl} alt={program.title} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                                            ) : (
                                                <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${program.image} flex items-center justify-center flex-shrink-0`}>
                                                    <BookOpen className="w-8 h-8 text-white" />
                                                </div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                    <h3 className="font-semibold text-foreground">{program.title}</h3>
                                                    {program.level !== 'all' && <Badge variant="outline" className="text-xs capitalize">{program.level}</Badge>}
                                                    <Badge variant="gold" className="text-xs">{program.category}</Badge>
                                                </div>
                                                <p className="text-sm text-muted-foreground">
                                                    {program.instructor && <>Instructor: {program.instructor} · </>}{program.duration && <>{program.duration}</>}
                                                </p>
                                                <div className="mt-3">
                                                    <div className="flex items-center justify-between text-xs mb-1">
                                                        <span className="text-muted-foreground">Progress</span>
                                                        <span className="font-semibold text-heritage-terracottaDark">{program.progress}%</span>
                                                    </div>
                                                    <div className="w-full h-2.5 rounded-full bg-heritage-terracotta/20">
                                                        <div className="h-2.5 rounded-full bg-gradient-to-r from-heritage-terracotta to-heritage-gold transition-all" style={{ width: `${program.progress}%` }} />
                                                    </div>
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        {program.modulesCompleted} of {program.totalModules} modules completed
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <Link to={program.category === 'Pratibimb' ? '/dashboard/pratibimb' : `/programs/${program.slug}`}>
                                                    <Button variant="default" size="sm">
                                                        Continue <ArrowRight className="w-4 h-4 ml-1" />
                                                    </Button>
                                                </Link>
                                                <p className="text-xs text-muted-foreground text-center">
                                                    {program.nextModule}
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </TabsContent>

                    {/* Available Programs */}
                    <TabsContent value="available" active={activeTab === 'available'} className="mt-6">
                        <div className="grid md:grid-cols-2 gap-4">
                            {programs.available?.map((program) => (
                                <motion.div key={program.id} {...fadeInUp}>
                                    <Card className="hover:shadow-md transition-all group">
                                        {program.imageUrl ? (
                                            <div className="h-32 relative overflow-hidden">
                                                <img src={program.imageUrl} alt={program.title} className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                                                <div className="absolute bottom-3 left-3">
                                                    <Badge className="bg-white/90 text-heritage-terracottaDark">{program.category}</Badge>
                                                </div>
                                                <div className="absolute top-3 right-3">
                                                    <Badge variant="gold" className="text-xs">{program.isFree || program.price === 0 ? 'Free' : `₹${program.price}`}</Badge>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className={`h-32 bg-gradient-to-br ${program.image} relative`}>
                                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                                                <div className="absolute bottom-3 left-3">
                                                    <Badge className="bg-white/90 text-heritage-terracottaDark">{program.category}</Badge>
                                                </div>
                                                <div className="absolute top-3 right-3">
                                                    <Badge variant="gold" className="text-xs">{program.isFree || program.price === 0 ? 'Free' : `₹${program.price}`}</Badge>
                                                </div>
                                            </div>
                                        )}
                                        <CardContent className="p-4">
                                            <h3 className="font-semibold text-foreground mb-1">{program.title}</h3>
                                            <p className="text-sm text-muted-foreground mb-2">
                                                {program.instructor}{program.modules > 0 ? ` · ${program.modules} modules` : ''}{program.duration ? ` · ${program.duration}` : ''}
                                            </p>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <Users className="w-3.5 h-3.5" />
                                                <span>{program.enrolled > 0 ? `${program.enrolled} enrolled` : 'Be the first to enroll'}</span>
                                            </div>
                                        </CardContent>
                                        <CardFooter className="p-4 pt-0">
                                            <Link to={`/programs/${program.slug}`} className="w-full">
                                                <Button variant="outlineGold" size="sm" className="w-full">
                                                    View Details & Enroll
                                                </Button>
                                            </Link>
                                        </CardFooter>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </TabsContent>

                    {/* Completed Programs */}
                    <TabsContent value="completed" active={activeTab === 'completed'} className="space-y-4 mt-6">
                        {programs.completed?.map((program) => (
                            <motion.div key={program.id} {...fadeInUp}>
                                <Card className="border-green-200 bg-green-50/50">
                                    <CardContent className="p-6">
                                        <div className="flex items-start gap-4">
                                            {program.imageUrl ? (
                                                <img src={program.imageUrl} alt={program.title} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                                            ) : (
                                                <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${program.image} flex items-center justify-center flex-shrink-0`}>
                                                    <Trophy className="w-8 h-8 text-white" />
                                                </div>
                                            )}
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="font-semibold text-foreground">{program.title}</h3>
                                                    <Badge variant="success" className="text-xs">Completed</Badge>
                                                    <Badge variant="gold" className="text-xs">Grade: {program.grade}</Badge>
                                                </div>
                                                <p className="text-sm text-muted-foreground">
                                                    Completed on {program.completedDate}
                                                </p>
                                                {program.certificate && (
                                                    <div className="mt-2">
                                                        <Link to="/dashboard/certificates">
                                                            <Button variant="outlineGold" size="sm">
                                                                <Trophy className="w-4 h-4 mr-1" /> View Certificate
                                                            </Button>
                                                        </Link>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                        {programs.completed?.length === 0 && (
                            <div className="text-center py-12">
                                <CheckCircle2 className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                                <p className="text-muted-foreground">No completed programs yet. Keep learning!</p>
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </motion.div>
        </div>
    );
}
