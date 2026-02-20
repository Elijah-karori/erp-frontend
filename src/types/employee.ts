export interface Employee {
  id: number;
  user: {
    id: number;
    email: string;
    full_name: string;
    phone: string;
    is_active: boolean;
  };
  employee_code: string;
  engagement_type: 'FULL_TIME' | 'CONTRACT' | 'TASK_BASED' | 'SERVICE_BASED' | 'HYBRID';
  hire_date: string;
  contract_end_date?: string;
  termination_date?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  address?: string;
  department: string;
  designation: string;
  attendance_rate: number;
  quality_rating: number;
  complaint_count: number;
  certification_level?: string;
  bank_name?: string;
  bank_account?: string;
  tax_id?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface LeaveBalance {
  leave_type: 'annual' | 'sick' | 'maternity' | 'paternity' | 'compassionate' | 'study' | 'unpaid' | 'sabbatical';
  total_entitled: number;
  used: number;
  pending: number;
  available: number;
  carried_forward: number;
  year: number;
}

export interface LeaveRequest {
  id: number;
  leave_type: string;
  start_date: string;
  end_date: string;
  total_days: number;
  reason: string;
  contact_during_leave?: string;
  address_during_leave?: string;
  handover_notes?: string;
  supporting_document_url?: string;
  status: 'draft' | 'pending' | 'manager_approved' | 'hr_approved' | 'approved' | 'rejected' | 'cancelled';
  manager_comments?: string;
  hr_comments?: string;
  final_comments?: string;
  created_at: string;
  updated_at: string;
}

export interface AttendanceRecord {
  id: number;
  date: string;
  scheduled_in?: string;
  scheduled_out?: string;
  actual_check_in?: string;
  actual_check_out?: string;
  hours_worked: number;
  regular_hours: number;
  overtime_hours: number;
  late_minutes: number;
  is_late: boolean;
  left_early: boolean;
  status: 'present' | 'absent' | 'half_day' | 'holiday' | 'leave';
  check_in_location?: string;
  check_out_location?: string;
  check_in_ip?: string;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  due_date: string;
  assigned_by: {
    id: number;
    full_name: string;
  };
  project?: {
    id: number;
    name: string;
  };
  attachments_count: number;
  comments_count: number;
  created_at: string;
}

export interface PerformanceReview {
  id: number;
  review_period_start: string;
  review_period_end: string;
  review_date: string;
  technical_skills_rating?: number;
  communication_rating?: number;
  teamwork_rating?: number;
  leadership_rating?: number;
  overall_rating: 'outstanding' | 'exceeds_expectations' | 'meets_expectations' | 'needs_improvement' | 'unsatisfactory';
  strengths?: string;
  areas_for_improvement?: string;
  achievements?: string;
  employee_comments?: string;
  employee_acknowledged_at?: string;
  manager_comments?: string;
  status: 'draft' | 'submitted' | 'acknowledged';
}

export interface Goal {
  id: number;
  title: string;
  description?: string;
  due_date?: string;
  status: 'in_progress' | 'completed' | 'abandoned';
  progress: number;
  created_at: string;
}

export interface Training {
  id: number;
  title: string;
  description?: string;
  date: string;
  hours: number;
  provider: string;
  certificate_url?: string;
}