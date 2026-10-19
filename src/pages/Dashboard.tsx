import { Outlet, useLocation } from "react-router-dom";
import { DashboardSidebar } from "@/components/dashboard/Sidebar";
import { motion, AnimatePresence } from "framer-motion";
import { useIsMobile } from "@/hooks/useIsMobile";
import { Sparkles } from "lucide-react";

const Dashboard = () => {
    const location = useLocation();
    const isMobile = useIsMobile();

    // Show mobile restriction message
    if (isMobile) {
        return (
            <div className="min-h-screen bg-[#000000] flex items-center justify-center p-6 font-plus text-zinc-100">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-[#3ECF8E]/[0.05] blur-[120px] -ml-48 -mt-48" />
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-600/[0.04] blur-[120px] -mr-48 -mb-48" />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="relative max-w-md w-full"
                >
                    <div className="bg-[#0A0A0C] border border-zinc-800 rounded-3xl p-8 md:p-10 text-center shadow-2xl">
                        <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center p-2 shadow-xl">
                            <img src="/dp.png" alt="Dockly" className="w-full h-full object-contain" />
                        </div>

                        <div className="mb-3 flex items-center justify-center gap-2 font-jetbrains">
                            <Sparkles size={13} className="text-[#3ECF8E]" />
                            <span className="text-xs font-semibold text-[#3ECF8E] tracking-wider uppercase">
                                Desktop Experience
                            </span>
                            <Sparkles size={13} className="text-[#3ECF8E]" />
                        </div>

                        <h1 className="text-2xl font-outfit font-extrabold tracking-tight text-white mb-3">
                            Command Deck
                        </h1>

                        <p className="text-zinc-400 font-normal text-sm leading-relaxed mb-6">
                            The Dockly.Pro dashboard is optimized for desktop viewports. Please access from a laptop or desktop monitor for full control.
                        </p>

                        <div className="pt-5 border-t border-zinc-800/80">
                            <p className="text-xs text-zinc-500 font-jetbrains">
                                // min_resolution: 1024px
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-[#050508] font-plus text-zinc-100 selection:bg-[#3ECF8E]/30 selection:text-white">
            <DashboardSidebar />
            <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
                <div className="max-w-7xl mx-auto">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={location.pathname}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.25, ease: "easeOut" }}
                        >
                            <Outlet />
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
