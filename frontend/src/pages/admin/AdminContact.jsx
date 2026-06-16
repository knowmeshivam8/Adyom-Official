import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { contactAPI } from '@/api';
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
const fallbackContacts = [
    {
        id: 1,
        name: 'Ananya Krishnan',
        email: 'ananya.krishnan@gmail.com',
        phone: '+91 98765 43210',
        subject: 'Program Inquiry - Madhubani Masterclass',
        message: 'I am interested in enrolling in the Madhubani Art Masterclass. Could you please provide more details about the schedule, fees, and materials required? I am a complete beginner and would love to learn this beautiful art form.',
        status: 'unread',
        type: 'Inquiry',
        createdAt: '2024-01-16',
        repliedAt: null,
        reply: '',
        city: 'Chennai',
        interestArea: 'Madhubani Art'
    },
    {
        id: 2,
        name: 'Rahul Sharma',
        email: 'rahul.sharma@outlook.com',
        phone: '+91 87654 32109',
        subject: 'Volunteer Opportunity',
        message: 'I would like to volunteer with Adyom Foundation for community outreach programs. I have experience in teaching art to children and would love to contribute to your mission of preserving Indian heritage.',
        status: 'unread',
        type: 'Volunteer',
        createdAt: '2024-01-15',
        repliedAt: null,
        reply: '',
        city: 'Delhi',
        interestArea: 'Community Outreach'
    },
    {
        id: 3,
        name: 'Priyanka Desai',
        email: 'priyanka.d@company.com',
        phone: '+91 76543 21098',
        subject: 'Corporate Partnership Inquiry',
        message: 'Our company is looking for art-based wellness programs for employees. We have about 300 staff members and would like to explore quarterly workshops. Please share your corporate program details and pricing.',
        status: 'replied',
        type: 'Corporate',
        createdAt: '2024-01-14',
        repliedAt: '2024-01-15',
        reply: 'Thank you for your interest in our corporate wellness programs! I have sent you our corporate brochure with detailed pricing and program options. Let me know if you would like to schedule a call to discuss further.',
        city: 'Mumbai',
        interestArea: 'Corporate Wellness'
    },
    {
        id: 4,
        name: 'Deepa Patel',
        email: 'deepa.patel@artmail.com',
        phone: '+91 65432 10987',
        subject: 'Artwork Submission Question',
        message: 'I have completed my first Warli painting and would like to submit it to your gallery. What is the process for artwork submission? Are there specific size or medium requirements? Also, how does the approval process work?',
        status: 'read',
        type: 'Inquiry',
        createdAt: '2024-01-13',
        repliedAt: null,
        reply: '',
        city: 'Ahmedabad',
        interestArea: 'Warli Art'
    },
    {
        id: 5,
        name: 'Vikram Mehta',
        email: 'vikram.m@techcorp.in',
        phone: '+91 54321 09876',
        subject: 'Feedback on Mindfulness Program',
        message: 'I recently completed the Mindfulness Through Art program and wanted to share my feedback. The program was excellent and helped me manage my work stress significantly. The instructor was knowledgeable and the session flow was perfect.',
        status: 'replied',
        type: 'Feedback',
        createdAt: '2024-01-12',
        repliedAt: '2024-01-12',
        reply: 'Thank you so much for your wonderful feedback, Vikram! We are thrilled that the program helped you. We would love to feature your testimonial on our website if you are comfortable with that. Let us know!',
        city: 'Bangalore',
        interestArea: 'Mindfulness'
    },
    {
        id: 6,
        name: 'Sneha Iyer',
        email: 'sneha.iyer@college.edu',
        phone: '+91 43210 98765',
        subject: 'Student Research Collaboration',
        message: 'I am a PhD student researching traditional Indian art forms and their modern adaptations. I would like to collaborate with Adyom Foundation for my research. Could we discuss potential academic partnership opportunities?',
        status: 'unread',
        type: 'Inquiry',
        createdAt: '2024-01-16',
        repliedAt: null,
        reply: '',
        city: 'Pune',
        interestArea: 'Academic Research'
    },
    {
        id: 7,
        name: 'Amit Kumar',
        email: 'amit.k@gmail.com',
        phone: '+91 32109 87654',
        subject: 'Technical Issue - Video Access',
        message: 'I am unable to access the premium video content even though I have a paid membership. The videos keep showing a loading screen. I have tried on both Chrome and Safari browsers. Please help resolve this issue.',
        status: 'replied',
        type: 'Support',
        createdAt: '2024-01-11',
        repliedAt: '2024-01-11',
        reply: 'Sorry for the inconvenience, Amit! This was a temporary server issue that has been resolved. Please try refreshing your browser and logging in again. If the issue persists, please let us know and we will investigate further.',
        city: 'Hyderabad',
        interestArea: 'Technical Support'
    }
];

