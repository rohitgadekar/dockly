import { useState } from "react";
import { motion } from "framer-motion";
import { SiSpotify } from "react-icons/si";
import { Play, TrendingUp, BarChart3, ExternalLink, Plus } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useDashboard } from "@/hooks/useDashboard";
import { SpotifyManager } from "./SpotifyManager";

export const SpotifyWidget = () => {
    const { data } = useDashboard();
    const [isManagerOpen, setIsManagerOpen] = useState(false);

    // Casting to expected type since we haven't strictly typed the API response yet
    const tracks = (data?.profile?.top_tracks as any[]) || [];

    return (
        <>
            <Card className="p-8 bg-[#1DB954]/[0.02] border-white/5 relative overflow-hidden group h-full flex flex-col">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#1DB954]/5 blur-[80px] -mr-32 -mt-32 pointer-events-none" />

                <div className="flex justify-between items-center mb-8 relative z-10 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#1DB954]/10 flex items-center justify-center text-[#1DB954] border border-[#1DB954]/20 shadow-[0_0_15px_rgba(29,185,84,0.2)]">
                            <SiSpotify size={20} />
                        </div>
                        <div>
                            <h2 className="text-sm font-syncopate font-bold uppercase tracking-widest text-white">
                                Sonic Identity
                            </h2>
                            <div className="flex items-center gap-2 mt-0.5">
                                <div className={`w-1.5 h-1.5 rounded-full ${tracks.length > 0 ? 'bg-[#1DB954] animate-pulse' : 'bg-white/20'} `} />
                                <span className="text-[8px] font-syncopate text-white/40 uppercase tracking-widest">
                                    {tracks.length > 0 ? "Live Sync Active" : "Not Linked"}
                                </span>
                            </div>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 rounded-full bg-white/5 hover:bg-[#1DB954]/20 text-white/40 hover:text-[#1DB954] transition-all"
                        onClick={() => setIsManagerOpen(true)}
                    >
                        <ExternalLink size={14} />
                    </Button>
                </div>

                <div className="space-y-4 relative z-10 flex-1 overflow-visible">
                    {tracks.length > 0 ? (
                        tracks.map((track, idx) => (
                            <motion.div
                                key={track.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-transparent hover:border-white/5 transition-all group/track cursor-pointer"
                            >
                                <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0">
                                    <img src={track.cover} alt={track.title} className="w-full h-full object-cover grayscale group-hover/track:grayscale-0 transition-all duration-500" />
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/track:opacity-100 transition-opacity">
                                        <Play size={12} className="text-white fill-white" />
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-sm font-plus font-bold text-white truncate">{track.title}</h3>
                                    <p className="text-[10px] text-white/40 font-syncopate uppercase tracking-wider truncate">{track.artist}</p>
                                </div>
                                {/* Plays metric placeholder - could be real stored data later */}
                                <div className="text-right hidden sm:block">
                                    <div className="flex items-center gap-1.5 justify-end text-[#1DB954]/60">
                                        <BarChart3 size={10} />
                                        <span className="text-[10px] font-mono">--</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-8">
                            <div className="w-16 h-16 rounded-full bg-white/[0.02] flex items-center justify-center border border-dashed border-white/10">
                                <Plus size={24} className="text-white/10" />
                            </div>
                            <div>
                                <p className="text-white/40 font-plus text-sm">No tracks synchronized</p>
                                <p className="text-[9px] text-white/20 font-syncopate uppercase tracking-widest mt-1">Link your sonic matrix</p>
                            </div>
                            <Button
                                variant="outline"
                                className="border-[#1DB954]/20 text-[#1DB954] hover:bg-[#1DB954]/10"
                                onClick={() => setIsManagerOpen(true)}
                            >
                                Connect Spotify
                            </Button>
                        </div>
                    )}
                </div>

                <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center relative z-10 shrink-0">
                    <div className="flex items-center gap-2 text-white/20">
                        <TrendingUp size={14} />
                        <span className="text-[9px] font-syncopate uppercase tracking-widest">Global Top Tracks</span>
                    </div>
                    <Button
                        variant="outline"
                        onClick={() => setIsManagerOpen(true)}
                        className="h-8 text-[9px] px-4 rounded-full border-white/10 hover:border-[#1DB954]/40 hover:text-[#1DB954] uppercase tracking-widest font-syncopate transition-all"
                    >
                        Manage
                    </Button>
                </div>
            </Card>

            <SpotifyManager isOpen={isManagerOpen} onClose={() => setIsManagerOpen(false)} />
        </>
    );
};
