import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { corporateAPI } from '@/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
};

// Fallback data used when API is unavailable
const fallbackLeads = [
    {
        id: 1,
        company: 'Tata Consultancy Services',
        contactPerson: 'Rajesh Nair',
        email: 'rajesh.nair@tcs.com',
        phone: '+91 98765 43210',
        type: 'CSR Partnership',
        interest: 'Employee Wellness Program',
        budget: '₹5,00,000 - ₹10,00,000',
        message: 'We are interested in integrating art-based wellness programs into our employee engagement initiatives. Our CSR team would like to explore partnership options for quarterly workshops.',
        status: 'contacted',
        priority: 'high',
        createdAt: '2024-01-15',
        lastContacted: '2024-01-17',
        notes: 'Had initial call. They want to start with a pilot for 200 employees.'
    },
    {
        id: 2,
        company: 'Infosys Limited',
        contactPerson: 'Meera Krishnan',
        email: 'meera.k@infosys.com',
        phone: '+91 87654 32109',
        type: 'Workshop Booking',
        interest: 'Team Building Art Workshop',
        budget: '₹2,00,000',
        message: 'We would like to organize a team building art workshop for our design team of 50 people. Looking for something creative and culturally enriching.',
        status: 'new',
        priority: 'medium',
        createdAt: '2024-01-16',
        lastContacted: null,
        notes: ''
    },
    {
        id: 3,
        company: 'Wipro Technologies',
        contactPerson: 'Arun Sharma',
        email: 'arun.s@wipro.com',
        phone: '+91 76543 21098',
        type: 'CSR Partnership',
        interest: 'Heritage Art Preservation',
        budget: '₹15,00,000+',
        message: 'Wipro Foundation is looking to fund heritage art preservation initiatives as part of our cultural CSR vertical. We want to support artisan communities and digital preservation.',
        status: 'negotiating',
        priority: 'high',
        createdAt: '2024-01-10',
        lastContacted: '2024-01-14',
        notes: 'Second meeting scheduled. They are very keen on long-term partnership.'
    },
    {
        id: 4,
        company: 'Google India',
        contactPerson: 'Sarah Chen',
        email: 'sarah.c@google.com',
        phone: '+91 65432 10987',
        type: 'Employee Engagement',
        interest: 'Mindfulness Through Art',
        budget: '₹3,00,000',
        message: 'Our wellness committee is exploring art-based mindfulness sessions for our Bangalore office employees. Interested in monthly sessions.',
        status: 'converted',
        priority: 'medium',
        createdAt: '2024-01-05',
        lastContacted: '2024-01-12',
        notes: 'Contract signed! Starting monthly sessions from Feb 2024.'
    },
    {
        id: 5,
        company: 'Reliance Industries',
        contactPerson: 'Priyanka Desai',
        email: 'priyanka.d@reliance.com',
        phone: '+91 54321 09876',
        type: 'CSR Partnership',
        interest: 'Artisan Support Program',
        budget: '₹20,00,000+',
        message: 'We want to fund a comprehensive artisan support program that provides training, materials, and market access to traditional artists across India.',
        status: 'contacted',
        priority: 'high',
        createdAt: '2024-01-13',
        lastContacted: '2024-01-15',
        notes: 'Interested in multi-year commitment. Need to prepare detailed proposal.'
    },
    {
        id: 6,
        company: 'Accenture India',
        contactPerson: 'David Martin',
        email: 'david.m@accenture.com',
        phone: '+91 43210 98765',
        type: 'Workshop Booking',
        interest: 'Creative Leadership Workshop',
        budget: '₹1,50,000',
        message: 'We are looking for a creative leadership workshop using art as a medium for our senior management team.',
        status: 'new',
        priority: 'low',
        createdAt: '2024-01-16',
        lastContacted: null,
        notes: ''
    }
];

