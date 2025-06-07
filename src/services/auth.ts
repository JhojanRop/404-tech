import { api } from "@/lib/api";

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface RegisterResponse {
  name: string,
  email: string,
  role: string,
  preferences: {
    budget: number,
    usage: string
  },
  createdAt: string | Date,
  updatedAt: string | Date,
  id: string
}

export interface LoginData {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id?: string;
    role?: string;
    name: string;
    email: string;
    updatedAt: string | Date;
    createdAt: string | Date;
    preferences: {
      budget: number | string;
      usage: string;
    };
  };
  id?: string;
  role?: string;
}

export const login = async (data: LoginData): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>("/login", data);

  // Debug: Ver la estructura completa de la respuesta
  console.log('Respuesta completa del API:', response);
  console.log('response.user:', response.user);
  console.log('response.id:', response.id);
  console.log('response.role:', response.role);

  // Intentar diferentes estructuras posibles
  const userData = {
    ...response.user,
    // Priorizar id y role del nivel superior, luego del user, finalmente valores por defecto
    id: response.id || response.user?.id || 'unknown',
    role: response.role || response.user?.role || 'user'
  };

  console.log('userData que se va a guardar:', userData);

  storeAuthData(response.token, userData);
  return response;
};

export const register = async (data: RegisterData): Promise<RegisterResponse> => {
  return await api.post("/register", data);
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  document.cookie = 'user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
};

export const getStoredToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
};

export const getStoredUser = () => {
  if (typeof window === 'undefined') return null;
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const storeAuthData = (token: string, user: {
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
}) => {
  // Verificar que tenemos datos mínimos requeridos
  if (!user.id || !user.role) {
    console.error('Error: Datos de usuario incompletos:', user);
    // Asignar valores por defecto si faltan
    user.id = user.id || 'unknown';
    user.role = user.role || 'user';
  }

  console.log('Guardando en localStorage:', user);

  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
  document.cookie = `token=${token}; path=/; max-age=86400; SameSite=strict`;
  document.cookie = `user=${JSON.stringify(user)}; path=/; max-age=86400; SameSite=strict`;

  // Verificar que se guardó correctamente
  const savedUser = localStorage.getItem('user');
  console.log('Usuario guardado en localStorage:', savedUser ? JSON.parse(savedUser) : null);
};
