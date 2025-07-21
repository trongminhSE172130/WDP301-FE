export interface ServiceTypeData {
  id: string | number;
  name: string;
  description?: string;
  display_name?: string;
  is_active?: boolean;
  created_by?: {
    _id: string;
    full_name: string;
    email: string;
  };
  createdAt?: string;
  updatedAt?: string;
} 