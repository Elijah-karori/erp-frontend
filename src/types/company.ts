export interface Company {
  id: number;
  name: string;
}

export interface Division {
  id: number;
  name: string;
  company_id: number;
}

export interface Department {
  id: number;
  name: string;
  division_id: number;
  head_email?: string;
}

export interface Team {
  id: number;
  name: string;
  department_id: number;
}

export interface HRDepartment {
  id: number;
  name: string;
  code: string;
  description?: string;
}

export interface JobPosition {
  id: number;
  title: string;
  code: string;
  department_id: number;
  department_name?: string;
  rbac_role: string;
  rbac_role_id: number;
  level: number;
  requires_approval: boolean;
  description?: string;
}

export interface OrganizationCreate {
  company_name: string;
  admin_email: string;
  admin_full_name: string;
  admin_phone?: string;
  industry?: string;
  country?: string;
  timezone?: string;
}

export interface OrganizationStatus {
  company_exists: boolean;
  company_name?: string;
  setup_complete: boolean;
  total_divisions: number;
  total_departments: number;
  total_teams: number;
  total_employees: number;
  hr_departments_created: boolean;
  job_positions_created: boolean;
  workflows_configured: boolean;
}

export interface TeamMemberInvite {
  email: string;
  full_name: string;
  phone?: string;
  department_id: number;
  team_id?: number;
  job_position_id: number;
  custom_message?: string;
}

export interface InvitationResponse {
  email: string;
  full_name: string;
  status: 'invited' | 'already_exists' | 'error';
  message?: string;
  invitation_token?: string;
  onboarding_request_id?: number;
}