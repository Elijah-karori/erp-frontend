export const APP_NAME = 'ISP ERP';
export const APP_VERSION = '1.0.0';

export const ROLES = {
  SUPER_ADMIN: 'SuperAdmin',
  ADMIN: 'Admin',
  HR_MANAGER: 'HRManager',
  FINANCE_MANAGER: 'FinanceManager',
  PROJECT_MANAGER: 'ProjectManager',
  TECHNICIAN: 'Technician',
  EMPLOYEE: 'Employee',
} as const;

export const LEAVE_TYPES = {
  ANNUAL: 'annual',
  SICK: 'sick',
  MATERNITY: 'maternity',
  PATERNITY: 'paternity',
  COMPASSIONATE: 'compassionate',
  STUDY: 'study',
  UNPAID: 'unpaid',
  SABBATICAL: 'sabbatical',
} as const;

export const LEAVE_STATUS = {
  DRAFT: 'draft',
  PENDING: 'pending',
  MANAGER_APPROVED: 'manager_approved',
  HR_APPROVED: 'hr_approved',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  CANCELLED: 'cancelled',
} as const;

export const ENGAGEMENT_TYPES = {
  FULL_TIME: 'FULL_TIME',
  CONTRACT: 'CONTRACT',
  TASK_BASED: 'TASK_BASED',
  SERVICE_BASED: 'SERVICE_BASED',
  HYBRID: 'HYBRID',
} as const;

export const TASK_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
} as const;

export const TASK_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  PAID: 'paid',
  REJECTED: 'rejected',
  DISPUTED: 'disputed',
} as const;

export const PERFORMANCE_RATINGS = {
  OUTSTANDING: 'outstanding',
  EXCEEDS: 'exceeds_expectations',
  MEETS: 'meets_expectations',
  NEEDS_IMPROVEMENT: 'needs_improvement',
  UNSATISFACTORY: 'unsatisfactory',
} as const;

export const DISCIPLINARY_SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
} as const;

export const DISCIPLINARY_STATUS = {
  REPORTED: 'reported',
  INVESTIGATING: 'investigating',
  HEARING_SCHEDULED: 'hearing_scheduled',
  DECISION_MADE: 'decision_made',
  APPEAL: 'appeal',
  CLOSED: 'closed',
} as const;

export const COUNTRY_CODES = [
  { code: '+254', country: 'Kenya', flag: '🇰🇪' },
  { code: '+255', country: 'Tanzania', flag: '🇹🇿' },
  { code: '+256', country: 'Uganda', flag: '🇺🇬' },
  { code: '+250', country: 'Rwanda', flag: '🇷🇼' },
  { code: '+257', country: 'Burundi', flag: '🇧🇮' },
  { code: '+211', country: 'South Sudan', flag: '🇸🇸' },
  { code: '+1', country: 'USA', flag: '🇺🇸' },
  { code: '+44', country: 'UK', flag: '🇬🇧' },
] as const;

export const CURRENCIES = [
  { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'TZS', symbol: 'TSh', name: 'Tanzanian Shilling' },
  { code: 'UGX', symbol: 'USh', name: 'Ugandan Shilling' },
] as const;

export const DATE_FORMATS = {
  DISPLAY: 'dd/MM/yyyy',
  DISPLAY_TIME: 'dd/MM/yyyy HH:mm',
  API: 'yyyy-MM-dd',
  API_TIME: 'yyyy-MM-dd HH:mm:ss',
  MONTH_YEAR: 'MMMM yyyy',
  YEAR_MONTH: 'yyyy-MM',
} as const;