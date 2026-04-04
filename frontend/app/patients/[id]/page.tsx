'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { patientAPI } from '@/lib/api/patients';
import { Patient } from '@/lib/types';

export default function PatientDetailPage() {
  const router = useRouter();
  const params = useParams();
  const auth = useAuth();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const patientId = Number(params.id);

  useEffect(() => {
    if (!auth.isLoading && !auth.isAuthenticated) {
      router.push('/login');
    }
  }, [auth.isLoading, auth.isAuthenticated, router]);

  useEffect(() => {
    if (!auth.token || !patientId) return;
    const fetch = async () => {
      try {
        setIsLoading(true);
        const data = await patientAPI.getById(auth.token!, patientId);
        setPatient(data.patient);
      } catch {
        setError('Failed to load patient');
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, [auth.token, patientId]);

  const handleDelete = async () => {
    if (!auth.token) return;
    try {
      setIsDeleting(true);
      await patientAPI.delete(auth.token, patientId);
      router.push('/dashboard');
    } catch {
      setError('Failed to delete patient');
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (auth.isLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-pastel-bg">
        <p className="text-gray-500 text-sm uppercase tracking-widest">Loading...</p>
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-pastel-bg gap-4">
        <p className="text-red-500 text-sm uppercase tracking-widest">{error || 'Patient not found'}</p>
        <button onClick={() => router.push('/dashboard')} className="text-pastel-mint-dark text-xs font-bold uppercase tracking-widest hover:underline">
          Back to Dashboard
        </button>
      </div>
    );
  }

  const hexId = `P-${patientId.toString(16).toUpperCase().padStart(6, '0')}`;
  const addedOn = patient.created_at
    ? new Date(patient.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()
    : '—';

  return (
    <div className="min-h-screen bg-pastel-bg">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-pastel-blue/20 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 sm:py-5">
          <div className="flex items-center justify-between">
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
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center gap-2 text-gray-500 hover:text-gray-700 text-xs font-bold uppercase tracking-widest"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
                <path d="m12 19-7-7 7-7" /><path d="M19 12H5" />
              </svg>
              <span className="hidden sm:inline">BACK</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-6 sm:py-10">

        {/* Patient Header Card */}
        <div className="bg-white border border-pastel-blue/20 rounded-2xl p-5 sm:p-8 mb-5 sm:mb-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex items-center gap-4 sm:gap-6">
              {/* Avatar */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border border-pastel-blue/20 bg-pastel-bg flex items-center justify-center flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 sm:h-10 sm:w-10 text-gray-300">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 uppercase tracking-wide">{patient.name}</h2>
                <span className="inline-block mt-1.5 px-3 py-1 rounded-full bg-pastel-blue/20 text-pastel-mint-dark text-[10px] font-bold uppercase tracking-widest">
                  {hexId}
                </span>
                <p className="mt-2 text-[10px] sm:text-xs text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" />
                  </svg>
                  ADDED ON {addedOn}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mt-6">
            <button className="flex flex-col items-center gap-2 py-3 sm:py-4 px-2 bg-pastel-green/40 rounded-xl hover:bg-pastel-green/60 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                <path d="M21 3v5h-5" />
                <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                <path d="M8 16H3v5" />
              </svg>
              <span className="text-[9px] sm:text-[10px] font-bold text-green-700 uppercase tracking-widest">FOLLOW-UP</span>
            </button>

            <button className="flex flex-col items-center gap-2 py-3 sm:py-4 px-2 bg-pastel-blue/30 rounded-xl hover:bg-pastel-blue/50 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-pastel-blue-dark">
                <rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" />
                <path d="M8 14h.01" /><path d="M12 14h.01" /><path d="M16 14h.01" /><path d="M8 18h.01" /><path d="M12 18h.01" />
              </svg>
              <span className="text-[9px] sm:text-[10px] font-bold text-pastel-blue-dark uppercase tracking-widest">APPOINTMENT</span>
            </button>

            <button className="flex flex-col items-center gap-2 py-3 sm:py-4 px-2 bg-pastel-lavender/30 rounded-xl hover:bg-pastel-lavender/50 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" x2="9" y1="12" y2="12" />
              </svg>
              <span className="text-[9px] sm:text-[10px] font-bold text-purple-600 uppercase tracking-widest">DISCHARGE</span>
            </button>

            <button className="flex flex-col items-center gap-2 py-3 sm:py-4 px-2 bg-pastel-peach/40 rounded-xl hover:bg-pastel-peach/60 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500">
                <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
                <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                <path d="M10 9H8" /><path d="M16 13H8" /><path d="M16 17H8" />
              </svg>
              <span className="text-[9px] sm:text-[10px] font-bold text-orange-600 uppercase tracking-widest">CONSENT</span>
            </button>
          </div>

          {/* Utility Buttons Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mt-3">
            <button className="flex items-center justify-center gap-2 py-3 px-3 bg-pastel-cream border border-pastel-blue/20 rounded-xl hover:bg-pastel-blue/10 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500 flex-shrink-0">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              <span className="text-[9px] sm:text-[10px] font-bold text-gray-600 uppercase tracking-widest">REPORT PDF</span>
            </button>

            <button className="flex items-center justify-center gap-2 py-3 px-3 bg-pastel-cream border border-pastel-blue/20 rounded-xl hover:bg-pastel-blue/10 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500 flex-shrink-0">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" x2="12" y1="15" y2="3" />
              </svg>
              <span className="text-[9px] sm:text-[10px] font-bold text-gray-600 uppercase tracking-widest">DISCHARGE PDF</span>
            </button>

            <button
              onClick={() => router.push(`/patients/${patientId}/edit`)}
              className="flex items-center justify-center gap-2 py-3 px-3 bg-pastel-cream border border-pastel-blue/20 rounded-xl hover:bg-pastel-mint/20 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-pastel-mint-dark flex-shrink-0">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              <span className="text-[9px] sm:text-[10px] font-bold text-pastel-mint-dark uppercase tracking-widest">EDIT</span>
            </button>

            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center justify-center gap-2 py-3 px-3 bg-pastel-pink/20 border border-pastel-pink/40 rounded-xl hover:bg-pastel-pink/40 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-pastel-coral flex-shrink-0">
                <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
              </svg>
              <span className="text-[9px] sm:text-[10px] font-bold text-pastel-coral uppercase tracking-widest">DELETE</span>
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-8">

          {/* Left: Patient Information */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-pastel-blue/20 rounded-2xl p-5 sm:p-6 shadow-sm">
              <h3 className="text-sm font-bold text-gray-800 uppercase tracking-widest mb-5 pb-3 border-b border-pastel-blue/10">
                PATIENT INFORMATION
              </h3>
              <div className="space-y-4">

                {(patient.age || patient.gender) && (
                  <InfoRow
                    icon={
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-pastel-mint-dark">
                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                      </svg>
                    }
                    label="AGE / SEX"
                    value={[patient.age ? `${patient.age} YRS` : null, patient.gender?.toUpperCase()].filter(Boolean).join(' / ') || '—'}
                  />
                )}

                {patient.phone && (
                  <InfoRow
                    icon={
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-pastel-mint-dark">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.56 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                    }
                    label="PHONE"
                    value={patient.phone}
                  />
                )}

                {patient.address && (
                  <InfoRow
                    icon={
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-pastel-mint-dark">
                        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" />
                      </svg>
                    }
                    label="ADDRESS"
                    value={patient.address}
                  />
                )}

                {patient.date_of_admission && (
                  <InfoRow
                    icon={
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-pastel-mint-dark">
                        <rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" />
                      </svg>
                    }
                    label="DATE OF ADMISSION"
                    value={new Date(patient.date_of_admission).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}
                  />
                )}

                {patient.hospital_name && (
                  <InfoRow
                    icon={
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-pastel-mint-dark">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
                      </svg>
                    }
                    label="HOSPITAL"
                    value={patient.hospital_name}
                  />
                )}

                {patient.payment_type && (
                  <InfoRow
                    icon={
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-pastel-mint-dark">
                        <rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" />
                      </svg>
                    }
                    label="PAYMENT TYPE"
                    value={patient.payment_type.toUpperCase() + (patient.cash_amount ? ` — ₹${patient.cash_amount}` : '')}
                  />
                )}

                {patient.referred_by && (
                  <InfoRow
                    icon={
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-pastel-mint-dark">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                    }
                    label="REFERRED BY"
                    value={patient.referred_by}
                  />
                )}

              </div>
            </div>
          </div>

          {/* Right: Clinical Info */}
          <div className="lg:col-span-2 space-y-5 sm:space-y-6">

            {/* Clinical Images */}
            <div className="bg-white border border-pastel-blue/20 rounded-2xl p-5 sm:p-6 shadow-sm">
              <h3 className="text-sm font-bold text-gray-800 uppercase tracking-widest mb-4 pb-3 border-b border-pastel-blue/10">
                CLINICAL IMAGES
              </h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                <div className="aspect-square rounded-xl border-2 border-dashed border-pastel-blue/30 bg-pastel-bg flex flex-col items-center justify-center gap-1 text-gray-300 cursor-pointer hover:border-pastel-mint-dark/40 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14" /><path d="M12 5v14" />
                  </svg>
                  <span className="text-[8px] uppercase tracking-widest">ADD</span>
                </div>
              </div>
            </div>

            {/* On Examination */}
            {patient.on_examination && (
              <ClinicalSection title="ON EXAMINATION" content={patient.on_examination} color="pastel-mint" />
            )}

            {/* Brief History */}
            {patient.brief_history && (
              <ClinicalSection title="BRIEF HISTORY" content={patient.brief_history} color="pastel-blue" />
            )}

            {/* Diagnosis */}
            {patient.diagnosis && (
              <ClinicalSection title="DIAGNOSIS" content={patient.diagnosis} color="pastel-lavender" />
            )}

            {/* AO Classification */}
            {patient.ao_classification && (
              <div className="bg-white border border-pastel-blue/20 rounded-2xl p-5 sm:p-6 shadow-sm">
                <h3 className="text-sm font-bold text-gray-800 uppercase tracking-widest mb-3 pb-3 border-b border-pastel-blue/10">
                  AO FRACTURE CLASSIFICATION
                </h3>
                <span className="inline-block px-4 py-2 bg-pastel-peach/40 border border-pastel-peach/40 rounded-xl text-sm font-bold text-gray-700 uppercase tracking-widest">
                  {patient.ao_classification}
                </span>
              </div>
            )}

            {/* Surgery */}
            {patient.surgery && (
              <ClinicalSection title="SURGERY" content={patient.surgery} color="pastel-green" />
            )}

            {/* Operation Notes */}
            {patient.operation_notes && (
              <ClinicalSection title="OPERATION NOTES" content={patient.operation_notes} color="pastel-yellow" />
            )}

            {/* Medical History / Details */}
            {(patient.medical_history || patient.details) && (
              <div className="bg-white border border-pastel-blue/20 rounded-2xl p-5 sm:p-6 shadow-sm">
                <h3 className="text-sm font-bold text-gray-800 uppercase tracking-widest mb-3 pb-3 border-b border-pastel-blue/10">
                  ADDITIONAL NOTES
                </h3>
                {patient.medical_history && (
                  <p className="text-sm text-gray-600 leading-relaxed mb-2">{patient.medical_history}</p>
                )}
                {patient.details && (
                  <p className="text-sm text-gray-500 leading-relaxed">{patient.details}</p>
                )}
              </div>
            )}

          </div>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-sm w-full shadow-xl border border-pastel-blue/20">
            <div className="w-12 h-12 bg-pastel-pink/30 rounded-xl flex items-center justify-center mb-4 mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-pastel-coral">
                <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
              </svg>
            </div>
            <h3 className="text-center text-base font-bold text-gray-800 uppercase tracking-widest mb-2">DELETE PATIENT</h3>
            <p className="text-center text-xs text-gray-500 uppercase tracking-wide mb-6">
              This will permanently delete <span className="font-bold text-gray-700">{patient.name}</span> and all associated records. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="flex-1 py-3 rounded-xl border border-pastel-blue/30 text-gray-600 text-xs font-bold uppercase tracking-widest hover:bg-pastel-bg transition-colors"
              >
                CANCEL
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 py-3 rounded-xl bg-pastel-coral text-white text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity"
              >
                {isDeleting ? 'DELETING...' : 'DELETE'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg bg-pastel-bg flex items-center justify-center flex-shrink-0 mt-0.5">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">{label}</p>
        <p className="text-sm text-gray-700 font-medium leading-snug">{value}</p>
      </div>
    </div>
  );
}

function ClinicalSection({ title, content, color }: { title: string; content: string; color: string }) {
  const bgMap: Record<string, string> = {
    'pastel-mint': 'bg-pastel-mint/20 border-pastel-mint/30',
    'pastel-blue': 'bg-pastel-blue/20 border-pastel-blue/30',
    'pastel-lavender': 'bg-pastel-lavender/20 border-pastel-lavender/30',
    'pastel-green': 'bg-pastel-green/20 border-pastel-green/30',
    'pastel-yellow': 'bg-pastel-yellow/40 border-pastel-yellow/40',
  };
  const cls = bgMap[color] || 'bg-pastel-bg border-pastel-blue/20';
  return (
    <div className="bg-white border border-pastel-blue/20 rounded-2xl p-5 sm:p-6 shadow-sm">
      <h3 className="text-sm font-bold text-gray-800 uppercase tracking-widest mb-3 pb-3 border-b border-pastel-blue/10">
        {title}
      </h3>
      <div className={`rounded-xl border p-4 ${cls}`}>
        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{content}</p>
      </div>
    </div>
  );
}
