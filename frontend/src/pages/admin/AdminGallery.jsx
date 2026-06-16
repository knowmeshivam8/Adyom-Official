import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Image, Plus, Search, Edit, Trash2, Eye, Download,
    CheckCircle2, XCircle, Star, Heart, Palette,
    Grid3x3, List, Filter, Upload, Loader2
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { galleryAPI } from '@/api';

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
};

const fallbackGalleryItems = [
    { id: 1, title: 'Rajasthani Sunset Collection', artist: 'Priya Sharma', category: 'Painting', description: 'A series of desert landscape paintings', views: 1245, likes: 89, featured: true, status: 'active', gradient: 'from-orange-500 to-red-600', createdAt: 'Jun 1, 2026' },
    { id: 2, title: 'Madhubani Peacock Motifs', artist: 'Sujata Das', category: 'Folk Art', description: 'Traditional Madhubani peacock designs', views: 856, likes: 56, featured: true, status: 'active', gradient: 'from-green-500 to-emerald-600', createdAt: 'May 20, 2026' },
    { id: 3, title: 'Warli Village Life', artist: 'Ravi Bhil', category: 'Folk Art', description: 'Warli art depicting daily village activities', views: 2341, likes: 124, featured: true, status: 'active', gradient: 'from-amber-500 to-yellow-600', createdAt: 'May 15, 2026' },
    { id: 4, title: 'Mindful Lotus Series', artist: 'Anita Desai', category: 'Mindfulness', description: 'Lotus paintings from mindfulness sessions', views: 567, likes: 34, featured: false, status: 'active', gradient: 'from-purple-500 to-pink-600', createdAt: 'Apr 28, 2026' },
    { id: 5, title: 'Kalamkari Textile Samples', artist: 'Lakshmi Rao', category: 'Textile Art', description: 'Traditional Kalamkari textile patterns', views: 345, likes: 18, featured: false, status: 'active', gradient: 'from-pink-500 to-rose-600', createdAt: 'Apr 15, 2026' },
    { id: 6, title: 'Miniature Royal Court', artist: 'Rajesh Kumar', category: 'Painting', description: 'Miniature paintings of Mughal court scenes', views: 890, likes: 67, featured: false, status: 'active', gradient: 'from-blue-500 to-indigo-600', createdAt: 'Mar 20, 2026' },
    { id: 7, title: 'Pattachitra Mythology', artist: 'Sujata Das', category: 'Folk Art', description: 'Pattachitra depicting mythological narratives', views: 456, likes: 23, featured: false, status: 'hidden', gradient: 'from-red-500 to-orange-600', createdAt: 'Mar 10, 2026' },
    { id: 8, title: 'Abstract Heritage Fusion', artist: 'Various Artists', category: 'Mixed Media', description: 'Modern interpretations of traditional motifs', views: 678, likes: 45, featured: false, status: 'active', gradient: 'from-indigo-500 to-purple-600', createdAt: 'Feb 25, 2026' },
];

