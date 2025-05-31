export interface Schedule {
  id: string;
  title: string;
  doctor: string;
  specialty: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'available' | 'booked' | 'completed' | 'cancelled';
  note?: string;
}

export interface FilterParams {
  doctor?: string;
  specialty?: string;
  date?: string;
  status?: string;
} 