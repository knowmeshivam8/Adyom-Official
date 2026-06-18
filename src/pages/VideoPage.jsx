import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { VideoPageSkeleton } from '@/components/ui/page-skeletons';
import {
    ArrowLeft, Calendar, User, Eye, Clock, Tag, AlertTriangle,
    Play, Pause, Maximize, Volume2, VolumeX,
} from 'lucide-react';
import { videoAPI } from '@/api';

const fadeInUp = { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6 } };

const categoryLabels = {
    tutorial: 'Tutorial',
    lecture: 'Lecture',
    workshop: 'Workshop',
    documentary: 'Documentary',
    other: 'Other',
};

function formatDate(dateStr) {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
}

function formatViews(views) {
    if (!views) return '0';
    if (views >= 1000) return `${(views / 1000).toFixed(1)}k`;
    return String(views);
}

function formatDuration(seconds) {
    if (!seconds) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
}

/**
 * PublicVideoPlayer — A public-facing video player with basic protections
 * (no download, no right-click, no PiP) but without progress tracking.
 */
function PublicVideoPlayer({ videoUrl, poster, title }) {
    const videoRef = useRef(null);
    const [playing, setPlaying] = useState(false);
    const [muted, setMuted] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [showControls, setShowControls] = useState(true);
    const hideTimer = useRef(null);
    const [error, setError] = useState(false);

    const togglePlay = () => {
        if (!videoRef.current) return;
        if (videoRef.current.paused) {
            videoRef.current.play();
            setPlaying(true);
        } else {
            videoRef.current.pause();
            setPlaying(false);
        }
    };

    const toggleMute = () => {
        if (!videoRef.current) return;
        videoRef.current.muted = !videoRef.current.muted;
        setMuted(videoRef.current.muted);
    };

    const toggleFullscreen = () => {
        if (!videoRef.current) return;
        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else {
            videoRef.current.requestFullscreen();
        }
    };

    const handleTimeUpdate = () => {
        if (videoRef.current) setCurrentTime(videoRef.current.currentTime);
    };

    const handleLoadedMetadata = () => {
        if (videoRef.current) setDuration(videoRef.current.duration);
    };

    const handleSeek = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const ratio = (e.clientX - rect.left) / rect.width;
        if (videoRef.current && duration) {
            videoRef.current.currentTime = ratio * duration;
        }
    };

    const handleMouseMove = () => {
        setShowControls(true);
        clearTimeout(hideTimer.current);
        hideTimer.current = setTimeout(() => {
            if (playing) setShowControls(false);
        }, 3000);
    };

    useEffect(() => {
        return () => clearTimeout(hideTimer.current);
    }, []);

    if (error) {
        return (
            <div className="aspect-video bg-black flex items-center justify-center rounded-xl">
                <div className="text-center text-white/60">
                    <AlertTriangle className="w-12 h-12 mx-auto mb-3 text-amber-400" />
                    <p className="text-sm">Unable to load video</p>
                    <p className="text-xs mt-1 text-white/40">The video source may be unavailable</p>
                </div>
            </div>
        );
    }

    return (
        <div
            className="relative aspect-video bg-black rounded-xl overflow-hidden group"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => playing && setShowControls(false)}
        >
            <video
                ref={videoRef}
                src={videoUrl}
                poster={poster}
                className="w-full h-full object-contain"
                controlsList="nodownload noplaybackrate nofullscreen"
                disablePictureInPicture
                onContextMenu={(e) => e.preventDefault()}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
                onEnded={() => setPlaying(false)}
                onError={() => setError(true)}
                onClick={togglePlay}
                playsInline
            />

            {/* Big play button overlay when paused */}
            {!playing && !error && (
                <div
                    className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer"
                    onClick={togglePlay}
                >
                    <div className="w-16 h-16 rounded-full bg-amber-500/90 flex items-center justify-center hover:bg-amber-400 transition-colors">
                        <Play className="w-7 h-7 text-black ml-1" />
                    </div>
                </div>
            )}

            {/* Custom controls bar */}
            <div
                className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4 transition-opacity duration-300 ${showControls || !playing ? 'opacity-100' : 'opacity-0'
                    }`}
            >
                {/* Progress bar */}
                <div
                    className="w-full h-1 bg-white/20 rounded-full mb-3 cursor-pointer group/progress"
                    onClick={handleSeek}
                >
                    <div
                        className="h-full bg-amber-500 rounded-full relative"
                        style={{ width: duration > 0 ? `${(currentTime / duration) * 100}%` : '0%' }}
                    >
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-amber-400 rounded-full opacity-0 group-hover/progress:opacity-100 transition-opacity" />
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button onClick={togglePlay} className="text-white hover:text-amber-400 transition-colors">
                            {playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                        </button>
                        <button onClick={toggleMute} className="text-white hover:text-amber-400 transition-colors">
                            {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                        </button>
                        <span className="text-white/70 text-xs font-mono">
                            {formatDuration(currentTime)} / {formatDuration(duration)}
                        </span>
                    </div>
                    <button onClick={toggleFullscreen} className="text-white hover:text-amber-400 transition-colors">
                        <Maximize className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function VideoPage() {
    const { id } = useParams();
    const [video, setVideo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchVideo = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await videoAPI.getById(id);
                setVideo(res.data.data);
            } catch (err) {
                if (err.response?.status === 404) {
                    setError('Video not found');
                } else if (err.response?.status === 400) {
                    setError('Invalid video ID');
                } else {
                    setError('Failed to load video. Please try again later.');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchVideo();
    }, [id]);

    // Loading state
    if (loading) {
        return <VideoPageSkeleton variant="dark" />;
    }

    // Error state
    if (error || !video) {
        return (
            <div className="min-h-screen bg-[#0A0A0A]">
                <div className="max-w-4xl mx-auto px-4 py-20 text-center">
                    <motion.div {...fadeInUp}>
                        <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-amber-400" />
                        <h1 className="text-3xl font-bold text-white mb-3">Video Unavailable</h1>
                        <p className="text-white/60 mb-8">{error || 'This video could not be found.'}</p>
                        <Link to="/">
                            <Button variant="gold" size="lg">
                                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0A0A0A]">
            {/* Back link */}
            <div className="max-w-5xl mx-auto px-4 pt-6">
                <Link
                    to="/"
                    className="inline-flex items-center text-white/50 hover:text-amber-400 transition-colors text-sm"
                >
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back to Home
                </Link>
            </div>

            {/* Video Player */}
            <motion.div className="max-w-5xl mx-auto px-4 py-6" {...fadeInUp}>
                <PublicVideoPlayer
                    videoUrl={`/api/videos/stream/${video._id}`}
                    poster={video.thumbnail}
                    title={video.title}
                />
            </motion.div>

            {/* Video Info */}
            <motion.div
                className="max-w-5xl mx-auto px-4 pb-16"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
            >
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                    <div className="flex-1">
                        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{video.title}</h1>
                        <div className="flex flex-wrap items-center gap-3 text-white/50 text-sm">
                            {video.submitterName && (
                                <span className="flex items-center gap-1">
                                    <User className="w-3.5 h-3.5" />
                                    {video.submitterName}
                                </span>
                            )}
                            {video.createdAt && (
                                <span className="flex items-center gap-1">
                                    <Calendar className="w-3.5 h-3.5" />
                                    {formatDate(video.createdAt)}
                                </span>
                            )}
                            <span className="flex items-center gap-1">
                                <Eye className="w-3.5 h-3.5" />
                                {formatViews(video.views)} views
                            </span>
                            {video.duration && (
                                <span className="flex items-center gap-1">
                                    <Clock className="w-3.5 h-3.5" />
                                    {video.duration}
                                </span>
                            )}
                        </div>
                    </div>
                    {video.category && categoryLabels[video.category] && (
                        <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20">
                            <Tag className="w-3 h-3 mr-1" />
                            {categoryLabels[video.category]}
                        </Badge>
                    )}
                </div>

                {video.description && (
                    <>
                        <Separator className="my-5 bg-white/10" />
                        <p className="text-white/70 leading-relaxed whitespace-pre-line">{video.description}</p>
                    </>
                )}

                {/* Platform info */}
                {video.platform && video.platform !== 'other' && (
                    <p className="text-white/40 text-sm mt-4">
                        Platform: <span className="capitalize">{video.platform}</span>
                    </p>
                )}
            </motion.div>
        </div>
    );
}
