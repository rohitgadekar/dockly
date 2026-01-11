import { motion } from "framer-motion";
import {
    LayoutDashboard,
    FolderGit2,
    Share2,
    LogOut,
    ChevronRight,
    TrendingUp,
    ShoppingBag,
    Shield,
    Sparkles,
    Palette,
    Music,
    Fingerprint
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { useDashboard } from "@/hooks/useDashboard";

const sidebarItems = [
    { icon: Fingerprint, label: "Identity", path: "/dashboard/identity" },
    { icon: LayoutDashboard, label: "Command Deck", path: "/dashboard" },
    { icon: FolderGit2, label: "Ventures", path: "/dashboard/ventures" },
    { icon: Palette, label: "Personas", path: "/dashboard/atmospherics" },
    { icon: Share2, label: "Network", path: "/dashboard/socials" },
    { icon: Music, label: "Anthem", path: "/dashboard/sonic" },
    { icon: ShoppingBag, label: "Boutique", path: "/dashboard/marketplace" },
    { icon: TrendingUp, label: "Insights", path: "/dashboard/insights" },
];

export const DashboardSidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { data } = useDashboard();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate("/auth");
    };

    return (
        <div className="w-80 h-screen bg-[#080808] border-r border-white/5 flex flex-col p-6 sticky top-0 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-luxury-gold/[0.03] to-transparent pointer-events-none" />

            <div className="mb-10 flex items-center gap-4 px-2 relative z-10">
                <div className="w-12 h-12 bg-luxury-gold rounded-[1.5rem] flex items-center justify-center font-bold text-black font-syncopate shadow-[0_0_20px_rgba(212,175,55,0.3)]">
                    D
                </div>
                <div>
                    <div className="text-xl font-syncopate font-bold tracking-tighter text-white">
                        DOCKED<span className="text-luxury-gold">.</span>PRO
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[8px] font-syncopate text-white/20 uppercase tracking-[0.2em]">Citadel v4.2</span>
                    </div>
                </div>
            </div>

            <nav className="flex-1 flex flex-col gap-1.5 relative z-10 overflow-y-auto scrollbar-none pr-2">
                <div className="text-[9px] font-syncopate text-white/20 uppercase tracking-[0.4em] mb-4 ml-4">Architecture</div>
                {sidebarItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.label}
                            to={item.path}
                            className={cn(
                                "group flex items-center gap-4 px-4 py-3 rounded-[1rem] transition-all duration-500 relative overflow-hidden border border-transparent text-nowrap",
                                isActive
                                    ? "bg-white/[0.03] border-white/5 text-white shadow-2xl"
                                    : "text-white/30 hover:text-white hover:bg-white/[0.01]"
                            )}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="active-pill"
                                    className="absolute left-0 top-0 bottom-0 w-1.5 bg-luxury-gold shadow-[0_0_20px_rgba(212,175,55,0.8)]"
                                />
                            )}
                            <item.icon size={20} className={cn(
                                "transition-all duration-500",
                                isActive ? "text-luxury-gold scale-110" : "group-hover:text-white"
                            )} strokeWidth={1.5} />
                            <span className="font-syncopate font-bold text-[10px] tracking-[0.15em] uppercase">{item.label}</span>
                            {isActive && <ChevronRight size={14} className="ml-auto text-luxury-gold" />}
                            {!isActive && <div className="ml-auto w-1 h-1 rounded-full bg-white/5 group-hover:bg-luxury-gold/40 transition-colors" />}
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-6 space-y-4 relative z-10 border-t border-white/5 pt-6">
                {data?.profile && (
                    <Link to="/dashboard/settings" className="flex items-center gap-4 p-3.5 rounded-[1.8rem] bg-white/[0.02] border border-white/5 hover:border-luxury-gold/20 transition-all duration-700 group">
                        <div className="relative">
                            <div className="w-12 h-12 rounded-[1.5rem] overflow-hidden border border-white/10 group-hover:border-luxury-gold/40 transition-colors">
                                <img
                                    src={data.profile.avatar_url || "/dp.png"}
                                    className="w-full h-full object-cover mix-blend-luminosity group-hover:mix-blend-normal transition-all duration-700"
                                    alt="Profile"
                                />
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-luxury-gold rounded-[0.5rem] flex items-center justify-center border-2 border-[#080808]">
                                <Sparkles size={8} className="text-black" />
                            </div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-[10px] font-syncopate font-bold text-white uppercase tracking-tight truncate">{data.profile.full_name || 'Anonymous'}</div>
                            <div className="text-[8px] font-syncopate text-white/20 uppercase tracking-widest mt-0.5">Royale Member</div>
                        </div>
                        <Shield size={14} className="text-white/10 group-hover:text-luxury-gold/40 transition-colors" />
                    </Link>
                )}

                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-4 px-5 py-3.5 text-white/20 hover:text-red-500 hover:bg-red-500/5 rounded-[1.2rem] transition-all duration-500 group"
                >
                    <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="font-syncopate font-bold text-[8px] tracking-[0.2em] uppercase">Terminate Session</span>
                </button>
            </div>
        </div>
    );
};
