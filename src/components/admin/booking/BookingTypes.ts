export interface Booking {
  _id: string;
  patientName: string;
  patientPhone: string;
  patientEmail?: string;
  gender: 'Male' | 'Female';
  appointmentDate: string;
  appointmentTime: string;
  service: string;
  consultant: string;
  consultantName?: string;
  reason: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  bookingDate: string;
  notes?: string;
  // Additional fields from API
  serviceDescription?: string;
  serviceDuration?: string;
  sampleType?: string;
  consultantEmail?: string;
  subscriptionId?: string;
  subscriptionStatus?: string;
  // New detailed fields from booking detail API
  patientGender?: string;
  patientDob?: string;
  testParameters?: string[];
  testPreparation?: string;
  resultTime?: string;
  updatedAt?: string;
}

export interface BookingSearchValues {
  keyword?: string;
  status?: string;
  date?: string;
  consultant?: string;
}

export interface BookingPagination {
  currentPage: number;
  totalPages: number;
  totalBookings: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface GetBookingsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  date?: string;
  consultant?: string;
} 