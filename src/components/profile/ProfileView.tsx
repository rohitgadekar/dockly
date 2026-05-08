import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { formatDistanceToNow } from "date-fns";
import {
    ShoppingBag,
    Zap,
    ArrowUpRight,
    Play,
    Pause,
    Radio,
    X,
    Clock,
    Volume2,
    VolumeX,
    Maximize,
    Minimize,
    ExternalLink,
    Loader2,
    Mail
} from "lucide-react";
import { MdVerified } from "react-icons/md";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { InquiryForm } from "@/components/profile/InquiryForm";
import { CiCircleCheck } from "react-icons/ci";
import {
    SiTidal,
    SiSpotify,
    SiApplemusic,
    SiOnlyfans
} from "react-icons/si";
import {
    FaTwitter,
    FaGithub,
    FaLinkedin,
    FaYoutube,
    FaTwitch,
    FaTiktok,
    FaDiscord,
    FaPlaystation,
    FaSnapchat,
    FaMedium,
    FaReddit,
    FaPatreon,
    FaGlobe,
    FaInstagram
} from "react-icons/fa";
import QRCodeStyling from "qr-code-styling";


declare global {
    interface Window {
        YT: any;
        onYouTubeIframeAPIReady: (() => void) | undefined;
    }
    interface ImportMeta {
        env: {
            [key: string]: string | undefined;
        };
    }
}

const PremiumQR = ({ url }: { url: string }) => {
    const qrRef = useRef<HTMLDivElement>(null);
    const qrCode = useRef<QRCodeStyling | null>(null);

    useEffect(() => {
        qrCode.current = new QRCodeStyling({
            width: 400,
            height: 400,
            data: url,
            margin: 12,
            qrOptions: {
                typeNumber: 0,
                mode: 'Byte',
                errorCorrectionLevel: 'H'
            },
            dotsOptions: {
                type: 'classy-rounded',
                color: 'rgba(255,255,255,0.3)',
            },
            backgroundOptions: {
                color: 'transparent',
            },
            cornersSquareOptions: {
                type: 'extra-rounded',
                color: 'rgba(255,255,255,0.3)',
            },
            cornersDotOptions: {
                type: 'dot',
                color: 'rgba(255,255,255,0.3)',
            }
        });

        if (qrRef.current) {
            qrRef.current.innerHTML = '';
            qrCode.current.append(qrRef.current);
        }
    }, [url]);

    return (
        <div className="relative group/qr">
            <div className="absolute -inset-1  rounded-xl blur-md opacity-0 group-hover/qr:opacity-100 transition-opacity duration-500" />
            <div
                ref={qrRef}
                className="relative w-20 h-20 rounded-xl flex items-center justify-center overflow-hidden [&>canvas]:w-full [&>canvas]:h-full"
            />
        </div>
    );
};

const platformIcons: Record<string, any> = {
    Twitter: FaTwitter,
    GitHub: FaGithub,
    LinkedIn: FaLinkedin,
    YouTube: FaYoutube,
    Twitch: FaTwitch,
    TikTok: FaTiktok,
    Discord: FaDiscord,
    Spotify: SiSpotify,
    "Apple Music": SiApplemusic,
    Tidal: SiTidal,
    PlayStation: FaPlaystation,
    OnlyFans: SiOnlyfans,
    Snapchat: FaSnapchat,
    Medium: FaMedium,
    Reddit: FaReddit,
    Patreon: FaPatreon,
    Instagram: FaInstagram,
    Personal: FaGlobe,
    Default: FaGlobe
};

interface ProfileViewProps {
    user: any;
    onLinkClick?: (linkType: string, linkId: string, linkUrl: string) => void;
    isPreview?: boolean;
}

