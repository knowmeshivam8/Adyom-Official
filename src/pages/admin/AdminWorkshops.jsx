import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Calendar, Plus, Search, Edit, Trash2, Eye, Users,
    Clock, MapPin, Video, CheckCircle2, XCircle,
    Download, Filter, Copy, Link2
} from 'lucide-react';
import { eventAPI } from '@/api';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { AdminTableSkeleton } from '@/components/ui/page-skeletons';

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
};

export default function AdminWorkshops() {
    const [workshops, setWorkshops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [showCreate, setShowCreate] = useState(false);

    const fallbackWorkshops = [
        { id: 1, title: 'Warli Art Live Workshop', instructor: 'Ravi Bhil', date: 'Jun 15, 2026', time: '10:00 AM - 1:00 PM', type: 'live', platform: 'Zoom', registered: 28, maxCapacity: 50, price: 500, status: 'upcoming', description: 'Learn Warli art basics in this interactive live session.' },
        { id: 2, title: 'Madhubani Masterclass', instructor: 'Sujata Das', date: 'Jun 20, 2026', time: '2:00 PM - 5:00 PM', type: 'live', platform: 'Zoom', registered: 45, maxCapacity: 50, price: 750, status: 'upcoming', description: 'Deep dive into Madhubani painting traditions and techniques.' },
        { id: 3, title: 'Art & Mindfulness Retreat', instructor: 'Anita Desai', date: 'Jun 25-27, 2026', time: '9:00 AM - 6:00 PM', type: 'in-person', platform: 'Adyom Center, Bangalore', registered: 15, maxCapacity: 20, price: 3000, status: 'upcoming', description: 'A 3-day immersive retreat combining art practice with mindfulness.' },
        { id: 4, title: 'Kalamkari Workshop Recording', instructor: 'Lakshmi Rao', date: 'May 10, 2026', time: 'Recording', type: 'recorded', platform: 'Platform', registered: 156, maxCapacity: null, price: 350, status: 'completed', description: 'Recorded workshop on traditional Kalamkari textile painting.' },
        { id: 5, title: 'Miniature Painting Intensive', instructor: 'Rajesh Kumar', date: 'Jul 5-10, 2026', time: '10:00 AM - 4:00 PM', type: 'in-person', platform: 'Adyom Center, Delhi', registered: 8, maxCapacity: 15, price: 5000, status: 'upcoming', description: 'A 5-day intensive miniature painting workshop.' },
        { id: 6, title: 'Raga & Color Exploration', instructor: 'Dr. Meena Iyer', date: 'May 28, 2026', time: '4:00 PM - 7:00 PM', type: 'live', platform: 'Zoom', registered: 50, maxCapacity: 50, price: 600, status: 'completed', description: 'Exploring connections between Indian classical music and visual art.' },
    ];

    useEffect(() => {
        const fetchWorkshops = async () => {
            try {
                const res = await eventAPI.getAllAdmin({ type: 'workshop' });
                const apiWorkshops = res.data.data || res.data;
                setWorkshops(apiWorkshops.map(w => ({
                    ...w,
                    id: w._id,
                    date: w.date ? new Date(w.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : w.date,
                    registered: w.registeredCount || w.registered || 0,
                    maxCapacity: w.maxCapacity || null,
                    price: w.price || 0,
                    type: w.type || 'live',
                    status: w.status || 'upcoming',
                    description: w.description || '',
                    platform: w.platform || w.location || 'Zoom'
                })));
            } catch (err) {
                console.error('Failed to fetch workshops:', err);
                setWorkshops(fallbackWorkshops);
            } finally {
                setLoading(false);
            }
        };
        fetchWorkshops();
    }, []);

    const filteredWorkshops = workshops.filter(w => {
        const matchesSearch = w.title.toLowerCase().includes(search.toLowerCase()) || w.instructor.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = filterStatus === 'all' || w.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const getTypeBadge = (type) => {
        switch (type) {
            case 'live': return <Badge variant="info" className="text-xs"><Video className="w-3 h-3 mr-1" />Live</Badge>;
            case 'in-person': return <Badge variant="gold" className="text-xs"><MapPin className="w-3 h-3 mr-1" />In-Person</Badge>;
            case 'recorded': return <Badge variant="outline" className="text-xs"><Clock className="w-3 h-3 mr-1" />Recorded</Badge>;
            default: return <Badge variant="outline">{type}</Badge>;
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'upcoming': return <Badge variant="info" className="text-xs">Upcoming</Badge>;
            case 'completed': return <Badge variant="success" className="text-xs"><CheckCircle2 className="w-3 h-3 mr-1" />Completed</Badge>;
            case 'cancelled': return <Badge variant="danger" className="text-xs"><XCircle className="w-3 h-3 mr-1" />Cancelled</Badge>;
            default: return <Badge variant="outline">{status}</Badge>;
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
                        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                            <Calendar className="w-6 h-6 text-heritage-gold" />
                            Workshop Management
                        </h1>
                        <p className="text-muted-foreground mt-1">Schedule and manage live workshops and events</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outlineGold" size="sm"><Download className="w-4 h-4 mr-1" /> Export</Button>
                        <Button variant="gold" size="sm" onClick={() => setShowCreate(true)}><Plus className="w-4 h-4 mr-1" /> Create Workshop</Button>
                    </div>
                </div>
            </motion.div>

            <Separator />

            {/* Stats */}
            <div className="grid md:grid-cols-4 gap-4">
                <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold">{workshops.length}</p><p className="text-xs text-muted-foreground">Total Workshops</p></CardContent></Card>
                <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-blue-600">{workshops.filter(w => w.status === 'upcoming').length}</p><p className="text-xs text-muted-foreground">Upcoming</p></CardContent></Card>
                <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-green-600">{workshops.filter(w => w.status === 'completed').length}</p><p className="text-xs text-muted-foreground">Completed</p></CardContent></Card>
                <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold">{workshops.reduce((sum, w) => sum + w.registered, 0)}</p><p className="text-xs text-muted-foreground">Total Registrations</p></CardContent></Card>
            </div>

            {/* Create Form */}
            {showCreate && (
                <motion.div {...fadeInUp}>
                    <Card className="heritage-border">
                        <CardHeader><CardTitle>Create New Workshop</CardTitle></CardHeader>
                        <CardContent>
                            <form className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div><label className="text-sm font-medium mb-1.5 block">Title *</label><Input placeholder="Workshop title" required /></div>
                                    <div><label className="text-sm font-medium mb-1.5 block">Instructor *</label><Input placeholder="Instructor name" required /></div>
                                    <div><label className="text-sm font-medium mb-1.5 block">Type *</label>
                                        <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
                                            <option value="live">Live (Online)</option><option value="in-person">In-Person</option><option value="recorded">Recorded</option>
                                        </select>
                                    </div>
                                    <div><label className="text-sm font-medium mb-1.5 block">Platform/Location</label><Input placeholder="Zoom / Venue name" /></div>
                                    <div><label className="text-sm font-medium mb-1.5 block">Date *</label><Input type="date" required /></div>
                                    <div><label className="text-sm font-medium mb-1.5 block">Time</label><Input placeholder="10:00 AM - 1:00 PM" /></div>
                                    <div><label className="text-sm font-medium mb-1.5 block">Price (₹)</label><Input type="number" placeholder="500" /></div>
                                    <div><label className="text-sm font-medium mb-1.5 block">Max Capacity</label><Input type="number" placeholder="50" /></div>
                                </div>
                                <div><label className="text-sm font-medium mb-1.5 block">Description *</label><Textarea placeholder="Workshop description..." rows={3} required /></div>
                                <div className="flex items-center gap-2">
                                    <Button type="submit" variant="gold">Create Workshop</Button>
                                    <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </motion.div>
            )}

            {/* Search & Filter */}
            <div className="flex items-center gap-3">
                <div className="relative flex-1 min-w-[200px]">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search workshops..." className="pl-9" />
                </div>
                {['all', 'upcoming', 'completed', 'cancelled'].map(status => (
                    <Button key={status} variant={filterStatus === status ? 'default' : 'outline'} size="sm" onClick={() => setFilterStatus(status)} className="capitalize text-xs">{status}</Button>
                ))}
            </div>

            {/* Workshops List */}
            <div className="space-y-4">
                {filteredWorkshops.map(workshop => (
                    <motion.div key={workshop.id} {...fadeInUp}>
                        <Card className="hover:shadow-md transition-shadow">
                            <CardContent className="p-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-heritage-terracotta to-heritage-gold flex items-center justify-center flex-shrink-0">
                                        <Calendar className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h4 className="font-semibold text-foreground">{workshop.title}</h4>
                                            {getTypeBadge(workshop.type)}
                                            {getStatusBadge(workshop.status)}
                                        </div>
                                        <p className="text-sm text-muted-foreground">{workshop.instructor} · {workshop.date} · {workshop.time}</p>
                                        <p className="text-xs text-muted-foreground mt-1">{workshop.platform}</p>
                                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{workshop.description}</p>
                                        <div className="flex items-center gap-4 mt-2 text-xs">
                                            <span className="flex items-center gap-1"><Users className="w-3 h-3" />{workshop.registered}{workshop.maxCapacity ? `/${workshop.maxCapacity}` : ''} registered</span>
                                            <span className="font-medium">₹{workshop.price}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 flex-shrink-0">
                                        <Button variant="ghost" size="icon"><Eye className="w-4 h-4" /></Button>
                                        <Button variant="ghost" size="icon"><Edit className="w-4 h-4" /></Button>
                                        <Button variant="ghost" size="icon"><Copy className="w-4 h-4" /></Button>
                                        <Button variant="ghost" size="icon"><Trash2 className="w-4 h-4 text-red-500" /></Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
