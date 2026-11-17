import React, { useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, ChevronLeft, Shield, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useTitle } from "@/hooks/useTitle";
import { Button } from "@/components/ui/Button";

const Auth = () => {
    useTitle("Sign In — Dockly.Pro");
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
            toast.success("Welcome back.");
            navigate("/dashboard");
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#000000] flex items-center justify-center p-6 relative overflow-hidden font-plus text-zinc-100 selection:bg-[#3ECF8E]/30 selection:text-white">
            {/* Supabase Emerald Ambient Background Glows */}
            <div className="absolute top-[-15%] left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-b from-[#3ECF8E]/[0.12] via-emerald-600/[0.03] to-transparent blur-[140px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[450px] h-[450px] bg-cyan-600/[0.03] blur-[140px] rounded-full pointer-events-none" />

            {/* Vercel subtle grid lines */}
            <div
                className="absolute inset-0 opacity-[0.035] pointer-events-none"
                style={{
                    backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
                    backgroundSize: '48px 48px'
                }}
            />

            {/* Back Navigation — JetBrains Mono */}
            <Link
                to="/"
                className="absolute top-6 left-6 z-[100] group flex items-center gap-2 text-zinc-400 hover:text-white transition-colors duration-200 font-jetbrains text-xs"
            >
                <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                <span>cd .. / home</span>
            </Link>

            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-[420px] relative z-10"
            >
                {/* Header Section with /dp.png */}
                <div className="text-center mb-8">
                    <div className="relative inline-block mb-4">
                        <img
                            src="/apple-touch-icon.png"
                            alt="Dockly Logo"
                            className="w-16 h-16 rounded-2xl object-contain shadow-2xl p-1 bg-zinc-950/90 border border-zinc-800 mx-auto"
                        />
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#3ECF8E] flex items-center justify-center border-2 border-black">
                            <div className="w-1.5 h-1.5 rounded-full bg-black" />
                        </div>
                    </div>

                    <h1 className="text-2xl sm:text-3xl font-outfit font-extrabold tracking-tight text-white mb-1.5">
                        dockly<span className="text-[#3ECF8E]">.pro</span>
                    </h1>
                    <p className="text-xs font-jetbrains text-zinc-400">
                        // Sovereign Creator Gateway
                    </p>
                </div>

                {/* Login Card */}
                <div className="bg-[#09090B]/90 border border-zinc-800 rounded-3xl p-7 sm:p-9 shadow-2xl backdrop-blur-2xl relative overflow-hidden">
                    <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#3ECF8E]/50 to-transparent" />

                    <form onSubmit={handleAuth} className="space-y-5">
                        {/* Email Field */}
                        <div className="space-y-2">
                            <label className="text-xs font-jetbrains font-medium text-zinc-300 ml-0.5 flex items-center justify-between">
                                <span>email_address</span>
                                <span className="text-[10px] text-zinc-500 font-normal">required</span>
                            </label>
                            <div className="relative group">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-[#3ECF8E] transition-colors" size={16} />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="commander@dockly.pro"
                                    className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-[#3ECF8E] focus:ring-1 focus:ring-[#3ECF8E]/30 transition-all text-white placeholder:text-zinc-600 text-sm font-jetbrains"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-0.5">
                                <label className="text-xs font-jetbrains font-medium text-zinc-300">
                                    password
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
                                    className="text-xs text-[#3ECF8E] hover:underline transition-colors font-jetbrains"
                                >
                                    forgot?
                                </button>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-[#3ECF8E] transition-colors" size={16} />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••••••"
                                    className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-[#3ECF8E] focus:ring-1 focus:ring-[#3ECF8E]/30 transition-all text-white placeholder:text-zinc-600 text-sm font-jetbrains"
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            variant="luxury"
                            disabled={loading}
                            className="w-full py-3.5 text-xs font-jetbrains font-bold tracking-wide rounded-xl mt-3"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    authenticating...
                                </span>
                            ) : (
                                <span className="flex items-center justify-center gap-2">
                                    <span>enter_vault</span>
                                    <ArrowRight size={14} />
                                </span>
                            )}
                        </Button>
                    </form>

                    {/* Footer Info */}
                    <div className="mt-6 pt-5 border-t border-zinc-800/80 text-center font-jetbrains">
                        <div className="flex items-center justify-center gap-2 mb-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#3ECF8E] animate-pulse shadow-[0_0_8px_#3ECF8E]" />
                            <span className="text-[11px] font-medium text-zinc-400">e2e_encrypted_session</span>
                        </div>
                        <p className="text-[10px] text-zinc-600 font-normal">
                            TLS 1.3 · Zero Knowledge Auth
                        </p>
                    </div>
                </div>

                {/* Bottom Copyright */}
                <p className="text-center mt-7 text-xs text-zinc-600 font-jetbrains">
                    © 2026 dockly.pro · v2.4
                </p>
            </motion.div>
        </div>
    );
};

export default Auth;
