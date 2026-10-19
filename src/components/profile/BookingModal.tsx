import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Calendar, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: any;
    theme: any;
    isLight: boolean;
}

export const BookingModal = ({ isOpen, onClose, user, theme, isLight }: BookingModalProps) => {
    if (!isOpen) return null;

    const [iframeLoading, setIframeLoading] = useState(true);
    const bookingUrl = (user?.booking_url || "").trim();
    const isEmbeddable = bookingUrl.includes("cal.com") || bookingUrl.includes("calendly.com");

    // Format embed URL for seamless in-app display
    const getEmbedUrl = (url: string) => {
        if (!url) return "";
        try {
            const urlObj = new URL(url);
            if (url.includes("calendly.com")) {
                urlObj.searchParams.set("embed_domain", window.location.hostname);
                urlObj.searchParams.set("embed_type", "Inline");
                urlObj.searchParams.set("hide_landing_page_details", "1");
                return urlObj.toString();
            }
            return url;
        } catch {
            return url;
        }
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/85 backdrop-blur-md"
                />

                {/* Modal Container */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.97, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.97, y: 15 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="relative w-full max-w-3xl h-[88vh] sm:h-[82vh] md:h-[680px] flex flex-col rounded-2xl sm:rounded-[2rem] border shadow-2xl overflow-hidden z-10"
                    style={{
                        backgroundColor: isLight ? "#FAFAFA" : "#0A0A0A",
                        borderColor: isLight ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.08)",
                    }}
                >
                    {/* Minimal Top Bar - No clutter, no huge titles */}
                    <div
                        className="px-4 py-2.5 sm:px-6 sm:py-3 border-b flex items-center justify-between shrink-0"
                        style={{
                            borderColor: isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.06)",
                            backgroundColor: isLight ? "#FFFFFF" : "#0D0D0D",
                        }}
                    >
                        <div className="flex items-center gap-2 text-xs font-syncopate uppercase tracking-widest opacity-70">
                            <Calendar size={14} style={{ color: theme.primary }} />
                            <span className="truncate max-w-[200px] sm:max-w-xs font-semibold">
                                {user?.full_name || user?.username || "Calendar"}
                            </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                            {bookingUrl && (
                                <a
                                    href={bookingUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl border border-white/5 hover:border-white/20 transition-all opacity-60 hover:opacity-100"
                                    title="Open calendar in new tab"
                                >
                                    <ExternalLink size={14} />
                                </a>
                            )}
                            <button
                                onClick={onClose}
                                className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl border border-white/5 hover:border-white/20 transition-all opacity-60 hover:opacity-100"
                                title="Close"
                            >
                                <X size={15} />
                            </button>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 w-full h-full relative overflow-hidden bg-black/40">
                        {isEmbeddable && bookingUrl ? (
                            <>
                                {iframeLoading && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/60 z-10">
                                        <Loader2 size={24} className="animate-spin" style={{ color: theme.primary }} />
                                        <span className="text-[10px] font-syncopate uppercase tracking-widest opacity-40">
                                            Connecting to Calendar...
                                        </span>
                                    </div>
                                )}
                                <iframe
                                    src={getEmbedUrl(bookingUrl)}
                                    title="Calendar Booking"
                                    onLoad={() => setIframeLoading(false)}
                                    className="w-full h-full border-0"
                                    allow="camera; microphone; autoplay; encrypted-media; fullscreen"
                                />
                            </>
                        ) : bookingUrl ? (
                            <div className="flex flex-col items-center justify-center h-full text-center px-6 py-10 space-y-5">
                                <div
                                    className="w-14 h-14 rounded-2xl flex items-center justify-center border shadow-xl"
                                    style={{
                                        borderColor: `${theme.primary}30`,
                                        backgroundColor: `${theme.primary}10`,
                                        color: theme.primary,
                                    }}
                                >
                                    <Calendar size={24} />
                                </div>
                                <div className="space-y-1.5 max-w-sm">
                                    <h4 className="text-base sm:text-lg font-syncopate font-bold uppercase tracking-tight text-white">
                                        Open Booking Calendar
                                    </h4>
                                    <p className="text-xs opacity-50 font-plus leading-relaxed">
                                        Choose your session time directly through {user?.full_name || "the host"}'s calendar.
                                    </p>
                                </div>
                                <Button
                                    variant="luxury"
                                    onClick={() => window.open(bookingUrl, "_blank")}
                                    className="px-6 py-4 rounded-xl gap-2 text-[11px] tracking-wider font-syncopate uppercase"
                                >
                                    Open Link <ExternalLink size={13} />
                                </Button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-center px-6 space-y-3">
                                <Calendar size={28} className="opacity-20" />
                                <p className="text-[10px] font-syncopate uppercase tracking-widest opacity-40">
                                    Calendar link has not been configured yet.
                                </p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
