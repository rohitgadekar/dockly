import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useEffect } from "react";

export const useProfile = (username: string | undefined) => {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ["profile", username],
    queryFn: async () => {
      if (!username) return null;

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("username", username)
        .single();

      if (profileError) throw profileError;

      const [ventures, socials, products, stories] = await Promise.all([
        supabase
          .from("ventures")
          .select("*")
          .eq("profile_id", profile.id)
          .order("order_index", { ascending: true }),
        supabase
          .from("social_links")
          .select("*")
          .eq("profile_id", profile.id)
          .order("order_index", { ascending: true }),
        supabase
          .from("curated_products")
          .select("*")
          .eq("profile_id", profile.id)
          .order("order_index", { ascending: true }),
        supabase
          .from("stories")
          .select("*")
          .eq("profile_id", profile.id)
          .gt("expires_at", new Date().toISOString())
          .order("created_at", { ascending: false })
      ]);

      return {
        ...profile,
        ventures: ventures.data || [],
        socials: socials.data || [],
        products: products.data || [],
        stories: stories.data || [],
      };
    },
    enabled: !!username,
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
