import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { Camera, Loader2, UploadCloud, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface AvatarUploadProps {
    currentUrl?: string;
    onUploadComplete: (url: string) => void;
}

export const AvatarUpload = ({ currentUrl, onUploadComplete }: AvatarUploadProps) => {
    const [uploading, setUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true);
            const file = event.target.files?.[0];
            if (!file) return;

            // Preview immediately
            const objectUrl = URL.createObjectURL(file);
            setPreviewUrl(objectUrl);

            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Unauthorized");

            const fileExt = file.name.split('.').pop();
            const filePath = `${user.id}/${Math.random()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            // Update profile table
            const { error: updateError } = await supabase
                .from('profiles')
                .update({ avatar_url: publicUrl })
                .eq('id', user.id);

            if (updateError) throw updateError;

            onUploadComplete(publicUrl);
            toast.success("Identity Visual Synchronized.");
        } catch (error: any) {
            toast.error(error.message);
            setPreviewUrl(null);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="flex flex-col items-center gap-6">
            <div className="relative group">
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="w-40 h-40 rounded-full border-2 border-luxury-gold p-1.5 relative overflow-hidden bg-black/40 backdrop-blur-sm"
                >
                    <div className="w-full h-full rounded-full overflow-hidden relative">
                        {(previewUrl || currentUrl) ? (
                            <img
                                src={previewUrl || currentUrl}
                                alt="Avatar Preview"
                                className="w-full h-full object-cover mix-blend-luminosity hover:mix-blend-normal transition-all duration-700"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-white/5 text-luxury-gold/20">
                                <UploadCloud size={48} strokeWidth={1} />
                            </div>
                        )}

                        <AnimatePresence>
                            {uploading && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center gap-2"
                                >
                                    <Loader2 className="animate-spin text-luxury-gold" size={32} />
                                    <span className="text-[10px] font-syncopate uppercase tracking-widest text-luxury-gold/60">Uploading</span>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>

                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-2 right-2 w-10 h-10 bg-luxury-gold rounded-full flex items-center justify-center text-black shadow-2xl hover:scale-110 transition-transform active:scale-95 group-hover:rotate-12 duration-500"
                >
                    <Camera size={18} />
                </button>
            </div>

            <input
                type="file"
                ref={fileInputRef}
                onChange={handleUpload}
                accept="image/*"
                className="hidden"
                disabled={uploading}
            />

            <div className="text-center">
                <p className="text-[10px] font-syncopate uppercase tracking-[0.3em] text-white/40 mb-1">Portrait Resolution</p>
                <div className="flex items-center gap-2 text-luxury-gold/60 justify-center">
                    <CheckCircle2 size={12} />
                    <span className="text-[9px] font-syncopate uppercase tracking-widest">Biometric Validated</span>
                </div>
            </div>
        </div>
    );
};