export const ProfileView = ({ user, onLinkClick, isPreview = false }: ProfileViewProps) => {
    const [playingPreview, setPlayingPreview] = useState<string | null>(null);
    const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
    const [isStoryViewerOpen, setIsStoryViewerOpen] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [currentDuration, setCurrentDuration] = useState<number | null>(null);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [ytVideos, setYtVideos] = useState<any[]>([]);
    const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

    // Custom Player States
    const [player, setPlayer] = useState<any>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isPlayerMuted, setIsPlayerMuted] = useState(false);
    const [isScrubbing, setIsScrubbing] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const playerContainerRef = useRef<HTMLDivElement>(null);

    // Newsletter State
    const [subscriberEmail, setSubscriberEmail] = useState("");
    const [subscriberName, setSubscriberName] = useState("");
    const [isSubscribing, setIsSubscribing] = useState(false);
    const [subscribed, setSubscribed] = useState(false);

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!subscriberEmail || !subscriberName) return;

        setIsSubscribing(true);
        try {
            const { error } = await supabase.from('newsletter_subscribers').insert({
                profile_id: user.id,
                email: subscriberEmail,
                name: subscriberName
            });

            if (error) {
                if (error.code === '23505') {
                    toast.error("You are already subscribed to this dossier.");
                } else {
                    throw error;
                }
            } else {
                toast.success("Access Granted. You are on the list.");
                setSubscribed(true);
                setSubscriberEmail("");
                setSubscriberName("");
            }
        } catch (error) {
            console.error("Subscription error:", error);
            toast.error("Transmission failed. Please retry.");
        } finally {
            setIsSubscribing(false);
        }
    };


    const getInitials = (name: string) => {
        if (!name) return "??";
        const parts = name.trim().split(/\s+/);
        if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    };

    const handleNextStory = () => {
        setActiveStoryIndex((prev) => {
            const current = prev ?? 0;
            if (current < (user.stories?.length || 0) - 1) {
                return current + 1;
            }
            setIsStoryViewerOpen(false);
            return null;
        });
    };

    const audioRef = useRef(new Audio());
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.muted = isMuted;
        }
    }, [isMuted, activeStoryIndex, isStoryViewerOpen]);


    const togglePreview = (url: string | null) => {
        if (!url) return;
        const audio = audioRef.current;

        if (playingPreview === url) {
            audio.pause();
            setPlayingPreview(null);
        } else {
            audio.src = url;
            audio.play();
            setPlayingPreview(url);
            audio.onended = () => setPlayingPreview(null);
        }
    };

    const handleLinkClick = (linkType: string, linkId: string, linkUrl: string) => {
        if (onLinkClick) {
            onLinkClick(linkType, linkId, linkUrl);
        } else if (!isPreview) {
            window.open(linkUrl, '_blank');
        }
    };


    useEffect(() => {
        if (!isStoryViewerOpen || !user.stories) return;

        if (activeStoryIndex === null) {
            setActiveStoryIndex(0);
            return;
        }

        const currentStory = user.stories[activeStoryIndex];
        // Reset duration when story changes to prevent stale timing
        if (currentStory?.media_type === 'image') {
            setCurrentDuration(5000);
            const timer = setTimeout(handleNextStory, 5000);
            return () => clearTimeout(timer);
        } else {
            // For video, wait for metadata loaded to set duration
            setCurrentDuration(null);
        }
    }, [isStoryViewerOpen, activeStoryIndex, user.stories]);

    const theme = user.theme?.id ? user.theme : {
        id: "royale",
        primary: user.theme?.primary || "#D4AF37",
        bg: "#050505",
        font: "Syncopate"
    };

    const isLight = theme.id === "etheric" || theme.id === "ivory";
    const textPrimary = isLight ? "#1E293B" : "#FFFFFF";
    const textMuted = isLight ? "#94A3B8" : "rgba(255,255,255,0.3)";
    const cardBorder = isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.04)";

    useEffect(() => {
        if (isPreview) return;

        // Update theme-color meta tag for mobile browser status bar
        let meta = document.querySelector('meta[name="theme-color"]');
        if (!meta) {
            meta = document.createElement('meta');
            meta.setAttribute('name', 'theme-color');
            document.head.appendChild(meta);
        }
        meta.setAttribute('content', theme.bg);

        // Also update apple-mobile-web-app-status-bar-style
        let appleMeta = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
        if (!appleMeta) {
            appleMeta = document.createElement('meta');
            appleMeta.setAttribute('name', 'apple-mobile-web-app-status-bar-style');
            document.head.appendChild(appleMeta);
        }
        appleMeta.setAttribute('content', isLight ? 'default' : 'black-translucent');

        return () => {
            meta?.setAttribute('content', '#050505');
        };
    }, [theme.bg, isLight, isPreview]);

    useEffect(() => {
        if (user.youtube_channel_id) {
            const fetchYT = async () => {
                const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

                if (!API_KEY) {
                    console.warn("YouTube API Key missing. Please add VITE_YOUTUBE_API_KEY to your .env file.");
                    return;
                }

                const CACHE_KEY = `yt_videos_v2_${user.youtube_channel_id}`;
                const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

                // 1. Check Video Cache
                try {
                    const cachedData = localStorage.getItem(CACHE_KEY);
                    if (cachedData) {
                        const { timestamp, data } = JSON.parse(cachedData);
                        if (Date.now() - timestamp < CACHE_DURATION) {
                            setYtVideos(data);
                            return;
                        }
                    }
                } catch (e) {
                    // Ignore cache errors
                }

                let channelId = user.youtube_channel_id;

                try {
                    // 2. Resolve Handle/URL to Channel ID if necessary
                    if (channelId.includes('@') || channelId.includes('youtube.com') || !channelId.startsWith('UC')) {
                        const RESOLVED_ID_KEY = `yt_resolved_id_${user.youtube_channel_id}`;
                        const cachedId = localStorage.getItem(RESOLVED_ID_KEY);

                        if (cachedId) {
                            channelId = cachedId;
                        } else {
                            let handle = '';
                            if (channelId.includes('@')) {
                                handle = channelId.split('@')[1].split('/')[0].split('?')[0];
                            } else if (channelId.includes('youtube.com/c/')) {
                                handle = channelId.split('/c/')[1].split('/')[0].split('?')[0];
                            } else if (channelId.includes('youtube.com/')) {
                                const parts = channelId.split('/');
                                const lastPart = parts[parts.length - 1].replace('@', '').split('?')[0];
                                if (lastPart.startsWith('UC')) {
                                    channelId = lastPart;
                                } else {
                                    handle = lastPart;
                                }
                            } else if (!channelId.startsWith('UC')) {
                                handle = channelId.replace('@', '');
                            }

                            if (handle && !channelId.startsWith('UC')) {
                                // Search for channel by handle/name (Costly: 100 units, but only once due to caching)
                                const searchRes = await fetch(
                                    `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${handle}&type=channel&key=${API_KEY}`
                                );
                                const searchData = await searchRes.json();
                                if (searchData.items?.[0]?.id?.channelId) {
                                    channelId = searchData.items[0].id.channelId;
                                    localStorage.setItem(RESOLVED_ID_KEY, channelId);
                                }
                            }
                        }
                    }

                    // 3. Fetch Latest Videos via Official API (Optimized: 2 units cost)
                    if (channelId.startsWith('UC')) {
                        // Get Uploads Content Details (Cost: 1 unit)
                        const channelRes = await fetch(
                            `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channelId}&key=${API_KEY}`
                        );
                        const channelData = await channelRes.json();

                        if (channelData.error) {
                            console.error("YouTube API Error (Channel):", channelData.error.message);
                            return;
                        }

                        const uploadsId = channelData.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;

                        if (uploadsId) {
                            // Get Playlist Items (Cost: 1 unit)
                            const videoRes = await fetch(
                                `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsId}&maxResults=6&key=${API_KEY}`
                            );
                            const videoData = await videoRes.json();

                            if (videoData.items) {
                                const decodeHTML = (html: string) => {
                                    const txt = document.createElement("textarea");
                                    txt.innerHTML = html;
                                    return txt.value;
                                };

                                const videos = videoData.items.map((item: any) => ({
                                    id: item.snippet.resourceId.videoId,
                                    title: decodeHTML(item.snippet.title),
                                    link: `https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`,
                                    thumbnail: item.snippet.thumbnails?.maxres?.url || item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.medium?.url,
                                    published: item.snippet.publishedAt
                                }));
                                setYtVideos(videos);

                                // Cache the result
                                localStorage.setItem(CACHE_KEY, JSON.stringify({
                                    timestamp: Date.now(),
                                    data: videos
                                }));
                            } else if (videoData.error) {
                                console.error("YouTube API Error (Playlist):", videoData.error.message);
                            }
                        }
                    }
                } catch (error) {
                    console.error("YouTube Logic Error:", error);
                }
            };
            fetchYT();
        }
    }, [user.youtube_channel_id]);

    // Cinema Player Logic
    useEffect(() => {
        if (!activeVideoId) return;

        // Load YouTube API if not already exists
        if (!(window as any).YT) {
            const tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
        }

        const onPlayerReady = (event: any) => {
            setPlayer(event.target);
            setDuration(event.target.getDuration());
            // Force maximum fidelity protocol
            if (event.target.setPlaybackQuality) {
                event.target.setPlaybackQuality('highres');
            }
            event.target.playVideo();
        };

        const onPlayerStateChange = (event: any) => {
            // 1: Playing, 2: Paused
            setIsPlaying(event.data === 1);
        };

        const initPlayer = () => {
            new (window as any).YT.Player(`youtube-player-active-viewport`, { // Changed ID here
                height: '100%',
                width: '100%',
                videoId: activeVideoId,
                playerVars: {
                    autoplay: 1,
                    controls: 0,
                    modestbranding: 1,
                    rel: 0,
                    showinfo: 0,
                    iv_load_policy: 3,
                    playsinline: 1,
                    disablekb: 1,
                    fs: 0,
                    autohide: 1
                },
                events: {
                    'onReady': onPlayerReady,
                    'onStateChange': onPlayerStateChange
                }
            });
        };

        if ((window as any).YT && (window as any).YT.Player) {
            initPlayer();
        } else {
            (window as any).onYouTubeIframeAPIReady = initPlayer;
        }

        return () => {
            if (player) {
                player.destroy();
                setPlayer(null);
            }
        };
    }, [activeVideoId]);

    // Time Tracking Loop - High frequency for luxury fluidity
    useEffect(() => {
        let interval: any;
        if (player && isPlaying && !isScrubbing) {
            interval = window.setInterval(() => {
                setCurrentTime(player.getCurrentTime());
            }, 100); // 100ms for smoother progress
        }
        return () => {
            if (interval !== undefined) {
                window.clearInterval(interval);
            }
        };
    }, [player, isPlaying, isScrubbing]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleScrub = (e: React.ChangeEvent<HTMLInputElement>) => {
        const time = parseFloat(e.target.value);
        setCurrentTime(time);
        if (player) {
            player.seekTo(time, true);
        }
    };

    const toggleFullscreen = () => {
        if (!playerContainerRef.current) return;

        if (!document.fullscreenElement) {
            playerContainerRef.current.requestFullscreen().catch((err) => {
                console.error(`Error attempting to enable fullscreen: ${err.message}`);
            });
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    // Listen for fullscreen changes (e.g., via ESC key)
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);


    return (
        <>

            <div
                className={cn(
                    "min-h-screen flex flex-col items-center relative transition-colors duration-1000 overflow-x-hidden pt-[env(safe-area-inset-top)]",
                    isPreview
                        ? "rounded-none shadow-none scale-[0.85] origin-top w-[118%] h-[120%] -ml-[9%] pt-12"
                        : "pt-16 md:pt-32 pb-20 md:pb-40 px-4 md:px-6"
                )}
                style={{
                    backgroundColor: theme.bg,
                    color: textPrimary,
                    fontFamily: `${theme.font}, sans-serif`
                }}
            >
                {/* Ultra-Luxury Atmospheric Layer */}
                <div className="fixed inset-0 pointer-events-none z-0">
                    <div className="absolute inset-0 noise opacity-[0.03] mix-blend-overlay" />
                    <div className="absolute inset-0">
                        {theme.id === "royale" && (
                            <>
                                <div className="absolute top-[-10%] right-[-5%] w-[80vw] h-[80vw] bg-luxury-gold/[0.07] blur-[180px] rounded-full animate-pulse" style={{ animationDuration: '8s' }} />
                                <div className="absolute bottom-[-15%] left-[-10%] w-[90vw] h-[90vw] bg-white/[0.03] blur-[220px] rounded-full animate-pulse" style={{ animationDuration: '12s' }} />
                            </>
                        )}
                        {theme.id === "etheric" && (
                            <div className="absolute inset-0 bg-gradient-to-tr from-blue-50/20 via-white/40 to-purple-50/20" />
                        )}
                        {theme.id === "emerald" && (
                            <>
                                <div className="absolute top-[-10%] left-[-5%] w-[70vw] h-[70vw] bg-emerald-500/[0.05] blur-[150px] rounded-full animate-pulse" style={{ animationDuration: '10s' }} />
                                <div className="absolute bottom-[-10%] right-[-5%] w-[60vw] h-[60vw] bg-luxury-gold/[0.03] blur-[120px] rounded-full" />
                            </>
                        )}
                        {theme.id === "velvet" && (
                            <>
                                <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 to-transparent" />
                                <div className="absolute top-[20%] right-[10%] w-[50vw] h-[50vw] bg-purple-500/[0.05] blur-[180px] rounded-full animate-float" />
                            </>
                        )}
                        {theme.id === "champagne" && (
                            <>
                                <div className="absolute top-[-20%] left-[10%] w-[80vw] h-[80vw] bg-white/[0.02] blur-[200px] rounded-full" />
                                <div className="absolute bottom-[10%] right-[20%] w-[40vw] h-[40vw] bg-luxury-gold/[0.03] blur-[150px] rounded-full animate-pulse" />
                            </>
                        )}
                        {theme.id === "ivory" && (
                            <>
                                <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 via-transparent to-amber-100/30" />
                                <div className="absolute top-[10%] left-[5%] w-[60vw] h-[60vw] bg-amber-900/[0.03] blur-[120px] rounded-full" />
                            </>
                        )}
                    </div>
                </div>

                {/* Content Container */}
                <div className="w-full max-w-5xl relative z-10 flex flex-col items-center">
                    {/* Hero Profile Section */}
                    <div className="relative mb-12 md:mb-24 flex flex-col items-center">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8 }}
                            className="relative group z-10"
                            onClick={() => user.stories?.length > 0 && setIsStoryViewerOpen(true)}
                        >
                            {/* Architectural Frame & Story Ring */}
                            {user.stories?.length > 0 && (
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-[-12px] rounded-full border-2 border-dashed border-luxury-gold/40"
                                />
                            )}
                            <div className="absolute inset-[-20px] border border-white/[0.03] rounded-full scale-[1.05] group-hover:scale-[1.07] transition-transform duration-500 pointer-events-none" />
                            <div className="absolute inset-[-10px] border border-white/[0.06] rounded-full scale-[1.02] group-hover:scale-[1.04] transition-transform duration-500 pointer-events-none" />

                            <div
                                className={cn(
                                    "relative w-40 h-40 md:w-56 md:h-56 rounded-full overflow-hidden p-1.5 ",
                                    user.stories?.length > 0 ? " ring-4 ring-luxury-gold/20 cursor-pointer" : ""
                                )}
                                style={{
                                    // background: `linear-gradient(135deg, ${theme.primary}66, transparent, ${theme.primary}22)`,
                                    boxShadow: `0 30px 60px -12px rgba(0,0,0,0.5), 0 0 0 1px ${theme.primary}20`
                                }}
                            >
                                <div className="w-full h-full relative rounded-full overflow-hidden">
                                    <AnimatePresence>
                                        {!imageLoaded && (
                                            <motion.div
                                                initial={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="absolute inset-0 flex items-center justify-center font-bold text-4xl md:text-6xl select-none"
                                                style={{
                                                    backgroundColor: isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)',
                                                    color: theme.primary,
                                                    fontFamily: theme.font
                                                }}
                                            >
                                                {getInitials(user.full_name || 'Anonymous')}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                    <img
                                        src={user.avatar_url || "/dp.png"}
                                        onLoad={() => setImageLoaded(true)}
                                        className={cn(
                                            "w-full h-full object-cover rounded-full transition-all duration-1000 ease-out",
                                            imageLoaded ? "opacity-100 scale-100 pb-0" : "opacity-0 scale-110"
                                        )}
                                    />
                                </div>
                            </div>

                            {/* Prestige Badge / Story Trigger */}
                            <motion.div
                                initial={{ opacity: 0, y: 10, x: "-50%" }}
                                animate={{ opacity: 1, y: 0, x: "-50%" }}
                                transition={{ delay: 0.8 }}
                                className="absolute -bottom-8 left-1/2 flex items-center gap-2 px-2 py-2 rounded-full backdrop-blur-2xl border bg-black/40 shadow-2xl z-20"
                                style={{ borderColor: `${theme.primary}33` }}
                            >
                                {user.stories?.length > 0 ? (
                                    <Radio size={16} className="text-luxury-gold animate-pulse" />
                                ) : (
                                    <MdVerified size={20} style={{ color: theme.primary }} />
                                )}
                                {/* <span className="text-[10px] font-syncopate font-bold uppercase tracking-[0.2em]" style={{ color: theme.primary }}>
                                    {user.stories?.length > 0 ? "Live" : "Verified"}
                                </span> */}
                            </motion.div>
                        </motion.div>

                        {/* Identity Typography */}
                        <div className="mt-12 md:mt-16 text-center">
                            <h1
                                className={cn(
                                    "text-4xl md:text-8xl font-bold uppercase tracking-[-0.04em] mb-4 md:mb-6 leading-[0.9]",
                                    theme.id === "royale" ? "bg-gradient-to-b from-white via-white to-luxury-gold/50 bg-clip-text text-transparent" : ""
                                )}
                                style={{
                                    fontFamily: theme.font,
                                    color: theme.id === "royale" ? undefined : textPrimary
                                }}
                            >
                                {user.full_name || 'Anonymous'}
                            </h1>

                            <div className="flex flex-col items-center gap-4">
                                <span className="text-[11px] font-syncopate uppercase tracking-[0.6em] font-black" style={{ color: theme.primary }}>
                                    {user.role || 'Creator'}
                                </span>

                                <p className="max-w-xl text-lg md:text-2xl font-light italic leading-relaxed opacity-60 px-4 md:px-6">
                                    {user.bio || 'Welcome to my profile.'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Grid */}
                    <div className="w-full space-y-16 md:space-y-40">

                        {/* Social Ecosystem */}
                        <section className="flex flex-col items-center pt-8 md:pt-16">
                            <div className="flex flex-col items-center mb-12 md:mb-20">
                                <span className="text-[10px] font-syncopate uppercase tracking-[0.3em] md:tracking-[0.8em] opacity-40 text-center truncate max-w-full px-4">Socials</span>
                            </div>
                            <div className="flex flex-wrap justify-center gap-6 max-w-2xl px-6">
                                {(user.socials?.filter((s: any) => !s.platform.startsWith('custom:')) || []).map((link: any, idx: number) => {
                                    const Icon = platformIcons[link.platform] || platformIcons.Default;
                                    return (
                                        <motion.button
                                            key={link.id}
                                            onClick={() => handleLinkClick('social', link.id, link.url)}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            whileHover={{ y: -8, scale: 1.1 }}
                                            transition={{ delay: idx * 0.08, type: "spring", stiffness: 200 }}
                                            className="w-14 h-14 md:w-20 md:h-20 rounded-full md:rounded-full flex items-center justify-center border  hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)]"
                                            style={{
                                                borderColor: cardBorder,
                                                backgroundColor: isLight ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.02)',
                                                color: textMuted
                                            }}
                                        >
                                            <Icon size={28} />
                                        </motion.button>
                                    );
                                })}
                            </div>

                            {/* Digital Dossier Secondary */}
                            {user.socials?.some((s: any) => s.platform.startsWith('custom:')) && (
                                <div className={cn(
                                    "mt-20 grid gap-6 w-full max-w-3xl",
                                    user.socials.filter((s: any) => s.platform.startsWith('custom:')).length === 1
                                        ? "grid-cols-1 max-w-md"
                                        : "grid-cols-1 md:grid-cols-2"
                                )}>
                                    {user.socials.filter((s: any) => s.platform.startsWith('custom:')).map((link: any) => (
                                        <div
                                            key={link.id}
                                            onClick={() => handleLinkClick('social', link.id, link.url)}
                                            className="flex items-center justify-between p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border group transition-all duration-700 hover:cursor-pointer"
                                            style={{
                                                borderColor: cardBorder,
                                                backgroundColor: isLight ? 'rgba(0,0,0,0.01)' : 'rgba(255,255,255,0.01)'
                                            }}
                                        >
                                            <div className="text-left flex-1 min-w-0 pr-4">
                                                {/* <span className="text-[10px] font-syncopate tracking-[0.3em] opacity-40 block mb-2 uppercase">Custom Link</span> */}
                                                <h4 className="text-lg md:text-xl font-bold uppercase tracking-tighter truncate" style={{ fontFamily: theme.font }}>
                                                    {link.platform.replace('custom:', '')}
                                                </h4>
                                            </div>
                                            <div className="w-12 h-12 rounded-full border flex items-center justify-center group-hover:scale-110 transition-all duration-500"
                                                style={{
                                                    borderColor: cardBorder,
                                                    backgroundColor: 'transparent',
                                                    color: textPrimary
                                                }}>
                                                <ArrowUpRight size={20} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>


                        {/* Auditory Signature (Spotify) */}
                        {user.top_tracks && user.top_tracks.length > 0 && (
                            <section className="relative">
                                <div className="flex flex-col items-center mb-10 md:mb-20">
                                    <span className="text-[10px] font-syncopate uppercase tracking-[0.3em] md:tracking-[0.8em] opacity-40 text-center truncate max-w-full px-4">Music</span>
                                </div>

                                <div className="flex flex-col gap-8 items-center w-full">
                                    {/* Featured Track */}
                                    <div className="w-full max-w-4xl relative group">
                                        <div
                                            className="relative aspect-[16/9] md:aspect-[21/9] rounded-[2rem] md:rounded-[3.5rem] overflow-hidden cursor-pointer border shadow-2xl transition-all duration-700 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)]"
                                            style={{ borderColor: cardBorder }}
                                            onClick={() => togglePreview(user.top_tracks[0].previewUrl)}
                                        >
                                            <img
                                                src={user.top_tracks[0].cover}
                                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-40"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                                            <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end">
                                                <div className="flex items-center gap-6">
                                                    <div
                                                        className="w-16 h-16 md:w-24 md:h-24 rounded-full flex items-center justify-center backdrop-blur-3xl border-2 transition-all duration-500 scale-90 group-hover:scale-100 shadow-2xl aspect-square"
                                                        style={{
                                                            borderColor: playingPreview === user.top_tracks[0].previewUrl ? theme.primary : (isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.2)'),
                                                            backgroundColor: playingPreview === user.top_tracks[0].previewUrl ? theme.primary : (isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)'),
                                                            color: playingPreview === user.top_tracks[0].previewUrl ? (isLight ? 'white' : 'black') : textPrimary
                                                        }}
                                                    >
                                                        {playingPreview === user.top_tracks[0].previewUrl ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <span className="text-[10px] font-syncopate tracking-[0.4em] uppercase opacity-60 mb-2 block">Listening To</span>
                                                        <h3 className="text-3xl md:text-5xl font-bold tracking-tight mb-2 leading-none uppercase truncate">{user.top_tracks[0].title}</h3>
                                                        <p className="text-base md:text-xl opacity-40 font-light italic truncate">{user.top_tracks[0].artist}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {user.top_tracks.length > 1 && (
                                        <div className={cn(
                                            "grid gap-4 w-full max-w-4xl",
                                            (user.top_tracks.length - 1) === 1 ? "grid-cols-1" :
                                                (user.top_tracks.length - 1) === 2 ? "grid-cols-1 sm:grid-cols-2" :
                                                    (user.top_tracks.length - 1) === 3 ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" :
                                                        "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
                                        )}>
                                            {user.top_tracks.slice(1, 5).map((track: any) => (
                                                <div
                                                    key={track.id}
                                                    onClick={() => togglePreview(track.previewUrl)}
                                                    className="group relative aspect-[16/9] rounded-[2rem]  overflow-hidden border bg-white/[0.02] cursor-pointer transition-all duration-300 shadow-xl"
                                                    style={{ borderColor: playingPreview === track.previewUrl ? `${theme.primary}40` : cardBorder }}
                                                >
                                                    <img
                                                        src={track.cover}
                                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-40"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                                                    <div className="absolute inset-0 p-4 md:p-6 flex flex-col justify-end">
                                                        <div className="flex items-center gap-4">
                                                            <div
                                                                className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center backdrop-blur-3xl border transition-all duration-500 scale-90 group-hover:scale-100 shadow-2xl aspect-square shrink-0"
                                                                style={{
                                                                    borderColor: playingPreview === track.previewUrl ? theme.primary : (isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.2)'),
                                                                    backgroundColor: playingPreview === track.previewUrl ? theme.primary : (isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)'),
                                                                    color: playingPreview === track.previewUrl ? (isLight ? 'white' : 'black') : textPrimary
                                                                }}
                                                            >
                                                                {playingPreview === track.previewUrl ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <h4 className="text-xs md:text-sm font-bold uppercase tracking-tight leading-tight truncate">{track.title}</h4>
                                                                <p className="text-[10px] opacity-40 font-light truncate">{track.artist}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </section>
                        )}



                        {/* Creative Spectrum (YouTube) */}
                        {user.youtube_channel_id && ytVideos.length > 0 && (
                            <section className="relative">
                                <div className="flex flex-col items-center mb-10 md:mb-20">
                                    <span className="text-[10px] font-syncopate uppercase tracking-[0.3em] md:tracking-[0.8em] opacity-40 text-center truncate max-w-full px-4">Videos</span>
                                </div>

                                <div className="flex flex-col gap-8 items-center w-full">
                                    {/* Featured Video */}
                                    <div className="w-full max-w-4xl relative group">
                                        <div
                                            className="relative aspect-[16/9] md:aspect-video rounded-[2rem] md:rounded-[3.5rem]  overflow-hidden cursor-pointer border shadow-2xl transition-all duration-700 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)]"
                                            style={{ borderColor: cardBorder }}
                                            onClick={() => setActiveVideoId(ytVideos[0].id)}
                                        >
                                            <img
                                                src={ytVideos[0].thumbnail}
                                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-60"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                                            <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end">
                                                <div className="flex items-center gap-6">
                                                    <div
                                                        className="w-16 h-16 md:w-24 md:h-24 rounded-full flex items-center justify-center backdrop-blur-3xl border-2 transition-all duration-500 scale-90 group-hover:scale-100 shadow-2xl aspect-square"
                                                        style={{
                                                            borderColor: theme.primary + '33',
                                                            backgroundColor: 'rgba(255,255,255,0.05)',
                                                            color: textPrimary
                                                        }}
                                                    >
                                                        <Play size={32} fill="currentColor" className="ml-1" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <span className="text-[10px] font-syncopate tracking-[0.4em] uppercase opacity-60 mb-2 block">Latest Video</span>
                                                        <h3 className="text-3xl md:text-5xl font-bold tracking-tight mb-2 leading-none uppercase truncate">{ytVideos[0].title}</h3>
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                                                            <p className="text-[9px] font-syncopate uppercase tracking-widest text-white/40">
                                                                {ytVideos[0].published ? formatDistanceToNow(new Date(ytVideos[0].published), { addSuffix: true }) : 'Live'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {ytVideos.length > 1 && (
                                        <div className={cn(
                                            "grid gap-4 w-full max-w-4xl",
                                            (ytVideos.length - 1) === 1 ? "grid-cols-1" :
                                                (ytVideos.length - 1) === 2 ? "grid-cols-1 sm:grid-cols-2" :
                                                    (ytVideos.length - 1) === 3 ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" :
                                                        "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
                                        )}>
                                            {ytVideos.slice(1, 5).map((video: any) => (
                                                <div
                                                    key={video.id}
                                                    onClick={() => setActiveVideoId(video.id)}
                                                    className="group relative aspect-[16/9] rounded-[2rem] overflow-hidden border bg-white/[0.02] cursor-pointer transition-all duration-300 shadow-xl"
                                                    style={{ borderColor: cardBorder }}
                                                >
                                                    <img
                                                        src={video.thumbnail}
                                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-60"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                                                    <div className="absolute inset-0 p-4 md:p-6 flex flex-col justify-end">
                                                        <div className="flex items-center gap-4">
                                                            <div
                                                                className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center backdrop-blur-3xl border transition-all duration-500 scale-90 group-hover:scale-100 shadow-2xl aspect-square shrink-0"
                                                                style={{
                                                                    borderColor: theme.primary + '20',
                                                                    backgroundColor: 'rgba(255,255,255,0.05)',
                                                                    color: textPrimary
                                                                }}
                                                            >
                                                                <Play size={18} fill="currentColor" className="ml-0.5" />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <h4 className="text-xs md:text-sm font-bold uppercase tracking-tight leading-tight truncate">{video.title}</h4>
                                                                <p className="text-[10px] opacity-40 font-light truncate">
                                                                    {video.published ? formatDistanceToNow(new Date(video.published), { addSuffix: true }) : 'Recent'}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <div className="flex justify-center pt-8">
                                        <Button
                                            variant="outline"
                                            onClick={() => window.open(`https://youtube.com/channel/${user.youtube_channel_id}`, '_blank')}
                                            className="group relative px-12 py-6 rounded-full text-[10px] font-syncopate tracking-[0.4em] uppercase border-white/10 hover:border-luxury-gold/40 bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-700"
                                        >
                                            <span className="relative z-10 flex items-center gap-4">
                                                View Channel <ArrowUpRight size={16} className="transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" />
                                            </span>
                                        </Button>
                                    </div>
                                </div>
                            </section>
                        )}


                        {/* Neural Ventures (Projects) */}
                        {user.ventures?.length > 0 && (
                            <section className="space-y-20">
                                <div className="flex flex-col items-center">
                                    <span className="text-[11px] font-syncopate uppercase tracking-[1em] opacity-40 font-black">Workspace</span>
                                </div>

                                <div className="space-y-12 md:space-y-24">
                                    {user.ventures.map((project: any, idx: number) => (
                                        <div
                                            key={project.id}
                                            className="w-full max-w-4xl mx-auto"
                                        >
                                            <div
                                                className="p-8 md:p-20 rounded-[2.5rem] md:rounded-[3.5rem]  border transition-all duration-700 bg-white/[0.01] hover:bg-white/[0.03] text-center flex flex-col items-center space-y-10 group"
                                                style={{
                                                    borderColor: cardBorder,
                                                    backgroundColor: isLight ? 'rgba(0,0,0,0.01)' : 'rgba(255,255,255,0.01)'
                                                }}
                                            >
                                                <div className="space-y-6 max-w-2xl w-full">
                                                    <div className="flex items-center justify-center gap-4">
                                                        <span className="text-[12px] font-syncopate tracking-[0.5em] px-4 py-1.5 rounded-full border uppercase" style={{ borderColor: cardBorder, color: theme.primary, backgroundColor: isLight ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.03)' }}>
                                                            #{idx + 1}
                                                        </span>
                                                    </div>
                                                    <h3 className="text-3xl md:text-7xl font-bold uppercase tracking-[-0.04em] leading-tight truncate px-4" style={{ fontFamily: theme.font }}>
                                                        {project.title}
                                                    </h3>
                                                    <p className="text-lg md:text-2xl font-light italic opacity-50 line-clamp-2 md:line-clamp-none">
                                                        {project.description || 'Brief description of the project.'}
                                                    </p>
                                                </div>

                                                <div className="flex flex-wrap justify-center gap-4 opacity-40">
                                                    {project.tech_stack?.map((tech: string) => (
                                                        <span key={tech} className="text-[10px] uppercase tracking-[0.3em] font-medium border-b border-white/10 pb-1">
                                                            {tech}
                                                        </span>
                                                    ))}
                                                </div>

                                                <Button
                                                    variant="outline"
                                                    className="w-fit py-8 px-12 rounded-[2.5rem] transition-all duration-700 gap-4 text-[11px] font-syncopate tracking-[0.4em] uppercase hover:scale-105 active:scale-95"
                                                    style={{
                                                        borderColor: cardBorder,
                                                        color: textPrimary
                                                    }}
                                                    onClick={() => handleLinkClick('venture', project.id, project.url)}
                                                >
                                                    View  <ArrowUpRight size={16} />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Elite Boutique (Products) */}
                        {user.products?.length > 0 && (
                            <section className="space-y-20">
                                <div className="flex flex-col items-center">
                                    <span className="text-[11px] font-syncopate uppercase tracking-[1em] opacity-40 font-black">Store</span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                    {user.products.map((product: any, _idx: number) => (
                                        <div
                                            key={product.id}
                                            className="group relative"
                                        >
                                            <div className="relative aspect-[4/5] rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden border bg-neutral-900" style={{ borderColor: cardBorder }}>
                                                <img
                                                    src={product.image_url || "https://images.unsplash.com/photo-1510511459019-5dee99c4ff5d?auto=format&fit=crop&q=80&w=400"}
                                                    alt={product.title}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 transition-opacity" />

                                                {/* Luxury Product Info */}
                                                <div className="absolute inset-x-0 bottom-0 p-8 md:p-12 flex flex-col justify-end">
                                                    <div className="flex justify-between items-end gap-5 translate-y-0 md:translate-y-4 md:group-hover:translate-y-0 transition-transform duration-700">
                                                        <div className="flex-1 min-w-0 space-y-1">
                                                            <h3 className="text-2xl md:text-3xl font-bold uppercase tracking-tighter leading-none truncate">{product.title}</h3>
                                                            <span className="text-xl md:text-xl font-light italic" style={{ color: theme.primary }}>
                                                                {new Intl.NumberFormat(user.currency === 'INR' ? 'en-IN' : 'en-US', {
                                                                    style: 'currency',
                                                                    currency: user.currency || 'USD',
                                                                    maximumFractionDigits: 0
                                                                }).format(parseFloat(product.price || "0"))}
                                                            </span>
                                                        </div>
                                                        <button
                                                            className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all duration-500 shrink-0"
                                                            style={{
                                                                backgroundColor: isLight ? '#1E293B' : '#FFFFFF',
                                                                color: isLight ? '#FFFFFF' : '#000000'
                                                            }}
                                                            onClick={() => handleLinkClick('product', product.id, product.url)}
                                                        >
                                                            <ShoppingBag size={24} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}


                        {/* Brand Inquiries Form */}
                        {user.accepting_inquiries && (
                            <section className="relative w-full flex flex-col items-center mt-16">
                                <div className="flex flex-col items-center mb-10 md:mb-16">
                                    <span className="text-[10px] font-syncopate uppercase tracking-[0.3em] md:tracking-[0.8em] opacity-40 text-center truncate max-w-full px-4">Collaboration</span>
                                </div>
                                <InquiryForm
                                    profileId={user.id}
                                    theme={theme}
                                    isLight={isLight}
                                    textPrimary={textPrimary}
                                    cardBorder={cardBorder}
                                />
                            </section>
                        )}



                        {/* Exclusive Access / Newsletter */}
                        {user.newsletter_enabled && (
                            <section className="relative w-full flex flex-col items-center">
                                <div className="flex flex-col items-center mb-10 md:mb-16">
                                    <span className="text-[10px] font-syncopate uppercase tracking-[0.3em] md:tracking-[0.8em] opacity-40 text-center truncate max-w-full px-4">Newsletter</span>
                                </div>

                                <motion.div
                                    // 
                                    className="w-full max-w-4xl relative"
                                >
                                    {/* Architectural Glow */}
                                    <div
                                        className="absolute -inset-2 blur-3xl opacity-30"
                                        style={{
                                            background: `linear-gradient(to right, ${theme.primary}0D, ${isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)'}, ${theme.primary}0D)`
                                        }}
                                    />

                                    <div
                                        className="relative backdrop-blur-2xl border rounded-[2.5rem] p-8 md:p-12 overflow-hidden group transition-colors duration-500"
                                        style={{
                                            backgroundColor: isLight ? 'rgba(255,255,255,0.6)' : 'rgba(5,5,5,0.6)',
                                            borderColor: cardBorder
                                        }}
                                    >
                                        {/* Decorative Elements */}
                                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity duration-1000 transform rotate-12">
                                            <Mail size={120} strokeWidth={0.5} style={{ color: textPrimary }} />
                                        </div>
                                        <div
                                            className="absolute bottom-0 left-0 w-32 h-32 blur-3xl rounded-full pointer-events-none"
                                            style={{ backgroundColor: `${theme.primary}0D` }}
                                        />

                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-12 relative z-10">

                                            {/* Text Content */}
                                            <div className="flex-1 space-y-4 md:max-w-md text-center md:text-left">
                                                <div>
                                                    <div className="flex items-center justify-center md:justify-start gap-2 mb-2 opacity-60">
                                                        <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: theme.primary }} />
                                                        <span className="text-[9px] font-syncopate uppercase tracking-widest" style={{ color: theme.primary }}>Newsletter</span>
                                                    </div>
                                                    <h3 className="text-3xl md:text-4xl font-bold uppercase tracking-tight leading-none" style={{ color: textPrimary }}>
                                                        Subscribe
                                                    </h3>
                                                </div>
                                                <p className="text-base font-light leading-relaxed opacity-50" style={{ color: textPrimary }}>
                                                    Receive updates, news, and exclusive content directly from {user.full_name || 'the source'}.
                                                </p>
                                            </div>

                                            {/* Interaction Zone */}
                                            <div className="flex-1 w-full md:max-w-md">
                                                {subscribed ? (
                                                    <motion.div
                                                        initial={{ opacity: 0, x: 20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        className="h-[140px] flex flex-col items-center justify-center border rounded-[2rem] text-center p-6"
                                                        style={{
                                                            backgroundColor: `${theme.primary}0D`,
                                                            borderColor: `${theme.primary}33`
                                                        }}
                                                    >
                                                        <CiCircleCheck size={40} className="mb-3" style={{ color: theme.primary }} />
                                                        <span className="text-xs font-syncopate font-bold uppercase tracking-[0.2em]" style={{ color: theme.primary }}>Subscribed</span>
                                                        <span className="text-[10px] opacity-40 mt-1 uppercase tracking-widest" style={{ color: textPrimary }}>You are on the list.</span>
                                                    </motion.div>
                                                ) : (
                                                    <form onSubmit={handleSubscribe} className="space-y-4">
                                                        <div className="space-y-3">
                                                            <div className="relative group/input">
                                                                <input
                                                                    type="text"
                                                                    required
                                                                    value={subscriberName}
                                                                    onChange={(e) => setSubscriberName(e.target.value)}
                                                                    placeholder="Name"
                                                                    className="w-full border rounded-2xl px-6 py-4 text-sm md:text-base focus:outline-none transition-all font-syncopate tracking-wider text-center md:text-left placeholder:opacity-30"
                                                                    style={{
                                                                        backgroundColor: isLight ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.03)',
                                                                        borderColor: cardBorder,
                                                                        color: textPrimary,
                                                                        fontFamily: theme.font
                                                                    }}
                                                                />
                                                            </div>
                                                            <div className="relative group/input flex items-center gap-2">
                                                                <div className="relative flex-1">
                                                                    <input
                                                                        type="email"
                                                                        required
                                                                        value={subscriberEmail}
                                                                        onChange={(e) => setSubscriberEmail(e.target.value)}
                                                                        placeholder="Email"
                                                                        className="w-full border rounded-2xl px-6 py-4 text-sm md:text-base focus:outline-none transition-all font-syncopate tracking-wider text-center md:text-left placeholder:opacity-30"
                                                                        style={{
                                                                            backgroundColor: isLight ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.03)',
                                                                            borderColor: cardBorder,
                                                                            color: textPrimary,
                                                                            fontFamily: theme.font
                                                                        }}
                                                                    />
                                                                </div>
                                                                <button
                                                                    type="submit"
                                                                    disabled={isSubscribing}
                                                                    className="w-14 h-14 rounded-2xl flex items-center justify-center hover:scale-105 transition-all duration-300 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed group/btn shrink-0"
                                                                    style={{
                                                                        backgroundColor: isLight ? '#000000' : '#FFFFFF',
                                                                        color: isLight ? '#FFFFFF' : '#000000'
                                                                    }}
                                                                >
                                                                    {isSubscribing ? (
                                                                        <Loader2 size={20} className="animate-spin" />
                                                                    ) : (
                                                                        <ArrowUpRight size={24} className="group-hover/btn:rotate-45 transition-transform duration-300" />
                                                                    )}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </form>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </section>
                        )}



                    </div>

                    {/* Prestige Footer */}
                    <footer className="mt-24 md:mt-24 flex flex-col items-center gap-10 w-full px-6">
                        <div className="text-center space-y-8">
                            {/* Luxury Profile Barcode */}
                            <div className="pt-12 md:pt-24 flex flex-col items-center gap-8 md:gap-10 transition-opacity duration-1000">
                                <div className="flex gap-[3px] md:gap-[5px] h-28 md:h-28 items-end" style={{ color: textMuted }}>
                                    {/* {[...Array(48)].map((_, i) => (
                                        <motion.div
                                            key={i}
                                            className="bg-current"
                                            initial={{ height: "40%" }}

                                            style={{
                                                width: i % 7 === 0 ? '4px' : i % 3 === 0 ? '2px' : '1px',
                                                opacity: 0.2 + (Math.random() * 0.4)
                                            }}
                                        />
                                    ))} */}

                                    <PremiumQR url={"https://dockly.pro/" + user.username} />
                                </div>
                                <div className="flex flex-col items-center gap-3">
                                    {/* <span className="text-[11px] md:text-sm font-syncopate tracking-[0.4em] md:tracking-[0.6em] uppercase" style={{ color: textMuted }}>
                                        {user.username?.toUpperCase() || 'ANONYMOUS'}-{Math.random().toString(36).substring(2, 8).toUpperCase()}
                                    </span> */}

                                    <span className="text-[8px] md:text-[8px] font-syncopate tracking-[0.6em] md:tracking-[0.6em] uppercase" style={{ color: textMuted }}>
                                        Verified Profile
                                    </span>
                                </div>
                            </div>
                        </div>
                    </footer>
                </div>


                {/* Temporal Chronicles Overlay */}
                <AnimatePresence>
                    {isStoryViewerOpen && user.stories?.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4"
                        >
                            <div className="relative w-auto h-full max-h-[85vh] md:max-h-[90vh] aspect-[9/16] bg-black rounded-[2.5rem] overflow-hidden shadow-[0_0_100px_rgba(212,175,55,0.15)] border border-white/10 mx-auto">
                                {/* Progress Bars */}
                                <div className="absolute bottom-6 inset-x-6 flex gap-1.5 z-50">
                                    {user.stories.map((_: any, idx: number) => (
                                        <div key={idx} className="h-0.5 flex-1 bg-white/10 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: "0%" }}
                                                animate={{
                                                    width: idx === (activeStoryIndex || 0)
                                                        ? (currentDuration ? "100%" : "0%")
                                                        : idx < (activeStoryIndex || 0) ? "100%" : "0%"
                                                }}
                                                transition={{
                                                    duration: (idx === (activeStoryIndex || 0) && currentDuration) ? currentDuration / 1000 : 0,
                                                    ease: "linear"
                                                }}
                                                className="h-full bg-luxury-gold"
                                            />
                                        </div>
                                    ))}
                                </div>

                                {/* Close Button - Properly positioned */}
                                <div className="absolute top-4 right-4 z-[60]">
                                    <button
                                        onClick={() => setIsStoryViewerOpen(false)}
                                        className="w-10 h-10 bg-black/60 hover:bg-black/80 backdrop-blur-xl rounded-full flex items-center justify-center text-white/60 hover:text-white transition-all border border-white/20"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                <div className="h-full w-full relative group/viewer">
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={user.stories[activeStoryIndex || 0].id}
                                            initial={{ opacity: 0, scale: 1.1 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ duration: 0.8 }}
                                            className="h-full w-full bg-[#050505] flex items-center justify-center"
                                        >
                                            <div className="absolute inset-0 z-10 pointer-events-none opacity-[0.03]" style={{ backgroundImage: `url('https://grainy-gradients.vercel.app/noise.svg')` }} />

                                            {user.stories[activeStoryIndex || 0].media_type === 'video' ? (
                                                <video
                                                    ref={videoRef}
                                                    src={user.stories[activeStoryIndex || 0].media_url}
                                                    className="max-h-full max-w-full object-contain shadow-[0_0_100px_rgba(0,0,0,0.5)]"
                                                    autoPlay
                                                    playsInline
                                                    muted={isMuted}
                                                    onLoadedMetadata={(e) => setCurrentDuration(e.currentTarget.duration * 1000)}
                                                    onEnded={handleNextStory}
                                                />
                                            ) : (
                                                <img
                                                    src={user.stories[activeStoryIndex || 0].media_url}
                                                    alt="Chronicle"
                                                    className="max-h-full max-w-full object-contain"
                                                />
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
                                        </motion.div>
                                    </AnimatePresence>

                                    {/* Volume Control Overlay */}
                                    <div className="absolute bottom-32 right-10 z-50">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setIsMuted(!isMuted);
                                            }}
                                            className="w-12 h-12 bg-black/40 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/10 text-white/60 hover:text-luxury-gold transition-colors"
                                        >
                                            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                                        </button>
                                    </div>

                                    {/* Navigation Triggers */}
                                    <div className="absolute inset-x-0 inset-y-20 flex">
                                        <div
                                            className="flex-1 cursor-pointer"
                                            onClick={() => {
                                                const newIndex = Math.max(0, (activeStoryIndex || 0) - 1);
                                                setActiveStoryIndex(newIndex);
                                            }}
                                        />
                                        <div
                                            className="flex-1 cursor-pointer"
                                            onClick={() => {
                                                if ((activeStoryIndex || 0) < user.stories.length - 1) {
                                                    setActiveStoryIndex((activeStoryIndex || 0) + 1);
                                                } else {
                                                    setIsStoryViewerOpen(false);
                                                }
                                            }}
                                        />
                                    </div>

                                    <div className="absolute bottom-10 inset-x-10">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="w-10 h-10 rounded-full border border-luxury-gold/40 p-0.5">
                                                <img src={user.avatar_url} className="w-full h-full object-cover rounded-full" />
                                            </div>
                                            <div>
                                                <div className="text-[10px] font-syncopate font-bold text-white uppercase tracking-tight">{user.full_name}</div>
                                                <div className="flex items-center gap-2 text-white/40">
                                                    <Clock size={10} className="text-luxury-gold" />
                                                    <span className="text-[8px] font-syncopate uppercase tracking-widest">
                                                        {user.stories[activeStoryIndex || 0].created_at
                                                            ? formatDistanceToNow(new Date(user.stories[activeStoryIndex || 0].created_at), { addSuffix: true })
                                                            : "Just Now"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        {user.stories[activeStoryIndex || 0].caption && (
                                            <p className="text-sm font-plus text-white/80 leading-relaxed">
                                                {user.stories[activeStoryIndex || 0].caption}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
                {/* Cinema Intelligence Overlay */}
                <AnimatePresence>
                    {activeVideoId && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[300] bg-black/98 backdrop-blur-[100px] flex items-center justify-center p-0 md:p-12"
                        >
                            <motion.div
                                ref={playerContainerRef}
                                initial={{ scale: 0.9, opacity: 0, y: 30 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.95, opacity: 0, y: 30 }}
                                transition={{ type: "spring", damping: 30, stiffness: 200 }}
                                className={cn(
                                    "relative w-full max-w-6xl aspect-video overflow-hidden bg-black shadow-[0_0_200px_rgba(212,175,55,0.1)] border border-white/5 group",
                                    isFullscreen ? "max-w-none w-screen h-screen rounded-none" : "rounded-[2rem]"
                                )}
                            >
                                {/* The Hidden Engine */}
                                <div id={`youtube-player-${activeVideoId}`} className="absolute inset-0 pointer-events-none opacity-0" />

                                {/* Static Poster / Background */}
                                <div className="absolute inset-0 z-0">
                                    <img
                                        src={ytVideos.find(v => v.id === activeVideoId)?.thumbnail}
                                        className="w-full h-full object-cover blur-3xl opacity-20"
                                        alt="Background"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                                </div>

                                {/* Active Viewport with Horizon Saturation */}
                                <div
                                    className="absolute inset-0 z-10 cursor-pointer overflow-hidden bg-black"
                                    onClick={() => isPlaying ? player?.pauseVideo() : player?.playVideo()}
                                >
                                    {/* The Engine - Engineered for 0% Border Exposure */}
                                    <div
                                        id={`youtube-player-active-viewport`}
                                        className="absolute -top-[20%] -left-[20%] w-[140%] h-[140%] pointer-events-none origin-center"
                                    />

                                    {/* Subtle Ambient Vignette */}
                                    <div className={cn(
                                        "absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 pointer-events-none z-20 transition-opacity duration-700",
                                        isPlaying ? "opacity-0 group-hover:opacity-100" : "opacity-100"
                                    )} />

                                    {/* Branding Disruption Overlay */}
                                    <div className="absolute inset-0 pointer-events-none bg-black/5 mix-blend-overlay z-30 opacity-20" />
                                    <div className="absolute inset-0 z-10 pointer-events-none opacity-[0.01]" style={{ backgroundImage: `url('https://grainy-gradients.vercel.app/noise.svg')` }} />

                                    {/* Playback Indicator */}
                                    <AnimatePresence>
                                        {!isPlaying && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 1.2 }}
                                                className="absolute inset-0 flex items-center justify-center z-20"
                                            >
                                                <div className="w-32 h-32 rounded-full bg-white/5 backdrop-blur-3xl border border-white/10 flex items-center justify-center">
                                                    <Play size={40} className="text-white ml-2" fill="white" />
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Custom UI Layer - Architectural Overlay */}
                                <div className="absolute inset-x-0 bottom-0 z-50 p-8 md:p-12 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-700">
                                    <div className="space-y-8">
                                        {/* Dynamic Scrubber */}
                                        <div className="relative group/scrub">
                                            <input
                                                type="range"
                                                min="0"
                                                max={duration || 0}
                                                value={currentTime}
                                                onChange={handleScrub}
                                                onMouseDown={() => setIsScrubbing(true)}
                                                onMouseUp={() => setIsScrubbing(false)}
                                                className="absolute inset-x-0 -top-2 h-4 w-full opacity-0 cursor-pointer z-20"
                                            />
                                            <div className="relative h-1 w-full bg-white/10 rounded-full overflow-hidden">
                                                <motion.div
                                                    className="absolute h-full bg-luxury-gold shadow-[0_0_20px_rgba(212,175,55,0.5)]"
                                                    initial={false}
                                                    animate={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
                                                    transition={{ duration: 0.1, ease: "linear" }}
                                                />
                                            </div>
                                            <div className="flex justify-between mt-3">
                                                <span className="text-[10px] font-syncopate tracking-widest text-white/40">{formatTime(currentTime)}</span>
                                                <span className="text-[10px] font-syncopate tracking-widest text-white/40">{formatTime(duration)}</span>
                                            </div>
                                        </div>

                                        {/* Control Architecture */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-10">
                                                <button
                                                    onClick={() => isPlaying ? player?.pauseVideo() : player?.playVideo()}
                                                    className="text-white hover:text-luxury-gold transition-colors"
                                                >
                                                    {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" />}
                                                </button>

                                                <div className="hidden md:flex flex-col">
                                                    <span className="text-[9px] font-syncopate uppercase tracking-[0.2em] text-white/40 mb-1">Now Playing</span>
                                                    <h4 className="text-lg font-bold uppercase tracking-tight text-white line-clamp-1 max-w-md">
                                                        {ytVideos.find(v => v.id === activeVideoId)?.title}
                                                    </h4>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-8">
                                                <button
                                                    onClick={toggleFullscreen}
                                                    className="text-white hover:text-luxury-gold transition-colors"
                                                >
                                                    {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
                                                </button>

                                                <button
                                                    onClick={() => window.open(`https://www.youtube.com/watch?v=${activeVideoId}`, '_blank')}
                                                    className="text-white hover:text-luxury-gold transition-colors"
                                                    title="Open in YouTube"
                                                >
                                                    <ExternalLink size={20} />
                                                </button>

                                                <button
                                                    onClick={() => {
                                                        const newState = !isPlayerMuted;
                                                        setIsPlayerMuted(newState);
                                                        newState ? player?.mute() : player?.unMute();
                                                    }}
                                                    className="text-white hover:text-luxury-gold transition-colors"
                                                >
                                                    {isPlayerMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                                                </button>

                                                <button
                                                    onClick={() => setActiveVideoId(null)}
                                                    className="w-12 h-12 bg-white/5 hover:bg-white/10 backdrop-blur-2xl rounded-full flex items-center justify-center text-white transition-all border border-white/10"
                                                >
                                                    <X size={20} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Minimal Status Bar */}
                                <div className="absolute top-10 left-10 z-20 flex items-center gap-4 opacity-40">
                                    <div className="w-2 h-2 rounded-full bg-luxury-gold animate-pulse" />
                                    <span className="text-[8px] font-syncopate uppercase tracking-[0.4em] text-white">Secure Connection</span>
                                </div>
                            </motion.div>

                            {/* Close on Backdrop Click */}
                            <div className="absolute inset-0 -z-10" onClick={() => setActiveVideoId(null)} />
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </>
    );
};
