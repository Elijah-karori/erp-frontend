export interface User {
  id: number;
  email: string;
  full_name: string;
  phone?: string;
  is_active: boolean;
  is_superuser: boolean;
  status: 'pending_otp' | 'active' | 'suspended' | 'locked';
  is_employee: boolean;
  employee_status: string;
  roles_v2?: Array<{
    id: number;
    name: string;
    permissions?: Array<{
      id: number;
      name: string;
      resource: string;
      action: string;
    }>;
  }>;
  permissions_v2?: Array<{
    id: number;
    name: string;
    resource: string;
    action: string;
    scope: string;
  }>;
  company_id?: number;
  division_id?: number;
  department_id?: number;
  team_id?: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface RegisterData {
  email: string;
  full_name: string;
  phone?: string;
  password: string;
}

export interface OTPRequest {
  email: string;
}

export interface OTPVerify {
  email: string;
  otp: string;
}