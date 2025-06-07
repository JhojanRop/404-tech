import { api } from "@/lib/api";
import { getStoredToken } from "@/services/auth";

// Tipos para el sistema de recomendaciones
export type Usage = "gaming" | "work" | "study" | "mixed";
export type Budget = "low" | "medium" | "high" | "unlimited";
export type Experience = "beginner" | "intermediate" | "advanced";
export type Priority = "performance" | "price" | "portability" | "aesthetics";
export type Portability = "laptop" | "desktop" | "either";
export type Gaming = "not-important" | "casual" | "regular" | "hardcore";
export type Software = "gaming" | "programming" | "streaming" | "office" | "browsing" | "design";
export type FeedbackType = "like" | "dislike" | "purchased" | "not_interested";

export interface UserProfile {
  user_id: string;
  usage: Usage;
  budget: Budget;
  experience: Experience;
  priority: Priority;
  portability: Portability;
  gaming: Gaming;
  software: Software[];
}

export interface UserProfileResponse extends UserProfile {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  discount?: number;
  rating?: number;
  category: string[];
  images: string[];
  specs: Record<string, string>;
  stock: number;
  usage: string[];
  description: string;
  matchPercentage: number;
  whyRecommended: string[];
}

export interface RecommendationsResponse {
  products: Product[];
  userProfile: UserProfileResponse;
  totalMatches: number;
}

export interface FeedbackData {
  user_id: string;
  product_id: string;
  recommendation_id?: string;
  feedback_type: FeedbackType;
  rating?: number;
  comment?: string;
}

export interface FeedbackResponse {
  message: string;
}

// Función helper mejorada para obtener el token actual con más debugging
function getCurrentToken(): string {
  console.log('🔍 Verificando token en localStorage...');
  
  const token = getStoredToken();
  
  console.log('Token obtenido:', token ? `${token.substring(0, 20)}...` : 'null/undefined');
  console.log('Longitud del token:', token?.length || 0);
  
  if (!token) {
    console.error('❌ No hay token en localStorage');
    throw new Error('Usuario no autenticado. Inicia sesión nuevamente.');
  }
  
  // Verificar formato básico del token JWT
  const parts = token.split('.');
  if (parts.length !== 3) {
    console.error('❌ Token no tiene formato JWT válido');
    throw new Error('Token inválido. Inicia sesión nuevamente.');
  }
  
  console.log('✅ Token parece válido');
  return token;
}

// Función de diagnóstico para verificar el estado de autenticación
export function debugAuthState() {
  console.log('=== DEBUG: Estado de Autenticación ===');
  
  // Verificar localStorage
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  console.log('Token en localStorage:', token ? `${token.substring(0, 20)}...` : 'NO ENCONTRADO');
  console.log('Usuario en localStorage:', user ? JSON.parse(user) : 'NO ENCONTRADO');
  
  // Verificar cookies
  const cookies = document.cookie.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=');
    acc[key] = value;
    return acc;
  }, {} as Record<string, string>);
  
  console.log('Token en cookies:', cookies.token ? `${cookies.token.substring(0, 20)}...` : 'NO ENCONTRADO');
  
  // Verificar si el token está expirado (básico)
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Math.floor(Date.now() / 1000);
      const isExpired = payload.exp && payload.exp < now;
      
      console.log('Token expira en:', new Date(payload.exp * 1000));
      console.log('Token expirado:', isExpired);
      
      if (isExpired) {
        console.error('❌ TOKEN EXPIRADO');
        return false;
      }
    } catch (e) {
      console.error('❌ Error al decodificar token:', e);
      return false;
    }
  }
  
  return !!token;
}

