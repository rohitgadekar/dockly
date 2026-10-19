import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ProfileLoadingProps {
    theme?: {
        id?: string;
        name?: string;
        primary?: string;
        bg?: string;
        font?: string;
        isLight?: boolean;
    };
    title?: string;
    estateName?: string;
}

const PHASES = [
    "INITIATING QUANTUM PROTOCOL",
    "DECRYPTING SOVEREIGN ARSENAL",
    "SYNCHRONIZING TEMPORAL TRAJECTORY",
    "MATERIALIZING CITADEL INSTANCE"
];

export const ProfileLoading = ({
    theme,
    title = "CITADEL",
    estateName
}: ProfileLoadingProps) => {
    const primaryColor = theme?.primary || "#D4AF37";
    const bgColor = theme?.bg || "#050505";
    const font = theme?.font || "Syncopate";

    const isLight = Boolean(
        theme?.isLight ||
        theme?.id === "etheric" ||
        theme?.id === "sahara" ||
        theme?.id === "ivory" ||
        bgColor === "#F8FAFC" ||
        bgColor === "#FAF8F5" ||
        bgColor === "#FFFDF5"
    );

    const textPrimary = isLight ? "#111111" : "#FFFFFF";
    const [progress, setProgress] = useState(12);
    const [phaseIndex, setPhaseIndex] = useState(0);

    // Simulated luxury progressive loading
    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 98) return 98;
                const increment = Math.max(1, Math.floor((100 - prev) / 6));
                return Math.min(98, prev + increment);
            });
        }, 160);

        return () => clearInterval(interval);
    }, []);

    // Cycle through atmospheric phases
    useEffect(() => {
        const phaseInterval = setInterval(() => {
            setPhaseIndex((prev) => (prev + 1) % PHASES.length);
        }, 1100);

        return () => clearInterval(phaseInterval);
    }, []);

    return (
        <div
            className="fixed inset-0 z-[500] flex flex-col items-center justify-center overflow-hidden select-none transition-colors duration-1000"
            style={{ backgroundColor: bgColor }}
        >
            {/* Theme-Adaptive Background Ambient Auras */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute inset-0 noise opacity-[0.035] mix-blend-overlay" />

                <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] h-[90vw] max-w-[650px] max-h-[650px] rounded-full blur-[140px] pointer-events-none opacity-40 animate-pulse"
                    style={{
                        backgroundColor: `${primaryColor}22`,
                        animationDuration: "6s"
                    }}
                />

                <div
                    className="absolute bottom-[-15%] right-[-10%] w-[60vw] h-[60vw] rounded-full blur-[180px] pointer-events-none opacity-20"
                    style={{ backgroundColor: isLight ? "rgba(0,0,0,0.03)" : `${primaryColor}14` }}
                />
            </div>

            {/* Core Loading Stage */}
            <div className="relative z-10 flex flex-col items-center max-w-sm w-full px-6 text-center">
                
                {/* Citadel Concentric Orbital Glyph */}
                <div className="relative w-28 h-28 mb-10 flex items-center justify-center">
                    {/* Outer Rotating Dashed Ring */}
                    <div
                        className="absolute inset-0 rounded-full border border-dashed animate-spin pointer-events-none opacity-40"
                        style={{
                            borderColor: primaryColor,
                            animationDuration: "20s"
                        }}
                    />

                    {/* Middle Reverse Ring */}
                    <div
                        className="absolute inset-3 rounded-full border border-dotted pointer-events-none opacity-30"
                        style={{
                            borderColor: isLight ? "#000" : "#FFF",
                            animation: "spin 12s linear infinite reverse"
                        }}
                    />

                    {/* Inner Glowing Orbit */}
                    <div
                        className="absolute inset-6 rounded-full border shadow-lg pointer-events-none opacity-60"
                        style={{
                            borderColor: `${primaryColor}66`,
                            boxShadow: `0 0 20px ${primaryColor}40`
                        }}
                    />

                    {/* Center Citadel Sovereign Core */}
                    <motion.div
                        animate={{
                            scale: [1, 1.12, 1],
                            rotate: [0, 45, 0]
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="w-8 h-8 rounded-lg flex items-center justify-center shadow-xl relative"
                        style={{
                            backgroundColor: `${primaryColor}20`,
                            border: `1.5px solid ${primaryColor}`
                        }}
                    >
                        <div
                            className="w-3 h-3 rounded-sm shadow-md"
                            style={{
                                backgroundColor: primaryColor,
                                boxShadow: `0 0 12px ${primaryColor}`
                            }}
                        />
                    </motion.div>
                </div>

                {/* Identity Title */}
                <div className="space-y-2 mb-8">
                    <motion.h1
                        initial={{ letterSpacing: "0.2em", opacity: 0, y: 8 }}
                        animate={{ letterSpacing: "0.5em", opacity: 1, y: 0 }}
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                        style={{
                            fontFamily: font,
                            backgroundImage: isLight
                                ? `linear-gradient(to bottom, #111111 40%, ${primaryColor} 100%)`
                                : `linear-gradient(to bottom, #FFFFFF 40%, ${primaryColor} 100%)`,
                            WebkitBackgroundClip: "text",
                            color: "transparent"
                        }}
                        className="text-2xl sm:text-3xl font-bold uppercase tracking-widest leading-none"
                    >
                        {title}
                    </motion.h1>

                    <div className="flex items-center justify-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: primaryColor }} />
                        <span
                            className="text-[8.5px] font-syncopate uppercase tracking-[0.3em] opacity-40 font-bold"
                            style={{ color: textPrimary }}
                        >
                            {estateName ? `${estateName} // ESTATE` : "SOVEREIGN ARCHITECTURE"}
                        </span>
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: primaryColor }} />
                    </div>
                </div>

                {/* Precision Progress Metric & Bar */}
                <div className="w-full space-y-2.5">
                    {/* Top Row: Metric & Percentage */}
                    <div className="flex items-center justify-between px-1">
                        <span
                            className="text-[7.5px] font-syncopate uppercase tracking-[0.3em] opacity-40"
                            style={{ color: textPrimary }}
                        >
                            STREAM // {progress}%
                        </span>
                        <span
                            className="text-[8px] font-mono font-bold tracking-wider"
                            style={{ color: primaryColor }}
                        >
                            {String(progress).padStart(2, "0")}.00
                        </span>
                    </div>

                    {/* Progress Bar Track */}
                    <div
                        className="h-1.5 w-full rounded-full overflow-hidden p-0.5 border relative shadow-inner"
                        style={{
                            borderColor: `${primaryColor}30`,
                            backgroundColor: isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.04)"
                        }}
                    >
                        {/* Progress Fill */}
                        <motion.div
                            className="h-full rounded-full relative transition-all duration-200"
                            style={{
                                width: `${progress}%`,
                                background: `linear-gradient(90deg, ${primaryColor}40, ${primaryColor})`,
                                boxShadow: `0 0 16px ${primaryColor}`
                            }}
                        >
                            {/* Leading Edge Shimmer Tip */}
                            <div
                                className="absolute right-0 top-0 bottom-0 w-2 rounded-full shadow-lg"
                                style={{
                                    backgroundColor: isLight ? "#000" : "#FFF",
                                    boxShadow: `0 0 10px ${primaryColor}`
                                }}
                            />
                        </motion.div>
                    </div>

                    {/* Dynamic Phase Subtitle */}
                    <div className="h-6 flex items-center justify-center pt-2">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={phaseIndex}
                                initial={{ opacity: 0, y: 4 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -4 }}
                                transition={{ duration: 0.3 }}
                                className="text-[7.5px] font-syncopate uppercase tracking-[0.35em] opacity-50 truncate"
                                style={{ color: textPrimary }}
                            >
                                {PHASES[phaseIndex]}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

            </div>

            {/* Subtle Cinematic CRT Scanline Overlay */}
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.01),rgba(0,255,0,0.01),rgba(0,0,255,0.01))] bg-[length:100%_2px,3px_100%] z-20 opacity-30" />
        </div>
    );
};
export default ProfileLoading;
