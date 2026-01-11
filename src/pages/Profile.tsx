import { useParams } from "react-router-dom";
import { useProfile, useTrackClick } from "@/hooks/useProfile";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ProfileView } from "@/components/profile/ProfileView";
import { ProfileLoading } from "@/components/profile/ProfileLoading";
import { useTitle } from "@/hooks/useTitle";

const Profile = () => {
    const { username } = useParams();
    const { data: user, isLoading, error } = useProfile(username);
    useTitle(user ? (user.full_name || user.username || username || "Digital Estate") : "Materializing Persona");
    const trackClick = useTrackClick();

    const handleLinkClick = (linkType: string, linkId: string, linkUrl: string) => {
        if (user?.id) {
            trackClick.mutate({
                profileId: user.id,
                linkType,
                linkId,
                linkUrl
            });
        }
        window.open(linkUrl, '_blank');
    };

    if (isLoading) {
        return <ProfileLoading title="CITADEL" />;
    }

    if (error || !user) {
        return (
            <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 text-center">
                <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-8 border border-white/10">
                    <ShieldCheck size={40} className="text-white/10" />
                </div>
                <h1 className="text-4xl font-syncopate font-bold mb-4 uppercase tracking-tighter">Identity Expired</h1>
                <p className="text-white/30 mb-12 font-plus max-w-sm uppercase tracking-widest text-xs leading-relaxed">The requested digital estate has been de-allocated or is currently under stealth protocol.</p>
                <Button variant="luxury" onClick={() => window.location.href = "/"} className="px-10 py-6 rounded-2xl shadow-2xl">Return to Sanctuary</Button>
            </div>
        );
    }

    return <ProfileView user={user} onLinkClick={handleLinkClick} />;
};

export default Profile;
