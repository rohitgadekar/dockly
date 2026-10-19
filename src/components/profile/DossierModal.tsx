import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Lock,
    Unlock,
    Key,
    FileText,
    ExternalLink,
    Download,
    X,
    Shield,
    CheckCircle2,
    AlertTriangle,
    Send,
    Eye
} from "lucide-react";
import { toast } from "sonner";

interface DossierModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: {
        id?: string;
        username?: string;
        full_name?: string;
        email?: string;
        dossier_title?: string;
        dossier_description?: string;
        dossier_file_url?: string;
        dossier_passcode?: string;
        dossier_requires_passcode?: boolean;
        accepting_inquiries?: boolean;
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

export const DossierModal = ({
    isOpen,
    onClose,
    user,
    theme,
    isLight
}: DossierModalProps) => {
    const [passcode, setPasscode] = useState("");
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [error, setError] = useState(false);
    const [shake, setShake] = useState(false);

    const requiresPasscode = user.dossier_requires_passcode !== false && !!user.dossier_passcode;
    const documentUrl = user.dossier_file_url || "#";
    const documentTitle = user.dossier_title || "Resume & Experience";
    const documentDesc = user.dossier_description || "Career history, background, and professional achievements.";

    const handleUnlock = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        setError(false);

        // Normalize case & whitespace for smooth UX
        const entered = passcode.trim();
        const expected = (user.dossier_passcode || "").trim();

        if (!expected || entered.toLowerCase() === expected.toLowerCase()) {
            setIsUnlocked(true);
            toast.success("Password verified! Opening document.");
        } else {
            setError(true);
            setShake(true);
            setTimeout(() => setShake(false), 500);
            toast.error("Incorrect password. Please try again.");
        }
    };

    const handleRequestAccess = () => {
        onClose();
        // If accepting inquiries, scroll down to inquiry section
        if (user.accepting_inquiries) {
            const form = document.getElementById("inquiry-section");
            if (form) {
                form.scrollIntoView({ behavior: "smooth" });
                toast.info("Send a message below to request password access.");
                return;
            }
        }
        // Fallback to mailto
        const subject = encodeURIComponent(`Access Request: Resume (${user.full_name || user.username})`);
        const body = encodeURIComponent(
            `Hello ${user.full_name || user.username},\n\nI would like to request the password to view your resume.\n\nName:\nCompany / Organization:\nReason for Request:`
        );
        window.location.href = `mailto:${user.email || ""}?subject=${subject}&body=${body}`;
    };

    const handleClose = () => {
        setPasscode("");
        setError(false);
        setIsUnlocked(false);
        onClose();
    };

    const effectiveUnlocked = isUnlocked || !requiresPasscode;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[250] flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6 overflow-hidden">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.18 }}
                        onClick={handleClose}
                        className="fixed inset-0 bg-black/85 sm:backdrop-blur-sm will-change-[opacity]"
                    />

