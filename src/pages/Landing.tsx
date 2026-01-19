import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ArrowRight, Sparkles, Zap, Activity, Shield, Radio, Quote, Briefcase } from "lucide-react";
import { SiSpotify } from "react-icons/si";
import { useNavigate } from "react-router-dom";
import { useTitle } from "@/hooks/useTitle";
import { cn } from "@/lib/utils";

const features = [
    {
        id: 'analytics',
        tag: 'Dossier Insights',
        icon: <Activity size={16} />,
        tagBg: 'bg-emerald-500/10',
        tagBorder: 'border-emerald-500/20',
        tagText: 'text-emerald-500',
        title: 'POWERFUL',
        titleAccent: 'INSIGHTS',
        color: '#10B981',
        description: 'Understand your audience with detailed analytics. Track profile views, link clicks, and see exactly what content is performing best.',
        bullets: [
            { title: "Traffic Sources", desc: "See where your visitors are coming from." },
            { title: "Link Performance", desc: "Identify your most popular content and links." },
            { title: "Real-time Data", desc: "Watch your stats update live as fans interact." }
        ],
        visualIcon: Activity,
        glowColor: 'bg-emerald-500/5'
    },
    {
        id: 'music',
        tag: 'Sonic Identity',
        icon: <SiSpotify size={16} />,
        tagBg: 'bg-[#1DB954]/10',
        tagBorder: 'border-[#1DB954]/20',
        tagText: 'text-[#1DB954]',
        title: 'SHARE YOUR',
        titleAccent: 'MUSIC',
        color: '#1DB954',
        description: 'Showcase your top tracks directly from Spotify. Let visitors listen to your music without leaving your profile.',
        bullets: [
            { title: "Top 5 Tracks", desc: "Curate your favorite songs or releases." },
            { title: "Instant Playback", desc: "Visitors can listen to previews instantly." },
            { title: "Artist Link", desc: "One click to your full Spotify artist profile." }
        ],
        visualIcon: Radio,
        glowColor: 'bg-[#1DB954]/5'
    },
    {
        id: 'stories',
        tag: 'Live Transmission',
        icon: <Radio size={16} />,
        tagBg: 'bg-luxury-gold/10',
        tagBorder: 'border-luxury-gold/20',
        tagText: 'text-luxury-gold',
        title: 'STORIES',
        titleAccent: 'FEED',
        color: '#FFFFFF',
        description: 'Keep your audience engaged with 24-hour ephemeral stories. Share photos, videos, and moments directly on your profile.',
        bullets: [
            { title: "24-Hour Stories", desc: "Content expires automatically, keeping your page fresh." },
            { title: "Photo & Video", desc: "Support for high-res images and vertical video." },
            { title: "Immersive Player", desc: "Full-screen cinematic viewing experience." }
        ],
        visualIcon: Radio,
        glowColor: 'bg-luxury-gold/5'
    }
];