export default function AdminContact() {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');
    const [selectedContact, setSelectedContact] = useState(null);
    const [replyText, setReplyText] = useState('');

    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const res = await contactAPI.getAllAdmin();
                const apiContacts = res.data.data || res.data;
                setContacts(apiContacts.map(c => ({
                    ...c,
                    id: c._id,
                    createdAt: c.createdAt?.split('T')[0] || c.createdAt,
                    repliedAt: c.repliedAt?.split('T')[0] || c.repliedAt,
                })));
            } catch (err) {
                console.error('Failed to fetch contacts:', err);
                setContacts(fallbackContacts);
            } finally {
                setLoading(false);
            }
        };
        fetchContacts();
    }, []);

    const filteredContacts = contacts.filter(c => {
        const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
            c.email.toLowerCase().includes(search.toLowerCase()) ||
            c.subject.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
        const matchesType = typeFilter === 'all' || c.type === typeFilter;
        return matchesSearch && matchesStatus && matchesType;
    });

    const unreadCount = contacts.filter(c => c.status === 'unread').length;
    const readCount = contacts.filter(c => c.status === 'read').length;
    const repliedCount = contacts.filter(c => c.status === 'replied').length;

    const handleMarkRead = async (id) => {
        try {
            await contactAPI.updateStatus(id, { status: 'read' });
        } catch (err) {
            console.error('Failed to mark contact as read:', err);
        }
        setContacts(prev => prev.map(c =>
            c.id === id ? { ...c, status: 'read' } : c
        ));
    };

    const handleReply = async (id) => {
        if (!replyText.trim()) return;
        try {
            await contactAPI.updateStatus(id, { status: 'replied', reply: replyText });
        } catch (err) {
            console.error('Failed to send reply:', err);
        }
        setContacts(prev => prev.map(c =>
            c.id === id ? { ...c, status: 'replied', reply: replyText, repliedAt: new Date().toISOString().split('T')[0] } : c
        ));
        setSelectedContact(null);
        setReplyText('');
    };

    const handleDelete = async (id) => {
        try {
            await contactAPI.delete(id);
            setContacts(prev => prev.filter(c => c.id !== id));
        } catch (err) {
            console.error('Failed to delete contact:', err);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'unread': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'read': return 'bg-gray-100 text-gray-800 border-gray-200';
            case 'replied': return 'bg-green-100 text-green-800 border-green-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 'Inquiry': return 'bg-heritage-terracotta/10 text-heritage-terracottaDark border-heritage-terracotta/20';
            case 'Volunteer': return 'bg-teal-100 text-teal-800 border-teal-200';
            case 'Corporate': return 'bg-heritage-gold/20 text-heritage-gold border-heritage-gold/30';
            case 'Feedback': return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'Support': return 'bg-red-100 text-red-800 border-red-200';
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
                <h1 className="text-3xl font-bold text-heritage-terracottaDark">Contact Messages</h1>
                <p className="text-gray-600 mt-1">Manage and respond to contact form submissions</p>
            </motion.div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <motion.div {...fadeInUp} transition={{ delay: 0.1 }}>
                    <Card className="border-blue-200 bg-blue-50/50">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-blue-700">Unread Messages</p>
                                    <p className="text-2xl font-bold text-blue-800">{unreadCount}</p>
                                </div>
                                <div className="w-10 h-10 rounded-lg bg-blue-200/50 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div {...fadeInUp} transition={{ delay: 0.2 }}>
                    <Card className="border-gray-200">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Read (No Reply)</p>
                                    <p className="text-2xl font-bold text-gray-800">{readCount}</p>
                                </div>
                                <div className="w-10 h-10 rounded-lg bg-gray-200/50 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
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
                                    <p className="text-sm text-green-700">Replied</p>
                                    <p className="text-2xl font-bold text-green-800">{repliedCount}</p>
                                </div>
                                <div className="w-10 h-10 rounded-lg bg-green-200/50 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                                    </svg>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Unread Alert */}
            {unreadCount > 0 && (
                <motion.div {...fadeInUp} transition={{ delay: 0.4 }}>
                    <Card className="border-heritage-gold bg-heritage-gold/5">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-heritage-gold/20 flex items-center justify-center">
                                    <svg className="w-4 h-4 text-heritage-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                    </svg>
                                </div>
                                <p className="text-heritage-terracottaDark font-medium">
                                    {unreadCount} unread messages. Please respond to inquiries promptly.
                                </p>
                                <Button size="sm" className="bg-heritage-terracotta text-text-main hover:bg-heritage-terracotta/90 ml-auto"
                                    onClick={() => setStatusFilter('unread')}>
                                    View Unread
                                </Button>
                            </div>
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
                                    placeholder="Search by name, email, or subject..."
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
                                <option value="unread">Unread</option>
                                <option value="read">Read</option>
                                <option value="replied">Replied</option>
                            </select>
                            <select
                                className="border rounded-md px-3 py-2 text-sm"
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value)}
                            >
                                <option value="all">All Types</option>
                                <option value="Inquiry">Inquiry</option>
                                <option value="Volunteer">Volunteer</option>
                                <option value="Corporate">Corporate</option>
                                <option value="Feedback">Feedback</option>
                                <option value="Support">Support</option>
                            </select>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Contact Messages List */}
            <div className="space-y-4">
                {filteredContacts.map((contact, index) => (
                    <motion.div
                        key={contact.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                    >
                        <Card className={`border-l-4 ${contact.status === 'unread' ? 'border-l-blue-500 bg-blue-50/20' : contact.status === 'replied' ? 'border-l-green-500' : 'border-l-gray-400'}`}>
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            {contact.status === 'unread' && (
                                                <span className="w-2 h-2 rounded-full bg-blue-500" />
                                            )}
                                            <h3 className="text-lg font-semibold text-heritage-terracottaDark">{contact.subject}</h3>
                                        </div>
                                        <p className="text-sm text-gray-600">{contact.name} • {contact.email}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge className={getTypeColor(contact.type)}>{contact.type}</Badge>
                                        <Badge className={getStatusColor(contact.status)}>
                                            {contact.status.charAt(0).toUpperCase() + contact.status.slice(1)}
                                        </Badge>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-3">
                                    {contact.phone && (
                                        <div>
                                            <span className="text-gray-500">Phone:</span>
                                            <span className="ml-1 font-medium">{contact.phone}</span>
                                        </div>
                                    )}
                                    {contact.city && (
                                        <div>
                                            <span className="text-gray-500">City:</span>
                                            <span className="ml-1 font-medium">{contact.city}</span>
                                        </div>
                                    )}
                                    {contact.interestArea && (
                                        <div>
                                            <span className="text-gray-500">Interest:</span>
                                            <span className="ml-1 font-medium">{contact.interestArea}</span>
                                        </div>
                                    )}
                                    <div>
                                        <span className="text-gray-500">Date:</span>
                                        <span className="ml-1 font-medium">{contact.createdAt}</span>
                                    </div>
                                </div>

                                <div className="bg-gray-50 rounded-md p-3 mb-3">
                                    <p className="text-sm text-gray-700">{contact.message}</p>
                                </div>

                                {contact.status === 'replied' && contact.reply && (
                                    <div className="bg-green-50 border border-green-200 rounded-md p-3 mb-3">
                                        <p className="text-sm text-green-800 font-medium mb-1">
                                            Reply sent on {contact.repliedAt}:
                                        </p>
                                        <p className="text-sm text-green-700">{contact.reply}</p>
                                    </div>
                                )}

                                <Separator className="my-3" />

                                <div className="flex items-center gap-3">
                                    {contact.status === 'unread' && (
                                        <Button size="sm" variant="outline" className="border-gray-300 text-gray-700"
                                            onClick={() => handleMarkRead(contact.id)}>
                                            Mark as Read
                                        </Button>
                                    )}
                                    {contact.status !== 'replied' && (
                                        <Button size="sm" className="bg-heritage-terracotta text-text-main hover:bg-heritage-terracotta/90"
                                            onClick={() => {
                                                setSelectedContact(contact);
                                                setReplyText('');
                                            }}>
                                            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                                            </svg>
                                            Reply
                                        </Button>
                                    )}
                                    {contact.status === 'replied' && (
                                        <Button size="sm" variant="outline" className="border-heritage-terracotta/30 text-heritage-terracottaDark"
                                            onClick={() => {
                                                setSelectedContact(contact);
                                                setReplyText('');
                                            }}>
                                            Reply Again
                                        </Button>
                                    )}
                                    <Button size="sm" variant="outline" className="border-red-300 text-red-600 hover:bg-red-50"
                                        onClick={() => handleDelete(contact.id)}>
                                        Delete
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {filteredContacts.length === 0 && (
                <motion.div {...fadeInUp}>
                    <Card>
                        <CardContent className="p-8 text-center">
                            <p className="text-gray-500">No contact messages found matching your filters.</p>
                        </CardContent>
                    </Card>
                </motion.div>
            )}

            {/* Reply Modal */}
            {selectedContact && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-xl max-w-2xl w-full p-6 shadow-xl max-h-[90vh] overflow-y-auto"
                    >
                        <h3 className="text-lg font-semibold text-heritage-terracottaDark mb-2">Reply to: {selectedContact.name}</h3>
                        <p className="text-sm text-gray-600 mb-1">{selectedContact.subject}</p>
                        <p className="text-sm text-gray-500 mb-4">{selectedContact.email} • {selectedContact.phone}</p>

                        <Separator className="mb-4" />

                        <div className="bg-gray-50 rounded-md p-3 mb-4">
                            <p className="text-sm text-gray-700 font-medium mb-1">Original Message ({selectedContact.createdAt}):</p>
                            <p className="text-sm text-gray-600">{selectedContact.message}</p>
                        </div>

                        {selectedContact.reply && (
                            <div className="bg-green-50 border border-green-200 rounded-md p-3 mb-4">
                                <p className="text-sm text-green-800 font-medium mb-1">Previous Reply ({selectedContact.repliedAt}):</p>
                                <p className="text-sm text-green-700">{selectedContact.reply}</p>
                            </div>
                        )}

                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-1 block">Your Reply</label>
                            <Textarea
                                placeholder="Type your response..."
                                rows={6}
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                            />
                        </div>

                        <div className="flex gap-3 justify-end mt-4">
                            <Button variant="outline" onClick={() => setSelectedContact(null)}>Cancel</Button>
                            <Button
                                className="bg-heritage-terracotta text-text-main hover:bg-heritage-terracotta/90"
                                onClick={() => handleReply(selectedContact.id)}
                                disabled={!replyText.trim()}
                            >
                                Send Reply
                            </Button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}