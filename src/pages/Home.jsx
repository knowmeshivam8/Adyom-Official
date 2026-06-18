import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
    ArrowRight,
    Eye,
    Lightbulb,
    Sparkles,
    Palette,
    HandHeart,
    Camera,
    Music,
    Brush,
    Heart,
    Users,
    BookOpen,
    Star,
    Globe,
    Award,
    TreePine,
    MapPin,
    Calendar,
    ChevronLeft,
    ChevronRight,
    Mail,
    Phone,
    Infinity,
    Compass,
    Leaf,
    Crown,
    Gift,
    Shield,
    Zap,
} from 'lucide-react';
import { programAPI, testimonialAPI, galleryAPI } from '@/api';

// ============ COLOR PALETTE ============
// Primary: #B87333 (Terracotta/Copper)
// Secondary: #C9A96E (Warm Gold)
// Background: #FDFBF7 (Warm Cream)
// Dark: #3C2F2B (Deep Brown)
// Accent: #8F6B5A (Muted Brown)
// Light: #F5E6D3 (Soft Beige)
// Text: #4A3A32 (Warm Dark)

// ============ ANIMATION VARIANTS ============
const fadeInUp = {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] },
};

const fadeInLeft = {
    initial: { opacity: 0, x: -60 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] },
};

const fadeInRight = {
    initial: { opacity: 0, x: 60 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] },
};

