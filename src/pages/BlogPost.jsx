import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { BlogPostSkeleton } from '@/components/ui/page-skeletons';
import {
    ArrowLeft, Calendar, User, Clock, Heart, MessageSquare,
    Share2, BookOpen, Sparkles, Quote,
} from 'lucide-react';
import { blogAPI } from '@/api';
import { useAuth } from '@/context/AuthContext';

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

// ============ FALLBACK DATA ============
const fallbackPost = {
    slug: 'living-canvas-heritage-art',
    title: 'The Living Canvas: How Heritage Art Transforms Modern Life',
    category: 'art',
    author: 'Adyom Team',
    date: 'Jan 15, 2025',
    readTime: '5 min',
    content: `Heritage art is not confined to museums or dusty archives. In the hands of contemporary practitioners and mindful creators, India's timeless art forms are breathing life into modern spaces, minds, and communities.

At Adyom Foundation, we've witnessed this transformation firsthand. When a corporate team learns Madhubani painting as a mindfulness exercise, they don't just create art — they create connection. When a young designer incorporates traditional block-print patterns into modern fashion, they don't just make clothes — they make a statement about identity and belonging.

Heritage Art in Contemporary Spaces
Across India, heritage art is finding new homes — not in museums, but in living rooms, offices, cafes, and digital spaces. Warli art adorns modern apartment walls. Miniature paintings inspire graphic designers. Pottery traditions inform sustainable product design.

The Mindful Dimension
What makes heritage art truly transformative is its inherent mindfulness. Every brushstroke in Madhubani is deliberate. Every weave in Kantha carries intention. This isn't just technique — it's a way of being. At Adyom, our Chaitanya programs integrate this mindful dimension, helping practitioners discover that art and meditation are not separate practices but one unified path.

Community as Canvas
Perhaps the most profound transformation happens at the community level. When artisans, seekers, and heritage lovers come together, they create something no individual could achieve alone — a living, evolving canvas of shared culture and creativity. This is the vision that drives everything we do at Adyom Foundation.`,
    likes: 42,
    comments: 8,
    commentsList: [
        { name: 'Priya Sharma', text: 'This is beautifully written. Heritage art truly transforms lives.', date: 'Jan 16, 2025' },
        { name: 'Arun Kumar', text: 'I attended a Madhubani workshop last month. It was life-changing!', date: 'Jan 17, 2025' },
    ],
};

const fallbackRelated = [
    { title: 'Mindfulness Through Madhubani', slug: 'mindfulness-madhubani', category: 'mindfulness' },
    { title: 'From Folk Art to Fine Art', slug: 'folk-to-fine-art', category: 'art' },
    { title: 'Preserving India\'s Craft Heritage', slug: 'preserving-craft-heritage', category: 'heritage' },
];

