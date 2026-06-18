import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ProgramDetailSkeleton } from '@/components/ui/page-skeletons';
import {
    ArrowLeft, ArrowRight, Calendar, Clock, Star, BookOpen, Palette,
    Users, CheckCircle, Award, Play, Loader2, Lock, Download, Video,
    Layers, Sparkles, Brush, Activity, FileText, Camera, X, ChevronDown, ChevronUp
} from 'lucide-react';
import { programAPI, sponsorAPI, userAPI } from '@/api';
import { useAuth } from '@/context/AuthContext';
import SecureVideoPlayer from '@/components/ui/SecureVideoPlayer';

// ============ FALLBACK DATA ============
const fallbackProgram = {
    title: 'Chaitanya: The Awakening',
    category: 'chaitanya',
    categoryLabel: 'Chaitanya — The Awakening',
    level: 'all',
    duration: '1 Year (49 weeks)',
    ageGroup: 'adults',
    maxActiveModules: 7,
    price: 'Enroll Now',
    instructor: 'Adyom Art Team',
    programDurationWeeks: 49,
    desc: 'A year-long journey through 7 tribal and folk art forms of India.',
    modules: [
        {
            _id: 'mod1', title: 'Gond Art', artFormName: 'Gond Art', artFormType: 'tribal',
            description: 'Discover the intricate dot-based painting tradition of the Gond tribe from Madhya Pradesh.',
            isActive: true, isLocked: false, order: 1, materialListUrl: '#',
            fundamentalsVideoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', sessions: [
                { title: 'Session 1: Introduction to Gond Patterns', type: 'creation', sessionNumber: 1, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
                { title: 'Session 2: Animal Motifs in Gond', type: 'creation', sessionNumber: 2, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
                { title: 'Session 3: Tree of Life Composition', type: 'creation', sessionNumber: 3, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
                { title: 'Session 4: Advanced Gond Storytelling', type: 'creation', sessionNumber: 4, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
                { title: 'Session 5: Gond on Coasters', type: 'application', sessionNumber: 5, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
                { title: 'Session 6: Gond on Fridge Magnets', type: 'application', sessionNumber: 6, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
            ],
            liveRecordings: []
        },
        {
            _id: 'mod2', title: 'Warli Art', artFormName: 'Warli Art', artFormType: 'tribal',
            description: 'Explore the minimalist geometric art of the Warli tribe from Maharashtra.',
            isActive: true, isLocked: false, order: 2, materialListUrl: '#',
            fundamentalsVideoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', sessions: [
                { title: 'Session 1: Basic Warli Shapes', type: 'creation', sessionNumber: 1, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
                { title: 'Session 2: Human Figures in Warli', type: 'creation', sessionNumber: 2, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
                { title: 'Session 3: Warli Village Scenes', type: 'creation', sessionNumber: 3, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
                { title: 'Session 4: Tarpa Dance Composition', type: 'creation', sessionNumber: 4, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
                { title: 'Session 5: Warli on Wooden Trays', type: 'application', sessionNumber: 5, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
                { title: 'Session 6: Warli Wall Art', type: 'application', sessionNumber: 6, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
            ],
            liveRecordings: []
        },
        {
            _id: 'mod3', title: 'Madhubani Art', artFormName: 'Madhubani Art', artFormType: 'folk',
            description: 'Learn the vibrant double-line painting tradition from Mithila, Bihar.',
            isActive: true, isLocked: false, order: 3, materialListUrl: '#',
            fundamentalsVideoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', sessions: [
                { title: 'Session 1: Madhubani Border Patterns', type: 'creation', sessionNumber: 1, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
                { title: 'Session 2: Nature Motifs in Madhubani', type: 'creation', sessionNumber: 2, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
                { title: 'Session 3: God & Goddess Depictions', type: 'creation', sessionNumber: 3, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
                { title: 'Session 4: Wedding Scene (Kohbar)', type: 'creation', sessionNumber: 4, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
                { title: 'Session 5: Madhubani on Fabric', type: 'application', sessionNumber: 5, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
                { title: 'Session 6: Madhubani on Ceramic', type: 'application', sessionNumber: 6, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
            ],
            liveRecordings: []
        },
    ],
    outcomes: [
        'Master 7 tribal and folk art forms of India',
        'Create 4 original artworks in each art form',
        'Apply each art form on 2 usable surfaces',
        'Receive Excellence Certificate after 3 and 6 module submissions',
        'Earn a Completion Certificate upon finishing all 7 modules',
    ],
};

const categoryLabels = {
    drishti: 'Drishti — The Vision',
    chaitanya: 'Chaitanya — The Awakening',
    'kala-path': 'Kala-Path — Art Journey',
    sparsh: 'Sparsh — The Touch',
    pratibimb: 'Pratibimb — Reflection',
    'kala-vritti': 'Kala-Vritti — Art Living',
    samanvaya: 'Samanvaya — Integration',
    workshop: 'Workshop',
};

const ageGroupLabels = {
    adults: 'For Adults',
    kids: 'For Kids',
    all: 'All Ages',
};

export default function ProgramDetail() {
    const { slug } = useParams();
    const { user } = useAuth();
    const [program, setProgram] = useState(null);
    const [loading, setLoading] = useState(true);
    const [expandedModule, setExpandedModule] = useState(null);
    const [activeModules, setActiveModules] = useState([]);
    const [activeVideo, setActiveVideo] = useState(null);
    const [showVideoPlayer, setShowVideoPlayer] = useState(false);
    const [showSponsorModal, setShowSponsorModal] = useState(false);
    const [sponsorCode, setSponsorCode] = useState('');
    const [sponsorLoading, setSponsorLoading] = useState(false);
    const [sponsorError, setSponsorError] = useState('');
    const [sponsorSuccess, setSponsorSuccess] = useState('');
    const [enrollLoading, setEnrollLoading] = useState(false);

    const enrolledProgram = user?.enrolledPrograms?.find(
        ep => String(ep.program?._id || ep.program) === String(program?._id || program?.slug)
    );
    const enrolledModules = enrolledProgram?.enrolledModules || [];

    const handleModuleEnroll = async (moduleId) => {
        if (!user) {
            window.location.href = '/register';
            return;
        }
        try {
            setEnrollLoading(true);
            const res = await userAPI.enrollProgram({ programId: program._id, moduleId });
            if (res.data.success) {
                window.location.reload();
            }
        } catch (error) {
            console.error('Enrollment error:', error);
            alert(error.response?.data?.message || 'Failed to enroll in module');
        } finally {
            setEnrollLoading(false);
        }
    };

    const handleProgramEnroll = async (programId) => {
        if (!user) {
            window.location.href = '/register';
            return;
        }
        try {
            setEnrollLoading(true);
            const res = await userAPI.enrollProgram({ programId });
            if (res.data.success) {
                window.location.href = '/dashboard/learning';
            }
        } catch (error) {
            console.error('Enrollment error:', error);
            alert(error.response?.data?.message || 'Failed to enroll in program');
        } finally {
            setEnrollLoading(false);
        }
    };

    const handleSponsorEnroll = async () => {
        if (!sponsorCode.trim()) return;
        setSponsorLoading(true);
        setSponsorError('');
        setSponsorSuccess('');
        try {
            const res = await sponsorAPI.enrollWithSponsor(sponsorCode, program._id);
            if (res.data.success) {
                setSponsorSuccess('Enrolled successfully! Redirecting...');
                setTimeout(() => {
                    window.location.href = '/dashboard/learning';
                }, 1500);
            }
        } catch (error) {
            setSponsorError(error.response?.data?.message || 'Invalid sponsor code. Please try again.');
        } finally {
            setSponsorLoading(false);
        }
    };

    useEffect(() => {
        const fetchProgram = async () => {
            try {
                const res = await programAPI.getBySlug(slug);
                const apiProgram = res.data.data || res.data.program || res.data;

                const isChaitanyaOrSparsh =
                    apiProgram.programType === 'Chaitanya' || apiProgram.programType === 'Sparsh' ||
                    apiProgram.programType === 'KalaPath' || apiProgram.programType === 'KalaVritti' ||
                    apiProgram.category === 'chaitanya' || apiProgram.category === 'sparsh' ||
                    apiProgram.category === 'kala-path' || apiProgram.category === 'kala-vritti';

                const modules = (apiProgram.modules || fallbackProgram.modules).map(m => ({
                    ...m,
                    _id: m._id || `mod_${Math.random()}`,
                    sessions: m.sessions || [],
                    liveRecordings: m.liveRecordings || [],
                }));

                const active = modules.filter(m => m.isActive && !m.isLocked);

                setProgram({
                    _id: apiProgram._id || '',
                    title: apiProgram.title || fallbackProgram.title,
                    category: apiProgram.category || fallbackProgram.category,
                    categoryLabel: categoryLabels[apiProgram.category] || apiProgram.category,
                    programType: apiProgram.programType || '',
                    level: apiProgram.level || fallbackProgram.level,
                    duration: apiProgram.duration || (apiProgram.programDurationWeeks ? `${apiProgram.programDurationWeeks} weeks` : fallbackProgram.duration),
                    ageGroup: apiProgram.ageGroup || fallbackProgram.ageGroup || '',
                    maxActiveModules: apiProgram.maxActiveModules || fallbackProgram.maxActiveModules || 7,
                    programDurationWeeks: apiProgram.programDurationWeeks || fallbackProgram.programDurationWeeks,
                    price: apiProgram.price ? `₹${apiProgram.price}` : (apiProgram.isFree ? 'Free' : fallbackProgram.price),
                    instructor: apiProgram.instructor?.name || apiProgram.instructor || fallbackProgram.instructor,
                    desc: apiProgram.description || apiProgram.desc || fallbackProgram.desc,
                    longDescription: apiProgram.longDescription || '',
                    modules,
                    outcomes: apiProgram.outcomes || apiProgram.learningOutcomes || apiProgram.highlights || fallbackProgram.outcomes,
                    slug: apiProgram.slug || slug,
                    isChaitanyaOrSparsh,
                    image: apiProgram.image || '',
                });
                setActiveModules(active);
            } catch (err) {
                const fallback = { ...fallbackProgram, isChaitanyaOrSparsh: true, slug };
                setProgram(fallback);
                setActiveModules(fallback.modules.filter(m => m.isActive && !m.isLocked));
            } finally {
                setLoading(false);
            }
        };
        fetchProgram();
    }, [slug]);

    if (loading) {
        return <ProgramDetailSkeleton />;
    }

    if (!program) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
                <div className="text-center space-y-4">
                    <h2 className="text-2xl font-serif font-light text-[#3C2F2B]">Program Not Found</h2>
                    <p className="font-serif font-light text-[#8F6B5A]">The program you're looking for doesn't exist.</p>
                    <Link to="/programs">
                        <Button className="bg-[#C9A96E] hover:bg-[#B87333] text-[#3C2F2B] hover:text-white text-sm px-6 py-2">
                            Back to Programs
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    const openVideo = (url, title, moduleId) => {
        setActiveVideo({ url, title, moduleId });
        setShowVideoPlayer(true);
    };

    const closeVideoPlayer = () => {
        setShowVideoPlayer(false);
        setActiveVideo(null);
    };

    return (
        <div className="min-h-screen bg-[#FDFBF7] font-serif">

            {/* ============ HERO ============ */}
            <section className="relative py-16 md:py-20 lg:py-24 bg-[#3C2F2B] overflow-hidden">
                <div className="absolute inset-0 opacity-[0.04]">
                    <div className="absolute top-20 left-20 w-48 h-48 border border-[#C9A96E] rounded-full animate-spin-slow" />
                    <div className="absolute bottom-20 right-20 w-64 h-64 border border-[#C9A96E]/50 rounded-full animate-spin-slower" />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                        className="space-y-4 md:space-y-6"
                    >
                        <Link to="/programs" className="inline-flex items-center gap-1.5 text-sm font-serif font-light text-[#D4A574] hover:text-[#C9A96E] transition-colors duration-300">
                            <ArrowLeft className="w-4 h-4" /> Back to Programs
                        </Link>

                        <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-0.5 bg-[#C9A96E]/20 border border-[#C9A96E]/30 text-[#C9A96E] font-serif text-xs tracking-[0.15em] uppercase">
                                {program.categoryLabel}
                            </span>
                            {program.ageGroup && (
                                <span className="px-3 py-0.5 border border-[#C9A96E]/30 text-[#D4A574] font-serif text-xs tracking-[0.15em] uppercase">
                                    <Users className="w-3 h-3 inline mr-1" /> {ageGroupLabels[program.ageGroup] || program.ageGroup}
                                </span>
                            )}
                        </div>

                        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-light text-[#FDFBF7] leading-tight">
                            {program.title}
                        </h1>

                        <p className="text-base md:text-lg font-serif font-light italic text-[#D4A574] max-w-3xl leading-relaxed">
                            {program.desc}
                        </p>

                        <div className="flex flex-wrap gap-4 text-sm font-serif font-light text-[#D4A574]">
                            <span className="flex items-center gap-1.5">
                                <Calendar className="w-4 h-4 text-[#C9A96E]" /> {program.duration}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Star className="w-4 h-4 text-[#C9A96E]" /> {program.level}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Users className="w-4 h-4 text-[#C9A96E]" /> {program.instructor}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Award className="w-4 h-4 text-[#C9A96E]" /> Certificate Included
                            </span>
                            {program.isChaitanyaOrSparsh && (
                                <span className="flex items-center gap-1.5">
                                    <Layers className="w-4 h-4 text-[#C9A96E]" /> {activeModules.length} Active Art Forms
                                </span>
                            )}
                        </div>

                        <div className="flex flex-wrap gap-3 pt-2">
                            {program.isChaitanyaOrSparsh ? (
                                <Button
                                    className="bg-[#C9A96E] hover:bg-[#B87333] text-[#3C2F2B] hover:text-white text-sm md:text-base px-6 md:px-8 py-2 md:py-2.5 transition-all duration-300"
                                    onClick={() => document.getElementById('modules-section').scrollIntoView({ behavior: 'smooth' })}
                                >
                                    View Modules <ArrowRight className="ml-2 w-4 h-4" />
                                </Button>
                            ) : (
                                user ? (
                                    <Button
                                        className="bg-[#C9A96E] hover:bg-[#B87333] text-[#3C2F2B] hover:text-white text-sm md:text-base px-6 md:px-8 py-2 md:py-2.5 transition-all duration-300"
                                        onClick={() => handleProgramEnroll(program._id)}
                                        disabled={enrollLoading}
                                    >
                                        {enrollLoading ? <Loader2 className="animate-spin mr-2 w-4 h-4" /> : `Enroll Now — ${program.price}`} <ArrowRight className="ml-2 w-4 h-4" />
                                    </Button>
                                ) : (
                                    <Link to="/register">
                                        <Button className="bg-[#C9A96E] hover:bg-[#B87333] text-[#3C2F2B] hover:text-white text-sm md:text-base px-6 md:px-8 py-2 md:py-2.5 transition-all duration-300">
                                            Enroll Now — {program.price} <ArrowRight className="ml-2 w-4 h-4" />
                                        </Button>
                                    </Link>
                                )
                            )}
                            {user && (
                                <Button
                                    variant="outline"
                                    className="border-[#C9A96E]/40 text-[#D4A574] hover:bg-[#C9A96E]/10 text-sm md:text-base px-6 md:px-8 py-2 md:py-2.5 transition-all duration-300"
                                    onClick={() => setShowSponsorModal(true)}
                                >
                                    Have a Sponsor Code?
                                </Button>
                            )}
                            {program.isChaitanyaOrSparsh && user && (
                                <Link to="/dashboard/learning">
                                    <Button
                                        variant="outline"
                                        className="border-[#C9A96E]/40 text-[#D4A574] hover:bg-[#C9A96E]/10 text-sm md:text-base px-6 md:px-8 py-2 md:py-2.5 transition-all duration-300"
                                    >
                                        <Play className="mr-2 w-4 h-4" /> Go to Learning
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </motion.div>
                </div>

                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 80" className="w-full h-auto" preserveAspectRatio="none">
                        <path fill="#FDFBF7" d="M0,40 C480,80 960,0 1440,40 L1440,80 L0,80 Z" />
                    </svg>
                </div>
            </section>

            {/* ============ CHAITANYA/SPARSH MODULES ============ */}
            {program.isChaitanyaOrSparsh && (
                <section id="modules-section" className="py-12 md:py-16 lg:py-20 bg-[#FDFBF7]">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="mb-8">
                            <h2 className="text-xl md:text-2xl font-serif font-light text-[#3C2F2B]">
                                {activeModules.length} Tribal & Folk Art Forms
                            </h2>
                            <p className="text-xs md:text-sm font-serif font-light text-[#6B5B4B] mt-1">
                                Each module explores a different Indian art form. Every module includes <span className="text-[#B87333] font-medium">4 creation sessions</span> and <span className="text-[#B87333] font-medium">2 application sessions</span>.
                            </p>
                        </div>

                        <div className="space-y-4">
                            {(program.modules || []).filter(m => m.isActive).map((mod, i) => {
                                const isExpanded = expandedModule === mod._id;
                                const creationSessions = (mod.sessions || []).filter(s => s.type === 'creation');
                                const applicationSessions = (mod.sessions || []).filter(s => s.type === 'application');
                                const liveRecordings = mod.liveRecordings || [];

                                return (
                                    <motion.div
                                        key={mod._id || i}
                                        initial={{ opacity: 0, y: 10 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.06 }}
                                    >
                                        <div className={`border ${mod.isLocked ? 'border-[#B87333]/20 opacity-60' : 'border-[#B87333]/10 hover:shadow-md'} transition-all duration-300 bg-white`}>
                                            <div
                                                className="p-4 flex items-center justify-between cursor-pointer"
                                                onClick={() => setExpandedModule(isExpanded ? null : mod._id)}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 flex items-center justify-center bg-[#C9A96E] text-[#3C2F2B] font-serif text-sm font-normal">
                                                        {mod.order || i + 1}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <h3 className="font-serif font-medium text-[#3C2F2B] text-sm md:text-base">
                                                                {mod.artFormName || mod.title}
                                                            </h3>
                                                            {mod.artFormType && (
                                                                <span className="px-1.5 py-0.5 border border-[#B87333]/20 text-[#8F6B5A] text-[9px] font-serif font-light uppercase tracking-wider">
                                                                    {mod.artFormType}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-[10px] md:text-xs font-serif font-light text-[#8F6B5A]">
                                                            {creationSessions.length} creation + {applicationSessions.length} application sessions
                                                            {liveRecordings.length > 0 && ` · ${liveRecordings.length} live recordings`}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {mod.isLocked ? (
                                                        <>
                                                            <span className="text-[10px] font-serif font-light text-[#8F6B5A]">Locked</span>
                                                            <Lock className="w-4 h-4 text-[#8F6B5A]" />
                                                        </>
                                                    ) : (
                                                        <>
                                                            {isExpanded ? (
                                                                <ChevronUp className="w-5 h-5 text-[#B87333]" />
                                                            ) : (
                                                                <ChevronDown className="w-5 h-5 text-[#B87333]" />
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                            </div>

                                            {isExpanded && !mod.isLocked && (
                                                <div className="px-4 pb-4 border-t border-[#B87333]/10 pt-4 space-y-4">
                                                    {/* Module Enrollment */}
                                                    {program.programType === 'KalaPath' && (
                                                        <div className="p-4 border border-[#B87333]/10 bg-[#F5E6D3]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                                                            <div>
                                                                <h4 className="text-xs font-serif font-medium text-[#3C2F2B]">Module Access</h4>
                                                                <p className="text-[10px] font-serif font-light text-[#6B5B4B]">
                                                                    {enrolledModules.includes(mod._id)
                                                                        ? "You have full access to this module."
                                                                        : "Enroll in this module to unlock its sessions."}
                                                                </p>
                                                            </div>
                                                            {enrolledModules.includes(mod._id) ? (
                                                                <span className="px-2 py-0.5 bg-[#C9A96E] text-[#3C2F2B] text-[10px] font-serif font-medium flex items-center gap-1">
                                                                    <CheckCircle className="w-3 h-3" /> Enrolled
                                                                </span>
                                                            ) : (
                                                                <Button
                                                                    className="bg-[#C9A96E] hover:bg-[#B87333] text-[#3C2F2B] hover:text-white text-[10px] px-3 py-1 h-auto"
                                                                    onClick={() => handleModuleEnroll(mod._id)}
                                                                    disabled={enrollLoading}
                                                                >
                                                                    {enrollLoading ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Lock className="w-3 h-3 mr-1" />}
                                                                    Enroll in Module
                                                                </Button>
                                                            )}
                                                        </div>
                                                    )}

                                                    {mod.description && (
                                                        <p className="text-xs md:text-sm font-serif font-light text-[#6B5B4B]">{mod.description}</p>
                                                    )}

                                                    {/* Fundamentals Video */}
                                                    {mod.fundamentalsVideoUrl && (
                                                        <div>
                                                            <h4 className="text-xs font-serif font-medium text-[#3C2F2B] mb-2 flex items-center gap-1.5">
                                                                <Video className="w-4 h-4 text-[#B87333]" /> Fundamentals Video
                                                            </h4>
                                                            <div
                                                                className="border border-[#B87333]/10 p-3 flex items-center gap-2 cursor-pointer hover:bg-[#F5E6D3]/30 transition-colors duration-300"
                                                                onClick={() => openVideo(mod.fundamentalsVideoUrl, `Fundamentals: ${mod.artFormName || mod.title}`, mod._id)}
                                                            >
                                                                <Play className="w-4 h-4 text-[#B87333]" />
                                                                <span className="text-xs font-serif font-light text-[#6B5B4B]">Pre-recorded fundamentals — Click to Watch</span>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Material List */}
                                                    {mod.materialListUrl && enrolledModules.includes(mod._id) && (
                                                        <div>
                                                            <a href={mod.materialListUrl} target="_blank" rel="noopener noreferrer"
                                                                className="inline-flex items-center gap-1.5 text-xs font-serif font-light text-[#B87333] hover:text-[#8F6B5A] transition-colors duration-300"
                                                            >
                                                                <Download className="w-3 h-3" /> Download Material List
                                                            </a>
                                                        </div>
                                                    )}

                                                    {/* Creation Sessions */}
                                                    {creationSessions.length > 0 && (
                                                        <div>
                                                            <h4 className="text-xs font-serif font-medium text-[#3C2F2B] mb-2 flex items-center gap-1.5">
                                                                <Palette className="w-4 h-4 text-[#B87333]" /> Creation Sessions ({creationSessions.length})
                                                            </h4>
                                                            <div className="space-y-1.5">
                                                                {creationSessions.map((session, si) => (
                                                                    <div
                                                                        key={si}
                                                                        className={`flex items-center gap-2 p-2 border border-[#B87333]/5 ${session.videoUrl && enrolledModules.includes(mod._id) ? 'cursor-pointer hover:bg-[#F5E6D3]/20 transition-colors duration-300' : 'opacity-70'}`}
                                                                        onClick={() => session.videoUrl && enrolledModules.includes(mod._id) && openVideo(session.videoUrl, session.title, mod._id)}
                                                                    >
                                                                        <span className="text-[10px] font-serif font-medium text-[#B87333] w-6">{session.sessionNumber || si + 1}.</span>
                                                                        <span className="text-xs font-serif font-light text-[#6B5B4B] flex-1">{session.title}</span>
                                                                        {session.videoUrl && enrolledModules.includes(mod._id) ?
                                                                            <Play className="w-3 h-3 text-[#B87333]" /> :
                                                                            <Lock className="w-3 h-3 text-[#B87333]/30" />
                                                                        }
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Application Sessions */}
                                                    {applicationSessions.length > 0 && (
                                                        <div>
                                                            <h4 className="text-xs font-serif font-medium text-[#3C2F2B] mb-2 flex items-center gap-1.5">
                                                                <Activity className="w-4 h-4 text-[#B87333]" /> Application Sessions ({applicationSessions.length})
                                                            </h4>
                                                            <div className="space-y-1.5">
                                                                {applicationSessions.map((session, si) => (
                                                                    <div
                                                                        key={si}
                                                                        className={`flex items-center gap-2 p-2 border border-[#B87333]/5 ${session.videoUrl && enrolledModules.includes(mod._id) ? 'cursor-pointer hover:bg-[#F5E6D3]/20 transition-colors duration-300' : 'opacity-70'}`}
                                                                        onClick={() => session.videoUrl && enrolledModules.includes(mod._id) && openVideo(session.videoUrl, session.title, mod._id)}
                                                                    >
                                                                        <span className="text-[10px] font-serif font-medium text-[#B87333] w-6">{session.sessionNumber || creationSessions.length + si + 1}.</span>
                                                                        <span className="text-xs font-serif font-light text-[#6B5B4B] flex-1">{session.title}</span>
                                                                        {session.videoUrl && enrolledModules.includes(mod._id) ?
                                                                            <Play className="w-3 h-3 text-[#B87333]" /> :
                                                                            <Lock className="w-3 h-3 text-[#B87333]/30" />
                                                                        }
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Live Recordings */}
                                                    {liveRecordings.length > 0 && (
                                                        <div>
                                                            <h4 className="text-xs font-serif font-medium text-[#3C2F2B] mb-2 flex items-center gap-1.5">
                                                                <Camera className="w-4 h-4 text-[#B87333]" /> Weekly Live Class Recordings
                                                            </h4>
                                                            <div className="space-y-1.5">
                                                                {liveRecordings.map((rec, ri) => (
                                                                    <div
                                                                        key={ri}
                                                                        className={`flex items-center gap-2 p-2 border border-[#B87333]/5 ${rec.videoUrl ? 'cursor-pointer hover:bg-[#F5E6D3]/20 transition-colors duration-300' : 'opacity-70'}`}
                                                                        onClick={() => rec.videoUrl && openVideo(rec.videoUrl, rec.title, mod._id)}
                                                                    >
                                                                        <Play className="w-3 h-3 text-[#B87333]" />
                                                                        <span className="text-xs font-serif font-light text-[#6B5B4B] flex-1">{rec.title}</span>
                                                                        {rec.recordedAt && (
                                                                            <span className="text-[10px] font-serif font-light text-[#8F6B5A]">
                                                                                {new Date(rec.recordedAt).toLocaleDateString('en-IN')}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Submission Reminder */}
                                                    <div className="p-3 border border-[#B87333]/10 bg-[#F5E6D3]/20">
                                                        <p className="text-[10px] font-serif font-light text-[#6B5B4B] flex items-center gap-1.5">
                                                            <FileText className="w-3 h-3 text-[#B87333]" />
                                                            After completing this module, submit <span className="font-medium">1 artwork</span> and <span className="font-medium">1 activity work</span> for certification.
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </section>
            )}

            {/* ============ STANDARD MODULES ============ */}
            {!program.isChaitanyaOrSparsh && (program.modules || []).length > 0 && (
                <section className="py-12 md:py-16 bg-[#FDFBF7]">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-xl md:text-2xl font-serif font-light text-[#3C2F2B] mb-6">Program Modules</h2>
                        <div className="space-y-3">
                            {(program.modules || []).map((mod, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.06 }}
                                >
                                    <div className="border border-[#B87333]/10 p-4 flex items-center justify-between bg-white hover:shadow-md transition-all duration-300">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 flex items-center justify-center bg-[#C9A96E] text-[#3C2F2B] font-serif text-sm font-normal">
                                                {i + 1}
                                            </div>
                                            <div>
                                                <h3 className="font-serif font-medium text-[#3C2F2B] text-sm md:text-base">{mod.title}</h3>
                                                <p className="text-[10px] md:text-xs font-serif font-light text-[#8F6B5A]">
                                                    {(mod.sessions || mod.lessons || []).length} sessions/lessons {mod.duration ? `· ${mod.duration}` : ''}
                                                </p>
                                            </div>
                                        </div>
                                        <CheckCircle className="w-5 h-5 text-[#B87333]/30" />
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ============ LEARNING OUTCOMES ============ */}
            <section className="py-12 md:py-16 bg-[#F5E6D3]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-8 md:gap-12">
                        <div>
                            <h2 className="text-xl md:text-2xl font-serif font-light text-[#3C2F2B] mb-4 md:mb-6">
                                What You'll <span className="text-[#B87333] font-normal">Achieve</span>
                            </h2>
                            <ul className="space-y-2 md:space-y-3">
                                {(program.outcomes || []).map((outcome, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm md:text-base font-serif font-light text-[#6B5B4B]">
                                        <CheckCircle className="w-4 h-4 text-[#B87333] mt-0.5 flex-shrink-0" />
                                        <span>{outcome}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="space-y-4 md:space-y-6">
                            <div className="border border-[#B87333]/10 p-5 md:p-6 bg-white">
                                <h3 className="font-serif font-medium text-[#3C2F2B] text-base md:text-lg mb-2">Program Details</h3>
                                <div className="w-12 h-px bg-[#B87333] mb-4" />
                                <ul className="space-y-2 text-xs md:text-sm font-serif font-light text-[#6B5B4B]">
                                    <li><span className="font-medium text-[#3C2F2B]">Duration:</span> {program.duration}</li>
                                    <li><span className="font-medium text-[#3C2F2B]">Level:</span> {program.level}</li>
                                    <li><span className="font-medium text-[#3C2F2B]">Instructor:</span> {program.instructor}</li>
                                    <li><span className="font-medium text-[#3C2F2B]">Price:</span> <span className="text-[#B87333] font-medium">{program.price}</span></li>
                                    {program.isChaitanyaOrSparsh && program.programType !== 'KalaVritti' && (
                                        <>
                                            <li><span className="font-medium text-[#3C2F2B]">Active Art Forms:</span> {activeModules.length} of {program.maxActiveModules || 7}</li>
                                            <li><span className="font-medium text-[#3C2F2B]">Structure:</span> 4 creation + 2 application sessions</li>
                                        </>
                                    )}
                                    <li><span className="font-medium text-[#3C2F2B]">Certificate:</span> Included on completion</li>
                                </ul>
                            </div>

                            <div className="flex flex-col gap-3">
                                <Link to="/register">
                                    <Button className="w-full bg-[#C9A96E] hover:bg-[#B87333] text-[#3C2F2B] hover:text-white text-sm md:text-base px-6 py-2.5 transition-all duration-300">
                                        Enroll Now <ArrowRight className="ml-2 w-4 h-4" />
                                    </Button>
                                </Link>
                                {user && (
                                    <Button
                                        variant="outline"
                                        className="w-full border-[#C9A96E]/40 text-[#3C2F2B] hover:bg-[#C9A96E]/10 text-sm md:text-base px-6 py-2.5 transition-all duration-300"
                                        onClick={() => setShowSponsorModal(true)}
                                    >
                                        Have a Sponsor Code?
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ============ VIDEO PLAYER OVERLAY ============ */}
            {showVideoPlayer && activeVideo && (
                <div className="fixed inset-0 z-50 bg-[#3C2F2B]/95 flex items-center justify-center p-4">
                    <div className="relative w-full max-w-4xl bg-[#1C1C18] overflow-hidden">
                        <div className="flex items-center justify-between p-3 bg-[#1C1C18]">
                            <h3 className="text-white font-serif font-light text-sm truncate pr-4">{activeVideo.title}</h3>
                            <button
                                onClick={closeVideoPlayer}
                                className="text-white/70 hover:text-white transition-colors p-1"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="aspect-video">
                            <SecureVideoPlayer
                                videoUrl={activeVideo.url}
                                videoId={`program-${activeVideo.moduleId || 'detail'}`}
                                title={activeVideo.title}
                                onEnded={closeVideoPlayer}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* ============ SPONSOR MODAL ============ */}
            {showSponsorModal && (
                <div className="fixed inset-0 z-50 bg-[#3C2F2B]/95 flex items-center justify-center p-4">
                    <div className="relative w-full max-w-md bg-[#FDFBF7] p-6 border border-[#C9A96E]/20">
                        <button
                            onClick={() => setShowSponsorModal(false)}
                            className="absolute top-4 right-4 text-[#8F6B5A] hover:text-[#3C2F2B] transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <h3 className="text-xl font-serif font-light text-[#3C2F2B] mb-2">Enroll with Sponsor Code</h3>
                        <p className="text-sm font-serif font-light text-[#6B5B4B] mb-4">Enter your organization's sponsor code to enroll for free.</p>

                        {sponsorSuccess && (
                            <div className="mb-4 p-3 border border-[#C9A96E] bg-[#C9A96E]/10 text-[#3C2F2B] text-sm">
                                {sponsorSuccess}
                            </div>
                        )}
                        {sponsorError && (
                            <div className="mb-4 p-3 border border-[#B87333] bg-[#B87333]/10 text-[#B87333] text-sm">
                                {sponsorError}
                            </div>
                        )}

                        <div className="space-y-4">
                            <Input
                                value={sponsorCode}
                                onChange={(e) => setSponsorCode(e.target.value.toUpperCase())}
                                placeholder="e.g. TATA2026"
                                className="border-[#B87333]/20 font-serif text-sm"
                            />
                            <Button
                                className="w-full bg-[#C9A96E] hover:bg-[#B87333] text-[#3C2F2B] hover:text-white text-sm py-2.5 transition-all duration-300"
                                onClick={handleSponsorEnroll}
                                disabled={sponsorLoading || !sponsorCode.trim()}
                            >
                                {sponsorLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : 'Validate & Enroll'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* ============ STYLES ============ */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&display=swap');
                * { font-family: 'Playfair Display', 'Georgia', serif !important; }

                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes spin-slower {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(-360deg); }
                }
                .animate-spin-slow { animation: spin-slow 25s linear infinite; }
                .animate-spin-slower { animation: spin-slower 35s linear infinite; }
            `}</style>
        </div>
    );
}