const Landing = () => {
    const [activeFeature, setActiveFeature] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setActiveFeature((prev) => (prev + 1) % features.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const FeatureShowcase = () => {
        const feature = features[activeFeature];
        const VisualIcon = feature.visualIcon;

        return (
            <div className="relative min-h-[600px] flex flex-col justify-center">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeFeature}
                        initial={{ opacity: 0, scale: 0.98, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 1.02, y: -20 }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center"
                    >
                        {/* Visual Side */}
                        <div className="relative aspect-square order-2 lg:order-1">
                            <div className={cn("absolute inset-0 blur-[120px] rounded-full transition-colors duration-1000", feature.glowColor)} />
                            <Card className="h-full border-white/10 bg-black/40 flex items-center justify-center p-0 overflow-hidden group">
                                <motion.div
                                    initial={{ opacity: 0, rotate: -10, scale: 0.8 }}
                                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                                    transition={{ duration: 1, delay: 0.2 }}
                                >
                                    <VisualIcon size={160} className="opacity-20 transition-all duration-1000 scale-100 group-hover:scale-110" style={{ color: feature.color }} />
                                </motion.div>
                            </Card>
                        </div>

                        {/* Content Side */}
                        <div className="order-1 lg:order-2 flex flex-col justify-center items-start text-left">
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                                className={cn("inline-flex items-center gap-3 px-4 py-1.5 rounded-full mb-8 border backdrop-blur-md", feature.tagBg, feature.tagBorder, feature.tagText)}
                            >
                                {feature.icon}
                                <span className="text-[9px] font-syncopate uppercase tracking-[0.3em] font-bold">{feature.tag}</span>
                            </motion.div>

                            <motion.h3
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                                className="text-4xl sm:text-5xl md:text-6xl font-syncopate font-bold uppercase tracking-tighter mb-8 leading-[0.95] text-white"
                            >
                                {feature.title}<br />
                                <span style={{ color: feature.color }}>{feature.titleAccent}</span>
                            </motion.h3>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                                className="text-xl text-white/40 font-plus mb-10 leading-relaxed max-w-xl"
                            >
                                {feature.description}
                            </motion.p>

                            <div className="space-y-6">
                                {feature.bullets.map((item, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.4 + (i * 0.1) }}
                                        className="flex items-start gap-4"
                                    >
                                        <div className="w-1.5 h-1.5 rounded-full mt-2 shrink-0 shadow-[0_0_8px_currentColor]" style={{ backgroundColor: feature.color, color: feature.color }} />
                                        <div>
                                            <div className="text-sm font-syncopate font-bold text-white uppercase tracking-widest mb-1">{item.title}</div>
                                            <div className="text-xs text-white/30 font-plus">{item.desc}</div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Navigation Controls */}
                <div className="mt-16 flex items-center justify-center gap-4">
                    {features.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setActiveFeature(idx)}
                            className="group relative py-4 px-2"
                        >
                            <div className={cn(
                                "h-1 transition-all duration-500 rounded-full",
                                activeFeature === idx ? "w-12 bg-luxury-gold" : "w-6 bg-white/10 hover:bg-white/30"
                            )} />
                            {activeFeature === idx && (
                                <motion.div
                                    layoutId="nav-glow"
                                    className="absolute inset-0 bg-luxury-gold/20 blur-xl rounded-full -z-10"
                                />
                            )}
                        </button>
                    ))}
                </div>
            </div>
        );
    };

    useTitle("Premium Creator Presence | Docked");
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-black overflow-hidden selection:bg-luxury-gold/30">
            {/* Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center p-6">
                <motion.div
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="glass rounded-full px-8 py-3 flex items-center gap-12 border-white/5"
                >
                    <div className="text-2xl font-syncopate font-bold tracking-tighter cursor-pointer" onClick={() => navigate('/')}>
                        DOCKED<span className="text-luxury-gold">.</span>PRO
                    </div>
                    <div className="hidden md:flex items-center gap-8 font-plus text-sm uppercase tracking-widest text-white/60">
                        <a href="#features" className="hover:text-white transition-colors">Features</a>
                        <a href="#analytics" className="hover:text-white transition-colors">Analytics</a>
                        <a href="#monetization" className="hover:text-white transition-colors">Monetization</a>
                    </div>
                    <Button
                        variant="luxury"
                        size="sm"
                        className="hidden md:flex"
                        onClick={() => navigate('/auth')}
                    >
                        Sign In
                    </Button>
                </motion.div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-40 pb-20 px-6 flex flex-col items-center text-center">
                {/* Background Gradients */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-luxury-gold/5 blur-[120px] rounded-full -z-10" />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border-luxury-gold/20 text-luxury-gold text-xs font-syncopate uppercase tracking-[0.2em]"
                >
                    Everything you rely on, in one link
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-4xl sm:text-6xl md:text-8xl font-syncopate font-bold tracking-tighter mb-8 max-w-5xl leading-[1.1] px-4"
                >
                    ONE LINK FOR <br />
                    <span className="text-gradient">ALL YOUR CONTENT</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-lg md:text-2xl text-white/40 font-plus max-w-3xl mb-12 px-4"
                >
                    The most powerful link-in-bio for creators. Share your links, music,
                    products, and daily stories in one stunning, custom profile.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="flex flex-col md:flex-row gap-4"
                >
                    <Button variant="luxury" size="lg" className="group" onClick={() => navigate('/auth')}>
                        Get Started Free <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </Button>
                    <Button variant="outline" size="lg" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>
                        See Features
                    </Button>
                </motion.div>

                {/* Dashboard Preview */}
                <motion.div
                    id="dashboard"
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.8 }}
                    className="mt-20 w-full max-w-6xl mx-auto glass rounded-3xl p-4 border-white/5 shadow-2xl shadow-luxury-gold/5"
                >
                    <div className="bg-luxury-obsidian rounded-2xl overflow-hidden relative border border-white/5">
                        <div className="absolute inset-0 bg-gradient-to-tr from-luxury-gold/10 via-transparent to-transparent" />
                        <img
                            src="/deck.png"
                            alt="Dashboard Preview"
                            className="w-full h-full object-cover "
                        />
                    </div>
                </motion.div>
            </section>

            {/* Deep Feature Breakdown */}
            {/* Dynamic Feature Showcase */}
            <section id="features" className="py-24 md:py-40 relative overflow-hidden px-6">
                <div className="max-w-7xl mx-auto">
                    <FeatureShowcase />
                </div>
            </section>

            {/* Monetization & Store Section */}
            <section id="monetization" className="py-24 px-6 bg-white/[0.02] border-y border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-luxury-gold/5 blur-[150px] rounded-full -z-10" />

                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-24">
                        <h2 className="text-xs font-syncopate text-luxury-gold uppercase tracking-[0.5em] mb-4">Earn Revenue</h2>
                        <h3 className="text-3xl sm:text-4xl md:text-5xl font-syncopate font-bold uppercase tracking-tighter">MONETIZE YOUR<br />AUDIENCE</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
                        <div className="space-y-12">
                            <div className="group">
                                <div className="flex items-center gap-6 mb-6">
                                    <div className="w-14 h-14 rounded-[1.5rem] bg-luxury-gold/10 flex items-center justify-center text-luxury-gold border border-luxury-gold/20 group-hover:scale-110 transition-all duration-500 shadow-[0_0_20px_rgba(212,175,55,0.1)]">
                                        <Zap size={24} />
                                    </div>
                                    <h4 className="text-2xl font-syncopate font-bold uppercase tracking-tight text-white">Curated Products</h4>
                                </div>
                                <p className="text-lg text-white/30 font-plus leading-relaxed">
                                    Recommend your favorite gear, books, or products. Add direct purchase links
                                    to redirect fans to external stores.
                                </p>
                            </div>

                            <div className="group">
                                <div className="flex items-center gap-6 mb-6">
                                    <div className="w-14 h-14 rounded-[1.5rem] bg-white/5 flex items-center justify-center text-white border border-white/5 group-hover:scale-110 transition-all duration-500 group-hover:text-[#1DB954] group-hover:border-[#1DB954]/20">
                                        <Activity size={24} />
                                    </div>
                                    <h4 className="text-2xl font-syncopate font-bold uppercase tracking-tight text-white">Newsletter Growth</h4>
                                </div>
                                <p className="text-lg text-white/30 font-plus leading-relaxed">
                                    Capture emails and build your own list. Let fans subscribe to your newsletter
                                    directly from your profile page.
                                </p>
                            </div>

                            <div className="group">
                                <div className="flex items-center gap-6 mb-6">
                                    <div className="w-14 h-14 rounded-[1.5rem] bg-white/5 flex items-center justify-center text-white border border-white/5 group-hover:scale-110 transition-all duration-500 group-hover:text-luxury-gold group-hover:border-luxury-gold/20">
                                        <Shield size={24} />
                                    </div>
                                    <h4 className="text-2xl font-syncopate font-bold uppercase tracking-tight text-white">Verified Links</h4>
                                </div>
                                <p className="text-lg text-white/30 font-plus leading-relaxed">
                                    Build trust with your audience. Verified outgoing links ensure your fans
                                    can click and shop with confidence.
                                </p>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 bg-luxury-gold/10 blur-[100px] rounded-full" />
                            <Card className="relative overflow-hidden p-0 border-white/10 bg-black/60 aspect-square flex items-center justify-center">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-0 opacity-10"
                                    style={{
                                        background: 'radial-gradient(circle at center, #D4AF37 0%, transparent 70%)',
                                        maskImage: 'url("https://www.transparenttextures.com/patterns/carbon-fibre.png")'
                                    }}
                                />
                                <div className="relative z-10 p-12 text-center">
                                    <div className="w-32 h-32 mx-auto mb-8 bg-luxury-gold/10 rounded-[3rem] border border-luxury-gold/30 flex items-center justify-center">
                                        <Zap size={64} className="text-luxury-gold animate-pulse" />
                                    </div>
                                    <div className="text-[10px] font-syncopate text-luxury-gold uppercase tracking-[0.5em] mb-4">Your Store</div>
                                    <div className="text-4xl font-syncopate font-bold text-white tracking-tighter">OPEN FOR<br />BUSINESS</div>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>



            {/* Monetization & Store Section */}


            {/* Monetization Section - was here, moved above music/stories? Or just order: Analytics -> Monetization -> Music/Stories. Let's do that from the main reorder plan */}

            {/* Voices of Authority: Testimonials */}
            <section className="py-32 px-6 relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-luxury-gold/5 blur-[120px] rounded-full pointer-events-none" />

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="text-center mb-24">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-3 px-4 py-2 bg-luxury-gold/10 border border-luxury-gold/20 rounded-full mb-6"
                        >
                            <span className="text-[10px] font-syncopate uppercase tracking-[0.2em] text-luxury-gold">Voices of Authority</span>
                        </motion.div>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl md:text-6xl font-syncopate font-bold uppercase tracking-tighter mb-8 max-w-5xl mx-auto"
                        >
                            From <span className="text-gradient">CREATORS</span> TO <span className="text-gradient">CREATORS</span>
                        </motion.h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                quote: "The architectural precision of platform has transformed my digital presence from a standard portfolio into a high authority archival estate.",
                                author: "Rohit Gadekar",
                                role: "Founder & CEO / Eagle LABS",
                                profile: "docked.pro/rohit",
                                delay: 0.2
                            },

                            {
                                quote: "Finally, a platform that understands that identity is an asset, not just a profile. The Citadel security architecture is absolutely unmatched.",
                                author: "Claire Bennett",
                                role: "Chief Technology Officer / Eagle LABS",
                                profile: "docked.pro/claire",
                                delay: 0.6
                            }, {
                                quote: "100ms delivery combined with the Sovereign Vault protocol gives me complete confidence in my global digital footprint. Everything feels fast, secure.",
                                author: "Akhil Singh",
                                role: "Director of Growth & Engineering / Eagle LABS",
                                delay: 0.4
                            }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: item.delay, duration: 0.8 }}
                            >
                                <Card className="h-full p-10 bg-white/[0.02] border-white/5 hover:border-luxury-gold/20 transition-all duration-700 group relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                                        <Quote size={80} className="text-luxury-gold rotate-180" />
                                    </div>

                                    <div className="relative z-10 space-y-8">
                                        <div className="w-12 h-12 rounded-2xl bg-luxury-gold/10 flex items-center justify-center text-luxury-gold border border-luxury-gold/20">
                                            <Quote size={20} />
                                        </div>

                                        <p className="text-xl text-white/60 font-plus leading-relaxed italic">
                                            {item.quote}
                                        </p>

                                        <div className="pt-8 border-t border-white/5">
                                            <h4 className="text-lg font-syncopate font-bold text-white uppercase tracking-tight">{item.author}</h4>
                                            <p className="text-[10px] font-syncopate text-luxury-gold uppercase tracking-[0.3em] mt-1">{item.role}</p>
                                            {item.profile && (
                                                <a
                                                    href={`https://${item.profile}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="block text-[10px] font-plus text-white/30 tracking-widest mt-2 hover:text-white transition-colors cursor-pointer"
                                                >
                                                    {item.profile}
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Themes Preview Section */}
            <section id="themes" className="py-32 px-6 relative">
                <div className="max-w-7xl mx-auto text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-3 px-4 py-2 bg-luxury-gold/10 border border-luxury-gold/20 rounded-full mb-8"
                    >
                        <Sparkles size={16} className="text-luxury-gold" />
                        <span className="text-[10px] font-syncopate uppercase tracking-[0.2em] text-luxury-gold">Visual Mastery</span>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-syncopate font-bold uppercase tracking-tighter mb-6"
                    >
                        Curated <span className="text-gradient">Aesthetics</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-white/40 font-plus max-w-2xl mx-auto leading-relaxed"
                    >
                        Instant visual transformation. Select from our library of premium,
                        architectural themes designed to elevate your content.
                    </motion.p>
                </div>

                <motion.div
                    id="dashboard"
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.8 }}
                    className="mt-20 w-full max-w-6xl mx-auto glass rounded-3xl p-4 border-white/5 shadow-2xl shadow-luxury-gold/5"
                >
                    <div className="bg-luxury-obsidian rounded-2xl overflow-hidden relative border border-white/5">
                        <div className="absolute inset-0 bg-gradient-to-tr from-luxury-gold/10 via-transparent to-transparent" />
                        <img
                            src="/themes.png"
                            alt="Dashboard Preview"
                            className="w-full h-full object-cover "
                        />
                    </div>
                </motion.div>
            </section>

            {/* Brand Card Section */}
            <section id="brand-card" className="py-24 px-6 max-w-7xl mx-auto">
                <div className="glass rounded-[3rem] p-12 md:p-20 border-white/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-luxury-gold/5 to-transparent pointer-events-none" />
                    <div className="flex flex-col md:flex-row gap-16 items-center">
                        <div className="flex-1 text-left">
                            <h2 className="text-xs font-syncopate text-luxury-gold uppercase tracking-[0.5em] mb-6">Shareable Identity</h2>
                            <h3 className="text-3xl sm:text-4xl md:text-5xl font-syncopate font-bold uppercase mb-8 leading-tight">DIGITAL<br />BRAND CARD</h3>
                            <p className="text-xl text-white/40 font-plus mb-10 leading-relaxed">
                                Your official digital business card. Download and share your unique
                                holographic identity featuring a scannable QR code for instant connection.
                            </p>
                            <div className="flex flex-col gap-6">
                                <div className="flex items-center gap-4 group cursor-default">
                                    <div className="w-2 h-2 rounded-full bg-luxury-gold group-hover:scale-150 transition-transform shadow-[0_0_8px_#D4AF37]" />
                                    <span className="text-sm font-syncopate uppercase tracking-widest text-white/60">Verified Identity</span>
                                </div>
                                <div className="flex items-center gap-4 group cursor-default">
                                    <div className="w-2 h-2 rounded-full bg-luxury-gold group-hover:scale-150 transition-transform shadow-[0_0_8px_#D4AF37]" />
                                    <span className="text-sm font-syncopate uppercase tracking-widest text-white/60">QR Code Access</span>
                                </div>
                                <div className="flex items-center gap-4 group cursor-default">
                                    <div className="w-2 h-2 rounded-full bg-luxury-gold group-hover:scale-150 transition-transform shadow-[0_0_8px_#D4AF37]" />
                                    <span className="text-sm font-syncopate uppercase tracking-widest text-white/60">Shareable Design</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 w-full text-left relative group">
                            <div className="absolute -inset-4 bg-luxury-gold/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                            <Card className="!p-0 border-white/10 bg-[#0A0A0A] overflow-hidden rounded-[3rem] shadow-2xl relative transition-transform duration-700 group-hover:scale-[1.02]">
                                <div className="relative  overflow-hidden">
                                    <img
                                        src="/id.png"
                                        alt="Identity Node"
                                        className="w-full h-full object-cover  transition-all duration-1000"
                                    />
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            {/* Inquiries / Collaboration Nexus */}
            <section id="inquiries" className="py-32 px-6 relative overflow-hidden bg-white/[0.01]">
                <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-luxury-gold/5 blur-[150px] rounded-full -z-10" />

                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-3 px-4 py-2 bg-luxury-gold/10 border border-luxury-gold/20 rounded-full mb-8"
                        >
                            <Briefcase size={14} className="text-luxury-gold" />
                            <span className="text-[10px] font-syncopate uppercase tracking-[0.2em] text-luxury-gold">Strategic Nexus</span>
                        </motion.div>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-4xl md:text-7xl font-syncopate font-bold uppercase tracking-tighter mb-8 max-w-5xl mx-auto leading-[0.9]"
                        >
                            STRATEGIC<br /><span className="text-gradient">INQUIRIES</span>
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-xl text-white/40 font-plus max-w-3xl mx-auto leading-relaxed"
                        >
                            Elevate your professional outreach with an integrated collaboration bridge.
                            Manage high-value brand partnerships through a mission-critical transmission portal designed for clarity and control.
                        </motion.p>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 100 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                        className="w-full max-w-6xl mx-auto glass rounded-3xl p-4 border-white/5 shadow-2xl shadow-luxury-gold/5"
                    >
                        <div className="bg-luxury-obsidian rounded-2xl overflow-hidden relative border border-white/5">
                            <div className="absolute inset-0 bg-gradient-to-tr from-luxury-gold/10 via-transparent to-transparent" />
                            <img
                                src="/enquiries.png"
                                alt="Strategic Inquiries Portal"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-24">
                        {[
                            { title: "Centralized Nexus", desc: "A unified, encrypted stream for all high-stakes professional transmissions.", icon: Radio },
                            { title: "Precision Filtering", desc: "Instantly categorize by investment depth, partnership type, and priority status.", icon: Activity },
                            { title: "Seamless Bridging", desc: "Professional communication pathways that convert casual interest into strategic ventures.", icon: ArrowRight }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="space-y-4"
                            >
                                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-luxury-gold border border-white/10 group-hover:border-luxury-gold/40 transition-all">
                                    <item.icon size={20} />
                                </div>
                                <h4 className="text-lg font-syncopate font-bold text-white uppercase tracking-tight">{item.title}</h4>
                                <p className="text-sm text-white/30 font-plus leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Exclusivity / Invite Only Section */}
            <section className="py-32 px-6 relative overflow-hidden bg-black">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-luxury-gold/[0.03] blur-[150px] rounded-full -z-10" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-luxury-gold/[0.02] blur-[150px] rounded-full -z-10" />

                <div className="max-w-5xl mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-3 px-6 py-2 bg-luxury-gold/[0.08] border border-luxury-gold/30 rounded-full mb-12 shadow-[0_0_30px_rgba(212,175,55,0.1)]"
                    >
                        <Shield size={14} className="text-luxury-gold" />
                        <span className="text-[10px] font-syncopate uppercase tracking-[0.4em] text-luxury-gold font-bold">Protocol Restricted</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-7xl font-syncopate font-bold uppercase tracking-tighter mb-10 leading-[0.9] text-white"
                    >
                        FOR THE <span className="text-gradient">CURATED</span><br />FEW.
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-xl md:text-2xl text-white/40 font-plus mb-16 leading-relaxed max-w-3xl mx-auto"
                    >
                        This is not just a platform it's a closed ecosystem. We are strictly invite only,
                        preserving a space dedicated to creators who define excellence in their craft.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-12 text-left bg-white/[0.02] border border-white/5 p-12 rounded-[3rem] backdrop-blur-xl relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-luxury-gold/5 via-transparent to-transparent pointer-events-none" />

                        <div className="space-y-4">
                            <div className="w-10 h-10 rounded-xl bg-luxury-gold/10 border border-luxury-gold/20 flex items-center justify-center text-luxury-gold">
                                <Sparkles size={18} />
                            </div>
                            <h4 className="text-sm font-syncopate font-bold text-white uppercase tracking-widest">High-Tier Content</h4>
                            <p className="text-xs text-white/30 font-plus leading-relaxed">Dedicated to visionaries who prioritize quality and architectural aesthetics in every creation.</p>
                        </div>

                        <div className="space-y-4 text-center">
                            <div className="w-10 h-10 rounded-xl bg-luxury-gold/10 border border-luxury-gold/20 flex items-center justify-center text-luxury-gold mx-auto">
                                <Shield size={18} />
                            </div>
                            <h4 className="text-sm font-syncopate font-bold text-white uppercase tracking-widest">Vetted Ecosystem</h4>
                            <p className="text-xs text-white/30 font-plus leading-relaxed">Every member is hand-verified to maintain the platform's standard of prestige and authority.</p>
                        </div>

                        <div className="space-y-4 text-right flex flex-col items-end">
                            <div className="w-10 h-10 rounded-xl bg-luxury-gold/10 border border-luxury-gold/20 flex items-center justify-center text-luxury-gold">
                                <Zap size={18} />
                            </div>
                            <h4 className="text-sm font-syncopate font-bold text-white uppercase tracking-widest">Elite Networking</h4>
                            <p className="text-xs text-white/30 font-plus leading-relaxed">Join a peer-to-peer network of the world's most influential and strategic content architects.</p>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Premium Footer Archetype */}
            <footer className="py-32 px-6 border-t border-white/5 relative overflow-hidden bg-[#050505]">
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-luxury-gold/[0.02] blur-[120px] rounded-full pointer-events-none" />

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-16 md:gap-8 mb-24">
                        {/* Brand Pillar */}
                        <div className="col-span-1 md:col-span-2 space-y-8">
                            <div className="text-3xl font-syncopate font-bold tracking-tighter cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                                DOCKED<span className="text-luxury-gold">.</span>PRO
                            </div>
                            <p className="text-white/30 font-plus text-sm max-w-sm leading-relaxed uppercase tracking-wider">
                                The ultimate premium link for creators.
                                Designed for those who demand the best.
                            </p>
                            <div className="pt-4 flex flex-col gap-2">
                                <span className="text-[10px] font-syncopate text-white/30 uppercase tracking-[0.4em]">Product by EAGLE LABS</span>
                            </div>
                        </div>

                        {/* Navigation Pillar */}
                        <div className="space-y-8">
                            <h4 className="text-[10px] font-syncopate text-luxury-gold uppercase tracking-[0.5em] font-bold">Product</h4>
                            <ul className="space-y-4">
                                {[
                                    { name: 'Features', href: '#features' },
                                    { name: 'Analytics', href: '#analytics' },
                                    { name: 'Monetization', href: '#monetization' },
                                    { name: 'Inquiries', href: '#inquiries' },
                                    { name: 'Themes', href: '#themes' },
                                    { name: 'Brand Card', href: '#brand-card' }
                                ].map((item) => (
                                    <li key={item.name}>
                                        <a href={item.href} className="text-xs font-plus text-white/30 hover:text-white transition-colors uppercase tracking-[0.2em]">{item.name}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Social & Legal Pillar */}
                        <div className="space-y-8">
                            <h4 className="text-[10px] font-syncopate text-luxury-gold uppercase tracking-[0.5em] font-bold">Connect</h4>
                            <ul className="space-y-4">
                                <li>
                                    <a href="https://instagram.com/docked.pro" target="_blank" rel="noopener noreferrer" className="text-xs font-plus text-white/30 hover:text-white transition-colors uppercase tracking-[0.2em] flex items-center gap-2">
                                        Instagram
                                    </a>
                                </li>
                                <li>
                                    <a href="https://www.youtube.com/@docked-pro" target="_blank" rel="noopener noreferrer" className="text-xs font-plus text-white/30 hover:text-white transition-colors uppercase tracking-[0.2em] flex items-center gap-2">
                                        YouTube
                                    </a>
                                </li>
                                <li><div className="h-px bg-white/5 w-full my-4" /></li>
                                {[
                                    { label: 'Privacy Policy', link: '/protocol/privacy' },
                                    { label: 'Terms of Service', link: '/protocol/terms' },
                                ].map((item) => (
                                    <li key={item.label}>
                                        <button
                                            onClick={() => navigate(item.link)}
                                            className="text-xs font-plus text-white/30 hover:text-white transition-colors uppercase tracking-[0.2em] text-left"
                                        >
                                            {item.label}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="text-[10px] font-syncopate text-white/30 uppercase tracking-[0.6em] font-medium">
                            © 2026 DOCKED.PRO • ALL RIGHTS RESERVED
                        </div>
                        <div className="flex gap-8 group">
                            <span className="text-[9px] font-syncopate text-white/30 uppercase tracking-[0.4em]">Secure Platform</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div >
    );
};

export default Landing;