export default function BlogPost() {
    const { slug } = useParams();
    const { isAuthenticated } = useAuth();
    const [post, setPost] = useState(null);
    const [relatedPosts, setRelatedPosts] = useState(fallbackRelated);
    const [loading, setLoading] = useState(true);
    const [commentText, setCommentText] = useState('');
    const [commentSubmitting, setCommentSubmitting] = useState(false);
    const [liked, setLiked] = useState(false);
    const [likeSubmitting, setLikeSubmitting] = useState(false);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await blogAPI.getBySlug(slug);
                const apiPost = res.data.data || res.data.post || res.data;
                setPost({
                    _id: apiPost._id || apiPost.id,
                    slug: apiPost.slug,
                    title: apiPost.title,
                    category: apiPost.category || 'art',
                    author: apiPost.author?.name || apiPost.author || 'Adyom Team',
                    date: new Date(apiPost.createdAt || apiPost.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }),
                    readTime: apiPost.readTime || `${Math.ceil((apiPost.content?.length || 500) / 200)} min`,
                    content: apiPost.content || fallbackPost.content,
                    likes: apiPost.likes?.length || apiPost.likes || 0,
                    comments: apiPost.comments?.length || apiPost.comments || 0,
                    commentsList: apiPost.comments?.map(c => ({
                        name: c.user?.name || c.name || 'Anonymous',
                        text: c.text || c.content || '',
                        date: new Date(c.createdAt || c.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }),
                    })) || fallbackPost.commentsList,
                });
            } catch (err) {
                setPost(fallbackPost);
                setRelatedPosts(fallbackRelated);
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [slug]);

    const handleLike = async () => {
        if (!isAuthenticated || likeSubmitting) return;
        setLikeSubmitting(true);
        try {
            await blogAPI.like(post._id);
            setLiked(true);
            setPost(prev => ({ ...prev, likes: prev.likes + 1 }));
        } catch (err) {
            setLiked(!liked);
            setPost(prev => ({ ...prev, likes: liked ? prev.likes - 1 : prev.likes + 1 }));
        } finally {
            setLikeSubmitting(false);
        }
    };

    const handleComment = async () => {
        if (!commentText.trim() || commentSubmitting) return;
        setCommentSubmitting(true);
        try {
            if (isAuthenticated) {
                await blogAPI.comment(post._id, { comment: commentText });
            }
            setPost(prev => ({
                ...prev,
                comments: prev.comments + 1,
                commentsList: [...(prev.commentsList || []), {
                    name: 'You',
                    text: commentText,
                    date: 'Just now',
                }],
            }));
            setCommentText('');
        } catch (err) {
            setPost(prev => ({
                ...prev,
                comments: prev.comments + 1,
                commentsList: [...(prev.commentsList || []), {
                    name: 'You',
                    text: commentText,
                    date: 'Just now',
                }],
            }));
            setCommentText('');
        } finally {
            setCommentSubmitting(false);
        }
    };

    if (loading) {
        return <BlogPostSkeleton />;
    }

    if (!post) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
                <div className="text-center space-y-4">
                    <h2 className="text-2xl font-serif font-light text-[#3C2F2B]">Post Not Found</h2>
                    <p className="font-serif font-light text-[#8F6B5A]">The blog post you're looking for doesn't exist.</p>
                    <Link to="/blog">
                        <Button className="bg-[#C9A96E] hover:bg-[#B87333] text-[#3C2F2B] hover:text-white text-sm px-6 py-2">
                            Back to Blog
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FDFBF7] font-serif">

            {/* ============ HERO ============ */}
            <section className="relative py-16 md:py-20 lg:py-24 bg-[#3C2F2B] overflow-hidden">
                <div className="absolute inset-0 opacity-[0.04]">
                    <div className="absolute top-20 left-20 w-48 h-48 border border-[#C9A96E] rounded-full animate-spin-slow" />
                    <div className="absolute bottom-20 right-20 w-64 h-64 border border-[#C9A96E]/50 rounded-full animate-spin-slower" />
                </div>

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.div {...fadeInUp} className="space-y-4">
                        <Link to="/blog" className="inline-flex items-center gap-1.5 text-sm font-serif font-light text-[#D4A574] hover:text-[#C9A96E] transition-colors duration-300">
                            <ArrowLeft className="w-4 h-4" /> Back to Blog
                        </Link>

                        <span className="inline-block px-3 py-0.5 bg-[#C9A96E]/20 border border-[#C9A96E]/30 text-[#C9A96E] font-serif text-xs tracking-[0.15em] uppercase">
                            {post.category}
                        </span>

                        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-light text-[#FDFBF7] leading-tight">
                            {post.title}
                        </h1>

                        <div className="flex flex-wrap gap-4 text-sm font-serif font-light text-[#D4A574]">
                            <span className="flex items-center gap-1.5">
                                <User className="w-4 h-4 text-[#C9A96E]" /> {post.author}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Calendar className="w-4 h-4 text-[#C9A96E]" /> {post.date}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Clock className="w-4 h-4 text-[#C9A96E]" /> {post.readTime} read
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Heart className="w-4 h-4 text-[#C9A96E]" /> {post.likes} likes
                            </span>
                            <span className="flex items-center gap-1.5">
                                <MessageSquare className="w-4 h-4 text-[#C9A96E]" /> {post.comments} comments
                            </span>
                        </div>
                    </motion.div>
                </div>

                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 80" className="w-full h-auto" preserveAspectRatio="none">
                        <path fill="#FDFBF7" d="M0,40 C480,80 960,0 1440,40 L1440,80 L0,80 Z" />
                    </svg>
                </div>
            </section>

            {/* ============ CONTENT ============ */}
            <section className="py-10 md:py-14 bg-[#FDFBF7]">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div {...fadeInUp} className="space-y-8">
                        {/* Content */}
                        <div className="prose max-w-none">
                            <div className="font-serif font-light text-[#6B5B4B] leading-relaxed space-y-5 [&_h3]:font-serif [&_h3]:text-[#3C2F2B] [&_h3]:text-xl [&_h3]:font-medium [&_h3]:mt-6 [&_p]:text-[#6B5B4B] [&_p]:leading-relaxed [&_p]:font-light">
                                {(typeof post.content === 'string' ? post.content : fallbackPost.content).split('\n\n').map((block, i) => {
                                    const lines = block.split('\n');
                                    const firstLine = lines[0];
                                    if (firstLine.length < 60 && lines.length <= 2 && !firstLine.startsWith('At') && !firstLine.startsWith('In') && !firstLine.startsWith('Heritage')) {
                                        return <h3 key={i} className="font-serif text-xl font-medium text-[#3C2F2B]">{block}</h3>;
                                    }
                                    return <p key={i} className="font-serif font-light text-[#6B5B4B] leading-relaxed">{block}</p>;
                                })}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-4 pt-4 border-t border-[#B87333]/10">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleLike}
                                disabled={likeSubmitting || !isAuthenticated}
                                className="border-[#B87333]/30 text-[#3C2F2B] hover:bg-[#B87333]/5 font-serif font-light text-sm"
                            >
                                <Heart className={`w-4 h-4 mr-1.5 ${liked ? 'fill-[#B87333] text-[#B87333]' : ''}`} />
                                Like ({post.likes})
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="border-[#B87333]/30 text-[#3C2F2B] hover:bg-[#B87333]/5 font-serif font-light text-sm"
                            >
                                <Share2 className="w-4 h-4 mr-1.5" /> Share
                            </Button>
                        </div>

                        <Separator className="bg-[#B87333]/10" />

                        {/* Comments */}
                        <div className="space-y-5">
                            <h3 className="text-xl font-serif font-light text-[#3C2F2B]">
                                Comments <span className="text-[#8F6B5A] font-light">({post.comments})</span>
                            </h3>

                            <div className="space-y-3">
                                {(post.commentsList || []).map((c, i) => (
                                    <div key={i} className="bg-[#F5E6D3]/30 border border-[#B87333]/10 p-4">
                                        <div className="flex items-center gap-2 mb-1.5">
                                            <div className="w-8 h-8 flex items-center justify-center bg-[#C9A96E] text-[#3C2F2B] font-serif text-sm font-medium">
                                                {c.name?.charAt(0) || 'A'}
                                            </div>
                                            <span className="font-serif font-medium text-sm text-[#3C2F2B]">{c.name}</span>
                                            <span className="text-xs font-serif font-light text-[#8F6B5A]">{c.date}</span>
                                        </div>
                                        <p className="font-serif font-light text-sm text-[#6B5B4B]">{c.text}</p>
                                    </div>
                                ))}
                            </div>

                            {isAuthenticated ? (
                                <div className="border border-[#B87333]/10 p-4">
                                    <Textarea
                                        value={commentText}
                                        onChange={(e) => setCommentText(e.target.value)}
                                        placeholder="Add your thoughts..."
                                        rows={3}
                                        className="border-[#B87333]/20 font-serif font-light text-sm bg-[#FDFBF7] resize-none"
                                    />
                                    <Button
                                        className="mt-2 bg-[#C9A96E] hover:bg-[#B87333] text-[#3C2F2B] hover:text-white text-sm px-5 py-2 transition-all duration-300"
                                        onClick={handleComment}
                                        disabled={commentSubmitting || !commentText.trim()}
                                    >
                                        {commentSubmitting ? 'Posting...' : 'Post Comment'}
                                    </Button>
                                </div>
                            ) : (
                                <div className="border border-[#B87333]/10 p-4 text-center">
                                    <p className="font-serif font-light text-[#8F6B5A] mb-2">Login to join the conversation</p>
                                    <Link to="/login">
                                        <Button className="bg-[#C9A96E] hover:bg-[#B87333] text-[#3C2F2B] hover:text-white text-sm px-5 py-2">
                                            Log In
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </div>

                        <Separator className="bg-[#B87333]/10" />

                        {/* Related Posts */}
                        <div>
                            <h3 className="text-xl font-serif font-light text-[#3C2F2B] mb-4">Related Articles</h3>
                            <div className="grid sm:grid-cols-3 gap-3">
                                {relatedPosts.map((rp, i) => (
                                    <Link key={i} to={`/blog/${rp.slug}`}>
                                        <div className="border border-[#B87333]/10 p-4 hover:shadow-md transition-all duration-300 hover:border-[#B87333]/30">
                                            <span className="text-xs font-serif font-light text-[#B87333] uppercase tracking-wider">{rp.category}</span>
                                            <h4 className="font-serif font-light text-sm text-[#3C2F2B] mt-1">{rp.title}</h4>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </motion.div>
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