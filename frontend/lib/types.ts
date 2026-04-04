export interface PatientMedia {
  id: number;
  patient_id: number;
  url: string;
  public_id: string;
  media_type: 'image' | 'video';
  image_type: string | null;
  phase: string | null;
  thumbnail_url: string | null;
  created_at: string;
}

export interface Patient {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  age?: number;
  gender?: string;
  details?: string;
  medical_history?: string;
  address?: string;
  date_of_admission?: string;
  hospital_name?: string;
  referred_by?: string;
  payment_type?: string;
  cash_amount?: number;
  on_examination?: string;
  brief_history?: string;
  diagnosis?: string;
  surgery?: string;
  operation_notes?: string;
  ao_classification?: string;
  doctor_id?: number;
  created_at?: string;
  updated_at?: string;
  photos?: string[];
  videos?: string[];
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
