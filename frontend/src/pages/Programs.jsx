import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
    ArrowRight, Eye, Lightbulb, Palette, HandHeart, Camera, Music, BookOpen,
    Calendar, Star, Search, Filter, ChevronDown, Loader2, Video, Clock
} from 'lucide-react';
import { programAPI } from '@/api';

const categories = [
    { key: 'all', name: 'All Programs', icon: BookOpen },
    { key: 'drishti', name: 'Drishti — The Vision', icon: Eye },
    { key: 'chaitanya', name: 'Chaitanya — The Awakening', icon: Lightbulb },
    { key: 'kala-path', name: 'Kala-Path — Art Journey', icon: Palette },
    { key: 'sparsh', name: 'Sparsh — The Touch', icon: HandHeart },
    { key: 'pratibimb', name: 'Pratibimb — Reflection', icon: Camera },
    { key: 'kala-vritti', name: 'Kala-Vritti — Art Living', icon: Music },
    { key: 'samanvaya', name: 'Samanvaya — Integration', icon: Star },
    { key: 'workshop', name: 'Workshops', icon: Calendar },
];

const fallbackPrograms = [
    { title: 'Drishti: Individual Wellness Webinar', category: 'drishti', level: 'All Levels', duration: '1 Day', nextSession: 'Aug 15, 2026 • 10:00 AM IST', price: '₹999', desc: 'Online individual wellness webinar acting as the first step of Art with Awakening.', featured: true, slug: 'drishti-individual-wellness-webinar', imageUrl: '/images/drishti_individual.png' },
    { title: 'Drishti: Corporate Workshop', category: 'drishti', level: 'All Levels', duration: '1 Day', nextSession: 'Custom Dates', price: 'Corporate Plan', desc: 'Exclusive mindfulness and heritage art workshop designed for corporate teams and small businesses.', slug: 'drishti-corporate-workshop', imageUrl: '/images/drishti_corporate.png' },
    { title: 'Drishti: School Workshop', category: 'drishti', level: 'All Levels', duration: '1 Day', nextSession: 'Sep 10, 2026 • 09:00 AM IST', price: 'Custom', desc: 'Mindfulness and wellness workshop exclusively designed for students and educators.', slug: 'drishti-school-workshop', imageUrl: '/images/drishti_school.png' },
    { title: 'KalaPath — Online Art Learning', category: 'kala-path', level: 'Beginner', duration: '12 weeks', price: 'Free', desc: 'Master Indian heritage art forms through guided video lessons.', slug: 'kalapath-online-art-learning', imageUrl: '/images/gallery_kolam_art.png' },
    { title: 'Pratibimb — 41-Day Sadhana', category: 'pratibimb', level: 'All Levels', duration: '41 days', price: 'Free', desc: 'Daily art practice combined with mindfulness and self-reflection over 41 days.', featured: true, slug: 'pratibimb-41-day-sadhana', imageUrl: '/images/philosophy_culture.png' },
    { title: 'Chaitanya — Art for Consciousness', category: 'chaitanya', level: 'Intermediate', duration: '49 weeks', price: 'Free', desc: 'A year-long program exploring art, consciousness, and spiritual growth through 7 Indian art forms.', slug: 'chaitanya-art-for-consciousness', imageUrl: '/images/philosophy_mindfulness.png' },
    { title: 'Sparsh — Touch of Art', category: 'sparsh', level: 'All Levels', duration: '49 weeks', price: 'Free', desc: 'A hands-on journey through India\'s textile, sculpture, and craft traditions via 7 art forms.', slug: 'sparsh-touch-of-art', imageUrl: '/images/hero_artisan.png' },
    { title: 'KalaVritti — Art Marketplace', category: 'kala-vritti', level: 'All Levels', duration: 'Ongoing', price: 'Free', desc: 'A platform for artists to showcase and sell their work to patrons and collectors.', featured: true, slug: 'kalavritti-art-marketplace', imageUrl: '/images/philosophy_community.png' },
];

