import type { Feedback } from '../../../service/api/feedbackAPI';

export interface FeedbackResponseFormValues {
  response: string;
  status: string;
  moderation_notes?: string;
}

export interface FeedbackFilterValues {
  searchText: string;
  ratingFilter: number | null;
  featuredFilter: boolean | null;
  dateRange: [string, string] | null;
  serviceIdFilter: string;
  userIdFilter: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export type { Feedback }; 