import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UserSettings } from "@/types/settings";

const defaultSettings: UserSettings = {
  currency: "USD",
  locale: "en-US",
  dark_mode: "light",
  date_format: "MM/dd/yyyy",
  average_months: 3,
};

export const useSettings = () => {
  return useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_settings")
        .select("*")
        .maybeSingle();

      if (error && error.code !== "PGRST116") throw error;
      
      // If no settings found, create default settings for the user
      if (!data) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Not authenticated");

        const { data: newSettings, error: insertError } = await supabase
          .from("user_settings")
          .insert({
            user_id: user.id,
            ...defaultSettings
          })
          .select()
          .single();

        if (insertError) throw insertError;
        return newSettings as UserSettings;
      }

      return data as UserSettings;
    },
  });
};