import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { videoAPI } from '@/api';

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
};

const fallbackVideos = [
    {
        id: 1,
        title: 'Introduction to Madhubani Art',
        creator: 'Priya Sharma',
        creatorEmail: 'priya@example.com',
        category: 'Tutorial',
        duration: '15:30',
        status: 'pending',
        submittedAt: '2024-01-15',
        description: 'A beginner-friendly tutorial covering the basics of Madhubani painting tradition.',
        tags: ['tutorial', 'madhubani', 'beginner']
    },
    {
        id: 2,
        title: 'Warli Art: From Tradition to Modern',
        creator: 'Amit Patel',
        creatorEmail: 'amit@example.com',
        category: 'Documentary',
        duration: '45:00',
        status: 'pending',
        submittedAt: '2024-01-14',
        description: 'Documentary exploring how Warli art has evolved from tribal traditions to contemporary expression.',
        tags: ['documentary', 'warli', 'tradition']
    },
    {
        id: 3,
        title: 'Mindful Painting Session - Tanjore Style',
        creator: 'Lakshmi Iyer',
        creatorEmail: 'lakshmi@example.com',
        category: 'Mindfulness',
        duration: '30:00',
        status: 'approved',
        submittedAt: '2024-01-12',
        approvedAt: '2024-01-13',
        views: 342,
        description: 'A guided mindful painting session using traditional Tanjore techniques for relaxation.',
        tags: ['mindfulness', 'tanjore', 'relaxation']
    },
    {
        id: 4,
        title: 'Quick Rangoli Design Ideas',
        creator: 'Kavita Reddy',
        creatorEmail: 'kavita@example.com',
        category: 'Quick Tips',
        duration: '5:00',
        status: 'rejected',
        submittedAt: '2024-01-10',
        rejectedAt: '2024-01-11',
        rejectionReason: 'Video quality is poor and audio is unclear. Please re-record with better equipment.',
        tags: ['rangoli', 'quick-tips', 'diwali']
    },
    {
        id: 5,
        title: 'Kalamkari: The Art of Storytelling',
        creator: 'Ramesh Kumar',
        creatorEmail: 'ramesh@example.com',
        category: 'Masterclass',
        duration: '60:00',
        status: 'pending',
        submittedAt: '2024-01-16',
        description: 'An in-depth masterclass on Kalamkari painting techniques and their narrative traditions.',
        tags: ['masterclass', 'kalamkari', 'storytelling']
    },
    {
        id: 6,
        title: 'Color Theory in Indian Miniature Paintings',
        creator: 'Deepika Das',
        creatorEmail: 'deepika@example.com',
        category: 'Educational',
        duration: '25:00',
        status: 'approved',
        submittedAt: '2024-01-08',
        approvedAt: '2024-01-09',
        views: 189,
        description: 'Educational video exploring color theory principles used in traditional Indian miniature paintings.',
        tags: ['educational', 'miniature', 'color-theory']
    }
];

