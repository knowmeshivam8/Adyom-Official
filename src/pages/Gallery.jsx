import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Palette, Camera, Music, TreePine, Sparkles, Eye, HandHeart, Brush,
    ArrowRight, Heart, Search, Grid, Filter, Quote, Compass, Leaf,
} from 'lucide-react';
import { galleryAPI } from '@/api';

// ============ ANIMATIONS ============
const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
};

const fadeInScale = {
    initial: { opacity: 0, scale: 0.92 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
};

const staggerContainer = {
    animate: {
        transition: { staggerChildren: 0.08 },
    },
};

const floating = {
    animate: {
        y: [0, -15, 0],
        transition: {
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
        },
    },
};

// ============ DATA ============
const galleryCategories = [
    { key: 'all', name: 'All' },
    { key: 'painting', name: 'Painting' },
    { key: 'craft', name: 'Craft' },
    { key: 'photography', name: 'Photography' },
    { key: 'sculpture', name: 'Sculpture' },
    { key: 'textile', name: 'Textile' },
];

const categoryIcons = {
    painting: Palette,
    craft: HandHeart,
    photography: Camera,
    sculpture: TreePine,
    textile: Sparkles
};

const fallbackItems = [
    { title: 'Madhubani Dance of Life', category: 'painting', artist: 'Rameshwar Kumar', gradient: 'from-[#B87333] to-[#D4A574]', Icon: Palette, image: '/images/gallery_gond_art.png' },
    { title: 'Blue Pottery Vase', category: 'craft', artist: 'Sita Devi', gradient: 'from-[#C9A96E] to-[#F5E6D3]', Icon: HandHeart, image: '/images/philosophy_mindfulness.png' },
    { title: 'Heritage Temple Architecture', category: 'photography', artist: 'Arun Patel', gradient: 'from-[#8F6B5A] to-[#6B4F3A]', Icon: Camera, image: '/images/philosophy_culture.png' },
    { title: 'Warli Village Scene', category: 'painting', artist: 'Meera Sharma', gradient: 'from-[#D4A574] to-[#F5E6D3]', Icon: Brush, image: '/images/gallery_sohrai_art.png' },
    { title: 'Bronze Dancing Figure', category: 'sculpture', artist: 'Vikram Singh', gradient: 'from-[#F5E6D3] to-[#D4A574]', Icon: TreePine, image: '/images/gallery_kolam_art.png' },
    { title: 'Kantha Embroidered Sari', category: 'textile', artist: 'Priya Banerjee', gradient: 'from-[#D4A574] to-[#C9A96E]', Icon: Sparkles, image: '/images/blog_thumbnail.png' },
    { title: 'Block Printed Fabric', category: 'textile', artist: 'Kamla Devi', gradient: 'from-[#B87333] to-[#8F6B5A]', Icon: Eye, image: '/images/hero_artisan.png' },
    { title: 'Miniature Court Scene', category: 'painting', artist: 'Sanjay Mishra', gradient: 'from-[#F5E6D3] to-[#D4A574]', Icon: Palette, image: '/images/philosophy_community.png' },
    { title: 'Terracotta Sun Mask', category: 'craft', artist: 'Deepak Kumhar', gradient: 'from-[#8F6B5A] to-[#C9A96E]', Icon: Music, image: '/images/gallery_gond_art.png' },
    { title: 'Rajasthani Door Frame', category: 'photography', artist: 'Neha Kapoor', gradient: 'from-[#B87333] to-[#8F6B5A]', Icon: Camera, image: '/images/philosophy_culture.png' },
    { title: 'Pattachitra Myth Scene', category: 'painting', artist: 'Ravi Mohapatra', gradient: 'from-[#C9A96E] to-[#D4A574]', Icon: Brush, image: '/images/gallery_sohrai_art.png' },
    { title: 'Carved Stone Panel', category: 'sculpture', artist: 'Gopal Stonemason', gradient: 'from-[#F5E6D3] to-[#D4A574]', Icon: TreePine, image: '/images/gallery_kolam_art.png' },
];

const categoryGradients = {
    painting: 'from-[#B87333] to-[#D4A574]',
    craft: 'from-[#C9A96E] to-[#F5E6D3]',
    photography: 'from-[#8F6B5A] to-[#6B4F3A]',
    sculpture: 'from-[#F5E6D3] to-[#D4A574]',
    textile: 'from-[#D4A574] to-[#C9A96E]',
};

export default function Gallery() {
    const [activeCategory, setActiveCategory] = useState('all');
    const [galleryItems, setGalleryItems] = useState(fallbackItems);
    const [loading, setLoading] = useState(true);
    const [selectedItem, setSelectedItem] = useState(null);

    useEffect(() => {
        const fetchGallery = async () => {
            try {
                const res = await galleryAPI.getAll({ status: 'published', limit: 20 });
                const apiItems = res.data.data || res.data.galleries || res.data;
                if (Array.isArray(apiItems) && apiItems.length > 0) {
                    setGalleryItems(apiItems.map(item => ({
                        title: item.title || 'Untitled',
                        category: item.category || 'painting',
                        artist: item.artist || item.author || 'Unknown',
                        gradient: categoryGradients[item.category] || 'from-[#B87333] to-[#D4A574]',
                        Icon: categoryIcons[item.category] || Palette,
                        image: item.coverImage || item.image || null,
                    })));
                }
            } catch (err) {
                setGalleryItems(fallbackItems);
            } finally {
                setLoading(false);
            }
        };
        fetchGallery();
    }, []);

    const filtered = galleryItems.filter(
        (item) => activeCategory === 'all' || item.category === activeCategory
    );

    return (
        <div className="min-h-screen bg-[#FDFBF7] font-serif">

            {/* ============ HERO SECTION ============ */}
            <section className="relative py-16 md:py-20 lg:py-24 bg-[#3C2F2B] overflow-hidden">
                <div className="absolute inset-0 opacity-[0.04]">
                    <div className="absolute top-20 left-20 w-48 h-48 border border-[#C9A96E] rounded-full animate-spin-slow" />
                    <div className="absolute bottom-20 right-20 w-64 h-64 border border-[#C9A96E]/50 rounded-full animate-spin-slower" />
                    <motion.div
                        className="absolute top-10 left-10 text-4xl text-[#C9A96E]"
                        animate={{ y: [0, -15, 0] }}
                        transition={{ duration: 4, repeat: Infinity }}
                    >
                        ✦
                    </motion.div>
                    <motion.div
                        className="absolute bottom-20 right-10 text-5xl text-[#C9A96E]"
                        animate={{ y: [0, 15, 0] }}
                        transition={{ duration: 5, repeat: Infinity }}
                    >
                        ✧
                    </motion.div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <motion.div {...fadeInUp}>
                        <span className="inline-block px-4 py-1.5 bg-[#C9A96E]/20 border border-[#C9A96E]/30 text-[#C9A96E] font-serif text-xs tracking-[0.2em] uppercase">
                            <Sparkles className="w-3 h-3 mr-2 inline" />
                            Heritage Gallery
                        </span>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-light text-[#FDFBF7] mt-4 leading-tight">
                            Canvas of <span className="text-[#C9A96E] font-normal">Heritage</span>
                        </h1>
                        <p className="mt-3 text-base md:text-lg font-serif font-light text-[#D4A574] max-w-2xl mx-auto leading-relaxed">
                            Where art, craft, and culture come alive — showcasing the work of India's heritage artisans
                        </p>
                    </motion.div>
                </div>

                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 80" className="w-full h-auto" preserveAspectRatio="none">
                        <path fill="#FDFBF7" d="M0,40 C480,80 960,0 1440,40 L1440,80 L0,80 Z" />
                    </svg>
                </div>
            </section>

            {/* ============ STATS BAR ============ */}
            <section className="py-6 md:py-8 bg-[#F5E6D3] border-b border-[#B87333]/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 text-center">
                        <div>
                            <p className="text-2xl md:text-3xl font-serif font-light text-[#3C2F2B]">{galleryItems.length}+</p>
                            <p className="text-xs font-serif font-light text-[#8F6B5A] uppercase tracking-wider">Artworks</p>
                        </div>
                        <div className="w-px h-8 bg-[#B87333]/20" />
                        <div>
                            <p className="text-2xl md:text-3xl font-serif font-light text-[#3C2F2B]">50+</p>
                            <p className="text-xs font-serif font-light text-[#8F6B5A] uppercase tracking-wider">Artisans</p>
                        </div>
                        <div className="w-px h-8 bg-[#B87333]/20" />
                        <div>
                            <p className="text-2xl md:text-3xl font-serif font-light text-[#3C2F2B]">12</p>
                            <p className="text-xs font-serif font-light text-[#8F6B5A] uppercase tracking-wider">Categories</p>
                        </div>
                        <div className="w-px h-8 bg-[#B87333]/20" />
                        <div>
                            <p className="text-2xl md:text-3xl font-serif font-light text-[#3C2F2B]">10K+</p>
                            <p className="text-xs font-serif font-light text-[#8F6B5A] uppercase tracking-wider">Views</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ============ FILTERS ============ */}
            <section className="py-4 md:py-6 bg-[#FDFBF7] border-b border-[#B87333]/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-wrap gap-2 justify-center">
                        {galleryCategories.map((cat) => (
                            <button
                                key={cat.key}
                                onClick={() => setActiveCategory(cat.key)}
                                className={`px-4 py-1.5 text-xs font-serif font-light transition-all duration-300 border ${activeCategory === cat.key
                                        ? 'bg-[#C9A96E] border-[#C9A96E] text-[#3C2F2B]'
                                        : 'bg-transparent border-[#B87333]/20 text-[#8F6B5A] hover:border-[#B87333]/50 hover:text-[#3C2F2B]'
                                    }`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============ GALLERY GRID ============ */}
            <section className="py-10 md:py-14 bg-[#FDFBF7]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {loading ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {Array.from({ length: 8 }).map((_, i) => (
                                <Skeleton key={i} className="h-52 md:h-64 w-full" />
                            ))}
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="font-serif font-light text-[#8F6B5A]">No gallery items found in this category.</p>
                        </div>
                    ) : (
                        <motion.div
                            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5"
                            variants={staggerContainer}
                            initial="initial"
                            whileInView="animate"
                            viewport={{ once: true, margin: "-50px" }}
                        >
                            {filtered.map((item, i) => (
                                <motion.div
                                    key={item.title}
                                    variants={fadeInScale}
                                    whileHover={{ y: -8 }}
                                    transition={{ duration: 0.3 }}
                                    className="group relative overflow-hidden cursor-pointer border border-[#B87333]/10 bg-white hover:shadow-xl transition-all duration-400"
                                    onClick={() => setSelectedItem(item)}
                                >
                                    {/* Image or Placeholder */}
                                    {item.image ? (
                                        <div className="h-52 md:h-64 overflow-hidden">
                                            <img
                                                src={item.image}
                                                alt={item.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            />
                                        </div>
                                    ) : (
                                        <div className={`h-52 md:h-64 bg-gradient-to-br ${item.gradient} flex items-center justify-center`}>
                                            <item.Icon className="w-12 h-12 text-white/50 group-hover:scale-110 transition-transform duration-300" />
                                        </div>
                                    )}

                                    {/* Category Badge */}
                                    <div className="absolute top-3 left-3">
                                        <span className="px-2 py-0.5 bg-[#C9A96E]/90 text-[#3C2F2B] text-[10px] font-serif font-medium uppercase tracking-wider">
                                            {item.category}
                                        </span>
                                    </div>

                                    {/* Like Button */}
                                    <button className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-[#3C2F2B]/60 backdrop-blur-sm text-white hover:bg-[#C9A96E] hover:text-[#3C2F2B] transition-all duration-300 opacity-0 group-hover:opacity-100">
                                        <Heart className="w-4 h-4" />
                                    </button>

                                    {/* Overlay Info */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#3C2F2B]/80 via-[#3C2F2B]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex flex-col justify-end">
                                        <div className="p-4 text-[#FDFBF7]">
                                            <h3 className="font-serif font-medium text-sm leading-snug">{item.title}</h3>
                                            <p className="text-xs font-serif font-light text-[#D4A574] mt-0.5">{item.artist}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </div>
            </section>

            {/* ============ QUOTE SECTION ============ */}
            <section className="py-12 md:py-16 bg-[#F5E6D3]">
                <div className="max-w-3xl mx-auto px-4 text-center">
                    <Quote className="w-10 h-10 text-[#B87333]/30 mx-auto mb-4" />
                    <p className="text-xl md:text-2xl font-serif font-light text-[#3C2F2B] italic leading-relaxed">
                        "Every piece of art tells a story of heritage, resilience, and the timeless beauty of Indian craftsmanship."
                    </p>
                    <div className="flex items-center justify-center gap-3 mt-4">
                        <span className="w-8 h-px bg-[#B87333]" />
                        <span className="text-sm font-serif font-light text-[#8F6B5A]">Adyom Foundation Gallery</span>
                        <span className="w-8 h-px bg-[#B87333]" />
                    </div>
                </div>
            </section>

            {/* ============ SUBMIT CTA ============ */}
            <section className="py-12 md:py-16 bg-[#3C2F2B] relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.04]">
                    <div className="absolute top-0 right-0 w-64 h-64 border border-[#C9A96E] rounded-full -mr-32 -mt-32" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 border border-[#C9A96E]/50 rounded-full -ml-32 -mb-32" />
                </div>

                <div className="max-w-3xl mx-auto px-4 text-center relative z-10 space-y-5">
                    <span className="inline-block px-4 py-1.5 bg-[#C9A96E]/20 border border-[#C9A96E]/30 text-[#C9A96E] font-serif text-xs tracking-[0.2em] uppercase">
                        <Sparkles className="w-3 h-3 mr-2 inline" />
                        Share Your Art
                    </span>
                    <h2 className="text-2xl md:text-3xl font-serif font-light text-[#FDFBF7]">
                        Share Your <span className="text-[#C9A96E] font-normal">Heritage Art</span>
                    </h2>
                    <p className="text-base font-serif font-light text-[#D4A574] max-w-xl mx-auto leading-relaxed">
                        Are you an artisan? Upload your work to our gallery and connect with heritage lovers worldwide.
                    </p>
                    <Link to="/register">
                        <Button className="bg-[#C9A96E] hover:bg-[#B87333] text-[#3C2F2B] hover:text-white text-base px-8 py-3 transition-all duration-300">
                            Submit Your Artwork <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                    </Link>
                </div>
            </section>

            {/* ============ LIGHTBOX MODAL ============ */}
            {selectedItem && (
                <div
                    className="fixed inset-0 z-50 bg-[#3C2F2B]/90 backdrop-blur-sm flex items-center justify-center p-4"
                    onClick={() => setSelectedItem(null)}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="bg-[#FDFBF7] max-w-3xl w-full p-6 md:p-8 relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="absolute top-3 right-3 text-[#3C2F2B] hover:text-[#B87333] transition-colors text-2xl"
                            onClick={() => setSelectedItem(null)}
                        >
                            ✕
                        </button>

                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="md:w-1/2">
                                {selectedItem.image ? (
                                    <img
                                        src={selectedItem.image}
                                        alt={selectedItem.title}
                                        className="w-full h-64 object-cover"
                                    />
                                ) : (
                                    <div className={`w-full h-64 bg-gradient-to-br ${selectedItem.gradient} flex items-center justify-center`}>
                                        <selectedItem.Icon className="w-16 h-16 text-white/50" />
                                    </div>
                                )}
                            </div>
                            <div className="md:w-1/2 space-y-3">
                                <span className="inline-block px-2 py-0.5 bg-[#C9A96E]/20 text-[#B87333] text-xs font-serif font-medium uppercase tracking-wider">
                                    {selectedItem.category}
                                </span>
                                <h3 className="text-2xl font-serif font-light text-[#3C2F2B]">{selectedItem.title}</h3>
                                <p className="text-sm font-serif font-light text-[#8F6B5A]">By {selectedItem.artist}</p>
                                <div className="w-12 h-px bg-[#B87333]" />
                                <p className="text-sm font-serif font-light text-[#6B5B4B] leading-relaxed">
                                    A beautiful piece of heritage art showcasing the rich cultural traditions of India.
                                </p>
                                <div className="flex gap-2 pt-2">
                                    <Button className="bg-[#C9A96E] hover:bg-[#B87333] text-[#3C2F2B] hover:text-white text-sm px-4 py-1.5">
                                        <Heart className="w-4 h-4 mr-1.5" /> Like
                                    </Button>
                                    <Button variant="outline" className="border-[#B87333]/30 text-[#3C2F2B] text-sm px-4 py-1.5">
                                        Share
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}

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