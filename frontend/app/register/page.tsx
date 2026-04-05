'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { validateUsername, validatePassword } from '@/lib/validations';
import { ValidationErrors } from '@/lib/types';
import { ERROR_MESSAGES } from '@/lib/constants';
import { AuthBranding } from '@/components/AuthHeader';

export default function RegisterPage() {
  const router = useRouter();
  const auth = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'surgeon',
  });
  const [legalAccepted, setLegalAccepted] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [apiError, setApiError] = useState('');

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};
    const usernameValidation = validateUsername(formData.username);
    if (!usernameValidation.isValid) errors.username = usernameValidation.error || '';
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) errors.password = passwordValidation.error || '';
    if (!legalAccepted) errors.legal = 'You must accept the legal disclaimer to continue';
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setApiError('');
    if (!validateForm()) return;
    try {
      await auth.register({
        username: formData.username,
        password: formData.password,
        role: formData.role,
      });
      router.push('/dashboard');
    } catch (err) {
      setApiError(err instanceof Error ? err.message : ERROR_MESSAGES.GENERAL_ERROR);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-5 bg-pastel-bg">
      <div className="w-full max-w-md">
        <AuthBranding />

        <div className="border border-pastel-blue/20 bg-white rounded-2xl p-6 sm:p-8 shadow-sm">
          <h2 className="text-base font-bold mb-6 text-gray-800 uppercase tracking-widest">CREATE ACCOUNT</h2>

          <form className="space-y-4" onSubmit={handleRegister}>
            {/* Username */}
            <div>
              <label htmlFor="username" className="text-xs font-bold text-gray-600 uppercase tracking-widest">USERNAME</label>
              <input
                id="username"
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="Enter your username"
                required
                className="flex w-full border bg-transparent px-3 py-1 text-base shadow-sm transition-colors placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-pastel-mint-dark md:text-sm mt-2 h-12 rounded-xl border-pastel-blue/30"
              />
              {validationErrors.username && <p className="mt-1 text-xs text-red-500">{validationErrors.username}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="text-xs font-bold text-gray-600 uppercase tracking-widest">PASSWORD</label>
              <input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Enter your password"
                required
                className="flex w-full border bg-transparent px-3 py-1 text-base shadow-sm transition-colors placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-pastel-mint-dark md:text-sm mt-2 h-12 rounded-xl border-pastel-blue/30"
              />
              {validationErrors.password && <p className="mt-1 text-xs text-red-500">{validationErrors.password}</p>}
            </div>

            {/* Role */}
            <div>
              <label className="text-xs font-bold text-gray-600 uppercase tracking-widest">ROLE</label>
              <div className="mt-2 flex flex-col gap-2">
                {['surgeon', 'manager'].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setFormData({ ...formData, role: r })}
                    className={`w-full rounded-xl border px-4 py-3 text-sm font-bold uppercase tracking-widest text-left transition ${
                      formData.role === r
                        ? 'border-pastel-mint-dark bg-pastel-mint-dark text-white'
                        : 'border-pastel-blue/30 bg-white text-gray-600'
                    }`}
                  >
                    {r.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Legal Disclaimer */}
            <div className="p-4 bg-pastel-yellow/40 border border-pastel-peach/40 rounded-xl space-y-3">
              <p className="text-xs font-bold text-gray-700 uppercase tracking-widest">LEGAL DISCLAIMER</p>
              <div className="text-xs text-gray-600 space-y-2 max-h-32 overflow-y-auto leading-relaxed">
                <p className="font-bold uppercase text-xs tracking-wide">DATA PROTECTION &amp; PRIVACY:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Patient data stored securely per IT Act, 2000 and DISHA guidelines</li>
                  <li>Medical records protected under IMC Regulations, 2002</li>
                  <li>Unauthorized access is a punishable offense</li>
                </ul>
                <p className="mt-2 font-bold uppercase text-xs tracking-wide">YOUR RESPONSIBILITIES:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Maintain confidentiality of patient records</li>
                  <li>Ensure secure handling of login credentials</li>
                  <li>Use patient data only for legitimate medical purposes</li>
                </ul>
              </div>
              <div className="flex items-start gap-3 pt-2">
                <input
                  id="disclaimer"
                  type="checkbox"
                  checked={legalAccepted}
                  onChange={(e) => setLegalAccepted(e.target.checked)}
                  className="mt-1 w-5 h-5 rounded"
                />
                <label htmlFor="disclaimer" className="text-xs text-gray-600 cursor-pointer leading-relaxed">
                  I acknowledge the legal obligations regarding patient data protection as per Indian law.
                </label>
              </div>
              {validationErrors.legal && <p className="text-xs text-red-500">{validationErrors.legal}</p>}
            </div>

            {apiError && (
              <div className="text-red-500 text-sm bg-red-50 p-3 rounded">{apiError}</div>
            )}

            <button
              type="submit"
              disabled={auth.isLoading}
              className="w-full bg-pastel-mint-dark hover:opacity-90 text-white h-14 font-bold text-sm uppercase tracking-widest rounded-xl shadow transition disabled:opacity-50"
            >
              {auth.isLoading ? 'Creating account...' : 'REGISTER'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <a href="/login" className="text-xs text-pastel-mint-dark hover:opacity-80 font-bold uppercase tracking-widest">
              ALREADY HAVE AN ACCOUNT? LOGIN
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
