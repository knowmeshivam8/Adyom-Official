import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CardGridSkeleton } from '@/components/ui/page-skeletons';
import {
    ArrowRight, Eye, Lightbulb, Palette, HandHeart, Camera, Music, BookOpen,
    Calendar, Star, Search, Filter, ChevronDown, Video, Clock, Sparkles,
    Quote, Compass, Leaf, Infinity,
} from 'lucide-react';
import { programAPI } from '@/api';

// ============ ANIMATIONS ============
const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
};

const fadeInScale = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
};

const staggerContainer = {
    animate: {
        transition: { staggerChildren: 0.08 },
    },
};

// ============ DATA ============
const categories = [
    { key: 'all', name: 'All Programs', icon: BookOpen },
    { key: 'drishti', name: 'Drishti', icon: Eye },
    { key: 'chaitanya', name: 'Chaitanya', icon: Lightbulb },
    { key: 'kala-path', name: 'Kala-Path', icon: Palette },
    { key: 'sparsh', name: 'Sparsh', icon: HandHeart },
    { key: 'pratibimb', name: 'Pratibimb', icon: Camera },
    { key: 'kala-vritti', name: 'Kala-Vritti', icon: Music },
    { key: 'workshop', name: 'Workshops', icon: Calendar },
];

const fallbackPrograms = [
    {
        title: 'Drishti: Individual Wellness Webinar',
        category: 'drishti',
        level: 'All Levels',
        duration: '1 Day',
        nextSession: 'Aug 15, 2026 • 10:00 AM IST',
        price: '₹999',
        desc: 'Online individual wellness webinar acting as the first step of Art with Awakening.',
        featured: true,
        slug: 'drishti-individual-wellness-webinar',
        imageUrl: '/images/drishti_individual.png'
    },
    {
        title: 'Drishti: Corporate Workshop',
        category: 'drishti',
        level: 'All Levels',
        duration: '1 Day',
        nextSession: 'Custom Dates',
        price: 'Corporate Plan',
        desc: 'Exclusive mindfulness and heritage art workshop designed for corporate teams and small businesses.',
        slug: 'drishti-corporate-workshop',
        imageUrl: '/images/drishti_corporate.png'
    },
    {
        title: 'Drishti: School Workshop',
        category: 'drishti',
        level: 'All Levels',
        duration: '1 Day',
        nextSession: 'Sep 10, 2026 • 09:00 AM IST',
        price: 'Custom',
        desc: 'Mindfulness and wellness workshop exclusively designed for students and educators.',
        slug: 'drishti-school-workshop',
        imageUrl: '/images/drishti_school.png'
    },
    {
        title: 'KalaPath — Online Art Learning',
        category: 'kala-path',
        level: 'Beginner',
        duration: '12 weeks',
        price: 'Free',
        desc: 'Master Indian heritage art forms through guided video lessons.',
        slug: 'kalapath-online-art-learning',
        imageUrl: '/images/gallery_kolam_art.png'
    },
    {
        title: 'Pratibimb — 41-Day Sadhana',
        category: 'pratibimb',
        level: 'All Levels',
        duration: '41 days',
        price: 'Free',
        desc: 'Daily art practice combined with mindfulness and self-reflection over 41 days.',
        featured: true,
        slug: 'pratibimb-41-day-sadhana',
        imageUrl: '/images/philosophy_culture.png'
    },
    {
        title: 'Chaitanya — Art for Consciousness',
        category: 'chaitanya',
        level: 'Intermediate',
        duration: '49 weeks',
        price: 'Free',
        desc: 'A year-long program exploring art, consciousness, and spiritual growth through 7 Indian art forms.',
        slug: 'chaitanya-art-for-consciousness',
        imageUrl: '/images/philosophy_mindfulness.png'
    },
    {
        title: 'Sparsh — Touch of Art',
        category: 'sparsh',
        level: 'All Levels',
        duration: '49 weeks',
        price: 'Free',
        desc: 'A hands-on journey through India\'s textile, sculpture, and craft traditions via 7 art forms.',
        slug: 'sparsh-touch-of-art',
        imageUrl: '/images/hero_artisan.png'
    },
    {
        title: 'KalaVritti — Art Marketplace',
        category: 'kala-vritti',
        level: 'All Levels',
        duration: 'Ongoing',
        price: 'Free',
        desc: 'A platform for artists to showcase and sell their work to patrons and collectors.',
        featured: true,
        slug: 'kalavritti-art-marketplace',
        imageUrl: '/images/philosophy_community.png'
    },
];

