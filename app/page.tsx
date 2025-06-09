'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import Link from 'next/link';
import { ProtectedRoute } from './components/ProtectedRoute';
import ChatInterface from './components/ChatInterface';

export default function Home() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-indigo-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="text-center p-10 bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 transform hover:scale-105 transition-transform duration-300">
          <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
            Welcome to Chatbot
          </h1>
          <p className="text-gray-600 mb-8 text-lg">Experience the power of conversation</p>
          <Link
            href="/api/auth/login"
            className="inline-block px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full font-semibold hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Get Started
          </Link>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
        {/* Navigation Bar */}
        <nav className="bg-white/80 backdrop-blur-md shadow-lg">
          <div className="container mx-auto px-6 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
                Chatbot
              </h1>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                    {user.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="text-gray-700 font-medium">{user.name}</span>
                </div>
                <Link
                  href="/api/auth/logout"
                  className="px-6 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full font-medium hover:from-red-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Logout
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="py-8">
          <div className="container mx-auto px-4">
            <ChatInterface />
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
