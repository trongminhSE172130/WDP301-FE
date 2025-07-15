import { useState, useEffect } from 'react';
import { getBlogs } from '../service/api/blogAPI';
import type { Blog } from '../service/api/blogAPI';

interface UseBlogListReturn {
  blogs: Blog[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useBlogList = (): UseBlogListReturn => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getBlogs(1, 10, undefined, undefined, undefined, 'published');
      
      if (response.success && response.data) {
        setBlogs(response.data);
      } else {
        setError('Không thể tải bài viết.');
      }
    } catch (err) {
      console.error('Error fetching blogs:', err);
      setError('Không thể tải bài viết.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return {
    blogs,
    loading,
    error,
    refetch: fetchBlogs
  };
};