const levelColors = { Beginner: 'success', Intermediate: 'info', Advanced: 'warning', 'All Levels': 'secondary' };

export default function Programs() {
    const [searchParams] = useSearchParams();
    const initialCategory = searchParams.get('category') || 'all';
    const [activeCategory, setActiveCategory] = useState(initialCategory);
    const [searchQuery, setSearchQuery] = useState('');
    const [programs, setPrograms] = useState(fallbackPrograms);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPrograms = async () => {
            try {
                const res = await programAPI.getAll({ isPublished: 'true' });
                const apiPrograms = res.data.data || res.data.programs || res.data;
                if (Array.isArray(apiPrograms) && apiPrograms.length > 0) {
                    setPrograms(apiPrograms.map(p => ({
                        title: p.title,
                        category: p.category || 'drishti',
                        level: p.level || 'All Levels',
                        duration: p.duration || '8 Weeks',
                        nextSession: p.nextSession || null,
                        price: p.price ? `₹${p.price}` : 'Free',
                        desc: p.description || p.desc || '',
                        featured: p.featured || false,
                        slug: p.slug || p._id,
                        imageUrl: p.image || p.imageUrl || '',
                    })));
                }
            } catch (err) {
                // Backend not available — use fallback data
                setPrograms(fallbackPrograms);
            } finally {
                setLoading(false);
            }
        };
        fetchPrograms();
    }, []);

    const filtered = programs.filter((p) => {
        const matchCat = activeCategory === 'all' || p.category === activeCategory;
        const matchSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.desc.toLowerCase().includes(searchQuery.toLowerCase());
        return matchCat && matchSearch;
    });

    const categoryIcon = categories.find(c => c.key === activeCategory)?.icon || BookOpen;

    return (
        <div className="overflow-hidden">
            {/* Hero */}
            <section className="relative py-20 md:py-28 bg-heritage-terracotta">
                <div className="absolute inset-0 opacity-5 mandala-bg" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <motion.div {...{ initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6 } }}>
                        <Badge variant="gold" className="mb-4 text-sm px-4 py-1">✦ Heritage Learning Programs</Badge>
                        <h1 className="text-4xl md:text-5xl font-heading font-bold text-text-main">Programs & Workshops</h1>
                        <p className="mt-4 text-xl font-accent text-text-main italic max-w-2xl mx-auto">
                            Six streams of heritage learning — each a path to rediscovery, mastery, and inner transformation
                        </p>
                    </motion.div>
                </div>
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 80" className="w-full h-auto"><path fill="#F4E8D8" d="M0,40 C480,80 960,0 1440,40 L1440,80 L0,80 Z" /></svg>
                </div>
            </section>

            {/* Filters */}
            <section className="py-8 bg-heritage-creamLight sticky top-[calc(4rem+1px)] md:top-[calc(5rem+1px)] z-30 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row items-center gap-4">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-main" />
                            <input
                                type="text"
                                placeholder="Search programs..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 rounded-md border border-heritage-creamDark bg-heritage-creamLight text-sm font-body text-heritage-brown placeholder:text-heritage-sand focus:ring-2 focus:ring-heritage-gold focus:outline-none"
                            />
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {categories.map((cat) => (
                                <button
                                    key={cat.key}
                                    onClick={() => setActiveCategory(cat.key)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-body font-medium transition-colors ${activeCategory === cat.key
                                        ? 'bg-heritage-terracotta text-heritage-cream'
                                        : 'bg-heritage-cream text-text-main hover:bg-heritage-creamDark'
                                        }`}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Programs Grid */}
            <section className="py-12 md:py-16 bg-heritage-creamLight">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-2 mb-8">
                        <categoryIcon className="w-6 h-6 text-heritage-terracottaDark" />
                        <h2 className="text-2xl font-heading font-bold text-heritage-terracottaDark">
                            {categories.find(c => c.key === activeCategory)?.name || 'All Programs'}
                        </h2>
                        <Badge variant="secondary" className="ml-2">{filtered.length} programs</Badge>
                    </div>

                    {filtered.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="font-body text-text-main">No programs found. Try a different category or search.</p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filtered.map((program, i) => (
                                <motion.div key={program.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                                    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
                                        {program.imageUrl ? (
                                            <div className="h-40 relative overflow-hidden group">
                                                <img src={program.imageUrl} alt={program.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                {program.featured && <Badge variant="gold" className="absolute top-3 right-3 text-xs z-10">Featured</Badge>}
                                            </div>
                                        ) : (
                                            <div className={`h-40 bg-gradient-to-br ${program.category === 'drishti' ? 'from-heritage-terracotta to-heritage-terracottaLight' :
                                                program.category === 'chaitanya' ? 'from-heritage-gold to-heritage-goldLight' :
                                                    program.category === 'kala-path' ? 'from-heritage-terracottaLight to-heritage-gold' :
                                                        program.category === 'sparsh' ? 'from-heritage-brown to-heritage-brownLight' :
                                                            program.category === 'pratibimb' ? 'from-heritage-brownLight to-heritage-sand' :
                                                                program.category === 'kala-vritti' ? 'from-heritage-sand to-heritage-creamDark' :
                                                                    program.category === 'samanvaya' ? 'from-heritage-terracotta to-heritage-gold' :
                                                                        'from-heritage-creamDark to-heritage-terracottaLight'
                                                } flex items-center justify-center relative group`}>
                                                {program.featured && <Badge variant="gold" className="absolute top-3 right-3 text-xs z-10">Featured</Badge>}
                                                <Palette className="w-10 h-10 text-white" />
                                            </div>
                                        )}
                                        <CardContent className="p-5 space-y-3">
                                            <div className="flex items-center gap-2">
                                                <Badge variant={levelColors[program.level] || 'secondary'} className="text-xs">{program.level}</Badge>
                                                <span className="text-xs font-body text-text-main flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" /> {program.duration}
                                                </span>
                                            </div>
                                            {program.nextSession && (
                                                <div className="text-xs font-body text-heritage-terracottaDark flex items-center gap-1 bg-heritage-terracotta/10 w-fit px-2 py-0.5 rounded-full">
                                                    <Clock className="w-3 h-3" /> Next: {program.nextSession}
                                                </div>
                                            )}
                                            <h3 className="font-heading font-semibold text-heritage-terracottaDark group-hover:text-heritage-terracottaDark transition-colors">
                                                {program.title}
                                            </h3>
                                            <p className="text-sm font-body text-text-main">{program.desc}</p>
                                            <div className="flex items-center justify-between pt-2">
                                                <span className="font-heading font-bold text-heritage-gold">{program.price}</span>
                                                <div className="flex gap-2">
                                                    {program.category === 'drishti' && (
                                                        <Link to={`/meet/${program.slug || program._id}?title=${encodeURIComponent(program.title)}&url=https://chat.whatsapp.com/invite-link`}>
                                                            <Button variant="gold" size="sm" className="hidden sm:flex">
                                                                <Video className="w-3 h-3 mr-1" /> Join
                                                            </Button>
                                                        </Link>
                                                    )}
                                                    <Link to={`/programs/${program.slug || program._id}`}>
                                                        <Button variant="outline" size="sm">Details <ArrowRight className="ml-1 w-3 h-3" /></Button>
                                                    </Link>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* CTA */}
            <section className="py-12 bg-heritage-terracotta">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h2 className="text-2xl font-heading font-bold text-text-main">Can't find what you're looking for?</h2>
                    <p className="mt-2 font-body text-text-main">We're constantly adding new programs. Let us know your interests!</p>
                    <div className="flex gap-4 justify-center mt-6">
                        <Link to="/contact"><Button variant="gold" size="lg">Contact Us</Button></Link>
                        <Link to="/register"><Button variant="outlineGold" size="lg">Become a Member</Button></Link>
                    </div>
                </div>
            </section>
        </div>
    );
}