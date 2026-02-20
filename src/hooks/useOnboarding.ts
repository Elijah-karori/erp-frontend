import { useState } from 'react';
import apiClient from '../api/client';
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
} from './types/company';

export const useOnboarding = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initializeOrganization = async (data: OrganizationCreate) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.post('/onboarding/setup', data);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to initialize organization');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getStatus = async (): Promise<OrganizationStatus> => {
    const response = await apiClient.get('/onboarding/status');
    return response.data;
  };

  const createDivision = async (name: string, description?: string) => {
    setIsLoading(true);
    try {
      const response = await apiClient.post('/onboarding/divisions', { name, description });
      return response.data;
    } finally {
      setIsLoading(false);
    }
  };

  const createDepartment = async (data: {
    name: string;
    division_id: number;
    description?: string;
    head_email?: string;
  }) => {
    setIsLoading(true);
    try {
      const response = await apiClient.post('/onboarding/departments', data);
      return response.data;
    } finally {
      setIsLoading(false);
    }
  };

  const createTeam = async (data: {
    name: string;
    department_id: number;
    description?: string;
    lead_email?: string;
  }) => {
    setIsLoading(true);
    try {
      const response = await apiClient.post('/onboarding/teams', data);
      return response.data;
    } finally {
      setIsLoading(false);
    }
  };

  const createHRDepartment = async (data: { name: string; code: string; description?: string }) => {
    setIsLoading(true);
    try {
      const response = await apiClient.post('/onboarding/hr-departments', data);
      return response.data;
    } finally {
      setIsLoading(false);
    }
  };

  const createJobPosition = async (data: {
    title: string;
    code?: string;
    department_id: number;
    description?: string;
    level: number;
    rbac_role_name: string;
    requires_approval?: boolean;
  }) => {
    setIsLoading(true);
    try {
      const response = await apiClient.post('/onboarding/job-positions', data);
      return response.data;
    } finally {
      setIsLoading(false);
    }
  };

  const listJobPositions = async (department_id?: number): Promise<JobPosition[]> => {
    const params = department_id ? { department_id } : {};
    const response = await apiClient.get('/onboarding/job-positions', { params });
    return response.data;
  };

  const inviteTeamMembers = async (
    invites: TeamMemberInvite[]
  ): Promise<InvitationResponse[]> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.post('/onboarding/invite', { invites });
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to send invitations');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const resendInvitation = async (requestId: number) => {
    setIsLoading(true);
    try {
      const response = await apiClient.post(`/onboarding/invite/resend/${requestId}`);
      return response.data;
    } finally {
      setIsLoading(false);
    }
  };

  const getPendingApprovals = async () => {
    const response = await apiClient.get('/onboarding/pending-approvals');
    return response.data;
  };

  return {
    isLoading,
    error,
    initializeOrganization,
    getStatus,
    createDivision,
    createDepartment,
    createTeam,
    createHRDepartment,
    createJobPosition,
    listJobPositions,
    inviteTeamMembers,
    resendInvitation,
    getPendingApprovals,
  };
};