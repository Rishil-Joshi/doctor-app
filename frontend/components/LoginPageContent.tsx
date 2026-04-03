'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import {
  validateUsername,
  validatePassword,
} from '@/lib/validations';
import { ValidationErrors } from '@/lib/types';
import { ERROR_MESSAGES } from '@/lib/constants';
import { FormField } from '@/components/FormField';
import { AuthBranding, AuthHeader } from '@/components/AuthHeader';

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
    <main className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <AuthBranding />
        <div className="bg-white rounded-[2rem] shadow-[0_24px_80px_rgba(15,23,42,0.08)] p-8">
          <AuthHeader title="WELCOME BACK" subtitle="Sign in to your account" />

          <form onSubmit={handleLogin} className="space-y-4">
          <FormField
            label="Username *"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            error={validationErrors.username}
          />

          <FormField
            label="Password *"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            error={validationErrors.password}
          />

          {apiError && (
            <div className="text-red-500 text-sm bg-red-50 p-3 rounded">
              {apiError}
            </div>
          )}

          <button
            type="submit"
            disabled={auth.isLoading}
            className="w-full rounded-[1.5rem] bg-teal-400 px-6 py-3.5 text-center text-lg font-semibold text-white shadow-lg hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-300 disabled:bg-slate-300 transition"
          >
            {auth.isLoading ? 'Signing in...' : 'LOGIN'}
          </button>
        </form>

        <p className="mt-6 text-center text-xs uppercase tracking-[0.2em] text-slate-500">
          DON&apos;T HAVE AN ACCOUNT?
          <a href="/register" className="ml-2 text-teal-500 underline font-semibold">
            REGISTER
          </a>
        </p>
      </div>
    </div>
  </main>
  );
}