export default function AdminCorporate() {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');
    const [priorityFilter, setPriorityFilter] = useState('all');
    const [selectedLead, setSelectedLead] = useState(null);
    const [noteText, setNoteText] = useState('');

    useEffect(() => {
        const fetchLeads = async () => {
            try {
                const res = await corporateAPI.getAllAdmin();
                const apiLeads = res.data.data || res.data;
                setLeads(apiLeads.map(l => ({
                    ...l,
                    id: l._id,
                    createdAt: l.createdAt?.split('T')[0] || l.createdAt,
                    lastContacted: l.lastContacted?.split('T')[0] || l.lastContacted,
                })));
            } catch (err) {
                console.error('Failed to fetch corporate leads:', err);
                setLeads(fallbackLeads);
            } finally {
                setLoading(false);
            }
        };
        fetchLeads();
    }, []);

    const filteredLeads = leads.filter(l => {
        const matchesSearch = l.company.toLowerCase().includes(search.toLowerCase()) ||
            l.contactPerson.toLowerCase().includes(search.toLowerCase()) ||
            l.email.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === 'all' || l.status === statusFilter;
        const matchesType = typeFilter === 'all' || l.type === typeFilter;
        const matchesPriority = priorityFilter === 'all' || l.priority === priorityFilter;
        return matchesSearch && matchesStatus && matchesType && matchesPriority;
    });

    const newCount = leads.filter(l => l.status === 'new').length;
    const contactedCount = leads.filter(l => l.status === 'contacted').length;
    const negotiatingCount = leads.filter(l => l.status === 'negotiating').length;
    const convertedCount = leads.filter(l => l.status === 'converted').length;

    const handleStatusChange = async (id, newStatus) => {
        try {
            await corporateAPI.updateStatus(id, { status: newStatus });
            setLeads(prev => prev.map(l =>
                l.id === id ? { ...l, status: newStatus, lastContacted: new Date().toISOString().split('T')[0] } : l
            ));
        } catch (err) {
            console.error('Failed to update lead status:', err);
            setLeads(prev => prev.map(l =>
                l.id === id ? { ...l, status: newStatus, lastContacted: new Date().toISOString().split('T')[0] } : l
            ));
        }
        setSelectedLead(null);
    };

    const handleAddNote = (id) => {
        if (!noteText.trim()) return;
        setLeads(prev => prev.map(l =>
            l.id === id ? { ...l, notes: l.notes ? `${l.notes}\n${noteText}` : noteText } : l
        ));
        setNoteText('');
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'new': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'contacted': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'negotiating': return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'converted': return 'bg-green-100 text-green-800 border-green-200';
            case 'lost': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return 'bg-red-100 text-red-800 border-red-200';
            case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'low': return 'bg-gray-100 text-gray-700 border-gray-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'CSR Partnership': return '🤝';
            case 'Workshop Booking': return '🎨';
            case 'Employee Engagement': return '👨‍💼';
            default: return '💼';
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
                <h1 className="text-3xl font-bold text-heritage-terracottaDark">Corporate & CSR Leads</h1>
                <p className="text-gray-600 mt-1">Manage corporate partnerships, workshop bookings, and CSR inquiries</p>
            </motion.div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <motion.div {...fadeInUp} transition={{ delay: 0.1 }}>
                    <Card className="border-blue-200 bg-blue-50/50">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-blue-700">New Leads</p>
                                    <p className="text-2xl font-bold text-blue-800">{newCount}</p>
                                </div>
                                <div className="w-10 h-10 rounded-lg bg-blue-200/50 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
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
                                    <p className="text-sm text-yellow-700">Contacted</p>
                                    <p className="text-2xl font-bold text-yellow-800">{contactedCount}</p>
                                </div>
                                <div className="w-10 h-10 rounded-lg bg-yellow-200/50 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-yellow-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div {...fadeInUp} transition={{ delay: 0.3 }}>
                    <Card className="border-purple-200 bg-purple-50/50">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-purple-700">Negotiating</p>
                                    <p className="text-2xl font-bold text-purple-800">{negotiatingCount}</p>
                                </div>
                                <div className="w-10 h-10 rounded-lg bg-purple-200/50 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-purple-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div {...fadeInUp} transition={{ delay: 0.4 }}>
                    <Card className="border-green-200 bg-green-50/50">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-green-700">Converted</p>
                                    <p className="text-2xl font-bold text-green-800">{convertedCount}</p>
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
            </div>

            {/* New Leads Alert */}
            {newCount > 0 && (
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
                                    {newCount} new corporate leads awaiting first contact. Reach out promptly!
                                </p>
                                <Button size="sm" className="bg-heritage-terracotta text-text-main hover:bg-heritage-terracotta/90 ml-auto"
                                    onClick={() => setStatusFilter('new')}>
                                    View New Leads
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
                                    placeholder="Search by company, contact person, or email..."
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
                                <option value="new">New</option>
                                <option value="contacted">Contacted</option>
                                <option value="negotiating">Negotiating</option>
                                <option value="converted">Converted</option>
                                <option value="lost">Lost</option>
                            </select>
                            <select
                                className="border rounded-md px-3 py-2 text-sm"
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value)}
                            >
                                <option value="all">All Types</option>
                                <option value="CSR Partnership">CSR Partnership</option>
                                <option value="Workshop Booking">Workshop Booking</option>
                                <option value="Employee Engagement">Employee Engagement</option>
                            </select>
                            <select
                                className="border rounded-md px-3 py-2 text-sm"
                                value={priorityFilter}
                                onChange={(e) => setPriorityFilter(e.target.value)}
                            >
                                <option value="all">All Priority</option>
                                <option value="high">High</option>
                                <option value="medium">Medium</option>
                                <option value="low">Low</option>
                            </select>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Leads List */}
            <div className="space-y-4">
                {filteredLeads.map((lead, index) => (
                    <motion.div
                        key={lead.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                    >
                        <Card className={`border-l-4 ${lead.priority === 'high' ? 'border-l-red-500' : lead.priority === 'medium' ? 'border-l-yellow-500' : 'border-l-gray-400'}`}>
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg">{getTypeIcon(lead.type)}</span>
                                            <h3 className="text-lg font-semibold text-heritage-terracottaDark">{lead.company}</h3>
                                        </div>
                                        <p className="text-sm text-gray-600">{lead.contactPerson} • {lead.email}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge className={getPriorityColor(lead.priority)}>
                                            {lead.priority.charAt(0).toUpperCase() + lead.priority.slice(1)} Priority
                                        </Badge>
                                        <Badge className={getStatusColor(lead.status)}>
                                            {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                                        </Badge>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-3">
                                    <div>
                                        <span className="text-gray-500">Type:</span>
                                        <span className="ml-1 font-medium">{lead.type}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Interest:</span>
                                        <span className="ml-1 font-medium">{lead.interest}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Budget:</span>
                                        <span className="ml-1 font-medium text-heritage-terracottaDark">{lead.budget}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Phone:</span>
                                        <span className="ml-1 font-medium">{lead.phone}</span>
                                    </div>
                                </div>

                                <div className="bg-gray-50 rounded-md p-3 mb-3">
                                    <p className="text-sm text-gray-700 font-medium mb-1">Inquiry Message:</p>
                                    <p className="text-sm text-gray-600">{lead.message}</p>
                                </div>

                                {lead.notes && (
                                    <div className="bg-heritage-gold/5 border border-heritage-gold/20 rounded-md p-3 mb-3">
                                        <p className="text-sm text-heritage-terracottaDark font-medium mb-1">Notes:</p>
                                        <p className="text-sm text-gray-700">{lead.notes}</p>
                                    </div>
                                )}

                                <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                                    <span>Submitted: {lead.createdAt}</span>
                                    {lead.lastContacted && <span>Last Contacted: {lead.lastContacted}</span>}
                                </div>

                                <Separator className="my-3" />

                                <div className="flex items-center gap-3">
                                    {/* Status progression buttons */}
                                    {lead.status === 'new' && (
                                        <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700"
                                            onClick={() => handleStatusChange(lead.id, 'contacted')}>
                                            Mark Contacted
                                        </Button>
                                    )}
                                    {lead.status === 'contacted' && (
                                        <Button size="sm" className="bg-purple-600 hover:bg-purple-700"
                                            onClick={() => handleStatusChange(lead.id, 'negotiating')}>
                                            Move to Negotiating
                                        </Button>
                                    )}
                                    {lead.status === 'negotiating' && (
                                        <Button size="sm" className="bg-green-600 hover:bg-green-700"
                                            onClick={() => handleStatusChange(lead.id, 'converted')}>
                                            Mark Converted ✓
                                        </Button>
                                    )}
                                    {lead.status !== 'lost' && lead.status !== 'converted' && (
                                        <Button size="sm" variant="outline" className="border-red-300 text-red-700 hover:bg-red-50"
                                            onClick={() => handleStatusChange(lead.id, 'lost')}>
                                            Mark Lost
                                        </Button>
                                    )}
                                    <Button size="sm" variant="outline" className="border-heritage-terracotta/30 text-heritage-terracottaDark hover:bg-heritage-terracotta/5"
                                        onClick={() => {
                                            setSelectedLead(lead);
                                            setNoteText('');
                                        }}>
                                        Add Note
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {filteredLeads.length === 0 && (
                <motion.div {...fadeInUp}>
                    <Card>
                        <CardContent className="p-8 text-center">
                            <p className="text-gray-500">No corporate leads found matching your filters.</p>
                        </CardContent>
                    </Card>
                </motion.div>
            )}

            {/* Add Note Modal */}
            {selectedLead && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl"
                    >
                        <h3 className="text-lg font-semibold text-heritage-terracottaDark mb-2">Add Note - {selectedLead.company}</h3>
                        <p className="text-sm text-gray-600 mb-4">Contact: {selectedLead.contactPerson}</p>
                        {selectedLead.notes && (
                            <div className="bg-heritage-gold/5 border border-heritage-gold/20 rounded-md p-3 mb-4">
                                <p className="text-sm text-heritage-terracottaDark font-medium mb-1">Existing Notes:</p>
                                <p className="text-sm text-gray-700">{selectedLead.notes}</p>
                            </div>
                        )}
                        <Textarea
                            placeholder="Add a note about this lead..."
                            rows={4}
                            value={noteText}
                            onChange={(e) => setNoteText(e.target.value)}
                        />
                        <div className="flex gap-3 justify-end mt-4">
                            <Button variant="outline" onClick={() => setSelectedLead(null)}>Cancel</Button>
                            <Button
                                className="bg-heritage-terracotta text-text-main hover:bg-heritage-terracotta/90"
                                onClick={() => handleAddNote(selectedLead.id)}
                                disabled={!noteText.trim()}
                            >
                                Save Note
                            </Button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}