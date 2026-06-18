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

// ============ ANIMATION VARIANTS ============
const fadeInUp = {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] },
};

const fadeInLeft = {
    initial: { opacity: 0, x: -50 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] },
};

const fadeInRight = {
    initial: { opacity: 0, x: 50 },
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
        transition: { staggerChildren: 0.12, delayChildren: 0.1 },
    },
};

// ============ VALUES DATA ============
const values = [
    {
        icon: Heart,
        title: 'Heritage Preservation',
        desc: 'We honor and preserve India\'s timeless art forms, folk traditions, and cultural wisdom for future generations.',
    },
    {
        icon: Lightbulb,
        title: 'Mindful Creation',
        desc: 'Every act of creation begins with awareness. We integrate mindfulness into art, learning, and community life.',
    },
    {
        icon: Users,
        title: 'Community First',
        desc: 'Our community is our canvas. Together, we learn, create, and uplift — every voice matters, every hand contributes.',
    },
    {
        icon: Globe,
        title: 'Cultural Bridge',
        desc: 'We connect ancient heritage with modern expression, building bridges between tradition and innovation.',
    },
    {
        icon: Palette,
        title: 'Creative Empowerment',
        desc: 'We empower artisans, artists, and seekers with tools, platforms, and support to express their heritage journey.',
    },
    {
        icon: Star,
        title: 'Inclusive Excellence',
        desc: 'Heritage belongs to everyone. We welcome all seekers — regardless of background — to explore, learn, and grow.',
    },
];

// ============ TEAM DATA ============
const team = [
    { name: 'Founder & Vision Keeper', role: 'Leading the heritage revival mission', initials: 'F' },
    { name: 'Program Director', role: 'Curating transformative learning experiences', initials: 'P' },
    { name: 'Artisan Liaison', role: 'Connecting craftspeople with opportunities', initials: 'A' },
    { name: 'Mindfulness Guide', role: 'Guiding inner transformation practices', initials: 'M' },
    { name: 'Community Manager', role: 'Nurturing our growing heritage community', initials: 'C' },
    { name: 'CSR Coordinator', role: 'Building corporate-heritage partnerships', initials: 'S' },
];

// ============ STATS DATA ============
const stats = [
    { number: '5,000+', label: 'Community Members', icon: Users },
    { number: '50+', label: 'Artisan Partners', icon: Palette },
    { number: '15+', label: 'Corporate Collaborators', icon: HandshakeIcon },
    { number: '10+', label: 'Active Programs', icon: Sparkles },
];

