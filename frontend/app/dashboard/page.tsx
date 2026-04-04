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
  const [search, setSearch] = useState('');
  const [apiError, setApiError] = useState('');
  const [isLoadingPatients, setIsLoadingPatients] = useState(false);

  useEffect(() => {
    if (!auth.isLoading && !auth.isAuthenticated) {
      router.push('/login');
    }
  }, [auth.isLoading, auth.isAuthenticated, router]);

  const fetchPatients = useCallback(async () => {
    if (!auth.token) return;
    setApiError('');
    setIsLoadingPatients(true);
    try {
      const data = await patientAPI.getAll(auth.token);
      setPatients(data.patients || []);
    } catch (err) {
      setApiError('Failed to fetch patients');
    } finally {
      setIsLoadingPatients(false);
    }
  }, [auth.token]);

  useEffect(() => {
    if (auth.user && auth.token) fetchPatients();
  }, [auth.user, auth.token, fetchPatients]);

  const handleLogout = () => {
    auth.logout();
    router.push('/login');
  };

  const filteredPatients = useMemo(() =>
    patients.filter((p: any) =>
      (p.name || '').toLowerCase().includes(search.toLowerCase())
    ),
    [patients, search]
  );

  if (auth.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-pastel-bg">
        <p className="text-gray-500 text-sm uppercase tracking-widest">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pastel-bg">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-pastel-blue/20 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 sm:py-5">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 sm:h-12 sm:w-12 bg-pastel-mint-dark rounded-xl flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 sm:h-7 sm:w-7 text-white" aria-hidden="true">
                  <path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2" />
                </svg>
              </div>
              <div>
                <h1 className="text-lg sm:text-2xl font-bold text-gray-800 uppercase tracking-wider">SURGIFLOW</h1>
                <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-widest hidden sm:block">PATIENT MANAGEMENT</p>
              </div>
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-2 sm:gap-5">
              <button className="px-3 sm:px-6 py-2.5 sm:py-3 bg-pastel-lavender/30 text-gray-700 rounded-xl font-bold text-[10px] sm:text-xs uppercase tracking-widest hover:bg-pastel-lavender/50 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 sm:inline sm:mr-2" aria-hidden="true">
                  <path d="M3 3v16a2 2 0 0 0 2 2h16" />
                  <path d="M18 17V9" /><path d="M13 17V5" /><path d="M8 17v-3" />
                </svg>
                <span className="hidden sm:inline">ANALYTICS</span>
              </button>

              <div className="hidden sm:flex items-center gap-2 text-xs text-gray-600 uppercase tracking-widest">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <span className="font-bold">{auth.user?.username}</span>
              </div>

              <button onClick={handleLogout} className="p-2.5 sm:p-3 hover:bg-pastel-pink/20 rounded-xl transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-gray-500" aria-hidden="true">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" x2="9" y1="12" y2="12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-6 sm:py-10">
        {/* Add New Patient Button */}
        <button
          onClick={() => router.push('/patients/new')}
          className="w-full mb-6 sm:mb-10 flex items-center justify-center gap-3 sm:gap-5 bg-pastel-mint-dark text-white py-5 sm:py-7 rounded-2xl font-bold text-base sm:text-lg hover:opacity-90 transition-all shadow-sm active:scale-[0.99] uppercase tracking-wider"
        >
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/20 rounded-xl flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7 sm:w-8 sm:h-8" aria-hidden="true">
              <path d="M5 12h14" /><path d="M12 5v14" />
            </svg>
          </div>
          ADD NEW PATIENT
        </button>

        {/* Mobile: logged in as */}
        <div className="sm:hidden flex items-center gap-2 mb-4 px-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5 text-gray-400" aria-hidden="true">
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">LOGGED IN AS: {auth.user?.username}</span>
        </div>

        {/* Patients heading */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 items-start sm:items-center justify-between mb-5 sm:mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 uppercase tracking-wider">PATIENTS</h2>
            <p className="text-[10px] sm:text-xs text-gray-500 mt-1 uppercase tracking-widest">{patients.length} PATIENTS TOTAL</p>
          </div>
        </div>

        {/* Search */}
        <div className="border border-pastel-blue/20 bg-white rounded-2xl mb-5 sm:mb-8 p-3 sm:p-5 shadow-sm">
          <div className="relative">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" aria-hidden="true">
              <path d="m21 21-4.34-4.34" /><circle cx="11" cy="11" r="8" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="SEARCH PATIENTS..."
              className="pl-12 h-12 sm:h-14 w-full rounded-xl border border-pastel-blue/30 bg-transparent text-sm uppercase tracking-wide placeholder:text-gray-400 placeholder:text-xs focus:outline-none focus:ring-1 focus:ring-pastel-mint-dark"
            />
          </div>
        </div>

        {apiError && (
          <div className="text-red-500 text-sm bg-red-50 p-3 rounded mb-4">{apiError}</div>
        )}

        {/* Patient Cards */}
        {isLoadingPatients ? (
          <p className="text-center text-gray-400 text-sm uppercase tracking-widest py-10">Loading patients...</p>
        ) : filteredPatients.length === 0 ? (
          <p className="text-center text-gray-400 text-sm uppercase tracking-widest py-10">No patients found</p>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {filteredPatients.map((patient: any) => (
              <div
                key={patient.id}
                onClick={() => router.push(`/patients/${patient.id}`)}
                className="border border-pastel-blue/20 hover:border-pastel-mint-dark/40 bg-white rounded-2xl p-4 sm:p-5 shadow hover:shadow-md transition-all cursor-pointer flex gap-3 sm:gap-5 items-start"
              >
                {/* Thumbnail */}
                {patient.photos?.[0] ? (
                  <img
                    src={patient.photos[0]}
                    alt="Pre-op"
                    className="w-16 h-16 sm:w-24 sm:h-24 object-cover rounded-xl border border-pastel-blue/20 flex-shrink-0"
                  />
                ) : (
                  <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-xl border border-pastel-blue/20 bg-pastel-bg flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-gray-300">
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                )}

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-800 uppercase tracking-wide text-sm sm:text-base">{patient.name}</h3>

                  {patient.id && (
                    <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-pastel-blue/20 text-pastel-mint-dark text-[10px] font-bold uppercase tracking-widest">
                      P-{patient.id.toString(16).toUpperCase().padStart(6, '0')}
                    </span>
                  )}

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-xs text-gray-500">
                    {patient.age && <span>{patient.age}Y</span>}
                    {patient.gender && <span className="uppercase">{patient.gender}</span>}
                    {patient.created_at && (
                      <span className="flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" />
                        </svg>
                        {new Date(patient.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' }).toUpperCase()}
                      </span>
                    )}
                  </div>

                  {patient.details && (
                    <p className="flex items-center gap-1.5 mt-1.5 text-xs text-gray-600 uppercase tracking-wide">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" /><path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" /><circle cx="20" cy="10" r="2" />
                      </svg>
                      {patient.details}
                    </p>
                  )}

                  {patient.medical_history && (
                    <p className="mt-1 text-xs text-pastel-mint-dark font-bold uppercase tracking-wide">{patient.medical_history}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
