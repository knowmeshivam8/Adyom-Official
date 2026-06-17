import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    FileText, Plus, Search, Edit, Trash2, Eye, Clock,
    CheckCircle2, XCircle, PenTool, Calendar, Tag,
    Download, Heart, MessageCircle, Share2, User, Loader2,
    Upload, Image as ImageIcon
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { blogAPI } from '@/api';

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
};

const fallbackPosts = [
    { id: 1, title: 'The Art of Kalamkari: A Living Tradition', slug: 'art-of-kalamkari', author: 'Lakshmi Rao', category: 'Folk Art', status: 'published', publishedDate: 'Jun 1, 2026', views: 1245, likes: 89, comments: 23, featured: true, excerpt: 'Exploring the ancient art of Kalamkari textile painting and its relevance in modern times.' },
    { id: 2, title: 'Mindfulness Through Creative Expression', slug: 'mindfulness-creative-expression', author: 'Anita Desai', category: 'Mindfulness', status: 'published', publishedDate: 'May 25, 2026', views: 856, likes: 56, comments: 18, featured: false, excerpt: 'How art practice can become a gateway to deeper mindfulness and self-awareness.' },
    { id: 3, title: 'Warli Art: From Tribal Walls to Global Canvas', slug: 'warli-global-canvas', author: 'Ravi Bhil', category: 'Folk Art', status: 'published', publishedDate: 'May 15, 2026', views: 2341, likes: 124, comments: 45, featured: true, excerpt: 'The journey of Warli art from tribal homes to international galleries.' },
    { id: 4, title: 'The Healing Power of Art Therapy', slug: 'healing-power-art-therapy', author: 'Dr. Meena Iyer', category: 'Wellness', status: 'draft', publishedDate: null, views: 0, likes: 0, comments: 0, featured: false, excerpt: 'Understanding how art therapy supports emotional healing and mental wellness.' },
    { id: 5, title: 'Preserving Heritage Through Digital Art', slug: 'preserving-heritage-digital', author: 'Admin', category: 'Technology', status: 'draft', publishedDate: null, views: 0, likes: 0, comments: 0, featured: false, excerpt: 'How digital tools are helping preserve and promote traditional Indian art forms.' },
    { id: 6, title: 'Miniature Paintings: Stories in Small Frames', slug: 'miniature-paintings-stories', author: 'Rajesh Kumar', category: 'Painting', status: 'published', publishedDate: 'Apr 20, 2026', views: 567, likes: 34, comments: 12, featured: false, excerpt: 'The intricate world of Indian miniature paintings and their narrative power.' },
];