// ============ MILESTONES DATA ============
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
        <div className="min-h-screen bg-[#FDFBF7] font-serif">

            {/* ============ HERO SECTION ============ */}
            <section className="relative min-h-[80vh] overflow-hidden flex items-center bg-[#3C2F2B]">
                {/* Decorative Background */}
                <div className="absolute inset-0 opacity-[0.04]">
                    <div className="absolute top-20 left-20 w-72 h-72 border-4 border-[#C9A96E] rounded-full animate-spin-slow" />
                    <div className="absolute bottom-20 right-20 w-96 h-96 border-4 border-[#C9A96E]/50 rounded-full animate-spin-slower" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border-4 border-[#C9A96E]/30 rounded-full animate-spin-slowest" />

                    <motion.div
                        className="absolute top-10 left-10 text-4xl text-[#C9A96E]"
                        animate={{ y: [0, -20, 0] }}
                        transition={{ duration: 4, repeat: Infinity }}
                    >
                        ✦
                    </motion.div>
                    <motion.div
                        className="absolute bottom-20 right-10 text-6xl text-[#C9A96E]"
                        animate={{ y: [0, 20, 0] }}
                        transition={{ duration: 5, repeat: Infinity }}
                    >
                        ✧
                    </motion.div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
                    <motion.div
                        {...fadeInUp}
                        className="text-center max-w-4xl mx-auto"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="inline-block"
                        >
                            <span className="inline-block px-6 py-2.5 bg-[#C9A96E]/20 border border-[#C9A96E]/30 text-[#C9A96E] font-serif text-sm tracking-widest uppercase">
                                <Sparkles className="w-3 h-3 mr-2 inline" />
                                About Adyom Foundation
                                <Sparkles className="w-3 h-3 ml-2 inline" />
                            </span>
                        </motion.div>

                        <motion.h1
                            className="text-5xl md:text-6xl lg:text-7xl font-serif font-normal text-[#FDFBF7] leading-[1.1] mt-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.9 }}
                        >
                            Where Heritage <br />
                            <span className="text-[#C9A96E]">Breathes</span>
                        </motion.h1>

                        <motion.div
                            className="relative max-w-3xl mx-auto mt-8"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.9 }}
                        >
                            <Quote className="w-10 h-10 text-[#C9A96E]/30 mx-auto mb-4" />
                            <p className="text-xl md:text-2xl font-serif font-light text-[#D4A574] leading-relaxed">
                                "Adyom — meaning 'infinite' in Sanskrit — embodies the boundless potential
                                of heritage to transform, inspire, and connect."
                            </p>
                            <p className="text-lg font-serif font-light text-[#D4A574]/70 mt-3">
                                We are a living canvas where tradition meets the modern soul.
                            </p>
                        </motion.div>

                        <motion.div
                            className="mt-10 flex flex-wrap justify-center gap-3"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.9 }}
                        >
                            <span className="flex items-center gap-2 px-5 py-2.5 border border-white/10 bg-white/5 text-[#D4A574] font-serif text-sm font-light">
                                <Infinity className="w-4 h-4 text-[#C9A96E]" />
                                Infinite Heritage
                            </span>
                            <span className="flex items-center gap-2 px-5 py-2.5 border border-white/10 bg-white/5 text-[#D4A574] font-serif text-sm font-light">
                                <Compass className="w-4 h-4 text-[#C9A96E]" />
                                Timeless Wisdom
                            </span>
                            <span className="flex items-center gap-2 px-5 py-2.5 border border-white/10 bg-white/5 text-[#D4A574] font-serif text-sm font-light">
                                <Leaf className="w-4 h-4 text-[#C9A96E]" />
                                Mindful Living
                            </span>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Bottom Wave */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 120" className="w-full h-auto" preserveAspectRatio="none">
                        <path fill="#FDFBF7" d="M0,60 C480,120 960,0 1440,60 L1440,120 L0,120 Z" />
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
                        viewport={{ once: true, margin: "-50px" }}
                    >
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                variants={fadeInUp}
                                whileHover={{ y: -4 }}
                                className="bg-[#FDFBF7] border border-[#B87333]/10 p-6 text-center shadow-lg hover:shadow-xl transition-all duration-500"
                            >
                                <div className="w-12 h-12 mx-auto flex items-center justify-center bg-[#C9A96E] mb-3 group-hover:scale-110 transition-transform duration-500">
                                    <stat.icon className="w-6 h-6 text-[#3C2F2B]" />
                                </div>
                                <h3 className="text-2xl md:text-3xl font-serif font-normal text-[#3C2F2B]">{stat.number}</h3>
                                <p className="text-sm font-serif font-light text-[#8F6B5A] tracking-wide">{stat.label}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ============ OUR STORY ============ */}
            <section className="py-24 md:py-32 bg-[#FDFBF7]">
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
                                    ✦ Our Story
                                </span>
                                <h2 className="text-3xl md:text-5xl font-serif font-normal text-[#3C2F2B]">
                                    Born from a Love for <br />
                                    <span className="text-[#B87333]">Heritage</span>
                                </h2>
                            </div>

                            <div className="w-16 h-px bg-[#B87333]" />

                            <div className="space-y-4 font-serif font-light text-[#6B5B4B] leading-relaxed">
                                <p className="text-lg">
                                    Adyom Foundation was born from a simple yet powerful belief: <span className="text-[#3C2F2B] font-medium">India's heritage is not a relic of the past</span> — it is a living, breathing force that can transform lives today.
                                </p>
                                <p>
                                    Founded in New Delhi, we began as a small circle of heritage seekers who believed that art,
                                    mindfulness, and community could create bridges between ancient wisdom and modern life.
                                </p>
                                <p>
                                    Today, we are a growing community of over <span className="text-[#3C2F2B] font-medium">5,000 members</span>,
                                    <span className="text-[#3C2F2B] font-medium"> 50+ artisan partners</span>, and
                                    <span className="text-[#3C2F2B] font-medium"> 15+ corporate collaborators</span> — all united by the
                                    vision of keeping heritage alive, accessible, and transformative.
                                </p>
                            </div>

                            <motion.div
                                className="bg-[#F5E6D3] p-8 border-l-4 border-[#B87333]"
                                whileHover={{ scale: 1.01 }}
                                transition={{ duration: 0.3 }}
                            >
                                <p className="font-serif text-lg text-[#3C2F2B] italic font-light leading-relaxed">
                                    "Every heritage tradition is a thread in the canvas of human experience.
                                    At Adyom, we weave these threads into a living tapestry."
                                </p>
                                <div className="mt-3 flex items-center gap-2 text-[#B87333]">
                                    <span className="w-8 h-px bg-[#B87333]" />
                                    <span className="text-sm font-serif font-light">— Adyom Foundation</span>
                                </div>
                            </motion.div>
                        </motion.div>

                        <motion.div
                            {...fadeInRight}
                            className="grid grid-cols-2 gap-4"
                            whileInView="animate"
                            viewport={{ once: true, margin: "-50px" }}
                        >
                            <div className="space-y-4">
                                <motion.div
                                    className="h-56 bg-gradient-to-br from-[#B87333] to-[#D4A574] flex items-center justify-center shadow-lg"
                                    whileHover={{ scale: 1.03 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Eye className="w-20 h-20 text-white/50" />
                                </motion.div>
                                <motion.div
                                    className="h-48 bg-[#F5E6D3] flex items-center justify-center shadow-lg border border-[#B87333]/10"
                                    whileHover={{ scale: 1.03 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <BookOpen className="w-20 h-20 text-[#B87333]/30" />
                                </motion.div>
                            </div>
                            <div className="space-y-4 mt-8">
                                <motion.div
                                    className="h-48 bg-[#C9A96E] flex items-center justify-center shadow-lg"
                                    whileHover={{ scale: 1.03 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Palette className="w-20 h-20 text-white/50" />
                                </motion.div>
                                <motion.div
                                    className="h-56 bg-[#3C2F2B] flex items-center justify-center shadow-lg"
                                    whileHover={{ scale: 1.03 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <TreePine className="w-20 h-20 text-white/30" />
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ============ MISSION, VISION, PHILOSOPHY ============ */}
            <section className="py-24 md:py-32 bg-[#F5E6D3]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        {...fadeInUp}
                        className="text-center mb-20"
                        whileInView="animate"
                        viewport={{ once: true, margin: "-100px" }}
                    >
                        <span className="inline-block text-[#B87333] font-serif text-sm tracking-[0.3em] uppercase mb-4 border-b border-[#B87333]/30 pb-2">
                            ✦ Our Guiding Light
                        </span>
                        <h2 className="text-3xl md:text-5xl font-serif font-normal text-[#3C2F2B]">
                            Mission · Vision · Philosophy
                        </h2>
                        <p className="mt-4 text-lg font-serif font-light text-[#8F6B5A]">The principles that guide our journey</p>
                        <div className="w-20 h-px mx-auto mt-6 bg-[#B87333]" />
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Target,
                                title: 'Our Mission',
                                desc: 'To preserve, practice, and propagate India\'s heritage through art, mindfulness, and community — making ancient wisdom accessible and transformative for the modern world.',
                            },
                            {
                                icon: Eye,
                                title: 'Our Vision',
                                desc: 'A world where heritage is not confined to museums but lives in every mindful brushstroke, every crafted object, every community gathering — a living canvas of human creativity.',
                            },
                            {
                                icon: Heart,
                                title: 'Our Philosophy',
                                desc: 'We believe that art is meditation, craft is prayer, and community is canvas. Heritage is not about looking backward — it\'s about carrying forward the light of centuries.',
                            },
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                {...fadeInUp}
                                transition={{ delay: i * 0.1 }}
                                whileHover={{ y: -6 }}
                                whileInView="animate"
                                viewport={{ once: true, margin: "-50px" }}
                            >
                                <div className="bg-[#FDFBF7] border border-[#B87333]/10 p-8 shadow-lg hover:shadow-xl transition-all duration-500 relative group">
                                    <div className="w-14 h-14 flex items-center justify-center bg-[#C9A96E] group-hover:scale-110 transition-transform duration-500">
                                        <item.icon className="w-7 h-7 text-[#3C2F2B]" />
                                    </div>
                                    <h3 className="text-xl font-serif font-normal text-[#3C2F2B] mt-4">{item.title}</h3>
                                    <p className="font-serif font-light text-[#6B5B4B] leading-relaxed mt-2">{item.desc}</p>
                                    <div className="w-12 h-px bg-[#B87333] mt-4" />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============ OUR VALUES ============ */}
            <section className="py-24 md:py-32 bg-[#FDFBF7]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        {...fadeInUp}
                        className="text-center mb-20"
                        whileInView="animate"
                        viewport={{ once: true, margin: "-100px" }}
                    >
                        <span className="inline-block text-[#B87333] font-serif text-sm tracking-[0.3em] uppercase mb-4 border-b border-[#B87333]/30 pb-2">
                            ✦ Our Values
                        </span>
                        <h2 className="text-3xl md:text-5xl font-serif font-normal text-[#3C2F2B]">
                            The Pillars of Adyom
                        </h2>
                        <p className="mt-4 text-lg font-serif font-light text-[#8F6B5A]">The principles that define our foundation</p>
                        <div className="w-20 h-px mx-auto mt-6 bg-[#B87333]" />
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {values.map((v, i) => (
                            <motion.div
                                key={i}
                                {...fadeInUp}
                                transition={{ delay: i * 0.08 }}
                                whileHover={{ y: -6 }}
                                whileInView="animate"
                                viewport={{ once: true, margin: "-50px" }}
                            >
                                <div className="border border-[#B87333]/10 p-6 bg-[#FDFBF7] hover:shadow-xl transition-all duration-500 group">
                                    <div className="w-12 h-12 flex items-center justify-center bg-[#C9A96E] group-hover:scale-110 transition-transform duration-500">
                                        <v.icon className="w-6 h-6 text-[#3C2F2B]" />
                                    </div>
                                    <h3 className="font-serif font-normal text-[#3C2F2B] text-lg mt-3">{v.title}</h3>
                                    <p className="font-serif font-light text-sm text-[#6B5B4B] leading-relaxed mt-1">{v.desc}</p>
                                    <div className="w-8 h-px bg-[#B87333] group-hover:w-12 transition-all duration-500 mt-3" />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============ MILESTONES ============ */}
            <section className="py-24 md:py-32 bg-[#F5E6D3]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        {...fadeInUp}
                        className="text-center mb-20"
                        whileInView="animate"
                        viewport={{ once: true, margin: "-100px" }}
                    >
                        <span className="inline-block text-[#B87333] font-serif text-sm tracking-[0.3em] uppercase mb-4 border-b border-[#B87333]/30 pb-2">
                            ✦ Our Journey
                        </span>
                        <h2 className="text-3xl md:text-5xl font-serif font-normal text-[#3C2F2B]">
                            A Timeline of Heritage
                        </h2>
                        <p className="mt-4 text-lg font-serif font-light text-[#8F6B5A]">Key milestones in our journey</p>
                        <div className="w-20 h-px mx-auto mt-6 bg-[#B87333]" />
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {milestones.map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ delay: i * 0.08, duration: 0.6 }}
                                whileHover={{ y: -4 }}
                            >
                                <div className="bg-[#FDFBF7] border border-[#B87333]/10 p-6 shadow-lg hover:shadow-xl transition-all duration-500 group">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-12 h-12 flex items-center justify-center bg-[#C9A96E]/20 group-hover:scale-110 transition-transform duration-500">
                                            <span className="text-[#B87333] font-serif font-normal text-lg">{item.year}</span>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-[#B87333]/50" />
                                    </div>
                                    <h3 className="font-serif font-normal text-[#3C2F2B] text-lg">{item.title}</h3>
                                    <p className="font-serif font-light text-[#6B5B4B] text-sm mt-1">{item.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============ TEAM SECTION ============ */}
            <section className="py-24 md:py-32 bg-[#3C2F2B] relative overflow-hidden">
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
                        <span className="inline-block px-6 py-2.5 bg-[#C9A96E]/20 border border-[#C9A96E]/30 text-[#C9A96E] font-serif text-sm tracking-widest uppercase">
                            <Sparkles className="w-3 h-3 mr-2 inline" />
                            Our Team
                            <Sparkles className="w-3 h-3 ml-2 inline" />
                        </span>
                        <h2 className="text-3xl md:text-5xl font-serif font-normal text-[#FDFBF7] mt-6">
                            The Hands Behind the Canvas
                        </h2>
                        <p className="text-lg font-serif font-light text-[#D4A574] mt-3">
                            Passionate individuals dedicated to preserving India's heritage
                        </p>
                        <div className="w-20 h-px mx-auto mt-6 bg-[#C9A96E]" />
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {team.map((member, i) => (
                            <motion.div
                                key={i}
                                {...fadeInUp}
                                transition={{ delay: i * 0.08 }}
                                whileHover={{ y: -6 }}
                                whileInView="animate"
                                viewport={{ once: true, margin: "-50px" }}
                            >
                                <div className="bg-white/10 backdrop-blur-sm border border-white/5 p-6 text-center shadow-lg hover:shadow-xl transition-all duration-500 group">
                                    <div className="w-20 h-20 mx-auto flex items-center justify-center bg-[#C9A96E] text-[#3C2F2B] font-serif text-2xl font-normal group-hover:scale-110 transition-transform duration-500">
                                        {member.initials}
                                    </div>
                                    <h3 className="font-serif font-normal text-[#FDFBF7] text-lg mt-3">{member.name}</h3>
                                    <p className="font-serif font-light text-sm text-[#D4A574]">{member.role}</p>
                                    <div className="flex justify-center gap-1.5 mt-3">
                                        <span className="w-2 h-2 bg-[#C9A96E]/60" />
                                        <span className="w-2 h-2 bg-[#C9A96E]/30" />
                                        <span className="w-2 h-2 bg-[#C9A96E]/10" />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 80" className="w-full h-auto" preserveAspectRatio="none">
                        <path fill="#FDFBF7" d="M0,40 C480,80 960,0 1440,40 L1440,80 L0,80 Z" />
                    </svg>
                </div>
            </section>

            {/* ============ IMPACT SECTION ============ */}
            <section className="py-16 md:py-20 bg-[#FDFBF7]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        {...fadeInUp}
                        className="bg-[#F5E6D3] border border-[#B87333]/20 p-8 md:p-12 shadow-lg"
                        whileInView="animate"
                        viewport={{ once: true, margin: "-50px" }}
                    >
                        <div className="grid md:grid-cols-3 gap-8 items-center">
                            <div className="md:col-span-2 space-y-4">
                                <span className="inline-block text-[#B87333] font-serif text-sm tracking-[0.3em] uppercase border-b border-[#B87333]/30 pb-2">
                                    ✦ Our Impact
                                </span>
                                <h3 className="text-2xl md:text-3xl font-serif font-normal text-[#3C2F2B]">
                                    Making a Difference Together
                                </h3>
                                <p className="font-serif font-light text-[#6B5B4B] leading-relaxed">
                                    Through our programs and initiatives, we're creating meaningful change in communities
                                    across India — empowering artisans, preserving traditions, and building bridges between
                                    heritage and the modern world.
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-4 justify-center md:justify-end">
                                <div className="bg-[#FDFBF7] border border-[#B87333]/10 p-4 shadow-lg text-center min-w-[100px]">
                                    <Crown className="w-6 h-6 text-[#B87333] mx-auto mb-1" />
                                    <p className="text-2xl font-serif font-normal text-[#3C2F2B]">500+</p>
                                    <p className="text-xs font-serif font-light text-[#8F6B5A]">Artisans Supported</p>
                                </div>
                                <div className="bg-[#FDFBF7] border border-[#B87333]/10 p-4 shadow-lg text-center min-w-[100px]">
                                    <Gift className="w-6 h-6 text-[#B87333] mx-auto mb-1" />
                                    <p className="text-2xl font-serif font-normal text-[#3C2F2B]">100+</p>
                                    <p className="text-xs font-serif font-light text-[#8F6B5A]">Workshops Conducted</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
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
                        className="text-center max-w-3xl mx-auto space-y-6"
                        whileInView="animate"
                        viewport={{ once: true, margin: "-50px" }}
                    >
                        <span className="inline-block px-6 py-2.5 bg-[#C9A96E] text-[#3C2F2B] font-serif text-sm tracking-[0.3em] uppercase border-none">
                            <Sparkles className="w-3 h-3 mr-2 inline" />
                            Join Us
                            <Sparkles className="w-3 h-3 ml-2 inline" />
                        </span>

                        <h2 className="text-3xl md:text-5xl font-serif font-normal text-[#FDFBF7]">
                            Join Our Heritage Journey
                        </h2>

                        <p className="text-lg font-serif font-light text-[#D4A574] leading-relaxed">
                            Be part of a community that honors tradition while embracing transformation.
                            Together, we can keep India's heritage alive for generations to come.
                        </p>

                        <div className="flex flex-wrap gap-4 justify-center pt-4">
                            <Link to="/register">
                                <Button size="xl" className="bg-[#C9A96E] hover:bg-[#B87333] text-[#3C2F2B] hover:text-white transition-all duration-300 group font-serif text-base px-10 py-3">
                                    Become a Member
                                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                            <Link to="/programs">
                                <Button variant="outline" size="xl" className="border-[#C9A96E]/40 text-[#FDFBF7] hover:bg-[#C9A96E]/10 font-serif text-base px-10 py-3">
                                    Explore Programs
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ============ CUSTOM STYLES ============ */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&display=swap');
                
                * {
                    font-family: 'Playfair Display', 'Georgia', serif !important;
                }

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
            `}</style>
        </div>
    );
}