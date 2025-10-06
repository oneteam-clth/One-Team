import { supabase } from "@/integrations/supabase/client";

export async function createCheckoutPreference() {
  const { data, error } = await supabase.functions.invoke('create-preference', {
    body: {},
  });

  if (error) throw error;
  return data;
}

export async function redirectToCheckout(initPoint: string) {
  window.location.href = initPoint;
}
