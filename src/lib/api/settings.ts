import { supabase } from "@/integrations/supabase/client";

export type UserSettings = {
  currency: string;
  locale: string;
  darkMode: string;
  dateFormat: string;
  averageMonths: number;
};

export async function fetchUserSettings() {
  const { data, error } = await supabase
    .from("user_settings")
    .select("*")
    .maybeSingle();

  if (error && error.code !== "PGRST116") throw error;
  
  return data ? {
    currency: data.currency,
    locale: data.locale,
    darkMode: data.dark_mode,
    dateFormat: data.date_format,
    averageMonths: data.average_months,
  } : null;
}

export async function updateUserSettings(settings: UserSettings) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from("user_settings")
    .upsert({
      user_id: user.id,
      currency: settings.currency,
      locale: settings.locale,
      dark_mode: settings.darkMode,
      date_format: settings.dateFormat,
      average_months: settings.averageMonths,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}