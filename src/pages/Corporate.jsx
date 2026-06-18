import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
    ArrowRight, Building2, Heart, Users, Lightbulb, Award, Palette,
    Target, Globe, HandHeart, Star, CheckCircle, Mail, Phone, Loader2, Send,
    Sparkles, Quote, Crown, Gift, Shield, Zap, Compass, Leaf, Infinity,
    ChevronRight, TrendingUp, Briefcase, Calendar, Clock
} from 'lucide-react';
import { corporateAPI } from '@/api';

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

const offerings = [
    { 
        icon: Palette, 
        title: 'Heritage Art Workshops', 
        desc: 'Team-building through traditional Indian art — Madhubani, pottery, block printing, and more.',
        gradient: 'from-amber-400 to-amber-600',
    },
    { 
        icon: Lightbulb, 
        title: 'Drishti: Mindfulness & Wellness', 
        desc: 'Corporate mindfulness sessions rooted in ancient Indian meditation and breathing practices.',
        gradient: 'from-rose-400 to-rose-600',
    },
    { 
        icon: Heart, 
        title: 'CSR Heritage Preservation', 
        desc: 'Fund and participate in heritage preservation projects — artisan support, cultural documentation, and restoration.',
        gradient: 'from-emerald-400 to-emerald-600',
    },
    { 
        icon: Users, 
        title: 'Leadership Through Heritage', 
        desc: 'Unique leadership workshops drawing from Indian philosophical traditions and heritage wisdom.',
        gradient: 'from-sky-400 to-sky-600',
    },
    { 
        icon: Globe, 
        title: 'Cultural Immersion Experiences', 
        desc: 'Curated heritage tours and cultural immersion programs for team development and cultural awareness.',
        gradient: 'from-purple-400 to-purple-600',
    },
    { 
        icon: HandHeart, 
        title: 'Artisan Partnership Programs', 
        desc: 'Direct partnership with traditional artisans — sponsor craft preservation, provide market access.',
        gradient: 'from-indigo-400 to-indigo-600',
    },
];

const benefits = [
    { icon: Users, title: 'Enhanced Team Cohesion', desc: 'Shared creative experiences that build stronger teams' },
    { icon: Heart, title: 'Employee Wellness', desc: 'Stress reduction through mindfulness practices' },
    { icon: Target, title: 'Meaningful CSR', desc: 'CSR aligned with heritage preservation' },
    { icon: Globe, title: 'Cultural Awareness', desc: 'Cultural sensitivity and diversity awareness' },
    { icon: Award, title: 'Brand Narrative', desc: 'Unique brand story through heritage engagement' },
    { icon: TrendingUp, title: 'Employee Retention', desc: 'Measurable impact on satisfaction and retention' },
];

const partners = [
    { name: 'TechCorp India', program: 'CSR Heritage Preservation', initials: 'T' },
    { name: 'DesignStudio', program: 'Employee Wellness Program', initials: 'D' },
    { name: 'FinanceGroup', program: 'Leadership Through Heritage', initials: 'F' },
    { name: 'MediaHouse', program: 'Cultural Immersion Experience', initials: 'M' },
    { name: 'StartupHub', program: 'Artisan Partnership Initiative', initials: 'S' },
];

const stats = [
    { number: '25+', label: 'Corporate Partners', icon: Building2 },
    { number: '50+', label: 'Programs Delivered', icon: Calendar },
    { number: '1000+', label: 'Employees Impacted', icon: Users },
    { number: '95%', label: 'Satisfaction Rate', icon: Star },
];

