import { useState, useEffect, useMemo } from "react";
import { useTitle } from "@/hooks/useTitle";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import {
    Palette,
    Loader2,
    Save,
    Check,
    Eye,
    Monitor,
    X,
    Type,
    Sliders,
    Sparkles,
    CheckCircle2,
    Sun,
    Moon
} from "lucide-react";
import { useDashboard } from "@/hooks/useDashboard";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { ProfileView } from "@/components/profile/ProfileView";
import { cn } from "@/lib/utils";
import {
    THEME_PRESETS,
    FONT_PRESETS,
    ACCENT_PALETTES,
    ThemePreset,
    FontPreset
} from "@/lib/themeRegistry";

const BG_PRESETS = [
    { label: "Obsidian Void", hex: "#050505", isLight: false },
    { label: "Pitch Black", hex: "#000000", isLight: false },
    { label: "Carbon Stealth", hex: "#0B0C0E", isLight: false },
    { label: "Midnight Fjord", hex: "#07111E", isLight: false },
    { label: "Cosmic Charcoal", hex: "#0F172A", isLight: false },
    { label: "Royal Mahogany", hex: "#12070D", isLight: false },
    { label: "Gallery White", hex: "#F8FAFC", isLight: true },
    { label: "Desert Parchment", hex: "#FAF8F5", isLight: true }
];

