import React, { useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Sparkles, ChevronLeft, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useTitle } from "@/hooks/useTitle";
import { Button } from "@/components/ui/Button";

const Auth = () => {
    useTitle("Access Vault");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) throw error;
            toast.success("Welcome back, Commander.");
            navigate("/dashboard");
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden font-plus">
            {/* Soft Ambient Background */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-luxury-gold/[0.05] blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-luxury-gold/[0.03] blur-[120px] rounded-full pointer-events-none" />

            {/* Subtle Texture */}
            <div className="absolute inset-0 noise opacity-[0.03] pointer-events-none" />

            {/* Back Navigation */}
            <Link
                to="/"
                className="absolute top-8 left-8 z-[100] group flex items-center gap-2 text-white/40 hover:text-white transition-all duration-300"
            >
                <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                <span className="text-xs font-medium tracking-wider">Back to Home</span>
            </Link>

            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="w-full max-w-[440px] relative z-10"
            >
                {/* Header Section */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/10 mb-6 shadow-2xl">
                        <Shield size={24} className="text-luxury-gold" />
                    </div>
                    <h1 className="text-3xl font-syncopate font-bold tracking-tight text-white mb-3">
                        DOCKED<span className="text-luxury-gold"> PRO</span>
                    </h1>
                    <p className="text-base text-white/50 font-plus tracking-wide">
                        The elite creator gateway
                    </p>
                </div>

                {/* Login Card */}
                <div className="bg-[#0A0A0A] border border-white/[0.08] rounded-[2.5rem] p-8 md:p-12 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)]">
                    <form onSubmit={handleAuth} className="space-y-8">
                        {/* Email Field */}
                        <div className="space-y-2.5">
                            <label className="text-sm font-medium text-white/70 ml-1">
                                Email Address
                            </label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-luxury-gold transition-colors" size={18} />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-luxury-gold/50 focus:bg-white/[0.05] transition-all duration-300 text-white placeholder:text-white/20 text-base"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2.5">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-sm font-medium text-white/70">
                                    Password
                                </label>
                                <button
                                    type="button"
                                    onClick={async () => {
                                        if (!email) {
                                            toast.error("Please enter your email coordinate.");
                                            return;
                                        }
                                        setLoading(true);
                                        try {
                                            const { error } = await supabase.functions.invoke('send-password-reset', {
                                                body: { email, redirectTo: `${window.location.origin}/auth/update-password` }
                                            });
                                            if (error) throw error;
                                            toast.success("Security reset link dispatched.");
                                        } catch (error: any) {
                                            toast.error(error.message);
                                        } finally {
                                            setLoading(false);
                                        }
                                    }}
                                    className="text-xs text-luxury-gold/60 hover:text-luxury-gold transition-colors font-medium"
                                >
                                    Forgot password?
                                </button>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-luxury-gold transition-colors" size={18} />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-luxury-gold/50 focus:bg-white/[0.05] transition-all duration-300 text-white placeholder:text-white/20 text-base"
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            variant="luxury"
                            disabled={loading}
                            className="w-full py-4 text-base font-bold shadow-xl shadow-luxury-gold/5 hover:shadow-luxury-gold/10 transition-all duration-500 rounded-2xl"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    Verifying...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    Secure Login
                                </span>
                            )}
                        </Button>
                    </form>

                    {/* Footer Info */}
                    <div className="mt-8 pt-8 border-t border-white/5 text-center">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                            <span className="text-[10px] font-syncopate text-white/30 uppercase tracking-[0.2em]">Secure Session Active</span>
                        </div>
                        <p className="text-[10px] font-syncopate uppercase text-white/20 font-plus mb-0">
                            Built for Creators
                        </p>
                    </div>
                </div>

                {/* Bottom Copyright */}
                <p className="text-center mt-10 text-[10px] text-white/10 font-syncopate uppercase tracking-[0.4em]">
                    © 2026 Docked Private Registry
                </p>
            </motion.div>
        </div>
    );
};

export default Auth;
