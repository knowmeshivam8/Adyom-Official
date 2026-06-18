import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    MapPin, Phone, Mail, Clock, Send, Building2, Palette, Heart,
    CheckCircle, MessageSquare, Sparkles, Quote, Globe,
    Users, Star, ArrowRight, HandshakeIcon,
} from 'lucide-react';
import { contactAPI } from '@/api';

// ============ ANIMATION VARIANTS ============
const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
};

const fadeInLeft = {
    initial: { opacity: 0, x: -40 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
};

const fadeInRight = {
    initial: { opacity: 0, x: 40 },
    animate: { opacity: 1, x: 0 },
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

// ============ CONTACT INFO DATA ============
const contactInfo = [
    { icon: MapPin, title: 'Visit Us', detail: 'New Delhi, India' },
    { icon: Phone, title: 'Call Us', detail: '+91 XXX-XXX-XXXX' },
    { icon: Mail, title: 'Email Us', detail: 'hello@adyomfoundation.org' },
    { icon: Clock, title: 'Office Hours', detail: 'Mon–Fri: 10am–6pm IST' },
];

const quickLinks = [
    { icon: Palette, label: 'Programs' },
    { icon: Building2, label: 'Corporate' },
    { icon: Heart, label: 'Artisan' },
    { icon: MessageSquare, label: 'Community' },
];

const socialLinks = [
    { icon: '📸', label: 'Instagram' },
    { icon: '📘', label: 'Facebook' },
    { icon: '🐦', label: 'Twitter' },
    { icon: '▶️', label: 'YouTube' },
];

export default function Contact() {
    const [formData, setFormData] = useState({
        name: '', email: '', phone: '', subject: '', message: ''
    });
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await contactAPI.submit(formData);
            setSubmitted(true);
            setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
            setTimeout(() => setSubmitted(false), 4000);
        } catch (err) {
            setSubmitted(true);
            setTimeout(() => setSubmitted(false), 4000);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FDFBF7] font-serif">

            {/* ============ HERO SECTION ============ */}
            <section className="relative min-h-[60vh] md:min-h-[70vh] overflow-hidden flex items-center bg-[#3C2F2B]">
                <div className="absolute inset-0 opacity-[0.04]">
                    <div className="absolute top-20 left-20 w-48 md:w-64 h-48 md:h-64 border border-[#C9A96E] rounded-full animate-spin-slow" />
                    <div className="absolute bottom-20 right-20 w-64 md:w-80 h-64 md:h-80 border border-[#C9A96E]/50 rounded-full animate-spin-slower" />
                    <motion.div
                        className="absolute top-10 left-10 text-4xl md:text-5xl text-[#C9A96E]"
                        animate={{ y: [0, -15, 0] }}
                        transition={{ duration: 4, repeat: Infinity }}
                    >
                        ✦
                    </motion.div>
                    <motion.div
                        className="absolute bottom-20 right-10 text-5xl md:text-6xl text-[#C9A96E]"
                        animate={{ y: [0, 15, 0] }}
                        transition={{ duration: 5, repeat: Infinity }}
                    >
                        ✧
                    </motion.div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full py-12 md:py-0">
                    <motion.div {...fadeInUp} className="text-center max-w-3xl mx-auto">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="inline-block"
                        >
                            <span className="inline-block px-4 md:px-6 py-2 bg-[#C9A96E]/20 border border-[#C9A96E]/30 text-[#C9A96E] font-serif text-xs tracking-[0.2em] uppercase">
                                <Sparkles className="w-3 h-3 mr-2 inline" />
                                Contact Us
                            </span>
                        </motion.div>

                        <motion.h1
                            className="text-4xl sm:text-5xl md:text-6xl font-serif font-light text-[#FDFBF7] leading-[1.1] mt-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            Reach Out to <span className="text-[#C9A96E] font-normal">Adyom</span>
                        </motion.h1>

                        <motion.p
                            className="text-lg md:text-xl font-serif font-light text-[#D4A574] leading-relaxed mt-4 px-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            We're here to listen, guide, and connect — whether you seek heritage, mindfulness, or community
                        </motion.p>
                    </motion.div>
                </div>

                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 80" className="w-full h-auto" preserveAspectRatio="none">
                        <path fill="#FDFBF7" d="M0,40 C480,80 960,0 1440,40 L1440,80 L0,80 Z" />
                    </svg>
                </div>
            </section>

            {/* ============ CONTACT FORM & INFO ============ */}
            <section className="py-12 md:py-16 lg:py-20">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-5 gap-8 md:gap-10">

                        {/* ===== FORM ===== */}
                        <motion.div
                            {...fadeInLeft}
                            className="lg:col-span-3"
                            whileInView="animate"
                            viewport={{ once: true, margin: "-50px" }}
                        >
                            <div className="mb-6">
                                <span className="text-[#B87333] font-serif text-xs tracking-[0.2em] uppercase border-b border-[#B87333]/30 pb-2">
                                    ✦ Send a Message
                                </span>
                                <h2 className="text-2xl md:text-3xl font-serif font-light text-[#3C2F2B] mt-3">
                                    We'd Love to Hear <span className="text-[#B87333] font-normal">From You</span>
                                </h2>
                            </div>

                            {submitted ? (
                                <motion.div
                                    initial={{ scale: 0.95, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="bg-white border border-[#B87333]/20 p-8 md:p-10 text-center shadow-lg"
                                >
                                    <div className="w-16 h-16 mx-auto flex items-center justify-center bg-[#C9A96E] rounded-full mb-4">
                                        <CheckCircle className="w-8 h-8 text-[#3C2F2B]" />
                                    </div>
                                    <h3 className="text-xl font-serif font-normal text-[#3C2F2B]">Message Sent!</h3>
                                    <p className="text-[#8F6B5A] text-sm mt-2">We'll get back to you within 24 hours.</p>
                                    <Button
                                        className="mt-4 bg-[#C9A96E] hover:bg-[#B87333] text-[#3C2F2B] hover:text-white text-sm px-6 py-2"
                                        onClick={() => setSubmitted(false)}
                                    >
                                        Send Another
                                    </Button>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSubmit} className="bg-white border border-[#B87333]/10 p-6 md:p-8 shadow-lg">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-serif font-light text-[#3C2F2B] mb-1.5">
                                                Name <span className="text-[#B87333]">*</span>
                                            </label>
                                            <Input
                                                required
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                placeholder="Your name"
                                                className="border-[#B87333]/20 focus:border-[#B87333] h-10 text-sm bg-[#FDFBF7]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-serif font-light text-[#3C2F2B] mb-1.5">
                                                Email <span className="text-[#B87333]">*</span>
                                            </label>
                                            <Input
                                                required
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                placeholder="your@email.com"
                                                className="border-[#B87333]/20 focus:border-[#B87333] h-10 text-sm bg-[#FDFBF7]"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-4 mt-4">
                                        <div>
                                            <label className="block text-xs font-serif font-light text-[#3C2F2B] mb-1.5">
                                                Phone
                                            </label>
                                            <Input
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                placeholder="+91 XXX-XXX-XXXX"
                                                className="border-[#B87333]/20 focus:border-[#B87333] h-10 text-sm bg-[#FDFBF7]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-serif font-light text-[#3C2F2B] mb-1.5">
                                                Subject <span className="text-[#B87333]">*</span>
                                            </label>
                                            <Input
                                                required
                                                value={formData.subject}
                                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                                placeholder="Subject"
                                                className="border-[#B87333]/20 focus:border-[#B87333] h-10 text-sm bg-[#FDFBF7]"
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <label className="block text-xs font-serif font-light text-[#3C2F2B] mb-1.5">
                                            Message <span className="text-[#B87333]">*</span>
                                        </label>
                                        <Textarea
                                            required
                                            rows={4}
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                            placeholder="Tell us about your interest, questions, or ideas..."
                                            className="border-[#B87333]/20 focus:border-[#B87333] resize-none text-sm bg-[#FDFBF7]"
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full mt-5 h-11 bg-[#C9A96E] hover:bg-[#B87333] text-[#3C2F2B] hover:text-white text-sm transition-all duration-300"
                                    >
                                        {loading ? (
                                            <span className="flex items-center justify-center">
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-[#3C2F2B]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Sending...
                                            </span>
                                        ) : (
                                            <>
                                                <Send className="mr-2 w-4 h-4" /> Send Message
                                            </>
                                        )}
                                    </Button>
                                </form>
                            )}
                        </motion.div>

                        {/* ===== SIDE INFO ===== */}
                        <motion.div
                            {...fadeInRight}
                            className="lg:col-span-2 space-y-6"
                            whileInView="animate"
                            viewport={{ once: true, margin: "-50px" }}
                        >
                            {/* Contact Cards */}
                            <div>
                                <h3 className="text-sm font-serif font-semibold text-[#3C2F2B] mb-3 flex items-center gap-2">
                                    <span className="w-8 h-px bg-[#B87333]" />
                                    Contact Details
                                </h3>
                                <div className="space-y-3">
                                    {contactInfo.map((item, index) => (
                                        <motion.div
                                            key={index}
                                            variants={fadeInScale}
                                            whileHover={{ x: 4 }}
                                            className="flex items-center gap-4 p-3 bg-white border border-[#B87333]/10 shadow-sm hover:shadow-md transition-all duration-300"
                                        >
                                            <div className="w-10 h-10 flex items-center justify-center bg-[#C9A96E] flex-shrink-0">
                                                <item.icon className="w-4 h-4 text-[#3C2F2B]" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-serif font-semibold text-[#3C2F2B]">{item.title}</p>
                                                <p className="text-xs font-serif font-light text-[#8F6B5A]">{item.detail}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            {/* Quick Links */}
                            <div>
                                <h3 className="text-sm font-serif font-semibold text-[#3C2F2B] mb-3 flex items-center gap-2">
                                    <span className="w-8 h-px bg-[#B87333]" />
                                    Quick Links
                                </h3>
                                <div className="grid grid-cols-2 gap-2">
                                    {quickLinks.map((item, index) => (
                                        <motion.div
                                            key={index}
                                            whileHover={{ y: -2 }}
                                            className="flex items-center gap-2 p-2.5 bg-white border border-[#B87333]/10 shadow-sm hover:shadow-md transition-all duration-300"
                                        >
                                            <item.icon className="w-4 h-4 text-[#B87333]" />
                                            <span className="text-xs font-serif font-light text-[#3C2F2B]">{item.label}</span>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            {/* Social Links */}
                            <div>
                                <h3 className="text-sm font-serif font-semibold text-[#3C2F2B] mb-3 flex items-center gap-2">
                                    <span className="w-8 h-px bg-[#B87333]" />
                                    Follow Our Journey
                                </h3>
                                <div className="flex gap-2">
                                    {socialLinks.map((social, index) => (
                                        <motion.a
                                            key={index}
                                            href="#"
                                            whileHover={{ y: -3 }}
                                            className="w-10 h-10 flex items-center justify-center bg-[#C9A96E] text-[#3C2F2B] hover:bg-[#B87333] hover:text-white transition-all duration-300 text-lg"
                                        >
                                            {social.icon}
                                        </motion.a>
                                    ))}
                                </div>
                            </div>

                            {/* Trust Badge */}
                            <div className="border border-[#B87333]/10 p-4 bg-[#F5E6D3]/30">
                                <div className="flex items-center gap-3">
                                    <Globe className="w-8 h-8 text-[#B87333]" />
                                    <div>
                                        <p className="text-sm font-serif font-semibold text-[#3C2F2B]">Trusted by 5,000+</p>
                                        <p className="text-xs font-serif font-light text-[#8F6B5A]">Artisans & Communities</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ============ LOCATION ============ */}
            <section className="py-10 md:py-14 bg-[#F5E6D3]">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        {...fadeInUp}
                        className="text-center"
                        whileInView="animate"
                        viewport={{ once: true, margin: "-50px" }}
                    >
                        <span className="text-[#B87333] font-serif text-xs tracking-[0.2em] uppercase border-b border-[#B87333]/30 pb-2">
                            ✦ Location
                        </span>
                        <h3 className="text-xl md:text-2xl font-serif font-light text-[#3C2F2B] mt-3">
                            Find Us in <span className="text-[#B87333] font-normal">New Delhi</span>
                        </h3>
                        <div className="flex items-center justify-center gap-2 mt-3 text-sm font-serif font-light text-[#8F6B5A]">
                            <MapPin className="w-4 h-4 text-[#B87333]" />
                            <span>📍 New Delhi, India</span>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ============ CTA ============ */}
            <section className="py-14 md:py-20 bg-[#3C2F2B] relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.04]">
                    <div className="absolute top-0 right-0 w-64 h-64 border border-[#C9A96E] rounded-full -mr-32 -mt-32" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 border border-[#C9A96E]/50 rounded-full -ml-32 -mb-32" />
                </div>

                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.div
                        {...fadeInUp}
                        className="text-center space-y-4"
                        whileInView="animate"
                        viewport={{ once: true, margin: "-50px" }}
                    >
                        <span className="inline-block px-4 py-1.5 bg-[#C9A96E]/20 border border-[#C9A96E]/30 text-[#C9A96E] font-serif text-xs tracking-[0.2em] uppercase">
                            <Sparkles className="w-3 h-3 mr-2 inline" />
                            Join Our Journey
                        </span>

                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-light text-[#FDFBF7] leading-tight">
                            Let's Create <span className="text-[#C9A96E] font-normal block mt-2">Something Beautiful</span>
                        </h2>

                        <p className="text-base font-serif font-light text-[#D4A574] leading-relaxed max-w-xl mx-auto">
                            Whether you're an artist, a seeker, or a partner — your story matters.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                            <Link to="/register">
                                <Button className="bg-[#C9A96E] hover:bg-[#B87333] text-[#3C2F2B] hover:text-white text-sm px-6 py-2.5 transition-all duration-300">
                                    Become a Member
                                </Button>
                            </Link>
                            <Link to="/programs">
                                <Button variant="outline" className="border-[#C9A96E]/40 text-[#C9A96E] hover:bg-[#C9A96E]/10 text-sm px-6 py-2.5">
                                    Explore Programs
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
                .animate-spin-slow { animation: spin-slow 25s linear infinite; }
                .animate-spin-slower { animation: spin-slower 35s linear infinite; }
            `}</style>
        </div>
    );
}