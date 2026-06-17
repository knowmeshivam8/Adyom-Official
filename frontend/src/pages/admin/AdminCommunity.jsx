import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { communityAPI } from '@/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
};

// Fallback data used when API is unavailable
const fallbackPosts = [
    {
        id: 1,
        author: 'Priya Sharma',
        authorEmail: 'priya@example.com',
        avatar: null,
        title: 'My First Madhubani Painting Experience',
        content: 'I just completed my first Madhubani painting after taking the beginner masterclass. The experience was incredibly fulfilling! Here are some tips I learned along the way that might help other beginners...',
        category: 'Art Journey',
        tags: ['madhubani', 'beginner', 'experience'],
        status: 'pending',
        likes: 0,
        comments: 0,
        pinned: false,
        createdAt: '2024-01-16'
    },
    {
        id: 2,
        author: 'Amit Patel',
        authorEmail: 'amit@example.com',
        avatar: null,
        title: 'Warli Art Workshop Review - Amazing Experience!',
        content: 'Attended the Warli Art Workshop last weekend and it was absolutely amazing! The instructor was knowledgeable and patient. The materials provided were excellent quality. Highly recommend!',
        category: 'Review',
        tags: ['warli', 'workshop', 'review'],
        status: 'approved',
        likes: 45,
        comments: 12,
        pinned: false,
        createdAt: '2024-01-14',
        approvedAt: '2024-01-14'
    },
    {
        id: 3,
        author: 'Deepika Das',
        authorEmail: 'deepika@example.com',
        avatar: null,
        title: 'Sharing My Pattachitra Collection',
        content: 'I have been collecting Pattachitra art for over 5 years now. Here is my curated collection with descriptions of each piece and the stories they tell. Would love to hear from other collectors!',
        category: 'Showcase',
        tags: ['pattachitra', 'collection', 'showcase'],
        status: 'pending',
        likes: 0,
        comments: 0,
        pinned: false,
        createdAt: '2024-01-15'
    },
    {
        id: 4,
        author: 'SpamUser123',
        authorEmail: 'spam@fake.com',
        avatar: null,
        title: 'Buy Cheap Products Online!!!',
        content: 'Click here to buy amazing products at unbelievable prices! Limited time offer!!! [SPAM LINK]',
        category: 'Other',
        tags: [],
        status: 'rejected',
        likes: 0,
        comments: 0,
        pinned: false,
        createdAt: '2024-01-16',
        rejectionReason: 'Spam content. Account flagged for review.'
    },
    {
        id: 5,
        author: 'Lakshmi Iyer',
        authorEmail: 'lakshmi@example.com',
        avatar: null,
        title: 'Mindfulness Through Art - A Personal Journey',
        content: 'Art has been my meditation for the past year. I want to share how practicing traditional art forms has transformed my mental health and overall wellbeing. The mindful repetition of patterns in Tanjore painting...',
        category: 'Mindfulness',
        tags: ['mindfulness', 'tanjore', 'wellness', 'personal'],
        status: 'approved',
        likes: 78,
        comments: 23,
        pinned: true,
        createdAt: '2024-01-12',
        approvedAt: '2024-01-12'
    },
    {
        id: 6,
        author: 'Kavita Reddy',
        authorEmail: 'kavita@example.com',
        avatar: null,
        title: 'Rangoli Designs for Beginners - Step by Step Guide',
        content: 'Here is a detailed step-by-step guide for creating beautiful Rangoli designs. Perfect for beginners who want to start with simple patterns and gradually move to more complex designs.',
        category: 'Tutorial',
        tags: ['rangoli', 'tutorial', 'beginner', 'guide'],
        status: 'pending',
        likes: 0,
        comments: 0,
        pinned: false,
        createdAt: '2024-01-16'
    },
    {
        id: 7,
        author: 'Ramesh Kumar',
        authorEmail: 'ramesh@example.com',
        avatar: null,
        title: 'How Kalamkari Artists Are Adapting to Modern Markets',
        content: 'An interesting discussion about how traditional Kalamkari artists are finding new markets and adapting their craft for contemporary audiences while preserving authenticity. What are your thoughts?',
        category: 'Discussion',
        tags: ['kalamkari', 'market', 'adaptation', 'tradition'],
        status: 'approved',
        likes: 34,
        comments: 18,
        pinned: false,
        createdAt: '2024-01-10',
        approvedAt: '2024-01-10'
    }
];

