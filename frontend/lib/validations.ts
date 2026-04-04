import { VALIDATION_RULES, ERROR_MESSAGES } from './constants';

export const validateEmail = (email: string): { isValid: boolean; error?: string } => {
  if (!email.trim()) {
    return { isValid: true };
  }
  if (!VALIDATION_RULES.EMAIL_REGEX.test(email)) {
    return { isValid: false, error: ERROR_MESSAGES.EMAIL_INVALID };
  }
  return { isValid: true };
};

export const validatePassword = (password: string): { isValid: boolean; error?: string } => {
  if (!password) {
    return { isValid: false, error: ERROR_MESSAGES.PASSWORD_REQUIRED };
  }
  if (password.length < VALIDATION_RULES.PASSWORD_MIN_LENGTH) {
    return { isValid: false, error: ERROR_MESSAGES.PASSWORD_TOO_SHORT };
  }
  return { isValid: true };
};

export const validatePhone = (phone: string): { isValid: boolean; error?: string } => {
  if (!phone.trim()) {
    return { isValid: false, error: ERROR_MESSAGES.PHONE_REQUIRED };
  }
  const digitsOnly = phone.replace(/\D/g, '');
  if (!VALIDATION_RULES.PHONE_REGEX.test(digitsOnly)) {
    return { isValid: false, error: 'Phone number must be exactly 10 digits' };
  }
  return { isValid: true };
};

export const validateFirstName = (firstName: string): { isValid: boolean; error?: string } => {
  if (!firstName.trim()) {
    return { isValid: false, error: ERROR_MESSAGES.FIRST_NAME_REQUIRED };
  }
  return { isValid: true };
};

export const validateLastName = (lastName: string): { isValid: boolean; error?: string } => {
  if (!lastName.trim()) {
    return { isValid: false, error: ERROR_MESSAGES.LAST_NAME_REQUIRED };
  }
  return { isValid: true };
};

export const validateUsername = (username: string): { isValid: boolean; error?: string } => {
  if (!username.trim()) {
    return { isValid: false, error: ERROR_MESSAGES.USERNAME_REQUIRED };
  }
  return { isValid: true };
};

export const validateConfirmPassword = (password: string, confirmPassword: string): { isValid: boolean; error?: string } => {
  if (!confirmPassword) {
    return { isValid: false, error: ERROR_MESSAGES.CONFIRM_PASSWORD_REQUIRED };
  }
  if (password !== confirmPassword) {
    return { isValid: false, error: ERROR_MESSAGES.PASSWORD_MISMATCH };
  }
  return { isValid: true };
};
