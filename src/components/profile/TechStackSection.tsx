import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getTechIconInfo } from "@/lib/techIcons";
import { Cpu, Sparkles } from "lucide-react";

interface SkillItem {
    id: string;
    name: string;
    category?: string;
    proficiency?: string;
    icon_key?: string;
    color?: string;
    years_exp?: string;
    order_index?: number;
}

interface TechStackSectionProps {
    skills: SkillItem[];
    theme: {
        id: string;
        name: string;
        primary: string;
        bg: string;
        font: string;
    };
    isLight: boolean;
}

export const TechStackSection = ({
    skills,
    theme,
    isLight
}: TechStackSectionProps) => {
    const [selectedCategory, setSelectedCategory] = useState<string>("All");

    const categories = useMemo(() => {
        if (!skills || skills.length === 0) return [];
        const cats = Array.from(new Set(skills.map(s => s.category || "Languages")));
        return ["All", ...cats];
    }, [skills]);

    const filteredSkills = useMemo(() => {
        if (!skills) return [];
        if (selectedCategory === "All") return skills;
        return skills.filter(s => (s.category || "Languages") === selectedCategory);
    }, [skills, selectedCategory]);

    if (!skills || skills.length === 0) {
        return null;
    }

    const cardBorder = isLight ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.08)";
    const pillBg = isLight ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.03)";

    return (
        <section id="arsenal-section" className="w-full flex flex-col items-center">
            {/* Section Header */}
            <div className="flex flex-col items-center mb-8 md:mb-12 text-center">
                <div className="flex items-center gap-2 mb-2 opacity-60">
                    <Cpu size={14} style={{ color: theme.primary }} />
                    <span className="text-[10px] font-syncopate uppercase tracking-[0.3em] md:tracking-[0.8em]">
                        Engineering Arsenal
                    </span>
                </div>
                <h3
                    className="text-2xl sm:text-3xl md:text-4xl font-syncopate font-bold uppercase tracking-tight"
                    style={{ color: isLight ? "#111" : "#FFF", fontFamily: theme.font }}
                >
                    Tech Stack<span style={{ color: theme.primary }}>.</span>
                </h3>
                <p className="text-xs text-white/40 font-plus mt-2 max-w-md italic">
                    Core technical proficiencies, frameworks, and architectural tooling.
                </p>
            </div>

            {/* Filter Tabs */}
            {categories.length > 2 && (
                <div className="flex flex-wrap items-center justify-center gap-2 mb-8 max-w-2xl px-4">
                    {categories.map((cat) => {
                        const isSelected = selectedCategory === cat;
                        return (
                            <button
                                key={cat}
                                type="button"
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-2 rounded-full text-[9px] md:text-[10px] font-syncopate uppercase tracking-wider transition-all duration-300 border touch-manipulation cursor-pointer select-none ${
                                    isSelected
                                        ? "shadow-lg scale-105"
                                        : "opacity-60 hover:opacity-100"
                                }`}
                                style={{
                                    borderColor: isSelected ? theme.primary : cardBorder,
                                    backgroundColor: isSelected ? `${theme.primary}20` : pillBg,
                                    color: isSelected ? (isLight ? "#000" : "#FFF") : (isLight ? "#555" : "#AAA"),
                                }}
                            >
                                {cat}
                            </button>
                        );
                    })}
                </div>
            )}

            {/* Tech Stack Badges Matrix */}
            <div className="w-full max-w-4xl px-4 md:px-0">
                <motion.div
                    layout
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4"
                >
                    <AnimatePresence mode="popLayout">
                        {filteredSkills.map((skill) => {
                            const iconInfo = getTechIconInfo(skill.icon_key || skill.name);
                            const IconComponent = iconInfo.icon;
                            const brandColor = skill.color || iconInfo.color;

                            return (
                                <motion.div
                                    key={skill.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.2 }}
                                    whileHover={{ y: -3, transition: { duration: 0.15 } }}
                                    className="group relative p-4 sm:p-5 rounded-[1.6rem] border transition-all duration-300 overflow-hidden flex flex-col justify-between shadow-lg hover:shadow-2xl cursor-default touch-manipulation"
                                    style={{
                                        borderColor: cardBorder,
                                        backgroundColor: isLight ? "rgba(255,255,255,0.85)" : "rgba(10,10,10,0.85)",
                                    }}
                                >
                                    {/* Ambient Brand Color Hover Bloom */}
                                    <div
                                        className="absolute -top-12 -right-12 w-28 h-28 rounded-full blur-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none"
                                        style={{ backgroundColor: brandColor }}
                                    />

                                    {/* Top Row: Icon + Years of Exp */}
                                    <div className="flex items-start justify-between gap-2 mb-3 relative z-10">
                                        <div
                                            className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center border transition-transform duration-300 group-hover:scale-110 shrink-0"
                                            style={{
                                                backgroundColor: `${brandColor}18`,
                                                borderColor: `${brandColor}40`,
                                                color: brandColor,
                                            }}
                                        >
                                            <IconComponent size={20} style={{ color: brandColor }} />
                                        </div>

                                        {skill.years_exp && (
                                            <span
                                                className="text-[8px] font-syncopate uppercase tracking-widest px-2.5 py-1 rounded-full border shrink-0 opacity-70 group-hover:opacity-100 transition-opacity"
                                                style={{
                                                    borderColor: cardBorder,
                                                    backgroundColor: pillBg,
                                                    color: isLight ? "#222" : "#FFF",
                                                }}
                                            >
                                                {skill.years_exp}
                                            </span>
                                        )}
                                    </div>

                                    {/* Skill Name & Proficiency */}
                                    <div className="relative z-10">
                                        <h4
                                            className="text-xs sm:text-sm font-bold tracking-tight truncate mb-1 group-hover:text-white transition-colors"
                                            style={{ color: isLight ? "#111" : "#FFF", fontFamily: theme.font }}
                                        >
                                            {skill.name}
                                        </h4>
                                        <div className="flex items-center justify-between gap-1 text-[9px] font-syncopate uppercase tracking-wider opacity-45">
                                            <span className="truncate">{skill.category || "Languages"}</span>
                                            {skill.proficiency && (
                                                <span
                                                    className="font-semibold shrink-0"
                                                    style={{ color: brandColor }}
                                                >
                                                    {skill.proficiency}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </motion.div>
            </div>
        </section>
    );
};
