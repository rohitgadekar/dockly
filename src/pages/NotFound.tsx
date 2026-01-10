import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";

import { useNavigate } from "react-router-dom";
import { useTitle } from "@/hooks/useTitle";

const NotFound = () => {
    useTitle("Coordinates Unknown");
    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
            <div className="noise" />
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-8 p-6 glass rounded-full"
            >
                <Search size={48} className="text-luxury-gold opacity-20" />
            </motion.div>
            <h1 className="text-8xl font-syncopate font-bold mb-4 tracking-tighter">404</h1>
            <h2 className="text-xl font-syncopate text-white/40 mb-8 uppercase tracking-[0.3em]">Sector Not Found</h2>
            <p className="text-white/20 font-plus max-w-sm mb-12">
                The coordinates you provided do not exist in our digital architecture.
            </p>
            <Link to="/">
                <Button variant="luxury">Return to Command</Button>
            </Link>
        </div>
    );
};

export default NotFound;
