import { useState, useEffect } from 'react';
import { getStoredToken, getStoredUser } from '@/services/auth';

export interface User {
  id: string;
  role: string;
  name: string;
  email: string;
  updatedAt: string | Date;
  createdAt: string | Date;
  preferences: {
    budget: number | string;
    usage: string;
  };
  token?: string; // Agregar token opcional
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = getStoredToken();
    const storedUser = getStoredUser();

    console.log('useAuth - token:', storedToken);
    console.log('useAuth - storedUser:', storedUser);

    if (storedToken && storedUser) {
      // Asegurar que el usuario tiene id y role
      const userWithDefaults = {
        ...storedUser,
        id: storedUser.id || 'unknown',
        role: storedUser.role || 'user',
        token: storedToken // Incluir el token en el objeto user
      };
      setUser(userWithDefaults);
      setToken(storedToken);
    }
    setIsLoading(false);
  }, []);

  const getUserDestination = (): string => {
    console.log('getUserDestination - user:', user);

    if (!user) return '/login';

    if (user.role === 'user') {
      return '/profile';
    }

    // Para roles como admin, editor, support, etc.
    return '/admin';
  };

  return {
    user,
    token,
    isLoading,
    isAuthenticated: !!user && !!token,
    getUserDestination
  };
};