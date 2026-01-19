import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Toaster } from "sonner";
import Landing from "@/pages/Landing";
import Dashboard from "@/pages/Dashboard";
import Profile from "@/pages/Profile";
import Auth from "@/pages/Auth";
import UpdatePassword from "@/pages/UpdatePassword";
import NotFound from "@/pages/NotFound";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { PreviewRedirect } from "@/components/dashboard/PreviewRedirect";
import { ReactLenis } from '@studio-freight/react-lenis';

import CommandDeck from "@/pages/dashboard/CommandDeck";
import Ventures from "@/pages/dashboard/Ventures";
import Socials from "@/pages/dashboard/Socials";
import Marketplace from "@/pages/dashboard/Marketplace";
import Settings from "@/pages/dashboard/Settings";
import Insights from "@/pages/dashboard/Insights";
import Atmospherics from "@/pages/dashboard/Atmospherics";
import Sonic from "@/pages/dashboard/Sonic";
import Identity from "@/pages/dashboard/Identity";
import Audience from "@/pages/dashboard/Audience";
import Inquiries from "@/pages/dashboard/Inquiries";
import Protocol from "@/pages/Protocol";

const queryClient = new QueryClient();

const AuthHashHandler = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const hash = window.location.hash;
        if (hash) {
            const params = new URLSearchParams(hash.substring(1));
            const type = params.get("type");
            const accessToken = params.get("access_token");
            const errorCode = params.get("error_code");

            // Redirect if we have a valid token OR an error from an invite/recovery attempt
            if ((type === "invite" || type === "recovery") && (accessToken || errorCode)) {
                // Tactical redirect to credential update matrix
                navigate(`/auth/update-password${hash}`, { replace: true });
            }
        }
    }, [navigate]);

    useEffect(() => {
        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault();
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
            if (
                e.key === "F12" ||
                (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "J" || e.key === "C")) ||
                (e.ctrlKey && e.key === "U") ||
                (e.metaKey && e.altKey && e.key === "i") // Mac support
            ) {
                e.preventDefault();
            }
        };

        document.addEventListener("contextmenu", handleContextMenu);
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("contextmenu", handleContextMenu);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    return null;
};

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <ReactLenis root>
                <BrowserRouter>
                    <AuthHashHandler />
                    <div className="relative min-h-screen">
                        <div className="noise" />
                        <Toaster
                            theme="dark"
                            position="bottom-right"
                            expand={true}
                            richColors
                            // closeButton
                            toastOptions={{
                                classNames: {
                                    icon: "scale-[1.4] opacity-100 mr-4",
                                },
                                style: {
                                    background: '#080808',
                                    border: '1px solid rgba(255, 255, 255, 0.08)',
                                    backdropFilter: 'blur(16px)',
                                    borderRadius: '1.2rem',
                                    padding: '16px 24px',
                                    color: '#F5F5F5',
                                    fontFamily: 'Syncopate, sans-serif',
                                    fontSize: '11px',
                                    letterSpacing: '0.1em',
                                    textTransform: 'uppercase',
                                    fontWeight: '600',
                                    boxShadow: '0 20px 40px -10px rgba(0,0,0,0.8), 0 0 20px -5px rgba(212, 175, 55, 0.1)',
                                },
                            }}
                        />
                        <Routes>
                            <Route path="/" element={<Landing />} />
                            <Route path="/auth" element={<Auth />} />
                            <Route path="/auth/update-password" element={<UpdatePassword />} />
                            <Route path="/dashboard" element={<AuthGuard><Dashboard /></AuthGuard>}>
                                <Route index element={<CommandDeck />} />
                                <Route path="ventures" element={<Ventures />} />
                                <Route path="socials" element={<Socials />} />
                                <Route path="marketplace" element={<Marketplace />} />
                                <Route path="settings" element={<Settings />} />
                                <Route path="account" element={<Settings />} />
                                <Route path="identity" element={<Identity />} />
                                <Route path="insights" element={<Insights />} />
                                <Route path="atmospherics" element={<Atmospherics />} />
                                <Route path="sonic" element={<Sonic />} />
                                <Route path="audience" element={<Audience />} />
                                <Route path="inquiries" element={<Inquiries />} />
                            </Route>
                            <Route path="/preview" element={<PreviewRedirect />} />
                            <Route path="/protocol/:id" element={<Protocol />} />
                            <Route path="/:username" element={<Profile />} />
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </div>
                </BrowserRouter>
            </ReactLenis>
        </QueryClientProvider>
    );
}

export default App;
