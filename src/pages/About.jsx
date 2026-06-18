import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
    ArrowRight,
    Heart,
    Lightbulb,
    Palette,
    Users,
    Globe,
    Star,
    Eye,
    BookOpen,
    Target,
    Award,
    TreePine,
    Sparkles,
    Compass,
    Leaf,
    Infinity,
    Quote,
    Crown,
    Gift,
    HandshakeIcon,
    Zap,
    ChevronRight,
    Shield,
    Gem,
    Feather,
    Sun,
} from 'lucide-react';

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

const values = [
    { 
        icon: Heart, 
        title: 'Heritage Preservation', 
        desc: 'We honor and preserve India\'s timeless art forms, folk traditions, and cultural wisdom for future generations.',
        color: 'from-rose-500 to-rose-600',
    },
    { 
        icon: Lightbulb, 
        title: 'Mindful Creation', 
        desc: 'Every act of creation begins with awareness. We integrate mindfulness into art, learning, and community life.',
        color: 'from-amber-500 to-amber-600',
    },
    { 
        icon: Users, 
        title: 'Community First', 
        desc: 'Our community is our canvas. Together, we learn, create, and uplift — every voice matters, every hand contributes.',
        color: 'from-emerald-500 to-emerald-600',
    },
    { 
        icon: Globe, 
        title: 'Cultural Bridge', 
        desc: 'We connect ancient heritage with modern expression, building bridges between tradition and innovation.',
        color: 'from-sky-500 to-sky-600',
    },
    { 
        icon: Palette, 
        title: 'Creative Empowerment', 
        desc: 'We empower artisans, artists, and seekers with tools, platforms, and support to express their heritage journey.',
        color: 'from-purple-500 to-purple-600',
    },
    { 
        icon: Star, 
        title: 'Inclusive Excellence', 
        desc: 'Heritage belongs to everyone. We welcome all seekers — regardless of background — to explore, learn, and grow.',
        color: 'from-indigo-500 to-indigo-600',
    },
];

const team = [
    { 
        name: 'Founder & Vision Keeper', 
        role: 'Leading the heritage revival mission', 
        initials: 'F', 
        gradient: 'from-amber-400 to-amber-600',
        delay: 0,
    },
    { 
        name: 'Program Director', 
        role: 'Curating transformative learning experiences', 
        initials: 'P', 
        gradient: 'from-rose-400 to-rose-600',
        delay: 0.1,
    },
    { 
        name: 'Artisan Liaison', 
        role: 'Connecting craftspeople with opportunities', 
        initials: 'A', 
        gradient: 'from-emerald-400 to-emerald-600',
        delay: 0.2,
    },
    { 
        name: 'Mindfulness Guide', 
        role: 'Guiding inner transformation practices', 
        initials: 'M', 
        gradient: 'from-sky-400 to-sky-600',
        delay: 0.3,
    },
    { 
        name: 'Community Manager', 
        role: 'Nurturing our growing heritage community', 
        initials: 'C', 
        gradient: 'from-purple-400 to-purple-600',
        delay: 0.4,
    },
    { 
        name: 'CSR Coordinator', 
        role: 'Building corporate-heritage partnerships', 
        initials: 'S', 
        gradient: 'from-indigo-400 to-indigo-600',
        delay: 0.5,
    },
];

const stats = [
    { number: '5000+', label: 'Community Members', icon: Users, color: 'from-rose-400 to-rose-500' },
    { number: '50+', label: 'Artisan Partners', icon: Palette, color: 'from-amber-400 to-amber-500' },
    { number: '15+', label: 'Corporate Collaborators', icon: HandshakeIcon, color: 'from-emerald-400 to-emerald-500' },
    { number: '10+', label: 'Active Programs', icon: Sparkles, color: 'from-sky-400 to-sky-500' },
];

const milestones = [
    { year: '2018', title: 'Foundation', desc: 'Adyom was born with a vision to preserve India\'s heritage' },
    { year: '2019', title: 'First Program', desc: 'Launched our flagship Drishti art program' },
    { year: '2020', title: 'Community Growth', desc: 'Reached 1000+ members across India' },
    { year: '2021', title: 'Artisan Connect', desc: 'Empowered 50+ traditional artisans' },
    { year: '2022', title: 'Corporate Partners', desc: '15+ companies joined our CSR initiatives' },
    { year: '2023', title: 'Global Reach', desc: 'Expanded to international heritage programs' },
];

