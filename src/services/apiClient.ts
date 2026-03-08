import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { getAuthHooks } from './authHooks';

const BASE_URL = '/support/api/v1';

const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const hooks = getAuthHooks();
    const headers = await hooks.getAuthHeaders();
    if (config.headers && headers.Authorization) {
      config.headers.Authorization = headers.Authorization;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const statusCode = error.response?.status;
    if (statusCode) {
      const hooks = getAuthHooks();
      const body = error.response?.data ?? {};
      const recovered = await hooks.onAuthError(statusCode, body);
      if (recovered && error.config) {
        // Retry the request with refreshed headers
        const newHeaders = await hooks.getAuthHeaders();
        if (newHeaders.Authorization) {
          error.config.headers.Authorization = newHeaders.Authorization;
        }
        return apiClient.request(error.config);
      }
    }
    return Promise.reject(error);
  }
);

export function setBaseURL(url: string): void {
  apiClient.defaults.baseURL = url;
}

export default apiClient;
