'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { patientAPI } from '@/lib/api/patients';
import { PatientFormValues } from '@/lib/constants/patientForm';
import PatientForm from '@/components/PatientForm';

export default function EditPatientPage() {
  const router = useRouter();
  const params = useParams();
  const auth = useAuth();
  const patientId = Number(params.id);

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [initialValues, setInitialValues] = useState<Partial<PatientFormValues> | undefined>();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!auth.isLoading && !auth.isAuthenticated) {
      router.push('/login');
    }
  }, [auth.isLoading, auth.isAuthenticated, router]);

  useEffect(() => {
    if (!auth.token || !patientId) return;
    const load = async () => {
      try {
        setIsLoading(true);
        const { patient } = await patientAPI.getById(auth.token!, patientId);
        setInitialValues({
          name: patient.name ?? '',
          age: patient.age != null ? String(patient.age) : '',
          gender: patient.gender ?? 'male',
          phone: patient.phone ?? '',
          address: patient.address ?? '',
          dateOfAdmission: patient.date_of_admission
            ? patient.date_of_admission.split('T')[0]
            : '',
          hospitalName: patient.hospital_name ?? '',
          referredBy: patient.referred_by ?? '',
          paymentType: patient.payment_type ?? 'cash',
          cashAmount: patient.cash_amount != null ? String(patient.cash_amount) : '',
          onExamination: patient.on_examination ?? '',
          briefHistory: patient.brief_history ?? '',
          diagnosis: patient.diagnosis ?? '',
          surgery: patient.surgery ?? '',
          operationNotes: patient.operation_notes ?? '',
          aoClassification: patient.ao_classification ?? '',
        });
      } catch {
        setLoadError('Failed to load patient data');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [auth.token, patientId]);

  const handleSubmit = async (values: PatientFormValues, _mediaFiles: File[], _imageType: string, _imagePhase: string) => {
    if (!values.name.trim()) { setError('Patient name is required'); return; }
    if (!auth.token) { setError('Not authenticated'); return; }

    setError('');
    setSubmitting(true);

    try {
      await patientAPI.update(auth.token, patientId, {
        name: values.name,
        age: values.age ? parseInt(values.age) : undefined,
        gender: values.gender,
        phone: values.phone,
        address: values.address,
        date_of_admission: values.dateOfAdmission || undefined,
        hospital_name: values.hospitalName,
        referred_by: values.referredBy,
        payment_type: values.paymentType,
        cash_amount: values.cashAmount ? parseFloat(values.cashAmount) : undefined,
        on_examination: values.onExamination,
        brief_history: values.briefHistory,
        diagnosis: values.diagnosis,
        surgery: values.surgery,
        operation_notes: values.operationNotes,
        ao_classification: values.aoClassification,
        details: values.diagnosis,
        medical_history: values.briefHistory,
      } as any);
      router.push(`/patients/${patientId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update patient');
    } finally {
      setSubmitting(false);
    }
  };

  if (auth.isLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-pastel-bg">
        <p className="text-gray-500 text-sm uppercase tracking-widest">Loading...</p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-pastel-bg gap-4">
        <p className="text-red-500 text-sm uppercase tracking-widest">{loadError}</p>
        <button
          onClick={() => router.back()}
          className="text-pastel-mint-dark text-xs font-bold uppercase tracking-widest hover:underline"
        >
          Go Back
        </button>
      </div>
    );
  }

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
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 uppercase tracking-wider">EDIT PATIENT</h1>
          <p className="text-[10px] sm:text-xs text-gray-500 mt-2 uppercase tracking-widest">UPDATE PATIENT DETAILS</p>
        </div>

        <PatientForm
          initialValues={initialValues}
          submitLabel="SAVE CHANGES"
          submitting={submitting}
          error={error}
          onSubmit={handleSubmit}
          onCancel={() => router.back()}
        />
      </div>
    </div>
  );
}
