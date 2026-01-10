import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface ProfileLoadingProps {
    theme?: {
        id: string;
        primary: string;
        bg: string;
        font: string;
    };
}

export const ProfileLoading = ({ theme }: ProfileLoadingProps) => {
    const defaultTheme = theme || {
        id: "royale",
        primary: "#D4AF37",
        bg: "#050505",
        font: "Syncopate"
    };

    const isLight = defaultTheme.id === "etheric";
    const bgColor = defaultTheme.bg;

    return (
        <div
            className="min-h-screen flex items-center justify-center relative overflow-hidden"
            style={{ backgroundColor: bgColor }}
        >
            {/* Atmospheric Background */}
            {defaultTheme.id === "royale" && (
                <>
                    <div className="noise opacity-20" />
                    <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] blur-[150px] rounded-full pointer-events-none"
                        style={{ backgroundColor: `${defaultTheme.primary}08` }}
                    />
                    <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] blur-[150px] rounded-full pointer-events-none"
                        style={{ backgroundColor: `${defaultTheme.primary}05` }}
                    />
                </>
            )}

            {defaultTheme.id === "etheric" && (
                <>
                    <div className="absolute inset-0 bg-white/40 pointer-events-none" />
                    <div className="absolute top-20 left-20 w-96 h-96 bg-blue-400/10 blur-[150px] rounded-full animate-pulse pointer-events-none" />
                </>
            )}

            {defaultTheme.id === "nebula" && (
                <>
                    <div className="absolute inset-0 bg-gradient-to-br from-[#0F172A] via-[#1E1B4B] to-[#0F172A] pointer-events-none" />
                    <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
                        transition={{ duration: 10, repeat: Infinity }}
                        className="absolute top-1/4 left-1/4 w-[800px] h-[800px] bg-purple-500/20 blur-[200px] rounded-full pointer-events-none"
                    />
                </>
            )}

            {defaultTheme.id === "matrix" && (
                <>
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                        style={{
                            backgroundImage: 'radial-gradient(circle at 2px 2px, #10B981 1px, transparent 0)',
                            backgroundSize: '40px 40px'
                        }}
                    />
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent shadow-[0_0_20px_#10B981] animate-pulse pointer-events-none" />
                </>
            )}

            {/* Loading Content */}
            <div className="relative z-10 flex flex-col items-center gap-8 px-6">
                {/* Animated Logo */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="relative"
                >
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="w-20 h-20 rounded-full border-2 border-t-transparent"
                        style={{ borderColor: `${defaultTheme.primary}40` }}
                    />
                    <div
                        className="absolute inset-0 flex items-center justify-center"
                    >
                        <Sparkles
                            size={32}
                            style={{ color: defaultTheme.primary }}
                            className="animate-pulse"
                        />
                    </div>
                </motion.div>

                {/* Loading Text */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="text-center space-y-3"
                >
                    <h2
                        className="text-sm md:text-base font-syncopate font-bold uppercase tracking-[0.3em]"
                        style={{
                            color: isLight ? "#1E293B" : "#FFFFFF",
                            fontFamily: defaultTheme.font
                        }}
                    >
                        Loading Profile
                    </h2>
                    <div className="flex items-center gap-2 justify-center">
                        {[0, 1, 2].map((i) => (
                            <motion.div
                                key={i}
                                animate={{
                                    scale: [1, 1.5, 1],
                                    opacity: [0.3, 1, 0.3]
                                }}
                                transition={{
                                    duration: 1.5,
                                    repeat: Infinity,
                                    delay: i * 0.2,
                                    ease: "easeInOut"
                                }}
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: defaultTheme.primary }}
                            />
                        ))}
                    </div>
                </motion.div>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="text-[9px] md:text-[10px] font-syncopate uppercase tracking-[0.4em] opacity-40"
                    style={{ color: isLight ? "#64748B" : "#FFFFFF" }}
                >
                    Citadel Protocol Active
                </motion.p>
            </div>
        </div>
    );
};
