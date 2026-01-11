import { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
    Download,
    Zap,
    Fingerprint,
    Shield,
    Sparkles,
    Copy,
    Share2,
    RefreshCw
} from "lucide-react";
import { useDashboard } from "@/hooks/useDashboard";
import { toPng } from "html-to-image";
import QRCodeStyling from "qr-code-styling";
import { toast } from "sonner";
import { useTitle } from "@/hooks/useTitle";

const PremiumQR = ({ url }: { url: string }) => {
    const qrRef = useRef<HTMLDivElement>(null);
    const qrCode = useRef<QRCodeStyling | null>(null);

    useEffect(() => {
        qrCode.current = new QRCodeStyling({
            width: 80,
            height: 80,
            data: url,
            margin: 0,
            qrOptions: {
                typeNumber: 0,
                mode: 'Byte',
                errorCorrectionLevel: 'H'
            },
            dotsOptions: {
                type: 'rounded',
                color: '#D4AF37',
            },
            backgroundOptions: {
                color: 'transparent',
            },
            cornersSquareOptions: {
                type: 'extra-rounded',
                color: '#D4AF37',
            },
            cornersDotOptions: {
                type: 'dot',
                color: '#D4AF37',
            }
        });

        if (qrRef.current) {
            qrRef.current.innerHTML = '';
            qrCode.current.append(qrRef.current);
        }
    }, [url]);

    return (
        <div className="relative group/qr">
            <div className="absolute -inset-1  rounded-xl blur-md opacity-0 group-hover/qr:opacity-100 transition-opacity duration-500" />
            <div
                ref={qrRef}
                className="relative  rounded-xl  flex items-center justify-center overflow-hidden"
            />
        </div>
    );
};