export default function AdminCommunity() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [activeTab, setActiveTab] = useState('moderation');
    const [selectedPost, setSelectedPost] = useState(null);
    const [rejectionReason, setRejectionReason] = useState('');
    
    // Meet Attendance State
    const [meetStats, setMeetStats] = useState([]);
    const [selectedMeetId, setSelectedMeetId] = useState(null);
    const [meetAttendees, setMeetAttendees] = useState([]);
    const [loadingStats, setLoadingStats] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await communityAPI.getAllAdmin();
                const apiPosts = res.data.data || res.data;
                setPosts(apiPosts.map(p => ({
                    ...p,
                    id: p._id,
                    createdAt: p.createdAt?.split('T')[0] || p.createdAt,
                    approvedAt: p.approvedAt?.split('T')[0] || p.approvedAt,
                })));
            } catch (err) {
                console.error('Failed to fetch community posts:', err);
                setPosts(fallbackPosts);
            } finally {
                setLoading(false);
            }
        };
        const fetchStats = async () => {
            try {
                const res = await communityAPI.getMeetStats();
                setMeetStats(res.data.data || []);
            } catch (err) {
                console.error('Failed to fetch meet stats:', err);
            } finally {
                setLoadingStats(false);
            }
        };
        fetchPosts();
        fetchStats();
    }, []);

    const handleSelectMeet = async (meetId) => {
        setSelectedMeetId(meetId);
        try {
            const res = await communityAPI.getMeetAttendees(meetId);
            setMeetAttendees(res.data.data || []);
        } catch (err) {
            console.error('Failed to fetch meet attendees:', err);
        }
    };

    const filteredPosts = posts.filter(p => {
        const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
            p.author.toLowerCase().includes(search.toLowerCase()) ||
            p.content.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
        const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
        return matchesSearch && matchesStatus && matchesCategory;
    });

    const pendingCount = posts.filter(p => p.status === 'pending').length;
    const approvedCount = posts.filter(p => p.status === 'approved').length;
    const rejectedCount = posts.filter(p => p.status === 'rejected').length;
    const totalLikes = posts.filter(p => p.status === 'approved').reduce((sum, p) => sum + p.likes, 0);
    const totalComments = posts.filter(p => p.status === 'approved').reduce((sum, p) => sum + p.comments, 0);

    const handleApprove = async (id) => {
        try {
            await communityAPI.approve(id);
            setPosts(prev => prev.map(p =>
                p.id === id ? { ...p, status: 'approved', approvedAt: new Date().toISOString().split('T')[0] } : p
            ));
        } catch (err) {
            console.error('Failed to approve post:', err);
            setPosts(prev => prev.map(p =>
                p.id === id ? { ...p, status: 'approved', approvedAt: new Date().toISOString().split('T')[0] } : p
            ));
        }
        setSelectedPost(null);
    };

    const handleReject = async (id) => {
        if (!rejectionReason.trim()) return;
        try {
            await communityAPI.reject(id, { reason: rejectionReason });
            setPosts(prev => prev.map(p =>
                p.id === id ? { ...p, status: 'rejected', rejectionReason } : p
            ));
        } catch (err) {
            console.error('Failed to reject post:', err);
            setPosts(prev => prev.map(p =>
                p.id === id ? { ...p, status: 'rejected', rejectionReason } : p
            ));
        }
        setSelectedPost(null);
        setRejectionReason('');
    };

    const handleTogglePinned = (id) => {
        setPosts(prev => prev.map(p =>
            p.id === id ? { ...p, pinned: !p.pinned } : p
        ));
    };

    const handleDelete = async (id) => {
        try {
            await communityAPI.delete(id);
            setPosts(prev => prev.filter(p => p.id !== id));
        } catch (err) {
            console.error('Failed to delete post:', err);
        }
    };

    const categories = ['all', 'Art Journey', 'Review', 'Showcase', 'Tutorial', 'Discussion', 'Mindfulness', 'Question', 'Other'];

    const getStatusColor = (status) => {
        switch (status) {
            case 'approved': return 'bg-green-100 text-green-800 border-green-200';
            case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getCategoryColor = (category) => {
        switch (category) {
            case 'Art Journey': return 'bg-heritage-terracotta/10 text-heritage-terracottaDark border-heritage-terracotta/20';
            case 'Review': return 'bg-heritage-gold/20 text-heritage-gold border-heritage-gold/30';
            case 'Showcase': return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'Tutorial': return 'bg-teal-100 text-teal-800 border-teal-200';
            case 'Discussion': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'Mindfulness': return 'bg-green-100 text-green-800 border-green-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-heritage-terracottaDark" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <motion.div {...fadeInUp} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-heritage-terracottaDark">Community Management</h1>
                    <p className="text-gray-600 mt-1">Manage posts, discussions, and Drishti meet attendance</p>
                </div>
                
                <div className="flex bg-white rounded-lg p-1 border border-heritage-gold/20 shadow-sm">
                    <button
                        onClick={() => setActiveTab('moderation')}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                            activeTab === 'moderation' 
                                ? 'bg-heritage-gold/20 text-heritage-terracottaDark' 
                                : 'text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                        Post Moderation
                    </button>
                    <button
                        onClick={() => setActiveTab('attendance')}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                            activeTab === 'attendance' 
                                ? 'bg-heritage-gold/20 text-heritage-terracottaDark' 
                                : 'text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                        Meet Attendance
                    </button>
                </div>
            </motion.div>

            {activeTab === 'moderation' && (
                <>
                    {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <motion.div {...fadeInUp} transition={{ delay: 0.1 }}>
                    <Card className="border-yellow-200 bg-yellow-50/50">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-yellow-700">Pending Review</p>
                                    <p className="text-2xl font-bold text-yellow-800">{pendingCount}</p>
                                </div>
                                <div className="w-10 h-10 rounded-lg bg-yellow-200/50 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-yellow-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div {...fadeInUp} transition={{ delay: 0.2 }}>
                    <Card className="border-green-200 bg-green-50/50">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-green-700">Approved Posts</p>
                                    <p className="text-2xl font-bold text-green-800">{approvedCount}</p>
                                </div>
                                <div className="w-10 h-10 rounded-lg bg-green-200/50 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div {...fadeInUp} transition={{ delay: 0.3 }}>
                    <Card className="border-heritage-gold/20">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Total Likes</p>
                                    <p className="text-2xl font-bold text-heritage-terracottaDark">{totalLikes}</p>
                                </div>
                                <div className="w-10 h-10 rounded-lg bg-red-100/50 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M11.645 20.91l-.281-.839A3.197 3.197 0 009.5 18.5H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2h-4.5a3.197 3.197 0 00-2.864 1.571l-.281.839z" />
                                    </svg>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div {...fadeInUp} transition={{ delay: 0.4 }}>
                    <Card className="border-heritage-gold/20">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Total Comments</p>
                                    <p className="text-2xl font-bold text-heritage-terracottaDark">{totalComments}</p>
                                </div>
                                <div className="w-10 h-10 rounded-lg bg-heritage-terracotta/10 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-heritage-terracottaDark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Pending Alert */}
            {pendingCount > 0 && (
                <motion.div {...fadeInUp} transition={{ delay: 0.5 }}>
                    <Card className="border-heritage-gold bg-heritage-gold/5">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-heritage-gold/20 flex items-center justify-center">
                                    <svg className="w-4 h-4 text-heritage-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                    </svg>
                                </div>
                                <p className="text-heritage-terracottaDark font-medium">
                                    {pendingCount} community posts awaiting review. Ensure quality content moderation.
                                </p>
                                <Button size="sm" className="bg-heritage-terracotta text-text-main hover:bg-heritage-terracotta/90 ml-auto"
                                    onClick={() => setStatusFilter('pending')}>
                                    Review Now
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            )}

            {/* Search & Filters */}
            <motion.div {...fadeInUp} transition={{ delay: 0.6 }}>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <Input
                                    placeholder="Search posts by title, author, or content..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                            <select
                                className="border rounded-md px-3 py-2 text-sm"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="all">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="approved">Approved</option>
                                <option value="rejected">Rejected</option>
                            </select>
                            <select
                                className="border rounded-md px-3 py-2 text-sm"
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                            >
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</option>
                                ))}
                            </select>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Posts List */}
            <div className="space-y-4">
                {filteredPosts.map((post, index) => (
                    <motion.div
                        key={post.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                    >
                        <Card className={`border-l-4 ${post.pinned ? 'border-l-heritage-gold' : post.status === 'pending' ? 'border-l-yellow-500' : post.status === 'approved' ? 'border-l-green-500' : 'border-l-red-500'}`}>
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-heritage-terracotta to-heritage-gold flex items-center justify-center text-white font-bold text-sm">
                                            {post.author.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                {post.pinned && (
                                                    <Badge className="bg-heritage-gold/20 text-heritage-gold border-heritage-gold/30">
                                                        📌 Pinned
                                                    </Badge>
                                                )}
                                                <h3 className="text-lg font-semibold text-heritage-terracottaDark">{post.title}</h3>
                                            </div>
                                            <p className="text-sm text-gray-600">{post.author} ({post.authorEmail}) • {post.createdAt}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge className={getCategoryColor(post.category)}>{post.category}</Badge>
                                        <Badge className={getStatusColor(post.status)}>
                                            {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                                        </Badge>
                                    </div>
                                </div>

                                <p className="text-sm text-gray-700 mb-3 line-clamp-3">{post.content}</p>

                                <div className="flex items-center gap-2 mb-3">
                                    {post.tags.map(tag => (
                                        <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                                    ))}
                                </div>

                                {post.status === 'approved' && (
                                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                                        <span className="flex items-center gap-1">
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M11.645 20.91l-.281-.839A3.197 3.197 0 009.5 18.5H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2h-4.5a3.197 3.197 0 00-2.864 1.571l-.281.839z" />
                                            </svg>
                                            {post.likes} likes
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01" />
                                            </svg>
                                            {post.comments} comments
                                        </span>
                                    </div>
                                )}

                                {post.status === 'rejected' && post.rejectionReason && (
                                    <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-3">
                                        <p className="text-sm text-red-800 font-medium">Rejection Reason:</p>
                                        <p className="text-sm text-red-700">{post.rejectionReason}</p>
                                    </div>
                                )}

                                <Separator className="my-3" />

                                <div className="flex items-center gap-3">
                                    {post.status === 'pending' && (
                                        <>
                                            <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleApprove(post.id)}>
                                                Approve
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="border-red-300 text-red-700 hover:bg-red-50"
                                                onClick={() => {
                                                    setSelectedPost(post);
                                                    setRejectionReason('');
                                                }}
                                            >
                                                Reject
                                            </Button>
                                        </>
                                    )}
                                    {post.status === 'approved' && (
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className={post.pinned ? 'border-heritage-gold/30 text-heritage-gold' : 'border-gray-300 text-gray-600'}
                                            onClick={() => handleTogglePinned(post.id)}
                                        >
                                            {post.pinned ? '📌 Unpin' : '📌 Pin Post'}
                                        </Button>
                                    )}
                                    <Button size="sm" variant="outline" className="border-heritage-terracotta/30 text-heritage-terracottaDark hover:bg-heritage-terracotta/5"
                                        onClick={() => setSelectedPost(post)}>
                                        View Full Post
                                    </Button>
                                    <Button size="sm" variant="outline" className="border-red-300 text-red-600 hover:bg-red-50"
                                        onClick={() => handleDelete(post.id)}>
                                        Delete
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {filteredPosts.length === 0 && (
                <motion.div {...fadeInUp}>
                    <Card>
                        <CardContent className="p-8 text-center">
                            <p className="text-gray-500">No community posts found matching your filters.</p>
                        </CardContent>
                    </Card>
                </motion.div>
            )}

            {/* Rejection Modal */}
            {selectedPost && selectedPost.status === 'pending' && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl"
                    >
                        <h3 className="text-lg font-semibold text-heritage-terracottaDark mb-2">Reject Post</h3>
                        <p className="text-sm text-gray-600 mb-1">Post: "{selectedPost.title}"</p>
                        <p className="text-sm text-gray-600 mb-4">Author: {selectedPost.author}</p>
                        <textarea
                            className="w-full border rounded-md p-3 text-sm mb-4 focus:ring-2 focus:ring-heritage-terracotta/20 focus:border-heritage-terracotta"
                            rows={4}
                            placeholder="Provide a reason for rejecting this post..."
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                        />
                        <div className="flex gap-3 justify-end">
                            <Button variant="outline" onClick={() => setSelectedPost(null)}>Cancel</Button>
                            <Button
                                className="bg-red-600 hover:bg-red-700"
                                onClick={() => handleReject(selectedPost.id)}
                                disabled={!rejectionReason.trim()}
                            >
                                Confirm Rejection
                            </Button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Detail Modal */}
            {selectedPost && selectedPost.status !== 'pending' && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl max-h-[90vh] overflow-y-auto"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-heritage-terracotta to-heritage-gold flex items-center justify-center text-white font-bold text-sm">
                                {selectedPost.author.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-heritage-terracottaDark">{selectedPost.title}</h3>
                                <p className="text-sm text-gray-600">{selectedPost.author} • {selectedPost.createdAt}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 mb-3">
                            <Badge className={getCategoryColor(selectedPost.category)}>{selectedPost.category}</Badge>
                            <Badge className={getStatusColor(selectedPost.status)}>
                                {selectedPost.status.charAt(0).toUpperCase() + selectedPost.status.slice(1)}
                            </Badge>
                            {selectedPost.pinned && (
                                <Badge className="bg-heritage-gold/20 text-heritage-gold border-heritage-gold/30">📌 Pinned</Badge>
                            )}
                        </div>

                        <Separator className="my-3" />

                        <p className="text-sm text-gray-700 mb-4">{selectedPost.content}</p>

                        <div className="flex items-center gap-2 mb-4">
                            {selectedPost.tags.map(tag => (
                                <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                            ))}
                        </div>

                        {selectedPost.status === 'approved' && (
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                <span>{selectedPost.likes} likes</span>
                                <span>{selectedPost.comments} comments</span>
                            </div>
                        )}

                        {selectedPost.rejectionReason && (
                            <div className="bg-red-50 border border-red-200 rounded-md p-3">
                                <p className="text-sm text-red-800 font-medium">Rejection Reason:</p>
                                <p className="text-sm text-red-700">{selectedPost.rejectionReason}</p>
                            </div>
                        )}

                        <div className="mt-4 flex justify-end">
                            <Button variant="outline" onClick={() => setSelectedPost(null)}>Close</Button>
                        </div>
                    </motion.div>
                </div>
            )}
            </>
            )}

            {activeTab === 'attendance' && (
                <motion.div {...fadeInUp} className="space-y-6">
                    {loadingStats ? (
                        <div className="flex justify-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-heritage-terracottaDark" />
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-3 gap-6">
                            {/* Left Col: Meets List */}
                            <div className="md:col-span-1 space-y-4">
                                <h2 className="text-lg font-semibold text-heritage-terracottaDark mb-4">Past & Active Meets</h2>
                                {meetStats.length === 0 ? (
                                    <p className="text-gray-500 text-sm">No meet attendance data found.</p>
                                ) : (
                                    meetStats.map((stat) => (
                                        <Card 
                                            key={stat._id} 
                                            className={`cursor-pointer transition-colors ${selectedMeetId === stat._id ? 'border-heritage-gold bg-heritage-gold/5' : 'hover:border-heritage-gold/50'}`}
                                            onClick={() => handleSelectMeet(stat._id)}
                                        >
                                            <CardContent className="p-4">
                                                <h3 className="font-semibold text-heritage-terracottaDark truncate">{stat.meetTitle || stat._id}</h3>
                                                <div className="flex justify-between items-center mt-2 text-sm text-gray-600">
                                                    <span>{stat.totalAttendees} attendees</span>
                                                    <span>{stat.avgDuration ? Math.round(stat.avgDuration) : 0} min avg</span>
                                                </div>
                                                {stat.organizations?.length > 0 && stat.organizations[0] !== "" && (
                                                    <div className="mt-2 flex flex-wrap gap-1">
                                                        {stat.organizations.filter(o => o).slice(0, 2).map((org, i) => (
                                                            <Badge key={i} variant="outline" className="text-[10px]">{org}</Badge>
                                                        ))}
                                                        {stat.organizations.filter(o => o).length > 2 && (
                                                            <Badge variant="outline" className="text-[10px]">+{stat.organizations.filter(o => o).length - 2} more</Badge>
                                                        )}
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    ))
                                )}
                            </div>

                            {/* Right Col: Meet Details */}
                            <div className="md:col-span-2">
                                <Card>
                                    <CardHeader className="bg-heritage-creamLight border-b border-heritage-gold/20">
                                        <CardTitle className="text-xl text-heritage-terracottaDark">
                                            {selectedMeetId ? 'Attendee Roster' : 'Select a Meet'}
                                        </CardTitle>
                                        <CardDescription>
                                            {selectedMeetId 
                                                ? `Viewing attendees for meet ID: ${selectedMeetId}` 
                                                : 'Click on a meet from the list to view its attendees.'}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                        {selectedMeetId ? (
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-sm text-left">
                                                    <thead className="text-xs text-gray-700 bg-gray-50 border-b">
                                                        <tr>
                                                            <th className="px-6 py-3">Name</th>
                                                            <th className="px-6 py-3">Email</th>
                                                            <th className="px-6 py-3">Organization</th>
                                                            <th className="px-6 py-3">Joined At</th>
                                                            <th className="px-6 py-3">Duration (min)</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {meetAttendees.length === 0 ? (
                                                            <tr>
                                                                <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                                                    No attendees found.
                                                                </td>
                                                            </tr>
                                                        ) : (
                                                            meetAttendees.map((attendee) => (
                                                                <tr key={attendee._id} className="bg-white border-b hover:bg-gray-50">
                                                                    <td className="px-6 py-4 font-medium text-gray-900">
                                                                        {attendee.name}
                                                                    </td>
                                                                    <td className="px-6 py-4">{attendee.email}</td>
                                                                    <td className="px-6 py-4">{attendee.organization || '-'}</td>
                                                                    <td className="px-6 py-4">
                                                                        {new Date(attendee.joinedAt).toLocaleString()}
                                                                    </td>
                                                                    <td className="px-6 py-4">{attendee.duration || 0}</td>
                                                                </tr>
                                                            ))
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        ) : (
                                            <div className="py-20 text-center text-gray-500">
                                                <svg className="w-12 h-12 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                </svg>
                                                Select a meet from the left to view attendees
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    )}
                </motion.div>
            )}
        </div>
    );
}