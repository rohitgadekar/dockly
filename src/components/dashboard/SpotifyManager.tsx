import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import {
    Search,
    Plus,
    X,
    Loader2,
    Save,
    Music,
    Play,
    Pause
} from "lucide-react";
import { SiSpotify } from "react-icons/si";
import { supabase } from "@/lib/supabase";
import { useDashboard } from "@/hooks/useDashboard";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

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

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
                    />
                    <div className="fixed inset-0 flex items-center justify-center z-[101] pointer-events-none p-4">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="w-full max-w-2xl bg-[#080808] border border-[#1DB954]/20 rounded-[2rem] overflow-hidden pointer-events-auto relative shadow-[0_0_50px_rgba(29,185,84,0.1)] flex flex-col max-h-[85vh]"
                        >
                            <div className="absolute top-0 right-0 w-64 h-64 bg-[#1DB954]/5 blur-[80px] -mr-32 -mt-32 pointer-events-none" />

                            {/* Header */}
                            <div className="p-8 border-b border-white/5 flex items-center justify-between relative z-10 shrink-0">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-[#1DB954]/10 flex items-center justify-center border border-[#1DB954]/20 text-[#1DB954]">
                                        <SiSpotify size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-syncopate font-bold uppercase tracking-tight text-white">Sonic Matrix</h2>
                                        <p className="text-xs text-white/40 font-syncopate uppercase tracking-widest mt-1">Curate your top tracks</p>
                                    </div>
                                </div>
                                <button onClick={handleClose} className="text-white/20 hover:text-white transition-colors">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-8">
                                {/* Search Section */}
                                <div className="space-y-4">
                                    <form onSubmit={handleSearch} className="relative">
                                        <input
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Search for tracks..."
                                            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-[#1DB954]/40 focus:bg-white/[0.05] transition-all text-white font-plus"
                                            autoFocus
                                        />
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                                        <Button
                                            type="submit"
                                            disabled={searching}
                                            className="absolute right-2 top-2 bottom-2 px-4 rounded-xl bg-[#1DB954]/10 hover:bg-[#1DB954]/20 text-[#1DB954] text-xs font-syncopate uppercase tracking-wider"
                                        >
                                            {searching ? <Loader2 className="animate-spin" size={14} /> : "Search"}
                                        </Button>
                                    </form>

                                    <AnimatePresence>
                                        {searchResults.length > 0 && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="space-y-2 overflow-hidden"
                                            >
                                                <p className="text-[10px] font-syncopate uppercase tracking-widest text-[#1DB954]/60 pl-2">Search Results</p>
                                                {searchResults.map((track) => (
                                                    <motion.div
                                                        key={track.id}
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-transparent hover:border-white/5 group cursor-pointer transition-all"
                                                        onClick={() => handleAddTrack(track)}
                                                    >
                                                        <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0">
                                                            <img src={track.cover} alt={track.title} className="w-full h-full object-cover" />
                                                            {track.previewUrl && (
                                                                <button
                                                                    onClick={(e) => { e.stopPropagation(); togglePreview(track.previewUrl); }}
                                                                    className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                                >
                                                                    {playingPreview === track.previewUrl ? <Pause size={12} className="fill-white text-white" /> : <Play size={12} className="fill-white text-white" />}
                                                                </button>
                                                            )}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="text-sm font-bold text-white truncate">{track.title}</h4>
                                                            <p className="text-xs text-white/40 truncate">{track.artist}</p>
                                                        </div>
                                                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/40 group-hover:bg-[#1DB954] group-hover:text-black transition-all">
                                                            <Plus size={16} />
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Selected Tracks */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <p className="text-[10px] font-syncopate uppercase tracking-widest text-white/40 pl-2">Authenticated Tracks ({selectedTracks.length}/5)</p>
                                    </div>

                                    {selectedTracks.length === 0 ? (
                                        <div className="py-12 text-center border border-dashed border-white/10 rounded-2xl">
                                            <Music className="w-8 h-8 text-white/10 mx-auto mb-4" />
                                            <p className="text-xs text-white/20 font-syncopate uppercase tracking-wider">No tracks linked</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            {selectedTracks.map((track) => (
                                                <motion.div
                                                    key={track.id}
                                                    layout
                                                    initial={{ opacity: 0, scale: 0.95 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    className="flex items-center gap-4 p-3 rounded-xl bg-[#1DB954]/[0.05] border border-[#1DB954]/20 group"
                                                >
                                                    <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0">
                                                        <img src={track.cover} alt={track.title} className="w-full h-full object-cover" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="text-sm font-bold text-white truncate">{track.title}</h4>
                                                        <p className="text-xs text-white/40 truncate">{track.artist}</p>
                                                    </div>
                                                    <button
                                                        onClick={() => handleRemoveTrack(track.id)}
                                                        className="w-8 h-8 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="p-8 border-t border-white/5 shrink-0 flex gap-4">
                                <Button variant="ghost" className="flex-1 h-12 rounded-xl text-xs font-syncopate uppercase tracking-widest" onClick={handleClose}>
                                    Cancel
                                </Button>
                                <Button
                                    variant="luxury"
                                    className="flex-[2] h-12 rounded-xl text-xs font-syncopate uppercase tracking-widest bg-[#1DB954] hover:bg-[#1efc6e] text-black border-none"
                                    onClick={handleSave}
                                    disabled={loading}
                                >
                                    {loading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                                    Sync to Profile
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};
