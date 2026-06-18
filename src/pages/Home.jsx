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
    Loader2,
    Mail,
    Phone,
    Quote,
    Infinity,
    Compass,
    Leaf,
    Crown,
    Gift,
    Shield,
    Zap,
} from 'lucide-react';
import { programAPI, testimonialAPI, galleryAPI } from '@/api';

// Animation variants
const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
};

const fadeInLeft = {
    initial: { opacity: 0, x: -50 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.7 },
};

const fadeInRight = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.7 },
};

const fadeInScale = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.5 },
};

const staggerContainer = {
    animate: {
        transition: { staggerChildren: 0.1 },
    },
};

// Program categories
const programHighlights = [
    {
        icon: Eye,
        title: 'Drishti',
        subtitle: 'The Vision',
        desc: 'Visual arts, painting, & contemporary expression rooted in heritage',
        gradient: 'from-rose-400 to-rose-600',
    },
    {
        icon: Lightbulb,
        title: 'Chaitanya',
        subtitle: 'The Awakening',
        desc: 'Mindfulness, meditation, & inner transformation practices',
        gradient: 'from-amber-400 to-amber-600',
    },
    {
        icon: Palette,
        title: 'Kala-Path',
        subtitle: 'The Art Journey',
        desc: 'Structured art courses from basics to mastery',
        gradient: 'from-emerald-400 to-emerald-600',
    },
    {
        icon: HandHeart,
        title: 'Sparsh',
        subtitle: 'The Touch',
        desc: 'Hands-on craft workshops in pottery, weaving, & folk art',
        gradient: 'from-sky-400 to-sky-600',
    },
    {
        icon: Camera,
        title: 'Pratibimb',
        subtitle: 'The Reflection',
        desc: 'Photography & visual storytelling through cultural lens',
        gradient: 'from-purple-400 to-purple-600',
    },
    {
        icon: Music,
        title: 'Kala-Vritti',
        subtitle: 'The Art Living',
        desc: 'Career support for emerging artists & creatives',
        gradient: 'from-indigo-400 to-indigo-600',
    },
];

// Why Join reasons
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

