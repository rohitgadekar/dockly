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

            if ((type === "invite" || type === "recovery") && accessToken) {
                // Tactical redirect to credential update matrix
                navigate(`/auth/update-password${hash}`, { replace: true });
            }
        }
    }, [navigate]);

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
                            closeButton
                            toastOptions={{
                                style: {
                                    background: 'rgba(5, 5, 5, 0.98)',
                                    border: '1px solid rgba(212, 175, 55, 0.4)',
                                    backdropFilter: 'blur(30px)',
                                    borderRadius: '12px',
                                    padding: '18px 28px',
                                    color: '#D4AF37',
                                    fontFamily: 'Syncopate, sans-serif',
                                    fontSize: '9px',
                                    letterSpacing: '0.25em',
                                    textTransform: 'uppercase',
                                    fontWeight: '700',
                                    boxShadow: '0 0 40px rgba(212, 175, 55, 0.15)',
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
