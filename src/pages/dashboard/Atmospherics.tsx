import { useState, useEffect } from "react";
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
    X
} from "lucide-react";
import { useDashboard } from "@/hooks/useDashboard";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { ProfileView } from "@/components/profile/ProfileView";
import { cn } from "@/lib/utils";

const themes = [
    {
        id: "royale",
        name: "Obsidian Royale",
        primary: "#D4AF37",
        bg: "#050505",
        font: "Syncopate",
        preview: "bg-[#050505] border-luxury-gold/50"
    },
    {
        id: "etheric",
        name: "Etheric White",
        primary: "#3B82F6",
        bg: "#F8FAFC",
        font: "Plus Jakarta Sans",
        preview: "bg-[#F8FAFC] border-blue-500/50"
    },
    {
        id: "nebula",
        name: "Nebula Core",
        primary: "#C084FC",
        bg: "#0F172A",
        font: "Outfit",
        preview: "bg-[#0F172A] border-purple-500/50"
    },
    {
        id: "matrix",
        name: "Matrix Grids",
        primary: "#10B981",
        bg: "#020617",
        font: "Syncopate",
        preview: "bg-[#020617] border-emerald-500/50"
    },
    {
        id: "emerald",
        name: "Emerald Vault",
        primary: "#10B981",
        bg: "#062016",
        font: "Cormorant Garamond",
        preview: "bg-[#062016] border-emerald-500/50"
    },
    {
        id: "velvet",
        name: "Midnight Velvet",
        primary: "#A855F7",
        bg: "#120B1E",
        font: "Playfair Display",
        preview: "bg-[#120B1E] border-purple-500/50"
    },
    {
        id: "champagne",
        name: "Champagne Noir",
        primary: "#F5F5DC",
        bg: "#0A0A0A",
        font: "Bodoni Moda",
        preview: "bg-[#0A0A0A] border-gray-400/50"
    },
    {
        id: "ivory",
        name: "Antique Ivory",
        primary: "#8B4513",
        bg: "#FFFDF5",
        font: "Cinzel",
        preview: "bg-[#FFFDF5] border-amber-900/40"
    }
];

