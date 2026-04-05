// ─── Form CSS Classes ────────────────────────────────────────────────────────

export const PATIENT_FORM_CLASSES = {
  input: 'flex w-full border bg-transparent px-3 py-1 text-base shadow-sm transition-colors placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-pastel-mint-dark md:text-sm mt-2 h-12 rounded-xl border-pastel-blue/30',
  textarea: 'flex w-full border bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-pastel-mint-dark md:text-sm mt-2 rounded-xl border-pastel-blue/30',
  label: 'text-xs font-bold text-gray-600 uppercase tracking-widest',
  select: 'mt-2 h-12 w-full rounded-xl border border-pastel-blue/30 bg-white px-4 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pastel-mint-dark',
  sectionCard: 'border border-pastel-blue/20 bg-white rounded-2xl p-5 sm:p-8 mb-5 sm:mb-8 shadow-sm',
  sectionTitle: 'text-xs sm:text-sm font-bold text-gray-700 mb-4 sm:mb-6 uppercase tracking-widest border-b border-pastel-blue/10 pb-3 sm:pb-4',
};

// ─── AO Fracture Classification Bones ────────────────────────────────────────

export const AO_BONES = [
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
] as const;

export const SKELETON_IMAGE_URL =
  'https://static.prod-images.emergentagent.com/jobs/f8e6d4fa-3ecc-422d-ae31-09f281369d89/images/9b38028b2ef4626bd4da9da3f1a360916e3d5b2df3c0f3178829d0ac20b32054.png';

// ─── Dropdown Options ─────────────────────────────────────────────────────────

export const GENDER_OPTIONS = [
  { value: 'male',   label: 'MALE' },
  { value: 'female', label: 'FEMALE' },
  { value: 'other',  label: 'OTHER' },
] as const;

export const PAYMENT_TYPE_OPTIONS = [
  { value: 'cash',      label: 'CASH' },
  { value: 'mediclaim', label: 'MEDICLAIM' },
  { value: 'pmjay',     label: 'PMJAY AYUSHMAN' },
] as const;

export const IMAGE_TYPE_OPTIONS = [
  { value: 'xray',     label: 'X-Ray' },
  { value: 'clinical', label: 'Clinical/Wound' },
] as const;

export const IMAGE_PHASE_OPTIONS = [
  { value: 'preoperative',    label: 'Pre-operative' },
  { value: 'intraoperative',  label: 'Intra-operative' },
  { value: 'postoperative',   label: 'Post-operative' },
] as const;

// ─── Default Form Values ──────────────────────────────────────────────────────

export const DEFAULT_PATIENT_FORM_VALUES = {
  name: '',
  age: '',
  gender: 'male' as string,
  phone: '',
  address: '',
  dateOfAdmission: new Date().toISOString().split('T')[0],
  hospitalName: '',
  referredBy: '',
  paymentType: 'cash' as string,
  cashAmount: '',
  onExamination: '',
  briefHistory: '',
  diagnosis: '',
  surgery: '',
  operationNotes: '',
  aoClassification: '',
};

export type PatientFormValues = typeof DEFAULT_PATIENT_FORM_VALUES;
