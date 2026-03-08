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
    const token = await hooks.getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const hooks = getAuthHooks();
      hooks.removeToken();
    }
    return Promise.reject(error);
  }
);

export function setBaseURL(url: string): void {
  apiClient.defaults.baseURL = url;
}

export default apiClient;
