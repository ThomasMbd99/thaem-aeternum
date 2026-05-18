import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export interface Article {
  id: string;
  titre: string;
  slug: string;
  extrait: string | null;
  contenu: string | null;
  image_url: string | null;
  categorie: string;
  publie: boolean;
  created_at: string;
  published_at: string | null;
}

async function fetchArticles(): Promise<Article[]> {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('publie', true)
    .order('published_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data as Article[];
}

export function useArticles() {
  const { data: articles = [], isLoading: loading, error } = useQuery({
    queryKey: ['articles'],
    queryFn: fetchArticles,
    staleTime: 5 * 60 * 1000,
  });
  return { articles, loading, error: error?.message ?? null };
}
