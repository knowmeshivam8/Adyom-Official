import { useState, useEffect, useMemo } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
    ArrowLeft, Lock, PlayCircle, Loader2, Video, 
    Palette, Activity, ChevronDown, ChevronUp, BookOpen
} from 'lucide-react';
import { programAPI, learningAPI } from '@/api';
import { useAuth } from '@/context/AuthContext';
import SecureVideoPlayer from '@/components/ui/SecureVideoPlayer';

export default function LearningPlayer() {
    const { slug } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    
    const [program, setProgram] = useState(null);
    const [loading, setLoading] = useState(true);
    const [expandedModules, setExpandedModules] = useState({});
    const [videoProgress, setVideoProgress] = useState([]);

    const activeModuleId = searchParams.get('module');
    const activeVideoId = searchParams.get('video');

    const enrolledProgram = user?.enrolledPrograms?.find(
        ep => String(ep.program?._id || ep.program) === String(program?._id || program?.slug)
    );
    const enrolledModules = enrolledProgram?.enrolledModules || [];

    useEffect(() => {
        const fetchProgram = async () => {
            try {
                const res = await programAPI.getBySlug(slug);
                const apiProgram = res.data.data || res.data.program || res.data;
                
                const modules = (apiProgram.modules || []).map(m => ({
                    ...m,
                    _id: m._id || `mod_${Math.random()}`,
                    sessions: m.sessions || [],
                }));

                setProgram({ ...apiProgram, modules });
                
                // Fetch user's video progress
                if (user) {
                    try {
                        const progRes = await learningAPI.getVideoProgress(apiProgram._id);
                        if (progRes.data?.data?.videoProgress) {
                            setVideoProgress(progRes.data.data.videoProgress);
                        }
                    } catch (err) {
                        console.error("Failed to load video progress", err);
                    }
                }

                if (activeModuleId) {
                    setExpandedModules(prev => ({ ...prev, [activeModuleId]: true }));
                }
            } catch (err) {
                console.error("Failed to load program for player", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProgram();
    }, [slug, activeModuleId]);

    const playlist = useMemo(() => {
        if (!program || !program.modules) return [];
        const list = [];
        
        program.modules.forEach(mod => {
            if (!mod.isActive) return;
            
            const isModEnrolled = enrolledModules.includes(mod._id);
            // Any logged-in user gets full access to all active modules
            const isLocked = mod.isLocked && !user;

            if (mod.fundamentalsVideoUrl) {
                list.push({
                    id: `${mod._id}-fund`,
                    moduleId: mod._id,
                    moduleTitle: mod.artFormName || mod.title,
                    type: 'fundamentals',
                    title: `Fundamentals: ${mod.artFormName || mod.title}`,
                    url: mod.fundamentalsVideoUrl,
                    isLocked,
                    icon: <Video className="w-4 h-4" />
                });
            }

            (mod.sessions || []).forEach((s, i) => {
                if (s.videoUrl) {
                    list.push({
                        id: `${mod._id}-session-${s.sessionNumber || i}`,
                        moduleId: mod._id,
                        moduleTitle: mod.artFormName || mod.title,
                        type: s.type,
                        title: s.title,
                        url: s.videoUrl,
                        isLocked,
                        icon: s.type === 'creation' ? <Palette className="w-4 h-4" /> : <Activity className="w-4 h-4" />
                    });
                }
            });

            (mod.liveRecordings || []).forEach((rec, i) => {
                if (rec.videoUrl) {
                    list.push({
                        id: `${mod._id}-live-${i}`,
                        moduleId: mod._id,
                        moduleTitle: mod.artFormName || mod.title,
                        type: 'live-recording',
                        title: rec.title || `Live Recording ${i + 1}`,
                        url: rec.videoUrl,
                        isLocked, // Initially set to baseline program/module lock
                        icon: <Video className="w-4 h-4" />
                    });
                }
            });
        });

        // Enforce sequential locking: Video N is locked if Video N-1 is not completed
        let previousVideoCompleted = true; // The first video is always unlocked (if not otherwise locked by enrollment)
        
        const sequentialList = list.map((video, index) => {
            // Check if this specific video is marked as completed in the backend
            const progressEntry = videoProgress.find(
                vp => String(vp.videoId) === String(video.id) || vp.videoId === video.id
            );
            const isCompleted = !!(progressEntry && progressEntry.completed);

            // Apply sequential lock
            const sequentialLock = !previousVideoCompleted;
            const finalLock = video.isLocked || sequentialLock;

            // Update for the NEXT iteration
            previousVideoCompleted = isCompleted;

            return {
                ...video,
                isLocked: finalLock,
                isCompleted
            };
        });

        return sequentialList;
    }, [program, enrolledModules, user, videoProgress]);

    const activeVideoIndex = playlist.findIndex(v => v.id === activeVideoId);
    const activeVideoInfo = activeVideoIndex >= 0 ? playlist[activeVideoIndex] : null;

    const handleVideoComplete = () => {
        // Mark current video locally as completed so the UI unlocks the next video instantly
        if (activeVideoInfo) {
            setVideoProgress(prev => {
                const exists = prev.find(p => p.videoId === activeVideoInfo.id);
                if (exists) {
                    return prev.map(p => p.videoId === activeVideoInfo.id ? { ...p, completed: true } : p);
                }
                return [...prev, { videoId: activeVideoInfo.id, completed: true }];
            });
        }

        if (activeVideoIndex >= 0 && activeVideoIndex < playlist.length - 1) {
            const nextVideo = playlist[activeVideoIndex + 1];
            // Due to state update timing, nextVideo.isLocked might still be true in this render cycle, 
            // but we know it SHOULD be unlocked because we just finished the prerequisite.
            // However, if it's locked due to enrollment reasons, we shouldn't play it.
            const isEnrolledLocked = program?.modules?.find(m => m._id === nextVideo.moduleId)?.isLocked && !user;
            
            if (!isEnrolledLocked) {
                setSearchParams({ module: nextVideo.moduleId, video: nextVideo.id });
                setExpandedModules(prev => ({ ...prev, [nextVideo.moduleId]: true }));
            }
        }
    };

    const toggleModule = (modId) => {
        setExpandedModules(prev => ({ ...prev, [modId]: !prev[modId] }));
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-heritage-terracotta" />
            </div>
        );
    }

    if (!program) {
        return (
            <div className="min-h-screen bg-heritage-creamLight flex items-center justify-center text-heritage-brown">
                Program not found
            </div>
        );
    }

    return (
        <div className="flex flex-col md:flex-row h-screen bg-white text-heritage-brown pt-16">

            {/* Left/Main Side: Video Player */}
            <div className="flex-1 flex flex-col h-full overflow-y-auto">

                {/* Header */}
                <div className="px-4 py-3 border-b border-gray-200 flex items-center gap-3 bg-white shadow-sm">
                    <Button
                        variant="ghost"
                        className="text-heritage-brown hover:text-heritage-terracotta hover:bg-heritage-cream p-2 h-auto"
                        onClick={() => navigate(`/programs/${slug}`)}
                    >
                        <ArrowLeft className="w-5 h-5 mr-1" /> Back
                    </Button>
                    <div className="h-5 w-px bg-gray-200" />
                    <h1 className="font-heading font-bold text-base text-heritage-terracottaDark hidden md:block truncate">
                        {program.title}
                    </h1>
                </div>

                {/* Player Area */}
                <div className="flex-1 bg-gray-50 flex flex-col items-center justify-center p-6">
                    {activeVideoInfo ? (
                        activeVideoInfo.isLocked ? (
                            <div className="text-center space-y-4 max-w-md mx-auto p-10 border border-gray-200 rounded-2xl bg-white shadow-sm">
                                <div className="w-16 h-16 rounded-full bg-heritage-cream flex items-center justify-center mx-auto">
                                    <Lock className="w-7 h-7 text-heritage-terracotta" />
                                </div>
                                <h3 className="text-xl font-heading font-bold text-heritage-terracottaDark">Module Locked</h3>
                                <p className="text-gray-500 font-body text-sm">
                                    You need to enroll in <span className="font-semibold text-heritage-brown">"{activeVideoInfo.moduleTitle}"</span> to watch this video.
                                </p>
                                <Button variant="gold" onClick={() => navigate(`/programs/${slug}`)}>
                                    Go to Program Page to Enroll
                                </Button>
                            </div>
                        ) : (
                            <div className="w-full max-w-5xl">
                                <div className="aspect-video rounded-xl overflow-hidden shadow-lg border border-gray-200">
                                    <SecureVideoPlayer
                                        videoUrl={activeVideoInfo.url}
                                        videoId={activeVideoInfo.id}
                                        programId={program._id}
                                        moduleTitle={activeVideoInfo.moduleTitle}
                                        onComplete={handleVideoComplete}
                                        className="w-full h-full"
                                    />
                                </div>
                                <div className="mt-5 px-1">
                                    <p className="text-xs font-body text-heritage-terracotta font-semibold uppercase tracking-wider mb-1">
                                        {activeVideoInfo.moduleTitle}
                                    </p>
                                    <h2 className="text-xl font-heading font-bold text-heritage-terracottaDark">
                                        {activeVideoInfo.title}
                                    </h2>
                                    {activeVideoIndex >= 0 && playlist.length > 0 && (
                                        <p className="text-sm text-gray-400 mt-1">
                                            Video {activeVideoIndex + 1} of {playlist.length}
                                        </p>
                                    )}
                                </div>
                            </div>
                        )
                    ) : (
                        <div className="text-center text-gray-400 space-y-3">
                            <div className="w-20 h-20 rounded-full bg-heritage-cream flex items-center justify-center mx-auto">
                                <PlayCircle className="w-10 h-10 text-heritage-terracotta/50" />
                            </div>
                            <p className="font-body text-sm">Select a video from the playlist to start learning.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Right Side: Playlist Sidebar */}
            <div className="w-full md:w-80 lg:w-96 h-full border-l border-gray-200 flex flex-col bg-white">
                {/* Sidebar Header */}
                <div className="px-4 py-4 border-b border-gray-200 bg-heritage-creamLight">
                    <div className="flex items-center gap-2 mb-1">
                        <BookOpen className="w-4 h-4 text-heritage-terracotta" />
                        <h2 className="font-heading font-bold text-sm text-heritage-terracottaDark">Course Curriculum</h2>
                    </div>
                    <p className="text-xs text-gray-400">
                        {playlist.filter(v => !v.isLocked).length} of {playlist.length} videos unlocked
                    </p>
                </div>

                {/* Module + Video List */}
                <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
                    {program.modules.filter(m => m.isActive).map((mod, i) => {
                        const isModEnrolled = enrolledModules.includes(mod._id);
                        const isExpanded = expandedModules[mod._id];
                        const modVideos = playlist.filter(v => v.moduleId === mod._id);
                        // All active modules are accessible to logged-in users
                        const isAccessible = !!user;

                        if (modVideos.length === 0) return null;

                        return (
                            <div key={mod._id}>
                                {/* Module Header Button */}
                                <button
                                    className="w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-gray-50 transition-colors focus:outline-none"
                                    onClick={() => toggleModule(mod._id)}
                                >
                                    <div className="mt-0.5 text-gray-400">
                                        {!isAccessible || mod.isLocked ? (
                                            <Lock className="w-4 h-4 text-gray-300" />
                                        ) : isExpanded ? (
                                            <ChevronUp className="w-4 h-4 text-heritage-terracotta" />
                                        ) : (
                                            <ChevronDown className="w-4 h-4 text-gray-400" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className={`font-heading font-semibold text-sm leading-snug ${
                                            !isAccessible ? 'text-gray-400' : 'text-heritage-terracottaDark'
                                        }`}>
                                            Module {mod.order || i + 1}: {mod.artFormName || mod.title}
                                        </h3>
                                        <p className="text-xs text-gray-400 mt-0.5">{modVideos.length} items</p>
                                    </div>
                                </button>

                                {/* Videos inside module */}
                                {isExpanded && (
                                    <div className="bg-gray-50/70 border-t border-gray-100">
                                        {modVideos.map((video) => {
                                            const isActive = activeVideoId === video.id;
                                            return (
                                                <button
                                                    key={video.id}
                                                    disabled={video.isLocked}
                                                    className={`w-full text-left pl-10 pr-4 py-2.5 flex items-center gap-3 transition-colors border-l-2 ${
                                                        isActive
                                                            ? 'bg-heritage-terracotta/5 border-heritage-terracotta'
                                                            : 'border-transparent hover:bg-white'
                                                    } ${video.isLocked ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
                                                    onClick={() => {
                                                        if (!video.isLocked) {
                                                            setSearchParams({ module: mod._id, video: video.id });
                                                        }
                                                    }}
                                                >
                                                    <div className={`shrink-0 ${isActive ? 'text-heritage-terracotta' : 'text-gray-400'}`}>
                                                        {video.isLocked ? <Lock className="w-3.5 h-3.5" /> : video.icon}
                                                    </div>
                                                    <p className={`text-sm font-body leading-snug ${
                                                        isActive ? 'text-heritage-terracottaDark font-semibold' : 'text-gray-600'
                                                    }`}>
                                                        {video.title}
                                                    </p>
                                                    {isActive && (
                                                        <PlayCircle className="w-4 h-4 text-heritage-terracotta ml-auto shrink-0" />
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
