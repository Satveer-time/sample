"use client";
import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UserProvider } from '@auth0/nextjs-auth0/client';

const queryClient = new QueryClient();

export function Providers({ children }: { children: ReactNode }) {
  return (
    <UserProvider>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </UserProvider>
  );
} 