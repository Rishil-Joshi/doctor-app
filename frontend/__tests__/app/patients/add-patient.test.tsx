import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddPatientDetailsPage from '@/app/patients/new/details/page';

// ── Mocks ────────────────────────────────────────────────────────────────────

const mockPush = jest.fn();
const mockBack = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush, back: mockBack }),
}));

jest.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    isLoading: false,
    isAuthenticated: true,
    token: 'test-token',
    user: { id: 1, username: 'drsmith' },
  }),
}));

const mockCreate = jest.fn();
const mockUploadMedia = jest.fn();
jest.mock('@/lib/api/patients', () => ({
  patientAPI: {
    create: (...args: any[]) => mockCreate(...args),
    uploadMedia: (...args: any[]) => mockUploadMedia(...args),
  },
}));

// ── Tests ────────────────────────────────────────────────────────────────────

beforeEach(() => {
  jest.clearAllMocks();
  mockCreate.mockResolvedValue({ patient: { id: 42 } });
  mockUploadMedia.mockResolvedValue({ media: { id: 1, url: 'http://example.com/img.jpg' } });
});

describe('AddPatientDetailsPage', () => {
  it('renders the ADD NEW PATIENT heading', () => {
    render(<AddPatientDetailsPage />);
    expect(screen.getByText(/add new patient/i)).toBeInTheDocument();
  });

  it('renders the PatientForm with media upload section', () => {
    render(<AddPatientDetailsPage />);
    expect(screen.getByText(/clinical images/i)).toBeInTheDocument();
  });

  it('renders the ADD PATIENT submit button', () => {
    render(<AddPatientDetailsPage />);
    expect(screen.getByRole('button', { name: /add patient/i })).toBeInTheDocument();
  });

  it('renders the CANCEL button', () => {
    render(<AddPatientDetailsPage />);
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  it('CANCEL navigates to /dashboard', async () => {
    render(<AddPatientDetailsPage />);
    await userEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(mockPush).toHaveBeenCalledWith('/dashboard');
  });

  it('BACK button calls router.back()', async () => {
    render(<AddPatientDetailsPage />);
    await userEvent.click(screen.getByRole('button', { name: /back/i }));
    expect(mockBack).toHaveBeenCalled();
  });

  it('calls patientAPI.create with form data on submit', async () => {
    render(<AddPatientDetailsPage />);
    await userEvent.type(screen.getByLabelText(/full name/i), 'Test Patient');
    await userEvent.click(screen.getByRole('button', { name: /add patient/i }));

    await waitFor(() => expect(mockCreate).toHaveBeenCalledTimes(1));
    const [token, data] = mockCreate.mock.calls[0];
    expect(token).toBe('test-token');
    expect(data.name).toBe('Test Patient');
  });

  it('navigates to the new patient detail page after creation', async () => {
    render(<AddPatientDetailsPage />);
    await userEvent.type(screen.getByLabelText(/full name/i), 'Test Patient');
    await userEvent.click(screen.getByRole('button', { name: /add patient/i }));

    await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/patients/42'));
  });

  it('shows an error if patient name is empty on submit', async () => {
    render(<AddPatientDetailsPage />);
    await userEvent.click(screen.getByRole('button', { name: /add patient/i }));
    expect(await screen.findByText(/patient name is required/i)).toBeInTheDocument();
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it('shows an error when API call fails', async () => {
    mockCreate.mockRejectedValueOnce(new Error('Server error'));
    render(<AddPatientDetailsPage />);
    await userEvent.type(screen.getByLabelText(/full name/i), 'Test Patient');
    await userEvent.click(screen.getByRole('button', { name: /add patient/i }));
    expect(await screen.findByText('Server error')).toBeInTheDocument();
  });
});
