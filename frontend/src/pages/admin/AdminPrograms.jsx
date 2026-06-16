import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BookOpen, Plus, Search, Filter, Edit, Trash2, Eye,
    CheckCircle2, Clock, XCircle, Users, DollarSign,
    GraduationCap, Star, Download, ChevronLeft, ChevronRight,
    LayoutGrid, List, Loader2, Layers, Lock, Unlock,
    ToggleLeft, ToggleRight, Video, Radio, Settings,
    Upload, PlayCircle, AlertCircle, FileText, Camera
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { programAPI, dashboardAPI } from '@/api';

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
};

const fallbackPrograms = [
    { id: 1, title: 'Heritage Art Basics', slug: 'heritage-art-basics', category: 'Painting', level: 'Beginner', price: 1500, duration: '4 weeks', enrolled: 156, maxStudents: 200, rating: 4.9, status: 'active', instructor: 'Priya Sharma', gradient: 'from-blue-500 to-indigo-600' },
    { id: 2, title: 'Mindfulness Through Art', slug: 'mindfulness-art', category: 'Mindfulness', level: 'Intermediate', price: 2000, duration: '6 weeks', enrolled: 89, maxStudents: 150, rating: 4.7, status: 'active', instructor: 'Anita Desai', gradient: 'from-purple-500 to-pink-600' },
    { id: 3, title: 'Warli Folk Art Mastery', slug: 'warli-folk-art', category: 'Folk Art', level: 'Advanced', price: 3500, duration: '10 weeks', enrolled: 45, maxStudents: 50, rating: 4.8, status: 'active', instructor: 'Ravi Bhil', gradient: 'from-amber-500 to-orange-600' },
    { id: 4, title: 'Kalamkari Textile Art', slug: 'kalamkari-textile', category: 'Textile Art', level: 'Intermediate', price: 2500, duration: '8 weeks', enrolled: 0, maxStudents: 100, rating: 0, status: 'draft', instructor: 'Lakshmi Rao', gradient: 'from-green-500 to-emerald-600' },
    { id: 5, title: 'Art Therapy for Wellness', slug: 'art-therapy-wellness', category: 'Wellness', level: 'Beginner', price: 1500, duration: '4 weeks', enrolled: 234, maxStudents: 300, rating: 4.6, status: 'active', instructor: 'Dr. Meena Iyer', gradient: 'from-teal-500 to-cyan-600' },
    { id: 6, title: 'Miniature Painting Techniques', slug: 'miniature-painting', category: 'Painting', level: 'Advanced', price: 3500, duration: '12 weeks', enrolled: 0, maxStudents: 30, rating: 0, status: 'draft', instructor: 'Rajesh Kumar', gradient: 'from-red-500 to-rose-600' },
    { id: 7, title: 'Pattachitra Storytelling', slug: 'pattachitra-storytelling', category: 'Folk Art', level: 'Intermediate', price: 2000, duration: '6 weeks', enrolled: 112, maxStudents: 150, rating: 4.5, status: 'active', instructor: 'Sujata Das', gradient: 'from-pink-500 to-fuchsia-600' },
    { id: 8, title: 'Madhubani Painting Techniques', slug: 'madhubani-techniques', category: 'Folk Art', level: 'Intermediate', price: 2500, duration: '8 weeks', enrolled: 78, maxStudents: 100, rating: 4.8, status: 'archived', instructor: 'Sujata Das', gradient: 'from-yellow-500 to-amber-600' },
];

