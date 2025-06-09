import { createTRPCReact } from '@trpc/react-query';
import { type AppRouter } from '@/server/trpc';

console.log('Initializing tRPC client...');

export const trpc = createTRPCReact<AppRouter>();

export function getBaseUrl() {
  if (typeof window !== 'undefined') {
    // Browser should use relative path
    console.log('Using relative path for tRPC client');
    return '';
  }

  if (process.env.VERCEL_URL) {
    // Reference for vercel.com
    console.log('Using Vercel URL for tRPC client');
    return `https://${process.env.VERCEL_URL}`;
  }

  if (process.env.RENDER_INTERNAL_HOSTNAME) {
    // Reference for render.com
    console.log('Using Render URL for tRPC client');
    return `http://${process.env.RENDER_INTERNAL_HOSTNAME}:${process.env.PORT}`;
  }

  // Assume localhost
  console.log('Using localhost for tRPC client');
  return `http://localhost:${process.env.PORT ?? 3000}`;
} 