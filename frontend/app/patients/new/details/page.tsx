'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { patientAPI } from '@/lib/api/patients';

const inputCls = 'flex w-full border bg-transparent px-3 py-1 text-base shadow-sm transition-colors placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-pastel-mint-dark md:text-sm mt-2 h-12 rounded-xl border-pastel-blue/30';
const textareaCls = 'flex w-full border bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-pastel-mint-dark md:text-sm mt-2 rounded-xl border-pastel-blue/30';
const labelCls = 'text-xs font-bold text-gray-600 uppercase tracking-widest';
const selectCls = 'mt-2 h-12 w-full rounded-xl border border-pastel-blue/30 bg-white px-4 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pastel-mint-dark';

const AO_BONES = [
  { id: 'clavicle',     label: 'CLAVICLE',     top: '16%', left: '38%' },
  { id: 'scapula',      label: 'SCAPULA',      top: '16%', left: '62%' },
  { id: 'humerus',      label: 'HUMERUS',      top: '28%', left: '26%' },
  { id: 'spine',        label: 'SPINE',        top: '32%', left: '50%' },
  { id: 'radius-ulna',  label: 'RADIUS/ULNA',  top: '38%', left: '74%' },
  { id: 'pelvis',       label: 'PELVIS',       top: '44%', left: '50%' },
  { id: 'hand',         label: 'HAND',         top: '50%', left: '26%' },
  { id: 'femur',        label: 'FEMUR',        top: '58%', left: '58%' },
  { id: 'tibia-fibula', label: 'TIBIA/FIBULA', top: '72%', left: '42%' },
  { id: 'foot',         label: 'FOOT',         top: '90%', left: '55%' },
];

