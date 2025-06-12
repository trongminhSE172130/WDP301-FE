export interface Service {
  _id: string;
  title: string;
  description: string;
  duration: string;
  sample_type: string;
  test_details: {
    parameters: string[];
    preparation: string;
    result_time: string;
  };
  target_audience: string;
  overview_section: string;
  is_active: boolean;
  image_url?: string;
  rating?: number;
  service_type: string;
  service_type_id?: string;
  __v?: number;
  created_at: string;
  updated_at: string;
} 