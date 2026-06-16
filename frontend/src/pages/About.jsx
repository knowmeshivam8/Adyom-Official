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
} from 'lucide-react';

const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
};

const values = [
    { icon: Heart, title: 'Heritage Preservation', desc: 'We honor and preserve India\'s timeless art forms, folk traditions, and cultural wisdom for future generations.' },
    { icon: Lightbulb, title: 'Mindful Creation', desc: 'Every act of creation begins with awareness. We integrate mindfulness into art, learning, and community life.' },
    { icon: Users, title: 'Community First', desc: 'Our community is our canvas. Together, we learn, create, and uplift — every voice matters, every hand contributes.' },
    { icon: Globe, title: 'Cultural Bridge', desc: 'We connect ancient heritage with modern expression, building bridges between tradition and innovation.' },
    { icon: Palette, title: 'Creative Empowerment', desc: 'We empower artisans, artists, and seekers with tools, platforms, and support to express their heritage journey.' },
    { icon: Star, title: 'Inclusive Excellence', desc: 'Heritage belongs to everyone. We welcome all seekers — regardless of background — to explore, learn, and grow.' },
];

const team = [
    { name: 'Founder & Vision Keeper', role: 'Leading the heritage revival mission', initials: 'F' },
    { name: 'Program Director', role: 'Curating transformative learning experiences', initials: 'P' },
    { name: 'Artisan Liaison', role: 'Connecting craftspeople with opportunities', initials: 'A' },
    { name: 'Mindfulness Guide', role: 'Guiding inner transformation practices', initials: 'M' },
    { name: 'Community Manager', role: 'Nurturing our growing heritage community', initials: 'C' },
    { name: 'CSR Coordinator', role: 'Building corporate-heritage partnerships', initials: 'S' },
];