export default function AdminGallery() {
    const [galleryItems, setGalleryItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');
    const [filterFeatured, setFilterFeatured] = useState(false);
    const [viewMode, setViewMode] = useState('grid');
    const [showCreate, setShowCreate] = useState(false);
    const [createForm, setCreateForm] = useState({
        title: '', artist: '', category: 'painting', description: '', featured: false
    });

    useEffect(() => {
        const fetchGallery = async () => {
            try {
                const res = await galleryAPI.getAll();
                const apiItems = res.data.data || [];
                setGalleryItems(apiItems.map(item => ({
                    id: item._id || item.id,
                    title: item.title || '',
                    artist: item.artist || item.artistName || 'Unknown',
                    category: item.category || 'Painting',
                    description: item.description || '',
                    views: item.views || 0,
                    likes: item.likes?.length || item.likes || 0,
                    featured: item.featured || false,
                    status: item.status || 'active',
                    gradient: item.gradient || 'from-blue-500 to-indigo-600',
                    createdAt: item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '',
                    imageUrl: item.imageUrl || item.image || null,
                })));
            } catch (err) {
                console.error('Failed to fetch gallery items, using fallback:', err);
                setGalleryItems(fallbackGalleryItems);
            } finally {
                setLoading(false);
            }
        };
        fetchGallery();
    }, []);

    const handleCreateItem = async (e) => {
        e.preventDefault();
        try {
            const res = await galleryAPI.create({
                title: createForm.title,
                artist: createForm.artist,
                category: createForm.category,
                description: createForm.description,
                featured: createForm.featured,
                status: 'active',
            });
            const newItem = res.data.data || res.data;
            setGalleryItems(prev => [...prev, {
                id: newItem._id || newItem.id,
                title: newItem.title || createForm.title,
                artist: newItem.artist || createForm.artist,
                category: newItem.category || createForm.category,
                description: newItem.description || createForm.description,
                views: 0, likes: 0,
                featured: newItem.featured || createForm.featured,
                status: newItem.status || 'active',
                gradient: 'from-heritage-terracotta to-heritage-gold',
                createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                imageUrl: newItem.imageUrl || null,
            }]);
            setShowCreate(false);
            setCreateForm({ title: '', artist: '', category: 'painting', description: '', featured: false });
        } catch (err) {
            console.error('Failed to create gallery item:', err);
            const created = {
                id: Date.now(),
                title: createForm.title,
                artist: createForm.artist,
                category: createForm.category,
                description: createForm.description,
                views: 0, likes: 0,
                featured: createForm.featured,
                status: 'active',
                gradient: 'from-heritage-terracotta to-heritage-gold',
                createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            };
            setGalleryItems(prev => [...prev, created]);
            setShowCreate(false);
            setCreateForm({ title: '', artist: '', category: 'painting', description: '', featured: false });
        }
    };

    const handleDeleteItem = async (id) => {
        try {
            await galleryAPI.update(id, { status: 'hidden' });
            setGalleryItems(prev => prev.map(i => i.id === id ? { ...i, status: 'hidden' } : i));
        } catch (err) {
            console.error('Failed to update gallery item:', err);
            setGalleryItems(prev => prev.map(i => i.id === id ? { ...i, status: 'hidden' } : i));
        }
    };

    const categories = ['all', 'Painting', 'Folk Art', 'Mindfulness', 'Textile Art', 'Mixed Media'];

    const filteredItems = galleryItems.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) || item.artist.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
        const matchesFeatured = !filterFeatured || item.featured;
        return matchesSearch && matchesCategory && matchesFeatured;
    });

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
                            <Image className="w-6 h-6 text-heritage-gold" />
                            Gallery Management
                        </h1>
                        <p className="text-muted-foreground mt-1">Manage gallery collections and featured artwork</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outlineGold" size="sm"><Download className="w-4 h-4 mr-1" /> Export</Button>
                        <Button variant="gold" size="sm" onClick={() => setShowCreate(true)}><Plus className="w-4 h-4 mr-1" /> Add to Gallery</Button>
                    </div>
                </div>
            </motion.div>

            <Separator />

            <div className="grid md:grid-cols-4 gap-4">
                <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold">{galleryItems.length}</p><p className="text-xs text-muted-foreground">Total Items</p></CardContent></Card>
                <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-heritage-gold">{galleryItems.filter(i => i.featured).length}</p><p className="text-xs text-muted-foreground">Featured</p></CardContent></Card>
                <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-green-600">{galleryItems.filter(i => i.status === 'active').length}</p><p className="text-xs text-muted-foreground">Active</p></CardContent></Card>
                <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold">{galleryItems.reduce((sum, i) => sum + i.views, 0)}</p><p className="text-xs text-muted-foreground">Total Views</p></CardContent></Card>
            </div>

            {showCreate && (
                <motion.div {...fadeInUp}>
                    <Card className="heritage-border">
                        <CardHeader><CardTitle>Add New Gallery Item</CardTitle></CardHeader>
                        <CardContent>
                            <form className="space-y-4" onSubmit={handleCreateItem}>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div><label className="text-sm font-medium mb-1.5 block">Title *</label><Input value={createForm.title} onChange={e => setCreateForm(f => ({ ...f, title: e.target.value }))} placeholder="Gallery item title" required /></div>
                                    <div><label className="text-sm font-medium mb-1.5 block">Artist *</label><Input value={createForm.artist} onChange={e => setCreateForm(f => ({ ...f, artist: e.target.value }))} placeholder="Artist name" required /></div>
                                    <div><label className="text-sm font-medium mb-1.5 block">Category *</label>
                                        <select value={createForm.category} onChange={e => setCreateForm(f => ({ ...f, category: e.target.value }))} className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
                                            <option value="painting">Painting</option><option value="folk-art">Folk Art</option><option value="mindfulness">Mindfulness</option><option value="textile-art">Textile Art</option><option value="mixed-media">Mixed Media</option>
                                        </select>
                                    </div>
                                    <div><label className="text-sm font-medium mb-1.5 block">Featured</label>
                                        <select value={createForm.featured ? 'true' : 'false'} onChange={e => setCreateForm(f => ({ ...f, featured: e.target.value === 'true' }))} className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
                                            <option value="false">No</option><option value="true">Yes - Featured</option>
                                        </select>
                                    </div>
                                </div>
                                <div><label className="text-sm font-medium mb-1.5 block">Description *</label><Textarea value={createForm.description} onChange={e => setCreateForm(f => ({ ...f, description: e.target.value }))} placeholder="Describe this gallery collection..." rows={3} required /></div>
                                <div><label className="text-sm font-medium mb-1.5 block">Images *</label>
                                    <div className="border-2 border-dashed border-heritage-gold/30 rounded-lg p-6 text-center">
                                        <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                                        <p className="text-sm text-muted-foreground">Upload gallery images</p>
                                        <Input type="file" accept="image/*" multiple className="mt-3 max-w-xs mx-auto" />
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button type="submit" variant="gold">Add to Gallery</Button>
                                    <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </motion.div>
            )}

            <div className="flex items-center gap-3 flex-wrap">
                <div className="relative flex-1 min-w-[200px]">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search gallery..." className="pl-9" />
                </div>
                {categories.map(cat => (
                    <Button key={cat} variant={filterCategory === cat ? 'default' : 'outline'} size="sm" onClick={() => setFilterCategory(cat)} className="capitalize text-xs">{cat === 'all' ? 'All' : cat}</Button>
                ))}
                <Button variant={filterFeatured ? 'default' : 'outline'} size="sm" onClick={() => setFilterFeatured(!filterFeatured)} className="text-xs">
                    <Star className="w-3 h-3 mr-1" /> Featured Only
                </Button>
                <div className="flex items-center gap-1">
                    <Button variant={viewMode === 'grid' ? 'default' : 'ghost'} size="icon" onClick={() => setViewMode('grid')}><Grid3x3 className="w-4 h-4" /></Button>
                    <Button variant={viewMode === 'list' ? 'default' : 'ghost'} size="icon" onClick={() => setViewMode('list')}><List className="w-4 h-4" /></Button>
                </div>
            </div>

            {viewMode === 'grid' ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredItems.map(item => (
                        <motion.div key={item.id} {...fadeInUp}>
                            <Card className="group hover:shadow-lg transition-all overflow-hidden">
                                {item.imageUrl ? (
                                    <div className="h-36 relative">
                                        <img src={item.imageUrl} alt={item.title} className="h-36 w-full object-cover" />
                                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                            <Eye className="w-8 h-8 text-white group-hover:text-white transition-colors" />
                                        </div>
                                        {item.featured && <div className="absolute top-2 right-2"><Badge variant="gold" className="text-xs"><Star className="w-3 h-3 mr-1" />Featured</Badge></div>}
                                        {item.status === 'hidden' && <div className="absolute top-2 left-2"><Badge variant="warning" className="text-xs">Hidden</Badge></div>}
                                    </div>
                                ) : (
                                    <div className={`h-36 bg-gradient-to-br ${item.gradient} relative`}>
                                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                            <Palette className="w-10 h-10 text-white group-hover:text-white" />
                                        </div>
                                        {item.featured && <div className="absolute top-2 right-2"><Badge variant="gold" className="text-xs"><Star className="w-3 h-3 mr-1" />Featured</Badge></div>}
                                        {item.status === 'hidden' && <div className="absolute top-2 left-2"><Badge variant="warning" className="text-xs">Hidden</Badge></div>}
                                    </div>
                                )}
                                <CardContent className="p-3">
                                    <h4 className="font-semibold text-sm truncate">{item.title}</h4>
                                    <p className="text-xs text-muted-foreground">{item.artist} · {item.category}</p>
                                    <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                                        <Eye className="w-3 h-3" />{item.views}
                                        <Heart className="w-3 h-3" />{item.likes}
                                    </div>
                                </CardContent>
                                <CardFooter className="p-3 pt-0">
                                    <Button variant="outlineGold" size="sm" className="w-full text-xs"><Edit className="w-3 h-3 mr-1" /> Edit</Button>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <Card>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-muted/50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Item</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Category</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Featured</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Status</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Views</th>
                                        <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {filteredItems.map(item => (
                                        <tr key={item.id} className="hover:bg-muted/30">
                                            <td className="px-4 py-3"><p className="text-sm font-medium">{item.title}</p><p className="text-xs text-muted-foreground">{item.artist} · {item.createdAt}</p></td>
                                            <td className="px-4 py-3"><Badge variant="outline" className="text-xs">{item.category}</Badge></td>
                                            <td className="px-4 py-3">{item.featured ? <Badge variant="gold" className="text-xs">Featured</Badge> : <Badge variant="outline" className="text-xs">No</Badge>}</td>
                                            <td className="px-4 py-3"><Badge variant={item.status === 'active' ? 'success' : 'warning'} className="text-xs capitalize">{item.status}</Badge></td>
                                            <td className="px-4 py-3 text-sm">{item.views}</td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8"><Eye className="w-4 h-4" /></Button>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8"><Edit className="w-4 h-4" /></Button>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">{item.featured ? <XCircle className="w-4 h-4" /> : <Star className="w-4 h-4 text-heritage-gold" />}</Button>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDeleteItem(item.id)}><Trash2 className="w-4 h-4 text-red-500" /></Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}