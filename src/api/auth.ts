import apiClient from './client';
import { User, LoginCredentials, LoginResponse, RegisterData } from '../types/auth';

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const formData = new FormData();
    formData.append('username', credentials.email);
    formData.append('password', credentials.password);
    
    const response = await apiClient.post('/auth/login', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  register: async (data: RegisterData): Promise<User> => {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },

  requestOTP: async (email: string): Promise<void> => {
    await apiClient.post('/auth/otp/request', { username: email });
  },

  verifyOTP: async (email: string, otp: string): Promise<LoginResponse> => {
    const response = await apiClient.post('/auth/otp/login', { email, otp });
    return response.data;
  },

  requestPasswordless: async (email: string): Promise<void> => {
    await apiClient.post('/auth/passwordless/request', { email });
  },

  verifyPasswordless: async (token: string): Promise<LoginResponse> => {
    const response = await apiClient.get(`/auth/passwordless/verify?token=${token}`);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },

  refreshToken: async (refreshToken: string): Promise<LoginResponse> => {
    const response = await apiClient.post('/auth/refresh', { refresh_token: refreshToken });
    return response.data;
  },

  changePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
    await apiClient.post('/auth/change-password', {
      current_password: currentPassword,
      new_password: newPassword,
    });
  },

  setPassword: async (newPassword: string): Promise<void> => {
    await apiClient.post('/auth/set-password', { new_password: newPassword });
  },
};