import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import {
    Loader2,
    X,
    Search,
    Play,
    Pause,
    Plus,
    Check,
    Music,
    Save
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useDashboard } from "@/hooks/useDashboard";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { LuxuryModal } from "@/components/ui/LuxuryModal";

interface Track {
    id: string;
    title: string;
    artist: string;
    cover: string;
    previewUrl: string | null;
}

interface SpotifyManagerProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SpotifyManager = ({ isOpen, onClose }: SpotifyManagerProps) => {
    const { data } = useDashboard();
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<Track[]>([]);
    const [selectedTracks, setSelectedTracks] = useState<Track[]>(data?.profile?.top_tracks || []);
    const [loading, setLoading] = useState(false);
    const [searching, setSearching] = useState(false);
    const [playingPreview, setPlayingPreview] = useState<string | null>(null);
    const queryClient = useQueryClient();

    // Mock audio element for preview
    const [audio] = useState(new Audio());

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setSearching(true);
        try {
            // Using iTunes Search API as a reliable public source for music data
            // This provides real covers, titles, and artists without needing complex Spotify OAuth for the user
            const response = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(searchQuery)}&media=music&limit=5`);
            const data = await response.json();

            const tracks: Track[] = data.results.map((result: any) => ({
                id: result.trackId.toString(),
                title: result.trackName,
                artist: result.artistName,
                cover: result.artworkUrl100.replace('100x100', '600x600'),
                previewUrl: result.previewUrl
            }));

            setSearchResults(tracks);
        } catch (error) {
            toast.error("Failed to fetch sonic data.");
        } finally {
            setSearching(false);
        }
    };

    const handleAddTrack = (track: Track) => {
        if (selectedTracks.length >= 5) {
            toast.error("Maximum 5 tracks allowed in the sonic matrix.");
            return;
        }
        if (selectedTracks.find(t => t.id === track.id)) {
            toast.error("Track already synchronized.");
            return;
        }
        setSelectedTracks([...selectedTracks, track]);
    };

    const handleRemoveTrack = (trackId: string) => {
        setSelectedTracks(selectedTracks.filter(t => t.id !== trackId));
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Unauthorized");

            const { error } = await supabase.from('profiles').update({
                top_tracks: selectedTracks,
                updated_at: new Date().toISOString()
            }).eq('id', user.id);

            if (error) throw error;

            toast.success("Sonic identity synchronized.");
            queryClient.invalidateQueries({ queryKey: ["dashboard-data"] });
            onClose();
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const togglePreview = (url: string | null) => {
        if (!url) return;

        if (playingPreview === url) {
            audio.pause();
            setPlayingPreview(null);
        } else {
            audio.src = url;
            audio.play();
            setPlayingPreview(url);
        }
    };

    // Stop audio when closing
    const handleClose = () => {
        audio.pause();
        setPlayingPreview(null);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <LuxuryModal isOpen={isOpen} onClose={handleClose}>
            {/* Ambient Glow */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#1DB954]/5 blur-[120px] -mr-32 -mt-32 pointer-events-none" />

            {/* Header */}
            <div className="p-10 border-b border-white/5 flex items-center justify-between shrink-0 bg-white/[0.01]">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-[1.5rem] bg-[#1DB954]/10 border border-[#1DB954]/20 flex items-center justify-center text-[#1DB954]">
                        <Music size={32} />
                    </div>
                    <div>
                        <h2 className="text-3xl font-syncopate font-bold uppercase tracking-tight text-white">Sonic Matrix</h2>
                        <div className="flex items-center gap-3 mt-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#1DB954] shadow-[0_0_10px_#1DB954]" />
                            <p className="text-xs text-white/40 font-syncopate uppercase tracking-[0.2em]">
                                Live Synchronization
                            </p>
                        </div>
                    </div>
                </div>
                <button
                    onClick={handleClose}
                    className="group w-12 h-12 rounded-full border border-white/5 hover:border-white/20 flex items-center justify-center transition-colors bg-white/[0.02]"
                >
                    <X size={20} className="text-white/40 group-hover:text-white transition-colors" />
                </button>
            </div>

            <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-0">
                {/* Left Panel: Search */}
                <div className="lg:col-span-7 border-r border-white/5 flex flex-col min-h-0 bg-white/[0.01]">
                    <div className="p-8 pb-4 shrink-0">
                        <p className="text-[10px] font-syncopate uppercase tracking-[0.3em] text-white/30 mb-6 font-bold">Signal Acquisition</p>
                        <form onSubmit={handleSearch} className="relative group">
                            <input
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search global frequency..."
                                className="w-full h-16 bg-[#0A0A0A] border border-white/10 rounded-[1.5rem] pl-14 pr-6 outline-none focus:border-[#1DB954]/40 focus:bg-white/[0.02] transition-all text-white font-plus text-sm group-hover:border-white/20"
                                autoFocus
                            />
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-hover:text-white/40 transition-colors" size={20} />
                            <Button
                                type="submit"
                                disabled={searching}
                                className="absolute right-3 top-3 bottom-3 px-6 rounded-xl bg-[#1DB954]/10 hover:bg-[#1DB954]/20 text-[#1DB954] text-[10px] font-syncopate uppercase tracking-widest border border-[#1DB954]/20"
                            >
                                {searching ? <Loader2 className="animate-spin" size={14} /> : "Scan"}
                            </Button>
                        </form>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar p-8 pt-0 space-y-4" data-lenis-prevent>
                        <AnimatePresence mode="popLayout">
                            {searchResults.length > 0 && (
                                <div className="space-y-3 pb-8">
                                    {searchResults.map((track, idx) => (
                                        <motion.div
                                            key={track.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className="flex items-center gap-4 p-4 rounded-[1.5rem] bg-[#0A0A0A] hover:bg-white/[0.03] border border-transparent hover:border-white/5 group cursor-pointer transition-all"
                                            onClick={() => handleAddTrack(track)}
                                        >
                                            <div className="relative w-16 h-16 rounded-2xl overflow-hidden shrink-0 border border-white/5 shadow-2xl">
                                                <img src={track.cover} alt={track.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                                                {track.previewUrl && (
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); togglePreview(track.previewUrl); }}
                                                        className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
                                                    >
                                                        {playingPreview === track.previewUrl ? <Pause size={20} className="fill-white text-white" /> : <Play size={20} className="fill-white text-white" />}
                                                    </button>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-sm font-bold text-white truncate font-plus mb-1 group-hover:text-[#1DB954] transition-colors">{track.title}</h4>
                                                <p className="text-xs text-white/40 truncate font-syncopate uppercase tracking-wider">{track.artist}</p>
                                            </div>
                                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/20 group-hover:bg-[#1DB954] group-hover:text-black transition-all border border-white/5 group-hover:border-[#1DB954]">
                                                <Plus size={18} />
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </AnimatePresence>

                        {searchResults.length === 0 && !searching && (
                            <div className="h-full flex flex-col items-center justify-center text-center opacity-30 mt-10">
                                <Search size={48} className="mb-4" />
                                <p className="font-syncopate uppercase tracking-widest text-xs">Awaiting Input Signal</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Panel: Selected */}
                <div className="lg:col-span-5 bg-[#080808]/50 flex flex-col min-h-0">
                    <div className="p-8 border-b border-white/5 shrink-0">
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-[10px] font-syncopate uppercase tracking-[0.3em] text-white/30 font-bold">Active Nodes</p>
                            <span className="text-[10px] font-mono text-[#1DB954] bg-[#1DB954]/10 px-3 py-1 rounded-full border border-[#1DB954]/20">{selectedTracks.length}/5</span>
                        </div>
                        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-[#1DB954] transition-all duration-500"
                                style={{ width: `${(selectedTracks.length / 5) * 100}%` }}
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-4" data-lenis-prevent>
                        <AnimatePresence mode="popLayout">
                            {selectedTracks.length === 0 ? (
                                <div className="h-48 flex flex-col items-center justify-center text-center border border-dashed border-white/10 rounded-[2rem] bg-white/[0.01]">
                                    <Music className="w-10 h-10 text-white/10 mx-auto mb-4" />
                                    <p className="text-[10px] text-white/20 font-syncopate uppercase tracking-[0.2em]">Matrix Empty</p>
                                </div>
                            ) : (
                                selectedTracks.map((track) => (
                                    <motion.div
                                        key={track.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="group flex items-center gap-4 p-3 rounded-[1.2rem] bg-[#1DB954]/[0.05] border border-[#1DB954]/20 hover:bg-[#1DB954]/10 transition-colors relative pr-12"
                                    >
                                        <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#1DB954] rounded-r-full" />
                                        <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-white/10">
                                            <img src={track.cover} alt={track.title} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-xs font-bold text-white truncate font-plus mb-1">{track.title}</h4>
                                            <p className="text-[10px] text-white/50 truncate font-syncopate uppercase tracking-wider">{track.artist}</p>
                                        </div>
                                        <button
                                            onClick={() => handleRemoveTrack(track.id)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all border border-red-500/20"
                                        >
                                            <X size={14} />
                                        </button>
                                    </motion.div>
                                ))
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="p-8 mt-auto bg-[#0A0A0A] border-t border-white/5 shrink-0">
                        <Button
                            variant="luxury"
                            className="w-full h-16 rounded-[1.5rem] gap-3 text-xs font-syncopate uppercase tracking-[0.2em] bg-[#1DB954] hover:bg-[#1efc6e] text-black border-none shadow-[0_0_30px_rgba(29,185,84,0.2)] font-bold transition-all hover:scale-[1.02]"
                            onClick={handleSave}
                            disabled={loading}
                        >
                            {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                            Synchronize Matrix
                        </Button>
                    </div>
                </div>
            </div>
        </LuxuryModal>
    );
};
