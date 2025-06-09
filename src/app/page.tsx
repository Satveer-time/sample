'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import ChatInterface from '../../app/components/ChatInterface';
import { Suspense } from 'react';

function HomeContent() {
  const { user, error, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-dark">
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-dark">
        <div className="text-danger">Error: {error.message}</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-dark">
        <div className="text-center">
          <h1 className="text-danger mb-4">Welcome to Chat</h1>
          <a href="/api/auth/login" className="btn btn-danger btn-lg">
            Login to Chat
          </a>
        </div>
      </div>
    );
  }

  return <ChatInterface />;
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-dark">
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
} 