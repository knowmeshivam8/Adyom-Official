import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Tag, Plus, Search, Trash2, ToggleLeft, ToggleRight,
    Copy, Check, AlertCircle, Users, Calendar, Hash,
    Loader2, Gift, Building2, RefreshCw
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { sponsorAPI, programAPI } from '@/api';

const fadeInUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 } };

const fallbackCodes = [
    { _id: '1', code: 'TATA2026', organization: 'Tata CSR', description: 'Tata Steel CSR sponsorship — KalaPath batch 2026', maxUses: 50, usedCount: 23, isActive: true, expiresAt: '2026-12-31', program: null, createdAt: '2026-01-01' },
    { _id: '2', code: 'SCHOOL100', organization: 'Delhi Public School', description: 'Free enrollment for DPS students', maxUses: 100, usedCount: 45, isActive: true, expiresAt: '2026-06-30', program: null, createdAt: '2026-02-15' },
    { _id: '3', code: 'INFOSYS50', organization: 'Infosys Foundation', description: 'Infosys CSR — Pratibimb program', maxUses: 50, usedCount: 50, isActive: false, expiresAt: '2025-12-31', program: null, createdAt: '2025-10-01' },
];

export default function AdminSponsors() {
    const [codes, setCodes] = useState([]);
    const [programs, setPrograms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showCreate, setShowCreate] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [copied, setCopied] = useState(null);
    const [form, setForm] = useState({
        code: '', organization: '', description: '', maxUses: 0, program: '', expiresAt: ''
    });
    const [formError, setFormError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [codesRes, progsRes] = await Promise.allSettled([
                    sponsorAPI.getAll(),
                    programAPI.getAll()
                ]);
                if (codesRes.status === 'fulfilled') {
                    setCodes(codesRes.value.data.data || []);
                } else {
                    setCodes(fallbackCodes);
                }
                if (progsRes.status === 'fulfilled') {
                    setPrograms(progsRes.value.data.data || []);
                }
            } catch {
                setCodes(fallbackCodes);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        setFormError('');
        if (!form.code.trim() || !form.organization.trim()) {
            setFormError('Code and Organization are required.');
            return;
        }
        setSubmitLoading(true);
        try {
            const payload = {
                ...form,
                code: form.code.toUpperCase().trim(),
                maxUses: parseInt(form.maxUses) || 0,
                program: form.program || undefined,
                expiresAt: form.expiresAt || undefined,
            };
            const res = await sponsorAPI.create(payload);
            setCodes(prev => [res.data.data, ...prev]);
            setShowCreate(false);
            setForm({ code: '', organization: '', description: '', maxUses: 0, program: '', expiresAt: '' });
        } catch (err) {
            setFormError(err.response?.data?.message || 'Failed to create sponsor code.');
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleToggle = async (id) => {
        try {
            await sponsorAPI.toggle(id);
            setCodes(prev => prev.map(c => c._id === id ? { ...c, isActive: !c.isActive } : c));
        } catch (err) {
            console.error('Toggle failed:', err);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this sponsor code? This cannot be undone.')) return;
        try {
            await sponsorAPI.delete(id);
            setCodes(prev => prev.filter(c => c._id !== id));
        } catch (err) {
            console.error('Delete failed:', err);
        }
    };

    const handleCopy = (code) => {
        navigator.clipboard.writeText(code).then(() => {
            setCopied(code);
            setTimeout(() => setCopied(null), 2000);
        });
    };

    const filtered = codes.filter(c =>
        c.code?.toLowerCase().includes(search.toLowerCase()) ||
        c.organization?.toLowerCase().includes(search.toLowerCase())
    );

    const activeCount = codes.filter(c => c.isActive).length;
    const exhaustedCount = codes.filter(c => c.maxUses > 0 && c.usedCount >= c.maxUses).length;
    const totalUses = codes.reduce((sum, c) => sum + (c.usedCount || 0), 0);

    const getCodeStatus = (c) => {
        if (!c.isActive) return { label: 'Inactive', cls: 'bg-gray-100 text-gray-600 border-gray-200' };
        if (c.maxUses > 0 && c.usedCount >= c.maxUses) return { label: 'Exhausted', cls: 'bg-red-100 text-red-700 border-red-200' };
        if (c.expiresAt && new Date(c.expiresAt) < new Date()) return { label: 'Expired', cls: 'bg-orange-100 text-orange-700 border-orange-200' };
        return { label: 'Active', cls: 'bg-green-100 text-green-700 border-green-200' };
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="w-8 h-8 animate-spin text-heritage-gold" />
        </div>
    );

    return (
        <div className="space-y-6">
            <motion.div {...fadeInUp}>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                            <Gift className="w-6 h-6 text-heritage-gold" />
                            Sponsor Code Management
                        </h1>
                        <p className="text-muted-foreground mt-1">Create and manage sponsor codes for free program enrollment</p>
                    </div>
                    <Button variant="gold" size="sm" onClick={() => { setShowCreate(true); setFormError(''); }}>
                        <Plus className="w-4 h-4 mr-1" /> New Code
                    </Button>
                </div>
            </motion.div>

            <Separator />

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Codes', value: codes.length, color: 'text-foreground', bg: 'bg-muted' },
                    { label: 'Active', value: activeCount, color: 'text-green-700', bg: 'bg-green-50' },
                    { label: 'Exhausted', value: exhaustedCount, color: 'text-red-700', bg: 'bg-red-50' },
                    { label: 'Total Uses', value: totalUses, color: 'text-heritage-gold', bg: 'bg-heritage-gold/10' },
                ].map(s => (
                    <Card key={s.label}>
                        <CardContent className={`p-4 ${s.bg} rounded-lg`}>
                            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                            <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Create Form */}
            {showCreate && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                    <Card className="border-heritage-gold/30">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-heritage-terracottaDark">
                                <Plus className="w-5 h-5 text-heritage-gold" /> Create Sponsor Code
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {formError && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm mb-4 flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4 flex-shrink-0" /> {formError}
                                </div>
                            )}
                            <form className="grid md:grid-cols-2 gap-4" onSubmit={handleCreate}>
                                <div>
                                    <label className="text-sm font-medium mb-1.5 block text-heritage-terracottaDark">Code * <span className="text-xs text-muted-foreground">(auto-uppercased)</span></label>
                                    <Input value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))} placeholder="e.g. TATA2026" required />
                                </div>
                                <div>
                                    <label className="text-sm font-medium mb-1.5 block text-heritage-terracottaDark">Organization *</label>
                                    <Input value={form.organization} onChange={e => setForm(f => ({ ...f, organization: e.target.value }))} placeholder="e.g. Tata CSR" required />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="text-sm font-medium mb-1.5 block text-heritage-terracottaDark">Description</label>
                                    <Input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Brief description of this sponsorship" />
                                </div>
                                <div>
                                    <label className="text-sm font-medium mb-1.5 block text-heritage-terracottaDark">Max Uses <span className="text-xs text-muted-foreground">(0 = unlimited)</span></label>
                                    <Input type="number" min="0" value={form.maxUses} onChange={e => setForm(f => ({ ...f, maxUses: e.target.value }))} placeholder="0" />
                                </div>
                                <div>
                                    <label className="text-sm font-medium mb-1.5 block text-heritage-terracottaDark">Expires At <span className="text-xs text-muted-foreground">(optional)</span></label>
                                    <Input type="date" value={form.expiresAt} onChange={e => setForm(f => ({ ...f, expiresAt: e.target.value }))} />
                                </div>
                                <div>
                                    <label className="text-sm font-medium mb-1.5 block text-heritage-terracottaDark">Program <span className="text-xs text-muted-foreground">(optional)</span></label>
                                    <select
                                        value={form.program}
                                        onChange={e => setForm(f => ({ ...f, program: e.target.value }))}
                                        className="w-full h-10 rounded-md border border-heritage-creamDark bg-heritage-creamLight px-3 text-sm text-heritage-brown focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-heritage-gold"
                                    >
                                        <option value="">All Programs</option>
                                        {programs.map(p => (
                                            <option key={p._id} value={p._id}>{p.title || p.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="md:col-span-2 flex gap-2 pt-2">
                                    <Button type="submit" variant="gold" disabled={submitLoading}>
                                        {submitLoading ? <><Loader2 className="w-4 h-4 mr-1 animate-spin" /> Creating...</> : <><Plus className="w-4 h-4 mr-1" /> Create Code</>}
                                    </Button>
                                    <Button type="button" variant="outline" onClick={() => { setShowCreate(false); setFormError(''); }}>Cancel</Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </motion.div>
            )}

            {/* Search */}
            <div className="relative max-w-sm">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search codes or organizations..." className="pl-9" />
            </div>

            {/* Codes Table */}
            <Card>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-muted/50 border-b">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Code</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Organization</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Usage</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Expires</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Status</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {filtered.map(c => {
                                    const status = getCodeStatus(c);
                                    const usagePct = c.maxUses > 0 ? Math.min((c.usedCount / c.maxUses) * 100, 100) : 0;
                                    return (
                                        <tr key={c._id} className="hover:bg-muted/30 transition-colors">
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-mono font-bold text-heritage-terracottaDark text-sm">{c.code}</span>
                                                    <button
                                                        onClick={() => handleCopy(c.code)}
                                                        className="text-muted-foreground hover:text-heritage-gold transition-colors"
                                                        title="Copy code"
                                                    >
                                                        {copied === c.code ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                                                    </button>
                                                </div>
                                                {c.description && <p className="text-xs text-muted-foreground mt-0.5 max-w-[200px] truncate">{c.description}</p>}
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-1.5 text-sm">
                                                    <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
                                                    {c.organization}
                                                </div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="space-y-1 min-w-[100px]">
                                                    <div className="flex items-center gap-1 text-sm">
                                                        <Users className="w-3.5 h-3.5 text-muted-foreground" />
                                                        <span className="font-medium">{c.usedCount}</span>
                                                        {c.maxUses > 0 && <span className="text-muted-foreground">/ {c.maxUses}</span>}
                                                        {c.maxUses === 0 && <span className="text-muted-foreground">/ ∞</span>}
                                                    </div>
                                                    {c.maxUses > 0 && (
                                                        <div className="w-full h-1.5 rounded-full bg-muted">
                                                            <div
                                                                className={`h-1.5 rounded-full transition-all ${usagePct >= 100 ? 'bg-red-500' : usagePct >= 80 ? 'bg-amber-500' : 'bg-green-500'}`}
                                                                style={{ width: `${usagePct}%` }}
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 text-sm text-muted-foreground">
                                                {c.expiresAt ? (
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="w-3.5 h-3.5" />
                                                        {new Date(c.expiresAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                    </div>
                                                ) : '—'}
                                            </td>
                                            <td className="px-4 py-4">
                                                <Badge className={`text-xs border ${status.cls}`}>{status.label}</Badge>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex items-center justify-end gap-1">
                                                    <button
                                                        onClick={() => handleToggle(c._id)}
                                                        className="p-1.5 rounded hover:bg-muted transition-colors"
                                                        title={c.isActive ? 'Deactivate' : 'Activate'}
                                                    >
                                                        {c.isActive
                                                            ? <ToggleRight className="w-5 h-5 text-green-600" />
                                                            : <ToggleLeft className="w-5 h-5 text-muted-foreground" />
                                                        }
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(c._id)}
                                                        className="p-1.5 rounded hover:bg-red-50 transition-colors text-red-500"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {filtered.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="px-4 py-10 text-center text-muted-foreground">
                                            No sponsor codes found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Info box */}
            <Card className="bg-heritage-gold/5 border-heritage-gold/30">
                <CardContent className="p-4">
                    <h3 className="font-semibold text-foreground flex items-center gap-2 mb-2">
                        <Hash className="w-4 h-4 text-heritage-gold" /> How Sponsor Codes Work
                    </h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Members enter the code at enrollment to get the program for free</li>
                        <li>• <strong>Max Uses = 0</strong> means unlimited enrollments</li>
                        <li>• Codes are case-insensitive and auto-validated against expiry and usage limits</li>
                        <li>• Deactivating a code immediately prevents new enrollments without deleting records</li>
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
}
