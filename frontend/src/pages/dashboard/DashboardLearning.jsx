import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BookOpen, Sparkles, PlayCircle, Loader2,
    Search, ChevronRight, GraduationCap,
    FileText, Video as VideoIcon, X
} from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { learningAPI } from '@/api';
import SecureVideoPlayer from '@/components/ui/SecureVideoPlayer';

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
};

export default function DashboardLearning() {
    const [search, setSearch] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');
    const [learningItems, setLearningItems] = useState([]);
    const [loading, setLoading] = useState(true);

    // Video player modal state
    const [activeVideo, setActiveVideo] = useState(null);
    const [showVideoModal, setShowVideoModal] = useState(false);

    const openVideoPlayer = useCallback((item) => {
        setActiveVideo({
            videoUrl: item.videoUrl || 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4',
            videoId: String(item.id),
            programId: 'learning-library',
            moduleTitle: item.title,
            sessionIndex: 0,
            poster: item.imageUrl || null,
        });
        setShowVideoModal(true);
    }, []);

    const closeVideoPlayer = useCallback(() => {
        setShowVideoModal(false);
        setTimeout(() => setActiveVideo(null), 300);
    }, []);

    useEffect(() => {
        const fetchLearningData = async () => {
            try {
                // Mock robust fallback data
                let apiItems = [
                    { id: '1', title: 'Pratibimb: 41-Day Sadhana Course', category: 'Pratibimb', type: 'course', level: 'All Levels', duration: '41 Days', instructor: 'Priya Patel', description: 'The complete 41-day Pratibimb journey. Follow along daily to find inner peace through mindful painting.', gradient: 'from-amber-500 to-red-600', videoUrl: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4' },
                    { id: '2', title: 'Sparsh: Therapeutic Art Foundation', category: 'Sparsh', type: 'course', level: 'Beginner', duration: '10 Sessions', instructor: 'Sneha Verma', description: 'A complete foundational course in therapeutic art, designed to release stress and foster emotional healing.', gradient: 'from-blue-500 to-indigo-600', videoUrl: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4' },
                    { id: '3', title: 'KalaPath: Textile Patterns Guide', category: 'KalaPath', type: 'article', level: 'Beginner', duration: '10 min', instructor: 'Adyom Team', description: 'A comprehensive guide to understanding block printing patterns and career paths in textile arts.', gradient: 'from-emerald-500 to-teal-600' },
                    { id: '4', title: 'Chaitanya: Wellness Through Colors', category: 'Chaitanya', type: 'video', level: 'Advanced', duration: '40 min', instructor: 'Ananya Rai', description: 'How color theory impacts psychological wellness and emotional balance.', gradient: 'from-purple-500 to-pink-600', videoUrl: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4' },
                    { id: '5', title: 'Folk Art: Warli Painting Masterclass', category: 'Folk Art', type: 'video', level: 'Beginner', duration: '45 min', instructor: 'Dr. Sharma', description: 'Learn the rich history and basic motifs of traditional Indian Warli art.', gradient: 'from-rose-500 to-orange-600', videoUrl: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4' },
                    { id: '6', title: 'Pratibimb: Warmup Exercises', category: 'Pratibimb', type: 'video', level: 'Beginner', duration: '15 min', instructor: 'Priya Patel', description: 'Daily warmup exercises to prepare your mind and hands before painting.', gradient: 'from-orange-400 to-amber-600', videoUrl: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4' },
                ];

                try {
                    const res = await learningAPI.getAll({ status: 'published' });
                    if (res.data?.data && res.data.data.length > 0) {
                        apiItems = res.data.data.map(item => ({
                            id: item._id || item.id,
                            title: item.title || 'Learning Resource',
                            category: item.category || 'General',
                            type: item.type || 'article',
                            level: item.level || 'Beginner',
                            duration: item.duration || '30 min',
                            instructor: item.instructor || 'Instructor',
                            description: item.description || '',
                            gradient: item.image ? '' : 'from-heritage-terracotta to-red-800',
                            imageUrl: item.image || null,
                            videoUrl: item.videoUrl || null,
                        }));
                    }
                } catch (err) {
                    console.log('Using robust fallback learning data');
                }

                setLearningItems(apiItems);
            } finally {
                setLoading(false);
            }
        };
        fetchLearningData();
    }, []);

    const categories = ['all', 'Pratibimb', 'Chaitanya', 'Sparsh', 'KalaPath', 'Folk Art'];

    const filteredItems = learningItems.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) ||
            item.description.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    const getTypeIcon = (type) => {
        switch (type) {
            case 'video': return VideoIcon;
            case 'article': return FileText;
            case 'course': return GraduationCap;
            default: return BookOpen;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-heritage-gold" />
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <motion.div {...fadeInUp}>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-heading font-bold text-heritage-terracottaDark flex items-center gap-2">
                            <Sparkles className="w-8 h-8 text-heritage-gold" />
                            Learning Library
                        </h1>
                        <p className="text-muted-foreground mt-1 text-lg">Access all your courses, videos, and articles in one place.</p>
                    </div>
                </div>
            </motion.div>

            <Separator />

            <motion.div {...fadeInUp} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-4">
                <div className="relative flex-1 w-full">
                    <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <Input 
                        value={search} 
                        onChange={e => setSearch(e.target.value)} 
                        placeholder="Search resources..." 
                        className="pl-10 h-12 bg-gray-50 border-gray-200 rounded-xl w-full" 
                    />
                </div>
                <div className="flex items-center gap-2 flex-wrap w-full md:w-auto">
                    {categories.map(cat => (
                        <Button
                            key={cat}
                            variant={filterCategory === cat ? 'gold' : 'outline'}
                            onClick={() => setFilterCategory(cat)}
                            className="capitalize rounded-full shadow-sm"
                        >
                            {cat === 'all' ? 'All Topics' : cat}
                        </Button>
                    ))}
                </div>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
                {filteredItems.map((item) => {
                    const TypeIcon = getTypeIcon(item.type);
                    return (
                        <motion.div key={item.id} {...fadeInUp}>
                            <Card className="hover:shadow-lg transition-all group overflow-hidden border-none shadow-md h-full flex flex-col rounded-2xl">
                                {item.imageUrl ? (
                                    <div className="h-40 relative overflow-hidden bg-gray-100">
                                        <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                        <div className="absolute bottom-3 left-3 flex items-center gap-2">
                                            <Badge className="bg-white/90 text-heritage-terracottaDark font-semibold shadow-sm flex items-center gap-1">
                                                <TypeIcon className="w-3 h-3" /> {item.type}
                                            </Badge>
                                        </div>
                                    </div>
                                ) : (
                                    <div className={`h-40 bg-gradient-to-br ${item.gradient} relative overflow-hidden`}>
                                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
                                        <BookOpen className="absolute -right-4 -bottom-4 w-24 h-24 text-white/20 -rotate-12" />
                                        <div className="absolute bottom-3 left-3 flex items-center gap-2">
                                            <Badge className="bg-white/90 text-heritage-terracottaDark font-semibold shadow-sm flex items-center gap-1 capitalize">
                                                <TypeIcon className="w-3 h-3" /> {item.type}
                                            </Badge>
                                        </div>
                                    </div>
                                )}
                                <CardContent className="p-5 flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-bold text-heritage-gold uppercase tracking-wider">{item.category}</span>
                                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md">{item.duration}</span>
                                    </div>
                                    <h4 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2 leading-tight group-hover:text-heritage-terracottaDark transition-colors">{item.title}</h4>
                                    <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
                                </CardContent>
                                <CardFooter className="p-5 pt-0 mt-auto border-t border-gray-50 bg-gray-50/50">
                                    {item.type === 'video' ? (
                                        <Button variant="gold" className="w-full shadow-sm rounded-xl" onClick={() => openVideoPlayer(item)}>
                                            <PlayCircle className="w-5 h-5 mr-2" /> Watch Video
                                        </Button>
                                    ) : (
                                        <Button variant="outlineGold" className="w-full shadow-sm rounded-xl">
                                            Read Article <ChevronRight className="w-4 h-4 ml-2" />
                                        </Button>
                                    )}
                                </CardFooter>
                            </Card>
                        </motion.div>
                    );
                })}
            </div>

            {filteredItems.length === 0 && (
                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                    <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-800">No resources found</h3>
                    <p className="text-gray-500 mt-2 max-w-md mx-auto">We couldn't find any learning materials matching your search or filters.</p>
                </div>
            )}

            {/* Video Player Modal */}
            <AnimatePresence>
                {showVideoModal && activeVideo && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 md:p-8 backdrop-blur-sm"
                    >
                        <div className="relative w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10">
                            {/* Close Button */}
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={closeVideoPlayer}
                                className="absolute top-4 right-4 z-50 text-white hover:bg-white/20 bg-black/40 backdrop-blur-md rounded-full w-10 h-10"
                            >
                                <X className="w-6 h-6" />
                            </Button>
                            
                            <div className="absolute top-4 left-4 z-50 text-white bg-black/40 backdrop-blur-md px-4 py-2 rounded-full pointer-events-none">
                                <h3 className="font-semibold text-sm">{activeVideo.moduleTitle}</h3>
                            </div>

                            <SecureVideoPlayer
                                videoUrl={activeVideo.videoUrl}
                                videoId={activeVideo.videoId}
                                programId={activeVideo.programId}
                                moduleTitle={activeVideo.moduleTitle}
                                sessionIndex={activeVideo.sessionIndex}
                                poster={activeVideo.poster}
                                onComplete={closeVideoPlayer}
                                className="w-full h-full rounded-2xl"
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}