export default function Corporate() {
    const [formData, setFormData] = useState({
        organization: '',
        contactName: '',
        email: '',
        phone: '',
        programInterest: '',
        teamSize: '',
        message: '',
    });
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [submitError, setSubmitError] = useState('');

    const handleInputChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setSubmitError('');

        try {
            await corporateAPI.submit(formData);
            setSubmitted(true);
        } catch (err) {
            if (!err.response) {
                setSubmitted(true);
            } else {
                setSubmitError(err.response?.data?.message || 'Something went wrong. Please try again.');
            }
        } finally {
            setSubmitting(false);
        }
    };

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
                                Corporate & CSR Programs
                                <Sparkles className="w-3 h-3 ml-2 inline" />
                            </Badge>
                        </motion.div>
                        
                        <motion.h1 
                            className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-white leading-tight"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            Heritage for the <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-heritage-gold to-amber-300">Modern Workplace</span>
                        </motion.h1>
                        
                        <motion.div
                            className="relative max-w-3xl mx-auto mt-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <Quote className="w-10 h-10 text-heritage-goldLight/30 mx-auto mb-4" />
                            <p className="text-xl md:text-2xl text-heritage-goldLight/90 leading-relaxed font-light">
                                Transform your organization through India's timeless heritage — team building, wellness,
                                CSR, and leadership programs rooted in cultural wisdom.
                            </p>
                        </motion.div>

                        <motion.div 
                            className="mt-8 flex flex-wrap justify-center gap-3"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-5 py-2.5 rounded-full border border-white/10">
                                <Briefcase className="w-4 h-4 text-heritage-goldLight" />
                                <span className="text-sm text-white/90 font-light">Corporate Programs</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-5 py-2.5 rounded-full border border-white/10">
                                <Heart className="w-4 h-4 text-heritage-goldLight" />
                                <span className="text-sm text-white/90 font-light">CSR Initiatives</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-5 py-2.5 rounded-full border border-white/10">
                                <Users className="w-4 h-4 text-heritage-goldLight" />
                                <span className="text-sm text-white/90 font-light">Team Building</span>
                            </div>
                        </motion.div>

                        <motion.div 
                            className="mt-10 flex flex-wrap gap-4 justify-center"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <Link to="/contact">
                                <Button size="xl" className="bg-gradient-to-r from-heritage-gold to-amber-400 text-heritage-brown hover:shadow-xl transition-all duration-300 group font-medium">
                                    Get a Custom Proposal 
                                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                            <Button variant="outline" size="xl" className="border-heritage-gold/50 text-heritage-goldLight hover:bg-heritage-gold/10 font-light">
                                Download Brochure
                            </Button>
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
                                <h3 className="text-2xl md:text-3xl font-serif font-bold text-heritage-brown">{stat.number}</h3>
                                <p className="text-sm text-heritage-brownLight font-light">{stat.label}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ============ OFFERINGS SECTION ============ */}
            <section className="py-20 md:py-28">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div {...fadeInUp} className="text-center mb-16">
                        <Badge variant="outlineGold" className="mb-4 text-sm px-4 py-1.5 border-heritage-gold/50 font-light">
                            ✦ Our Offerings
                        </Badge>
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-heritage-brown">
                            Heritage Programs for <span className="text-transparent bg-clip-text bg-gradient-to-r from-heritage-gold to-amber-400">Organizations</span>
                        </h2>
                        <p className="mt-3 text-heritage-brownLight font-light">Transform your workplace through India's timeless heritage</p>
                        <Separator className="w-24 mx-auto mt-4 bg-gradient-to-r from-heritage-gold to-transparent" />
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {offerings.map((item, i) => (
                            <motion.div 
                                key={i} 
                                {...fadeInUp}
                                transition={{ delay: i * 0.08 }}
                                whileHover={{ y: -8 }}
                            >
                                <Card className="p-6 space-y-4 hover:shadow-2xl transition-all duration-300 border-2 border-heritage-gold/10 bg-white group">
                                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                                        <item.icon className="w-7 h-7 text-white" />
                                    </div>
                                    <h3 className="font-serif font-semibold text-heritage-brown text-lg">{item.title}</h3>
                                    <p className="font-light text-sm text-heritage-brownLight leading-relaxed">{item.desc}</p>
                                    <div className="w-10 h-0.5 bg-gradient-to-r from-heritage-gold to-transparent group-hover:w-16 transition-all duration-300" />
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
                        <Badge className="mb-4 text-sm px-6 py-2.5 bg-heritage-gold/20 border-heritage-gold/40 text-heritage-goldDark backdrop-blur-sm font-light">
                            <Sparkles className="w-3 h-3 mr-2 inline" />
                            Why Heritage?
                            <Sparkles className="w-3 h-3 ml-2 inline" />
                        </Badge>
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-heritage-brown">
                            Benefits for Your Organization
                        </h2>
                        <p className="mt-3 text-heritage-brownLight font-light">Transform your workplace through heritage engagement</p>
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

            {/* ============ HOW IT WORKS ============ */}
            <section className="py-20 md:py-28 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div {...fadeInUp} className="text-center mb-16">
                        <Badge variant="outlineGold" className="mb-4 text-sm px-4 py-1.5 border-heritage-gold/50 font-light">
                            ✦ How It Works
                        </Badge>
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-heritage-brown">
                            Simple 4-Step Process
                        </h2>
                        <p className="mt-3 text-heritage-brownLight font-light">From inquiry to impact — your heritage journey begins here</p>
                        <Separator className="w-24 mx-auto mt-4 bg-gradient-to-r from-heritage-gold to-transparent" />
                    </motion.div>

                    <div className="grid md:grid-cols-4 gap-6">
                        {[
                            { 
                                step: '1', 
                                title: 'Share Requirements', 
                                desc: 'Tell us your goals, team size, and interests.',
                                gradient: 'from-amber-400 to-amber-600',
                                icon: Mail,
                            },
                            { 
                                step: '2', 
                                title: 'Custom Proposal', 
                                desc: 'We design a tailored heritage program for you.',
                                gradient: 'from-rose-400 to-rose-600',
                                icon: Target,
                            },
                            { 
                                step: '3', 
                                title: 'Program Delivery', 
                                desc: 'Expert-led workshops at your venue or ours.',
                                gradient: 'from-emerald-400 to-emerald-600',
                                icon: Users,
                            },
                            { 
                                step: '4', 
                                title: 'Impact & Follow-up', 
                                desc: 'Measure outcomes and plan next steps.',
                                gradient: 'from-sky-400 to-sky-600',
                                icon: TrendingUp,
                            },
                        ].map((item, i) => (
                            <motion.div 
                                key={i} 
                                {...fadeInUp}
                                transition={{ delay: i * 0.1 }}
                                whileHover={{ y: -8 }}
                            >
                                <Card className="p-6 text-center space-y-4 hover:shadow-2xl transition-all duration-300 border-2 border-heritage-gold/10 bg-white group">
                                    <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                                        <span className="text-2xl font-serif font-bold text-white">{item.step}</span>
                                    </div>
                                    <h3 className="font-serif font-semibold text-heritage-brown text-lg">{item.title}</h3>
                                    <p className="font-light text-sm text-heritage-brownLight">{item.desc}</p>
                                    <div className="flex justify-center gap-1">
                                        <item.icon className="w-4 h-4 text-heritage-gold/30" />
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============ PARTNERS SECTION ============ */}
            <section className="py-20 md:py-28 bg-gradient-to-b from-heritage-creamLight to-white relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.div {...fadeInUp} className="text-center mb-12">
                        <Badge variant="outlineGold" className="mb-4 text-sm px-4 py-1.5 border-heritage-gold/50 font-light">
                            ✦ Trusted Partners
                        </Badge>
                        <h2 className="text-3xl font-serif font-bold text-heritage-brown">
                            Organizations That Trust Adyom
                        </h2>
                        <Separator className="w-24 mx-auto mt-4 bg-gradient-to-r from-heritage-gold to-transparent" />
                    </motion.div>

                    <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {partners.map((p, i) => (
                            <motion.div 
                                key={i}
                                {...fadeInUp}
                                transition={{ delay: i * 0.08 }}
                                whileHover={{ y: -5 }}
                            >
                                <Card className="p-4 text-center hover:shadow-xl transition-all duration-300 border-2 border-heritage-gold/10 hover:border-heritage-gold/30 bg-white">
                                    <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-heritage-gold/20 to-heritage-gold/5 flex items-center justify-center text-heritage-gold font-serif text-lg font-bold">
                                        {p.initials}
                                    </div>
                                    <p className="text-sm font-serif font-semibold text-heritage-brown mt-2">{p.name}</p>
                                    <p className="text-xs font-light text-heritage-brownLight">{p.program}</p>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============ CONTACT / INQUIRY SECTION ============ */}
            <section className="py-20 md:py-28 bg-gradient-to-br from-heritage-terracotta via-heritage-terracottaDark to-heritage-brown relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 left-20 w-64 h-64 border-4 border-heritage-gold/30 rounded-full animate-spin-slow" />
                    <div className="absolute bottom-20 right-20 w-80 h-80 border-4 border-heritage-gold/20 rounded-full animate-spin-slower" />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.div {...fadeInUp} className="text-center mb-12">
                        <Badge className="mb-4 text-sm px-6 py-2.5 bg-heritage-gold/20 border-heritage-gold/40 text-heritage-goldLight backdrop-blur-sm font-light">
                            <Sparkles className="w-3 h-3 mr-2 inline" />
                            Get Started
                            <Sparkles className="w-3 h-3 ml-2 inline" />
                        </Badge>
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-white">
                            Transform Your Organization with <span className="text-transparent bg-clip-text bg-gradient-to-r from-heritage-gold to-amber-300">Heritage</span>
                        </h2>
                        <p className="text-heritage-goldLight/90 font-light mt-2">
                            Get a custom proposal tailored to your CSR and employee engagement goals.
                        </p>
                    </motion.div>

                    {submitted ? (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }} 
                            animate={{ opacity: 1, scale: 1 }} 
                            className="max-w-lg mx-auto text-center space-y-6 py-12 bg-white/10 backdrop-blur-sm rounded-3xl p-12 border border-white/20"
                        >
                            <div className="w-20 h-20 mx-auto rounded-full bg-heritage-gold/20 flex items-center justify-center">
                                <CheckCircle className="w-10 h-10 text-heritage-gold" />
                            </div>
                            <h3 className="text-2xl font-serif font-bold text-white">Inquiry Submitted!</h3>
                            <p className="font-light text-heritage-goldLight/90">
                                Thank you for your interest in our corporate heritage programs. Our team will reach out within 24 hours with a custom proposal.
                            </p>
                            <Link to="/contact">
                                <Button className="bg-gradient-to-r from-heritage-gold to-amber-400 text-heritage-brown hover:shadow-xl transition-all duration-300 font-medium">
                                    Contact Us for More Details
                                </Button>
                            </Link>
                        </motion.div>
                    ) : (
                        <motion.div 
                            {...fadeInUp}
                            className="max-w-2xl mx-auto"
                        >
                            <Card className="p-8 md:p-10 bg-white/10 backdrop-blur-sm border-white/20 shadow-2xl rounded-3xl">
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-light text-heritage-goldLight/80 mb-1.5 block">Organization Name *</label>
                                            <input
                                                name="organization"
                                                value={formData.organization}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-heritage-goldLight/40 font-light focus:border-heritage-gold/50 focus:outline-none transition-colors"
                                                placeholder="Your company name"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm font-light text-heritage-goldLight/80 mb-1.5 block">Contact Person *</label>
                                            <input
                                                name="contactName"
                                                value={formData.contactName}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-heritage-goldLight/40 font-light focus:border-heritage-gold/50 focus:outline-none transition-colors"
                                                placeholder="Your full name"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-light text-heritage-goldLight/80 mb-1.5 block">Email *</label>
                                            <input
                                                name="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-heritage-goldLight/40 font-light focus:border-heritage-gold/50 focus:outline-none transition-colors"
                                                placeholder="you@company.com"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm font-light text-heritage-goldLight/80 mb-1.5 block">Phone</label>
                                            <input
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-heritage-goldLight/40 font-light focus:border-heritage-gold/50 focus:outline-none transition-colors"
                                                placeholder="+91 XXX-XXX-XXXX"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-light text-heritage-goldLight/80 mb-1.5 block">Program Interest *</label>
                                            <select
                                                name="programInterest"
                                                value={formData.programInterest}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white font-light focus:border-heritage-gold/50 focus:outline-none transition-colors"
                                            >
                                                <option value="" className="bg-heritage-brown">Select a program</option>
                                                <option value="workshop" className="bg-heritage-brown">Heritage Art Workshops</option>
                                                <option value="drishti" className="bg-heritage-brown">Drishti: Mindfulness & Wellness</option>
                                                <option value="csr" className="bg-heritage-brown">CSR Heritage Preservation</option>
                                                <option value="leadership" className="bg-heritage-brown">Leadership Through Heritage</option>
                                                <option value="immersion" className="bg-heritage-brown">Cultural Immersion</option>
                                                <option value="artisan" className="bg-heritage-brown">Artisan Partnership</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-sm font-light text-heritage-goldLight/80 mb-1.5 block">Team Size</label>
                                            <select
                                                name="teamSize"
                                                value={formData.teamSize}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white font-light focus:border-heritage-gold/50 focus:outline-none transition-colors"
                                            >
                                                <option value="" className="bg-heritage-brown">Select size</option>
                                                <option value="10-25" className="bg-heritage-brown">10–25 people</option>
                                                <option value="25-50" className="bg-heritage-brown">25–50 people</option>
                                                <option value="50-100" className="bg-heritage-brown">50–100 people</option>
                                                <option value="100+" className="bg-heritage-brown">100+ people</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-light text-heritage-goldLight/80 mb-1.5 block">Message / Requirements</label>
                                        <textarea
                                            name="message"
                                            value={formData.message}
                                            onChange={handleInputChange}
                                            rows={4}
                                            className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-heritage-goldLight/40 font-light focus:border-heritage-gold/50 focus:outline-none transition-colors resize-none"
                                            placeholder="Tell us about your goals and requirements..."
                                        />
                                    </div>

                                    {submitError && (
                                        <p className="text-sm text-red-400 text-center font-light">{submitError}</p>
                                    )}

                                    <div className="flex flex-wrap gap-4 justify-center pt-2">
                                        <Button size="lg" type="submit" disabled={submitting} className="bg-gradient-to-r from-heritage-gold to-amber-400 text-heritage-brown hover:shadow-xl transition-all duration-300 font-medium group">
                                            {submitting ? (
                                                <><Loader2 className="mr-2 w-5 h-5 animate-spin" /> Submitting...</>
                                            ) : (
                                                <><Send className="mr-2 w-5 h-5 group-hover:translate-x-1 transition-transform" /> Request Proposal</>
                                            )}
                                        </Button>
                                        <Link to="/contact">
                                            <Button variant="outline" size="lg" type="button" className="border-heritage-gold/50 text-heritage-goldLight hover:bg-heritage-gold/10 font-light">
                                                <Mail className="mr-2 w-5 h-5" /> Email Us
                                            </Button>
                                        </Link>
                                    </div>
                                    
                                    <div className="flex flex-wrap justify-center gap-6 text-sm font-light text-heritage-goldLight/70 pt-2">
                                        <span className="flex items-center gap-2">
                                            <Mail className="w-4 h-4" /> hello@adyomfoundation.org
                                        </span>
                                        <span className="flex items-center gap-2">
                                            <Phone className="w-4 h-4" /> +91 XXX-XXX-XXXX
                                        </span>
                                    </div>
                                </form>
                            </Card>
                        </motion.div>
                    )}
                </div>

                {/* Bottom Wave */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 80" className="w-full h-auto" preserveAspectRatio="none">
                        <path fill="#FAF5EE" d="M0,40 C480,80 960,0 1440,40 L1440,80 L0,80 Z" />
                    </svg>
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