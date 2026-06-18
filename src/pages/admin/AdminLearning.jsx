import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { learningAPI } from '@/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { AdminTableSkeleton } from '@/components/ui/page-skeletons';

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
};

// Fallback data used when API is unavailable
const fallbackLearningItems = [
    {
        id: 1,
        title: 'Introduction to Indian Art Forms',
        type: 'Article',
        category: 'Art History',
        content: 'A comprehensive introduction to the diverse art forms of India, from ancient cave paintings to contemporary folk art traditions.',
        duration: '15 min read',
        level: 'Beginner',
        status: 'published',
        views: 1245,
        completions: 890,
        author: 'Dr. Meera Joshi',
        createdAt: '2024-01-08',
        tags: ['art-history', 'introduction', 'beginner']
    },
    {
        id: 2,
        title: 'Madhubani Painting Techniques - Video Series',
        type: 'Video',
        category: 'Techniques',
        content: 'Step-by-step video series covering all essential Madhubani painting techniques, from basic patterns to complex compositions.',
        duration: '45 min',
        level: 'Beginner',
        status: 'published',
        views: 3456,
        completions: 2100,
        author: 'Adyom Team',
        createdAt: '2024-01-05',
        tags: ['madhubani', 'techniques', 'video-series']
    },
    {
        id: 3,
        title: 'Mindfulness Through Traditional Art Practice',
        type: 'Course',
        category: 'Mindfulness',
        content: 'A structured 4-week course combining mindfulness meditation practices with traditional Indian art forms for holistic wellness.',
        duration: '4 weeks',
        level: 'All Levels',
        status: 'published',
        views: 890,
        completions: 456,
        author: 'Swati Raman',
        createdAt: '2024-01-10',
        tags: ['mindfulness', 'course', 'wellness', '4-weeks']
    },
    {
        id: 4,
        title: 'Warli Art: History and Practice Guide',
        type: 'Article',
        category: 'Art History',
        content: 'Deep dive into the history, symbolism, and practical techniques of Warli tribal art from Maharashtra.',
        duration: '25 min read',
        level: 'Intermediate',
        status: 'draft',
        views: 0,
        completions: 0,
        author: 'Amit Patel',
        createdAt: '2024-01-15',
        tags: ['warli', 'history', 'guide']
    },
    {
        id: 5,
        title: 'Color Theory in Indian Miniature Paintings',
        type: 'Video',
        category: 'Techniques',
        content: 'Educational video exploring the unique color theory principles and pigment traditions used in Indian miniature paintings.',
        duration: '30 min',
        level: 'Intermediate',
        status: 'published',
        views: 567,
        completions: 234,
        author: 'Deepika Das',
        createdAt: '2024-01-12',
        tags: ['color-theory', 'miniature', 'techniques']
    },
    {
        id: 6,
        title: 'Advanced Tanjore Painting Masterclass',
        type: 'Course',
        category: 'Masterclass',
        content: 'An intensive masterclass for experienced Tanjore painting artists, covering advanced gold foil techniques and composition design.',
        duration: '6 weeks',
        level: 'Advanced',
        status: 'draft',
        views: 0,
        completions: 0,
        author: 'Lakshmi Iyer',
        createdAt: '2024-01-16',
        tags: ['tanjore', 'masterclass', 'advanced', 'gold-foil']
    },
    {
        id: 7,
        title: 'Kalamkari: From Sketch to Fabric',
        type: 'Video',
        category: 'Techniques',
        content: 'Complete video walkthrough of the Kalamkari process from initial sketching to final fabric printing, covering both Srikalahasti and Machilipatnam styles.',
        duration: '60 min',
        level: 'Intermediate',
        status: 'published',
        views: 789,
        completions: 345,
        author: 'Ramesh Kumar',
        createdAt: '2024-01-09',
        tags: ['kalamkari', 'fabric', 'techniques', 'walkthrough']
    }
];

