
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { Lock, Sparkles, ShieldCheck, ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import { useTitle } from "@/hooks/useTitle";

const UpdatePassword = () => {
    useTitle("Secure Protocol // Update Credentials");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [username, setUsername] = useState("");
    const [isInvite, setIsInvite] = useState(false);
    const [loading, setLoading] = useState(false);
    const [verifying, setVerifying] = useState(true);
    const [isInvalid, setIsInvalid] = useState(false);
    const [isUsernameTaken, setIsUsernameTaken] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const verifySession = async () => {
            const hash = window.location.hash;
            const params = new URLSearchParams(hash.substring(1));

            if (params.get("type") === "invite") {
                setIsInvite(true);
            }

            if (params.get("error")) {
                setIsInvalid(true);
                setVerifying(false);
                return;
            }

            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                setVerifying(false);
                return;
            }

            const timeout = setTimeout(() => {
                supabase.auth.getSession().then(({ data: { session } }) => {
                    if (!session) {
                        setIsInvalid(true);
                    }
                    setVerifying(false);
                });
            }, 1000);

            return () => clearTimeout(timeout);
        };

        verifySession();
    }, []);

    // Username Availability Check for Invites
    useEffect(() => {
        if (!isInvite || username.length < 3) {
            setIsUsernameTaken(false);
            return;
        }

        const checkUsername = async () => {
            const { data } = await supabase
                .from("profiles")
                .select("username")
                .eq("username", username.toLowerCase())
                .maybeSingle();

            setIsUsernameTaken(!!data);
        };

        const timeoutId = setTimeout(checkUsername, 500);
        return () => clearTimeout(timeoutId);
    }, [username, isInvite]);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isInvite && isUsernameTaken) {
            toast.error("Sovereign handle is already allocated.");
            return;
        }

        setLoading(true);

        try {
            // 1. Update Password & Metadata
            const { data: { user }, error: authError } = await supabase.auth.updateUser({
                password: password,
                data: isInvite ? {
                    full_name: fullName,
                    username: username.toLowerCase()
                } : undefined
            });

            if (authError) throw authError;

            // 2. If invite, specifically update the profiles table too
            if (isInvite && user) {
                const { error: profileError } = await supabase
                    .from("profiles")
                    .update({
                        full_name: fullName,
                        username: username.toLowerCase(),
                        updated_at: new Date().toISOString()
                    })
                    .eq("id", user.id);

                if (profileError) throw profileError;
            }

            toast.success(isInvite ? "Identity established. Welcome to the Citadel." : "Access Key successfully regenerated. Sovereign Node secure.");
            navigate("/dashboard");
        } catch (error: any) {
            toast.error(error.message || "Failed to update Access Key.");
        } finally {
            setLoading(false);
        }
    };

    if (verifying) {
        return (
            <div className="min-h-screen bg-[#020202] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 rounded-full border border-luxury-gold/30 flex items-center justify-center">
                        <div className="w-1 h-1 bg-luxury-gold rounded-full animate-ping" />
                    </div>
                    <div className="text-[9px] font-syncopate text-luxury-gold uppercase tracking-[0.4em] animate-pulse">Verifying Credentials</div>
                </div>
            </div>
        );
    }

    if (isInvalid) {
        return (
            <div className="min-h-screen bg-[#020202] flex items-center justify-center p-6 md:p-12 relative overflow-hidden font-plus">
                <div className="absolute inset-0 noise opacity-20 pointer-events-none" />
                <div className="w-full max-w-lg relative z-10 text-center">
                    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-[9px] font-syncopate uppercase tracking-[0.4em] mb-8">
                        <ShieldCheck size={14} />
                        Security Protocol Alert
                    </div>
                    <h1 className="text-3xl md:text-5xl font-syncopate font-bold tracking-tighter text-white mb-6">
                        LINK <span className="text-red-500">EXPIRED</span>
                    </h1>
                    <p className="text-white/40 text-sm font-plus max-w-md mx-auto leading-relaxed mb-10">
                        This secure transmission has been consumed or the sovereign node rejected the credentials.
                        Links are one-time use for your security.
                    </p>
                    <Button
                        variant="luxury"
                        onClick={() => navigate('/auth')}
                        className="px-8 py-4 text-[10px] tracking-[0.4em] uppercase"
                    >
                        Return to Command
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#020202] flex items-center justify-center p-6 md:p-12 relative overflow-hidden font-plus">
            {/* Ambient Background Scenery */}
            <div className="absolute inset-0 noise opacity-20 pointer-events-none" />

            <a
                href="/"
                className="absolute top-6 md:top-10 left-6 md:left-10 z-[100] group flex items-center gap-3 md:gap-4 px-4 md:px-6 py-3 md:py-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-luxury-gold/30 hover:bg-white/[0.05] transition-all duration-700 backdrop-blur-md"
            >
                <ChevronLeft size={16} className="text-luxury-gold group-hover:-translate-x-1 transition-transform duration-500" />
                <span className="text-[9px] font-syncopate font-bold text-white/40 group-hover:text-white uppercase tracking-[0.4em] transition-colors">Abort Sequence</span>
            </a>

            <div className="w-full max-w-lg relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="mb-8 text-center">
                        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/[0.02] border border-luxury-gold/20 text-luxury-gold text-[9px] font-syncopate uppercase tracking-[0.4em] mb-6">
                            <ShieldCheck size={14} />
                            {isInvite ? "Invitation Protocol" : "Security Protocol Active"}
                        </div>
                        <h1 className="text-3xl md:text-4xl font-syncopate font-bold tracking-tighter text-white mb-4">
                            {isInvite ? "COMPLETE" : "UPDATE"} <span className="text-luxury-gold">{isInvite ? "IDENTITY" : "CREDENTIALS"}</span>
                        </h1>
                        <p className="text-white/40 text-xs font-plus max-w-md mx-auto leading-relaxed">
                            {isInvite
                                ? "Initialize your sovereign estate. Establish your digital presence with zero-knowledge security protocols."
                                : "Establish a new high-entropy Access Key for your Sovereign Node. Previous keys will be immediately revoked."}
                        </p>
                    </div>

                    <Card className="relative p-8 md:p-12 bg-[#080808]/80 !rounded-[3rem] border-white/5 backdrop-blur-[120px] shadow-2xl overflow-hidden">
                        <form onSubmit={handleUpdate} className="space-y-8">
                            {isInvite && (
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[8px] font-syncopate uppercase tracking-[0.4em] text-white/40 ml-4 font-bold">Formal Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            placeholder="ALEXANDER GREAT"
                                            className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-4 px-8 outline-none focus:border-luxury-gold/40 focus:bg-white/[0.04] transition-all duration-500 text-white placeholder:text-white/5 uppercase text-[11px] tracking-widest font-syncopate"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center ml-4">
                                            <label className="text-[8px] font-syncopate uppercase tracking-[0.4em] text-white/40 font-bold">Sovereign Handle</label>
                                            {isUsernameTaken && (
                                                <span className="text-[7px] font-syncopate text-red-500 uppercase tracking-widest animate-pulse">Coordinates Allocated</span>
                                            )}
                                        </div>
                                        <input
                                            type="text"
                                            required
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            placeholder="USER_001"
                                            className={`w-full bg-white/[0.02] border ${isUsernameTaken ? 'border-red-500/50' : 'border-white/5'} rounded-2xl py-4 px-8 outline-none focus:border-luxury-gold/40 focus:bg-white/[0.04] transition-all duration-500 text-white placeholder:text-white/5 uppercase text-[11px] tracking-widest font-syncopate`}
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="space-y-4">
                                <label className="text-[8px] font-syncopate uppercase tracking-[0.4em] text-white/40 ml-4 font-bold">
                                    {isInvite ? "Access Key" : "New Access Key"}
                                </label>
                                <div className="relative flex items-center">
                                    <Lock className="absolute left-6 text-luxury-gold/20" size={16} strokeWidth={1.5} />
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Min. 6 Characters"
                                        minLength={6}
                                        className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-4 pl-16 pr-8 outline-none focus:border-luxury-gold/40 focus:bg-white/[0.04] transition-all duration-500 text-white placeholder:text-white/5 uppercase text-[11px] tracking-widest font-syncopate"
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                variant="luxury"
                                className="w-full py-6 text-[11px] tracking-[0.6em] uppercase font-black shadow-[0_10px_40px_rgba(212,175,55,0.15)] hover:shadow-[0_15px_50px_rgba(212,175,55,0.25)] transition-all duration-700"
                                disabled={loading}
                            >
                                <span className="relative z-10 flex items-center justify-center gap-3">
                                    {loading ? "ENCRYPTING..." : isInvite ? "ESTABLISH" : "SECURE NODE"}
                                    {!loading && <Sparkles size={14} className="text-black/40" />}
                                </span>
                            </Button>
                        </form>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
};

export default UpdatePassword;