export default function AdminVideos() {
    const [videos, setVideos] = useState(fallbackVideos);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [rejectionReason, setRejectionReason] = useState('');

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const res = await videoAPI.getAllAdmin();
                const apiVideos = res.data.data || res.data;
                setVideos(apiVideos.map(v => ({
                    id: v._id || v.id,
                    title: v.title,
                    creator: v.creator || v.creatorName || '',
                    creatorEmail: v.creatorEmail || v.submittedBy?.email || '',
                    category: v.category || '',
                    duration: v.duration || '',
                    status: v.status || 'pending',
                    submittedAt: v.createdAt ? new Date(v.createdAt).toISOString().split('T')[0] : v.submittedAt || '',
                    description: v.description || '',
                    tags: v.tags || [],
                    approvedAt: v.approvedAt ? new Date(v.approvedAt).toISOString().split('T')[0] : '',
                    rejectedAt: v.rejectedAt ? new Date(v.rejectedAt).toISOString().split('T')[0] : '',
                    rejectionReason: v.rejectionReason || '',
                    views: v.views || 0,
                    imageUrl: v.imageUrl || v.thumbnail || v.image || '',
                })));
            } catch (err) {
                console.error('Failed to fetch videos:', err);
                setVideos(fallbackVideos);
            } finally {
                setLoading(false);
            }
        };
        fetchVideos();
    }, []);

    const filteredVideos = videos.filter(v => {
        const matchesSearch = v.title.toLowerCase().includes(search.toLowerCase()) ||
            v.creator.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === 'all' || v.status === statusFilter;
        const matchesCategory = categoryFilter === 'all' || v.category === categoryFilter;
        return matchesSearch && matchesStatus && matchesCategory;
    });

    const pendingCount = videos.filter(v => v.status === 'pending').length;
    const approvedCount = videos.filter(v => v.status === 'approved').length;
    const rejectedCount = videos.filter(v => v.status === 'rejected').length;
    const totalViews = videos.filter(v => v.status === 'approved').reduce((sum, v) => sum + (v.views || 0), 0);

    const handleApprove = async (id) => {
        try {
            await videoAPI.approve(id);
        } catch (err) {
            console.error('Failed to approve video:', err);
        }
        setVideos(prev => prev.map(v =>
            v.id === id ? { ...v, status: 'approved', approvedAt: new Date().toISOString().split('T')[0], views: 0 } : v
        ));
        setSelectedVideo(null);
    };

    const handleReject = async (id) => {
        if (!rejectionReason.trim()) return;
        try {
            await videoAPI.reject(id, { reason: rejectionReason });
        } catch (err) {
            console.error('Failed to reject video:', err);
        }
        setVideos(prev => prev.map(v =>
            v.id === id ? { ...v, status: 'rejected', rejectedAt: new Date().toISOString().split('T')[0], rejectionReason } : v
        ));
        setSelectedVideo(null);
        setRejectionReason('');
    };

    const categories = ['all', 'Tutorial', 'Documentary', 'Mindfulness', 'Quick Tips', 'Masterclass', 'Educational', 'Workshop Recording'];

    const getStatusColor = (status) => {
        switch (status) {
            case 'approved': return 'bg-green-100 text-green-800 border-green-200';
            case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getCategoryIcon = (category) => {
        switch (category) {
            case 'Tutorial': return '🎨';
            case 'Documentary': return '🎬';
            case 'Mindfulness': return '🧘';
            case 'Quick Tips': return '⚡';
            case 'Masterclass': return '👨‍🏫';
            case 'Educational': return '📚';
            default: return '🎥';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-heritage-gold" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <motion.div {...fadeInUp}>
                <h1 className="text-3xl font-bold text-heritage-terracottaDark">Video Moderation</h1>
                <p className="text-gray-600 mt-1">Review, approve, and manage submitted video content</p>
            </motion.div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <motion.div {...fadeInUp} transition={{ delay: 0.1 }}>
                    <Card className="border-heritage-gold/20">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Total Videos</p>
                                    <p className="text-2xl font-bold text-heritage-terracottaDark">{videos.length}</p>
                                </div>
                                <div className="w-10 h-10 rounded-lg bg-heritage-terracotta/10 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-heritage-terracottaDark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div {...fadeInUp} transition={{ delay: 0.2 }}>
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

                <motion.div {...fadeInUp} transition={{ delay: 0.3 }}>
                    <Card className="border-green-200 bg-green-50/50">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-green-700">Approved</p>
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

                <motion.div {...fadeInUp} transition={{ delay: 0.4 }}>
                    <Card className="border-heritage-gold/20">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Total Views</p>
                                    <p className="text-2xl font-bold text-heritage-terracottaDark">{totalViews}</p>
                                </div>
                                <div className="w-10 h-10 rounded-lg bg-heritage-gold/10 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-heritage-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
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
                                    {pendingCount} videos awaiting review. Please review them promptly.
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
                                    placeholder="Search videos by title or creator..."
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

            {/* Videos List */}
            <div className="space-y-4">
                {filteredVideos.map((video, index) => (
                    <motion.div
                        key={video.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                    >
                        <Card className={`border-l-4 ${video.status === 'pending' ? 'border-l-yellow-500' : video.status === 'approved' ? 'border-l-green-500' : 'border-l-red-500'}`}>
                            <CardContent className="p-6">
                                <div className="flex flex-col lg:flex-row gap-6">
                                    {/* Video Thumbnail */}
                                    {video.imageUrl ? (
                                        <div className="w-full lg:w-56 h-36 rounded-lg overflow-hidden relative">
                                            <img src={video.imageUrl} alt={video.title} className="w-full h-full object-cover" />
                                            <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                                                {video.duration}
                                            </div>
                                            <div className="absolute top-2 left-2 text-sm">
                                                {getCategoryIcon(video.category)}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="w-full lg:w-56 h-36 rounded-lg overflow-hidden bg-gradient-to-br from-heritage-terracotta/30 to-heritage-gold/30 flex items-center justify-center relative">
                                            <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                                                {video.duration}
                                            </div>
                                            <div className="absolute top-2 left-2 text-sm">
                                                {getCategoryIcon(video.category)}
                                            </div>
                                        </div>
                                    )}

                                    {/* Details */}
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <h3 className="text-lg font-semibold text-heritage-terracottaDark">{video.title}</h3>
                                                <p className="text-sm text-gray-600">by {video.creator} ({video.creatorEmail})</p>
                                            </div>
                                            <Badge className={getStatusColor(video.status)}>
                                                {video.status.charAt(0).toUpperCase() + video.status.slice(1)}
                                            </Badge>
                                        </div>

                                        <p className="text-sm text-gray-700 mb-3">{video.description}</p>

                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm mb-3">
                                            <div>
                                                <span className="text-gray-500">Category:</span>
                                                <span className="ml-1 font-medium">{video.category}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Duration:</span>
                                                <span className="ml-1 font-medium">{video.duration}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Submitted:</span>
                                                <span className="ml-1 font-medium">{video.submittedAt}</span>
                                            </div>
                                            {video.views !== undefined && (
                                                <div>
                                                    <span className="text-gray-500">Views:</span>
                                                    <span className="ml-1 font-medium">{video.views}</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-2 mb-3">
                                            {video.tags.map(tag => (
                                                <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                                            ))}
                                        </div>

                                        {video.status === 'rejected' && video.rejectionReason && (
                                            <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-3">
                                                <p className="text-sm text-red-800 font-medium">Rejection Reason:</p>
                                                <p className="text-sm text-red-700">{video.rejectionReason}</p>
                                            </div>
                                        )}

                                        {video.status === 'approved' && video.approvedAt && (
                                            <div className="bg-green-50 border border-green-200 rounded-md p-3 mb-3">
                                                <p className="text-sm text-green-800">Approved on {video.approvedAt} • {video.views} views</p>
                                            </div>
                                        )}

                                        <Separator className="my-3" />

                                        <div className="flex items-center gap-3">
                                            {video.status === 'pending' && (
                                                <>
                                                    <Button
                                                        size="sm"
                                                        className="bg-green-600 hover:bg-green-700"
                                                        onClick={() => handleApprove(video.id)}
                                                    >
                                                        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        Approve
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="border-red-300 text-red-700 hover:bg-red-50"
                                                        onClick={() => {
                                                            setSelectedVideo(video);
                                                            setRejectionReason('');
                                                        }}
                                                    >
                                                        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                                                        </svg>
                                                        Reject
                                                    </Button>
                                                </>
                                            )}
                                            <Button size="sm" variant="outline" className="border-heritage-terracotta/30 text-heritage-terracottaDark hover:bg-heritage-terracotta/5"
                                                onClick={() => setSelectedVideo(video)}>
                                                View Details
                                            </Button>
                                            {video.status === 'approved' && (
                                                <Button size="sm" variant="outline" className="border-heritage-gold/30 text-heritage-gold hover:bg-heritage-gold/5">
                                                    <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.8 2.634a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.8-2.634" />
                                                    </svg>
                                                    Feature
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {filteredVideos.length === 0 && (
                <motion.div {...fadeInUp}>
                    <Card>
                        <CardContent className="p-8 text-center">
                            <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            <p className="text-gray-500">No videos found matching your filters.</p>
                        </CardContent>
                    </Card>
                </motion.div>
            )}

            {/* Rejection Modal */}
            {selectedVideo && selectedVideo.status === 'pending' && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl"
                    >
                        <h3 className="text-lg font-semibold text-heritage-terracottaDark mb-2">Reject Video</h3>
                        <p className="text-sm text-gray-600 mb-4">
                            You are rejecting "{selectedVideo.title}" by {selectedVideo.creator}. Please provide a reason.
                        </p>
                        <textarea
                            className="w-full border rounded-md p-3 text-sm mb-4 focus:ring-2 focus:ring-heritage-terracotta/20 focus:border-heritage-terracotta"
                            rows={4}
                            placeholder="Explain why this video is being rejected..."
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                        />
                        <div className="flex gap-3 justify-end">
                            <Button variant="outline" onClick={() => setSelectedVideo(null)}>Cancel</Button>
                            <Button
                                className="bg-red-600 hover:bg-red-700"
                                onClick={() => handleReject(selectedVideo.id)}
                                disabled={!rejectionReason.trim()}
                            >
                                Confirm Rejection
                            </Button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Detail Modal */}
            {selectedVideo && selectedVideo.status !== 'pending' && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl"
                    >
                        <h3 className="text-lg font-semibold text-heritage-terracottaDark mb-2">{selectedVideo.title}</h3>
                        <p className="text-sm text-gray-600 mb-4">by {selectedVideo.creator}</p>
                        <Separator className="mb-4" />
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Category:</span>
                                <span className="font-medium">{selectedVideo.category}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Duration:</span>
                                <span className="font-medium">{selectedVideo.duration}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Status:</span>
                                <Badge className={getStatusColor(selectedVideo.status)}>
                                    {selectedVideo.status.charAt(0).toUpperCase() + selectedVideo.status.slice(1)}
                                </Badge>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Submitted:</span>
                                <span className="font-medium">{selectedVideo.submittedAt}</span>
                            </div>
                            {selectedVideo.approvedAt && (
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Approved:</span>
                                    <span className="font-medium">{selectedVideo.approvedAt}</span>
                                </div>
                            )}
                            {selectedVideo.views !== undefined && (
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Views:</span>
                                    <span className="font-medium">{selectedVideo.views}</span>
                                </div>
                            )}
                            {selectedVideo.rejectionReason && (
                                <div>
                                    <span className="text-gray-500">Rejection Reason:</span>
                                    <p className="mt-1 text-red-700 bg-red-50 p-2 rounded">{selectedVideo.rejectionReason}</p>
                                </div>
                            )}
                        </div>
                        <Separator className="my-4" />
                        <p className="text-sm text-gray-700">{selectedVideo.description}</p>
                        <div className="flex gap-2 mt-3">
                            {selectedVideo.tags.map(tag => (
                                <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                            ))}
                        </div>
                        <div className="mt-4 flex justify-end">
                            <Button variant="outline" onClick={() => setSelectedVideo(null)}>Close</Button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}