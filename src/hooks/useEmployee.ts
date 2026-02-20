import { useState } from 'react';
import apiClient from '../api/client';

interface Employee {
  id: number;
  user: {
    id: number;
    email: string;
    full_name: string;
    phone: string;
  };
  employee_code: string;
  engagement_type: string;
  hire_date: string;
  department: string;
  designation: string;
  attendance_rate: number;
  quality_rating: number;
  is_active: boolean;
}

interface EmployeeFilters {
  department?: string;
  status?: 'active' | 'inactive' | 'all';
  search?: string;
}

export const useEmployee = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getEmployees = async (filters?: EmployeeFilters): Promise<Employee[]> => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filters?.department) params.append('department', filters.department);
      if (filters?.status && filters.status !== 'all') params.append('status', filters.status);
      if (filters?.search) params.append('search', filters.search);

      const response = await apiClient.get('/hr/employees', { params });
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to fetch employees');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getEmployee = async (id: number): Promise<Employee> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.get(`/hr/employees/${id}`);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to fetch employee');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateEmployee = async (id: number, data: Partial<Employee>): Promise<Employee> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.patch(`/hr/employees/${id}`, data);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to update employee');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deactivateEmployee = async (id: number): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      await apiClient.delete(`/hr/employees/${id}`);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to deactivate employee');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const restoreEmployee = async (id: number): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      await apiClient.post(`/hr/employees/${id}/restore`);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to restore employee');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    getEmployees,
    getEmployee,
    updateEmployee,
    deactivateEmployee,
    restoreEmployee,
  };
};