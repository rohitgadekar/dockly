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
    VolumeX
} from "lucide-react";
import { cn } from "@/lib/utils";
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
    FaInstagram,
    FaGlobe
} from "react-icons/fa";

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


    return (
        <>

            <div
                className={cn(
                    "min-h-screen flex flex-col items-center relative transition-colors duration-1000 overflow-x-hidden pt-[env(safe-area-inset-top)]",
                    isPreview
                        ? "rounded-none shadow-none scale-[0.85] origin-top w-[118%] h-[120%] -ml-[9%] pt-12"
                        : "py-16 md:py-24 lg:py-32 px-6"
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
                    <div className="relative mb-24 flex flex-col items-center">
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
                                    background: `linear-gradient(135deg, ${theme.primary}66, transparent, ${theme.primary}22)`,
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
                                        alt={user.full_name}
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
                                className="absolute -bottom-8 left-1/2 flex items-center gap-2 px-3 py-2.5 rounded-full backdrop-blur-2xl border bg-black/40 shadow-2xl z-20"
                                style={{ borderColor: `${theme.primary}33` }}
                            >
                                {user.stories?.length > 0 ? (
                                    <Radio size={16} className="text-luxury-gold animate-pulse" />
                                ) : (
                                    <CiCircleCheck size={20} style={{ color: theme.primary }} />
                                )}
                                <span className="text-[10px] font-syncopate font-bold uppercase tracking-[0.2em]" style={{ color: theme.primary }}>
                                    {user.stories?.length > 0 ? "Live" : "Verified"}
                                </span>
                            </motion.div>
                        </motion.div>

                        {/* Identity Typography */}
                        <div className="mt-16 text-center">
                            <h1
                                className={cn(
                                    "text-5xl md:text-8xl font-bold uppercase tracking-[-0.04em] mb-6 leading-[0.9]",
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
                                    {user.role || 'Digital Architect'}
                                </span>

                                <p className="max-w-xl text-xl md:text-2xl font-light italic leading-relaxed opacity-60 px-6">
                                    {user.bio || 'Architecting digital sovereignty for the global elite.'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Grid */}
                    <div className="w-full space-y-32 md:space-y-48">

                        {/* Auditory Signature (Spotify) */}
                        {user.top_tracks && user.top_tracks.length > 0 && (
                            <section className="relative">
                                <div className="flex flex-col items-center mb-16">
                                    <span className="text-[10px] font-syncopate uppercase tracking-[0.3em] md:tracking-[0.8em] opacity-40 mb-4 text-center truncate max-w-full px-4">Auditory Atmosphere</span>

                                </div>

                                <div className="flex flex-col gap-8 items-center w-full">
                                    {/* Featured Track */}
                                    <div className="w-full max-w-4xl relative group">
                                        <div
                                            className="relative aspect-[16/9] md:aspect-[21/9] rounded-[2rem] overflow-hidden cursor-pointer border shadow-2xl transition-all duration-700 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)]"
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
                                                        <span className="text-[10px] font-syncopate tracking-[0.4em] uppercase opacity-60 mb-2 block">Primary Anthem</span>
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
                                                    className="group relative aspect-[16/9]  rounded-[2rem] overflow-hidden border bg-white/[0.02] cursor-pointer transition-all duration-300 shadow-xl"
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

                        {/* Social Ecosystem */}
                        <section className="flex flex-col items-center">
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
                                            transition={{ delay: idx * 0.05, type: "spring", stiffness: 200 }}
                                            className="w-20 h-20 rounded-[2rem] flex items-center justify-center border transition-all duration-500 hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)]"
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
                                            className="flex items-center justify-between p-8 rounded-[2.5rem] border group transition-all duration-700"
                                            style={{
                                                borderColor: cardBorder,
                                                backgroundColor: isLight ? 'rgba(0,0,0,0.01)' : 'rgba(255,255,255,0.01)'
                                            }}
                                        >
                                            <div className="text-left flex-1 min-w-0 pr-4">
                                                <span className="text-[10px] font-syncopate tracking-[0.3em] opacity-40 block mb-2 uppercase">Protocol Link</span>
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

                        {/* Neural Ventures (Projects) */}
                        {user.ventures?.length > 0 && (
                            <section>
                                <div className="flex flex-col items-center mb-24">
                                    <span className="text-[11px] font-syncopate uppercase tracking-[1em] opacity-40 mb-6 font-black">Digital Products</span>

                                </div>

                                <div className="space-y-40">
                                    {user.ventures.map((project: any, idx: number) => (
                                        <div
                                            key={project.id}
                                            className="w-full max-w-4xl mx-auto"
                                        >
                                            <div
                                                className="p-12 md:p-20 rounded-[4rem] border transition-all duration-700 bg-white/[0.01] hover:bg-white/[0.03] text-center flex flex-col items-center space-y-10 group"
                                                style={{
                                                    borderColor: cardBorder,
                                                    backgroundColor: isLight ? 'rgba(0,0,0,0.01)' : 'rgba(255,255,255,0.01)'
                                                }}
                                            >
                                                <div className="space-y-6 max-w-2xl w-full">
                                                    <div className="flex items-center justify-center gap-4">
                                                        <span className="text-[9px] font-syncopate tracking-[0.5em] px-4 py-1.5 rounded-full border" style={{ borderColor: cardBorder, color: theme.primary, backgroundColor: isLight ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.03)' }}>
                                                            Entry {idx + 1}
                                                        </span>
                                                        <Zap size={14} className="opacity-20 translate-y-[-1px]" style={{ color: theme.primary }} />
                                                    </div>
                                                    <h3 className="text-3xl md:text-7xl font-bold uppercase tracking-[-0.04em] leading-tight truncate px-4" style={{ fontFamily: theme.font }}>
                                                        {project.title}
                                                    </h3>
                                                    <p className="text-lg md:text-2xl font-light italic opacity-50 line-clamp-2 md:line-clamp-none">
                                                        {project.description || 'A flagship deployment of architectural digital excellence.'}
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
                                                    Explore Deeply <ArrowUpRight size={16} />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Elite Boutique (Products) */}
                        {user.products?.length > 0 && (
                            <section>
                                <div className="flex flex-col items-center mb-24">
                                    <span className="text-[11px] font-syncopate uppercase tracking-[1em] opacity-40 mb-6 font-black">Curated Vault</span>

                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                    {user.products.map((product: any, _idx: number) => (
                                        <div
                                            key={product.id}
                                            className="group relative"
                                        >
                                            <div className="relative aspect-[4/5] rounded-[3.5rem] overflow-hidden border bg-neutral-900" style={{ borderColor: cardBorder }}>
                                                <img
                                                    src={product.image_url || "https://images.unsplash.com/photo-1510511459019-5dee99c4ff5d?auto=format&fit=crop&q=80&w=400"}
                                                    alt={product.title}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 transition-opacity" />

                                                {/* Luxury Product Info */}
                                                <div className="absolute inset-x-0 bottom-0 p-10 md:p-12 flex flex-col justify-end">
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

                    </div>

                    {/* Prestige Footer */}
                    <footer className="mt-32 md:mt-64 flex flex-col items-center gap-12 md:gap-16 w-full px-6">


                        <div className="text-center space-y-10">
                            <div className="flex flex-wrap items-center justify-center gap-4 text-xs md:text-sm font-syncopate tracking-[0.4em] md:tracking-[0.8em] transition-opacity uppercase"
                                style={{ color: textMuted }}>
                                Projected by  Citadel v4.2
                            </div>

                            <div className="space-y-4 text-xs md:text-sm font-syncopate tracking-[0.5em] md:tracking-[1em] uppercase leading-loose"
                                style={{ color: textMuted }}>
                                <p>© 2026 EAGLES</p>
                                <p className="hidden md:block">Global Sovereignty Secured</p>
                            </div>

                            {/* Luxury Profile Barcode */}
                            <div className="pt-12 md:pt-24 flex flex-col items-center gap-8 md:gap-10 transition-opacity duration-1000">
                                <div className="flex gap-[3px] md:gap-[5px] h-28 md:h-28 items-end" style={{ color: textMuted }}>
                                    {[...Array(48)].map((_, i) => (
                                        <motion.div
                                            key={i}
                                            className="bg-current"
                                            initial={{ height: "40%" }}

                                            style={{
                                                width: i % 7 === 0 ? '4px' : i % 3 === 0 ? '2px' : '1px',
                                                opacity: 0.2 + (Math.random() * 0.4)
                                            }}
                                        />
                                    ))}
                                </div>
                                <div className="flex flex-col items-center gap-3">
                                    <span className="text-[11px] md:text-sm font-syncopate tracking-[0.4em] md:tracking-[0.6em] uppercase" style={{ color: textMuted }}>
                                        {user.username?.toUpperCase() || 'ANONYMOUS'}-{Math.random().toString(36).substring(2, 8).toUpperCase()}
                                    </span>

                                    <span className="text-[10px] md:text-xs font-syncopate tracking-[0.6em] md:tracking-[1em] uppercase" style={{ color: theme.primary }}>
                                        Authenticity Verified
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
                                                            : "Active Instance"}
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
            </div>
        </>
    );
};
