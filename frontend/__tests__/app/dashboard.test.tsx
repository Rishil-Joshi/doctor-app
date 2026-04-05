import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DashboardPage from '@/app/dashboard/page';

// ── Mocks ────────────────────────────────────────────────────────────────────

const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

const mockLogout = jest.fn();
// Mutable so individual tests can override it
let mockAuthState = {
  isLoading: false,
  isAuthenticated: true,
  token: 'test-token',
  user: { id: 1, username: 'drsmith', email: '', first_name: 'John', last_name: 'Smith', phone: '', created_at: '' },
  logout: mockLogout,
};
jest.mock('@/hooks/useAuth', () => ({
  useAuth: () => mockAuthState,
}));

const mockGetAll = jest.fn();
jest.mock('@/lib/api/patients', () => ({
  patientAPI: { getAll: (...args: any[]) => mockGetAll(...args) },
}));

const mockPatients = [
  { id: 1, name: 'Alice Kumar', age: 32, gender: 'female', created_at: '2024-01-15T00:00:00Z' },
  { id: 2, name: 'Bob Sharma', age: 55, gender: 'male', created_at: '2024-02-10T00:00:00Z' },
];

// ── Tests ────────────────────────────────────────────────────────────────────

beforeEach(() => {
  jest.clearAllMocks();
  mockGetAll.mockResolvedValue({ patients: mockPatients });
  mockAuthState = {
    isLoading: false,
    isAuthenticated: true,
    token: 'test-token',
    user: { id: 1, username: 'drsmith', email: '', first_name: 'John', last_name: 'Smith', phone: '', created_at: '' },
    logout: mockLogout,
  };
});

describe('DashboardPage', () => {
  it('renders the SURGIFLOW header', async () => {
    render(<DashboardPage />);
    expect(await screen.findByText('SURGIFLOW')).toBeInTheDocument();
  });

  it('renders the Add New Patient button', async () => {
    render(<DashboardPage />);
    expect(await screen.findByRole('button', { name: /add new patient/i })).toBeInTheDocument();
  });

  it('renders the logged-in username', async () => {
    render(<DashboardPage />);
    expect(await screen.findAllByText(/drsmith/i)).not.toHaveLength(0);
  });

  it('fetches and displays the patient list', async () => {
    render(<DashboardPage />);
    expect(await screen.findByText('Alice Kumar')).toBeInTheDocument();
    expect(await screen.findByText('Bob Sharma')).toBeInTheDocument();
  });

  it('shows total patient count', async () => {
    render(<DashboardPage />);
    expect(await screen.findByText(/2 patients total/i)).toBeInTheDocument();
  });

  it('filters patients by search input', async () => {
    render(<DashboardPage />);
    await screen.findByText('Alice Kumar');
    await userEvent.type(screen.getByPlaceholderText(/search patients/i), 'alice');
    expect(screen.getByText('Alice Kumar')).toBeInTheDocument();
    expect(screen.queryByText('Bob Sharma')).not.toBeInTheDocument();
  });

  it('shows "No patients found" when search has no match', async () => {
    render(<DashboardPage />);
    await screen.findByText('Alice Kumar');
    await userEvent.type(screen.getByPlaceholderText(/search patients/i), 'xyz-not-exist');
    expect(screen.getByText(/no patients found/i)).toBeInTheDocument();
  });

  it('navigates to add patient when Add New Patient is clicked', async () => {
    render(<DashboardPage />);
    await userEvent.click(await screen.findByRole('button', { name: /add new patient/i }));
    expect(mockPush).toHaveBeenCalledWith('/patients/new/details');
  });

  it('navigates to patient detail when a patient card is clicked', async () => {
    render(<DashboardPage />);
    await userEvent.click(await screen.findByText('Alice Kumar'));
    expect(mockPush).toHaveBeenCalledWith('/patients/1');
  });

  it('calls auth.logout and redirects to /login on logout', async () => {
    render(<DashboardPage />);
    await screen.findByText('SURGIFLOW');
    const logoutBtn = screen.getAllByRole('button').find(
      (btn) => btn.querySelector('polyline[points="16 17 21 12 16 7"]') !== null
    );
    if (logoutBtn) await userEvent.click(logoutBtn);
    expect(mockLogout).toHaveBeenCalled();
    expect(mockPush).toHaveBeenCalledWith('/login');
  });

  it('shows an error message when patient fetch fails', async () => {
    mockGetAll.mockRejectedValueOnce(new Error('Network error'));
    render(<DashboardPage />);
    expect(await screen.findByText(/failed to fetch patients/i)).toBeInTheDocument();
  });

  it('redirects to /login when not authenticated', async () => {
    mockAuthState = { ...mockAuthState, isAuthenticated: false, token: null as any };
    render(<DashboardPage />);
    await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/login'));
  });

  it('shows loading state while auth is resolving', () => {
    mockAuthState = { ...mockAuthState, isLoading: true };
    render(<DashboardPage />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
});