                    {/* Modal / Bottom Sheet Container */}
                    <motion.div
                        initial={{ y: "100%", opacity: 0.8 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: "100%", opacity: 0 }}
                        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                        className="relative w-full max-w-lg rounded-t-[2.2rem] sm:rounded-[2.5rem] border border-b-0 sm:border-b overflow-hidden shadow-[0_-10px_40px_rgba(0,0,0,0.8)] sm:shadow-[0_30px_90px_rgba(0,0,0,0.9)] z-10 max-h-[90vh] flex flex-col will-change-transform"
                        style={{
                            borderColor: isLight ? "rgba(0,0,0,0.12)" : "rgba(255,255,255,0.12)",
                            backgroundColor: isLight ? "#FDFDFD" : "#0A0A0A",
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
                                    {effectiveUnlocked ? <Unlock size={15} /> : <Lock size={15} />}
                                </div>
                                <div>
                                    <h3
                                        className="text-xs font-syncopate font-bold uppercase tracking-[0.18em]"
                                        style={{ color: isLight ? "#111" : "#FFF" }}
                                    >
                                        {effectiveUnlocked ? "Resume Unlocked" : "Password Protected"}
                                    </h3>
                                    <p className="text-[8px] font-syncopate tracking-widest uppercase opacity-40">
                                        Resume & Documents
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={handleClose}
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
                        <div className="p-6 space-y-6 overflow-y-auto overscroll-contain scrollbar-none">
                            {/* Document Meta Card */}
                            <div
                                className="p-5 rounded-[1.8rem] border flex items-start gap-4 relative overflow-hidden"
                                style={{
                                    borderColor: isLight ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.08)",
                                    backgroundColor: isLight ? "rgba(0,0,0,0.02)" : "rgba(255,255,255,0.02)",
                                }}
                            >
                                <div
                                    className="w-12 h-12 rounded-2xl flex items-center justify-center border shrink-0"
                                    style={{
                                        borderColor: `${theme.primary}40`,
                                        backgroundColor: `${theme.primary}12`,
                                        color: theme.primary
                                    }}
                                >
                                    <FileText size={22} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span
                                            className="text-[8px] font-syncopate uppercase tracking-widest px-2.5 py-0.5 rounded-full border"
                                            style={{
                                                borderColor: `${theme.primary}4D`,
                                                backgroundColor: `${theme.primary}1A`,
                                                color: theme.primary
                                            }}
                                        >
                                            {requiresPasscode && !effectiveUnlocked ? "Protected PDF" : "PDF Resume"}
                                        </span>
                                    </div>
                                    <h4
                                        className="text-base font-bold uppercase tracking-tight truncate leading-tight"
                                        style={{ color: isLight ? "#111" : "#FFF", fontFamily: theme.font }}
                                    >
                                        {documentTitle}
                                    </h4>
                                    <p className="text-xs text-white/50 leading-relaxed mt-1">
                                        {documentDesc}
                                    </p>
                                </div>
                            </div>

                            {/* UNLOCKED STATE */}
                            {effectiveUnlocked ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.96 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="space-y-4 pt-2"
                                >
                                    <div
                                        className="p-4 rounded-2xl border flex items-center gap-3 text-emerald-400 bg-emerald-500/10 border-emerald-500/30"
                                    >
                                        <CheckCircle2 size={18} className="shrink-0" />
                                        <span className="text-xs font-syncopate uppercase tracking-wider font-bold">
                                            Access Granted • Document Ready
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                                        <a
                                            href={documentUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center gap-2.5 px-5 py-4 rounded-2xl border font-syncopate text-[9px] font-bold uppercase tracking-[0.2em] transition-transform active:scale-95 shadow-lg"
                                            style={{
                                                backgroundColor: theme.primary,
                                                color: isLight ? "#FFFFFF" : "#0A0A0A",
                                                borderColor: theme.primary,
                                            }}
                                        >
                                            <Eye size={14} />
                                            <span>View Document</span>
                                            <ExternalLink size={12} className="opacity-70" />
                                        </a>

                                        <a
                                            href={documentUrl}
                                            download
                                            className="flex items-center justify-center gap-2.5 px-5 py-4 rounded-2xl border font-syncopate text-[9px] font-bold uppercase tracking-[0.2em] transition-transform active:scale-95 shadow-md"
                                            style={{
                                                backgroundColor: isLight ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.06)",
                                                borderColor: isLight ? "rgba(0,0,0,0.12)" : "rgba(255,255,255,0.12)",
                                                color: isLight ? "#111" : "#FFF",
                                            }}
                                        >
                                            <Download size={14} />
                                            <span>Download PDF</span>
                                        </a>
                                    </div>
                                </motion.div>
                            ) : (
                                /* LOCKED STATE: Passcode Form */
                                <div className="space-y-5">
                                    <form onSubmit={handleUnlock} className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-syncopate uppercase tracking-[0.3em] text-white/50 block">
                                                Enter Password
                                            </label>
                                            <div
                                                className={`relative rounded-2xl border transition-all duration-300 ${
                                                    shake ? "animate-bounce" : ""
                                                } ${
                                                    error
                                                        ? "border-red-500/60 bg-red-500/5"
                                                        : "border-white/10 bg-white/[0.03]"
                                                }`}
                                            >
                                                <input
                                                    type="password"
                                                    autoFocus
                                                    value={passcode}
                                                    onChange={(e) => {
                                                        setPasscode(e.target.value);
                                                        setError(false);
                                                    }}
                                                    placeholder="Enter password"
                                                    className="w-full px-5 py-3.5 bg-transparent text-sm text-white focus:outline-none font-mono tracking-widest placeholder:tracking-normal placeholder:font-sans placeholder:opacity-30"
                                                />
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-40">
                                                    <Key size={15} />
                                                </div>
                                            </div>
                                            {error && (
                                                <p className="text-[10px] text-red-400 font-syncopate uppercase tracking-wider flex items-center gap-1.5 pt-1">
                                                    <AlertTriangle size={11} /> Incorrect password. Please try again.
                                                </p>
                                            )}
                                        </div>

                                        <button
                                            type="submit"
                                            className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl font-syncopate text-[9px] font-bold uppercase tracking-[0.2em] transition-transform active:scale-95 shadow-lg border"
                                            style={{
                                                backgroundColor: theme.primary,
                                                color: isLight ? "#FFFFFF" : "#0A0A0A",
                                                borderColor: theme.primary,
                                            }}
                                        >
                                            <Unlock size={14} />
                                            <span>Unlock Document</span>
                                        </button>
                                    </form>

                                    {/* Request Access Fallback */}
                                    <div
                                        className="pt-4 border-t flex flex-col items-center gap-2 text-center"
                                        style={{ borderColor: isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.06)" }}
                                    >
                                        <p className="text-[10px] text-white/40">
                                             Don't have the password?
                                        </p>
                                        <button
                                            type="button"
                                            onClick={handleRequestAccess}
                                            className="text-[9px] font-syncopate uppercase tracking-widest flex items-center gap-1.5 hover:underline py-1"
                                            style={{ color: theme.primary }}
                                        >
                                            <Send size={10} />
                                            <span>Request Access</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
