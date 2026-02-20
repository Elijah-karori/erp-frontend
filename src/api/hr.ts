import apiClient from './client';
import {
  Employee,
  LeaveBalance,
  LeaveRequest,
  AttendanceRecord,
  PerformanceReview,
  Goal,
  Training,
  HRDepartment,
  JobPosition,
  OnboardingRequest,
  PayrollRun,
  EmployeePayout,
  AttendancePolicy,
  DisciplinaryCase,
} from '../types/hr';

export const hrApi = {
  // Employee Management
  getEmployees: async (params?: {
    department?: string;
    status?: 'active' | 'inactive' | 'all';
    search?: string;
  }): Promise<Employee[]> => {
    const response = await apiClient.get('/hr/employees', { params });
    return response.data;
  },

  getEmployee: async (id: number): Promise<Employee> => {
    const response = await apiClient.get(`/hr/employees/${id}`);
    return response.data;
  },

  updateEmployee: async (id: number, data: Partial<Employee>): Promise<Employee> => {
    const response = await apiClient.patch(`/hr/employees/${id}`, data);
    return response.data;
  },

  deactivateEmployee: async (id: number): Promise<void> => {
    await apiClient.delete(`/hr/employees/${id}`);
  },

  restoreEmployee: async (id: number): Promise<void> => {
    await apiClient.post(`/hr/employees/${id}/restore`);
  },

  // Leave Management
  getMyLeaveRequests: async (params?: { year?: number; skip?: number; limit?: number }): Promise<LeaveRequest[]> => {
    const response = await apiClient.get('/hr/leave/requests/me', { params });
    return response.data;
  },

  createLeaveRequest: async (data: Partial<LeaveRequest>): Promise<LeaveRequest> => {
    const response = await apiClient.post('/hr/leave/requests', data);
    return response.data;
  },

  cancelLeaveRequest: async (id: number, reason: string): Promise<LeaveRequest> => {
    const response = await apiClient.post(`/hr/leave/requests/${id}/cancel`, {
      cancellation_reason: reason,
    });
    return response.data;
  },

  getMyLeaveBalances: async (year?: number): Promise<LeaveBalance[]> => {
    const params = year ? { year } : {};
    const response = await apiClient.get('/hr/leave/balances/me', { params });
    return response.data;
  },

  // Attendance
  getMyAttendance: async (startDate: string, endDate: string): Promise<AttendanceRecord[]> => {
    const response = await apiClient.get('/hr/attendance/me', {
      params: { start_date: startDate, end_date: endDate },
    });
    return response.data;
  },

  checkIn: async (location?: string): Promise<AttendanceRecord> => {
    const response = await apiClient.post('/hr/attendance/check-in', {
      check_in_location: location,
    });
    return response.data;
  },

  checkOut: async (location?: string): Promise<AttendanceRecord> => {
    const response = await apiClient.post('/hr/attendance/check-out', {
      check_out_location: location,
    });
    return response.data;
  },

  getCurrentStatus: async (): Promise<{ status: 'checked_in' | 'checked_out' | null }> => {
    const response = await apiClient.get('/hr/attendance/current-status');
    return response.data;
  },

  // Performance Reviews
  getMyReviews: async (params?: { skip?: number; limit?: number }): Promise<PerformanceReview[]> => {
    const response = await apiClient.get('/hr/performance/reviews/me', { params });
    return response.data;
  },

  acknowledgeReview: async (id: number, comments?: string): Promise<PerformanceReview> => {
    const response = await apiClient.post(`/hr/performance/reviews/${id}/acknowledge`, {
      employee_comments: comments,
    });
    return response.data;
  },

  // Goals
  getMyGoals: async (): Promise<Goal[]> => {
    const response = await apiClient.get('/hr/goals/me');
    return response.data;
  },

  updateGoalProgress: async (id: number, progress: number): Promise<Goal> => {
    const response = await apiClient.patch(`/hr/goals/${id}`, { progress });
    return response.data;
  },

  // Training
  getMyTrainings: async (): Promise<Training[]> => {
    const response = await apiClient.get('/hr/trainings/me');
    return response.data;
  },

  // HR Departments
  getHRDepartments: async (): Promise<HRDepartment[]> => {
    const response = await apiClient.get('/hr/departments');
    return response.data;
  },

  createHRDepartment: async (data: {
    name: string;
    code: string;
    description?: string;
  }): Promise<HRDepartment> => {
    const response = await apiClient.post('/hr/departments', data);
    return response.data;
  },

  // Job Positions
  getJobPositions: async (departmentId?: number): Promise<JobPosition[]> => {
    const params = departmentId ? { department_id: departmentId } : {};
    const response = await apiClient.get('/hr/job-positions', { params });
    return response.data;
  },

  createJobPosition: async (data: {
    title: string;
    code?: string;
    department_id: number;
    description?: string;
    level: number;
    rbac_role_name: string;
    requires_approval?: boolean;
  }): Promise<JobPosition> => {
    const response = await apiClient.post('/hr/job-positions', data);
    return response.data;
  },

  // Onboarding Approvals
  getPendingApprovals: async (): Promise<OnboardingRequest[]> => {
    const response = await apiClient.get('/hr/pending-approvals');
    return response.data;
  },

  approveOnboarding: async (id: number, comments?: string): Promise<OnboardingRequest> => {
    const response = await apiClient.post(`/hr/onboarding/${id}/approve`, { comments });
    return response.data;
  },

  rejectOnboarding: async (id: number, reason: string): Promise<OnboardingRequest> => {
    const response = await apiClient.post(`/hr/onboarding/${id}/reject`, { reason });
    return response.data;
  },

  // Payroll
  getPayrollRuns: async (): Promise<PayrollRun[]> => {
    const response = await apiClient.get('/payroll/runs');
    return response.data;
  },

  getPayouts: async (runId: string): Promise<EmployeePayout[]> => {
    const response = await apiClient.get(`/payroll/runs/${runId}/payouts`);
    return response.data;
  },

  calculatePayroll: async (data: {
    period: string;
    month: string;
    year: number;
  }): Promise<PayrollRun> => {
    const response = await apiClient.post('/payroll/calculate', data);
    return response.data;
  },

  approvePayroll: async (runId: string): Promise<PayrollRun> => {
    const response = await apiClient.post(`/payroll/runs/${runId}/approve`);
    return response.data;
  },

  processPayroll: async (runId: string): Promise<PayrollRun> => {
    const response = await apiClient.post(`/payroll/runs/${runId}/process`);
    return response.data;
  },

  // Attendance Policy
  getAttendancePolicies: async (): Promise<AttendancePolicy[]> => {
    const response = await apiClient.get('/attendance/policies');
    return response.data;
  },

  createAttendancePolicy: async (data: Partial<AttendancePolicy>): Promise<AttendancePolicy> => {
    const response = await apiClient.post('/attendance/policies', data);
    return response.data;
  },

  // Disciplinary Cases
  getDisciplinaryCases: async (params?: {
    status?: string;
    skip?: number;
    limit?: number;
  }): Promise<DisciplinaryCase[]> => {
    const response = await apiClient.get('/disciplinary/cases', { params });
    return response.data;
  },

  createDisciplinaryCase: async (data: Partial<DisciplinaryCase>): Promise<DisciplinaryCase> => {
    const response = await apiClient.post('/disciplinary/cases', data);
    return response.data;
  },

  // Dashboard
  getHRDashboardStats: async (): Promise<any> => {
    const response = await apiClient.get('/hr/dashboard/stats');
    return response.data;
  },

  getRecentActivity: async (): Promise<any[]> => {
    const response = await apiClient.get('/hr/dashboard/recent-activity');
    return response.data;
  },
};