export default function About() {
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
                                About Adyom Foundation
                                <Sparkles className="w-3 h-3 ml-2 inline" />
                            </Badge>
                        </motion.div>
                        
                        <motion.h1 
                            className="text-5xl md:text-6xl lg:text-7xl font-bold text-white font-serif leading-tight"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            Where Heritage <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-heritage-gold to-amber-300">
                                Breathes
                            </span>
                        </motion.h1>
                        
                        <motion.div
                            className="relative max-w-3xl mx-auto mt-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <Quote className="w-10 h-10 text-heritage-goldLight/30 mx-auto mb-4" />
                            <p className="text-xl md:text-2xl text-heritage-goldLight/90 leading-relaxed font-light tracking-wide">
                                "Adyom — meaning 'infinite' in Sanskrit — embodies the boundless potential
                                of heritage to transform, inspire, and connect."
                            </p>
                            <p className="text-lg text-heritage-goldLight/70 mt-3 font-light">
                                We are a living canvas where tradition meets the modern soul.
                            </p>
                        </motion.div>

                        <motion.div 
                            className="mt-8 flex flex-wrap justify-center gap-3"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-5 py-2.5 rounded-full border border-white/10">
                                <Infinity className="w-4 h-4 text-heritage-goldLight" />
                                <span className="text-sm text-white/90 font-light">Infinite Heritage</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-5 py-2.5 rounded-full border border-white/10">
                                <Compass className="w-4 h-4 text-heritage-goldLight" />
                                <span className="text-sm text-white/90 font-light">Timeless Wisdom</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-5 py-2.5 rounded-full border border-white/10">
                                <Leaf className="w-4 h-4 text-heritage-goldLight" />
                                <span className="text-sm text-white/90 font-light">Mindful Living</span>
                            </div>
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
                                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${stat.color} flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                                    <stat.icon className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-2xl md:text-3xl font-bold text-heritage-brown font-serif">{stat.number}</h3>
                                <p className="text-sm text-heritage-brownLight font-light tracking-wide">{stat.label}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ============ OUR STORY ============ */}
            <section className="py-20 md:py-28 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <motion.div 
                            {...fadeInLeft}
                            className="space-y-6"
                        >
                            <div>
                                <Badge variant="outlineGold" className="mb-3 text-sm px-4 py-1.5 border-heritage-gold/50">
                                    ✦ Our Story
                                </Badge>
                                <h2 className="text-3xl md:text-4xl font-bold text-heritage-brown font-serif">
                                    Born from a Love for <br className="hidden md:block" />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-heritage-terracotta to-heritage-gold">Heritage</span>
                                </h2>
                            </div>
                            
                            <Separator className="w-20 bg-gradient-to-r from-heritage-gold to-transparent" />
                            
                            <div className="space-y-4 text-heritage-brownLight leading-relaxed font-light">
                                <p className="text-lg">
                                    Adyom Foundation was born from a simple yet powerful belief: <strong className="text-heritage-brown font-medium">India's heritage is not a relic of the past</strong> — it is a living, breathing force that can transform lives today.
                                </p>
                                <p>
                                    Founded in New Delhi, we began as a small circle of heritage seekers who believed that art, 
                                    mindfulness, and community could create bridges between ancient wisdom and modern life.
                                </p>
                                <p>
                                    Today, we are a growing community of over <strong className="text-heritage-brown font-medium">5,000 members</strong>, 
                                    <strong className="text-heritage-brown font-medium"> 50+ artisan partners</strong>, and 
                                    <strong className="text-heritage-brown font-medium"> 15+ corporate collaborators</strong> — all united by the 
                                    vision of keeping heritage alive, accessible, and transformative.
                                </p>
                            </div>

                            <motion.div 
                                className="bg-gradient-to-r from-amber-50 to-rose-50 p-6 rounded-2xl border-l-4 border-heritage-gold shadow-lg"
                                whileHover={{ scale: 1.02 }}
                                transition={{ duration: 0.3 }}
                            >
                                <p className="font-serif text-lg text-heritage-brown italic leading-relaxed">
                                    "Every heritage tradition is a thread in the canvas of human experience. 
                                    At Adyom, we weave these threads into a living tapestry."
                                </p>
                                <div className="mt-2 flex items-center gap-2 text-heritage-gold">
                                    <span className="w-8 h-0.5 bg-heritage-gold" />
                                    <span className="text-sm font-light">— Adyom Foundation</span>
                                </div>
                            </motion.div>
                        </motion.div>

                        <motion.div 
                            {...fadeInRight}
                            className="grid grid-cols-2 gap-4"
                        >
                            <div className="space-y-4">
                                <motion.div 
                                    className="h-56 rounded-2xl bg-gradient-to-br from-heritage-terracotta to-heritage-terracottaLight flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 group overflow-hidden"
                                    whileHover={{ scale: 1.03 }}
                                >
                                    <Eye className="w-20 h-20 text-white/60 group-hover:scale-110 transition-transform duration-300" />
                                </motion.div>
                                <motion.div 
                                    className="h-48 rounded-2xl bg-gradient-to-br from-amber-200 to-amber-300 flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 group overflow-hidden"
                                    whileHover={{ scale: 1.03 }}
                                >
                                    <BookOpen className="w-20 h-20 text-heritage-brown/40 group-hover:scale-110 transition-transform duration-300" />
                                </motion.div>
                            </div>
                            <div className="space-y-4 mt-8">
                                <motion.div 
                                    className="h-48 rounded-2xl bg-gradient-to-br from-heritage-gold to-amber-400 flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 group overflow-hidden"
                                    whileHover={{ scale: 1.03 }}
                                >
                                    <Palette className="w-20 h-20 text-white/60 group-hover:scale-110 transition-transform duration-300" />
                                </motion.div>
                                <motion.div 
                                    className="h-56 rounded-2xl bg-gradient-to-br from-heritage-brown to-heritage-brownLight flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 group overflow-hidden"
                                    whileHover={{ scale: 1.03 }}
                                >
                                    <TreePine className="w-20 h-20 text-white/40 group-hover:scale-110 transition-transform duration-300" />
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ============ MISSION, VISION, PHILOSOPHY ============ */}
            <section className="py-20 md:py-28 bg-gradient-to-b from-heritage-creamLight to-white relative">
                <div className="absolute inset-0 opacity-5">
                    <div className="mandala-bg absolute inset-0" />
                </div>
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.div {...fadeInUp} className="text-center mb-16">
                        <Badge variant="outlineGold" className="mb-4 text-sm px-4 py-1.5 border-heritage-gold/50">
                            ✦ Our Guiding Light
                        </Badge>
                        <h2 className="text-3xl md:text-4xl font-bold text-heritage-brown font-serif">
                            Mission · Vision · Philosophy
                        </h2>
                        <p className="mt-3 text-heritage-brownLight font-light">The principles that guide our journey</p>
                        <Separator className="w-24 mx-auto mt-4 bg-gradient-to-r from-heritage-gold to-transparent" />
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { 
                                icon: Target, 
                                title: 'Our Mission', 
                                desc: 'To preserve, practice, and propagate India\'s heritage through art, mindfulness, and community — making ancient wisdom accessible and transformative for the modern world.',
                                gradient: 'from-rose-500 to-rose-600',
                                iconBg: 'bg-rose-500',
                                iconColor: 'text-white',
                            },
                            { 
                                icon: Eye, 
                                title: 'Our Vision', 
                                desc: 'A world where heritage is not confined to museums but lives in every mindful brushstroke, every crafted object, every community gathering — a living canvas of human creativity.',
                                gradient: 'from-amber-500 to-amber-600',
                                iconBg: 'bg-amber-500',
                                iconColor: 'text-white',
                            },
                            { 
                                icon: Heart, 
                                title: 'Our Philosophy', 
                                desc: 'We believe that art is meditation, craft is prayer, and community is canvas. Heritage is not about looking backward — it\'s about carrying forward the light of centuries.',
                                gradient: 'from-emerald-500 to-emerald-600',
                                iconBg: 'bg-emerald-500',
                                iconColor: 'text-white',
                            },
                        ].map((item, i) => (
                            <motion.div 
                                key={i} 
                                {...fadeInUp}
                                transition={{ delay: i * 0.1 }}
                                whileHover={{ y: -8 }}
                            >
                                <Card className="p-8 space-y-4 border-2 border-heritage-gold/10 shadow-xl hover:shadow-2xl transition-all duration-300 bg-white overflow-hidden relative group">
                                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${item.gradient} opacity-5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500`} />
                                    <div className={`${item.iconBg} w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                        <item.icon className={`w-7 h-7 ${item.iconColor}`} />
                                    </div>
                                    <h3 className="text-xl font-bold text-heritage-brown font-serif">{item.title}</h3>
                                    <p className="font-light text-heritage-brownLight leading-relaxed">{item.desc}</p>
                                    <div className={`w-12 h-1 rounded-full bg-gradient-to-r ${item.gradient}`} />
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============ OUR VALUES ============ */}
            <section className="py-20 md:py-28 bg-white relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div {...fadeInUp} className="text-center mb-16">
                        <Badge variant="outlineGold" className="mb-4 text-sm px-4 py-1.5 border-heritage-gold/50">
                            ✦ Our Values
                        </Badge>
                        <h2 className="text-3xl md:text-4xl font-bold text-heritage-brown font-serif">
                            The Pillars of Adyom
                        </h2>
                        <p className="mt-3 text-heritage-brownLight font-light">The principles that define our foundation</p>
                        <Separator className="w-24 mx-auto mt-4 bg-gradient-to-r from-heritage-gold to-transparent" />
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {values.map((v, i) => (
                            <motion.div 
                                key={i} 
                                {...fadeInUp}
                                transition={{ delay: i * 0.08 }}
                                whileHover={{ y: -6 }}
                            >
                                <Card className="p-6 space-y-3 hover:shadow-2xl transition-all duration-300 border-2 border-heritage-gold/10 hover:border-heritage-gold/30 bg-white group">
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${v.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                                        <v.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="font-serif font-semibold text-heritage-brown text-lg">{v.title}</h3>
                                    <p className="font-light text-sm text-heritage-brownLight leading-relaxed">{v.desc}</p>
                                    <div className="w-8 h-0.5 bg-gradient-to-r from-heritage-gold to-transparent group-hover:w-12 transition-all duration-300" />
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============ MILESTONES / TIMELINE ============ */}
            <section className="py-20 md:py-28 bg-gradient-to-b from-heritage-creamLight to-white relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div {...fadeInUp} className="text-center mb-16">
                        <Badge variant="outlineGold" className="mb-4 text-sm px-4 py-1.5 border-heritage-gold/50">
                            ✦ Our Journey
                        </Badge>
                        <h2 className="text-3xl md:text-4xl font-bold text-heritage-brown font-serif">
                            A Timeline of Heritage
                        </h2>
                        <p className="mt-3 text-heritage-brownLight font-light">Key milestones in our journey</p>
                        <Separator className="w-24 mx-auto mt-4 bg-gradient-to-r from-heritage-gold to-transparent" />
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {milestones.map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.08 }}
                            >
                                <div className="bg-white p-6 rounded-2xl border-2 border-heritage-gold/10 hover:border-heritage-gold/30 shadow-lg hover:shadow-2xl transition-all duration-300 group">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-heritage-gold/20 to-heritage-gold/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                            <span className="text-heritage-gold font-serif font-bold text-lg">{item.year}</span>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-heritage-gold/50" />
                                    </div>
                                    <h3 className="font-serif font-semibold text-heritage-brown text-lg">{item.title}</h3>
                                    <p className="font-light text-heritage-brownLight text-sm mt-1">{item.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============ TEAM SECTION ============ */}
            <section className="py-20 md:py-28 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-heritage-terracotta via-heritage-terracottaDark to-heritage-brown">
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-20 left-20 w-64 h-64 border-4 border-heritage-gold/30 rounded-full animate-spin-slow" />
                        <div className="absolute bottom-20 right-20 w-80 h-80 border-4 border-heritage-gold/20 rounded-full animate-spin-slower" />
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.div {...fadeInUp} className="text-center mb-16">
                        <Badge className="mb-4 text-sm px-6 py-2.5 bg-heritage-gold/20 border-heritage-gold/40 text-heritage-goldLight backdrop-blur-sm">
                            <Sparkles className="w-3 h-3 mr-2 inline" />
                            Our Team
                            <Sparkles className="w-3 h-3 ml-2 inline" />
                        </Badge>
                        <h2 className="text-3xl md:text-4xl font-bold text-white font-serif">
                            The Hands Behind the Canvas
                        </h2>
                        <p className="text-heritage-goldLight/80 mt-2 font-light">Passionate individuals dedicated to preserving India's heritage</p>
                        <Separator className="w-24 mx-auto mt-4 bg-gradient-to-r from-heritage-gold to-transparent" />
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {team.map((member, i) => (
                            <motion.div 
                                key={i} 
                                {...fadeInUp}
                                transition={{ delay: member.delay }}
                                whileHover={{ y: -8 }}
                            >
                                <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 text-center space-y-3 shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/20 group">
                                    <div className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-br ${member.gradient} flex items-center justify-center text-white font-serif text-2xl font-bold shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                        {member.initials}
                                    </div>
                                    <h3 className="font-serif font-semibold text-heritage-brown text-lg">{member.name}</h3>
                                    <p className="font-light text-sm text-heritage-brownLight">{member.role}</p>
                                    <div className="flex justify-center gap-1.5">
                                        <span className="w-2 h-2 rounded-full bg-heritage-gold/60" />
                                        <span className="w-2 h-2 rounded-full bg-heritage-gold/30" />
                                        <span className="w-2 h-2 rounded-full bg-heritage-gold/10" />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 80" className="w-full h-auto" preserveAspectRatio="none">
                        <path fill="#FAF5EE" d="M0,40 C480,80 960,0 1440,40 L1440,80 L0,80 Z" />
                    </svg>
                </div>
            </section>

            {/* ============ IMPACT SECTION ============ */}
            <section className="py-16 md:py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div 
                        {...fadeInUp}
                        className="bg-gradient-to-r from-amber-50 via-rose-50 to-amber-50 rounded-3xl p-8 md:p-12 border-2 border-heritage-gold/20 shadow-xl"
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
                                    Through our programs and initiatives, we're creating meaningful change in communities 
                                    across India — empowering artisans, preserving traditions, and building bridges between 
                                    heritage and the modern world.
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-4 justify-center md:justify-end">
                                <div className="bg-white p-4 rounded-2xl shadow-lg text-center min-w-[100px] border border-heritage-gold/20 hover:shadow-xl transition-all duration-300">
                                    <Crown className="w-6 h-6 text-heritage-gold mx-auto mb-1" />
                                    <p className="text-2xl font-bold text-heritage-brown font-serif">500+</p>
                                    <p className="text-xs text-heritage-brownLight font-light">Artisans Supported</p>
                                </div>
                                <div className="bg-white p-4 rounded-2xl shadow-lg text-center min-w-[100px] border border-heritage-gold/20 hover:shadow-xl transition-all duration-300">
                                    <Gift className="w-6 h-6 text-heritage-gold mx-auto mb-1" />
                                    <p className="text-2xl font-bold text-heritage-brown font-serif">100+</p>
                                    <p className="text-xs text-heritage-brownLight font-light">Workshops Conducted</p>
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
                            Join Us
                            <Sparkles className="w-3 h-3 ml-2 inline" />
                        </Badge>
                        <h2 className="text-3xl md:text-4xl font-bold text-heritage-cream font-serif">
                            Join Our Heritage Journey
                        </h2>
                        <p className="text-heritage-goldLight/90 font-light text-lg">
                            Be part of a community that honors tradition while embracing transformation.
                            Together, we can keep India's heritage alive for generations to come.
                        </p>
                        <div className="flex flex-wrap gap-4 justify-center pt-4">
                            <Link to="/register">
                                <Button size="xl" className="bg-heritage-gold text-heritage-brown hover:bg-heritage-gold/90 shadow-lg hover:shadow-xl transition-all duration-300 group">
                                    Become a Member 
                                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                            <Link to="/programs">
                                <Button variant="outline" size="xl" className="border-heritage-gold/50 text-heritage-goldLight hover:bg-heritage-gold/10">
                                    Explore Programs
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
                .font-serif {
                    font-family: 'Playfair Display', 'Georgia', serif;
                }
            `}</style>
        </div>
    );
}