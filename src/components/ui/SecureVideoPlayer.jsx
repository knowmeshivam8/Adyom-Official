import { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Maximize, Volume2, VolumeX, Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { learningAPI } from '@/api';

/**
 * SecureVideoPlayer — A protected video player component that:
 *  - Disables right-click context menu
 *  - Uses controlsList="nodownload" to prevent browser download
 *  - Disables picture-in-picture and other sensitive features
 *  - Tracks video progress via the backend API
 *  - Supports resume from last position
 *
 * Props:
 *  - videoUrl: string (required) — the video source URL
 *  - videoId: string (required) — MongoDB ObjectId of the video
 *  - programId: string (required) — the enrolled program's ID
 *  - moduleTitle: string — display title for progress tracking
 *  - sessionIndex: number — session index within the module
 *  - poster: string — optional poster/thumbnail image
 *  - onComplete: () => void — callback when video finishes
 *  - className: string — additional CSS classes
 */
export default function SecureVideoPlayer({
    videoUrl,
    videoId,
    programId,
    moduleTitle = '',
    sessionIndex = 0,
    poster,
    onComplete,
    className = '',
}) {
    const videoRef = useRef(null);
    const containerRef = useRef(null);
    const progressTimer = useRef(null);

    const [playing, setPlaying] = useState(false);
    const [muted, setMuted] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(null);
    const [buffered, setBuffered] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const [completed, setCompleted] = useState(false);
    const [resumePosition, setResumePosition] = useState(0);
    const [resumeLoaded, setResumeLoaded] = useState(false);
    const hideControlsTimer = useRef(null);

    // Fetch the last saved position on mount
    useEffect(() => {
        if (!videoId || !programId) return;
        const fetchProgress = async () => {
            try {
                const res = await learningAPI.getVideoProgress(programId);
                const data = res.data?.data;
                if (data?.videoProgress) {
                    const entry = data.videoProgress.find(
                        (vp) => String(vp.videoId) === String(videoId) || vp.videoId === videoId
                    );
                    if (entry && !entry.completed && entry.lastPosition > 0) {
                        setResumePosition(entry.lastPosition);
                    }
                }
            } catch (err) {
                // Silently fail — start from beginning
                console.log('Could not fetch resume position:', err.message);
            } finally {
                setResumeLoaded(true);
            }
        };
        fetchProgress();
    }, [videoId, programId]);

    // Apply resume position once video metadata is loaded
    useEffect(() => {
        if (resumeLoaded && resumePosition > 0 && videoRef.current && duration > 0) {
            videoRef.current.currentTime = resumePosition;
            setResumePosition(0); // only apply once
        }
    }, [resumeLoaded, resumePosition, duration]);

    // Cleanup timer on unmount
    useEffect(() => {
        return () => {
            if (progressTimer.current) clearInterval(progressTimer.current);
            if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current);
        };
    }, []);

    // Listen for fullscreen changes
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    // Report progress every 10 seconds
    const startProgressReporting = useCallback(() => {
        if (progressTimer.current) clearInterval(progressTimer.current);
        progressTimer.current = setInterval(() => {
            if (videoRef.current && !videoRef.current.paused) {
                reportProgress(videoRef.current.currentTime);
            }
        }, 10000);
    }, [videoId, programId, moduleTitle, sessionIndex]);

    const stopProgressReporting = useCallback(() => {
        if (progressTimer.current) {
            clearInterval(progressTimer.current);
            progressTimer.current = null;
        }
    }, []);

    const reportProgress = async (position) => {
        if (!videoId || !programId) return;
        try {
            await learningAPI.markVideoProgress({
                videoId,
                programId,
                moduleTitle,
                sessionIndex,
                lastPosition: Math.floor(position),
                completed: false,
            });
        } catch (err) {
            console.log('Failed to report progress:', err.message);
        }
    };

    const handlePlay = () => {
        if (videoRef.current) {
            videoRef.current.play();
            setPlaying(true);
            startProgressReporting();
        }
    };

    const handlePause = () => {
        if (videoRef.current) {
            videoRef.current.pause();
            setPlaying(false);
            stopProgressReporting();
            // Save position on pause
            reportProgress(videoRef.current.currentTime);
        }
    };

    const handleVideoEnded = async () => {
        setPlaying(false);
        setCompleted(true);
        stopProgressReporting();
        // Mark video as completed
        if (videoId && programId) {
            try {
                await learningAPI.markVideoProgress({
                    videoId,
                    programId,
                    moduleTitle,
                    sessionIndex,
                    lastPosition: Math.floor(duration),
                    completed: true,
                });
            } catch (err) {
                console.log('Failed to mark video complete:', err.message);
            }
        }
        if (onComplete) onComplete();
    };

    const handleLoadedMetadata = () => {
        if (videoRef.current) {
            setDuration(videoRef.current.duration);
            setLoaded(true);
        }
    };

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            setCurrentTime(videoRef.current.currentTime);
            // Update buffered
            if (videoRef.current.buffered.length > 0) {
                const end = videoRef.current.buffered.end(videoRef.current.buffered.length - 1);
                setBuffered((end / duration) * 100 || 0);
            }
        }
    };

    const handleError = () => {
        setError('Failed to load video. The video may be unavailable or you may not have permission to view it.');
        setLoaded(false);
    };

    const handleSeek = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const ratio = (e.clientX - rect.left) / rect.width;
        const newTime = ratio * duration;
        if (videoRef.current) {
            videoRef.current.currentTime = newTime;
            setCurrentTime(newTime);
        }
    };

    const toggleFullscreen = () => {
        if (!containerRef.current) return;
        if (!document.fullscreenElement) {
            containerRef.current.requestFullscreen().catch(() => { });
        } else {
            document.exitFullscreen().catch(() => { });
        }
    };

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !videoRef.current.muted;
            setMuted(videoRef.current.muted);
        }
    };

    const handleMouseMove = () => {
        setShowControls(true);
        if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current);
        hideControlsTimer.current = setTimeout(() => {
            if (playing) setShowControls(false);
        }, 3000);
    };

    const formatTime = (seconds) => {
        if (!seconds || isNaN(seconds)) return '0:00';
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div
            ref={containerRef}
            className={`relative bg-black rounded-lg overflow-hidden group ${className}`}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => playing && setShowControls(false)}
            onContextMenu={(e) => e.preventDefault()}
        >
            {/* Video Element */}
            <video
                ref={videoRef}
                src={videoUrl}
                poster={poster}
                className="w-full h-full object-contain"
                controlsList="nodownload noplaybackrate nofullscreen"
                disablePictureInPicture
                onContextMenu={(e) => e.preventDefault()}
                onLoadedMetadata={handleLoadedMetadata}
                onTimeUpdate={handleTimeUpdate}
                onEnded={handleVideoEnded}
                onError={handleError}
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
                playsInline
                preload="metadata"
            />

            {/* Loading Spinner */}
            {!loaded && !error && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                    <Loader2 className="w-8 h-8 animate-spin text-white" />
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                    <div className="text-center text-white space-y-3 p-6">
                        <AlertTriangle className="w-10 h-10 mx-auto text-yellow-400" />
                        <p className="text-sm">{error}</p>
                    </div>
                </div>
            )}

            {/* Resume Overlay */}
            {resumePosition > 0 && loaded && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 flex items-center justify-center bg-black/60"
                >
                    <div className="text-center text-white space-y-3">
                        <p className="text-sm">Resume from {formatTime(resumePosition)}?</p>
                        <div className="flex gap-2 justify-center">
                            <Button
                                size="sm"
                                variant="gold"
                                onClick={() => {
                                    setResumePosition(0);
                                    handlePlay();
                                }}
                            >
                                Start Over
                            </Button>
                            <Button
                                size="sm"
                                onClick={() => {
                                    if (videoRef.current && resumePosition > 0) {
                                        videoRef.current.currentTime = resumePosition;
                                    }
                                    setResumePosition(0);
                                    handlePlay();
                                }}
                            >
                                Resume
                            </Button>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Center Play Button (when paused) */}
            {!playing && !error && loaded && resumePosition === 0 && (
                <button
                    onClick={handlePlay}
                    className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors"
                    aria-label="Play video"
                >
                    <div className="w-16 h-16 rounded-full bg-heritage-gold/90 flex items-center justify-center hover:bg-heritage-gold transition-colors shadow-lg">
                        <Play className="w-7 h-7 text-white ml-1" />
                    </div>
                </button>
            )}

            {/* Completed Overlay */}
            {completed && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                    <div className="text-center text-white space-y-2">
                        <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center mx-auto">
                            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <p className="font-semibold">Video Completed</p>
                        <Button
                            size="sm"
                            variant="outline"
                            className="border-white/30 text-white hover:bg-white/10"
                            onClick={() => {
                                setCompleted(false);
                                if (videoRef.current) {
                                    videoRef.current.currentTime = 0;
                                    setCurrentTime(0);
                                }
                            }}
                        >
                            Watch Again
                        </Button>
                    </div>
                </div>
            )}

            {/* Bottom Controls Bar */}
            {loaded && !error && (
                <div
                    className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-3 transition-opacity duration-300 ${showControls || !playing ? 'opacity-100' : 'opacity-0'
                        }`}
                >
                    {/* Progress Bar */}
                    <div
                        className="w-full h-1 bg-white/30 rounded-full cursor-pointer mb-2 group/progress hover:h-1.5 transition-all"
                        onClick={handleSeek}
                    >
                        <div className="h-full rounded-full bg-heritage-gold relative" style={{ width: `${(currentTime / duration) * 100 || 0}%` }}>
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-heritage-gold opacity-0 group-hover/progress:opacity-100 transition-opacity" />
                        </div>
                        {/* Buffered indicator */}
                        <div
                            className="absolute top-0 left-0 h-full bg-white/10 rounded-full pointer-events-none"
                            style={{ width: `${buffered}%` }}
                        />
                    </div>

                    {/* Controls Row */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <button
                                onClick={playing ? handlePause : handlePlay}
                                className="text-white hover:text-heritage-gold transition-colors"
                                aria-label={playing ? 'Pause' : 'Play'}
                            >
                                {playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                            </button>
                            <button
                                onClick={toggleMute}
                                className="text-white hover:text-heritage-gold transition-colors"
                                aria-label={muted ? 'Unmute' : 'Mute'}
                            >
                                {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                            </button>
                            <span className="text-white text-xs ml-1">
                                {formatTime(currentTime)} / {formatTime(duration)}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={toggleFullscreen}
                                className="text-white hover:text-heritage-gold transition-colors"
                                aria-label="Toggle fullscreen"
                            >
                                <Maximize className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}