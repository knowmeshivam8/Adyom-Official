import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Users, MessageCircle, Heart, Share2, Send,
    Plus, Filter, Search, Clock, Bookmark,
    Image, Smile, TrendingUp, Award, Reply,
    Pin, Flag, Eye, Edit, Trash2, Loader2
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/context/AuthContext';
import { communityAPI } from '@/api';

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
};

const fallbackPosts = [
    {
        id: 1, author: 'Priya Sharma', avatar: null,
        content: 'Just completed my first Madhubani painting! The intricate patterns really require patience and focus. Sharing my experience with traditional folk art techniques.',
        tags: ['folk-art', 'madhubani', 'painting'],
        likes: 24, comments: 8, shares: 3,
        createdAt: '2 hours ago',
        pinned: true,
        replies: [
            { id: 101, author: 'Anita Desai', content: 'Beautiful work Priya! The border patterns are so precise. Which brush size did you use?', createdAt: '1 hour ago', likes: 5 },
            { id: 102, author: 'Ravi Bhil', content: 'Madhubani is such a meditative practice. Great to see more people exploring it!', createdAt: '45 min ago', likes: 3 },
        ]
    },
    {
        id: 2, author: 'Anita Desai', avatar: null,
        content: 'Our mindful drawing session yesterday was incredible. 30 artists came together and we explored the connection between breath and brush strokes. The energy was amazing!',
        tags: ['mindfulness', 'community', 'art-session'],
        likes: 18, comments: 5, shares: 2,
        createdAt: '5 hours ago',
        pinned: false,
        replies: [
            { id: 103, author: 'Meena Iyer', content: 'I was there! It was such a transformative experience. Can we do this weekly?', createdAt: '3 hours ago', likes: 7 },
        ]
    },
    {
        id: 3, author: 'Ravi Bhil', avatar: null,
        content: 'Tip for Warli artists: Try using bamboo sticks instead of brushes for more authentic line work. The natural texture it creates is beautiful and connects us to the traditional method.',
        tags: ['warli', 'folk-art', 'tips'],
        likes: 32, comments: 12, shares: 8,
        createdAt: '1 day ago',
        pinned: false,
        replies: []
    },
    {
        id: 4, author: 'Lakshmi Rao', avatar: null,
        content: 'Excited to announce that our Kalamkari workshop registration is now open! Limited to 20 participants. This is a rare opportunity to learn from master artisans.',
        tags: ['kalamkari', 'workshop', 'announcement'],
        likes: 45, comments: 15, shares: 12,
        createdAt: '2 days ago',
        pinned: true,
        replies: [
            { id: 104, author: 'Priya Sharma', content: 'Just registered! Can\'t wait for this workshop 🎨', createdAt: '1 day ago', likes: 4 },
            { id: 105, author: 'Sujata Das', content: 'This is going to be amazing. Lakshmi is such a wonderful teacher!', createdAt: '1 day ago', likes: 6 },
        ]
    },
    {
        id: 5, author: 'Dr. Meena Iyer', avatar: null,
        content: 'Research insight: Creative activities reduce cortisol levels by up to 75% and increase dopamine production. Art isn\'t just beautiful—it\'s healing. Let\'s make wellness through art a priority!',
        tags: ['wellness', 'research', 'art-therapy'],
        likes: 56, comments: 18, shares: 15,
        createdAt: '3 days ago',
        pinned: false,
        replies: []
    },
];

