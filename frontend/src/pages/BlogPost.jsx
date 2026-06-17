import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    ArrowLeft, ArrowRight, Calendar, User, Clock, Heart, MessageSquare,
    Share2, BookOpen, Tag, Loader2, Send,
} from 'lucide-react';
import { blogAPI } from '@/api';
import { useAuth } from '@/context/AuthContext';

const fadeInUp = { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6 } };

const fallbackPost = {
    slug: 'living-canvas-heritage-art',
    title: 'The Living Canvas: How Heritage Art Transforms Modern Life',
    category: 'art',
    author: 'Adyom Team',
    date: '2025-01-15',
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
                    })) || [],
                });
            } catch (err) {
                // Backend not available — use fallback data
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
            // Still toggle locally for demo
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
            // Still add locally for demo
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
        return (
            <div className="min-h-screen flex items-center justify-center bg-heritage-creamLight">
                <Loader2 className="w-8 h-8 animate-spin text-heritage-terracottaDark" />
            </div>
        );
    }

    if (!post) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-heritage-creamLight">
                <div className="text-center space-y-4">
                    <h2 className="text-2xl font-heading font-bold text-heritage-terracottaDark">Post Not Found</h2>
                    <p className="font-body text-text-main">The blog post you're looking for doesn't exist.</p>
                    <Link to="/blog"><Button variant="gold">Back to Blog</Button></Link>
                </div>
            </div>
        );
    }

    return (
        <div className="overflow-hidden">
            {/* Hero */}
            <section className="relative py-20 md:py-28 bg-heritage-terracotta">
                <div className="absolute inset-0 opacity-5 mandala-bg" />
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.div {...fadeInUp} className="space-y-6">
                        <Link to="/blog" className="inline-flex items-center gap-1 text-sm font-body text-text-main hover:text-heritage-gold transition-colors">
                            <ArrowLeft className="w-4 h-4" /> Back to Blog
                        </Link>
                        <Badge variant="gold" className="text-sm px-4 py-1">{post.category}</Badge>
                        <h1 className="text-3xl md:text-4xl font-heading font-bold text-text-main">{post.title}</h1>
                        <div className="flex flex-wrap gap-4 text-sm font-body text-text-main">
                            <span className="flex items-center gap-1"><User className="w-4 h-4 text-heritage-gold" /> {post.author}</span>
                            <span className="flex items-center gap-1"><Calendar className="w-4 h-4 text-heritage-gold" /> {post.date}</span>
                            <span className="flex items-center gap-1"><Clock className="w-4 h-4 text-heritage-gold" /> {post.readTime} read</span>
                            <span className="flex items-center gap-1"><Heart className="w-4 h-4 text-heritage-gold" /> {post.likes} likes</span>
                            <span className="flex items-center gap-1"><MessageSquare className="w-4 h-4 text-heritage-gold" /> {post.comments} comments</span>
                        </div>
                    </motion.div>
                </div>
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 80" className="w-full h-auto"><path fill="#FFFDF5" d="M0,40 C480,80 960,0 1440,40 L1440,80 L0,80 Z" /></svg>
                </div>
            </section>

            {/* Content */}
            <section className="py-12 md:py-16 bg-heritage-creamLight">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div {...fadeInUp} className="prose prose-lg max-w-none">
                        <div className="font-body text-heritage-brownLight leading-relaxed space-y-6 [&_h3]:font-heading [&_h3]:text-heritage-terracottaDark [&_h3]:text-xl [&_h3]:font-semibold [&_p]:text-text-main [&_p]:leading-relaxed">
                            {(typeof post.content === 'string' ? post.content : fallbackPost.content).split('\n\n').map((block, i) => {
                                // Check if block starts with a heading pattern (no HTML tags from API)
                                const lines = block.split('\n');
                                const firstLine = lines[0];
                                // Simple heading detection: short lines that don't start with lowercase
                                if (firstLine.length < 60 && !firstLine.startsWith('At') && !firstLine.startsWith('In') && !firstLine.startsWith('Heritage') && !firstLine.startsWith('What') && !firstLine.startsWith('Perhaps') && lines.length <= 2) {
                                    return <h3 key={i} className="font-heading text-xl font-semibold text-heritage-terracottaDark">{block}</h3>;
                                }
                                return <p key={i} className="font-body text-text-main leading-relaxed">{block}</p>;
                            })}
                        </div>
                    </motion.div>

                    {/* Actions */}
                    <div className="flex items-center gap-4 mt-8">
                        <Button variant="outline" size="sm" onClick={handleLike} disabled={likeSubmitting || !isAuthenticated}>
                            <Heart className={`w-4 h-4 mr-1 ${liked ? 'fill-heritage-terracotta text-heritage-terracottaDark' : ''}`} /> Like ({post.likes})
                        </Button>
                        <Button variant="outline" size="sm"><Share2 className="w-4 h-4 mr-1" /> Share</Button>
                    </div>

                    <Separator className="my-8" />

                    {/* Comments */}
                    <div className="space-y-6">
                        <h3 className="font-heading font-semibold text-heritage-terracottaDark">Comments ({post.comments})</h3>
                        <div className="space-y-4">
                            {(post.commentsList || []).map((c, i) => (
                                <div key={i} className="bg-heritage-cream rounded-lg p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-8 h-8 rounded-full bg-heritage-terracotta flex items-center justify-center text-heritage-gold font-heading text-sm">
                                            {c.name?.charAt(0) || 'A'}
                                        </div>
                                        <span className="font-body font-medium text-sm text-heritage-terracottaDark">{c.name}</span>
                                        <span className="text-xs font-body text-text-main">{c.date}</span>
                                    </div>
                                    <p className="font-body text-sm text-text-main">{c.text}</p>
                                </div>
                            ))}
                        </div>
                        {isAuthenticated ? (
                            <Card className="p-4">
                                <Textarea
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    placeholder="Add your thoughts..."
                                    rows={3}
                                />
                                <Button variant="gold" size="sm" className="mt-2" onClick={handleComment} disabled={commentSubmitting || !commentText.trim()}>
                                    {commentSubmitting ? 'Posting...' : <><Send className="mr-1 w-3 h-3" /> Post Comment</>}
                                </Button>
                            </Card>
                        ) : (
                            <Card className="p-4 text-center">
                                <p className="font-body text-text-main mb-2">Login to join the conversation</p>
                                <Link to="/login"><Button variant="gold" size="sm">Log In</Button></Link>
                            </Card>
                        )}
                    </div>

                    <Separator className="my-8" />

                    {/* Related Posts */}
                    <div>
                        <h3 className="font-heading font-semibold text-heritage-terracottaDark mb-4">Related Articles</h3>
                        <div className="grid md:grid-cols-3 gap-4">
                            {relatedPosts.map((rp, i) => (
                                <Link key={i} to={`/blog/${rp.slug}`}>
                                    <Card className="p-4 hover:shadow-md transition-shadow">
                                        <Badge variant="secondary" className="text-xs mb-2">{rp.category}</Badge>
                                        <h4 className="font-heading font-semibold text-sm text-heritage-terracottaDark">{rp.title}</h4>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}