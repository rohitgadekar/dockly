import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Sparkles, ShieldCheck, ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useTitle } from "@/hooks/useTitle";

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    useTitle(isLogin ? "Access Vault" : "Create Identity");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [fullName, setFullName] = useState("");
    const [loading, setLoading] = useState(false);
    const [isUsernameTaken, setIsUsernameTaken] = useState(false);
    const navigate = useNavigate();

    // Instant Coordinate Verification (Debounced)
    React.useEffect(() => {
        const checkUsername = async () => {
            if (username.length < 3) {
                setIsUsernameTaken(false);
                return;
            };

            const { data } = await supabase
                .from("profiles")
                .select("username")
                .eq("username", username.toLowerCase())
                .maybeSingle();

            setIsUsernameTaken(!!data);
        };

        const timeoutId = setTimeout(checkUsername, 500);
        return () => clearTimeout(timeoutId);
    }, [username]);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
                toast.success("Welcome back, Commander.");
            } else {
                // Tactical Username Availability Check
                const { data: existingUser, error: checkError } = await supabase
                    .from("profiles")
                    .select("username")
                    .eq("username", username.toLowerCase())
                    .maybeSingle();

                if (checkError) throw checkError;

                if (existingUser) {
                    toast.error("COORDINATES TAKEN: This Sovereign Handle is already allocated.");
                    setLoading(false);
                    return;
                }

                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            username: username.toLowerCase(),
                            full_name: fullName,
                        }
                    }
                });
                if (error) throw error;
                toast.success("Identity established. Access granted.");
            }
            navigate("/dashboard");
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#020202] flex items-center justify-center p-6 md:p-12 relative overflow-hidden font-plus">
            {/* Ambient Background Scenery */}
            <div className="absolute inset-0 noise opacity-20 pointer-events-none" />

            {/* Back Button Node */}
            <Link
                to="/"
                className="absolute top-6 md:top-10 left-6 md:left-10 z-[100] group flex items-center gap-3 md:gap-4 px-4 md:px-6 py-3 md:py-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-luxury-gold/30 hover:bg-white/[0.05] transition-all duration-700 backdrop-blur-md"
            >
                <ChevronLeft size={16} className="text-luxury-gold group-hover:-translate-x-1 transition-transform duration-500" />
                <span className="text-[9px] font-syncopate font-bold text-white/40 group-hover:text-white uppercase tracking-[0.4em] transition-colors">Return to Matrix</span>
            </Link>
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-luxury-gold/[0.03] blur-[150px] rounded-full animate-pulse-slow" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-luxury-gold/[0.02] blur-[150px] rounded-full animate-pulse-slow" style={{ animationDelay: "3s" }} />

            {/* Tactical Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(212,175,55,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(212,175,55,0.02)_1px,transparent_1px)] bg-[size:100px_100px] pointer-events-none" />

            <div className="w-full max-w-7xl relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">

                {/* Left Panel: Cinematic Branding */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                    className="flex flex-col items-start text-left space-y-8"
                >
                    <motion.div
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="inline-flex items-center gap-3 px-4 md:px-6 py-2.5 rounded-full bg-white/[0.02] border border-luxury-gold/20 text-luxury-gold text-[7px] md:text-[9px] font-syncopate uppercase tracking-[0.3em] md:tracking-[0.5em] shadow-[0_0_30px_rgba(212,175,55,0.1)]"
                    >
                        <ShieldCheck size={14} className="animate-pulse" />
                        {isLogin ? "Sovereign Gateway" : "Registry Initialization"}
                    </motion.div>

                    <div className="space-y-6">
                        <h1 className="text-4xl sm:text-6xl md:text-8xl font-syncopate font-bold tracking-tighter text-white leading-[0.9]">
                            {isLogin ? "ACCESS" : "CREATE"}<br />
                            <span className="text-luxury-gold drop-shadow-2xl">{isLogin ? "COMMAND" : "ESTATE"}</span>
                        </h1>
                        <p className="text-white/40 text-xs md:text-base font-plus max-w-md leading-relaxed">
                            {isLogin
                                ? "Re-establish connection to your digital sovereign. Secure high-frequency node access for authorized personnel only."
                                : "Initialize your permanent archival node. Establish your digital presence with zero-knowledge security protocols."}
                        </p>
                    </div>

                    <div className="flex flex-col gap-6 pt-8 border-t border-white/5 w-full max-w-sm">
                        <div className="flex items-center gap-4 group cursor-default">
                            <div className="w-1.5 h-1.5 rounded-full bg-luxury-gold shadow-[0_0_8px_#D4AF37]" />
                            <span className="text-[8px] md:text-[10px] font-syncopate uppercase tracking-[0.2em] md:tracking-[0.4em] text-white/20 group-hover:text-white/60 transition-colors">1024-Bit Citadel Cipher</span>
                        </div>
                        <div className="flex items-center gap-4 group cursor-default">
                            <div className="w-1.5 h-1.5 rounded-full bg-luxury-gold shadow-[0_0_8px_#D4AF37]" />
                            <span className="text-[8px] md:text-[10px] font-syncopate uppercase tracking-[0.2em] md:tracking-[0.4em] text-white/20 group-hover:text-white/60 transition-colors">Sovereign Node Isolation</span>
                        </div>
                    </div>
                </motion.div>

                {/* Right Panel: Authentication Matrix */}
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                    className="relative"
                >
                    <div className="absolute -inset-4 bg-luxury-gold/5 blur-[100px] opacity-20 pointer-events-none" />

                    <Card className="relative p-8 md:p-12 bg-[#080808]/80 !rounded-[3rem] border-white/5 backdrop-blur-[120px] shadow-2xl overflow-hidden max-w-lg mx-auto lg:ml-auto">
                        {/* Biometric Loading Line */}
                        {loading && (
                            <motion.div
                                initial={{ top: 0 }}
                                animate={{ top: "100%" }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute left-0 right-0 h-[2px] bg-luxury-gold shadow-[0_0_20px_#D4AF37] z-50 pointer-events-none"
                            />
                        )}

                        <form onSubmit={handleAuth} className="space-y-6">
                            {!isLogin && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-6"
                                >
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
                                </motion.div>
                            )}

                            <div className="space-y-2">
                                <label className="text-[8px] font-syncopate uppercase tracking-[0.4em] text-white/40 ml-4 font-bold">Registry Email</label>
                                <div className="relative flex items-center">
                                    <Mail className="absolute left-6 text-luxury-gold/20" size={16} strokeWidth={1.5} />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="EXECUTIVE@DOCKED.PRO"
                                        className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-4 pl-16 pr-8 outline-none focus:border-luxury-gold/40 focus:bg-white/[0.04] transition-all duration-500 text-white placeholder:text-white/5 uppercase text-[11px] tracking-widest font-syncopate"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[8px] font-syncopate uppercase tracking-[0.4em] text-white/40 ml-4 font-bold">Access Key</label>
                                <div className="relative flex items-center">
                                    <Lock className="absolute left-6 text-luxury-gold/20" size={16} strokeWidth={1.5} />
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••••••"
                                        className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-4 pl-16 pr-8 outline-none focus:border-luxury-gold/40 focus:bg-white/[0.04] transition-all duration-500 text-white placeholder:text-white/5 uppercase text-[11px] tracking-widest font-syncopate"
                                    />
                                </div>
                            </div>

                            {/* Forgot Password Link */}
                            {isLogin && (
                                <div className="flex justify-end -mt-4 mb-6">
                                    <button
                                        type="button"
                                        onClick={async () => {
                                            if (!email) {
                                                toast.error("Please enter your Registry Email to recover access.");
                                                return;
                                            }
                                            setLoading(true);
                                            try {
                                                const { error } = await supabase.functions.invoke('send-password-reset', {
                                                    body: {
                                                        email,
                                                        redirectTo: window.location.origin + '/auth/update-password'
                                                    }
                                                });
                                                if (error) throw error;
                                                toast.success("Recovery protocol initiated. Check your secure inbox.");
                                            } catch (error: any) {
                                                console.error(error);
                                                toast.error("Failed to initiate recovery.");
                                            } finally {
                                                setLoading(false);
                                            }
                                        }}
                                        className="text-[8px] font-syncopate uppercase tracking-[0.2em] text-white/30 hover:text-luxury-gold transition-colors"
                                    >
                                        Forgot Access Key?
                                    </button>
                                </div>
                            )}

                            <Button
                                type="submit"
                                variant="luxury"
                                className="w-full py-8 text-[11px] tracking-[0.6em] uppercase font-black shadow-[0_10px_40px_rgba(212,175,55,0.15)] hover:shadow-[0_15px_50px_rgba(212,175,55,0.25)] transition-all duration-700"
                                disabled={loading}
                            >
                                <span className="relative z-10 flex items-center justify-center gap-3">
                                    {loading ? "AUTHENTICATING..." : isLogin ? "INITIALIZE" : "ESTABLISH"}
                                    {!loading && <Sparkles size={14} className="text-black/40" />}
                                </span>
                            </Button>
                        </form>

                        {/* Toggle Mechanism */}
                        <div className="mt-10 flex flex-col items-center gap-6">
                            <div className="w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
                            <button
                                type="button"
                                onClick={() => setIsLogin(!isLogin)}
                                className="group relative px-6 py-2"
                            >
                                <span className="relative z-10 text-[9px] font-syncopate text-white/30 group-hover:text-luxury-gold transition-colors duration-500 uppercase tracking-[0.4em]">
                                    {isLogin ? "Request New Clearance Slot" : "Detected Return Sequence"}
                                </span>
                            </button>
                        </div>

                        {/* Footer Status */}
                        <div className="mt-8 flex items-center justify-center gap-4">
                            <div className="w-4 h-4 rounded-full border border-luxury-gold flex items-center justify-center">
                                <div className="w-1 h-1 rounded-full bg-luxury-gold animate-pulse" />
                            </div>
                            <div className="text-[6px] font-syncopate text-luxury-gold tracking-[0.5em] uppercase">Secure Node Active</div>
                        </div>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
};

export default Auth;
