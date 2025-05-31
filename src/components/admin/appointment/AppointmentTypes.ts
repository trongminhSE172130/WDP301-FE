export interface Appointment {
  id: string;
  patientName: string;
  patientPhone: string;
  gender: 'Male' | 'Female';
  appointmentDate: string;
  appointmentTime: string;
  reason: string;
  status: 'scheduled' | 'completed' | 'cancelled';
} 