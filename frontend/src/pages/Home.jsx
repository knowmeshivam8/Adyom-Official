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
} from 'lucide-react';
import { programAPI, testimonialAPI, galleryAPI } from '@/api';

const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
};

const staggerContainer = {
    animate: {
        transition: { staggerChildren: 0.1 },
    },
};

// Program categories for "What You'll Learn"
const programHighlights = [
    {
        icon: Eye,
        title: 'Drishti',
        subtitle: 'The Vision',
        desc: 'Visual arts, painting, & contemporary expression rooted in heritage',
        color: 'bg-heritage-terracotta',
    },
    {
        icon: Lightbulb,
        title: 'Chaitanya',
        subtitle: 'The Awakening',
        desc: 'Mindfulness, meditation, & inner transformation practices',
        color: 'bg-text-main',
    },
    {
        icon: Palette,
        title: 'Kala-Path',
        subtitle: 'The Art Journey',
        desc: 'Structured art courses from basics to mastery',
        color: 'bg-heritage-terracottaLight',
    },
    {
        icon: HandHeart,
        title: 'Sparsh',
        subtitle: 'The Touch',
        desc: 'Hands-on craft workshops in pottery, weaving, & folk art',
        color: 'bg-heritage-brown',
    },
    {
        icon: Camera,
        title: 'Pratibimb',
        subtitle: 'The Reflection',
        desc: 'Photography & visual storytelling through cultural lens',
        color: 'bg-heritage-brownLight',
    },
    {
        icon: Music,
        title: 'Kala-Vritti',
        subtitle: 'The Art Living',
        desc: 'Career support for emerging artists & creatives',
        color: 'bg-heritage-sand',
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
                // Try getAll as fallback
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
        <div className="overflow-hidden">
            {/* ============ HERO SECTION ============ */}
            <section className="relative min-h-[90vh] overflow-hidden flex items-center">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <img src="/images/hero_artisan.png" alt="Artisan drawing intricate Indian mandala patterns" className="w-full h-full object-cover object-center" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
                </div>

                {/* Background pattern overlay */}
                <div className="absolute inset-0 opacity-10">
                    <div className="mandala-bg absolute inset-0" />
                </div>

                {/* Decorative corner elements */}
                <div className="absolute top-0 left-0 w-32 h-32 opacity-20">
                    <svg viewBox="0 0 100 100" className="w-full h-full text-text-main">
                        <path d="M0,0 Q50,50 0,100" fill="none" stroke="currentColor" strokeWidth="2" />
                        <path d="M0,0 Q50,50 100,0" fill="none" stroke="currentColor" strokeWidth="2" />
                        <circle cx="20" cy="20" r="5" fill="currentColor" />
                    </svg>
                </div>
                <div className="absolute bottom-0 right-0 w-32 h-32 opacity-20 rotate-180">
                    <svg viewBox="0 0 100 100" className="w-full h-full text-text-main">
                        <path d="M0,0 Q50,50 0,100" fill="none" stroke="currentColor" strokeWidth="2" />
                        <path d="M0,0 Q50,50 100,0" fill="none" stroke="currentColor" strokeWidth="2" />
                        <circle cx="20" cy="20" r="5" fill="currentColor" />
                    </svg>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
                    <div className="max-w-2xl pt-12 md:pt-0">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="space-y-8"
                        >
                            <Badge variant="gold" className="text-sm px-4 py-1 backdrop-blur-sm bg-heritage-terracotta/40 border-heritage-gold/30 text-yellow-400">
                                ✦ Canvas of Heritage — Where Tradition Meets Transformation
                            </Badge>

                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white leading-tight drop-shadow-md">
                                Rediscover
                                <span className="text-text-main"> India's </span>
                                Timeless Heritage
                            </h1>

                            <p className="text-lg md:text-xl font-accent text-gray-200 leading-relaxed">
                                Art, mindfulness, culture & community — a living canvas where heritage
                                breathes, creativity awakens, and souls find their roots.
                            </p>

                            <div className="flex flex-wrap gap-4">
                                <Link to="/programs">
                                    <Button size="xl" className="bg-text-main text-heritage-terracotta hover:bg-text-main/90">
                                        Explore Programs
                                        <ArrowRight className="ml-2 w-5 h-5" />
                                    </Button>
                                </Link>
                                <Link to="/register">
                                    <Button variant="outline" size="xl" className="border-text-main text-text-main hover:bg-text-main/10">
                                        Become a Member
                                    </Button>
                                </Link>
                            </div>

                            <div className="flex items-center gap-6 text-sm font-body text-gray-300">
                                <span className="flex items-center gap-1">
                                    <Star className="w-4 h-4 text-text-main" /> 5,000+ Members
                                </span>
                                <span className="flex items-center gap-1">
                                    <BookOpen className="w-4 h-4 text-text-main" /> 200+ Programs
                                </span>
                                <span className="flex items-center gap-1">
                                    <Palette className="w-4 h-4 text-text-main" /> Heritage Revival
                                </span>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Bottom wave */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 120" className="w-full h-auto">
                        <path
                            fill="#F4E8D8"
                            d="M0,60 C360,120 720,0 1080,60 C1260,90 1380,70 1440,60 L1440,120 L0,120 Z"
                        />
                    </svg>
                </div>
            </section>

            {/* ============ WHAT YOU'LL LEARN ============ */}
            <section className="py-16 md:py-24 bg-heritage-creamLight">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div {...fadeInUp} className="text-center mb-12">
                        <Badge variant="outlineGold" className="mb-4">✦ Our Programs</Badge>
                        <h2 className="text-3xl md:text-4xl font-heading font-bold text-heritage-terracottaDark">
                            What You'll Learn at Adyom
                        </h2>
                        <p className="mt-4 text-lg font-accent text-text-main max-w-2xl mx-auto italic">
                            Six streams of heritage learning — each a path to rediscovery, mastery, and inner transformation
                        </p>
                        <Separator className="w-24 mx-auto mt-6" />
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
                                <Card className="group hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border-heritage-creamDark/50">
                                    <CardContent className="p-6 space-y-4">
                                        <div className={`${item.color} w-14 h-14 rounded-lg flex items-center justify-center text-text-main group-hover:scale-110 transition-transform`}>
                                            <item.icon className="w-7 h-7" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-heading font-semibold text-heritage-terracottaDark">
                                                {item.title}
                                            </h3>
                                            <p className="text-sm font-accent text-text-main italic">{item.subtitle}</p>
                                        </div>
                                        <p className="text-sm font-body text-text-main leading-relaxed">
                                            {item.desc}
                                        </p>
                                        <Link to={`/programs?category=${item.title.toLowerCase()}`}>
                                            <Button variant="ghost" size="sm" className="text-text-main hover:text-heritage-terracottaDark">
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
            <section className="py-16 md:py-24 bg-heritage-terracotta relative overflow-hidden">
                <div className="absolute inset-0 opacity-5 mandala-bg" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.div {...fadeInUp} className="text-center mb-12">
                        <Badge className="mb-4 bg-text-main text-heritage-terracotta border-transparent">✦ Why Adyom?</Badge>
                        <h2 className="text-3xl md:text-4xl font-heading font-bold text-text-main">
                            Why Join the Adyom Community?
                        </h2>
                        <p className="mt-4 text-lg font-accent text-text-main max-w-2xl mx-auto italic">
                            More than a platform — a movement to preserve, practice, and prosper through heritage
                        </p>
                        <Separator className="w-24 mx-auto mt-6 bg-text-main" />
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
                                <div className="bg-white rounded-lg p-6 space-y-4 hover:bg-white/90 transition-colors duration-300 border border-text-main/10">
                                    <div className="w-12 h-12 rounded-full bg-text-main/20 flex items-center justify-center text-text-main">
                                        <item.icon className="w-6 h-6 text-text-main" />
                                    </div>
                                    <h3 className="text-xl font-heading font-semibold text-text-main">
                                        {item.title}
                                    </h3>
                                    <p className="text-sm font-body text-text-main leading-relaxed">
                                        {item.desc}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>

                    <motion.div {...fadeInUp} className="text-center mt-12">
                        <Link to="/register">
                            <Button size="xl" className="bg-text-main text-heritage-terracotta hover:bg-text-main/90">
                                Join the Movement <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* ============ FEATURED PROGRAMS ============ */}
            <section className="py-16 md:py-24 bg-heritage-creamLight">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div {...fadeInUp} className="text-center mb-12">
                        <Badge variant="outlineGold" className="mb-4">✦ Featured Programs</Badge>
                        <h2 className="text-3xl md:text-4xl font-heading font-bold text-heritage-terracottaDark">
                            Begin Your Heritage Journey
                        </h2>
                        <p className="mt-4 text-lg font-accent text-text-main max-w-2xl mx-auto italic">
                            Curated programs that blend tradition with transformation
                        </p>
                        <Separator className="w-24 mx-auto mt-6" />
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
                                <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
                                    <div className={`h-48 ${program.imageUrl ? '' : 'bg-gradient-to-br ' + program.image} flex items-center justify-center`}>
                                        {program.imageUrl ? (
                                            <img src={program.imageUrl} alt={program.title} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="text-center">
                                                <Palette className="w-12 h-12 text-text-main mb-2" />
                                                <Badge variant="gold" className="text-xs">{program.category}</Badge>
                                            </div>
                                        )}
                                    </div>
                                    <CardContent className="p-6 space-y-3">
                                        <h3 className="text-lg font-heading font-semibold text-heritage-terracottaDark group-hover:text-heritage-terracottaDark transition-colors">
                                            {program.title}
                                        </h3>
                                        <p className="text-sm font-body text-text-main">{program.desc}</p>
                                        <div className="flex items-center gap-3 text-xs font-body text-text-main">
                                            <Badge variant="secondary">{program.level}</Badge>
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3" /> {program.duration}
                                            </span>
                                        </div>
                                        <Link to={`/programs/${program.slug || program._id || ''}`}>
                                            <Button variant="outline" size="sm" className="w-full mt-2">
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
                            <Button variant="outline" size="lg">
                                View All Programs <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* ============ ARTISAN CONNECT ============ */}
            <section className="py-16 md:py-24 bg-gradient-to-b from-heritage-creamLight to-heritage-cream">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="space-y-6"
                        >
                            <Badge variant="outlineGold" className="mb-2">✦ Artisan Connect</Badge>
                            <h2 className="text-3xl md:text-4xl font-heading font-bold text-heritage-terracottaDark">
                                Empowering India's Artisans
                            </h2>
                            <p className="font-accent text-lg text-text-main italic">
                                "Every hand that crafts tells a story of heritage"
                            </p>
                            <Separator className="w-16" />
                            <p className="font-body text-text-main leading-relaxed">
                                Artisan Connect is our initiative to support, promote, and preserve the work of traditional
                                Indian artisans. We provide platforms for visibility, tools for modern expression, and a
                                community that values handmade craft.
                            </p>
                            <ul className="space-y-3 font-body text-text-main">
                                <li className="flex items-start gap-2">
                                    <Star className="w-5 h-5 text-text-main mt-0.5" />
                                    <span>Showcase & sell traditional artwork on our gallery</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Star className="w-5 h-5 text-text-main mt-0.5" />
                                    <span>Connect with heritage lovers and collectors worldwide</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Star className="w-5 h-5 text-text-main mt-0.5" />
                                    <span>Access workshops for skill enhancement & modern techniques</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Star className="w-5 h-5 text-text-main mt-0.5" />
                                    <span>Corporate partnerships for sustainable artisan support</span>
                                </li>
                            </ul>
                            <Link to="/artisan-connect">
                                <Button variant="gold" size="lg">
                                    Meet Our Artisans <ArrowRight className="ml-2 w-4 h-4" />
                                </Button>
                            </Link>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="relative"
                        >
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-4">
                                    <div className="h-40 rounded-lg overflow-hidden">
                                        <img src="/images/gallery_gond_art.png" alt="Traditional Gond folk art" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="h-32 rounded-lg overflow-hidden">
                                        <img src="/images/philosophy_mindfulness.png" alt="Mandala dot art" className="w-full h-full object-cover" />
                                    </div>
                                </div>
                                <div className="space-y-4 mt-8">
                                    <div className="h-32 rounded-lg overflow-hidden">
                                        <img src="/images/philosophy_community.png" alt="Community art workshop" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="h-40 rounded-lg overflow-hidden">
                                        <img src="/images/philosophy_culture.png" alt="Rural Indian village at dawn" className="w-full h-full object-cover" />
                                    </div>
                                </div>
                            </div>
                            {/* Decorative corner ornament */}
                            <div className="absolute -top-4 -right-4 w-20 h-20 text-text-main">
                                <svg viewBox="0 0 100 100">
                                    <path d="M0,0 C50,0 100,50 100,100" fill="none" stroke="currentColor" strokeWidth="3" />
                                    <path d="M100,0 C50,0 0,50 0,100" fill="none" stroke="currentColor" strokeWidth="3" />
                                    <circle cx="50" cy="50" r="8" fill="currentColor" />
                                </svg>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ============ COMMUNITY IMPACT ============ */}
            <section className="py-16 md:py-20 bg-heritage-terracotta relative">
                <div className="absolute inset-0 opacity-5 mandala-bg" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.div {...fadeInUp} className="text-center mb-10">
                        <Badge className="mb-4 bg-text-main text-heritage-terracotta border-transparent">✦ Community Impact</Badge>
                        <h2 className="text-3xl font-heading font-bold text-text-main">
                            Our Growing Heritage Community
                        </h2>
                    </motion.div>

                    <div className="grid md:grid-cols-4 gap-8">
                        {impactStats.map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="text-center space-y-3"
                            >
                                <div className="w-16 h-16 mx-auto rounded-full bg-text-main/20 flex items-center justify-center">
                                    <stat.icon className="w-8 h-8 text-text-main" />
                                </div>
                                <p className="text-3xl md:text-4xl font-heading font-bold text-text-main">
                                    {stat.number}
                                </p>
                                <p className="text-sm font-body text-text-main">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============ GALLERY PREVIEW ============ */}
            <section className="py-16 md:py-24 bg-heritage-creamLight">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div {...fadeInUp} className="text-center mb-12">
                        <Badge variant="outlineGold" className="mb-4">✦ Heritage Gallery</Badge>
                        <h2 className="text-3xl md:text-4xl font-heading font-bold text-heritage-terracottaDark">
                            A Canvas of Heritage
                        </h2>
                        <p className="mt-4 text-lg font-accent text-text-main max-w-2xl mx-auto italic">
                            Where art, craft, and culture come alive
                        </p>
                        <Separator className="w-24 mx-auto mt-6" />
                    </motion.div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {galleryItems.map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.05 }}
                                className={`group relative h-48 md:h-56 rounded-lg ${item.imageUrl ? '' : 'bg-gradient-to-br ' + item.gradient} overflow-hidden cursor-pointer`}
                            >
                                {item.imageUrl ? (
                                    <img src={item.imageUrl} alt={item.title || 'Gallery item'} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center opacity-60 group-hover:opacity-100 transition-opacity">
                                        <item.Icon className="w-12 h-12 text-white group-hover:text-white transition-colors" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                            </motion.div>
                        ))}
                    </div>

                    <div className="text-center mt-10">
                        <Link to="/gallery">
                            <Button variant="outline" size="lg">
                                Explore Gallery <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* ============ TESTIMONIALS ============ */}
            <section className="py-16 md:py-24 bg-gradient-to-b from-heritage-cream to-heritage-creamLight">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div {...fadeInUp} className="text-center mb-12">
                        <Badge variant="outlineGold" className="mb-4">✦ Voices of Heritage</Badge>
                        <h2 className="text-3xl md:text-4xl font-heading font-bold text-heritage-terracottaDark">
                            What Our Community Says
                        </h2>
                        <Separator className="w-24 mx-auto mt-6" />
                    </motion.div>

                    <div className="max-w-3xl mx-auto">
                        <Card className="p-8 md:p-10 heritage-border relative overflow-hidden">
                            <div className="absolute top-4 right-4 text-text-main text-6xl font-heading">❋</div>

                            <motion.div
                                key={currentTestimonial}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-full bg-heritage-terracotta flex items-center justify-center text-text-main font-heading text-xl font-bold">
                                        {testimonials[currentTestimonial].avatar}
                                    </div>
                                    <div>
                                        <h4 className="font-heading font-semibold text-heritage-terracottaDark">
                                            {testimonials[currentTestimonial].name}
                                        </h4>
                                        <p className="text-sm font-body text-text-main">
                                            {testimonials[currentTestimonial].role}
                                        </p>
                                    </div>
                                </div>

                                <p className="text-lg font-accent text-heritage-brownLight italic leading-relaxed">
                                    "{testimonials[currentTestimonial].content}"
                                </p>

                                <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <Star key={s} className="w-5 h-5 text-text-main fill-heritage-gold" />
                                    ))}
                                </div>
                            </motion.div>

                            <div className="flex items-center justify-between mt-8">
                                <button
                                    onClick={() => setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
                                    className="w-10 h-10 rounded-full bg-heritage-cream hover:bg-heritage-terracotta text-heritage-terracottaDark hover:text-text-main flex items-center justify-center transition-colors"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <div className="flex gap-2">
                                    {testimonials.map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setCurrentTestimonial(i)}
                                            className={`w-3 h-3 rounded-full transition-colors ${i === currentTestimonial ? 'bg-heritage-terracotta' : 'bg-heritage-creamDark'
                                                }`}
                                        />
                                    ))}
                                </div>
                                <button
                                    onClick={() => setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)}
                                    className="w-10 h-10 rounded-full bg-heritage-cream hover:bg-heritage-terracotta text-heritage-terracottaDark hover:text-text-main flex items-center justify-center transition-colors"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </Card>
                    </div>
                </div>
            </section>

            {/* ============ CONTACT CTA ============ */}
            <section className="py-16 md:py-24 bg-heritage-terracotta relative overflow-hidden">
                <div className="absolute inset-0 opacity-5 mandala-bg" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.div {...fadeInUp} className="text-center max-w-3xl mx-auto space-y-8">
                        <Badge className="mb-4 bg-yellow-400/20 text-text-main border-yellow-400/50">✦ Start Your Journey</Badge>
                        <h2 className="text-3xl md:text-4xl font-heading font-bold text-text-main">
                            Ready to Rediscover Heritage?
                        </h2>
                        <p className="text-lg font-accent text-text-main italic leading-relaxed">
                            Whether you seek mindful creativity, heritage art, or community connection —
                            Adyom Foundation is your canvas. Let's begin.
                        </p>
                        <div className="flex flex-wrap gap-4 justify-center">
                            <Link to="/register">
                                <Button size="xl" className="bg-yellow-400 text-heritage-terracottaDark hover:bg-yellow-300 hover:text-text-main transition-colors">
                                    Become a Member <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            </Link>
                            <Link to="/contact">
                                <Button variant="outline" size="xl" className="border-yellow-400 text-text-main hover:bg-yellow-400/10 hover:text-text-main">
                                    Contact Us
                                </Button>
                            </Link>
                            <Link to="/corporate">
                                <Button variant="outline" size="xl" className="border-yellow-400 text-text-main hover:bg-yellow-400/10 hover:text-text-main">
                                    Corporate Programs
                                </Button>
                            </Link>
                        </div>
                        <div className="flex flex-wrap gap-6 justify-center text-sm font-body text-text-main mt-6">
                            <span className="flex items-center gap-1">
                                <MapPin className="w-4 h-4 text-text-main" /> New Delhi, India
                            </span>
                            <span className="flex items-center gap-1">
                                <Mail className="w-4 h-4 text-text-main" /> hello@adyomfoundation.org
                            </span>
                            <span className="flex items-center gap-1">
                                <Phone className="w-4 h-4 text-text-main" /> +91 XXX-XXX-XXXX
                            </span>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}