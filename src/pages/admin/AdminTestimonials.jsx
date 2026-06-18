import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { AdminTableSkeleton } from '@/components/ui/page-skeletons';
import { testimonialAPI } from '@/api';

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
};

const fallbackTestimonials = [
    {
        id: 1,
        name: 'Ananya Krishnan',
        role: 'Program Participant',
        content: 'Adyom Foundation transformed my understanding of Indian art forms. The Madhubani program was incredibly well-structured and the community support was amazing.',
        rating: 5,
        program: 'Madhubani Art Masterclass',
        status: 'published',
        featured: true,
        createdAt: '2024-01-15',
        avatar: null
    },
    {
        id: 2,
        name: 'Vikram Mehta',
        role: 'Corporate Partner',
        content: 'Our CSR partnership with Adyom has been deeply fulfilling. The workshops for our employees brought a new dimension of cultural awareness to our organization.',
        rating: 5,
        program: 'Corporate Wellness Workshop',
        status: 'published',
        featured: true,
        createdAt: '2024-01-12'
    },
    {
        id: 3,
        name: 'Sneha Reddy',
        role: 'Artisan',
        content: 'As a traditional Warli artist, Adyom gave me a platform to share my craft with a wider audience while preserving its authenticity.',
        rating: 4,
        program: 'Artisan Connect Program',
        status: 'pending',
        featured: false,
        createdAt: '2024-01-16'
    },
    {
        id: 4,
        name: 'Rahul Desai',
        role: 'Student',
        content: 'The mindfulness through art program helped me manage stress during my exam preparation. The guided painting sessions were therapeutic.',
        rating: 4,
        program: 'Mindfulness Through Art',
        status: 'published',
        featured: false,
        createdAt: '2024-01-10'
    },
    {
        id: 5,
        name: 'Meera Nair',
        role: 'Art Collector',
        content: 'The quality of artwork showcased on this platform is remarkable. I have purchased several pieces and each tells a beautiful story of our heritage.',
        rating: 5,
        program: null,
        status: 'pending',
        featured: false,
        createdAt: '2024-01-14'
    },
    {
        id: 6,
        name: 'Dr. Prakash Joshi',
        role: 'Academic Advisor',
        content: 'Adyom\'s approach to preserving Indian art traditions while making them accessible through modern technology is commendable and academically significant.',
        rating: 5,
        program: 'Academic Partnership',
        status: 'published',
        featured: false,
        createdAt: '2024-01-08'
    }
];

