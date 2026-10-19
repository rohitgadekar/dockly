import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
    Plus,
    Trash2,
    Edit3,
    Loader2,
    Save,
    Cpu,
    Sparkles,
    X,
    Check,
    Code2,
    Layers,
    Server,
    Cloud,
    Brain,
    Wrench,
    Search,
    Shield
} from "lucide-react";
import { useDashboard } from "@/hooks/useDashboard";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { DeleteDialog } from "@/components/ui/DeleteDialog";
import { LuxeSelect } from "@/components/ui/LuxeSelect";
import { useTitle } from "@/hooks/useTitle";
import { TECH_PRESETS, getTechIconInfo, TechPreset } from "@/lib/techIcons";

interface Skill {
    id: string;
    name: string;
    category?: string;
    proficiency?: string;
    icon_key?: string;
    color?: string;
    years_exp?: string;
    order_index?: number;
}

const CATEGORY_OPTIONS = [
    { label: "Languages", icon: Code2 },
    { label: "Frontend", icon: Layers },
    { label: "Backend", icon: Server },
    { label: "Cloud", icon: Cloud },
    { label: "AI & Data", icon: Brain },
    { label: "Tools", icon: Wrench },
];

const categorySelectOptions = CATEGORY_OPTIONS.map((c) => {
    const Icon = c.icon;
    return {
        value: c.label,
        label: c.label,
        icon: <Icon size={16} className="text-luxury-gold" />,
    };
});

const PROFICIENCY_OPTIONS = [
    { value: "Principal", label: "Principal (10+ yrs / Architecture)" },
    { value: "Advanced", label: "Advanced (Production Veteran)" },
    { value: "Proficient", label: "Proficient (Production Ready)" },
    { value: "Familiar", label: "Familiar (Exploration / Working Knowledge)" },
];

