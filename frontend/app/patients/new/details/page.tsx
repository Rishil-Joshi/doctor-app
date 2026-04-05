'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { patientAPI } from '@/lib/api/patients';
import { PatientFormValues } from '@/lib/constants/patientForm';
import PatientForm from '@/components/PatientForm';

export default function AddPatientDetailsPage() {
  const router = useRouter();
  const auth = useAuth();

  const [submitting, setSubmitting] = useState(false);
  const [uploadProgressLabel, setUploadProgressLabel] = useState<string | undefined>();
  const [error, setError] = useState('');

  const handleSubmit = async (
    values: PatientFormValues,
    mediaFiles: File[],
    imageType: string,
    imagePhase: string
  ) => {
    if (!values.name.trim()) { setError('Patient name is required'); return; }
    if (!auth.token) { setError('Not authenticated'); return; }

    setError('');
    setSubmitting(true);

    try {
      const result = await patientAPI.create(auth.token, {
        name: values.name,
        age: values.age ? parseInt(values.age) : undefined,
        gender: values.gender,
        phone: values.phone,
        address: values.address,
        dateOfAdmission: values.dateOfAdmission,
        hospitalName: values.hospitalName,
        referredBy: values.referredBy,
        paymentType: values.paymentType,
        cashAmount: values.cashAmount ? parseFloat(values.cashAmount) : undefined,
        onExamination: values.onExamination,
        briefHistory: values.briefHistory,
        diagnosis: values.diagnosis,
        surgery: values.surgery,
        operationNotes: values.operationNotes,
        aoClassification: values.aoClassification,
        details: values.diagnosis,
        medicalHistory: values.briefHistory,
      } as any);

      const newPatientId = result.patient.id;

      for (const file of mediaFiles) {
        setUploadProgressLabel(`UPLOADING ${file.name}... 0%`);
        try {
          await patientAPI.uploadMedia(
            auth.token,
            newPatientId,
            file,
            imageType,
            imagePhase,
            (pct) => setUploadProgressLabel(`UPLOADING... ${pct}%`)
          );
        } catch (uploadErr) {
          console.error('Media upload failed for', file.name, uploadErr);
        }
      }

      router.push(`/patients/${newPatientId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add patient');
    } finally {
      setSubmitting(false);
      setUploadProgressLabel(undefined);
    }
  };

  return (
    <div className="min-h-screen bg-pastel-bg">
      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-6 sm:py-10">

        <button
          onClick={() => router.back()}
          className="mb-6 sm:mb-8 flex items-center gap-2 text-gray-500 hover:text-gray-700 text-xs font-bold uppercase tracking-widest"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
            <path d="m12 19-7-7 7-7" /><path d="M19 12H5" />
          </svg>
          BACK
        </button>

        <div className="mb-6 sm:mb-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 uppercase tracking-wider">ADD NEW PATIENT</h1>
          <p className="text-[10px] sm:text-xs text-gray-500 mt-2 uppercase tracking-widest">UPLOAD IMAGES AND ENTER DETAILS</p>
        </div>

        <PatientForm
          showMediaUpload
          submitLabel="ADD PATIENT"
          submitting={submitting}
          uploadProgressLabel={uploadProgressLabel}
          error={error}
          onSubmit={handleSubmit}
          onCancel={() => router.push('/dashboard')}
        />
      </div>
    </div>
  );
}
