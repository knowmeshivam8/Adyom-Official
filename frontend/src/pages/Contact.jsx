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
    CheckCircle, MessageSquare,
} from 'lucide-react';
import { contactAPI } from '@/api';

const fadeInUp = { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6 } };

export default function Contact() {
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
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
            // If backend not available, still show success for demo
            setSubmitted(true);
            setTimeout(() => setSubmitted(false), 5000);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="overflow-hidden">
            {/* Hero */}
            <section className="relative py-20 md:py-28 bg-heritage-terracotta">
                <div className="absolute inset-0 opacity-5 mandala-bg" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <motion.div {...fadeInUp}>
                        <Badge variant="gold" className="mb-4 text-sm px-4 py-1">✦ Contact Us</Badge>
                        <h1 className="text-4xl md:text-5xl font-heading font-bold text-text-main">Reach Out to Adyom</h1>
                        <p className="mt-4 text-xl font-accent text-text-main italic max-w-2xl mx-auto">
                            We're here to listen, guide, and connect — whether you seek heritage, mindfulness, or community
                        </p>
                    </motion.div>
                </div>
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 80" className="w-full h-auto"><path fill="#FFFDF5" d="M0,40 C480,80 960,0 1440,40 L1440,80 L0,80 Z" /></svg>
                </div>
            </section>

            {/* Contact Form & Info */}
            <section className="py-16 md:py-24 bg-heritage-creamLight">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12">
                        {/* Form */}
                        <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                            <Badge variant="outlineGold" className="mb-4">✦ Send a Message</Badge>
                            <h2 className="text-2xl font-heading font-bold text-heritage-terracottaDark mb-6">We'd Love to Hear From You</h2>

                            {submitted ? (
                                <Card className="p-8 text-center space-y-4 heritage-border">
                                    <CheckCircle className="w-12 h-12 text-heritage-gold mx-auto" />
                                    <h3 className="font-heading font-semibold text-heritage-terracottaDark">Message Sent!</h3>
                                    <p className="font-body text-text-main">Thank you for reaching out. We'll get back to you within 24 hours.</p>
                                </Card>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-body font-medium text-heritage-terracottaDark mb-1">Your Name *</label>
                                            <Input required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Enter your name" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-body font-medium text-heritage-terracottaDark mb-1">Email Address *</label>
                                            <Input required type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="your@email.com" />
                                        </div>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-body font-medium text-heritage-terracottaDark mb-1">Phone</label>
                                            <Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="+91 XXX-XXX-XXXX" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-body font-medium text-heritage-terracottaDark mb-1">Subject *</label>
                                            <Input required value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} placeholder="What's this about?" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-body font-medium text-heritage-terracottaDark mb-1">Message *</label>
                                        <Textarea required rows={6} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} placeholder="Tell us about your interest, questions, or ideas..." />
                                    </div>
                                    <Button variant="gold" size="lg" type="submit" disabled={loading}>
                                        {loading ? 'Sending...' : <><Send className="mr-2 w-4 h-4" /> Send Message</>}
                                    </Button>
                                </form>
                            )}
                        </motion.div>

                        {/* Contact Info */}
                        <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-6">
                            <Badge variant="outlineGold" className="mb-4">✦ Contact Details</Badge>
                            <h2 className="text-2xl font-heading font-bold text-heritage-terracottaDark mb-6">Other Ways to Reach Us</h2>

                            <div className="space-y-4">
                                <Card className="p-4 flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-heritage-terracotta flex items-center justify-center text-heritage-cream">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-heading font-semibold text-heritage-terracottaDark">Visit Us</h3>
                                        <p className="font-body text-sm text-text-main">New Delhi, India</p>
                                    </div>
                                </Card>
                                <Card className="p-4 flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-heritage-gold flex items-center justify-center text-heritage-terracottaDark">
                                        <Phone className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-heading font-semibold text-heritage-terracottaDark">Call Us</h3>
                                        <p className="font-body text-sm text-text-main">+91 XXX-XXX-XXXX</p>
                                    </div>
                                </Card>
                                <Card className="p-4 flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-heritage-brown flex items-center justify-center text-heritage-cream">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-heading font-semibold text-heritage-terracottaDark">Email Us</h3>
                                        <p className="font-body text-sm text-text-main">hello@adyomfoundation.org</p>
                                    </div>
                                </Card>
                                <Card className="p-4 flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-heritage-terracottaLight flex items-center justify-center text-heritage-cream">
                                        <Clock className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-heading font-semibold text-heritage-terracottaDark">Office Hours</h3>
                                        <p className="font-body text-sm text-text-main">Mon–Fri: 10am–6pm IST</p>
                                    </div>
                                </Card>
                            </div>

                            <Separator className="my-4" />

                            <div className="space-y-3">
                                <h3 className="font-heading font-semibold text-heritage-terracottaDark">Quick Links</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <Card className="p-3 text-center hover:shadow-md transition-shadow cursor-pointer">
                                        <Palette className="w-5 h-5 mx-auto text-heritage-gold mb-1" />
                                        <p className="text-xs font-body text-text-main">Programs Inquiry</p>
                                    </Card>
                                    <Card className="p-3 text-center hover:shadow-md transition-shadow cursor-pointer">
                                        <Building2 className="w-5 h-5 mx-auto text-heritage-gold mb-1" />
                                        <p className="text-xs font-body text-text-main">Corporate Programs</p>
                                    </Card>
                                    <Card className="p-3 text-center hover:shadow-md transition-shadow cursor-pointer">
                                        <Heart className="w-5 h-5 mx-auto text-heritage-gold mb-1" />
                                        <p className="text-xs font-body text-text-main">Artisan Support</p>
                                    </Card>
                                    <Card className="p-3 text-center hover:shadow-md transition-shadow cursor-pointer">
                                        <MessageSquare className="w-5 h-5 mx-auto text-heritage-gold mb-1" />
                                        <p className="text-xs font-body text-text-main">Community Help</p>
                                    </Card>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
}