export const Skills = () => {
    useTitle("Engineering Arsenal & Tech Stack");
    const { data, isLoading } = useDashboard();
    const queryClient = useQueryClient();

    const skills: Skill[] = data?.skills || [];

    const [isAddOpen, setIsAddOpen] = useState(false);
    const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<Skill | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Form State
    const [name, setName] = useState("");
    const [category, setCategory] = useState("Languages");
    const [proficiency, setProficiency] = useState("Advanced");
    const [yearsExp, setYearsExp] = useState("");
    const [iconKey, setIconKey] = useState("");
    const [color, setColor] = useState("#D4AF37");

    // Filter & Search
    const [activeFilter, setActiveFilter] = useState("All");
    const [presetSearch, setPresetSearch] = useState("");

    const resetForm = () => {
        setName("");
        setCategory("Languages");
        setProficiency("Advanced");
        setYearsExp("");
        setIconKey("");
        setColor("#D4AF37");
        setEditingSkill(null);
    };

    const openEdit = (skill: Skill) => {
        setEditingSkill(skill);
        setName(skill.name);
        setCategory(skill.category || "Languages");
        setProficiency(skill.proficiency || "Advanced");
        setYearsExp(skill.years_exp || "");
        setIconKey(skill.icon_key || "");
        setColor(skill.color || "#D4AF37");
        setIsAddOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            toast.error("Please enter a technology name");
            return;
        }

        setIsSaving(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Unauthorized");

            const autoInfo = getTechIconInfo(iconKey || name);
            const finalColor = color && color !== "#D4AF37" ? color : autoInfo.color;
            const finalIconKey = iconKey || autoInfo.name.toLowerCase().replace(/[^a-z0-9]/g, "");

            if (editingSkill) {
                const { error } = await supabase
                    .from("skills")
                    .update({
                        name: name.trim(),
                        category,
                        proficiency,
                        years_exp: yearsExp.trim(),
                        icon_key: finalIconKey,
                        color: finalColor,
                    })
                    .eq("id", editingSkill.id);

                if (error) throw error;
                toast.success("Skill calibrated successfully");
            } else {
                const maxOrder = skills.length > 0
                    ? Math.max(...skills.map(s => s.order_index || 0))
                    : 0;

                const { error } = await supabase
                    .from("skills")
                    .insert([{
                        profile_id: user.id,
                        name: name.trim(),
                        category,
                        proficiency,
                        years_exp: yearsExp.trim(),
                        icon_key: finalIconKey,
                        color: finalColor,
                        order_index: maxOrder + 1,
                    }]);

                if (error) throw error;
                toast.success(`${name} vaulted to engineering arsenal`);
            }

            queryClient.invalidateQueries({ queryKey: ["dashboard-data"] });
            if (data?.profile?.username) {
                queryClient.invalidateQueries({ queryKey: ["profile", data.profile.username] });
            }
            setIsAddOpen(false);
            resetForm();
        } catch (err: any) {
            toast.error(err.message || "Failed to save skill");
        } finally {
            setIsSaving(false);
        }
    };

    const handleQuickAdd = async (preset: TechPreset) => {
        const alreadyExists = skills.some(
            s => s.name.toLowerCase() === preset.name.toLowerCase() ||
                 s.icon_key?.toLowerCase() === preset.key.toLowerCase()
        );

        if (alreadyExists) {
            toast.info(`${preset.name} is already deployed in your stack.`);
            return;
        }

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Unauthorized");

            const maxOrder = skills.length > 0
                ? Math.max(...skills.map(s => s.order_index || 0))
                : 0;

            const { error } = await supabase
                .from("skills")
                .insert([{
                    profile_id: user.id,
                    name: preset.name,
                    category: preset.category,
                    proficiency: "Advanced",
                    icon_key: preset.key,
                    color: preset.color,
                    years_exp: "",
                    order_index: maxOrder + 1,
                }]);

            if (error) throw error;
            toast.success(`Deployed ${preset.name} to Arsenal`);
            queryClient.invalidateQueries({ queryKey: ["dashboard-data"] });
            if (data?.profile?.username) {
                queryClient.invalidateQueries({ queryKey: ["profile", data.profile.username] });
            }
        } catch (err: any) {
            toast.error(err.message || "Failed to add preset");
        }
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        setIsDeleting(true);
        try {
            const { error } = await supabase
                .from("skills")
                .delete()
                .eq("id", deleteTarget.id);

            if (error) throw error;
            toast.success("Skill purged from arsenal");
            queryClient.invalidateQueries({ queryKey: ["dashboard-data"] });
            if (data?.profile?.username) {
                queryClient.invalidateQueries({ queryKey: ["profile", data.profile.username] });
            }
            setDeleteTarget(null);
        } catch (err: any) {
            toast.error(err.message || "Failed to delete skill");
        } finally {
            setIsDeleting(false);
        }
    };

    const filteredSkills = activeFilter === "All"
        ? skills
        : skills.filter(s => (s.category || "Languages") === activeFilter);

    const filteredPresets = TECH_PRESETS.filter(p =>
        p.name.toLowerCase().includes(presetSearch.toLowerCase()) ||
        p.category.toLowerCase().includes(presetSearch.toLowerCase())
    );

    const categoriesList = ["All", ...CATEGORY_OPTIONS.map(c => c.label)];

    if (isLoading) {
        return (
            <div className="h-[80vh] flex flex-col items-center justify-center gap-6">
                <Loader2 className="animate-spin text-luxury-gold" size={48} />
                <p className="text-white/20 font-syncopate uppercase tracking-[0.5em] text-[10px]">
                    Accessing Engineering Vault...
                </p>
            </div>
        );
    }

    return (
        <div className="max-w-[1200px] mx-auto space-y-12 py-10 px-4 md:px-6">
            {/* Header */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-8 border-b border-white/5 relative">
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <div className="px-3.5 py-1 bg-white/[0.03] border border-white/5 rounded-full flex items-center gap-2 backdrop-blur-md">
                            <Cpu size={12} className="text-luxury-gold shadow-[0_0_10px_rgba(212,175,55,0.4)]" />
                            <span className="text-[9px] font-syncopate uppercase tracking-widest text-white/40">
                                Technical Arsenal
                            </span>
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-syncopate font-bold uppercase tracking-tight text-white">
                        Tech Stack<span className="text-luxury-gold">.</span>
                    </h1>
                    <p className="text-white/40 font-plus text-base md:text-lg max-w-2xl leading-relaxed italic">
                        Broadcast your core programming languages, frameworks, cloud infrastructure, and architectural proficiencies.
                    </p>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <Button
                        variant="luxury"
                        onClick={() => {
                            resetForm();
                            setIsAddOpen(true);
                        }}
                        className="w-full md:w-auto gap-3 px-8 py-6 rounded-2xl shadow-2xl text-xs tracking-[0.2em] font-syncopate uppercase group"
                    >
                        <Plus size={16} className="group-hover:rotate-90 transition-transform duration-300" />
                        Add Custom Skill
                    </Button>
                </div>
            </header>

            {/* Quick-Add Preset Library */}
            <Card className="p-6 md:p-8 border-white/5 relative overflow-hidden">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Sparkles size={14} className="text-luxury-gold" />
                            <h3 className="text-sm font-syncopate font-bold uppercase tracking-wider text-white">
                                Instant Preset Arsenal
                            </h3>
                        </div>
                        <p className="text-xs text-white/40 font-plus">
                            Tap any technology to instantly deploy it to your public profile with official brand vector icons.
                        </p>
                    </div>

                    <div className="relative w-full md:w-64">
                        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                        <input
                            value={presetSearch}
                            onChange={(e) => setPresetSearch(e.target.value)}
                            placeholder="Filter presets..."
                            className="w-full bg-white/[0.02] border border-white/5 rounded-xl py-2 pl-9 pr-4 text-xs font-plus text-white placeholder-white/20 outline-none focus:border-luxury-gold/40 transition-colors"
                        />
                    </div>
                </div>

                <div className="flex flex-wrap gap-2.5 max-h-56 overflow-y-auto pr-2 scrollbar-none overscroll-contain">
                    {filteredPresets.map((preset) => {
                        const Icon = preset.icon;
                        const isAdded = skills.some(
                            s => s.name.toLowerCase() === preset.name.toLowerCase() ||
                                 s.icon_key?.toLowerCase() === preset.key.toLowerCase()
                        );

                        return (
                            <button
                                key={preset.key}
                                type="button"
                                onClick={() => handleQuickAdd(preset)}
                                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-plus transition-all duration-200 select-none ${
                                    isAdded
                                        ? "bg-white/[0.05] border-white/10 opacity-40 cursor-default"
                                        : "bg-white/[0.02] border-white/5 hover:border-luxury-gold/40 hover:bg-white/[0.04] active:scale-95 cursor-pointer"
                                }`}
                                style={{
                                    boxShadow: isAdded ? "none" : undefined,
                                }}
                            >
                                <Icon size={14} style={{ color: preset.color }} />
                                <span className="text-white/80 font-medium">{preset.name}</span>
                                {isAdded ? (
                                    <Check size={12} className="text-emerald-400 ml-0.5" />
                                ) : (
                                    <Plus size={11} className="text-white/30 ml-0.5" />
                                )}
                            </button>
                        );
                    })}
                </div>
            </Card>

            {/* Active Stack Deck & Domain Filters */}
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-2">
                        {categoriesList.map((cat) => {
                            const isSelected = activeFilter === cat;
                            const count = cat === "All"
                                ? skills.length
                                : skills.filter(s => (s.category || "Languages") === cat).length;

                            return (
                                <button
                                    key={cat}
                                    type="button"
                                    onClick={() => setActiveFilter(cat)}
                                    className={`px-4 py-2 rounded-full text-[10px] font-syncopate uppercase tracking-wider transition-all border ${
                                        isSelected
                                            ? "border-luxury-gold/50 bg-luxury-gold/10 text-luxury-gold shadow-[0_0_15px_rgba(212,175,55,0.15)]"
                                            : "border-white/5 bg-white/[0.01] text-white/40 hover:text-white hover:border-white/10"
                                    }`}
                                >
                                    <span>{cat}</span>
                                    <span className="ml-1.5 opacity-60">({count})</span>
                                </button>
                            );
                        })}
                    </div>

                    <span className="text-[10px] font-syncopate uppercase tracking-widest text-white/30 shrink-0">
                        {skills.length} Deployed
                    </span>
                </div>

                {filteredSkills.length === 0 ? (
                    <Card className="p-16 border-dashed border-white/10 text-center flex flex-col items-center justify-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center text-white/20">
                            <Cpu size={28} />
                        </div>
                        <div>
                            <h4 className="text-base font-syncopate font-bold uppercase tracking-wide text-white">
                                {activeFilter === "All" ? "No Technologies Deployed" : `No ${activeFilter} Skills`}
                            </h4>
                            <p className="text-xs text-white/40 font-plus mt-1 max-w-sm">
                                Tap any preset above or click &quot;Add Custom Skill&quot; to curate your engineering stack.
                            </p>
                        </div>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        <AnimatePresence mode="popLayout">
                            {filteredSkills.map((skill) => {
                                const iconInfo = getTechIconInfo(skill.icon_key || skill.name);
                                const Icon = iconInfo.icon;
                                const brandColor = skill.color || iconInfo.color;

                                return (
                                    <motion.div
                                        key={skill.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className="group relative p-5 rounded-[1.8rem] border border-white/5 bg-white/[0.02] hover:border-white/15 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-lg hover:shadow-2xl"
                                    >
                                        {/* Ambient Hover Bloom */}
                                        <div
                                            className="absolute -top-10 -right-10 w-24 h-24 rounded-full blur-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none"
                                            style={{ backgroundColor: brandColor }}
                                        />

                                        {/* Top: Icon + Actions */}
                                        <div className="flex items-start justify-between gap-3 mb-4 relative z-10">
                                            <div
                                                className="w-12 h-12 rounded-2xl border flex items-center justify-center transition-transform group-hover:scale-110 shrink-0"
                                                style={{
                                                    backgroundColor: `${brandColor}18`,
                                                    borderColor: `${brandColor}40`,
                                                }}
                                            >
                                                <Icon size={24} style={{ color: brandColor }} />
                                            </div>

                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    type="button"
                                                    onClick={() => openEdit(skill)}
                                                    className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-colors"
                                                    title="Edit Skill"
                                                >
                                                    <Edit3 size={13} />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setDeleteTarget(skill)}
                                                    className="p-2 rounded-lg text-red-500/40 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                                                    title="Delete Skill"
                                                >
                                                    <Trash2 size={13} />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Name & Details */}
                                        <div className="relative z-10 space-y-1">
                                            <div className="flex items-center justify-between gap-2">
                                                <h4 className="font-syncopate font-bold text-sm tracking-wide text-white truncate">
                                                    {skill.name}
                                                </h4>
                                                {skill.years_exp && (
                                                    <span className="text-[8px] font-syncopate uppercase tracking-widest px-2 py-0.5 rounded-full border border-white/5 bg-white/[0.02] text-white/60 shrink-0">
                                                        {skill.years_exp}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex items-center justify-between text-[9px] font-syncopate uppercase tracking-wider opacity-40 pt-1">
                                                <span>{skill.category || "Languages"}</span>
                                                <span className="font-semibold" style={{ color: brandColor }}>
                                                    {skill.proficiency || "Advanced"}
                                                </span>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            {/* Custom Skill Modal */}
            <AnimatePresence>
                {isAddOpen && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsAddOpen(false)}
                            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-lg rounded-[2.5rem] border border-white/10 bg-[#0A0A0A] p-8 md:p-10 shadow-2xl z-10 overflow-hidden"
                        >
                            <div className="flex items-center justify-between pb-6 border-b border-white/5 mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-2xl bg-luxury-gold/10 border border-luxury-gold/20 flex items-center justify-center text-luxury-gold">
                                        <Cpu size={20} />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-syncopate font-bold uppercase tracking-wider text-white">
                                            {editingSkill ? "Calibrate Skill" : "Deploy Technology"}
                                        </h3>
                                        <p className="text-[9px] font-syncopate uppercase tracking-widest text-white/30 mt-0.5">
                                            Engineering Arsenal Credentials
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsAddOpen(false)}
                                    className="p-2 rounded-full text-white/40 hover:text-white hover:bg-white/5 transition-colors"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            <form onSubmit={handleSave} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-syncopate uppercase tracking-[0.3em] text-white/40 ml-1">
                                        Technology Name
                                    </label>
                                    <input
                                        required
                                        value={name}
                                        onChange={(e) => {
                                            setName(e.target.value);
                                            if (!editingSkill) {
                                                const info = getTechIconInfo(e.target.value);
                                                if (info && info.name !== "Skill") {
                                                    setColor(info.color);
                                                    setCategory(info.category);
                                                    setIconKey(info.key);
                                                }
                                            }
                                        }}
                                        placeholder="Ex. React, Rust, PyTorch, Kubernetes"
                                        className="w-full bg-white/[0.02] border border-white/10 rounded-2xl py-4 px-5 text-sm text-white font-plus outline-none focus:border-luxury-gold/50 transition-colors"
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-syncopate uppercase tracking-[0.3em] text-white/40 ml-1">
                                            Domain Category
                                        </label>
                                        <LuxeSelect
                                            options={categorySelectOptions}
                                            value={category}
                                            onChange={setCategory}
                                            className="!rounded-2xl"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-syncopate uppercase tracking-[0.3em] text-white/40 ml-1">
                                            Proficiency Level
                                        </label>
                                        <LuxeSelect
                                            options={PROFICIENCY_OPTIONS}
                                            value={proficiency}
                                            onChange={setProficiency}
                                            className="!rounded-2xl"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-syncopate uppercase tracking-[0.3em] text-white/40 ml-1">
                                            Tenure / Experience Badge (Optional)
                                        </label>
                                        <input
                                            value={yearsExp}
                                            onChange={(e) => setYearsExp(e.target.value)}
                                            placeholder="Ex. 6 yrs or Principal"
                                            className="w-full bg-white/[0.02] border border-white/10 rounded-2xl py-4 px-5 text-sm text-white font-plus outline-none focus:border-luxury-gold/50 transition-colors"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-syncopate uppercase tracking-[0.3em] text-white/40 ml-1">
                                            Signature Color
                                        </label>
                                        <div className="flex items-center gap-3 bg-white/[0.02] border border-white/10 rounded-2xl py-3 px-4">
                                            <input
                                                type="color"
                                                value={color}
                                                onChange={(e) => setColor(e.target.value)}
                                                className="w-8 h-8 rounded-lg border-0 bg-transparent cursor-pointer"
                                            />
                                            <span className="text-xs font-mono text-white/60 uppercase">{color}</span>
                                        </div>
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    variant="luxury"
                                    disabled={isSaving}
                                    className="w-full py-6 text-xs tracking-[0.3em] uppercase font-syncopate"
                                >
                                    {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                                    {editingSkill ? "Save Calibration" : "Deploy to Arsenal"}
                                </Button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <DeleteDialog
                isOpen={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleDelete}
                isDeleting={isDeleting}
                title="PURGE TECHNOLOGY"
                description={`Are you sure you want to remove "${deleteTarget?.name}" from your sovereign arsenal?`}
            />
        </div>
    );
};

export default Skills;
