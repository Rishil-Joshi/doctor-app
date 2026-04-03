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
import { AuthHeader } from '@/components/AuthHeader';

export default function LoginPage() {
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
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <AuthHeader
          title="Welcome Back"
          subtitle="Sign in to your account"
          switchText="Don't have an account?"
          switchLink="/register"
          switchLinkText="Register here"
        />

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
            className="w-full rounded-xl bg-teal-400 px-4 py-3 text-center text-sm font-bold text-white shadow-md hover:bg-teal-500 disabled:bg-gray-400 transition"
          >
            {auth.isLoading ? 'Signing in...' : 'LOGIN'}
          </button>
        </form>
      </div>
    </main>
  );
}
