import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useEffect } from "react";

export function useDashboard() {
    const queryClient = useQueryClient();
    
    const query = useQuery({
        queryKey: ["dashboard-data"],
        queryFn: async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Not authenticated");

            const [profile, ventures, socials, products, stories, profileViews, linkClicks] = await Promise.all([
                supabase.from("profiles").select("*").eq("id", user.id).single(),
                supabase.from("ventures").select("*").eq("profile_id", user.id).order("created_at", { ascending: false }),
                supabase.from("social_links").select("*").eq("profile_id", user.id).order("order_index"),
                supabase.from("curated_products").select("*").eq("profile_id", user.id).order("order_index"),
                supabase.from("stories").select("*").eq("profile_id", user.id).gt("expires_at", new Date().toISOString()).order("created_at", { ascending: false }),
                supabase.from("profile_views").select("*").eq("profile_id", user.id),
                supabase.from("link_clicks").select("*").eq("profile_id", user.id)
            ]);

            // Helper to generate temporary signed URLs for private content
            const resolveSecureUrl = async (url: string, bucket: string) => {
                if (!url || url.startsWith('http')) return url;
                const { data } = await supabase.storage.from(bucket).createSignedUrl(url, 3600); // 1h expiry for dashboard
                return data?.signedUrl || url;
            };

            const [avatarUrl, resolvedVentures, resolvedProducts, resolvedStories] = await Promise.all([
                resolveSecureUrl(profile.data?.avatar_url, 'avatars'),
                Promise.all((ventures.data || []).map(async v => ({ ...v, logo_url: await resolveSecureUrl(v.logo_url, 'ventures') }))),
                Promise.all((products.data || []).map(async p => ({ ...p, image_url: await resolveSecureUrl(p.image_url, 'products') }))),
                Promise.all((stories.data || []).map(async s => ({ ...s, media_url: await resolveSecureUrl(s.media_url, 'story-media') })))
            ]);

            return {
                profile: {
                    ...(profile.data || {}),
                    avatar_url: avatarUrl
                },
                ventures: resolvedVentures,
                socials: socials.data || [],
                products: resolvedProducts,
                stories: resolvedStories,
                analytics: {
                    profileViews: profileViews.data || [],
                    linkClicks: linkClicks.data || [],
                }
            };
        },
    });

    // Neural Real-time Synchronization Matrix
    useEffect(() => {
        // Subscribe to all relevant changes for the current user
        const channel = supabase
            .channel('dashboard-realtime')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'profiles' },
                () => queryClient.invalidateQueries({ queryKey: ["dashboard-data"] })
            )
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'ventures' },
                () => queryClient.invalidateQueries({ queryKey: ["dashboard-data"] })
            )
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'social_links' },
                () => queryClient.invalidateQueries({ queryKey: ["dashboard-data"] })
            )
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'curated_products' },
                () => queryClient.invalidateQueries({ queryKey: ["dashboard-data"] })
            )
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'profile_views' },
                () => queryClient.invalidateQueries({ queryKey: ["dashboard-data"] })
            )
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'link_clicks' },
                () => queryClient.invalidateQueries({ queryKey: ["dashboard-data"] })
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [queryClient]);

    return query;
}
