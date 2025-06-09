'use client';

import { UserProvider } from '@auth0/nextjs-auth0/client';
import { trpc } from '../lib/trpc';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      <trpc.Provider client={trpc.createClient({
        links: [
          httpBatchLink({
            url: '/api/trpc',
          }),
        ],
      })} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </trpc.Provider>
    </UserProvider>
  );
} 