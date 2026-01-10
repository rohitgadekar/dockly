import { Outlet, useLocation } from "react-router-dom"; import { DashboardSidebar } from "@/components/dashboard/Sidebar";
import { motion, AnimatePresence } from "framer-motion";

const Dashboard = () => {
    const location = useLocation();

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
