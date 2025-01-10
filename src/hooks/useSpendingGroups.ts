import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SpendingGroup } from "@/types/spending-groups";
import { toast } from "sonner";

export const useSpendingGroups = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["spending-groups"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("spending_groups")
        .select("*")
        .order("name");
      
      if (error) throw error;
      return data as SpendingGroup[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (name: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { error } = await supabase
        .from("spending_groups")
        .insert({ 
          name,
          user_id: user.id 
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["spending-groups"] });
      toast.success("Spending group created successfully");
    },
    onError: (error) => {
      toast.error("Failed to create spending group");
      console.error("Error creating spending group:", error);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("spending_groups")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["spending-groups"] });
      toast.success("Spending group deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete spending group");
      console.error("Error deleting spending group:", error);
    },
  });

  return {
    ...query,
    createSpendingGroup: createMutation.mutate,
    deleteSpendingGroup: deleteMutation.mutate,
  };
};