import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { LuxeSelect } from "@/components/ui/LuxeSelect";
import {
    Plus,
    Trash2,
    ExternalLink,
    Loader2,
    Save,
    Globe,
    Sparkles,
    Link as LinkIcon,
    ArrowUpRight,
    Search,
    Pencil
} from "lucide-react";
import {
    SiTidal,
    SiSpotify,
    SiApplemusic,
    SiOnlyfans
} from "react-icons/si";
import {
    FaTwitter,
    FaGithub,
    FaLinkedin,
    FaYoutube,
    FaTwitch,
    FaTiktok,
    FaDiscord,
    FaPlaystation,
    FaSnapchat,
    FaMedium,
    FaReddit,
    FaPatreon,
    FaInstagram,
    FaGlobe,
    FaFileAlt
} from "react-icons/fa";
import { useDashboard } from "@/hooks/useDashboard";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { DeleteDialog } from "@/components/ui/DeleteDialog";

const socialOptions = [
    { value: "Twitter", label: "Twitter / X", icon: <FaTwitter size={18} /> },
    { value: "Instagram", label: "Instagram", icon: <FaInstagram size={18} /> },
    { value: "LinkedIn", label: "LinkedIn", icon: <FaLinkedin size={18} /> },
    { value: "GitHub", label: "GitHub", icon: <FaGithub size={18} /> },
    { value: "YouTube", label: "YouTube", icon: <FaYoutube size={18} /> },
    { value: "Twitch", label: "Twitch", icon: <FaTwitch size={18} /> },
    { value: "TikTok", label: "TikTok", icon: <FaTiktok size={18} /> },
    { value: "Discord", label: "Discord", icon: <FaDiscord size={18} /> },
    { value: "Spotify", label: "Spotify", icon: <SiSpotify size={18} /> },
    { value: "Apple Music", label: "Apple Music", icon: <SiApplemusic size={18} /> },
    { value: "Tidal", label: "Tidal", icon: <SiTidal size={18} /> },
    { value: "PlayStation", label: "PS5 / PlayStation", icon: <FaPlaystation size={18} /> },
    { value: "OnlyFans", label: "OnlyFans", icon: <SiOnlyfans size={18} /> },
    { value: "Snapchat", label: "Snapchat", icon: <FaSnapchat size={18} /> },
    { value: "Medium", label: "Medium", icon: <FaMedium size={18} /> },
    { value: "Reddit", label: "Reddit", icon: <FaReddit size={18} /> },
    { value: "Patreon", label: "Patreon", icon: <FaPatreon size={18} /> },
    { value: "Personal", label: "Personal Website", icon: <FaGlobe size={18} /> },
];

const platformIcons: Record<string, any> = {
    Twitter: FaTwitter,
    Instagram: FaInstagram,
    LinkedIn: FaLinkedin,
    GitHub: FaGithub,
    YouTube: FaYoutube,
    Twitch: FaTwitch,
    TikTok: FaTiktok,
    Discord: FaDiscord,
    Spotify: SiSpotify,
    "Apple Music": SiApplemusic,
    Tidal: SiTidal,
    PlayStation: FaPlaystation,
    OnlyFans: SiOnlyfans,
    Snapchat: FaSnapchat,
    Medium: FaMedium,
    Reddit: FaReddit,
    Patreon: FaPatreon,
    Personal: FaGlobe,
    Default: FaGlobe,
    Document: FaFileAlt
};

import { useTitle } from "@/hooks/useTitle";

