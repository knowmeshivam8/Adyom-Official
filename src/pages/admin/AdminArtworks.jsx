import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Upload, Plus, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { AdminTableSkeleton } from '@/components/ui/page-skeletons';
import { artworkAPI } from '@/api';

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
};

const ARTWORK_CATEGORIES = [
    { value: 'folk-art', label: 'Folk Art' },
    { value: 'tribal-art', label: 'Tribal Art' },
    { value: 'painting', label: 'Painting' },
    { value: 'sculpture', label: 'Sculpture' },
    { value: 'textile', label: 'Textile' },
    { value: 'pottery', label: 'Pottery' },
    { value: 'mixed-media', label: 'Mixed Media' },
    { value: 'other', label: 'Other' },
];

export default function AdminArtworks() {
    const [artworks, setArtworks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [selectedArtwork, setSelectedArtwork] = useState(null);
    const [rejectionReason, setRejectionReason] = useState('');

    // Upload form state
    const [showUpload, setShowUpload] = useState(false);
    const [uploadForm, setUploadForm] = useState({
        title: '', description: '', category: 'folk-art', artistName: ''
    });
    const [uploadImage, setUploadImage] = useState(null);
    const [uploadPreview, setUploadPreview] = useState(null);
    const [uploadLoading, setUploadLoading] = useState(false);
    const [uploadError, setUploadError] = useState('');

    useEffect(() => {
        const fetchArtworks = async () => {
            try {
                const res = await artworkAPI.getAllAdmin();
                const apiArtworks = res.data.data || res.data || [];
                setArtworks(apiArtworks.map(art => ({
                    id: art._id || art.id,
                    title: art.title,
                    artist: art.artistName || (art.artist?.name) || 'Unknown',
                    artistEmail: art.artist?.email || '',
                    category: art.category || '',
                    status: art.status || 'pending',
                    submittedAt: art.createdAt ? new Date(art.createdAt).toISOString().split('T')[0] : '',
                    description: art.description || '',
                    imageUrl: art.images?.[0]?.url || art.image || '',
                    approvedAt: art.reviewedAt && art.status === 'approved' ? new Date(art.reviewedAt).toISOString().split('T')[0] : '',
                    rejectionReason: art.adminNote || '',
                })));
            } catch (err) {
                console.error('Failed to fetch artworks:', err);
                setArtworks([]);
            } finally {
                setLoading(false);
            }
        };
        fetchArtworks();
    }, []);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) {
            setUploadImage(null);
            setUploadPreview(null);
            return;
        }
        setUploadImage(file);
        const reader = new FileReader();
        reader.onloadend = () => setUploadPreview(reader.result);
        reader.readAsDataURL(file);
    };

    const resetUploadForm = () => {
        setUploadForm({ title: '', description: '', category: 'folk-art', artistName: '' });
        setUploadImage(null);
        setUploadPreview(null);
        setUploadError('');
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        setUploadError('');

        if (!uploadForm.title.trim()) {
            setUploadError('Title is required.');
            return;
        }
        if (!uploadImage) {
            setUploadError('Please select an image to upload.');
            return;
        }

        setUploadLoading(true);
        try {
            const formData = new FormData();
            formData.append('title', uploadForm.title);
            formData.append('description', uploadForm.description);
            formData.append('category', uploadForm.category);
            formData.append('artistName', uploadForm.artistName || 'Admin');
            formData.append('status', 'approved');
            formData.append('isPublic', 'true');
            formData.append('image', uploadImage);

            const res = await artworkAPI.adminCreate(formData);
            const newArtwork = res.data.data || res.data;

            setArtworks(prev => [{
                id: newArtwork._id || newArtwork.id,
                title: newArtwork.title || uploadForm.title,
                artist: newArtwork.artistName || uploadForm.artistName || 'Admin',
                artistEmail: '',
                category: newArtwork.category || uploadForm.category,
                status: 'approved',
                submittedAt: new Date().toISOString().split('T')[0],
                description: newArtwork.description || uploadForm.description,
                imageUrl: newArtwork.images?.[0]?.url || '',
                approvedAt: new Date().toISOString().split('T')[0],
                rejectionReason: '',
            }, ...prev]);

            setShowUpload(false);
            resetUploadForm();
        } catch (err) {
            console.error('Failed to upload artwork:', err);
            setUploadError(err.response?.data?.message || 'Failed to upload artwork.');
        } finally {
            setUploadLoading(false);
        }
    };

    const filteredArtworks = artworks.filter(a => {
        const matchesSearch = a.title.toLowerCase().includes(search.toLowerCase()) ||
            a.artist.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === 'all' || a.status === statusFilter;
        const matchesCategory = categoryFilter === 'all' || a.category === categoryFilter;
        return matchesSearch && matchesStatus && matchesCategory;
    });

    const pendingCount = artworks.filter(a => a.status === 'pending').length;
    const approvedCount = artworks.filter(a => a.status === 'approved').length;
    const rejectedCount = artworks.filter(a => a.status === 'rejected').length;

    const handleApprove = async (id) => {
        try {
            await artworkAPI.approve(id);
        } catch (err) {
            console.error('Failed to approve artwork:', err);
        }
        setArtworks(prev => prev.map(a =>
            a.id === id ? { ...a, status: 'approved', approvedAt: new Date().toISOString().split('T')[0] } : a
        ));
        setSelectedArtwork(null);
    };

    const handleReject = async (id) => {
        if (!rejectionReason.trim()) return;
        try {
            await artworkAPI.reject(id, { adminNote: rejectionReason });
        } catch (err) {
            console.error('Failed to reject artwork:', err);
        }
        setArtworks(prev => prev.map(a =>
            a.id === id ? { ...a, status: 'rejected', rejectionReason } : a
        ));
        setSelectedArtwork(null);
        setRejectionReason('');
    };

    const handleDeleteArtwork = async (id) => {
        if (!confirm('Are you sure you want to delete this artwork?')) return;
        try {
            await artworkAPI.delete(id);
            setArtworks(prev => prev.filter(a => a.id !== id));
        } catch (err) {
            console.error('Failed to delete artwork:', err);
        }
    };

    const handleToggleInnovative = async (id) => {
        try {
            await artworkAPI.toggleInnovative(id);
        } catch (err) {
            console.error('Toggle innovative failed:', err);
        }
        setArtworks(prev => prev.map(a =>
            a.id === id ? { ...a, isInnovative: !a.isInnovative } : a
        ));
    };

    const categories = ['all', ...ARTWORK_CATEGORIES.map(c => c.value)];

    const getStatusColor = (status) => {
        switch (status) {
            case 'approved': return 'bg-green-100 text-green-800 border-green-200';
            case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    if (loading) {
        return <AdminTableSkeleton rows={8} filters={3} />;
    }

    return (
        <div className="space-y-6">
            <motion.div {...fadeInUp}>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-heritage-terracottaDark">Artwork Management</h1>
                        <p className="text-gray-600 mt-1">Upload, review, and manage artworks</p>
                    </div>
                    <Button variant="gold" size="sm" onClick={() => { resetUploadForm(); setShowUpload(true); }}>
                        <Plus className="w-4 h-4 mr-1" /> Upload New Artwork
                    </Button>
                </div>
            </motion.div>

            {/* Upload Form */}
            {showUpload && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                    <Card className="heritage-border border-heritage-gold/30">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Upload className="w-5 h-5 text-heritage-gold" />
                                Upload New Artwork
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {uploadError && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm font-body mb-4">
                                    {uploadError}
                                </div>
                            )}
                            <form className="space-y-4" onSubmit={handleUpload}>
                                <div>
                                    <label className="text-sm font-medium mb-1.5 block text-heritage-terracottaDark">Title *</label>
                                    <Input
                                        value={uploadForm.title}
                                        onChange={e => setUploadForm(f => ({ ...f, title: e.target.value }))}
                                        placeholder="Artwork title"
                                        required
                                    />
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium mb-1.5 block text-heritage-terracottaDark">Category</label>
                                        <select
                                            value={uploadForm.category}
                                            onChange={e => setUploadForm(f => ({ ...f, category: e.target.value }))}
                                            className="w-full h-10 rounded-md border border-heritage-creamDark bg-heritage-creamLight px-3 text-sm text-heritage-brown focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-heritage-gold"
                                        >
                                            {ARTWORK_CATEGORIES.map(cat => (
                                                <option key={cat.value} value={cat.value}>{cat.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium mb-1.5 block text-heritage-terracottaDark">Artist Name</label>
                                        <Input
                                            value={uploadForm.artistName}
                                            onChange={e => setUploadForm(f => ({ ...f, artistName: e.target.value }))}
                                            placeholder="Artist or creator name"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-medium mb-1.5 block text-heritage-terracottaDark">Description</label>
                                    <Textarea
                                        value={uploadForm.description}
                                        onChange={e => setUploadForm(f => ({ ...f, description: e.target.value }))}
                                        placeholder="Describe the artwork..."
                                        rows={3}
                                    />
                                </div>

                                {/* Image Upload */}
                                <div>
                                    <label className="text-sm font-medium mb-1.5 block text-heritage-terracottaDark">Image *</label>
                                    <div className="flex items-start gap-4">
                                        <div className="flex-1">
                                            <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-heritage-creamDark rounded-md cursor-pointer hover:border-heritage-gold transition-colors bg-heritage-creamLight">
                                                {uploadPreview ? (
                                                    <img src={uploadPreview} alt="Preview" className="h-full object-contain rounded-md" />
                                                ) : (
                                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                        <Upload className="w-10 h-10 text-text-main mb-2" />
                                                        <p className="text-sm text-text-main">Click to upload artwork image</p>
                                                        <p className="text-xs text-heritage-sand">JPG, PNG, WebP (max 5MB)</p>
                                                    </div>
                                                )}
                                                <input
                                                    type="file"
                                                    accept="image/jpeg,image/png,image/webp,image/gif"
                                                    onChange={handleImageChange}
                                                    className="hidden"
                                                />
                                            </label>
                                        </div>
                                        {uploadPreview && (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => { setUploadImage(null); setUploadPreview(null); }}
                                            >
                                                <X className="w-4 h-4 mr-1" /> Remove
                                            </Button>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 pt-2">
                                    <Button type="submit" variant="gold" disabled={uploadLoading}>
                                        {uploadLoading ? (
                                            <><Loader2 className="w-4 h-4 mr-1 animate-spin" /> Uploading...</>
                                        ) : (
                                            <><Upload className="w-4 h-4 mr-1" /> Upload Artwork</>
                                        )}
                                    </Button>
                                    <Button type="button" variant="outline" onClick={() => { setShowUpload(false); resetUploadForm(); }}>
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </motion.div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <motion.div {...fadeInUp} transition={{ delay: 0.1 }}>
                    <Card className="border-heritage-gold/20">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Total Artworks</p>
                                    <p className="text-2xl font-bold text-heritage-terracottaDark">{artworks.length}</p>
                                </div>
                                <div className="w-10 h-10 rounded-lg bg-heritage-terracotta/10 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-heritage-terracottaDark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
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
                    <Card className="border-red-200 bg-red-50/50">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-red-700">Rejected</p>
                                    <p className="text-2xl font-bold text-red-800">{rejectedCount}</p>
                                </div>
                                <div className="w-10 h-10 rounded-lg bg-red-200/50 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-red-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
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
                                    {pendingCount} artworks awaiting review.
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
                                    placeholder="Search artworks by title or artist..."
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
                                    <option key={cat} value={cat}>
                                        {cat === 'all' ? 'All Categories' : ARTWORK_CATEGORIES.find(c => c.value === cat)?.label || cat}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Artworks List */}
            <div className="space-y-4">
                {filteredArtworks.map((artwork, index) => (
                    <motion.div
                        key={artwork.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                    >
                        <Card className={`border-l-4 ${artwork.status === 'pending' ? 'border-l-yellow-500' : artwork.status === 'approved' ? 'border-l-green-500' : 'border-l-red-500'}`}>
                            <CardContent className="p-6">
                                <div className="flex flex-col lg:flex-row gap-6">
                                    {/* Image */}
                                    {artwork.imageUrl ? (
                                        <img src={artwork.imageUrl} alt={artwork.title} className="w-full lg:w-48 h-48 rounded-lg object-cover" />
                                    ) : (
                                        <div className="w-full lg:w-48 h-48 rounded-lg overflow-hidden bg-gradient-to-br from-heritage-terracotta/20 to-heritage-gold/20 flex items-center justify-center">
                                            <svg className="w-12 h-12 text-heritage-terracottaDark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
                                            </svg>
                                        </div>
                                    )}

                                    {/* Details */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <h3 className="text-lg font-semibold text-heritage-terracottaDark">{artwork.title}</h3>
                                                <p className="text-sm text-gray-600">by {artwork.artist}{artwork.artistEmail ? ` (${artwork.artistEmail})` : ''}</p>
                                            </div>
                                            <Badge className={getStatusColor(artwork.status)}>
                                                {artwork.status.charAt(0).toUpperCase() + artwork.status.slice(1)}
                                            </Badge>
                                        </div>

                                        {artwork.description && (
                                            <p className="text-sm text-gray-700 mb-3 line-clamp-2">{artwork.description}</p>
                                        )}

                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm mb-3">
                                            <div>
                                                <span className="text-gray-500">Category:</span>
                                                <span className="ml-1 font-medium capitalize">{artwork.category.replace(/-/g, ' ')}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Submitted:</span>
                                                <span className="ml-1 font-medium">{artwork.submittedAt || 'N/A'}</span>
                                            </div>
                                            {artwork.status === 'approved' && artwork.approvedAt && (
                                                <div>
                                                    <span className="text-gray-500">Approved:</span>
                                                    <span className="ml-1 font-medium">{artwork.approvedAt}</span>
                                                </div>
                                            )}
                                        </div>

                                        {artwork.status === 'rejected' && artwork.rejectionReason && (
                                            <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-3">
                                                <p className="text-sm text-red-800 font-medium">Rejection Reason:</p>
                                                <p className="text-sm text-red-700">{artwork.rejectionReason}</p>
                                            </div>
                                        )}

                                        <Separator className="my-3" />

                                        {/* Actions */}
                                        <div className="flex items-center gap-2 flex-wrap">
                                            {artwork.status === 'pending' && (
                                                <>
                                                    <Button
                                                        size="sm"
                                                        className="bg-green-600 hover:bg-green-700"
                                                        onClick={() => handleApprove(artwork.id)}
                                                    >
                                                        Approve
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="border-red-300 text-red-700 hover:bg-red-50"
                                                        onClick={() => {
                                                            setSelectedArtwork(artwork);
                                                            setRejectionReason('');
                                                        }}
                                                    >
                                                        Reject
                                                    </Button>
                                                </>
                                            )}
                                            {artwork.status === 'approved' && (
                                                <>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className={artwork.isInnovative
                                                            ? 'border-heritage-gold bg-heritage-gold/10 text-heritage-gold hover:bg-heritage-gold/20'
                                                            : 'border-heritage-gold/30 text-heritage-gold hover:bg-heritage-gold/5'
                                                        }
                                                        onClick={() => handleToggleInnovative(artwork.id)}
                                                        title="Toggle Innovative Award"
                                                    >
                                                        {artwork.isInnovative ? '★ Innovative' : '☆ Mark Innovative'}
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="border-heritage-gold/30 text-heritage-gold hover:bg-heritage-gold/5"
                                                        onClick={() => setSelectedArtwork(artwork)}
                                                    >
                                                        View Details
                                                    </Button>
                                                </>
                                            )}
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                onClick={() => handleDeleteArtwork(artwork.id)}
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
                {filteredArtworks.length === 0 && (
                    <motion.div {...fadeInUp}>
                        <Card>
                            <CardContent className="p-8 text-center">
                                <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
                                </svg>
                                <p className="text-gray-500">No artworks found matching your filters.</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </div>

            {/* Rejection Modal */}
            {selectedArtwork && selectedArtwork.status === 'pending' && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl"
                    >
                        <h3 className="text-lg font-semibold text-heritage-terracottaDark mb-2">Reject Artwork</h3>
                        <p className="text-sm text-gray-600 mb-4">
                            You are rejecting "{selectedArtwork.title}" by {selectedArtwork.artist}. Please provide a reason.
                        </p>
                        <textarea
                            className="w-full border rounded-md p-3 text-sm mb-4 focus:ring-2 focus:ring-heritage-terracotta/20 focus:border-heritage-terracotta"
                            rows={4}
                            placeholder="Explain why this artwork is being rejected..."
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                        />
                        <div className="flex gap-3 justify-end">
                            <Button variant="outline" onClick={() => setSelectedArtwork(null)}>Cancel</Button>
                            <Button
                                className="bg-red-600 hover:bg-red-700"
                                onClick={() => handleReject(selectedArtwork.id)}
                                disabled={!rejectionReason.trim()}
                            >
                                Confirm Rejection
                            </Button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Detail Modal for non-pending */}
            {selectedArtwork && selectedArtwork.status !== 'pending' && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl"
                    >
                        {selectedArtwork.imageUrl && (
                            <img src={selectedArtwork.imageUrl} alt={selectedArtwork.title} className="w-full h-48 object-cover rounded-lg mb-4" />
                        )}
                        <h3 className="text-lg font-semibold text-heritage-terracottaDark mb-2">{selectedArtwork.title}</h3>
                        <p className="text-sm text-gray-600 mb-4">by {selectedArtwork.artist}</p>
                        <Separator className="mb-4" />
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Category:</span>
                                <span className="font-medium capitalize">{selectedArtwork.category.replace(/-/g, ' ')}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Status:</span>
                                <Badge className={getStatusColor(selectedArtwork.status)}>
                                    {selectedArtwork.status.charAt(0).toUpperCase() + selectedArtwork.status.slice(1)}
                                </Badge>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Submitted:</span>
                                <span className="font-medium">{selectedArtwork.submittedAt || 'N/A'}</span>
                            </div>
                            {selectedArtwork.approvedAt && (
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Approved:</span>
                                    <span className="font-medium">{selectedArtwork.approvedAt}</span>
                                </div>
                            )}
                            {selectedArtwork.rejectionReason && (
                                <div>
                                    <span className="text-gray-500">Rejection Reason:</span>
                                    <p className="mt-1 text-red-700 bg-red-50 p-2 rounded">{selectedArtwork.rejectionReason}</p>
                                </div>
                            )}
                        </div>
                        {selectedArtwork.description && (
                            <>
                                <Separator className="my-4" />
                                <p className="text-sm text-gray-700">{selectedArtwork.description}</p>
                            </>
                        )}
                        <div className="mt-4 flex justify-end">
                            <Button variant="outline" onClick={() => setSelectedArtwork(null)}>Close</Button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
