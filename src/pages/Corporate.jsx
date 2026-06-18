import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
    ArrowRight, Building2, Heart, Users, Lightbulb, Award, Palette,
    Target, Globe, HandHeart, Star, CheckCircle, Mail, Phone, Loader2, Send,
    Sparkles, Quote, Crown, Gift, Shield, Zap, Compass, Leaf, Infinity,
    ChevronRight, TrendingUp, Briefcase, Calendar, Clock
} from 'lucide-react';
import { corporateAPI } from '@/api';

// ============ ANIMATIONS ============
const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
};

const fadeInScale = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
};

const staggerContainer = {
    animate: {
        transition: { staggerChildren: 0.06 },
    },
};

// ============ DATA ============
const offerings = [
    { icon: Palette, title: 'Heritage Art Workshops', desc: 'Team-building through traditional Indian art' },
    { icon: Lightbulb, title: 'Mindfulness & Wellness', desc: 'Corporate mindfulness rooted in ancient practices' },
    { icon: Heart, title: 'CSR Heritage Preservation', desc: 'Fund and participate in heritage projects' },
    { icon: Users, title: 'Leadership Through Heritage', desc: 'Leadership workshops from Indian philosophy' },
    { icon: Globe, title: 'Cultural Immersion', desc: 'Heritage tours and cultural awareness' },
    { icon: HandHeart, title: 'Artisan Partnership', desc: 'Direct partnership with traditional artisans' },
];

const benefits = [
    { icon: Users, title: 'Team Cohesion' },
    { icon: Heart, title: 'Employee Wellness' },
    { icon: Target, title: 'Meaningful CSR' },
    { icon: Globe, title: 'Cultural Awareness' },
    { icon: Award, title: 'Brand Narrative' },
    { icon: TrendingUp, title: 'Employee Retention' },
];

const partners = [
    { name: 'TechCorp India', program: 'CSR Preservation', initials: 'T' },
    { name: 'DesignStudio', program: 'Wellness Program', initials: 'D' },
    { name: 'FinanceGroup', program: 'Leadership', initials: 'F' },
    { name: 'MediaHouse', program: 'Immersion', initials: 'M' },
    { name: 'StartupHub', program: 'Partnership', initials: 'S' },
];

