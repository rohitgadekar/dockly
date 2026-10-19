import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
    ArrowRight, Activity, Shield, Radio, FileText, Cpu, Compass,
    Star, CheckCircle2, Lock, Download, Quote, ChevronRight,
    ChevronLeft, BarChart3, Music, Globe, Link2, Menu, X
} from "lucide-react";
import { SiSpotify } from "react-icons/si";
import { useNavigate } from "react-router-dom";
import { useTitle } from "@/hooks/useTitle";

/* ─── Animated counter ─── */
function Counter({ end, suffix = "" }: { end: number; suffix?: string }) {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    const inView = useInView(ref, { once: true });
    useEffect(() => {
        if (!inView) return;
        let s = 0;
        const step = end / 60;
        const t = setInterval(() => {
            s += step;
            if (s >= end) { setCount(end); clearInterval(t); }
            else setCount(Math.floor(s));
        }, 16);
        return () => clearInterval(t);
    }, [inView, end]);
    return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

/* ─── Marquee strip ─── */
const MARQUEE = ["Executive CV", "Tech Arsenal", "Career Milestones", "Endorsements", "Spotify Sync", "Live Analytics", "Ephemeral Stories", "Brand Card", "Booking Portal", "Curated Links"];

function Marquee() {
    return (
        <div className="overflow-hidden border-y border-white/5 py-3 bg-white/[0.01]">
            <motion.div
                animate={{ x: ["0%", "-50%"] }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="flex whitespace-nowrap"
            >
                {[...MARQUEE, ...MARQUEE].map((item, i) => (
                    <span key={i} className="inline-block mx-8 text-[10px] font-syncopate uppercase tracking-[0.3em] text-white/25 shrink-0">
                        {item} <span className="text-luxury-gold/40 ml-8">✦</span>
                    </span>
                ))}
            </motion.div>
        </div>
    );
}

/* ─── Word cycle ─── */
const WORDS = ["Founders", "Engineers", "Creators", "Advisors", "Builders"];

/* ─── Features ─── */
const FEATURES = [
    { id: "dossier", no: "01", label: "Executive Dossier", icon: <FileText size={16} />, color: "#F59E0B", headline: "Your Confidential CV, Secured.", body: "Gate your institutional track record, equity exits, and board credentials behind a private passcode vault. Enable one-click PDF download for VCs, recruiters, and strategic partners.", pills: ["Passcode Encryption", "PDF Export", "Equity History", "Advisory Boards"] },
    { id: "skills", no: "02", label: "Tech Arsenal", icon: <Cpu size={16} />, color: "#06B6D4", headline: "Display Engineering Depth.", body: "Categorise your full technical stack across languages, distributed systems, AI pipelines, and cloud infrastructure. Each skill carries verified experience depth and proficiency tier.", pills: ["Category Filters", "Years of Depth", "Stack Icons", "Proficiency Tiers"] },
    { id: "milestones", no: "03", label: "Career Trajectory", icon: <Compass size={16} />, color: "#A855F7", headline: "Chronicle Every Breakthrough.", body: "Map your journey from founding moments to liquidity events on an elegant chronological timeline. Tag funding rounds, keynote summits, and acquisitions with verification links.", pills: ["Chronological Timeline", "Venture Categories", "External Links", "Badge System"] },
    { id: "endorsements", no: "04", label: "Wall of Distinction", icon: <Star size={16} />, color: "#F43F5E", headline: "Let Reputation Speak First.", body: "Curate accredited appraisals from venture partners, engineering VPs, and clients. Company badges and 5-star ratings convert prospective collaborators on sight.", pills: ["VC Appraisals", "Verified Clients", "Star Ratings", "Company Badges"] },
    { id: "analytics", no: "05", label: "Live Intelligence", icon: <BarChart3 size={16} />, color: "#10B981", headline: "Know Your High-Intent Audience.", body: "Real-time, privacy-first analytics reveal where investors, recruiters, and partners discover your estate. No tracking cookies, just clean attribution.", pills: ["Zero Cookies", "Live Telemetry", "Traffic Sources", "Link Conversion"] },
    { id: "music", no: "06", label: "Sonic Identity", icon: <Music size={16} />, color: "#1DB954", headline: "Soundtrack Your Digital Presence.", body: "Imbue your estate with auditory character. Sync Spotify top tracks, latest releases, or podcasts directly on-page with native audio preview — no redirect.", pills: ["Spotify Integration", "Audio Previews", "Top Tracks", "Direct Route"] },
    { id: "stories", no: "07", label: "Ephemeral Stories", icon: <Radio size={16} />, color: "#D4AF37", headline: "Broadcast & Disappear in 24h.", body: "Post spontaneous dispatches, behind-the-scenes moments, and thought leadership in full-screen stories that vanish after 24 hours — keeping your estate perpetually fresh.", pills: ["24-Hour Vault", "Cinematic Viewer", "Photo & Video", "Auto-Expiry"] },
];

/* ─── Testimonials ─── */
const TESTIMONIALS = [
    { quote: "The architectural precision of this platform transformed my digital presence into a high-authority archival estate. There is nothing else like it.", name: "Rohit Gadekar", role: "Founder & CEO", company: "Eagle LABS", initial: "RG" },
    { quote: "Finally, a platform that understands identity is an asset. The dossier vault and endorsement system are genuinely unmatched.", name: "Claire Bennett", role: "Chief Technology Officer", company: "Eagle LABS", initial: "CB" },
    { quote: "100ms delivery, institutional typography, and a CV vault that actually converts — this is the only link-in-bio tool built for serious operators.", name: "Akhil Singh", role: "Director of Growth", company: "Eagle LABS", initial: "AS" },
];

/* ════════════════════════════════════════ */
export default function Landing() {
    const navigate = useNavigate();
    const [wordIdx, setWordIdx] = useState(0);
    const [activeF, setActiveF] = useState(0);
    const [tIdx, setTIdx] = useState(0);
    const [mobileNav, setMobileNav] = useState(false);
    useTitle("Dockly Pro — Sovereign Digital Estate");

    useEffect(() => {
        const t = setInterval(() => setWordIdx(p => (p + 1) % WORDS.length), 2600);
        return () => clearInterval(t);
    }, []);

    useEffect(() => {
        const t = setInterval(() => setTIdx(p => (p + 1) % TESTIMONIALS.length), 5500);
        return () => clearInterval(t);
    }, []);

    const feat = FEATURES[activeF];

    return (
        <div className="min-h-screen bg-[#06060a] text-white overflow-x-hidden">

            {/* ══ NAVBAR ══ */}
            <header className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-[#06060a]/80 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 h-14 sm:h-16 flex items-center justify-between">
                    <button onClick={() => navigate("/")} className="text-base sm:text-lg font-syncopate font-bold tracking-tighter flex-shrink-0">
                        DOCKLY<span className="text-luxury-gold">.</span>PRO
                    </button>

                    {/* Desktop nav */}
                    <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-[11px] font-syncopate uppercase tracking-[0.18em] text-white/45">
                        {[["Features", "#features"], ["Suite", "#suite"], ["Themes", "#themes"], ["Pricing", "#cta"]].map(([l, h]) => (
                            <a key={l} href={h} className="hover:text-white transition-colors">{l}</a>
                        ))}
                    </nav>

                    <div className="hidden md:flex items-center gap-3">
                        <button onClick={() => navigate("/auth")} className="text-[11px] font-syncopate uppercase tracking-widest text-white/45 hover:text-white transition-colors">Sign In</button>
                        <button onClick={() => navigate("/auth")} className="flex items-center gap-1.5 bg-luxury-gold text-black px-4 py-2 rounded-xl text-[10px] font-syncopate uppercase tracking-widest font-bold hover:bg-luxury-gold/90 transition-all hover:shadow-[0_0_24px_rgba(212,175,55,0.4)] active:scale-95">
                            Get Access <ArrowRight size={11} />
                        </button>
                    </div>

                    {/* Mobile menu btn */}
                    <button onClick={() => setMobileNav(v => !v)} className="md:hidden text-white/60 hover:text-white transition-colors p-1">
                        {mobileNav ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>

                {/* Mobile nav drawer */}
                <AnimatePresence>
                    {mobileNav && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden border-t border-white/5 bg-[#06060a] overflow-hidden"
                        >
                            <div className="px-4 py-4 flex flex-col gap-3">
                                {[["Features", "#features"], ["Suite", "#suite"], ["Themes", "#themes"], ["Pricing", "#cta"]].map(([l, h]) => (
                                    <a key={l} href={h} onClick={() => setMobileNav(false)} className="text-[11px] font-syncopate uppercase tracking-[0.2em] text-white/50 hover:text-white transition-colors py-2 border-b border-white/5">{l}</a>
                                ))}
                                <div className="flex gap-3 pt-2">
                                    <button onClick={() => navigate("/auth")} className="flex-1 text-center text-[11px] font-syncopate uppercase tracking-widest text-white/50 border border-white/10 rounded-xl py-2.5 hover:text-white hover:border-white/20 transition-all">Sign In</button>
                                    <button onClick={() => navigate("/auth")} className="flex-1 text-center bg-luxury-gold text-black text-[10px] font-syncopate uppercase tracking-widest font-bold rounded-xl py-2.5 hover:bg-luxury-gold/90 transition-all">Get Access</button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            {/* ══ HERO ══ */}
            <section className="relative flex flex-col items-center justify-center text-center px-4 sm:px-6 pt-28 sm:pt-36 pb-0 min-h-screen overflow-hidden">
                {/* Background glows */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(700px,100vw)] h-[min(700px,100vw)] bg-luxury-gold/[0.035] blur-[140px] rounded-full pointer-events-none" />
                <div className="absolute top-0 right-0 w-[min(400px,60vw)] h-[min(400px,60vw)] bg-purple-600/[0.04] blur-[100px] rounded-full pointer-events-none" />
                <div className="absolute bottom-1/3 left-0 w-[min(300px,50vw)] h-[min(300px,50vw)] bg-cyan-600/[0.03] blur-[100px] rounded-full pointer-events-none" />

                {/* Eyebrow badge */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 mb-6 sm:mb-8 px-3 py-1.5 border border-luxury-gold/30 rounded-full bg-luxury-gold/5"
                >
                    <span className="w-1.5 h-1.5 rounded-full bg-luxury-gold animate-pulse flex-shrink-0" />
                    <span className="text-[9px] sm:text-[10px] font-syncopate uppercase tracking-[0.3em] text-luxury-gold">Sovereign Digital Estate</span>
                </motion.div>

                {/* Headline — static lines */}
                <div className="overflow-hidden w-full">
                    <motion.h1
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                        className="font-syncopate font-bold uppercase tracking-tighter leading-[0.88] text-white"
                        style={{ fontSize: "clamp(2.6rem, 9vw, 7.5rem)" }}
                    >
                        ONE LINK<br />FOR EVERY
                    </motion.h1>
                </div>

                {/* Animated cycling word */}
                <div className="overflow-hidden w-full" style={{ height: "clamp(2.6rem, 9vw, 7.5rem)", marginTop: "0.1em" }}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={wordIdx}
                            initial={{ y: "110%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "-110%" }}
                            transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
                            className="font-syncopate font-bold uppercase tracking-tighter leading-[0.88]"
                            style={{
                                fontSize: "clamp(2.6rem, 9vw, 7.5rem)",
                                background: "linear-gradient(135deg,#D4AF37 0%,#F5F5DC 55%,#D4AF37 100%)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                backgroundClip: "text",
                            }}
                        >
                            {WORDS[wordIdx]}.
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Subtext */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mt-6 sm:mt-8 text-base sm:text-lg text-white/45 leading-relaxed max-w-xs sm:max-w-md lg:max-w-xl mx-auto"
                >
                    The architectural link-in-bio for serious operators — executive CV, tech stack, milestones, endorsements, and content, all behind one sovereign URL.
                </motion.p>

                {/* CTAs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.55 }}
                    className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center gap-3"
                >
                    <button
                        onClick={() => navigate("/auth")}
                        className="group w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-luxury-gold text-black font-syncopate font-bold text-[11px] sm:text-[12px] uppercase tracking-widest px-7 sm:px-8 py-3.5 sm:py-4 rounded-2xl transition-all hover:shadow-[0_0_40px_rgba(212,175,55,0.45)] hover:scale-[1.02] active:scale-95"
                    >
                        Claim Your Estate
                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                    <a
                        href="#suite"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 font-syncopate text-[11px] uppercase tracking-widest text-white/45 hover:text-white transition-colors border border-white/10 hover:border-white/20 px-7 sm:px-8 py-3.5 sm:py-4 rounded-2xl"
                    >
                        Explore Features
                    </a>
                </motion.div>

                {/* Social proof row */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.75 }}
                    className="mt-8 sm:mt-10 flex items-center justify-center gap-3 sm:gap-4"
                >
                    <div className="flex -space-x-2">
                        {["RG", "CB", "AS", "MK", "PL"].map((ini, i) => (
                            <div key={i} className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-[#06060a] bg-gradient-to-br from-luxury-gold/30 to-luxury-gold/10 flex items-center justify-center text-[8px] font-syncopate font-bold text-luxury-gold">
                                {ini}
                            </div>
                        ))}
                    </div>
                    <div>
                        <div className="flex items-center gap-0.5 mb-0.5">
                            {[...Array(5)].map((_, i) => <Star key={i} size={10} className="text-luxury-gold fill-luxury-gold" />)}
                        </div>
                        <p className="text-[9px] text-white/35 font-syncopate uppercase tracking-wider">Trusted by 2,400+ Founders</p>
                    </div>
                </motion.div>

                {/* Browser mockup strip */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9, duration: 0.9 }}
                    className="mt-12 sm:mt-16 w-full max-w-5xl mx-auto relative"
                >
                    <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#06060a] to-transparent z-10 pointer-events-none" />
                    <div className="rounded-t-2xl sm:rounded-t-3xl border border-white/8 border-b-0 overflow-hidden bg-[#0a0a0e]">
                        {/* Browser chrome */}
                        <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-3 border-b border-white/5">
                            <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-white/10" />
                            <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-white/10" />
                            <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-white/10" />
                            <div className="flex-1 mx-3 sm:mx-4 h-4 sm:h-5 rounded-md bg-white/5 flex items-center px-2 sm:px-3">
                                <span className="text-[9px] sm:text-[10px] text-white/20 font-plus">dockly.pro/yourname</span>
                            </div>
                        </div>
                        <img
                            src="/deck.png"
                            alt="Profile Preview"
                            className="w-full object-cover object-top opacity-90"
                            style={{ maxHeight: "clamp(180px, 30vw, 340px)" }}
                        />
                    </div>
                </motion.div>
            </section>

            {/* ══ MARQUEE ══ */}
            <Marquee />

            {/* ══ STATS ══ */}
            <section className="py-16 sm:py-20 px-4 sm:px-6 border-b border-white/5">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/5 rounded-2xl sm:rounded-3xl overflow-hidden">
                        {[
                            { value: 2400, suffix: "+", label: "Active Estates" },
                            { value: 48, suffix: "M+", label: "Profile Views" },
                            { value: 99, suffix: "%", label: "Uptime SLA" },
                            { value: 7, suffix: "", label: "Feature Pillars" },
                        ].map(({ value, suffix, label }) => (
                            <div key={label} className="bg-[#06060a] px-6 py-8 sm:px-8 sm:py-10 text-center hover:bg-white/[0.02] transition-colors">
                                <div className="text-3xl sm:text-4xl lg:text-5xl font-syncopate font-bold text-white mb-1.5">
                                    <Counter end={value} suffix={suffix} />
                                </div>
                                <div className="text-[10px] font-syncopate uppercase tracking-[0.2em] text-white/30">{label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══ FEATURE EXPLORER ══ */}
            <section id="suite" className="py-16 sm:py-24 lg:py-28 px-4 sm:px-6 lg:px-10 border-b border-white/5">
                <div className="max-w-7xl mx-auto">

                    {/* Section header */}
                    <div className="mb-10 sm:mb-16">
                        <div className="text-[9px] sm:text-[10px] font-syncopate uppercase tracking-[0.4em] text-luxury-gold mb-3 sm:mb-4">Capability Index</div>
                        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-syncopate font-bold uppercase tracking-tighter leading-[0.92]">
                                SEVEN<br className="sm:hidden" /> ARCHITECTURAL
                                <br />
                                <span style={{ background: "linear-gradient(135deg,#D4AF37,#F5F5DC,#D4AF37)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                                    PILLARS
                                </span>
                            </h2>
                            <p className="text-sm text-white/35 max-w-[260px] leading-relaxed">
                                Each feature crafted with institutional-grade precision.
                            </p>
                        </div>
                    </div>

                    {/* Tab selector (mobile: horizontal scroll, desktop: sidebar) */}
                    <div id="features" className="flex flex-col lg:grid lg:grid-cols-[280px,1fr] xl:grid-cols-[320px,1fr] gap-6 lg:gap-8">

                        {/* Left: Scrollable tabs on mobile, sidebar on desktop */}
                        <div className="flex lg:flex-col gap-1 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide lg:overflow-visible">
                            {FEATURES.map((f, i) => (
                                <button
                                    key={f.id}
                                    onClick={() => setActiveF(i)}
                                    className={`flex-shrink-0 lg:flex-shrink flex items-center gap-3 px-3 sm:px-4 py-3 rounded-xl lg:rounded-2xl text-left transition-all duration-250 ${activeF === i ? "bg-white/[0.07] border border-white/10" : "hover:bg-white/[0.03] border border-transparent"}`}
                                >
                                    <span
                                        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-250"
                                        style={{
                                            backgroundColor: activeF === i ? `${f.color}20` : "rgba(255,255,255,0.04)",
                                            color: activeF === i ? f.color : "rgba(255,255,255,0.3)",
                                            border: `1px solid ${activeF === i ? f.color + "30" : "rgba(255,255,255,0.06)"}`,
                                        }}
                                    >
                                        {f.icon}
                                    </span>
                                    <span className={`text-[11px] sm:text-xs font-syncopate uppercase tracking-wider whitespace-nowrap transition-colors duration-250 ${activeF === i ? "text-white" : "text-white/40"}`}>
                                        {f.label}
                                    </span>
                                </button>
                            ))}
                        </div>

                        {/* Right: Detail panel */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeF}
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                                className="rounded-2xl sm:rounded-3xl border border-white/8 bg-gradient-to-br from-white/[0.04] to-transparent p-6 sm:p-8 lg:p-10 relative overflow-hidden min-h-[320px] sm:min-h-[400px] flex flex-col justify-between"
                            >
                                {/* Glow */}
                                <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full blur-[100px] pointer-events-none opacity-60" style={{ backgroundColor: `${feat.color}12` }} />
                                {/* Top accent line */}
                                <div className="absolute top-0 inset-x-0 h-px" style={{ background: `linear-gradient(90deg,transparent,${feat.color}55,transparent)` }} />

                                <div>
                                    {/* Tag */}
                                    <div className="inline-flex items-center gap-2 mb-5 sm:mb-6 px-3 py-1.5 rounded-full border text-[9px] sm:text-[10px] font-syncopate uppercase tracking-[0.25em]" style={{ borderColor: `${feat.color}35`, backgroundColor: `${feat.color}12`, color: feat.color }}>
                                        {feat.icon}
                                        {feat.label}
                                    </div>
                                    {/* Headline */}
                                    <h3 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-syncopate font-bold uppercase tracking-tighter leading-[0.92] text-white mb-4 sm:mb-5">
                                        {feat.headline}
                                    </h3>
                                    {/* Body */}
                                    <p className="text-sm sm:text-base text-white/45 leading-relaxed max-w-2xl mb-6 sm:mb-8">
                                        {feat.body}
                                    </p>
                                </div>

                                {/* Pills + Nav */}
                                <div className="flex flex-col sm:flex-row sm:items-end gap-4 justify-between">
                                    <div className="flex flex-wrap gap-2">
                                        {feat.pills.map(p => (
                                            <span key={p} className="px-2.5 py-1.5 rounded-lg border text-[9px] sm:text-[10px] font-syncopate uppercase tracking-wider" style={{ borderColor: `${feat.color}25`, backgroundColor: `${feat.color}08`, color: `${feat.color}bb` }}>
                                                {p}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <button onClick={() => setActiveF(p => (p - 1 + FEATURES.length) % FEATURES.length)} className="w-9 h-9 rounded-xl border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/20 transition-all">
                                            <ChevronLeft size={16} />
                                        </button>
                                        <span className="text-[10px] font-syncopate text-white/25 w-12 text-center">{feat.no} / 07</span>
                                        <button onClick={() => setActiveF(p => (p + 1) % FEATURES.length)} className="w-9 h-9 rounded-xl border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/20 transition-all">
                                            <ChevronRight size={16} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </section>

            {/* ══ PROFILE CARD PREVIEW ══ */}
            <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-10 border-b border-white/5 relative overflow-hidden">
                <div className="absolute inset-0 bg-luxury-gold/[0.02] pointer-events-none" />
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center gap-10 lg:gap-16">

                        {/* Left: text */}
                        <div className="flex-1 min-w-0">
                            <div className="text-[9px] sm:text-[10px] font-syncopate uppercase tracking-[0.4em] text-luxury-gold mb-3 sm:mb-4">Live Profile</div>
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-syncopate font-bold uppercase tracking-tighter leading-[0.92] mb-4 sm:mb-6">
                                YOUR ESTATE,<br />
                                <span style={{ background: "linear-gradient(135deg,#D4AF37,#F5F5DC,#D4AF37)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                                    ALWAYS LIVE.
                                </span>
                            </h2>
                            <p className="text-sm sm:text-base text-white/40 leading-relaxed mb-6 sm:mb-8 max-w-sm">
                                Your public profile is a living, breathing institution — always synced, always professional, always yours. Share one link. Impress everyone.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3">
                                {[
                                    { icon: <Activity size={14} />, text: "Real-time sync across all sections" },
                                    { icon: <Shield size={14} />, text: "Institutional-grade uptime & security" },
                                    { icon: <Globe size={14} />, text: "Custom domain & vanity URL support" },
                                ].map(({ icon, text }) => (
                                    <div key={text} className="flex items-center gap-2.5 text-[11px] text-white/40 font-syncopate uppercase tracking-wider">
                                        <span className="text-luxury-gold/60 shrink-0">{icon}</span>
                                        <span className="leading-tight">{text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right: Profile card */}
                        <div className="w-full lg:w-auto flex justify-center lg:justify-end">
                            <div className="relative w-full max-w-xs sm:max-w-sm">
                                {/* Glow */}
                                <div className="absolute -inset-6 bg-luxury-gold/6 blur-[60px] rounded-full pointer-events-none" />

                                <div className="relative rounded-[1.5rem] sm:rounded-[2rem] border border-white/10 bg-gradient-to-b from-white/[0.07] to-white/[0.02] p-5 sm:p-7 backdrop-blur-xl shadow-2xl">
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-luxury-gold to-transparent" />

                                    {/* Avatar */}
                                    <div className="flex flex-col items-center text-center mb-5">
                                        <div className="relative mb-3">
                                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-luxury-gold/50 bg-gradient-to-br from-luxury-gold/20 to-black flex items-center justify-center text-xl sm:text-2xl font-syncopate font-bold text-luxury-gold shadow-lg shadow-luxury-gold/20">HQ</div>
                                            <div className="absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-luxury-gold rounded-full border-2 border-[#06060a] flex items-center justify-center">
                                                <CheckCircle2 size={10} className="text-black" />
                                            </div>
                                        </div>
                                        <h2 className="font-syncopate font-bold text-xs sm:text-sm uppercase tracking-widest text-white mb-0.5">Harrison Quill</h2>
                                        <p className="text-[10px] sm:text-[11px] text-luxury-gold/70 font-syncopate uppercase tracking-[0.15em] sm:tracking-[0.2em]">Founder & Systems Architect</p>
                                        <p className="text-[10px] text-white/35 mt-1.5 max-w-[200px] leading-relaxed">Building sovereign-grade distributed infrastructure at the edge.</p>
                                    </div>

                                    {/* Stats */}
                                    <div className="grid grid-cols-3 gap-2 mb-4">
                                        {[["48K", "Visitors"], ["3.2K", "Clicks"], ["94%", "Intent"]].map(([n, l]) => (
                                            <div key={l} className="text-center py-2 rounded-xl bg-white/[0.04] border border-white/5">
                                                <div className="text-xs sm:text-sm font-syncopate font-bold text-luxury-gold">{n}</div>
                                                <div className="text-[8px] sm:text-[9px] text-white/30 font-syncopate uppercase tracking-wider mt-0.5">{l}</div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Chips */}
                                    <div className="flex flex-wrap gap-1 sm:gap-1.5 justify-center mb-4">
                                        {[{ icon: <FileText size={9} />, label: "CV", col: "#F59E0B" }, { icon: <Cpu size={9} />, label: "Tech", col: "#06B6D4" }, { icon: <Star size={9} />, label: "Reviews", col: "#F43F5E" }, { icon: <SiSpotify size={9} />, label: "Music", col: "#1DB954" }].map(({ icon, label, col }) => (
                                            <span key={label} className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[8px] sm:text-[9px] font-syncopate uppercase tracking-wider border" style={{ borderColor: `${col}30`, color: col, backgroundColor: `${col}10` }}>
                                                {icon} {label}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Buttons */}
                                    <div className="flex flex-col gap-1.5 sm:gap-2">
                                        <div className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl bg-luxury-gold/10 border border-luxury-gold/20">
                                            <div className="flex items-center gap-2"><Lock size={11} className="text-luxury-gold" /><span className="text-[9px] sm:text-[10px] font-syncopate uppercase tracking-wider text-white">Executive CV Dossier</span></div>
                                            <ArrowRight size={11} className="text-luxury-gold/60" />
                                        </div>
                                        <div className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl bg-white/[0.03] border border-white/5">
                                            <div className="flex items-center gap-2"><Download size={11} className="text-white/40" /><span className="text-[9px] sm:text-[10px] font-syncopate uppercase tracking-wider text-white/50">Download Brand Card</span></div>
                                            <ArrowRight size={11} className="text-white/20" />
                                        </div>
                                    </div>
                                </div>

                                {/* Floating badges */}
                                <motion.div animate={{ y: [0, -7, 0] }} transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }} className="absolute -top-5 -right-4 sm:-right-8 bg-[#111] border border-white/10 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2 sm:py-2.5 flex items-center gap-2 shadow-xl">
                                    <Activity size={11} className="text-emerald-400" />
                                    <div>
                                        <div className="text-[8px] sm:text-[9px] font-syncopate uppercase tracking-widest text-white/35">Live Now</div>
                                        <div className="text-[10px] sm:text-xs font-syncopate font-bold text-white">127 Visitors</div>
                                    </div>
                                </motion.div>

                                <motion.div animate={{ y: [0, 7, 0] }} transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 0.6 }} className="absolute -bottom-5 -left-4 sm:-left-8 bg-[#111] border border-white/10 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2 sm:py-2.5 flex items-center gap-2 shadow-xl">
                                    <Star size={11} className="text-rose-400 fill-rose-400" />
                                    <div>
                                        <div className="text-[8px] sm:text-[9px] font-syncopate uppercase tracking-widest text-white/35">Endorsed</div>
                                        <div className="text-[10px] sm:text-xs font-syncopate font-bold text-white">38 Reviews</div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ══ THEMES ══ */}
            <section id="themes" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-10 border-b border-white/5">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-10 sm:mb-14">
                        <div className="text-[9px] sm:text-[10px] font-syncopate uppercase tracking-[0.4em] text-luxury-gold mb-3">Visual Mastery</div>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-syncopate font-bold uppercase tracking-tighter leading-[0.92]">
                            CURATED <span style={{ background: "linear-gradient(135deg,#D4AF37,#F5F5DC,#D4AF37)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>AESTHETICS</span>
                        </h2>
                        <p className="mt-4 text-sm text-white/35 max-w-sm mx-auto leading-relaxed">
                            Premium, architectural themes — each designed to amplify authority and elevate content.
                        </p>
                    </div>

                    {/* Theme swatches */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8 sm:mb-10">
                        {[
                            { name: "CITADEL", col: "#D4AF37" },
                            { name: "OBSIDIAN", col: "#6366F1" },
                            { name: "SAHARA", col: "#F59E0B" },
                            { name: "ETHEREAL", col: "#06B6D4" },
                            { name: "IVORY", col: "#F5F5DC" },
                            { name: "CRIMSON", col: "#EF4444" },
                        ].map(({ name, col }) => (
                            <div key={name} className="flex flex-col items-center gap-2.5 p-4 rounded-2xl border border-white/6 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/12 transition-all cursor-default group">
                                <div className="w-8 h-8 rounded-full shadow-lg group-hover:scale-110 transition-transform" style={{ backgroundColor: col, boxShadow: `0 4px 20px ${col}40` }} />
                                <span className="text-[9px] font-syncopate uppercase tracking-[0.2em] text-white/45">{name}</span>
                            </div>
                        ))}
                    </div>

                    <div className="text-center">
                        <button onClick={() => navigate("/auth")} className="group inline-flex items-center gap-2 font-syncopate text-[10px] sm:text-[11px] uppercase tracking-widest text-luxury-gold hover:text-white transition-colors border border-luxury-gold/25 hover:border-white/20 px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl">
                            View All Themes <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </section>

            {/* ══ TESTIMONIAL ══ */}
            <section className="py-16 sm:py-24 px-4 sm:px-6 border-b border-white/5 relative overflow-hidden">
                <div className="absolute inset-0 bg-white/[0.01] pointer-events-none" />
                <div className="max-w-3xl mx-auto relative">
                    <div className="text-[9px] sm:text-[10px] font-syncopate uppercase tracking-[0.4em] text-luxury-gold mb-10 sm:mb-14 text-center">Voices of Authority</div>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={tIdx}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -16 }}
                            transition={{ duration: 0.5 }}
                            className="text-center"
                        >
                            <Quote size={40} className="text-luxury-gold/12 mx-auto mb-6" />
                            <p className="text-xl sm:text-2xl md:text-3xl font-syncopate font-bold uppercase tracking-tight leading-tight text-white/85 mb-8 sm:mb-10">
                                "{TESTIMONIALS[tIdx].quote}"
                            </p>
                            <div className="flex items-center justify-center gap-3 sm:gap-4">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-luxury-gold/35 bg-luxury-gold/10 flex items-center justify-center font-syncopate font-bold text-luxury-gold text-xs sm:text-sm">
                                    {TESTIMONIALS[tIdx].initial}
                                </div>
                                <div className="text-left">
                                    <div className="font-syncopate font-bold text-xs sm:text-sm uppercase tracking-widest text-white">{TESTIMONIALS[tIdx].name}</div>
                                    <div className="text-[10px] sm:text-[11px] text-white/35 font-syncopate uppercase tracking-wider mt-0.5">{TESTIMONIALS[tIdx].role} · {TESTIMONIALS[tIdx].company}</div>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                    <div className="flex items-center justify-center gap-2 mt-8 sm:mt-10">
                        {TESTIMONIALS.map((_, i) => (
                            <button key={i} onClick={() => setTIdx(i)} className={`rounded-full transition-all duration-300 ${i === tIdx ? "w-7 sm:w-8 h-1.5 bg-luxury-gold" : "w-1.5 sm:w-2 h-1.5 bg-white/15 hover:bg-white/30"}`} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ══ FEATURES GRID ══ */}
            <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-10 border-b border-white/5">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-10 sm:mb-14">
                        <div className="text-[9px] sm:text-[10px] font-syncopate uppercase tracking-[0.4em] text-luxury-gold mb-3">What's Included</div>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-syncopate font-bold uppercase tracking-tighter leading-[0.92]">
                            EVERYTHING IN ONE <span style={{ background: "linear-gradient(135deg,#D4AF37,#F5F5DC,#D4AF37)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>ESTATE</span>
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                        {[
                            { icon: <FileText size={18} />, title: "Executive CV Dossier", desc: "Passcode-protected career vault with one-click PDF export.", col: "#F59E0B" },
                            { icon: <Cpu size={18} />, title: "Technical Arsenal", desc: "Full stack display with category filters and experience depth.", col: "#06B6D4" },
                            { icon: <Compass size={18} />, title: "Career Milestones", desc: "Chronological trajectory of ventures, exits, and keynotes.", col: "#A855F7" },
                            { icon: <Star size={18} />, title: "Wall of Distinction", desc: "Peer and VC endorsements with corporate verification.", col: "#F43F5E" },
                            { icon: <Activity size={18} />, title: "Live Intelligence", desc: "Zero-cookie analytics with real-time visitor telemetry.", col: "#10B981" },
                            { icon: <SiSpotify size={18} />, title: "Sonic Identity", desc: "Spotify-synced top tracks with native audio preview.", col: "#1DB954" },
                            { icon: <Radio size={18} />, title: "Ephemeral Stories", desc: "24-hour disappearing dispatches with cinematic viewer.", col: "#D4AF37" },
                            { icon: <Link2 size={18} />, title: "Curated Links", desc: "Prioritised social and professional link management.", col: "#6366F1" },
                            { icon: <Globe size={18} />, title: "Digital Brand Card", desc: "Scannable QR-code holographic identity card.", col: "#EC4899" },
                        ].map(({ icon, title, desc, col }, i) => (
                            <motion.div
                                key={title}
                                initial={{ opacity: 0, y: 16 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.04, duration: 0.45 }}
                                className="group flex items-start gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10 transition-all duration-250"
                            >
                                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform" style={{ backgroundColor: `${col}15`, color: col, border: `1px solid ${col}22` }}>
                                    {icon}
                                </div>
                                <div>
                                    <h4 className="font-syncopate font-bold text-[11px] sm:text-xs uppercase tracking-wider text-white mb-1">{title}</h4>
                                    <p className="text-xs sm:text-sm text-white/35 leading-relaxed">{desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══ CTA ══ */}
            <section id="cta" className="py-24 sm:py-36 lg:py-44 px-4 sm:px-6 relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(700px,90vw)] h-[min(500px,70vw)] bg-luxury-gold/[0.055] blur-[130px] rounded-full pointer-events-none" />
                <div className="absolute top-0 left-0 w-[min(350px,50vw)] h-[min(350px,50vw)] bg-purple-600/[0.035] blur-[100px] rounded-full pointer-events-none" />

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.97 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                    >
                        <div className="inline-flex items-center gap-2 mb-8 sm:mb-10 px-3 py-1.5 border border-luxury-gold/30 rounded-full bg-luxury-gold/5">
                            <Shield size={11} className="text-luxury-gold" />
                            <span className="text-[9px] sm:text-[10px] font-syncopate uppercase tracking-[0.3em] text-luxury-gold">Protocol Restricted</span>
                        </div>

                        <h2 className="font-syncopate font-bold uppercase tracking-tighter leading-[0.85] mb-6 sm:mb-8" style={{ fontSize: "clamp(3rem, 12vw, 9rem)" }}>
                            FOR THE<br />
                            <span style={{ background: "linear-gradient(135deg,#D4AF37,#F5F5DC 50%,#D4AF37)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                                CURATED<br />FEW.
                            </span>
                        </h2>

                        <p className="text-base sm:text-lg lg:text-xl text-white/40 max-w-xl mx-auto leading-relaxed mb-10 sm:mb-12">
                            Not a standard platform. A closed ecosystem for operators who define excellence in their field.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                            <button
                                onClick={() => navigate("/auth")}
                                className="group w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-luxury-gold text-black font-syncopate font-bold text-[11px] sm:text-[12px] uppercase tracking-widest px-8 sm:px-10 py-4 sm:py-5 rounded-2xl transition-all hover:shadow-[0_0_60px_rgba(212,175,55,0.5)] hover:scale-[1.02] active:scale-95"
                            >
                                Claim Your Estate
                                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button onClick={() => navigate("/auth")} className="w-full sm:w-auto font-syncopate text-[11px] uppercase tracking-widest text-white/35 hover:text-white transition-colors border border-white/8 hover:border-white/18 px-7 sm:px-8 py-4 sm:py-5 rounded-2xl">
                                Sign In Instead
                            </button>
                        </div>

                        <div className="mt-12 sm:mt-14 flex flex-wrap items-center justify-center gap-4 sm:gap-8">
                            {["Institutional Security", "Zero Tracking Cookies", "Custom Domain Ready", "Real-time Sync"].map(t => (
                                <span key={t} className="flex items-center gap-1.5 text-[9px] sm:text-[10px] font-syncopate uppercase tracking-widest text-white/20">
                                    <CheckCircle2 size={11} className="text-luxury-gold/40" />
                                    {t}
                                </span>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ══ FOOTER ══ */}
            <footer className="border-t border-white/5 bg-[#040408] px-4 sm:px-6 lg:px-10 py-10 sm:py-14">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-8 sm:gap-10 mb-10 sm:mb-12">
                        <div className="text-center sm:text-left">
                            <div className="text-lg font-syncopate font-bold tracking-tighter mb-1.5 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                                DOCKLY<span className="text-luxury-gold">.</span>PRO
                            </div>
                            <p className="text-[10px] text-white/25 font-syncopate uppercase tracking-wider">Sovereign Digital Estate Platform</p>
                            <p className="text-[9px] text-white/15 font-syncopate uppercase tracking-[0.3em] mt-2">Product by Eagle LABS</p>
                        </div>

                        <div className="grid grid-cols-3 gap-6 sm:gap-10 text-center sm:text-left">
                            <div>
                                <h5 className="text-[9px] font-syncopate uppercase tracking-[0.35em] text-luxury-gold mb-4">Product</h5>
                                <ul className="space-y-2.5">
                                    {[["Features", "#suite"], ["Themes", "#themes"], ["Pricing", "#cta"]].map(([l, h]) => (
                                        <li key={l}><a href={h} className="text-[10px] text-white/30 hover:text-white transition-colors font-syncopate uppercase tracking-wider">{l}</a></li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h5 className="text-[9px] font-syncopate uppercase tracking-[0.35em] text-luxury-gold mb-4">Connect</h5>
                                <ul className="space-y-2.5">
                                    {[["Instagram", "https://instagram.com/dockly.pro"], ["YouTube", "https://youtube.com/@dockly-pro"]].map(([l, h]) => (
                                        <li key={l}><a href={h} target="_blank" rel="noopener noreferrer" className="text-[10px] text-white/30 hover:text-white transition-colors font-syncopate uppercase tracking-wider">{l}</a></li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h5 className="text-[9px] font-syncopate uppercase tracking-[0.35em] text-luxury-gold mb-4">Legal</h5>
                                <ul className="space-y-2.5">
                                    {[["Privacy", "/protocol/privacy"], ["Terms", "/protocol/terms"]].map(([l, h]) => (
                                        <li key={l}><a href={h} className="text-[10px] text-white/30 hover:text-white transition-colors font-syncopate uppercase tracking-wider">{l}</a></li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-white/5 pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
                        <span className="text-[9px] font-syncopate text-white/18 uppercase tracking-[0.3em]">© 2026 DOCKLY.PRO — All Rights Reserved</span>
                        <span className="text-[9px] font-syncopate text-white/18 uppercase tracking-[0.3em]">Secure Platform</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}
