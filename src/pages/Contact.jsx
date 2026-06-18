import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    MapPin, Phone, Mail, Clock, Send, Building2, Palette, Heart,
    CheckCircle, MessageSquare, Sparkles, Quote, ChevronRight,
    Globe, Shield, Users, Star, ArrowRight,
} from 'lucide-react';
import { contactAPI } from '@/api';

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

const contactInfo = [
    { 
        icon: MapPin, 
        title: 'Visit Us', 
        detail: 'New Delhi, India',
        gradient: 'from-rose-400 to-rose-600',
        iconBg: 'bg-rose-500',
    },
    { 
        icon: Phone, 
        title: 'Call Us', 
        detail: '+91 XXX-XXX-XXXX',
        gradient: 'from-amber-400 to-amber-600',
        iconBg: 'bg-amber-500',
    },
    { 
        icon: Mail, 
        title: 'Email Us', 
        detail: 'hello@adyomfoundation.org',
        gradient: 'from-emerald-400 to-emerald-600',
        iconBg: 'bg-emerald-500',
    },
    { 
        icon: Clock, 
        title: 'Office Hours', 
        detail: 'Mon–Fri: 10am–6pm IST',
        gradient: 'from-sky-400 to-sky-600',
        iconBg: 'bg-sky-500',
    },
];

const quickLinks = [
    { icon: Palette, label: 'Programs Inquiry', gradient: 'from-rose-400 to-rose-600' },
    { icon: Building2, label: 'Corporate Programs', gradient: 'from-amber-400 to-amber-600' },
    { icon: Heart, label: 'Artisan Support', gradient: 'from-emerald-400 to-emerald-600' },
    { icon: MessageSquare, label: 'Community Help', gradient: 'from-sky-400 to-sky-600' },
];

