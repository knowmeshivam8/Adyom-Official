import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { eventAPI } from '@/api';

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
};

// Fallback data used when API is unavailable
const fallbackEvents = [
    {
        id: 1,
        title: 'Madhubani Art Festival 2024',
        description: 'A grand celebration of Madhubani art featuring live demonstrations, workshops, and exhibitions from renowned artists across Bihar.',
        type: 'Festival',
        date: '2024-02-15',
        endDate: '2024-02-18',
        time: '10:00 AM - 6:00 PM',
        venue: 'Bihar Art Gallery, Patna',
        platform: null,
        capacity: 500,
        registered: 342,
        price: 0,
        status: 'upcoming',
        featured: true,
        tags: ['festival', 'madhubani', 'live-demo', 'exhibition']
    },
    {
        id: 2,
        title: 'Mindful Painting Weekend Retreat',
        description: 'A 2-day immersive retreat combining mindfulness practices with traditional painting techniques for stress relief and creative expression.',
        type: 'Workshop',
        date: '2024-02-22',
        endDate: '2024-02-23',
        time: '9:00 AM - 5:00 PM',
        venue: 'Adyom Cultural Center, Mumbai',
        platform: null,
        capacity: 30,
        registered: 28,
        price: 2500,
        status: 'upcoming',
        featured: false,
        tags: ['workshop', 'mindfulness', 'retreat', 'painting']
    },
    {
        id: 3,
        title: 'Warli Art Online Masterclass',
        description: 'Learn the ancient Warli tribal art form from master artist Ramesh Sutar in this interactive online session.',
        type: 'Online',
        date: '2024-01-28',
        endDate: null,
        time: '3:00 PM - 5:00 PM',
        venue: null,
        platform: 'Zoom',
        capacity: 100,
        registered: 78,
        price: 999,
        status: 'completed',
        featured: false,
        tags: ['masterclass', 'warli', 'online', 'tribal']
    },
    {
        id: 4,
        title: 'Heritage Art Exhibition: Canvas of India',
        description: 'An exclusive exhibition showcasing rare heritage art pieces from across India, including miniature paintings, Tanjore works, and Pattachitra.',
        type: 'Exhibition',
        date: '2024-03-01',
        endDate: '2024-03-15',
        time: '11:00 AM - 7:00 PM',
        venue: 'National Gallery of Modern Art, Delhi',
        platform: null,
        capacity: null,
        registered: 0,
        price: 200,
        status: 'upcoming',
        featured: true,
        tags: ['exhibition', 'heritage', 'gallery', 'delhi']
    },
    {
        id: 5,
        title: 'Kalamkari Workshop for Beginners',
        description: 'Hands-on workshop introducing the beautiful Kalamkari art form. All materials provided. Suitable for complete beginners.',
        type: 'Workshop',
        date: '2024-03-10',
        endDate: null,
        time: '10:00 AM - 2:00 PM',
        venue: 'Adyom Studio, Hyderabad',
        platform: null,
        capacity: 20,
        registered: 15,
        price: 1500,
        status: 'upcoming',
        featured: false,
        tags: ['workshop', 'kalamkari', 'beginner', 'hands-on']
    },
    {
        id: 6,
        title: 'Corporate Art & Wellness Seminar',
        description: 'A seminar for corporate leaders on integrating art-based wellness programs into employee engagement and CSR initiatives.',
        type: 'Seminar',
        date: '2024-02-05',
        endDate: null,
        time: '2:00 PM - 4:00 PM',
        venue: null,
        platform: 'Zoom',
        capacity: 50,
        registered: 45,
        price: 0,
        status: 'completed',
        featured: false,
        tags: ['corporate', 'wellness', 'seminar', 'csr']
    }
];

