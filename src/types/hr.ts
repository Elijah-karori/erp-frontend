export interface HRDepartment {
  id: number;
  name: string;
  code: string;
  description?: string;
  parent_department_id?: number;
  head_user_id?: number;
  head_user?: {
    id: number;
    full_name: string;
    email: string;
  };
  is_active: boolean;
  positions?: JobPosition[];
  children?: HRDepartment[];
}

export interface JobPosition {
  id: number;
  title: string;
  code: string;
  department_id: number;
  department_name?: string;
  rbac_v2_role_id: number;
  rbac_role_name?: string;
  description?: string;
  level: number;
  requires_approval: boolean;
  is_active: boolean;
  created_at: string;
}

export interface OnboardingRequest {
  id: number;
  user: {
    id: number;
    email: string;
    full_name: string;
  };
  department?: {
    id: number;
    name: string;
  };
  job_position?: {
    id: number;
    title: string;
  };
  requested_role?: {
    id: number;
    name: string;
  };
  status: 'PENDING' | 'HR_APPROVED' | 'DEPT_HEAD_APPROVED' | 'COMPLETED' | 'REJECTED';
  hr_status: 'PENDING' | 'APPROVED' | 'REJECTED';
  dept_head_status: 'PENDING' | 'APPROVED' | 'REJECTED';
  hr_comments?: string;
  dept_head_comments?: string;
  rejection_reason?: string;
  created_at: string;
  completed_at?: string;
  requested_by?: {
    id: number;
    full_name: string;
  };
  comments?: OnboardingComment[];
}

export interface OnboardingComment {
  id: number;
  author: {
    id: number;
    full_name: string;
  };
  body: string;
  visibility?: 'hr' | 'dept_head' | 'admin' | null;
  created_at: string;
  edited_at?: string;
}

export interface PayrollRun {
  id: number;
  period: string;
  month: string;
  year: number;
  status: 'draft' | 'processing' | 'completed' | 'cancelled';
  total_employees: number;
  total_gross: number;
  total_deductions: number;
  total_net: number;
  processed_by?: string;
  processed_at?: string;
  created_at: string;
}

export interface EmployeePayout {
  id: number;
  employee_id: number;
  employee_name: string;
  employee_code: string;
  department: string;
  base_salary: number;
  allowances: number;
  deductions: number;
  net_pay: number;
  bank_account: string;
  status: 'pending' | 'approved' | 'paid' | 'failed';
}

export interface AttendancePolicy {
  id: number;
  name: string;
  description?: string;
  standard_work_hours_per_day: number;
  standard_work_days_per_week: number;
  grace_period_minutes: number;
  late_deduction_per_minute?: number;
  late_threshold_for_half_day: number;
  early_leave_threshold: number;
  overtime_rate_multiplier: number;
  weekend_rate_multiplier: number;
  is_default: boolean;
  is_active: boolean;
}

export interface DisciplinaryCase {
  id: number;
  case_number: string;
  employee: {
    id: number;
    full_name: string;
  };
  incident_date: string;
  incident_description: string;
  incident_location?: string;
  violation_category: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'reported' | 'investigating' | 'hearing_scheduled' | 'decision_made' | 'appeal' | 'closed';
  action_type?: 'verbal_warning' | 'written_warning' | 'final_warning' | 'suspension' | 'demotion' | 'termination';
  action_description?: string;
  action_effective_date?: string;
  suspension_days?: number;
  salary_deduction?: number;
  appeal_reason?: string;
  created_at: string;
}