'use client';

import { useEffect, useMemo, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { patientAPI } from '@/lib/api/patients';
import { Patient } from '@/lib/types';

export default function DashboardPage() {
  const router = useRouter();
  const auth = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [newPatient, setNewPatient] = useState({ name: '', details: '' });
  const [apiError, setApiError] = useState('');
  const [isLoadingPatients, setIsLoadingPatients] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!auth.isLoading && !auth.isAuthenticated) {
      router.push('/login');
    }
  }, [auth.isLoading, auth.isAuthenticated, router]);

  // Fetch patients when user is authenticated
  const fetchPatients = useCallback(async () => {
    try {
      if (!auth.token) return;
      setIsLoadingPatients(true);
      const data = await patientAPI.getAll(auth.token);
      setPatients(data.patients || []);
    } catch (err) {
      console.error('Error fetching patients:', err);
      setApiError('Failed to fetch patients');
    } finally {
      setIsLoadingPatients(false);
    }
  }, [auth.token]);

  useEffect(() => {
    if (auth.user && auth.token) {
      fetchPatients();
    }
  }, [auth.user, auth.token, fetchPatients]);

  const handleAddPatient = async () => {
    if (!newPatient.name.trim() || !newPatient.details.trim() || !auth.token) {
      setApiError('Patient name and details are required');
      return;
    }

    try {
      setApiError('');
      const data = await patientAPI.create(auth.token, newPatient);
      setPatients((prev) => [...prev, data.patient]);
      setNewPatient({ name: '', details: '' });
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Failed to add patient');
    }
  };

  const handleDeletePatient = async (patientId: number) => {
    if (!auth.token) return;

    try {
      await patientAPI.delete(auth.token, patientId);
      setPatients((prev) => prev.filter((p) => p.id !== patientId));
    } catch (err) {
      setApiError('Failed to delete patient');
    }
  };

  const handleLogout = () => {
    auth.logout();
    router.push('/login');
  };

  const patientCount = useMemo(() => patients.length, [patients]);

  if (auth.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">SURGIFLOW</h1>
            <p className="text-sm text-slate-500">Doctor Patient Management</p>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-lg bg-rose-500 px-4 py-2 text-white font-medium hover:bg-rose-600 transition"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Profile</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="text-lg font-semibold">
                {auth.user?.first_name} {auth.user?.last_name}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Username</p>
              <p className="text-lg font-semibold">{auth.user?.username}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-lg font-semibold">{auth.user?.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="text-lg font-semibold">{auth.user?.phone}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Specialization</p>
              <p className="text-lg font-semibold">{auth.user?.specialization || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Clinic</p>
              <p className="text-lg font-semibold">{auth.user?.clinic_name || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-2">Patient Count: {patientCount}</h2>
          <p className="text-gray-600">Total patients under your care</p>
        </div>

        {/* Add Patient Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Add New Patient</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Patient Name *</label>
              <input
                type="text"
                placeholder="Enter patient full name"
                value={newPatient.name}
                onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Details *</label>
              <textarea
                placeholder="Enter patient medical details, diagnosis, notes, etc."
                value={newPatient.details}
                onChange={(e) => setNewPatient({ ...newPatient, details: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 resize-none"
              />
            </div>

            {apiError && (
              <div className="text-red-500 text-sm bg-red-50 p-3 rounded">
                {apiError}
              </div>
            )}

            <button
              onClick={handleAddPatient}
              className="bg-teal-500 text-white px-6 py-2 rounded-lg hover:bg-teal-600 transition font-medium"
            >
              Add Patient
            </button>
          </div>
        </div>

        {/* Patients List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Patients</h2>

          {isLoadingPatients ? (
            <p className="text-gray-600">Loading patients...</p>
          ) : patients.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No patients yet. Add one using the form above.</p>
          ) : (
            <div className="space-y-4">
              {patients.map((patient: any) => (
                <div
                  key={patient.id}
                  className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900">{patient.name}</h3>
                      <p className="text-gray-600 text-sm mt-2">{patient.details}</p>
                      <p className="text-xs text-gray-500 mt-3">
                        Patient ID: {patient.id}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeletePatient(patient.id)}
                      className="ml-4 text-red-500 hover:text-red-700 transition text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