export default function AdminEvents() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newEvent, setNewEvent] = useState({
        title: '', description: '', type: 'Workshop', date: '', endDate: '', time: '',
        venue: '', platform: '', capacity: '', price: '', featured: false, tags: ''
    });

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await eventAPI.getAllAdmin();
                const apiEvents = res.data.data || res.data;
                setEvents(apiEvents.map(e => ({
                    id: e._id || e.id,
                    title: e.title || '',
                    description: e.description || '',
                    type: e.type || 'Workshop',
                    date: e.date ? new Date(e.date).toISOString().split('T')[0] : '',
                    endDate: e.endDate ? new Date(e.endDate).toISOString().split('T')[0] : null,
                    time: e.time || '',
                    venue: e.venue || null,
                    platform: e.platform || null,
                    capacity: e.capacity || null,
                    registered: e.registered || 0,
                    price: e.price || 0,
                    status: e.status || 'upcoming',
                    featured: e.featured || false,
                    tags: e.tags || []
                })));
            } catch (err) {
                console.error('Failed to fetch events:', err);
                setEvents(fallbackEvents);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    const filteredEvents = events.filter(e => {
        const matchesSearch = e.title.toLowerCase().includes(search.toLowerCase()) ||
            e.venue?.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === 'all' || e.status === statusFilter;
        const matchesType = typeFilter === 'all' || e.type === typeFilter;
        return matchesSearch && matchesStatus && matchesType;
    });

    const upcomingCount = events.filter(e => e.status === 'upcoming').length;
    const completedCount = events.filter(e => e.status === 'completed').length;
    const totalRegistrations = events.reduce((sum, e) => sum + e.registered, 0);
    const featuredCount = events.filter(e => e.featured).length;

    const handleCreate = async () => {
        if (!newEvent.title || !newEvent.date) return;
        const created = {
            ...newEvent,
            id: Date.now(),
            capacity: newEvent.capacity ? parseInt(newEvent.capacity) : null,
            price: newEvent.price ? parseInt(newEvent.price) : 0,
            registered: 0,
            status: 'upcoming',
            tags: newEvent.tags ? newEvent.tags.split(',').map(t => t.trim()) : []
        };
        try {
            const res = await eventAPI.create({
                title: created.title,
                description: created.description,
                type: created.type,
                date: created.date,
                endDate: created.endDate,
                time: created.time,
                venue: created.venue,
                platform: created.platform,
                capacity: created.capacity,
                price: created.price,
                featured: created.featured,
                tags: created.tags
            });
            created.id = res.data.data?._id || res.data?._id || created.id;
        } catch (err) {
            console.error('Failed to create event:', err);
        }
        setEvents(prev => [created, ...prev]);
        setNewEvent({
            title: '', description: '', type: 'Workshop', date: '', endDate: '', time: '',
            venue: '', platform: '', capacity: '', price: '', featured: false, tags: ''
        });
        setShowCreateForm(false);
    };

    const handleToggleFeatured = async (id) => {
        const event = events.find(e => e.id === id);
        const newFeatured = !event.featured;
        setEvents(prev => prev.map(e =>
            e.id === id ? { ...e, featured: newFeatured } : e
        ));
        try {
            await eventAPI.update(id, { featured: newFeatured });
        } catch (err) {
            console.error('Failed to toggle featured:', err);
        }
    };

    const handleDelete = async (id) => {
        setEvents(prev => prev.filter(e => e.id !== id));
        try {
            await eventAPI.delete(id);
        } catch (err) {
            console.error('Failed to delete event:', err);
        }
    };

    const handleMarkCompleted = async (id) => {
        setEvents(prev => prev.map(e =>
            e.id === id ? { ...e, status: 'completed' } : e
        ));
        try {
            await eventAPI.update(id, { status: 'completed' });
        } catch (err) {
            console.error('Failed to mark completed:', err);
        }
    };

    const eventTypes = ['all', 'Festival', 'Workshop', 'Online', 'Exhibition', 'Seminar', 'Meetup'];
    const statusOptions = ['all', 'upcoming', 'completed', 'cancelled'];

    const getTypeColor = (type) => {
        switch (type) {
            case 'Festival': return 'bg-heritage-gold/20 text-heritage-gold border-heritage-gold/30';
            case 'Workshop': return 'bg-heritage-terracotta/10 text-heritage-terracottaDark border-heritage-terracotta/20';
            case 'Online': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'Exhibition': return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'Seminar': return 'bg-teal-100 text-teal-800 border-teal-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'upcoming': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'completed': return 'bg-green-100 text-green-800 border-green-200';
            case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
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
            <motion.div {...fadeInUp}>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-heritage-terracottaDark">Events Management</h1>
                        <p className="text-gray-600 mt-1">Create and manage events, workshops, and exhibitions</p>
                    </div>
                    <Button className="bg-heritage-terracotta text-text-main hover:bg-heritage-terracotta/90" onClick={() => setShowCreateForm(!showCreateForm)}>
                        {showCreateForm ? 'Cancel' : '+ Create Event'}
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
                                    <p className="text-sm text-gray-600">Total Events</p>
                                    <p className="text-2xl font-bold text-heritage-terracottaDark">{events.length}</p>
                                </div>
                                <div className="w-10 h-10 rounded-lg bg-heritage-terracotta/10 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-heritage-terracottaDark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div {...fadeInUp} transition={{ delay: 0.2 }}>
                    <Card className="border-blue-200 bg-blue-50/50">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-blue-700">Upcoming</p>
                                    <p className="text-2xl font-bold text-blue-800">{upcomingCount}</p>
                                </div>
                                <div className="w-10 h-10 rounded-lg bg-blue-200/50 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                                    <p className="text-sm text-green-700">Registrations</p>
                                    <p className="text-2xl font-bold text-green-800">{totalRegistrations}</p>
                                </div>
                                <div className="w-10 h-10 rounded-lg bg-green-200/50 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0-5.143a3 3 0 10-5.356 0 3 3 0 005.356 0" />
                                    </svg>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div {...fadeInUp} transition={{ delay: 0.4 }}>
                    <Card className="border-heritage-gold/20 bg-heritage-gold/5">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-heritage-gold/80">Featured</p>
                                    <p className="text-2xl font-bold text-heritage-terracottaDark">{featuredCount}</p>
                                </div>
                                <div className="w-10 h-10 rounded-lg bg-heritage-gold/20 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-heritage-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915" />
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
                            <CardTitle className="text-heritage-terracottaDark">Create New Event</CardTitle>
                            <CardDescription>Add a new event, workshop, or exhibition</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-1 block">Title *</label>
                                    <Input
                                        placeholder="Event title"
                                        value={newEvent.title}
                                        onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-1 block">Type *</label>
                                    <select
                                        className="w-full border rounded-md px-3 py-2 text-sm"
                                        value={newEvent.type}
                                        onChange={(e) => setNewEvent(prev => ({ ...prev, type: e.target.value }))}
                                    >
                                        <option value="Workshop">Workshop</option>
                                        <option value="Festival">Festival</option>
                                        <option value="Online">Online Session</option>
                                        <option value="Exhibition">Exhibition</option>
                                        <option value="Seminar">Seminar</option>
                                        <option value="Meetup">Meetup</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-1 block">Description *</label>
                                <Textarea
                                    placeholder="Event description..."
                                    rows={3}
                                    value={newEvent.description}
                                    onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-1 block">Start Date *</label>
                                    <Input
                                        type="date"
                                        value={newEvent.date}
                                        onChange={(e) => setNewEvent(prev => ({ ...prev, date: e.target.value }))}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-1 block">End Date</label>
                                    <Input
                                        type="date"
                                        value={newEvent.endDate}
                                        onChange={(e) => setNewEvent(prev => ({ ...prev, endDate: e.target.value }))}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-1 block">Time</label>
                                    <Input
                                        placeholder="e.g., 10:00 AM - 5:00 PM"
                                        value={newEvent.time}
                                        onChange={(e) => setNewEvent(prev => ({ ...prev, time: e.target.value }))}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-1 block">Venue (for in-person)</label>
                                    <Input
                                        placeholder="Physical venue location"
                                        value={newEvent.venue}
                                        onChange={(e) => setNewEvent(prev => ({ ...prev, venue: e.target.value }))}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-1 block">Platform (for online)</label>
                                    <Input
                                        placeholder="e.g., Zoom, Google Meet"
                                        value={newEvent.platform}
                                        onChange={(e) => setNewEvent(prev => ({ ...prev, platform: e.target.value }))}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-1 block">Capacity</label>
                                    <Input
                                        type="number"
                                        placeholder="Max participants"
                                        value={newEvent.capacity}
                                        onChange={(e) => setNewEvent(prev => ({ ...prev, capacity: e.target.value }))}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-1 block">Price (₹)</label>
                                    <Input
                                        type="number"
                                        placeholder="0 for free events"
                                        value={newEvent.price}
                                        onChange={(e) => setNewEvent(prev => ({ ...prev, price: e.target.value }))}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-1 block">Tags (comma-separated)</label>
                                <Input
                                    placeholder="e.g., workshop, madhubani, beginner"
                                    value={newEvent.tags}
                                    onChange={(e) => setNewEvent(prev => ({ ...prev, tags: e.target.value }))}
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={newEvent.featured}
                                    onChange={(e) => setNewEvent(prev => ({ ...prev, featured: e.target.checked }))}
                                    className="rounded border-gray-300"
                                />
                                <label className="text-sm font-medium text-gray-700">Mark as Featured Event</label>
                            </div>
                            <Button className="bg-heritage-terracotta text-text-main hover:bg-heritage-terracotta/90" onClick={handleCreate}>
                                Create Event
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
                                    placeholder="Search events by title or venue..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                            <select
                                className="border rounded-md px-3 py-2 text-sm"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                {statusOptions.map(s => (
                                    <option key={s} value={s}>{s === 'all' ? 'All Status' : s.charAt(0).toUpperCase() + s.slice(1)}</option>
                                ))}
                            </select>
                            <select
                                className="border rounded-md px-3 py-2 text-sm"
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value)}
                            >
                                {eventTypes.map(t => (
                                    <option key={t} value={t}>{t === 'all' ? 'All Types' : t}</option>
                                ))}
                            </select>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Events List */}
            <div className="space-y-4">
                {filteredEvents.map((event, index) => (
                    <motion.div
                        key={event.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                    >
                        <Card className={`border-l-4 ${event.featured ? 'border-l-heritage-gold' : 'border-l-heritage-terracotta'}`}>
                            <CardContent className="p-6">
                                <div className="flex flex-col lg:flex-row gap-4">
                                    {/* Date Card */}
                                    <div className="w-full lg:w-32 flex flex-col items-center justify-center bg-gradient-to-br from-heritage-terracotta to-heritage-terracotta/80 rounded-lg p-3 text-white">
                                        <p className="text-xs uppercase tracking-wider">{new Date(event.date).toLocaleDateString('en-IN', { month: 'short' })}</p>
                                        <p className="text-2xl font-bold">{new Date(event.date).getDate()}</p>
                                        <p className="text-xs">{new Date(event.date).getFullYear()}</p>
                                    </div>

                                    {/* Details */}
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <h3 className="text-lg font-semibold text-heritage-terracottaDark">{event.title}</h3>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Badge className={getTypeColor(event.type)}>{event.type}</Badge>
                                                    <Badge className={getStatusColor(event.status)}>{event.status.charAt(0).toUpperCase() + event.status.slice(1)}</Badge>
                                                    {event.featured && (
                                                        <Badge className="bg-heritage-gold/20 text-heritage-gold border-heritage-gold/30">★ Featured</Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <p className="text-sm text-gray-700 mb-3 line-clamp-2">{event.description}</p>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-3">
                                            <div>
                                                <span className="text-gray-500">Date:</span>
                                                <span className="ml-1 font-medium">{event.date}{event.endDate ? ` - ${event.endDate}` : ''}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Time:</span>
                                                <span className="ml-1 font-medium">{event.time}</span>
                                            </div>
                                            {event.venue && (
                                                <div>
                                                    <span className="text-gray-500">Venue:</span>
                                                    <span className="ml-1 font-medium">{event.venue}</span>
                                                </div>
                                            )}
                                            {event.platform && (
                                                <div>
                                                    <span className="text-gray-500">Platform:</span>
                                                    <span className="ml-1 font-medium">{event.platform}</span>
                                                </div>
                                            )}
                                            <div>
                                                <span className="text-gray-500">Price:</span>
                                                <span className="ml-1 font-medium">{event.price === 0 ? 'Free' : `₹${event.price}`}</span>
                                            </div>
                                        </div>

                                        {/* Registration Progress */}
                                        {event.capacity && (
                                            <div className="mb-3">
                                                <div className="flex items-center justify-between text-sm mb-1">
                                                    <span className="text-gray-500">Registrations</span>
                                                    <span className="font-medium">{event.registered} / {event.capacity}</span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className="bg-heritage-terracotta text-text-main rounded-full h-2 transition-all"
                                                        style={{ width: `${(event.registered / event.capacity) * 100}%` }}
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex items-center gap-2 mb-3">
                                            {event.tags.map(tag => (
                                                <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                                            ))}
                                        </div>

                                        <Separator className="my-3" />

                                        <div className="flex items-center gap-3">
                                            {event.status === 'upcoming' && (
                                                <Button size="sm" variant="outline" className="border-green-300 text-green-700 hover:bg-green-50"
                                                    onClick={() => handleMarkCompleted(event.id)}>
                                                    Mark Completed
                                                </Button>
                                            )}
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className={event.featured ? 'border-heritage-gold/30 text-heritage-gold' : 'border-gray-300 text-gray-600'}
                                                onClick={() => handleToggleFeatured(event.id)}
                                            >
                                                {event.featured ? 'Unfeature' : '★ Feature'}
                                            </Button>
                                            <Button size="sm" variant="outline" className="border-heritage-terracotta/30 text-heritage-terracottaDark hover:bg-heritage-terracotta/5">
                                                Edit
                                            </Button>
                                            <Button size="sm" variant="outline" className="border-red-300 text-red-600 hover:bg-red-50"
                                                onClick={() => handleDelete(event.id)}>
                                                Delete
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {filteredEvents.length === 0 && (
                <motion.div {...fadeInUp}>
                    <Card>
                        <CardContent className="p-8 text-center">
                            <p className="text-gray-500">No events found matching your filters.</p>
                        </CardContent>
                    </Card>
                </motion.div>
            )}
        </div>
    );
}