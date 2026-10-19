import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import {
    X,
    Copy,
    Check,
    Share2,
    UserPlus,
    Sparkles,
    ExternalLink,
    Smartphone
} from "lucide-react";
import { FaXTwitter, FaLinkedinIn, FaWhatsapp, FaTelegram } from "react-icons/fa6";
import { toast } from "sonner";
import { downloadVCard } from "@/lib/vcard";

interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: {
        id?: string;
        username?: string;
        full_name?: string;
        bio?: string;
        role?: string;
        avatar_url?: string;
        booking_url?: string;
        socials?: Array<{ platform: string; url: string }>;
    };
    theme: {
        id: string;
        name: string;
        primary: string;
        bg: string;
        font: string;
    };
    isLight: boolean;
}

export const ShareModal = ({
    isOpen,
    onClose,
    user,
    theme,
    isLight
}: ShareModalProps) => {
    const [copied, setCopied] = useState(false);
    const [supportsNativeShare, setSupportsNativeShare] = useState(false);
    const [qrReady, setQrReady] = useState(false);

    useEffect(() => {
        if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
            setSupportsNativeShare(true);
        }
    }, []);

    // Defer heavy QR SVG generation until sheet has smoothly slid up (zero frame drop on iOS)
    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => setQrReady(true), 80);
            return () => clearTimeout(timer);
        } else {
            setQrReady(false);
        }
    }, [isOpen]);

    const profileUrl = typeof window !== "undefined"
        ? `${window.location.origin}/${user.username || ""}`
        : `https://dockly.pro/${user.username || ""}`;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(profileUrl);
            setCopied(true);
            toast.success("Estate link secured to clipboard.");
            setTimeout(() => setCopied(false), 2000);
        } catch {
            toast.error("Failed to copy link.");
        }
    };

    const handleSaveContact = () => {
        downloadVCard({
            fullName: user.full_name,
            username: user.username,
            bio: user.bio,
            role: user.role,
            websiteUrl: profileUrl,
            bookingUrl: user.booking_url,
            avatarUrl: user.avatar_url,
            socials: user.socials,
        });
        toast.success("Digital Dossier vCard downloaded.");
    };

    const handleNativeShare = async () => {
        if (typeof navigator !== "undefined" && navigator.share) {
            try {
                await navigator.share({
                    title: `${user.full_name || user.username} | Dockly Pro`,
                    text: user.bio || `Explore the sovereign digital estate of ${user.full_name || user.username}.`,
                    url: profileUrl,
                });
            } catch (err: any) {
                if (err.name !== "AbortError") {
                    handleCopy();
                }
            }
        } else {
            handleCopy();
        }
    };

    const shareTitle = encodeURIComponent(`Explore the sovereign estate of ${user.full_name || user.username || "Creator"}`);
    const encodedUrl = encodeURIComponent(profileUrl);

    const shareChannels = [
        {
            name: "X (Twitter)",
            icon: FaXTwitter,
            href: `https://twitter.com/intent/tweet?text=${shareTitle}&url=${encodedUrl}`,
            color: "#FFFFFF",
            bg: "rgba(255,255,255,0.06)",
        },
        {
            name: "LinkedIn",
            icon: FaLinkedinIn,
            href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
            color: "#0A66C2",
            bg: "rgba(10,102,194,0.12)",
        },
        {
            name: "WhatsApp",
            icon: FaWhatsapp,
            href: `https://api.whatsapp.com/send?text=${shareTitle}%20${encodedUrl}`,
            color: "#25D366",
            bg: "rgba(37,211,102,0.12)",
        },
        {
            name: "Telegram",
            icon: FaTelegram,
            href: `https://t.me/share/url?url=${encodedUrl}&text=${shareTitle}`,
            color: "#229ED9",
            bg: "rgba(34,158,217,0.12)",
        },
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[250] flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6 overflow-hidden">
                    {/* Instant Lightweight Pure Backdrop (Zero blur, zero composite stalls on iOS) */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 will-change-[opacity]"
                    />

                    {/* Modal / Native Bottom Sheet Container (Hardware transform only for 120fps on iPhone) */}
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="relative w-full max-w-lg rounded-t-[2.2rem] sm:rounded-[2.5rem] border-t sm:border border-white/10 sm:border-white/15 overflow-hidden z-10 max-h-[92vh] flex flex-col will-change-transform touch-manipulation"
                        style={{
                            borderColor: isLight ? "rgba(0,0,0,0.12)" : "rgba(255,255,255,0.15)",
                            backgroundColor: isLight ? "#FDFDFD" : "#0A0A0A",
                            transform: "translateZ(0)",
                        }}
                    >
                        {/* Mobile Touch Drag Handle */}
                        <div className="sm:hidden pt-3 pb-1 flex justify-center shrink-0">
                            <div className="w-12 h-1.5 rounded-full bg-white/20" />
                        </div>

                        {/* Desktop Ambient Glow */}
                        <div
                            className="hidden sm:block absolute -top-32 -right-32 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none"
                            style={{ backgroundColor: theme.primary }}
                        />

                        {/* Header */}
                        <div
                            className="relative px-6 py-4 md:p-6 md:pb-4 flex items-center justify-between border-b shrink-0"
                            style={{ borderColor: isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.06)" }}
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                                    style={{
                                        backgroundColor: `${theme.primary}18`,
                                        color: theme.primary,
                                    }}
                                >
                                    <Share2 size={15} />
                                </div>
                                <div>
                                    <h3
                                        className="text-xs font-syncopate font-bold uppercase tracking-[0.18em]"
                                        style={{ color: isLight ? "#111" : "#FFF" }}
                                    >
                                        Estate Broadcast
                                    </h3>
                                    <p className="text-[8px] font-syncopate tracking-widest uppercase opacity-40">
                                        Sovereign Digital Identity
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={onClose}
                                className="w-9 h-9 rounded-full flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
                                style={{
                                    backgroundColor: isLight ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.05)",
                                    color: isLight ? "#111" : "#FFF",
                                }}
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-5 md:p-6 space-y-5 overflow-y-auto overscroll-contain scrollbar-none">
                            {/* Profile Identity Snippet */}
                            <div
                                className="p-4 rounded-[1.5rem] border flex items-center gap-3.5 relative overflow-hidden"
                                style={{
                                    borderColor: isLight ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.08)",
                                    backgroundColor: isLight ? "rgba(0,0,0,0.02)" : "rgba(255,255,255,0.02)",
                                }}
                            >
                                <div
                                    className="w-12 h-12 rounded-2xl overflow-hidden border shrink-0 relative"
                                    style={{ borderColor: `${theme.primary}40` }}
                                >
                                    <img
                                        src={user.avatar_url || "/dp.png"}
                                        alt={user.full_name || "Profile"}
                                        className="w-full h-full object-cover"
                                        loading="eager"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-1.5">
                                        <h4
                                            className="text-xs md:text-sm font-bold uppercase tracking-tight truncate"
                                            style={{ color: isLight ? "#111" : "#FFF", fontFamily: theme.font }}
                                        >
                                            {user.full_name || user.username}
                                        </h4>
                                        <Sparkles size={10} style={{ color: theme.primary }} />
                                    </div>
                                    <p className="text-[9px] font-syncopate uppercase tracking-wider opacity-40 truncate">
                                        @{user.username || "sovereign"} • {user.role || "Creator"}
                                    </p>
                                </div>
                            </div>

                            {/* Direct System Share Sheet Button (if device supports navigator.share) */}
                            {supportsNativeShare && (
                                <button
                                    onClick={handleNativeShare}
                                    className="w-full flex items-center justify-center gap-2.5 px-4 py-3 rounded-2xl font-syncopate text-[9px] font-bold uppercase tracking-[0.2em] transition-transform active:scale-95 shadow-md border"
                                    style={{
                                        backgroundColor: isLight ? "#000000" : "#FFFFFF",
                                        color: isLight ? "#FFFFFF" : "#000000",
                                        borderColor: isLight ? "#000000" : "#FFFFFF",
                                    }}
                                >
                                    <Smartphone size={14} />
                                    <span>Open System Share Sheet</span>
                                    <ExternalLink size={12} className="opacity-60" />
                                </button>
                            )}

                            {/* Dual Tactical Actions: Save Contact & Copy Link */}
                            <div className="grid grid-cols-2 gap-2.5">
                                <button
                                    onClick={handleSaveContact}
                                    className="flex items-center justify-center gap-2 px-3 py-3 rounded-2xl border font-syncopate text-[9px] font-bold uppercase tracking-wider transition-transform active:scale-95 shadow-sm"
                                    style={{
                                        backgroundColor: `${theme.primary}18`,
                                        borderColor: `${theme.primary}50`,
                                        color: isLight ? theme.primary : "#FFFFFF",
                                    }}
                                >
                                    <UserPlus size={13} style={{ color: theme.primary }} />
                                    <span className="truncate">Save Contact</span>
                                </button>

                                <button
                                    onClick={handleCopy}
                                    className="flex items-center justify-center gap-2 px-3 py-3 rounded-2xl border font-syncopate text-[9px] font-bold uppercase tracking-wider transition-transform active:scale-95 shadow-sm"
                                    style={{
                                        backgroundColor: isLight ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.06)",
                                        borderColor: isLight ? "rgba(0,0,0,0.12)" : "rgba(255,255,255,0.12)",
                                        color: isLight ? "#111" : "#FFF",
                                    }}
                                >
                                    {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                                    <span className="truncate">{copied ? "Copied!" : "Copy Link"}</span>
                                </button>
                            </div>

                            {/* QR Code Presentation (Lightweight Medium-Redundancy Matrix) */}
                            <div className="flex flex-col items-center justify-center py-1">
                                <div
                                    className="p-3.5 rounded-[1.8rem] border shadow-xl relative min-h-[148px] min-w-[148px] flex items-center justify-center"
                                    style={{
                                        borderColor: `${theme.primary}30`,
                                        backgroundColor: isLight ? "#FFFFFF" : "#050505",
                                    }}
                                >
                                    {qrReady ? (
                                        <QRCodeSVG
                                            value={profileUrl}
                                            size={135}
                                            level="M"
                                            fgColor={isLight ? "#050505" : "#F5F5F5"}
                                            bgColor="transparent"
                                        />
                                    ) : (
                                        <div className="w-[135px] h-[135px] rounded-2xl flex items-center justify-center bg-white/[0.02]">
                                            <Sparkles size={16} className="text-luxury-gold/40 animate-pulse" />
                                        </div>
                                    )}
                                </div>
                                <span className="text-[7px] font-syncopate uppercase tracking-[0.35em] opacity-35 mt-2">
                                    Instant Camera Scan
                                </span>
                            </div>

                            {/* Direct Social Channels */}
                            <div className="space-y-2 pt-1">
                                <span className="text-[8px] font-syncopate uppercase tracking-[0.25em] opacity-40 block text-center">
                                    Share to Network
                                </span>

                                <div className="grid grid-cols-4 gap-2">
                                    {shareChannels.map((channel) => (
                                        <a
                                            key={channel.name}
                                            href={channel.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex flex-col items-center justify-center p-2.5 rounded-2xl border transition-transform active:scale-95"
                                            style={{
                                                backgroundColor: channel.bg,
                                                borderColor: isLight ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.08)",
                                            }}
                                            title={`Share to ${channel.name}`}
                                        >
                                            <channel.icon size={16} style={{ color: channel.color }} />
                                            <span className="text-[7px] font-syncopate uppercase tracking-wider opacity-60 mt-1.5 truncate w-full text-center">
                                                {channel.name.split(" ")[0]}
                                            </span>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
