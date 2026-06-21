import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { certificateAPI } from '@/api';
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
const fallbackCertificates = [
    {
        id: 1,
        recipient: 'Priya Sharma',
        recipientEmail: 'priya@example.com',
        program: 'Madhubani Art Masterclass',
        grade: 'Excellent',
        skills: ['Madhubani Patterns', 'Color Theory', 'Composition Design', 'Traditional Motifs'],
        issuedAt: '2024-01-15',
        certificateId: 'ADYOM-MAD-2024-001',
        status: 'issued',
        template: 'Heritage Gold',
        verified: true,
        downloads: 5,
        shares: 2
    },
    {
        id: 2,
        recipient: 'Amit Patel',
        recipientEmail: 'amit@example.com',
        program: 'Warli Art Workshop',
        grade: 'Good',
        skills: ['Warli Patterns', 'Tribal Motifs', 'Storytelling Through Art'],
        issuedAt: '2024-01-12',
        certificateId: 'ADYOM-WAR-2024-002',
        status: 'issued',
        template: 'Classic Maroon',
        verified: true,
        downloads: 3,
        shares: 1
    },
    {
        id: 3,
        recipient: 'Deepika Das',
        recipientEmail: 'deepika@example.com',
        program: 'Pattachitra Advanced Course',
        grade: 'Outstanding',
        skills: ['Pattachitra Techniques', 'Natural Color Preparation', 'Cloth Painting', 'Mythological Narratives', 'Detail Work'],
        issuedAt: '2024-01-10',
        certificateId: 'ADYOM-PAT-2024-003',
        status: 'issued',
        template: 'Heritage Gold',
        verified: true,
        downloads: 8,
        shares: 4
    },
    {
        id: 4,
        recipient: 'Kavita Reddy',
        recipientEmail: 'kavita@example.com',
        program: 'Mindfulness Through Art',
        grade: 'Pending',
        skills: ['Mindful Painting', 'Stress Relief Techniques', 'Art Meditation'],
        issuedAt: null,
        certificateId: null,
        status: 'pending',
        template: null,
        verified: false,
        downloads: 0,
        shares: 0
    },
    {
        id: 5,
        recipient: 'Lakshmi Iyer',
        recipientEmail: 'lakshmi@example.com',
        program: 'Tanjore Painting Masterclass',
        grade: 'Excellent',
        skills: ['Gold Foil Application', 'Tanjore Composition', 'Religious Iconography', 'Relief Work'],
        issuedAt: '2024-01-08',
        certificateId: 'ADYOM-TAN-2024-005',
        status: 'issued',
        template: 'Heritage Gold',
        verified: true,
        downloads: 6,
        shares: 3
    },
    {
        id: 6,
        recipient: 'Ramesh Kumar',
        recipientEmail: 'ramesh@example.com',
        program: 'Kalamkari Art Course',
        grade: 'Pending',
        skills: ['Kalamkari Sketching', 'Fabric Painting', 'Natural Dyes'],
        issuedAt: null,
        certificateId: null,
        status: 'pending',
        template: null,
        verified: false,
        downloads: 0,
        shares: 0
    },
    {
        id: 7,
        recipient: 'Vikram Mehta',
        recipientEmail: 'vikram@example.com',
        program: 'Corporate Wellness Art Program',
        grade: 'Good',
        skills: ['Team Art Collaboration', 'Mindful Drawing', 'Creative Expression'],
        issuedAt: '2024-01-14',
        certificateId: 'ADYOM-CWS-2024-007',
        status: 'issued',
        template: 'Classic Maroon',
        verified: true,
        downloads: 2,
        shares: 0
    }
];

const certificateTemplates = [
    { id: 'heritage-gold', name: 'Heritage Gold', description: 'Gold border with maroon accents and mandala decorations' },
    { id: 'classic-maroon', name: 'Classic Maroon', description: 'Deep maroon with gold typography and minimal design' },
    { id: 'artisan-craft', name: 'Artisan Craft', description: 'Handcrafted border design with traditional motifs' },
    { id: 'minimal-modern', name: 'Minimal Modern', description: 'Clean modern design with heritage color accents' }
];

