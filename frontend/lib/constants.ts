// API Configuration
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Auth Constants
export const AUTH_TOKEN_KEY = 'authToken';
export const USER_DATA_KEY = 'user';

// Validation Rules
export const VALIDATION_RULES = {
  PASSWORD_MIN_LENGTH: 5,
  USERNAME_MIN_LENGTH: 3,
  FIRST_NAME_MIN_LENGTH: 2,
  LAST_NAME_MIN_LENGTH: 2,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_REGEX: /^(?=.*[A-Z])(?=.*[0-9])/,
  PHONE_REGEX: /^[0-9]{10}$/,
};

// Error Messages
export const ERROR_MESSAGES = {
  FIRST_NAME_REQUIRED: 'First name is required',
  LAST_NAME_REQUIRED: 'Last name is required',
  USERNAME_REQUIRED: 'Username is required',
  EMAIL_REQUIRED: 'Email is required',
  EMAIL_INVALID: 'Invalid email format',
  PASSWORD_REQUIRED: 'Password is required',
  PASSWORD_TOO_SHORT: 'Password must be at least 5 characters',
  PASSWORD_NO_UPPERCASE: 'Password must contain at least one uppercase letter',
  PASSWORD_NO_NUMBER: 'Password must contain at least one number',
  PASSWORD_MISMATCH: 'Passwords do not match',
  CONFIRM_PASSWORD_REQUIRED: 'Please confirm your password',
  PHONE_REQUIRED: 'Phone number is required',
  PHONE_INVALID: 'Invalid phone number format',
  GENERAL_ERROR: 'An error occurred. Please try again.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  REGISTRATION_SUCCESS: 'Registration successful!',
  LOGIN_SUCCESS: 'Login successful!',
  PATIENT_ADDED: 'Patient added successfully!',
  PATIENT_UPDATED: 'Patient updated successfully!',
  PATIENT_DELETED: 'Patient deleted successfully!',
};
