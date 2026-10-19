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
    Compass,
    Sparkles,
    X,
    AlertCircle,
    Copy,
    Check,
    Building2,
    Calendar,
    ArrowUpRight,
    Tag,
    Rocket,
    Award,
    TrendingUp,
    Mic
} from "lucide-react";
import { useDashboard } from "@/hooks/useDashboard";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { DeleteDialog } from "@/components/ui/DeleteDialog";
import { LuxeSelect } from "@/components/ui/LuxeSelect";
import { useTitle } from "@/hooks/useTitle";

interface Milestone {
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

const CATEGORY_OPTIONS = [
    { label: "Milestone", icon: Compass },
    { label: "Venture", icon: Rocket },
    { label: "Honor", icon: Award },
    { label: "Exit", icon: TrendingUp },
    { label: "Keynote", icon: Mic },
    { label: "Investment", icon: Sparkles },
];

const categorySelectOptions = CATEGORY_OPTIONS.map((c) => {
    const Icon = c.icon;
    return {
        value: c.label,
        label: c.label,
        icon: <Icon size={16} className="text-luxury-gold" />
    };
});

const Milestones = () => {
    useTitle("Trajectory");
    const { data, isLoading } = useDashboard();
    const queryClient = useQueryClient();

    const [isAdding, setIsAdding] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [year, setYear] = useState("");
    const [title, setTitle] = useState("");
    const [organization, setOrganization] = useState("");
    const [category, setCategory] = useState("Milestone");
    const [badge, setBadge] = useState("");
    const [url, setUrl] = useState("");
    const [description, setDescription] = useState("");

    const [loading, setLoading] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [copiedSql, setCopiedSql] = useState(false);

    const resetForm = () => {
        setYear("");
        setTitle("");
        setOrganization("");
        setCategory("Milestone");
        setBadge("");
        setUrl("");
        setDescription("");
        setEditId(null);
        setIsAdding(false);
    };

    const handleEdit = (milestone: Milestone) => {
        setYear(milestone.year || "");
        setTitle(milestone.title || "");
        setOrganization(milestone.organization || "");
        setCategory(milestone.category || "Milestone");
        setBadge(milestone.badge || "");
        setUrl(milestone.url || "");
        setDescription(milestone.description || "");
        setEditId(milestone.id);
        setIsAdding(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Unauthorized");

            if (editId) {
                const { error } = await supabase
                    .from("milestones")
                    .update({
                        year,
                        title,
                        organization,
                        category,
                        badge,
                        url,
                        description,
                    })
                    .eq("id", editId);

                if (error) throw error;
                toast.success("Trajectory milestone updated.");
            } else {
                const { error } = await supabase.from("milestones").insert([
                    {
                        profile_id: user.id,
                        year,
                        title,
                        organization,
                        category,
                        badge,
                        url,
                        description,
                        order_index: (data?.milestones?.length || 0),
                    },
                ]);

                if (error) throw error;
                toast.success("New milestone inscribed into your trajectory.");
            }

            queryClient.invalidateQueries({ queryKey: ["dashboard-data"] });
            resetForm();
        } catch (err: any) {
            console.error(err);
            toast.error(err.message || "Failed to commit milestone.");
        } finally {
            setLoading(false);
        }
    };

    const confirmDelete = async () => {
        if (!deleteId) return;
        setDeleting(true);

        try {
            const { error } = await supabase
                .from("milestones")
                .delete()
                .eq("id", deleteId);

            if (error) throw error;
            toast.success("Milestone purged from trajectory.");
            queryClient.invalidateQueries({ queryKey: ["dashboard-data"] });
            setDeleteId(null);
        } catch (err: any) {
            console.error(err);
            toast.error("Failed to delete milestone.");
        } finally {
            setDeleting(false);
        }
    };

    const milestonesList: Milestone[] = data?.milestones || [];
    const hasMilestonesTableError = !!data?.milestonesError;

    const copySqlScript = async () => {
        const sql = `-- Run this in Supabase SQL Editor:
CREATE TABLE IF NOT EXISTS milestones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  year TEXT NOT NULL,
  title TEXT NOT NULL,
  organization TEXT,
  description TEXT,
  category TEXT DEFAULT 'Milestone',
  badge TEXT,
  url TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Milestones viewable if profile not private" ON milestones
  FOR SELECT USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = milestones.profile_id AND (NOT profiles.is_private OR auth.uid() = profiles.id)));

CREATE POLICY "Users manage own milestones" ON milestones
  FOR ALL USING (auth.uid() = profile_id);

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'milestones') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE milestones;
  END IF;
END $$;`;
        await navigator.clipboard.writeText(sql);
        setCopiedSql(true);
        toast.success("Milestones SQL copied to clipboard. Execute in Supabase SQL editor.");
        setTimeout(() => setCopiedSql(false), 3000);
    };

    return (
        <div className="space-y-12 max-w-7xl pb-24">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/5">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-luxury-gold animate-pulse" />
                        <span className="text-[10px] font-syncopate uppercase tracking-[0.4em] text-luxury-gold">
                            Career Architecture
                        </span>
                    </div>
                    <h1 className="text-2xl sm:text-4xl md:text-5xl font-syncopate font-bold uppercase tracking-tight text-white">
                        Trajectory & Chronicles
                    </h1>
                    <p className="text-sm font-sans text-white/40 max-w-2xl">
                        Curate your defining career milestones, marquee achievements, funding rounds, company exits, and honors with kinetic luxury aesthetics.
                    </p>
                </div>

                <Button
                    onClick={() => {
                        resetForm();
                        setIsAdding(!isAdding);
                    }}
                    className="gap-3 py-6 px-8 rounded-[1.2rem] font-syncopate text-xs tracking-[0.2em] uppercase shrink-0"
                >
                    {isAdding ? <X size={16} /> : <Plus size={16} />}
                    {isAdding ? "Cancel Entry" : "Inscribe Milestone"}
                </Button>
            </div>

            {/* SQL Notice Alert if Table is missing */}
            {hasMilestonesTableError && (
                <div className="p-6 rounded-[2rem] border border-amber-500/30 bg-amber-500/5 backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                        <AlertCircle className="text-amber-400 shrink-0 mt-0.5" size={20} />
                        <div>
                            <h4 className="text-xs font-syncopate font-bold uppercase tracking-wider text-amber-300">
                                Supabase Database Table Required
                            </h4>
                            <p className="text-xs text-white/50 mt-1 max-w-2xl">
                                To enable persistent storage for your career trajectory, run the SQL patch in your Supabase SQL Editor.
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={copySqlScript}
                        className="px-5 py-3 rounded-xl border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-syncopate text-[9px] uppercase tracking-widest flex items-center gap-2 shrink-0 transition-colors"
                    >
                        {copiedSql ? <Check size={14} /> : <Copy size={14} />}
                        <span>{copiedSql ? "SQL Copied!" : "Copy SQL Script"}</span>
                    </button>
                </div>
            )}

            {/* Creator / Editor Form Modal / Section */}
            <AnimatePresence>
                {isAdding && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: "auto" }}
                        exit={{ opacity: 0, y: -20, height: 0 }}
                        className="overflow-hidden"
                    >
                        <Card className="p-8 md:p-10 border-luxury-gold/20 bg-[#0C0C0C] relative rounded-[2.5rem]">
                            <div className="absolute top-0 right-0 p-8 pointer-events-none opacity-5">
                                <Compass size={180} />
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                                <div className="flex items-center justify-between pb-4 border-b border-white/5">
                                    <div className="flex items-center gap-3">
                                        <Sparkles size={16} className="text-luxury-gold" />
                                        <h2 className="text-lg font-syncopate font-bold uppercase tracking-widest text-white">
                                            {editId ? "Recalibrate Milestone" : "Record New Milestone"}
                                        </h2>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={resetForm}
                                        className="text-white/40 hover:text-white transition-colors"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {/* Year / Period */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-syncopate uppercase tracking-[0.2em] text-white/60 block">
                                            Year / Period *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={year}
                                            onChange={(e) => setYear(e.target.value)}
                                            placeholder="e.g. 2024 or 2023 - Present"
                                            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-3.5 text-sm text-white focus:outline-none focus:border-luxury-gold/50 transition-colors font-mono"
                                        />
                                    </div>

                                    {/* Milestone Title */}
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-[10px] font-syncopate uppercase tracking-[0.2em] text-white/60 block">
                                            Achievement / Milestone Title *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            placeholder="e.g. Founded Sovereign Studio / Series A Closed"
                                            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-3.5 text-sm text-white focus:outline-none focus:border-luxury-gold/50 transition-colors"
                                        />
                                    </div>

                                    {/* Organization / Context */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-syncopate uppercase tracking-[0.2em] text-white/60 block">
                                            Organization / Context
                                        </label>
                                        <input
                                            type="text"
                                            value={organization}
                                            onChange={(e) => setOrganization(e.target.value)}
                                            placeholder="e.g. Forbes / TechStars / Horizon Ventures"
                                            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-3.5 text-sm text-white focus:outline-none focus:border-luxury-gold/50 transition-colors"
                                        />
                                    </div>

                                    {/* Category Select */}
                                    <div className="space-y-2 relative z-30">
                                        <label className="text-[10px] font-syncopate uppercase tracking-[0.2em] text-white/60 block">
                                            Category
                                        </label>
                                        <LuxeSelect
                                            options={categorySelectOptions}
                                            value={category}
                                            onChange={setCategory}
                                            placeholder="Select Category"
                                            triggerClassName="py-3 px-5 rounded-2xl bg-white/[0.03] border-white/10"
                                        />
                                    </div>

                                    {/* Optional Badge / Highlight */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-syncopate uppercase tracking-[0.2em] text-white/60 block">
                                            Highlight Badge (Optional)
                                        </label>
                                        <input
                                            type="text"
                                            value={badge}
                                            onChange={(e) => setBadge(e.target.value)}
                                            placeholder="e.g. $15M Round or Keynote"
                                            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-3.5 text-sm text-white focus:outline-none focus:border-luxury-gold/50 transition-colors"
                                        />
                                    </div>

                                    {/* Verification URL / Article Link */}
                                    <div className="space-y-2 md:col-span-3">
                                        <label className="text-[10px] font-syncopate uppercase tracking-[0.2em] text-white/60 block">
                                            Dispatch Link / Announcement URL (Optional)
                                        </label>
                                        <input
                                            type="url"
                                            value={url}
                                            onChange={(e) => setUrl(e.target.value)}
                                            placeholder="https://techcrunch.com/... or https://company.com"
                                            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-3.5 text-sm text-white focus:outline-none focus:border-luxury-gold/50 transition-colors font-mono"
                                        />
                                    </div>

                                    {/* Description / Impact */}
                                    <div className="space-y-2 md:col-span-3">
                                        <label className="text-[10px] font-syncopate uppercase tracking-[0.2em] text-white/60 block">
                                            Narrative Context & Impact (Optional)
                                        </label>
                                        <textarea
                                            rows={3}
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            placeholder="Key outcomes, scale, breakthrough metrics, or sovereign significance of this milestone..."
                                            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-luxury-gold/50 transition-colors resize-none leading-relaxed"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center justify-end gap-4 pt-4 border-t border-white/5">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={resetForm}
                                        className="py-6 px-8 rounded-2xl font-syncopate text-xs tracking-widest uppercase border-white/10"
                                    >
                                        Dismiss
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        className="gap-3 py-6 px-10 rounded-2xl font-syncopate text-xs tracking-[0.2em] uppercase"
                                    >
                                        {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                        {editId ? "Update Milestone" : "Inscribe"}
                                    </Button>
                                </div>
                            </form>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Existing Milestones List */}
            {isLoading ? (
                <div className="flex items-center justify-center py-24">
                    <Loader2 size={32} className="animate-spin text-luxury-gold" />
                </div>
            ) : milestonesList.length === 0 ? (
                <Card className="p-16 text-center border-dashed border-white/10 bg-white/[0.01] rounded-[2.5rem]">
                    <div className="w-16 h-16 rounded-full bg-luxury-gold/10 border border-luxury-gold/20 flex items-center justify-center mx-auto mb-6 text-luxury-gold">
                        <Compass size={28} />
                    </div>
                    <h3 className="text-xl font-syncopate font-bold uppercase tracking-tight text-white mb-2">
                        No Milestones Recorded Yet
                    </h3>
                    <p className="text-sm text-white/40 max-w-md mx-auto mb-8">
                        Inscribe your career trajectory, major awards, venture launches, and defining moments into your sovereign timeline.
                    </p>
                    <Button
                        onClick={() => setIsAdding(true)}
                        className="py-6 px-8 rounded-2xl font-syncopate text-xs tracking-widest uppercase gap-3"
                    >
                        <Plus size={16} />
                        Inscribe First Milestone
                    </Button>
                </Card>
            ) : (
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <span className="text-[9px] font-syncopate uppercase tracking-[0.3em] text-white/40">
                            {milestonesList.length} Sovereign {milestonesList.length === 1 ? "Milestone" : "Milestones"} Active
                        </span>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        {milestonesList.map((item, index) => (
                            <motion.div
                                key={item.id}
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="group relative p-5 sm:p-7 md:p-8 rounded-[1.8rem] md:rounded-[2rem] border border-white/5 bg-[#0A0A0A] hover:border-luxury-gold/30 transition-all duration-300"
                            >
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 sm:gap-6">
                                    <div className="space-y-2 flex-1">
                                        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                                            <span className="px-3 py-1 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider border border-luxury-gold/30 bg-luxury-gold/10 text-luxury-gold">
                                                {item.year}
                                            </span>

                                            {item.category && (
                                                <span className="px-2.5 py-0.5 rounded-full text-[8px] font-syncopate uppercase tracking-widest border border-white/10 text-white/60">
                                                    {item.category}
                                                </span>
                                            )}

                                            {item.badge && (
                                                <span className="px-2.5 py-0.5 rounded-full text-[8px] font-syncopate uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                                                    {item.badge}
                                                </span>
                                            )}
                                        </div>

                                        <h3 className="text-base sm:text-lg md:text-xl font-bold uppercase tracking-tight text-white group-hover:text-luxury-gold transition-colors font-syncopate">
                                            {item.title}
                                        </h3>

                                        {item.organization && (
                                            <p className="text-xs font-syncopate uppercase tracking-widest text-white/40 flex items-center gap-2">
                                                <Building2 size={12} className="opacity-60" />
                                                <span>{item.organization}</span>
                                            </p>
                                        )}

                                        {item.description && (
                                            <p className="text-xs sm:text-sm text-white/60 leading-relaxed max-w-3xl pt-1">
                                                {item.description}
                                            </p>
                                        )}

                                        {item.url && (
                                            <a
                                                href={item.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1.5 text-[9px] font-syncopate uppercase tracking-widest text-luxury-gold hover:underline pt-2"
                                            >
                                                <span>Dispatch Link</span>
                                                <ArrowUpRight size={11} />
                                            </a>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                                        <button
                                            onClick={() => handleEdit(item)}
                                            className="w-10 h-10 rounded-xl bg-white/[0.02] border border-white/10 hover:border-luxury-gold/40 hover:text-luxury-gold flex items-center justify-center text-white/50 transition-all duration-300"
                                            title="Edit Milestone"
                                        >
                                            <Edit3 size={15} />
                                        </button>
                                        <button
                                            onClick={() => setDeleteId(item.id)}
                                            className="w-10 h-10 rounded-xl bg-white/[0.02] border border-white/10 hover:border-red-500/40 hover:text-red-400 flex items-center justify-center text-white/50 transition-all duration-300"
                                            title="Delete Milestone"
                                        >
                                            <Trash2 size={15} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            <DeleteDialog
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={confirmDelete}
                // loading={deleting}
                title="Purge Milestone"
                description="Are you certain you wish to remove this milestone from your career trajectory? This sovereign record cannot be retrieved."
            />
        </div>
    );
};

export default Milestones;
