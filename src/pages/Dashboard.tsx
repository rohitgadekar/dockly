import { Outlet, useLocation } from "react-router-dom";
import { DashboardSidebar } from "@/components/dashboard/Sidebar";
import { motion, AnimatePresence } from "framer-motion";
import { useIsMobile } from "@/hooks/useIsMobile";
import { Monitor, Sparkles } from "lucide-react";

const Dashboard = () => {
    const location = useLocation();
    const isMobile = useIsMobile();

    // Show mobile restriction message
    if (isMobile) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-luxury-gold/5 blur-[120px] -ml-48 -mt-48" />
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-luxury-gold/5 blur-[120px] -mr-48 -mb-48" />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="relative max-w-md w-full"
                >
                    <div className="bg-[#080808] border border-white/10 rounded-[2.5rem] p-8 md:p-12 text-center shadow-2xl">
                        <div className="w-20 h-20 mx-auto mb-6 bg-luxury-gold/10 rounded-[2rem] flex items-center justify-center border border-luxury-gold/20">
                            <Monitor size={40} className="text-luxury-gold" />
                        </div>

                        <div className="mb-4 flex items-center justify-center gap-2">
                            <Sparkles size={16} className="text-luxury-gold" />
                            <span className="text-[10px] font-syncopate uppercase tracking-[0.3em] text-luxury-gold font-bold">
                                Desktop Only
                            </span>
                            <Sparkles size={16} className="text-luxury-gold" />
                        </div>

                        <h1 className="text-2xl md:text-3xl font-syncopate font-bold uppercase tracking-tight text-white mb-4">
                            Command Deck Restricted
                        </h1>

                        <p className="text-white/60 font-plus leading-relaxed mb-6">
                            The Docked.Pro Dashboard is optimized for desktop experiences only. Please access from a desktop or laptop computer for the full command interface.
                        </p>

                        <div className="pt-6 border-t border-white/10">
                            <p className="text-[10px] font-syncopate uppercase tracking-[0.2em] text-white/40">
                                Minimum Resolution: 1024px
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-[#050505]">
            <DashboardSidebar />
            <main className="flex-1 p-12">
                <div className="max-w-7xl mx-auto">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={location.pathname}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
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
