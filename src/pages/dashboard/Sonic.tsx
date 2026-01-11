import { useState } from "react";
import { motion } from "framer-motion";
import { useDashboard } from "@/hooks/useDashboard";
import { Button } from "@/components/ui/Button";
import { SpotifyManager } from "@/components/dashboard/SpotifyManager";
import { Card } from "@/components/ui/Card";
import {
    SiSpotify
} from "react-icons/si";
import {
    Play,
    Pause,
    Plus,
    BarChart3,
    Music,
    Globe,
    ExternalLink,
    X
} from "lucide-react";

import { useTitle } from "@/hooks/useTitle";

const Sonic = () => {
    useTitle("Auditory Signature");
    const { data } = useDashboard();
    const [isManagerOpen, setIsManagerOpen] = useState(false);
    const [playingPreview, setPlayingPreview] = useState<string | null>(null);
    const [audio] = useState(new Audio());

    const tracks = (data?.profile?.top_tracks as any[]) || [];

    const togglePreview = (url: string | null) => {
        if (!url) return;

        if (playingPreview === url) {
            audio.pause();
            setPlayingPreview(null);
        } else {
            audio.src = url;
            audio.play();
            setPlayingPreview(url);
            audio.onended = () => setPlayingPreview(null);
        }
    };

    return (
        <div className="space-y-16 py-8">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 pb-12 border-b border-white/5 relative">
                <div className="absolute top-0 left-0 w-96 h-96 bg-[#1DB954]/5 blur-[120px] -ml-48 -mt-48 pointer-events-none" />

                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <SiSpotify className="text-[#1DB954] w-6 h-6" />
                        <span className="text-[10px] font-syncopate uppercase tracking-[0.4em] text-[#1DB954] opacity-80">Sonic Identity Matrix</span>
                    </div>
                    <h1 className="text-6xl font-syncopate font-bold uppercase tracking-tighter leading-none">
                        Anthem<span className="text-[#1DB954]">.</span>
                    </h1>
                    <p className="text-white/30 font-plus text-xl mt-6 max-w-2xl leading-relaxed">
                        Curate the auditory landscape of your digital persona. Broadcast your sonic aesthetic to the network.
                    </p>
                </div>

                <div className="flex gap-4">
                    <Button
                        variant="outline"
                        onClick={() => window.open('https://spotify.com', '_blank')}
                        className="px-8 py-6 rounded-[2rem] gap-3 text-xs font-syncopate uppercase tracking-widest border-white/10 hover:border-[#1DB954]/40 hover:text-[#1DB954]"
                    >
                        <Globe size={16} /> Open Spotify
                    </Button>
                    <Button
                        variant="luxury"
                        onClick={() => setIsManagerOpen(!isManagerOpen)}
                        className={`gap-3 px-10 py-6 rounded-[2rem] shadow-[0_0_30px_rgba(29,185,84,0.2)] text-sm tracking-widest font-syncopate uppercase transition-all ${isManagerOpen ? 'bg-white/10 text-white' : 'bg-[#1DB954] text-black hover:bg-[#1efc6e]'} border-none`}
                    >
                        {isManagerOpen ? <X size={20} /> : <Plus size={20} />}
                        {isManagerOpen ? "Close Matrix" : "Manage Matrix"}
                    </Button>
                </div>
            </header>

            {/* Main Content: Cinematic Stack */}
            <div className="flex flex-col gap-16">
                {/* Primary Resonance Detail (Full Width) */}
                <div className="w-full">
                    {tracks.length > 0 ? (
                        <Card className="w-full min-h-[400px] relative overflow-hidden group p-0 border-[#1DB954]/20 bg-[#1DB954]/[0.02] rounded-[3rem]">
                            <div className="absolute inset-0">
                                <img
                                    src={tracks[0].cover}
                                    alt={tracks[0].title}
                                    className="w-full h-full object-cover opacity-40 group-hover:opacity-20 transition-all duration-1000 scale-110 group-hover:scale-100 blur-2xl"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent" />
                                <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/50 to-transparent" />
                            </div>

                            <div className="relative z-10 flex flex-col justify-between h-full p-10 md:p-12">
                                <div className="flex items-center justify-between">
                                    <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-[#1DB954]/10 border border-[#1DB954]/20 rounded-full backdrop-blur-xl">
                                        <div className="w-2 h-2 rounded-full bg-[#1DB954] animate-pulse shadow-[0_0_10px_#1DB954]" />
                                        <span className="text-[11px] font-syncopate text-[#1DB954] uppercase tracking-[0.3em] font-bold">Primary Resonance</span>
                                    </div>
                                    {tracks[0].previewUrl && (
                                        <button
                                            onClick={() => togglePreview(tracks[0].previewUrl)}
                                            className="w-20 h-20 rounded-full bg-[#1DB954] text-black flex items-center justify-center hover:scale-110 transition-all duration-500 shadow-[0_0_50px_rgba(29,185,84,0.4)] group/play"
                                        >
                                            {playingPreview === tracks[0].previewUrl ? <Pause size={28} fill="black" /> : <Play size={28} className="ml-1" fill="black" />}
                                        </button>
                                    )}
                                </div>

                                <div className="space-y-4">
                                    <h2 className="text-6xl md:text-7xl font-plus font-black text-white leading-[0.9] tracking-tighter">
                                        {tracks[0].title}
                                    </h2>
                                    <p className="text-xl md:text-3xl font-syncopate text-white/40 uppercase tracking-[0.2em]">
                                        {tracks[0].artist}
                                    </p>
                                </div>

                                <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-12 pt-16 border-t border-white/10">
                                    <div className="flex items-center gap-12">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-syncopate text-white/20 uppercase tracking-[0.3em] mb-4">Engagement Statistics</span>
                                            <div className="flex items-center gap-4 text-[#1DB954]">
                                                <BarChart3 size={24} />
                                                <span className="text-4xl font-mono font-bold tracking-tight">2.4B</span>
                                            </div>
                                        </div>
                                        <div className="w-px h-16 bg-white/10" />
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-syncopate text-white/20 uppercase tracking-[0.3em] mb-4">Atmospheric Performance</span>
                                            <div className="flex items-center gap-4 text-white/60">
                                                <Music size={24} />
                                                <span className="text-4xl font-mono font-bold tracking-tight">#01</span>
                                            </div>
                                        </div>
                                    </div>

                                    <Button
                                        variant="ghost"
                                        className="h-16 px-10 rounded-full border border-white/10 hover:border-[#1DB954]/40 hover:bg-[#1DB954]/5 text-white/60 hover:text-[#1DB954] gap-4 font-syncopate uppercase tracking-[0.2em] text-[11px] "
                                    >
                                        <ExternalLink size={18} /> Deep Analysis
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ) : (
                        <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-12 border border-dashed border-white/10 rounded-[3rem] bg-white/[0.01]">
                            <div className="w-24 h-24 rounded-full bg-[#1DB954]/5 flex items-center justify-center mb-8 border border-[#1DB954]/20 animate-pulse">
                                <SiSpotify size={48} className="text-[#1DB954]" />
                            </div>
                            <h3 className="text-2xl font-syncopate font-bold text-white mb-2">Sonic Void Detected</h3>
                            <p className="text-white/40 font-plus max-w-md mx-auto mb-8">
                                Your auditory signature is currently offline. Initialize the matrix to broadcast your identity.
                            </p>
                            <Button variant="luxury" onClick={() => setIsManagerOpen(true)} className="bg-[#1DB954] text-black border-none">
                                Initialize Matrix
                            </Button>
                        </div>
                    )}
                </div>

                {/* Secondary Atmospheres Grid */}
                <div className="space-y-8">
                    <div className="flex items-center justify-between pb-6 border-b border-white/5">
                        <div className="flex items-center gap-4">
                            <span className="text-xs font-syncopate uppercase tracking-[0.5em] text-white/20">The Collective Matrix</span>
                            <div className="h-1px w-12 bg-white/10" />
                        </div>
                        <span className="text-xs font-mono text-[#1DB954] bg-[#1DB954]/10 px-4 py-1.5 rounded-full border border-[#1DB954]/20">
                            {tracks.length}/5 NODES ACTIVE
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {Array.from({ length: 4 }).map((_, idx) => {
                            const track = tracks[idx + 1]; // Skip the first track as it's the Primary Resonance
                            if (track) {
                                return (
                                    <motion.div
                                        key={track.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                    >
                                        <Card
                                            className="group p-6 flex flex-col gap-6 bg-white/[0.02] border-white/5 hover:border-[#1DB954]/40 hover:bg-[#1DB954]/[0.03]  cursor-pointer rounded-[2rem] relative overflow-hidden h-full"
                                            onClick={() => togglePreview(track.previewUrl)}
                                        >
                                            <div className="relative aspect-square rounded-[1.5rem] overflow-hidden shadow-2xl border border-white/5">
                                                <img src={track.cover} alt={track.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110" />
                                                <div className={`absolute inset-0 bg-black/60 flex items-center justify-center transition-all duration-500 ${playingPreview === track.previewUrl ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                                    <div className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center scale-75 group-hover:scale-100 transition-transform">
                                                        {playingPreview === track.previewUrl ? <Pause size={24} fill="black" /> : <Play size={24} fill="black" className="ml-1" />}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className={`font-plus font-black text-xl mb-1 truncate transition-colors ${playingPreview === track.previewUrl ? 'text-[#1DB954]' : 'text-white group-hover:text-[#1DB954]'}`}>
                                                    {track.title}
                                                </h4>
                                                <p className="text-white/30 font-syncopate text-[9px] uppercase tracking-[0.2em] truncate">
                                                    {track.artist}
                                                </p>
                                            </div>

                                            {playingPreview === track.previewUrl && (
                                                <div className="absolute top-6 right-6 flex gap-1 items-end h-4">
                                                    <div className="w-0.5 bg-[#1DB954] h-full animate-[music-bar_0.5s_ease-in-out_infinite]" />
                                                    <div className="w-0.5 bg-[#1DB954] h-2/3 animate-[music-bar_0.5s_ease-in-out_infinite_0.1s]" />
                                                    <div className="w-0.5 bg-[#1DB954] h-1/2 animate-[music-bar_0.5s_ease-in-out_infinite_0.2s]" />
                                                </div>
                                            )}
                                        </Card>
                                    </motion.div>
                                );
                            }
                            return (
                                <div key={`empty-${idx}`} className="aspect-[4/5] rounded-[2rem] bg-white/[0.01] border border-dashed border-white/10 flex flex-col items-center justify-center gap-4 opacity-40 group hover:opacity-100 transition-opacity">
                                    <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <Music size={24} className="text-white/20" />
                                    </div>
                                    <div className="text-center">
                                        <div className="h-4 w-24 bg-white/10 rounded-full mb-2 mx-auto" />
                                        <div className="h-3 w-16 bg-white/5 rounded-full mx-auto" />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Modal Manager - Renders via Portal */}
            <SpotifyManager isOpen={isManagerOpen} onClose={() => setIsManagerOpen(false)} />
        </div>
    );
};

export default Sonic;
