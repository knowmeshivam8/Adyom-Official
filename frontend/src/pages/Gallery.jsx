import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
    Palette, Camera, Music, TreePine, Sparkles, Eye, HandHeart, Brush,
    ArrowRight, Heart, Search, Grid, Filter, Loader2,
} from 'lucide-react';
import { galleryAPI } from '@/api';

const fadeInUp = { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6 } };

const galleryCategories = [
    { key: 'all', name: 'All' },
    { key: 'painting', name: 'Painting' },
    { key: 'craft', name: 'Craft' },
    { key: 'photography', name: 'Photography' },
    { key: 'sculpture', name: 'Sculpture' },
    { key: 'textile', name: 'Textile' },
];

const categoryIcons = { painting: Palette, craft: HandHeart, photography: Camera, sculpture: TreePine, textile: Sparkles };

const fallbackItems = [
    { title: 'Madhubani Dance of Life', category: 'painting', artist: 'Rameshwar Kumar', gradient: 'from-heritage-terracotta to-heritage-terracottaLight', Icon: Palette, image: '/images/gallery_gond_art.png' },
    { title: 'Blue Pottery Vase', category: 'craft', artist: 'Sita Devi', gradient: 'from-heritage-gold to-heritage-goldLight', Icon: HandHeart, image: '/images/philosophy_mindfulness.png' },
    { title: 'Heritage Temple Architecture', category: 'photography', artist: 'Arun Patel', gradient: 'from-heritage-brown to-heritage-brownLight', Icon: Camera, image: '/images/philosophy_culture.png' },
    { title: 'Warli Village Scene', category: 'painting', artist: 'Meera Sharma', gradient: 'from-heritage-brownLight to-heritage-sand', Icon: Brush, image: '/images/gallery_sohrai_art.png' },
    { title: 'Bronze Dancing Figure', category: 'sculpture', artist: 'Vikram Singh', gradient: 'from-heritage-sand to-heritage-creamDark', Icon: TreePine, image: '/images/gallery_kolam_art.png' },
    { title: 'Kantha Embroidered Sari', category: 'textile', artist: 'Priya Banerjee', gradient: 'from-heritage-terracottaLight to-heritage-gold', Icon: Sparkles, image: '/images/blog_thumbnail.png' },
    { title: 'Block Printed Fabric', category: 'textile', artist: 'Kamla Devi', gradient: 'from-heritage-goldDark to-heritage-terracotta', Icon: Eye, image: '/images/hero_artisan.png' },
    { title: 'Miniature Court Scene', category: 'painting', artist: 'Sanjay Mishra', gradient: 'from-heritage-creamDark to-heritage-terracottaLight', Icon: Palette, image: '/images/philosophy_community.png' },
    { title: 'Terracotta Sun Mask', category: 'craft', artist: 'Deepak Kumhar', gradient: 'from-heritage-brownLight to-heritage-gold', Icon: Music, image: '/images/gallery_gond_art.png' },
    { title: 'Rajasthani Door Frame', category: 'photography', artist: 'Neha Kapoor', gradient: 'from-heritage-terracotta to-heritage-brown', Icon: Camera, image: '/images/philosophy_culture.png' },
    { title: 'Pattachitra Myth Scene', category: 'painting', artist: 'Ravi Mohapatra', gradient: 'from-heritage-goldLight to-heritage-brownLight', Icon: Brush, image: '/images/gallery_sohrai_art.png' },
    { title: 'Carved Stone Panel', category: 'sculpture', artist: 'Gopal Stonemason', gradient: 'from-heritage-sand to-heritage-terracottaLight', Icon: TreePine, image: '/images/gallery_kolam_art.png' },
];

const categoryGradients = {
    painting: 'from-heritage-terracotta to-heritage-terracottaLight',
    craft: 'from-heritage-gold to-heritage-goldLight',
    photography: 'from-heritage-brown to-heritage-brownLight',
    sculpture: 'from-heritage-sand to-heritage-creamDark',
    textile: 'from-heritage-terracottaLight to-heritage-gold',
};

