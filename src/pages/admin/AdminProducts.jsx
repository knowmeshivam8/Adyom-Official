import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    ShoppingBag, Plus, Search, Edit, Trash2, Tag, Check,
    AlertCircle, Star, Image as ImageIcon, Loader2, Package,
    DollarSign, Eye, EyeOff, CheckCircle2
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { AdminTableSkeleton } from '@/components/ui/page-skeletons';
import { productAPI } from '@/api';

const fadeInUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 } };

const CATEGORIES = ['folk-art', 'tribal-art', 'painting', 'sculpture', 'textile', 'pottery', 'mixed-media', 'other'];
const STATUSES = ['available', 'sold', 'reserved', 'draft'];

const fallbackProducts = [
    { _id: '1', title: 'Madhubani Wall Art', price: 2500, currency: 'INR', category: 'painting', status: 'available', isPublished: true, featured: true, sellerName: 'Priya Sharma', images: [], description: 'Hand-painted Madhubani art on handmade paper.' },
    { _id: '2', title: 'Warli Coaster Set (6 pcs)', price: 850, currency: 'INR', category: 'folk-art', status: 'available', isPublished: true, featured: false, sellerName: 'Ravi Bhil', images: [], description: 'Set of 6 hand-painted Warli coasters.' },
    { _id: '3', title: 'Tribal Fabric Clutch', price: 1200, currency: 'INR', category: 'textile', status: 'sold', isPublished: true, featured: false, sellerName: 'Anita Devi', images: [], description: 'Handwoven tribal fabric clutch bag.' },
];

const emptyForm = { title: '', description: '', price: '', compareAtPrice: '', currency: 'INR', category: 'folk-art', artForm: '', sellerName: '', status: 'available', isPublished: false, featured: false, tags: '', images: [] };

