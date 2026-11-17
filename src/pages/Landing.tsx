import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
    ArrowRight, Activity, Shield, Radio, FileText, Cpu, Compass,
    Star, CheckCircle2, Lock, Download, Quote, ChevronRight,
    ChevronLeft, BarChart3, Music, Globe, Link2, Menu, X, Sparkles, Terminal
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

/* ─── Word cycle ─── */
const WORDS = ["Founders", "Engineers", "Creators", "Freelancers", "Builders"];

/* ─── Features (Supabase / Vercel style colors) ─── */
const FEATURES = [
    { id: "dossier", no: "01", label: "Resume & CV", icon: <FileText size={17} />, color: "#3ECF8E", headline: "Share Your CV Privately.", body: "Add your resume or CV behind a password so only the right people can see it. Anyone with the code can download it as a PDF in one click — perfect for job applications and client pitches.", pills: ["Password Protected", "PDF Download", "Work History", "Easy to Update"] },
    { id: "skills", no: "02", label: "Skills & Tools", icon: <Cpu size={17} />, color: "#06B6D4", headline: "Show Off What You Know.", body: "List all the tools, languages, and technologies you work with. Organise them by category, add how long you've been using each one, and let your skills do the talking.", pills: ["Sort by Category", "Years of Experience", "Tool Icons", "Skill Levels"] },
    { id: "milestones", no: "03", label: "Career Story", icon: <Compass size={17} />, color: "#A855F7", headline: "Tell Your Career Story.", body: "Add the big moments from your career on a clean, easy-to-read timeline — jobs, projects, achievements, launches. Visitors can see at a glance how far you've come.", pills: ["Timeline View", "Custom Categories", "Add Links", "Badges"] },
    { id: "endorsements", no: "04", label: "Reviews", icon: <Star size={17} />, color: "#F43F5E", headline: "Let Others Vouch For You.", body: "Collect reviews and recommendations from people you've worked with — clients, managers, and teammates. Star ratings and company logos help build trust before anyone even reaches out.", pills: ["Client Reviews", "Verified People", "Star Ratings", "Company Logos"] },
    { id: "analytics", no: "05", label: "Visitor Stats", icon: <BarChart3 size={17} />, color: "#10B981", headline: "See Who's Visiting Your Page.", body: "Get simple, real-time stats on who's viewing your profile, where they're coming from, and which links they click — all without tracking cookies or complex dashboards.", pills: ["No Tracking Cookies", "Live Visitors", "Where They Come From", "Link Clicks"] },
    { id: "music", no: "06", label: "Music", icon: <Music size={17} />, color: "#1DB954", headline: "Share Your Spotify Music.", body: "Connect your Spotify and show your favourite songs, latest tracks, or playlists right on your profile. Visitors can listen to a preview without leaving your page.", pills: ["Spotify Connected", "Audio Previews", "Top Tracks", "Playlists"] },
    { id: "stories", no: "07", label: "Stories", icon: <Radio size={17} />, color: "#3ECF8E", headline: "Post Updates That Disappear.", body: "Share quick updates, behind-the-scenes moments, or announcements as full-screen stories. They automatically disappear after 24 hours — so your page always stays fresh.", pills: ["Gone in 24 Hours", "Full Screen", "Photos & Videos", "Auto Delete"] },
];

/* ─── Testimonials ─── */
const TESTIMONIALS = [
    { quote: "I used to send people three different links. Now I send one and it has everything — my resume, reviews, skills, and more. It's genuinely the best tool for anyone building their personal brand.", name: "Rohit Gadekar", role: "Founder & CEO", company: "Eagle LABS", initial: "RG" },
    { quote: "Setting up my profile took less than 10 minutes and it looks completely professional. My clients actually comment on how clean and impressive it looks.", name: "Claire Bennett", role: "Chief Technology Officer", company: "Eagle LABS", initial: "CB" },
    { quote: "I love that I can password-protect my CV and only share it with the right people. The visitor stats are super useful too — I can see exactly who's checking out my page.", name: "Akhil Singh", role: "Director of Growth", company: "Eagle LABS", initial: "AS" },
];

