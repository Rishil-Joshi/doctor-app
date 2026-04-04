import { API_URL } from '../constants';
import { Patient, PatientMedia } from '../types';

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

  uploadMedia: async (
    token: string,
    patientId: number,
    file: File,
    imageType: string,
    phase: string,
    onProgress?: (pct: number) => void
  ): Promise<{ media: PatientMedia }> => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('imageType', imageType);
      formData.append('phase', phase);

      const xhr = new XMLHttpRequest();
      xhr.open('POST', `${API_URL}/patients/${patientId}/media`);
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable && onProgress) {
          onProgress(Math.round((e.loaded / e.total) * 100));
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          reject(new Error('Failed to upload media'));
        }
      };

      xhr.onerror = () => reject(new Error('Upload failed'));
      xhr.send(formData);
    });
  },

  getMedia: async (token: string, patientId: number): Promise<{ media: PatientMedia[] }> => {
    const response = await fetch(`${API_URL}/patients/${patientId}/media`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to fetch media');
    return response.json();
  },

  deleteMedia: async (token: string, patientId: number, mediaId: number): Promise<{ message: string }> => {
    const response = await fetch(`${API_URL}/patients/${patientId}/media/${mediaId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to delete media');
    return response.json();
  },
};
