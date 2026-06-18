import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
    ArrowRight, Palette, HandHeart, Star, Camera, Globe, Users,
    BookOpen, Brush, TreePine, Upload, Eye, CheckCircle, Music,
    Sparkles, Quote, Crown, Gift, Shield, Zap, Compass, Leaf,
    Infinity, ChevronRight, Heart, Award, TrendingUp
} from 'lucide-react';
import { artworkAPI } from '@/api';

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

const fallbackArtisans = [
    { name: 'Rameshwar Kumar', craft: 'Madhubani Painting', location: 'Bihar', initials: 'R', gradient: 'from-amber-400 to-amber-600' },
    { name: 'Sita Devi', craft: 'Pottery & Terracotta', location: 'Rajasthan', initials: 'S', gradient: 'from-rose-400 to-rose-600' },
    { name: 'Arun Patel', craft: 'Block Printing', location: 'Gujarat', initials: 'A', gradient: 'from-emerald-400 to-emerald-600' },
    { name: 'Meera Sharma', craft: 'Warli Art', location: 'Maharashtra', initials: 'M', gradient: 'from-sky-400 to-sky-600' },
    { name: 'Vikram Singh', craft: 'Miniature Painting', location: 'Rajasthan', initials: 'V', gradient: 'from-purple-400 to-purple-600' },
    { name: 'Priya Banerjee', craft: 'Kantha Embroidery', location: 'West Bengal', initials: 'P', gradient: 'from-indigo-400 to-indigo-600' },
];