export default function AdminBlog() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterCategory, setFilterCategory] = useState('all');
    const [showCreate, setShowCreate] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [imagePreview, setImagePreview] = useState(null);

    // Create form state
    const [createForm, setCreateForm] = useState({
        title: '', category: 'art', excerpt: '', content: '', tags: '', isPublished: false, featured: false
    });
    const [coverImage, setCoverImage] = useState(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await blogAPI.getAll();
                const apiPosts = res.data.data || [];
                setPosts(apiPosts.map(p => ({
                    id: p._id || p.id,
                    title: p.title || '',
                    slug: p.slug || '',
                    author: p.author?.name || p.authorName || p.author || 'Unknown',
                    category: p.category || 'Culture',
                    status: p.isPublished ? 'published' : 'draft',
                    publishedDate: p.publishedAt ? new Date(p.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : null,
                    views: p.views || 0,
                    likes: p.likes?.length || p.likes || 0,
                    comments: p.comments?.length || p.comments || 0,
                    featured: p.featured || false,
                    excerpt: p.excerpt || '',
                    coverImage: p.coverImage || null,
                })));
            } catch (err) {
                console.error('Failed to fetch blog posts, using fallback:', err);
                setPosts(fallbackPosts);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) {
            setCoverImage(null);
            setImagePreview(null);
            return;
        }
        setCoverImage(file);
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);
    };

    const resetForm = () => {
        setCreateForm({ title: '', category: 'art', excerpt: '', content: '', tags: '', isPublished: false, featured: false });
        setCoverImage(null);
        setImagePreview(null);
        setSubmitError('');
    };

    const handleCreatePost = async (e) => {
        e.preventDefault();
        setSubmitError('');

        if (!createForm.title.trim() || !createForm.content.trim()) {
            setSubmitError('Title and Content are required.');
            return;
        }

        setSubmitLoading(true);
        try {
            const formData = new FormData();
            formData.append('title', createForm.title);
            formData.append('content', createForm.content);
            formData.append('excerpt', createForm.excerpt);
            formData.append('category', createForm.category);
            formData.append('tags', JSON.stringify(createForm.tags ? createForm.tags.split(',').map(t => t.trim()).filter(Boolean) : []));
            formData.append('isPublished', createForm.isPublished);
            formData.append('featured', createForm.featured);
            if (coverImage) {
                formData.append('coverImage', coverImage);
            }

            const res = await blogAPI.createWithImage(formData);
            const newPost = res.data.data || res.data;

            setPosts(prev => [{
                id: newPost._id || newPost.id,
                title: newPost.title || createForm.title,
                slug: newPost.slug || '',
                author: newPost.author?.name || newPost.authorName || 'Admin',
                category: newPost.category || createForm.category,
                status: newPost.isPublished ? 'published' : 'draft',
                publishedDate: newPost.publishedAt ? new Date(newPost.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : null,
                views: 0, likes: 0, comments: 0,
                featured: newPost.featured || false,
                excerpt: newPost.excerpt || createForm.excerpt,
                coverImage: newPost.coverImage || null,
            }, ...prev]);

            setShowCreate(false);
            resetForm();
        } catch (err) {
            console.error('Failed to create blog post:', err);
            setSubmitError(err.response?.data?.message || 'Failed to create blog post.');
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleDeletePost = async (id) => {
        if (!confirm('Are you sure you want to delete this post?')) return;
        try {
            await blogAPI.delete(id);
            setPosts(prev => prev.filter(p => p.id !== id));
        } catch (err) {
            console.error('Failed to delete blog post:', err);
        }
    };

    const categories = ['all', 'art', 'culture', 'education', 'community', 'technology', 'wellness', 'folklore'];

    const filteredPosts = posts.filter(p => {
        const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.author.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = filterStatus === 'all' || p.status === filterStatus;
        const matchesCategory = filterCategory === 'all' || p.category === filterCategory;
        return matchesSearch && matchesStatus && matchesCategory;
    });

    const getStatusBadge = (status) => {
        switch (status) {
            case 'published': return <Badge variant="success" className="text-xs"><CheckCircle2 className="w-3 h-3 mr-1" />Published</Badge>;
            case 'draft': return <Badge variant="warning" className="text-xs"><PenTool className="w-3 h-3 mr-1" />Draft</Badge>;
            case 'archived': return <Badge variant="outline" className="text-xs"><XCircle className="w-3 h-3 mr-1" />Archived</Badge>;
            default: return <Badge variant="outline">{status}</Badge>;
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
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                            <FileText className="w-6 h-6 text-heritage-gold" />
                            Blog Management
                        </h1>
                        <p className="text-muted-foreground mt-1">Create, edit, and publish blog posts</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outlineGold" size="sm"><Download className="w-4 h-4 mr-1" /> Export</Button>
                        <Button variant="gold" size="sm" onClick={() => { resetForm(); setShowCreate(true); }}><Plus className="w-4 h-4 mr-1" /> New Post</Button>
                    </div>
                </div>
            </motion.div>

            <Separator />

            {/* Stats Cards */}
            <div className="grid md:grid-cols-4 gap-4">
                <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold">{posts.length}</p><p className="text-xs text-muted-foreground">Total Posts</p></CardContent></Card>
                <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-green-600">{posts.filter(p => p.status === 'published').length}</p><p className="text-xs text-muted-foreground">Published</p></CardContent></Card>
                <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-amber-600">{posts.filter(p => p.status === 'draft').length}</p><p className="text-xs text-muted-foreground">Drafts</p></CardContent></Card>
                <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold">{posts.reduce((sum, p) => sum + p.views, 0)}</p><p className="text-xs text-muted-foreground">Total Views</p></CardContent></Card>
            </div>

            {/* Create Post Form */}
            {showCreate && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                    <Card className="heritage-border border-heritage-gold/30">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Plus className="w-5 h-5 text-heritage-gold" />
                                Create New Blog Post
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {submitError && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm font-body mb-4">
                                    {submitError}
                                </div>
                            )}

                            <form className="space-y-4" onSubmit={handleCreatePost}>
                                <div>
                                    <label className="text-sm font-medium mb-1.5 block text-heritage-terracottaDark">Title *</label>
                                    <Input
                                        value={createForm.title}
                                        onChange={e => setCreateForm(f => ({ ...f, title: e.target.value }))}
                                        placeholder="Blog post title"
                                        required
                                    />
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium mb-1.5 block text-heritage-terracottaDark">Category *</label>
                                        <select
                                            value={createForm.category}
                                            onChange={e => setCreateForm(f => ({ ...f, category: e.target.value }))}
                                            className="w-full h-10 rounded-md border border-heritage-creamDark bg-heritage-creamLight px-3 text-sm text-heritage-brown focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-heritage-gold"
                                        >
                                            <option value="art">Art</option>
                                            <option value="culture">Culture</option>
                                            <option value="education">Education</option>
                                            <option value="community">Community</option>
                                            <option value="technology">Technology</option>
                                            <option value="wellness">Wellness</option>
                                            <option value="folklore">Folklore</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium mb-1.5 block text-heritage-terracottaDark">Tags</label>
                                        <Input
                                            value={createForm.tags}
                                            onChange={e => setCreateForm(f => ({ ...f, tags: e.target.value }))}
                                            placeholder="heritage, folk-art, painting"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-medium mb-1.5 block text-heritage-terracottaDark">Excerpt</label>
                                    <Textarea
                                        value={createForm.excerpt}
                                        onChange={e => setCreateForm(f => ({ ...f, excerpt: e.target.value }))}
                                        placeholder="Brief excerpt of the post..."
                                        rows={2}
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium mb-1.5 block text-heritage-terracottaDark">Content *</label>
                                    <Textarea
                                        value={createForm.content}
                                        onChange={e => setCreateForm(f => ({ ...f, content: e.target.value }))}
                                        placeholder="Full blog post content..."
                                        rows={8}
                                        required
                                    />
                                </div>

                                {/* Cover Image Upload */}
                                <div>
                                    <label className="text-sm font-medium mb-1.5 block text-heritage-terracottaDark">Cover Image</label>
                                    <div className="flex items-start gap-4">
                                        <div className="flex-1">
                                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-heritage-creamDark rounded-md cursor-pointer hover:border-heritage-gold transition-colors bg-heritage-creamLight">
                                                {imagePreview ? (
                                                    <img src={imagePreview} alt="Preview" className="h-full object-contain rounded-md" />
                                                ) : (
                                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                        <Upload className="w-8 h-8 text-text-main mb-2" />
                                                        <p className="text-xs text-text-main">Click to upload cover image</p>
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
                                        {imagePreview && (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => { setCoverImage(null); setImagePreview(null); }}
                                            >
                                                Remove
                                            </Button>
                                        )}
                                    </div>
                                </div>

                                {/* Toggles */}
                                <div className="flex items-center gap-6 pt-2">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={createForm.isPublished}
                                            onChange={e => setCreateForm(f => ({ ...f, isPublished: e.target.checked }))}
                                            className="w-4 h-4 rounded border-heritage-creamDark text-heritage-gold focus:ring-heritage-gold"
                                        />
                                        <span className="text-sm text-heritage-terracottaDark">Publish immediately</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={createForm.featured}
                                            onChange={e => setCreateForm(f => ({ ...f, featured: e.target.checked }))}
                                            className="w-4 h-4 rounded border-heritage-creamDark text-heritage-gold focus:ring-heritage-gold"
                                        />
                                        <span className="text-sm text-heritage-terracottaDark">Feature this post</span>
                                    </label>
                                </div>

                                <div className="flex items-center gap-2 pt-2">
                                    <Button type="submit" variant="gold" disabled={submitLoading}>
                                        {submitLoading ? (
                                            <><Loader2 className="w-4 h-4 mr-1 animate-spin" /> Creating...</>
                                        ) : (
                                            <><Plus className="w-4 h-4 mr-1" /> Create Post</>
                                        )}
                                    </Button>
                                    <Button type="button" variant="outline" onClick={() => { setShowCreate(false); resetForm(); }}>
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </motion.div>
            )}

            {/* Search & Filters */}
            <div className="flex items-center gap-3 flex-wrap">
                <div className="relative flex-1 min-w-[200px]">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search posts..." className="pl-9" />
                </div>
                {['all', 'published', 'draft', 'archived'].map(status => (
                    <Button key={status} variant={filterStatus === status ? 'default' : 'outline'} size="sm" onClick={() => setFilterStatus(status)} className="capitalize text-xs">{status}</Button>
                ))}
                {categories.map(cat => (
                    <Button key={cat} variant={filterCategory === cat ? 'default' : 'outline'} size="sm" onClick={() => setFilterCategory(cat)} className="capitalize text-xs">{cat === 'all' ? 'All' : cat}</Button>
                ))}
            </div>

            {/* Posts Table */}
            <Card>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-muted/50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Post</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Category</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Status</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Views</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Engagement</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {filteredPosts.map(post => (
                                    <tr key={post.id} className="hover:bg-muted/30 transition-colors">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                {post.coverImage ? (
                                                    <img src={post.coverImage} alt="" className="w-10 h-10 rounded object-cover flex-shrink-0" />
                                                ) : (
                                                    <div className="w-10 h-10 rounded bg-heritage-creamDark/50 flex items-center justify-center flex-shrink-0">
                                                        <ImageIcon className="w-5 h-5 text-text-main" />
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="text-sm font-medium text-foreground">{post.title}</p>
                                                    <p className="text-xs text-muted-foreground">By {post.author} · {post.publishedDate || 'Draft'}</p>
                                                    {post.featured && <Badge variant="gold" className="text-xs mt-1"><Star className="w-3 h-3 mr-1" />Featured</Badge>}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3"><Badge variant="outline" className="text-xs">{post.category}</Badge></td>
                                        <td className="px-4 py-3">{getStatusBadge(post.status)}</td>
                                        <td className="px-4 py-3 text-sm">{post.views}</td>
                                        <td className="px-4 py-3 text-sm">
                                            <span className="flex items-center gap-2 text-xs">
                                                <Heart className="w-3 h-3" />{post.likes}
                                                <MessageCircle className="w-3 h-3" />{post.comments}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-end gap-1">
                                                <Button variant="ghost" size="icon" className="h-8 w-8"><Eye className="w-4 h-4" /></Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8"><Edit className="w-4 h-4" /></Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDeletePost(post.id)}><Trash2 className="w-4 h-4 text-red-500" /></Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredPosts.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="px-4 py-8 text-center text-muted-foreground">
                                            No posts found matching your filters.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

function Star({ className }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
    );
}