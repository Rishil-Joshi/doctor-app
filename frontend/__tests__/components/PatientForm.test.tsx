import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PatientForm from '@/components/PatientForm';
import { DEFAULT_PATIENT_FORM_VALUES } from '@/lib/constants/patientForm';

// ── Helpers ──────────────────────────────────────────────────────────────────

const mockOnSubmit = jest.fn();
const mockOnCancel = jest.fn();

const defaultProps = {
  submitLabel: 'SAVE',
  submitting: false,
  onSubmit: mockOnSubmit,
  onCancel: mockOnCancel,
};

beforeEach(() => {
  jest.clearAllMocks();
});

// ── Rendering ────────────────────────────────────────────────────────────────

describe('PatientForm — rendering', () => {
  it('renders Personal Information section', () => {
    render(<PatientForm {...defaultProps} />);
    expect(screen.getByText(/personal information/i)).toBeInTheDocument();
  });

  it('renders Payment Information section', () => {
    render(<PatientForm {...defaultProps} />);
    expect(screen.getByText(/payment information/i)).toBeInTheDocument();
  });

  it('renders Clinical Information section', () => {
    render(<PatientForm {...defaultProps} />);
    expect(screen.getByText(/clinical information/i)).toBeInTheDocument();
  });

  it('renders AO Fracture Classification section', () => {
    render(<PatientForm {...defaultProps} />);
    expect(screen.getByText(/ao fracture classification/i)).toBeInTheDocument();
  });

  it('renders the submit button with provided label', () => {
    render(<PatientForm {...defaultProps} submitLabel="ADD PATIENT" />);
    expect(screen.getByRole('button', { name: /add patient/i })).toBeInTheDocument();
  });

  it('renders the cancel button', () => {
    render(<PatientForm {...defaultProps} />);
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  it('does not render media upload section by default', () => {
    render(<PatientForm {...defaultProps} />);
    expect(screen.queryByText(/clinical images/i)).not.toBeInTheDocument();
  });

  it('renders media upload section when showMediaUpload is true', () => {
    render(<PatientForm {...defaultProps} showMediaUpload />);
    expect(screen.getByText(/clinical images/i)).toBeInTheDocument();
  });

  it('renders error message when provided', () => {
    render(<PatientForm {...defaultProps} error="Patient name is required" />);
    expect(screen.getByText('Patient name is required')).toBeInTheDocument();
  });

  it('disables submit button when submitting', () => {
    render(<PatientForm {...defaultProps} submitting />);
    expect(screen.getByRole('button', { name: /saving/i })).toBeDisabled();
  });

  it('shows uploadProgressLabel when provided', () => {
    render(<PatientForm {...defaultProps} submitting uploadProgressLabel="UPLOADING... 50%" />);
    expect(screen.getByRole('button', { name: /uploading/i })).toBeInTheDocument();
  });
});

// ── Pre-population ────────────────────────────────────────────────────────────

describe('PatientForm — pre-population with initialValues', () => {
  const initialValues = {
    name: 'John Doe',
    age: '45',
    gender: 'male',
    phone: '9876543210',
    diagnosis: 'Fracture of femur',
    surgery: 'ORIF',
    aoClassification: 'FEMUR',
  };

  it('pre-populates name field', () => {
    render(<PatientForm {...defaultProps} initialValues={initialValues} />);
    expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
  });

  it('pre-populates age field', () => {
    render(<PatientForm {...defaultProps} initialValues={initialValues} />);
    expect(screen.getByDisplayValue('45')).toBeInTheDocument();
  });

  it('pre-populates diagnosis field', () => {
    render(<PatientForm {...defaultProps} initialValues={initialValues} />);
    expect(screen.getByDisplayValue('Fracture of femur')).toBeInTheDocument();
  });

  it('pre-populates surgery field', () => {
    render(<PatientForm {...defaultProps} initialValues={initialValues} />);
    expect(screen.getByDisplayValue('ORIF')).toBeInTheDocument();
  });

  it('highlights the correct bone when aoClassification is set', () => {
    render(<PatientForm {...defaultProps} initialValues={initialValues} />);
    expect(screen.getByText(/selected: femur/i)).toBeInTheDocument();
  });
});

// ── Interactions ──────────────────────────────────────────────────────────────

describe('PatientForm — interactions', () => {
  it('calls onCancel when cancel button is clicked', async () => {
    render(<PatientForm {...defaultProps} />);
    await userEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it('calls onSubmit with form values when submitted', async () => {
    render(<PatientForm {...defaultProps} />);
    await userEvent.type(screen.getByLabelText(/full name/i), 'Jane Doe');
    await userEvent.click(screen.getByRole('button', { name: /save/i }));
    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    const [values] = mockOnSubmit.mock.calls[0];
    expect(values.name).toBe('Jane Doe');
  });

  it('phone field only accepts digits and caps at 10', async () => {
    render(<PatientForm {...defaultProps} />);
    const phoneInput = screen.getByLabelText(/phone number/i);
    await userEvent.type(phoneInput, 'abc1234567890');
    // non-digits stripped, capped at 10
    expect((phoneInput as HTMLInputElement).value).toMatch(/^\d{0,10}$/);
  });

  it('updates AO classification when a bone is clicked', async () => {
    render(<PatientForm {...defaultProps} />);
    const femurBtn = screen.getByTitle('FEMUR');
    await userEvent.click(femurBtn);
    expect(screen.getByText(/selected: femur/i)).toBeInTheDocument();
  });

  it('passes imageType and imagePhase to onSubmit when showMediaUpload', async () => {
    render(<PatientForm {...defaultProps} showMediaUpload />);
    await userEvent.click(screen.getByRole('button', { name: /save/i }));
    const [, , imageType, imagePhase] = mockOnSubmit.mock.calls[0];
    expect(imageType).toBe('xray');
    expect(imagePhase).toBe('preoperative');
  });
});
