import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
    ArrowRight, Palette, HandHeart, Star, Camera, Globe, Users,
    BookOpen, Brush, TreePine, Upload, Eye, Music,
    Sparkles, Quote, Crown, Gift, Shield, Zap, Compass, Leaf,
    Infinity, ChevronRight, Heart, Award, TrendingUp, CheckCircle,
} from 'lucide-react';
import { artworkAPI } from '@/api';

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
        transition: { staggerChildren: 0.1 },
    },
};

// ============ DATA ============
const fallbackArtisans = [
    { name: 'Rameshwar Kumar', craft: 'Madhubani Painting', location: 'Bihar', initials: 'R', image: null },
    { name: 'Sita Devi', craft: 'Pottery & Terracotta', location: 'Rajasthan', initials: 'S', image: null },
    { name: 'Arun Patel', craft: 'Block Printing', location: 'Gujarat', initials: 'A', image: null },
    { name: 'Meera Sharma', craft: 'Warli Art', location: 'Maharashtra', initials: 'M', image: null },
    { name: 'Vikram Singh', craft: 'Miniature Painting', location: 'Rajasthan', initials: 'V', image: null },
    { name: 'Priya Banerjee', craft: 'Kantha Embroidery', location: 'West Bengal', initials: 'P', image: null },
];

const howItWorks = [
    { icon: Upload, title: 'Submit Your Work', desc: 'Upload your artwork, craft photos, or videos to the Adyom platform for review.' },
    { icon: Eye, title: 'Admin Review', desc: 'Our team reviews your submission for authenticity, quality, and heritage alignment.' },
    { icon: Globe, title: 'Public Showcase', desc: 'Approved work is showcased in our gallery, visible to collectors and heritage lovers worldwide.' },
    { icon: Users, title: 'Community Support', desc: 'Connect with fellow artisans, access workshops, and receive career development guidance.' },
];

const benefits = [
    { icon: Crown, title: 'Free Portfolio Space', desc: 'Showcase your work on Adyom Gallery' },
    { icon: Globe, title: 'Global Visibility', desc: 'Connect with heritage collectors worldwide' },
    { icon: Users, title: 'Community Network', desc: 'Join fellow artisans for support & growth' },
    { icon: BookOpen, title: 'Skill Enhancement', desc: 'Access workshops & learning resources' },
    { icon: HandHeart, title: 'Corporate Partnerships', desc: 'Collaborate with heritage-focused companies' },
    { icon: Award, title: 'Recognition', desc: 'Get featured & recognized for your craft' },
];

const stats = [
    { number: '500+', label: 'Artisans Registered', icon: Users },
    { number: '50+', label: 'Traditional Crafts', icon: Palette },
    { number: '25+', label: 'States Represented', icon: Globe },
    { number: '100+', label: 'Workshops Conducted', icon: BookOpen },
];

const artisanColors = [
    'from-[#C9A96E] to-[#B87333]',
    'from-[#B87333] to-[#8F6B5A]',
    'from-[#8F6B5A] to-[#C9A96E]',
    'from-[#D4A574] to-[#C9A96E]',
    'from-[#B87333] to-[#D4A574]',
    'from-[#C9A96E] to-[#8F6B5A]',
];