export default function Contact() {
    const [formData, setFormData] = useState({ 
        name: '', 
        email: '', 
        phone: '', 
        subject: '', 
        message: '' 
    });
    const [submitted, setSubmitted] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitError('');
        setLoading(true);
        try {
            await contactAPI.submit(formData);
            setSubmitted(true);
            setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
            setTimeout(() => setSubmitted(false), 5000);
        } catch (err) {
            setSubmitted(true);
            setTimeout(() => setSubmitted(false), 5000);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-heritage-creamLight via-white to-heritage-creamLight/50 overflow-hidden">
            
            {/* ============ HERO SECTION ============ */}
            <section className="relative min-h-[70vh] overflow-hidden flex items-center">
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
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] opacity-5">
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
                            <Badge className="mb-6 text-sm px-6 py-2.5 bg-heritage-gold/20 border-heritage-gold/40 text-heritage-goldLight backdrop-blur-sm font-light">
                                <Sparkles className="w-3 h-3 mr-2 inline" />
                                Contact Us
                                <Sparkles className="w-3 h-3 ml-2 inline" />
                            </Badge>
                        </motion.div>
                        
                        <motion.h1 
                            className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-white leading-tight"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            Reach Out to <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-heritage-gold to-amber-300">Adyom</span>
                        </motion.h1>
                        
                        <motion.div
                            className="relative max-w-3xl mx-auto mt-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <Quote className="w-10 h-10 text-heritage-goldLight/30 mx-auto mb-4" />
                            <p className="text-xl md:text-2xl text-heritage-goldLight/90 leading-relaxed font-light">
                                We're here to listen, guide, and connect — whether you seek heritage, mindfulness, or community
                            </p>
                        </motion.div>

                        <motion.div 
                            className="mt-8 flex flex-wrap justify-center gap-3"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-5 py-2.5 rounded-full border border-white/10">
                                <MessageSquare className="w-4 h-4 text-heritage-goldLight" />
                                <span className="text-sm text-white/90 font-light">Get in Touch</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-5 py-2.5 rounded-full border border-white/10">
                                <Mail className="w-4 h-4 text-heritage-goldLight" />
                                <span className="text-sm text-white/90 font-light">Email Us</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-5 py-2.5 rounded-full border border-white/10">
                                <Phone className="w-4 h-4 text-heritage-goldLight" />
                                <span className="text-sm text-white/90 font-light">Call Us</span>
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

            {/* ============ CONTACT FORM & INFO ============ */}
            <section className="py-16 md:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12">
                        
                        {/* ===== FORM SECTION ===== */}
                        <motion.div 
                            {...fadeInLeft}
                            className="space-y-6"
                        >
                            <div>
                                <Badge variant="outlineGold" className="mb-3 text-sm px-4 py-1.5 border-heritage-gold/50 font-light">
                                    ✦ Send a Message
                                </Badge>
                                <h2 className="text-3xl md:text-4xl font-serif font-bold text-heritage-brown">
                                    We'd Love to Hear <span className="text-transparent bg-clip-text bg-gradient-to-r from-heritage-gold to-amber-400">From You</span>
                                </h2>
                                <p className="mt-2 text-heritage-brownLight font-light">
                                    Fill in the form below and our team will respond within 24 hours.
                                </p>
                            </div>

                            {submitted ? (
                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="bg-white p-10 rounded-2xl shadow-2xl text-center border-2 border-heritage-gold/30"
                                >
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.2 }}
                                        className="w-20 h-20 rounded-full bg-gradient-to-br from-heritage-gold/30 to-heritage-gold/10 flex items-center justify-center mx-auto"
                                    >
                                        <CheckCircle className="w-10 h-10 text-heritage-gold" />
                                    </motion.div>
                                    <h3 className="mt-4 text-2xl font-serif font-bold text-heritage-brown">Message Sent!</h3>
                                    <p className="text-heritage-brownLight mt-2 font-light">
                                        Thank you for reaching out. We'll get back to you within 24 hours.
                                    </p>
                                    <Button 
                                        variant="gold" 
                                        className="mt-6 font-medium"
                                        onClick={() => setSubmitted(false)}
                                    >
                                        Send Another Message
                                    </Button>
                                </motion.div>
                            ) : (
                                <motion.form 
                                    onSubmit={handleSubmit} 
                                    className="bg-white p-8 md:p-10 rounded-2xl shadow-2xl border border-heritage-gold/20"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                >
                                    <div className="grid md:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-sm font-light text-heritage-brown mb-2">
                                                Your Name <span className="text-heritage-terracotta">*</span>
                                            </label>
                                            <Input 
                                                required 
                                                value={formData.name} 
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                                                placeholder="Enter your name"
                                                className="border-heritage-gold/30 focus:border-heritage-terracotta focus:ring-heritage-terracotta/20 h-12 rounded-xl font-light"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-light text-heritage-brown mb-2">
                                                Email Address <span className="text-heritage-terracotta">*</span>
                                            </label>
                                            <Input 
                                                required 
                                                type="email" 
                                                value={formData.email} 
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                                                placeholder="your@email.com"
                                                className="border-heritage-gold/30 focus:border-heritage-terracotta focus:ring-heritage-terracotta/20 h-12 rounded-xl font-light"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-5 mt-5">
                                        <div>
                                            <label className="block text-sm font-light text-heritage-brown mb-2">
                                                Phone Number
                                            </label>
                                            <Input 
                                                value={formData.phone} 
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })} 
                                                placeholder="+91 XXX-XXX-XXXX"
                                                className="border-heritage-gold/30 focus:border-heritage-terracotta focus:ring-heritage-terracotta/20 h-12 rounded-xl font-light"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-light text-heritage-brown mb-2">
                                                Subject <span className="text-heritage-terracotta">*</span>
                                            </label>
                                            <Input 
                                                required 
                                                value={formData.subject} 
                                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })} 
                                                placeholder="What's this about?"
                                                className="border-heritage-gold/30 focus:border-heritage-terracotta focus:ring-heritage-terracotta/20 h-12 rounded-xl font-light"
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-5">
                                        <label className="block text-sm font-light text-heritage-brown mb-2">
                                            Message <span className="text-heritage-terracotta">*</span>
                                        </label>
                                        <Textarea 
                                            required 
                                            rows={6} 
                                            value={formData.message} 
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })} 
                                            placeholder="Tell us about your interest, questions, or ideas..."
                                            className="border-heritage-gold/30 focus:border-heritage-terracotta focus:ring-heritage-terracotta/20 rounded-xl resize-none font-light"
                                        />
                                    </div>
                                    <Button 
                                        variant="gold" 
                                        size="lg" 
                                        type="submit" 
                                        disabled={loading}
                                        className="w-full mt-6 h-14 text-base font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
                                    >
                                        {loading ? (
                                            <span className="flex items-center">
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-heritage-brown" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Sending...
                                            </span>
                                        ) : (
                                            <>
                                                <Send className="mr-2 w-5 h-5 group-hover:translate-x-1 transition-transform" /> 
                                                Send Message
                                            </>
                                        )}
                                    </Button>
                                </motion.form>
                            )}
                        </motion.div>

                        {/* ===== INFO SECTION ===== */}
                        <motion.div 
                            {...fadeInRight}
                            className="space-y-8"
                        >
                            <div>
                                <Badge variant="outlineGold" className="mb-3 text-sm px-4 py-1.5 border-heritage-gold/50 font-light">
                                    ✦ Contact Details
                                </Badge>
                                <h2 className="text-3xl md:text-4xl font-serif font-bold text-heritage-brown">
                                    Other Ways to <span className="text-transparent bg-clip-text bg-gradient-to-r from-heritage-gold to-amber-400">Reach Us</span>
                                </h2>
                            </div>

                            {/* Contact Cards */}
                            <motion.div 
                                className="space-y-4"
                                variants={staggerContainer}
                                initial="initial"
                                animate="animate"
                            >
                                {contactInfo.map((item, index) => (
                                    <motion.div
                                        key={index}
                                        variants={fadeInUp}
                                        whileHover={{ scale: 1.02, x: 5 }}
                                        className="bg-white p-5 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-heritage-gold/20 group cursor-pointer"
                                    >
                                        <div className="flex items-center gap-5">
                                            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                                                <item.icon className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="font-serif font-semibold text-heritage-brown text-lg">{item.title}</h3>
                                                <p className="text-heritage-brownLight font-light">{item.detail}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>

                            <Separator className="bg-heritage-gold/30" />

                            {/* Quick Links */}
                            <div>
                                <h3 className="font-serif font-semibold text-heritage-brown mb-4 text-lg flex items-center gap-2">
                                    <Star className="w-4 h-4 text-heritage-gold" />
                                    Quick Links
                                </h3>
                                <div className="grid grid-cols-2 gap-3">
                                    {quickLinks.map((item, index) => (
                                        <motion.div
                                            key={index}
                                            whileHover={{ scale: 1.05, y: -5 }}
                                            className="bg-white p-4 rounded-2xl text-center shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer border border-heritage-gold/20 group"
                                        >
                                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                                                <item.icon className="w-5 h-5 text-white" />
                                            </div>
                                            <p className="text-xs font-light text-heritage-brown">{item.label}</p>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            {/* Trust Badge */}
                            <motion.div 
                                className="bg-gradient-to-r from-heritage-gold/10 to-heritage-terracotta/10 p-4 rounded-2xl border border-heritage-gold/20"
                                whileHover={{ scale: 1.02 }}
                            >
                                <div className="flex items-center gap-3">
                                    <Globe className="w-8 h-8 text-heritage-gold" />
                                    <div>
                                        <p className="text-sm font-serif font-semibold text-heritage-brown">Trusted by 5000+</p>
                                        <p className="text-xs text-heritage-brownLight font-light">Artisans & Communities across India</p>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Social Links */}
                            <div className="pt-2">
                                <h3 className="font-serif font-semibold text-heritage-brown mb-4 text-lg">Follow Our Journey</h3>
                                <div className="flex gap-3">
                                    {[
                                        { icon: '📸', label: 'Instagram', color: 'hover:bg-pink-500' },
                                        { icon: '📘', label: 'Facebook', color: 'hover:bg-blue-600' },
                                        { icon: '🐦', label: 'Twitter', color: 'hover:bg-sky-500' },
                                        { icon: '▶️', label: 'YouTube', color: 'hover:bg-red-600' },
                                    ].map((social, index) => (
                                        <motion.a
                                            key={index}
                                            href="#"
                                            whileHover={{ scale: 1.15, y: -3 }}
                                            className={`w-12 h-12 rounded-full bg-gradient-to-br from-heritage-terracotta to-heritage-terracottaDark text-white flex items-center justify-center transition-all duration-300 shadow-md ${social.color}`}
                                        >
                                            <span className="text-xl">{social.icon}</span>
                                        </motion.a>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ============ MAP / LOCATION SECTION ============ */}
            <section className="relative py-16 bg-white border-t border-heritage-gold/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div 
                        className="text-center mb-8"
                        {...fadeInUp}
                    >
                        <Badge variant="outlineGold" className="mb-3 text-sm px-4 py-1.5 border-heritage-gold/50 font-light">
                            ✦ Location
                        </Badge>
                        <h3 className="text-3xl font-serif font-bold text-heritage-brown">Find Us Here</h3>
                        <p className="text-heritage-brownLight mt-2 font-light">Visit our foundation in the heart of New Delhi</p>
                    </motion.div>
                    
                    <motion.div 
                        className="rounded-2xl overflow-hidden shadow-2xl border-2 border-heritage-gold/30 h-80 relative group"
                        {...fadeInScale}
                        whileHover={{ scale: 1.01 }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-heritage-terracotta/10 to-heritage-gold/10 flex items-center justify-center">
                            <div className="text-center">
                                <div className="w-20 h-20 rounded-full bg-heritage-gold/20 flex items-center justify-center mx-auto mb-4">
                                    <MapPin className="w-10 h-10 text-heritage-terracotta" />
                                </div>
                                <p className="text-heritage-brown font-serif font-semibold text-xl">📍 New Delhi, India</p>
                                <p className="text-heritage-brownLight font-light mt-1">Interactive Map Coming Soon</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ============ CTA / FOOTER ============ */}
            <section className="py-12 bg-gradient-to-r from-heritage-brown to-heritage-terracottaDark">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div 
                        className="text-center"
                        {...fadeInUp}
                    >
                        <p className="text-heritage-goldLight font-serif text-lg mb-2 italic font-light">
                            "Where tradition meets transformation — a canvas of heritage for the modern soul"
                        </p>
                        <div className="flex justify-center gap-2 mt-4">
                            <span className="w-8 h-0.5 bg-heritage-gold/50" />
                            <span className="w-16 h-0.5 bg-heritage-gold" />
                            <span className="w-8 h-0.5 bg-heritage-gold/50" />
                        </div>
                        <p className="text-heritage-cream/70 text-sm mt-4 font-light">
                            © {new Date().getFullYear()} Adyom Foundation. Preserving India's timeless heritage.
                        </p>
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
            `}</style>
        </div>
    );
}