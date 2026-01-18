import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useEffect } from "react";

export const useProfile = (username: string | undefined) => {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ["profile", username],
    queryFn: async () => {
      if (!username) return null;

      // Primary Point Lookup (Super fast with unique username index)
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("username", username)
        .maybeSingle(); // maybeSingle returns null instead of throwing PGRST116 error

      if (profileError) throw profileError;
      if (!profile) return null;

      // Concurrent fetching of all content sections
      const [ventures, socials, products, stories] = await Promise.all([
        supabase.from("ventures").select("*").eq("profile_id", profile.id).order("order_index", { ascending: true }),
        supabase.from("social_links").select("*").eq("profile_id", profile.id).order("order_index", { ascending: true }),
        supabase.from("curated_products").select("*").eq("profile_id", profile.id).order("order_index", { ascending: true }),
        supabase.from("stories").select("*").eq("profile_id", profile.id).gt("expires_at", new Date().toISOString()).order("created_at", { ascending: false })
      ]);

      // Helper to generate long-lived URLs (1 year) for avatars to prevent expiration
      const resolvePermanentUrl = async (url: string, bucket: string) => {
        if (!url || url.startsWith('http')) return url;
        // Using 1 year (31,536,000 seconds) as a "permanent" solution
        const { data } = await supabase.storage.from(bucket).createSignedUrl(url, 31536000);
        return data?.signedUrl || url;
      };

      const resolveSecureUrl = async (url: string, bucket: string) => {
        if (!url || url.startsWith('http')) return url;
        const { data } = await supabase.storage.from(bucket).createSignedUrl(url, 3600); // 1h expiry
        return data?.signedUrl || url;
      };

      const [avatarUrl, resolvedVentures, resolvedStories, resolvedProducts] = await Promise.all([
        resolvePermanentUrl(profile.avatar_url, 'avatars'),
        Promise.all((ventures.data || []).map(async v => ({ ...v, logo_url: await resolveSecureUrl(v.logo_url, 'ventures') }))),
        Promise.all((stories.data || []).map(async s => ({ ...s, media_url: await resolveSecureUrl(s.media_url, 'stories') }))),
        Promise.all((products.data || []).map(async p => ({ ...p, image_url: await resolveSecureUrl(p.image_url, 'products') })))
      ]);

      return {
        ...profile,
        avatar_url: avatarUrl,
        ventures: resolvedVentures,
        socials: socials.data || [],
        products: resolvedProducts,
        stories: resolvedStories,
      };
    },
    enabled: !!username,
    retry: false, // Disable retries for faster "Not Found" state
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  // Analytics: Track Profile View
  useEffect(() => {
    if (query.data?.id) {
      const trackView = async () => {
        try {
          await supabase.from("profile_views").insert([
            {
              profile_id: query.data.id,
              user_agent: navigator.userAgent,
              referrer: document.referrer,
            },
          ]);
        } catch (e) {
          console.error("Analytics Error:", e);
        }
      };
      trackView();
    }
  }, [query.data?.id]);

  // Real-time synchronization for profile page
  useEffect(() => {
    if (!query.data?.id) return;

    const channel = supabase
      .channel(`profile-${query.data.id}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'profiles', filter: `id=eq.${query.data.id}` },
        () => queryClient.invalidateQueries({ queryKey: ["profile", username] })
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'ventures', filter: `profile_id=eq.${query.data.id}` },
        () => queryClient.invalidateQueries({ queryKey: ["profile", username] })
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'social_links', filter: `profile_id=eq.${query.data.id}` },
        () => queryClient.invalidateQueries({ queryKey: ["profile", username] })
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'curated_products', filter: `profile_id=eq.${query.data.id}` },
        () => queryClient.invalidateQueries({ queryKey: ["profile", username] })
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'stories', filter: `profile_id=eq.${query.data.id}` },
        () => queryClient.invalidateQueries({ queryKey: ["profile", username] })
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [query.data?.id, username, queryClient]);

  return query;
};

export const useTrackClick = () => {
  return useMutation({
    mutationFn: async ({
      profileId,
      linkType,
      linkId,
      linkUrl,
    }: {
      profileId: string;
      linkType: string;
      linkId: string;
      linkUrl: string;
    }) => {
      return supabase.from("link_clicks").insert([
        {
          profile_id: profileId,
          link_type: linkType,
          link_id: linkId,
          link_url: linkUrl,
        },
      ]);
    },
  });
};
