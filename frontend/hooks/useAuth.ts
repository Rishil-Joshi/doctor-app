import { useEffect, useState } from 'react';
import { User, AuthResponse } from '@/lib/types';
import { getAuthToken, getUserData, saveAuthToken, saveUserData, clearAuthData, isAuthenticated } from '@/lib/storage';
import { authAPI } from '@/lib/api/auth';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Restore auth state from localStorage on mount
  useEffect(() => {
    const storedToken = getAuthToken();
    const storedUser = getUserData();

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(storedUser);
    }

    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<void> => {
    try {
      setError(null);
      setIsLoading(true);
      const response: AuthResponse = await authAPI.login({ username, password });

      setToken(response.token);
      setUser(response.user);
      saveAuthToken(response.token);
      saveUserData(response.user);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: any): Promise<void> => {
    try {
      setError(null);
      setIsLoading(true);
      const response: AuthResponse = await authAPI.register(userData);

      setToken(response.token);
      setUser(response.user);
      saveAuthToken(response.token);
      saveUserData(response.user);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = (): void => {
    setUser(null);
    setToken(null);
    setError(null);
    clearAuthData();
  };

  return {
    user,
    token,
    isLoading,
    error,
    login,
    register,
    logout,
    isAuthenticated: isAuthenticated(),
  };
};
