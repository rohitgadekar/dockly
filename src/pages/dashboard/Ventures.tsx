import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
    Plus,
    TrendingUp,
    Trash2,
    ExternalLink,
    Loader2,
    Save,
    Sparkles,
    ChevronRight,
    Search,
    Edit3
} from "lucide-react";
import { useDashboard } from "@/hooks/useDashboard";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { DeleteDialog } from "@/components/ui/DeleteDialog";
import { useTitle } from "@/hooks/useTitle";

const Ventures = () => {
    useTitle("Projects");
    const { data, isLoading } = useDashboard();
    const [isAdding, setIsAdding] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [url, setUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [editId, setEditId] = useState<string | null>(null);
    const queryClient = useQueryClient();

    const resetForm = () => {
        setTitle("");
        setDescription("");
        setUrl("");
        setEditId(null);
        setIsAdding(false);
    };

    const handleSubmitVenture = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Unauthorized");

            if (editId) {
                const { error } = await supabase.from("ventures")
                    .update({
                        title,
                        description,
                        url
                    })
                    .eq("id", editId);
                if (error) throw error;
                toast.success("Project Updated.");
            } else {
                const { error } = await supabase.from("ventures").insert([
                    {
                        profile_id: user.id,
                        title,
                        description,
                        url
                    }
                ]);
                if (error) throw error;
                toast.success("Project Added.");
            }

            resetForm();
            queryClient.invalidateQueries({ queryKey: ["dashboard-data"] });
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (venture: any) => {
        setTitle(venture.title);
        setDescription(venture.description);
        setUrl(venture.url);
        setEditId(venture.id);
        setIsAdding(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = (id: string) => {
        setDeleteId(id);
    };

    const confirmDelete = async () => {
        if (!deleteId) return;
        setDeleting(true);
        try {
            const { error } = await supabase.from("ventures").delete().eq("id", deleteId);
            if (error) throw error;
            toast.success("Project Removed.");
            queryClient.invalidateQueries({ queryKey: ["dashboard-data"] });
            setDeleteId(null);
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setDeleting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="h-[70vh] flex flex-col items-center justify-center gap-6">
                <Loader2 className="animate-spin text-luxury-gold" size={48} />
                <p className="text-white/20 font-syncopate uppercase tracking-[0.5em] text-[10px]">Loading Projects...</p>
            </div>
        );
    }

    return (
        <div className="space-y-16 py-8">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 pb-12 border-b border-white/5 relative">
                <div className="absolute top-0 left-0 w-96 h-96 bg-luxury-gold/5 blur-[120px] -ml-48 -mt-48 pointer-events-none" />

                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <Sparkles className="text-luxury-gold w-5 h-5 opacity-50" />
                        <span className="text-[10px] font-syncopate uppercase tracking-[0.4em] text-luxury-gold opacity-60">Portfolio</span>
                    </div>
                    <h1 className="text-6xl font-syncopate font-bold uppercase tracking-tighter leading-none">Projects</h1>
                    <p className="text-white/30 font-plus text-xl mt-6 max-w-2xl leading-relaxed">
                        Showcase and manage your key projects and initiatives.
                    </p>
                </div>

                {!isAdding && (
                    <Button variant="luxury" onClick={() => setIsAdding(true)} className="gap-3 px-10 py-6 rounded-[2rem] shadow-[0_0_30px_rgba(212,175,55,0.2)] text-sm tracking-widest font-syncopate uppercase">
                        <Plus size={20} /> Add Project
                    </Button>
                )}
            </header>

            <AnimatePresence>
                {isAdding && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    >
                        <Card className="p-12 border-luxury-gold/20 bg-luxury-gold/[0.02] relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-luxury-gold/5 blur-[100px] -mr-32 -mt-32" />

                            <form onSubmit={handleSubmitVenture} className="space-y-10 relative">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 bg-luxury-gold/10 rounded-[2rem] flex items-center justify-center text-luxury-gold">
                                        <TrendingUp size={24} strokeWidth={1.5} />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-syncopate font-bold uppercase tracking-tight text-white">
                                            {editId ? "Edit Project" : "New Project"}
                                        </h2>
                                        <p className="text-xs text-white/20 font-syncopate uppercase tracking-widest mt-1">
                                            {editId ? "Update Project Details" : "Add Project Details"}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-syncopate uppercase tracking-[0.3em] text-white/40 ml-2">Project Name</label>
                                        <input
                                            required
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            placeholder="Ex. Project Chronos"
                                            className="w-full bg-white/[0.03] border border-white/10 rounded-[2rem] py-5 px-8 outline-none focus:border-luxury-gold/40 focus:bg-white/[0.05] transition-all duration-500 font-plus text-lg text-white"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-syncopate uppercase tracking-[0.3em] text-white/40 ml-2">Project URL</label>
                                        <input
                                            required
                                            type="url"
                                            value={url}
                                            onChange={(e) => setUrl(e.target.value)}
                                            placeholder="https://project-domain.com"
                                            className="w-full bg-white/[0.03] border border-white/10 rounded-[2rem] py-5 px-8 outline-none focus:border-luxury-gold/40 focus:bg-white/[0.05] transition-all duration-500 font-plus text-lg text-white"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-syncopate uppercase tracking-[0.3em] text-white/40 ml-2">Description</label>
                                    <textarea
                                        required
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Brief description of the project..."
                                        className="w-full bg-white/[0.03] border border-white/10 rounded-[2rem] py-6 px-8 outline-none focus:border-luxury-gold/40 focus:bg-white/[0.05] transition-all duration-500 h-40 font-plus text-lg leading-relaxed text-white resize-none"
                                    />
                                </div>

                                <div className="flex justify-end gap-6 pt-6">
                                    <Button type="button" variant="ghost" className="px-10 text-xs font-syncopate uppercase tracking-widest h-14" onClick={resetForm}>Cancel</Button>
                                    <Button type="submit" variant="luxury" disabled={loading} className="gap-3 px-12 h-14 rounded-xl text-xs font-syncopate uppercase tracking-widest shadow-2xl">
                                        {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                        {editId ? "Save Changes" : "Add Project"}
                                    </Button>
                                </div>
                            </form>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {data?.ventures.length === 0 && !isAdding ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="col-span-2 text-center py-32 bg-white/[0.01] rounded-[3rem] border border-dashed border-white/10 relative overflow-hidden group"
                    >
                        <div className="absolute inset-0 bg-gradient-to-b from-luxury-gold/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                        <div className="relative z-10">
                            <div className="w-24 h-24 bg-white/[0.02] rounded-full flex items-center justify-center mx-auto mb-10 border border-white/5 group-hover:border-luxury-gold/20 ">
                                <Search size={40} className="text-white/5 group-hover:text-luxury-gold group-hover:scale-110 " strokeWidth={1} />
                            </div>
                            <h3 className="text-2xl font-syncopate font-bold text-white/40 mb-4 uppercase tracking-tighter">No Projects Found</h3>
                            <p className="text-white/20 font-plus text-lg mb-10 max-w-sm mx-auto uppercase tracking-widest text-[10px]">Your portfolio is currently empty.</p>

                        </div>
                    </motion.div>
                ) : (
                    data?.ventures.map((venture: any, idx: number) => (
                        <motion.div
                            key={venture.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                        >
                            <Card className="group hover:border-luxury-gold/30 flex flex-col justify-between p-10 bg-white/[0.01]  relative overflow-hidden border-white/5">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-luxury-gold/5 blur-[60px] translate-x-16 -translate-y-16 group-hover:bg-luxury-gold/10 transition-colors" />

                                <div>
                                    <div className="flex justify-between items-start mb-10 relative">
                                        <div className="w-16 h-16 bg-white/[0.03] rounded-[2rem] flex items-center justify-center text-white/20 group-hover:text-luxury-gold group-hover:border-luxury-gold/30 border border-white/5  group-hover:rotate-6">
                                            <TrendingUp size={28} strokeWidth={1.5} />
                                        </div>
                                        <div className="flex gap-4">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="w-12 h-12 p-0 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:border-luxury-gold/40 hover:text-luxury-gold transition-all duration-500"
                                                onClick={() => handleEdit(venture)}
                                            >
                                                <Edit3 size={18} />
                                            </Button>
                                            <a href={venture.url} target="_blank" rel="noopener noreferrer">
                                                <Button variant="ghost" size="sm" className="w-12 h-12 p-0 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:border-luxury-gold/40 hover:text-luxury-gold transition-all duration-500">
                                                    <ExternalLink size={18} />
                                                </Button>
                                            </a>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="w-12 h-12 p-0 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:bg-red-500/5 hover:border-red-500/30 hover:text-red-500 transition-all duration-500"
                                                onClick={() => handleDelete(venture.id)}
                                            >
                                                <Trash2 size={18} />
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 mb-3">
                                        <h3 className="text-3xl font-plus font-bold uppercase tracking-tight text-white group-hover:text-luxury-gold transition-colors duration-500">{venture.title}</h3>
                                        <div className="w-2 h-2 rounded-full bg-luxury-gold shadow-[0_0_10px_rgba(212,175,55,0.5)] opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                    <p className="text-lg text-white/30 font-plus mb-10 leading-relaxed line-clamp-3 group-hover:text-white/50 transition-colors">
                                        {venture.description || "Experimental architecture and strategic deployment of digital assets."}
                                    </p>
                                </div>

                                <div className="flex items-center justify-between pt-10 border-t border-white/5 mt-auto bg-transparent relative">
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-syncopate text-white/10 uppercase tracking-[0.3em] mb-1">Date Added</span>
                                        <span className="text-[10px] font-plus text-white/40 uppercase tracking-widest font-bold">
                                            {new Date(venture.created_at).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                                        </span>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse" />
                                            <span className="text-[10px] font-syncopate text-emerald-500 uppercase tracking-widest font-bold">Active</span>
                                        </div>
                                        <span className="text-[8px] font-syncopate text-white/10 uppercase tracking-[0.2em]">ID: {venture.id.substring(0, 8).toUpperCase()}</span>
                                    </div>
                                    <ChevronRight size={20} className="absolute -right-4 top-1/2 -translate-y-1/2 text-white/5 group-hover:text-luxury-gold/20 group-hover:translate-x-2 " />
                                </div>
                            </Card>
                        </motion.div>
                    ))
                )}
            </div>
            <DeleteDialog
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={confirmDelete}
                isDeleting={deleting}
                title="Remove Project"
                description="This will permanently delete this project from your portfolio."
            />
        </div>
    );
};

export default Ventures;