function VoiceButton({ onResult }: { onResult: (text: string) => void }) {
  const [listening, setListening] = useState(false);

  const handleVoice = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return alert('Voice not supported in this browser');
    const rec = new SpeechRecognition();
    rec.lang = 'en-US';
    rec.interimResults = false;
    rec.onstart = () => setListening(true);
    rec.onend = () => setListening(false);
    rec.onresult = (e: any) => onResult(e.results[0][0].transcript);
    rec.start();
  };

  return (
    <button
      type="button"
      onClick={handleVoice}
      className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${listening ? 'bg-red-100 text-red-600' : 'bg-pastel-blue/30 text-gray-600 hover:bg-pastel-blue/50'}`}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <line x1="12" x2="12" y1="19" y2="22" />
      </svg>
      {listening ? 'LISTENING...' : 'VOICE'}
    </button>
  );
}

export default function PatientDetailsPage() {
  const router = useRouter();
  const auth = useAuth();
  const imageUploadRef = useRef<HTMLInputElement>(null);

  const today = new Date().toISOString().split('T')[0];

  const [form, setForm] = useState({
    name: '', age: '', gender: 'male', phone: '', address: '',
    dateOfAdmission: today, hospitalName: '', referredBy: '',
    paymentType: 'cash', cashAmount: '',
    onExamination: '', briefHistory: '', diagnosis: '',
    surgery: '', operationNotes: '',
    aoClassification: '',
  });
  const [imageType, setImageType] = useState('xray');
  const [imagePhase, setImagePhase] = useState('preoperative');
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [selectedBone, setSelectedBone] = useState<string>('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ file: string; pct: number } | null>(null);

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }));

  const appendVoice = (field: string) => (text: string) =>
    setForm(prev => ({ ...prev, [field]: prev[field as keyof typeof prev] ? prev[field as keyof typeof prev] + ' ' + text : text }));

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setMediaFiles((prev: File[]) => [...prev, ...Array.from(e.target.files!)]);
  };

  const handleBoneClick = (boneId: string) => {
    setSelectedBone(boneId);
    setForm(prev => ({ ...prev, aoClassification: boneId.toUpperCase().replace('-', '/') }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { setError('Patient name is required'); return; }
    if (!auth.token) { setError('Not authenticated'); return; }
    setError('');
    setSubmitting(true);
    try {
      const result = await patientAPI.create(auth.token, {
        name: form.name,
        age: form.age ? parseInt(form.age) : undefined,
        gender: form.gender,
        phone: form.phone,
        address: form.address,
        dateOfAdmission: form.dateOfAdmission,
        hospitalName: form.hospitalName,
        referredBy: form.referredBy,
        paymentType: form.paymentType,
        cashAmount: form.cashAmount ? parseFloat(form.cashAmount) : undefined,
        onExamination: form.onExamination,
        briefHistory: form.briefHistory,
        diagnosis: form.diagnosis,
        surgery: form.surgery,
        operationNotes: form.operationNotes,
        aoClassification: form.aoClassification,
        details: form.diagnosis,
        medicalHistory: form.briefHistory,
      } as any);

      const newPatientId = result.patient.id;

      // Upload media files one by one with progress
      for (const file of mediaFiles) {
        setUploadProgress({ file: file.name, pct: 0 });
        await patientAPI.uploadMedia(
          auth.token,
          newPatientId,
          file,
          imageType,
          imagePhase,
          (pct) => setUploadProgress({ file: file.name, pct })
        );
      }

      router.push(`/patients/${newPatientId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add patient');
    } finally {
      setSubmitting(false);
      setUploadProgress(null);
    }
  };

  return (
    <div className="min-h-screen bg-pastel-bg">
      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-6 sm:py-10">

        {/* Back */}
        <button onClick={() => router.back()} className="mb-6 sm:mb-8 flex items-center gap-2 text-gray-500 hover:text-gray-700 text-xs font-bold uppercase tracking-widest">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
            <path d="m12 19-7-7 7-7" /><path d="M19 12H5" />
          </svg>
          BACK
        </button>

        <div className="mb-6 sm:mb-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 uppercase tracking-wider">ADD NEW PATIENT</h1>
          <p className="text-[10px] sm:text-xs text-gray-500 mt-2 uppercase tracking-widest">UPLOAD IMAGES AND ENTER DETAILS</p>
        </div>

        <form onSubmit={handleSubmit}>

          {/* Clinical Images */}
          <div className="border border-pastel-mint-dark/30 bg-pastel-mint/10 rounded-2xl p-5 sm:p-8 mb-5 sm:mb-8 shadow-sm">
            <div className="space-y-4">
              <label className="text-slate-700 text-base font-semibold">Clinical Images</label>
              <div className="flex flex-wrap gap-3 items-end">
                <div>
                  <label className="text-xs font-medium text-slate-600" htmlFor="image-type">Image Type</label>
                  <select id="image-type" value={imageType} onChange={e => setImageType(e.target.value)} className="mt-1 h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pastel-mint-dark">
                    <option value="xray">X-Ray</option>
                    <option value="clinical">Clinical/Wound</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600" htmlFor="image-phase">Phase</label>
                  <select id="image-phase" value={imagePhase} onChange={e => setImagePhase(e.target.value)} className="mt-1 h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pastel-mint-dark">
                    <option value="preoperative">Pre-operative</option>
                    <option value="intraoperative">Intra-operative</option>
                    <option value="postoperative">Post-operative</option>
                  </select>
                </div>
                <div>
                  <input ref={imageUploadRef} accept="image/*,video/*" multiple className="hidden" type="file" onChange={handleImageUpload} />
                  <label htmlFor="upload-clinical">
                    <button type="button" onClick={() => imageUploadRef.current?.click()} className="inline-flex items-center gap-2 border border-slate-200 rounded-md h-9 px-4 text-sm font-medium shadow-sm hover:bg-gray-50 transition">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-1" aria-hidden="true">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" x2="12" y1="3" y2="15" />
                      </svg>
                      Upload Images
                    </button>
                  </label>
                </div>
                <div className="text-sm text-slate-600">Total: <strong>{mediaFiles.length}</strong> file(s)</div>
              </div>
              {mediaFiles.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-sm">No files uploaded yet. Select type and phase, then upload images or videos.</div>
              ) : (
                <div className="flex flex-wrap gap-2 mt-2">
                  {mediaFiles.map((file: File, i: number) => (
                    <div key={i} className="relative w-20 h-20 rounded-xl border border-pastel-blue/20 overflow-hidden bg-pastel-bg flex items-center justify-center">
                      {file.type.startsWith('video/') ? (
                        <>
                          <video src={URL.createObjectURL(file)} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="1" className="drop-shadow">
                              <polygon points="5 3 19 12 5 21 5 3" />
                            </svg>
                          </div>
                        </>
                      ) : (
                        <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
                      )}
                      <button
                        type="button"
                        onClick={() => setMediaFiles((prev: File[]) => prev.filter((_: File, idx: number) => idx !== i))}
                        className="absolute top-1 right-1 w-5 h-5 bg-black/50 rounded-full flex items-center justify-center text-white text-xs hover:bg-black/70"
                      >×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Personal Information */}
          <div className="border border-pastel-blue/20 bg-white rounded-2xl p-5 sm:p-8 mb-5 sm:mb-8 shadow-sm">
            <h2 className="text-xs sm:text-sm font-bold text-gray-700 mb-4 sm:mb-6 uppercase tracking-widest border-b border-pastel-blue/10 pb-3 sm:pb-4">PERSONAL INFORMATION</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-7">
              <div>
                <label className={labelCls} htmlFor="name">FULL NAME</label>
                <input id="name" className={inputCls} placeholder="Enter patient name" value={form.name} onChange={set('name')} />
              </div>
              <div>
                <label className={labelCls} htmlFor="age">AGE</label>
                <input id="age" type="number" className={inputCls} placeholder="Enter age" value={form.age} onChange={set('age')} />
              </div>
              <div>
                <label className={labelCls} htmlFor="sex">SEX</label>
                <select id="sex" value={form.gender} onChange={set('gender')} className={selectCls}>
                  <option value="male">MALE</option>
                  <option value="female">FEMALE</option>
                  <option value="other">OTHER</option>
                </select>
              </div>
              <div>
                <label className={labelCls} htmlFor="phone">PHONE NUMBER</label>
                <input id="phone" className={inputCls} placeholder="Enter phone number" value={form.phone} onChange={set('phone')} />
              </div>
              <div className="md:col-span-2">
                <label className={labelCls} htmlFor="address">ADDRESS</label>
                <textarea id="address" className={textareaCls} placeholder="Enter full address" rows={2} value={form.address} onChange={set('address')} />
              </div>
              <div>
                <label className={labelCls} htmlFor="date_of_admission">DATE OF ADMISSION / SURGERY</label>
                <input id="date_of_admission" type="date" className={inputCls} value={form.dateOfAdmission} onChange={set('dateOfAdmission')} />
              </div>
              <div>
                <label className={labelCls} htmlFor="hospital_name">HOSPITAL NAME</label>
                <input id="hospital_name" className={inputCls} placeholder="Enter hospital name" value={form.hospitalName} onChange={set('hospitalName')} />
              </div>
              <div>
                <label className={labelCls} htmlFor="referred_by">REFERRED BY</label>
                <input id="referred_by" className={inputCls} placeholder="Dr. Name / Self" value={form.referredBy} onChange={set('referredBy')} />
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="border border-pastel-blue/20 bg-white rounded-2xl p-5 sm:p-8 mb-5 sm:mb-8 shadow-sm">
            <h2 className="text-xs sm:text-sm font-bold text-gray-700 mb-4 sm:mb-6 uppercase tracking-widest border-b border-pastel-blue/10 pb-3 sm:pb-4">PAYMENT INFORMATION</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-7">
              <div>
                <label className={labelCls} htmlFor="payment_type">PAYMENT TYPE</label>
                <select id="payment_type" value={form.paymentType} onChange={set('paymentType')} className={selectCls}>
                  <option value="cash">CASH</option>
                  <option value="mediclaim">MEDICLAIM</option>
                  <option value="pmjay">PMJAY AYUSHMAN</option>
                </select>
              </div>
              <div>
                <label className={labelCls} htmlFor="cash_amount">CASH AMOUNT</label>
                <input id="cash_amount" type="number" className={inputCls} placeholder="Enter amount in rupees" value={form.cashAmount} onChange={set('cashAmount')} />
              </div>
            </div>
          </div>

          {/* Clinical Information */}
          <div className="border border-pastel-blue/20 bg-white rounded-2xl p-5 sm:p-8 mb-5 sm:mb-8 shadow-sm">
            <h2 className="text-xs sm:text-sm font-bold text-gray-700 mb-4 sm:mb-6 uppercase tracking-widest border-b border-pastel-blue/10 pb-3 sm:pb-4">CLINICAL INFORMATION</h2>
            <div className="space-y-5 sm:space-y-7">

              <div>
                <div className="flex items-center justify-between">
                  <label className={labelCls} htmlFor="on_examination">ON EXAMINATION</label>
                  <VoiceButton onResult={appendVoice('onExamination')} />
                </div>
                <textarea id="on_examination" className={textareaCls} placeholder="Findings on examination of patient on arrival..." rows={3} value={form.onExamination} onChange={set('onExamination')} />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className={labelCls} htmlFor="brief_history">BRIEF HISTORY</label>
                  <VoiceButton onResult={appendVoice('briefHistory')} />
                </div>
                <textarea id="brief_history" className={textareaCls} placeholder="Enter patient medical history" rows={3} value={form.briefHistory} onChange={set('briefHistory')} />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className={labelCls} htmlFor="diagnosis">DIAGNOSIS</label>
                  <VoiceButton onResult={appendVoice('diagnosis')} />
                </div>
                <textarea id="diagnosis" className={textareaCls} placeholder="Enter diagnosis" rows={2} value={form.diagnosis} onChange={set('diagnosis')} />
              </div>

              {/* AO Fracture Classification */}
              <div className="space-y-5">
                <label className={labelCls}>AO FRACTURE CLASSIFICATION</label>
                <div className="border border-pastel-blue/20 bg-pastel-bg/50 rounded-2xl p-5 shadow">
                  <label className={`${labelCls} mb-4 block`}>TAP ON BONE / ANATOMICAL AREA</label>
                  <div className="relative w-full max-w-md mx-auto" style={{ aspectRatio: '1 / 1.1' }}>
                    <img
                      alt="Human Skeleton"
                      className="w-full h-full object-contain rounded-xl"
                      draggable={false}
                      src="https://static.prod-images.emergentagent.com/jobs/f8e6d4fa-3ecc-422d-ae31-09f281369d89/images/9b38028b2ef4626bd4da9da3f1a360916e3d5b2df3c0f3178829d0ac20b32054.png"
                    />
                    {AO_BONES.map((bone) => (
                      <button
                        key={bone.id}
                        type="button"
                        onClick={() => handleBoneClick(bone.id)}
                        title={bone.label}
                        className="absolute flex items-center justify-center transition-all duration-200 group z-10"
                        style={{ top: bone.top, left: bone.left, transform: 'translate(-50%, -50%)' }}
                      >
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110 ${selectedBone === bone.id ? 'bg-pastel-mint-dark' : 'bg-[#5B8FB9] hover:bg-pastel-mint-dark'}`}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-white" aria-hidden="true">
                            <path d="M5 12h14" /><path d="M12 5v14" />
                          </svg>
                        </div>
                        <span className="absolute top-full mt-1.5 whitespace-nowrap text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md bg-gray-700/80 text-white opacity-0 group-hover:opacity-100 transition-all">
                          {bone.label}
                        </span>
                      </button>
                    ))}
                  </div>
                  {selectedBone && (
                    <p className="mt-3 text-center text-xs font-bold text-pastel-mint-dark uppercase tracking-widest">
                      Selected: {selectedBone.toUpperCase().replace('-', '/')}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className={labelCls} htmlFor="surgery">SURGERY</label>
                <input id="surgery" className={inputCls} placeholder="Enter surgery name/type" value={form.surgery} onChange={set('surgery')} />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className={labelCls} htmlFor="operation_notes">OPERATION NOTES</label>
                  <VoiceButton onResult={appendVoice('operationNotes')} />
                </div>
                <textarea id="operation_notes" className={textareaCls} placeholder="Enter detailed operation notes" rows={4} value={form.operationNotes} onChange={set('operationNotes')} />
              </div>
            </div>
          </div>

          {error && <div className="text-red-500 text-sm bg-red-50 p-3 rounded mb-4">{error}</div>}

          {/* Actions */}
          <div className="flex gap-3 sm:gap-5">
            <button
              type="button"
              onClick={() => router.push('/dashboard')}
              className="flex-1 border border-pastel-blue/30 h-12 sm:h-14 rounded-xl font-bold text-[10px] sm:text-xs uppercase tracking-widest text-gray-600 hover:bg-pastel-blue/10 transition"
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-pastel-mint-dark hover:opacity-90 text-white h-12 sm:h-14 rounded-xl font-bold text-[10px] sm:text-xs uppercase tracking-widest shadow transition disabled:opacity-50"
            >
              {uploadProgress ? `UPLOADING... ${uploadProgress.pct}%` : submitting ? 'SAVING...' : 'ADD PATIENT'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