// Función mejorada para generar recomendaciones con mejor debugging
export async function generateRecommendations(userProfile: UserProfile): Promise<RecommendationsResponse> {
  try {
    console.log('🚀 Iniciando generateRecommendations...');
    
    // Debug del estado de autenticación
    const isAuthValid = debugAuthState();
    if (!isAuthValid) {
      throw new Error('Estado de autenticación inválido');
    }
    
    const token = getCurrentToken();
    
    console.log('📤 Enviando request a /recommendations');
    console.log('Perfil:', userProfile);
    
    const response = await api.post<RecommendationsResponse>('/recommendations', userProfile, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Raw response:', response);
    console.log('Raw response.data:', response.data);
    console.log('✅ Respuesta exitosa:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('❌ Error en generateRecommendations:', error);
    
    if (error.message === 'Usuario no autenticado. Inicia sesión nuevamente.' || 
        error.message === 'Estado de autenticación inválido') {
      throw error;
    }
    
    if (error.response?.status === 401) {
      console.error('❌ Error 401 - Token rechazado por el servidor');
      console.error('Response data:', error.response?.data);
      
      // Limpiar token inválido
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      throw new Error('Sesión expirada. Inicia sesión nuevamente.');
    }
    
    throw new Error(error.response?.data?.error || 'Error al generar recomendaciones');
  }
}

// Función para crear recomendaciones con token personalizado (usada en la página)
export async function createRecommendations(userProfile: any, token: string): Promise<RecommendationsResponse> {
  try {
    console.log('Enviando perfil:', userProfile);
    console.log('Token:', token ? 'Token presente' : 'Token ausente');

    const response = await api.post<RecommendationsResponse>('/recommendations', userProfile, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('Respuesta exitosa:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error completo:', error);
    console.error('Response data:', error.response?.data);
    console.error('Response status:', error.response?.status);
    console.error('Response headers:', error.response?.headers);

    if (error.response?.status === 401) {
      throw new Error('Usuario no autenticado. Inicia sesión nuevamente.');
    }
    if (error.response?.status === 400) {
      const errorMessage = error.response?.data?.error || 'Datos de perfil inválidos';
      console.error('Error 400 details:', error.response?.data);
      throw new Error(errorMessage);
    }
    if (error.response?.status === 404) {
      throw new Error('Endpoint no encontrado. Verifica la URL del API.');
    }
    if (error.response?.status >= 500) {
      throw new Error('Error del servidor. Intenta más tarde.');
    }

    // Error de red o conexión
    if (!error.response) {
      throw new Error('Error de conexión. Verifica tu conexión a internet.');
    }

    throw new Error(error.response?.data?.error || 'Error al generar recomendaciones');
  }
}

// Función para obtener recomendaciones por usuario
export async function getUserRecommendations(userId: string): Promise<RecommendationsResponse> {
  try {
    const token = getCurrentToken();
    const response = await api.get<RecommendationsResponse>(`/recommendations/user/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error: any) {
    if (error.message === 'Usuario no autenticado. Inicia sesión nuevamente.') {
      throw error;
    }
    if (error.response?.status === 404) {
      throw new Error('Perfil de usuario no encontrado. Crea uno primero.');
    }
    throw new Error(error.response?.data?.error || 'Error al obtener recomendaciones');
  }
}

// Función para enviar feedback
export async function sendRecommendationFeedback(feedbackData: FeedbackData): Promise<FeedbackResponse> {
  try {
    const token = getCurrentToken();
    const response = await api.post<FeedbackResponse>('/recommendations/feedback', feedbackData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error: any) {
    if (error.message === 'Usuario no autenticado. Inicia sesión nuevamente.') {
      throw error;
    }
    throw new Error(error.response?.data?.error || 'Error al enviar feedback');
  }
}

// Función helper para validar el perfil de usuario
export function validateUserProfile(profile: Partial<UserProfile>): string[] {
  const errors: string[] = [];
  const requiredFields: (keyof UserProfile)[] = [
    'user_id', 'usage', 'budget', 'experience', 'priority', 'portability', 'gaming', 'software'
  ];

  requiredFields.forEach(field => {
    if (!profile[field]) {
      errors.push(field);
    }
  });

  // Validar que software sea un array no vacío
  if (profile.software && (!Array.isArray(profile.software) || profile.software.length === 0)) {
    errors.push('software debe ser un array con al menos un elemento');
  }

  return errors;
}

// Función helper para crear un perfil de usuario completo
export function createUserProfile(data: {
  user_id: string;
  usage: Usage;
  budget: Budget;
  experience: Experience;
  priority: Priority;
  portability: Portability;
  gaming: Gaming;
  software: Software[];
}): UserProfile {
  return {
    user_id: data.user_id,
    usage: data.usage,
    budget: data.budget,
    experience: data.experience,
    priority: data.priority,
    portability: data.portability,
    gaming: data.gaming,
    software: data.software
  };
}

// Función helper para obtener recomendaciones con manejo de errores mejorado
export async function getRecommendationsWithErrorHandling(userId: string): Promise<{
  success: boolean;
  data?: RecommendationsResponse;
  error?: string;
  needsProfile?: boolean;
}> {
  try {
    const data = await getUserRecommendations(userId);
    return { success: true, data };
  } catch (error: any) {
    const errorMessage = error.message || 'Error desconocido';
    const needsProfile = errorMessage.includes('Perfil de usuario no encontrado');

    return {
      success: false,
      error: errorMessage,
      needsProfile
    };
  }
}

// Función helper para generar recomendaciones con validación
export async function generateRecommendationsWithValidation(userProfile: UserProfile): Promise<{
  success: boolean;
  data?: RecommendationsResponse;
  error?: string;
  validationErrors?: string[];
}> {
  try {
    // Validar el perfil antes de enviar
    const validationErrors = validateUserProfile(userProfile);
    if (validationErrors.length > 0) {
      return {
        success: false,
        error: 'Datos de perfil inválidos',
        validationErrors
      };
    }

    const data = await generateRecommendations(userProfile);
    return { success: true, data };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Error al generar recomendaciones'
    };
  }
}

// Función adicional para obtener recomendaciones por usuario con token personalizado
export async function getUserRecommendationsWithToken(userId: string, token: string): Promise<RecommendationsResponse> {
  try {
    const response = await api.get<RecommendationsResponse>(`/recommendations/user/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      throw new Error('Perfil de usuario no encontrado. Crea uno primero.');
    }
    if (error.response?.status === 401) {
      throw new Error('Usuario no autenticado. Inicia sesión nuevamente.');
    }
    throw new Error(error.response?.data?.error || 'Error al obtener recomendaciones');
  }
}

// Nueva función simplificada que combina lo mejor de ambas versiones
export async function createRecommendationsSimplified(userProfile: UserProfile): Promise<RecommendationsResponse> {
  try {
    // Validar el perfil antes de enviar
    const validationErrors = validateUserProfile(userProfile);
    if (validationErrors.length > 0) {
      throw new Error(`Datos de perfil inválidos: ${validationErrors.join(', ')}`);
    }

    const token = getCurrentToken();
    console.log('Enviando perfil:', userProfile);

    const response = await api.post<RecommendationsResponse>('/recommendations', userProfile, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('Respuesta exitosa:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error completo:', error);
    
    if (error.message === 'Usuario no autenticado. Inicia sesión nuevamente.') {
      throw error;
    }
    
    if (error.response?.status === 401) {
      throw new Error('Usuario no autenticado. Inicia sesión nuevamente.');
    }
    if (error.response?.status === 400) {
      const errorMessage = error.response?.data?.error || 'Datos de perfil inválidos';
      throw new Error(errorMessage);
    }
    if (error.response?.status === 404) {
      throw new Error('Endpoint no encontrado. Verifica la URL del API.');
    }
    if (error.response?.status >= 500) {
      throw new Error('Error del servidor. Intenta más tarde.');
    }

    if (!error.response) {
      throw new Error('Error de conexión. Verifica tu conexión a internet.');
    }

    throw new Error(error.response?.data?.error || 'Error al generar recomendaciones');
  }
}