/* ════════════════════════════════════════ */
export default function Landing() {
    const navigate = useNavigate();
    const [wordIdx, setWordIdx] = useState(0);
    const [activeF, setActiveF] = useState(0);
    const [tIdx, setTIdx] = useState(0);
    const [mobileNav, setMobileNav] = useState(false);
    useTitle("Dockly Pro — Your Personal Profile, All in One Link");

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
        <div className="min-h-screen bg-[#000000] text-zinc-100 font-plus selection:bg-[#3ECF8E]/30 selection:text-white overflow-x-hidden relative">

            {/* Supabase / Vercel Atmospheric Background Gradients */}
            <div className="fixed inset-0 pointer-events-none z-0">
                {/* Top center emerald spotlight */}
                <div className="absolute top-[-15%] left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-gradient-to-b from-[#3ECF8E]/[0.12] via-emerald-600/[0.04] to-transparent blur-[140px] rounded-full" />
                {/* Subtle side ambient accents */}
                <div className="absolute top-[35%] right-[-10%] w-[500px] h-[500px] bg-cyan-600/[0.04] blur-[150px] rounded-full" />
                <div className="absolute top-[65%] left-[-10%] w-[550px] h-[550px] bg-emerald-600/[0.03] blur-[160px] rounded-full" />
                {/* Vercel subtle grid lines */}
                <div
                    className="absolute inset-0 opacity-[0.035]"
                    style={{
                        backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
                        backgroundSize: '48px 48px'
                    }}
                />
            </div>

            {/* ══ MODERN FLOATING ISLAND NAVBAR ══ */}
            <header className="fixed top-3 sm:top-5 inset-x-0 z-50 px-4 pointer-events-none">
                <div className="max-w-5xl mx-auto bg-[#09090B]/85 border border-white/[0.08] shadow-[0_12px_40px_rgba(0,0,0,0.65)] backdrop-blur-2xl rounded-2xl sm:rounded-full px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between pointer-events-auto transition-all">

                    {/* Brand Logo with /dp.png */}
                    <button
                        onClick={() => navigate("/")}
                        className="group flex items-center gap-2.5 text-left focus:outline-none"
                    >
                        <img
                            src="/apple-touch-icon.png"
                            alt="Dockly Logo"
                            className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl object-contain shadow-md transition-transform group-hover:scale-105"
                        />
                        <span className="font-outfit font-extrabold text-base sm:text-lg tracking-tight text-white group-hover:text-[#3ECF8E] transition-colors">
                            dockly<span className="text-[#3ECF8E] font-black">.pro</span>
                        </span>
                        <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[9px] font-jetbrains text-[#3ECF8E] bg-[#3ECF8E]/10 border border-[#3ECF8E]/20">
                            v2.4
                        </span>
                    </button>

                    {/* Desktop nav — JetBrains Mono */}
                    <nav className="hidden md:flex items-center gap-1 font-jetbrains text-xs">
                        {[["Features", "#features"], ["Suite", "#suite"], ["Themes", "#themes"], ["Pricing", "#cta"]].map(([l, h]) => (
                            <a
                                key={l}
                                href={h}
                                className="px-3.5 py-1.5 text-zinc-400 hover:text-white rounded-full hover:bg-white/[0.05] transition-all"
                            >
                                {l}
                            </a>
                        ))}
                    </nav>

                    {/* Auth CTAs */}
                    <div className="hidden md:flex items-center gap-2 font-jetbrains">
                        <button
                            onClick={() => navigate("/auth")}
                            className="text-xs font-medium text-zinc-400 hover:text-white px-3.5 py-1.5 rounded-full hover:bg-white/[0.04] transition-all"
                        >
                            Sign In
                        </button>
                        <button
                            onClick={() => navigate("/auth")}
                            className="relative group flex items-center gap-1.5 bg-[#3ECF8E] hover:bg-[#34d399] text-black px-4 py-2 rounded-full text-xs font-bold shadow-md shadow-[#3ECF8E]/20 hover:shadow-[#3ECF8E]/35 hover:scale-[1.02] active:scale-[0.98] transition-all"
                        >
                            <span>Get Access</span>
                            <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                        </button>
                    </div>

                    {/* Mobile menu toggle */}
                    <button
                        onClick={() => setMobileNav(v => !v)}
                        className="md:hidden text-zinc-400 hover:text-white transition-colors p-1.5 rounded-xl hover:bg-white/[0.05]"
                    >
                        {mobileNav ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                {/* Mobile nav drawer */}
                <AnimatePresence>
                    {mobileNav && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="md:hidden mt-2 max-w-5xl mx-auto rounded-2xl border border-zinc-800 bg-[#09090B]/95 backdrop-blur-2xl px-6 py-5 shadow-2xl pointer-events-auto"
                        >
                            <div className="flex flex-col gap-2 font-jetbrains">
                                {[["Features", "#features"], ["Suite", "#suite"], ["Themes", "#themes"], ["Pricing", "#cta"]].map(([l, h]) => (
                                    <a
                                        key={l}
                                        href={h}
                                        onClick={() => setMobileNav(false)}
                                        className="text-xs text-zinc-400 hover:text-white py-2 border-b border-zinc-800/60 transition-colors"
                                    >
                                        {l}
                                    </a>
                                ))}
                                <div className="flex flex-col gap-2 pt-3">
                                    <button
                                        onClick={() => navigate("/auth")}
                                        className="w-full text-center text-xs font-medium text-zinc-300 border border-zinc-800 rounded-xl py-2.5 hover:text-white hover:bg-zinc-900 transition-all"
                                    >
                                        Sign In
                                    </button>
                                    <button
                                        onClick={() => navigate("/auth")}
                                        className="w-full text-center bg-[#3ECF8E] hover:bg-[#34d399] text-black text-xs font-bold rounded-xl py-2.5 shadow-md shadow-[#3ECF8E]/20 transition-all"
                                    >
                                        Get Access
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            {/* ══ HERO SECTION ══ */}
            <section className="relative z-10 flex flex-col items-center justify-center text-center px-4 sm:px-6 pt-32 sm:pt-44 lg:pt-52 pb-0 overflow-hidden">

                {/* Eyebrow badge — JetBrains Mono */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center gap-2.5 mb-8 px-4 py-1.5 border border-[#3ECF8E]/30 rounded-full bg-[#3ECF8E]/10 backdrop-blur-md shadow-sm font-jetbrains"
                >
                    <span className="w-2 h-2 rounded-full bg-[#3ECF8E] animate-pulse shadow-[0_0_8px_#3ECF8E]" />
                    <span className="text-xs font-medium tracking-wide text-[#3ECF8E]">Your Personal Link-in-Bio</span>
                </motion.div>

                {/* Headline — Vercel metallic gradient */}
                <div className="overflow-hidden w-full max-w-5xl">
                    <motion.h1
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                        className="font-outfit font-bold tracking-tight leading-[0.95] text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-100 to-zinc-400"
                        style={{ fontSize: "clamp(2.75rem, 8.5vw, 6.75rem)" }}
                    >
                        One Link for Every
                    </motion.h1>
                </div>

                {/* Animated cycling word — Fixed descender headroom to prevent 'g' bottom cut */}
                <div className="overflow-hidden w-full max-w-5xl flex items-center justify-center" style={{ minHeight: "clamp(3.8rem, 11vw, 8.5rem)", height: "clamp(3.8rem, 11vw, 8.5rem)" }}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={wordIdx}
                            initial={{ y: "100%", opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: "-100%", opacity: 0 }}
                            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                            className="font-outfit font-bold tracking-tight leading-[1.15] pb-3 sm:pb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#3ECF8E] via-[#2DD4BF] to-[#3ECF8E]"
                            style={{
                                fontSize: "clamp(2.75rem, 8.5vw, 6.75rem)",
                                filter: "drop-shadow(0 4px 30px rgba(62,207,142,0.3))"
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
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="mt-6 sm:mt-8 text-base sm:text-lg lg:text-xl text-zinc-400 leading-relaxed max-w-md sm:max-w-xl lg:max-w-2xl mx-auto font-normal"
                >
                    One link that has everything your resume, skills, career story, reviews, music, and more. Share it anywhere and let people know exactly who you are.
                </motion.p>

                {/* CTAs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45, duration: 0.6 }}
                    className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full sm:w-auto"
                >
                    <button
                        onClick={() => navigate("/auth")}
                        className="group w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#3ECF8E] hover:bg-[#34d399] text-black font-semibold text-sm px-8 py-4 rounded-2xl transition-all shadow-[0_0_35px_rgba(62,207,142,0.3)] hover:shadow-[0_0_55px_rgba(62,207,142,0.5)] hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <span>Get Started Free</span>
                        <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                    <a
                        href="#suite"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-sm font-jetbrains font-medium text-zinc-300 hover:text-white transition-all bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 px-8 py-4 rounded-2xl"
                    >
                        Explore Features
                    </a>
                </motion.div>

                {/* Social proof row */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                    className="mt-10 sm:mt-12 flex items-center justify-center gap-4 bg-zinc-900/50 border border-zinc-800 rounded-full px-5 py-2.5 backdrop-blur-sm"
                >
                    <div className="flex -space-x-2.5 font-jetbrains">
                        {["RG", "CB", "AS", "MK", "PL"].map((ini, i) => (
                            <div
                                key={i}
                                className="w-8 h-8 rounded-full border-2 border-[#000000] bg-zinc-800 text-[#3ECF8E] flex items-center justify-center text-[10px] font-bold shadow-md"
                            >
                                {ini}
                            </div>
                        ))}
                    </div>
                    <div className="text-left font-jetbrains">
                        <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} size={11} className="text-[#3ECF8E] fill-[#3ECF8E]" />
                            ))}
                        </div>
                        <p className="text-xs text-zinc-400 font-medium mt-0.5">Loved by 2,400+ people</p>
                    </div>
                </motion.div>

                {/* Browser mockup strip — Seamless card styling without marquee collision */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.75, duration: 0.8 }}
                    className="mt-14 sm:mt-20 w-full max-w-5xl mx-auto relative group mb-12 sm:mb-16"
                >
                    {/* Atmospheric Glow behind browser */}
                    <div className="absolute -inset-4 bg-gradient-to-t from-[#3ECF8E]/15 via-transparent to-transparent rounded-3xl blur-2xl opacity-60 group-hover:opacity-80 transition-opacity" />

                    <div className="relative rounded-2xl sm:rounded-3xl border border-zinc-800 overflow-hidden bg-[#0A0A0A] shadow-2xl backdrop-blur-xl">
                        {/* Browser Chrome Header */}
                        <div className="flex items-center gap-2 px-4 sm:px-6 py-3 border-b border-zinc-800 bg-zinc-900/50 font-jetbrains">
                            <div className="flex items-center gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-zinc-700" />
                                <div className="w-3 h-3 rounded-full bg-zinc-700" />
                                <div className="w-3 h-3 rounded-full bg-zinc-700" />
                            </div>
                            <div className="flex-1 mx-4 sm:mx-8 h-7 rounded-lg bg-black/60 border border-zinc-800 flex items-center justify-center px-4 max-w-md">
                                <span className="text-xs text-zinc-400 tracking-tight flex items-center gap-1.5">
                                    <Lock size={10} className="text-[#3ECF8E]" /> dockly.pro/rohit
                                </span>
                            </div>
                        </div>

                        {/* Image Preview */}
                        <div className="relative overflow-hidden">
                            <img
                                src="/deck.png"
                                alt="Profile Preview"
                                className="w-full object-cover object-top opacity-95 group-hover:scale-[1.005] transition-transform duration-700"
                                style={{ maxHeight: "clamp(220px, 36vw, 460px)" }}
                            />
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* ══ STATS ══ */}
            <section className="py-16 sm:py-24 px-4 sm:px-6 border-b border-zinc-800/80 relative z-10">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                        {[
                            { value: 2400, suffix: "+", label: "People Using It" },
                            { value: 48, suffix: "M+", label: "Profile Views" },
                            { value: 99, suffix: "%", label: "Always Online" },
                            { value: 7, suffix: "", label: "Built-in Features" },
                        ].map(({ value, suffix, label }) => (
                            <div
                                key={label}
                                className="relative rounded-2xl sm:rounded-3xl border border-zinc-800/80 bg-zinc-900/30 p-6 sm:p-8 text-center hover:border-zinc-700 hover:bg-zinc-900/60 transition-all group overflow-hidden"
                            >
                                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#3ECF8E]/40 to-transparent" />
                                <div className="text-3xl sm:text-4xl lg:text-5xl font-jetbrains font-bold text-white tracking-tight mb-2 group-hover:scale-105 transition-transform duration-300">
                                    <Counter end={value} suffix={suffix} />
                                </div>
                                <div className="text-xs sm:text-sm font-jetbrains text-zinc-400 tracking-wide">{label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══ FEATURE EXPLORER ══ */}
            <section id="suite" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-b border-zinc-800/80 relative z-10">
                <div className="max-w-7xl mx-auto">

                    {/* Section header */}
                    <div className="mb-12 sm:mb-16">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3ECF8E]/10 border border-[#3ECF8E]/20 text-xs font-jetbrains font-medium text-[#3ECF8E] mb-4">
                            <span>// What You Get</span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-outfit font-extrabold tracking-tight leading-[1.05]">
                                Seven Things Your<br />
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#3ECF8E] via-teal-200 to-[#3ECF8E]">
                                    Page Can Do.
                                </span>
                            </h2>
                            <p className="text-sm sm:text-base text-zinc-400 max-w-xs leading-relaxed font-normal">
                                Click any feature below to learn more about how it works on your profile.
                            </p>
                        </div>
                    </div>

                    {/* Tab selector & Detail container */}
                    <div id="features" className="flex flex-col lg:grid lg:grid-cols-[300px,1fr] xl:grid-cols-[340px,1fr] gap-6 lg:gap-8">

                        {/* Left: Scrollable tabs on mobile, vertical list on desktop */}
                        <div className="flex lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide lg:overflow-visible">
                            {FEATURES.map((f, i) => {
                                const isActive = activeF === i;
                                return (
                                    <button
                                        key={f.id}
                                        onClick={() => setActiveF(i)}
                                        className={`flex-shrink-0 lg:flex-shrink flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-left transition-all duration-300 relative ${isActive
                                            ? "bg-zinc-900 border border-zinc-700 shadow-lg"
                                            : "bg-zinc-950/60 hover:bg-zinc-900/60 border border-zinc-850 hover:border-zinc-800"
                                            }`}
                                    >
                                        <span
                                            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300"
                                            style={{
                                                backgroundColor: isActive ? `${f.color}22` : "rgba(255,255,255,0.03)",
                                                color: isActive ? f.color : "rgba(255,255,255,0.4)",
                                                border: `1px solid ${isActive ? f.color + "45" : "rgba(255,255,255,0.06)"}`,
                                                transform: isActive ? "scale(1.05)" : "scale(1)"
                                            }}
                                        >
                                            {f.icon}
                                        </span>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <span className={`text-sm font-semibold whitespace-nowrap transition-colors ${isActive ? "text-white" : "text-zinc-400"}`}>
                                                    {f.label}
                                                </span>
                                                <span className="text-[10px] font-jetbrains text-zinc-500 hidden sm:inline">{f.no}</span>
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Right: Detail panel */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeF}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                                className="rounded-3xl border border-zinc-800 bg-[#0A0A0C]/90 p-6 sm:p-10 lg:p-12 relative overflow-hidden min-h-[380px] sm:min-h-[440px] flex flex-col justify-between shadow-2xl backdrop-blur-xl"
                            >
                                {/* Feature color ambient glow */}
                                <div
                                    className="absolute -top-24 -right-24 w-80 h-80 rounded-full blur-[110px] pointer-events-none transition-colors duration-700 opacity-30"
                                    style={{ backgroundColor: feat.color }}
                                />
                                <div
                                    className="absolute top-0 inset-x-0 h-px transition-colors duration-500"
                                    style={{ background: `linear-gradient(90deg, transparent, ${feat.color}80, transparent)` }}
                                />

                                <div>
                                    {/* Tag — JetBrains Mono */}
                                    <div
                                        className="inline-flex items-center gap-2 mb-6 px-3.5 py-1.5 rounded-full border text-xs font-jetbrains font-medium tracking-wide"
                                        style={{ borderColor: `${feat.color}40`, backgroundColor: `${feat.color}15`, color: feat.color }}
                                    >
                                        {feat.icon}
                                        <span>{feat.label}</span>
                                    </div>

                                    {/* Headline */}
                                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-outfit font-extrabold tracking-tight text-white mb-4 sm:mb-6">
                                        {feat.headline}
                                    </h3>

                                    {/* Body */}
                                    <p className="text-base sm:text-lg text-zinc-400 leading-relaxed max-w-2xl font-normal">
                                        {feat.body}
                                    </p>
                                </div>

                                {/* Pills + Navigation Controls */}
                                <div className="mt-8 pt-8 border-t border-zinc-800 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                                    <div className="flex flex-wrap gap-2">
                                        {feat.pills.map(p => (
                                            <span
                                                key={p}
                                                className="px-3 py-1.5 rounded-xl border text-xs font-jetbrains"
                                                style={{ borderColor: `${feat.color}30`, backgroundColor: `${feat.color}10`, color: `${feat.color}` }}
                                            >
                                                {p}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-center font-jetbrains">
                                        <button
                                            onClick={() => setActiveF(p => (p - 1 + FEATURES.length) % FEATURES.length)}
                                            className="w-10 h-10 rounded-xl border border-zinc-800 bg-zinc-900/60 flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-700 hover:bg-zinc-800 transition-all"
                                            title="Previous Feature"
                                        >
                                            <ChevronLeft size={18} />
                                        </button>
                                        <span className="text-xs text-zinc-500 w-16 text-center">{feat.no} / 07</span>
                                        <button
                                            onClick={() => setActiveF(p => (p + 1) % FEATURES.length)}
                                            className="w-10 h-10 rounded-xl border border-zinc-800 bg-zinc-900/60 flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-700 hover:bg-zinc-800 transition-all"
                                            title="Next Feature"
                                        >
                                            <ChevronRight size={18} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </section>

            {/* ══ PROFILE CARD PREVIEW ══ */}
            <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-b border-zinc-800/80 relative overflow-hidden z-10">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center gap-12 lg:gap-16">

                        {/* Left: text */}
                        <div className="flex-1 min-w-0">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3ECF8E]/10 border border-[#3ECF8E]/20 text-xs font-jetbrains text-[#3ECF8E] mb-4">
                                <span>// See It In Action</span>
                            </div>
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-outfit font-extrabold tracking-tight leading-[1.05] mb-5">
                                Your Page,<br />
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#3ECF8E] via-teal-200 to-[#3ECF8E]">
                                    Always Ready.
                                </span>
                            </h2>
                            <p className="text-base sm:text-lg text-zinc-400 leading-relaxed mb-8 max-w-lg font-normal">
                                Your profile is always up to date and ready to share. Whether you're job hunting, pitching a client, or growing your audience — one link says it all.
                            </p>
                            <div className="space-y-3.5">
                                {[
                                    { icon: <Activity size={16} />, text: "Updates across all sections instantly" },
                                    { icon: <Shield size={16} />, text: "Secure & always online, 99% of the time" },
                                    { icon: <Globe size={16} />, text: "Use your own custom domain" },
                                ].map(({ icon, text }) => (
                                    <div key={text} className="flex items-center gap-3 text-sm text-zinc-300 font-medium">
                                        <span className="w-8 h-8 rounded-lg bg-[#3ECF8E]/10 border border-[#3ECF8E]/20 flex items-center justify-center text-[#3ECF8E] shrink-0">
                                            {icon}
                                        </span>
                                        <span>{text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right: Profile card preview */}
                        <div className="w-full lg:w-auto flex justify-center lg:justify-end">
                            <div className="relative w-full max-w-sm">
                                {/* Ambient glow */}
                                <div className="absolute -inset-6 bg-gradient-to-br from-[#3ECF8E]/15 to-teal-500/10 blur-[80px] rounded-full pointer-events-none" />

                                <div className="relative rounded-3xl border border-zinc-800 bg-[#0A0A0C] p-6 sm:p-8 backdrop-blur-2xl shadow-2xl overflow-hidden">
                                    {/* Top specular border */}
                                    <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#3ECF8E]/50 to-transparent" />

                                    {/* Avatar & Header */}
                                    <div className="flex flex-col items-center text-center mb-6">
                                        <div className="relative mb-3.5">
                                            <div className="w-20 h-20 rounded-full border-2 border-[#3ECF8E]/60 bg-gradient-to-br from-[#3ECF8E]/20 via-black to-black flex items-center justify-center text-2xl font-outfit font-black text-[#3ECF8E] shadow-xl shadow-[#3ECF8E]/20">
                                                HQ
                                            </div>
                                            <div className="absolute bottom-0 right-0 w-6 h-6 bg-[#3ECF8E] rounded-full border-2 border-[#0A0A0C] flex items-center justify-center shadow-md">
                                                <CheckCircle2 size={12} className="text-black" />
                                            </div>
                                        </div>
                                        <h3 className="font-outfit font-bold text-base text-white mb-0.5">Harrison Quill</h3>
                                        <p className="text-xs text-[#3ECF8E] font-jetbrains font-medium tracking-wide">Founder & Systems Architect</p>
                                        <p className="text-xs text-zinc-400 mt-2 max-w-[220px] leading-relaxed">Building tools that help teams move faster.</p>
                                    </div>

                                    {/* Stats */}
                                    <div className="grid grid-cols-3 gap-2.5 mb-5 font-jetbrains">
                                        {[["48K", "Visitors"], ["3.2K", "Clicks"], ["94%", "Intent"]].map(([n, l]) => (
                                            <div key={l} className="text-center py-2.5 rounded-xl bg-zinc-900 border border-zinc-800">
                                                <div className="text-sm font-bold text-white">{n}</div>
                                                <div className="text-[10px] text-zinc-400 font-medium mt-0.5">{l}</div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Chips */}
                                    <div className="flex flex-wrap gap-1.5 justify-center mb-5 font-jetbrains">
                                        {[
                                            { icon: <FileText size={11} />, label: "CV", col: "#3ECF8E" },
                                            { icon: <Cpu size={11} />, label: "Tech", col: "#06B6D4" },
                                            { icon: <Star size={11} />, label: "Reviews", col: "#F43F5E" },
                                            { icon: <SiSpotify size={11} />, label: "Music", col: "#1DB954" }
                                        ].map(({ icon, label, col }) => (
                                            <span
                                                key={label}
                                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border"
                                                style={{ borderColor: `${col}35`, color: col, backgroundColor: `${col}12` }}
                                            >
                                                {icon} <span>{label}</span>
                                            </span>
                                        ))}
                                    </div>

                                    {/* Buttons */}
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center justify-between p-3 rounded-xl bg-[#3ECF8E]/15 border border-[#3ECF8E]/30 hover:bg-[#3ECF8E]/20 transition-colors cursor-pointer">
                                            <div className="flex items-center gap-2.5">
                                                <Lock size={13} className="text-[#3ECF8E]" />
                                                <span className="text-xs font-semibold text-white font-jetbrains">View Private CV</span>
                                            </div>
                                            <ArrowRight size={13} className="text-[#3ECF8E]" />
                                        </div>
                                        <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-850 transition-colors cursor-pointer">
                                            <div className="flex items-center gap-2.5">
                                                <Download size={13} className="text-zinc-400" />
                                                <span className="text-xs font-medium text-zinc-300 font-jetbrains">Download Brand Card</span>
                                            </div>
                                            <ArrowRight size={13} className="text-zinc-500" />
                                        </div>
                                    </div>
                                </div>

                                {/* Floating badges */}
                                <motion.div
                                    animate={{ y: [0, -6, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute -top-5 -right-4 sm:-right-8 bg-[#111216] border border-zinc-800 rounded-2xl px-4 py-2.5 flex items-center gap-2.5 shadow-2xl backdrop-blur-md font-jetbrains"
                                >
                                    <div className="w-2 h-2 rounded-full bg-[#3ECF8E] animate-pulse" />
                                    <div>
                                        <div className="text-[10px] text-zinc-400 font-medium">Live Now</div>
                                        <div className="text-xs font-bold text-white">127 Visitors</div>
                                    </div>
                                </motion.div>

                                <motion.div
                                    animate={{ y: [0, 6, 0] }}
                                    transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
                                    className="absolute -bottom-5 -left-4 sm:-left-8 bg-[#111216] border border-zinc-800 rounded-2xl px-4 py-2.5 flex items-center gap-2.5 shadow-2xl backdrop-blur-md font-jetbrains"
                                >
                                    <Star size={13} className="text-[#3ECF8E] fill-[#3ECF8E]" />
                                    <div>
                                        <div className="text-[10px] text-zinc-400 font-medium">Endorsed</div>
                                        <div className="text-xs font-bold text-white">38 Reviews</div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ══ THEMES ══ */}
            <section id="themes" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-b border-zinc-800/80 relative z-10">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12 sm:mb-16">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3ECF8E]/10 border border-[#3ECF8E]/20 text-xs font-jetbrains font-medium text-[#3ECF8E] mb-3">
                            <span>// Pick Your Look</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-outfit font-extrabold tracking-tight">
                            Beautiful <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#3ECF8E] via-teal-200 to-[#3ECF8E]">Themes</span>
                        </h2>
                        <p className="mt-3.5 text-base text-zinc-400 max-w-sm mx-auto leading-relaxed">
                            Choose a look that matches your style. Switch themes any time with one click.
                        </p>
                    </div>

                    {/* Theme swatches */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 mb-10 font-jetbrains">
                        {[
                            { name: "EMERALD", col: "#3ECF8E", desc: "Supabase Green" },
                            { name: "OBSIDIAN", col: "#6366F1", desc: "Deep Indigo" },
                            { name: "CYAN", col: "#06B6D4", desc: "Electric Cyan" },
                            { name: "AMBER", col: "#F59E0B", desc: "Warm Amber" },
                            { name: "MONOCHROME", col: "#F4F4F5", desc: "Vercel Minimal" },
                            { name: "CRIMSON", col: "#EF4444", desc: "Vibrant Red" },
                        ].map(({ name, col, desc }) => (
                            <div
                                key={name}
                                className="flex flex-col items-center gap-3 p-5 rounded-2xl border border-zinc-800 bg-zinc-950/60 hover:bg-zinc-900 hover:border-zinc-700 transition-all cursor-pointer group"
                            >
                                <div
                                    className="w-10 h-10 rounded-full shadow-lg group-hover:scale-110 transition-transform duration-300 ring-2 ring-white/10"
                                    style={{ backgroundColor: col, boxShadow: `0 6px 24px ${col}50` }}
                                />
                                <div className="text-center">
                                    <span className="text-xs font-bold text-white tracking-wide block">{name}</span>
                                    <span className="text-[10px] text-zinc-400 mt-0.5 block">{desc}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center">
                        <button
                            onClick={() => navigate("/auth")}
                            className="group inline-flex items-center gap-2 text-xs font-jetbrains font-semibold text-[#3ECF8E] hover:text-white transition-all border border-[#3ECF8E]/30 hover:border-zinc-700 px-6 py-3.5 rounded-xl hover:bg-zinc-900"
                        >
                            <span>View All Themes</span>
                            <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </section>

            {/* ══ TESTIMONIAL ══ */}
            <section className="py-20 sm:py-28 px-4 sm:px-6 border-b border-zinc-800/80 relative overflow-hidden z-10">
                <div className="max-w-3xl mx-auto relative text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3ECF8E]/10 border border-[#3ECF8E]/20 text-xs font-jetbrains font-medium text-[#3ECF8E] mb-10">
                        <span>// What People Say</span>
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={tIdx}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.4 }}
                            className="text-center"
                        >
                            <Quote size={44} className="text-[#3ECF8E]/20 mx-auto mb-6" />
                            <p className="text-xl sm:text-2xl md:text-3xl font-outfit font-bold tracking-tight leading-snug text-white mb-8 sm:mb-10">
                                "{TESTIMONIALS[tIdx].quote}"
                            </p>
                            <div className="flex items-center justify-center gap-3.5">
                                <div className="w-12 h-12 rounded-full border-2 border-[#3ECF8E]/40 bg-zinc-900 flex items-center justify-center font-jetbrains font-bold text-[#3ECF8E] text-sm shadow-md">
                                    {TESTIMONIALS[tIdx].initial}
                                </div>
                                <div className="text-left font-jetbrains">
                                    <div className="font-outfit font-bold text-sm text-white">{TESTIMONIALS[tIdx].name}</div>
                                    <div className="text-xs text-zinc-400 mt-0.5">{TESTIMONIALS[tIdx].role} · {TESTIMONIALS[tIdx].company}</div>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Pagination Dots */}
                    <div className="flex items-center justify-center gap-2 mt-10">
                        {TESTIMONIALS.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setTIdx(i)}
                                className={`rounded-full transition-all duration-300 ${i === tIdx ? "w-8 h-1.5 bg-[#3ECF8E]" : "w-2 h-1.5 bg-zinc-800 hover:bg-zinc-700"}`}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* ══ FEATURES GRID (Immediate render, no scroll pop-in) ══ */}
            <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-b border-zinc-800/80 relative z-10">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12 sm:mb-16">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3ECF8E]/10 border border-[#3ECF8E]/20 text-xs font-jetbrains font-medium text-[#3ECF8E] mb-3">
                            <span>// Everything Included</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-outfit font-extrabold tracking-tight">
                            All of This in <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#3ECF8E] via-teal-200 to-[#3ECF8E]">One Link</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                        {[
                            { icon: <FileText size={20} />, title: "Resume & CV", desc: "Password-protected resume with one-click PDF download.", col: "#3ECF8E" },
                            { icon: <Cpu size={20} />, title: "Skills & Tools", desc: "Show your tech stack, tools, and how long you've used them.", col: "#06B6D4" },
                            { icon: <Compass size={20} />, title: "Career Story", desc: "A timeline of your jobs, projects, and big achievements.", col: "#A855F7" },
                            { icon: <Star size={20} />, title: "Reviews", desc: "Recommendations from clients and colleagues you've worked with.", col: "#F43F5E" },
                            { icon: <Activity size={20} />, title: "Visitor Stats", desc: "See who's visiting your page and what they're clicking on.", col: "#10B981" },
                            { icon: <SiSpotify size={20} />, title: "Music", desc: "Show your Spotify tracks so visitors can listen right on your page.", col: "#1DB954" },
                            { icon: <Radio size={20} />, title: "Stories", desc: "Quick updates and moments that automatically disappear after 24 hours.", col: "#3ECF8E" },
                            { icon: <Link2 size={20} />, title: "Your Links", desc: "All your important links in one clean, organised place.", col: "#6366F1" },
                            { icon: <Globe size={20} />, title: "Brand Card", desc: "A shareable card with a QR code that links to your profile.", col: "#EC4899" },
                        ].map(({ icon, title, desc, col }) => (
                            <div
                                key={title}
                                className="group flex items-start gap-4 p-5 sm:p-6 rounded-2xl border border-zinc-800 bg-zinc-950/60 hover:bg-zinc-900 hover:border-zinc-700 transition-all duration-300"
                            >
                                <div
                                    className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300"
                                    style={{ backgroundColor: `${col}18`, color: col, border: `1px solid ${col}30` }}
                                >
                                    {icon}
                                </div>
                                <div>
                                    <h4 className="font-outfit font-bold text-sm text-white mb-1">{title}</h4>
                                    <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-normal">{desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══ CTA SECTION (Immediate render, no scroll pop-in) ══ */}
            <section id="cta" className="py-24 sm:py-36 px-4 sm:px-6 relative overflow-hidden z-10">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(800px,90vw)] h-[min(500px,70vw)] bg-gradient-to-r from-[#3ECF8E]/15 to-emerald-600/10 blur-[140px] rounded-full pointer-events-none" />

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <div>
                        <div className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 border border-[#3ECF8E]/30 rounded-full bg-[#3ECF8E]/10 backdrop-blur-md font-jetbrains">
                            <Shield size={13} className="text-[#3ECF8E]" />
                            <span className="text-xs font-medium text-[#3ECF8E] tracking-wide">Free to get started</span>
                        </div>

                        <h2 className="font-outfit font-black tracking-tight leading-[0.95] mb-6 sm:mb-8 text-white" style={{ fontSize: "clamp(2.75rem, 9vw, 6.5rem)" }}>
                            Your Profile,<br />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#3ECF8E] via-teal-200 to-[#3ECF8E]">
                                Starts Here.
                            </span>
                        </h2>

                        <p className="text-base sm:text-lg lg:text-xl text-zinc-400 max-w-xl mx-auto leading-relaxed mb-10 sm:mb-12 font-normal">
                            Stop sending people to five different places. Put everything about you in one link — your resume, skills, story, reviews, and more.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
                            <button
                                onClick={() => navigate("/auth")}
                                className="group w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#3ECF8E] hover:bg-[#34d399] text-black font-bold text-sm px-9 py-4 rounded-2xl transition-all shadow-[0_0_40px_rgba(62,207,142,0.35)] hover:shadow-[0_0_60px_rgba(62,207,142,0.55)] hover:scale-[1.02] active:scale-[0.98]"
                            >
                                <span>Get Started Free</span>
                                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button
                                onClick={() => navigate("/auth")}
                                className="w-full sm:w-auto text-sm font-jetbrains font-medium text-zinc-300 hover:text-white transition-all border border-zinc-800 hover:border-zinc-700 bg-zinc-900/80 hover:bg-zinc-800 px-8 py-4 rounded-2xl"
                            >
                                Sign In Instead
                            </button>
                        </div>

                        <div className="mt-12 sm:mt-14 flex flex-wrap items-center justify-center gap-6 sm:gap-8 font-jetbrains">
                            {["Free to get started", "No tracking cookies", "Works on all devices", "Always up to date"].map(t => (
                                <span key={t} className="flex items-center gap-2 text-xs font-medium text-zinc-400">
                                    <CheckCircle2 size={13} className="text-[#3ECF8E]" />
                                    {t}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ══ FOOTER ══ */}
            <footer className="border-t border-zinc-800/80 bg-[#000000] px-4 sm:px-6 lg:px-8 py-12 sm:py-16 relative z-10">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-8 sm:gap-10 mb-12">
                        <div className="text-center sm:text-left">
                            <div
                                className="font-outfit font-extrabold text-xl tracking-tight mb-2 cursor-pointer text-white flex items-center justify-center sm:justify-start gap-2.5"
                                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                            >
                                <img src="/apple-touch-icon.png" alt="Dockly" className="w-6 h-6 rounded-lg object-contain shadow-sm" />
                                <span>dockly<span className="text-[#3ECF8E]">.pro</span></span>
                            </div>
                            <p className="text-xs text-zinc-400 font-jetbrains">Your personal link-in-bio</p>
                            <p className="text-xs text-zinc-600 font-jetbrains mt-2">Product by Eagle LABS</p>
                        </div>

                        <div className="grid grid-cols-3 gap-8 sm:gap-12 text-center sm:text-left font-jetbrains">
                            <div>
                                <h5 className="text-xs font-semibold text-[#3ECF8E] uppercase tracking-wider mb-4">Product</h5>
                                <ul className="space-y-2.5">
                                    {[["Features", "#suite"], ["Themes", "#themes"], ["Pricing", "#cta"]].map(([l, h]) => (
                                        <li key={l}>
                                            <a href={h} className="text-xs text-zinc-400 hover:text-white transition-colors">
                                                {l}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h5 className="text-xs font-semibold text-[#3ECF8E] uppercase tracking-wider mb-4">Connect</h5>
                                <ul className="space-y-2.5">
                                    {[["Instagram", "https://instagram.com/dockly.pro"], ["YouTube", "https://youtube.com/@dockly-pro"]].map(([l, h]) => (
                                        <li key={l}>
                                            <a href={h} target="_blank" rel="noopener noreferrer" className="text-xs text-zinc-400 hover:text-white transition-colors">
                                                {l}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h5 className="text-xs font-semibold text-[#3ECF8E] uppercase tracking-wider mb-4">Legal</h5>
                                <ul className="space-y-2.5">
                                    {[["Privacy", "/protocol/privacy"], ["Terms", "/protocol/terms"]].map(([l, h]) => (
                                        <li key={l}>
                                            <a href={h} className="text-xs text-zinc-400 hover:text-white transition-colors">
                                                {l}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-zinc-800/80 pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-500 font-jetbrains">
                        <span>© 2026 DOCKLY.PRO — All Rights Reserved</span>
                        <span className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#3ECF8E]" />
                            Secure Platform
                        </span>
                    </div>
                </div>
            </footer>
        </div>
    );
}
