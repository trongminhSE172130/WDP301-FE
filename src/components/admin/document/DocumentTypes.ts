export interface Document {
  id: string;
  title: string;
  type: 'report' | 'prescription' | 'test' | 'other';
  patientId?: string;
  patientName?: string;
  doctorId?: string;
  doctorName?: string;
  createdAt: string;
  updatedAt?: string;
  content?: string;
  thumbnailUrl?: string;
  fileUrl?: string;
  status: 'active' | 'archived' | 'deleted';
  isFavorite: boolean;
}

export interface DocumentFilterParams {
  title?: string;
  type?: string;
  patientName?: string;
  doctorName?: string;
  status?: string;
  dateRange?: [string, string];
} 