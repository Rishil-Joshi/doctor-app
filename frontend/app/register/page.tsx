'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import {
  validateEmail,
  validatePassword,
  validatePhone,
  validateFirstName,
  validateLastName,
  validateUsername,
  validateConfirmPassword,
} from '@/lib/validations';
import { ValidationErrors, RegisterFormData } from '@/lib/types';
import { ERROR_MESSAGES } from '@/lib/constants';
import { FormField } from '@/components/FormField';
import { AuthBranding, AuthHeader } from '@/components/AuthHeader';

export default function RegisterPage() {
  const router = useRouter();
  const auth = useAuth();
  const [formData, setFormData] = useState<RegisterFormData>({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    specialization: '',
    clinicName: '',
  });
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [apiError, setApiError] = useState('');

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};

    const firstNameValidation = validateFirstName(formData.firstName);
    if (!firstNameValidation.isValid) errors.firstName = firstNameValidation.error || '';

    const lastNameValidation = validateLastName(formData.lastName);
    if (!lastNameValidation.isValid) errors.lastName = lastNameValidation.error || '';

    const usernameValidation = validateUsername(formData.username);
    if (!usernameValidation.isValid) errors.username = usernameValidation.error || '';

    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.isValid) errors.email = emailValidation.error || '';

    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) errors.password = passwordValidation.error || '';

    const confirmPasswordValidation = validateConfirmPassword(formData.password, formData.confirmPassword);
    if (!confirmPasswordValidation.isValid) errors.confirmPassword = confirmPasswordValidation.error || '';

    const phoneValidation = validatePhone(formData.phone);
    if (!phoneValidation.isValid) errors.phone = phoneValidation.error || '';

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setApiError('');

    if (!validateForm()) return;

    try {
      await auth.register(formData);
      router.push('/dashboard');
    } catch (err) {
      setApiError(err instanceof Error ? err.message : ERROR_MESSAGES.GENERAL_ERROR);
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <AuthBranding />
        <div className="bg-white rounded-2xl shadow-lg p-8 max-h-screen overflow-y-auto">
          <AuthHeader
            title="Create Account"
            subtitle="Join SURGIFLOW to manage your patients"
          />

        <form onSubmit={handleRegister} className="space-y-4">
          <FormField
            label="First Name *"
            type="text"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            placeholder="Enter your first name"
            error={validationErrors.firstName}
          />

          <FormField
            label="Last Name *"
            type="text"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            placeholder="Enter your last name"
            error={validationErrors.lastName}
          />

          <FormField
            label="Username *"
            type="text"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            placeholder="Choose a unique username"
            error={validationErrors.username}
          />

          <FormField
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="Enter your email (optional)"
            error={validationErrors.email}
          />

          <FormField
            label="Phone Number *"
            type="tel"
            value={formData.phone}
            onChange={(e) => {
              const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
              setFormData({ ...formData, phone: digits });
            }}
            placeholder="10-digit number"
            error={validationErrors.phone}
          />

          <FormField
            label="Password *"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            placeholder="Create a strong password"
            error={validationErrors.password}
            helperText={!validationErrors.password ? 'Minimum 5 characters' : undefined}
          />

          <FormField
            label="Confirm Password *"
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            placeholder="Confirm your password"
            error={validationErrors.confirmPassword}
          />

          <FormField
            label="Specialization"
            type="text"
            value={formData.specialization || ''}
            onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
            placeholder="e.g., Cardiology"
          />

          <FormField
            label="Clinic Name"
            type="text"
            value={formData.clinicName || ''}
            onChange={(e) => setFormData({ ...formData, clinicName: e.target.value })}
            placeholder="Your clinic name"
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
            {auth.isLoading ? 'Creating account...' : 'REGISTER'}
          </button>
        </form>

        <p className="mt-4 text-center text-xs uppercase tracking-[0.28em] text-slate-500">
          Already have an account?{' '}
          <a href="/login" className="text-teal-500 underline font-semibold ml-1">
            Login here
          </a>
        </p>
      </div>
    </div>
  </main>
  );
}
