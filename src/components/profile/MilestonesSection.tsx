import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Calendar,
    ArrowUpRight,
    Award,
    Compass,
    Building2,
    Sparkles,
    CheckCircle2,
    Briefcase,
    Mic,
    Rocket,
    TrendingUp
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface Milestone {
    id: string;
    year: string;
    title: string;
    organization?: string;
    description?: string;
    category?: string;
    badge?: string;
    url?: string;
    order_index?: number;
}

interface MilestonesSectionProps {
    milestones: Milestone[];
    theme: {
        id: string;
        name: string;
        primary: string;
        bg: string;
        font: string;
    };
    isLight: boolean;
    textPrimary: string;
    cardBorder: string;
}

const categoryIcons: Record<string, any> = {
    Venture: Rocket,
    Honor: Award,
    Exit: TrendingUp,
    Keynote: Mic,
    Investment: Sparkles,
    Milestone: Compass,
    Default: Compass,
};

export const MilestonesSection = ({
    milestones,
    theme,
    isLight,
    textPrimary,
    cardBorder
}: MilestonesSectionProps) => {
    const [selectedCategory, setSelectedCategory] = useState<string>("All");

    if (!milestones || milestones.length === 0) return null;

    // Collect distinct categories
    const categories = ["All", ...Array.from(new Set(milestones.map(m => m.category || "Milestone")))];

    const filteredMilestones = selectedCategory === "All"
        ? milestones
        : milestones.filter(m => (m.category || "Milestone") === selectedCategory);

    return (
        <section id="trajectory-section" className="relative w-full flex flex-col items-center">
            {/* Section Architectural Header */}
            <div className="flex flex-col items-center mb-10 md:mb-14 text-center">
                <div className="flex items-center gap-2 mb-2 opacity-60">
                    <Compass size={14} style={{ color: theme.primary }} />
                    <span className="text-[10px] font-syncopate uppercase tracking-[0.3em] md:tracking-[0.8em]">
                        Career Chronology
                    </span>
                </div>
                <h3
                    className="text-2xl sm:text-3xl md:text-4xl font-syncopate font-bold uppercase tracking-tight"
                    style={{ color: isLight ? "#111" : "#FFF", fontFamily: theme.font }}
                >
                    Trajectory<span style={{ color: theme.primary }}>.</span>
                </h3>
                <p className="text-xs text-white/40 font-plus mt-2 max-w-md italic">
                    Key professional appointments, milestones, honors, and turning points.
                </p>
            </div>

            {/* Category Filter Pills (if multiple categories exist) */}
            {categories.length > 2 && (
                <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 mb-10 md:mb-14 max-w-2xl px-4">
                    {categories.map((cat) => {
                        const isSelected = selectedCategory === cat;
                        return (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={cn(
                                    "px-4 py-2 rounded-full text-[9px] font-syncopate uppercase tracking-widest transition-all duration-300 border touch-manipulation cursor-pointer",
                                    isSelected
                                        ? "shadow-lg scale-105"
                                        : "opacity-40 hover:opacity-100"
                                )}
                                style={{
                                    borderColor: isSelected ? theme.primary : cardBorder,
                                    backgroundColor: isSelected
                                        ? (isLight ? "#111" : "#FFF")
                                        : (isLight ? "rgba(0,0,0,0.02)" : "rgba(255,255,255,0.02)"),
                                    color: isSelected
                                        ? (isLight ? "#FFF" : "#000")
                                        : textPrimary,
                                }}
                            >
                                {cat}
                            </button>
                        );
                    })}
                </div>
            )}

            {/* Timeline Spine & Container */}
            <div className="w-full max-w-4xl px-4 md:px-0">
                <div className="relative space-y-8 md:space-y-16">
                    {/* Central / Left Architectural Spine (Pixel-perfect alignment with node dot centers) */}
                    <div
                        className="absolute left-[18px] sm:left-6 md:left-1/2 top-3 bottom-3 w-px -translate-x-1/2 pointer-events-none opacity-25"
                        style={{
                            background: `linear-gradient(to bottom, transparent, ${theme.primary}, transparent)`,
                        }}
                    />

                    <AnimatePresence mode="popLayout">
                        {filteredMilestones.map((item, idx) => {
                            const isEven = idx % 2 === 0;
                            const IconComponent = categoryIcons[item.category || "Default"] || categoryIcons.Default;

                            return (
                                <motion.div
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-40px" }}
                                    transition={{ duration: 0.45, delay: idx * 0.06 }}
                                    className={cn(
                                        "relative flex flex-col md:flex-row items-start md:items-center w-full group",
                                        isEven ? "md:flex-row" : "md:flex-row-reverse"
                                    )}
                                >
                                    {/* Timeline Node Point (Exact same coordinate as the spine: left-[18px] sm:left-6 md:left-1/2) */}
                                    <div
                                        className="absolute left-[18px] sm:left-6 md:left-1/2 -translate-x-1/2 top-5 md:top-1/2 -translate-y-1/2 w-6 h-6 md:w-8 md:h-8 rounded-full border-2 flex items-center justify-center z-10 transition-transform duration-300 group-hover:scale-115 shadow-xl shrink-0"
                                        style={{
                                            borderColor: theme.primary,
                                            backgroundColor: isLight ? "#FFFFFF" : "#0A0A0A",
                                            boxShadow: `0 0 14px ${theme.primary}30`,
                                        }}
                                    >
                                        <div
                                            className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full"
                                            style={{ backgroundColor: theme.primary }}
                                        />
                                    </div>

                                    {/* Content Card */}
                                    <div className={cn(
                                        "w-full md:w-[calc(50%-2.5rem)] pl-10 sm:pl-12 md:pl-0",
                                        isEven ? "md:pr-8 md:text-right" : "md:pl-8 md:text-left"
                                    )}>
                                        <div
                                            className="p-5 sm:p-7 md:p-8 rounded-[1.8rem] md:rounded-[2.2rem] border backdrop-blur-xl transition-all duration-500 shadow-xl group-hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7)] group-hover:-translate-y-1 relative overflow-hidden"
                                            style={{
                                                borderColor: cardBorder,
                                                backgroundColor: isLight ? "rgba(255,255,255,0.6)" : "rgba(10,10,10,0.6)",
                                            }}
                                        >
                                            {/* Glow Accent */}
                                            <div
                                                className="absolute -top-16 -right-16 w-32 h-32 rounded-full blur-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none"
                                                style={{ backgroundColor: theme.primary }}
                                            />

                                            {/* Card Top: Year & Category Badge */}
                                            <div className={cn(
                                                "flex flex-wrap items-center gap-2.5 mb-4 relative z-10",
                                                isEven ? "md:justify-end" : "md:justify-start"
                                            )}>
                                                <span
                                                    className="px-3 py-1 rounded-full text-[9px] font-syncopate font-bold uppercase tracking-wider border shadow-sm"
                                                    style={{
                                                        borderColor: `${theme.primary}40`,
                                                        backgroundColor: `${theme.primary}15`,
                                                        color: theme.primary,
                                                    }}
                                                >
                                                    {item.year}
                                                </span>

                                                {item.category && (
                                                    <span
                                                        className="px-2.5 py-0.5 rounded-full text-[8px] font-syncopate uppercase tracking-widest border opacity-60 flex items-center gap-1"
                                                        style={{ borderColor: cardBorder, color: textPrimary }}
                                                    >
                                                        <IconComponent size={10} style={{ color: theme.primary }} />
                                                        {item.category}
                                                    </span>
                                                )}

                                                {item.badge && (
                                                    <span
                                                        className="px-2.5 py-0.5 rounded-full text-[8px] font-syncopate uppercase tracking-widest border border-luxury-gold/30 bg-luxury-gold/10 text-luxury-gold"
                                                    >
                                                        {item.badge}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Title & Organization */}
                                            <div className="space-y-1.5 relative z-10">
                                                <h3
                                                    className="text-base sm:text-lg md:text-xl font-bold uppercase tracking-tight leading-snug"
                                                    style={{ color: textPrimary, fontFamily: theme.font }}
                                                >
                                                    {item.title}
                                                </h3>

                                                {item.organization && (
                                                    <p className="text-[10px] font-syncopate uppercase tracking-widest opacity-50 flex items-center gap-1.5 md:inline-flex">
                                                        <Building2 size={11} className="opacity-60" />
                                                        <span>{item.organization}</span>
                                                    </p>
                                                )}
                                            </div>

                                            {/* Narrative Description */}
                                            {item.description && (
                                                <p
                                                    className="mt-3 text-xs md:text-sm font-light leading-relaxed opacity-60 relative z-10"
                                                    style={{ color: textPrimary }}
                                                >
                                                    {item.description}
                                                </p>
                                            )}

                                            {/* Optional Link / Proof */}
                                            {item.url && (
                                                <div className={cn(
                                                    "mt-5 pt-3 border-t flex relative z-10",
                                                    isEven ? "md:justify-end" : "md:justify-start"
                                                )} style={{ borderColor: isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.06)" }}>
                                                    <a
                                                        href={item.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1.5 text-[9px] font-syncopate uppercase tracking-widest transition-colors duration-300 hover:underline group/link"
                                                        style={{ color: theme.primary }}
                                                    >
                                                        <span>View Dispatch</span>
                                                        <ArrowUpRight size={11} className="transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
};
