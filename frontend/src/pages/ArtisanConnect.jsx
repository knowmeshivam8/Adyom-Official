import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
    ArrowRight, Palette, HandHeart, Star, Camera, Globe, Users,
    BookOpen, Brush, TreePine, Upload, Eye, CheckCircle, Music, Loader2,
} from 'lucide-react';
import { artworkAPI } from '@/api';

const fadeInUp = { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6 } };

const fallbackArtisans = [
    { name: 'Rameshwar Kumar', craft: 'Madhubani Painting', location: 'Bihar', initials: 'R' },
    { name: 'Sita Devi', craft: 'Pottery & Terracotta', location: 'Rajasthan', initials: 'S' },
    { name: 'Arun Patel', craft: 'Block Printing', location: 'Gujarat', initials: 'A' },
    { name: 'Meera Sharma', craft: 'Warli Art', location: 'Maharashtra', initials: 'M' },
    { name: 'Vikram Singh', craft: 'Miniature Painting', location: 'Rajasthan', initials: 'V' },
    { name: 'Priya Banerjee', craft: 'Kantha Embroidery', location: 'West Bengal', initials: 'P' },
];

const howItWorks = [
    { icon: Upload, title: 'Submit Your Work', desc: 'Upload your artwork, craft photos, or videos to the Adyom platform for review.' },
    { icon: Eye, title: 'Admin Review', desc: 'Our team reviews your submission for authenticity, quality, and heritage alignment.' },
    { icon: Globe, title: 'Public Showcase', desc: 'Approved work is showcased in our gallery, visible to collectors and heritage lovers worldwide.' },
    { icon: Users, title: 'Community Support', desc: 'Connect with fellow artisans, access workshops, and receive career development guidance.' },
];

const benefits = [
    'Free portfolio space on Adyom Gallery',
    'Global visibility for your traditional craft',
    'Direct connection with heritage collectors',
    'Skill enhancement workshops',
    'Corporate partnership opportunities',
    'Community of fellow artisans for support',
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
        <div className="overflow-hidden">
            {/* Hero */}
            <section className="relative py-20 md:py-32 bg-heritage-terracotta">
                <div className="absolute inset-0 opacity-5 mandala-bg" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.div {...fadeInUp} className="text-center max-w-3xl mx-auto space-y-6">
                        <Badge variant="gold" className="text-sm px-4 py-1">✦ Artisan Connect</Badge>
                        <h1 className="text-4xl md:text-5xl font-heading font-bold text-text-main">
                            Empowering India's <span className="text-gradient-gold">Artisans</span>
                        </h1>
                        <p className="text-xl font-accent text-text-main italic leading-relaxed">
                            "Every hand that crafts tells a story of heritage. Artisan Connect gives that story a stage,
                            a community, and a future."
                        </p>
                        <div className="flex flex-wrap gap-4 justify-center">
                            <Link to="/register"><Button variant="gold" size="xl">Join as Artisan <ArrowRight className="ml-2 w-5 h-5" /></Button></Link>
                            <Link to="/gallery"><Button variant="outlineGold" size="xl">View Gallery</Button></Link>
                        </div>
                    </motion.div>
                </div>
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 80" className="w-full h-auto"><path fill="#FFFDF5" d="M0,40 C480,80 960,0 1440,40 L1440,80 L0,80 Z" /></svg>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-16 md:py-24 bg-heritage-creamLight">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div {...fadeInUp} className="text-center mb-12">
                        <Badge variant="outlineGold" className="mb-4">✦ How It Works</Badge>
                        <h2 className="text-3xl font-heading font-bold text-heritage-terracottaDark">From Your Hands to the World</h2>
                        <Separator className="w-24 mx-auto mt-6" />
                    </motion.div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {howItWorks.map((item, i) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                                <Card className="p-6 text-center space-y-4">
                                    <div className="w-12 h-12 mx-auto rounded-full bg-heritage-gold/20 flex items-center justify-center text-heritage-gold">
                                        <item.icon className="w-6 h-6" />
                                    </div>
                                    <h3 className="font-heading font-semibold text-heritage-terracottaDark">{item.title}</h3>
                                    <p className="font-body text-sm text-text-main">{item.desc}</p>
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
                        <Badge variant="gold" className="mb-4">✦ Artisan Benefits</Badge>
                        <h2 className="text-3xl font-heading font-bold text-text-main">What You Get</h2>
                    </motion.div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
                        {benefits.map((b, i) => (
                            <div key={i} className="flex items-start gap-2 p-3 bg-heritage-terracottaLight/50 rounded-lg">
                                <CheckCircle className="w-5 h-5 text-heritage-gold mt-0.5" />
                                <span className="font-body text-sm text-text-main">{b}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Artisans */}
            <section className="py-16 md:py-24 bg-heritage-creamLight">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div {...fadeInUp} className="text-center mb-12">
                        <Badge variant="outlineGold" className="mb-4">✦ Featured Artisans</Badge>
                        <h2 className="text-3xl font-heading font-bold text-heritage-terracottaDark">Our Heritage Craftsmen</h2>
                        <Separator className="w-24 mx-auto mt-6" />
                    </motion.div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {loading ? (
                            <div className="col-span-full text-center py-12">
                                <Loader2 className="w-8 h-8 animate-spin mx-auto text-heritage-terracottaDark" />
                                <p className="mt-3 text-sm font-body text-text-main">Loading artisans...</p>
                            </div>
                        ) : artisans.length === 0 ? (
                            <div className="col-span-full text-center py-12">
                                <Palette className="w-12 h-12 mx-auto text-heritage-gold/40 mb-3" />
                                <p className="font-body text-text-main">No artisans featured yet. Check back soon!</p>
                            </div>
                        ) : (
                            artisans.map((artisan, i) => (
                                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                                    <Card className="p-6 space-y-4 hover:shadow-lg transition-shadow">
                                        {artisan.image ? (
                                            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-heritage-gold/30">
                                                <img src={artisan.image} alt={artisan.name} className="w-full h-full object-cover" />
                                            </div>
                                        ) : (
                                            <div className="w-16 h-16 rounded-full bg-heritage-terracotta flex items-center justify-center text-heritage-gold font-heading text-xl font-bold">
                                                {artisan.initials}
                                            </div>
                                        )}
                                        <h3 className="font-heading font-semibold text-heritage-terracottaDark">{artisan.name}</h3>
                                        <Badge variant="gold" className="text-xs">{artisan.craft}</Badge>
                                        <p className="text-sm font-body text-text-main">
                                            <TreePine className="w-4 h-4 inline mr-1 text-heritage-gold" /> {artisan.location}
                                        </p>
                                    </Card>
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 bg-heritage-cream">
                <motion.div {...fadeInUp} className="text-center max-w-2xl mx-auto space-y-6 px-4">
                    <h2 className="text-3xl font-heading font-bold text-heritage-terracottaDark">Are You an Artisan?</h2>
                    <p className="font-body text-text-main">Join Artisan Connect and share your heritage craft with the world. Free membership for traditional artisans.</p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <Link to="/register"><Button variant="gold" size="xl">Join as Artisan <ArrowRight className="ml-2 w-5 h-5" /></Button></Link>
                        <Link to="/contact"><Button variant="outline" size="xl">Contact Us</Button></Link>
                    </div>
                </motion.div>
            </section>
        </div>
    );
}