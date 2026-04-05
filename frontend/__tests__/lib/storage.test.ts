import {
  saveAuthToken,
  getAuthToken,
  saveUserData,
  getUserData,
  clearAuthData,
  isAuthenticated,
} from '@/lib/storage';
import { AUTH_TOKEN_KEY, USER_DATA_KEY } from '@/lib/constants';
import { User } from '@/lib/types';

const mockUser: User = {
  id: 1,
  username: 'drsmith',
  email: 'smith@hospital.com',
  first_name: 'John',
  last_name: 'Smith',
  phone: '9876543210',
  created_at: '2024-01-01T00:00:00Z',
};

beforeEach(() => {
  localStorage.clear();
});

describe('saveAuthToken / getAuthToken', () => {
  it('saves and retrieves a token', () => {
    saveAuthToken('test-token-123');
    expect(getAuthToken()).toBe('test-token-123');
  });

  it('returns null when no token is stored', () => {
    expect(getAuthToken()).toBeNull();
  });
});

describe('saveUserData / getUserData', () => {
  it('saves and retrieves user data', () => {
    saveUserData(mockUser);
    expect(getUserData()).toEqual(mockUser);
  });

  it('returns null when no user data is stored', () => {
    expect(getUserData()).toBeNull();
  });
});

describe('clearAuthData', () => {
  it('removes both token and user data from localStorage', () => {
    saveAuthToken('token');
    saveUserData(mockUser);
    clearAuthData();
    expect(getAuthToken()).toBeNull();
    expect(getUserData()).toBeNull();
  });
});

describe('isAuthenticated', () => {
  it('returns true when a token is stored', () => {
    saveAuthToken('token');
    expect(isAuthenticated()).toBe(true);
  });

  it('returns false when no token is stored', () => {
    expect(isAuthenticated()).toBe(false);
  });
});
