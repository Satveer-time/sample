import { initTRPC, TRPCError } from '@trpc/server';
import { getSession } from '@auth0/nextjs-auth0';
import { supabase } from '../lib/supabase';
import { z } from 'zod';

interface CreateContextOptions {
  session: any | null;
}

export const createContext = async (opts: CreateContextOptions) => {
  return {
    session: opts.session,
    supabase,
  };
};

const t = initTRPC.context<typeof createContext>().create();

export const router = t.router;
export const publicProcedure = t.procedure;
export const middleware = t.middleware;

const isAuthed = middleware(async ({ next, ctx }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Not authenticated',
    });
  }
  return next({
    ctx: {
      session: ctx.session,
    },
  });
});

export const protectedProcedure = t.procedure.use(isAuthed);

// Example schemas
const todoSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Title is required'),
  completed: z.boolean().default(false),
});

// Create and export the app router
export const appRouter = router({
  // Public routes
  hello: publicProcedure
    .input(z.string().optional())
    .query(({ input }) => {
      return `Hello ${input ?? 'world'}!`;
    }),

  // Protected routes
  todos: router({
    // Get all todos
    list: protectedProcedure.query(async ({ ctx }) => {
      try {
        const { data, error } = await ctx.supabase
          .from('todos')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch todos',
          cause: error,
        });
      }
    }),

    // Create a new todo
    create: protectedProcedure
      .input(todoSchema.omit({ id: true }))
      .mutation(async ({ ctx, input }) => {
        try {
          const { data, error } = await ctx.supabase
            .from('todos')
            .insert([input])
            .select()
            .single();

          if (error) throw error;
          return data;
        } catch (error) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to create todo',
            cause: error,
          });
        }
      }),

    // Update a todo
    update: protectedProcedure
      .input(todoSchema)
      .mutation(async ({ ctx, input }) => {
        try {
          const { data, error } = await ctx.supabase
            .from('todos')
            .update(input)
            .eq('id', input.id)
            .select()
            .single();

          if (error) throw error;
          return data;
        } catch (error) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to update todo',
            cause: error,
          });
        }
      }),

    // Delete a todo
    delete: protectedProcedure
      .input(z.string())
      .mutation(async ({ ctx, input }) => {
        try {
          const { error } = await ctx.supabase
            .from('todos')
            .delete()
            .eq('id', input);

          if (error) throw error;
          return { success: true };
        } catch (error) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to delete todo',
            cause: error,
          });
        }
      }),
  }),
});

// Export type definition of API
export type AppRouter = typeof appRouter; 