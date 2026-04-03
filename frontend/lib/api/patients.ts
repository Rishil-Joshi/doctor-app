import { API_URL } from '../constants';
import { Patient } from '../types';

export const patientAPI = {
  getAll: async (token: string): Promise<{ patients: Patient[] }> => {
    const response = await fetch(`${API_URL}/patients`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch patients');
    }

    return response.json();
  },

  create: async (token: string, data: Partial<Patient>): Promise<{ patient: Patient }> => {
    const response = await fetch(`${API_URL}/patients`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create patient');
    }

    return response.json();
  },

  getById: async (token: string, patientId: number): Promise<{ patient: Patient }> => {
    const response = await fetch(`${API_URL}/patients/${patientId}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch patient');
    }

    return response.json();
  },

  update: async (token: string, patientId: number, data: Partial<Patient>): Promise<{ patient: Patient }> => {
    const response = await fetch(`${API_URL}/patients/${patientId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update patient');
    }

    return response.json();
  },

  delete: async (token: string, patientId: number): Promise<{ message: string }> => {
    const response = await fetch(`${API_URL}/patients/${patientId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error('Failed to delete patient');
    }

    return response.json();
  },
};
