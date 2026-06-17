import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
    ArrowRight, Calendar, User, Clock, Heart, MessageSquare,
    Search, BookOpen, Tag, Loader2,
} from 'lucide-react';
import { blogAPI } from '@/api';

const fadeInUp = { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6 } };

const blogCategories = [
    { key: 'all', name: 'All Posts' },
    { key: 'art', name: 'Art' },
    { key: 'culture', name: 'Culture' },
    { key: 'education', name: 'Education' },
    { key: 'community', name: 'Community' },
    { key: 'technology', name: 'Technology' },
    { key: 'wellness', name: 'Wellness' },
    { key: 'folklore', name: 'Folklore' },
];

const fallbackPosts = [
    { title: 'The Living Canvas: How Heritage Art Transforms Modern Life', slug: 'living-canvas-heritage-art', category: 'art', excerpt: 'Heritage art is not confined to museums. Discover how traditional Indian art forms are breathing life into modern spaces, minds, and communities.', author: 'Adyom Team', date: '2025-01-15', readTime: '5 min', likes: 42, comments: 8, image: '/images/gallery_gond_art.png' },
    { title: 'Mindfulness Through Madhubani: Art as Meditation', slug: 'mindfulness-madhubani', category: 'mindfulness', excerpt: 'When the brush moves with intention, art becomes meditation. Explore the mindful practice of Madhubani painting and its transformative power.', author: 'Dr. Priya Sharma', date: '2025-01-10', readTime: '7 min', likes: 65, comments: 12, image: '/images/philosophy_mindfulness.png' },
    { title: 'Preserving India\'s Craft Heritage: Challenges & Hope', slug: 'preserving-craft-heritage', category: 'heritage', excerpt: 'India\'s artisan communities face unprecedented challenges. Yet, initiatives like Artisan Connect are bringing hope and new opportunities.', author: 'Arun Kumar', date: '2025-01-05', readTime: '6 min', likes: 38, comments: 5, image: '/images/philosophy_culture.png' },
    { title: 'Chaitanya: The Awakening Within', slug: 'chaitanya-awakening', category: 'mindfulness', excerpt: 'In our fast-paced world, Chaitanya offers a sanctuary. Discover how ancient mindfulness practices can transform your daily life.', author: 'Meera Patel', date: '2024-12-28', readTime: '4 min', likes: 55, comments: 10, image: '/images/gallery_kolam_art.png' },
    { title: 'From Folk Art to Fine Art: The Journey of Indian Painting', slug: 'folk-to-fine-art', category: 'art', excerpt: 'Indian painting has evolved from village walls to gallery halls. Trace this remarkable journey and discover what makes heritage art timeless.', author: 'Sanjay Mishra', date: '2024-12-20', readTime: '8 min', likes: 31, comments: 4, image: '/images/gallery_sohrai_art.png' },
    { title: 'Creativity and Culture: A Symbiotic Relationship', slug: 'creativity-culture-symbiosis', category: 'culture', excerpt: 'Creativity doesn\'t exist in isolation — it is deeply rooted in cultural context. Explore how Indian culture nurtures creative expression.', author: 'Adyom Team', date: '2024-12-15', readTime: '5 min', likes: 28, comments: 6, image: '/images/blog_thumbnail.png' },
    { title: 'The Art of Slow Living: Heritage Wisdom for Modern Times', slug: 'art-slow-living', category: 'creativity', excerpt: 'In a world of constant acceleration, heritage traditions offer a counter-narrative: the art of slow, mindful living.', author: 'Vikram Singh', date: '2024-12-10', readTime: '6 min', likes: 47, comments: 9, image: '/images/hero_artisan.png' },
    { title: 'Documenting Heritage: Photography as Preservation', slug: 'documenting-heritage-photography', category: 'heritage', excerpt: 'Through the lens of heritage photographers, crumbling traditions find new life. Discover how visual documentation preserves what time threatens to erase.', author: 'Neha Kapoor', date: '2024-12-05', readTime: '5 min', likes: 33, comments: 7, image: '/images/philosophy_community.png' },
];

