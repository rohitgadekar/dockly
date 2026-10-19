import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Shield, Lock, FileText, ChevronLeft, CheckCircle2, Terminal } from "lucide-react";
import { useTitle } from "@/hooks/useTitle";

interface ProtocolContent {
    id: string;
    title: string;
    subtitle: string;
    badge: string;
    icon: React.ReactNode;
    sections: {
        number: string;
        heading: string;
        content: string;
        tag?: string;
    }[];
}

const protocols: Record<string, ProtocolContent> = {
    privacy: {
        id: "privacy",
        title: "Sovereign Privacy",
        subtitle: "Zero-Knowledge Data & Profile Protocols",
        badge: "PROTOCOL // PRIVACY-v2.4",
        icon: <Shield className="text-[#3ECF8E]" size={24} />,
        sections: [
            {
                number: "01",
                heading: "Data Sovereignty & Ownership",
                tag: "core_sovereignty",
                content: "Your digital estate belongs exclusively to you. We employ isolated vault architecture to ensure that your profile data, analytics, custom themes, and personal credentials are encrypted and stored in sovereign nodes, never to be mined, sold, or auctioned to third parties."
            },
            {
                number: "02",
                heading: "Zero-Knowledge Telemetry",
                tag: "zero_tracking",
                content: "Dockly operates on zero-cookie, zero-cross-site tracking principles. We do not track visitor movements across the web. Profile views, click signals, and Command Deck telemetry are collected in aggregate without intrusive tracking cookies or personal device fingerprinting."
            },
            {
                number: "03",
                heading: "End-to-End Cryptographic Security",
                tag: "encryption_layer",
                content: "All transmissions between your sovereign profile and our global edge network are encrypted using TLS 1.3 quantum-hardened protocols. Passwords and protected resume access codes are salted and hashed through secure irreversible cryptographic functions."
            },
            {
                number: "04",
                heading: "Instant Vault Purge & Export",
                tag: "data_erasure",
                content: "You retain the sovereign right to purge your entire account and vaulted history at any time. Triggering an account deletion permanently wipes all uploaded media, stories, and database records from our primary clusters and ephemeral edge cache."
            }
        ]
    },
    terms: {
        id: "terms",
        title: "Terms Covenant",
        subtitle: "The Digital Estate Operating Agreement",
        badge: "COVENANT // TERMS-v2.4",
        icon: <FileText className="text-[#3ECF8E]" size={24} />,
        sections: [
            {
                number: "01",
                heading: "Establishment of Tenure",
                tag: "tenure_rights",
                content: "By creating a node on Dockly.Pro, you receive a personal license to broadcast your verified digital presence. All intellectual property, portfolio media, resume documentation, and brand trademarks within your estate remain your sovereign property."
            },
            {
                number: "02",
                heading: "Operational Integrity & Network Health",
                tag: "fair_use",
                content: "Users agree to refrain from deploying automated exploitation scripts, credential stuffing, or any malicious behavior designed to degrade edge latency or disrupt the platform for other creators. High-performance uptime is a collective standard."
            },
            {
                number: "03",
                heading: "Content Authenticity & Vouching",
                tag: "verification",
                content: "You warrant that the information presented on your personal profile—including career milestones, skill claims, and endorsements—is authentic and representative of your professional background. Impersonation of verified individuals is strictly prohibited."
            },
            {
                number: "04",
                heading: "Service Continuity & Updates",
                tag: "sla_commitment",
                content: "We commit to 99%+ global edge availability. Feature enhancements, atmospheric shader upgrades, and security revisions are deployed continuously without requiring manual re-configuration of your public URL."
            }
        ]
    }
};

interface ProtocolProps {
    defaultId?: "privacy" | "terms";
}

