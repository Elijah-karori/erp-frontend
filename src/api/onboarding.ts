import apiClient from './client';
import {
  OrganizationCreate,
  OrganizationStatus,
  Division,
  Department,
  Team,
  HRDepartment,
  JobPosition,
  TeamMemberInvite,
  InvitationResponse,
} from '../types/company';

export const onboardingApi = {
  initialize: async (data: OrganizationCreate): Promise<{ company_id: number; message: string }> => {
    const response = await apiClient.post('/onboarding/setup', data);
    return response.data;
  },

  getStatus: async (): Promise<OrganizationStatus> => {
    const response = await apiClient.get('/onboarding/status');
    return response.data;
  },

  createDivision: async (name: string, description?: string): Promise<{ id: number; message: string }> => {
    const response = await apiClient.post('/onboarding/divisions', { name, description });
    return response.data;
  },

  createDepartment: async (data: {
    name: string;
    division_id: number;
    description?: string;
    head_email?: string;
  }): Promise<{ id: number; hr_department_id: number; message: string }> => {
    const response = await apiClient.post('/onboarding/departments', data);
    return response.data;
  },

  createTeam: async (data: {
    name: string;
    department_id: number;
    description?: string;
    lead_email?: string;
  }): Promise<{ id: number; message: string }> => {
    const response = await apiClient.post('/onboarding/teams', data);
    return response.data;
  },

  createHRDepartment: async (data: {
    name: string;
    code: string;
    description?: string;
  }): Promise<{ id: number; message: string }> => {
    const response = await apiClient.post('/onboarding/hr-departments', data);
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
  }): Promise<{ id: number; mapped_role: string; message: string }> => {
    const response = await apiClient.post('/onboarding/job-positions', data);
    return response.data;
  },

  listJobPositions: async (department_id?: number): Promise<JobPosition[]> => {
    const params = department_id ? { department_id } : {};
    const response = await apiClient.get('/onboarding/job-positions', { params });
    return response.data;
  },

  inviteTeamMembers: async (invites: TeamMemberInvite[]): Promise<InvitationResponse[]> => {
    const response = await apiClient.post('/onboarding/invite', { invites });
    return response.data;
  },

  resendInvitation: async (requestId: number): Promise<{ message: string }> => {
    const response = await apiClient.post(`/onboarding/invite/resend/${requestId}`);
    return response.data;
  },

  getPendingApprovals: async (): Promise<any[]> => {
    const response = await apiClient.get('/onboarding/pending-approvals');
    return response.data;
  },

  approveHR: async (requestId: number, comments?: string): Promise<any> => {
    const response = await apiClient.post(`/onboarding/${requestId}/hr-approve`, { comments });
    return response.data;
  },

  rejectHR: async (requestId: number, reason: string): Promise<any> => {
    const response = await apiClient.post(`/onboarding/${requestId}/hr-reject`, { reason });
    return response.data;
  },

  approveDeptHead: async (requestId: number, comments?: string): Promise<any> => {
    const response = await apiClient.post(`/onboarding/${requestId}/dept-approve`, { comments });
    return response.data;
  },

  rejectDeptHead: async (requestId: number, reason: string): Promise<any> => {
    const response = await apiClient.post(`/onboarding/${requestId}/dept-reject`, { reason });
    return response.data;
  },
};