import { motion } from "framer-motion";

interface ProfileLoadingProps {
    theme?: {
        id: string;
        primary: string;
        bg: string;
        font: string;
    };
    title?: string;
}

export const ProfileLoading = ({ theme, title = "PERSONA" }: ProfileLoadingProps) => {
    const isRoyale = theme?.id === "royale";
    const primaryColor = theme?.primary || "#D4AF37";

    // Default to dark luxury background if no theme provided
    const bgColor = theme?.bg || "#050505";
    const font = theme?.font || "Syncopate";

    return (
        <div
            className="fixed inset-0 z-[500] flex flex-col items-center justify-center overflow-hidden"
            style={{ backgroundColor: bgColor }}
        >
            {/* Atmospheric Background Layers */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute inset-0 noise opacity-[0.03] mix-blend-overlay" />

                {/* Theme-aware background glows */}
                <div className="absolute inset-0 overflow-hidden">
                    <div
                        className="absolute top-[-20%] right-[-10%] w-[100vw] h-[100vw] blur-[160px] rounded-full animate-pulse"
                        style={{ backgroundColor: `${primaryColor}10` }}
                    />
                    <div
                        className="absolute bottom-[-20%] left-[-10%] w-[100vw] h-[100vw] blur-[180px] rounded-full animate-pulse"
                        style={{ backgroundColor: `${primaryColor}06`, animationDuration: '4s' }}
                    />
                </div>
            </div>

            <div className="relative z-10 flex flex-col items-center">
                {/* Animated Text Logo */}
                <motion.div
                    initial={{ letterSpacing: "0.2em", textIndent: "0.2em", opacity: 0, y: 10 }}
                    animate={{
                        letterSpacing: "0.8em",
                        textIndent: "0.8em",
                        opacity: 1,
                        y: 0,
                    }}
                    transition={{
                        duration: 1.8,
                        ease: [0.16, 1, 0.3, 1],
                    }}
                    style={{
                        fontFamily: font,
                        color: isRoyale ? "transparent" : "white",
                        backgroundImage: isRoyale ? "linear-gradient(to bottom, #FFFFFF, #D4AF37)" : "none",
                        WebkitBackgroundClip: isRoyale ? "text" : "none",
                    }}
                    className="text-[12px] md:text-[14px] font-bold uppercase tracking-widest mb-8 text-center"
                >
                    {title}
                </motion.div>

                {/* Minimalist Progress Line */}
                <div className="w-64 h-px bg-white/[0.05] relative overflow-hidden rounded-full">
                    <motion.div
                        initial={{ width: 0, left: 0 }}
                        animate={{
                            width: ["0%", "40%", "100%"],
                            left: ["0%", "30%", "100%"]
                        }}
                        transition={{
                            duration: 2.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                        style={{ backgroundColor: primaryColor }}
                        className="absolute h-full shadow-[0_0_15px_rgba(212,175,55,0.8)]"
                    />
                </div>

                {/* Subtitle */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.4, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="mt-12 text-[8px] font-syncopate uppercase tracking-[0.6em] text-white/40"
                >
                    Materializing Instance
                </motion.div>
            </div>

            {/* Cinematic Scanline Overlay */}
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[length:100%_2px,3px_100%] z-20 opacity-20" />
        </div>
    );
};