export default function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterCategory, setFilterCategory] = useState('all');
    const [showCreate, setShowCreate] = useState(false);
    const [editProduct, setEditProduct] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [formError, setFormError] = useState('');
    const [imageUrlInput, setImageUrlInput] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await productAPI.getAllAdmin();
                setProducts(res.data.data || []);
            } catch {
                setProducts(fallbackProducts);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const resetForm = () => { setForm(emptyForm); setFormError(''); setImageUrlInput(''); setEditProduct(null); };

    const openCreate = () => { resetForm(); setShowCreate(true); };
    const openEdit = (p) => {
        setForm({
            title: p.title || '', description: p.description || '', price: p.price || '',
            compareAtPrice: p.compareAtPrice || '', currency: p.currency || 'INR',
            category: p.category || 'folk-art', artForm: p.artForm || '', sellerName: p.sellerName || '',
            status: p.status || 'available', isPublished: p.isPublished || false, featured: p.featured || false,
            tags: (p.tags || []).join(', '), images: p.images || [],
        });
        setEditProduct(p);
        setShowCreate(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError('');
        if (!form.title.trim() || !form.price) { setFormError('Title and price are required.'); return; }
        setSubmitLoading(true);
        try {
            const payload = {
                ...form,
                price: parseFloat(form.price),
                compareAtPrice: form.compareAtPrice ? parseFloat(form.compareAtPrice) : undefined,
                tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
            };
            if (editProduct) {
                const res = await productAPI.update(editProduct._id, payload);
                setProducts(prev => prev.map(p => p._id === editProduct._id ? res.data.data : p));
            } else {
                const res = await productAPI.create(payload);
                setProducts(prev => [res.data.data, ...prev]);
            }
            setShowCreate(false);
            resetForm();
        } catch (err) {
            setFormError(err.response?.data?.message || 'Failed to save product.');
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this product? This cannot be undone.')) return;
        try {
            await productAPI.delete(id);
            setProducts(prev => prev.filter(p => p._id !== id));
        } catch (err) { console.error('Delete failed:', err); }
    };

    const handleMarkSold = async (id) => {
        try {
            await productAPI.markAsSold(id);
            setProducts(prev => prev.map(p => p._id === id ? { ...p, status: 'sold' } : p));
        } catch (err) { console.error('Mark sold failed:', err); }
    };

    const handleAddImage = () => {
        if (!imageUrlInput.trim()) return;
        setForm(f => ({ ...f, images: [...f.images, { url: imageUrlInput.trim(), alt: f.title }] }));
        setImageUrlInput('');
    };

    const filtered = products.filter(p => {
        const matchSearch = p.title?.toLowerCase().includes(search.toLowerCase()) || p.sellerName?.toLowerCase().includes(search.toLowerCase());
        const matchStatus = filterStatus === 'all' || p.status === filterStatus;
        const matchCat = filterCategory === 'all' || p.category === filterCategory;
        return matchSearch && matchStatus && matchCat;
    });

    const statusBadge = (s) => {
        const map = { available: 'bg-green-100 text-green-700 border-green-200', sold: 'bg-gray-100 text-gray-600 border-gray-200', reserved: 'bg-amber-100 text-amber-700 border-amber-200', draft: 'bg-blue-100 text-blue-600 border-blue-200' };
        return <Badge className={`text-xs border ${map[s] || 'bg-gray-100'}`}>{s}</Badge>;
    };

    if (loading) return <AdminTableSkeleton rows={8} filters={3} />;

    return (
        <div className="space-y-6">
            <motion.div {...fadeInUp}>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                            <ShoppingBag className="w-6 h-6 text-heritage-gold" />
                            KalaVritti Products
                        </h1>
                        <p className="text-muted-foreground mt-1">Manage the online marketplace for artisan products</p>
                    </div>
                    <Button variant="gold" size="sm" onClick={openCreate}>
                        <Plus className="w-4 h-4 mr-1" /> Add Product
                    </Button>
                </div>
            </motion.div>

            <Separator />

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Products', value: products.length, color: 'text-foreground' },
                    { label: 'Available', value: products.filter(p => p.status === 'available').length, color: 'text-green-700' },
                    { label: 'Sold', value: products.filter(p => p.status === 'sold').length, color: 'text-gray-600' },
                    { label: 'Featured', value: products.filter(p => p.featured).length, color: 'text-heritage-gold' },
                ].map(s => (
                    <Card key={s.label}><CardContent className="p-4"><p className={`text-2xl font-bold ${s.color}`}>{s.value}</p><p className="text-xs text-muted-foreground mt-1">{s.label}</p></CardContent></Card>
                ))}
            </div>

            {/* Create/Edit Form */}
            {showCreate && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                    <Card className="border-heritage-gold/30">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-heritage-terracottaDark">
                                {editProduct ? <Edit className="w-5 h-5 text-heritage-gold" /> : <Plus className="w-5 h-5 text-heritage-gold" />}
                                {editProduct ? 'Edit Product' : 'Add New Product'}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {formError && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm mb-4 flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4 flex-shrink-0" /> {formError}
                                </div>
                            )}
                            <form className="space-y-4" onSubmit={handleSubmit}>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium mb-1.5 block text-heritage-terracottaDark">Title *</label>
                                        <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Product title" required />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium mb-1.5 block text-heritage-terracottaDark">Seller / Artist Name</label>
                                        <Input value={form.sellerName} onChange={e => setForm(f => ({ ...f, sellerName: e.target.value }))} placeholder="Artisan name" />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-medium mb-1.5 block text-heritage-terracottaDark">Description</label>
                                    <Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Product description, materials, dimensions..." rows={3} />
                                </div>

                                <div className="grid md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="text-sm font-medium mb-1.5 block text-heritage-terracottaDark">Price (INR) *</label>
                                        <Input type="number" min="0" step="0.01" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="0.00" required />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium mb-1.5 block text-heritage-terracottaDark">Compare-at Price</label>
                                        <Input type="number" min="0" step="0.01" value={form.compareAtPrice} onChange={e => setForm(f => ({ ...f, compareAtPrice: e.target.value }))} placeholder="Original price (optional)" />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium mb-1.5 block text-heritage-terracottaDark">Category</label>
                                        <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="w-full h-10 rounded-md border border-heritage-creamDark bg-heritage-creamLight px-3 text-sm text-heritage-brown focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-heritage-gold">
                                            {CATEGORIES.map(c => <option key={c} value={c}>{c.replace('-', ' ')}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="text-sm font-medium mb-1.5 block text-heritage-terracottaDark">Art Form</label>
                                        <Input value={form.artForm} onChange={e => setForm(f => ({ ...f, artForm: e.target.value }))} placeholder="e.g. Madhubani, Warli..." />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium mb-1.5 block text-heritage-terracottaDark">Status</label>
                                        <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} className="w-full h-10 rounded-md border border-heritage-creamDark bg-heritage-creamLight px-3 text-sm text-heritage-brown focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-heritage-gold">
                                            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium mb-1.5 block text-heritage-terracottaDark">Tags</label>
                                        <Input value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} placeholder="folk-art, handmade, gift" />
                                    </div>
                                </div>

                                {/* Image URL input */}
                                <div>
                                    <label className="text-sm font-medium mb-1.5 block text-heritage-terracottaDark">Product Images</label>
                                    <div className="flex gap-2">
                                        <Input value={imageUrlInput} onChange={e => setImageUrlInput(e.target.value)} placeholder="Paste image URL..." />
                                        <Button type="button" variant="outline" size="sm" onClick={handleAddImage}>Add</Button>
                                    </div>
                                    {form.images.length > 0 && (
                                        <div className="flex gap-2 flex-wrap mt-2">
                                            {form.images.map((img, i) => (
                                                <div key={i} className="relative group w-16 h-16 rounded border overflow-hidden">
                                                    <img src={img.url || img} alt="" className="w-full h-full object-cover" />
                                                    <button type="button" onClick={() => setForm(f => ({ ...f, images: f.images.filter((_, idx) => idx !== i) }))} className="absolute inset-0 bg-red-500/70 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center text-xs transition-opacity">✕</button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Toggles */}
                                <div className="flex items-center gap-6 pt-2">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" checked={form.isPublished} onChange={e => setForm(f => ({ ...f, isPublished: e.target.checked }))} className="w-4 h-4 rounded border-heritage-creamDark text-heritage-gold focus:ring-heritage-gold" />
                                        <span className="text-sm text-heritage-terracottaDark">Published</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" checked={form.featured} onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))} className="w-4 h-4 rounded border-heritage-creamDark text-heritage-gold focus:ring-heritage-gold" />
                                        <span className="text-sm text-heritage-terracottaDark">Featured</span>
                                    </label>
                                </div>

                                <div className="flex gap-2 pt-2">
                                    <Button type="submit" variant="gold" disabled={submitLoading}>
                                        {submitLoading ? <><Loader2 className="w-4 h-4 mr-1 animate-spin" /> Saving...</> : editProduct ? 'Update Product' : 'Create Product'}
                                    </Button>
                                    <Button type="button" variant="outline" onClick={() => { setShowCreate(false); resetForm(); }}>Cancel</Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </motion.div>
            )}

            {/* Filters */}
            <div className="flex items-center gap-3 flex-wrap">
                <div className="relative flex-1 min-w-[200px]">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." className="pl-9" />
                </div>
                <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="border rounded-md px-3 py-2 text-sm bg-background">
                    <option value="all">All Status</option>
                    {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className="border rounded-md px-3 py-2 text-sm bg-background">
                    <option value="all">All Categories</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c.replace('-', ' ')}</option>)}
                </select>
            </div>

            {/* Products Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map(p => (
                    <motion.div key={p._id} {...fadeInUp}>
                        <Card className="overflow-hidden hover:shadow-md transition-shadow">
                            {/* Image */}
                            <div className="h-36 bg-gradient-to-br from-heritage-terracotta/20 to-heritage-gold/20 flex items-center justify-center relative overflow-hidden">
                                {p.images?.[0]?.url || p.images?.[0] ? (
                                    <img src={p.images[0]?.url || p.images[0]} alt={p.title} className="w-full h-full object-cover" />
                                ) : (
                                    <ImageIcon className="w-10 h-10 text-heritage-terracotta/40" />
                                )}
                                <div className="absolute top-2 left-2 flex gap-1">
                                    {p.featured && <Badge className="text-xs bg-heritage-gold text-white">★ Featured</Badge>}
                                    {!p.isPublished && <Badge className="text-xs bg-gray-700 text-white"><EyeOff className="w-3 h-3 mr-0.5" />Draft</Badge>}
                                </div>
                                <div className="absolute top-2 right-2">
                                    {statusBadge(p.status)}
                                </div>
                            </div>

                            <CardContent className="p-4 space-y-2">
                                <div>
                                    <h3 className="font-semibold text-foreground text-sm line-clamp-1">{p.title}</h3>
                                    <p className="text-xs text-muted-foreground">by {p.sellerName || 'Unknown artist'}</p>
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-heritage-terracottaDark">₹{p.price?.toLocaleString('en-IN')}</span>
                                    {p.compareAtPrice && p.compareAtPrice > p.price && (
                                        <span className="text-xs line-through text-muted-foreground">₹{p.compareAtPrice?.toLocaleString('en-IN')}</span>
                                    )}
                                    <Badge variant="outline" className="text-xs ml-auto">{p.category?.replace('-', ' ')}</Badge>
                                </div>

                                {p.description && <p className="text-xs text-muted-foreground line-clamp-2">{p.description}</p>}

                                <div className="flex gap-1 pt-1">
                                    <Button variant="outline" size="sm" className="flex-1 text-xs" onClick={() => openEdit(p)}>
                                        <Edit className="w-3 h-3 mr-1" /> Edit
                                    </Button>
                                    {p.status === 'available' && (
                                        <Button variant="outline" size="sm" className="text-xs" onClick={() => handleMarkSold(p._id)} title="Mark as Sold">
                                            <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                                        </Button>
                                    )}
                                    <Button variant="outline" size="sm" className="text-xs text-red-500 hover:bg-red-50" onClick={() => handleDelete(p._id)} title="Delete">
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
                {filtered.length === 0 && (
                    <div className="md:col-span-3 text-center py-12 text-muted-foreground">
                        <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
                        <p>No products found. Add your first product to the KalaVritti marketplace.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