const Identity = () => {
    useTitle("Sovereign Identity");
    const { data } = useDashboard();
    const cardRef = useRef<HTMLDivElement>(null);
    const [isDownloading, setIsDownloading] = useState(false);

    // 3D Tilt Logic
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;

        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    const downloadCard = async () => {
        if (!cardRef.current) return;
        setIsDownloading(true);
        try {
            const dataUrl = await toPng(cardRef.current, {
                quality: 1,
                pixelRatio: 2,
                cacheBust: true,
                skipFonts: true, // Speeds up rendering and avoids font loading issues
            });
            const link = document.createElement("a");
            link.download = `${data?.profile?.username || 'user'}-identity-card.png`;
            link.href = dataUrl;
            link.click();
            toast.success("Identity Card Archive created.");
        } catch (err) {
            console.error(err);
            toast.error("Archive extraction failed.");
        } finally {
            setIsDownloading(false);
        }
    };

    const copyHologramLink = () => {
        const url = `${window.location.origin}/${data?.profile?.username}`;
        navigator.clipboard.writeText(url);
        toast.success("Identity vector copied to clipboard.");
    };

    if (!data?.profile) return null;

    const profileUrl = `${window.location.origin}/${data.profile.username}`;

    return (
        <div className="flex-1 p-8 space-y-12 max-w-6xl mx-auto">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-luxury-gold/10 rounded-lg border border-luxury-gold/20">
                            <Fingerprint size={18} className="text-luxury-gold" />
                        </div>
                        <span className="text-[10px] font-syncopate uppercase tracking-[0.4em] text-white/40">Sovereign Registry</span>
                    </div>
                    <h1 className="text-5xl font-syncopate font-bold uppercase tracking-tighter text-white">
                        IDENTITY <span className="text-luxury-gold">NODE</span>
                    </h1>
                    <p className="text-white/40 font-plus italic mt-4">
                        Download your cryptographic identity card for global transmission.
                    </p>
                </div>

                <div className="flex gap-4">
                    <Button
                        variant="outline"
                        onClick={copyHologramLink}
                        className="gap-2 px-6 py-6 text-[10px] uppercase font-syncopate tracking-widest border-white/5 bg-white/[0.02] hover:bg-white/[0.05]"
                    >
                        <Copy size={14} /> Copy Profile Link
                    </Button>
                    <Button
                        variant="luxury"
                        onClick={downloadCard}
                        disabled={isDownloading}
                        className="gap-2 px-8 py-6 text-[10px] uppercase font-syncopate tracking-widest shadow-[0_0_20px_rgba(212,175,55,0.2)]"
                    >
                        {isDownloading ? <RefreshCw size={14} className="animate-spin" /> : <Download size={14} />}
                        Archive PNG
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start pt-8">
                {/* 3D Holographic Card Display */}
                <div className="perspective-1000 flex justify-center py-12">
                    <motion.div
                        ref={cardRef}
                        onMouseMove={handleMouseMove}
                        onMouseLeave={handleMouseLeave}
                        style={{
                            rotateX,
                            rotateY,
                            transformStyle: "preserve-3d",
                        }}
                        className="relative w-[400px] h-[580px] rounded-[2.5rem] bg-[#0A0A0A] border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden cursor-crosshair group"
                    >
                        {/* Holographic Background Effects */}
                        <div className="absolute inset-0 bg-[#0A0A0A]" />
                        <div className="absolute inset-0 bg-gradient-to-tr from-luxury-gold/20 via-transparent to-transparent opacity-30" />
                        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

                        {/* Static Prismatic Accent */}
                        <div className="absolute top-0 bottom-0 w-32 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent -skew-x-12 pointer-events-none left-[10%]" />

                        {/* Card Content */}
                        <div className="relative h-full flex flex-col p-8 z-10" style={{ transform: "translateZ(50px)" }}>
                            {/* Header Architecture */}
                            <div className="flex justify-between items-start mb-6">
                                <div className="space-y-1">
                                    <div className="text-[9px] font-syncopate font-bold text-luxury-gold uppercase tracking-[0.4em] drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]">Sovereign Node</div>
                                    <div className="text-[7px] font-syncopate text-white/20 uppercase tracking-[0.2em]">Registry v4.2.1-ARCHIVE</div>
                                </div>
                                <div className="w-10 h-10 rounded-xl bg-luxury-gold/5 border border-luxury-gold/20 flex items-center justify-center">
                                    <Zap size={16} className="text-luxury-gold opacity-40 shadow-[0_0_10px_rgba(212,175,55,0.2)]" />
                                </div>
                            </div>

                            {/* Biometric Portal (Avatar) */}
                            <div className="relative mb-6 self-center">
                                <div className="absolute -inset-1 bg-gradient-to-tr from-luxury-gold/30 via-transparent to-luxury-gold/30 rounded-[2.5rem] blur-sm opacity-50" />
                                <div className="relative w-40 h-40 rounded-[2.2rem] overflow-hidden border border-white/10 p-1 bg-black shadow-2xl">
                                    <div className="w-full h-full rounded-[1.8rem] overflow-hidden">
                                        <img
                                            src={data.profile.avatar_url || "/dp.png"}
                                            alt="Avatar"
                                            crossOrigin="anonymous"
                                            className="w-full h-full object-cover mix-blend-luminosity grayscale contrast-[1.1] brightness-[1.1]"
                                        />
                                    </div>
                                </div>
                                {/* HUD Accents */}
                                <div className="absolute -top-2 -left-2 w-8 h-8 border-t border-l border-luxury-gold rounded-tl-[2.5rem]" />
                                <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b border-r border-luxury-gold rounded-br-[2.5rem]" />
                            </div>

                            {/* Persona Matrix */}
                            <div className="text-center space-y-3 mb-6 flex-1 flex flex-col justify-center">
                                <h2 className="text-3xl font-syncopate font-bold text-white tracking-tighter uppercase leading-none">
                                    {data.profile.full_name}
                                </h2>
                                <div className="inline-flex self-center items-center gap-3 px-3 py-1 bg-white/[0.03] border border-white/5 rounded-full mb-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-luxury-gold shadow-[0_0_8px_#D4AF37]" />
                                    <span className="text-[8px] font-syncopate text-white/40 uppercase tracking-[0.3em]">
                                        {data.profile.role || "Visual Architect"}
                                    </span>
                                </div>
                                {data.profile.bio && (
                                    <p className="text-[12px] text-white/30 font-plus italic max-w-[280px] mx-auto leading-relaxed line-clamp-2">
                                        {data.profile.bio}
                                    </p>
                                )}
                            </div>

                            {/* Footer Cryptography */}
                            <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                                <div className="flex items-center gap-6">
                                    <PremiumQR url={profileUrl} />
                                    <div className="space-y-1">
                                        <div className="text-[8px] font-syncopate text-luxury-gold uppercase tracking-[0.4em] font-bold">Vector Scan</div>
                                        <div className="text-[6px] font-mono text-white/20 tracking-[0.3em] uppercase">Auth: {data.profile.username?.toUpperCase()}</div>
                                    </div>
                                </div>

                                <div className="flex flex-col items-end gap-2">
                                    <div className="flex gap-1">
                                        {[...Array(24)].map((_, i) => (
                                            <div
                                                key={i}
                                                className="w-[1.5px] bg-luxury-gold"
                                                style={{
                                                    height: `${[18, 28, 22, 32, 12, 24, 18, 28][i % 8]}px`,
                                                }}
                                            />
                                        ))}
                                    </div>
                                    <div className="text-[6px] font-syncopate text-white/20 uppercase tracking-[0.5em]">Identity Token</div>
                                </div>
                            </div>

                            {/* Prismatic Detailing */}
                            <div className="absolute inset-x-8 top-0 h-[1px] bg-gradient-to-r from-transparent via-luxury-gold/20 to-transparent" />
                            <div className="absolute inset-x-8 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-luxury-gold/20 to-transparent" />
                        </div>


                        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
                            {/* Static Dust Particle */}
                            <div className="absolute w-[1px] h-[1px] bg-luxury-gold/40 rounded-full left-[20%] top-[30%]" />
                            <div className="absolute w-[1px] h-[1px] bg-luxury-gold/40 rounded-full left-[80%] top-[60%]" />
                        </div>
                    </motion.div>
                </div>

                {/* Technical Information Architecture */}
                <div className="space-y-12 py-12 flex flex-col h-full justify-center">
                    <div className="space-y-4 mb-2">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-[1px] bg-luxury-gold/30" />
                            <h3 className="text-[11px] font-syncopate font-bold text-luxury-gold uppercase tracking-[0.5em]">
                                Technical Manifest
                            </h3>
                        </div>
                        <p className="text-white/20 font-plus text-xs italic ml-14">
                            Advanced hardware-accelerated identity rendering protocols.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                        <Card className="group/spec p-10 bg-white/[0.01] border-white/5 hover:border-luxury-gold/20  relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-luxury-gold/5 blur-[50px] -mr-12 -mt-12 group-hover/spec:bg-luxury-gold/10 transition-colors" />

                            <div className="relative space-y-8">
                                <div className="w-14 h-14 bg-luxury-gold/5 rounded-2xl flex items-center justify-center text-luxury-gold border border-luxury-gold/10 group-hover/spec:scale-105 group-hover/spec:border-luxury-gold/30 transition-all duration-500 shadow-inner">
                                    <Shield size={24} strokeWidth={1} />
                                </div>
                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-syncopate font-bold text-white uppercase tracking-[0.3em] leading-none">
                                        Cryptographic Root
                                    </h4>
                                    <p className="text-[11px] text-white/30 font-plus leading-relaxed">
                                        Your identity node is cross-referenced with your secure Citadel registry.
                                        The embedded luxury barcode contains an encrypted vector to your digital estate.
                                    </p>
                                </div>
                            </div>
                        </Card>

                        <Card className="group/spec p-10 bg-white/[0.01] border-white/5 hover:border-emerald-500/20  relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 blur-[50px] -mr-12 -mt-12 group-hover/spec:bg-emerald-500/10 transition-colors" />

                            <div className="relative space-y-8">
                                <div className="w-14 h-14 bg-emerald-500/5 rounded-2xl flex items-center justify-center text-emerald-500 border border-emerald-500/10 group-hover/spec:scale-105 group-hover/spec:border-emerald-500/30 transition-all duration-500 shadow-inner">
                                    <Zap size={24} strokeWidth={1} />
                                </div>
                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-syncopate font-bold text-white uppercase tracking-[0.3em] leading-none">
                                        Kinetic Response
                                    </h4>
                                    <p className="text-[11px] text-white/30 font-plus leading-relaxed">
                                        The card interface utilizes 120Hz kinetic interpolation for real-time 3D tilt tracking,
                                        creating a tangible architectural feel on any device.
                                    </p>
                                </div>
                            </div>
                        </Card>

                        <Card className="group/spec p-10 bg-white/[0.01] border-white/5 hover:border-blue-500/20  relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 blur-[50px] -mr-12 -mt-12 group-hover/spec:bg-blue-500/10 transition-colors" />

                            <div className="relative space-y-8">
                                <div className="w-14 h-14 bg-blue-500/5 rounded-2xl flex items-center justify-center text-blue-500 border border-blue-500/10 group-hover/spec:scale-105 group-hover/spec:border-blue-500/30 transition-all duration-500 shadow-inner">
                                    <Sparkles size={24} strokeWidth={1} />
                                </div>
                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-syncopate font-bold text-white uppercase tracking-[0.3em] leading-none">
                                        Prismatic Optics
                                    </h4>
                                    <p className="text-[11px] text-white/30 font-plus leading-relaxed">
                                        Integrated light-sweep shaders and rim-refraction layers simulate
                                        physical material properties under varying local light sources.
                                    </p>
                                </div>
                            </div>
                        </Card>

                        <Card className="group/spec p-10 bg-white/[0.01] border-white/5 hover:border-white/20  relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 blur-[50px] -mr-12 -mt-12 group-hover/spec:bg-white/10 transition-colors" />

                            <div className="relative space-y-8">
                                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-white border border-white/10 group-hover/spec:scale-105 group-hover/spec:border-white/30 transition-all duration-500 shadow-inner">
                                    <Share2 size={24} strokeWidth={1} />
                                </div>
                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-syncopate font-bold text-white uppercase tracking-[0.3em] leading-none">
                                        Transmission Ready
                                    </h4>
                                    <p className="text-[11px] text-white/30 font-plus leading-relaxed">
                                        Export your identity node as a high-fidelity high-density PNG
                                        for seamless transmission across all known social networks.
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="p-8 bg-luxury-gold/[0.02] border border-luxury-gold/5 rounded-[2.5rem] flex items-center gap-8 mt-4 group hover:bg-luxury-gold/[0.04] "
                    >
                        <div className="w-16 h-16 bg-luxury-gold/10 rounded-2xl flex items-center justify-center text-luxury-gold shrink-0 border border-luxury-gold/20 ">
                            <Fingerprint size={32} strokeWidth={1} />
                        </div>
                        <div className="space-y-2">
                            <div className="text-[10px] font-syncopate font-bold text-luxury-gold uppercase tracking-[0.3em]">Authenticated Identity</div>
                            <p className="text-[9px] text-white/30 font-syncopate uppercase tracking-widest leading-relaxed">
                                Your digital estate protocol version: <span className="text-white/60">4.2.1-ARCHIVE</span>. Sovereign encryption verified.
                            </p>
                        </div>
                        <div className="ml-auto w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                    </motion.div>
                </div>

            </div>
        </div>
    );
};

export default Identity;