const categoryColors = {
    art: 'default',
    culture: 'secondary',
    education: 'info',
    community: 'gold',
    technology: 'warning',
    wellness: 'success',
    folklore: 'outline',
};

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
                // Backend not available — use fallback data
                setPosts(fallbackPosts);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    const filtered = posts.filter((p) => {
        const matchCat = activeCategory === 'all' || p.category === activeCategory;
        const matchSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
        return matchCat && matchSearch;
    });

    return (
        <div className="overflow-hidden">
            {/* Hero */}
            <section className="relative py-20 md:py-28 bg-heritage-terracotta">
                <div className="absolute inset-0 opacity-5 mandala-bg" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <motion.div {...fadeInUp}>
                        <Badge variant="gold" className="mb-4 text-sm px-4 py-1">✦ Heritage Blog</Badge>
                        <h1 className="text-4xl md:text-5xl font-heading font-bold text-text-main">Stories of Heritage</h1>
                        <p className="mt-4 text-xl font-accent text-text-main italic max-w-2xl mx-auto">
                            Insights, reflections, and stories from the canvas of heritage — where tradition meets transformation
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
                    <div className="flex flex-col md:flex-row items-center gap-4">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-main" />
                            <input
                                type="text"
                                placeholder="Search articles..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 rounded-md border border-heritage-creamDark bg-heritage-creamLight text-sm font-body text-heritage-brown placeholder:text-heritage-sand focus:ring-2 focus:ring-heritage-gold focus:outline-none"
                            />
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {blogCategories.map((cat) => (
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

            {/* Posts Grid */}
            <section className="py-12 md:py-16 bg-heritage-creamLight">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-heritage-terracottaDark" />
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="font-body text-text-main">No posts found. Try a different category or search.</p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filtered.map((post, i) => (
                                <motion.div key={post.slug} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                                    <Link to={`/blog/${post.slug}`}>
                                        <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
                                            {post.image ? (
                                                <div className="h-40 relative overflow-hidden">
                                                    <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                </div>
                                            ) : (
                                                <div className="h-40 bg-gradient-to-br from-heritage-terracotta to-heritage-gold flex items-center justify-center">
                                                    <BookOpen className="w-12 h-12 text-heritage-cream group-hover:text-heritage-cream transition-colors" />
                                                </div>
                                            )}
                                            <CardContent className="p-5 space-y-3">
                                                <Badge variant={categoryColors[post.category] || 'secondary'} className="text-xs">{post.category}</Badge>
                                                <h3 className="font-heading font-semibold text-heritage-terracottaDark group-hover:text-heritage-terracottaDark transition-colors line-clamp-2">
                                                    {post.title}
                                                </h3>
                                                <p className="text-sm font-body text-text-main line-clamp-2">{post.excerpt}</p>
                                                <div className="flex items-center justify-between text-xs font-body text-text-main">
                                                    <div className="flex items-center gap-2">
                                                        <User className="w-3 h-3" /> {post.author}
                                                        <Calendar className="w-3 h-3" /> {post.date}
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Heart className="w-3 h-3" /> {post.likes}
                                                        <MessageSquare className="w-3 h-3" /> {post.comments}
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Newsletter */}
            <section className="py-12 bg-heritage-cream">
                <div className="max-w-2xl mx-auto px-4 text-center space-y-4">
                    <h2 className="text-2xl font-heading font-bold text-heritage-terracottaDark">Subscribe to Heritage Stories</h2>
                    <p className="font-body text-text-main">Get the latest articles, insights, and heritage inspiration delivered to your inbox.</p>
                    <div className="flex gap-2 max-w-md mx-auto">
                        <input type="email" placeholder="Your email address" className="flex-1 px-4 py-2 rounded-md border border-heritage-creamDark bg-heritage-creamLight text-sm font-body text-heritage-brown" />
                        <Button variant="gold" size="sm">Subscribe</Button>
                    </div>
                </div>
            </section>
        </div>
    );
}