import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
    ArrowLeft, ArrowRight, Calendar, Clock, Star, BookOpen, Palette,
    Users, CheckCircle, Award, Play, Loader2, Lock, Download, Video,
    Layers, Sparkles, Brush, Activity, FileText, Camera, X, ChevronDown, ChevronUp
} from 'lucide-react';
import { programAPI, sponsorAPI, userAPI } from '@/api';
import { useAuth } from '@/context/AuthContext';
import SecureVideoPlayer from '@/components/ui/SecureVideoPlayer';

// Fallback data for Chaitanya/Sparsh programs when backend is unavailable
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
    desc: 'A year-long journey through 7 tribal and folk art forms of India. Each module explores a different art form with 4 creative sessions and 2 application sessions.',
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
                { title: 'Session 5: Gond on Coasters (Application)', type: 'application', sessionNumber: 5, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
                { title: 'Session 6: Gond on Fridge Magnets (Application)', type: 'application', sessionNumber: 6, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
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
                { title: 'Session 5: Warli on Wooden Trays (Application)', type: 'application', sessionNumber: 5, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
                { title: 'Session 6: Warli Wall Art (Application)', type: 'application', sessionNumber: 6, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
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
                { title: 'Session 5: Madhubani on Fabric (Application)', type: 'application', sessionNumber: 5, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
                { title: 'Session 6: Madhubani on Ceramic (Application)', type: 'application', sessionNumber: 6, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
            ],
            liveRecordings: []
        },
        {
            _id: 'mod4', title: 'Pattachitra Art', artFormName: 'Pattachitra Art', artFormType: 'folk',
            description: 'Master the intricate scroll painting tradition from Odisha.',
            isActive: true, isLocked: false, order: 4, materialListUrl: '#',
            fundamentalsVideoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', sessions: [
                { title: 'Session 1: Introduction to Pattachitra', type: 'creation', sessionNumber: 1, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
                { title: 'Session 2: Intricate Borders', type: 'creation', sessionNumber: 2, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
                { title: 'Session 3: Deity Portraits', type: 'creation', sessionNumber: 3, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
                { title: 'Session 4: Full Scroll Composition', type: 'creation', sessionNumber: 4, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
                { title: 'Session 5: Pattachitra on Bookmarks', type: 'application', sessionNumber: 5, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
                { title: 'Session 6: Pattachitra on Canvas', type: 'application', sessionNumber: 6, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
            ],
            liveRecordings: []
        },
        {
            _id: 'mod5', title: 'Sohrai Art', artFormName: 'Sohrai Art', artFormType: 'tribal',
            description: 'Discover the harvest festival wall painting tradition from Jharkhand.',
            isActive: true, isLocked: false, order: 5, materialListUrl: '#',
            fundamentalsVideoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', sessions: [
                { title: 'Session 1: Earth Colors and Mud Base', type: 'creation', sessionNumber: 1, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
                { title: 'Session 2: Natural Motifs and Patterns', type: 'creation', sessionNumber: 2, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
                { title: 'Session 3: Animal Depictions in Sohrai', type: 'creation', sessionNumber: 3, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
                { title: 'Session 4: Harvest Celebration Scenes', type: 'creation', sessionNumber: 4, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
                { title: 'Session 5: Sohrai on Earthen Pots', type: 'application', sessionNumber: 5, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
                { title: 'Session 6: Sohrai on Wall Panels', type: 'application', sessionNumber: 6, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
            ],
            liveRecordings: []
        },
        {
            _id: 'mod6', title: 'Kalamkari Art', artFormName: 'Kalamkari Art', artFormType: 'folk',
            description: 'Learn the pen-drawn textile art tradition from Andhra Pradesh.',
            isActive: true, isLocked: false, order: 6, materialListUrl: '#',
            fundamentalsVideoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', sessions: [
                { title: 'Session 1: The Kalamkari Pen Techniques', type: 'creation', sessionNumber: 1, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
                { title: 'Session 2: Floral and Vine Patterns', type: 'creation', sessionNumber: 2, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
                { title: 'Session 3: Mythological Figures', type: 'creation', sessionNumber: 3, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
                { title: 'Session 4: Detailed Scene Composition', type: 'creation', sessionNumber: 4, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
                { title: 'Session 5: Kalamkari on Tote Bags', type: 'application', sessionNumber: 5, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
                { title: 'Session 6: Kalamkari on Cushion Covers', type: 'application', sessionNumber: 6, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
            ],
            liveRecordings: []
        },
        {
            _id: 'mod7', title: 'Phad Painting', artFormName: 'Phad Painting', artFormType: 'folk',
            description: 'Explore the scroll painting tradition from Rajasthan depicting folk deities.',
            isActive: true, isLocked: false, order: 7, materialListUrl: '#',
            fundamentalsVideoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', sessions: [
                { title: 'Session 1: Understanding Phad Layouts', type: 'creation', sessionNumber: 1, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
                { title: 'Session 2: Character Construction', type: 'creation', sessionNumber: 2, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
                { title: 'Session 3: Adding Colors and Details', type: 'creation', sessionNumber: 3, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
                { title: 'Session 4: Completing a Scene', type: 'creation', sessionNumber: 4, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
                { title: 'Session 5: Phad on Paper Banners', type: 'application', sessionNumber: 5, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
                { title: 'Session 6: Phad on Wooden Plaques', type: 'application', sessionNumber: 6, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
            ],
            liveRecordings: []
        },
        {
            _id: 'mod8', title: 'Pichwai Art', artFormName: 'Pichwai Art', artFormType: 'folk',
            description: 'Learn the intricate backdrop paintings originating from Nathdwara, Rajasthan.',
            isActive: false, isLocked: true, order: 8, materialListUrl: '#',
            fundamentalsVideoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', sessions: [
                { title: 'Session 1: Lotus and Cow Motifs', type: 'creation', sessionNumber: 1, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
                { title: 'Session 2: Background Construction', type: 'creation', sessionNumber: 2, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
                { title: 'Session 3: Shrinathji Depiction', type: 'creation', sessionNumber: 3, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
                { title: 'Session 4: Golden Detailing', type: 'creation', sessionNumber: 4, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
                { title: 'Session 5: Pichwai on Canvas', type: 'application', sessionNumber: 5, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
                { title: 'Session 6: Pichwai Wall Hangings', type: 'application', sessionNumber: 6, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
            ],
            liveRecordings: []
        },
        {
            _id: 'mod9', title: 'Cheriyal Scroll Painting', artFormName: 'Cheriyal Scroll', artFormType: 'folk',
            description: 'Discover the storytelling scroll art from Telangana.',
            isActive: false, isLocked: true, order: 9, materialListUrl: '#',
            fundamentalsVideoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', sessions: [
                { title: 'Session 1: Introduction to Cheriyal Formats', type: 'creation', sessionNumber: 1, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
                { title: 'Session 2: Figures and Costumes', type: 'creation', sessionNumber: 2, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
                { title: 'Session 3: Village Narratives', type: 'creation', sessionNumber: 3, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
                { title: 'Session 4: Elaborate Borders', type: 'creation', sessionNumber: 4, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
                { title: 'Session 5: Cheriyal on Plates', type: 'application', sessionNumber: 5, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
                { title: 'Session 6: Cheriyal Mini Scrolls', type: 'application', sessionNumber: 6, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
            ],
            liveRecordings: []
        },
        {
            _id: 'mod10', title: 'Kalighat Painting', artFormName: 'Kalighat Painting', artFormType: 'folk',
            description: 'Explore the bold, sweeping brushstroke art from Bengal.',
            isActive: false, isLocked: true, order: 10, materialListUrl: '#',
            fundamentalsVideoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', sessions: [
                { title: 'Session 1: Bold Outlines and Sweeping Curves', type: 'creation', sessionNumber: 1, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
                { title: 'Session 2: Shading and Volume', type: 'creation', sessionNumber: 2, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
                { title: 'Session 3: Mythological Subjects', type: 'creation', sessionNumber: 3, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
                { title: 'Session 4: Everyday Life Scenes', type: 'creation', sessionNumber: 4, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
                { title: 'Session 5: Kalighat on Postcards', type: 'application', sessionNumber: 5, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
                { title: 'Session 6: Kalighat on Framed Canvas', type: 'application', sessionNumber: 6, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
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
        'Access live class recordings and downloadable material lists',
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
    const [activeVideo, setActiveVideo] = useState(null); // { url, title, moduleId }
    const [showVideoPlayer, setShowVideoPlayer] = useState(false);
    const [showSponsorModal, setShowSponsorModal] = useState(false);
    const [sponsorCode, setSponsorCode] = useState('');
    const [sponsorLoading, setSponsorLoading] = useState(false);
    const [sponsorError, setSponsorError] = useState('');
    const [sponsorSuccess, setSponsorSuccess] = useState('');

    const [enrollLoading, setEnrollLoading] = useState(false);
    const navigate = useNavigate();

    // Compute enrolled modules for this program
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
                // Refresh page to update user context
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
                // Redirect to dashboard learning
                window.location.href = '/dashboard/learning';
            }
        } catch (error) {
            console.error('Enrollment error:', error);
            alert(error.response?.data?.message || 'Failed to enroll in program');
        } finally {
            setEnrollLoading(false);
        }
    };

    useEffect(() => {
        const fetchProgram = async () => {
            try {
                const res = await programAPI.getBySlug(slug);
                const apiProgram = res.data.data || res.data.program || res.data;

                const isChaitanyaOrSparsh =
                    apiProgram.programType === 'Chaitanya' || apiProgram.programType === 'Sparsh' || apiProgram.programType === 'KalaPath' || apiProgram.programType === 'KalaVritti' ||
                    apiProgram.category === 'chaitanya' || apiProgram.category === 'sparsh' || apiProgram.category === 'kala-path' || apiProgram.category === 'kala-vritti';

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
        return (
            <div className="min-h-screen flex items-center justify-center bg-heritage-creamLight">
                <Loader2 className="w-8 h-8 animate-spin text-heritage-terracottaDark" />
            </div>
        );
    }

    if (!program) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-heritage-creamLight">
                <div className="text-center space-y-4">
                    <h2 className="text-2xl font-heading font-bold text-heritage-terracottaDark">Program Not Found</h2>
                    <p className="font-body text-text-main">The program you're looking for doesn't exist.</p>
                    <Link to="/programs"><Button variant="gold">Back to Programs</Button></Link>
                </div>
            </div>
        );
    }

    const openVideo = (url, title, moduleId, type, sessionNumber, sessionIndex) => {
        // Construct the expected video ID that LearningPlayer generates
        let videoId = '';
        if (type === 'fundamentals' || title.startsWith('Fundamentals:')) {
            videoId = `${moduleId}-fund`;
        } else if (type === 'live-recording') {
            videoId = `${moduleId}-live-${sessionIndex}`;
        } else {
            videoId = `${moduleId}-session-${sessionNumber || sessionIndex}`;
        }
        navigate(`/programs/${slug}/learn?module=${moduleId}&video=${videoId}`);
    };

    const getSessionTypeBadge = (type) => {
        switch (type) {
            case 'creation':
                return <Badge className="bg-purple-100 text-purple-700 text-xs"><Palette className="w-3 h-3 mr-1" /> Creation</Badge>;
            case 'application':
                return <Badge className="bg-teal-100 text-teal-700 text-xs"><Activity className="w-3 h-3 mr-1" /> Application</Badge>;
            case 'live-recording':
                return <Badge className="bg-red-100 text-red-700 text-xs"><Camera className="w-3 h-3 mr-1" /> Live Recording</Badge>;
            default:
                return <Badge variant="outline" className="text-xs">{type}</Badge>;
        }
    };

    return (
        <div className="overflow-hidden">
            {/* Hero */}
            <section className="relative py-20 md:py-28 bg-heritage-terracotta">
                <div className="absolute inset-0 opacity-5 mandala-bg" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="space-y-6">
                        <Link to="/programs" className="inline-flex items-center gap-1 text-sm font-body text-text-main hover:text-heritage-gold transition-colors">
                            <ArrowLeft className="w-4 h-4" /> Back to Programs
                        </Link>
                        <div className="flex flex-wrap gap-2">
                            <Badge variant="gold" className="text-sm px-4 py-1">{program.categoryLabel}</Badge>
                            {program.ageGroup && (
                                <Badge variant="outlineGold" className="text-sm px-4 py-1">
                                    <Users className="w-3 h-3 mr-1" /> {ageGroupLabels[program.ageGroup] || program.ageGroup}
                                </Badge>
                            )}
                        </div>
                        <h1 className="text-3xl md:text-5xl font-heading font-bold text-text-main">{program.title}</h1>
                        <p className="text-lg font-accent text-text-main italic">{program.desc}</p>
                        <div className="flex flex-wrap gap-4 text-sm font-body text-text-main">
                            <span className="flex items-center gap-1"><Calendar className="w-4 h-4 text-heritage-gold" /> {program.duration}</span>
                            <span className="flex items-center gap-1"><Star className="w-4 h-4 text-heritage-gold" /> {program.level}</span>
                            <span className="flex items-center gap-1"><Users className="w-4 h-4 text-heritage-gold" /> {program.instructor}</span>
                            <span className="flex items-center gap-1"><Award className="w-4 h-4 text-heritage-gold" /> Certificate Included</span>
                            {program.isChaitanyaOrSparsh && (
                                <span className="flex items-center gap-1"><Layers className="w-4 h-4 text-heritage-gold" /> {activeModules.length} Active Art Forms</span>
                            )}
                        </div>
                        <div className="flex flex-wrap gap-4">
                            {program.isChaitanyaOrSparsh ? (
                                <Button variant="gold" size="xl" onClick={() => document.getElementById('modules-section').scrollIntoView({ behavior: 'smooth' })}>
                                    View Modules <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            ) : (
                                user ? (
                                    <Button variant="gold" size="xl" onClick={() => handleProgramEnroll(program._id)} disabled={enrollLoading}>
                                        {enrollLoading ? <Loader2 className="animate-spin mr-2" /> : `Enroll Now — ${program.price}`} <ArrowRight className="ml-2 w-5 h-5" />
                                    </Button>
                                ) : (
                                    <Link to="/register">
                                        <Button variant="gold" size="xl">
                                            Enroll Now — {program.price} <ArrowRight className="ml-2 w-5 h-5" />
                                        </Button>
                                    </Link>
                                )
                            )}
                            {user && (
                                <Button variant="outlineGold" size="xl" onClick={() => setShowSponsorModal(true)}>
                                    Have a Sponsor Code?
                                </Button>
                            )}

                            {program.isChaitanyaOrSparsh && user && (
                                <Link to={`/dashboard/learning`}>
                                    <Button variant="outlineGold" size="xl">
                                        <Play className="mr-2 w-5 h-5" /> Go to Learning Dashboard
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </motion.div>
                </div>
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 80" className="w-full h-auto"><path fill="#FFFDF5" d="M0,40 C480,80 960,0 1440,40 L1440,80 L0,80 Z" /></svg>
                </div>
            </section>

            {/* Chaitanya/Sparsh Module Structure */}
            {program.isChaitanyaOrSparsh && (
                <section id="modules-section" className="py-16 bg-heritage-creamLight">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="mb-8">
                            <h2 className="text-2xl font-heading font-bold text-heritage-terracottaDark mb-2">
                                {activeModules.length} Tribal & Folk Art Forms
                            </h2>
                            <p className="text-text-main font-body">
                                Each module explores a different Indian art form. Every module includes <strong>4 creation sessions</strong> and <strong>2 application sessions</strong> where you apply the art on usable surfaces.
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
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.1 }}
                                    >
                                        <Card className={`overflow-hidden transition-shadow ${mod.isLocked && !user ? 'opacity-60' : 'hover:shadow-md'}`}>
                                            <div
                                                className="p-4 flex items-center justify-between cursor-pointer"
                                                onClick={() => setExpandedModule(isExpanded ? null : mod._id)}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-lg bg-heritage-terracotta/10 flex items-center justify-center text-heritage-terracottaDark font-heading font-bold">
                                                        {mod.order || i + 1}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <h3 className="font-heading font-semibold text-heritage-terracottaDark">
                                                                {mod.artFormName || mod.title}
                                                            </h3>
                                                            {mod.artFormType && (
                                                                <Badge variant="outline" className="text-xs capitalize">
                                                                    {mod.artFormType}
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <p className="text-xs font-body text-text-main">
                                                            {creationSessions.length} creation + {applicationSessions.length} application sessions
                                                            {liveRecordings.length > 0 && ` · ${liveRecordings.length} live recordings`}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {mod.isLocked && !user ? (
                                                        <>
                                                            <span className="text-xs text-heritage-terracotta/60 font-medium">Locked</span>
                                                            <Lock className="w-5 h-5 text-heritage-terracotta/40" />
                                                        </>
                                                    ) : (
                                                        <>
                                                            <span className="text-xs text-heritage-gold font-medium">{isExpanded ? 'Collapse' : 'Click to expand'}</span>
                                                            {isExpanded ? (
                                                                <ChevronUp className="w-5 h-5 text-heritage-gold" />
                                                            ) : (
                                                                <ChevronDown className="w-5 h-5 text-heritage-gold/70" />
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Expanded module details */}
                                            {isExpanded && (user || !mod.isLocked) && (
                                                <div className="px-4 pb-4 border-t border-heritage-gold/10 pt-4">
                                                    {/* Module Enrollment Check for KalaPath */}
                                                    {program.programType === 'KalaPath' && (
                                                        <div className="mb-6 p-4 bg-white rounded-lg border border-heritage-gold/20 flex items-center justify-between">
                                                            <div>
                                                                <h4 className="font-heading font-semibold text-heritage-terracottaDark">Module Access</h4>
                                                                <p className="text-sm font-body text-text-main">
                                                                    {enrolledModules.includes(mod._id) 
                                                                        ? "You have full access to this module."
                                                                        : "Enroll in this module to unlock its sessions and materials."}
                                                                </p>
                                                            </div>
                                                            {enrolledModules.includes(mod._id) ? (
                                                                <Badge className="bg-green-100 text-green-800 text-sm px-3 py-1"><CheckCircle className="w-4 h-4 mr-1"/> Enrolled</Badge>
                                                            ) : (
                                                                <Button 
                                                                    variant="gold" 
                                                                    onClick={() => handleModuleEnroll(mod._id)}
                                                                    disabled={enrollLoading}
                                                                >
                                                                    {enrollLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Lock className="w-4 h-4 mr-2" />}
                                                                    Enroll in Module
                                                                </Button>
                                                            )}
                                                        </div>
                                                    )}

                                                    {mod.description && (
                                                        <p className="text-sm font-body text-text-main mb-4">{mod.description}</p>
                                                    )}

                                                    {/* Fundamentals Video */}
                                                    {mod.fundamentalsVideoUrl && (
                                                        <div className="mb-4">
                                                            <h4 className="text-sm font-heading font-semibold text-heritage-terracottaDark mb-2 flex items-center gap-1">
                                                                <Video className="w-4 h-4" /> Fundamentals Video
                                                            </h4>
                                                            <div
                                                                className="bg-heritage-cream p-3 rounded flex items-center gap-2 cursor-pointer hover:bg-heritage-creamDark transition-colors"
                                                                onClick={() => openVideo(mod.fundamentalsVideoUrl, `Fundamentals: ${mod.artFormName || mod.title}`, mod._id, 'fundamentals')}
                                                            >
                                                                <Play className="w-4 h-4 text-heritage-gold" />
                                                                <span className="text-sm text-text-main">Pre-recorded fundamentals — Click to Watch</span>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Material List */}
                                                    {mod.materialListUrl && (
                                                        <div className="mb-4">
                                                            <a href={mod.materialListUrl} target="_blank" rel="noopener noreferrer"
                                                                className="inline-flex items-center gap-1 text-sm text-heritage-gold hover:text-heritage-terracottaDark">
                                                                <Download className="w-4 h-4" /> Download Material List
                                                            </a>
                                                        </div>
                                                    )}

                                                    {/* Creation Sessions (4) */}
                                                    {creationSessions.length > 0 && (
                                                        <div className="mb-4">
                                                            <h4 className="text-sm font-heading font-semibold text-purple-700 mb-2 flex items-center gap-1">
                                                                <Palette className="w-4 h-4" /> Creation Sessions ({creationSessions.length})
                                                            </h4>
                                                            <div className="space-y-2">
                                                                {creationSessions.map((session, si) => (
                                                                    <div
                                                                        key={si}
                                                                        className={`flex items-center gap-2 p-2 rounded ${session.videoUrl ? 'bg-purple-50/50 cursor-pointer hover:bg-purple-100/50 transition-colors' : 'bg-purple-50/50 opacity-80'}`}
                                                                        onClick={() => session.videoUrl && openVideo(session.videoUrl, session.title, mod._id, 'creation', session.sessionNumber, si)}
                                                                    >
                                                                        <span className="text-xs font-bold text-purple-600 w-6">{session.sessionNumber || si + 1}.</span>
                                                                        <span className="text-sm text-text-main flex-1">{session.title}</span>
                                                                        {session.videoUrl ? <Play className="w-4 h-4 text-purple-500" /> : <span className="w-4 h-4" />}
                                                                        {session.duration && <span className="text-xs text-muted-foreground">{session.duration}</span>}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Application Sessions (2) */}
                                                    {applicationSessions.length > 0 && (
                                                        <div className="mb-4">
                                                            <h4 className="text-sm font-heading font-semibold text-teal-700 mb-2 flex items-center gap-1">
                                                                <Activity className="w-4 h-4" /> Application Sessions ({applicationSessions.length})
                                                            </h4>
                                                            <div className="space-y-2">
                                                                {applicationSessions.map((session, si) => (
                                                                    <div
                                                                        key={si}
                                                                        className={`flex items-center gap-2 p-2 rounded ${session.videoUrl ? 'bg-teal-50/50 cursor-pointer hover:bg-teal-100/50 transition-colors' : 'bg-teal-50/50 opacity-80'}`}
                                                                        onClick={() => session.videoUrl && openVideo(session.videoUrl, session.title, mod._id, 'application', session.sessionNumber, si)}
                                                                    >
                                                                        <span className="text-xs font-bold text-teal-600 w-6">{session.sessionNumber || creationSessions.length + si + 1}.</span>
                                                                        <span className="text-sm text-text-main flex-1">{session.title}</span>
                                                                        {session.videoUrl ? <Play className="w-4 h-4 text-teal-500" /> : <span className="w-4 h-4" />}
                                                                        {session.duration && <span className="text-xs text-muted-foreground">{session.duration}</span>}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Live Class Recordings */}
                                                    {liveRecordings.length > 0 && (
                                                        <div>
                                                            <h4 className="text-sm font-heading font-semibold text-red-700 mb-2 flex items-center gap-1">
                                                                <Camera className="w-4 h-4" /> Weekly Live Class Recordings
                                                            </h4>
                                                            <div className="space-y-2">
                                                                {liveRecordings.map((rec, ri) => (
                                                                    <div
                                                                        key={ri}
                                                                        className={`flex items-center gap-2 p-2 rounded ${rec.videoUrl ? 'bg-red-50/50 cursor-pointer hover:bg-red-100/50 transition-colors' : 'bg-red-50/50 opacity-80'}`}
                                                                        onClick={() => rec.videoUrl && openVideo(rec.videoUrl, rec.title || `Live Recording ${ri + 1}`, mod._id, 'live-recording', ri, ri)}
                                                                    >
                                                                        <span className="text-xs font-bold text-red-600 w-6">{ri + 1}.</span>
                                                                        <Play className="w-4 h-4 text-red-500" />
                                                                        <span className="text-sm text-text-main flex-1">{rec.title}</span>
                                                                        {rec.recordedAt && (
                                                                            <span className="text-xs text-muted-foreground">
                                                                                {new Date(rec.recordedAt).toLocaleDateString('en-IN')}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Submit / Upload Work */}
                                                    {user && (
                                                        <div className="mt-5 p-4 bg-heritage-cream rounded-lg border border-heritage-gold/30">
                                                            <h4 className="text-sm font-heading font-semibold text-heritage-terracottaDark mb-1 flex items-center gap-1">
                                                                <FileText className="w-4 h-4" /> Submit Your Work
                                                            </h4>
                                                            <p className="text-xs text-text-main mb-3">
                                                                After completing this module, upload <strong>1 artwork</strong> and <strong>1 activity work</strong> for certification.
                                                            </p>
                                                            <label
                                                                htmlFor={`upload-${mod._id}`}
                                                                className="inline-flex items-center gap-2 cursor-pointer bg-heritage-terracotta hover:bg-heritage-terracottaDark text-white text-sm font-body font-semibold px-4 py-2 rounded-lg transition-colors"
                                                            >
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 12V4m0 0L8 8m4-4l4 4" /></svg>
                                                                Upload &amp; Submit
                                                            </label>
                                                            <input
                                                                id={`upload-${mod._id}`}
                                                                type="file"
                                                                accept="image/*,video/*,.pdf"
                                                                multiple
                                                                className="hidden"
                                                                onChange={(e) => {
                                                                    const files = Array.from(e.target.files);
                                                                    if (files.length > 0) {
                                                                        alert(`${files.length} file(s) selected for "${mod.artFormName || mod.title}". Submission feature coming soon!`);
                                                                    }
                                                                }}
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </Card>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </section>
            )}

            {/* Standard Modules (for non-Chaitanya/Sparsh programs) */}
            {!program.isChaitanyaOrSparsh && (program.modules || []).length > 0 && (
                <section className="py-16 bg-heritage-creamLight">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl font-heading font-bold text-heritage-terracottaDark mb-8">Program Modules</h2>
                        <div className="space-y-4">
                            {(program.modules || []).map((mod, i) => (
                                <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                                    <Card className="p-4 flex items-center justify-between hover:shadow-md transition-shadow">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-lg bg-heritage-terracotta/10 flex items-center justify-center text-heritage-terracottaDark font-heading font-bold">
                                                {i + 1}
                                            </div>
                                            <div>
                                                <h3 className="font-heading font-semibold text-heritage-terracottaDark">{mod.title}</h3>
                                                <p className="text-xs font-body text-text-main">{(mod.sessions || mod.lessons || []).length} sessions/lessons {mod.duration ? `· ${mod.duration}` : ''}</p>
                                            </div>
                                        </div>
                                        <CheckCircle className="w-5 h-5 text-heritage-gold/40" />
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Learning Outcomes */}
            <section className="py-16 bg-heritage-cream">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <h2 className="text-2xl font-heading font-bold text-heritage-terracottaDark mb-6">What You'll Achieve</h2>
                            <ul className="space-y-3">
                                {(program.outcomes || []).map((outcome, i) => (
                                    <li key={i} className="flex items-start gap-2 font-body text-text-main">
                                        <CheckCircle className="w-5 h-5 text-heritage-gold mt-0.5" />
                                        <span>{outcome}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="space-y-6">
                            <Card className="p-6 heritage-border">
                                <h3 className="font-heading font-semibold text-heritage-terracottaDark mb-2">Program Details</h3>
                                <Separator className="mb-4" />
                                <ul className="space-y-2 text-sm font-body text-text-main">
                                    <li><strong>Duration:</strong> {program.duration}</li>
                                    <li><strong>Level:</strong> {program.level}</li>
                                    <li><strong>Instructor:</strong> {program.instructor}</li>
                                    <li><strong>Price:</strong> <span className="text-heritage-gold font-heading font-bold">{program.price}</span></li>
                                    {program.isChaitanyaOrSparsh && program.programType !== 'KalaVritti' && (
                                        <>
                                            <li><strong>Active Art Forms:</strong> {activeModules.length} of {program.maxActiveModules || 7}</li>
                                            <li><strong>Structure:</strong> 4 creation + 2 application sessions per art form</li>
                                            <li><strong>Excellence Certificate:</strong> After 3 & 6 modules</li>
                                            <li><strong>Completion Certificate:</strong> After all 7 modules</li>
                                        </>
                                    )}
                                    {program.programType === 'KalaVritti' && (
                                        <>
                                            <li><strong>Program Structure:</strong> 2 Fixed Modules (Fundamentals & Business)</li>
                                            <li><strong>Included:</strong> Downloadable material list per module</li>
                                            <li><strong>Outcomes:</strong> Create and sell your products on Adyom</li>
                                        </>
                                    )}
                                    <li><strong>Certificate:</strong> Included on completion</li>
                                    <li><strong>Community:</strong> Access to peer group</li>
                                </ul>
                            </Card>
                            <Link to="/register">
                                <Button variant="gold" size="lg" className="w-full">
                                    Enroll Now <ArrowRight className="ml-2 w-4 h-4" />
                                </Button>
                            </Link>
                            {user && (
                                <Button variant="outlineGold" size="lg" className="w-full mt-2" onClick={() => setShowSponsorModal(true)}>
                                    Have a Sponsor Code?
                                </Button>
                            )}

                        </div>
                    </div>
                </div>
            </section>


            {/* Sponsor Code Modal */}
            {showSponsorModal && (
                <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
                    <div className="relative w-full max-w-md bg-background rounded-xl p-6 border border-heritage-gold/30">
                        <button onClick={() => setShowSponsorModal(false)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
                            <X className="w-5 h-5" />
                        </button>
                        <h3 className="text-xl font-heading font-bold mb-2">Enroll with Sponsor Code</h3>
                        <p className="text-sm text-muted-foreground mb-4">Enter your organization's sponsor code to enroll in {program.title} for free.</p>
                        
                        {sponsorSuccess && <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-md text-sm">{sponsorSuccess}</div>}
                        {sponsorError && <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-md text-sm">{sponsorError}</div>}
                        
                        <div className="space-y-4">
                            <Input 
                                value={sponsorCode} 
                                onChange={(e) => setSponsorCode(e.target.value.toUpperCase())} 
                                placeholder="e.g. TATA2026" 
                            />
                            <Button variant="gold" className="w-full" onClick={handleSponsorEnroll} disabled={sponsorLoading || !sponsorCode.trim()}>
                                {sponsorLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : 'Validate & Enroll'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}