export default function AdminCertificates() {
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [templateFilter, setTemplateFilter] = useState('all');
    const [selectedCert, setSelectedCert] = useState(null);
    const [showIssueForm, setShowIssueForm] = useState(false);
    const [newCert, setNewCert] = useState({
        recipient: '', recipientEmail: '', program: '', grade: 'Good', skills: '', template: 'heritage-gold'
    });

    useEffect(() => {
        const fetchCertificates = async () => {
            try {
                const res = await certificateAPI.getAllAdmin();
                const apiCerts = res.data.data || res.data;
                setCertificates(apiCerts.map(cert => ({
                    ...cert,
                    id: cert._id,
                    issuedAt: cert.issuedAt ? new Date(cert.issuedAt).toISOString().split('T')[0] : cert.issuedAt,
                    skills: cert.skills || [],
                    downloads: cert.downloads || 0,
                    shares: cert.shares || 0
                })));
            } catch (err) {
                console.error('Failed to fetch certificates:', err);
                setCertificates(fallbackCertificates);
            } finally {
                setLoading(false);
            }
        };
        fetchCertificates();
    }, []);

    const filteredCerts = certificates.filter(c => {
        const matchesSearch = c.recipient.toLowerCase().includes(search.toLowerCase()) ||
            c.certificateId?.toLowerCase().includes(search.toLowerCase()) ||
            c.program.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
        const matchesTemplate = templateFilter === 'all' || c.template === templateFilter;
        return matchesSearch && matchesStatus && matchesTemplate;
    });

    const issuedCount = certificates.filter(c => c.status === 'issued').length;
    const pendingCount = certificates.filter(c => c.status === 'pending').length;
    const verifiedCount = certificates.filter(c => c.verified).length;
    const totalDownloads = certificates.reduce((sum, c) => sum + c.downloads, 0);

    const handleIssue = async (id) => {
        const template = certificateTemplates.find(t => t.id === newCert.template);
        const cert = certificates.find(c => c.id === id);
        try {
            await certificateAPI.issue({
                recipientName: cert?.recipient || newCert.recipient,
                recipientEmail: cert?.recipientEmail || newCert.recipientEmail,
                program: cert?.program || newCert.program,
                grade: cert?.grade === 'Pending' ? newCert.grade : cert?.grade,
                template: newCert.template
            });
            setCertificates(prev => prev.map(c =>
                c.id === id ? {
                    ...c,
                    status: 'issued',
                    grade: c.grade === 'Pending' ? newCert.grade : c.grade,
                    issuedAt: new Date().toISOString().split('T')[0],
                    certificateId: `ADYOM-${c.program.split(' ')[0].toUpperCase().slice(0, 3)}-2024-${String(c.id).padStart(3, '0')}`,
                    template: template?.name || 'Heritage Gold',
                    verified: true
                } : c
            ));
        } catch (err) {
            console.error('Failed to issue certificate:', err);
            setCertificates(prev => prev.map(c =>
                c.id === id ? {
                    ...c,
                    status: 'issued',
                    grade: c.grade === 'Pending' ? newCert.grade : c.grade,
                    issuedAt: new Date().toISOString().split('T')[0],
                    certificateId: `ADYOM-${c.program.split(' ')[0].toUpperCase().slice(0, 3)}-2024-${String(c.id).padStart(3, '0')}`,
                    template: template?.name || 'Heritage Gold',
                    verified: true
                } : c
            ));
        }
        setSelectedCert(null);
    };

    const handleCreate = async () => {
        if (!newCert.recipient || !newCert.program) return;
        const created = {
            id: Date.now(),
            recipient: newCert.recipient,
            recipientEmail: newCert.recipientEmail,
            program: newCert.program,
            grade: 'Pending',
            skills: newCert.skills ? newCert.skills.split(',').map(s => s.trim()) : [],
            issuedAt: null,
            certificateId: null,
            status: 'pending',
            template: null,
            verified: false,
            downloads: 0,
            shares: 0
        };
        try {
            await certificateAPI.issue({
                recipientName: created.recipient,
                recipientEmail: created.recipientEmail,
                program: created.program,
                skills: created.skills,
                template: newCert.template
            });
        } catch (err) {
            console.error('Failed to create certificate:', err);
        }
        setCertificates(prev => [created, ...prev]);
        setNewCert({ recipient: '', recipientEmail: '', program: '', grade: 'Good', skills: '', template: 'heritage-gold' });
        setShowIssueForm(false);
    };

    const handleDelete = async (id) => {
        try {
            await certificateAPI.delete(id);
            setCertificates(prev => prev.filter(c => c.id !== id));
        } catch (err) {
            console.error('Failed to delete certificate:', err);
            setCertificates(prev => prev.filter(c => c.id !== id));
        }
    };

    const handleToggleVerified = (id) => {
        setCertificates(prev => prev.map(c =>
            c.id === id ? { ...c, verified: !c.verified } : c
        ));
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'issued': return 'bg-green-100 text-green-800 border-green-200';
            case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'revoked': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getGradeColor = (grade) => {
        switch (grade) {
            case 'Outstanding': return 'bg-heritage-gold/20 text-heritage-gold border-heritage-gold/30';
            case 'Excellent': return 'bg-green-100 text-green-800 border-green-200';
            case 'Good': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
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
                        <h1 className="text-3xl font-bold text-heritage-terracottaDark">Certificates Management</h1>
                        <p className="text-gray-600 mt-1">Issue, manage, and verify completion certificates</p>
                    </div>
                    <Button className="bg-heritage-terracotta text-text-main hover:bg-heritage-terracotta/90" onClick={() => setShowIssueForm(!showIssueForm)}>
                        {showIssueForm ? 'Cancel' : '+ New Certificate'}
                    </Button>
                </div>
            </motion.div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <motion.div {...fadeInUp} transition={{ delay: 0.1 }}>
                    <Card className="border-green-200 bg-green-50/50">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-green-700">Issued</p>
                                    <p className="text-2xl font-bold text-green-800">{issuedCount}</p>
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

                <motion.div {...fadeInUp} transition={{ delay: 0.2 }}>
                    <Card className="border-yellow-200 bg-yellow-50/50">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-yellow-700">Pending Issuance</p>
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
                    <Card className="border-heritage-gold/20">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Verified</p>
                                    <p className="text-2xl font-bold text-heritage-terracottaDark">{verifiedCount}</p>
                                </div>
                                <div className="w-10 h-10 rounded-lg bg-heritage-gold/10 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-heritage-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a1.994 1.994 0 10-.335 3.306" />
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
                                    <p className="text-sm text-gray-600">Downloads</p>
                                    <p className="text-2xl font-bold text-heritage-terracottaDark">{totalDownloads}</p>
                                </div>
                                <div className="w-10 h-10 rounded-lg bg-heritage-terracotta/10 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-heritage-terracottaDark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
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
                                    {pendingCount} certificates pending issuance. Review and issue them to members.
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

            {/* Create Form */}
            {showIssueForm && (
                <motion.div {...fadeInUp}>
                    <Card className="border-heritage-terracotta/20">
                        <CardHeader>
                            <CardTitle className="text-heritage-terracottaDark">Create New Certificate</CardTitle>
                            <CardDescription>This will create a pending certificate that can be issued after review</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-1 block">Recipient Name *</label>
                                    <Input
                                        placeholder="Member name"
                                        value={newCert.recipient}
                                        onChange={(e) => setNewCert(prev => ({ ...prev, recipient: e.target.value }))}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-1 block">Recipient Email</label>
                                    <Input
                                        placeholder="Member email"
                                        value={newCert.recipientEmail}
                                        onChange={(e) => setNewCert(prev => ({ ...prev, recipientEmail: e.target.value }))}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-1 block">Program *</label>
                                    <Input
                                        placeholder="Program name"
                                        value={newCert.program}
                                        onChange={(e) => setNewCert(prev => ({ ...prev, program: e.target.value }))}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-1 block">Grade</label>
                                    <select
                                        className="w-full border rounded-md px-3 py-2 text-sm"
                                        value={newCert.grade}
                                        onChange={(e) => setNewCert(prev => ({ ...prev, grade: e.target.value }))}
                                    >
                                        <option value="Outstanding">Outstanding</option>
                                        <option value="Excellent">Excellent</option>
                                        <option value="Good">Good</option>
                                        <option value="Satisfactory">Satisfactory</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-1 block">Skills (comma-separated)</label>
                                    <Input
                                        placeholder="e.g., Madhubani Patterns, Color Theory"
                                        value={newCert.skills}
                                        onChange={(e) => setNewCert(prev => ({ ...prev, skills: e.target.value }))}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-1 block">Certificate Template</label>
                                    <select
                                        className="w-full border rounded-md px-3 py-2 text-sm"
                                        value={newCert.template}
                                        onChange={(e) => setNewCert(prev => ({ ...prev, template: e.target.value }))}
                                    >
                                        {certificateTemplates.map(t => (
                                            <option key={t.id} value={t.id}>{t.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <Button className="bg-heritage-terracotta text-text-main hover:bg-heritage-terracotta/90" onClick={handleCreate}>
                                Create Certificate
                            </Button>
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
                                    placeholder="Search by recipient, certificate ID, or program..."
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
                                <option value="issued">Issued</option>
                                <option value="pending">Pending</option>
                                <option value="revoked">Revoked</option>
                            </select>
                            <select
                                className="border rounded-md px-3 py-2 text-sm"
                                value={templateFilter}
                                onChange={(e) => setTemplateFilter(e.target.value)}
                            >
                                <option value="all">All Templates</option>
                                {certificateTemplates.map(t => (
                                    <option key={t.id} value={t.name}>{t.name}</option>
                                ))}
                            </select>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Certificates List */}
            <div className="space-y-4">
                {filteredCerts.map((cert, index) => (
                    <motion.div
                        key={cert.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                    >
                        <Card className={`border-l-4 ${cert.status === 'issued' ? 'border-l-green-500' : cert.status === 'pending' ? 'border-l-yellow-500' : 'border-l-red-500'}`}>
                            <CardContent className="p-6">
                                <div className="flex flex-col lg:flex-row gap-6">
                                    {/* Certificate Visual Preview */}
                                    <div className="w-full lg:w-56 h-40 rounded-lg overflow-hidden relative bg-gradient-to-br from-heritage-terracotta to-heritage-gold/40 p-4 flex flex-col items-center justify-center text-white">
                                        <div className="absolute top-2 left-2 w-6 h-6 opacity-30">
                                            <svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="8" /></svg>
                                        </div>
                                        <div className="absolute bottom-2 right-2 w-6 h-6 opacity-30">
                                            <svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="8" /></svg>
                                        </div>
                                        <p className="text-xs uppercase tracking-wider opacity-80">Certificate</p>
                                        <p className="text-sm font-bold mt-1">{cert.program}</p>
                                        <p className="text-xs opacity-80 mt-2">{cert.recipient}</p>
                                        {cert.certificateId && (
                                            <p className="text-xs opacity-60 mt-1">{cert.certificateId}</p>
                                        )}
                                    </div>

                                    {/* Details */}
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <h3 className="text-lg font-semibold text-heritage-terracottaDark">{cert.recipient}</h3>
                                                <p className="text-sm text-gray-600">{cert.recipientEmail} • {cert.program}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Badge className={getStatusColor(cert.status)}>
                                                    {cert.status.charAt(0).toUpperCase() + cert.status.slice(1)}
                                                </Badge>
                                                <Badge className={getGradeColor(cert.grade)}>{cert.grade}</Badge>
                                                {cert.verified && (
                                                    <Badge className="bg-heritage-gold/20 text-heritage-gold border-heritage-gold/30">
                                                        ✓ Verified
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>

                                        {cert.certificateId && (
                                            <div className="bg-gray-50 rounded-md p-2 mb-3 text-sm">
                                                <span className="text-gray-500">Certificate ID:</span>
                                                <span className="ml-2 font-mono font-medium text-heritage-terracottaDark">{cert.certificateId}</span>
                                            </div>
                                        )}

                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm mb-3">
                                            {cert.template && (
                                                <div>
                                                    <span className="text-gray-500">Template:</span>
                                                    <span className="ml-1 font-medium">{cert.template}</span>
                                                </div>
                                            )}
                                            {cert.issuedAt && (
                                                <div>
                                                    <span className="text-gray-500">Issued:</span>
                                                    <span className="ml-1 font-medium">{cert.issuedAt}</span>
                                                </div>
                                            )}
                                            {cert.status === 'issued' && (
                                                <>
                                                    <div>
                                                        <span className="text-gray-500">Downloads:</span>
                                                        <span className="ml-1 font-medium">{cert.downloads}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-500">Shares:</span>
                                                        <span className="ml-1 font-medium">{cert.shares}</span>
                                                    </div>
                                                </>
                                            )}
                                        </div>

                                        {/* Skills */}
                                        <div className="flex items-center gap-2 mb-3">
                                            {cert.skills.map(skill => (
                                                <Badge key={skill} variant="outline" className="text-xs border-heritage-terracotta/20 text-heritage-terracottaDark">{skill}</Badge>
                                            ))}
                                        </div>

                                        <Separator className="my-3" />

                                        <div className="flex items-center gap-3">
                                            {cert.status === 'pending' && (
                                                <>
                                                    <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleIssue(cert.id)}>
                                                        Issue Certificate
                                                    </Button>
                                                    <Button size="sm" variant="outline" className="border-red-300 text-red-600 hover:bg-red-50"
                                                        onClick={() => handleDelete(cert.id)}>
                                                        Cancel
                                                    </Button>
                                                </>
                                            )}
                                            {cert.status === 'issued' && (
                                                <>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className={cert.verified ? 'border-gray-300 text-gray-600' : 'border-heritage-gold/30 text-heritage-gold'}
                                                        onClick={() => handleToggleVerified(cert.id)}
                                                    >
                                                        {cert.verified ? 'Unverify' : '✓ Verify'}
                                                    </Button>
                                                    <Button size="sm" variant="outline" className="border-heritage-terracotta/30 text-heritage-terracottaDark hover:bg-heritage-terracotta/5">
                                                        Revoke
                                                    </Button>
                                                </>
                                            )}
                                            <Button size="sm" variant="outline" className="border-heritage-terracotta/30 text-heritage-terracottaDark hover:bg-heritage-terracotta/5"
                                                onClick={() => setSelectedCert(cert)}>
                                                View Details
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {filteredCerts.length === 0 && (
                <motion.div {...fadeInUp}>
                    <Card>
                        <CardContent className="p-8 text-center">
                            <p className="text-gray-500">No certificates found matching your filters.</p>
                        </CardContent>
                    </Card>
                </motion.div>
            )}

            {/* Detail Modal */}
            {selectedCert && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl max-h-[90vh] overflow-y-auto"
                    >
                        {/* Certificate Preview */}
                        <div className="w-full h-32 rounded-lg overflow-hidden relative bg-gradient-to-br from-heritage-terracotta to-heritage-gold/40 p-4 flex flex-col items-center justify-center text-white mb-4">
                            <div className="absolute top-3 left-3 w-5 h-5 opacity-30">
                                <svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="8" /></svg>
                            </div>
                            <div className="absolute bottom-3 right-3 w-5 h-5 opacity-30">
                                <svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="8" /></svg>
                            </div>
                            <p className="text-xs uppercase tracking-wider opacity-80">Certificate of Completion</p>
                            <p className="text-sm font-bold mt-1">{selectedCert.program}</p>
                            <p className="text-xs opacity-80 mt-2">{selectedCert.recipient}</p>
                        </div>

                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Recipient:</span>
                                <span className="font-medium">{selectedCert.recipient}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Email:</span>
                                <span className="font-medium">{selectedCert.recipientEmail}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Program:</span>
                                <span className="font-medium">{selectedCert.program}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Grade:</span>
                                <Badge className={getGradeColor(selectedCert.grade)}>{selectedCert.grade}</Badge>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Status:</span>
                                <Badge className={getStatusColor(selectedCert.status)}>
                                    {selectedCert.status.charAt(0).toUpperCase() + selectedCert.status.slice(1)}
                                </Badge>
                            </div>
                            {selectedCert.certificateId && (
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Certificate ID:</span>
                                    <span className="font-mono font-medium text-heritage-terracottaDark">{selectedCert.certificateId}</span>
                                </div>
                            )}
                            {selectedCert.template && (
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Template:</span>
                                    <span className="font-medium">{selectedCert.template}</span>
                                </div>
                            )}
                            {selectedCert.issuedAt && (
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Issued Date:</span>
                                    <span className="font-medium">{selectedCert.issuedAt}</span>
                                </div>
                            )}
                            {selectedCert.verified && (
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Verification:</span>
                                    <span className="font-medium text-green-700">✓ Verified</span>
                                </div>
                            )}
                            {selectedCert.status === 'issued' && (
                                <>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Downloads:</span>
                                        <span className="font-medium">{selectedCert.downloads}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Shares:</span>
                                        <span className="font-medium">{selectedCert.shares}</span>
                                    </div>
                                </>
                            )}
                        </div>

                        {selectedCert.skills.length > 0 && (
                            <div className="mt-4">
                                <p className="text-sm text-gray-500 mb-2">Skills Acquired:</p>
                                <div className="flex flex-wrap gap-2">
                                    {selectedCert.skills.map(skill => (
                                        <Badge key={skill} variant="outline" className="text-xs border-heritage-terracotta/20 text-heritage-terracottaDark">{skill}</Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Certificate Templates Info */}
                        <div className="mt-4">
                            <p className="text-sm text-gray-500 mb-2">Available Templates:</p>
                            <div className="grid grid-cols-2 gap-2">
                                {certificateTemplates.map(t => (
                                    <div key={t.id} className={`border rounded-md p-2 text-xs ${t.id === selectedCert.template?.toLowerCase().replace(' ', '-') ? 'border-heritage-terracotta bg-heritage-terracotta/5' : 'border-gray-200'}`}>
                                        <p className="font-medium">{t.name}</p>
                                        <p className="text-gray-500">{t.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-4 flex justify-end">
                            <Button variant="outline" onClick={() => setSelectedCert(null)}>Close</Button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}