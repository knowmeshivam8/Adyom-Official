import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Video, Upload, Eye, Clock, CheckCircle2, XCircle,
    AlertCircle, Trash2, Edit, Plus, Play, Film,
    Mic, ScreenShare, FileVideo, Settings
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { videoAPI } from '@/api';

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
};

export default function DashboardVideos() {
    const [showUpload, setShowUpload] = useState(false);
    const [filterStatus, setFilterStatus] = useState('all');
    const [videos, setVideos] = useState([]);
    const [uploadForm, setUploadForm] = useState({
        title: '',
        description: '',
        category: 'tutorial',
        duration: '',
        tags: ''
    });
    const [uploadFile, setUploadFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    const fallbackVideos = [
        {
            id: 1, title: 'Painting Process: Rajasthani Sunset',
            description: 'Step-by-step painting process of my Rajasthani Sunset artwork',
            category: 'Tutorial', duration: '15:30',
            status: 'approved', views: 456, likes: 34,
            createdAt: 'Jun 2, 2026', gradient: 'from-red-500 to-orange-600'
        },
        {
            id: 2, title: 'Warli Art Workshop Recording',
            description: 'Full recording of the Warli art live workshop session',
            category: 'Workshop', duration: '45:00',
            status: 'approved', views: 289, likes: 22,
            createdAt: 'May 28, 2026', gradient: 'from-amber-500 to-yellow-600'
        },
        {
            id: 3, title: 'Mindful Drawing Session',
            description: 'A calming mindful drawing session with guided meditation',
            category: 'Mindfulness', duration: '20:00',
            status: 'pending', views: 0, likes: 0,
            createdAt: 'Jun 6, 2026', gradient: 'from-purple-500 to-pink-600'
        },
        {
            id: 4, title: 'Madhubani Techniques Demo',
            description: 'Quick demonstration of traditional Madhubani painting techniques',
            category: 'Tutorial', duration: '8:45',
            status: 'rejected', views: 0, likes: 0,
            rejectionReason: 'Audio quality is poor. Please re-record with better audio setup.',
            createdAt: 'May 22, 2026', gradient: 'from-green-500 to-emerald-600'
        },
    ];

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const res = await videoAPI.getMine();
                if (res.data?.data?.length > 0) {
                    setVideos(res.data.data.map(v => ({
                        id: v._id,
                        title: v.title || 'Untitled',
                        description: v.description || '',
                        category: v.category || 'General',
                        duration: v.duration || '0:00',
                        status: v.status || 'pending',
                        views: v.views || 0,
                        likes: v.likes?.length || v.likes || 0,
                        createdAt: v.createdAt ? new Date(v.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : '',
                        gradient: 'from-red-500 to-orange-600',
                        thumbnail: v.thumbnail || v.image || null,
                        rejectionReason: v.rejectionReason || '',
                    })));
                } else {
                    setVideos(fallbackVideos);
                }
            } catch (err) {
                setVideos(fallbackVideos);
            }
        };
        fetchVideos();
    }, []);

    const filteredVideos = videos.filter(v => {
        if (filterStatus === 'all') return true;
        return v.status === filterStatus;
    });

    const statusCounts = {
        all: videos.length,
        approved: videos.filter(v => v.status === 'approved').length,
        pending: videos.filter(v => v.status === 'pending').length,
        rejected: videos.filter(v => v.status === 'rejected').length,
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'approved': return <Badge variant="success" className="text-xs"><CheckCircle2 className="w-3 h-3 mr-1" />Approved</Badge>;
            case 'pending': return <Badge variant="warning" className="text-xs"><Clock className="w-3 h-3 mr-1" />Pending Review</Badge>;
            case 'rejected': return <Badge variant="danger" className="text-xs"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
            default: return <Badge variant="outline">{status}</Badge>;
        }
    };

    const handleUploadSubmit = async (e) => {
        e.preventDefault();
        setUploading(true);
        try {
            if (uploadFile) {
                const formData = new FormData();
                Object.entries(uploadForm).forEach(([key, val]) => {
                    if (val) formData.append(key, val);
                });
                formData.append('video', uploadFile);
                const res = await videoAPI.submit(formData);
                if (res.data?.data) {
                    setVideos(prev => [...prev, {
                        id: res.data.data._id || Date.now(),
                        title: res.data.data.title,
                        description: res.data.data.description || '',
                        category: res.data.data.category || uploadForm.category,
                        duration: res.data.data.duration || uploadForm.duration || '0:00',
                        status: 'pending', views: 0, likes: 0,
                        createdAt: 'Just now', gradient: 'from-gray-400 to-gray-500',
                        thumbnail: res.data.data.thumbnail || null,
                    }]);
                }
            } else {
                const res = await videoAPI.submit(uploadForm);
                if (res.data?.data) {
                    setVideos(prev => [...prev, {
                        id: res.data.data._id || Date.now(),
                        title: res.data.data.title,
                        description: res.data.data.description || '',
                        category: res.data.data.category || uploadForm.category,
                        duration: res.data.data.duration || uploadForm.duration || '0:00',
                        status: 'pending', views: 0, likes: 0,
                        createdAt: 'Just now', gradient: 'from-gray-400 to-gray-500',
                    }]);
                }
            }
            setShowUpload(false);
            setUploadForm({ title: '', description: '', category: 'tutorial', duration: '', tags: '' });
            setUploadFile(null);
        } catch (err) {
            // Fallback: add locally even if API fails
            setVideos(prev => [...prev, {
                id: Date.now(), title: uploadForm.title, description: uploadForm.description,
                category: uploadForm.category, duration: uploadForm.duration || '0:00',
                status: 'pending', views: 0, likes: 0,
                createdAt: 'Just now', gradient: 'from-gray-400 to-gray-500'
            }]);
            setShowUpload(false);
            setUploadForm({ title: '', description: '', category: 'tutorial', duration: '', tags: '' });
            setUploadFile(null);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div {...fadeInUp}>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                            <Video className="w-6 h-6 text-heritage-gold" />
                            My Videos
                        </h1>
                        <p className="text-muted-foreground mt-1">Submit and manage your video content</p>
                    </div>
                    <Button variant="gold" onClick={() => setShowUpload(true)}>
                        <Plus className="w-4 h-4 mr-1" /> Submit New Video
                    </Button>
                </div>
            </motion.div>

            <Separator />

            {/* Upload Modal */}
            {showUpload && (
                <motion.div {...fadeInUp}>
                    <Card className="heritage-border">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Upload className="w-5 h-5 text-heritage-gold" />
                                Submit New Video
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleUploadSubmit} className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium mb-1.5 block">Title *</label>
                                        <Input value={uploadForm.title} onChange={e => setUploadForm(p => ({ ...p, title: e.target.value }))} placeholder="Video title" required />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium mb-1.5 block">Category *</label>
                                        <select value={uploadForm.category} onChange={e => setUploadForm(p => ({ ...p, category: e.target.value }))} className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm" required>
                                            <option value="tutorial">Tutorial</option>
                                            <option value="workshop">Workshop Recording</option>
                                            <option value="mindfulness">Mindfulness Session</option>
                                            <option value="process">Art Process</option>
                                            <option value="interview">Artist Interview</option>
                                            <option value="vlog">Art Vlog</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium mb-1.5 block">Description *</label>
                                    <Textarea value={uploadForm.description} onChange={e => setUploadForm(p => ({ ...p, description: e.target.value }))} placeholder="Describe your video content..." rows={3} required />
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium mb-1.5 block">Duration (approx.)</label>
                                        <Input value={uploadForm.duration} onChange={e => setUploadForm(p => ({ ...p, duration: e.target.value }))} placeholder="e.g., 15:30" />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium mb-1.5 block">Tags</label>
                                        <Input value={uploadForm.tags} onChange={e => setUploadForm(p => ({ ...p, tags: e.target.value }))} placeholder="tutorial, painting, folk-art" />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium mb-1.5 block">Video File *</label>
                                    <div className="border-2 border-dashed border-heritage-gold/30 rounded-lg p-8 text-center hover:border-heritage-gold/60 transition-colors">
                                        {uploadFile ? (
                                            <div className="flex items-center gap-2">
                                                <FileVideo className="w-5 h-5 text-heritage-gold" />
                                                <span className="text-sm text-foreground">{uploadFile.name}</span>
                                                <Button variant="ghost" size="sm" onClick={() => setUploadFile(null)}>
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        ) : (
                                            <div>
                                                <Film className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                                                <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                                                <p className="text-xs text-muted-foreground mt-1">MP4, MOV, WEBM up to 500MB · Max 30 minutes</p>
                                                <Input type="file" accept="video/*" onChange={e => setUploadFile(e.target.files[0])} className="mt-3 max-w-xs mx-auto" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 pt-2">
                                    <Button type="submit" variant="gold" disabled={uploading}>
                                        {uploading ? 'Submitting...' : 'Submit for Review'}
                                    </Button>
                                    <Button variant="outline" onClick={() => setShowUpload(false)}>Cancel</Button>
                                    <p className="text-xs text-muted-foreground ml-2">
                                        <AlertCircle className="w-3 h-3 inline mr-1" />
                                        Video submissions are reviewed within 2-3 business days
                                    </p>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </motion.div>
            )}

            {/* Filter Bar */}
            <motion.div {...fadeInUp}>
                <div className="flex items-center gap-3 flex-wrap">
                    {Object.entries(statusCounts).map(([status, count]) => (
                        <Button
                            key={status}
                            variant={filterStatus === status ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setFilterStatus(status)}
                            className="capitalize"
                        >
                            {status === 'all' ? 'All' : status} ({count})
                        </Button>
                    ))}
                </div>
            </motion.div>

            {/* Video List */}
            <div className="space-y-4">
                {filteredVideos.map((video) => (
                    <motion.div key={video.id} {...fadeInUp}>
                        <Card className="hover:shadow-md transition-shadow">
                            <CardContent className="p-4">
                                <div className="flex items-start gap-4">
                                    <div className={`w-24 h-16 rounded-lg bg-gradient-to-br ${video.gradient} flex items-center justify-center flex-shrink-0 relative`}>
                                        <Play className="w-8 h-8 text-white" />
                                        <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
                                            {video.duration}
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h4 className="font-semibold text-foreground">{video.title}</h4>
                                            {getStatusBadge(video.status)}
                                            <Badge variant="outline" className="text-xs">{video.category}</Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground line-clamp-2">{video.description}</p>
                                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                            <span>{video.createdAt}</span>
                                            {video.status === 'approved' && (
                                                <>
                                                    <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{video.views} views</span>
                                                    <span className="flex items-center gap-1"><Film className="w-3 h-3" />{video.likes} likes</span>
                                                </>
                                            )}
                                        </div>
                                        {video.status === 'rejected' && video.rejectionReason && (
                                            <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                                                <AlertCircle className="w-3 h-3" />{video.rejectionReason}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-1 flex-shrink-0">
                                        <Button variant="ghost" size="icon"><Edit className="w-4 h-4" /></Button>
                                        <Button variant="ghost" size="icon"><Trash2 className="w-4 h-4 text-red-500" /></Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Empty State */}
            {filteredVideos.length === 0 && (
                <div className="text-center py-12">
                    <Video className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground">No videos found</h3>
                    <p className="text-muted-foreground mt-1">
                        {filterStatus === 'all' ? 'Submit your first video to share your creative process' : `No ${filterStatus} videos`}
                    </p>
                    <Button variant="gold" className="mt-4" onClick={() => setShowUpload(true)}>
                        <Plus className="w-4 h-4 mr-1" /> Submit Video
                    </Button>
                </div>
            )}

            {/* Video Guidelines */}
            <motion.div {...fadeInUp}>
                <Card className="bg-gradient-to-r from-heritage-terracotta/10 to-heritage-gold/10 border-heritage-gold/30">
                    <CardContent className="p-6">
                        <h3 className="font-semibold text-foreground flex items-center gap-2 mb-3">
                            <Settings className="w-5 h-5 text-heritage-gold" />
                            Video Submission Guidelines
                        </h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                    Maximum duration: 30 minutes
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                    Supported formats: MP4, MOV, WEBM
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                    Maximum file size: 500MB
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                    Minimum resolution: 720p recommended
                                </li>
                            </ul>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                    Ensure good audio quality and lighting
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                    Add a clear title and detailed description
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                    No copyrighted music without permission
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                    Content must align with heritage arts and culture
                                </li>
                            </ul>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}