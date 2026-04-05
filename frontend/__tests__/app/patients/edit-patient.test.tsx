import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EditPatientPage from '@/app/patients/[id]/edit/page';

// ── Mocks ────────────────────────────────────────────────────────────────────

const mockPush = jest.fn();
const mockBack = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush, back: mockBack }),
  useParams: () => ({ id: '5' }),
}));

jest.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    isLoading: false,
    isAuthenticated: true,
    token: 'test-token',
    user: { id: 1, username: 'drsmith' },
  }),
}));

const mockGetById = jest.fn();
const mockUpdate = jest.fn();
jest.mock('@/lib/api/patients', () => ({
  patientAPI: {
    getById: (...args: any[]) => mockGetById(...args),
    update: (...args: any[]) => mockUpdate(...args),
  },
}));

const existingPatient = {
  id: 5,
  name: 'Alice Kumar',
  age: 32,
  gender: 'female',
  phone: '9876543210',
  address: '123 Main St',
  date_of_admission: '2024-03-01T00:00:00Z',
  hospital_name: 'City Hospital',
  referred_by: 'Dr. Jones',
  payment_type: 'cash',
  cash_amount: 5000,
  on_examination: 'Swelling noted',
  brief_history: 'Fall injury',
  diagnosis: 'Femur fracture',
  surgery: 'ORIF',
  operation_notes: 'Successful fixation',
  ao_classification: 'FEMUR',
};

// ── Tests ────────────────────────────────────────────────────────────────────

beforeEach(() => {
  jest.clearAllMocks();
  mockGetById.mockResolvedValue({ patient: existingPatient });
  mockUpdate.mockResolvedValue({ patient: { ...existingPatient, name: 'Alice Kumar Updated' } });
});

describe('EditPatientPage', () => {
  it('shows loading state initially', () => {
    mockGetById.mockImplementation(() => new Promise(() => {})); // never resolves
    render(<EditPatientPage />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('renders the EDIT PATIENT heading after loading', async () => {
    render(<EditPatientPage />);
    expect(await screen.findByText(/edit patient/i)).toBeInTheDocument();
  });

  it('pre-populates the name field with existing patient data', async () => {
    render(<EditPatientPage />);
    expect(await screen.findByDisplayValue('Alice Kumar')).toBeInTheDocument();
  });

  it('pre-populates the diagnosis field', async () => {
    render(<EditPatientPage />);
    expect(await screen.findByDisplayValue('Femur fracture')).toBeInTheDocument();
  });

  it('pre-populates the surgery field', async () => {
    render(<EditPatientPage />);
    expect(await screen.findByDisplayValue('ORIF')).toBeInTheDocument();
  });

  it('shows the selected AO bone from existing data', async () => {
    render(<EditPatientPage />);
    expect(await screen.findByText(/selected: femur/i)).toBeInTheDocument();
  });

  it('shows an error state when patient load fails', async () => {
    mockGetById.mockRejectedValueOnce(new Error('Not found'));
    render(<EditPatientPage />);
    expect(await screen.findByText(/failed to load patient data/i)).toBeInTheDocument();
  });

  it('renders the SAVE CHANGES submit button', async () => {
    render(<EditPatientPage />);
    expect(await screen.findByRole('button', { name: /save changes/i })).toBeInTheDocument();
  });

  it('calls patientAPI.update with updated data on submit', async () => {
    render(<EditPatientPage />);
    await screen.findByDisplayValue('Alice Kumar');

    const nameInput = screen.getByLabelText(/full name/i);
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, 'Alice Kumar Updated');

    await userEvent.click(screen.getByRole('button', { name: /save changes/i }));

    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(1));
    const [token, patientId, data] = mockUpdate.mock.calls[0];
    expect(token).toBe('test-token');
    expect(patientId).toBe(5);
    expect(data.name).toBe('Alice Kumar Updated');
  });

  it('navigates to patient detail page after successful update', async () => {
    render(<EditPatientPage />);
    await screen.findByRole('button', { name: /save changes/i });
    await userEvent.click(screen.getByRole('button', { name: /save changes/i }));
    await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/patients/5'));
  });

  it('shows an error message when update API call fails', async () => {
    mockUpdate.mockRejectedValueOnce(new Error('Update failed'));
    render(<EditPatientPage />);
    await screen.findByRole('button', { name: /save changes/i });
    await userEvent.click(screen.getByRole('button', { name: /save changes/i }));
    expect(await screen.findByText('Update failed')).toBeInTheDocument();
  });

  it('CANCEL button calls router.back()', async () => {
    render(<EditPatientPage />);
    await screen.findByRole('button', { name: /cancel/i });
    await userEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(mockBack).toHaveBeenCalled();
  });

  it('BACK button calls router.back()', async () => {
    render(<EditPatientPage />);
    await screen.findByRole('button', { name: /back/i });
    await userEvent.click(screen.getByRole('button', { name: /back/i }));
    expect(mockBack).toHaveBeenCalled();
  });

  it('does not show media upload section (edit mode)', async () => {
    render(<EditPatientPage />);
    await screen.findByText(/edit patient/i);
    expect(screen.queryByText(/clinical images/i)).not.toBeInTheDocument();
  });
});