export default function AdminTestimonials() {
    const [testimonials, setTestimonials] = useState(fallbackTestimonials);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newTestimonial, setNewTestimonial] = useState({
        name: '', role: '', content: '', rating: 5, program: '', featured: false
    });

    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                const res = await testimonialAPI.getAllAdmin();
                const apiTestimonials = res.data.data || res.data;
                setTestimonials(apiTestimonials.map(t => ({
                    id: t._id || t.id,
                    name: t.name || '',
                    role: t.role || '',
                    content: t.content || '',
                    rating: t.rating || 5,
                    program: t.program || t.programName || null,
                    status: t.status || 'pending',
                    featured: t.featured || false,
                    createdAt: t.createdAt ? new Date(t.createdAt).toISOString().split('T')[0] : '',
                    avatar: t.avatar || t.profileImage || null,
                })));
            } catch (err) {
                console.error('Failed to fetch testimonials:', err);
                setTestimonials(fallbackTestimonials);
            } finally {
                setLoading(false);
            }
        };
        fetchTestimonials();
    }, []);

    const filteredTestimonials = testimonials.filter(t => {
        const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase()) ||
            t.content.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const publishedCount = testimonials.filter(t => t.status === 'published').length;
    const pendingCount = testimonials.filter(t => t.status === 'pending').length;
    const featuredCount = testimonials.filter(t => t.featured).length;
    const avgRating = testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length;

    const handlePublish = async (id) => {
        try {
            await testimonialAPI.update(id, { status: 'published' });
        } catch (err) {
            console.error('Failed to publish testimonial:', err);
        }
        setTestimonials(prev => prev.map(t =>
            t.id === id ? { ...t, status: 'published' } : t
        ));
    };

    const handleToggleFeatured = async (id) => {
        const current = testimonials.find(t => t.id === id);
        try {
            await testimonialAPI.update(id, { featured: !current.featured });
        } catch (err) {
            console.error('Failed to toggle featured:', err);
        }
        setTestimonials(prev => prev.map(t =>
            t.id === id ? { ...t, featured: !t.featured } : t
        ));
    };

    const handleDelete = async (id) => {
        try {
            await testimonialAPI.delete(id);
        } catch (err) {
            console.error('Failed to delete testimonial:', err);
        }
        setTestimonials(prev => prev.filter(t => t.id !== id));
    };

    const handleCreate = async () => {
        if (!newTestimonial.name || !newTestimonial.content) return;
        const created = {
            ...newTestimonial,
            id: Date.now(),
            status: 'pending',
            createdAt: new Date().toISOString().split('T')[0]
        };
        try {
            const res = await testimonialAPI.create(newTestimonial);
            const apiT = res.data.data || res.data;
            created.id = apiT._id || apiT.id || created.id;
        } catch (err) {
            console.error('Failed to create testimonial:', err);
        }
        setTestimonials(prev => [created, ...prev]);
        setNewTestimonial({ name: '', role: '', content: '', rating: 5, program: '', featured: false });
        setShowCreateForm(false);
    };

    const StarRating = ({ rating, size = 'sm' }) => (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map(star => (
                <svg
                    key={star}
                    className={`${size === 'sm' ? 'w-3.5 h-3.5' : 'w-5 h-5'} ${star <= rating ? 'text-heritage-gold fill-heritage-gold' : 'text-white'}`}
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                >
                    <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.8 2.634a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.8-2.634a1 1 0 00-1.176 0l-3.8 2.634c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.8-2.634a1 1 0 01.588-1.81h4.915a1 1 0 00.95-.69l1.519-4.674z" />
                </svg>
            ))}
        </div>
    );

    if (loading) {
        return <AdminTableSkeleton rows={8} filters={2} />;
    }

    return (
        <div className="space-y-6">
            <motion.div {...fadeInUp}>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-heritage-terracottaDark">Testimonials Management</h1>
                        <p className="text-gray-600 mt-1">Manage and showcase member testimonials</p>
                    </div>
                    <Button className="bg-heritage-terracotta text-text-main hover:bg-heritage-terracotta/90" onClick={() => setShowCreateForm(!showCreateForm)}>
                        {showCreateForm ? 'Cancel' : '+ Add Testimonial'}
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
                                    <p className="text-sm text-gray-600">Total Testimonials</p>
                                    <p className="text-2xl font-bold text-heritage-terracottaDark">{testimonials.length}</p>
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
                    <Card className="border-heritage-gold/20 bg-heritage-gold/5">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-heritage-gold/80">Featured</p>
                                    <p className="text-2xl font-bold text-heritage-terracottaDark">{featuredCount}</p>
                                </div>
                                <div className="w-10 h-10 rounded-lg bg-heritage-gold/20 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-heritage-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.8 2.634" />
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
                                    <p className="text-sm text-gray-600">Avg Rating</p>
                                    <p className="text-2xl font-bold text-heritage-terracottaDark">{avgRating.toFixed(1)}</p>
                                </div>
                                <StarRating rating={Math.round(avgRating)} size="lg" />
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
                            <CardTitle className="text-heritage-terracottaDark">Add New Testimonial</CardTitle>
                            <CardDescription>Create a new testimonial entry</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-1 block">Name *</label>
                                    <Input
                                        placeholder="Person's name"
                                        value={newTestimonial.name}
                                        onChange={(e) => setNewTestimonial(prev => ({ ...prev, name: e.target.value }))}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-1 block">Role/Title</label>
                                    <Input
                                        placeholder="e.g., Program Participant, Artisan"
                                        value={newTestimonial.role}
                                        onChange={(e) => setNewTestimonial(prev => ({ ...prev, role: e.target.value }))}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-1 block">Testimonial Content *</label>
                                <Textarea
                                    placeholder="Write the testimonial..."
                                    rows={4}
                                    value={newTestimonial.content}
                                    onChange={(e) => setNewTestimonial(prev => ({ ...prev, content: e.target.value }))}
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-1 block">Rating</label>
                                    <div className="flex items-center gap-2">
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <button
                                                key={star}
                                                onClick={() => setNewTestimonial(prev => ({ ...prev, rating: star }))}
                                                className="focus:outline-none"
                                            >
                                                <svg
                                                    className={`w-6 h-6 ${star <= newTestimonial.rating ? 'text-heritage-gold fill-heritage-gold' : 'text-white'}`}
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                    strokeWidth={1.5}
                                                >
                                                    <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.8 2.634a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.8-2.634a1 1 0 00-1.176 0l-3.8 2.634c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.8-2.634a1 1 0 01.588-1.81h4.915a1 1 0 00.95-.69l1.519-4.674z" />
                                                </svg>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-1 block">Related Program</label>
                                    <Input
                                        placeholder="Program name (optional)"
                                        value={newTestimonial.program}
                                        onChange={(e) => setNewTestimonial(prev => ({ ...prev, program: e.target.value }))}
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={newTestimonial.featured}
                                    onChange={(e) => setNewTestimonial(prev => ({ ...prev, featured: e.target.checked }))}
                                    className="rounded border-gray-300"
                                />
                                <label className="text-sm font-medium text-gray-700">Mark as Featured</label>
                            </div>
                            <Button className="bg-heritage-terracotta text-text-main hover:bg-heritage-terracotta/90" onClick={handleCreate}>
                                Create Testimonial
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
                                    placeholder="Search testimonials..."
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
                                <option value="pending">Pending</option>
                            </select>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Testimonials List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredTestimonials.map((testimonial, index) => (
                    <motion.div
                        key={testimonial.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                    >
                        <Card className={`border-l-4 ${testimonial.featured ? 'border-l-heritage-gold' : testimonial.status === 'pending' ? 'border-l-yellow-500' : 'border-l-green-500'}`}>
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-heritage-terracotta to-heritage-gold flex items-center justify-center text-white font-bold text-sm">
                                            {testimonial.name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-heritage-terracottaDark">{testimonial.name}</h3>
                                            <p className="text-xs text-gray-500">{testimonial.role}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {testimonial.featured && (
                                            <Badge className="bg-heritage-gold/20 text-heritage-gold border-heritage-gold/30">
                                                ★ Featured
                                            </Badge>
                                        )}
                                        <Badge className={testimonial.status === 'published' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-yellow-100 text-yellow-800 border-yellow-200'}>
                                            {testimonial.status.charAt(0).toUpperCase() + testimonial.status.slice(1)}
                                        </Badge>
                                    </div>
                                </div>

                                <StarRating rating={testimonial.rating} />

                                <p className="text-sm text-gray-700 mt-3 mb-3 line-clamp-3">&ldquo;{testimonial.content}&rdquo;</p>

                                {testimonial.program && (
                                    <p className="text-xs text-gray-500 mb-3">
                                        Program: <span className="font-medium text-heritage-terracottaDark">{testimonial.program}</span>
                                    </p>
                                )}

                                <p className="text-xs text-gray-400 mb-3">Submitted: {testimonial.createdAt}</p>

                                <Separator className="my-3" />

                                <div className="flex items-center gap-2">
                                    {testimonial.status === 'pending' && (
                                        <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handlePublish(testimonial.id)}>
                                            Publish
                                        </Button>
                                    )}
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className={testimonial.featured ? 'border-heritage-gold/30 text-heritage-gold' : 'border-gray-300 text-gray-600'}
                                        onClick={() => handleToggleFeatured(testimonial.id)}
                                    >
                                        {testimonial.featured ? 'Unfeature' : '★ Feature'}
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="border-red-300 text-red-600 hover:bg-red-50"
                                        onClick={() => handleDelete(testimonial.id)}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {filteredTestimonials.length === 0 && (
                <motion.div {...fadeInUp}>
                    <Card>
                        <CardContent className="p-8 text-center">
                            <p className="text-gray-500">No testimonials found matching your filters.</p>
                        </CardContent>
                    </Card>
                </motion.div>
            )}
        </div>
    );
}