export default function DashboardCommunity() {
    const { user } = useAuth();
    const [posts, setPosts] = useState(fallbackPosts);
    const [newPost, setNewPost] = useState('');
    const [showNewPost, setShowNewPost] = useState(false);
    const [search, setSearch] = useState('');
    const [filterTag, setFilterTag] = useState('all');
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [loading, setLoading] = useState(true);
    const [posting, setPosting] = useState(false);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await communityAPI.getMine();
                const apiPosts = res.data.data || [];
                if (apiPosts.length > 0) {
                    setPosts(apiPosts.map(post => ({
                        id: post._id || post.id,
                        author: post.author?.name || post.author || 'Community Member',
                        avatar: post.author?.avatar || post.author?.image || null,
                        content: post.content || '',
                        tags: post.tags || ['general'],
                        likes: post.likesCount || post.likes || 0,
                        comments: post.commentsCount || post.comments || 0,
                        shares: post.shares || 0,
                        createdAt: post.createdAt ? new Date(post.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Recently',
                        pinned: post.pinned || false,
                        replies: (post.commentsList || post.replies || []).map(reply => ({
                            id: reply._id || reply.id,
                            author: reply.author?.name || reply.author || 'Member',
                            content: reply.content || '',
                            createdAt: reply.createdAt ? new Date(reply.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) : 'Recently',
                            likes: reply.likesCount || reply.likes || 0,
                        })),
                    })));
                } else {
                    // If user has no posts, try fetching public posts
                    try {
                        const publicRes = await communityAPI.getPublic({ status: 'approved', limit: 10 });
                        const publicPosts = publicRes.data.data || [];
                        if (publicPosts.length > 0) {
                            setPosts(publicPosts.map(post => ({
                                id: post._id || post.id,
                                author: post.author?.name || post.author || 'Community Member',
                                avatar: post.author?.avatar || post.author?.image || null,
                                content: post.content || '',
                                tags: post.tags || ['general'],
                                likes: post.likesCount || post.likes || 0,
                                comments: post.commentsCount || post.comments || 0,
                                shares: post.shares || 0,
                                createdAt: post.createdAt ? new Date(post.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Recently',
                                pinned: post.pinned || false,
                                replies: (post.commentsList || post.replies || []).map(reply => ({
                                    id: reply._id || reply.id,
                                    author: reply.author?.name || reply.author || 'Member',
                                    content: reply.content || '',
                                    createdAt: reply.createdAt ? new Date(reply.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) : 'Recently',
                                    likes: reply.likesCount || reply.likes || 0,
                                })),
                            })));
                        }
                    } catch (publicErr) {
                        console.log('Using fallback community data:', publicErr.message);
                    }
                }
            } catch (err) {
                // If getMine fails, try public posts
                try {
                    const publicRes = await communityAPI.getPublic({ status: 'approved', limit: 10 });
                    const publicPosts = publicRes.data.data || [];
                    if (publicPosts.length > 0) {
                        setPosts(publicPosts.map(post => ({
                            id: post._id || post.id,
                            author: post.author?.name || post.author || 'Community Member',
                            avatar: post.author?.avatar || post.author?.image || null,
                            content: post.content || '',
                            tags: post.tags || ['general'],
                            likes: post.likesCount || post.likes || 0,
                            comments: post.commentsCount || post.comments || 0,
                            shares: post.shares || 0,
                            createdAt: post.createdAt ? new Date(post.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Recently',
                            pinned: post.pinned || false,
                            replies: (post.commentsList || post.replies || []).map(reply => ({
                                id: reply._id || reply.id,
                                author: reply.author?.name || reply.author || 'Member',
                                content: reply.content || '',
                                createdAt: reply.createdAt ? new Date(reply.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) : 'Recently',
                                likes: reply.likesCount || reply.likes || 0,
                            })),
                        })));
                    }
                } catch (publicErr2) {
                    console.log('Using fallback community data:', publicErr2.message);
                    setPosts(fallbackPosts);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    const tags = ['all', 'folk-art', 'mindfulness', 'painting', 'tips', 'workshop', 'wellness', 'announcement'];

    const filteredPosts = posts.filter(post => {
        const matchesSearch = post.content.toLowerCase().includes(search.toLowerCase()) ||
            post.author.toLowerCase().includes(search.toLowerCase());
        const matchesTag = filterTag === 'all' || post.tags.includes(filterTag);
        return matchesSearch && matchesTag;
    });

    const handleNewPost = async () => {
        if (!newPost.trim()) return;
        setPosting(true);
        try {
            const res = await communityAPI.create({ content: newPost, tags: ['general'] });
            const apiPost = res.data.data;
            const post = {
                id: apiPost._id || apiPost.id || Date.now(),
                author: apiPost.author?.name || user?.name || 'You',
                avatar: apiPost.author?.avatar || null,
                content: apiPost.content || newPost,
                tags: apiPost.tags || ['general'],
                likes: apiPost.likesCount || 0,
                comments: apiPost.commentsCount || 0,
                shares: apiPost.shares || 0,
                createdAt: 'Just now',
                pinned: apiPost.pinned || false,
                replies: [],
            };
            setPosts(prev => [post, ...prev]);
        } catch (err) {
            // Add locally as fallback
            const post = {
                id: Date.now(), author: user?.name || 'You', avatar: null,
                content: newPost, tags: ['general'],
                likes: 0, comments: 0, shares: 0,
                createdAt: 'Just now', pinned: false, replies: []
            };
            setPosts(prev => [post, ...prev]);
        }
        setNewPost('');
        setShowNewPost(false);
        setPosting(false);
    };

    const handleLike = async (postId) => {
        // Optimistic update
        setPosts(prev => prev.map(p =>
            p.id === postId ? { ...p, likes: p.likes + 1 } : p
        ));
        try {
            await communityAPI.like(postId);
        } catch (err) {
            // Revert on failure
            setPosts(prev => prev.map(p =>
                p.id === postId ? { ...p, likes: p.likes - 1 } : p
            ));
        }
    };

    const handleReply = async (postId) => {
        if (!replyText.trim()) return;
        const text = replyText;
        setReplyText('');
        setReplyingTo(null);
        // Optimistic update
        setPosts(prev => prev.map(p =>
            p.id === postId ? {
                ...p,
                replies: [...p.replies, {
                    id: Date.now(), author: user?.name || 'You',
                    content: text, createdAt: 'Just now', likes: 0
                }],
                comments: p.comments + 1
            } : p
        ));
        try {
            await communityAPI.comment(postId, { comment: text });
        } catch (err) {
            console.log('Reply saved locally only:', err.message);
        }
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-2">
                        <Skeleton className="h-7 w-56" />
                        <Skeleton className="h-4 w-96" />
                    </div>
                    <Skeleton className="h-10 w-28 rounded-sm" />
                </div>
                <Separator />
                <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="bg-surface rounded-xl shadow-md border border-heritage-creamDark p-5 space-y-4">
                            <div className="flex items-center gap-3">
                                <Skeleton className="h-10 w-10 rounded-full" />
                                <div className="space-y-2 flex-1">
                                    <Skeleton className="h-4 w-40" />
                                    <Skeleton className="h-3 w-28" />
                                </div>
                                <Skeleton className="h-6 w-20 rounded-full" />
                            </div>
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-5/6" />
                                <Skeleton className="h-4 w-2/3" />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <Skeleton className="h-8 w-24 rounded-sm" />
                                <Skeleton className="h-8 w-24 rounded-sm" />
                                <Skeleton className="h-8 w-24 rounded-sm" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div {...fadeInUp}>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                            <Users className="w-6 h-6 text-heritage-gold" />
                            Community Feed
                        </h1>
                        <p className="text-muted-foreground mt-1">Connect, share, and learn with fellow heritage art enthusiasts</p>
                    </div>
                    <Button variant="gold" onClick={() => setShowNewPost(true)}>
                        <Plus className="w-4 h-4 mr-1" /> New Post
                    </Button>
                </div>
            </motion.div>

            <Separator />

            {/* New Post Form */}
            {showNewPost && (
                <motion.div {...fadeInUp}>
                    <Card className="heritage-border">
                        <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                                <Avatar className="w-10 h-10">
                                    <AvatarFallback className="bg-heritage-terracotta text-text-main text-sm">
                                        {user?.name?.charAt(0) || 'Y'}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <Textarea
                                        value={newPost}
                                        onChange={e => setNewPost(e.target.value)}
                                        placeholder="Share your thoughts, artwork, tips, or questions with the community..."
                                        rows={3}
                                    />
                                    <div className="flex items-center gap-2 mt-3">
                                        <Button variant="ghost" size="sm"><Image className="w-4 h-4" /></Button>
                                        <Button variant="ghost" size="sm"><Smile className="w-4 h-4" /></Button>
                                        <div className="ml-auto flex items-center gap-2">
                                            <Button variant="outline" size="sm" onClick={() => setShowNewPost(false)}>Cancel</Button>
                                            <Button variant="gold" size="sm" onClick={handleNewPost} disabled={!newPost.trim() || posting}>
                                                {posting ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Send className="w-4 h-4 mr-1" />} Post
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            )}

            {/* Search & Filter */}
            <motion.div {...fadeInUp}>
                <div className="flex items-center gap-3 flex-wrap">
                    <div className="relative flex-1 min-w-[200px]">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search posts..." className="pl-9" />
                    </div>
                    <div className="flex items-center gap-1 flex-wrap">
                        {tags.map(tag => (
                            <Button
                                key={tag}
                                variant={filterTag === tag ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setFilterTag(tag)}
                                className="capitalize text-xs"
                            >
                                {tag === 'all' ? 'All' : tag.replace('-', ' ')}
                            </Button>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* Posts */}
            <div className="space-y-4">
                {filteredPosts.map((post) => (
                    <motion.div key={post.id} {...fadeInUp}>
                        <Card className={`hover:shadow-md transition-shadow ${post.pinned ? 'border-heritage-gold/40 bg-heritage-gold/5' : ''}`}>
                            <CardContent className="p-6">
                                {/* Post Header */}
                                <div className="flex items-start gap-3">
                                    <Avatar className="w-10 h-10">
                                        <AvatarFallback className="bg-heritage-terracotta text-text-main text-sm">
                                            {post.author.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <span className="font-semibold text-foreground text-sm">{post.author}</span>
                                            {post.pinned && (
                                                <Badge variant="gold" className="text-xs"><Pin className="w-3 h-3 mr-1" />Pinned</Badge>
                                            )}
                                            <span className="text-xs text-muted-foreground">{post.createdAt}</span>
                                        </div>
                                        <p className="text-foreground text-sm leading-relaxed mt-2">{post.content}</p>
                                        {/* Tags */}
                                        <div className="flex items-center gap-1.5 mt-2">
                                            {post.tags.map(tag => (
                                                <Badge key={tag} variant="outline" className="text-xs capitalize">{tag.replace('-', ' ')}</Badge>
                                            ))}
                                        </div>
                                        {/* Actions */}
                                        <div className="flex items-center gap-4 mt-3">
                                            <Button variant="ghost" size="sm" className="text-xs" onClick={() => handleLike(post.id)}>
                                                <Heart className="w-4 h-4 mr-1" /> {post.likes}
                                            </Button>
                                            <Button variant="ghost" size="sm" className="text-xs" onClick={() => setReplyingTo(post.id)}>
                                                <MessageCircle className="w-4 h-4 mr-1" /> {post.comments}
                                            </Button>
                                            <Button variant="ghost" size="sm" className="text-xs">
                                                <Share2 className="w-4 h-4 mr-1" /> {post.shares}
                                            </Button>
                                            <Button variant="ghost" size="sm" className="text-xs">
                                                <Bookmark className="w-4 h-4" />
                                            </Button>
                                        </div>

                                        {/* Replies */}
                                        {post.replies.length > 0 && (
                                            <div className="mt-4 space-y-3 pl-4 border-l-2 border-heritage-gold/20">
                                                {post.replies.map(reply => (
                                                    <div key={reply.id} className="flex items-start gap-2">
                                                        <Avatar className="w-7 h-7">
                                                            <AvatarFallback className="bg-heritage-terracotta/70 text-white text-xs">
                                                                {reply.author.charAt(0)}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-medium text-xs text-foreground">{reply.author}</span>
                                                                <span className="text-xs text-muted-foreground">{reply.createdAt}</span>
                                                            </div>
                                                            <p className="text-sm text-foreground mt-0.5">{reply.content}</p>
                                                            <Button variant="ghost" size="sm" className="text-xs mt-1">
                                                                <Heart className="w-3 h-3 mr-1" /> {reply.likes}
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Reply Form */}
                                        {replyingTo === post.id && (
                                            <div className="mt-3 pl-4 border-l-2 border-heritage-gold/30">
                                                <div className="flex items-start gap-2">
                                                    <Avatar className="w-7 h-7">
                                                        <AvatarFallback className="bg-heritage-terracotta text-text-main text-xs">
                                                            {user?.name?.charAt(0) || 'Y'}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex-1">
                                                        <Input
                                                            value={replyText}
                                                            onChange={e => setReplyText(e.target.value)}
                                                            placeholder="Write a reply..."
                                                            className="text-sm"
                                                        />
                                                        <div className="flex items-center gap-2 mt-2">
                                                            <Button variant="gold" size="sm" onClick={() => handleReply(post.id)} disabled={!replyText.trim()}>
                                                                <Reply className="w-3 h-3 mr-1" /> Reply
                                                            </Button>
                                                            <Button variant="ghost" size="sm" onClick={() => setReplyingTo(null)}>Cancel</Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Empty State */}
            {filteredPosts.length === 0 && (
                <div className="text-center py-12">
                    <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground">No posts found</h3>
                    <p className="text-muted-foreground mt-1">Be the first to share something with the community!</p>
                    <Button variant="gold" className="mt-4" onClick={() => setShowNewPost(true)}>
                        <Plus className="w-4 h-4 mr-1" /> Create Post
                    </Button>
                </div>
            )}

            {/* Community Stats */}
            <motion.div {...fadeInUp}>
                <Card className="bg-gradient-to-r from-heritage-terracotta/10 to-heritage-gold/10 border-heritage-gold/30">
                    <CardContent className="p-6">
                        <h3 className="font-semibold text-foreground flex items-center gap-2 mb-4">
                            <TrendingUp className="w-5 h-5 text-heritage-gold" />
                            Community Highlights
                        </h3>
                        <div className="grid md:grid-cols-3 gap-4">
                            <div className="p-3 rounded-lg bg-white/50">
                                <p className="text-2xl font-bold text-heritage-terracottaDark">1,247</p>
                                <p className="text-xs text-muted-foreground">Active Members</p>
                            </div>
                            <div className="p-3 rounded-lg bg-white/50">
                                <p className="text-2xl font-bold text-heritage-gold">892</p>
                                <p className="text-xs text-muted-foreground">Posts This Month</p>
                            </div>
                            <div className="p-3 rounded-lg bg-white/50">
                                <p className="text-2xl font-bold text-green-700">45</p>
                                <p className="text-xs text-muted-foreground">New Artworks Shared</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