const Atmospherics = () => {
    useTitle("Themes");
    const { data, isLoading } = useDashboard();
    const [selectedThemeId, setSelectedThemeId] = useState("royale");
    const [loading, setLoading] = useState(false);
    const [isPreviewMode, setIsPreviewMode] = useState(false);
    const queryClient = useQueryClient();

    useEffect(() => {
        if (data?.profile?.theme?.id) {
            setSelectedThemeId(data.profile.theme.id);
        }
    }, [data?.profile?.id]);

    const handleUpdateTheme = async () => {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Unauthorized");

            const selectedTheme = themes.find(t => t.id === selectedThemeId);

            const { error } = await supabase.from("profiles").update({
                theme: selectedTheme,
                updated_at: new Date().toISOString()
            }).eq("id", user.id);

            if (error) throw error;

            toast.success("Theme configuration saved.");
            queryClient.invalidateQueries({ queryKey: ["dashboard-data"] });
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="h-[80vh] flex flex-col items-center justify-center gap-6">
                <Loader2 className="animate-spin text-luxury-gold" size={48} />
                <p className="text-white/20 font-syncopate uppercase tracking-[0.5em] text-[10px]">Loading Aesthetic Matrix...</p>
            </div>
        );
    }

    const currentStagedTheme = themes.find(t => t.id === selectedThemeId) || themes[0];
    const previewUser = {
        ...data?.profile,
        theme: currentStagedTheme,
        ventures: data?.ventures || [],
        socials: data?.socials || [],
        products: data?.products || []
    };

    return (
        <div className="min-h-[calc(100vh-100px)] flex flex-col">
            <header className="mb-12 relative px-4">
                <div className="absolute top-0 left-0 w-[500px] h-[500px] blur-[150px] -ml-48 -mt-48 pointer-events-none transition-colors duration-1000" style={{ backgroundColor: `${currentStagedTheme.primary}15` }} />

                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
                    <div>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="px-4 py-1.5 bg-white/[0.03] border border-white/5 rounded-full flex items-center gap-2 backdrop-blur-md">
                                <Palette size={12} style={{ color: currentStagedTheme.primary }} />
                                <span className="text-[10px] font-syncopate uppercase tracking-widest text-white/40">Appearance</span>
                            </div>
                        </div>
                        <h1 className="text-6xl font-syncopate font-bold uppercase tracking-tighter leading-none text-white">
                            Themes<span style={{ color: currentStagedTheme.primary }}>.</span>
                        </h1>
                        <p className="text-white/20 font-plus text-lg mt-6 max-w-xl leading-relaxed italic">
                            Customize your digital profile with high-fidelity visual templates.
                        </p>
                    </div>

                    <div className="flex gap-4">
                        <Button
                            variant="outline"
                            onClick={() => setIsPreviewMode(true)}
                            className="bg-white/5 border-white/10 hover:border-luxury-gold/50 text-[10px] font-syncopate tracking-widest uppercase py-6 px-10 rounded-2xl gap-3 transition-all duration-500 h-auto"
                        >
                            <Eye size={16} /> Preview
                        </Button>
                        <Button
                            onClick={handleUpdateTheme}
                            variant="luxury"
                            disabled={loading || selectedThemeId === data?.profile?.theme?.id}
                            className="py-6 px-10 text-[10px] tracking-[0.4em] uppercase font-syncopate transition-all duration-1000 shadow-2xl relative overflow-hidden group rounded-2xl h-auto"
                            style={{
                                background: `linear-gradient(to right, ${currentStagedTheme.primary}, #FFFFFF, ${currentStagedTheme.primary})`,
                                backgroundSize: '200% auto',
                                color: 'black'
                            }}
                        >
                            {loading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                            Save Theme
                        </Button>
                    </div>
                </div>
            </header>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 px-8 pb-12">
                {themes.map((theme) => (
                    <motion.div
                        key={theme.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedThemeId(theme.id)}
                        className={cn(
                            "cursor-pointer group relative rounded-[2.5rem] p-4 border  bg-[#080808] overflow-hidden",
                            selectedThemeId === theme.id
                                ? "shadow-[0_0_50px_rgba(0,0,0,0.5)]"
                                : "border-white/5 opacity-60 hover:opacity-100"
                        )}
                        style={{ borderColor: selectedThemeId === theme.id ? theme.primary : 'transparent' }}
                    >
                        {/* High Fidelity Preview Card */}
                        <div className="aspect-[3/4] rounded-[2rem] overflow-hidden relative border border-white/5 transform-gpu isolate">
                            <ProfileView user={{ ...previewUser, theme }} isPreview={true} />

                            {/* Overlay info */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-700" />

                            <div className="absolute bottom-6 left-6 right-6">
                                <div className="flex items-center justify-between">
                                    <h3
                                        className="text-2xl font-bold uppercase tracking-tighter text-white"
                                        style={{ fontFamily: theme.font }}
                                    >
                                        {theme.name}
                                    </h3>
                                    {selectedThemeId === theme.id && (
                                        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/20">
                                            <Check size={14} style={{ color: theme.primary }} />
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center gap-3 mt-3">
                                    <div className="flex gap-1">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.primary }} />
                                        <div className="w-3 h-3 rounded-full opacity-30" style={{ backgroundColor: theme.primary }} />
                                    </div>
                                    <div className="w-px h-3 bg-white/10" />
                                    <span className="text-[8px] font-syncopate text-white/40 uppercase tracking-widest">{theme.font}</span>
                                </div>
                            </div>

                            {/* Applied badge */}
                            {data?.profile?.theme?.id === theme.id && (
                                <div className="absolute top-6 right-6 px-3 py-1 bg-white/10 backdrop-blur-xl border border-white/10 rounded-full flex items-center gap-2">
                                    <div className="w-1 h-1 rounded-full bg-emerald-500 shadow-[0_0_10px_#10B981]" />
                                    <span className="text-[7px] font-syncopate text-white tracking-widest">CURRENTLY ACTIVE</span>
                                </div>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Neural Preview Overlay */}
            <AnimatePresence>
                {isPreviewMode && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black flex flex-col"
                    >
                        <div className="h-20 bg-black/80 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-10 relative z-[110]">
                            <div className="flex items-center gap-4">
                                <div className="p-2 border border-white/10 rounded-xl">
                                    <Monitor size={18} className="text-white/40" />
                                </div>
                                <div>
                                    <h2 className="text-[10px] font-syncopate font-bold text-white uppercase tracking-widest">Full Preview</h2>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="text-[8px] font-syncopate text-white/20 tracking-[0.2em] uppercase uppercase">Real-time Shaders Active</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => setIsPreviewMode(false)}
                                className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 hover:bg-red-500/20 text-white/40 hover:text-red-500 transition-all duration-300"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-hidden relative bg-[#020202] flex">
                            {/* Theme Selector Sidebar */}
                            <div className="w-80 border-r border-white/5 bg-[#050505] hidden md:flex flex-col overflow-y-auto custom-scrollbar">
                                <div className="p-6">
                                    <h3 className="text-[9px] font-syncopate text-white/40 uppercase tracking-[0.2em] mb-4">Theme Options</h3>
                                    <div className="space-y-3">
                                        {themes.map((theme) => (
                                            <button
                                                key={theme.id}
                                                onClick={() => setSelectedThemeId(theme.id)}
                                                className={cn(
                                                    "w-full text-left p-4 rounded-xl border transition-all duration-300 group relative overflow-hidden",
                                                    selectedThemeId === theme.id
                                                        ? "bg-white/5 border-white/10"
                                                        : "bg-transparent border-transparent hover:bg-white/[0.02]"
                                                )}
                                            >
                                                <div className="flex items-center justify-between mb-2 relative z-10">
                                                    <span className={cn(
                                                        "text-xs font-bold uppercase tracking-tight transition-colors",
                                                        selectedThemeId === theme.id ? "text-white" : "text-white/40 group-hover:text-white/70"
                                                    )}>
                                                        {theme.name}
                                                    </span>
                                                    {selectedThemeId === theme.id && (
                                                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: theme.primary }} />
                                                    )}
                                                </div>
                                                <div className="text-[8px] font-syncopate text-white/20 uppercase tracking-widest relative z-10">
                                                    {theme.font}
                                                </div>
                                                {selectedThemeId === theme.id && (
                                                    <div
                                                        className="absolute inset-0 opacity-10"
                                                        style={{ background: `linear-gradient(90deg, transparent, ${theme.primary})` }}
                                                    />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Preview Area */}
                            <div className="flex-1 relative bg-[#020202] h-full overflow-y-auto overscroll-y-contain" data-lenis-prevent>
                                <motion.div
                                    layout
                                    className="mx-auto min-h-full bg-[#050505] relative shadow-[0_0_100px_rgba(0,0,0,1)] transition-all duration-500 w-full"
                                >
                                    <div className="h-full">
                                        <ProfileView user={previewUser} isPreview={false} />
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Atmospherics;
