export interface Service {
  id: string;
  name: string;
  category: string;
  price: number;
  duration: number; // phút
  description: string;
  status: 'active' | 'inactive';
} 