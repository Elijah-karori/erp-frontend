import apiClient from './client';
import {
  Employee,
  LeaveRequest,
  LeaveBalance,
  AttendanceRecord,
  Task,
  PerformanceReview,
  Goal,
  Training,
} from '../types/employee';

export const employeeApi = {
  // Profile
  getProfile: async (): Promise<Employee> => {
    const response = await apiClient.get('/employee/profile');
    return response.data;
  },

  updateProfile: async (data: Partial<Employee>): Promise<Employee> => {
    const response = await apiClient.put('/employee/profile', data);
    return response.data;
  },

  // Dashboard
  getDashboardStats: async (): Promise<{
    pending_tasks: number;
    upcoming_leave: number;
    attendance_rate: number;
    next_payout: number;
  }> => {
    const response = await apiClient.get('/employee/dashboard/stats');
    return response.data;
  },

  // Leave
  getMyLeaveRequests: async (params?: { year?: number; skip?: number; limit?: number }): Promise<LeaveRequest[]> => {
    const response = await apiClient.get('/employee/leave/requests', { params });
    return response.data;
  },

  createLeaveRequest: async (data: Partial<LeaveRequest>): Promise<LeaveRequest> => {
    const response = await apiClient.post('/employee/leave/requests', data);
    return response.data;
  },

  cancelLeaveRequest: async (id: number, reason: string): Promise<LeaveRequest> => {
    const response = await apiClient.post(`/employee/leave/requests/${id}/cancel`, {
      cancellation_reason: reason,
    });
    return response.data;
  },

  getMyLeaveBalances: async (year?: number): Promise<LeaveBalance[]> => {
    const params = year ? { year } : {};
    const response = await apiClient.get('/employee/leave/balances', { params });
    return response.data;
  },

  // Attendance
  getMyAttendance: async (startDate: string, endDate: string): Promise<AttendanceRecord[]> => {
    const response = await apiClient.get('/employee/attendance', {
      params: { start_date: startDate, end_date: endDate },
    });
    return response.data;
  },

  checkIn: async (location?: string): Promise<AttendanceRecord> => {
    const response = await apiClient.post('/employee/attendance/check-in', {
      check_in_location: location,
    });
    return response.data;
  },

  checkOut: async (location?: string): Promise<AttendanceRecord> => {
    const response = await apiClient.post('/employee/attendance/check-out', {
      check_out_location: location,
    });
    return response.data;
  },

  getCurrentAttendance: async (): Promise<{ status: 'checked_in' | 'checked_out' | null }> => {
    const response = await apiClient.get('/employee/attendance/current');
    return response.data;
  },

  // Tasks
  getMyTasks: async (params?: { status?: string; priority?: string }): Promise<Task[]> => {
    const response = await apiClient.get('/employee/tasks', { params });
    return response.data;
  },

  getTask: async (id: number): Promise<Task> => {
    const response = await apiClient.get(`/employee/tasks/${id}`);
    return response.data;
  },

  updateTaskStatus: async (id: number, status: string): Promise<Task> => {
    const response = await apiClient.patch(`/employee/tasks/${id}`, { status });
    return response.data;
  },

  // Performance Reviews
  getMyReviews: async (): Promise<PerformanceReview[]> => {
    const response = await apiClient.get('/employee/reviews');
    return response.data;
  },

  acknowledgeReview: async (id: number, comments?: string): Promise<PerformanceReview> => {
    const response = await apiClient.post(`/employee/reviews/${id}/acknowledge`, {
      employee_comments: comments,
    });
    return response.data;
  },

  // Goals
  getMyGoals: async (): Promise<Goal[]> => {
    const response = await apiClient.get('/employee/goals');
    return response.data;
  },

  updateGoalProgress: async (id: number, progress: number): Promise<Goal> => {
    const response = await apiClient.patch(`/employee/goals/${id}`, { progress });
    return response.data;
  },

  // Training
  getMyTrainings: async (): Promise<Training[]> => {
    const response = await apiClient.get('/employee/trainings');
    return response.data;
  },
};