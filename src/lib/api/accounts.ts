import { supabase } from "@/integrations/supabase/client";
import { Account } from "@/types/accounts";

export async function fetchAccounts() {
  const { data, error } = await supabase
    .from("accounts")
    .select(`
      id,
      name,
      type,
      balance,
      updated_at as lastUpdated,
      account_history (
        date,
        balance
      )
    `)
    .order("name");

  if (error) throw error;
  
  return data.map((account: any) => ({
    id: account.id,
    name: account.name,
    type: account.type,
    balance: account.balance,
    lastUpdated: account.lastUpdated,
    history: account.account_history.map((h: any) => ({
      date: new Date(h.date).toISOString().split('T')[0],
      balance: h.balance,
    })),
  }));
}

export async function createAccount(account: Partial<Account>) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from("accounts")
    .insert({
      name: account.name,
      type: account.type,
      balance: account.balance,
      user_id: user.id,
    })
    .select()
    .single();

  if (error) throw error;

  // Create initial history record
  await supabase
    .from("account_history")
    .insert({
      account_id: data.id,
      balance: account.balance,
    });

  return data;
}

export async function updateAccount(id: string, account: Partial<Account>) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from("accounts")
    .update({
      name: account.name,
      type: account.type,
      balance: account.balance,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  // Create new history record
  await supabase
    .from("account_history")
    .insert({
      account_id: id,
      balance: account.balance,
    });

  return data;
}