import type { Appointment } from './AppointmentTypes';

export const appointmentsData: Appointment[] = [
  {
    id: 'APT001',
    patientName: 'Nguyễn Văn A',
    patientPhone: '0912345678',
    gender: 'Male',
    appointmentDate: '15/07/2023',
    appointmentTime: '09:00',
    reason: 'Khám định kỳ',
    status: 'completed'
  },
  {
    id: 'APT002',
    patientName: 'Trần Thị B',
    patientPhone: '0923456789',
    gender: 'Female',
    appointmentDate: '16/07/2023',
    appointmentTime: '10:30',
    reason: 'Tư vấn',
    status: 'completed'
  },
  {
    id: 'APT003',
    patientName: 'Lê Văn C',
    patientPhone: '0934567890',
    gender: 'Male',
    appointmentDate: '17/07/2023',
    appointmentTime: '14:00',
    reason: 'Khám',
    status: 'cancelled'
  },
  {
    id: 'APT004',
    patientName: 'Phạm Thị D',
    patientPhone: '0945678901',
    gender: 'Female',
    appointmentDate: '18/07/2023',
    appointmentTime: '15:30',
    reason: 'Khám định kỳ',
    status: 'scheduled'
  },
  {
    id: 'APT005',
    patientName: 'Hoàng Văn E',
    patientPhone: '0956789012',
    gender: 'Male',
    appointmentDate: '19/07/2023',
    appointmentTime: '08:00',
    reason: 'Tư vấn',
    status: 'scheduled'
  },
  {
    id: 'APT006',
    patientName: 'Ngô Thị F',
    patientPhone: '0967890123',
    gender: 'Female',
    appointmentDate: '20/07/2023',
    appointmentTime: '11:00',
    reason: 'Khám',
    status: 'scheduled'
  },
  {
    id: 'APT007',
    patientName: 'Đỗ Văn G',
    patientPhone: '0978901234',
    gender: 'Male',
    appointmentDate: '21/07/2023',
    appointmentTime: '13:30',
    reason: 'Khám định kỳ',
    status: 'scheduled'
  },
  {
    id: 'APT008',
    patientName: 'Vũ Thị H',
    patientPhone: '0989012345',
    gender: 'Female',
    appointmentDate: '22/07/2023',
    appointmentTime: '16:00',
    reason: 'Tư vấn',
    status: 'scheduled'
  }
]; 