export default function AdminLearning() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newItem, setNewItem] = useState({
        title: '', type: 'Article', category: '', content: '', duration: '', level: 'Beginner', author: '', tags: ''
    });

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const res = await learningAPI.getAllAdmin();
                const apiItems = res.data.data || res.data;
                setItems(apiItems.map(item => ({
                    ...item,
                    id: item._id,
                    createdAt: item.createdAt ? new Date(item.createdAt).toISOString().split('T')[0] : item.createdAt,
                    tags: item.tags || []
                })));
            } catch (err) {
                console.error('Failed to fetch learning items:', err);
                setItems(fallbackLearningItems);
            } finally {
                setLoading(false);
            }
        };
        fetchItems();
    }, []);

    const filteredItems = items.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) ||
            item.author.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
        const matchesType = typeFilter === 'all' || item.type === typeFilter;
        const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
        return matchesSearch && matchesStatus && matchesType && matchesCategory;
    });

    const publishedCount = items.filter(i => i.status === 'published').length;
    const draftCount = items.filter(i => i.status === 'draft').length;
    const totalViews = items.reduce((sum, i) => sum + i.views, 0);
    const totalCompletions = items.reduce((sum, i) => sum + i.completions, 0);

    const handleCreate = async () => {
        if (!newItem.title || !newItem.content) return;
        const created = {
            ...newItem,
            id: Date.now(),
            status: 'draft',
            views: 0,
            completions: 0,
            createdAt: new Date().toISOString().split('T')[0],
            tags: newItem.tags ? newItem.tags.split(',').map(t => t.trim()) : []
        };
        try {
            await learningAPI.create({
                title: created.title,
                type: created.type,
                category: created.category,
                content: created.content,
                duration: created.duration,
                level: created.level,
                author: created.author,
                tags: created.tags,
                status: 'draft'
            });
            setItems(prev => [created, ...prev]);
        } catch (err) {
            console.error('Failed to create learning item:', err);
            setItems(prev => [created, ...prev]);
        }
        setNewItem({ title: '', type: 'Article', category: '', content: '', duration: '', level: 'Beginner', author: '', tags: '' });
        setShowCreateForm(false);
    };

    const handlePublish = async (id) => {
        try {
            await learningAPI.update(id, { status: 'published' });
            setItems(prev => prev.map(i =>
                i.id === id ? { ...i, status: 'published' } : i
            ));
        } catch (err) {
            console.error('Failed to publish learning item:', err);
            setItems(prev => prev.map(i =>
                i.id === id ? { ...i, status: 'published' } : i
            ));
        }
    };

    const handleDelete = async (id) => {
        try {
            await learningAPI.delete(id);
            setItems(prev => prev.filter(i => i.id !== id));
        } catch (err) {
            console.error('Failed to delete learning item:', err);
            setItems(prev => prev.filter(i => i.id !== id));
        }
    };

    const learningTypes = ['all', 'Article', 'Video', 'Course'];
    const categories = ['all', 'Art History', 'Techniques', 'Mindfulness', 'Masterclass', 'Culture', 'Wellness'];

    const getTypeIcon = (type) => {
        switch (type) {
            case 'Article': return '📄';
            case 'Video': return '🎬';
            case 'Course': return '🎓';
            default: return '📚';
        }
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 'Article': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'Video': return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'Course': return 'bg-heritage-terracotta/10 text-heritage-terracottaDark border-heritage-terracotta/20';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'published': return 'bg-green-100 text-green-800 border-green-200';
            case 'draft': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getLevelColor = (level) => {
        switch (level) {
            case 'Beginner': return 'bg-green-50 text-green-700 border-green-200';
            case 'Intermediate': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
            case 'Advanced': return 'bg-red-50 text-red-700 border-red-200';
            case 'All Levels': return 'bg-blue-50 text-blue-700 border-blue-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    if (loading) {
        return <AdminTableSkeleton rows={8} filters={2} />;
    }

    return (
        <div className="space-y-6">
            <motion.div {...fadeInUp}>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-heritage-terracottaDark">Learning Content Management</h1>
                        <p className="text-gray-600 mt-1">Create and manage educational content, courses, and resources</p>
                    </div>
                    <Button className="bg-heritage-terracotta text-text-main hover:bg-heritage-terracotta/90" onClick={() => setShowCreateForm(!showCreateForm)}>
                        {showCreateForm ? 'Cancel' : '+ Create Content'}
                    </Button>
                </div>
            </motion.div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <motion.div {...fadeInUp} transition={{ delay: 0.1 }}>
                    <Card className="border-heritage-gold/20">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Total Items</p>
                                    <p className="text-2xl font-bold text-heritage-terracottaDark">{items.length}</p>
                                </div>
                                <div className="w-10 h-10 rounded-lg bg-heritage-terracotta/10 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-heritage-terracottaDark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.447 9.246 5 7.5 5S4.168 5.447 3 6.253v13C4.168 18.447 5.754 19 7.5 19s1.832-.447 3-1.253m0-13c1.108-.443 2.556-.741 4-.741s2.892.298 4 .741m0 13V6.253" />
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
                                    <p className="text-sm text-green-700">Published</p>
                                    <p className="text-2xl font-bold text-green-800">{publishedCount}</p>
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
                                    <p className="text-sm text-gray-600">Total Views</p>
                                    <p className="text-2xl font-bold text-heritage-terracottaDark">{totalViews.toLocaleString()}</p>
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

                <motion.div {...fadeInUp} transition={{ delay: 0.4 }}>
                    <Card className="border-heritage-gold/20">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Completions</p>
                                    <p className="text-2xl font-bold text-heritage-terracottaDark">{totalCompletions.toLocaleString()}</p>
                                </div>
                                <div className="w-10 h-10 rounded-lg bg-heritage-terracotta/10 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-heritage-terracottaDark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a1.994 1.994 0 10-.335 3.306m0 0a1.994 1.994 0 10.335 3.306m6-8.012a1.994 1.994 0 10-.335 3.306m0 0a1.994 1.994 0 10.335 3.306" />
                                    </svg>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Create Form */}
            {showCreateForm && (
                <motion.div {...fadeInUp}>
                    <Card className="border-heritage-terracotta/20">
                        <CardHeader>
                            <CardTitle className="text-heritage-terracottaDark">Create Learning Content</CardTitle>
                            <CardDescription>Add articles, videos, or courses to the learning library</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-1 block">Title *</label>
                                    <Input
                                        placeholder="Content title"
                                        value={newItem.title}
                                        onChange={(e) => setNewItem(prev => ({ ...prev, title: e.target.value }))}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-1 block">Type *</label>
                                    <select
                                        className="w-full border rounded-md px-3 py-2 text-sm"
                                        value={newItem.type}
                                        onChange={(e) => setNewItem(prev => ({ ...prev, type: e.target.value }))}
                                    >
                                        <option value="Article">📄 Article</option>
                                        <option value="Video">🎬 Video</option>
                                        <option value="Course">🎓 Course</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-1 block">Category</label>
                                    <Input
                                        placeholder="e.g., Art History, Techniques"
                                        value={newItem.category}
                                        onChange={(e) => setNewItem(prev => ({ ...prev, category: e.target.value }))}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-1 block">Duration</label>
                                    <Input
                                        placeholder="e.g., 15 min read, 4 weeks"
                                        value={newItem.duration}
                                        onChange={(e) => setNewItem(prev => ({ ...prev, duration: e.target.value }))}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-1 block">Level</label>
                                    <select
                                        className="w-full border rounded-md px-3 py-2 text-sm"
                                        value={newItem.level}
                                        onChange={(e) => setNewItem(prev => ({ ...prev, level: e.target.value }))}
                                    >
                                        <option value="Beginner">Beginner</option>
                                        <option value="Intermediate">Intermediate</option>
                                        <option value="Advanced">Advanced</option>
                                        <option value="All Levels">All Levels</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-1 block">Content Description *</label>
                                <Textarea
                                    placeholder="Describe the learning content..."
                                    rows={4}
                                    value={newItem.content}
                                    onChange={(e) => setNewItem(prev => ({ ...prev, content: e.target.value }))}
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-1 block">Author</label>
                                    <Input
                                        placeholder="Author name"
                                        value={newItem.author}
                                        onChange={(e) => setNewItem(prev => ({ ...prev, author: e.target.value }))}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-1 block">Tags (comma-separated)</label>
                                    <Input
                                        placeholder="e.g., madhubani, beginner, techniques"
                                        value={newItem.tags}
                                        onChange={(e) => setNewItem(prev => ({ ...prev, tags: e.target.value }))}
                                    />
                                </div>
                            </div>
                            <Button className="bg-heritage-terracotta text-text-main hover:bg-heritage-terracotta/90" onClick={handleCreate}>
                                Create as Draft
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>
            )}

            {/* Search & Filters */}
            <motion.div {...fadeInUp} transition={{ delay: 0.5 }}>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <Input
                                    placeholder="Search learning content..."
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
                                <option value="published">Published</option>
                                <option value="draft">Draft</option>
                            </select>
                            <select
                                className="border rounded-md px-3 py-2 text-sm"
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value)}
                            >
                                {learningTypes.map(t => (
                                    <option key={t} value={t}>{t === 'all' ? 'All Types' : t}</option>
                                ))}
                            </select>
                            <select
                                className="border rounded-md px-3 py-2 text-sm"
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                            >
                                {categories.map(c => (
                                    <option key={c} value={c}>{c === 'all' ? 'All Categories' : c}</option>
                                ))}
                            </select>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Learning Items List */}
            <div className="space-y-4">
                {filteredItems.map((item, index) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                    >
                        <Card className={`border-l-4 ${item.status === 'published' ? 'border-l-green-500' : 'border-l-yellow-500'}`}>
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-heritage-terracotta/20 to-heritage-gold/20 flex items-center justify-center text-xl">
                                            {getTypeIcon(item.type)}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-heritage-terracottaDark">{item.title}</h3>
                                            <p className="text-sm text-gray-600">by {item.author} • {item.createdAt}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge className={getTypeColor(item.type)}>{item.type}</Badge>
                                        <Badge className={getLevelColor(item.level)}>{item.level}</Badge>
                                        <Badge className={getStatusColor(item.status)}>
                                            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                                        </Badge>
                                    </div>
                                </div>

                                <p className="text-sm text-gray-700 mb-3 line-clamp-2">{item.content}</p>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-3">
                                    <div>
                                        <span className="text-gray-500">Category:</span>
                                        <span className="ml-1 font-medium">{item.category}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Duration:</span>
                                        <span className="ml-1 font-medium">{item.duration}</span>
                                    </div>
                                    {item.status === 'published' && (
                                        <>
                                            <div>
                                                <span className="text-gray-500">Views:</span>
                                                <span className="ml-1 font-medium">{item.views.toLocaleString()}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Completions:</span>
                                                <span className="ml-1 font-medium">{item.completions.toLocaleString()}</span>
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* Completion Rate */}
                                {item.status === 'published' && item.views > 0 && (
                                    <div className="mb-3">
                                        <div className="flex items-center justify-between text-sm mb-1">
                                            <span className="text-gray-500">Completion Rate</span>
                                            <span className="font-medium">{((item.completions / item.views) * 100).toFixed(1)}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                                            <div
                                                className="bg-heritage-terracotta text-text-main rounded-full h-1.5 transition-all"
                                                style={{ width: `${(item.completions / item.views) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center gap-2 mb-3">
                                    {item.tags.map(tag => (
                                        <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                                    ))}
                                </div>

                                <Separator className="my-3" />

                                <div className="flex items-center gap-3">
                                    {item.status === 'draft' && (
                                        <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handlePublish(item.id)}>
                                            Publish
                                        </Button>
                                    )}
                                    <Button size="sm" variant="outline" className="border-heritage-terracotta/30 text-heritage-terracottaDark hover:bg-heritage-terracotta/5">
                                        Edit
                                    </Button>
                                    <Button size="sm" variant="outline" className="border-red-300 text-red-600 hover:bg-red-50"
                                        onClick={() => handleDelete(item.id)}>
                                        Delete
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {filteredItems.length === 0 && (
                <motion.div {...fadeInUp}>
                    <Card>
                        <CardContent className="p-8 text-center">
                            <p className="text-gray-500">No learning content found matching your filters.</p>
                        </CardContent>
                    </Card>
                </motion.div>
            )}
        </div>
    );
}
