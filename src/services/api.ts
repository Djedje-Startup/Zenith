// services/api.ts
import axios, { AxiosInstance, AxiosError } from 'axios';

// Configuration
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.surya-education.com/v1';
const API_TIMEOUT = 30000;

// Types d'erreur
export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class NetworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NetworkError';
  }
}

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthError';
  }
}

// Stockage simple en mémoire (à remplacer par AsyncStorage plus tard)
let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
};

export const getAuthToken = () => authToken;

// Création du client Axios
const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: API_BASE_URL,
    timeout: API_TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });

  // Intercepteur requête
  client.interceptors.request.use(
    (config) => {
      if (authToken) {
        config.headers.Authorization = `Bearer ${authToken}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(new NetworkError('Erreur de connexion'));
    }
  );

  // Intercepteur réponse
  client.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      if (!error.response) {
        return Promise.reject(new NetworkError('Pas de connexion internet'));
      }

      const { status, data } = error.response;
      const errorData = data as any;

      switch (status) {
        case 401:
          setAuthToken(null);
          return Promise.reject(new AuthError(errorData?.message || 'Session expirée'));
        case 403:
          return Promise.reject(new ApiError(status, 'FORBIDDEN', 'Accès non autorisé', errorData));
        case 404:
          return Promise.reject(new ApiError(status, 'NOT_FOUND', 'Ressource non trouvée', errorData));
        case 422:
          return Promise.reject(new ApiError(status, 'VALIDATION_ERROR', 'Données invalides', errorData?.errors));
        case 500:
        case 502:
        case 503:
          return Promise.reject(new ApiError(status, 'SERVER_ERROR', 'Erreur serveur', errorData));
        default:
          return Promise.reject(new ApiError(status, 'UNKNOWN_ERROR', errorData?.message || 'Une erreur est survenue', errorData));
      }
    }
  );

  return client;
};

export const apiClient = createApiClient();

// Helpers pour les requêtes
export const api = {
  get: <T = any>(url: string, params?: any): Promise<T> =>
    apiClient.get(url, { params }).then(res => res.data),
  
  post: <T = any>(url: string, data?: any): Promise<T> =>
    apiClient.post(url, data).then(res => res.data),
  
  put: <T = any>(url: string, data?: any): Promise<T> =>
    apiClient.put(url, data).then(res => res.data),
  
  patch: <T = any>(url: string, data?: any): Promise<T> =>
    apiClient.patch(url, data).then(res => res.data),
  
  delete: <T = any>(url: string): Promise<T> =>
    apiClient.delete(url).then(res => res.data),
};

// Services spécifiques
export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  
  logout: () => api.post('/auth/logout'),
  
  forgotPassword: (email: string) =>
    api.post('/auth/forgot-password', { email }),
  
  resetPassword: (token: string, newPassword: string) =>
    api.post('/auth/reset-password', { token, newPassword }),
  
  getCurrentUser: () => api.get('/auth/me'),
  
  updateProfile: (data: any) => api.put('/auth/profile', data),
};

export const schoolApi = {
  getSchools: () => api.get('/schools'),
  getCurrentSchool: () => api.get('/schools/current'),
  getCampuses: () => api.get('/campuses'),
  getClasses: () => api.get('/classes'),
};

export const childApi = {
  getChildren: () => api.get('/parent/children'),
  getChildById: (id: string) => api.get(`/parent/children/${id}`),
};

export const gradeApi = {
  getReportCards: () => api.get('/student/grades/report-cards'),
  getReportCardById: (id: string) => api.get(`/student/grades/report-cards/${id}`),
};

export const timetableApi = {
  getStudentTimetable: () => api.get('/student/timetable'),
  getTeacherTimetable: () => api.get('/teacher/timetable'),
};

export const clubApi = {
  getClubs: () => api.get('/clubs'),
  getClubById: (id: string) => api.get(`/clubs/${id}`),
  joinClub: (id: string) => api.post(`/clubs/${id}/join`),
  leaveClub: (id: string) => api.delete(`/clubs/${id}/leave`),
};

export const attendanceApi = {
  getStudentAttendance: () => api.get('/student/attendance'),
  getTeacherAttendance: (classeId: string) => api.get(`/teacher/classes/${classeId}/attendance`),
  submitAttendance: (data: any) => api.post('/teacher/attendance', data),
};

export const paymentApi = {
  getInvoices: () => api.get('/payments/invoices'),
  getInvoiceById: (id: string) => api.get(`/payments/invoices/${id}`),
  getChildInvoices: (childId: string) => api.get(`/parent/children/${childId}/invoices`),
};