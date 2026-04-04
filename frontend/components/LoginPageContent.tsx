'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { validateUsername, validatePassword } from '@/lib/validations';
import { ValidationErrors } from '@/lib/types';
import { ERROR_MESSAGES } from '@/lib/constants';

export function LoginPageContent() {
  const router = useRouter();
  const auth = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [apiError, setApiError] = useState('');

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};
    const usernameValidation = validateUsername(username);
    if (!usernameValidation.isValid) errors.username = usernameValidation.error || '';
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) errors.password = passwordValidation.error || '';
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setApiError('');
    if (!validateForm()) return;
    try {
      await auth.login(username, password);
      router.push('/dashboard');
    } catch (err) {
      setApiError(err instanceof Error ? err.message : ERROR_MESSAGES.GENERAL_ERROR);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-5 bg-pastel-bg">
      <div className="w-full max-w-md">

        {/* Branding */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center h-16 w-16 bg-pastel-mint-dark rounded-2xl mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-9 w-9 text-white" aria-hidden="true">
              <path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2" />
            </svg>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 tracking-tight">SURGIFLOW</h1>
          <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest">CLINICAL PATIENT MANAGEMENT</p>
        </div>

        {/* Card */}
        <div className="border border-pastel-blue/20 bg-white rounded-2xl p-6 sm:p-8 shadow-sm">
          <h2 className="text-base font-bold mb-6 text-gray-800 uppercase tracking-widest">WELCOME BACK</h2>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Username */}
            <div>
              <label htmlFor="username" className="text-xs font-bold text-gray-600 uppercase tracking-widest">
                USERNAME
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
                className="mt-2 h-12 w-full rounded-xl border border-pastel-blue/30 bg-transparent px-3 text-sm shadow-sm transition-colors placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-pastel-mint-dark"
              />
              {validationErrors.username && <p className="mt-1 text-xs text-red-500">{validationErrors.username}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="text-xs font-bold text-gray-600 uppercase tracking-widest">
                PASSWORD
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="mt-2 h-12 w-full rounded-xl border border-pastel-blue/30 bg-transparent px-3 text-sm shadow-sm transition-colors placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-pastel-mint-dark"
              />
              {validationErrors.password && <p className="mt-1 text-xs text-red-500">{validationErrors.password}</p>}
            </div>

            {apiError && (
              <div className="text-red-500 text-sm bg-red-50 p-3 rounded">
                {apiError}
              </div>
            )}

            <button
              type="submit"
              disabled={auth.isLoading}
              className="w-full bg-pastel-mint-dark hover:opacity-90 text-white h-14 font-bold text-sm uppercase tracking-widest rounded-xl shadow transition disabled:opacity-50"
            >
              {auth.isLoading ? 'Signing in...' : 'LOGIN'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <a href="/register" className="text-xs text-pastel-mint-dark hover:opacity-80 font-bold uppercase tracking-widest">
              DON&apos;T HAVE AN ACCOUNT? REGISTER
            </a>
          </div>
        </div>

      </div>
    </main>
  );
}
