import { useQuery } from '@tanstack/react-query';
import { getNoteKeyword } from '@/data/noteKeywords';

const UNSPLASH_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
const LS_KEY = 'thaem_note_images_v1';

function getCache(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) || '{}');
  } catch {
    return {};
  }
}

function setCache(note: string, url: string) {
  const cache = getCache();
  cache[note] = url;
  localStorage.setItem(LS_KEY, JSON.stringify(cache));
}

async function fetchNoteImage(noteName: string): Promise<string | null> {
  const cache = getCache();
  if (cache[noteName]) return cache[noteName];

  if (!UNSPLASH_KEY) return null;

  const keyword = getNoteKeyword(noteName);
  const res = await fetch(
    `https://api.unsplash.com/search/photos?query=${encodeURIComponent(keyword)}&per_page=1&orientation=squarish&content_filter=high`,
    { headers: { Authorization: `Client-ID ${UNSPLASH_KEY}` } }
  );

  if (!res.ok) return null;

  const data = await res.json();
  const url: string | null = data.results?.[0]?.urls?.small ?? null;

  if (url) setCache(noteName, url);
  return url;
}

export function useNoteImage(noteName: string) {
  return useQuery({
    queryKey: ['note-image', noteName],
    queryFn: () => fetchNoteImage(noteName),
    staleTime: Infinity,
    gcTime: Infinity,
    retry: false,
  });
}
