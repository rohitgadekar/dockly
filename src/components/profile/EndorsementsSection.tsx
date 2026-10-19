import { motion } from "framer-motion";
import { Star, Quote, Building2, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Endorsement {
    id: string;
    client_name: string;
    client_role?: string;
    company_name?: string;
    client_avatar?: string;
    quote: string;
    rating?: number;
    project_title?: string;
}

interface EndorsementsSectionProps {
    endorsements: Endorsement[];
    theme: any;
    isLight: boolean;
    textPrimary: string;
    cardBorder: string;
}

export const EndorsementsSection = ({
    endorsements,
    theme,
    isLight,
    textPrimary,
    cardBorder
}: EndorsementsSectionProps) => {
    if (!endorsements || endorsements.length === 0) return null;

    const getInitials = (name?: string) => {
        if (!name || typeof name !== "string") return "??";
        const parts = name.trim().split(/\s+/);
        if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    };

    return (
        <section id="endorsements-section" className="relative w-full flex flex-col items-center">
            {/* Architectural Section Label */}
            <div className="flex flex-col items-center mb-10 md:mb-14 text-center">
                <div className="flex items-center gap-2 mb-2 opacity-60">
                    <Star size={14} style={{ color: theme.primary }} />
                    <span className="text-[10px] font-syncopate uppercase tracking-[0.3em] md:tracking-[0.8em]">
                        Wall of Distinction
                    </span>
                </div>
                <h3
                    className="text-2xl sm:text-3xl md:text-4xl font-syncopate font-bold uppercase tracking-tight"
                    style={{ color: isLight ? "#111" : "#FFF", fontFamily: theme.font }}
                >
                    Endorsements<span style={{ color: theme.primary }}>.</span>
                </h3>
                <p className="text-xs text-white/40 font-plus mt-2 max-w-md italic">
                    Direct appraisals from founders, engineering leaders, and collaborators.
                </p>
            </div>

            {/* Grid Container */}
            <div className={cn(
                "grid gap-6 md:gap-8 w-full max-w-4xl px-4 md:px-0",
                endorsements.length === 1
                    ? "grid-cols-1 max-w-3xl"
                    : endorsements.length === 2
                        ? "grid-cols-1 md:grid-cols-2"
                        : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            )}>
                {endorsements.map((item, idx) => {
                    const rating = item.rating || 5;

                    return (
                        <motion.div
                            key={item.id}
                            whileHover={{ y: -6, transition: { duration: 0.3 } }}
                            className="group relative flex flex-col justify-between p-8 md:p-10 rounded-[2.5rem] border backdrop-blur-md md:backdrop-blur-2xl transition-all duration-500 overflow-hidden shadow-2xl hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)]"
                            style={{
                                borderColor: cardBorder,
                                backgroundColor: isLight ? "rgba(255,255,255,0.8)" : "rgba(10,10,10,0.8)",
                            }}
                        >
                            {/* Ambient Theme Glow on Hover */}
                            <div
                                className="absolute -top-24 -right-24 w-48 h-48 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none"
                                style={{ backgroundColor: theme.primary }}
                            />

                            {/* Top row: Rating & Quote Watermark */}
                            <div className="flex items-center justify-between mb-6 relative z-10">
                                <div className="flex items-center gap-1">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Star
                                            key={i}
                                            size={14}
                                            className={cn(
                                                "transition-colors",
                                                i < rating
                                                    ? "fill-current text-luxury-gold"
                                                    : "opacity-20 text-white"
                                            )}
                                        />
                                    ))}
                                </div>
                                <Quote
                                    size={36}
                                    strokeWidth={1}
                                    className="opacity-15 group-hover:opacity-30 transition-opacity transform group-hover:scale-110 duration-500"
                                    style={{ color: theme.primary }}
                                />
                            </div>

                            {/* Quotation Body */}
                            <p
                                className="text-base md:text-lg font-light leading-relaxed italic opacity-85 mb-8 relative z-10"
                                style={{ color: textPrimary }}
                            >
                                "{item.quote}"
                            </p>

                            {/* Project Scope Tag (if provided) */}
                            {item.project_title && (
                                <div className="mb-6 relative z-10">
                                    <span
                                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-syncopate uppercase tracking-widest border"
                                        style={{
                                            borderColor: `${theme.primary}25`,
                                            backgroundColor: `${theme.primary}08`,
                                            color: theme.primary,
                                        }}
                                    >
                                        <CheckCircle2 size={10} />
                                        {item.project_title}
                                    </span>
                                </div>
                            )}

                            {/* Author / Client Profile Footer */}
                            <div className="flex items-center gap-4 pt-6 border-t border-white/[0.06] relative z-10">
                                {item.client_avatar ? (
                                    <img
                                        src={item.client_avatar}
                                        alt={item.client_name}
                                        className="w-12 h-12 rounded-full object-cover border shadow-md shrink-0"
                                        style={{ borderColor: `${theme.primary}33` }}
                                    />
                                ) : (
                                    <div
                                        className="w-12 h-12 rounded-full flex items-center justify-center font-syncopate font-bold text-xs border shadow-md shrink-0"
                                        style={{
                                            borderColor: `${theme.primary}33`,
                                            backgroundColor: `${theme.primary}15`,
                                            color: theme.primary,
                                        }}
                                    >
                                        {getInitials(item.client_name)}
                                    </div>
                                )}

                                <div className="min-w-0 flex-1">
                                    <h4
                                        className="text-xs md:text-sm font-syncopate font-bold uppercase tracking-tight truncate leading-tight"
                                        style={{ color: textPrimary }}
                                    >
                                        {item.client_name}
                                    </h4>
                                    <div className="flex items-center gap-1.5 text-[11px] opacity-50 font-light truncate mt-0.5">
                                        {item.company_name && (
                                            <span className="flex items-center gap-1 font-medium text-white/70">
                                                <Building2 size={11} className="opacity-60" />
                                                {item.company_name}
                                            </span>
                                        )}
                                        {item.company_name && item.client_role && <span>•</span>}
                                        {item.client_role && (
                                            <span className="truncate">{item.client_role}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </section>
    );
};
