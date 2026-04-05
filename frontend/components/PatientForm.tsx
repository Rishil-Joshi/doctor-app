'use client';

import { useState } from 'react';
import {
  AO_BONES,
  SKELETON_IMAGE_URL,
  GENDER_OPTIONS,
  PAYMENT_TYPE_OPTIONS,
  IMAGE_TYPE_OPTIONS,
  IMAGE_PHASE_OPTIONS,
  PATIENT_FORM_CLASSES as cls,
  DEFAULT_PATIENT_FORM_VALUES,
  PatientFormValues,
} from '@/lib/constants/patientForm';

// ─── VoiceButton ──────────────────────────────────────────────────────────────

function VoiceButton({ onResult }: { onResult: (text: string) => void }) {
  const [listening, setListening] = useState(false);

  const handleVoice = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
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
      className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${
        listening ? 'bg-red-100 text-red-600' : 'bg-pastel-blue/30 text-gray-600 hover:bg-pastel-blue/50'
      }`}
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

// ─── Props ────────────────────────────────────────────────────────────────────

export interface PatientFormProps {
  /** Pre-populated values (edit mode) or undefined (add mode uses defaults) */
  initialValues?: Partial<PatientFormValues>;
  /** Whether to show the media upload section (add mode only) */
  showMediaUpload?: boolean;
  /** Label for the submit button */
  submitLabel: string;
  /** Whether the form is in a submitting state */
  submitting: boolean;
  /** Upload progress text to show instead of submitLabel (e.g. "UPLOADING... 40%") */
  uploadProgressLabel?: string;
  /** Error message to display above action buttons */
  error?: string;
  /** Called with form values when the form is submitted */
  onSubmit: (values: PatientFormValues, mediaFiles: File[], imageType: string, imagePhase: string) => void;
  /** Called when cancel is clicked */
  onCancel: () => void;
}

// ─── PatientForm ──────────────────────────────────────────────────────────────

export default function PatientForm({
  initialValues,
  showMediaUpload = false,
  submitLabel,
  submitting,
  uploadProgressLabel,
  error,
  onSubmit,
  onCancel,
}: PatientFormProps) {
  const merged = { ...DEFAULT_PATIENT_FORM_VALUES, ...initialValues };

  const [form, setForm] = useState<PatientFormValues>(merged);
  const [selectedBone, setSelectedBone] = useState<string>(() => {
    if (!merged.aoClassification) return '';
    const match = AO_BONES.find(
      (b) => b.id.toUpperCase().replace('-', '/') === merged.aoClassification.toUpperCase()
    );
    return match ? match.id : '';
  });

  // Media upload state (only used when showMediaUpload = true)
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [imageType, setImageType] = useState('xray');
  const [imagePhase, setImagePhase] = useState('preoperative');
  const imageUploadRef = useState<HTMLInputElement | null>(null);

  const set = (field: keyof PatientFormValues) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const appendVoice = (field: keyof PatientFormValues) => (text: string) =>
    setForm((prev) => ({
      ...prev,
      [field]: prev[field] ? `${prev[field]} ${text}` : text,
    }));

  const handleBoneClick = (boneId: string) => {
    setSelectedBone(boneId);
    setForm((prev) => ({ ...prev, aoClassification: boneId.toUpperCase().replace('-', '/') }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setMediaFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
  };

  const removeMediaFile = (index: number) =>
    setMediaFiles((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form, mediaFiles, imageType, imagePhase);
  };

  return (
    <form onSubmit={handleSubmit}>

      {/* ── Media Upload (add mode only) ─────────────────────────────────── */}
      {showMediaUpload && (
        <div className="border border-pastel-mint-dark/30 bg-pastel-mint/10 rounded-2xl p-5 sm:p-8 mb-5 sm:mb-8 shadow-sm">
          <div className="space-y-4">
            <label className="text-slate-700 text-base font-semibold">Clinical Images</label>
            <div className="flex flex-wrap gap-3 items-end">
              <div>
                <label className="text-xs font-medium text-slate-600" htmlFor="image-type">Image Type</label>
                <select
                  id="image-type"
                  value={imageType}
                  onChange={(e) => setImageType(e.target.value)}
                  className="mt-1 h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pastel-mint-dark"
                >
                  {IMAGE_TYPE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600" htmlFor="image-phase">Phase</label>
                <select
                  id="image-phase"
                  value={imagePhase}
                  onChange={(e) => setImagePhase(e.target.value)}
                  className="mt-1 h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pastel-mint-dark"
                >
                  {IMAGE_PHASE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <input
                  ref={(el) => { (imageUploadRef as any)[0] = el; }}
                  accept="image/*,video/*"
                  multiple
                  className="hidden"
                  type="file"
                  id="media-upload"
                  onChange={handleImageUpload}
                />
                <button
                  type="button"
                  onClick={() => document.getElementById('media-upload')?.click()}
                  className="inline-flex items-center gap-2 border border-slate-200 rounded-md h-9 px-4 text-sm font-medium shadow-sm hover:bg-gray-50 transition"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-1" aria-hidden="true">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" x2="12" y1="3" y2="15" />
                  </svg>
                  Upload Images
                </button>
              </div>
              <div className="text-sm text-slate-600">
                Total: <strong>{mediaFiles.length}</strong> file(s)
              </div>
            </div>

            {mediaFiles.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-sm">
                No files uploaded yet. Select type and phase, then upload images or videos.
              </div>
            ) : (
              <div className="flex flex-wrap gap-2 mt-2">
                {mediaFiles.map((file, i) => (
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
                      onClick={() => removeMediaFile(i)}
                      className="absolute top-1 right-1 w-5 h-5 bg-black/50 rounded-full flex items-center justify-center text-white text-xs hover:bg-black/70"
                    >×</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Personal Information ─────────────────────────────────────────── */}
      <div className={cls.sectionCard}>
        <h2 className={cls.sectionTitle}>PERSONAL INFORMATION</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-7">
          <div>
            <label className={cls.label} htmlFor="name">FULL NAME</label>
            <input id="name" className={cls.input} placeholder="Enter patient name" value={form.name} onChange={set('name')} />
          </div>
          <div>
            <label className={cls.label} htmlFor="age">AGE</label>
            <input id="age" type="number" className={cls.input} placeholder="Enter age" value={form.age} onChange={set('age')} />
          </div>
          <div>
            <label className={cls.label} htmlFor="sex">SEX</label>
            <select id="sex" value={form.gender} onChange={set('gender')} className={cls.select}>
              {GENDER_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={cls.label} htmlFor="phone">PHONE NUMBER</label>
            <input
              id="phone"
              type="tel"
              inputMode="numeric"
              maxLength={10}
              pattern="\d{10}"
              className={cls.input}
              placeholder="Enter 10-digit phone number"
              value={form.phone}
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
                setForm((prev) => ({ ...prev, phone: digits }));
              }}
            />
          </div>
          <div className="md:col-span-2">
            <label className={cls.label} htmlFor="address">ADDRESS</label>
            <textarea id="address" className={cls.textarea} placeholder="Enter full address" rows={2} value={form.address} onChange={set('address')} />
          </div>
          <div>
            <label className={cls.label} htmlFor="date_of_admission">DATE OF ADMISSION / SURGERY</label>
            <input id="date_of_admission" type="date" className={cls.input} value={form.dateOfAdmission} onChange={set('dateOfAdmission')} />
          </div>
          <div>
            <label className={cls.label} htmlFor="hospital_name">HOSPITAL NAME</label>
            <input id="hospital_name" className={cls.input} placeholder="Enter hospital name" value={form.hospitalName} onChange={set('hospitalName')} />
          </div>
          <div>
            <label className={cls.label} htmlFor="referred_by">REFERRED BY</label>
            <input id="referred_by" className={cls.input} placeholder="Dr. Name / Self" value={form.referredBy} onChange={set('referredBy')} />
          </div>
        </div>
      </div>

      {/* ── Payment Information ──────────────────────────────────────────── */}
      <div className={cls.sectionCard}>
        <h2 className={cls.sectionTitle}>PAYMENT INFORMATION</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-7">
          <div>
            <label className={cls.label} htmlFor="payment_type">PAYMENT TYPE</label>
            <select id="payment_type" value={form.paymentType} onChange={set('paymentType')} className={cls.select}>
              {PAYMENT_TYPE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={cls.label} htmlFor="cash_amount">CASH AMOUNT</label>
            <input id="cash_amount" type="number" className={cls.input} placeholder="Enter amount in rupees" value={form.cashAmount} onChange={set('cashAmount')} />
          </div>
        </div>
      </div>

      {/* ── Clinical Information ─────────────────────────────────────────── */}
      <div className={cls.sectionCard}>
        <h2 className={cls.sectionTitle}>CLINICAL INFORMATION</h2>
        <div className="space-y-5 sm:space-y-7">

          <div>
            <div className="flex items-center justify-between">
              <label className={cls.label} htmlFor="on_examination">ON EXAMINATION</label>
              <VoiceButton onResult={appendVoice('onExamination')} />
            </div>
            <textarea id="on_examination" className={cls.textarea} placeholder="Findings on examination of patient on arrival..." rows={3} value={form.onExamination} onChange={set('onExamination')} />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className={cls.label} htmlFor="brief_history">BRIEF HISTORY</label>
              <VoiceButton onResult={appendVoice('briefHistory')} />
            </div>
            <textarea id="brief_history" className={cls.textarea} placeholder="Enter patient medical history" rows={3} value={form.briefHistory} onChange={set('briefHistory')} />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className={cls.label} htmlFor="diagnosis">DIAGNOSIS</label>
              <VoiceButton onResult={appendVoice('diagnosis')} />
            </div>
            <textarea id="diagnosis" className={cls.textarea} placeholder="Enter diagnosis" rows={2} value={form.diagnosis} onChange={set('diagnosis')} />
          </div>

          {/* AO Fracture Classification */}
          <div className="space-y-5">
            <label className={cls.label}>AO FRACTURE CLASSIFICATION</label>
            <div className="border border-pastel-blue/20 bg-pastel-bg/50 rounded-2xl p-5 shadow">
              <label className={`${cls.label} mb-4 block`}>TAP ON BONE / ANATOMICAL AREA</label>
              <div className="relative w-full max-w-md mx-auto" style={{ aspectRatio: '1 / 1.1' }}>
                <img
                  alt="Human Skeleton"
                  className="w-full h-full object-contain rounded-xl"
                  draggable={false}
                  src={SKELETON_IMAGE_URL}
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
            <label className={cls.label} htmlFor="surgery">SURGERY</label>
            <input id="surgery" className={cls.input} placeholder="Enter surgery name/type" value={form.surgery} onChange={set('surgery')} />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className={cls.label} htmlFor="operation_notes">OPERATION NOTES</label>
              <VoiceButton onResult={appendVoice('operationNotes')} />
            </div>
            <textarea id="operation_notes" className={cls.textarea} placeholder="Enter detailed operation notes" rows={4} value={form.operationNotes} onChange={set('operationNotes')} />
          </div>
        </div>
      </div>

      {/* ── Error ────────────────────────────────────────────────────────── */}
      {error && (
        <div className="text-red-500 text-sm bg-red-50 p-3 rounded mb-4">{error}</div>
      )}

      {/* ── Actions ──────────────────────────────────────────────────────── */}
      <div className="flex gap-3 sm:gap-5">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 border border-pastel-blue/30 h-12 sm:h-14 rounded-xl font-bold text-[10px] sm:text-xs uppercase tracking-widest text-gray-600 hover:bg-pastel-blue/10 transition"
        >
          CANCEL
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="flex-1 bg-pastel-mint-dark hover:opacity-90 text-white h-12 sm:h-14 rounded-xl font-bold text-[10px] sm:text-xs uppercase tracking-widest shadow transition disabled:opacity-50"
        >
          {uploadProgressLabel ?? (submitting ? 'SAVING...' : submitLabel)}
        </button>
      </div>
    </form>
  );
}
