// app/layout.tsx

import './globals.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { UserProvider } from '@auth0/nextjs-auth0/client';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Mobile ChatGPT Clone',
  description: 'A mobile-first ChatGPT clone built with Next.js',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <UserProvider>
          <Providers>
            {children}
          </Providers>
        </UserProvider>
      </body>
    </html>
  );
}