export const Protocol = ({ defaultId }: ProtocolProps) => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const activeKey = (id || defaultId || "privacy").toLowerCase();
    const currentProtocol = protocols[activeKey] || protocols.privacy;

    useTitle(`${currentProtocol.title} — Dockly.Pro`);

    return (
        <div className="min-h-screen bg-[#000000] text-zinc-100 font-plus relative overflow-hidden selection:bg-[#3ECF8E]/30 selection:text-white">
            {/* Supabase Emerald Ambient Background Spotlight */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-15%] left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-[#3ECF8E]/[0.10] via-emerald-600/[0.03] to-transparent blur-[140px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-cyan-600/[0.03] blur-[150px] rounded-full" />
                
                {/* Vercel subtle grid lines */}
                <div
                    className="absolute inset-0 opacity-[0.035]"
                    style={{
                        backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
                        backgroundSize: '48px 48px'
                    }}
                />
            </div>

            {/* Floating Top Navigation */}
            <header className="fixed top-4 sm:top-6 inset-x-0 z-50 px-4 pointer-events-none">
                <div className="max-w-4xl mx-auto bg-[#09090B]/85 border border-zinc-800 shadow-[0_12px_40px_rgba(0,0,0,0.65)] backdrop-blur-2xl rounded-full px-4 sm:px-6 h-14 flex items-center justify-between pointer-events-auto">
                    {/* Back button */}
                    <button
                        onClick={() => navigate("/")}
                        className="group flex items-center gap-2 text-zinc-400 hover:text-white transition-colors font-jetbrains text-xs"
                    >
                        <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
                        <span>cd .. / home</span>
                    </button>

                    {/* Brand with /dp.png */}
                    <Link to="/" className="flex items-center gap-2.5">
                        <img src="/dp.png" alt="Dockly" className="w-6 h-6 rounded-lg object-contain shadow-sm" />
                        <span className="font-outfit font-extrabold text-sm sm:text-base tracking-tight text-white">
                            dockly<span className="text-[#3ECF8E]">.pro</span>
                        </span>
                    </Link>

                    {/* Protocol Switcher Pills */}
                    <div className="flex items-center gap-1 font-jetbrains text-xs">
                        <Link
                            to="/protocol/privacy"
                            className={`px-3 py-1 rounded-full transition-all ${
                                activeKey === "privacy"
                                    ? "bg-[#3ECF8E]/15 text-[#3ECF8E] border border-[#3ECF8E]/30 font-semibold"
                                    : "text-zinc-400 hover:text-white"
                            }`}
                        >
                            Privacy
                        </Link>
                        <Link
                            to="/protocol/terms"
                            className={`px-3 py-1 rounded-full transition-all ${
                                activeKey === "terms"
                                    ? "bg-[#3ECF8E]/15 text-[#3ECF8E] border border-[#3ECF8E]/30 font-semibold"
                                    : "text-zinc-400 hover:text-white"
                            }`}
                        >
                            Terms
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-32 sm:pt-40 pb-24 relative z-10">
                {/* Header Section */}
                <div className="mb-14 sm:mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#3ECF8E]/10 border border-[#3ECF8E]/20 text-xs font-jetbrains font-medium text-[#3ECF8E] mb-6">
                        <Terminal size={13} className="text-[#3ECF8E]" />
                        <span>{currentProtocol.badge}</span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-4">
                        <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shadow-xl shrink-0">
                            {currentProtocol.icon}
                        </div>
                        <div>
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-outfit font-extrabold tracking-tight text-white">
                                {currentProtocol.title}
                            </h1>
                            <p className="text-sm sm:text-base font-jetbrains text-zinc-400 mt-1">
                                // {currentProtocol.subtitle}
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-jetbrains text-zinc-500 border-b border-zinc-800/80 pb-6">
                        <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-[#3ECF8E] animate-pulse" />
                            Status: Active & Enforced
                        </span>
                        <span>•</span>
                        <span>Revision: 2026.10</span>
                        <span>•</span>
                        <span>Governing Body: Eagle LABS</span>
                    </div>
                </div>

                {/* Sections Grid */}
                <div className="space-y-6">
                    {currentProtocol.sections.map((sec) => (
                        <div
                            key={sec.number}
                            className="bg-[#09090B]/80 border border-zinc-800/90 hover:border-zinc-700/80 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-xl transition-all duration-200 relative overflow-hidden group"
                        >
                            {/* Subtle top specular border highlight */}
                            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#3ECF8E]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                                <div className="flex items-center gap-3">
                                    <span className="text-xs font-jetbrains font-bold text-[#3ECF8E] bg-[#3ECF8E]/10 px-2 py-0.5 rounded-md border border-[#3ECF8E]/20">
                                        § {sec.number}
                                    </span>
                                    <h2 className="text-lg sm:text-xl font-outfit font-bold tracking-tight text-white">
                                        {sec.heading}
                                    </h2>
                                </div>
                                {sec.tag && (
                                    <span className="text-[11px] font-jetbrains text-zinc-500">
                                        [{sec.tag}]
                                    </span>
                                )}
                            </div>

                            <p className="text-sm sm:text-base text-zinc-400 leading-relaxed font-normal pt-1">
                                {sec.content}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Verification Seal */}
                <div className="mt-16 sm:mt-20 pt-8 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-jetbrains text-zinc-500 text-center sm:text-left">
                    <div className="flex items-center gap-2.5">
                        <CheckCircle2 size={15} className="text-[#3ECF8E]" />
                        <span>Cryptographically Sealed · Sovereign Cloud Architecture</span>
                    </div>
                    <span>© 2026 dockly.pro · All Rights Reserved</span>
                </div>
            </main>
        </div>
    );
};

export default Protocol;
