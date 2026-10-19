import { useMemo, useEffect, Component, ErrorInfo, ReactNode } from "react";
import { useParams } from "react-router-dom";
import { useProfile, useTrackClick } from "@/hooks/useProfile";
import { ShieldCheck, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ProfileView } from "@/components/profile/ProfileView";
import { ProfileLoading } from "@/components/profile/ProfileLoading";
import { useTitle } from "@/hooks/useTitle";
import { resolveTheme } from "@/lib/themeRegistry";

interface ErrorBoundaryProps {
    children: ReactNode;
    fallbackPrimary?: string;
    fallbackBg?: string;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

class ProfileErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Profile rendering anomaly:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            const primary = this.props.fallbackPrimary || "#D4AF37";
            const bg = this.props.fallbackBg || "#050505";

            return (
                <div
                    className="min-h-screen flex flex-col items-center justify-center p-6 text-center select-none"
                    style={{ backgroundColor: bg }}
                >
                    <div
                        className="w-20 h-20 rounded-3xl flex items-center justify-center mb-8 border shadow-2xl relative"
                        style={{
                            borderColor: `${primary}33`,
                            backgroundColor: `${primary}12`,
                            color: primary,
                        }}
                    >
                        <ShieldCheck size={36} />
                    </div>
                    <h1
                        className="text-2xl sm:text-3xl font-syncopate font-bold mb-3 uppercase tracking-wider"
                        style={{ color: "#FFFFFF" }}
                    >
                        Citadel Synchronizing
                    </h1>
                    <p className="text-white/40 mb-8 font-plus max-w-sm uppercase tracking-widest text-[11px] leading-relaxed">
                        A temporal interface irregularity occurred while materializing this estate.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <Button
                            variant="luxury"
                            onClick={() => window.location.reload()}
                            className="px-8 py-5 rounded-2xl shadow-xl flex items-center gap-2"
                        >
                            <RefreshCw size={14} />
                            <span>Re-establish Uplink</span>
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => (window.location.href = "/")}
                            className="px-8 py-5 rounded-2xl border-white/10"
                        >
                            Sanctuary
                        </Button>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}

const Profile = () => {
    const { username } = useParams();
    const cleanUsername = useMemo(() => {
        if (!username) return undefined;
        return username.replace(/^@/, "").trim().toLowerCase();
    }, [username]);

    const { data: user, isLoading, error } = useProfile(cleanUsername);
    useTitle(user ? (user.full_name || user.username || cleanUsername || "Digital Estate") : "Materializing Persona");
    const trackClick = useTrackClick();

    // Cache theme in sessionStorage so repeat visits show user's customized theme instantly during loading
    const cachedTheme = useMemo(() => {
        try {
            if (!cleanUsername) return null;
            const item = sessionStorage.getItem(`docked_theme_${cleanUsername}`);
            return item ? JSON.parse(item) : null;
        } catch {
            return null;
        }
    }, [cleanUsername]);

    useEffect(() => {
        if (user?.theme && cleanUsername) {
            try {
                sessionStorage.setItem(`docked_theme_${cleanUsername}`, JSON.stringify(user.theme));
            } catch {
                // ignore
            }
        }
    }, [user?.theme, cleanUsername]);

    // Active theme resolved from user or cached state
    const activeTheme = useMemo(() => {
        return resolveTheme(user?.theme || cachedTheme);
    }, [user?.theme, cachedTheme]);

    // Sync theme colors to global CSS scrollbars and viewport status bar
    useEffect(() => {
        const root = document.documentElement;
        root.style.setProperty("--theme-primary", activeTheme.primary);
        root.style.setProperty("--theme-bg", activeTheme.bg);
        root.style.setProperty("--scrollbar-thumb", `${activeTheme.primary}66`);
        root.style.setProperty("--scrollbar-thumb-hover", activeTheme.primary);
        root.style.setProperty(
            "--scrollbar-track",
            activeTheme.isLight ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.02)"
        );

        return () => {
            root.style.removeProperty("--theme-primary");
            root.style.removeProperty("--theme-bg");
            root.style.removeProperty("--scrollbar-thumb");
            root.style.removeProperty("--scrollbar-thumb-hover");
            root.style.removeProperty("--scrollbar-track");
        };
    }, [activeTheme]);

    const handleLinkClick = (linkType: string, linkId: string, linkUrl: string) => {
        if (user?.id) {
            try {
                trackClick.mutate({
                    profileId: user.id,
                    linkType,
                    linkId,
                    linkUrl,
                });
            } catch {
                // ignore analytics errors
            }
        }
        if (linkUrl) {
            window.open(linkUrl, "_blank", "noopener,noreferrer");
        }
    };

    if (isLoading) {
        return (
            <ProfileLoading
                title="CITADEL"
                theme={activeTheme}
                estateName={cleanUsername}
            />
        );
    }

    if (error || !user) {
        return (
            <div
                className="min-h-screen flex flex-col items-center justify-center p-6 text-center transition-colors duration-700"
                style={{ backgroundColor: activeTheme.bg || "#050505" }}
            >
                <div
                    className="w-24 h-24 rounded-full flex items-center justify-center mb-8 border shadow-2xl"
                    style={{
                        borderColor: `${activeTheme.primary}33`,
                        backgroundColor: `${activeTheme.primary}10`,
                        color: activeTheme.primary,
                    }}
                >
                    <ShieldCheck size={40} />
                </div>
                <h1
                    className="text-3xl sm:text-4xl font-syncopate font-bold mb-4 uppercase tracking-tighter"
                    style={{ color: activeTheme.isLight ? "#111111" : "#FFFFFF" }}
                >
                    Identity Expired
                </h1>
                <p className="text-white/40 mb-12 font-plus max-w-sm uppercase tracking-widest text-xs leading-relaxed">
                    The requested digital estate has been de-allocated or is currently under stealth protocol.
                </p>
                <Button
                    variant="luxury"
                    onClick={() => (window.location.href = "/")}
                    className="px-10 py-6 rounded-2xl shadow-2xl"
                >
                    Return to Sanctuary
                </Button>
            </div>
        );
    }

    return (
        <ProfileErrorBoundary
            fallbackPrimary={activeTheme.primary}
            fallbackBg={activeTheme.bg}
        >
            <ProfileView user={user} onLinkClick={handleLinkClick} />
        </ProfileErrorBoundary>
    );
};

export default Profile;
