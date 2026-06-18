import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PostGridSkeleton } from '@/components/ui/page-skeletons';
import {
    Calendar, User, Clock, Heart, MessageSquare,
    Search, BookOpen, Sparkles, Quote, ArrowRight,
} from 'lucide-react';
import { blogAPI } from '@/api';

// ============ ANIMATIONS ============
const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
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

// ============ DATA ============
const blogCategories = [
    { key: 'all', name: 'All Posts' },
    { key: 'art', name: 'Art' },
    { key: 'culture', name: 'Culture' },
    { key: 'heritage', name: 'Heritage' },
    { key: 'mindfulness', name: 'Mindfulness' },
    { key: 'community', name: 'Community' },
];

const fallbackPosts = [
    {
        title: 'The Living Canvas: How Heritage Art Transforms Modern Life',
        slug: 'living-canvas-heritage-art',
        category: 'art',
        excerpt: 'Heritage art is not confined to museums. Discover how traditional Indian art forms are breathing life into modern spaces, minds, and communities.',
        author: 'Adyom Team',
        date: '2025-01-15',
        readTime: '5 min',
        likes: 42,
        comments: 8,
        image: '/images/gallery_gond_art.png'
    },
    {
        title: 'Mindfulness Through Madhubani: Art as Meditation',
        slug: 'mindfulness-madhubani',
        category: 'mindfulness',
        excerpt: 'When the brush moves with intention, art becomes meditation. Explore the mindful practice of Madhubani painting and its transformative power.',
        author: 'Dr. Priya Sharma',
        date: '2025-01-10',
        readTime: '7 min',
        likes: 65,
        comments: 12,
        image: '/images/philosophy_mindfulness.png'
    },
    {
        title: 'Preserving India\'s Craft Heritage: Challenges & Hope',
        slug: 'preserving-craft-heritage',
        category: 'heritage',
        excerpt: 'India\'s artisan communities face unprecedented challenges. Yet, initiatives like Artisan Connect are bringing hope and new opportunities.',
        author: 'Arun Kumar',
        date: '2025-01-05',
        readTime: '6 min',
        likes: 38,
        comments: 5,
        image: '/images/philosophy_culture.png'
    },
    {
        title: 'Chaitanya: The Awakening Within',
        slug: 'chaitanya-awakening',
        category: 'mindfulness',
        excerpt: 'In our fast-paced world, Chaitanya offers a sanctuary. Discover how ancient mindfulness practices can transform your daily life.',
        author: 'Meera Patel',
        date: '2024-12-28',
        readTime: '4 min',
        likes: 55,
        comments: 10,
        image: '/images/gallery_kolam_art.png'
    },
    {
        title: 'From Folk Art to Fine Art: The Journey of Indian Painting',
        slug: 'folk-to-fine-art',
        category: 'art',
        excerpt: 'Indian painting has evolved from village walls to gallery halls. Trace this remarkable journey and discover what makes heritage art timeless.',
        author: 'Sanjay Mishra',
        date: '2024-12-20',
        readTime: '8 min',
        likes: 31,
        comments: 4,
        image: '/images/gallery_sohrai_art.png'
    },
    {
        title: 'The Art of Slow Living: Heritage Wisdom for Modern Times',
        slug: 'art-slow-living',
        category: 'heritage',
        excerpt: 'In a world of constant acceleration, heritage traditions offer a counter-narrative: the art of slow, mindful living.',
        author: 'Vikram Singh',
        date: '2024-12-10',
        readTime: '6 min',
        likes: 47,
        comments: 9,
        image: '/images/hero_artisan.png'
    },
];

