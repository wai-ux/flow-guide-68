import { createServerFn } from "@tanstack/react-start";
import { DEMO_EMAIL, DEMO_NAME, DEMO_PASSWORD } from "./demo-account";

/** Makes sure the shared demo account exists so the demo button always works. */
export const ensureDemoAccount = createServerFn({ method: "POST" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  const { data: list } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 200 });
  const existing = list?.users.find((u) => u.email?.toLowerCase() === DEMO_EMAIL);
  if (existing) return { ok: true as const };

  const { error } = await supabaseAdmin.auth.admin.createUser({
    email: DEMO_EMAIL,
    password: DEMO_PASSWORD,
    email_confirm: true,
    user_metadata: { full_name: DEMO_NAME },
  });
  if (error && !/already/i.test(error.message)) throw new Error(error.message);
  return { ok: true as const };
});