const categoryColors = {
    drishti: 'from-[#B87333] to-[#D4A574]',
    chaitanya: 'from-[#C9A96E] to-[#F5E6D3]',
    'kala-path': 'from-[#D4A574] to-[#C9A96E]',
    sparsh: 'from-[#8F6B5A] to-[#6B4F3A]',
    pratibimb: 'from-[#F5E6D3] to-[#D4A574]',
    'kala-vritti': 'from-[#C9A96E] to-[#B87333]',
    workshop: 'from-[#B87333] to-[#8F6B5A]',
};

const levelColors = {
    Beginner: 'bg-[#C9A96E] text-[#3C2F2B]',
    Intermediate: 'bg-[#B87333] text-white',
    Advanced: 'bg-[#8F6B5A] text-white',
    'All Levels': 'bg-[#F5E6D3] text-[#3C2F2B]'
};

export default function Programs() {
    const [searchParams] = useSearchParams();
    const initialCategory = searchParams.get('category') || 'all';
    const [activeCategory, setActiveCategory] = useState(initialCategory);
    const [searchQuery, setSearchQuery] = useState('');
    const [programs, setPrograms] = useState(fallbackPrograms);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPrograms = async () => {
            try {
                const res = await programAPI.getAll({ isPublished: 'true' });
                const apiPrograms = res.data.data || res.data.programs || res.data;
                if (Array.isArray(apiPrograms) && apiPrograms.length > 0) {
                    setPrograms(apiPrograms.map(p => ({
                        title: p.title,
                        category: p.category || 'drishti',
                        level: p.level || 'All Levels',
                        duration: p.duration || '8 Weeks',
                        nextSession: p.nextSession || null,
                        price: p.price ? `₹${p.price}` : 'Free',
                        desc: p.description || p.desc || '',
                        featured: p.featured || false,
                        slug: p.slug || p._id,
                        imageUrl: p.image || p.imageUrl || null,
                    })));
                }
            } catch (err) {
                setPrograms(fallbackPrograms);
            } finally {
                setLoading(false);
            }
        };
        fetchPrograms();
    }, []);

    const filtered = programs.filter((p) => {
        const matchCat = activeCategory === 'all' || p.category === activeCategory;
        const matchSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.desc.toLowerCase().includes(searchQuery.toLowerCase());
        return matchCat && matchSearch;
    });

    const CategoryIcon = categories.find(c => c.key === activeCategory)?.icon || BookOpen;

    return (
        <div className="min-h-screen bg-[#FDFBF7] font-serif">

            {/* ============ HERO ============ */}
            <section className="relative py-16 md:py-20 lg:py-24 bg-[#3C2F2B] overflow-hidden">
                <div className="absolute inset-0 opacity-[0.04]">
                    <div className="absolute top-20 left-20 w-48 h-48 border border-[#C9A96E] rounded-full animate-spin-slow" />
                    <div className="absolute bottom-20 right-20 w-64 h-64 border border-[#C9A96E]/50 rounded-full animate-spin-slower" />
                    <motion.div
                        className="absolute top-10 left-10 text-4xl text-[#C9A96E]"
                        animate={{ y: [0, -15, 0] }}
                        transition={{ duration: 4, repeat: Infinity }}
                    >
                        ✦
                    </motion.div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <motion.div {...fadeInUp}>
                        <span className="inline-block px-4 py-1.5 bg-[#C9A96E]/20 border border-[#C9A96E]/30 text-[#C9A96E] font-serif text-xs tracking-[0.2em] uppercase">
                            <Sparkles className="w-3 h-3 mr-2 inline" />
                            Heritage Learning Programs
                        </span>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-light text-[#FDFBF7] mt-4 leading-tight">
                            Programs &amp; <span className="text-[#C9A96E] font-normal">Workshops</span>
                        </h1>
                        <p className="mt-3 text-base md:text-lg font-serif font-light text-[#D4A574] max-w-2xl mx-auto leading-relaxed">
                            Six streams of heritage learning — each a path to rediscovery, mastery, and inner transformation
                        </p>
                    </motion.div>
                </div>

                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 80" className="w-full h-auto" preserveAspectRatio="none">
                        <path fill="#FDFBF7" d="M0,40 C480,80 960,0 1440,40 L1440,80 L0,80 Z" />
                    </svg>
                </div>
            </section>

            {/* ============ FILTERS ============ */}
            <section className="py-4 md:py-6 bg-[#FDFBF7] border-b border-[#B87333]/10 sticky top-[4rem] md:top-[5rem] z-30 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row items-center gap-4">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8F6B5A]" />
                            <input
                                type="text"
                                placeholder="Search programs..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 border border-[#B87333]/20 bg-[#FDFBF7] text-sm font-serif font-light text-[#3C2F2B] placeholder:text-[#8F6B5A]/60 focus:border-[#B87333] focus:outline-none"
                            />
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {categories.map((cat) => (
                                <button
                                    key={cat.key}
                                    onClick={() => setActiveCategory(cat.key)}
                                    className={`px-3 py-1.5 text-xs font-serif font-light transition-all duration-300 border ${activeCategory === cat.key
                                            ? 'bg-[#C9A96E] border-[#C9A96E] text-[#3C2F2B]'
                                            : 'bg-transparent border-[#B87333]/20 text-[#8F6B5A] hover:border-[#B87333]/50 hover:text-[#3C2F2B]'
                                        }`}
                                >
                                    <cat.icon className="w-3 h-3 inline mr-1.5" />
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ============ PROGRAMS GRID ============ */}
            <section className="py-10 md:py-14 lg:py-16 bg-[#FDFBF7]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3 mb-6 md:mb-8">
                        <CategoryIcon className="w-5 h-5 md:w-6 md:h-6 text-[#B87333]" />
                        <h2 className="text-xl md:text-2xl font-serif font-light text-[#3C2F2B]">
                            {categories.find(c => c.key === activeCategory)?.name || 'All Programs'}
                        </h2>
                        <span className="text-xs font-serif font-light text-[#8F6B5A] border border-[#B87333]/20 px-2 py-0.5">
                            {filtered.length}
                        </span>
                    </div>

                    {loading ? (
                        <CardGridSkeleton items={6} />
                    ) : filtered.length === 0 ? (
                        <div className="text-center py-12">
                            <BookOpen className="w-12 h-12 text-[#B87333]/30 mx-auto mb-4" />
                            <p className="font-serif font-light text-[#8F6B5A]">No programs found. Try a different category or search.</p>
                        </div>
                    ) : (
                        <motion.div
                            className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 lg:gap-6"
                            variants={staggerContainer}
                            initial="initial"
                            whileInView="animate"
                            viewport={{ once: true, margin: "-30px" }}
                        >
                            {filtered.map((program, i) => (
                                <motion.div
                                    key={program.slug || i}
                                    variants={fadeInScale}
                                    whileHover={{ y: -6 }}
                                    className="bg-white border border-[#B87333]/10 shadow-sm hover:shadow-lg transition-all duration-400 group overflow-hidden"
                                >
                                    {/* Image Section */}
                                    <div className="relative h-44 overflow-hidden bg-[#F5E6D3]">
                                        {program.imageUrl ? (
                                            <img
                                                src={program.imageUrl}
                                                alt={program.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className={`w-full h-full bg-gradient-to-br ${categoryColors[program.category] || 'from-[#B87333] to-[#D4A574]'} flex items-center justify-center`}>
                                                <BookOpen className="w-10 h-10 text-white/40" />
                                            </div>
                                        )}

                                        {/* Featured Badge */}
                                        {program.featured && (
                                            <span className="absolute top-3 right-3 px-2 py-0.5 bg-[#C9A96E] text-[#3C2F2B] text-[9px] font-serif font-medium uppercase tracking-wider shadow-sm">
                                                Featured
                                            </span>
                                        )}
                                    </div>

                                    <div className="p-4 md:p-5 space-y-2 md:space-y-3">
                                        {/* Tags */}
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className={`px-2 py-0.5 text-[9px] md:text-[10px] font-serif font-medium uppercase tracking-wider ${levelColors[program.level] || 'bg-[#F5E6D3] text-[#3C2F2B]'}`}>
                                                {program.level}
                                            </span>
                                            <span className="text-[10px] md:text-xs font-serif font-light text-[#8F6B5A] flex items-center gap-1">
                                                <Calendar className="w-3 h-3" /> {program.duration}
                                            </span>
                                        </div>

                                        {/* Next Session */}
                                        {program.nextSession && (
                                            <div className="text-[10px] md:text-xs font-serif font-light text-[#B87333] flex items-center gap-1.5 bg-[#B87333]/10 px-2 py-0.5 w-fit">
                                                <Clock className="w-3 h-3" /> Next: {program.nextSession}
                                            </div>
                                        )}

                                        {/* Title */}
                                        <h3 className="text-sm md:text-base font-serif font-medium text-[#3C2F2B] group-hover:text-[#B87333] transition-colors duration-300 leading-snug">
                                            {program.title}
                                        </h3>

                                        {/* Description */}
                                        <p className="text-xs md:text-sm font-serif font-light text-[#6B5B4B] leading-relaxed line-clamp-2">
                                            {program.desc}
                                        </p>

                                        {/* Footer */}
                                        <div className="flex items-center justify-between pt-2 border-t border-[#B87333]/10">
                                            <span className="text-sm md:text-base font-serif font-medium text-[#B87333]">
                                                {program.price}
                                            </span>
                                            <div className="flex gap-2">
                                                {program.category === 'drishti' && program.slug && (
                                                    <Link to={`/meet/${program.slug}?title=${encodeURIComponent(program.title)}`}>
                                                        <Button className="bg-[#C9A96E] hover:bg-[#B87333] text-[#3C2F2B] hover:text-white text-[10px] md:text-xs px-3 py-1 h-auto transition-all duration-300">
                                                            <Video className="w-3 h-3 mr-1" /> Join
                                                        </Button>
                                                    </Link>
                                                )}
                                                <Link to={`/programs/${program.slug || program._id}`}>
                                                    <Button variant="outline" className="border-[#B87333]/30 text-[#3C2F2B] hover:bg-[#B87333] hover:text-white text-[10px] md:text-xs px-3 py-1 h-auto transition-all duration-300">
                                                        Details <ArrowRight className="ml-1 w-3 h-3" />
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </div>
            </section>

            {/* ============ CTA ============ */}
            <section className="py-12 md:py-16 bg-[#3C2F2B] relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.04]">
                    <div className="absolute top-0 right-0 w-64 h-64 border border-[#C9A96E] rounded-full -mr-32 -mt-32" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 border border-[#C9A96E]/50 rounded-full -ml-32 -mb-32" />
                </div>

                <div className="max-w-3xl mx-auto px-4 text-center relative z-10 space-y-4">
                    <Quote className="w-8 h-8 text-[#C9A96E]/30 mx-auto" />
                    <h2 className="text-xl md:text-2xl font-serif font-light text-[#FDFBF7]">
                        Can't find what you're looking for?
                    </h2>
                    <p className="text-sm md:text-base font-serif font-light text-[#D4A574] max-w-lg mx-auto leading-relaxed">
                        We're constantly adding new programs. Let us know your interests!
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                        <Link to="/contact">
                            <Button className="bg-[#C9A96E] hover:bg-[#B87333] text-[#3C2F2B] hover:text-white text-sm px-6 py-2 transition-all duration-300">
                                Contact Us
                            </Button>
                        </Link>
                        <Link to="/register">
                            <Button variant="outline" className="border-[#C9A96E]/40 text-[#FDFBF7] hover:bg-[#C9A96E]/10 text-sm px-6 py-2">
                                Become a Member
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

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

                .line-clamp-2 {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
            `}</style>
        </div>
    );
}