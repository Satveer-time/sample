import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from '../../../../server/trpc';
import { createContext } from '../../../../server/trpc';
import { getSession } from '@auth0/nextjs-auth0';

const handler = async (req: Request) => {
  const session = await getSession();
  
  return fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: () => createContext({ session }),
  });
};

export { handler as GET, handler as POST }; 