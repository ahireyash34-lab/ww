import axios from 'axios';
import { 
  DiagnosticResult, 
  DiagnosticRecord, 
  MandiPriceRecord, 
  FarmRecord, 
  SoilAnalysisResult 
} from '../../../shared/types';
import { 
  SoilAnalysisInput, 
  FarmRegistrationInput, 
  AgronomistReviewInput, 
  UserSignupInput, 
  UserLoginInput 
} from '../../../shared/validators';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor injecting Auth token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('agrivision_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Call Error:', error.response?.data?.message || error.message);
    return Promise.reject(error);
  }
);

// Diagnostic Endpoints
export async function uploadAndDiagnoseCrop(formData: FormData): Promise<DiagnosticRecord> {
  const response = await apiClient.post<{ success: boolean; data: DiagnosticRecord }>(
    '/diagnostics',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  );
  return response.data.data;
}

export async function fetchDiagnosticRecords(params?: {
  crop?: string;
  severity?: string;
  reviewed?: boolean;
}): Promise<DiagnosticRecord[]> {
  const response = await apiClient.get<{ success: boolean; data: DiagnosticRecord[] }>(
    '/diagnostics',
    { params }
  );
  return response.data.data;
}

export async function fetchDiagnosticById(id: string): Promise<DiagnosticRecord> {
  const response = await apiClient.get<{ success: boolean; data: DiagnosticRecord }>(
    `/diagnostics/${id}`
  );
  return response.data.data;
}

export async function submitAgronomistReview(
  id: string, 
  review: AgronomistReviewInput
): Promise<DiagnosticRecord> {
  const response = await apiClient.patch<{ success: boolean; data: DiagnosticRecord }>(
    `/diagnostics/${id}/review`,
    review
  );
  return response.data.data;
}

// Farm Endpoints
export async function fetchUserFarms(): Promise<FarmRecord[]> {
  const response = await apiClient.get<{ success: boolean; data: FarmRecord[] }>('/farms');
  return response.data.data;
}

export async function registerNewFarm(farm: FarmRegistrationInput): Promise<FarmRecord> {
  const response = await apiClient.post<{ success: boolean; data: FarmRecord }>('/farms', farm);
  return response.data.data;
}

// Mandi Endpoints
export async function fetchMandiRates(filters?: {
  commodity?: string;
  state?: string;
  district?: string;
  search?: string;
}): Promise<MandiPriceRecord[]> {
  const response = await apiClient.get<{ success: boolean; data: MandiPriceRecord[] }>(
    '/mandi',
    { params: filters }
  );
  return response.data.data;
}

export async function fetchMandiTrends(): Promise<any> {
  const response = await apiClient.get<{ success: boolean; data: any }>('/mandi/trends');
  return response.data.data;
}

// Soil Health Endpoints
export async function submitSoilAnalysis(soilData: SoilAnalysisInput): Promise<SoilAnalysisResult> {
  const response = await apiClient.post<{ success: boolean; data: SoilAnalysisResult }>(
    '/soil/analyze',
    soilData
  );
  return response.data.data;
}

// Admin Metrics
export async function fetchAdminMetrics(): Promise<any> {
  const response = await apiClient.get<{ success: boolean; data: any }>('/admin/metrics');
  return response.data.data;
}

// Auth Endpoints
export async function apiLogin(credentials: UserLoginInput): Promise<any> {
  const response = await apiClient.post('/auth/login', credentials);
  return response.data.data;
}

export async function apiSignup(userData: UserSignupInput): Promise<any> {
  const response = await apiClient.post('/auth/signup', userData);
  return response.data.data;
}
