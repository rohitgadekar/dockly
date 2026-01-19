import { useState, useEffect, useRef } from "react";
import { useTitle } from "@/hooks/useTitle";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { LuxeSelect } from "@/components/ui/LuxeSelect";
import {
    Shield,
    Loader2,
    Save,
    LogOut,
    Sparkles,
    Fingerprint,
    Trash2,
    Coins,
    Plus,
    Radio,
    Clock,
    Video,
    X,
    Volume2,
    VolumeX,
    Lock
} from "lucide-react";
import { useDashboard } from "@/hooks/useDashboard";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { AvatarUpload } from "@/components/dashboard/AvatarUpload";
import { DeleteDialog } from "@/components/ui/DeleteDialog";
import { LuxuryModal } from "@/components/ui/LuxuryModal";
import { formatDistanceToNow } from "date-fns";

const currencyOptions = [
    { value: "USD", label: "US Dollar ($)", icon: <Coins size={18} /> },
    { value: "INR", label: "Indian Rupee (₹)", icon: <Coins size={18} /> },
    { value: "EUR", label: "Euro (€)", icon: <Coins size={18} /> },
    { value: "GBP", label: "British Pound (£)", icon: <Coins size={18} /> },
    { value: "JPY", label: "Japanese Yen (¥)", icon: <Coins size={18} /> },
    { value: "AED", label: "UAE Dirham (د.إ)", icon: <Coins size={18} /> },
];

