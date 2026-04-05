import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { Shield, Lock, FileText, Code, ArrowLeft, Fingerprint } from "lucide-react";
import { useTitle } from "@/hooks/useTitle";

interface ProtocolContent {
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    sections: {
        heading: string;
        content: string;
    }[];
}

const protocols: Record<string, ProtocolContent> = {
    privacy: {
        title: "SOVEREIGN PRIVACY",
        subtitle: "Zero-Knowledge Data Protocols",
        icon: <Shield className="text-luxury-gold" size={32} />,
        sections: [
            {
                heading: "Data Sovereignty",
                content: "Your digital estate is yours alone. We utilize isolated vaulting to ensure that your profile data, analytics, and personal configurations are stored in sovereign nodes, never to be harvested or auctioned."
            },
            {
                heading: "Zero-Knowledge Identity",
                content: "Dockly utilizes holographic encryption for all identity nodes. We do not track your movement across the network. Your 'Command Deck' telemetry is processed locally and discarded upon session termination."
            },
            {
                heading: "Universal Encryption",
                content: "All transmissions between your sovereign profile and the global edge network utilize 1024-bit quantum-resistant protocols (Citadel Cipher), ensuring your auditory and visual signatures remain exclusive."
            }
        ]
    },
    terms: {
        title: "ARCHIVE PROTOCOLS",
        subtitle: "The Digital Estate Covenant",
        icon: <FileText className="text-luxury-gold" size={32} />,
        sections: [
            {
                heading: "Establishment of Tenure",
                content: "By establishing a node on Dockly.Pro, you agree to maintain the high-fidelity standards of the ecosystem. Intellectual property within your estate remains your sovereign asset."
            },
            {
                heading: "Operational Integrity",
                content: "Users are prohibited from utilizing 'Shadow Scripts' or any mechanism that disrupts the latency-free performance of the global edge network. High-frequency delivery is a collective right."
            },
            {
                heading: "Vault Termination",
                content: "You maintain the right to trigger the 'Purge Sequence' at any time, which permanently removes all holographic assets and configuration nodes from our ephemeral cache."
            }
        ]
    },
    security: {
        title: "CITADEL SECURITY",
        subtitle: "Hardened Infrastructure Diagnostics",
        icon: <Lock className="text-luxury-gold" size={32} />,
        sections: [
            {
                heading: "Pillar Architecture",
                content: "Our infrastructure is built on 'Pillar' nodes—distributed, hardened server environments that utilize air-gapped logic for critical identity modules."
            },
            {
                heading: "Real-Time Telemetry",
                content: "The Command Deck provides live diagnostics of your node's integrity. Any anomaly in engagement velocity or access patterns is flagged through the 'Citadel Pulse' system."
            },
            {
                heading: "Sovereign Authentication",
                content: "Biometric link-in-bio protocols ensure that only the verified identity bearer can execute administrative commands on the digital estate."
            }
        ]
    },
    api: {
        title: "API INTEL",
        subtitle: "Technical Matrix Specifications",
        icon: <Code className="text-luxury-gold" size={32} />,
        sections: [
            {
                heading: "Holographic Delivery",
                content: "Developer nodes can interface with the 'Identity Matrix' through our REST protocols. All responses are delivered in sub-50ms JSON-High-Density format."
            },
            {
                heading: "Sonic Resonance API",
                content: "Unlock the ability to query auditory signatures and Spotify-synchronized metadata to build cross-platform multisensory experiences."
            },
            {
                heading: "Kinetic UI Tokens",
                content: "Utilize our proprietary CSS/Motion tokens to maintain the ultra-luxury aesthetic across your integrated applications and sub-estates."
            }
        ]
    }
};

const Protocol = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const protocol = protocols[id as string] || protocols.privacy;
    useTitle(protocol.title);

    if (!protocol) {
        return <div className="min-h-screen bg-black flex items-center justify-center font-syncopate text-white/20">NODE NOT RESOLVED</div>;
    }

    return (
        <div className="min-h-screen bg-[#050505] text-white p-6 md:p-12 relative overflow-hidden selection:bg-luxury-gold/30">
            <div className="noise opacity-20" />

            {/* Background Orbs */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-luxury-gold/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-white/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-4xl mx-auto relative z-10 pt-20">
                <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => navigate("/")}
                    className="flex items-center gap-4 text-[10px] font-syncopate text-white/20 hover:text-luxury-gold transition-all duration-500 uppercase tracking-[0.4em] mb-16 group"
                >
                    <ArrowLeft size={14} className="group-hover:-translate-x-2 transition-transform" />
                    Return to Command
                </motion.button>

                <div className="mb-24">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-16 h-16 rounded-2xl bg-luxury-gold/10 border border-luxury-gold/20 flex items-center justify-center mb-10 shadow-[0_0_30px_rgba(212,175,55,0.1)]"
                    >
                        {protocol.icon}
                    </motion.div>

                    <motion.h1
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-syncopate font-bold tracking-tighter mb-6"
                    >
                        {protocol.title.split(' ')[0]} <br />
                        <span className="text-luxury-gold uppercase">{protocol.title.split(' ').slice(1).join(' ')}</span>
                    </motion.h1>

                    <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-xs font-syncopate text-white/40 uppercase tracking-[0.6em]"
                    >
                        {protocol.subtitle}
                    </motion.p>
                </div>

                <div className="space-y-24 mb-32">
                    {protocol.sections.map((section, idx) => (
                        <motion.div
                            key={section.heading}
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 + idx * 0.1 }}
                            className="group relative"
                        >
                            <div className="absolute -left-12 top-0 text-luxury-gold/20 font-syncopate text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                0{idx + 1}
                            </div>
                            <h2 className="text-xl md:text-2xl font-syncopate font-bold uppercase tracking-tight mb-8 group-hover:text-luxury-gold transition-colors">
                                {section.heading}
                            </h2>
                            <p className="text-lg md:text-xl text-white/30 font-plus leading-relaxed max-w-2xl">
                                {section.content}
                            </p>
                            <div className="h-px w-full bg-gradient-to-r from-white/5 to-transparent mt-12 group-hover:from-luxury-gold/20 transition-all duration-700" />
                        </motion.div>
                    ))}
                </div>

                {/* Footer Seal */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="pt-24 border-t border-white/5 flex flex-col items-center gap-8"
                >
                    <Fingerprint size={48} className="text-white/5" />
                    <p className="text-[10px] font-syncopate text-white/10 uppercase tracking-[0.8em] font-bold">
                        VERIFIED CITADEL ARCHIVE • ISO-27001-HQL
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default Protocol;