const Socials = () => {
    useTitle("Socials");
    const { data, isLoading } = useDashboard();
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [nodeType, setNodeType] = useState<'standard' | 'custom'>('standard');
    const [platform, setPlatform] = useState("");
    const [customLabel, setCustomLabel] = useState("");
    const [url, setUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const queryClient = useQueryClient();

    const handleEdit = (social: any) => {
        setIsAdding(true);
        setEditingId(social.id);
        setUrl(social.url);

        if (social.platform.startsWith('custom:')) {
            setNodeType('custom');
            setCustomLabel(social.platform.replace('custom:', ''));
            setPlatform('');
        } else {
            setNodeType('standard');
            setPlatform(social.platform);
            setCustomLabel('');
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancel = () => {
        setIsAdding(false);
        setEditingId(null);
        setPlatform("");
        setCustomLabel("");
        setUrl("");
        setNodeType('standard');
    };

    const handleAddSocial = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Unauthorized");

            const finalPlatform = nodeType === 'standard' ? platform : `custom:${customLabel}`;

            if (!finalPlatform || !url) throw new Error("All fields are required");

            if (editingId) {
                const { error } = await supabase.from("social_links").update({
                    platform: finalPlatform,
                    url
                }).eq('id', editingId);

                if (error) throw error;
                toast.success("Social Link Updated.");
            } else {
                const { error } = await supabase.from("social_links").insert([
                    {
                        profile_id: user.id,
                        platform: finalPlatform,
                        url,
                        order_index: data?.socials.length || 0
                    }
                ]);

                if (error) throw error;
                toast.success("Social Link Added.");
            }

            handleCancel();
            queryClient.invalidateQueries({ queryKey: ["dashboard-data"] });
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (id: string) => {
        setDeleteId(id);
    };

    const confirmDelete = async () => {
        if (!deleteId) return;
        setDeleting(true);
        try {
            const { error } = await supabase.from("social_links").delete().eq("id", deleteId);
            if (error) throw error;
            toast.success("Social Link Removed.");
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
                <p className="text-white/20 font-syncopate uppercase tracking-[0.5em] text-[10px]">Loading Socials...</p>
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
                        <span className="text-[10px] font-syncopate uppercase tracking-[0.4em] text-luxury-gold opacity-60">Connections</span>
                    </div>
                    <h1 className="text-6xl font-syncopate font-bold uppercase tracking-tighter leading-none">Socials</h1>
                    <p className="text-white/30 font-plus text-xl mt-6 max-w-2xl leading-relaxed">
                        Centralize and synchronize your digital presence and downloadable assets.
                    </p>
                </div>

                {!isAdding && (
                    <Button variant="luxury" onClick={() => setIsAdding(true)} className="gap-3 px-10 py-6 rounded-[2rem] shadow-[0_0_30px_rgba(212,175,55,0.2)] text-sm tracking-widest font-syncopate uppercase">
                        <Plus size={20} /> Add Social
                    </Button>
                )}
            </header>

            <AnimatePresence>
                {isAdding && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.98 }}
                        className="mb-12 relative z-30"
                    >
                        <Card className="p-12 border-luxury-gold/20 bg-luxury-gold/[0.02] overflow-visible hover:border-luxury-gold/30">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-luxury-gold/5 blur-[100px] -mr-32 -mt-32 " />

                            <form onSubmit={handleAddSocial} className="relative space-y-10">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-luxury-gold/10 rounded-[2rem] flex items-center justify-center text-luxury-gold">
                                            <LinkIcon size={24} strokeWidth={1.5} />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-syncopate font-bold uppercase tracking-tight text-white">
                                                {editingId ? 'Edit Social Link' : 'Add Social Link'}
                                            </h2>
                                            <p className="text-xs text-white/20 font-syncopate uppercase tracking-widest mt-1">
                                                {editingId ? 'Modify details below' : 'Select link type'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 p-1 bg-white/5 rounded-full">
                                        <button
                                            type="button"
                                            onClick={() => setNodeType('standard')}
                                            className={`px-6 py-2 rounded-full text-[10px] font-syncopate uppercase tracking-widest transition-all ${nodeType === 'standard' ? 'bg-luxury-gold text-black font-bold' : 'text-white/40 hover:text-white'}`}
                                        >
                                            Social Link
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setNodeType('custom')}
                                            className={`px-6 py-2 rounded-full text-[10px] font-syncopate uppercase tracking-widest transition-all ${nodeType === 'custom' ? 'bg-luxury-gold text-black font-bold' : 'text-white/40 hover:text-white'}`}
                                        >
                                            Custom Link
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-syncopate uppercase tracking-[0.3em] text-white/40 ml-2">
                                            {nodeType === 'standard' ? 'Select Platform' : 'Label Name'}
                                        </label>
                                        {nodeType === 'standard' ? (
                                            <LuxeSelect
                                                options={socialOptions}
                                                value={platform}
                                                onChange={setPlatform}
                                                placeholder="Select Platform"
                                            />
                                        ) : (
                                            <input
                                                required
                                                type="text"
                                                value={customLabel}
                                                onChange={(e) => setCustomLabel(e.target.value)}
                                                placeholder="e.g. My Portfolio"
                                                className="w-full bg-white/[0.03] border border-white/10 rounded-[2rem] py-5 px-8 outline-none focus:border-luxury-gold/40 focus:bg-white/[0.05] transition-all duration-500 font-plus text-lg text-white"
                                            />
                                        )}
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-syncopate uppercase tracking-[0.3em] text-white/40 ml-2">
                                            {nodeType === 'standard' ? 'Link URL' : 'Link URL'}
                                        </label>
                                        <input
                                            required
                                            type="url"
                                            value={url}
                                            onChange={(e) => setUrl(e.target.value)}
                                            placeholder={nodeType === 'standard' ? "https://..." : "https://..."}
                                            className="w-full bg-white/[0.03] border border-white/10 rounded-[2rem] py-5 px-8 outline-none focus:border-luxury-gold/40 focus:bg-white/[0.05] transition-all duration-500 font-plus text-lg text-white"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end gap-4">
                                    <Button type="button" variant="ghost" className="px-8 h-[60px] text-xs font-syncopate uppercase tracking-widest rounded-[2rem]" onClick={handleCancel}>Cancel</Button>
                                    <Button type="submit" variant="luxury" disabled={loading} className="px-12 h-[60px] rounded-[2rem] gap-3 text-xs font-syncopate uppercase tracking-widest shadow-2xl">
                                        {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                        {editingId ? 'Update Link' : 'Add Link'}
                                    </Button>
                                </div>
                            </form>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 gap-6">
                {data?.socials.length === 0 && !isAdding ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-32 bg-white/[0.01] rounded-[3rem] border border-dashed border-white/10 relative overflow-hidden group"
                    >
                        <div className="absolute inset-0 bg-gradient-to-b from-luxury-gold/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                        <div className="relative z-10">
                            <div className="w-24 h-24 bg-white/[0.02] rounded-full flex items-center justify-center mx-auto mb-10 border border-white/5 group-hover:border-luxury-gold/20 ">
                                <Search size={40} className="text-white/5 group-hover:text-luxury-gold group-hover:scale-110 " strokeWidth={1} />
                            </div>
                            <h3 className="text-2xl font-syncopate font-bold text-white/40 mb-4 uppercase tracking-tighter">No Socials Found</h3>
                            <p className="text-white/20 font-plus text-lg mb-10 max-w-sm mx-auto uppercase tracking-widest text-[10px]">Your social grid is currently empty.</p>

                        </div>
                    </motion.div>
                ) : (
                    data?.socials.map((social: any, idx: number) => {
                        const isCustom = social.platform.startsWith('custom:');
                        const displayName = isCustom ? social.platform.replace('custom:', '') : social.platform;
                        const Icon = isCustom ? FaFileAlt : (platformIcons[social.platform] || platformIcons.Default);

                        return (
                            <motion.div
                                key={social.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                            >
                                <Card className="group hover:bg-white/[0.03]  border-white/5 p-8 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-luxury-gold/5 blur-[60px] translate-x-16 -translate-y-16 group-hover:bg-luxury-gold/10 transition-colors" />

                                    <div className="flex items-center justify-between relative">
                                        <div className="flex items-center gap-10 min-w-0 flex-1 mr-4">
                                            <div className={`w-20 h-20 rounded-3xl flex items-center justify-center border  group-hover:rotate-6 shrink-0 ${isCustom ? 'bg-luxury-gold/5 border-luxury-gold/20 text-luxury-gold' : 'bg-white/[0.03] border-white/5 text-white/20 group-hover:text-luxury-gold group-hover:border-luxury-gold/30'}`}>
                                                <Icon size={32} />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-3xl font-plus font-bold uppercase tracking-tight text-white group-hover:text-luxury-gold transition-colors duration-500 truncate">{displayName}</h3>
                                                    <div className="flex items-center gap-2 shrink-0">
                                                        <div className={`w-1.5 h-1.5 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)] ${isCustom ? 'bg-blue-500 shadow-blue-500/50' : 'bg-emerald-500'}`} />
                                                        <span className={`text-[8px] font-syncopate uppercase tracking-widest ${isCustom ? 'text-blue-500/60' : 'text-emerald-500/60'}`}>
                                                            {isCustom ? 'Link Active' : 'Active'}
                                                        </span>
                                                    </div>
                                                </div>
                                                <p className="text-md text-white/20 font-syncopate uppercase tracking-[0.3em] font-medium group-hover:text-white/40 transition-colors truncate max-w-[20rem] md:max-w-[40rem]">{social.url.replace('https://', '')}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-4 shrink-0">
                                            <a href={social.url} target="_blank" rel="noopener noreferrer">
                                                <Button variant="ghost" size="sm" className="w-14 h-14 p-0 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:border-luxury-gold/40 hover:text-luxury-gold hover:shadow-[0_0_20px_rgba(212,175,55,0.1)] transition-all duration-500">
                                                    <ExternalLink size={20} />
                                                </Button>
                                            </a>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="w-14 h-14 p-0 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:border-blue-500/30 hover:text-blue-500 transition-all duration-500"
                                                onClick={() => handleEdit(social)}
                                            >
                                                <Pencil size={20} />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="w-14 h-14 p-0 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:bg-red-500/5 hover:border-red-500/30 hover:text-red-500 transition-all duration-500"
                                                onClick={() => handleDelete(social.id)}
                                            >
                                                <Trash2 size={20} />
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        );
                    })
                )}
            </div>

            <Card className="p-10 border-white/5 bg-white/[0.01] relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-64 h-64 bg-luxury-gold/[0.02] blur-[80px] -ml-32 -mt-32" />
                <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                    <div className="max-w-3xl">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-2 bg-luxury-gold/10 rounded-lg">
                                <Globe size={20} className="text-luxury-gold" />
                            </div>
                            <h4 className="text-lg font-syncopate font-bold uppercase tracking-widest text-white/90">Global Visibility</h4>
                        </div>
                        <p className="text-md text-white/20 font-plus leading-relaxed">
                            All established social nodes are instantly projected onto your public domain.
                        </p>
                    </div>
                    <Button variant="outline" className="px-10 py-5 rounded-xl border-white/5 hover:border-luxury-gold/30 text-[10px] font-syncopate uppercase tracking-[0.3em]">
                        View Public Profile <ArrowUpRight size={14} className="ml-2" />
                    </Button>
                </div>
            </Card>

            <DeleteDialog
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={confirmDelete}
                isDeleting={deleting}
                title="Remove Link"
                description="This action will permanently remove this link from your profile. This cannot be undone."
            />
        </div>
    );
};

export default Socials;