export default function Blog() {
    const [activeCategory, setActiveCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [posts, setPosts] = useState(fallbackPosts);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await blogAPI.getAll({ status: 'published', limit: 20 });
                const apiPosts = res.data.data || res.data.posts || res.data;
                if (Array.isArray(apiPosts) && apiPosts.length > 0) {
                    setPosts(apiPosts.map(p => ({
                        title: p.title,
                        slug: p.slug,
                        category: p.category || 'art',
                        excerpt: p.excerpt || p.description?.substring(0, 150) || '',
                        author: p.author?.name || p.author || 'Adyom Team',
                        date: new Date(p.createdAt || p.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }),
                        readTime: p.readTime || `${Math.ceil((p.content?.length || 500) / 200)} min`,
                        likes: p.likes?.length || p.likes || 0,
                        comments: p.comments?.length || p.comments || 0,
                        image: p.coverImage || p.image || null,
                    })));
                }
            } catch (err) {
                setPosts(fallbackPosts);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    const filtered = posts.filter((p) => {
        const matchCat = activeCategory === 'all' || p.category === activeCategory;
        const matchSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
        return matchCat && matchSearch;
    });

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
                            Heritage Blog
                        </span>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-light text-[#FDFBF7] mt-4 leading-tight">
                            Stories of <span className="text-[#C9A96E] font-normal">Heritage</span>
                        </h1>
                        <p className="mt-3 text-base md:text-lg font-serif font-light text-[#D4A574] max-w-2xl mx-auto leading-relaxed">
                            Insights, reflections, and stories from the canvas of heritage — where tradition meets transformation
                        </p>
                    </motion.div>
                </div>

                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 80" className="w-full h-auto" preserveAspectRatio="none">
                        <path fill="#FDFBF7" d="M0,40 C480,80 960,0 1440,40 L1440,80 L0,80 Z" />
                    </svg>
                </div>
            </section>

            {/* ============ FILTERS ============ */}
            <section className="py-4 md:py-6 bg-[#FDFBF7] border-b border-[#B87333]/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row items-center gap-4">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8F6B5A]" />
                            <input
                                type="text"
                                placeholder="Search articles..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 border border-[#B87333]/20 bg-[#FDFBF7] text-sm font-serif font-light text-[#3C2F2B] placeholder:text-[#8F6B5A]/60 focus:border-[#B87333] focus:outline-none"
                            />
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {blogCategories.map((cat) => (
                                <button
                                    key={cat.key}
                                    onClick={() => setActiveCategory(cat.key)}
                                    className={`px-3 py-1.5 text-xs font-serif font-light transition-all duration-300 border ${activeCategory === cat.key
                                            ? 'bg-[#C9A96E] border-[#C9A96E] text-[#3C2F2B]'
                                            : 'bg-transparent border-[#B87333]/20 text-[#8F6B5A] hover:border-[#B87333]/50 hover:text-[#3C2F2B]'
                                        }`}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ============ POSTS GRID ============ */}
            <section className="py-10 md:py-14 bg-[#FDFBF7]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {loading ? (
                        <PostGridSkeleton items={6} />
                    ) : filtered.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="font-serif font-light text-[#8F6B5A]">No posts found. Try a different category or search.</p>
                        </div>
                    ) : (
                        <motion.div
                            className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6"
                            variants={staggerContainer}
                            initial="initial"
                            whileInView="animate"
                            viewport={{ once: true, margin: "-50px" }}
                        >
                            {filtered.map((post, i) => (
                                <motion.div
                                    key={post.slug}
                                    variants={fadeInScale}
                                    whileHover={{ y: -6 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Link to={`/blog/${post.slug}`}>
                                        <div className="bg-white border border-[#B87333]/10 hover:shadow-xl transition-all duration-400 h-full overflow-hidden group">
                                            {/* Image Section */}
                                            <div className="h-48 relative overflow-hidden bg-[#F5E6D3]">
                                                {post.image ? (
                                                    <img
                                                        src={post.image}
                                                        alt={post.title}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#C9A96E]/20 to-[#B87333]/20">
                                                        <BookOpen className="w-12 h-12 text-[#B87333]/40" />
                                                    </div>
                                                )}

                                                {/* Category Badge */}
                                                <div className="absolute top-3 left-3">
                                                    <span className="px-3 py-0.5 bg-[#C9A96E]/90 text-[#3C2F2B] text-[10px] font-serif font-medium uppercase tracking-wider">
                                                        {post.category}
                                                    </span>
                                                </div>

                                                {/* Read Time Badge */}
                                                <div className="absolute bottom-3 right-3">
                                                    <span className="px-2 py-0.5 bg-[#3C2F2B]/80 backdrop-blur-sm text-[#D4A574] text-[10px] font-serif font-light flex items-center gap-1">
                                                        <Clock className="w-3 h-3" /> {post.readTime}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="p-5 space-y-3">
                                                <h3 className="font-serif font-medium text-[#3C2F2B] group-hover:text-[#B87333] transition-colors duration-300 line-clamp-2 text-base leading-snug">
                                                    {post.title}
                                                </h3>

                                                <p className="text-sm font-serif font-light text-[#6B5B4B] line-clamp-2 leading-relaxed">
                                                    {post.excerpt}
                                                </p>

                                                <div className="flex items-center justify-between text-xs font-serif font-light text-[#8F6B5A] pt-2 border-t border-[#B87333]/10">
                                                    <div className="flex items-center gap-2">
                                                        <User className="w-3 h-3" />
                                                        <span className="truncate max-w-[80px]">{post.author}</span>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <span className="flex items-center gap-1">
                                                            <Heart className="w-3 h-3" /> {post.likes}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <MessageSquare className="w-3 h-3" /> {post.comments}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </div>
            </section>

            {/* ============ NEWSLETTER ============ */}
            <section className="py-10 md:py-14 bg-[#F5E6D3]">
                <div className="max-w-2xl mx-auto px-4 text-center space-y-4">
                    <span className="text-[#B87333] font-serif text-xs tracking-[0.2em] uppercase border-b border-[#B87333]/30 pb-2">
                        ✦ Stay Connected
                    </span>
                    <h2 className="text-xl md:text-2xl font-serif font-light text-[#3C2F2B]">
                        Subscribe to <span className="text-[#B87333] font-normal">Heritage Stories</span>
                    </h2>
                    <p className="text-sm font-serif font-light text-[#8F6B5A] max-w-md mx-auto">
                        Get the latest articles, insights, and heritage inspiration delivered to your inbox.
                    </p>
                    <div className="flex gap-2 max-w-sm mx-auto">
                        <input
                            type="email"
                            placeholder="Your email address"
                            className="flex-1 px-4 py-2 border border-[#B87333]/20 bg-[#FDFBF7] text-sm font-serif font-light text-[#3C2F2B] placeholder:text-[#8F6B5A]/60 focus:border-[#B87333] focus:outline-none"
                        />
                        <Button className="bg-[#C9A96E] hover:bg-[#B87333] text-[#3C2F2B] hover:text-white text-sm px-5 py-2 transition-all duration-300">
                            Subscribe
                        </Button>
                    </div>
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
                
                .line-clamp-2 {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
            `}</style>
        </div>
    );
}