export default function ArtisanConnect() {
    const [artisans, setArtisans] = useState(fallbackArtisans);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArtisans = async () => {
            try {
                const res = await artworkAPI.getPublic({ status: 'approved', limit: 6 });
                if (res.data?.data?.length > 0) {
                    setArtisans(res.data.data.map((art, index) => ({
                        name: art.artistName || art.submittedBy?.name || 'Heritage Artisan',
                        craft: art.title || art.category || 'Traditional Craft',
                        location: art.location || 'India',
                        initials: (art.artistName || art.submittedBy?.name || 'A')[0].toUpperCase(),
                        image: art.image || null,
                        color: artisanColors[index % artisanColors.length],
                    })));
                }
            } catch (err) {
                setArtisans(fallbackArtisans.map((art, index) => ({
                    ...art,
                    color: artisanColors[index % artisanColors.length],
                })));
            } finally {
                setLoading(false);
            }
        };
        fetchArtisans();
    }, []);

    return (
        <div className="min-h-screen bg-[#FDFBF7] font-serif">

            {/* ============ HERO SECTION ============ */}
            <section className="relative min-h-[60vh] md:min-h-[70vh] lg:min-h-[80vh] overflow-hidden flex items-center bg-[#3C2F2B]">
                {/* Decorative Background - Hidden on mobile */}
                <div className="absolute inset-0 opacity-[0.04] hidden md:block">
                    <div className="absolute top-20 left-20 w-48 md:w-72 h-48 md:h-72 border border-[#C9A96E] rounded-full animate-spin-slow" />
                    <div className="absolute bottom-20 right-20 w-64 md:w-96 h-64 md:h-96 border border-[#C9A96E]/50 rounded-full animate-spin-slower" />
                </div>

                <motion.div
                    className="absolute top-6 left-6 text-3xl md:text-5xl text-[#C9A96E] opacity-20 md:opacity-40"
                    animate={{ y: [0, -15, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                >
                    ✦
                </motion.div>
                <motion.div
                    className="absolute bottom-8 right-6 text-4xl md:text-6xl text-[#C9A96E] opacity-20 md:opacity-40"
                    animate={{ y: [0, 15, 0] }}
                    transition={{ duration: 5, repeat: Infinity }}
                >
                    ✧
                </motion.div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full py-12 md:py-16 lg:py-0">
                    <motion.div
                        {...fadeInUp}
                        className="text-center max-w-4xl mx-auto"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="inline-block"
                        >
                            <span className="inline-block px-4 md:px-6 py-2 md:py-2.5 bg-[#C9A96E]/20 border border-[#C9A96E]/30 text-[#C9A96E] font-serif text-[10px] md:text-xs lg:text-sm tracking-[0.15em] md:tracking-[0.2em] uppercase rounded-full">
                                <Sparkles className="w-3 h-3 mr-1 md:mr-2 inline" />
                                Artisan Connect
                                <Sparkles className="w-3 h-3 ml-1 md:ml-2 inline" />
                            </span>
                        </motion.div>

                        <motion.h1
                            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif font-light text-[#FDFBF7] leading-[1.1] mt-4 md:mt-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.9 }}
                        >
                            Empowering India's <br className="hidden sm:block" />
                            <span className="text-[#C9A96E] font-normal">Artisans</span>
                        </motion.h1>

                        <motion.div
                            className="relative max-w-3xl mx-auto mt-4 md:mt-6 px-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.9 }}
                        >
                            <Quote className="w-8 md:w-10 lg:w-12 h-8 md:h-10 lg:h-12 text-[#C9A96E]/20 mx-auto mb-3 md:mb-4" />
                            <p className="text-base md:text-lg lg:text-xl xl:text-2xl font-serif font-light italic text-[#D4A574] leading-relaxed">
                                "Every hand that crafts tells a story of heritage. Artisan Connect gives that story a stage, a community, and a future."
                            </p>
                        </motion.div>

                        <motion.div
                            className="mt-6 md:mt-8 flex flex-wrap justify-center gap-2 md:gap-3 px-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.9 }}
                        >
                            <span className="flex items-center gap-1.5 md:gap-2 px-3 md:px-5 py-1.5 md:py-2.5 border border-white/10 bg-white/5 text-[#D4A574] font-serif text-[10px] md:text-xs lg:text-sm font-light rounded-full">
                                <HandHeart className="w-3 h-3 md:w-4 md:h-4 text-[#C9A96E]" />
                                Traditional Crafts
                            </span>
                            <span className="flex items-center gap-1.5 md:gap-2 px-3 md:px-5 py-1.5 md:py-2.5 border border-white/10 bg-white/5 text-[#D4A574] font-serif text-[10px] md:text-xs lg:text-sm font-light rounded-full">
                                <Users className="w-3 h-3 md:w-4 md:h-4 text-[#C9A96E]" />
                                Artisan Community
                            </span>
                            <span className="flex items-center gap-1.5 md:gap-2 px-3 md:px-5 py-1.5 md:py-2.5 border border-white/10 bg-white/5 text-[#D4A574] font-serif text-[10px] md:text-xs lg:text-sm font-light rounded-full">
                                <Globe className="w-3 h-3 md:w-4 md:h-4 text-[#C9A96E]" />
                                Global Heritage
                            </span>
                        </motion.div>

                        <motion.div
                            className="mt-6 md:mt-8 lg:mt-10 flex flex-col sm:flex-row gap-3 md:gap-4 justify-center px-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.9 }}
                        >
                        </motion.div>
                    </motion.div>
                </div>

                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 60" className="w-full h-auto" preserveAspectRatio="none">
                        <path fill="#FDFBF7" d="M0,40 C480,80 960,0 1440,40 L1440,60 L0,60 Z" />
                    </svg>
                </div>
            </section>

            {/* ============ STATS SECTION ============ */}
            <section className="relative -mt-6 md:-mt-8 lg:-mt-10 z-20 px-4 sm:px-6">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4"
                        variants={staggerContainer}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true, margin: "-30px" }}
                    >
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                variants={fadeInScale}
                                whileHover={{ y: -4 }}
                                className="bg-[#FDFBF7] border border-[#B87333]/10 p-3 md:p-4 lg:p-6 text-center shadow-md hover:shadow-lg transition-all duration-300"
                            >
                                <div className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 mx-auto flex items-center justify-center bg-[#C9A96E] mb-1 md:mb-2">
                                    <stat.icon className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-[#3C2F2B]" />
                                </div>
                                <h3 className="text-lg md:text-xl lg:text-2xl xl:text-3xl font-serif font-normal text-[#3C2F2B]">{stat.number}</h3>
                                <p className="text-[10px] md:text-xs lg:text-sm font-serif font-light text-[#8F6B5A] tracking-wide">{stat.label}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ============ HOW IT WORKS ============ */}
            <section className="py-12 md:py-16 lg:py-20 bg-[#FDFBF7]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        {...fadeInUp}
                        className="text-center mb-10 md:mb-12 lg:mb-16"
                        whileInView="animate"
                        viewport={{ once: true, margin: "-50px" }}
                    >
                        <span className="inline-block text-[#B87333] font-serif text-[10px] md:text-xs lg:text-sm tracking-[0.2em] uppercase mb-3 md:mb-4 border-b border-[#B87333]/30 pb-2">
                            ✦ How It Works
                        </span>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-light text-[#3C2F2B] leading-tight">
                            From Your Hands to the <span className="text-[#B87333] font-normal block sm:inline mt-1 sm:mt-0">World</span>
                        </h2>
                        <p className="mt-2 md:mt-3 text-sm md:text-base lg:text-lg font-serif font-light text-[#8F6B5A]">Your journey to global recognition starts here</p>
                        <div className="w-12 md:w-16 lg:w-20 h-px mx-auto mt-3 md:mt-4 bg-[#B87333]" />
                    </motion.div>

                    <motion.div
                        className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 lg:gap-6"
                        variants={staggerContainer}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true, margin: "-30px" }}
                    >
                        {howItWorks.map((item, i) => (
                            <motion.div
                                key={i}
                                variants={fadeInScale}
                                whileHover={{ y: -6 }}
                                className="bg-white border border-[#B87333]/10 p-5 md:p-6 lg:p-8 text-center shadow-sm hover:shadow-lg transition-all duration-300"
                            >
                                <div className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 mx-auto flex items-center justify-center bg-[#C9A96E] mb-3 md:mb-4">
                                    <item.icon className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 text-[#3C2F2B]" />
                                </div>
                                <h3 className="text-base md:text-lg lg:text-xl font-serif font-normal text-[#3C2F2B]">{item.title}</h3>
                                <p className="text-xs md:text-sm font-serif font-light text-[#6B5B4B] leading-relaxed mt-1 md:mt-2">{item.desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ============ BENEFITS ============ */}
            <section className="py-12 md:py-16 lg:py-20 bg-[#F5E6D3]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        {...fadeInUp}
                        className="text-center mb-10 md:mb-12 lg:mb-16"
                        whileInView="animate"
                        viewport={{ once: true, margin: "-50px" }}
                    >
                        <span className="inline-block text-[#B87333] font-serif text-[10px] md:text-xs lg:text-sm tracking-[0.2em] uppercase mb-3 md:mb-4 border-b border-[#B87333]/30 pb-2">
                            <Sparkles className="w-3 h-3 mr-1 md:mr-2 inline" />
                            Artisan Benefits
                            <Sparkles className="w-3 h-3 ml-1 md:ml-2 inline" />
                        </span>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-light text-[#3C2F2B] leading-tight">
                            What You <span className="text-[#B87333] font-normal block sm:inline mt-1 sm:mt-0">Get</span>
                        </h2>
                        <p className="mt-2 md:mt-3 text-sm md:text-base lg:text-lg font-serif font-light text-[#8F6B5A]">Benefits designed to empower and elevate your craft</p>
                        <div className="w-12 md:w-16 lg:w-20 h-px mx-auto mt-3 md:mt-4 bg-[#B87333]" />
                    </motion.div>

                    <motion.div
                        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 lg:gap-5"
                        variants={staggerContainer}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true, margin: "-30px" }}
                    >
                        {benefits.map((b, i) => (
                            <motion.div
                                key={i}
                                variants={fadeInScale}
                                whileHover={{ y: -4 }}
                                className="bg-[#FDFBF7] border border-[#B87333]/10 p-4 md:p-5 lg:p-6 shadow-sm hover:shadow-md transition-all duration-300"
                            >
                                <div className="flex items-start gap-3 md:gap-4">
                                    <div className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-[#C9A96E] flex-shrink-0">
                                        <b.icon className="w-4 h-4 md:w-5 md:h-5 text-[#3C2F2B]" />
                                    </div>
                                    <div>
                                        <h4 className="font-serif font-normal text-[#3C2F2B] text-sm md:text-base">{b.title}</h4>
                                        <p className="font-serif font-light text-xs md:text-sm text-[#6B5B4B]">{b.desc}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ============ FEATURED ARTISANS ============ */}
            <section className="py-12 md:py-16 lg:py-20 bg-[#FDFBF7]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        {...fadeInUp}
                        className="text-center mb-10 md:mb-12 lg:mb-16"
                        whileInView="animate"
                        viewport={{ once: true, margin: "-50px" }}
                    >
                        <span className="inline-block text-[#B87333] font-serif text-[10px] md:text-xs lg:text-sm tracking-[0.2em] uppercase mb-3 md:mb-4 border-b border-[#B87333]/30 pb-2">
                            ✦ Featured Artisans
                        </span>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-light text-[#3C2F2B] leading-tight">
                            Our Heritage <span className="text-[#B87333] font-normal block sm:inline mt-1 sm:mt-0">Craftsmen</span>
                        </h2>
                        <p className="mt-2 md:mt-3 text-sm md:text-base lg:text-lg font-serif font-light text-[#8F6B5A]">Meet the talented artisans preserving India's heritage</p>
                        <div className="w-12 md:w-16 lg:w-20 h-px mx-auto mt-3 md:mt-4 bg-[#B87333]" />
                    </motion.div>

                    <motion.div
                        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 lg:gap-6"
                        variants={staggerContainer}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true, margin: "-30px" }}
                    >
                        {loading ? (
                            Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="bg-white border border-[#B87333]/10 p-4 md:p-5 lg:p-6 space-y-3 md:space-y-4 shadow-sm">
                                    <Skeleton className="w-14 h-14 md:w-16 md:h-16 rounded-full" />
                                    <Skeleton className="h-4 md:h-5 w-2/3" />
                                    <Skeleton className="h-5 md:h-6 w-32 md:w-40" />
                                    <Skeleton className="h-3 md:h-4 w-1/2" />
                                </div>
                            ))
                        ) : artisans.length === 0 ? (
                            <div className="col-span-full text-center py-8 md:py-12">
                                <Palette className="w-12 h-12 md:w-16 md:h-16 mx-auto text-[#B87333]/30 mb-3 md:mb-4" />
                                <p className="font-serif font-light text-[#8F6B5A] text-sm md:text-base">No artisans featured yet. Check back soon!</p>
                            </div>
                        ) : (
                            artisans.map((artisan, i) => (
                                <motion.div
                                    key={i}
                                    variants={fadeInScale}
                                    whileHover={{ y: -6 }}
                                    className="bg-white border border-[#B87333]/10 p-4 md:p-5 lg:p-6 shadow-sm hover:shadow-lg transition-all duration-300"
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        {artisan.image ? (
                                            <div className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 overflow-hidden border-2 border-[#C9A96E]/30 flex-shrink-0">
                                                <img src={artisan.image} alt={artisan.name} className="w-full h-full object-cover" />
                                            </div>
                                        ) : (
                                            <div className={`w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 flex items-center justify-center bg-gradient-to-br ${artisan.color || 'from-[#C9A96E] to-[#B87333]'} text-[#3C2F2B] font-serif text-lg md:text-xl font-normal shadow-sm flex-shrink-0`}>
                                                {artisan.initials}
                                            </div>
                                        )}
                                        <span className="px-2 py-0.5 bg-[#C9A96E]/20 text-[#B87333] text-[8px] md:text-[10px] font-serif font-medium uppercase tracking-wider flex-shrink-0">
                                            {artisan.craft}
                                        </span>
                                    </div>
                                    <div className="mt-3 md:mt-4">
                                        <h3 className="font-serif font-normal text-[#3C2F2B] text-sm md:text-base lg:text-lg">{artisan.name}</h3>
                                        <p className="text-xs md:text-sm font-serif font-light text-[#8F6B5A] flex items-center gap-1.5 mt-0.5 md:mt-1">
                                            <TreePine className="w-3 h-3 md:w-4 md:h-4 text-[#B87333]" />
                                            {artisan.location}
                                        </p>
                                    </div>
                                    <div className="flex justify-between items-center mt-3 md:mt-4 pt-3 md:pt-4 border-t border-[#B87333]/10">
                                        <div className="flex items-center gap-1 text-[#B87333]">
                                            <Star className="w-3 h-3 md:w-4 md:h-4 fill-[#B87333]" />
                                            <span className="text-[9px] md:text-xs font-serif font-light text-[#8F6B5A]">Featured</span>
                                        </div>
                                        <ChevronRight className="w-3 h-3 md:w-4 md:h-4 text-[#B87333]/40 group-hover:text-[#B87333] group-hover:translate-x-1 transition-all duration-300" />
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </motion.div>

                    <div className="text-center mt-8 md:mt-10 lg:mt-12">
                        <Link to="/gallery">
                            <Button variant="outline" className="border-[#B87333]/40 text-[#3C2F2B] hover:bg-[#B87333] hover:text-white text-sm md:text-base px-6 md:px-8 py-2 md:py-2.5 transition-all duration-300">
                                View All Artisans <ArrowRight className="ml-2 w-3 h-3 md:w-4 md:h-4" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* ============ QUOTE / IMPACT ============ */}
            <section className="py-10 md:py-14 lg:py-16 bg-[#F5E6D3]">
                <div className="max-w-3xl mx-auto px-4 text-center">
                    <Quote className="w-8 md:w-10 lg:w-12 h-8 md:h-10 lg:h-12 text-[#B87333]/30 mx-auto mb-3 md:mb-4" />
                    <p className="text-base md:text-lg lg:text-xl xl:text-2xl font-serif font-light text-[#3C2F2B] italic leading-relaxed">
                        "Through Artisan Connect, we're creating meaningful change in communities across India — empowering traditional craftspeople, preserving heritage techniques, and building bridges between artisans and the modern world."
                    </p>
                    <div className="flex items-center justify-center gap-3 md:gap-4 mt-4 md:mt-6">
                        <span className="w-8 md:w-12 h-px bg-[#B87333]" />
                        <span className="text-xs md:text-sm font-serif font-light text-[#8F6B5A]">Adyom Foundation</span>
                        <span className="w-8 md:w-12 h-px bg-[#B87333]" />
                    </div>
                </div>
            </section>

            {/* ============ CTA ============ */}
            <section className="py-14 md:py-20 lg:py-24 bg-[#3C2F2B] relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.04] hidden md:block">
                    <div className="absolute top-0 right-0 w-64 md:w-80 h-64 md:h-80 border border-[#C9A96E] rounded-full -mr-32 md:-mr-40 -mt-32 md:-mt-40 animate-spin-slowest" />
                    <div className="absolute bottom-0 left-0 w-64 md:w-80 h-64 md:h-80 border border-[#C9A96E]/50 rounded-full -ml-32 md:-ml-40 -mb-32 md:-mb-40 animate-spin-slower" />
                </div>

                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.div
                        {...fadeInUp}
                        className="text-center space-y-4 md:space-y-5 lg:space-y-6"
                        whileInView="animate"
                        viewport={{ once: true, margin: "-30px" }}
                    >
                        <span className="inline-block px-4 md:px-6 py-2 md:py-2.5 bg-[#C9A96E]/20 border border-[#C9A96E]/30 text-[#C9A96E] font-serif text-[10px] md:text-xs lg:text-sm tracking-[0.15em] md:tracking-[0.2em] uppercase rounded-full">
                            <Sparkles className="w-3 h-3 mr-1 md:mr-2 inline" />
                            Are You an Artisan?
                            <Sparkles className="w-3 h-3 ml-1 md:ml-2 inline" />
                        </span>

                        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-light text-[#FDFBF7] leading-tight">
                            Join Artisan <span className="text-[#C9A96E] font-normal block sm:inline mt-1 sm:mt-0">Connect Today</span>
                        </h2>

                        <p className="text-sm md:text-base lg:text-lg font-serif font-light text-[#D4A574] max-w-xl mx-auto leading-relaxed px-4">
                            Share your heritage craft with the world. Free membership for traditional artisans. Together, let's preserve India's timeless heritage.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center pt-2 md:pt-4 px-4">
                            <Link to="/register" className="w-full sm:w-auto">
                                <Button className="w-full sm:w-auto bg-[#C9A96E] hover:bg-[#B87333] text-[#3C2F2B] hover:text-white text-sm md:text-base px-6 md:px-8 py-2.5 md:py-3 transition-all duration-300">
                                    Join as Artisan
                                    <ArrowRight className="ml-2 w-4 h-4 md:w-5 md:h-5" />
                                </Button>
                            </Link>
                            <Link to="/contact" className="w-full sm:w-auto">
                                <Button variant="outline" className="w-full sm:w-auto border-[#C9A96E]/40 text-[#FDFBF7] hover:bg-[#C9A96E]/10 text-sm md:text-base px-6 md:px-8 py-2.5 md:py-3">
                                    Contact Us
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
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
                @keyframes spin-slowest {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin-slow { animation: spin-slow 25s linear infinite; }
                .animate-spin-slower { animation: spin-slower 35s linear infinite; }
                .animate-spin-slowest { animation: spin-slowest 45s linear infinite; }
            `}</style>
        </div>
    );
}