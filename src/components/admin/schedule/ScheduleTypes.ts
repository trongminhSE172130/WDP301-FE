export interface ConsultantUser {
  _id: string;
  full_name: string;
  email: string;
}

export interface Schedule {
  _id: string;
  consultant_user_id: ConsultantUser; // Can be either ID string or populated object
  date: string;
  time_slot: string;
  schedule_type: 'advice' | 'consultation';
  is_booked: boolean;
  created_at: string;
  updated_at: string;
  __v: number;
}

export interface FilterParams {
  date?: string;
  schedule_type?: string;
  is_booked?: boolean;
} 