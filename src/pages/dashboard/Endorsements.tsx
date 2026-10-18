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
    Quote,
    Star,
    Award,
    Building2,
    CheckCircle2,
    Sparkles,
    X,
    AlertCircle,
    Copy,
    Check
} from "lucide-react";
import { useDashboard } from "@/hooks/useDashboard";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { DeleteDialog } from "@/components/ui/DeleteDialog";
import { useTitle } from "@/hooks/useTitle";

interface Endorsement {
    id: string;
    client_name: string;
    client_role?: string;
    company_name?: string;
    client_avatar?: string;
    quote: string;
    rating?: number;
    project_title?: string;
    order_index?: number;
}

const Endorsements = () => {
    useTitle("Endorsements");
    const { data, isLoading } = useDashboard();
    const queryClient = useQueryClient();

    const [isAdding, setIsAdding] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [clientName, setClientName] = useState("");
    const [clientRole, setClientRole] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [projectTitle, setProjectTitle] = useState("");
    const [clientAvatar, setClientAvatar] = useState("");
    const [quote, setQuote] = useState("");
    const [rating, setRating] = useState<number>(5);

    const [loading, setLoading] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [copiedSql, setCopiedSql] = useState(false);

    const resetForm = () => {
        setClientName("");
        setClientRole("");
        setCompanyName("");
        setProjectTitle("");
        setClientAvatar("");
        setQuote("");
        setRating(5);
        setEditId(null);
        setIsAdding(false);
    };

    const handleEdit = (endorsement: Endorsement) => {
        setClientName(endorsement.client_name || "");
        setClientRole(endorsement.client_role || "");
        setCompanyName(endorsement.company_name || "");
        setProjectTitle(endorsement.project_title || "");
        setClientAvatar(endorsement.client_avatar || "");
        setQuote(endorsement.quote || "");
        setRating(endorsement.rating || 5);
        setEditId(endorsement.id);
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
                    .from("endorsements")
                    .update({
                        client_name: clientName,
                        client_role: clientRole,
                        company_name: companyName,
                        project_title: projectTitle,
                        client_avatar: clientAvatar,
                        quote: quote,
                        rating: rating,
                    })
                    .eq("id", editId);

                if (error) throw error;
                toast.success("Endorsement credentials recalibrated.");
            } else {
                const { error } = await supabase.from("endorsements").insert([
                    {
                        profile_id: user.id,
                        client_name: clientName,
                        client_role: clientRole,
                        company_name: companyName,
                        project_title: projectTitle,
                        client_avatar: clientAvatar,
                        quote: quote,
                        rating: rating,
                        order_index: (data?.endorsements?.length || 0) + 1,
                    },
                ]);

                if (error) throw error;
                toast.success("Endorsement enshrined into estate vault.");
            }

            resetForm();
            queryClient.invalidateQueries({ queryKey: ["dashboard-data"] });
        } catch (error: any) {
            toast.error(error.message || "Failed to commit endorsement");
        } finally {
            setLoading(false);
        }
    };

    const confirmDelete = async () => {
        if (!deleteId) return;
        setDeleting(true);

        try {
            const { error } = await supabase
                .from("endorsements")
                .delete()
                .eq("id", deleteId);

            if (error) throw error;
            toast.success("Endorsement decommissioned.");
            setDeleteId(null);
            queryClient.invalidateQueries({ queryKey: ["dashboard-data"] });
        } catch (error: any) {
            toast.error(error.message || "Failed to delete endorsement");
        } finally {
            setDeleting(false);
        }
    };

    const endorsementsList: Endorsement[] = data?.endorsements || [];

    return (
        <div className="p-8 md:p-16 max-w-7xl mx-auto space-y-16">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-12 border-b border-white/5">
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-2 h-2 rounded-full bg-luxury-gold animate-pulse" />
                        <span className="text-[10px] font-syncopate uppercase tracking-[0.4em] text-white/30">
                            Social Proof Architecture
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-syncopate font-bold uppercase tracking-tight text-white">
                        Endorsements<span className="text-luxury-gold">.</span>
                    </h1>
                    <p className="text-white/40 mt-3 font-plus max-w-xl text-lg leading-relaxed">
                        Enshrine client testimonials, peer reviews, and executive accolades to cultivate high-ticket authority.
                    </p>
                </div>

                <Button
                    variant="luxury"
                    onClick={() => {
                        if (isAdding) resetForm();
                        else setIsAdding(true);
                    }}
                    className="gap-3 py-6 px-8 rounded-2xl shrink-0"
                >
                    {isAdding ? <X size={18} /> : <Plus size={18} />}
                    {isAdding ? "Close Form" : "Add Endorsement"}
                </Button>
            </div>

            {/* Supabase Migration Notice if table is missing */}
            {data?.endorsementsError && (
                <div className="p-8 rounded-[2rem] border border-amber-500/20 bg-amber-500/5 relative overflow-hidden space-y-4">
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                            <AlertCircle size={20} />
                        </div>
                        <div className="flex-1 space-y-2">
                            <h3 className="font-syncopate font-bold text-xs uppercase tracking-wider text-amber-300">
                                Supabase Setup Required: Endorsements Vault
                            </h3>
                            <p className="text-sm font-plus text-white/60 leading-relaxed max-w-3xl">
                                The <code className="text-amber-300 bg-black/40 px-2 py-0.5 rounded text-xs">endorsements</code> table was not detected in your Supabase database. Please execute the migration patch in your Supabase SQL Editor to activate client reviews.
                            </p>

                            <div className="pt-2 flex flex-wrap items-center gap-3">
                                <Button
                                    variant="luxury"
                                    onClick={() => {
                                        const sql = `-- Create endorsements table
CREATE TABLE IF NOT EXISTS endorsements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  client_name TEXT NOT NULL,
  client_role TEXT,
  company_name TEXT,
  client_avatar TEXT,
  quote TEXT NOT NULL,
  rating INTEGER DEFAULT 5,
  project_title TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE endorsements ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Endorsements are viewable by everyone if profile not private." ON endorsements;
DROP POLICY IF EXISTS "Users can manage their own endorsements." ON endorsements;
CREATE POLICY "Endorsements are viewable by everyone if profile not private." ON endorsements FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = endorsements.profile_id AND (NOT profiles.is_private OR auth.uid() = profiles.id))
);
CREATE POLICY "Users can manage their own endorsements." ON endorsements FOR ALL USING (auth.uid() = profile_id);`;
                                        navigator.clipboard.writeText(sql);
                                        setCopiedSql(true);
                                        toast.success("SQL migration copied to clipboard!");
                                        setTimeout(() => setCopiedSql(false), 3000);
                                    }}
                                    className="gap-2 py-3 px-5 rounded-xl text-[10px] font-syncopate uppercase tracking-widest"
                                >
                                    {copiedSql ? <Check size={14} /> : <Copy size={14} />}
                                    {copiedSql ? "Copied SQL" : "Copy SQL Migration"}
                                </Button>
                                <span className="text-[10px] text-white/30 font-syncopate uppercase tracking-wider">
                                    File: supabase_patch_endorsements_and_booking.sql
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Creation / Edit Form */}
            <AnimatePresence>
                {isAdding && (
                    <motion.div
                        initial={{ opacity: 0, height: 0, y: -20 }}
                        animate={{ opacity: 1, height: "auto", y: 0 }}
                        exit={{ opacity: 0, height: 0, y: -20 }}
                        transition={{ duration: 0.4 }}
                        className="overflow-hidden"
                    >
                        <Card className="p-8 md:p-14 border-luxury-gold/20 bg-[#0A0A0A]/90 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-96 h-96 bg-luxury-gold/[0.04] blur-[100px] pointer-events-none" />

                            <div className="flex items-center gap-4 mb-10 pb-6 border-b border-white/5">
                                <div className="w-12 h-12 rounded-2xl bg-luxury-gold/10 border border-luxury-gold/20 flex items-center justify-center text-luxury-gold">
                                    <Award size={24} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-syncopate font-bold uppercase tracking-wider text-white">
                                        {editId ? "Recalibrate Endorsement" : "Inscribe Client Endorsement"}
                                    </h2>
                                    <p className="text-[9px] font-syncopate uppercase tracking-widest text-white/30 mt-1">
                                        Rendered directly on your public digital estate
                                    </p>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-10">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-syncopate uppercase tracking-[0.3em] text-white/40 ml-2">
                                            Client / Author Name *
                                        </label>
                                        <input
                                            required
                                            value={clientName}
                                            onChange={(e) => setClientName(e.target.value)}
                                            placeholder="Ex. Lady Vivienne Montgomery"
                                            className="w-full bg-white/[0.02] border border-white/10 rounded-2xl py-5 px-6 outline-none focus:border-luxury-gold/40 font-plus text-base text-white"
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-syncopate uppercase tracking-[0.3em] text-white/40 ml-2">
                                            Role / Executive Title
                                        </label>
                                        <input
                                            value={clientRole}
                                            onChange={(e) => setClientRole(e.target.value)}
                                            placeholder="Ex. Managing Partner, Creative Director"
                                            className="w-full bg-white/[0.02] border border-white/10 rounded-2xl py-5 px-6 outline-none focus:border-luxury-gold/40 font-plus text-base text-white"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-syncopate uppercase tracking-[0.3em] text-white/40 ml-2">
                                            Company / Organization
                                        </label>
                                        <input
                                            value={companyName}
                                            onChange={(e) => setCompanyName(e.target.value)}
                                            placeholder="Ex. Vanguard Global, Studio Noir"
                                            className="w-full bg-white/[0.02] border border-white/10 rounded-2xl py-5 px-6 outline-none focus:border-luxury-gold/40 font-plus text-base text-white"
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-syncopate uppercase tracking-[0.3em] text-white/40 ml-2">
                                            Project / Deliverable Scope
                                        </label>
                                        <input
                                            value={projectTitle}
                                            onChange={(e) => setProjectTitle(e.target.value)}
                                            placeholder="Ex. Sovereign Estate Architecture"
                                            className="w-full bg-white/[0.02] border border-white/10 rounded-2xl py-5 px-6 outline-none focus:border-luxury-gold/40 font-plus text-base text-white"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-syncopate uppercase tracking-[0.3em] text-white/40 ml-2">
                                            Client Avatar URL (Optional)
                                        </label>
                                        <input
                                            value={clientAvatar}
                                            onChange={(e) => setClientAvatar(e.target.value)}
                                            placeholder="https://..."
                                            className="w-full bg-white/[0.02] border border-white/10 rounded-2xl py-5 px-6 outline-none focus:border-luxury-gold/40 font-plus text-base text-white"
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-syncopate uppercase tracking-[0.3em] text-white/40 ml-2">
                                            Star Rating
                                        </label>
                                        <div className="flex items-center gap-3 py-4 px-6 bg-white/[0.02] border border-white/10 rounded-2xl">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    type="button"
                                                    key={star}
                                                    onClick={() => setRating(star)}
                                                    className="p-1 transition-transform hover:scale-125"
                                                >
                                                    <Star
                                                        size={22}
                                                        className={
                                                            star <= rating
                                                                ? "fill-current text-luxury-gold"
                                                                : "text-white/20"
                                                        }
                                                    />
                                                </button>
                                            ))}
                                            <span className="ml-auto text-[10px] font-syncopate uppercase tracking-widest text-luxury-gold">
                                                {rating} / 5 Stars
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-syncopate uppercase tracking-[0.3em] text-white/40 ml-2">
                                        Quote / Recommendation *
                                    </label>
                                    <textarea
                                        required
                                        rows={4}
                                        value={quote}
                                        onChange={(e) => setQuote(e.target.value)}
                                        placeholder="The digital estate crafted exceeded every expectation. An absolute visionary in execution and kinetic design..."
                                        className="w-full bg-white/[0.02] border border-white/10 rounded-2xl py-5 px-6 outline-none focus:border-luxury-gold/40 font-plus text-base text-white italic leading-relaxed resize-none"
                                    />
                                </div>

                                <div className="flex items-center justify-end gap-4 pt-4">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={resetForm}
                                        className="py-5 px-8 rounded-xl text-xs uppercase font-syncopate"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        variant="luxury"
                                        disabled={loading}
                                        className="py-5 px-10 rounded-2xl text-xs uppercase font-syncopate gap-2"
                                    >
                                        {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                        {editId ? "Update Endorsement" : "Inscribe Endorsement"}
                                    </Button>
                                </div>
                            </form>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* List of Endorsements */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-24 gap-4">
                    <Loader2 size={36} className="animate-spin text-luxury-gold" />
                    <span className="text-[10px] font-syncopate uppercase tracking-widest text-white/30">
                        Querying Endorsements Vault...
                    </span>
                </div>
            ) : endorsementsList.length === 0 ? (
                <div className="text-center py-24 px-6 border border-white/5 bg-white/[0.01] rounded-[2.5rem] flex flex-col items-center">
                    <div className="w-20 h-20 rounded-full bg-luxury-gold/5 border border-luxury-gold/10 flex items-center justify-center text-luxury-gold mb-6">
                        <Quote size={32} />
                    </div>
                    <h3 className="text-2xl font-syncopate font-bold uppercase tracking-tight text-white mb-2">
                        No Endorsements Inscribed
                    </h3>
                    <p className="text-sm text-white/40 font-plus max-w-md leading-relaxed mb-8">
                        Begin showcasing testimonials and client praise to build uncompromising credibility on your public profile.
                    </p>
                    <Button
                        variant="luxury"
                        onClick={() => setIsAdding(true)}
                        className="py-5 px-8 rounded-2xl gap-2 font-syncopate text-xs uppercase"
                    >
                        <Plus size={16} /> Inscribe First Endorsement
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {endorsementsList.map((item) => (
                        <Card
                            key={item.id}
                            className="p-8 border-white/5 bg-white/[0.02] flex flex-col justify-between group hover:border-luxury-gold/30 transition-all duration-500 relative overflow-hidden"
                        >
                            {/* Watermark Quote */}
                            <Quote
                                size={56}
                                className="absolute -top-3 -right-3 text-white/[0.03] group-hover:text-luxury-gold/[0.08] transition-colors pointer-events-none"
                            />

                            <div>
                                {/* Rating Stars & Controls */}
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-1">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <Star
                                                key={i}
                                                size={14}
                                                className={
                                                    i < (item.rating || 5)
                                                        ? "fill-current text-luxury-gold"
                                                        : "text-white/10"
                                                }
                                            />
                                        ))}
                                    </div>
                                    <div className="flex items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleEdit(item)}
                                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 hover:text-luxury-gold transition-colors"
                                            title="Edit"
                                        >
                                            <Edit3 size={14} />
                                        </button>
                                        <button
                                            onClick={() => setDeleteId(item.id)}
                                            className="p-2 rounded-lg bg-white/5 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>

                                {/* Quote */}
                                <p className="text-base font-light italic text-white/80 leading-relaxed mb-6">
                                    "{item.quote}"
                                </p>

                                {item.project_title && (
                                    <div className="mb-6">
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[8px] font-syncopate uppercase tracking-widest border border-luxury-gold/20 bg-luxury-gold/5 text-luxury-gold">
                                            <CheckCircle2 size={10} />
                                            {item.project_title}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Author info */}
                            <div className="flex items-center gap-3 pt-6 border-t border-white/5">
                                {item.client_avatar ? (
                                    <img
                                        src={item.client_avatar}
                                        alt={item.client_name}
                                        className="w-10 h-10 rounded-full object-cover border border-luxury-gold/20 shrink-0"
                                    />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-luxury-gold/10 border border-luxury-gold/20 flex items-center justify-center font-syncopate font-bold text-xs text-luxury-gold shrink-0">
                                        {item.client_name ? item.client_name.substring(0, 2).toUpperCase() : "??"}
                                    </div>
                                )}
                                <div className="min-w-0">
                                    <h4 className="text-xs font-syncopate font-bold uppercase text-white truncate">
                                        {item.client_name}
                                    </h4>
                                    <div className="flex items-center gap-1 text-[11px] text-white/40 truncate mt-0.5">
                                        {item.company_name && (
                                            <span className="flex items-center gap-1 font-medium text-white/60">
                                                <Building2 size={10} />
                                                {item.company_name}
                                            </span>
                                        )}
                                        {item.company_name && item.client_role && <span>•</span>}
                                        {item.client_role && <span>{item.client_role}</span>}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* Delete Confirmation Dialog */}
            <DeleteDialog
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={confirmDelete}
                isDeleting={deleting}
                title="Decommission Endorsement"
                description="This endorsement will be irrevocably purged from your digital estate vault."
            />
        </div>
    );
};

export default Endorsements;
