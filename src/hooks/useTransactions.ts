import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Transaction } from "@/types/transactions";

export const useTransactions = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["transactions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("transactions")
        .select(`
          *,
          accounts (
            name,
            currency,
            type
          )
        `)
        .order("date", { ascending: false });

      if (error) throw error;
      return data as Transaction[];
    },
  });

  const markAsSeen = useMutation({
    mutationFn: async (transactionId: string) => {
      const { error } = await supabase
        .from("transactions")
        .update({ seen: true })
        .eq("id", transactionId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });

  return {
    ...query,
    markAsSeen,
  };
};