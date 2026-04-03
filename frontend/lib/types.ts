export interface Patient {
  id: number;
  name: string;
  details: string;
  photos: string[];
  videos: string[];
}

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  specialization?: string;
  clinic_name?: string;
  created_at: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ValidationErrors {
  [key: string]: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterFormData {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  specialization?: string;
  clinicName?: string;
}