const Settings = () => {
    useTitle("Archive Control");
    const { data, isLoading } = useDashboard();
    const [fullName, setFullName] = useState("");
    const [bio, setBio] = useState("");
    const [avatarUrl, setAvatarUrl] = useState("");
    const [currency, setCurrency] = useState("USD");
    const [youtubeChannelId, setYoutubeChannelId] = useState("");
    const [role, setRole] = useState("");
    const [newsletterEnabled, setNewsletterEnabled] = useState(false);
    const [acceptingInquiries, setAcceptingInquiries] = useState(false);
    const [loading, setLoading] = useState(false);
    const [uploadingStory, setUploadingStory] = useState(false);
    const [updatingPassword, setUpdatingPassword] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [stories, setStories] = useState<any[]>([]);
    const [previewStory, setPreviewStory] = useState<any | null>(null);
    const [isMuted, setIsMuted] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const previewVideoRef = useRef<HTMLVideoElement>(null);
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    useEffect(() => {
        if (data?.profile) {
            setFullName(data.profile.full_name || "");
            setBio(data.profile.bio || "");
            setAvatarUrl(data.profile.avatar_url || "");
            setCurrency(data.profile.currency || "USD");
            setYoutubeChannelId(data.profile.youtube_channel_id || "");
            setRole(data.profile.role || "Creator");
            setNewsletterEnabled(data.profile.newsletter_enabled || false);
            setAcceptingInquiries(data.profile.accepting_inquiries || false);
        }
    }, [data?.profile]);

    useEffect(() => {
        if (data?.stories) {
            setStories(data.stories || []);
        }
    }, [data?.stories]);

    useEffect(() => {
        if (previewVideoRef.current) {
            previewVideoRef.current.muted = isMuted;
        }
    }, [isMuted, previewStory]);

    const handleUploadStory = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploadingStory(true);
            const file = event.target.files?.[0];
            if (!file) return;

            // 50MB Limit
            if (file.size > 50 * 1024 * 1024) {
                throw new Error("Instance exceeds 50MB telemetry limit.");
            }

            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Unauthorized");

            const uploadProcess = async (file: File) => {
                const fileExt = file.name.split('.').pop();
                const filePath = `${user.id}/${Math.random()}.${fileExt}`;

                const { error: uploadError } = await supabase.storage
                    .from('stories')
                    .upload(filePath, file);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('stories')
                    .getPublicUrl(filePath);

                const { error: insertError } = await supabase
                    .from('stories')
                    .insert([{
                        profile_id: user.id,
                        media_url: publicUrl,
                        media_type: file.type.startsWith('image/') ? 'image' : 'video',
                        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
                    }]);

                if (insertError) throw insertError;

                toast.success("Chronicle Vaulted Successfully.");
                queryClient.invalidateQueries({ queryKey: ["dashboard-data"] });
            };

            // Video Duration Check (30s)
            if (file.type.startsWith('video/')) {
                const video = document.createElement('video');
                video.preload = 'metadata';
                video.onloadedmetadata = function () {
                    window.URL.revokeObjectURL(video.src);
                    if (video.duration > 30) {
                        toast.error("Temporal limit reached: Videos must be under 30 seconds.");
                        setUploadingStory(false);
                    } else {
                        uploadProcess(file).finally(() => setUploadingStory(false));
                    }
                }
                video.src = URL.createObjectURL(file);
            } else {
                await uploadProcess(file);
                setUploadingStory(false);
            }
        } catch (error: any) {
            toast.error(error.message);
            setUploadingStory(false);
        }
    };

    const handleDeleteStory = async (id: string) => {
        try {
            const { error } = await supabase.from('stories').delete().eq('id', id);
            if (error) throw error;
            toast.success("Chronicle Purged.");
            queryClient.invalidateQueries({ queryKey: ["dashboard-data"] });
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Unauthorized");

            const { error } = await supabase.from("profiles").update({
                full_name: fullName,
                bio: bio,
                avatar_url: avatarUrl,
                currency: currency,
                youtube_channel_id: youtubeChannelId,
                role: role,
                newsletter_enabled: newsletterEnabled,
                updated_at: new Date().toISOString()
            }).eq("id", user.id);

            if (error) throw error;

            toast.success("Identity profile recalibrated.");
            queryClient.invalidateQueries({ queryKey: ["dashboard-data"] });
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            toast.error("Cipher Mismatch: Passwords do not align.");
            return;
        }
        if (newPassword.length < 6) {
            toast.error("Cipher Weakness: Minimum 6 characters required.");
            return;
        }

        setUpdatingPassword(true);
        try {
            const { error } = await supabase.auth.updateUser({ password: newPassword });
            if (error) throw error;
            toast.success("Security Protocol Updated. Cipher Rotated.");
            setNewPassword("");
            setConfirmPassword("");
        } catch (error: any) {
            toast.error("Update Failed: " + error.message);
        } finally {
            setUpdatingPassword(false);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate("/auth");
        toast.success("Session terminated. Presence cleared.");
    };

    const handleDeleteAccount = () => {
        setIsDeleteDialogOpen(true);
    };

    const confirmDeleteAccount = async () => {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Unauthorized");

            // 1. Initiate Tactical Purge via RPC
            // This function deletes the user from auth.users, triggering cascaded deletion across all tables
            const { error: rpcError } = await supabase.rpc('delete_user_protocol');

            if (rpcError) {
                console.warn("RPC Protocol not detected. Initiating manual profile de-allocation.");
                // Fallback: Delete profile record manually (cascades to all app data)
                const { error: profileError } = await supabase.from('profiles').delete().eq('id', user.id);
                if (profileError) throw profileError;
            }

            // 2. Terminate Auth Session
            await supabase.auth.signOut();

            toast.success("Identity Purged. Terminus reached.");
            navigate("/auth");
        } catch (error: any) {
            console.error("Purge Error:", error);
            toast.error("Purge Failed: " + error.message);
        } finally {
            setLoading(false);
            setIsDeleteDialogOpen(false);
        }
    };

    if (isLoading) {
        return (
            <div className="h-[80vh] flex flex-col items-center justify-center gap-6">
                <Loader2 className="animate-spin text-luxury-gold" size={48} />
                <p className="text-white/20 font-syncopate uppercase tracking-[0.5em] text-[10px]">Accessing Identity Vault...</p>
            </div>
        );
    }

    return (
        <div className="max-w-[1000px] mx-auto space-y-24 py-12 px-4">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 pb-16 relative">
                <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-luxury-gold/[0.03] blur-[150px] -ml-48 -mt-48 pointer-events-none transition-colors duration-1000" />

                <div className="relative z-10 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-4 mb-6">
                        <div className="px-4 py-1.5 bg-white/[0.03] border border-white/5 rounded-full flex items-center gap-2 backdrop-blur-md">
                            <Sparkles size={12} className="text-luxury-gold shadow-[0_0_10px_rgba(212,175,55,0.4)]" />
                            <span className="text-[10px] font-syncopate uppercase tracking-widest text-white/40">Profile Control</span>
                        </div>
                    </div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-7xl font-syncopate font-bold uppercase tracking-tighter leading-none"
                    >
                        Settings<span className="text-luxury-gold">.</span>
                    </motion.h1>
                    <p className="text-white/20 font-plus text-xl mt-8 max-w-2xl leading-relaxed italic">
                        Manage your account settings and profile information.
                    </p>
                </div>

                <div className="flex gap-6 relative z-10 w-full md:w-auto">
                    <Button
                        variant="ghost"
                        className="w-full md:w-auto text-red-500/40 hover:text-red-500 hover:bg-red-500/5 gap-3 px-10 py-7 text-xs font-syncopate tracking-[0.2em] uppercase border border-red-500/5 rounded-2xl transition-all duration-700"
                        onClick={handleLogout}
                    >
                        <LogOut size={18} /> Logout
                    </Button>
                </div>
            </header>

            <div className="space-y-24">
                {/* Section 1: Profile Information */}
                <Card className="p-16 border-white/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-luxury-gold/[0.02] blur-[120px] -mr-48 -mt-48 pointer-events-none" />

                    <div className="flex flex-col gap-20">
                        <div className="flex flex-col md:flex-row items-center gap-12 border-b border-white/5 pb-16">
                            <AvatarUpload
                                currentUrl={avatarUrl}
                                onUploadComplete={(url) => {
                                    setAvatarUrl(url);
                                    queryClient.invalidateQueries({ queryKey: ["dashboard-data"] });
                                    if (data?.profile?.username) {
                                        queryClient.invalidateQueries({ queryKey: ["profile", data.profile.username] });
                                    }
                                }}
                            />
                            <div className="text-center md:text-left">
                                <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
                                    <div className="w-14 h-14 bg-luxury-gold/5 rounded-[1.5rem] flex items-center justify-center text-luxury-gold border border-luxury-gold/10">
                                        <Fingerprint size={28} strokeWidth={1} />
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-syncopate font-bold uppercase tracking-tight text-white">Profile Information</h2>
                                        <p className="text-[10px] text-white/20 font-syncopate uppercase tracking-[0.4em] mt-2">Update your personal details</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleUpdateProfile} className="space-y-16">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-syncopate uppercase tracking-[0.4em] text-white/20 ml-2">Username</label>
                                    <div className="relative">
                                        <input
                                            disabled
                                            value={`@${data?.profile?.username}`}
                                            className="w-full bg-white/[0.01] border border-white/5 rounded-[2rem] py-6 px-10 text-white/10 cursor-not-allowed font-plus text-xl"
                                        />
                                        <div className="absolute right-8 top-1/2 -translate-y-1/2">
                                            <Shield size={18} className="text-white/5" />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-syncopate uppercase tracking-[0.4em] text-white/20 ml-2">Full Name</label>
                                    <input
                                        required
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        placeholder="Full Name"
                                        className="w-full bg-white/[0.02] border border-white/5 rounded-[2rem] py-6 px-10 outline-none focus:border-luxury-gold/40 focus:bg-white/[0.04] transition-all duration-700 font-plus text-xl text-white"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-syncopate uppercase tracking-[0.4em] text-white/20 ml-2">Role / Title</label>
                                    <input
                                        required
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
                                        placeholder="Ex. Visual Architect, Lead Protocol Engineer"
                                        className="w-full bg-white/[0.02] border border-white/5 rounded-[2rem] py-6 px-10 outline-none focus:border-luxury-gold/40 focus:bg-white/[0.04] transition-all duration-700 font-plus text-xl text-white"
                                    />
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-syncopate uppercase tracking-[0.4em] text-white/20 ml-2">Preferred Currency</label>
                                    <LuxeSelect
                                        options={currencyOptions}
                                        value={currency}
                                        onChange={setCurrency}
                                        className="!rounded-[2rem]"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-syncopate uppercase tracking-[0.4em] text-white/20 ml-2">YouTube Handle</label>
                                    <input
                                        value={youtubeChannelId}
                                        onChange={(e) => setYoutubeChannelId(e.target.value)}
                                        placeholder="@username or UC..."
                                        className="w-full bg-white/[0.02] border border-white/5 rounded-[2rem] py-6 px-10 outline-none focus:border-luxury-gold/40 focus:bg-white/[0.04] transition-all duration-700 font-plus text-xl text-white"
                                    />
                                    <p className="text-[8px] font-syncopate uppercase tracking-widest text-white/10 ml-4 italic">Supports @handles, IDs, or full channel links.</p>
                                </div>
                                <div className="space-y-4 invisible hidden md:block" />
                            </div>


                            <div className="space-y-4">
                                <label className="text-[10px] font-syncopate uppercase tracking-[0.4em] text-white/20 ml-2">Bio / About</label>
                                <textarea
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    placeholder="Your strategic focus..."
                                    className="w-full bg-white/[0.02] border border-white/5 rounded-[2.5rem] py-8 px-10 outline-none focus:border-luxury-gold/40 focus:bg-white/[0.04] transition-all duration-700 h-48 font-plus text-xl leading-relaxed text-white italic resize-none"
                                />
                            </div>
                            <Button
                                type="submit"
                                variant="luxury"
                                className="w-full py-8 text-xs tracking-[0.4em] uppercase font-syncopate transition-all duration-1000 overflow-hidden relative group"
                                disabled={loading}
                            >
                                <motion.div
                                    className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"
                                />
                                {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                                Save Changes
                            </Button>
                        </form>
                    </div>
                </Card>

                {/* Section 2: Newsletter Configuration */}
                <Card className="p-16 border-white/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-luxury-gold/[0.02] blur-[120px] -mr-48 -mt-48 pointer-events-none" />

                    <div className="flex flex-col md:flex-row items-center gap-12 border-b border-white/5 pb-16 mb-12">
                        <div className="w-20 h-20 bg-luxury-gold/5 rounded-[1.5rem] flex items-center justify-center text-luxury-gold border border-luxury-gold/10 shrink-0">
                            <Radio size={32} strokeWidth={1} />
                        </div>
                        <div className="text-center md:text-left">
                            <h2 className="text-3xl font-syncopate font-bold uppercase tracking-tight text-white">Newsletter Configuration</h2>
                            <p className="text-[10px] text-white/20 font-syncopate uppercase tracking-[0.4em] mt-2">Manage public newsletter subscription</p>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-between p-8 bg-white/[0.02] border border-white/5 rounded-[2rem] gap-8">
                        <div className="max-w-xl">
                            <label className="text-xs font-syncopate uppercase tracking-[0.2em] text-white block mb-3">Subscription Visibility</label>
                            <p className="text-sm text-white/40 font-plus leading-relaxed">
                                When active, a newsletter subscription form will be visible on your public profile, allowing visitors to subscribe.
                            </p>
                        </div>
                        <button
                            type="button"
                            disabled={loading}
                            onClick={async () => {
                                const newValue = !newsletterEnabled;
                                setNewsletterEnabled(newValue);
                                try {
                                    const { data: { user } } = await supabase.auth.getUser();
                                    if (user) {
                                        await supabase.from("profiles").update({
                                            newsletter_enabled: newValue,
                                            updated_at: new Date().toISOString()
                                        }).eq("id", user.id);
                                        queryClient.invalidateQueries({ queryKey: ["dashboard-data"] });
                                        toast.success(newValue ? "Newsletter Enabled" : "Newsletter Disabled");
                                    }
                                } catch (error) {
                                    console.error("Toggle failed", error);
                                    setNewsletterEnabled(!newValue); // Revert on error
                                    toast.error("Connection failed");
                                }
                            }}
                            className={`w-20 h-10 rounded-full relative transition-all duration-500 ease-out border-2 ${newsletterEnabled ? 'bg-luxury-gold/10 border-luxury-gold' : 'bg-white/5 border-white/10'}`}
                        >
                            <div className={`absolute top-1 left-1 w-7 h-7 rounded-full bg-white transition-all duration-500 shadow-[0_0_15px_rgba(255,255,255,0.3)] ${newsletterEnabled ? 'translate-x-10 bg-luxury-gold shadow-[0_0_20px_rgba(212,175,55,0.6)]' : 'translate-x-0 opacity-40'}`} />
                        </button>
                    </div>
                </Card>

                {/* Section 3: Brand Inquiries Configuration */}
                <Card className="p-16 border-white/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-500/[0.02] blur-[120px] -mr-48 -mt-48 pointer-events-none" />

                    <div className="flex flex-col md:flex-row items-center gap-12 border-b border-white/5 pb-16 mb-12">
                        <div className="w-20 h-20 bg-emerald-500/5 rounded-[1.5rem] flex items-center justify-center text-emerald-500 border border-emerald-500/10 shrink-0">
                            <Sparkles size={32} strokeWidth={1} />
                        </div>
                        <div className="text-center md:text-left">
                            <h2 className="text-3xl font-syncopate font-bold uppercase tracking-tight text-white">Brand Inquiries</h2>
                            <p className="text-[10px] text-white/20 font-syncopate uppercase tracking-[0.4em] mt-2">Accept collaboration & brand deal requests</p>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-between p-8 bg-white/[0.02] border border-white/5 rounded-[2rem] gap-8">
                        <div className="max-w-xl">
                            <label className="text-xs font-syncopate uppercase tracking-[0.2em] text-white block mb-3">Inquiry Form Visibility</label>
                            <p className="text-sm text-white/40 font-plus leading-relaxed">
                                When active, brands and collaborators can reach out to you directly through your public profile. View and manage all requests in the Inquiries dashboard.
                            </p>
                        </div>
                        <button
                            type="button"
                            disabled={loading}
                            onClick={async () => {
                                const newValue = !acceptingInquiries;
                                setAcceptingInquiries(newValue);
                                try {
                                    const { data: { user } } = await supabase.auth.getUser();
                                    if (user) {
                                        await supabase.from("profiles").update({
                                            accepting_inquiries: newValue,
                                            updated_at: new Date().toISOString()
                                        }).eq("id", user.id);
                                        queryClient.invalidateQueries({ queryKey: ["dashboard-data"] });
                                        toast.success(newValue ? "Now Accepting Inquiries" : "Inquiries Disabled");
                                    }
                                } catch (error) {
                                    console.error("Toggle failed", error);
                                    setAcceptingInquiries(!newValue); // Revert on error
                                    toast.error("Connection failed");
                                }
                            }}
                            className={`w-20 h-10 rounded-full relative transition-all duration-500 ease-out border-2 ${acceptingInquiries ? 'bg-emerald-500/10 border-emerald-500' : 'bg-white/5 border-white/10'}`}
                        >
                            <div className={`absolute top-1 left-1 w-7 h-7 rounded-full bg-white transition-all duration-500 shadow-[0_0_15px_rgba(255,255,255,0.3)] ${acceptingInquiries ? 'translate-x-10 bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.6)]' : 'translate-x-0 opacity-40'}`} />
                        </button>
                    </div>
                </Card>

                {/* Section 4: Stories */}
                <Card className="p-16 border-white/5 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-luxury-gold/[0.01] blur-[120px] -ml-48 -mt-48 pointer-events-none" />

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16 border-b border-white/5 pb-12">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 bg-luxury-gold/5 rounded-[2rem] flex items-center justify-center text-luxury-gold border border-luxury-gold/10 group-hover:scale-105 transition-transform duration-700">
                                <Radio size={32} strokeWidth={1} className="animate-pulse" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-syncopate font-bold uppercase tracking-tight text-white">Stories</h2>
                                <p className="text-[10px] text-white/20 font-syncopate uppercase tracking-[0.4em] mt-2">Manage your 24h statuses</p>
                            </div>
                        </div>

                        <div className="w-full md:w-auto">
                            <Button
                                variant="luxury"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploadingStory}
                                className="w-full md:w-auto gap-4 px-10 py-6 rounded-2xl shadow-2xl text-xs tracking-[0.2em] font-syncopate uppercase group"
                            >
                                {uploadingStory ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
                                Add Story
                            </Button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleUploadStory}
                                accept="image/*,video/*"
                                className="hidden"
                            />
                        </div>
                    </div>

                    <p className="text-lg text-white/30 font-plus leading-relaxed max-w-2xl italic mb-12">
                        Upload ephemeral stories visible on your profile for <span className="text-luxury-gold">24 hours</span>.
                        Videos are limited to <span className="text-luxury-gold font-bold">30 seconds</span>.
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                        {stories.length === 0 ? (
                            <div className="col-span-full py-20 text-center bg-white/[0.01] border border-dashed border-white/5 rounded-[2rem] group/empty">
                                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/5 group-hover/empty:border-luxury-gold/20 transition-all">
                                    <Clock className="text-white/10 group-hover/empty:text-luxury-gold transition-colors" size={24} />
                                </div>
                                <p className="text-white/20 font-syncopate uppercase tracking-widest text-[9px]">No Active Stories</p>
                            </div>
                        ) : (
                            stories.map((story) => (
                                <motion.div
                                    key={story.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    onClick={() => setPreviewStory(story)}
                                    className="group/story relative aspect-[9/16] rounded-2xl overflow-hidden border border-white/10 bg-black cursor-pointer"
                                >
                                    {story.media_type === 'video' ? (
                                        <div className="relative h-full w-full">
                                            <video
                                                src={story.media_url}
                                                className="w-full h-full object-cover opacity-60 group-hover/story:opacity-100 transition-opacity"
                                                muted
                                                playsInline
                                            />
                                            <div className="absolute top-2 right-2 p-1.5 bg-black/40 backdrop-blur-md rounded-lg border border-white/5">
                                                <Video size={10} className="text-luxury-gold" />
                                            </div>
                                        </div>
                                    ) : (
                                        <img
                                            src={story.media_url}
                                            alt="Story"
                                            className="w-full h-full object-cover opacity-60 group-hover/story:opacity-100 transition-opacity"
                                        />
                                    )}

                                    <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black to-transparent">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteStory(story.id);
                                            }}
                                            className="w-full py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-all opacity-0 group-hover/story:opacity-100 translate-y-2 group-hover/story:translate-y-0"
                                        >
                                            <Trash2 size={12} className="mx-auto" />
                                        </button>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                </Card>

                {/* Section 4: Security */}
                <Card className="p-16 border-white/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-luxury-gold/[0.02] blur-[120px] -mr-48 -mt-48 pointer-events-none" />

                    <div className="flex flex-col gap-20">
                        <div className="flex flex-col md:flex-row items-center gap-12 border-b border-white/5 pb-16">
                            <div className="w-20 h-20 bg-luxury-gold/5 rounded-[1.5rem] flex items-center justify-center text-luxury-gold border border-luxury-gold/10 shrink-0">
                                <Lock size={32} strokeWidth={1} />
                            </div>
                            <div className="text-center md:text-left">
                                <h2 className="text-3xl font-syncopate font-bold uppercase tracking-tight text-white">Security</h2>
                                <p className="text-[10px] text-white/20 font-syncopate uppercase tracking-[0.4em] mt-2">Change Password</p>
                            </div>
                        </div>

                        <form onSubmit={handleUpdatePassword} className="space-y-12">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-syncopate uppercase tracking-[0.4em] text-white/20 ml-2">New Password</label>
                                    <input
                                        type="password"
                                        required
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="••••••••••••"
                                        className="w-full bg-white/[0.02] border border-white/5 rounded-[2rem] py-6 px-10 outline-none focus:border-luxury-gold/40 focus:bg-white/[0.04] transition-all duration-700 font-plus text-xl text-white"
                                    />
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-syncopate uppercase tracking-[0.4em] text-white/20 ml-2">Confirm Password</label>
                                    <input
                                        type="password"
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="••••••••••••"
                                        className="w-full bg-white/[0.02] border border-white/5 rounded-[2rem] py-6 px-10 outline-none focus:border-luxury-gold/40 focus:bg-white/[0.04] transition-all duration-700 font-plus text-xl text-white"
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                variant="luxury"
                                className="w-full py-8 text-xs tracking-[0.4em] uppercase font-syncopate transition-all duration-1000 overflow-hidden relative group"
                                disabled={updatingPassword}
                            >
                                <motion.div
                                    className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"
                                />
                                {updatingPassword ? <Loader2 className="animate-spin" size={20} /> : <Lock size={20} />}
                                Update Password
                            </Button>
                        </form>
                    </div>
                </Card>

                {/* Section 5: Delete Account */}
                <Card className="p-16 border-red-500/5 bg-red-500/[0.002] group">
                    <div className="flex flex-col md:flex-row items-center gap-12">
                        <div className="w-20 h-20 bg-red-500/5 rounded-[1.5rem] flex items-center justify-center text-red-500/20 group-hover:text-red-500 transition-colors duration-1000 border border-red-500/5 shrink-0 shadow-2xl">
                            <Trash2 size={32} strokeWidth={1} />
                        </div>
                        <div className="flex-1 text-center md:text-left space-y-6">
                            <div>
                                <h2 className="text-3xl font-syncopate font-bold uppercase tracking-tight text-red-500/20 group-hover:text-red-500 transition-colors">Delete Account</h2>
                                <p className="text-[10px] text-red-500/10 font-syncopate uppercase tracking-[0.5em] mt-2">Permanent Account Deletion</p>
                            </div>
                            <p className="text-lg text-white/5 font-plus leading-relaxed max-w-2xl group-hover:text-white/20 transition-colors">
                                Permanently delete your account and all associated data. This action cannot be undone.
                            </p>
                        </div>
                        <Button
                            variant="ghost"
                            className="px-12 py-7 text-[10px] font-syncopate uppercase tracking-[0.4em] border border-red-500/5 hover:border-red-500/20 text-red-500/20 hover:text-red-500 hover:bg-red-500/5 transition-all duration-1000 shrink-0"
                            onClick={handleDeleteAccount}
                        >
                            Delete Account
                        </Button>
                    </div>
                </Card>
            </div>
            <DeleteDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={confirmDeleteAccount}
                isDeleting={loading}
                title="DELETE ACCOUNT"
                description="WARNING: You are about to permanently delete your account. This action cannot be undone. Are you sure you want to proceed?"
            />

            {/* Story Preview Overlay */}
            <LuxuryModal
                isOpen={!!previewStory}
                onClose={() => setPreviewStory(null)}
                className="!w-auto !h-auto !max-h-[85vh] aspect-[9/16] !bg-black !p-0 !border-white/10 !overflow-hidden"
            >
                <div className="relative w-full h-full flex items-center justify-center bg-[#050505]">
                    <div className="absolute inset-0 z-10 pointer-events-none opacity-[0.03]" style={{ backgroundImage: `url('https://grainy-gradients.vercel.app/noise.svg')` }} />

                    <div className="absolute top-6 right-6 z-50">
                        <button
                            onClick={() => setPreviewStory(null)}
                            className="p-3 bg-black/40 backdrop-blur-xl rounded-full text-white/60 hover:text-white transition-all border border-white/10 hover:border-white/20"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {previewStory && (
                        <>
                            {previewStory.media_type === 'video' ? (
                                <video
                                    ref={previewVideoRef}
                                    src={previewStory.media_url}
                                    className="w-full h-full object-cover"
                                    autoPlay
                                    loop
                                    playsInline
                                />
                            ) : (
                                <img
                                    src={previewStory.media_url}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                />
                            )}

                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

                            {previewStory.media_type === 'video' && (
                                <div className="absolute bottom-8 right-8 z-50">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setIsMuted(!isMuted);
                                        }}
                                        className="w-12 h-12 bg-black/40 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/10 text-white/60 hover:text-luxury-gold transition-colors"
                                    >
                                        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                                    </button>
                                </div>
                            )}

                            <div className="absolute bottom-8 left-8 z-40">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-luxury-gold/10 border border-luxury-gold/20 flex items-center justify-center">
                                        <img src={avatarUrl || `https://ui-avatars.com/api/?name=${fullName}&background=random`} alt="User" className="w-full h-full object-cover rounded-full" />
                                    </div>
                                    <div>
                                        <p className="text-white text-sm font-plus font-bold shadow-black drop-shadow-md">{fullName}</p>
                                        <p className="text-white/60 text-[10px] font-syncopate uppercase tracking-widest shadow-black drop-shadow-md">
                                            {previewStory.created_at ? formatDistanceToNow(new Date(previewStory.created_at), { addSuffix: true }) : 'Just now'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </LuxuryModal>
        </div>
    );
};

export default Settings;
