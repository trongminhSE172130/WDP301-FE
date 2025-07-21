export interface Patient {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  gender: 'Male' | 'Female';
  birthdate: string;
  address: string;
  status: 'active' | 'inactive';
  registeredDate: string;
  medicalRecord?: string;
  consultant?: string;
  reason?: string;
} 