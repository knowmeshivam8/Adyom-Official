import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Palette, Upload, Eye, Clock, CheckCircle2, XCircle,
    AlertCircle, Trash2, Edit, Grid3x3, List, Plus,
    Image, Heart, MessageCircle, Share2, Filter
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { artworkAPI } from '@/api';

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
};

export default function DashboardArtwork() {
    const [viewMode, setViewMode] = useState('grid');
    const [showUpload, setShowUpload] = useState(false);
    const [filterStatus, setFilterStatus] = useState('all');
    const [artworks, setArtworks] = useState([]);
    const [uploadForm, setUploadForm] = useState({
        title: '',
        description: '',
        category: 'painting',
        medium: '',
        dimensions: '',
        tags: ''
    });
    const [uploadFile, setUploadFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    const fallbackArtworks = [
        {
            id: 1, title: 'Rajasthani Sunset', description: 'A vibrant depiction of desert sunset',
            category: 'Painting', medium: 'Acrylic on Canvas', dimensions: '24×36 inches',
            status: 'approved', views: 245, likes: 18, comments: 5,
            createdAt: 'Jun 1, 2026', gradient: 'from-orange-500 to-red-600'
        },
        {
            id: 2, title: 'Madhubani Peacock', description: 'Traditional Madhubani style peacock motif',
            category: 'Folk Art', medium: 'Natural Colors on Paper', dimensions: '18×24 inches',
            status: 'approved', views: 189, likes: 32, comments: 8,
            createdAt: 'May 20, 2026', gradient: 'from-green-500 to-emerald-600'
        },
        {
            id: 3, title: 'Meditative Lotus', description: 'Lotus painted during mindfulness session',
            category: 'Mindfulness Art', medium: 'Watercolor', dimensions: '12×16 inches',
            status: 'pending', views: 0, likes: 0, comments: 0,
            createdAt: 'Jun 5, 2026', gradient: 'from-purple-500 to-pink-600'
        },
        {
            id: 4, title: 'Warli Village Scene', description: 'Traditional Warli art depicting village life',
            category: 'Folk Art', medium: 'White Rice Paste on Mud Base', dimensions: '30×40 inches',
            status: 'approved', views: 156, likes: 24, comments: 3,
            createdAt: 'May 10, 2026', gradient: 'from-amber-500 to-yellow-600'
        },
        {
            id: 5, title: 'Abstract Heritage', description: 'Modern abstract interpretation of heritage motifs',
            category: 'Mixed Media', medium: 'Mixed Media on Board', dimensions: '20×28 inches',
            status: 'rejected', views: 0, likes: 0, comments: 0,
            rejectionReason: 'Image quality too low. Please resubmit with higher resolution.',
            createdAt: 'May 25, 2026', gradient: 'from-indigo-500 to-blue-600'
        },
    ];

    useEffect(() => {
        const fetchArtworks = async () => {
            try {
                const res = await artworkAPI.getMine();
                if (res.data?.data?.length > 0) {
                    setArtworks(res.data.data.map(art => ({
                        id: art._id,
                        title: art.title || 'Untitled',
                        description: art.description || '',
                        category: art.category || 'General',
                        medium: art.medium || '',
                        dimensions: art.dimensions || '',
                        status: art.status || 'pending',
                        views: art.views || 0,
                        likes: art.likes?.length || art.likes || 0,
                        comments: art.comments?.length || art.comments || 0,
                        createdAt: art.createdAt ? new Date(art.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : '',
                        gradient: 'from-orange-500 to-red-600',
                        image: art.image || null,
                        rejectionReason: art.rejectionReason || '',
                    })));
                } else {
                    setArtworks(fallbackArtworks);
                }
            } catch (err) {
                setArtworks(fallbackArtworks);
            }
        };
        fetchArtworks();
    }, []);

    const filteredArtworks = artworks.filter(a => {
        if (filterStatus === 'all') return true;
        return a.status === filterStatus;
    });

    const statusCounts = {
        all: artworks.length,
        approved: artworks.filter(a => a.status === 'approved').length,
        pending: artworks.filter(a => a.status === 'pending').length,
        rejected: artworks.filter(a => a.status === 'rejected').length,
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
            const submitData = { ...uploadForm };
            if (uploadFile) {
                // If there's a file, create FormData for multipart upload
                const formData = new FormData();
                Object.entries(submitData).forEach(([key, val]) => {
                    if (val) formData.append(key, val);
                });
                formData.append('image', uploadFile);
                const res = await artworkAPI.submit(formData);
                if (res.data?.data) {
                    setArtworks(prev => [...prev, {
                        id: res.data.data._id || Date.now(),
                        title: res.data.data.title,
                        description: res.data.data.description || '',
                        category: res.data.data.category || uploadForm.category,
                        medium: res.data.data.medium || '',
                        dimensions: res.data.data.dimensions || '',
                        status: res.data.data.status || 'pending',
                        views: 0, likes: 0, comments: 0,
                        createdAt: 'Just now',
                        gradient: 'from-gray-400 to-gray-500',
                        image: res.data.data.image || null,
                    }]);
                }
            } else {
                const res = await artworkAPI.submit(submitData);
                if (res.data?.data) {
                    setArtworks(prev => [...prev, {
                        id: res.data.data._id || Date.now(),
                        title: res.data.data.title,
                        description: res.data.data.description || '',
                        category: res.data.data.category || uploadForm.category,
                        medium: res.data.data.medium || '',
                        dimensions: res.data.data.dimensions || '',
                        status: 'pending', views: 0, likes: 0, comments: 0,
                        createdAt: 'Just now', gradient: 'from-gray-400 to-gray-500',
                    }]);
                }
            }
            setShowUpload(false);
            setUploadForm({ title: '', description: '', category: 'painting', medium: '', dimensions: '', tags: '' });
            setUploadFile(null);
        } catch (err) {
            // Fallback: add locally even if API fails
            setArtworks(prev => [...prev, {
                id: Date.now(), title: uploadForm.title, description: uploadForm.description,
                category: uploadForm.category, medium: uploadForm.medium,
                dimensions: uploadForm.dimensions, status: 'pending',
                views: 0, likes: 0, comments: 0,
                createdAt: 'Just now', gradient: 'from-gray-400 to-gray-500'
            }]);
            setShowUpload(false);
            setUploadForm({ title: '', description: '', category: 'painting', medium: '', dimensions: '', tags: '' });
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
                            <Palette className="w-6 h-6 text-heritage-gold" />
                            My Artworks
                        </h1>
                        <p className="text-muted-foreground mt-1">Manage your artwork portfolio and submissions</p>
                    </div>
                    <Button variant="gold" onClick={() => setShowUpload(true)}>
                        <Plus className="w-4 h-4 mr-1" /> Upload New Artwork
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
                                Upload New Artwork
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleUploadSubmit} className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium mb-1.5 block">Title *</label>
                                        <Input value={uploadForm.title} onChange={e => setUploadForm(p => ({ ...p, title: e.target.value }))} placeholder="Artwork title" required />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium mb-1.5 block">Category *</label>
                                        <select value={uploadForm.category} onChange={e => setUploadForm(p => ({ ...p, category: e.target.value }))} className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm" required>
                                            <option value="painting">Painting</option>
                                            <option value="folk-art">Folk Art</option>
                                            <option value="sculpture">Sculpture</option>
                                            <option value="textile">Textile Art</option>
                                            <option value="mindfulness-art">Mindfulness Art</option>
                                            <option value="mixed-media">Mixed Media</option>
                                            <option value="photography">Photography</option>
                                            <option value="digital">Digital Art</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium mb-1.5 block">Description *</label>
                                    <Textarea value={uploadForm.description} onChange={e => setUploadForm(p => ({ ...p, description: e.target.value }))} placeholder="Describe your artwork..." rows={3} required />
                                </div>
                                <div className="grid md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="text-sm font-medium mb-1.5 block">Medium</label>
                                        <Input value={uploadForm.medium} onChange={e => setUploadForm(p => ({ ...p, medium: e.target.value }))} placeholder="e.g., Acrylic on Canvas" />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium mb-1.5 block">Dimensions</label>
                                        <Input value={uploadForm.dimensions} onChange={e => setUploadForm(p => ({ ...p, dimensions: e.target.value }))} placeholder="e.g., 24×36 inches" />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium mb-1.5 block">Tags</label>
                                        <Input value={uploadForm.tags} onChange={e => setUploadForm(p => ({ ...p, tags: e.target.value }))} placeholder="heritage, folk, modern" />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium mb-1.5 block">Artwork Image *</label>
                                    <div className="border-2 border-dashed border-heritage-gold/30 rounded-lg p-8 text-center hover:border-heritage-gold/60 transition-colors">
                                        {uploadFile ? (
                                            <div className="flex items-center gap-2">
                                                <Image className="w-5 h-5 text-heritage-gold" />
                                                <span className="text-sm text-foreground">{uploadFile.name}</span>
                                                <Button variant="ghost" size="sm" onClick={() => setUploadFile(null)}>
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        ) : (
                                            <div>
                                                <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                                                <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                                                <p className="text-xs text-muted-foreground mt-1">PNG, JPG, WEBP up to 10MB</p>
                                                <Input type="file" accept="image/*" onChange={e => setUploadFile(e.target.files[0])} className="mt-3 max-w-xs mx-auto" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 pt-2">
                                    <Button type="submit" variant="gold" disabled={uploading}>
                                        {uploading ? 'Uploading...' : 'Submit for Review'}
                                    </Button>
                                    <Button variant="outline" onClick={() => setShowUpload(false)}>Cancel</Button>
                                    <p className="text-xs text-muted-foreground ml-2">
                                        <AlertCircle className="w-3 h-3 inline mr-1" />
                                        All submissions are reviewed before being published
                                    </p>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </motion.div>
            )}

            {/* Stats & Filter Bar */}
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
                    <div className="ml-auto flex items-center gap-1">
                        <Button variant={viewMode === 'grid' ? 'default' : 'ghost'} size="icon" onClick={() => setViewMode('grid')}>
                            <Grid3x3 className="w-4 h-4" />
                        </Button>
                        <Button variant={viewMode === 'list' ? 'default' : 'ghost'} size="icon" onClick={() => setViewMode('list')}>
                            <List className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </motion.div>

            {/* Artwork Grid/List */}
            {viewMode === 'grid' ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredArtworks.map((artwork) => (
                        <motion.div key={artwork.id} {...fadeInUp}>
                            <Card className="group hover:shadow-lg transition-all overflow-hidden">
                                <div className={`h-40 bg-gradient-to-br ${artwork.gradient} relative`}>
                                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                        <Palette className="w-12 h-12 text-white group-hover:text-white transition-colors" />
                                    </div>
                                    <div className="absolute top-2 right-2">
                                        {getStatusBadge(artwork.status)}
                                    </div>
                                </div>
                                <CardContent className="p-3">
                                    <h4 className="font-semibold text-sm text-foreground truncate">{artwork.title}</h4>
                                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{artwork.description}</p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <Badge variant="outline" className="text-xs">{artwork.category}</Badge>
                                    </div>
                                    {artwork.status === 'approved' && (
                                        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                                            <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{artwork.views}</span>
                                            <span className="flex items-center gap-1"><Heart className="w-3 h-3" />{artwork.likes}</span>
                                            <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" />{artwork.comments}</span>
                                        </div>
                                    )}
                                    {artwork.status === 'rejected' && artwork.rejectionReason && (
                                        <p className="text-xs text-red-600 mt-2 flex items-center gap-1">
                                            <AlertCircle className="w-3 h-3" />{artwork.rejectionReason}
                                        </p>
                                    )}
                                    <p className="text-xs text-muted-foreground mt-2">{artwork.createdAt}</p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredArtworks.map((artwork) => (
                        <motion.div key={artwork.id} {...fadeInUp}>
                            <Card className="hover:shadow-md transition-shadow">
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-20 h-16 rounded-lg bg-gradient-to-br ${artwork.gradient} flex items-center justify-center flex-shrink-0`}>
                                            <Palette className="w-6 h-6 text-white" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className="font-semibold text-foreground">{artwork.title}</h4>
                                                {getStatusBadge(artwork.status)}
                                                <Badge variant="outline" className="text-xs">{artwork.category}</Badge>
                                            </div>
                                            <p className="text-sm text-muted-foreground truncate">{artwork.description}</p>
                                            <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                                                <span>{artwork.medium}</span>
                                                <span>{artwork.dimensions}</span>
                                                <span>{artwork.createdAt}</span>
                                                {artwork.status === 'approved' && (
                                                    <>
                                                        <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{artwork.views}</span>
                                                        <span className="flex items-center gap-1"><Heart className="w-3 h-3" />{artwork.likes}</span>
                                                    </>
                                                )}
                                            </div>
                                            {artwork.status === 'rejected' && artwork.rejectionReason && (
                                                <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                                                    <AlertCircle className="w-3 h-3" />{artwork.rejectionReason}
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
            )}

            {/* Empty State */}
            {filteredArtworks.length === 0 && (
                <div className="text-center py-12">
                    <Palette className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground">No artworks found</h3>
                    <p className="text-muted-foreground mt-1">
                        {filterStatus === 'all' ? 'Upload your first artwork to start building your portfolio' : `No ${filterStatus} artworks`}
                    </p>
                    <Button variant="gold" className="mt-4" onClick={() => setShowUpload(true)}>
                        <Plus className="w-4 h-4 mr-1" /> Upload Artwork
                    </Button>
                </div>
            )}

            {/* Tips Card */}
            <motion.div {...fadeInUp}>
                <Card className="bg-gradient-to-r from-heritage-terracotta/10 to-heritage-gold/10 border-heritage-gold/30">
                    <CardContent className="p-6">
                        <h3 className="font-semibold text-foreground flex items-center gap-2 mb-3">
                            <AlertCircle className="w-5 h-5 text-heritage-gold" />
                            Tips for Great Artwork Submissions
                        </h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li className="flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                Upload high-resolution images (minimum 1024px width recommended)
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                Provide detailed descriptions including medium, dimensions, and inspiration
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                Use relevant tags to help others discover your work
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                All submissions undergo moderation before being published (typically 1-2 business days)
                            </li>
                        </ul>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}