export default function Gallery() {
    const [activeCategory, setActiveCategory] = useState('all');
    const [galleryItems, setGalleryItems] = useState(fallbackItems);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGallery = async () => {
            try {
                const res = await galleryAPI.getAll({ limit: 50 });
                const apiItems = res.data.data || res.data.galleries || res.data;
                if (Array.isArray(apiItems) && apiItems.length > 0) {
                    const fromApi = apiItems.map(item => ({
                        title: item.title || 'Untitled',
                        category: item.category || 'painting',
                        artist: item.artist || item.artistName || item.uploadedBy?.name || 'Unknown',
                        gradient: categoryGradients[item.category] || 'from-heritage-terracotta to-heritage-gold',
                        Icon: categoryIcons[item.category] || Palette,
                        image: item.image || (item.images && item.images[0]?.url) || null,
                    }));
                    // Always show API items first, then the static fallback images below
                    setGalleryItems([...fromApi, ...fallbackItems]);
                } else {
                    setGalleryItems(fallbackItems);
                }
            } catch (err) {
                setGalleryItems(fallbackItems);
            } finally {
                setLoading(false);
            }
        };

        fetchGallery();
        // Poll every 30 seconds so new uploads from admin appear automatically
        const interval = setInterval(fetchGallery, 30000);
        return () => clearInterval(interval);
    }, []);

    const filtered = galleryItems.filter(
        (item) => activeCategory === 'all' || item.category === activeCategory
    );

    return (
        <div className="overflow-hidden">
            {/* Hero */}
            <section className="relative py-20 md:py-28 bg-heritage-terracotta">
                <div className="absolute inset-0 opacity-5 mandala-bg" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <motion.div {...fadeInUp}>
                        <Badge variant="gold" className="mb-4 text-sm px-4 py-1">✦ Heritage Gallery</Badge>
                        <h1 className="text-4xl md:text-5xl font-heading font-bold text-text-main">Canvas of Heritage</h1>
                        <p className="mt-4 text-xl font-accent text-text-main italic max-w-2xl mx-auto">
                            Where art, craft, and culture come alive — showcasing the work of India's heritage artisans
                        </p>
                    </motion.div>
                </div>
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 80" className="w-full h-auto"><path fill="#FFFDF5" d="M0,40 C480,80 960,0 1440,40 L1440,80 L0,80 Z" /></svg>
                </div>
            </section>

            {/* Filters */}
            <section className="py-6 bg-heritage-creamLight">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-wrap gap-2 justify-center">
                        {galleryCategories.map((cat) => (
                            <button
                                key={cat.key}
                                onClick={() => setActiveCategory(cat.key)}
                                className={`px-4 py-2 rounded-full text-sm font-body font-medium transition-colors ${activeCategory === cat.key
                                    ? 'bg-heritage-terracotta text-heritage-cream'
                                    : 'bg-heritage-cream text-text-main hover:bg-heritage-creamDark'
                                    }`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Gallery Grid */}
            <section className="py-12 md:py-16 bg-heritage-creamLight">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-heritage-terracottaDark" />
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="font-body text-text-main">No gallery items found in this category.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {filtered.map((item, i) => (
                                <motion.div
                                    key={item.title}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.05 }}
                                    className="group relative rounded-lg overflow-hidden cursor-pointer"
                                >
                                    {item.image ? (
                                        <img src={item.image} alt={item.title} className="h-48 md:h-64 w-full object-cover" />
                                    ) : (
                                        <div className={`h-48 md:h-64 bg-gradient-to-br ${item.gradient} flex items-center justify-center`}>
                                            <item.Icon className="w-12 h-12 text-white group-hover:text-white transition-colors" />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-end">
                                        <div className="p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                            <h3 className="font-heading font-semibold text-sm">{item.title}</h3>
                                            <p className="text-xs font-body text-white">{item.artist}</p>
                                            <Badge variant="gold" className="text-xs mt-1">{item.category}</Badge>
                                        </div>
                                    </div>
                                    <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 hover:bg-heritage-gold text-white hover:text-heritage-terracottaDark flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                                        <Heart className="w-4 h-4" />
                                    </button>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Submit CTA */}
            <section className="py-12 bg-heritage-terracotta">
                <div className="max-w-7xl mx-auto px-4 text-center space-y-6">
                    <h2 className="text-2xl font-heading font-bold text-text-main">Share Your Heritage Art</h2>
                    <p className="font-body text-text-main">Are you an artisan? Upload your work to our gallery and connect with heritage lovers worldwide.</p>
                    <Link to="/register"><Button variant="gold" size="xl">Submit Your Artwork <ArrowRight className="ml-2 w-5 h-5" /></Button></Link>
                </div>
            </section>
        </div>
    );
}