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

            return {
                profile: profile.data,
                ventures: ventures.data || [],
                socials: socials.data || [],
                products: products.data || [],
                stories: stories.data || [],
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
