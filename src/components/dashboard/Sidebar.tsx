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
    Fingerprint,
    Users,
    Briefcase,
    Award,
    Compass,
    Cpu
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { useDashboard } from "@/hooks/useDashboard";

const sidebarItems = [
    { icon: Fingerprint, label: "Pass", path: "/dashboard/identity" },
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: FolderGit2, label: "Projects", path: "/dashboard/ventures" },
    { icon: Compass, label: "Trajectory", path: "/dashboard/milestones" },
    { icon: Cpu, label: "Stack", path: "/dashboard/skills" },
    { icon: Award, label: "Endorsements", path: "/dashboard/endorsements" },
    { icon: Palette, label: "Themes", path: "/dashboard/atmospherics" },
    { icon: Users, label: "Leads", path: "/dashboard/audience" },
    { icon: Briefcase, label: "Inquiries", path: "/dashboard/inquiries" },
    { icon: Share2, label: "Socials", path: "/dashboard/socials" },
    { icon: Music, label: "Music", path: "/dashboard/sonic" },
    { icon: ShoppingBag, label: "Store", path: "/dashboard/marketplace" },
    { icon: TrendingUp, label: "Analytics", path: "/dashboard/insights" },
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
        <div className="w-72 h-screen bg-[#08080A] border-r border-zinc-800/80 flex flex-col p-5 sticky top-0 relative overflow-hidden font-plus">
            {/* Supabase Emerald ambient top illumination */}
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#3ECF8E]/[0.05] to-transparent pointer-events-none" />

            {/* Brand Header with /dp.png */}
            <div className="mb-7 flex items-center gap-3 px-2 relative z-10">
                <img
                    src="/dp.png"
                    alt="Dockly Logo"
                    className="w-9 h-9 rounded-xl object-contain shadow-md border border-zinc-800 p-0.5 bg-zinc-900 shrink-0"
                />
                <div>
                    <div className="text-lg font-outfit font-extrabold tracking-tight text-white flex items-center gap-1.5">
                        <span>dockly<span className="text-[#3ECF8E]">.pro</span></span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#3ECF8E] animate-pulse" />
                        <span className="text-[10px] font-jetbrains font-medium text-zinc-400">v4.2 Active</span>
                    </div>
                </div>
            </div>

            {/* Navigation links */}
            <nav className="flex-1 flex flex-col gap-1 relative z-10 overflow-y-auto scrollbar-none pr-1">
                <div className="text-[10px] font-jetbrains font-semibold text-zinc-500 uppercase tracking-wider mb-2 ml-3">
                    // Menu
                </div>
                {sidebarItems.filter(item => {
                    if (item.label === "Leads") return data?.profile?.newsletter_enabled;
                    if (item.label === "Inquiries") return data?.profile?.accepting_inquiries;
                    return true;
                }).map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.label}
                            to={item.path}
                            className={cn(
                                "group flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl transition-all duration-200 relative overflow-hidden border border-transparent text-nowrap",
                                isActive
                                    ? "bg-zinc-900 border-zinc-800 text-white shadow-md font-semibold"
                                    : "text-zinc-400 hover:text-white hover:bg-zinc-900/50"
                            )}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="active-pill"
                                    className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-[#3ECF8E] rounded-r-full shadow-[0_0_12px_rgba(62,207,142,0.8)]"
                                />
                            )}
                            <item.icon size={18} className={cn(
                                "transition-colors duration-200 shrink-0",
                                isActive ? "text-[#3ECF8E]" : "text-zinc-500 group-hover:text-zinc-300"
                            )} strokeWidth={1.75} />
                            <span className="text-xs tracking-wide">{item.label}</span>
                            {isActive && <ChevronRight size={14} className="ml-auto text-[#3ECF8E]" />}
                            {!isActive && <div className="ml-auto w-1 h-1 rounded-full bg-zinc-800 group-hover:bg-[#3ECF8E]/50 transition-colors" />}
                        </Link>
                    );
                })}
            </nav>

            {/* User Profile Card & Logout */}
            <div className="mt-4 space-y-3 relative z-10 border-t border-zinc-800/80 pt-4">
                {data?.profile && (
                    <Link
                        to="/dashboard/settings"
                        className="flex items-center gap-3 p-2.5 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-[#3ECF8E]/30 transition-all duration-200 group"
                    >
                        <div className="relative shrink-0">
                            <div className="w-10 h-10 rounded-xl overflow-hidden border border-zinc-700 group-hover:border-[#3ECF8E]/50 transition-colors">
                                <img
                                    src={data.profile.avatar_url || "/dp.png"}
                                    className="w-full h-full object-cover"
                                    alt="Profile"
                                />
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#3ECF8E] rounded-md flex items-center justify-center border border-[#08080A]">
                                <Sparkles size={8} className="text-black" />
                            </div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-xs font-semibold text-white truncate font-outfit">
                                {data.profile.full_name || 'Anonymous'}
                            </div>
                            <div className="text-[10px] text-zinc-400 font-jetbrains truncate">
                                @{data.profile.username || 'user'}
                            </div>
                        </div>
                        <Shield size={14} className="text-zinc-600 group-hover:text-[#3ECF8E] transition-colors shrink-0" />
                    </Link>
                )}

                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3.5 py-2.5 text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all duration-200 text-xs font-jetbrains group"
                >
                    <LogOut size={15} className="group-hover:-translate-x-0.5 transition-transform shrink-0" />
                    <span>sign_out</span>
                </button>
            </div>
        </div>
    );
};
