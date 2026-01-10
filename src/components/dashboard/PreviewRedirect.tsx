import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

export function PreviewRedirect() {
    const navigate = useNavigate();

    useEffect(() => {
        const getProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                navigate("/auth");
                return;
            }

            const { data: profile } = await supabase
                .from("profiles")
                .select("username")
                .eq("id", user.id)
                .single();

            if (profile?.username) {
                navigate(`/${profile.username}`);
            } else {
                navigate("/dashboard/settings");
            }
        };

        getProfile();
    }, [navigate]);

    return (
        <div className="h-screen flex flex-col items-center justify-center gap-4 bg-[#050505]">
            <Loader2 className="animate-spin text-luxury-gold" size={40} />
            <p className="text-white/20 font-syncopate uppercase tracking-[0.3em] text-xs">Launching Live Preview...</p>
        </div>
    );
}
