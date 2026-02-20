export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhone = (phone: string): boolean => {
  // Kenyan phone numbers: 07XXXXXXXX or 01XXXXXXXX or +254XXXXXXXXX
  const phoneRegex = /^(?:(?:\+254)|0)[17]\d{8}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

export const isValidKenyanID = (id: string): boolean => {
  // Kenyan ID: 7-8 digits
  const idRegex = /^\d{7,8}$/;
  return idRegex.test(id);
};

export const isValidKRA

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhone = (phone: string): boolean => {
  // Kenyan phone numbers: 07XXXXXXXX or 01XXXXXXXX or +254XXXXXXXXX
  const phoneRegex = /^(?:(?:\+254)|0)[17]\d{8}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

export const isValidKenyanID = (id: string): boolean => {
  // Kenyan ID: 7-8 digits
  const idRegex = /^\d{7,8}$/;
  return idRegex.test(id);
};

export const isValidKRA = (kra: string): boolean => {
  // KRA PIN: AxxxxxxX (1 letter, 6 digits, 1 letter)
  const kraRegex = /^[A-Za-z]\d{6}[A-Za-z]$/;
  return kraRegex.test(kra.toUpperCase());
};

export const isValidPassword = (password: string): { isValid: boolean; message?: string } => {
  if (password.length < 8) {
    return { isValid: false, message: 'Password must be at least 8 characters long' };
  }
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one uppercase letter' };
  }
  if (!/[a-z]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one lowercase letter' };
  }
  if (!/[0-9]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one number' };
  }
  if (!/[!@#$%^&*]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one special character (!@#$%^&*)' };
  }
  return { isValid: true };
};

export const isValidURL = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const isValidDate = (date: string): boolean => {
  const d = new Date(date);
  return d instanceof Date && !isNaN(d.getTime());
};

export const isFutureDate = (date: string): boolean => {
  return new Date(date) > new Date();
};

export const isPastDate = (date: string): boolean => {
  return new Date(date) < new Date();
};

export const isValidAge = (birthDate: string, minAge: number = 18): boolean => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age >= minAge;
};

export const isValidMoney = (amount: number): boolean => {
  return !isNaN(amount) && amount >= 0 && amount <= 999999999.99;
};

export const isValidPercentage = (value: number): boolean => {
  return !isNaN(value) && value >= 0 && value <= 100;
};