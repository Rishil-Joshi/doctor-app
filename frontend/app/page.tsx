'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return; // Wait for auth to load

    if (isAuthenticated) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="mb-4 h-16 w-16 rounded-xl bg-teal-200 flex items-center justify-center mx-auto">
          <span className="text-3xl font-bold text-white">🩺</span>
        </div>
        <h1 className="text-2xl font-bold">SURGIFLOW</h1>
        <p className="text-gray-600 mt-2">Loading...</p>
      </div>
    </div>
  );
}