const stats = [
    { number: '25+', label: 'Partners', icon: Building2 },
    { number: '50+', label: 'Programs', icon: Calendar },
    { number: '1000+', label: 'Impacted', icon: Users },
    { number: '95%', label: 'Satisfaction', icon: Star },
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
        <div className="min-h-screen bg-[#FDFBF7] font-serif">

            {/* ============ HERO ============ */}
            <section className="relative min-h-[50vh] md:min-h-[55vh] overflow-hidden flex items-center bg-[#3C2F2B]">
                <div className="absolute inset-0 opacity-[0.03] hidden md:block">
                    <div className="absolute top-20 left-20 w-40 h-40 border border-[#C9A96E] rounded-full animate-spin-slow" />
                    <div className="absolute bottom-20 right-20 w-56 h-56 border border-[#C9A96E]/50 rounded-full animate-spin-slower" />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full py-10 md:py-14">
                    <motion.div {...fadeInUp} className="text-center max-w-3xl mx-auto">
                        <span className="inline-block px-3 md:px-4 py-1 bg-[#C9A96E]/20 border border-[#C9A96E]/30 text-[#C9A96E] font-serif text-xs md:text-sm tracking-[0.15em] uppercase">
                            Corporate & CSR
                        </span>

                        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-light text-[#FDFBF7] leading-[1.15] mt-3">
                            Heritage for the <br className="sm:hidden" />
                            <span className="text-[#C9A96E] font-normal">Modern Workplace</span>
                        </h1>

                        <p className="text-sm md:text-base font-serif font-light text-[#D4A574] mt-3 px-4 leading-relaxed">
                            Transform your organization through India's timeless heritage — team building, wellness, CSR, and leadership.
                        </p>

                        <div className="mt-5 flex flex-wrap justify-center gap-2">
                            <span className="flex items-center gap-1.5 px-3 py-1 border border-white/10 bg-white/5 text-[#D4A574] font-serif text-xs md:text-sm">
                                <Briefcase className="w-3 h-3 text-[#C9A96E]" />
                                Corporate Programs
                            </span>
                            <span className="flex items-center gap-1.5 px-3 py-1 border border-white/10 bg-white/5 text-[#D4A574] font-serif text-xs md:text-sm">
                                <Heart className="w-3 h-3 text-[#C9A96E]" />
                                CSR Initiatives
                            </span>
                            <span className="flex items-center gap-1.5 px-3 py-1 border border-white/10 bg-white/5 text-[#D4A574] font-serif text-xs md:text-sm">
                                <Users className="w-3 h-3 text-[#C9A96E]" />
                                Team Building
                            </span>
                        </div>

                        <div className="mt-5 flex flex-col sm:flex-row gap-2 justify-center">
                            <Link to="#inquiry">
                                <Button className="bg-[#C9A96E] hover:bg-[#B87333] text-[#3C2F2B] hover:text-white text-sm md:text-base px-5 md:px-6 py-2 md:py-2.5">
                                    Get a Proposal
                                    <ArrowRight className="ml-1.5 w-4 h-4" />
                                </Button>
                            </Link>
                            <Button variant="outline" className="border-[#C9A96E]/40 text-[#FDFBF7] hover:bg-[#C9A96E]/10 text-sm md:text-base px-5 md:px-6 py-2 md:py-2.5">
                                Download Brochure
                            </Button>
                        </div>
                    </motion.div>
                </div>

                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 30" className="w-full h-auto" preserveAspectRatio="none">
                        <path fill="#FDFBF7" d="M0,20 C480,40 960,0 1440,20 L1440,30 L0,30 Z" />
                    </svg>
                </div>
            </section>

            {/* ============ STATS ============ */}
            <section className="relative -mt-3 md:-mt-4 z-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-[#FDFBF7] border border-[#B87333]/10 p-3 text-center shadow-sm"
                            >
                                <p className="text-base md:text-lg font-serif font-normal text-[#3C2F2B]">{stat.number}</p>
                                <p className="text-[10px] md:text-xs font-serif font-light text-[#8F6B5A] uppercase tracking-wider">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============ OFFERINGS ============ */}
            <section className="py-10 md:py-14">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-8">
                        <span className="text-[#B87333] font-serif text-xs md:text-sm tracking-[0.2em] uppercase border-b border-[#B87333]/30 pb-1">
                            ✦ Our Offerings
                        </span>
                        <h2 className="text-xl md:text-2xl lg:text-3xl font-serif font-light text-[#3C2F2B] mt-2">
                            Heritage Programs for <span className="text-[#B87333] font-normal">Organizations</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {offerings.map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="border border-[#B87333]/10 p-4 bg-white shadow-sm hover:shadow-md transition-all duration-300"
                            >
                                <div className="w-10 h-10 flex items-center justify-center bg-[#C9A96E] mb-2">
                                    <item.icon className="w-4 h-4 text-[#3C2F2B]" />
                                </div>
                                <h3 className="text-sm md:text-base font-serif font-normal text-[#3C2F2B]">{item.title}</h3>
                                <p className="text-xs md:text-sm font-serif font-light text-[#6B5B4B] mt-0.5">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============ BENEFITS ============ */}
            <section className="py-10 md:py-14 bg-[#F5E6D3]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-8">
                        <span className="text-[#B87333] font-serif text-xs md:text-sm tracking-[0.2em] uppercase border-b border-[#B87333]/30 pb-1">
                            ✦ Why Heritage?
                        </span>
                        <h2 className="text-xl md:text-2xl lg:text-3xl font-serif font-light text-[#3C2F2B] mt-2">
                            Benefits for <span className="text-[#B87333] font-normal">Your Organization</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
                        {benefits.map((b, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.04 }}
                                className="bg-[#FDFBF7] border border-[#B87333]/10 p-3 text-center shadow-sm hover:shadow-md transition-all duration-300"
                            >
                                <div className="w-8 h-8 mx-auto flex items-center justify-center bg-[#C9A96E] mb-1.5">
                                    <b.icon className="w-3.5 h-3.5 text-[#3C2F2B]" />
                                </div>
                                <p className="text-xs md:text-sm font-serif font-normal text-[#3C2F2B]">{b.title}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============ HOW IT WORKS ============ */}
            <section className="py-10 md:py-14">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-8">
                        <span className="text-[#B87333] font-serif text-xs md:text-sm tracking-[0.2em] uppercase border-b border-[#B87333]/30 pb-1">
                            ✦ How It Works
                        </span>
                        <h2 className="text-xl md:text-2xl lg:text-3xl font-serif font-light text-[#3C2F2B] mt-2">
                            Simple <span className="text-[#B87333] font-normal">4-Step Process</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {[
                            { step: '1', title: 'Share Goals', desc: 'Tell us your needs' },
                            { step: '2', title: 'Custom Proposal', desc: 'We design a program' },
                            { step: '3', title: 'Program Delivery', desc: 'Expert-led workshops' },
                            { step: '4', title: 'Impact', desc: 'Measure outcomes' },
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.06 }}
                                className="border border-[#B87333]/10 p-4 text-center bg-white shadow-sm hover:shadow-md transition-all duration-300"
                            >
                                <div className="w-10 h-10 mx-auto flex items-center justify-center bg-[#C9A96E] mb-2">
                                    <span className="text-sm md:text-base font-serif font-bold text-[#3C2F2B]">{item.step}</span>
                                </div>
                                <h3 className="text-sm md:text-base font-serif font-normal text-[#3C2F2B]">{item.title}</h3>
                                <p className="text-xs md:text-sm font-serif font-light text-[#6B5B4B] mt-0.5">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============ PARTNERS ============ */}
            <section className="py-10 md:py-14 bg-[#F5E6D3]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-8">
                        <span className="text-[#B87333] font-serif text-xs md:text-sm tracking-[0.2em] uppercase border-b border-[#B87333]/30 pb-1">
                            ✦ Trusted Partners
                        </span>
                        <h2 className="text-xl md:text-2xl lg:text-3xl font-serif font-light text-[#3C2F2B] mt-2">
                            Organizations That <span className="text-[#B87333] font-normal">Trust Adyom</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                        {partners.map((p, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="bg-[#FDFBF7] border border-[#B87333]/10 p-3 text-center shadow-sm hover:shadow-md transition-all duration-300"
                            >
                                <div className="w-10 h-10 mx-auto flex items-center justify-center bg-[#C9A96E] text-[#3C2F2B] font-serif text-sm md:text-base font-normal">
                                    {p.initials}
                                </div>
                                <p className="text-xs md:text-sm font-serif font-normal text-[#3C2F2B] mt-1">{p.name}</p>
                                <p className="text-[10px] md:text-xs font-serif font-light text-[#8F6B5A]">{p.program}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============ INQUIRY FORM ============ */}
            <section id="inquiry" className="py-10 md:py-14 bg-[#3C2F2B]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-8">
                        <span className="text-[#C9A96E] font-serif text-xs md:text-sm tracking-[0.2em] uppercase border-b border-[#C9A96E]/30 pb-1">
                            ✦ Get Started
                        </span>
                        <h2 className="text-xl md:text-2xl lg:text-3xl font-serif font-light text-[#FDFBF7] mt-2">
                            Transform Your Organization with <span className="text-[#C9A96E] font-normal">Heritage</span>
                        </h2>
                        <p className="text-xs md:text-sm font-serif font-light text-[#D4A574] mt-1">Get a custom proposal tailored to your goals</p>
                    </div>

                    {submitted ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="max-w-lg mx-auto text-center py-10 border border-[#C9A96E]/20 bg-[#C9A96E]/5 p-8"
                        >
                            <div className="w-16 h-16 mx-auto flex items-center justify-center bg-[#C9A96E] mb-4">
                                <CheckCircle className="w-8 h-8 text-[#3C2F2B]" />
                            </div>
                            <h3 className="text-xl md:text-2xl font-serif font-light text-[#FDFBF7]">Inquiry Submitted!</h3>
                            <p className="text-xs md:text-sm font-serif font-light text-[#D4A574] mt-2 leading-relaxed">
                                Thank you for your interest. Our team will reach out within 24 hours with a custom proposal.
                            </p>
                            <Link to="/contact">
                                <Button className="mt-4 bg-[#C9A96E] hover:bg-[#B87333] text-[#3C2F2B] hover:text-white text-sm md:text-base px-5 md:px-6 py-2 md:py-2.5">
                                    Contact Us
                                </Button>
                            </Link>
                        </motion.div>
                    ) : (
                        <motion.div
                            {...fadeInUp}
                            className="max-w-2xl mx-auto"
                        >
                            <form onSubmit={handleSubmit} className="border border-[#C9A96E]/20 bg-[#C9A96E]/5 p-6 md:p-8">
                                <div className="grid md:grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-xs md:text-sm font-serif font-light text-[#D4A574] mb-1 block">Organization *</label>
                                        <input
                                            name="organization"
                                            value={formData.organization}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-3 py-2 border border-[#C9A96E]/20 bg-[#FDFBF7]/10 text-[#FDFBF7] placeholder:text-[#D4A574]/40 font-serif text-sm md:text-base focus:border-[#C9A96E] focus:outline-none"
                                            placeholder="Company name"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs md:text-sm font-serif font-light text-[#D4A574] mb-1 block">Contact Person *</label>
                                        <input
                                            name="contactName"
                                            value={formData.contactName}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-3 py-2 border border-[#C9A96E]/20 bg-[#FDFBF7]/10 text-[#FDFBF7] placeholder:text-[#D4A574]/40 font-serif text-sm md:text-base focus:border-[#C9A96E] focus:outline-none"
                                            placeholder="Full name"
                                        />
                                    </div>
                                </div>
                                <div className="grid md:grid-cols-2 gap-3 mt-3">
                                    <div>
                                        <label className="text-xs md:text-sm font-serif font-light text-[#D4A574] mb-1 block">Email *</label>
                                        <input
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-3 py-2 border border-[#C9A96E]/20 bg-[#FDFBF7]/10 text-[#FDFBF7] placeholder:text-[#D4A574]/40 font-serif text-sm md:text-base focus:border-[#C9A96E] focus:outline-none"
                                            placeholder="you@company.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs md:text-sm font-serif font-light text-[#D4A574] mb-1 block">Phone</label>
                                        <input
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-[#C9A96E]/20 bg-[#FDFBF7]/10 text-[#FDFBF7] placeholder:text-[#D4A574]/40 font-serif text-sm md:text-base focus:border-[#C9A96E] focus:outline-none"
                                            placeholder="+91 XXX-XXX-XXXX"
                                        />
                                    </div>
                                </div>
                                <div className="grid md:grid-cols-2 gap-3 mt-3">
                                    <div>
                                        <label className="text-xs md:text-sm font-serif font-light text-[#D4A574] mb-1 block">Program Interest *</label>
                                        <select
                                            name="programInterest"
                                            value={formData.programInterest}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-3 py-2 border border-[#C9A96E]/20 bg-[#FDFBF7]/10 text-[#FDFBF7] font-serif text-sm md:text-base focus:border-[#C9A96E] focus:outline-none"
                                        >
                                            <option value="" className="bg-[#3C2F2B]">Select a program</option>
                                            <option value="workshop" className="bg-[#3C2F2B]">Heritage Art Workshops</option>
                                            <option value="drishti" className="bg-[#3C2F2B]">Mindfulness & Wellness</option>
                                            <option value="csr" className="bg-[#3C2F2B]">CSR Preservation</option>
                                            <option value="leadership" className="bg-[#3C2F2B]">Leadership Programs</option>
                                            <option value="immersion" className="bg-[#3C2F2B]">Cultural Immersion</option>
                                            <option value="artisan" className="bg-[#3C2F2B]">Artisan Partnership</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs md:text-sm font-serif font-light text-[#D4A574] mb-1 block">Team Size</label>
                                        <select
                                            name="teamSize"
                                            value={formData.teamSize}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-[#C9A96E]/20 bg-[#FDFBF7]/10 text-[#FDFBF7] font-serif text-sm md:text-base focus:border-[#C9A96E] focus:outline-none"
                                        >
                                            <option value="" className="bg-[#3C2F2B]">Select size</option>
                                            <option value="10-25" className="bg-[#3C2F2B]">10–25 people</option>
                                            <option value="25-50" className="bg-[#3C2F2B]">25–50 people</option>
                                            <option value="50-100" className="bg-[#3C2F2B]">50–100 people</option>
                                            <option value="100+" className="bg-[#3C2F2B]">100+ people</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="mt-3">
                                    <label className="text-xs md:text-sm font-serif font-light text-[#D4A574] mb-1 block">Message</label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-[#C9A96E]/20 bg-[#FDFBF7]/10 text-[#FDFBF7] placeholder:text-[#D4A574]/40 font-serif text-sm md:text-base focus:border-[#C9A96E] focus:outline-none resize-none"
                                        placeholder="Tell us about your goals and requirements..."
                                    />
                                </div>

                                {submitError && (
                                    <p className="text-xs md:text-sm text-[#D4A574] text-center mt-2">{submitError}</p>
                                )}

                                <div className="flex flex-wrap gap-3 justify-center mt-4">
                                    <Button type="submit" disabled={submitting} className="bg-[#C9A96E] hover:bg-[#B87333] text-[#3C2F2B] hover:text-white text-sm md:text-base px-5 md:px-6 py-2 md:py-2.5">
                                        {submitting ? (
                                            <><Loader2 className="mr-1.5 w-4 h-4 animate-spin" /> Submitting...</>
                                        ) : (
                                            <><Send className="mr-1.5 w-4 h-4" /> Request Proposal</>
                                        )}
                                    </Button>
                                    <Link to="/contact">
                                        <Button variant="outline" className="border-[#C9A96E]/40 text-[#FDFBF7] hover:bg-[#C9A96E]/10 text-sm md:text-base px-5 md:px-6 py-2 md:py-2.5">
                                            <Mail className="mr-1.5 w-4 h-4" /> Email Us
                                        </Button>
                                    </Link>
                                </div>

                                <div className="flex flex-wrap justify-center gap-4 text-xs md:text-sm font-serif font-light text-[#D4A574]/60 mt-4">
                                    <span className="flex items-center gap-1.5">
                                        <Mail className="w-3 h-3" /> hello@adyomfoundation.org
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <Phone className="w-3 h-3" /> +91 XXX-XXX-XXXX
                                    </span>
                                </div>
                            </form>
                        </motion.div>
                    )}
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