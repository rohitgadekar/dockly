import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ArrowRight, Sparkles, Zap, Music, Activity, Shield, Radio, Quote } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTitle } from "@/hooks/useTitle";

const Landing = () => {
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
                        <a href="#studio" className="hover:text-white transition-colors">The Studio</a>
                        <a href="#insights" className="hover:text-white transition-colors">Insights</a>
                        <a href="#vault" className="hover:text-white transition-colors">The Vault</a>
                    </div>
                    <Button
                        variant="luxury"
                        size="sm"
                        className="hidden md:flex"
                        onClick={() => navigate('/auth')}
                    >
                        Get Access
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
                    <Sparkles size={14} />
                    The Elite Creator Link-in-Bio
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-4xl sm:text-6xl md:text-8xl font-syncopate font-bold tracking-tighter mb-8 max-w-5xl leading-[1.1] px-4"
                >
                    CURATE YOUR <br />
                    <span className="text-gradient">DIGITAL LEGACY</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-lg md:text-2xl text-white/40 font-plus max-w-3xl mb-12 px-4"
                >
                    The definitive luxury home for your online influence.
                    Stunning aesthetics meet effortless performance.
                    Showcase your work with the precision it deserves.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="flex flex-col md:flex-row gap-4"
                >
                    <Button variant="luxury" size="lg" className="group" onClick={() => navigate('/auth')}>
                        Initialize Access <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </Button>
                    <Button variant="outline" size="lg" onClick={() => document.getElementById('studio')?.scrollIntoView({ behavior: 'smooth' })}>
                        Explore The Features
                    </Button>
                </motion.div>

                {/* Dashboard Preview */}
                <motion.div
                    id="command"
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
            <section className="py-20 md:py-32 px-6 max-w-7xl mx-auto space-y-24 md:space-y-32">
                {/* Performance Matrix Detail */}
                <div id="studio" className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <div className="order-2 lg:order-1">
                        <div className="inline-flex items-center gap-3 px-4 py-2 bg-luxury-gold/10 border border-luxury-gold/20 rounded-full mb-8">
                            <Zap size={16} className="text-luxury-gold" />
                            <span className="text-[10px] font-syncopate uppercase tracking-[0.2em] text-luxury-gold">Elite Performance</span>
                        </div>
                        <h3 className="text-3xl sm:text-4xl md:text-5xl font-syncopate font-bold uppercase tracking-tighter mb-8 leading-tight">
                            INSTANT<br /><span className="text-gradient">EXPERIENCE</span>
                        </h3>
                        <p className="text-xl text-white/40 font-plus mb-10 leading-relaxed">
                            Never let a slow site lose a fan. Docked ensures your profile loads instantly across the globe.
                            Showcase your content in high-fidelity without the wait.
                        </p>
                        <div className="space-y-6">
                            {[
                                { title: "Global Speed", desc: "Your page loads in milliseconds, no matter where your fans are." },
                                { title: "Zero Lag", desc: "Smooth transitions that match the premium feel of your brand." },
                                { title: "Uptime Guaranteed", desc: "Your digital home is always open for business and discovery." }
                            ].map((item, i) => (
                                <div key={i} className="flex items-start gap-4">
                                    <div className="w-1 h-1 rounded-full bg-luxury-gold mt-2 shrink-0 shadow-[0_0_8px_#D4AF37]" />
                                    <div>
                                        <div className="text-sm font-syncopate font-bold text-white uppercase tracking-widest mb-1">{item.title}</div>
                                        <div className="text-xs text-white/30 font-plus">{item.desc}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="order-1 lg:order-2 relative aspect-square">
                        <div className="absolute inset-0 bg-luxury-gold/5 blur-[120px] rounded-full" />
                        <Card className="h-full aspect-square border-white/10 bg-black/40 flex items-center justify-center p-0 overflow-hidden group">
                            <div className="text-6xl text-luxury-gold/10 font-syncopate animate-pulse tracking-tighter uppercase text-center">Pure<br />Speed</div>
                        </Card>
                    </div>
                </div>

                {/* Command Deck Detail */}
                <div id="insights" className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <div className="relative aspect-square">
                        <div className="absolute inset-0 bg-emerald-500/5 blur-[120px] rounded-full" />
                        <Card className="h-full border-white/10 bg-black/40 flex items-center justify-center p-0 overflow-hidden group">
                            <Activity size={120} className="text-emerald-500/20 group-hover:scale-110 transition-transform duration-1000" />
                        </Card>
                    </div>
                    <div>
                        <div className="inline-flex items-center gap-3 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-8">
                            <Activity size={16} className="text-emerald-500" />
                            <span className="text-[10px] font-syncopate uppercase tracking-[0.2em] text-emerald-500">Creative Control</span>
                        </div>
                        <h3 className="text-3xl sm:text-4xl md:text-5xl font-syncopate font-bold uppercase tracking-tighter mb-8 leading-tight">
                            AUDIENCE<br /><span className="text-[#10B981]">INSIGHTS</span>
                        </h3>
                        <p className="text-xl text-white/40 font-plus mb-10 leading-relaxed">
                            Understand your fans like never before. Track engagement, link clicks, and
                            visitor growth through an elegant dashboard designed for creators.
                        </p>
                        <div className="space-y-6">
                            {[
                                { title: "Growth Tracking", desc: "Watch your audience grow with beautiful, easy-to-read charts." },
                                { title: "Click Analytics", desc: "Know exactly which projects and links your fans love most." },
                                { title: "Real-time Feed", desc: "Stay connected with live updates on your profile's performance." }
                            ].map((item, i) => (
                                <div key={i} className="flex items-start gap-4">
                                    <div className="w-1 h-1 rounded-full bg-emerald-500 mt-2 shrink-0 shadow-[0_0_8px_#10B981]" />
                                    <div>
                                        <div className="text-sm font-syncopate font-bold text-white uppercase tracking-widest mb-1">{item.title}</div>
                                        <div className="text-xs text-white/30 font-plus">{item.desc}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Spotify Featured Detail */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <div>
                        <div className="inline-flex items-center gap-3 px-4 py-2 bg-[#1DB954]/10 border border-[#1DB954]/20 rounded-full mb-8 font-syncopate">
                            <Music size={16} className="text-[#1DB954]" />
                            <span className="text-[10px] uppercase tracking-[0.2em] text-[#1DB954]">Spotify Featured Node</span>
                        </div>
                        <h3 className="text-3xl sm:text-4xl md:text-5xl font-syncopate font-bold uppercase tracking-tighter mb-8 leading-tight">
                            SONIC<br /><span className="text-[#1DB954]">IDENTITY</span>
                        </h3>
                        <p className="text-xl text-white/40 font-plus mb-10 leading-relaxed">
                            Integrate your auditory essence directly into your digital estate. Showcase your
                            top 5 favorite tracks to broadcast your high fidelity musical signature
                            through our deep Spotify integration.
                        </p>
                        <div className="space-y-6">
                            {[
                                { title: "Top 5 Curation", desc: "Select and showcase your definitive five track auditory signature." },
                                { title: "Dynamic Metadata", desc: "High fidelity track data and covers fetched via deep Spotify matrix integration." },
                                { title: "Identity Resonance", desc: "Link your musical aesthetic directly to your sovereign profile for a complete multisensory experience." },
                                { title: "Sonic Pulse", desc: "Animated identifiers that react to the rhythm and presence of your selected tracks." }
                            ].map((item, i) => (
                                <div key={i} className="flex items-start gap-4">
                                    <div className="w-1 h-1 rounded-full bg-[#1DB954] mt-2 shrink-0 shadow-[0_0_8px_#1DB954]" />
                                    <div>
                                        <div className="text-sm font-syncopate font-bold text-white uppercase tracking-widest mb-1">{item.title}</div>
                                        <div className="text-xs text-white/30 font-plus">{item.desc}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="relative aspect-square">
                        <div className="absolute inset-0 bg-[#1DB954]/5 blur-[120px] rounded-full" />
                        <Card className="h-full border-white/10 bg-black/40 flex items-center justify-center p-0 overflow-hidden group">
                            <Radio size={120} className="text-[#1DB954]/20 group-hover:animate-pulse" />
                        </Card>
                    </div>
                </div>

                {/* Temporal Chronicles Detail */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <div className="order-2 lg:order-1 relative aspect-square">
                        <div className="absolute inset-0 bg-luxury-gold/5 blur-[120px] rounded-full" />
                        <Card className="h-full border-white/10 bg-black/40 flex items-center justify-center p-0 overflow-hidden group">
                            <div className="relative">
                                <Radio size={120} className="text-luxury-gold/10 group-hover:scale-110 transition-transform duration-1000" />
                            </div>
                        </Card>
                    </div>
                    <div className="order-1 lg:order-2">
                        <div className="inline-flex items-center gap-3 px-4 py-2 bg-luxury-gold/10 border border-luxury-gold/20 rounded-full mb-8 font-syncopate">
                            <Radio size={16} className="text-luxury-gold" />
                            <span className="text-[10px] uppercase tracking-[0.2em] text-luxury-gold">Behind the Scenes</span>
                        </div>
                        <h3 className="text-3xl sm:text-4xl md:text-5xl font-syncopate font-bold uppercase tracking-tighter mb-8 leading-tight">
                            CREATOR<br /><span className="text-white">STORIES</span>
                        </h3>
                        <p className="text-xl text-white/40 font-plus mb-10 leading-relaxed">
                            Share ephemeral moments of your day. Post high-quality updates and vertical
                            video content that lives for 24 hours on your premium profile.
                        </p>
                        <div className="space-y-6">
                            {[
                                { title: "24-Hour Moments", desc: "Keep your fans engaged with daily, disappearable updates." },
                                { title: "Stunning Visuals", desc: "Optimized for both high-resolution photos and vertical videos." },
                                { title: "Immersive View", desc: "A cinematic viewing experience for your audience to dive into your world." },
                                { title: "Easy Management", desc: "Upload and manage your stories directly from your phone." }
                            ].map((item, i) => (
                                <div key={i} className="flex items-start gap-4">
                                    <div className="w-1 h-1 rounded-full bg-luxury-gold mt-2 shrink-0 shadow-[0_0_8px_#D4AF37]" />
                                    <div>
                                        <div className="text-sm font-syncopate font-bold text-white uppercase tracking-widest mb-1">{item.title}</div>
                                        <div className="text-xs text-white/30 font-plus">{item.desc}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Why we standout Section */}
            <section id="vault" className="py-32 px-6 bg-white/[0.02] border-y border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-luxury-gold/5 blur-[150px] rounded-full -z-10" />

                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-24">
                        <h2 className="text-xs font-syncopate text-luxury-gold uppercase tracking-[0.5em] mb-4">The Differentiator</h2>
                        <h3 className="text-3xl sm:text-4xl md:text-5xl font-syncopate font-bold uppercase tracking-tighter">BEYOND THE BASIC LINK</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
                        <div className="space-y-12">
                            <div className="group">
                                <div className="flex items-center gap-6 mb-6">
                                    <div className="w-14 h-14 rounded-[1.5rem] bg-luxury-gold/10 flex items-center justify-center text-luxury-gold border border-luxury-gold/20 group-hover:scale-110 transition-all duration-500 shadow-[0_0_20px_rgba(212,175,55,0.1)]">
                                        <Zap size={24} />
                                    </div>
                                    <h4 className="text-2xl font-syncopate font-bold uppercase tracking-tight text-white">Elite Brand Speed</h4>
                                </div>
                                <p className="text-lg text-white/30 font-plus leading-relaxed">
                                    While others provide basic templates, we offer an elite experience.
                                    Your page loads with absolute precision, ensuring that first impression
                                    is as powerful as your content.
                                </p>
                            </div>

                            <div className="group">
                                <div className="flex items-center gap-6 mb-6">
                                    <div className="w-14 h-14 rounded-[1.5rem] bg-white/5 flex items-center justify-center text-white border border-white/5 group-hover:scale-110 transition-all duration-500 group-hover:text-[#1DB954] group-hover:border-[#1DB954]/20">
                                        <Music size={24} />
                                    </div>
                                    <h4 className="text-2xl font-syncopate font-bold uppercase tracking-tight text-white">Signature Sound</h4>
                                </div>
                                <p className="text-lg text-white/30 font-plus leading-relaxed">
                                    Sync your vibe with our Spotify integration.
                                    Showcase your top 5 tracks and let your fans listen to your brand's
                                    auditory signature in high-fidelity.
                                </p>
                            </div>

                            <div className="group">
                                <div className="flex items-center gap-6 mb-6">
                                    <div className="w-14 h-14 rounded-[1.5rem] bg-white/5 flex items-center justify-center text-white border border-white/5 group-hover:scale-110 transition-all duration-500 group-hover:text-luxury-gold group-hover:border-luxury-gold/20">
                                        <Shield size={24} />
                                    </div>
                                    <h4 className="text-2xl font-syncopate font-bold uppercase tracking-tight text-white">Private & Secure</h4>
                                </div>
                                <p className="text-lg text-white/30 font-plus leading-relaxed">
                                    Your personal data is your own asset.
                                    Managed through a beautifully designed Creator Deck, your information
                                    and content are stored in a secure, private vault.
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
                                    <div className="text-[10px] font-syncopate text-luxury-gold uppercase tracking-[0.5em] mb-4">Private Vault</div>
                                    <div className="text-4xl font-syncopate font-bold text-white tracking-tighter">BRAND STUDIO</div>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

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
                            <Sparkles size={16} className="text-luxury-gold" />
                            <span className="text-[10px] font-syncopate uppercase tracking-[0.2em] text-luxury-gold">Social Proof Protocols</span>
                        </motion.div>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl md:text-6xl font-syncopate font-bold uppercase tracking-tighter mb-8"
                        >
                            VOICES OF <span className="text-gradient">AUTHORITY</span>
                        </motion.h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                quote: "The architectural precision of platform has transformed my digital presence from a standard portfolio into a high authority archival estate.",
                                author: "Rohit Gadekar",
                                role: "Developer / Designer",
                                delay: 0.2
                            },
                            {
                                quote: "100ms delivery combined with the Sovereign Vault protocol gives me complete confidence in my global digital footprint. Everything feels fast, secure.",
                                author: "Akhil Singh",
                                role: "Developer",
                                delay: 0.4
                            },
                            {
                                quote: "Finally, a platform that understands that identity is an asset, not just a profile. The Citadel security architecture is absolutely unmatched.",
                                author: "Claire Bennett",
                                role: "Creator / Influencer",
                                delay: 0.6
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
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Holographic Identity Section */}
            <section id="matrix" className="py-24 px-6 max-w-7xl mx-auto">
                <div className="glass rounded-[3rem] p-12 md:p-20 border-white/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-luxury-gold/5 to-transparent pointer-events-none" />
                    <div className="flex flex-col md:flex-row gap-16 items-center">
                        <div className="flex-1 text-left">
                            <h2 className="text-xs font-syncopate text-luxury-gold uppercase tracking-[0.5em] mb-6">Elegance in Design</h2>
                            <h3 className="text-3xl sm:text-4xl md:text-5xl font-syncopate font-bold uppercase mb-8 leading-tight">YOUR SIGNATURE<br />PRESENCE</h3>
                            <p className="text-xl text-white/40 font-plus mb-10 leading-relaxed">
                                Share your world through a stunning, boutique link-in-bio experience.
                                Securely curate your best work on a platform that looks as premium as you do,
                                with high-end aesthetics that command attention from every visitor.
                            </p>
                            <div className="flex flex-col gap-6">
                                <div className="flex items-center gap-4 group cursor-default">
                                    <div className="w-2 h-2 rounded-full bg-luxury-gold group-hover:scale-150 transition-transform shadow-[0_0_8px_#D4AF37]" />
                                    <span className="text-sm font-syncopate uppercase tracking-widest text-white/60">Boutique Brand Transmission</span>
                                </div>
                                <div className="flex items-center gap-4 group cursor-default">
                                    <div className="w-2 h-2 rounded-full bg-luxury-gold group-hover:scale-150 transition-transform shadow-[0_0_8px_#D4AF37]" />
                                    <span className="text-sm font-syncopate uppercase tracking-widest text-white/60">Secure Content Archive</span>
                                </div>
                                <div className="flex items-center gap-4 group cursor-default">
                                    <div className="w-2 h-2 rounded-full bg-luxury-gold group-hover:scale-150 transition-transform shadow-[0_0_8px_#D4AF37]" />
                                    <span className="text-sm font-syncopate uppercase tracking-widest text-white/60">High-End Digital Identity</span>
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
                                The ultimate premium link for creators and influencers of distinction.
                                Designed with elegance, shared with personality.
                            </p>
                            <div className="pt-4 flex flex-col gap-2">
                                <span className="text-[10px] font-syncopate text-white/10 uppercase tracking-[0.4em]">The Creative Ecosystem</span>
                                <a href="https://eagles.rohitgadekar.dev" target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-2">
                                    <span className="text-[11px] font-syncopate text-white/40 group-hover:text-luxury-gold transition-colors uppercase tracking-[0.2em]">A Product by EAGLES LABS</span>
                                    <ArrowRight size={12} className="text-white/20 group-hover:text-luxury-gold group-hover:translate-x-1 transition-all" />
                                </a>
                            </div>
                        </div>

                        {/* Navigation Pillar */}
                        <div className="space-y-8">
                            <h4 className="text-[10px] font-syncopate text-luxury-gold uppercase tracking-[0.5em] font-bold">Ecosystem</h4>
                            <ul className="space-y-4">
                                {[
                                    { name: 'The Matrix', href: '#matrix' },
                                    { name: 'Command Deck', href: '#command' },
                                    { name: 'The Citadel', href: '#citadel' }
                                ].map((item) => (
                                    <li key={item.name}>
                                        <a href={item.href} className="text-xs font-plus text-white/30 hover:text-white transition-colors uppercase tracking-[0.2em]">{item.name}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Legal & Intel Pillar */}
                        <div className="space-y-8">
                            <h4 className="text-[10px] font-syncopate text-luxury-gold uppercase tracking-[0.5em] font-bold">Sovereign Protocols</h4>
                            <ul className="space-y-4">
                                {[
                                    { label: 'Sovereign Privacy', link: '/protocol/privacy' },
                                    { label: 'Archive Protocols', link: '/protocol/terms' },
                                    { label: 'Citadel Security', link: '/protocol/security' },
                                    { label: 'API Intel', link: '/protocol/api' }
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
                        <div className="text-[10px] font-syncopate text-white/10 uppercase tracking-[0.6em] font-medium">
                            © 2026 HOUSE OF EAGLES • ALL SOVEREIGNTY RESERVED
                        </div>
                        <div className="flex gap-8 group">
                            <div className="h-px w-12 bg-white/5 group-hover:w-20 group-hover:bg-luxury-gold/20 transition-all duration-700" />
                            <span className="text-[9px] font-syncopate text-white/20 uppercase tracking-[0.4em]">Military Grade Encryption Active</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
