import { initTRPC, TRPCError } from '@trpc/server';
import { SupabaseClient } from '@supabase/supabase-js';

type Context = {
  session: any;
  supabase: SupabaseClient;
};

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

export const appRouter = router({
  // Add your routes here
}); 