export default function AdminPrograms() {
    const [programs, setPrograms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');
    const [viewMode, setViewMode] = useState('list');
    const [showCreate, setShowCreate] = useState(false);
    const [createForm, setCreateForm] = useState({
        title: '', slug: '', description: '', category: 'painting',
        level: 'beginner', price: '', duration: '', instructor: '',
        maxStudents: '', modules: ''
    });

    // Module management state
    const [selectedProgram, setSelectedProgram] = useState(null);
    const [showModulePanel, setShowModulePanel] = useState(false);
    const [moduleLoading, setModuleLoading] = useState(false);
    const [moduleExpanded, setModuleExpanded] = useState(null);
    const [showAddSession, setShowAddSession] = useState(null);
    const [showAddRecording, setShowAddRecording] = useState(null);
    const [sessionForm, setSessionForm] = useState({
        title: '', videoUrl: '', type: 'creation', sessionNumber: '', duration: '', thumbnail: ''
    });
    const [recordingForm, setRecordingForm] = useState({
        title: '', videoUrl: '', duration: '', recordedAt: ''
    });
    const [showAddModule, setShowAddModule] = useState(false);
    const [addModuleForm, setAddModuleForm] = useState({
        title: '', artFormName: '', artFormType: 'tribal',
        order: '', fundamentalsVideoUrl: '', description: ''
    });

    const [attendanceData, setAttendanceData] = useState([]);
    const [loadingAttendance, setLoadingAttendance] = useState(false);

    useEffect(() => {
        const fetchPrograms = async () => {
            try {
                const res = await programAPI.getAll();
                const apiPrograms = res.data.data || [];
                setPrograms(apiPrograms.map(p => ({
                    id: p._id || p.id,
                    _id: p._id,
                    title: p.title || '',
                    slug: p.slug || '',
                    category: p.category || 'Painting',
                    level: p.level || 'Beginner',
                    price: p.price || 0,
                    duration: p.duration || '',
                    enrolled: p.enrolledStudents?.length || p.enrolled || 0,
                    maxStudents: p.maxStudents || 100,
                    rating: p.averageRating || p.rating || 0,
                    status: p.status || 'draft',
                    instructor: p.instructor || '',
                    gradient: p.gradient || 'from-blue-500 to-indigo-600',
                    imageUrl: p.imageUrl || p.image || null,
                    programType: p.programType || '',
                    ageGroup: p.ageGroup || '',
                    maxActiveModules: p.maxActiveModules || 7,
                    modules: p.modules || [],
                })));
            } catch (err) {
                console.error('Failed to fetch programs, using fallback:', err);
                setPrograms(fallbackPrograms);
            } finally {
                setLoading(false);
            }
        };
        fetchPrograms();
    }, []);

    // Fetch full program details with modules
    const fetchProgramDetails = async (programId) => {
        setModuleLoading(true);
        try {
            const res = await programAPI.getById(programId);
            const prog = res.data.data || res.data;
            if (prog) {
                setSelectedProgram({
                    id: prog._id || prog.id,
                    _id: prog._id,
                    title: prog.title || '',
                    programType: prog.programType || '',
                    ageGroup: prog.ageGroup || '',
                    maxActiveModules: prog.maxActiveModules || 7,
                    modules: (prog.modules || []).map(m => ({
                        ...m,
                        _id: m._id,
                        title: m.title || '',
                        artFormName: m.artFormName || m.title || '',
                        artFormType: m.artFormType || '',
                        order: m.order || 0,
                        isActive: m.isActive || false,
                        isLocked: m.isLocked || false,
                        fundamentalsVideoUrl: m.fundamentalsVideoUrl || '',
                        sessions: m.sessions || [],
                        liveRecordings: m.liveRecordings || [],
                        description: m.description || '',
                    })).sort((a, b) => (a.order || 0) - (b.order || 0)),
                });
                setShowModulePanel(true);
            }
        } catch (err) {
            console.error('Failed to fetch program details:', err);
            // Use the program data already in state
            const prog = programs.find(p => p.id === programId || p._id === programId);
            if (prog) {
                setSelectedProgram({
                    ...prog,
                    modules: (prog.modules || []).sort((a, b) => (a.order || 0) - (b.order || 0)),
                });
                setShowModulePanel(true);
            }
        } finally {
            setModuleLoading(false);
        }
        
        // Fetch attendance if it's Pratibimb
        if (programId) {
            setLoadingAttendance(true);
            try {
                const attRes = await dashboardAPI.getLeaderboard(programId);
                setAttendanceData(attRes.data?.data || []);
            } catch (e) {
                console.error("Failed to load attendance", e);
            } finally {
                setLoadingAttendance(false);
            }
        }
    };

    // Toggle module active status
    const handleToggleModuleActive = async (moduleId) => {
        if (!selectedProgram) return;
        const module = selectedProgram.modules.find(m => m._id === moduleId);
        if (!module) return;

        const activeCount = selectedProgram.modules.filter(m => m.isActive).length;
        const maxActive = selectedProgram.maxActiveModules || 7;

        if (!module.isActive && activeCount >= maxActive) {
            alert(`Cannot activate more than ${maxActive} modules. Deactivate another module first.`);
            return;
        }

        try {
            await programAPI.toggleModuleActive(selectedProgram._id, moduleId);
            setSelectedProgram(prev => ({
                ...prev,
                modules: prev.modules.map(m =>
                    m._id === moduleId ? { ...m, isActive: !m.isActive } : m
                ),
            }));
        } catch (err) {
            console.error('Failed to toggle module active:', err);
            alert('Failed to toggle module. Please try again.');
        }
    };

    // Toggle module lock status
    const handleToggleModuleLock = async (moduleId) => {
        if (!selectedProgram) return;
        try {
            await programAPI.toggleModuleLock(selectedProgram._id, moduleId);
            setSelectedProgram(prev => ({
                ...prev,
                modules: prev.modules.map(m =>
                    m._id === moduleId ? { ...m, isLocked: !m.isLocked } : m
                ),
            }));
        } catch (err) {
            console.error('Failed to toggle module lock:', err);
            alert('Failed to toggle module. Please try again.');
        }
    };

    // Add a session to a module
    const handleAddSession = async (moduleId) => {
        if (!selectedProgram) return;
        try {
            const data = {
                title: sessionForm.title,
                videoUrl: sessionForm.videoUrl,
                type: sessionForm.type || 'creation',
                sessionNumber: Number(sessionForm.sessionNumber) || 0,
                duration: sessionForm.duration || '',
                thumbnail: sessionForm.thumbnail || '',
            };
            const res = await programAPI.addSession(selectedProgram._id, moduleId, data);
            const newSession = res.data.data || res.data;
            setSelectedProgram(prev => ({
                ...prev,
                modules: prev.modules.map(m =>
                    m._id === moduleId
                        ? { ...m, sessions: [...(m.sessions || []), newSession] }
                        : m
                ),
            }));
            setShowAddSession(null);
            setSessionForm({ title: '', videoUrl: '', type: 'creation', sessionNumber: '', duration: '', thumbnail: '' });
        } catch (err) {
            console.error('Failed to add session:', err);
            alert('Failed to add session. Please try again.');
        }
    };

    // Add a live recording to a module
    const handleAddRecording = async (moduleId) => {
        if (!selectedProgram) return;
        try {
            const data = {
                title: recordingForm.title,
                videoUrl: recordingForm.videoUrl,
                duration: recordingForm.duration || '',
                recordedAt: recordingForm.recordedAt || new Date().toISOString(),
            };
            const res = await programAPI.addLiveRecording(selectedProgram._id, moduleId, data);
            const newRecording = res.data.data || res.data;
            setSelectedProgram(prev => ({
                ...prev,
                modules: prev.modules.map(m =>
                    m._id === moduleId
                        ? { ...m, liveRecordings: [...(m.liveRecordings || []), newRecording] }
                        : m
                ),
            }));
            setShowAddRecording(null);
            setRecordingForm({ title: '', videoUrl: '', duration: '', recordedAt: '' });
        } catch (err) {
            console.error('Failed to add live recording:', err);
            alert('Failed to add live recording. Please try again.');
        }
    };

    // Add a new module to the program
    const handleAddModule = async () => {
        if (!selectedProgram) return;
        try {
            const data = {
                title: addModuleForm.title || addModuleForm.artFormName,
                artFormName: addModuleForm.artFormName,
                artFormType: addModuleForm.artFormType,
                order: Number(addModuleForm.order) || (selectedProgram.modules?.length || 0),
                fundamentalsVideoUrl: addModuleForm.fundamentalsVideoUrl,
                description: addModuleForm.description,
            };
            const res = await programAPI.addModule(selectedProgram._id, data);
            const newModule = res.data.data || res.data;
            setSelectedProgram(prev => ({
                ...prev,
                modules: [...(prev.modules || []), newModule].sort((a, b) => (a.order || 0) - (b.order || 0)),
            }));
            setShowAddModule(false);
            setAddModuleForm({ title: '', artFormName: '', artFormType: 'tribal', order: '', fundamentalsVideoUrl: '', description: '' });
        } catch (err) {
            console.error('Failed to add module:', err);
            alert('Failed to add module. Please try again.');
        }
    };

    // Delete a module
    const handleDeleteModule = async (moduleId) => {
        if (!selectedProgram) return;
        if (!confirm('Are you sure you want to delete this module? This action cannot be undone.')) return;
        try {
            await programAPI.deleteModule(selectedProgram._id, moduleId);
            setSelectedProgram(prev => ({
                ...prev,
                modules: prev.modules.filter(m => m._id !== moduleId),
            }));
        } catch (err) {
            console.error('Failed to delete module:', err);
            alert('Failed to delete module. Please try again.');
        }
    };

    const handleCreateProgram = async (e) => {
        e.preventDefault();
        try {
            const res = await programAPI.create({
                title: createForm.title,
                slug: createForm.slug,
                description: createForm.description,
                category: createForm.category,
                level: createForm.level,
                price: Number(createForm.price) || 0,
                duration: createForm.duration,
                instructor: createForm.instructor,
                maxStudents: Number(createForm.maxStudents) || 100,
                status: 'draft',
            });
            const newProg = res.data.data || res.data;
            setPrograms(prev => [...prev, {
                id: newProg._id || newProg.id,
                _id: newProg._id,
                title: newProg.title || createForm.title,
                slug: newProg.slug || createForm.slug,
                category: newProg.category || createForm.category,
                level: newProg.level || createForm.level,
                price: newProg.price || Number(createForm.price) || 0,
                duration: newProg.duration || createForm.duration,
                enrolled: 0,
                maxStudents: newProg.maxStudents || Number(createForm.maxStudents) || 100,
                rating: 0,
                status: newProg.status || 'draft',
                instructor: newProg.instructor || createForm.instructor,
                gradient: 'from-heritage-terracotta to-heritage-gold',
                imageUrl: newProg.imageUrl || null,
                modules: [],
            }]);
            setShowCreate(false);
            setCreateForm({ title: '', slug: '', description: '', category: 'painting', level: 'beginner', price: '', duration: '', instructor: '', maxStudents: '', modules: '' });
        } catch (err) {
            console.error('Failed to create program:', err);
            const created = {
                id: Date.now(),
                _id: String(Date.now()),
                title: createForm.title,
                slug: createForm.slug,
                category: createForm.category,
                level: createForm.level,
                price: Number(createForm.price) || 0,
                duration: createForm.duration,
                enrolled: 0,
                maxStudents: Number(createForm.maxStudents) || 100,
                rating: 0,
                status: 'draft',
                instructor: createForm.instructor,
                gradient: 'from-heritage-terracotta to-heritage-gold',
                modules: [],
            };
            setPrograms(prev => [...prev, created]);
            setShowCreate(false);
            setCreateForm({ title: '', slug: '', description: '', category: 'painting', level: 'beginner', price: '', duration: '', instructor: '', maxStudents: '', modules: '' });
        }
    };

    const categories = ['all', 'Painting', 'Folk Art', 'Mindfulness', 'Wellness', 'Textile Art', 'Music & Art'];

    const filteredPrograms = programs.filter(p => {
        const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = filterCategory === 'all' || p.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    const getStatusBadge = (status) => {
        switch (status) {
            case 'active': return <Badge variant="success" className="text-xs"><CheckCircle2 className="w-3 h-3 mr-1" />Active</Badge>;
            case 'draft': return <Badge variant="warning" className="text-xs"><Clock className="w-3 h-3 mr-1" />Draft</Badge>;
            case 'archived': return <Badge variant="outline" className="text-xs"><XCircle className="w-3 h-3 mr-1" />Archived</Badge>;
            default: return <Badge variant="outline">{status}</Badge>;
        }
    };

    const getSessionTypeBadge = (type) => {
        switch (type) {
            case 'creation': return <Badge variant="outline" className="text-xs bg-blue-50 border-blue-200 text-blue-700"><Camera className="w-3 h-3 mr-1" />Creation</Badge>;
            case 'application': return <Badge variant="outline" className="text-xs bg-green-50 border-green-200 text-green-700"><FileText className="w-3 h-3 mr-1" />Application</Badge>;
            case 'live-recording': return <Badge variant="outline" className="text-xs bg-red-50 border-red-200 text-red-700"><Radio className="w-3 h-3 mr-1" />Live Recording</Badge>;
            default: return <Badge variant="outline" className="text-xs">{type}</Badge>;
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
                            <BookOpen className="w-6 h-6 text-heritage-gold" />
                            Program Management
                        </h1>
                        <p className="text-muted-foreground mt-1">Create, edit, and manage heritage art programs</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outlineGold" size="sm"><Download className="w-4 h-4 mr-1" /> Export</Button>
                        <Button variant="gold" size="sm" onClick={() => setShowCreate(true)}><Plus className="w-4 h-4 mr-1" /> Create Program</Button>
                    </div>
                </div>
            </motion.div>

            <Separator />

            {/* Stats */}
            <div className="grid md:grid-cols-4 gap-4">
                <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold">{programs.length}</p><p className="text-xs text-muted-foreground">Total Programs</p></CardContent></Card>
                <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-green-600">{programs.filter(p => p.status === 'active').length}</p><p className="text-xs text-muted-foreground">Active</p></CardContent></Card>
                <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-amber-600">{programs.filter(p => p.status === 'draft').length}</p><p className="text-xs text-muted-foreground">Drafts</p></CardContent></Card>
                <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold">{programs.reduce((sum, p) => sum + p.enrolled, 0)}</p><p className="text-xs text-muted-foreground">Total Enrolled</p></CardContent></Card>
            </div>

            {/* Create Program Form */}
            {showCreate && (
                <motion.div {...fadeInUp}>
                    <Card className="heritage-border">
                        <CardHeader><CardTitle className="flex items-center gap-2"><Plus className="w-5 h-5 text-heritage-gold" /> Create New Program</CardTitle></CardHeader>
                        <CardContent>
                            <form className="space-y-4" onSubmit={handleCreateProgram}>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div><label className="text-sm font-medium mb-1.5 block">Title *</label><Input value={createForm.title} onChange={e => setCreateForm(p => ({ ...p, title: e.target.value }))} placeholder="Program title" required /></div>
                                    <div><label className="text-sm font-medium mb-1.5 block">Slug *</label><Input value={createForm.slug} onChange={e => setCreateForm(p => ({ ...p, slug: e.target.value }))} placeholder="program-slug" required /></div>
                                    <div><label className="text-sm font-medium mb-1.5 block">Category *</label>
                                        <select value={createForm.category} onChange={e => setCreateForm(p => ({ ...p, category: e.target.value }))} className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
                                            <option value="painting">Painting</option><option value="folk-art">Folk Art</option><option value="mindfulness">Mindfulness</option><option value="wellness">Wellness</option><option value="textile-art">Textile Art</option><option value="music-art">Music & Art</option>
                                        </select>
                                    </div>
                                    <div><label className="text-sm font-medium mb-1.5 block">Level *</label>
                                        <select value={createForm.level} onChange={e => setCreateForm(p => ({ ...p, level: e.target.value }))} className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
                                            <option value="beginner">Beginner</option><option value="intermediate">Intermediate</option><option value="advanced">Advanced</option>
                                        </select>
                                    </div>
                                    <div><label className="text-sm font-medium mb-1.5 block">Price (₹)</label><Input type="number" value={createForm.price} onChange={e => setCreateForm(p => ({ ...p, price: e.target.value }))} placeholder="1500" /></div>
                                    <div><label className="text-sm font-medium mb-1.5 block">Duration</label><Input value={createForm.duration} onChange={e => setCreateForm(p => ({ ...p, duration: e.target.value }))} placeholder="8 weeks" /></div>
                                    <div><label className="text-sm font-medium mb-1.5 block">Instructor</label><Input value={createForm.instructor} onChange={e => setCreateForm(p => ({ ...p, instructor: e.target.value }))} placeholder="Instructor name" /></div>
                                    <div><label className="text-sm font-medium mb-1.5 block">Max Students</label><Input type="number" value={createForm.maxStudents} onChange={e => setCreateForm(p => ({ ...p, maxStudents: e.target.value }))} placeholder="100" /></div>
                                </div>
                                <div><label className="text-sm font-medium mb-1.5 block">Description *</label><Textarea value={createForm.description} onChange={e => setCreateForm(p => ({ ...p, description: e.target.value }))} placeholder="Program description..." rows={3} required /></div>
                                <div className="flex items-center gap-2">
                                    <Button type="submit" variant="gold">Create Program</Button>
                                    <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </motion.div>
            )}

            {/* Search & Filter */}
            <div className="flex items-center gap-3 flex-wrap">
                <div className="relative flex-1 min-w-[200px]">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search programs..." className="pl-9" />
                </div>
                <div className="flex items-center gap-1">
                    {categories.map(cat => (
                        <Button key={cat} variant={filterCategory === cat ? 'default' : 'outline'} size="sm" onClick={() => setFilterCategory(cat)} className="capitalize text-xs">
                            {cat === 'all' ? 'All' : cat}
                        </Button>
                    ))}
                </div>
                <div className="flex items-center gap-1">
                    <Button variant={viewMode === 'grid' ? 'default' : 'ghost'} size="icon" onClick={() => setViewMode('grid')}><LayoutGrid className="w-4 h-4" /></Button>
                    <Button variant={viewMode === 'list' ? 'default' : 'ghost'} size="icon" onClick={() => setViewMode('list')}><List className="w-4 h-4" /></Button>
                </div>
            </div>

            {/* Programs */}
            {viewMode === 'list' ? (
                <Card>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-muted/50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Program</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Category</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Level</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Status</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Modules</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Enrolled</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Price</th>
                                        <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {filteredPrograms.map(program => {
                                        const activeModules = (program.modules || []).filter(m => m.isActive).length;
                                        const totalModules = (program.modules || []).length;
                                        const isChaitanyaSparsh = program.programType === 'Chaitanya' || program.programType === 'Sparsh' ||
                                            program.category === 'Chaitanya' || program.category === 'Sparsh';
                                        return (
                                            <tr key={program.id} className="hover:bg-muted/30 transition-colors">
                                                <td className="px-4 py-3">
                                                    <p className="text-sm font-medium">{program.title}</p>
                                                    <p className="text-xs text-muted-foreground">{program.instructor?.name || program.instructor} · {program.duration}{program.programType ? ` · ${program.programType}` : ''}</p>
                                                </td>
                                                <td className="px-4 py-3"><Badge variant="outline" className="text-xs">{program.category}</Badge></td>
                                                <td className="px-4 py-3"><Badge variant="outline" className="text-xs capitalize">{program.level}</Badge></td>
                                                <td className="px-4 py-3">{getStatusBadge(program.status)}</td>
                                                <td className="px-4 py-3 text-sm">
                                                    {isChaitanyaSparsh ? (
                                                        <span className="flex items-center gap-1">
                                                            <Layers className="w-3 h-3 text-heritage-gold" />
                                                            {activeModules}/{totalModules || 0}
                                                        </span>
                                                    ) : (
                                                        <span className="text-muted-foreground">—</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-sm">{program.enrolled}/{program.maxStudents}</td>
                                                <td className="px-4 py-3 text-sm font-medium">₹{program.price}</td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center justify-end gap-1">
                                                        {isChaitanyaSparsh && (
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 text-heritage-gold hover:text-heritage-gold"
                                                                title="Manage Modules"
                                                                onClick={() => fetchProgramDetails(program._id || program.id)}
                                                            >
                                                                <Settings className="w-4 h-4" />
                                                            </Button>
                                                        )}
                                                        <Button variant="ghost" size="icon" className="h-8 w-8"><Eye className="w-4 h-4" /></Button>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8"><Edit className="w-4 h-4" /></Button>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8"><Trash2 className="w-4 h-4 text-red-500" /></Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredPrograms.map(program => {
                        const isChaitanyaSparsh = program.programType === 'Chaitanya' || program.programType === 'Sparsh' ||
                            program.category === 'Chaitanya' || program.category === 'Sparsh';
                        const activeModules = (program.modules || []).filter(m => m.isActive).length;
                        return (
                            <motion.div key={program.id} {...fadeInUp}>
                                <Card className="hover:shadow-md transition-all">
                                    {program.imageUrl ? (
                                        <div className="h-24 relative">
                                            <img src={program.imageUrl} alt={program.title} className="h-24 w-full object-cover rounded-t-lg" />
                                            <div className="absolute inset-0 bg-black/20 rounded-t-lg" />
                                            <div className="absolute top-2 right-2">{getStatusBadge(program.status)}</div>
                                        </div>
                                    ) : (
                                        <div className={`h-24 bg-gradient-to-br ${program.gradient} relative`}>
                                            <div className="absolute inset-0 bg-black/20" />
                                            <div className="absolute top-2 right-2">{getStatusBadge(program.status)}</div>
                                        </div>
                                    )}
                                    <CardContent className="p-4">
                                        <h4 className="font-semibold text-foreground mb-1">{program.title}</h4>
                                        <p className="text-sm text-muted-foreground">{program.instructor?.name || program.instructor} · {program.duration}</p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <Badge variant="outline" className="text-xs">{program.category}</Badge>
                                            <Badge variant="outline" className="text-xs capitalize">{program.level}</Badge>
                                            {isChaitanyaSparsh && (
                                                <Badge variant="gold" className="text-xs"><Layers className="w-3 h-3 mr-0.5" />{activeModules} modules</Badge>
                                            )}
                                        </div>
                                        <div className="flex items-center justify-between mt-3 text-sm">
                                            <span className="font-medium">₹{program.price}</span>
                                            <span className="text-muted-foreground">{program.enrolled}/{program.maxStudents} enrolled</span>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="p-4 pt-0 flex items-center gap-1">
                                        <Button variant="outlineGold" size="sm" className="flex-1"><Edit className="w-3 h-3 mr-1" /> Edit</Button>
                                        {isChaitanyaSparsh && (
                                            <Button variant="ghost" size="icon" className="h-8 w-8" title="Manage Modules" onClick={() => fetchProgramDetails(program._id || program.id)}>
                                                <Settings className="w-4 h-4" />
                                            </Button>
                                        )}
                                        <Button variant="ghost" size="icon" className="h-8 w-8"><Eye className="w-4 h-4" /></Button>
                                        <Button variant="ghost" size="icon" className="h-8 w-8"><Trash2 className="w-4 h-4 text-red-500" /></Button>
                                    </CardFooter>
                                </Card>
                            </motion.div>
                        );
                    })}
                </div>
            )}

            {/* ─── Module Management Panel ─── */}
            <AnimatePresence>
                {showModulePanel && selectedProgram && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-start justify-end"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="absolute inset-0 bg-black/50"
                            onClick={() => { setShowModulePanel(false); setSelectedProgram(null); }}
                        />
                        <motion.div
                            className="relative w-full max-w-2xl h-full bg-white shadow-2xl z-10 overflow-y-auto"
                            initial={{ x: 300, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: 300, opacity: 0 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        >
                            {/* Panel Header */}
                            <div className="sticky top-0 bg-white border-b z-10 px-6 py-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-lg font-bold flex items-center gap-2">
                                            <Settings className="w-5 h-5 text-heritage-gold" />
                                            Module Management
                                        </h2>
                                        <p className="text-sm text-muted-foreground">{selectedProgram.title}</p>
                                    </div>
                                    <button
                                        onClick={() => { setShowModulePanel(false); setSelectedProgram(null); }}
                                        className="text-muted-foreground hover:text-foreground p-1"
                                    >
                                        <XCircle className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Module Stats */}
                                <div className="grid grid-cols-4 gap-3 mt-3">
                                    <div className="text-center p-2 rounded bg-muted/50">
                                        <p className="text-lg font-bold">{selectedProgram.modules?.length || 0}</p>
                                        <p className="text-xs text-muted-foreground">Total Modules</p>
                                    </div>
                                    <div className="text-center p-2 rounded bg-green-50">
                                        <p className="text-lg font-bold text-green-700">
                                            {selectedProgram.modules?.filter(m => m.isActive).length || 0}
                                        </p>
                                        <p className="text-xs text-muted-foreground">Active</p>
                                    </div>
                                    <div className="text-center p-2 rounded bg-red-50">
                                        <p className="text-lg font-bold text-red-700">
                                            {selectedProgram.modules?.filter(m => m.isLocked).length || 0}
                                        </p>
                                        <p className="text-xs text-muted-foreground">Locked</p>
                                    </div>
                                    <div className="text-center p-2 rounded bg-amber-50">
                                        <p className="text-lg font-bold text-amber-700">
                                            {selectedProgram.maxActiveModules || 7}
                                        </p>
                                        <p className="text-xs text-muted-foreground">Max Active</p>
                                    </div>
                                </div>

                                {/* Add Module Button */}
                                <Button
                                    variant="gold"
                                    size="sm"
                                    className="w-full mt-3"
                                    onClick={() => setShowAddModule(!showAddModule)}
                                >
                                    <Plus className="w-4 h-4 mr-1" />
                                    {showAddModule ? 'Cancel' : 'Add New Module'}
                                </Button>

                                {/* Pratibimb Tracker */}
                                {selectedProgram?.programType === 'Pratibimb' && (
                                    <div className="mt-4 p-4 border border-heritage-terracotta/20 bg-heritage-creamLight rounded-lg">
                                        <h3 className="text-sm font-bold text-heritage-terracottaDark flex items-center gap-2 mb-3">
                                            <Users className="w-4 h-4" /> Pratibimb Attendance Tracker
                                        </h3>
                                        {loadingAttendance ? (
                                            <div className="flex justify-center p-4"><Loader2 className="w-5 h-5 animate-spin" /></div>
                                        ) : (
                                            <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
                                                {attendanceData.length === 0 ? (
                                                    <p className="text-xs text-muted-foreground text-center">No students enrolled yet.</p>
                                                ) : attendanceData.map(user => (
                                                    <div key={user._id} className="flex items-center justify-between bg-white p-2 rounded border">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-6 h-6 rounded-full bg-heritage-gold/20 flex items-center justify-center text-xs font-bold text-heritage-terracottaDark">
                                                                {user.name?.charAt(0) || 'U'}
                                                            </div>
                                                            <div>
                                                                <p className="text-xs font-medium">{user.name}</p>
                                                                <p className="text-[10px] text-muted-foreground">{user.email}</p>
                                                            </div>
                                                        </div>
                                                        <Badge variant={user.totalAttendance >= 41 ? "success" : "outlineGold"} className="text-[10px]">
                                                            {user.totalAttendance || 0} / 41 Days
                                                        </Badge>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Add Module Form */}
                            <AnimatePresence>
                                {showAddModule && (
                                    <motion.div
                                        className="px-6 py-4 border-b bg-muted/20"
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                    >
                                        <div className="space-y-3">
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <label className="text-xs font-medium mb-1 block">Title *</label>
                                                    <Input
                                                        value={addModuleForm.title}
                                                        onChange={e => setAddModuleForm(p => ({ ...p, title: e.target.value }))}
                                                        placeholder="Module title"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-xs font-medium mb-1 block">Art Form Name *</label>
                                                    <Input
                                                        value={addModuleForm.artFormName}
                                                        onChange={e => setAddModuleForm(p => ({ ...p, artFormName: e.target.value }))}
                                                        placeholder="e.g., Gond Art"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-xs font-medium mb-1 block">Art Form Type</label>
                                                    <select
                                                        value={addModuleForm.artFormType}
                                                        onChange={e => setAddModuleForm(p => ({ ...p, artFormType: e.target.value }))}
                                                        className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                                                    >
                                                        <option value="tribal">Tribal</option>
                                                        <option value="folk">Folk</option>
                                                        <option value="other">Other</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="text-xs font-medium mb-1 block">Order</label>
                                                    <Input
                                                        type="number"
                                                        value={addModuleForm.order}
                                                        onChange={e => setAddModuleForm(p => ({ ...p, order: e.target.value }))}
                                                        placeholder="0"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-xs font-medium mb-1 block">Fundamentals Video URL</label>
                                                <Input
                                                    value={addModuleForm.fundamentalsVideoUrl}
                                                    onChange={e => setAddModuleForm(p => ({ ...p, fundamentalsVideoUrl: e.target.value }))}
                                                    placeholder="https://..."
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs font-medium mb-1 block">Description</label>
                                                <Textarea
                                                    value={addModuleForm.description}
                                                    onChange={e => setAddModuleForm(p => ({ ...p, description: e.target.value }))}
                                                    placeholder="Module description..."
                                                    rows={2}
                                                />
                                            </div>
                                            <Button variant="gold" size="sm" onClick={handleAddModule}>
                                                <Plus className="w-4 h-4 mr-1" /> Add Module
                                            </Button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Module List */}
                            <div className="px-6 py-4 space-y-3">
                                {moduleLoading ? (
                                    <div className="flex items-center justify-center py-12">
                                        <Loader2 className="w-6 h-6 animate-spin text-heritage-gold" />
                                        <span className="ml-2 text-muted-foreground">Loading modules...</span>
                                    </div>
                                ) : (selectedProgram.modules || []).length === 0 ? (
                                    <div className="text-center py-12">
                                        <Layers className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                                        <p className="text-muted-foreground">No modules configured yet</p>
                                        <p className="text-xs text-muted-foreground mt-1">Click "Add New Module" to get started</p>
                                    </div>
                                ) : (
                                    (selectedProgram.modules || []).map((mod, i) => (
                                        <Card key={mod._id || i} className={`${mod.isActive ? 'border-green-200' : 'border-muted'} ${mod.isLocked ? 'bg-red-50/30' : ''}`}>
                                            <CardContent className="p-4">
                                                {/* Module Header */}
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm ${mod.isActive ? 'bg-green-100 text-green-700' : 'bg-muted text-muted-foreground'}`}>
                                                            {mod.order || i + 1}
                                                        </div>
                                                        <div>
                                                            <h4 className="font-semibold text-sm">{mod.artFormName || mod.title}</h4>
                                                            <p className="text-xs text-muted-foreground">
                                                                {mod.artFormType && <span className="capitalize">{mod.artFormType} art</span>}
                                                                {(mod.sessions || []).length > 0 && ` · ${mod.sessions.length} sessions`}
                                                                {(mod.liveRecordings || []).length > 0 && ` · ${mod.liveRecordings.length} recordings`}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        {/* Active Toggle */}
                                                        <button
                                                            onClick={() => handleToggleModuleActive(mod._id)}
                                                            className={`p-1 rounded transition-colors ${mod.isActive ? 'text-green-600 hover:bg-green-100' : 'text-muted-foreground hover:bg-muted'}`}
                                                            title={mod.isActive ? 'Deactivate module' : 'Activate module'}
                                                        >
                                                            {mod.isActive ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
                                                        </button>
                                                        {/* Lock Toggle */}
                                                        <button
                                                            onClick={() => handleToggleModuleLock(mod._id)}
                                                            className={`p-1 rounded transition-colors ${mod.isLocked ? 'text-red-600 hover:bg-red-100' : 'text-muted-foreground hover:bg-muted'}`}
                                                            title={mod.isLocked ? 'Unlock module' : 'Lock module'}
                                                        >
                                                            {mod.isLocked ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
                                                        </button>
                                                        {/* Expand */}
                                                        <button
                                                            onClick={() => setModuleExpanded(moduleExpanded === mod._id ? null : mod._id)}
                                                            className="p-1 rounded text-muted-foreground hover:bg-muted transition-colors"
                                                        >
                                                            <ChevronRight className={`w-5 h-5 transition-transform ${moduleExpanded === mod._id ? 'rotate-90' : ''}`} />
                                                        </button>
                                                        {/* Delete */}
                                                        <button
                                                            onClick={() => handleDeleteModule(mod._id)}
                                                            className="p-1 rounded text-red-400 hover:bg-red-50 transition-colors"
                                                            title="Delete module"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Status badges */}
                                                <div className="flex items-center gap-2 mt-2">
                                                    {mod.isActive && <Badge variant="success" className="text-xs">Active</Badge>}
                                                    {!mod.isActive && <Badge variant="outline" className="text-xs">Inactive</Badge>}
                                                    {mod.isLocked && <Badge variant="outline" className="text-xs border-red-300 text-red-700"><Lock className="w-3 h-3 mr-0.5" />Locked</Badge>}
                                                    {mod.fundamentalsVideoUrl && (
                                                        <Badge variant="outline" className="text-xs border-blue-300 text-blue-700">
                                                            <Video className="w-3 h-3 mr-0.5" />Fundamentals
                                                        </Badge>
                                                    )}
                                                </div>

                                                {/* Expanded Content */}
                                                <AnimatePresence>
                                                    {moduleExpanded === mod._id && (
                                                        <motion.div
                                                            className="mt-4 space-y-4"
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: 'auto', opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                        >
                                                            <Separator />

                                                            {/* Sessions */}
                                                            <div>
                                                                <div className="flex items-center justify-between mb-2">
                                                                    <h5 className="text-sm font-semibold flex items-center gap-1">
                                                                        <PlayCircle className="w-4 h-4 text-heritage-gold" />
                                                                        Sessions ({(mod.sessions || []).length})
                                                                    </h5>
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={() => setShowAddSession(showAddSession === mod._id ? null : mod._id)}
                                                                    >
                                                                        <Plus className="w-3 h-3 mr-1" /> Add Session
                                                                    </Button>
                                                                </div>

                                                                {/* Add Session Form */}
                                                                <AnimatePresence>
                                                                    {showAddSession === mod._id && (
                                                                        <motion.div
                                                                            className="mb-3 p-3 rounded bg-muted/30 border"
                                                                            initial={{ height: 0, opacity: 0 }}
                                                                            animate={{ height: 'auto', opacity: 1 }}
                                                                            exit={{ height: 0, opacity: 0 }}
                                                                        >
                                                                            <div className="grid grid-cols-2 gap-2">
                                                                                <div>
                                                                                    <label className="text-xs font-medium mb-1 block">Title *</label>
                                                                                    <Input
                                                                                        value={sessionForm.title}
                                                                                        onChange={e => setSessionForm(p => ({ ...p, title: e.target.value }))}
                                                                                        placeholder="Session title"
                                                                                    />
                                                                                </div>
                                                                                <div>
                                                                                    <label className="text-xs font-medium mb-1 block">Video URL *</label>
                                                                                    <Input
                                                                                        value={sessionForm.videoUrl}
                                                                                        onChange={e => setSessionForm(p => ({ ...p, videoUrl: e.target.value }))}
                                                                                        placeholder="https://..."
                                                                                    />
                                                                                </div>
                                                                                <div>
                                                                                    <label className="text-xs font-medium mb-1 block">Type</label>
                                                                                    <select
                                                                                        value={sessionForm.type}
                                                                                        onChange={e => setSessionForm(p => ({ ...p, type: e.target.value }))}
                                                                                        className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                                                                                    >
                                                                                        <option value="creation">Creation</option>
                                                                                        <option value="application">Application</option>
                                                                                    </select>
                                                                                </div>
                                                                                <div>
                                                                                    <label className="text-xs font-medium mb-1 block">Session #</label>
                                                                                    <Input
                                                                                        type="number"
                                                                                        value={sessionForm.sessionNumber}
                                                                                        onChange={e => setSessionForm(p => ({ ...p, sessionNumber: e.target.value }))}
                                                                                        placeholder="1"
                                                                                    />
                                                                                </div>
                                                                                <div>
                                                                                    <label className="text-xs font-medium mb-1 block">Duration</label>
                                                                                    <Input
                                                                                        value={sessionForm.duration}
                                                                                        onChange={e => setSessionForm(p => ({ ...p, duration: e.target.value }))}
                                                                                        placeholder="60 min"
                                                                                    />
                                                                                </div>
                                                                                <div>
                                                                                    <label className="text-xs font-medium mb-1 block">Thumbnail URL</label>
                                                                                    <Input
                                                                                        value={sessionForm.thumbnail}
                                                                                        onChange={e => setSessionForm(p => ({ ...p, thumbnail: e.target.value }))}
                                                                                        placeholder="https://..."
                                                                                    />
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex gap-2 mt-2">
                                                                                <Button variant="gold" size="sm" onClick={() => handleAddSession(mod._id)}>
                                                                                    <Plus className="w-3 h-3 mr-1" /> Add
                                                                                </Button>
                                                                                <Button variant="outline" size="sm" onClick={() => setShowAddSession(null)}>
                                                                                    Cancel
                                                                                </Button>
                                                                            </div>
                                                                        </motion.div>
                                                                    )}
                                                                </AnimatePresence>

                                                                {(!mod.sessions || mod.sessions.length === 0) ? (
                                                                    <p className="text-xs text-muted-foreground py-2">No sessions added yet.</p>
                                                                ) : (
                                                                    <div className="space-y-1">
                                                                        {(mod.sessions || []).map((s, si) => (
                                                                            <div key={si} className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-muted/50 text-sm">
                                                                                <div className="flex items-center gap-2">
                                                                                    <span className="text-xs text-muted-foreground">#{s.sessionNumber || si + 1}</span>
                                                                                    <span>{s.title}</span>
                                                                                    {getSessionTypeBadge(s.type)}
                                                                                </div>
                                                                                <span className="text-xs text-muted-foreground">{s.duration}</span>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </div>

                                                            <Separator />

                                                            {/* Live Recordings */}
                                                            <div>
                                                                <div className="flex items-center justify-between mb-2">
                                                                    <h5 className="text-sm font-semibold flex items-center gap-1">
                                                                        <Radio className="w-4 h-4 text-red-500" />
                                                                        Live Recordings ({(mod.liveRecordings || []).length})
                                                                    </h5>
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={() => setShowAddRecording(showAddRecording === mod._id ? null : mod._id)}
                                                                    >
                                                                        <Plus className="w-3 h-3 mr-1" /> Add Recording
                                                                    </Button>
                                                                </div>

                                                                {/* Add Recording Form */}
                                                                <AnimatePresence>
                                                                    {showAddRecording === mod._id && (
                                                                        <motion.div
                                                                            className="mb-3 p-3 rounded bg-muted/30 border"
                                                                            initial={{ height: 0, opacity: 0 }}
                                                                            animate={{ height: 'auto', opacity: 1 }}
                                                                            exit={{ height: 0, opacity: 0 }}
                                                                        >
                                                                            <div className="grid grid-cols-2 gap-2">
                                                                                <div>
                                                                                    <label className="text-xs font-medium mb-1 block">Title *</label>
                                                                                    <Input
                                                                                        value={recordingForm.title}
                                                                                        onChange={e => setRecordingForm(p => ({ ...p, title: e.target.value }))}
                                                                                        placeholder="Recording title"
                                                                                    />
                                                                                </div>
                                                                                <div>
                                                                                    <label className="text-xs font-medium mb-1 block">Video URL *</label>
                                                                                    <Input
                                                                                        value={recordingForm.videoUrl}
                                                                                        onChange={e => setRecordingForm(p => ({ ...p, videoUrl: e.target.value }))}
                                                                                        placeholder="https://..."
                                                                                    />
                                                                                </div>
                                                                                <div>
                                                                                    <label className="text-xs font-medium mb-1 block">Duration</label>
                                                                                    <Input
                                                                                        value={recordingForm.duration}
                                                                                        onChange={e => setRecordingForm(p => ({ ...p, duration: e.target.value }))}
                                                                                        placeholder="90 min"
                                                                                    />
                                                                                </div>
                                                                                <div>
                                                                                    <label className="text-xs font-medium mb-1 block">Recorded At</label>
                                                                                    <Input
                                                                                        type="datetime-local"
                                                                                        value={recordingForm.recordedAt}
                                                                                        onChange={e => setRecordingForm(p => ({ ...p, recordedAt: e.target.value }))}
                                                                                    />
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex gap-2 mt-2">
                                                                                <Button variant="gold" size="sm" onClick={() => handleAddRecording(mod._id)}>
                                                                                    <Plus className="w-3 h-3 mr-1" /> Add
                                                                                </Button>
                                                                                <Button variant="outline" size="sm" onClick={() => setShowAddRecording(null)}>
                                                                                    Cancel
                                                                                </Button>
                                                                            </div>
                                                                        </motion.div>
                                                                    )}
                                                                </AnimatePresence>

                                                                {(!mod.liveRecordings || mod.liveRecordings.length === 0) ? (
                                                                    <p className="text-xs text-muted-foreground py-2">No live recordings added yet.</p>
                                                                ) : (
                                                                    <div className="space-y-1">
                                                                        {(mod.liveRecordings || []).map((lr, li) => (
                                                                            <div key={li} className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-muted/50 text-sm">
                                                                                <div className="flex items-center gap-2">
                                                                                    <Radio className="w-3 h-3 text-red-500" />
                                                                                    <span>{lr.title}</span>
                                                                                </div>
                                                                                <div className="flex items-center gap-2">
                                                                                    <span className="text-xs text-muted-foreground">{lr.duration}</span>
                                                                                    <span className="text-xs text-muted-foreground">
                                                                                        {lr.recordedAt ? new Date(lr.recordedAt).toLocaleDateString() : ''}
                                                                                    </span>
                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </div>

                                                            {/* Fundamentals Video */}
                                                            {mod.fundamentalsVideoUrl && (
                                                                <>
                                                                    <Separator />
                                                                    <div>
                                                                        <h5 className="text-sm font-semibold flex items-center gap-1 mb-1">
                                                                            <Video className="w-4 h-4 text-blue-500" />
                                                                            Fundamentals Video
                                                                        </h5>
                                                                        <p className="text-xs text-muted-foreground truncate">{mod.fundamentalsVideoUrl}</p>
                                                                    </div>
                                                                </>
                                                            )}
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </CardContent>
                                        </Card>
                                    ))
                                )}
                            </div>

                            {/* Panel Footer */}
                            <div className="sticky bottom-0 bg-white border-t px-6 py-3">
                                <div className="flex items-center justify-between">
                                    <p className="text-xs text-muted-foreground">
                                        Active: {selectedProgram.modules?.filter(m => m.isActive).length || 0} / {selectedProgram.maxActiveModules || 7} max
                                    </p>
                                    <Button
                                        variant="gold"
                                        size="sm"
                                        onClick={() => { setShowModulePanel(false); setSelectedProgram(null); }}
                                    >
                                        Done
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}