export default function About() {
    return (
        <div className="overflow-hidden">
            {/* Hero */}
            <section className="relative py-20 md:py-32 bg-heritage-terracotta overflow-hidden">
                <div className="absolute inset-0 opacity-5 mandala-bg" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.div {...fadeInUp} className="text-center max-w-3xl mx-auto space-y-6">
                        <Badge variant="gold" className="text-sm px-4 py-1">✦ About Adyom Foundation</Badge>
                        <h1 className="text-4xl md:text-5xl font-heading font-bold text-text-main">
                            Where Heritage <span className="text-gradient-gold">Breathes</span>
                        </h1>
                        <p className="text-xl font-accent text-text-main italic leading-relaxed">
                            "Adyom — meaning 'infinite' in Sanskrit — embodies the boundless potential
                            of heritage to transform, inspire, and connect. We are a living canvas where tradition
                            meets the modern soul."
                        </p>
                    </motion.div>
                </div>
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 80" className="w-full h-auto">
                        <path fill="#F4E8D8" d="M0,40 C480,80 960,0 1440,40 L1440,80 L0,80 Z" />
                    </svg>
                </div>
            </section>

            {/* Our Story */}
            <section className="py-16 md:py-24 bg-heritage-creamLight">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-6">
                            <Badge variant="outlineGold" className="mb-2">✦ Our Story</Badge>
                            <h2 className="text-3xl font-heading font-bold text-heritage-terracottaDark">Born from a Love for Heritage</h2>
                            <Separator className="w-16" />
                            <p className="font-body text-text-main leading-relaxed">
                                Adyom Foundation was born from a simple yet powerful belief: India's heritage is not a relic
                                of the past — it is a living, breathing force that can transform lives today. Founded in New Delhi,
                                we began as a small circle of heritage seekers who believed that art, mindfulness, and community
                                could create bridges between ancient wisdom and modern life.
                            </p>
                            <p className="font-body text-text-main leading-relaxed">
                                Today, we are a growing community of over 5,000 members, 50+ artisan partners, and 15+ corporate
                                collaborators — all united by the vision of keeping heritage alive, accessible, and transformative.
                                Our programs span visual arts, mindfulness, craft preservation, photography, career support for
                                artists, and corporate heritage engagement.
                            </p>
                            <p className="font-accent text-lg text-heritage-terracottaDark italic">
                                "Every heritage tradition is a thread in the canvas of human experience. At Adyom, we weave
                                these threads into a living tapestry."
                            </p>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="h-48 rounded-lg bg-gradient-to-br from-heritage-terracotta to-heritage-terracottaLight flex items-center justify-center">
                                    <Eye className="w-16 h-16 text-heritage-gold/60" />
                                </div>
                                <div className="h-48 rounded-lg bg-gradient-to-br from-heritage-gold to-heritage-goldLight flex items-center justify-center mt-8">
                                    <Palette className="w-16 h-16 text-heritage-terracottaDark" />
                                </div>
                                <div className="h-48 rounded-lg bg-gradient-to-br from-heritage-brown to-heritage-brownLight flex items-center justify-center">
                                    <TreePine className="w-16 h-16 text-heritage-cream" />
                                </div>
                                <div className="h-48 rounded-lg bg-gradient-to-br from-heritage-sand to-heritage-creamDark flex items-center justify-center mt-8">
                                    <BookOpen className="w-16 h-16 text-heritage-terracottaDark" />
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Mission, Vision, Philosophy */}
            <section className="py-16 md:py-24 bg-heritage-cream">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { icon: Target, title: 'Our Mission', desc: 'To preserve, practice, and propagate India\'s heritage through art, mindfulness, and community — making ancient wisdom accessible and transformative for the modern world.', color: 'bg-heritage-terracotta' },
                            { icon: Eye, title: 'Our Vision', desc: 'A world where heritage is not confined to museums but lives in every mindful brushstroke, every crafted object, every community gathering — a living canvas of human creativity.', color: 'bg-heritage-gold' },
                            { icon: Heart, title: 'Our Philosophy', desc: 'We believe that art is meditation, craft is prayer, and community is canvas. Heritage is not about looking backward — it\'s about carrying forward the light of centuries.', color: 'bg-heritage-brown' },
                        ].map((item, i) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                                <Card className="p-6 space-y-4 heritage-border relative overflow-hidden">
                                    <div className={`${item.color} w-12 h-12 rounded-lg flex items-center justify-center text-heritage-cream`}>
                                        <item.icon className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-heading font-semibold text-heritage-terracottaDark">{item.title}</h3>
                                    <p className="font-body text-text-main leading-relaxed">{item.desc}</p>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Our Values */}
            <section className="py-16 md:py-24 bg-heritage-creamLight">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div {...fadeInUp} className="text-center mb-12">
                        <Badge variant="outlineGold" className="mb-4">✦ Our Values</Badge>
                        <h2 className="text-3xl font-heading font-bold text-heritage-terracottaDark">The Pillars of Adyom</h2>
                        <Separator className="w-24 mx-auto mt-6" />
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {values.map((v, i) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                                <Card className="p-6 space-y-3 hover:shadow-lg transition-shadow">
                                    <div className="w-10 h-10 rounded-full bg-heritage-gold/20 flex items-center justify-center text-heritage-gold">
                                        <v.icon className="w-5 h-5" />
                                    </div>
                                    <h3 className="font-heading font-semibold text-heritage-terracottaDark">{v.title}</h3>
                                    <p className="font-body text-sm text-text-main leading-relaxed">{v.desc}</p>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team */}
            <section className="py-16 md:py-24 bg-heritage-terracotta">
                <div className="absolute inset-0 opacity-5 mandala-bg" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.div {...fadeInUp} className="text-center mb-12">
                        <Badge variant="gold" className="mb-4">✦ Our Team</Badge>
                        <h2 className="text-3xl font-heading font-bold text-text-main">The Hands Behind the Canvas</h2>
                        <Separator className="w-24 mx-auto mt-6 bg-heritage-gold" />
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {team.map((member, i) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                                <div className="bg-white rounded-lg p-6 text-center space-y-3 border border-text-main/10">
                                    <div className="w-16 h-16 mx-auto rounded-full bg-heritage-gold flex items-center justify-center text-text-main font-heading text-xl font-bold">
                                        {member.initials}
                                    </div>
                                    <h3 className="font-heading font-semibold text-text-main">{member.name}</h3>
                                    <p className="font-body text-sm text-text-main">{member.role}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 bg-heritage-creamLight">
                <motion.div {...fadeInUp} className="text-center max-w-2xl mx-auto space-y-6 px-4">
                    <h2 className="text-3xl font-heading font-bold text-heritage-terracottaDark">Join Our Heritage Journey</h2>
                    <p className="font-body text-text-main">Be part of a community that honors tradition while embracing transformation.</p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <Link to="/register"><Button variant="gold" size="xl">Become a Member <ArrowRight className="ml-2 w-5 h-5" /></Button></Link>
                        <Link to="/programs"><Button variant="outline" size="xl">Explore Programs</Button></Link>
                    </div>
                </motion.div>
            </section>
        </div>
    );
}