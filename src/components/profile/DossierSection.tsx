import { useState } from "react";
import { motion } from "framer-motion";
import {
    Lock,
    Unlock,
    FileText,
    ArrowUpRight,
    Shield,
    Sparkles,
    CheckCircle2
} from "lucide-react";
import { DossierModal } from "@/components/profile/DossierModal";

interface DossierSectionProps {
    user: any;
    theme: any;
    isLight: boolean;
    textPrimary: string;
    cardBorder: string;
}

export const DossierSection = ({
    user,
    theme,
    isLight,
    textPrimary,
    cardBorder
}: DossierSectionProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (!user.dossier_enabled) return null;

    const requiresPasscode = user.dossier_requires_passcode !== false && !!user.dossier_passcode;
    const title = user.dossier_title || "Executive Curriculum Vitae";
    const description = user.dossier_description || "Confidential career dossier, advisory credentials, and institutional track record.";

    return (
        <section id="dossier-section" className="relative w-full flex flex-col items-center">
            {/* Section Architectural Header */}
            <div className="flex flex-col items-center mb-10 md:mb-14 text-center">
                <div className="flex items-center gap-2 mb-2 opacity-60">
                    <Shield size={14} style={{ color: theme.primary }} />
                    <span className="text-[10px] font-syncopate uppercase tracking-[0.3em] md:tracking-[0.8em]">
                        Executive Credentials
                    </span>
                </div>
                <h3
                    className="text-2xl sm:text-3xl md:text-4xl font-syncopate font-bold uppercase tracking-tight"
                    style={{ color: isLight ? "#111" : "#FFF", fontFamily: theme.font }}
                >
                    Curriculum Vitae<span style={{ color: theme.primary }}>.</span>
                </h3>
                <p className="text-xs text-white/40 font-plus mt-2 max-w-md italic">
                    Confidential career dossier, advisory credentials, and institutional track record.
                </p>
            </div>

            {/* Dossier Vault Card */}
            <div className="w-full max-w-4xl px-4 md:px-0">
                <motion.div
                    whileHover={{ y: -4, transition: { duration: 0.3 } }}
                    onClick={() => setIsModalOpen(true)}
                    className="group relative p-6 sm:p-8 md:p-12 rounded-[2.2rem] md:rounded-[2.8rem] border backdrop-blur-md md:backdrop-blur-2xl transition-all duration-500 overflow-hidden shadow-2xl hover:shadow-[0_30px_70px_-15px_rgba(0,0,0,0.8)] cursor-pointer touch-manipulation"
                    style={{
                        borderColor: cardBorder,
                        backgroundColor: isLight ? "rgba(255,255,255,0.8)" : "rgba(10,10,10,0.8)",
                    }}
                >
                    {/* Ambient Glow */}
                    <div
                        className="absolute -top-24 -right-24 w-52 h-52 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none"
                        style={{ backgroundColor: theme.primary }}
                    />

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                        {/* Left: Icon & Info */}
                        <div className="flex items-start sm:items-center gap-5">
                            <div
                                className="w-16 h-16 md:w-20 md:h-20 rounded-[1.5rem] border flex items-center justify-center shrink-0 transition-transform duration-500 group-hover:scale-105 shadow-xl relative"
                                style={{
                                    borderColor: `${theme.primary}40`,
                                    backgroundColor: `${theme.primary}12`,
                                    color: theme.primary
                                }}
                            >
                                <FileText size={28} className="md:w-8 md:h-8" />
                                <div
                                    className="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg flex items-center justify-center border shadow-md"
                                    style={{
                                        backgroundColor: isLight ? "#111" : "#FFF",
                                        color: isLight ? "#FFF" : "#000",
                                        borderColor: cardBorder
                                    }}
                                >
                                    {requiresPasscode ? <Lock size={11} /> : <Shield size={11} />}
                                </div>
                            </div>

                            <div className="space-y-1.5 flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span
                                        className="text-[8px] font-syncopate uppercase tracking-widest px-2.5 py-0.5 rounded-full border border-luxury-gold/30 bg-luxury-gold/10 text-luxury-gold"
                                    >
                                        {requiresPasscode ? "Clearance Required" : "Public Document"}
                                    </span>
                                    <span className="text-[8px] font-syncopate uppercase tracking-widest text-white/40">
                                        Executive Record
                                    </span>
                                </div>

                                <h3
                                    className="text-xl sm:text-2xl md:text-3xl font-bold uppercase tracking-tight leading-tight truncate"
                                    style={{ color: textPrimary, fontFamily: theme.font }}
                                >
                                    {title}
                                </h3>

                                <p className="text-xs sm:text-sm text-white/50 leading-relaxed max-w-xl">
                                    {description}
                                </p>
                            </div>
                        </div>

                        {/* Right: Unlock Button */}
                        <div className="shrink-0 self-start md:self-center pt-2 md:pt-0">
                            <button
                                type="button"
                                className="flex items-center gap-2.5 px-6 py-4 rounded-2xl border font-syncopate text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-300 group-hover:scale-105 shadow-lg"
                                style={{
                                    backgroundColor: isLight ? "#000" : "#FFF",
                                    color: isLight ? "#FFF" : "#000",
                                    borderColor: isLight ? "#000" : "#FFF",
                                }}
                            >
                                {requiresPasscode ? <Lock size={13} /> : <FileText size={13} />}
                                <span>{requiresPasscode ? "Request / Decrypt" : "View Record"}</span>
                                <ArrowUpRight size={13} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Modal */}
            <DossierModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                user={user}
                theme={theme}
                isLight={isLight}
            />
        </section>
    );
};