const howItWorks = [
    { icon: Upload, title: 'Submit Your Work', desc: 'Upload your artwork, craft photos, or videos to the Adyom platform for review.', gradient: 'from-amber-400 to-amber-500' },
    { icon: Eye, title: 'Admin Review', desc: 'Our team reviews your submission for authenticity, quality, and heritage alignment.', gradient: 'from-rose-400 to-rose-500' },
    { icon: Globe, title: 'Public Showcase', desc: 'Approved work is showcased in our gallery, visible to collectors and heritage lovers worldwide.', gradient: 'from-emerald-400 to-emerald-500' },
    { icon: Users, title: 'Community Support', desc: 'Connect with fellow artisans, access workshops, and receive career development guidance.', gradient: 'from-sky-400 to-sky-500' },
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

export default function ArtisanConnect() {
    const [artisans, setArtisans] = useState(fallbackArtisans);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArtisans = async () => {
            try {
                const res = await artworkAPI.getPublic({ status: 'approved', limit: 6 });
                if (res.data?.data?.length > 0) {
                    setArtisans(res.data.data.map(art => ({
                        name: art.artistName || art.submittedBy?.name || 'Heritage Artisan',
                        craft: art.title || art.category || 'Traditional Craft',
                        location: art.location || 'India',
                        initials: (art.artistName || art.submittedBy?.name || 'A')[0].toUpperCase(),
                        image: art.image || null,
                        gradient: 'from-heritage-gold to-amber-400',
                    })));
                }
            } catch (err) {
                console.log('Using fallback artisans');
            } finally {
                setLoading(false);
            }
        };
        fetchArtisans();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-b from-heritage-creamLight via-white to-heritage-creamLight/50 overflow-hidden">
            
            {/* ============ HERO SECTION ============ */}
            <section className="relative min-h-[80vh] overflow-hidden flex items-center">
                {/* Animated Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-heritage-terracotta via-heritage-terracottaDark to-heritage-brown">
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute top-20 left-20 w-72 h-72 border-4 border-heritage-gold/30 rounded-full animate-spin-slow" />
                        <div className="absolute bottom-20 right-20 w-96 h-96 border-4 border-heritage-gold/20 rounded-full animate-spin-slower" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border-4 border-heritage-gold/10 rounded-full animate-spin-slowest" />
                    </div>
                    
                    {/* Floating Elements */}
                    <motion.div 
                        className="absolute top-10 left-10 text-4xl opacity-30 text-heritage-goldLight"
                        animate={{ y: [0, -20, 0] }}
                        transition={{ duration: 4, repeat: Infinity }}
                    >
                        ✦
                    </motion.div>
                    <motion.div 
                        className="absolute bottom-20 right-10 text-6xl opacity-20 text-heritage-goldLight"
                        animate={{ y: [0, 20, 0] }}
                        transition={{ duration: 5, repeat: Infinity }}
                    >
                        ✧
                    </motion.div>
                    <motion.div 
                        className="absolute top-1/3 right-20 text-3xl opacity-25 text-heritage-goldLight"
                        animate={{ y: [0, -15, 0] }}
                        transition={{ duration: 3.5, repeat: Infinity }}
                    >
                        ❋
                    </motion.div>
                    <motion.div 
                        className="absolute bottom-1/3 left-20 text-4xl opacity-20 text-heritage-goldLight"
                        animate={{ y: [0, 15, 0] }}
                        transition={{ duration: 4.5, repeat: Infinity }}
                    >
                        ∞
                    </motion.div>

                    {/* Decorative Mandala */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-5">
                        <svg viewBox="0 0 600 600" className="w-full h-full">
                            <circle cx="300" cy="300" r="280" fill="none" stroke="currentColor" strokeWidth="1" />
                            <circle cx="300" cy="300" r="230" fill="none" stroke="currentColor" strokeWidth="1" />
                            <circle cx="300" cy="300" r="180" fill="none" stroke="currentColor" strokeWidth="2" />
                            <circle cx="300" cy="300" r="130" fill="none" stroke="currentColor" strokeWidth="1" />
                            <circle cx="300" cy="300" r="80" fill="none" stroke="currentColor" strokeWidth="2" />
                            <circle cx="300" cy="300" r="30" fill="currentColor" opacity="0.5" />
                            {[...Array(8)].map((_, i) => (
                                <line key={i} x1="300" y1="20" x2="300" y2="580" stroke="currentColor" strokeWidth="1" transform={`rotate(${i * 45}, 300, 300)`} />
                            ))}
                        </svg>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
                    <motion.div 
                        {...fadeInUp}
                        className="text-center max-w-4xl mx-auto"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.5 }}
                            className="inline-block"
                        >
                            <Badge className="mb-6 text-sm px-6 py-2.5 bg-heritage-gold/20 border-heritage-gold/40 text-heritage-goldLight backdrop-blur-sm">
                                <Sparkles className="w-3 h-3 mr-2 inline" />
                                Artisan Connect
                                <Sparkles className="w-3 h-3 ml-2 inline" />
                            </Badge>
                        </motion.div>
                        
                        <motion.h1 
                            className="text-5xl md:text-6xl lg:text-7xl font-bold text-white font-serif leading-tight"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            Empowering India's <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-heritage-gold to-amber-300">Artisans</span>
                        </motion.h1>
                        
                        <motion.div
                            className="relative max-w-3xl mx-auto mt-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <Quote className="w-10 h-10 text-heritage-goldLight/30 mx-auto mb-4" />
                            <p className="text-xl md:text-2xl text-heritage-goldLight/90 leading-relaxed font-light">
                                "Every hand that crafts tells a story of heritage. Artisan Connect gives that story a stage,
                                a community, and a future."
                            </p>
                        </motion.div>

                        <motion.div 
                            className="mt-8 flex flex-wrap justify-center gap-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-5 py-2.5 rounded-full border border-white/10">
                                <HandHeart className="w-4 h-4 text-heritage-goldLight" />
                                <span className="text-sm text-white/90 font-light">Traditional Crafts</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-5 py-2.5 rounded-full border border-white/10">
                                <Users className="w-4 h-4 text-heritage-goldLight" />
                                <span className="text-sm text-white/90 font-light">Artisan Community</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-5 py-2.5 rounded-full border border-white/10">
                                <Globe className="w-4 h-4 text-heritage-goldLight" />
                                <span className="text-sm text-white/90 font-light">Global Heritage</span>
                            </div>
                        </motion.div>

                        <motion.div 
                            className="mt-10 flex flex-wrap gap-4 justify-center"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <Link to="/register">
                                <Button size="xl" className="bg-gradient-to-r from-heritage-gold to-amber-400 text-heritage-brown hover:shadow-xl transition-all duration-300 group font-medium">
                                    Join as Artisan 
                                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                            <Link to="/gallery">
                                <Button variant="outline" size="xl" className="border-heritage-gold/50 text-heritage-goldLight hover:bg-heritage-gold/10 font-light">
                                    View Gallery
                                </Button>
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Bottom Wave */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 120" className="w-full h-auto" preserveAspectRatio="none">
                        <path fill="#FAF5EE" d="M0,60 C480,120 960,0 1440,60 L1440,120 L0,120 Z" />
                    </svg>
                </div>
            </section>

            {/* ============ STATS SECTION ============ */}
            <section className="relative -mt-12 z-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div 
                        className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
                        variants={staggerContainer}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                    >
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                variants={fadeInUp}
                                className="bg-white rounded-2xl shadow-xl p-6 text-center border border-heritage-gold/20 hover:shadow-2xl transition-all duration-300 group"
                            >
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-heritage-gold/20 to-heritage-gold/5 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                                    <stat.icon className="w-6 h-6 text-heritage-gold" />
                                </div>
                                <h3 className="text-2xl md:text-3xl font-bold text-heritage-brown font-serif">{stat.number}</h3>
                                <p className="text-sm text-heritage-brownLight font-light">{stat.label}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ============ HOW IT WORKS ============ */}
            <section className="py-20 md:py-28">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div {...fadeInUp} className="text-center mb-16">
                        <Badge variant="outlineGold" className="mb-4 text-sm px-4 py-1.5 border-heritage-gold/50">
                            ✦ How It Works
                        </Badge>
                        <h2 className="text-3xl md:text-4xl font-bold text-heritage-brown font-serif">
                            From Your Hands to the <span className="text-transparent bg-clip-text bg-gradient-to-r from-heritage-gold to-amber-400">World</span>
                        </h2>
                        <p className="mt-3 text-heritage-brownLight font-light">Your journey to global recognition starts here</p>
                        <Separator className="w-24 mx-auto mt-4 bg-gradient-to-r from-heritage-gold to-transparent" />
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {howItWorks.map((item, i) => (
                            <motion.div 
                                key={i} 
                                {...fadeInUp}
                                transition={{ delay: i * 0.1 }}
                                whileHover={{ y: -8 }}
                            >
                                <Card className="p-6 text-center space-y-4 hover:shadow-2xl transition-all duration-300 border-2 border-heritage-gold/10 bg-white group">
                                    <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                                        <item.icon className="w-7 h-7 text-white" />
                                    </div>
                                    <h3 className="font-serif font-semibold text-heritage-brown text-lg">{item.title}</h3>
                                    <p className="font-light text-sm text-heritage-brownLight leading-relaxed">{item.desc}</p>
                                    <div className="flex justify-center gap-1">
                                        <span className="w-6 h-0.5 bg-gradient-to-r from-heritage-gold to-transparent" />
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============ BENEFITS SECTION ============ */}
            <section className="py-20 md:py-28 bg-gradient-to-b from-heritage-creamLight to-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-5">
                    <div className="mandala-bg absolute inset-0" />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.div {...fadeInUp} className="text-center mb-16">
                        <Badge className="mb-4 text-sm px-6 py-2.5 bg-heritage-gold/20 border-heritage-gold/40 text-heritage-goldDark backdrop-blur-sm">
                            <Sparkles className="w-3 h-3 mr-2 inline" />
                            Artisan Benefits
                            <Sparkles className="w-3 h-3 ml-2 inline" />
                        </Badge>
                        <h2 className="text-3xl md:text-4xl font-bold text-heritage-brown font-serif">
                            What You Get
                        </h2>
                        <p className="mt-3 text-heritage-brownLight font-light">Benefits designed to empower and elevate your craft</p>
                        <Separator className="w-24 mx-auto mt-4 bg-gradient-to-r from-heritage-gold to-transparent" />
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {benefits.map((b, i) => (
                            <motion.div 
                                key={i}
                                {...fadeInUp}
                                transition={{ delay: i * 0.08 }}
                                whileHover={{ y: -5 }}
                                className="bg-white p-6 rounded-2xl border-2 border-heritage-gold/10 hover:border-heritage-gold/30 shadow-lg hover:shadow-2xl transition-all duration-300 group"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-heritage-gold/20 to-heritage-gold/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                                        <b.icon className="w-5 h-5 text-heritage-gold" />
                                    </div>
                                    <div>
                                        <h4 className="font-serif font-semibold text-heritage-brown">{b.title}</h4>
                                        <p className="font-light text-sm text-heritage-brownLight">{b.desc}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============ FEATURED ARTISANS ============ */}
            <section className="py-20 md:py-28 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div {...fadeInUp} className="text-center mb-16">
                        <Badge variant="outlineGold" className="mb-4 text-sm px-4 py-1.5 border-heritage-gold/50">
                            ✦ Featured Artisans
                        </Badge>
                        <h2 className="text-3xl md:text-4xl font-bold text-heritage-brown font-serif">
                            Our Heritage Craftsmen
                        </h2>
                        <p className="mt-3 text-heritage-brownLight font-light">Meet the talented artisans preserving India's heritage</p>
                        <Separator className="w-24 mx-auto mt-4 bg-gradient-to-r from-heritage-gold to-transparent" />
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {loading ? (
                            Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="bg-white rounded-2xl shadow-lg border border-heritage-gold/10 p-6 space-y-4">
                                    <Skeleton className="w-16 h-16 rounded-full" />
                                    <Skeleton className="h-5 w-2/3" />
                                    <Skeleton className="h-6 w-40 rounded-full" />
                                    <Skeleton className="h-4 w-1/2" />
                                </div>
                            ))
                        ) : artisans.length === 0 ? (
                            <div className="col-span-full text-center py-12">
                                <Palette className="w-16 h-16 mx-auto text-heritage-gold/30 mb-4" />
                                <p className="font-light text-heritage-brownLight">No artisans featured yet. Check back soon!</p>
                            </div>
                        ) : (
                            artisans.map((artisan, i) => (
                                <motion.div 
                                    key={i} 
                                    {...fadeInUp}
                                    transition={{ delay: i * 0.08 }}
                                    whileHover={{ y: -8 }}
                                >
                                    <Card className="p-6 space-y-4 hover:shadow-2xl transition-all duration-300 border-2 border-heritage-gold/10 bg-white group">
                                        <div className="flex items-start justify-between">
                                            {artisan.image ? (
                                                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-heritage-gold/30">
                                                    <img src={artisan.image} alt={artisan.name} className="w-full h-full object-cover" />
                                                </div>
                                            ) : (
                                                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${artisan.gradient || 'from-heritage-gold to-amber-400'} flex items-center justify-center text-white font-serif text-xl font-bold shadow-lg`}>
                                                    {artisan.initials}
                                                </div>
                                            )}
                                            <Badge className="bg-heritage-gold/10 text-heritage-brown border-none font-light">
                                                {artisan.craft}
                                            </Badge>
                                        </div>
                                        <div>
                                            <h3 className="font-serif font-semibold text-heritage-brown text-lg">{artisan.name}</h3>
                                            <p className="text-sm font-light text-heritage-brownLight flex items-center gap-1 mt-1">
                                                <TreePine className="w-4 h-4 text-heritage-gold" />
                                                {artisan.location}
                                            </p>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-1 text-heritage-gold">
                                                <Star className="w-4 h-4 fill-heritage-gold" />
                                                <span className="text-xs font-light text-heritage-brownLight">Featured Artisan</span>
                                            </div>
                                            <ChevronRight className="w-4 h-4 text-heritage-gold/50 group-hover:text-heritage-gold group-hover:translate-x-1 transition-all duration-300" />
                                        </div>
                                    </Card>
                                </motion.div>
                            ))
                        )}
                    </div>

                    <div className="text-center mt-12">
                        <Link to="/gallery">
                            <Button variant="outline" size="lg" className="border-heritage-gold/50 text-heritage-brown hover:bg-heritage-gold hover:text-white transition-all duration-300 font-light">
                                View All Artisans <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* ============ TESTIMONIAL / IMPACT SECTION ============ */}
            <section className="py-16 md:py-20 bg-gradient-to-r from-amber-50 via-rose-50 to-amber-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div 
                        {...fadeInUp}
                        className="bg-white rounded-3xl p-8 md:p-12 border-2 border-heritage-gold/20 shadow-xl"
                    >
                        <div className="grid md:grid-cols-3 gap-8 items-center">
                            <div className="md:col-span-2 space-y-4">
                                <Badge variant="outlineGold" className="text-sm px-4 py-1.5 border-heritage-gold/50">
                                    ✦ Our Impact
                                </Badge>
                                <h3 className="text-2xl md:text-3xl font-bold text-heritage-brown font-serif">
                                    Making a Difference Together
                                </h3>
                                <p className="text-heritage-brownLight font-light leading-relaxed">
                                    Through Artisan Connect, we're creating meaningful change in communities 
                                    across India — empowering traditional craftspeople, preserving heritage 
                                    techniques, and building bridges between artisans and the modern world.
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-4 justify-center md:justify-end">
                                <div className="bg-gradient-to-br from-heritage-gold/10 to-amber-50 p-4 rounded-2xl shadow-lg text-center min-w-[100px] border border-heritage-gold/20">
                                    <Crown className="w-6 h-6 text-heritage-gold mx-auto mb-1" />
                                    <p className="text-2xl font-bold text-heritage-brown font-serif">500+</p>
                                    <p className="text-xs text-heritage-brownLight font-light">Artisans Empowered</p>
                                </div>
                                <div className="bg-gradient-to-br from-heritage-gold/10 to-amber-50 p-4 rounded-2xl shadow-lg text-center min-w-[100px] border border-heritage-gold/20">
                                    <Gift className="w-6 h-6 text-heritage-gold mx-auto mb-1" />
                                    <p className="text-2xl font-bold text-heritage-brown font-serif">100+</p>
                                    <p className="text-xs text-heritage-brownLight font-light">Crafts Preserved</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ============ CTA SECTION ============ */}
            <section className="py-16 md:py-20 bg-gradient-to-r from-heritage-brown to-heritage-terracottaDark relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-96 h-96 border-4 border-heritage-gold/30 rounded-full -mr-48 -mt-48" />
                    <div className="absolute bottom-0 left-0 w-96 h-96 border-4 border-heritage-gold/20 rounded-full -ml-48 -mb-48" />
                </div>
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.div 
                        {...fadeInUp}
                        className="text-center max-w-3xl mx-auto space-y-6"
                    >
                        <Badge className="text-sm px-6 py-2.5 bg-heritage-gold text-heritage-brown border-none shadow-lg">
                            <Sparkles className="w-3 h-3 mr-2 inline" />
                            Are You an Artisan?
                            <Sparkles className="w-3 h-3 ml-2 inline" />
                        </Badge>
                        <h2 className="text-3xl md:text-4xl font-bold text-heritage-cream font-serif">
                            Join Artisan Connect Today
                        </h2>
                        <p className="text-heritage-goldLight/90 font-light text-lg">
                            Share your heritage craft with the world. Free membership for traditional artisans.
                            Together, let's preserve India's timeless heritage.
                        </p>
                        <div className="flex flex-wrap gap-4 justify-center pt-4">
                            <Link to="/register">
                                <Button size="xl" className="bg-gradient-to-r from-heritage-gold to-amber-400 text-heritage-brown hover:shadow-xl transition-all duration-300 group font-medium">
                                    Join as Artisan 
                                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                            <Link to="/contact">
                                <Button variant="outline" size="xl" className="border-heritage-gold/50 text-heritage-goldLight hover:bg-heritage-gold/10 font-light">
                                    Contact Us
                                </Button>
                            </Link>
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
                @keyframes spin-slowest {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin-slow {
                    animation: spin-slow 20s linear infinite;
                }
                .animate-spin-slower {
                    animation: spin-slower 30s linear infinite;
                }
                .animate-spin-slowest {
                    animation: spin-slowest 40s linear infinite;
                }
                .mandala-bg {
                    background-image: radial-gradient(circle at 20% 50%, rgba(212, 165, 116, 0.1) 0%, transparent 50%),
                                      radial-gradient(circle at 80% 50%, rgba(139, 69, 19, 0.1) 0%, transparent 50%);
                }
            `}</style>
        </div>
    );
}