const fadeInScale = {
    initial: { opacity: 0, scale: 0.92 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
};

const staggerContainer = {
    animate: {
        transition: { staggerChildren: 0.15, delayChildren: 0.1 },
    },
};

// ============ PROGRAM DATA ============
const programHighlights = [
    {
        icon: Eye,
        title: 'Drishti',
        subtitle: 'The Vision',
        desc: 'Visual arts, painting, & contemporary expression rooted in heritage',
        gradient: 'from-[#B87333] to-[#C9A96E]',
        color: '#B87333',
    },
    {
        icon: Lightbulb,
        title: 'Chaitanya',
        subtitle: 'The Awakening',
        desc: 'Mindfulness, meditation, & inner transformation practices',
        gradient: 'from-[#C9A96E] to-[#B87333]',
        color: '#C9A96E',
    },
    {
        icon: Palette,
        title: 'Kala-Path',
        subtitle: 'The Art Journey',
        desc: 'Structured art courses from basics to mastery',
        gradient: 'from-[#8F6B5A] to-[#B87333]',
        color: '#8F6B5A',
    },
    {
        icon: HandHeart,
        title: 'Sparsh',
        subtitle: 'The Touch',
        desc: 'Hands-on craft workshops in pottery, weaving, & folk art',
        gradient: 'from-[#D4A574] to-[#C9A96E]',
        color: '#D4A574',
    },
    {
        icon: Camera,
        title: 'Pratibimb',
        subtitle: 'The Reflection',
        desc: 'Photography & visual storytelling through cultural lens',
        gradient: 'from-[#8B7B6B] to-[#6B5B4B]',
        color: '#8B7B6B',
    },
    {
        icon: Music,
        title: 'Kala-Vritti',
        subtitle: 'The Art Living',
        desc: 'Career support for emerging artists & creatives',
        gradient: 'from-[#C9A96E] to-[#8F6B5A]',
        color: '#C9A96E',
    },
];

// ============ WHY JOIN DATA ============
const whyJoinReasons = [
    {
        icon: Heart,
        title: 'Heritage Revival',
        desc: 'Rediscover India\'s timeless art forms, folk traditions, and creative wisdom passed down through generations.',
    },
    {
        icon: Lightbulb,
        title: 'Mindful Practice',
        desc: 'Integrate mindfulness and meditation into your creative journey — art as a path to inner awakening.',
    },
    {
        icon: Users,
        title: 'Community Connection',
        desc: 'Join a vibrant community of heritage seekers, artists, and mindful creators who inspire each other.',
    },
    {
        icon: BookOpen,
        title: 'Structured Learning',
        desc: 'From beginner workshops to advanced mastery — guided programs that honor tradition and foster growth.',
    },
    {
        icon: Award,
        title: 'Certificates & Growth',
        desc: 'Earn verified certificates, showcase your artwork, and build your creative portfolio with community support.',
    },
    {
        icon: Globe,
        title: 'Cultural Bridge',
        desc: 'Connect India\'s heritage with the modern world — corporate programs, artisan support, and global outreach.',
    },
];

// ============ IMPACT STATS ============
const impactStats = [
    { number: '5,000+', label: 'Community Members', icon: Users },
    { number: '200+', label: 'Programs & Workshops', icon: BookOpen },
    { number: '50+', label: 'Artisan Partners', icon: Palette },
    { number: '15+', label: 'Corporate Partners', icon: Globe },
];

export default function Home() {
    const [currentTestimonial, setCurrentTestimonial] = useState(0);

    const fallbackTestimonials = [
        {
            name: 'Priya Sharma',
            role: 'Yoga Instructor & Artist',
            content: 'Adyom Foundation helped me reconnect with my roots through art. The Drishti program transformed how I see both heritage and my own creative expression.',
            avatar: 'P',
        },
        {
            name: 'Arun Kumar',
            role: 'Corporate Professional',
            content: 'The mindfulness sessions at Adyom gave me tools I use every day. In our fast-paced world, Chaitanya offers a sanctuary of calm and clarity.',
            avatar: 'A',
        },
        {
            name: 'Meera Patel',
            role: 'Artisan & Craftswoman',
            content: 'Through Sparsh, I learned new techniques while preserving the old. Adyom Foundation gave me a platform to share my craft with the world.',
            avatar: 'M',
        },
        {
            name: 'Dr. Vikram Singh',
            role: 'CSR Director, TechCorp',
            content: 'Partnering with Adyom for our CSR program was transformative. Their heritage workshops brought cultural awareness and team cohesion like nothing else.',
            avatar: 'V',
        },
    ];

    const fallbackFeaturedPrograms = [
        {
            title: 'Heritage Painting Masterclass',
            category: 'Drishti',
            level: 'Intermediate',
            duration: '12 Weeks',
            image: 'from-[#B87333] to-[#D4A574]',
            desc: 'Master traditional Indian painting techniques — from Madhubani to miniature art.',
        },
        {
            title: 'Mindful Meditation Retreat',
            category: 'Chaitanya',
            level: 'All Levels',
            duration: '8 Weeks',
            image: 'from-[#C9A96E] to-[#B87333]',
            desc: 'Deep meditation practices rooted in ancient wisdom, adapted for modern life.',
        },
        {
            title: 'Pottery & Terracotta Workshop',
            category: 'Sparsh',
            level: 'Beginner',
            duration: '4 Weeks',
            image: 'from-[#8F6B5A] to-[#6B4F3A]',
            desc: 'Hands-on pottery workshop exploring India\'s rich terracotta traditions.',
        },
    ];

    const fallbackGalleryItems = [
        { gradient: 'from-[#B87333] to-[#D4A574]', Icon: Palette },
        { gradient: 'from-[#C9A96E] to-[#F5E6D3]', Icon: Brush },
        { gradient: 'from-[#8F6B5A] to-[#6B4F3A]', Icon: Camera },
        { gradient: 'from-[#D4A574] to-[#C9A96E]', Icon: Music },
        { gradient: 'from-[#F5E6D3] to-[#C9A96E]', Icon: TreePine },
        { gradient: 'from-[#B87333] to-[#8F6B5A]', Icon: Sparkles },
        { gradient: 'from-[#6B4F3A] to-[#F5E6D3]', Icon: Eye },
        { gradient: 'from-[#F5E6D3] to-[#B87333]', Icon: HandHeart },
    ];

    const [testimonials, setTestimonials] = useState(fallbackTestimonials);
    const [featuredPrograms, setFeaturedPrograms] = useState(fallbackFeaturedPrograms);
    const [galleryItems, setGalleryItems] = useState(fallbackGalleryItems);

    useEffect(() => {
        const fetchHomeData = async () => {
            try {
                const res = await testimonialAPI.getPublic({ status: 'approved', limit: 6 });
                if (res.data?.data?.length > 0) {
                    setTestimonials(res.data.data.map(t => ({
                        name: t.name || t.user?.name || 'Community Member',
                        role: t.role || t.designation || 'Heritage Seeker',
                        content: t.content || t.text || '',
                        avatar: (t.name || t.user?.name || 'M')[0].toUpperCase(),
                    })));
                }
            } catch (err) {
                console.log('Using fallback testimonials');
            }

            try {
                const res = await programAPI.getFeatured();
                if (res.data?.data?.length > 0) {
                    setFeaturedPrograms(res.data.data.map(p => ({
                        title: p.title,
                        category: p.category || 'General',
                        level: p.level || 'All Levels',
                        duration: p.duration || '8 Weeks',
                        image: p.image ? '' : 'from-[#B87333] to-[#D4A574]',
                        desc: p.description || p.shortDesc || '',
                        slug: p.slug || p._id,
                        imageUrl: p.image || null,
                    })));
                }
            } catch (err) {
                console.log('Using fallback programs');
            }

            try {
                const res = await galleryAPI.getAll({ status: 'published', limit: 8 });
                if (res.data?.data?.length > 0) {
                    setGalleryItems(res.data.data.map(item => ({
                        gradient: item.image ? '' : 'from-[#B87333] to-[#D4A574]',
                        Icon: item.image ? null : Palette,
                        imageUrl: item.image || null,
                        title: item.title || '',
                    })));
                }
            } catch (err) {
                console.log('Using fallback gallery items');
            }
        };

        fetchHomeData();
    }, []);

    return (
        <div className="min-h-screen font-serif bg-[#FDFBF7]">

            {/* ============ HERO SECTION ============ */}
            <section className="relative min-h-[90vh] overflow-hidden flex items-center bg-gradient-to-b from-[#FDFBF7] via-[#F5E6D3]/40 to-[#FDFBF7]">
                {/* Decorative Background Elements */}
                <div className="absolute inset-0 z-0">
                    <motion.div
                        className="absolute top-10 right-10 text-8xl opacity-[0.06] text-[#B87333]"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                    >
                        ✦
                    </motion.div>
                    <motion.div
                        className="absolute bottom-20 left-10 text-9xl opacity-[0.04] text-[#8F6B5A]"
                        animate={{ rotate: -360 }}
                        transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
                    >
                        ✧
                    </motion.div>
                    <motion.div
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-[#B87333]/10"
                        animate={{ scale: [1, 1.08, 1] }}
                        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <motion.div
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-[#C9A96E]/8"
                        animate={{ scale: [1.08, 1, 1.08] }}
                        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
                    <div className="max-w-4xl mx-auto text-center pt-12 md:pt-0">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
                            className="space-y-8"
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.7, delay: 0.2 }}
                                className="inline-block"
                            >
                                <span className="inline-block px-6 py-2.5 bg-[#B87333]/10 border border-[#B87333]/20 text-[#B87333] font-serif text-sm tracking-widest uppercase">
                                    <Sparkles className="w-3 h-3 mr-2 inline" />
                                    Canvas of Heritage
                                    <Sparkles className="w-3 h-3 ml-2 inline" />
                                </span>
                            </motion.div>

                            <motion.h1
                                className="text-4xl md:text-6xl lg:text-7xl font-serif text-[#3C2F2B] leading-[1.1]"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3, duration: 0.9 }}
                            >
                                Rediscover
                                <br />
                                <span className="text-[#B87333]">India's</span> Timeless
                                <br />
                                <span className="text-[#C9A96E]">Heritage</span>
                            </motion.h1>

                            <motion.p
                                className="text-lg md:text-xl font-serif font-light text-[#6B5B4B] leading-relaxed max-w-2xl mx-auto"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4, duration: 0.9 }}
                            >
                                Art, mindfulness, culture & community — a living canvas where heritage
                                breathes, creativity awakens, and souls find their roots.
                            </motion.p>

                            <motion.div
                                className="flex flex-wrap gap-4 justify-center"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5, duration: 0.9 }}
                            >
                                <Link to="/programs">
                                    <Button
                                        size="xl"
                                        className="bg-[#B87333] hover:bg-[#8F6B5A] text-white hover:shadow-xl transition-all duration-300 group font-serif text-base px-10 py-3 rounded-none"
                                    >
                                        Explore Programs
                                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                                <Link to="/register">
                                    <Button
                                        variant="outline"
                                        size="xl"
                                        className="border-[#B87333]/40 text-[#3C2F2B] hover:bg-[#B87333]/5 font-serif text-base px-10 py-3 rounded-none"
                                    >
                                        Become a Member
                                    </Button>
                                </Link>
                            </motion.div>

                            <motion.div
                                className="flex flex-wrap items-center justify-center gap-6 text-sm font-serif text-[#8F6B5A]"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6, duration: 0.9 }}
                            >
                                <span className="flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm border border-[#B87333]/10">
                                    <Star className="w-4 h-4 text-[#B87333]" /> 5,000+ Members
                                </span>
                                <span className="flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm border border-[#B87333]/10">
                                    <BookOpen className="w-4 h-4 text-[#B87333]" /> 200+ Programs
                                </span>
                                <span className="flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm border border-[#B87333]/10">
                                    <Palette className="w-4 h-4 text-[#B87333]" /> Heritage Revival
                                </span>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 120" className="w-full h-auto" preserveAspectRatio="none">
                        <path fill="#FDFBF7" d="M0,60 C480,120 960,0 1440,60 L1440,120 L0,120 Z" />
                    </svg>
                </div>
            </section>

            {/* ============ WHAT YOU'LL LEARN ============ */}
            <section className="py-24 md:py-32 bg-[#FDFBF7]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        {...fadeInUp}
                        className="text-center mb-20"
                        whileInView="animate"
                        viewport={{ once: true, margin: "-100px" }}
                    >
                        <span className="inline-block text-[#B87333] font-serif text-sm tracking-[0.3em] uppercase mb-4 border-b border-[#B87333]/30 pb-2">
                            ✦ Our Programs
                        </span>
                        <h2 className="text-3xl md:text-5xl font-serif font-normal text-[#3C2F2B]">
                            What You'll Learn at <span className="text-[#B87333]">Adyom</span>
                        </h2>
                        <p className="mt-4 text-lg font-serif font-light text-[#8F6B5A] max-w-2xl mx-auto">
                            Six streams of heritage learning — each a path to rediscovery, mastery, and inner transformation
                        </p>
                        <div className="w-20 h-px mx-auto mt-6 bg-[#B87333]" />
                    </motion.div>

                    <motion.div
                        variants={staggerContainer}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true, margin: "-50px" }}
                        className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {programHighlights.map((item, i) => (
                            <motion.div
                                key={i}
                                variants={fadeInUp}
                                whileHover={{ y: -6 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="group bg-white border border-[#B87333]/10 p-8 hover:shadow-xl transition-all duration-500 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#B87333]/5 to-transparent" />
                                    <div className="relative space-y-4">
                                        <div className={`w-14 h-14 flex items-center justify-center bg-gradient-to-br ${item.gradient} text-white group-hover:scale-110 transition-transform duration-500`}>
                                            <item.icon className="w-7 h-7" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-serif font-normal text-[#3C2F2B]">{item.title}</h3>
                                            <p className="text-sm font-serif font-light text-[#8F6B5A] italic">{item.subtitle}</p>
                                        </div>
                                        <p className="text-sm font-serif font-light text-[#6B5B4B] leading-relaxed">{item.desc}</p>
                                        <Link to={`/programs?category=${item.title.toLowerCase()}`}>
                                            <span className="inline-block text-[#B87333] hover:text-[#8F6B5A] font-serif text-sm transition-colors duration-300 group-hover:translate-x-1">
                                                Learn More <ArrowRight className="inline w-4 h-4 ml-1" />
                                            </span>
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ============ WHY JOIN ============ */}
            <section className="py-24 md:py-32 relative overflow-hidden bg-[#3C2F2B]">
                <div className="absolute inset-0 opacity-[0.04]">
                    <div className="absolute top-20 left-20 w-64 h-64 border-4 border-[#C9A96E] rounded-full animate-spin-slow" />
                    <div className="absolute bottom-20 right-20 w-80 h-80 border-4 border-[#C9A96E]/50 rounded-full animate-spin-slower" />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.div
                        {...fadeInUp}
                        className="text-center mb-20"
                        whileInView="animate"
                        viewport={{ once: true, margin: "-100px" }}
                    >
                        <span className="inline-block text-[#C9A96E] font-serif text-sm tracking-[0.3em] uppercase mb-4 border-b border-[#C9A96E]/30 pb-2">
                            <Sparkles className="w-3 h-3 mr-2 inline" />
                            Why Adyom?
                            <Sparkles className="w-3 h-3 ml-2 inline" />
                        </span>
                        <h2 className="text-3xl md:text-5xl font-serif font-normal text-[#FDFBF7]">
                            Why Join the Adyom Community?
                        </h2>
                        <p className="mt-4 text-lg font-serif font-light text-[#D4A574] max-w-2xl mx-auto">
                            More than a platform — a movement to preserve, practice, and prosper through heritage
                        </p>
                        <div className="w-20 h-px mx-auto mt-6 bg-[#C9A96E]" />
                    </motion.div>

                    <motion.div
                        variants={staggerContainer}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true, margin: "-50px" }}
                        className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {whyJoinReasons.map((item, i) => (
                            <motion.div
                                key={i}
                                variants={fadeInUp}
                                whileHover={{ y: -4 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="bg-white/5 backdrop-blur-sm p-8 hover:bg-white/10 transition-all duration-500 border border-white/5 group">
                                    <div className="w-12 h-12 flex items-center justify-center bg-[#C9A96E]/20 group-hover:scale-110 transition-transform duration-500">
                                        <item.icon className="w-6 h-6 text-[#C9A96E]" />
                                    </div>
                                    <h3 className="text-xl font-serif font-normal text-[#FDFBF7] mt-4">{item.title}</h3>
                                    <p className="text-sm font-serif font-light text-[#D4A574] leading-relaxed mt-2">{item.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>

                    <motion.div
                        {...fadeInUp}
                        className="text-center mt-12"
                        whileInView="animate"
                        viewport={{ once: true }}
                    >
                        <Link to="/register">
                            <Button
                                size="xl"
                                className="bg-[#C9A96E] hover:bg-[#B87333] text-[#3C2F2B] hover:text-white hover:shadow-xl transition-all duration-300 group font-serif text-base px-10 py-3 rounded-none"
                            >
                                Join the Movement <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                    </motion.div>
                </div>

                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 80" className="w-full h-auto" preserveAspectRatio="none">
                        <path fill="#FDFBF7" d="M0,40 C480,80 960,0 1440,40 L1440,80 L0,80 Z" />
                    </svg>
                </div>
            </section>

            {/* ============ FEATURED PROGRAMS ============ */}
            <section className="py-24 md:py-32 bg-[#FDFBF7]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        {...fadeInUp}
                        className="text-center mb-20"
                        whileInView="animate"
                        viewport={{ once: true, margin: "-100px" }}
                    >
                        <span className="inline-block text-[#B87333] font-serif text-sm tracking-[0.3em] uppercase mb-4 border-b border-[#B87333]/30 pb-2">
                            ✦ Featured Programs
                        </span>
                        <h2 className="text-3xl md:text-5xl font-serif font-normal text-[#3C2F2B]">
                            Begin Your Heritage Journey
                        </h2>
                        <p className="mt-4 text-lg font-serif font-light text-[#8F6B5A] max-w-2xl mx-auto">
                            Curated programs that blend tradition with transformation
                        </p>
                        <div className="w-20 h-px mx-auto mt-6 bg-[#B87333]" />
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {featuredPrograms.map((program, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ delay: i * 0.15, duration: 0.7 }}
                                whileHover={{ y: -6 }}
                            >
                                <div className="bg-white border border-[#B87333]/10 hover:shadow-xl transition-all duration-500 overflow-hidden">
                                    <div className={`h-52 ${program.imageUrl ? '' : 'bg-gradient-to-br ' + program.image} flex items-center justify-center relative overflow-hidden`}>
                                        {program.imageUrl ? (
                                            <img src={program.imageUrl} alt={program.title} className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
                                        ) : (
                                            <div className="text-center">
                                                <div className="w-16 h-16 flex items-center justify-center bg-white/20 backdrop-blur-sm mx-auto mb-3">
                                                    <Palette className="w-8 h-8 text-white" />
                                                </div>
                                                <span className="inline-block px-4 py-1 bg-white/20 backdrop-blur-sm text-white font-serif text-sm border-none">
                                                    {program.category}
                                                </span>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#3C2F2B]/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500" />
                                    </div>
                                    <div className="p-6 space-y-3">
                                        <h3 className="text-xl font-serif font-normal text-[#3C2F2B] hover:text-[#B87333] transition-colors duration-300">
                                            {program.title}
                                        </h3>
                                        <p className="text-sm font-serif font-light text-[#6B5B4B]">{program.desc}</p>
                                        <div className="flex items-center gap-3 text-xs font-serif text-[#8F6B5A]">
                                            <span className="px-3 py-1 bg-[#B87333]/10 text-[#3C2F2B]">{program.level}</span>
                                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {program.duration}</span>
                                        </div>
                                        <Link to={`/programs/${program.slug || program._id || ''}`}>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="w-full mt-2 border-[#B87333]/30 text-[#3C2F2B] hover:bg-[#B87333] hover:text-white transition-all duration-300 font-serif rounded-none"
                                            >
                                                View Program <ArrowRight className="ml-1 w-4 h-4" />
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="text-center mt-12">
                        <Link to="/programs">
                            <Button
                                variant="outline"
                                size="lg"
                                className="border-[#B87333]/40 text-[#3C2F2B] hover:bg-[#B87333] hover:text-white transition-all duration-300 font-serif text-base px-10 py-3 rounded-none"
                            >
                                View All Programs <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* ============ ARTISAN CONNECT ============ */}
            <section className="py-24 md:py-32 bg-[#F5E6D3]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            {...fadeInLeft}
                            className="space-y-6"
                            whileInView="animate"
                            viewport={{ once: true, margin: "-50px" }}
                        >
                            <div>
                                <span className="inline-block text-[#B87333] font-serif text-sm tracking-[0.3em] uppercase mb-4 border-b border-[#B87333]/30 pb-2">
                                    ✦ Artisan Connect
                                </span>
                                <h2 className="text-3xl md:text-5xl font-serif font-normal text-[#3C2F2B]">
                                    Empowering India's <span className="text-[#B87333]">Artisans</span>
                                </h2>
                            </div>

                            <motion.div
                                className="bg-white/60 p-8 border-l-4 border-[#B87333]"
                                whileHover={{ scale: 1.01 }}
                                transition={{ duration: 0.3 }}
                            >
                                <p className="font-serif text-lg text-[#3C2F2B] italic font-light">"Every hand that crafts tells a story of heritage"</p>
                            </motion.div>

                            <div className="w-16 h-px bg-[#B87333]" />

                            <p className="font-serif font-light text-[#6B5B4B] leading-relaxed">
                                Artisan Connect is our initiative to support, promote, and preserve the work of traditional
                                Indian artisans. We provide platforms for visibility, tools for modern expression, and a
                                community that values handmade craft.
                            </p>

                            <ul className="space-y-3 font-serif font-light text-[#6B5B4B]">
                                {[
                                    'Showcase & sell traditional artwork on our gallery',
                                    'Connect with heritage lovers and collectors worldwide',
                                    'Access workshops for skill enhancement & modern techniques',
                                    'Corporate partnerships for sustainable artisan support',
                                ].map((item, i) => (
                                    <motion.li
                                        key={i}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.1 }}
                                        className="flex items-start gap-3"
                                    >
                                        <span className="w-5 h-5 flex items-center justify-center bg-[#B87333]/20 flex-shrink-0 mt-0.5">
                                            <Star className="w-3 h-3 text-[#B87333]" />
                                        </span>
                                        <span>{item}</span>
                                    </motion.li>
                                ))}
                            </ul>

                            <Link to="/artisan-connect">
                                <Button className="bg-[#B87333] hover:bg-[#8F6B5A] text-white hover:shadow-xl transition-all duration-300 group font-serif text-base px-10 py-3 rounded-none">
                                    Meet Our Artisans <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                        </motion.div>

                        <motion.div
                            {...fadeInRight}
                            className="relative"
                            whileInView="animate"
                            viewport={{ once: true, margin: "-50px" }}
                        >
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-4">
                                    {[
                                        { gradient: 'from-[#B87333] to-[#D4A574]', icon: Palette },
                                        { gradient: 'from-[#C9A96E] to-[#F5E6D3]', icon: HandHeart },
                                    ].map((item, i) => (
                                        <motion.div
                                            key={i}
                                            className={`h-48 bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-lg`}
                                            whileHover={{ scale: 1.03 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <item.icon className="w-16 h-16 text-white/50" />
                                        </motion.div>
                                    ))}
                                </div>
                                <div className="space-y-4 mt-8">
                                    {[
                                        { gradient: 'from-[#8F6B5A] to-[#6B4F3A]', icon: Users },
                                        { gradient: 'from-[#F5E6D3] to-[#D4A574]', icon: Globe },
                                    ].map((item, i) => (
                                        <motion.div
                                            key={i}
                                            className={`h-48 bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-lg`}
                                            whileHover={{ scale: 1.03 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <item.icon className="w-16 h-16 text-white/50" />
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ============ COMMUNITY IMPACT ============ */}
            <section className="py-24 md:py-32 bg-[#3C2F2B] relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.04]">
                    <div className="absolute top-20 left-20 w-64 h-64 border-4 border-[#C9A96E] rounded-full animate-spin-slow" />
                    <div className="absolute bottom-20 right-20 w-80 h-80 border-4 border-[#C9A96E]/50 rounded-full animate-spin-slower" />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.div
                        {...fadeInUp}
                        className="text-center mb-16"
                        whileInView="animate"
                        viewport={{ once: true, margin: "-100px" }}
                    >
                        <span className="inline-block text-[#C9A96E] font-serif text-sm tracking-[0.3em] uppercase mb-4 border-b border-[#C9A96E]/30 pb-2">
                            <Sparkles className="w-3 h-3 mr-2 inline" />
                            Community Impact
                            <Sparkles className="w-3 h-3 ml-2 inline" />
                        </span>
                        <h2 className="text-3xl md:text-5xl font-serif font-normal text-[#FDFBF7]">
                            Our Growing Heritage Community
                        </h2>
                    </motion.div>

                    <motion.div
                        className="grid md:grid-cols-4 gap-8"
                        variants={staggerContainer}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true, margin: "-50px" }}
                    >
                        {impactStats.map((stat, i) => (
                            <motion.div
                                key={i}
                                variants={fadeInScale}
                                whileHover={{ y: -4 }}
                                className="text-center space-y-3 bg-white/5 backdrop-blur-sm p-8 border border-white/5 hover:bg-white/10 transition-all duration-500"
                            >
                                <div className="w-16 h-16 mx-auto flex items-center justify-center bg-[#C9A96E]/20">
                                    <stat.icon className="w-8 h-8 text-[#C9A96E]" />
                                </div>
                                <p className="text-3xl md:text-4xl font-serif font-normal text-[#FDFBF7]">
                                    {stat.number}
                                </p>
                                <p className="text-sm font-serif font-light text-[#D4A574]">{stat.label}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>

                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 80" className="w-full h-auto" preserveAspectRatio="none">
                        <path fill="#FDFBF7" d="M0,40 C480,80 960,0 1440,40 L1440,80 L0,80 Z" />
                    </svg>
                </div>
            </section>

            {/* ============ GALLERY PREVIEW ============ */}
            <section className="py-24 md:py-32 bg-[#FDFBF7]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        {...fadeInUp}
                        className="text-center mb-20"
                        whileInView="animate"
                        viewport={{ once: true, margin: "-100px" }}
                    >
                        <span className="inline-block text-[#B87333] font-serif text-sm tracking-[0.3em] uppercase mb-4 border-b border-[#B87333]/30 pb-2">
                            ✦ Heritage Gallery
                        </span>
                        <h2 className="text-3xl md:text-5xl font-serif font-normal text-[#3C2F2B]">
                            A Canvas of Heritage
                        </h2>
                        <p className="mt-4 text-lg font-serif font-light text-[#8F6B5A] max-w-2xl mx-auto">
                            Where art, craft, and culture come alive
                        </p>
                        <div className="w-20 h-px mx-auto mt-6 bg-[#B87333]" />
                    </motion.div>

                    <motion.div
                        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                        variants={staggerContainer}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true, margin: "-50px" }}
                    >
                        {galleryItems.map((item, i) => (
                            <motion.div
                                key={i}
                                variants={fadeInScale}
                                whileHover={{ scale: 1.03 }}
                                className={`group relative h-48 md:h-56 ${item.imageUrl ? '' : 'bg-gradient-to-br ' + item.gradient} overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500`}
                            >
                                {item.imageUrl ? (
                                    <img src={item.imageUrl} alt={item.title || 'Gallery item'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center opacity-50 group-hover:opacity-100 transition-opacity duration-500">
                                        {item.Icon && <item.Icon className="w-12 h-12 text-white group-hover:scale-110 transition-transform duration-500" />}
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#3C2F2B]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            </motion.div>
                        ))}
                    </motion.div>

                    <div className="text-center mt-12">
                        <Link to="/gallery">
                            <Button
                                variant="outline"
                                size="lg"
                                className="border-[#B87333]/40 text-[#3C2F2B] hover:bg-[#B87333] hover:text-white transition-all duration-300 font-serif text-base px-10 py-3 rounded-none"
                            >
                                Explore Gallery <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* ============ TESTIMONIALS ============ */}
            <section className="py-24 md:py-32 bg-[#F5E6D3]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        {...fadeInUp}
                        className="text-center mb-20"
                        whileInView="animate"
                        viewport={{ once: true, margin: "-100px" }}
                    >
                        <span className="inline-block text-[#B87333] font-serif text-sm tracking-[0.3em] uppercase mb-4 border-b border-[#B87333]/30 pb-2">
                            ✦ Voices of Heritage
                        </span>
                        <h2 className="text-3xl md:text-5xl font-serif font-normal text-[#3C2F2B]">
                            What Our Community Says
                        </h2>
                        <div className="w-20 h-px mx-auto mt-6 bg-[#B87333]" />
                    </motion.div>

                    <div className="max-w-3xl mx-auto">
                        <div className="bg-white/80 backdrop-blur-sm p-10 md:p-14 border border-[#B87333]/20 shadow-xl hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
                            <div className="absolute top-4 right-6 text-[#B87333]/10 text-7xl font-serif">❋</div>

                            <motion.div
                                key={currentTestimonial}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 flex items-center justify-center bg-gradient-to-br from-[#B87333] to-[#8F6B5A] text-[#FDFBF7] font-serif text-xl">
                                        {testimonials[currentTestimonial].avatar}
                                    </div>
                                    <div>
                                        <h4 className="font-serif font-normal text-[#3C2F2B] text-lg">
                                            {testimonials[currentTestimonial].name}
                                        </h4>
                                        <p className="text-sm font-serif font-light text-[#8F6B5A]">
                                            {testimonials[currentTestimonial].role}
                                        </p>
                                    </div>
                                </div>

                                <p className="text-lg font-serif font-light text-[#6B5B4B] italic leading-relaxed">
                                    "{testimonials[currentTestimonial].content}"
                                </p>

                                <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, s) => (
                                        <Star key={s} className="w-5 h-5 text-[#B87333] fill-[#B87333]" />
                                    ))}
                                </div>
                            </motion.div>

                            <div className="flex items-center justify-between mt-8">
                                <button
                                    onClick={() => setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
                                    className="w-10 h-10 flex items-center justify-center bg-[#B87333]/10 hover:bg-[#B87333] text-[#3C2F2B] hover:text-white transition-all duration-300"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <div className="flex gap-2">
                                    {testimonials.map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setCurrentTestimonial(i)}
                                            className={`w-3 h-3 transition-all duration-500 ${i === currentTestimonial ? 'bg-[#B87333] w-6' : 'bg-[#B87333]/30'}`}
                                        />
                                    ))}
                                </div>
                                <button
                                    onClick={() => setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)}
                                    className="w-10 h-10 flex items-center justify-center bg-[#B87333]/10 hover:bg-[#B87333] text-[#3C2F2B] hover:text-white transition-all duration-300"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ============ CTA SECTION ============ */}
            <section className="py-20 md:py-24 bg-[#3C2F2B] relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.04]">
                    <div className="absolute top-0 right-0 w-96 h-96 border-4 border-[#C9A96E] rounded-full -mr-48 -mt-48" />
                    <div className="absolute bottom-0 left-0 w-96 h-96 border-4 border-[#C9A96E]/50 rounded-full -ml-48 -mb-48" />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.div
                        {...fadeInUp}
                        className="text-center max-w-3xl mx-auto space-y-8"
                        whileInView="animate"
                        viewport={{ once: true, margin: "-50px" }}
                    >
                        <span className="inline-block px-6 py-2.5 bg-[#C9A96E] text-[#3C2F2B] font-serif text-sm tracking-[0.3em] uppercase border-none">
                            <Sparkles className="w-3 h-3 mr-2 inline" />
                            Start Your Journey
                            <Sparkles className="w-3 h-3 ml-2 inline" />
                        </span>

                        <h2 className="text-3xl md:text-5xl font-serif font-normal text-[#FDFBF7]">
                            Ready to Rediscover Heritage?
                        </h2>

                        <p className="text-lg font-serif font-light text-[#D4A574] leading-relaxed">
                            Whether you seek mindful creativity, heritage art, or community connection —
                            Adyom Foundation is your canvas. Let's begin.
                        </p>

                        <div className="flex flex-wrap gap-4 justify-center">
                            <Link to="/register">
                                <Button
                                    size="xl"
                                    className="bg-[#C9A96E] hover:bg-[#B87333] text-[#3C2F2B] hover:text-white hover:shadow-xl transition-all duration-300 group font-serif text-base px-10 py-3 rounded-none"
                                >
                                    Become a Member <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                            <Link to="/contact">
                                <Button
                                    variant="outline"
                                    size="xl"
                                    className="border-[#C9A96E]/40 text-[#FDFBF7] hover:bg-[#C9A96E]/10 font-serif text-base px-10 py-3 rounded-none"
                                >
                                    Contact Us
                                </Button>
                            </Link>
                            <Link to="/corporate">
                                <Button
                                    variant="outline"
                                    size="xl"
                                    className="border-[#C9A96E]/40 text-[#FDFBF7] hover:bg-[#C9A96E]/10 font-serif text-base px-10 py-3 rounded-none"
                                >
                                    Corporate Programs
                                </Button>
                            </Link>
                        </div>

                        <div className="flex flex-wrap gap-6 justify-center text-sm font-serif text-[#D4A574]">
                            <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-[#C9A96E]" /> New Delhi, India</span>
                            <span className="flex items-center gap-2"><Mail className="w-4 h-4 text-[#C9A96E]" /> hello@adyomfoundation.org</span>
                            <span className="flex items-center gap-2"><Phone className="w-4 h-4 text-[#C9A96E]" /> +91 XXX-XXX-XXXX</span>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ============ CUSTOM STYLES ============ */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&display=swap');

                * {
                    font-family: 'Playfair Display', 'Georgia', serif;
                }

                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes spin-slower {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(-360deg); }
                }
                .animate-spin-slow {
                    animation: spin-slow 20s linear infinite;
                }
                .animate-spin-slower {
                    animation: spin-slower 30s linear infinite;
                }

                /* Override any sans-serif defaults */
                .font-serif {
                    font-family: 'Playfair Display', 'Georgia', serif !important;
                }
                
                button, .button, a, p, h1, h2, h3, h4, h5, h6, span, div {
                    font-family: 'Playfair Display', 'Georgia', serif;
                }
            `}</style>
        </div>
    );
}