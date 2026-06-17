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
} from 'lucide-react';
import { corporateAPI } from '@/api';

const fadeInUp = { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6 } };

const offerings = [
    { icon: Palette, title: 'Heritage Art Workshops', desc: 'Team-building through traditional Indian art — Madhubani, pottery, block printing, and more.' },
    { icon: Lightbulb, title: 'Drishti: Mindfulness & Wellness', desc: 'Corporate mindfulness sessions rooted in ancient Indian meditation and breathing practices.' },
    { icon: Heart, title: 'CSR Heritage Preservation', desc: 'Fund and participate in heritage preservation projects — artisan support, cultural documentation, and restoration.' },
    { icon: Users, title: 'Leadership Through Heritage', desc: 'Unique leadership workshops drawing from Indian philosophical traditions and heritage wisdom.' },
    { icon: Globe, title: 'Cultural Immersion Experiences', desc: 'Curated heritage tours and cultural immersion programs for team development and cultural awareness.' },
    { icon: HandHeart, title: 'Artisan Partnership Programs', desc: 'Direct partnership with traditional artisans — sponsor craft preservation, provide market access.' },
];

const benefits = [
    'Enhanced team cohesion through shared creative experiences',
    'Employee wellness and stress reduction through mindfulness',
    'Meaningful CSR aligned with heritage preservation',
    'Cultural sensitivity and diversity awareness',
    'Unique brand narrative through heritage engagement',
    'Measurable impact on employee satisfaction and retention',
];