// Community impact stats
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
            image: 'from-heritage-terracotta to-heritage-gold',
            desc: 'Master traditional Indian painting techniques — from Madhubani to miniature art.',
        },
        {
            title: 'Mindful Meditation Retreat',
            category: 'Chaitanya',
            level: 'All Levels',
            duration: '8 Weeks',
            image: 'from-heritage-gold to-heritage-terracottaLight',
            desc: 'Deep meditation practices rooted in ancient wisdom, adapted for modern life.',
        },
        {
            title: 'Pottery & Terracotta Workshop',
            category: 'Sparsh',
            level: 'Beginner',
            duration: '4 Weeks',
            image: 'from-heritage-brownLight to-heritage-brown',
            desc: 'Hands-on pottery workshop exploring India\'s rich terracotta traditions.',
        },
    ];

    const fallbackGalleryItems = [
        { gradient: 'from-heritage-terracotta to-heritage-terracottaLight', Icon: Palette },
        { gradient: 'from-heritage-gold to-heritage-goldLight', Icon: Brush },
        { gradient: 'from-heritage-brown to-heritage-brownLight', Icon: Camera },
        { gradient: 'from-heritage-sand to-heritage-creamDark', Icon: Music },
        { gradient: 'from-heritage-terracottaLight to-heritage-gold', Icon: TreePine },
        { gradient: 'from-heritage-goldDark to-heritage-terracotta', Icon: Sparkles },
        { gradient: 'from-heritage-brownLight to-heritage-sand', Icon: Eye },
        { gradient: 'from-heritage-creamDark to-heritage-terracottaLight', Icon: HandHeart },
    ];

    const [testimonials, setTestimonials] = useState(fallbackTestimonials);
    const [featuredPrograms, setFeaturedPrograms] = useState(fallbackFeaturedPrograms);
    const [galleryItems, setGalleryItems] = useState(fallbackGalleryItems);
    const [loading, setLoading] = useState({ testimonials: false, programs: false, gallery: false });

    useEffect(() => {
        const fetchHomeData = async () => {
            // Fetch testimonials
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

            // Fetch featured programs
            try {
                const res = await programAPI.getFeatured();
                if (res.data?.data?.length > 0) {
                    setFeaturedPrograms(res.data.data.map(p => ({
                        title: p.title,
                        category: p.category || 'General',
                        level: p.level || 'All Levels',
                        duration: p.duration || '8 Weeks',
                        image: p.image ? '' : 'from-heritage-terracotta to-heritage-gold',
                        desc: p.description || p.shortDesc || '',
                        slug: p.slug || p._id,
                        imageUrl: p.image || null,
                    })));
                }
            } catch (err) {
                try {
                    const res = await programAPI.getAll({ status: 'published', limit: 3 });
                    if (res.data?.data?.length > 0) {
                        setFeaturedPrograms(res.data.data.map(p => ({
                            title: p.title,
                            category: p.category || 'General',
                            level: p.level || 'All Levels',
                            duration: p.duration || '8 Weeks',
                            image: p.image ? '' : 'from-heritage-terracotta to-heritage-gold',
                            desc: p.description || p.shortDesc || '',
                            slug: p.slug || p._id,
                            imageUrl: p.image || null,
                        })));
                    }
                } catch (err2) {
                    console.log('Using fallback programs');
                }
            }

            // Fetch gallery preview
            try {
                const res = await galleryAPI.getAll({ status: 'published', limit: 8 });
                if (res.data?.data?.length > 0) {
                    setGalleryItems(res.data.data.map(item => ({
                        gradient: item.image ? '' : 'from-heritage-terracotta to-heritage-terracottaLight',
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
        <div className="min-h-screen bg-gradient-to-b from-heritage-creamLight via-white to-heritage-creamLight/50 overflow-hidden">
            
            {/* ============ HERO SECTION ============ */}
            <section className="relative min-h-[90vh] overflow-hidden flex items-center">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                    <img src="/images/hero_artisan.png" alt="Artisan drawing intricate Indian mandala patterns" className="w-full h-full object-cover object-center" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
                    
                    {/* Animated decorative elements */}
                    <motion.div 
                        className="absolute top-20 left-20 text-6xl opacity-20 text-heritage-goldLight"
                        animate={{ y: [0, -20, 0] }}
                        transition={{ duration: 4, repeat: Infinity }}
                    >
                        ✦
                    </motion.div>
                    <motion.div 
                        className="absolute bottom-20 right-20 text-8xl opacity-10 text-heritage-goldLight"
                        animate={{ y: [0, 20, 0] }}
                        transition={{ duration: 5, repeat: Infinity }}
                    >
                        ✧
                    </motion.div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
                    <div className="max-w-2xl pt-12 md:pt-0">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="space-y-8"
                        >
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.5 }}
                                className="inline-block"
                            >
                                <Badge className="text-sm px-6 py-2 bg-heritage-gold/20 border-heritage-gold/40 text-heritage-goldLight backdrop-blur-sm">
                                    <Sparkles className="w-3 h-3 mr-2 inline" />
                                    Canvas of Heritage — Where Tradition Meets Transformation
                                    <Sparkles className="w-3 h-3 ml-2 inline" />
                                </Badge>
                            </motion.div>

                            <motion.h1 
                                className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white leading-tight drop-shadow-lg"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                Rediscover
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-heritage-gold to-amber-300"> India's </span>
                                Timeless Heritage
                            </motion.h1>

                            <motion.p 
                                className="text-lg md:text-xl font-light text-heritage-goldLight/90 leading-relaxed"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                Art, mindfulness, culture & community — a living canvas where heritage
                                breathes, creativity awakens, and souls find their roots.
                            </motion.p>

                            <motion.div 
                                className="flex flex-wrap gap-4"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                <Link to="/programs">
                                    <Button size="xl" className="bg-gradient-to-r from-heritage-gold to-amber-400 text-heritage-brown hover:shadow-xl transition-all duration-300 group font-medium">
                                        Explore Programs
                                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                                <Link to="/register">
                                    <Button variant="outline" size="xl" className="border-heritage-gold/50 text-heritage-goldLight hover:bg-heritage-gold/10 font-light">
                                        Become a Member
                                    </Button>
                                </Link>
                            </motion.div>

                            <motion.div 
                                className="flex flex-wrap items-center gap-4 text-sm font-light text-heritage-goldLight/70"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                            >
                                <span className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                                    <Star className="w-4 h-4 text-heritage-gold" /> 5,000+ Members
                                </span>
                                <span className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                                    <BookOpen className="w-4 h-4 text-heritage-gold" /> 200+ Programs
                                </span>
                                <span className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                                    <Palette className="w-4 h-4 text-heritage-gold" /> Heritage Revival
                                </span>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>

                {/* Bottom wave */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 120" className="w-full h-auto" preserveAspectRatio="none">
                        <path fill="#FAF5EE" d="M0,60 C480,120 960,0 1440,60 L1440,120 L0,120 Z" />
                    </svg>
                </div>
            </section>

            {/* ============ WHAT YOU'LL LEARN ============ */}
            <section className="py-20 md:py-28">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div {...fadeInUp} className="text-center mb-16">
                        <Badge variant="outlineGold" className="mb-4 text-sm px-4 py-1.5 border-heritage-gold/50 font-light">
                            ✦ Our Programs
                        </Badge>
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-heritage-brown">
                            What You'll Learn at <span className="text-transparent bg-clip-text bg-gradient-to-r from-heritage-gold to-amber-400">Adyom</span>
                        </h2>
                        <p className="mt-4 text-lg font-light text-heritage-brownLight max-w-2xl mx-auto">
                            Six streams of heritage learning — each a path to rediscovery, mastery, and inner transformation
                        </p>
                        <Separator className="w-24 mx-auto mt-4 bg-gradient-to-r from-heritage-gold to-transparent" />
                    </motion.div>

                    <motion.div
                        variants={staggerContainer}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {programHighlights.map((item, i) => (
                            <motion.div key={i} variants={fadeInUp}>
                                <Card className="group hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-2 border-heritage-gold/10 bg-white overflow-hidden relative">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-heritage-gold/5 to-transparent rounded-full -mr-12 -mt-12" />
                                    <CardContent className="p-6 space-y-4">
                                        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                                            <item.icon className="w-7 h-7" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-serif font-bold text-heritage-brown">{item.title}</h3>
                                            <p className="text-sm font-light text-heritage-brownLight italic">{item.subtitle}</p>
                                        </div>
                                        <p className="text-sm font-light text-heritage-brownLight leading-relaxed">{item.desc}</p>
                                        <Link to={`/programs?category=${item.title.toLowerCase()}`}>
                                            <Button variant="ghost" size="sm" className="text-heritage-gold hover:text-heritage-goldDark p-0 font-light">
                                                Learn More <ArrowRight className="ml-1 w-4 h-4" />
                                            </Button>
                                        </Link>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ============ WHY JOIN ============ */}
            <section className="py-20 md:py-28 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-heritage-terracotta via-heritage-terracottaDark to-heritage-brown">
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-20 left-20 w-64 h-64 border-4 border-heritage-gold/30 rounded-full animate-spin-slow" />
                        <div className="absolute bottom-20 right-20 w-80 h-80 border-4 border-heritage-gold/20 rounded-full animate-spin-slower" />
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.div {...fadeInUp} className="text-center mb-16">
                        <Badge className="mb-4 text-sm px-6 py-2 bg-heritage-gold text-heritage-brown border-none shadow-lg font-light">
                            <Sparkles className="w-3 h-3 mr-2 inline" />
                            Why Adyom?
                            <Sparkles className="w-3 h-3 ml-2 inline" />
                        </Badge>
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-white">
                            Why Join the Adyom Community?
                        </h2>
                        <p className="mt-4 text-lg font-light text-heritage-goldLight/90 max-w-2xl mx-auto">
                            More than a platform — a movement to preserve, practice, and prosper through heritage
                        </p>
                        <Separator className="w-24 mx-auto mt-4 bg-heritage-gold/50" />
                    </motion.div>

                    <motion.div
                        variants={staggerContainer}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {whyJoinReasons.map((item, i) => (
                            <motion.div key={i} variants={fadeInUp}>
                                <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 space-y-4 hover:bg-white transition-colors duration-300 border border-white/20 shadow-lg hover:shadow-2xl group">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-heritage-gold/20 to-heritage-gold/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                        <item.icon className="w-6 h-6 text-heritage-gold" />
                                    </div>
                                    <h3 className="text-xl font-serif font-semibold text-heritage-brown">{item.title}</h3>
                                    <p className="text-sm font-light text-heritage-brownLight leading-relaxed">{item.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>

                    <motion.div {...fadeInUp} className="text-center mt-12">
                        <Link to="/register">
                            <Button size="xl" className="bg-gradient-to-r from-heritage-gold to-amber-400 text-heritage-brown hover:shadow-xl transition-all duration-300 group font-medium">
                                Join the Movement <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                    </motion.div>
                </div>

                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 80" className="w-full h-auto" preserveAspectRatio="none">
                        <path fill="#FAF5EE" d="M0,40 C480,80 960,0 1440,40 L1440,80 L0,80 Z" />
                    </svg>
                </div>
            </section>

            {/* ============ FEATURED PROGRAMS ============ */}
            <section className="py-20 md:py-28">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div {...fadeInUp} className="text-center mb-16">
                        <Badge variant="outlineGold" className="mb-4 text-sm px-4 py-1.5 border-heritage-gold/50 font-light">
                            ✦ Featured Programs
                        </Badge>
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-heritage-brown">
                            Begin Your Heritage Journey
                        </h2>
                        <p className="mt-4 text-lg font-light text-heritage-brownLight max-w-2xl mx-auto">
                            Curated programs that blend tradition with transformation
                        </p>
                        <Separator className="w-24 mx-auto mt-4 bg-gradient-to-r from-heritage-gold to-transparent" />
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {featuredPrograms.map((program, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.15 }}
                            >
                                <Card className="group hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-heritage-gold/10">
                                    <div className={`h-48 ${program.imageUrl ? '' : 'bg-gradient-to-br ' + program.image} flex items-center justify-center relative overflow-hidden`}>
                                        {program.imageUrl ? (
                                            <img src={program.imageUrl} alt={program.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        ) : (
                                            <div className="text-center">
                                                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-3">
                                                    <Palette className="w-8 h-8 text-white" />
                                                </div>
                                                <Badge className="bg-white/20 backdrop-blur-sm text-white border-none font-light">{program.category}</Badge>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    </div>
                                    <CardContent className="p-6 space-y-3">
                                        <h3 className="text-lg font-serif font-semibold text-heritage-brown group-hover:text-heritage-terracotta transition-colors">
                                            {program.title}
                                        </h3>
                                        <p className="text-sm font-light text-heritage-brownLight">{program.desc}</p>
                                        <div className="flex items-center gap-3 text-xs font-light text-heritage-brownLight">
                                            <Badge variant="secondary" className="bg-heritage-gold/10 text-heritage-brown font-light">{program.level}</Badge>
                                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {program.duration}</span>
                                        </div>
                                        <Link to={`/programs/${program.slug || program._id || ''}`}>
                                            <Button variant="outline" size="sm" className="w-full mt-2 border-heritage-gold/30 text-heritage-brown hover:bg-heritage-gold hover:text-white transition-all duration-300 font-light">
                                                View Program <ArrowRight className="ml-1 w-4 h-4" />
                                            </Button>
                                        </Link>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                    <div className="text-center mt-10">
                        <Link to="/programs">
                            <Button variant="outline" size="lg" className="border-heritage-gold/50 text-heritage-brown hover:bg-heritage-gold hover:text-white transition-all duration-300 font-light">
                                View All Programs <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* ============ ARTISAN CONNECT ============ */}
            <section className="py-20 md:py-28 bg-gradient-to-b from-heritage-creamLight to-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <motion.div {...fadeInLeft} className="space-y-6">
                            <div>
                                <Badge variant="outlineGold" className="mb-3 text-sm px-4 py-1.5 border-heritage-gold/50 font-light">
                                    ✦ Artisan Connect
                                </Badge>
                                <h2 className="text-3xl md:text-4xl font-serif font-bold text-heritage-brown">
                                    Empowering India's <span className="text-transparent bg-clip-text bg-gradient-to-r from-heritage-gold to-amber-400">Artisans</span>
                                </h2>
                            </div>
                            
                            <motion.div 
                                className="bg-gradient-to-r from-heritage-gold/10 to-heritage-terracotta/10 p-6 rounded-2xl border-l-4 border-heritage-gold"
                                whileHover={{ scale: 1.02 }}
                            >
                                <p className="font-serif text-lg text-heritage-brown italic font-light">"Every hand that crafts tells a story of heritage"</p>
                            </motion.div>
                            
                            <Separator className="w-20 bg-heritage-gold/50" />
                            
                            <p className="font-light text-heritage-brownLight leading-relaxed">
                                Artisan Connect is our initiative to support, promote, and preserve the work of traditional
                                Indian artisans. We provide platforms for visibility, tools for modern expression, and a
                                community that values handmade craft.
                            </p>
                            
                            <ul className="space-y-3 font-light text-heritage-brownLight">
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
                                        <div className="w-5 h-5 rounded-full bg-heritage-gold/20 flex items-center justify-center mt-0.5 flex-shrink-0">
                                            <Star className="w-3 h-3 text-heritage-gold" />
                                        </div>
                                        <span>{item}</span>
                                    </motion.li>
                                ))}
                            </ul>
                            
                            <Link to="/artisan-connect">
                                <Button className="bg-gradient-to-r from-heritage-gold to-amber-400 text-heritage-brown hover:shadow-xl transition-all duration-300 group font-medium">
                                    Meet Our Artisans <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                        </motion.div>

                        <motion.div {...fadeInRight} className="relative">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-4">
                                    {[
                                        { gradient: 'from-heritage-terracotta to-heritage-terracottaLight', icon: Palette },
                                        { gradient: 'from-heritage-gold to-heritage-goldLight', icon: HandHeart },
                                    ].map((item, i) => (
                                        <motion.div 
                                            key={i}
                                            className={`h-48 rounded-2xl overflow-hidden shadow-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center`}
                                            whileHover={{ scale: 1.03 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <item.icon className="w-16 h-16 text-white/60" />
                                        </motion.div>
                                    ))}
                                </div>
                                <div className="space-y-4 mt-8">
                                    {[
                                        { gradient: 'from-heritage-brown to-heritage-brownLight', icon: Users },
                                        { gradient: 'from-heritage-sand to-heritage-creamDark', icon: Globe },
                                    ].map((item, i) => (
                                        <motion.div 
                                            key={i}
                                            className={`h-48 rounded-2xl overflow-hidden shadow-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center`}
                                            whileHover={{ scale: 1.03 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <item.icon className="w-16 h-16 text-white/60" />
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ============ COMMUNITY IMPACT ============ */}
            <section className="py-20 md:py-28 bg-gradient-to-br from-heritage-terracotta via-heritage-terracottaDark to-heritage-brown relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 left-20 w-64 h-64 border-4 border-heritage-gold/30 rounded-full animate-spin-slow" />
                    <div className="absolute bottom-20 right-20 w-80 h-80 border-4 border-heritage-gold/20 rounded-full animate-spin-slower" />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.div {...fadeInUp} className="text-center mb-12">
                        <Badge className="mb-4 text-sm px-6 py-2 bg-heritage-gold text-heritage-brown border-none shadow-lg font-light">
                            <Sparkles className="w-3 h-3 mr-2 inline" />
                            Community Impact
                            <Sparkles className="w-3 h-3 ml-2 inline" />
                        </Badge>
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-white">
                            Our Growing Heritage Community
                        </h2>
                    </motion.div>

                    <motion.div 
                        className="grid md:grid-cols-4 gap-8"
                        variants={staggerContainer}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                    >
                        {impactStats.map((stat, i) => (
                            <motion.div
                                key={i}
                                variants={fadeInScale}
                                className="text-center space-y-3 bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/20 transition-all duration-300"
                            >
                                <div className="w-16 h-16 mx-auto rounded-full bg-heritage-gold/20 flex items-center justify-center">
                                    <stat.icon className="w-8 h-8 text-heritage-gold" />
                                </div>
                                <p className="text-3xl md:text-4xl font-serif font-bold text-white">
                                    {stat.number}
                                </p>
                                <p className="text-sm font-light text-heritage-goldLight/80">{stat.label}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>

                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 80" className="w-full h-auto" preserveAspectRatio="none">
                        <path fill="#FAF5EE" d="M0,40 C480,80 960,0 1440,40 L1440,80 L0,80 Z" />
                    </svg>
                </div>
            </section>

            {/* ============ GALLERY PREVIEW ============ */}
            <section className="py-20 md:py-28">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div {...fadeInUp} className="text-center mb-16">
                        <Badge variant="outlineGold" className="mb-4 text-sm px-4 py-1.5 border-heritage-gold/50 font-light">
                            ✦ Heritage Gallery
                        </Badge>
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-heritage-brown">
                            A Canvas of Heritage
                        </h2>
                        <p className="mt-4 text-lg font-light text-heritage-brownLight max-w-2xl mx-auto">
                            Where art, craft, and culture come alive
                        </p>
                        <Separator className="w-24 mx-auto mt-4 bg-gradient-to-r from-heritage-gold to-transparent" />
                    </motion.div>

                    <motion.div 
                        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                        variants={staggerContainer}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                    >
                        {galleryItems.map((item, i) => (
                            <motion.div
                                key={i}
                                variants={fadeInScale}
                                className={`group relative h-48 md:h-56 rounded-2xl ${item.imageUrl ? '' : 'bg-gradient-to-br ' + item.gradient} overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300`}
                            >
                                {item.imageUrl ? (
                                    <img src={item.imageUrl} alt={item.title || 'Gallery item'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center opacity-60 group-hover:opacity-100 transition-opacity">
                                        {item.Icon && <item.Icon className="w-12 h-12 text-white group-hover:scale-110 transition-transform duration-300" />}
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </motion.div>
                        ))}
                    </motion.div>

                    <div className="text-center mt-10">
                        <Link to="/gallery">
                            <Button variant="outline" size="lg" className="border-heritage-gold/50 text-heritage-brown hover:bg-heritage-gold hover:text-white transition-all duration-300 font-light">
                                Explore Gallery <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* ============ TESTIMONIALS ============ */}
            <section className="py-20 md:py-28 bg-gradient-to-b from-heritage-creamLight to-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div {...fadeInUp} className="text-center mb-16">
                        <Badge variant="outlineGold" className="mb-4 text-sm px-4 py-1.5 border-heritage-gold/50 font-light">
                            ✦ Voices of Heritage
                        </Badge>
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-heritage-brown">
                            What Our Community Says
                        </h2>
                        <Separator className="w-24 mx-auto mt-4 bg-gradient-to-r from-heritage-gold to-transparent" />
                    </motion.div>

                    <div className="max-w-3xl mx-auto">
                        <Card className="p-8 md:p-10 border-2 border-heritage-gold/20 shadow-xl hover:shadow-2xl transition-all duration-300 bg-white relative overflow-hidden">
                            <div className="absolute top-4 right-4 text-heritage-gold/20 text-6xl font-serif">❋</div>

                            <motion.div
                                key={currentTestimonial}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-heritage-gold to-amber-400 flex items-center justify-center text-white font-serif text-xl font-bold shadow-lg">
                                        {testimonials[currentTestimonial].avatar}
                                    </div>
                                    <div>
                                        <h4 className="font-serif font-semibold text-heritage-brown text-lg">
                                            {testimonials[currentTestimonial].name}
                                        </h4>
                                        <p className="text-sm font-light text-heritage-brownLight">
                                            {testimonials[currentTestimonial].role}
                                        </p>
                                    </div>
                                </div>

                                <p className="text-lg font-light text-heritage-brownLight italic leading-relaxed">
                                    "{testimonials[currentTestimonial].content}"
                                </p>

                                <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, s) => (
                                        <Star key={s} className="w-5 h-5 text-heritage-gold fill-heritage-gold" />
                                    ))}
                                </div>
                            </motion.div>

                            <div className="flex items-center justify-between mt-8">
                                <button
                                    onClick={() => setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
                                    className="w-10 h-10 rounded-full bg-heritage-gold/10 hover:bg-heritage-gold text-heritage-brown hover:text-white flex items-center justify-center transition-all duration-300"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <div className="flex gap-2">
                                    {testimonials.map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setCurrentTestimonial(i)}
                                            className={`w-3 h-3 rounded-full transition-all duration-300 ${i === currentTestimonial ? 'bg-heritage-gold w-6' : 'bg-heritage-gold/30'}`}
                                        />
                                    ))}
                                </div>
                                <button
                                    onClick={() => setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)}
                                    className="w-10 h-10 rounded-full bg-heritage-gold/10 hover:bg-heritage-gold text-heritage-brown hover:text-white flex items-center justify-center transition-all duration-300"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </Card>
                    </div>
                </div>
            </section>

            {/* ============ CTA SECTION ============ */}
            <section className="py-16 md:py-20 bg-gradient-to-r from-heritage-brown to-heritage-terracottaDark relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-96 h-96 border-4 border-heritage-gold/30 rounded-full -mr-48 -mt-48" />
                    <div className="absolute bottom-0 left-0 w-96 h-96 border-4 border-heritage-gold/20 rounded-full -ml-48 -mb-48" />
                </div>
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.div {...fadeInUp} className="text-center max-w-3xl mx-auto space-y-8">
                        <Badge className="px-6 py-2.5 bg-heritage-gold text-heritage-brown border-none shadow-lg font-light">
                            <Sparkles className="w-3 h-3 mr-2 inline" />
                            Start Your Journey
                            <Sparkles className="w-3 h-3 ml-2 inline" />
                        </Badge>
                        
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-heritage-cream">
                            Ready to Rediscover Heritage?
                        </h2>
                        
                        <p className="text-lg font-light text-heritage-goldLight/90 leading-relaxed">
                            Whether you seek mindful creativity, heritage art, or community connection —
                            Adyom Foundation is your canvas. Let's begin.
                        </p>
                        
                        <div className="flex flex-wrap gap-4 justify-center">
                            <Link to="/register">
                                <Button size="xl" className="bg-gradient-to-r from-heritage-gold to-amber-400 text-heritage-brown hover:shadow-xl transition-all duration-300 group font-medium">
                                    Become a Member <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                            <Link to="/contact">
                                <Button variant="outline" size="xl" className="border-heritage-gold/50 text-heritage-goldLight hover:bg-heritage-gold/10 font-light">
                                    Contact Us
                                </Button>
                            </Link>
                            <Link to="/corporate">
                                <Button variant="outline" size="xl" className="border-heritage-gold/50 text-heritage-goldLight hover:bg-heritage-gold/10 font-light">
                                    Corporate Programs
                                </Button>
                            </Link>
                        </div>
                        
                        <div className="flex flex-wrap gap-6 justify-center text-sm font-light text-heritage-goldLight/70">
                            <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-heritage-gold" /> New Delhi, India</span>
                            <span className="flex items-center gap-2"><Mail className="w-4 h-4 text-heritage-gold" /> hello@adyomfoundation.org</span>
                            <span className="flex items-center gap-2"><Phone className="w-4 h-4 text-heritage-gold" /> +91 XXX-XXX-XXXX</span>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Custom CSS for animations */}
            <style jsx>{`
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
            `}</style>
        </div>
    );
}