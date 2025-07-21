export interface BlogData {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  thumbnail_url: string;
  image?: string;
  blogCategoryId: string;
  categoryName: string;
  userId: string;
  fullName: string;
  email: string;
  status: string;
  view_count: number;
  like_count: number;
  createdAt: string;
  updatedAt: string;
} 