import { useState, useEffect } from 'react';
import { getBlogDetail } from '../service/api/blogAPI';
import type { Blog } from '../service/api/blogAPI';

interface UseBlogDetailReturn {
  blog: Blog | null;
  loading: boolean;
  error: string | null;
  setBlog: React.Dispatch<React.SetStateAction<Blog | null>>;
  refetch: () => void;
}

export const useBlogDetail = (id: string | undefined): UseBlogDetailReturn => {
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBlogDetail = async () => {
    if (!id) {
      setError('ID bài viết không hợp lệ');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await getBlogDetail(id);
      
      if (response.success && response.data) {
        setBlog(response.data);
      } else {
        setError('Không thể tải bài viết.');
      }
    } catch (err) {
      console.error('Error fetching blog detail:', err);
      setError('Không thể tải bài viết.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return {
    blog,
    loading,
    error,
    setBlog,
    refetch: fetchBlogDetail
  };
};