export const Atmospherics = () => {
    useTitle("Themes & Atmospherics");
    const { data, isLoading } = useDashboard();
    const queryClient = useQueryClient();

    const [activeTab, setActiveTab] = useState<"themes" | "fonts" | "custom">("themes");
    const [selectedCategory, setSelectedCategory] = useState<string>("All");
    const [selectedFontCategory, setSelectedFontCategory] = useState<string>("All");

    const [selectedThemeId, setSelectedThemeId] = useState("royale");
    const [selectedFont, setSelectedFont] = useState("Syncopate");
    const [customPrimary, setCustomPrimary] = useState("#3ECF8E");
    const [customBg, setCustomBg] = useState("#050505");

    const [loading, setLoading] = useState(false);
    const [isPreviewMode, setIsPreviewMode] = useState(false);

    useEffect(() => {
        if (data?.profile?.theme) {
            const savedTheme = data.profile.theme;
            if (savedTheme.id) setSelectedThemeId(savedTheme.id);
            if (savedTheme.font) setSelectedFont(savedTheme.font);
            if (savedTheme.primary) setCustomPrimary(savedTheme.primary);
            if (savedTheme.bg) setCustomBg(savedTheme.bg);
        }
    }, [data?.profile?.id]);

    // Lock background page scroll while Live Preview modal is active
    useEffect(() => {
        if (isPreviewMode) {
            const originalOverflow = document.body.style.overflow;
            document.body.style.overflow = "hidden";
            return () => {
                document.body.style.overflow = originalOverflow;
            };
        }
    }, [isPreviewMode]);

    const handleSelectPreset = (preset: ThemePreset) => {
        setSelectedThemeId(preset.id);
        setSelectedFont(preset.font);
        setCustomPrimary(preset.primary);
        setCustomBg(preset.bg);
    };

    const currentStagedTheme = useMemo(() => {
        const base = THEME_PRESETS.find(t => t.id === selectedThemeId) || THEME_PRESETS[0];
        const isLight = customBg === "#F8FAFC" || customBg === "#FAF8F5" || customBg === "#FFFDF5" || base.isLight;
        return {
            ...base,
            id: selectedThemeId,
            name: base.name,
            primary: customPrimary || base.primary,
            bg: customBg || base.bg,
            font: selectedFont || base.font,
            isLight
        };
    }, [selectedThemeId, customPrimary, customBg, selectedFont]);

    const isDirty = useMemo(() => {
        const saved = data?.profile?.theme;
        if (!saved) return true;
        return (
            saved.id !== selectedThemeId ||
            saved.primary !== customPrimary ||
            saved.bg !== customBg ||
            saved.font !== selectedFont
        );
    }, [data?.profile?.theme, selectedThemeId, customPrimary, customBg, selectedFont]);

    const handleUpdateTheme = async () => {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Unauthorized");

            const { error } = await supabase.from("profiles").update({
                theme: currentStagedTheme,
                updated_at: new Date().toISOString()
            }).eq("id", user.id);

            if (error) throw error;

            toast.success("Atmospheric configuration and typography saved.");
            queryClient.invalidateQueries({ queryKey: ["dashboard-data"] });
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const filteredThemes = useMemo(() => {
        if (selectedCategory === "All") return THEME_PRESETS;
        return THEME_PRESETS.filter(t => t.tag === selectedCategory);
    }, [selectedCategory]);

    const filteredFonts = useMemo(() => {
        if (selectedFontCategory === "All") return FONT_PRESETS;
        return FONT_PRESETS.filter(f => f.category === selectedFontCategory);
    }, [selectedFontCategory]);

    if (isLoading) {
        return (
            <div className="h-[80vh] flex flex-col items-center justify-center gap-6">
                <Loader2 className="animate-spin text-luxury-gold" size={48} />
                <p className="text-white/20 font-syncopate uppercase tracking-[0.5em] text-[10px]">
                    Initializing Atmosphere Matrix...
                </p>
            </div>
        );
    }

    const previewUser = {
        ...data?.profile,
        theme: currentStagedTheme,
        ventures: data?.ventures || [],
        socials: data?.socials || [],
        products: data?.products || []
    };

    return (
        <div className="min-h-[calc(100vh-100px)] flex flex-col">
            {/* Ambient Background Aura */}
            <div
                className="fixed top-0 left-0 w-[550px] h-[550px] blur-[160px] -ml-48 -mt-48 pointer-events-none transition-colors duration-1000 z-0"
                style={{ backgroundColor: `${currentStagedTheme.primary}18` }}
            />

            {/* Header Section */}
            <header className="mb-10 relative z-10 px-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="px-3.5 py-1.5 bg-white/[0.03] border border-white/5 rounded-full flex items-center gap-2 backdrop-blur-md">
                                <Palette size={12} style={{ color: currentStagedTheme.primary }} />
                                <span className="text-[10px] font-syncopate uppercase tracking-widest text-white/50">
                                    Aesthetic Studio
                                </span>
                            </div>
                            <div className="px-3 py-1 bg-white/[0.02] border border-white/5 rounded-full flex items-center gap-2">
                                <span className="text-[9px] font-syncopate text-white/40 uppercase tracking-wider">
                                    Font: {selectedFont}
                                </span>
                            </div>
                        </div>

                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-syncopate font-bold uppercase tracking-tighter leading-none text-white">
                            Atmosphere<span style={{ color: currentStagedTheme.primary }}>.</span>
                        </h1>
                        <p className="text-white/30 font-plus text-base mt-4 max-w-xl leading-relaxed italic">
                            Curated haute couture aesthetics, independent typography, and bespoke sovereign palettes.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <Button
                            variant="outline"
                            onClick={() => setIsPreviewMode(true)}
                            className="bg-white/5 border-white/10 hover:border-luxury-gold/50 text-[10px] font-syncopate tracking-widest uppercase py-5 px-7 rounded-2xl gap-2.5 transition-all duration-300 h-auto"
                        >
                            <Eye size={15} /> Live Preview
                        </Button>
                        <Button
                            onClick={handleUpdateTheme}
                            disabled={loading || !isDirty}
                            className="py-5 px-8 text-[10px] tracking-[0.3em] uppercase font-syncopate transition-all duration-500 shadow-2xl rounded-2xl h-auto relative overflow-hidden group border"
                            style={{
                                background: isDirty
                                    ? `linear-gradient(135deg, ${currentStagedTheme.primary}, #FFFFFF)`
                                    : "rgba(255,255,255,0.05)",
                                color: isDirty ? "#000000" : "rgba(255,255,255,0.3)",
                                borderColor: isDirty ? currentStagedTheme.primary : "transparent"
                            }}
                        >
                            {loading ? <Loader2 className="animate-spin mr-2" size={15} /> : <Save className="mr-2" size={15} />}
                            {isDirty ? "Save Atmosphere" : "Atmosphere Saved"}
                        </Button>
                    </div>
                </div>

                {/* Sub-Navigation Tabs */}
                <div className="flex items-center gap-2 mt-10 p-1.5 bg-neutral-900/60 border border-white/5 rounded-2xl w-fit backdrop-blur-xl">
                    <button
                        type="button"
                        onClick={() => setActiveTab("themes")}
                        className={cn(
                            "flex items-center gap-2 px-5 py-2.5 rounded-xl text-[9px] md:text-[10px] font-syncopate uppercase tracking-widest transition-all duration-300",
                            activeTab === "themes"
                                ? "bg-white/10 text-white shadow-lg border border-white/10"
                                : "text-white/40 hover:text-white"
                        )}
                    >
                        <Palette size={13} style={{ color: activeTab === "themes" ? currentStagedTheme.primary : undefined }} />
                        <span>Curated Themes ({THEME_PRESETS.length})</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab("fonts")}
                        className={cn(
                            "flex items-center gap-2 px-5 py-2.5 rounded-xl text-[9px] md:text-[10px] font-syncopate uppercase tracking-widest transition-all duration-300",
                            activeTab === "fonts"
                                ? "bg-white/10 text-white shadow-lg border border-white/10"
                                : "text-white/40 hover:text-white"
                        )}
                    >
                        <Type size={13} style={{ color: activeTab === "fonts" ? currentStagedTheme.primary : undefined }} />
                        <span>Typography ({FONT_PRESETS.length})</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab("custom")}
                        className={cn(
                            "flex items-center gap-2 px-5 py-2.5 rounded-xl text-[9px] md:text-[10px] font-syncopate uppercase tracking-widest transition-all duration-300",
                            activeTab === "custom"
                                ? "bg-white/10 text-white shadow-lg border border-white/10"
                                : "text-white/40 hover:text-white"
                        )}
                    >
                        <Sliders size={13} style={{ color: activeTab === "custom" ? currentStagedTheme.primary : undefined }} />
                        <span>Bespoke Shaders</span>
                    </button>
                </div>
            </header>

            {/* Main Studio Viewport */}
            <div className="flex-1 px-4 pb-16 relative z-10">
                {/* TAB 1: CURATED THEMES */}
                {activeTab === "themes" && (
                    <div className="space-y-8">
                        {/* Filter Categories */}
                        <div className="flex flex-wrap items-center gap-2">
                            {["All", "Haute Luxury", "High Tech", "Monolith Dark", "Editorial Light", "Avant-Garde"].map((cat) => {
                                const isSel = selectedCategory === cat;
                                return (
                                    <button
                                        key={cat}
                                        type="button"
                                        onClick={() => setSelectedCategory(cat)}
                                        className={cn(
                                            "px-4 py-2 rounded-full text-[9px] font-syncopate uppercase tracking-wider transition-all duration-300 border",
                                            isSel
                                                ? "bg-white text-black border-white shadow-md font-bold"
                                                : "bg-white/[0.02] border-white/5 text-white/40 hover:text-white hover:border-white/20"
                                        )}
                                    >
                                        {cat}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Theme Cards Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredThemes.map((theme) => {
                                const isCurrent = selectedThemeId === theme.id;
                                const isLiveActive = data?.profile?.theme?.id === theme.id;

                                return (
                                    <motion.div
                                        key={theme.id}
                                        whileHover={{ y: -4, transition: { duration: 0.2 } }}
                                        onClick={() => handleSelectPreset(theme)}
                                        className={cn(
                                            "cursor-pointer group relative rounded-[2rem] p-5 border transition-all duration-300 flex flex-col justify-between overflow-hidden",
                                            isCurrent
                                                ? "bg-neutral-900/90 shadow-2xl"
                                                : "bg-[#090909]/80 border-white/5 hover:border-white/15"
                                        )}
                                        style={{
                                            borderColor: isCurrent ? theme.primary : undefined,
                                            boxShadow: isCurrent ? `0 20px 40px -15px ${theme.primary}30` : undefined
                                        }}
                                    >
                                        {/* Subtle Ambient Color Bloom */}
                                        <div
                                            className="absolute -top-16 -right-16 w-36 h-36 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none"
                                            style={{ backgroundColor: theme.primary }}
                                        />

                                        <div>
                                            {/* Tag & Status Row */}
                                            <div className="flex items-center justify-between mb-4">
                                                <span className="text-[8px] font-syncopate uppercase tracking-widest px-2.5 py-1 rounded-full border border-white/5 bg-white/[0.02] text-white/50">
                                                    {theme.tag}
                                                </span>
                                                {isLiveActive && (
                                                    <span className="text-[7.5px] font-syncopate text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                                        Active
                                                    </span>
                                                )}
                                            </div>

                                            {/* Mini Visual Swatch Frame */}
                                            <div
                                                className="h-28 rounded-2xl p-4 mb-4 flex flex-col justify-between border relative overflow-hidden transition-transform duration-300 group-hover:scale-[1.02]"
                                                style={{
                                                    backgroundColor: theme.bg,
                                                    borderColor: isCurrent ? `${theme.primary}40` : "rgba(255,255,255,0.06)"
                                                }}
                                            >
                                                {/* Mini Background Aura */}
                                                <div
                                                    className="absolute -top-10 -right-10 w-24 h-24 rounded-full blur-xl opacity-30"
                                                    style={{ backgroundColor: theme.primary }}
                                                />

                                                <div className="flex justify-between items-start relative z-10">
                                                    <div className="flex items-center gap-1.5">
                                                        <div
                                                            className="w-3.5 h-3.5 rounded-full shadow-sm"
                                                            style={{ backgroundColor: theme.primary }}
                                                        />
                                                        <div
                                                            className="w-3.5 h-3.5 rounded-full opacity-30"
                                                            style={{ backgroundColor: theme.primary }}
                                                        />
                                                    </div>
                                                    <span
                                                        className="text-[9px] font-bold uppercase tracking-wider"
                                                        style={{ color: theme.isLight ? "#111" : "#FFF" }}
                                                    >
                                                        {theme.isLight ? <Sun size={13} className="text-amber-500" /> : <Moon size={13} className="text-white/40" />}
                                                    </span>
                                                </div>

                                                <div className="relative z-10">
                                                    <div
                                                        className="text-lg font-bold uppercase tracking-tight truncate leading-none"
                                                        style={{
                                                            fontFamily: theme.font,
                                                            color: theme.isLight ? "#111" : "#FFF"
                                                        }}
                                                    >
                                                        {theme.name}
                                                    </div>
                                                    <p
                                                        className="text-[8px] font-syncopate uppercase tracking-widest mt-1 opacity-50 truncate"
                                                        style={{ color: theme.isLight ? "#333" : "#FFF" }}
                                                    >
                                                        {theme.font}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Theme Description */}
                                            <p className="text-xs text-white/40 font-plus italic line-clamp-2 mb-4 leading-relaxed">
                                                {theme.description}
                                            </p>
                                        </div>

                                        {/* Select Action Bar */}
                                        <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                                            <span className="text-[8px] font-syncopate uppercase tracking-wider text-white/30">
                                                Primary: {theme.primary}
                                            </span>
                                            <div
                                                className={cn(
                                                    "w-6 h-6 rounded-full flex items-center justify-center border transition-all duration-300",
                                                    isCurrent
                                                        ? "border-emerald-500 bg-emerald-500/20 text-emerald-400"
                                                        : "border-white/10 text-white/20 group-hover:border-white/30"
                                                )}
                                            >
                                                {isCurrent ? <Check size={12} /> : <div className="w-1.5 h-1.5 rounded-full bg-white/20" />}
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* TAB 2: INDEPENDENT TYPOGRAPHY STUDIO */}
                {activeTab === "fonts" && (
                    <div className="space-y-8">
                        {/* Font Categories */}
                        <div className="flex flex-wrap items-center gap-2">
                            {["All", "Display", "Sans-Serif", "Editorial Serif", "Monospace"].map((cat) => {
                                const isSel = selectedFontCategory === cat;
                                return (
                                    <button
                                        key={cat}
                                        type="button"
                                        onClick={() => setSelectedFontCategory(cat)}
                                        className={cn(
                                            "px-4 py-2 rounded-full text-[9px] font-syncopate uppercase tracking-wider transition-all duration-300 border",
                                            isSel
                                                ? "bg-white text-black border-white shadow-md font-bold"
                                                : "bg-white/[0.02] border-white/5 text-white/40 hover:text-white hover:border-white/20"
                                        )}
                                    >
                                        {cat}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Typography Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredFonts.map((font) => {
                                const isSelected = selectedFont === font.family;

                                return (
                                    <motion.div
                                        key={font.id}
                                        whileHover={{ y: -4, transition: { duration: 0.2 } }}
                                        onClick={() => setSelectedFont(font.family)}
                                        className={cn(
                                            "cursor-pointer group relative rounded-[2rem] p-6 border transition-all duration-300 flex flex-col justify-between overflow-hidden",
                                            isSelected
                                                ? "bg-neutral-900/90 shadow-2xl"
                                                : "bg-[#090909]/80 border-white/5 hover:border-white/15"
                                        )}
                                        style={{
                                            borderColor: isSelected ? currentStagedTheme.primary : undefined,
                                            boxShadow: isSelected ? `0 20px 40px -15px ${currentStagedTheme.primary}30` : undefined
                                        }}
                                    >
                                        <div>
                                            <div className="flex items-center justify-between mb-4">
                                                <span className="text-[8px] font-syncopate uppercase tracking-widest px-2.5 py-1 rounded-full border border-white/5 bg-white/[0.02] text-white/50">
                                                    {font.category}
                                                </span>
                                                {isSelected && (
                                                    <span
                                                        className="text-[8px] font-syncopate uppercase tracking-widest flex items-center gap-1.5"
                                                        style={{ color: currentStagedTheme.primary }}
                                                    >
                                                        <CheckCircle2 size={12} /> Staged
                                                    </span>
                                                )}
                                            </div>

                                            {/* Font Specimen Preview */}
                                            <div className="p-5 rounded-2xl bg-black/40 border border-white/5 mb-4 space-y-2">
                                                <h3
                                                    className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white truncate"
                                                    style={{ fontFamily: font.family }}
                                                >
                                                    {font.name}
                                                </h3>
                                                <p
                                                    className="text-sm text-white/60 tracking-wide line-clamp-1"
                                                    style={{ fontFamily: font.family }}
                                                >
                                                    {font.sampleText}
                                                </p>
                                                <p
                                                    className="text-[11px] text-white/30 italic"
                                                    style={{ fontFamily: font.family }}
                                                >
                                                    The quick brown fox jumps over sovereign architecture.
                                                </p>
                                            </div>

                                            <p className="text-xs text-white/40 font-plus italic line-clamp-2 mb-4 leading-relaxed">
                                                {font.description}
                                            </p>
                                        </div>

                                        <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                                            <span className="text-[8px] font-syncopate uppercase tracking-wider text-white/30">
                                                Family: {font.family}
                                            </span>
                                            <button
                                                type="button"
                                                className={cn(
                                                    "px-3 py-1 rounded-full text-[8px] font-syncopate uppercase tracking-wider transition-all",
                                                    isSelected
                                                        ? "bg-white text-black font-bold"
                                                        : "border border-white/10 text-white/50 group-hover:border-white/30"
                                                )}
                                            >
                                                {isSelected ? "Selected" : "Pair Font"}
                                            </button>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* TAB 3: BESPOKE SHADERS & CUSTOM COLOR MATRIX */}
                {activeTab === "custom" && (
                    <div className="max-w-4xl space-y-10">
                        {/* Accent Color Matrix */}
                        <div className="p-8 rounded-[2.5rem] bg-[#090909] border border-white/5 space-y-6">
                            <div>
                                <span className="text-[10px] font-syncopate uppercase tracking-[0.3em] text-white/40 block mb-2">
                                    Primary Accent Palette
                                </span>
                                <h3 className="text-2xl font-syncopate font-bold uppercase text-white tracking-tight">
                                    Brand Glow Frequency<span style={{ color: currentStagedTheme.primary }}>.</span>
                                </h3>
                                <p className="text-xs text-white/40 font-plus mt-1 italic">
                                    Pick from sovereign curation or input any custom hex code to match your firm's visual identity.
                                </p>
                            </div>

                            {/* Preset Swatches */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                                {ACCENT_PALETTES.map((swatch) => {
                                    const isSel = customPrimary.toLowerCase() === swatch.hex.toLowerCase();
                                    return (
                                        <button
                                            key={swatch.hex}
                                            type="button"
                                            onClick={() => setCustomPrimary(swatch.hex)}
                                            className={cn(
                                                "p-3 rounded-2xl border transition-all duration-300 flex flex-col items-center gap-2 group text-left",
                                                isSel
                                                    ? "bg-white/10 border-white/30 shadow-lg scale-105"
                                                    : "bg-white/[0.02] border-white/5 hover:border-white/15"
                                            )}
                                        >
                                            <div
                                                className="w-7 h-7 rounded-full shadow-md relative flex items-center justify-center transition-transform group-hover:scale-110"
                                                style={{ backgroundColor: swatch.hex }}
                                            >
                                                {isSel && <Check size={12} className="text-black" />}
                                            </div>
                                            <span className="text-[8px] font-syncopate uppercase tracking-widest text-white/60 text-center truncate w-full">
                                                {swatch.label}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Custom Hex Picker Input */}
                            <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                                <label className="text-[9px] font-syncopate uppercase tracking-wider text-white/40">
                                    Custom Hex:
                                </label>
                                <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 bg-black">
                                    <div
                                        className="w-5 h-5 rounded-full border border-white/20"
                                        style={{ backgroundColor: customPrimary }}
                                    />
                                    <input
                                        type="text"
                                        value={customPrimary}
                                        onChange={(e) => setCustomPrimary(e.target.value)}
                                        className="bg-transparent text-sm font-mono uppercase text-white focus:outline-none w-28"
                                        placeholder="#3ECF8E"
                                        maxLength={7}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Background Canvas Mode */}
                        <div className="p-8 rounded-[2.5rem] bg-[#090909] border border-white/5 space-y-6">
                            <div>
                                <span className="text-[10px] font-syncopate uppercase tracking-[0.3em] text-white/40 block mb-2">
                                    Canvas Density
                                </span>
                                <h3 className="text-2xl font-syncopate font-bold uppercase text-white tracking-tight">
                                    Atmospheric Substrate<span style={{ color: currentStagedTheme.primary }}>.</span>
                                </h3>
                                <p className="text-xs text-white/40 font-plus mt-1 italic">
                                    Select the underlying spatial substrate: deep obsidian dark or curated high-key editorial light.
                                </p>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                {BG_PRESETS.map((bg) => {
                                    const isSel = customBg === bg.hex;
                                    return (
                                        <button
                                            key={bg.hex}
                                            type="button"
                                            onClick={() => setCustomBg(bg.hex)}
                                            className={cn(
                                                "p-4 rounded-2xl border transition-all duration-300 flex flex-col justify-between h-28 text-left group",
                                                isSel
                                                    ? "border-white/40 shadow-xl scale-[1.02]"
                                                    : "border-white/5 hover:border-white/20"
                                            )}
                                            style={{ backgroundColor: bg.hex }}
                                        >
                                            <div className="flex justify-between items-start">
                                                <span
                                                    className="text-[8px] font-syncopate uppercase tracking-widest px-2 py-0.5 rounded-full border"
                                                    style={{
                                                        borderColor: bg.isLight ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)",
                                                        color: bg.isLight ? "#111" : "#FFF"
                                                    }}
                                                >
                                                    {bg.isLight ? "Light" : "Dark"}
                                                </span>
                                                {isSel && (
                                                    <div
                                                        className="w-5 h-5 rounded-full flex items-center justify-center"
                                                        style={{
                                                            backgroundColor: bg.isLight ? "#000" : "#FFF",
                                                            color: bg.isLight ? "#FFF" : "#000"
                                                        }}
                                                    >
                                                        <Check size={11} />
                                                    </div>
                                                )}
                                            </div>

                                            <div
                                                className="text-xs font-syncopate uppercase font-bold tracking-wider"
                                                style={{ color: bg.isLight ? "#111" : "#FFF" }}
                                            >
                                                {bg.label}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Neural Fullscreen Live Preview Modal */}
            <AnimatePresence>
                {isPreviewMode && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        data-lenis-prevent
                        className="fixed inset-0 z-[100] bg-black flex flex-col h-screen w-screen overflow-hidden select-none"
                    >
                        {/* Preview Top Bar */}
                        <div className="h-16 md:h-20 bg-black/90 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-4 sm:px-8 shrink-0 relative z-[110]">
                            <div className="flex items-center gap-3">
                                <div className="p-2 border border-white/10 rounded-xl bg-white/[0.02]">
                                    <Monitor size={16} className="text-white/60" />
                                </div>
                                <div>
                                    <h2 className="text-[10px] font-syncopate font-bold text-white uppercase tracking-widest">
                                        Atmospheric Live Preview
                                    </h2>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="text-[8px] font-syncopate text-white/40 tracking-[0.2em] uppercase">
                                            {currentStagedTheme.name} • {selectedFont} • Shaders Active
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => setIsPreviewMode(false)}
                                className="w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center bg-white/5 hover:bg-red-500/20 text-white/50 hover:text-red-400 transition-all duration-300"
                                title="Close Preview"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Mobile/Tablet Horizontal Preset Switcher Bar */}
                        <div
                            data-lenis-prevent
                            className="lg:hidden px-4 py-2.5 border-b border-white/10 bg-[#080808] flex items-center gap-2 overflow-x-auto custom-scrollbar shrink-0"
                        >
                            <span className="text-[8px] font-syncopate uppercase tracking-widest text-white/30 shrink-0 mr-1">
                                Presets:
                            </span>
                            {THEME_PRESETS.map((t) => (
                                <button
                                    key={t.id}
                                    type="button"
                                    onClick={() => handleSelectPreset(t)}
                                    className={cn(
                                        "px-3 py-1.5 rounded-full text-[8.5px] font-syncopate uppercase tracking-wider shrink-0 flex items-center gap-1.5 border transition-all",
                                        selectedThemeId === t.id
                                            ? "bg-white/15 border-white/30 text-white shadow-sm"
                                            : "border-white/5 text-white/40 hover:text-white"
                                    )}
                                >
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: t.primary }} />
                                    <span>{t.name.split(" ")[0]}</span>
                                </button>
                            ))}
                        </div>

                        {/* Split Stage Area */}
                        <div className="flex-1 min-h-0 h-full overflow-hidden relative bg-[#020202] flex">
                            {/* Live Theme Switcher Sidebar (Desktop) */}
                            <div
                                data-lenis-prevent
                                className="w-80 h-full min-h-0 shrink-0 border-r border-white/5 bg-[#050505] hidden lg:flex flex-col p-6 space-y-4"
                            >
                                <div className="flex items-center justify-between shrink-0">
                                    <h3 className="text-[9px] font-syncopate text-white/40 uppercase tracking-[0.25em]">
                                        Switch Presets
                                    </h3>
                                    <span className="text-[8px] font-syncopate text-white/20">
                                        {THEME_PRESETS.length} Themes
                                    </span>
                                </div>
                                <div
                                    data-lenis-prevent
                                    className="flex-1 min-h-0 overflow-y-auto overscroll-contain space-y-2 pr-1 custom-scrollbar"
                                >
                                    {THEME_PRESETS.map((t) => (
                                        <button
                                            key={t.id}
                                            type="button"
                                            onClick={() => handleSelectPreset(t)}
                                            className={cn(
                                                "w-full text-left p-3.5 rounded-xl border transition-all duration-300 flex items-center justify-between group",
                                                selectedThemeId === t.id
                                                    ? "bg-white/10 border-white/25 shadow-lg"
                                                    : "bg-transparent border-transparent hover:bg-white/[0.02]"
                                            )}
                                        >
                                            <div className="flex items-center gap-2.5 min-w-0">
                                                <div
                                                    className="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm"
                                                    style={{ backgroundColor: t.primary }}
                                                />
                                                <div className="min-w-0">
                                                    <span className="text-xs font-bold uppercase tracking-tight text-white truncate block">
                                                        {t.name}
                                                    </span>
                                                    <span className="text-[8px] font-syncopate uppercase tracking-widest text-white/30 truncate block">
                                                        {t.font}
                                                    </span>
                                                </div>
                                            </div>
                                            {selectedThemeId === t.id && (
                                                <Check size={13} style={{ color: t.primary }} className="shrink-0" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Live Profile Viewport - Full genuine scrollable container with Lenis prevention */}
                            <div
                                data-lenis-prevent
                                className="flex-1 min-h-0 h-full overflow-y-auto overscroll-y-contain relative custom-scrollbar bg-[#020202]"
                            >
                                <div className="min-h-full w-full">
                                    <ProfileView
                                        user={previewUser}
                                        isPreview={false}
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
export default Atmospherics;