const partners = [
    'TechCorp India — CSR Heritage Preservation',
    'DesignStudio — Employee Wellness Program',
    'FinanceGroup — Leadership Through Heritage',
    'MediaHouse — Cultural Immersion Experience',
    'StartupHub — Artisan Partnership Initiative',
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
            // Still show success for demo if backend is unavailable
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
        <div className="overflow-hidden">
            {/* Hero */}
            <section className="relative py-20 md:py-32 bg-heritage-terracotta">
                <div className="absolute inset-0 opacity-5 mandala-bg" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.div {...fadeInUp} className="text-center max-w-3xl mx-auto space-y-6">
                        <Badge variant="gold" className="text-sm px-4 py-1">✦ Corporate & CSR Programs</Badge>
                        <h1 className="text-4xl md:text-5xl font-heading font-bold text-text-main">
                            Heritage for the <span className="text-gradient-gold">Modern Workplace</span>
                        </h1>
                        <p className="text-xl font-accent text-text-main italic leading-relaxed">
                            Transform your organization through India's timeless heritage — team building, wellness,
                            CSR, and leadership programs rooted in cultural wisdom.
                        </p>
                        <div className="flex flex-wrap gap-4 justify-center">
                            <Link to="/contact"><Button variant="gold" size="xl">Get a Custom Proposal <ArrowRight className="ml-2 w-5 h-5" /></Button></Link>
                            <Button variant="outlineGold" size="xl">Download Brochure</Button>
                        </div>
                    </motion.div>
                </div>
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 80" className="w-full h-auto"><path fill="#FFFDF5" d="M0,40 C480,80 960,0 1440,40 L1440,80 L0,80 Z" /></svg>
                </div>
            </section>

            {/* Offerings */}
            <section className="py-16 md:py-24 bg-heritage-creamLight">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div {...fadeInUp} className="text-center mb-12">
                        <Badge variant="outlineGold" className="mb-4">✦ Our Offerings</Badge>
                        <h2 className="text-3xl font-heading font-bold text-heritage-terracottaDark">Heritage Programs for Organizations</h2>
                        <Separator className="w-24 mx-auto mt-6" />
                    </motion.div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {offerings.map((item, i) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                                <Card className="p-6 space-y-4 hover:shadow-lg transition-shadow">
                                    <div className="w-12 h-12 rounded-lg bg-heritage-terracotta flex items-center justify-center text-heritage-cream">
                                        <item.icon className="w-6 h-6" />
                                    </div>
                                    <h3 className="font-heading font-semibold text-heritage-terracottaDark">{item.title}</h3>
                                    <p className="font-body text-sm text-text-main leading-relaxed">{item.desc}</p>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits */}
            <section className="py-16 md:py-20 bg-heritage-terracotta">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.div {...fadeInUp} className="text-center mb-10">
                        <Badge variant="gold" className="mb-4">✦ Why Heritage?</Badge>
                        <h2 className="text-3xl font-heading font-bold text-text-main">Benefits for Your Organization</h2>
                    </motion.div>
                    <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
                        {benefits.map((b, i) => (
                            <motion.div key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                                <div className="flex items-start gap-2 p-3 bg-heritage-terracottaLight/50 rounded-lg">
                                    <CheckCircle className="w-5 h-5 text-heritage-gold mt-0.5" />
                                    <span className="font-body text-sm text-text-main">{b}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Process */}
            <section className="py-16 md:py-24 bg-heritage-creamLight">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div {...fadeInUp} className="text-center mb-12">
                        <Badge variant="outlineGold" className="mb-4">✦ How It Works</Badge>
                        <h2 className="text-3xl font-heading font-bold text-heritage-terracottaDark">Simple 4-Step Process</h2>
                        <Separator className="w-24 mx-auto mt-6" />
                    </motion.div>
                    <div className="grid md:grid-cols-4 gap-6">
                        {[
                            { step: '1', title: 'Share Requirements', desc: 'Tell us your goals, team size, and interests.' },
                            { step: '2', title: 'Custom Proposal', desc: 'We design a tailored heritage program for you.' },
                            { step: '3', title: 'Program Delivery', desc: 'Expert-led workshops at your venue or ours.' },
                            { step: '4', title: 'Impact & Follow-up', desc: 'Measure outcomes and plan next steps.' },
                        ].map((item, i) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                                <Card className="p-6 text-center space-y-3">
                                    <div className="w-12 h-12 mx-auto rounded-full bg-heritage-gold flex items-center justify-center text-heritage-terracottaDark font-heading font-bold text-xl">
                                        {item.step}
                                    </div>
                                    <h3 className="font-heading font-semibold text-heritage-terracottaDark">{item.title}</h3>
                                    <p className="font-body text-sm text-text-main">{item.desc}</p>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Partners */}
            <section className="py-16 bg-heritage-cream">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div {...fadeInUp} className="text-center mb-8">
                        <Badge variant="outlineGold" className="mb-4">✦ Trusted Partners</Badge>
                        <h2 className="text-2xl font-heading font-bold text-heritage-terracottaDark">Organizations That Trust Adyom</h2>
                    </motion.div>
                    <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {partners.map((p, i) => (
                            <Card key={i} className="p-4 text-center">
                                <Building2 className="w-8 h-8 mx-auto text-heritage-terracottaDark mb-2" />
                                <p className="text-xs font-body text-text-main">{p}</p>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA / Inquiry Form */}
            <section className="py-16 md:py-24 bg-heritage-terracotta">
                <div className="absolute inset-0 opacity-5 mandala-bg" />
                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    <motion.div {...fadeInUp} className="text-center mb-12">
                        <Badge variant="gold" className="mb-4">✦ Get Started</Badge>
                        <h2 className="text-3xl font-heading font-bold text-text-main">Transform Your Organization with Heritage</h2>
                        <p className="font-body text-text-main mt-2">Get a custom proposal tailored to your CSR and employee engagement goals.</p>
                    </motion.div>

                    {submitted ? (
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-lg mx-auto text-center space-y-6 py-12">
                            <div className="w-16 h-16 mx-auto rounded-full bg-heritage-gold/20 flex items-center justify-center">
                                <CheckCircle className="w-8 h-8 text-heritage-gold" />
                            </div>
                            <h3 className="text-2xl font-heading font-bold text-text-main">Inquiry Submitted!</h3>
                            <p className="font-body text-text-main">
                                Thank you for your interest in our corporate heritage programs. Our team will reach out within 24 hours with a custom proposal.
                            </p>
                            <Link to="/contact"><Button variant="outlineGold" size="lg">Contact Us for More Details</Button></Link>
                        </motion.div>
                    ) : (
                        <div className="max-w-2xl mx-auto">
                            <Card className="p-8 bg-heritage-terracottaLight/50 border-heritage-gold/20">
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-body text-text-main mb-1 block">Organization Name *</label>
                                            <input
                                                name="organization"
                                                value={formData.organization}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-4 py-2 rounded-lg bg-heritage-cream/10 border border-heritage-gold/20 text-text-main placeholder-heritage-creamDark/40 focus:border-heritage-gold focus:outline-none"
                                                placeholder="Your company name"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm font-body text-text-main mb-1 block">Contact Person *</label>
                                            <input
                                                name="contactName"
                                                value={formData.contactName}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-4 py-2 rounded-lg bg-heritage-cream/10 border border-heritage-gold/20 text-text-main placeholder-heritage-creamDark/40 focus:border-heritage-gold focus:outline-none"
                                                placeholder="Your full name"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-body text-text-main mb-1 block">Email *</label>
                                            <input
                                                name="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-4 py-2 rounded-lg bg-heritage-cream/10 border border-heritage-gold/20 text-text-main placeholder-heritage-creamDark/40 focus:border-heritage-gold focus:outline-none"
                                                placeholder="you@company.com"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm font-body text-text-main mb-1 block">Phone</label>
                                            <input
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2 rounded-lg bg-heritage-cream/10 border border-heritage-gold/20 text-text-main placeholder-heritage-creamDark/40 focus:border-heritage-gold focus:outline-none"
                                                placeholder="+91 XXX-XXX-XXXX"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-body text-text-main mb-1 block">Program Interest *</label>
                                            <select
                                                name="programInterest"
                                                value={formData.programInterest}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-4 py-2 rounded-lg bg-heritage-cream/10 border border-heritage-gold/20 text-text-main focus:border-heritage-gold focus:outline-none"
                                            >
                                                <option value="" className="bg-heritage-terracotta">Select a program</option>
                                                <option value="workshop" className="bg-heritage-terracotta">Heritage Art Workshops</option>
                                                <option value="drishti" className="bg-heritage-terracotta">Drishti: Mindfulness & Wellness</option>
                                                <option value="csr" className="bg-heritage-terracotta">CSR Heritage Preservation</option>
                                                <option value="leadership" className="bg-heritage-terracotta">Leadership Through Heritage</option>
                                                <option value="immersion" className="bg-heritage-terracotta">Cultural Immersion</option>
                                                <option value="artisan" className="bg-heritage-terracotta">Artisan Partnership</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-sm font-body text-text-main mb-1 block">Team Size</label>
                                            <select
                                                name="teamSize"
                                                value={formData.teamSize}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2 rounded-lg bg-heritage-cream/10 border border-heritage-gold/20 text-text-main focus:border-heritage-gold focus:outline-none"
                                            >
                                                <option value="" className="bg-heritage-terracotta">Select size</option>
                                                <option value="10-25" className="bg-heritage-terracotta">10–25 people</option>
                                                <option value="25-50" className="bg-heritage-terracotta">25–50 people</option>
                                                <option value="50-100" className="bg-heritage-terracotta">50–100 people</option>
                                                <option value="100+" className="bg-heritage-terracotta">100+ people</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-body text-text-main mb-1 block">Message / Requirements</label>
                                        <textarea
                                            name="message"
                                            value={formData.message}
                                            onChange={handleInputChange}
                                            rows={4}
                                            className="w-full px-4 py-2 rounded-lg bg-heritage-cream/10 border border-heritage-gold/20 text-text-main placeholder-heritage-creamDark/40 focus:border-heritage-gold focus:outline-none resize-none"
                                            placeholder="Tell us about your goals and requirements..."
                                        />
                                    </div>

                                    {submitError && (
                                        <p className="text-sm text-red-400 text-center">{submitError}</p>
                                    )}

                                    <div className="flex flex-wrap gap-4 justify-center pt-2">
                                        <Button variant="gold" size="lg" type="submit" disabled={submitting}>
                                            {submitting ? (
                                                <><Loader2 className="mr-2 w-5 h-5 animate-spin" /> Submitting...</>
                                            ) : (
                                                <><Send className="mr-2 w-5 h-5" /> Request Proposal</>
                                            )}
                                        </Button>
                                        <Link to="/contact">
                                            <Button variant="outlineGold" size="lg" type="button">
                                                <Mail className="mr-2 w-5 h-5" /> Email Us Instead
                                            </Button>
                                        </Link>
                                    </div>
                                    <p className="text-sm font-body text-text-main text-center">hello@adyomfoundation.org · +91 XXX-XXX-XXXX</p>
                                </form>
                            </Card>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}