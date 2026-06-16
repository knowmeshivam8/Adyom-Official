import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShoppingBag, Search, Filter, Star, Heart, Tag, Loader2, Package, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { productAPI } from '@/api';

const fadeInUp = { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6 } };

const CATEGORIES = [
    { key: 'all', label: 'All Products' },
    { key: 'folk-art', label: 'Folk Art' },
    { key: 'tribal-art', label: 'Tribal Art' },
    { key: 'painting', label: 'Painting' },
    { key: 'sculpture', label: 'Sculpture' },
    { key: 'textile', label: 'Textile' },
    { key: 'pottery', label: 'Pottery' },
    { key: 'mixed-media', label: 'Mixed Media' },
    { key: 'other', label: 'Other' },
];

const fallbackProducts = [
    { _id: '1', title: 'Madhubani Wall Art', price: 2500, compareAtPrice: 3200, currency: 'INR', category: 'painting', status: 'available', featured: true, sellerName: 'Priya Sharma', artForm: 'Madhubani', images: [], description: 'Hand-painted Madhubani art on handmade paper, depicting the tree of life.' },
    { _id: '2', title: 'Warli Coaster Set (6 pcs)', price: 850, currency: 'INR', category: 'folk-art', status: 'available', featured: false, sellerName: 'Ravi Bhil', artForm: 'Warli', images: [], description: 'Set of 6 hand-painted Warli coasters, perfect for gifting.' },
    { _id: '3', title: 'Tribal Fabric Clutch', price: 1200, currency: 'INR', category: 'textile', status: 'available', featured: false, sellerName: 'Anita Devi', artForm: 'Tribal Weave', images: [], description: 'Handwoven tribal fabric clutch with mirror work.' },
    { _id: '4', title: 'Gond Art Wall Hanging', price: 3800, compareAtPrice: 4500, currency: 'INR', category: 'folk-art', status: 'available', featured: true, sellerName: 'Sunita Gond', artForm: 'Gond', images: [], description: 'Large Gond art wall hanging depicting forest spirits.' },
    { _id: '5', title: 'Blue Pottery Vase', price: 1800, currency: 'INR', category: 'pottery', status: 'available', featured: false, sellerName: 'Meera Jaipur', artForm: 'Blue Pottery', images: [], description: 'Traditional Jaipur blue pottery vase with floral motifs.' },
    { _id: '6', title: 'Pattachitra Silk Scarf', price: 2200, currency: 'INR', category: 'textile', status: 'available', featured: false, sellerName: 'Deepika Das', artForm: 'Pattachitra', images: [], description: 'Hand-painted Pattachitra motifs on pure silk.' },
];

