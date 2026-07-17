import { useQuery } from '@tanstack/react-query';
import { getNoteKeyword, getNoteFallbackKeyword } from '@/data/noteKeywords';

const UNSPLASH_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
const LS_KEY = 'thaem_note_images_v3';

function getCache(): Record<string, string> {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || '{}'); }
  catch { return {}; }
}

function setCache(note: string, url: string) {
  const cache = getCache();
  cache[note] = url;
  localStorage.setItem(LS_KEY, JSON.stringify(cache));
}

async function searchUnsplash(keyword: string): Promise<string | null> {
  if (!UNSPLASH_KEY) return null;
  const res = await fetch(
    `https://api.unsplash.com/search/photos?query=${encodeURIComponent(keyword)}&per_page=3&orientation=squarish&content_filter=high`,
    { headers: { Authorization: `Client-ID ${UNSPLASH_KEY}` } }
  );
  if (!res.ok) return null;
  const data = await res.json();
  return data.results?.[0]?.urls?.small ?? null;
}

async function fetchNoteImage(noteName: string): Promise<string | null> {
  const cache = getCache();
  if (cache[noteName]) return cache[noteName];

  // 1. Try primary keyword
  const primary = getNoteKeyword(noteName);
  let url = await searchUnsplash(primary);

  // 2. If nothing, try category fallback
  if (!url) {
    const fallback = getNoteFallbackKeyword(noteName);
    url = await searchUnsplash(fallback);
  }

  if (url) setCache(noteName, url);
  return url;
}

export function useNoteImage(noteName: string) {
  return useQuery({
    queryKey: ['note-image-v3', noteName],
    queryFn: () => fetchNoteImage(noteName),
    staleTime: Infinity,
    gcTime: Infinity,
    retry: false,
  });
}
