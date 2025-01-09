import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const generalSettingsSchema = z.object({
  currency: z.string().min(1, { message: "Please select a currency" }),
  locale: z.string().min(1, { message: "Please select a locale" }),
  darkMode: z.string().min(1, { message: "Please select a theme" }),
  dateFormat: z.string().min(1, { message: "Please select a date format" }),
  averageMonths: z.string().min(1, { message: "Please select number of months" }),
});

export type GeneralSettingsValues = z.infer<typeof generalSettingsSchema>;

const defaultValues = {
  currency: "USD",
  locale: "en-US",
  darkMode: "light",
  dateFormat: "MM/dd/yyyy",
  averageMonths: "3",
};

export const useSettingsForm = () => {
  const form = useForm<GeneralSettingsValues>({
    resolver: zodResolver(generalSettingsSchema),
    defaultValues,
  });

  const { data: settings, isLoading } = useQuery({
    queryKey: ["user-settings"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("user_settings")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });

  // Only reset form when we have settings data
  if (settings && !isLoading) {
    form.reset({
      currency: settings.currency,
      locale: settings.locale,
      darkMode: settings.dark_mode,
      dateFormat: settings.date_format,
      averageMonths: String(settings.average_months),
    }, { keepDefaultValues: true });
  }

  return {
    form,
    settings,
    isLoading,
  };
};