export default function Products() {
    const [products, setProducts] = useState([]);
    const [featured, setFeatured] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');
    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const [allRes, featRes] = await Promise.allSettled([
                    productAPI.getAll({ status: 'available' }),
                    productAPI.getFeatured(),
                ]);
                if (allRes.status === 'fulfilled') {
                    setProducts(allRes.value.data.data || []);
                } else {
                    setProducts(fallbackProducts);
                }
                if (featRes.status === 'fulfilled') {
                    setFeatured(featRes.value.data.data || []);
                }
            } catch {
                setProducts(fallbackProducts);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const filtered = products.filter(p => {
        const matchSearch = p.title?.toLowerCase().includes(search.toLowerCase()) ||
            p.sellerName?.toLowerCase().includes(search.toLowerCase()) ||
            p.artForm?.toLowerCase().includes(search.toLowerCase());
        const matchCat = activeCategory === 'all' || p.category === activeCategory;
        return matchSearch && matchCat;
    });

    const featuredList = featured.length > 0 ? featured : products.filter(p => p.featured).slice(0, 3);

    return (
        <div className="overflow-hidden">
            {/* Hero */}
            <section className="relative py-20 md:py-28 bg-heritage-terracotta">
                <div className="absolute inset-0 opacity-5 mandala-bg" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <motion.div {...fadeInUp}>
                        <Badge variant="gold" className="mb-4 text-sm px-4 py-1">✦ KalaVritti Marketplace</Badge>
                        <h1 className="text-4xl md:text-5xl font-heading font-bold text-text-main">
                            Artisan Creations
                        </h1>
                        <p className="mt-4 text-xl font-accent text-text-main italic max-w-2xl mx-auto">
                            Handcrafted products made by skilled artisans — every purchase supports heritage art and underprivileged artists
                        </p>
                    </motion.div>
                </div>
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 80" className="w-full h-auto"><path fill="#F4E8D8" d="M0,40 C480,80 960,0 1440,40 L1440,80 L0,80 Z" /></svg>
                </div>
            </section>

            {/* Featured */}
            {featuredList.length > 0 && (
                <section className="py-12 bg-heritage-creamLight">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center gap-2 mb-6">
                            <Star className="w-5 h-5 text-heritage-gold fill-heritage-gold" />
                            <h2 className="text-xl font-heading font-bold text-heritage-terracottaDark">Featured Creations</h2>
                        </div>
                        <div className="grid md:grid-cols-3 gap-6">
                            {featuredList.slice(0, 3).map((p, i) => (
                                <motion.div key={p._id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                                    <Card className="group cursor-pointer overflow-hidden hover:shadow-xl transition-all duration-300 border-heritage-gold/30" onClick={() => setSelectedProduct(p)}>
                                        <div className="h-48 bg-gradient-to-br from-heritage-terracotta/30 to-heritage-gold/30 flex items-center justify-center relative overflow-hidden">
                                            {p.images?.[0]?.url || p.images?.[0] ? (
                                                <img src={p.images[0]?.url || p.images[0]} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                            ) : (
                                                <ShoppingBag className="w-14 h-14 text-heritage-terracotta/40" />
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                            <Badge className="absolute top-3 left-3 bg-heritage-gold text-white text-xs">★ Featured</Badge>
                                        </div>
                                        <CardContent className="p-5">
                                            <h3 className="font-heading font-semibold text-heritage-terracottaDark group-hover:text-heritage-terracotta transition-colors">{p.title}</h3>
                                            <p className="text-xs text-muted-foreground mt-1">by {p.sellerName} · {p.artForm}</p>
                                            <div className="flex items-center justify-between mt-3">
                                                <div>
                                                    <span className="font-bold text-heritage-terracottaDark text-lg">₹{p.price?.toLocaleString('en-IN')}</span>
                                                    {p.compareAtPrice && p.compareAtPrice > p.price && (
                                                        <span className="text-sm line-through text-muted-foreground ml-2">₹{p.compareAtPrice?.toLocaleString('en-IN')}</span>
                                                    )}
                                                </div>
                                                <Badge variant="outline" className="text-xs">{p.category?.replace('-', ' ')}</Badge>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Filters */}
            <section className="py-6 bg-heritage-cream border-y border-heritage-creamDark">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row items-center gap-4">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search products, artists, art forms..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 rounded-md border border-heritage-creamDark bg-heritage-creamLight text-sm font-body text-heritage-brown placeholder:text-heritage-sand focus:ring-2 focus:ring-heritage-gold focus:outline-none"
                            />
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {CATEGORIES.map(cat => (
                                <button
                                    key={cat.key}
                                    onClick={() => setActiveCategory(cat.key)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-body font-medium transition-colors ${activeCategory === cat.key
                                        ? 'bg-heritage-terracotta text-heritage-cream'
                                        : 'bg-heritage-cream text-text-main hover:bg-heritage-creamDark'
                                    }`}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Products Grid */}
            <section className="py-12 md:py-16 bg-heritage-creamLight">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {loading ? (
                        <div className="flex items-center justify-center py-16">
                            <Loader2 className="w-8 h-8 animate-spin text-heritage-terracottaDark" />
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="text-center py-16">
                            <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-30" />
                            <p className="text-muted-foreground font-body">No products found. Try a different search or category.</p>
                        </div>
                    ) : (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                            {filtered.map((p, i) => (
                                <motion.div key={p._id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }}>
                                    <Card className="group cursor-pointer overflow-hidden hover:shadow-lg transition-all duration-300" onClick={() => setSelectedProduct(p)}>
                                        <div className="h-40 bg-gradient-to-br from-heritage-terracotta/20 to-heritage-gold/20 flex items-center justify-center relative overflow-hidden">
                                            {p.images?.[0]?.url || p.images?.[0] ? (
                                                <img src={p.images[0]?.url || p.images[0]} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                            ) : (
                                                <ShoppingBag className="w-10 h-10 text-heritage-terracotta/40" />
                                            )}
                                            {p.compareAtPrice && p.compareAtPrice > p.price && (
                                                <Badge className="absolute top-2 left-2 bg-red-500 text-white text-xs">Sale</Badge>
                                            )}
                                        </div>
                                        <CardContent className="p-4 space-y-2">
                                            <div>
                                                <h3 className="font-heading font-semibold text-sm text-heritage-terracottaDark line-clamp-1 group-hover:text-heritage-terracotta transition-colors">{p.title}</h3>
                                                <p className="text-xs text-muted-foreground">by {p.sellerName || 'Artisan'}</p>
                                            </div>
                                            {p.artForm && <Badge variant="outline" className="text-xs">{p.artForm}</Badge>}
                                            <div className="flex items-center justify-between pt-1">
                                                <div>
                                                    <span className="font-bold text-heritage-terracottaDark">₹{p.price?.toLocaleString('en-IN')}</span>
                                                    {p.compareAtPrice && p.compareAtPrice > p.price && (
                                                        <span className="text-xs line-through text-muted-foreground ml-1">₹{p.compareAtPrice?.toLocaleString('en-IN')}</span>
                                                    )}
                                                </div>
                                                <Tag className="w-4 h-4 text-muted-foreground" />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Impact Section */}
            <section className="py-12 bg-heritage-cream">
                <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
                    <h2 className="text-2xl font-heading font-bold text-heritage-terracottaDark">Your Purchase Creates Impact</h2>
                    <p className="font-body text-text-main max-w-2xl mx-auto">
                        Every product in KalaVritti is handcrafted by artisans trained through the Adyom Foundation's programs.
                        Your purchase directly supports underprivileged women artisans and helps preserve India's living heritage.
                    </p>
                    <div className="grid md:grid-cols-3 gap-6 mt-8">
                        {[
                            { icon: '🎨', title: '100% Handcrafted', desc: 'Every piece made by trained artisans' },
                            { icon: '🌿', title: 'Sustainable Materials', desc: 'Natural dyes and eco-friendly materials' },
                            { icon: '💚', title: 'Direct Support', desc: '80% of revenue goes to the artisan' },
                        ].map((item, i) => (
                            <div key={i} className="p-4 rounded-xl bg-heritage-creamLight border border-heritage-creamDark">
                                <div className="text-3xl mb-2">{item.icon}</div>
                                <h3 className="font-heading font-semibold text-heritage-terracottaDark">{item.title}</h3>
                                <p className="text-sm font-body text-text-main mt-1">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Product Detail Modal */}
            {selectedProduct && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedProduct(null)}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="h-56 bg-gradient-to-br from-heritage-terracotta/30 to-heritage-gold/30 flex items-center justify-center relative">
                            {selectedProduct.images?.[0]?.url || selectedProduct.images?.[0] ? (
                                <img src={selectedProduct.images[0]?.url || selectedProduct.images[0]} alt={selectedProduct.title} className="w-full h-full object-cover" />
                            ) : (
                                <ShoppingBag className="w-16 h-16 text-heritage-terracotta/40" />
                            )}
                            {selectedProduct.featured && <Badge className="absolute top-3 left-3 bg-heritage-gold text-white">★ Featured</Badge>}
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <h2 className="text-xl font-heading font-bold text-heritage-terracottaDark">{selectedProduct.title}</h2>
                                <p className="text-sm text-muted-foreground mt-1">by {selectedProduct.sellerName} · {selectedProduct.artForm}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-2xl font-bold text-heritage-terracottaDark">₹{selectedProduct.price?.toLocaleString('en-IN')}</span>
                                {selectedProduct.compareAtPrice && selectedProduct.compareAtPrice > selectedProduct.price && (
                                    <span className="text-lg line-through text-muted-foreground">₹{selectedProduct.compareAtPrice?.toLocaleString('en-IN')}</span>
                                )}
                                <Badge variant="outline" className="ml-auto capitalize">{selectedProduct.category?.replace('-', ' ')}</Badge>
                            </div>
                            {selectedProduct.description && (
                                <p className="text-sm text-foreground font-body leading-relaxed">{selectedProduct.description}</p>
                            )}
                            {selectedProduct.tags?.length > 0 && (
                                <div className="flex flex-wrap gap-1.5">
                                    {selectedProduct.tags.map(t => <Badge key={t} variant="outline" className="text-xs">{t}</Badge>)}
                                </div>
                            )}
                            <div className="pt-2 border-t flex gap-3">
                                <Button variant="gold" className="flex-1">
                                    <ShoppingBag className="w-4 h-4 mr-2" /> Enquire to Buy
                                </Button>
                                <Button variant="outline" onClick={() => setSelectedProduct(null)}>Close</Button>
                            </div>
                            <p className="text-xs text-muted-foreground text-center">To purchase, contact us at <a href="mailto:store@adyomfoundation.org" className="underline">store@adyomfoundation.org</a></p>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
