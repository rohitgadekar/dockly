import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { Copy, Users, Mail, Loader2, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useDashboard } from "@/hooks/useDashboard";
import { useTitle } from "@/hooks/useTitle";


interface Subscriber {
    id: string;
    email: string;
    name: string | null;
    created_at: string;
}

const Audience = () => {
    useTitle("Leads");
    const { data: dashboardData } = useDashboard();
    const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        if (dashboardData?.profile?.id) {
            fetchSubscribers();
        }
    }, [dashboardData?.profile?.id]);

    const fetchSubscribers = async () => {
        try {
            const { data, error } = await supabase
                .from("newsletter_subscribers")
                .select("*")
                .eq("profile_id", dashboardData?.profile.id)
                .order("created_at", { ascending: false });

            if (error) throw error;
            setSubscribers(data || []);
        } catch (error) {
            console.error("Error fetching subscribers:", error);
            toast.error("Failed to load audience data");
        } finally {
            setLoading(false);
        }
    };

    const copyAllEmails = () => {
        const emails = subscribers.map(s => s.email).join(", ");
        navigator.clipboard.writeText(emails);
        toast.success("All emails copied to clipboard");
    };

    const deleteSubscriber = async (id: string) => {
        try {
            const { error } = await supabase
                .from("newsletter_subscribers")
                .delete()
                .eq("id", id);

            if (error) throw error;
            setSubscribers(prev => prev.filter(s => s.id !== id));
            toast.success("Subscriber removed");
        } catch (error) {
            console.error("Error deleting subscriber:", error);
            toast.error("Failed to remove subscriber");
        }
    };

    const filteredSubscribers = subscribers.filter(s =>
        s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.name && s.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="animate-spin text-luxury-gold" size={32} />
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl md:text-5xl font-syncopate font-bold text-white uppercase tracking-tight mb-2">
                        Audience <span className="text-luxury-gold">.</span>
                    </h1>
                    <p className="text-white/40 font-light text-lg">
                        Manage your newsletter subscribers and direct reach.
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 flex flex-col items-center min-w-[140px]">
                        <span className="text-white/40 text-[10px] font-syncopate uppercase tracking-widest mb-1">Total Reach</span>
                        <span className="text-3xl font-syncopate font-bold text-white">{subscribers.length}</span>
                    </div>
                </div>
            </header>

            {/* Actions Bar */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white/[0.02] border border-white/5 p-4 rounded-[1.5rem]">
                <div className="relative w-full md:w-96 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-luxury-gold transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Search dossier..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:border-luxury-gold/50 transition-all font-light"
                    />
                </div>

                <button
                    onClick={copyAllEmails}
                    disabled={subscribers.length === 0}
                    className="flex items-center gap-2 px-6 py-3 bg-luxury-gold text-black font-syncopate font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Copy size={16} />
                    Copy All Emails
                </button>
            </div>

            {/* Subscribers List */}
            <div className="grid gap-4">
                {filteredSubscribers.length > 0 ? (
                    filteredSubscribers.map((subscriber, idx) => (
                        <motion.div
                            key={subscriber.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="group flex flex-col md:flex-row md:items-center justify-between p-6 bg-white/[0.01] border border-white/5 rounded-[1.5rem] hover:bg-white/[0.03] hover:border-white/10 transition-all duration-500"
                        >
                            <div className="flex items-center gap-6 mb-4 md:mb-0">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-white/5 to-transparent border border-white/10 flex items-center justify-center text-luxury-gold/60 font-syncopate font-bold text-lg">
                                    {(subscriber.name?.[0] || subscriber.email[0]).toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-1">
                                        {subscriber.name || <span className="opacity-30 italic">No Name</span>}
                                    </h3>
                                    <div className="flex items-center gap-2 text-white/40 font-light">
                                        <Mail size={14} />
                                        <span>{subscriber.email}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-6 md:gap-12 pl-16 md:pl-0">
                                <span className="text-white/20 text-xs font-mono">
                                    {new Date(subscriber.created_at).toLocaleDateString(undefined, {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric'
                                    })}
                                </span>

                                <button
                                    onClick={() => deleteSubscriber(subscriber.id)}
                                    className="p-3 rounded-full hover:bg-red-500/10 text-white/20 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                    title="Remove Subscriber"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <div className="text-center py-20 border border-dashed border-white/10 rounded-[2rem]">
                        <Users className="mx-auto text-white/10 mb-4" size={48} />
                        <h3 className="text-white/40 font-syncopate uppercase tracking-widest text-sm">No Subscribers Found</h3>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Audience;
