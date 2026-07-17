import { useQuery } from '@tanstack/react-query';
import { supabase, type ParfumDB } from '@/lib/supabase';
import type { Collection, NoteEntry } from '@/data/products';

const familleToCollection: Record<string, Collection> = {
  'SACRÆ': 'sacrae',
  'VITÆA': 'vitae',
  'UMBRÆ': 'umbrae',
  'NEROLÆ': 'nerolae',
  'ÆRA': 'aera',
};

export interface ParfumFull {
  id: string;
  nom: string;
  name: string;
  collection: Collection;
  tagline: string;
  inspiration: string | null;
  marque: string | null;
  type: 'creation' | 'inspiration';
  notes: {
    top: NoteEntry[];
    heart: NoteEntry[];
    base: NoteEntry[];
    olfactive: NoteEntry[];
    teaser: NoteEntry[];
  };
  texte_long: string | null;
  texte_court: string | null;
  phrase_signature: string | null;
  note: number | null;
  statut: string;
  stock: number;
  en_promo: boolean;
  prix_promo: number | null;
  image_url: string | null;
  images: string[];
  flagship: boolean;
}

// Une note peut être suivie de "*<coefficient>" (ex: "Vanille*2") pour
// l'afficher en plus grand dans la pyramide olfactive (coefficient 1 = taille normale).
function parseNotes(str: string | null): NoteEntry[] {
  if (!str) return [];
  return str.split(',').map(s => s.trim()).filter(Boolean).map((entry): NoteEntry => {
    const match = entry.match(/^(.+?)\s*\*\s*(\d+(?:\.\d+)?)$/);
    if (!match) return entry;
    return { name: match[1].trim(), weight: parseFloat(match[2]) };
  });
}

function mapParfum(p: ParfumDB): ParfumFull {
  const id = p.nom.toLowerCase()
    .replace(/æ/g, 'ae')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
  return {
    id,
    nom: p.nom,
    name: p.nom,
    collection: familleToCollection[p.famille] ?? 'sacrae',
    tagline: p.texte_court ?? '',
    inspiration: p.inspiration,
    marque: p.marque,
    type: p.type ?? 'inspiration',
    notes: {
      top: parseNotes(p.notes_tete),
      heart: parseNotes(p.notes_coeur),
      base: parseNotes(p.notes_fond),
      olfactive: parseNotes(p.notes_olfactives),
      teaser: parseNotes(p.notes_teaser),
    },
    texte_long: p.texte_long,
    texte_court: p.texte_court,
    phrase_signature: p.phrase_signature,
    note: p.note,
    statut: (p.statut ?? '').trim().toLowerCase(),
    stock: p.stock ?? 0,
    en_promo: p.en_promo ?? false,
    prix_promo: p.prix_promo ?? null,
    image_url: p.image_url ?? null,
    images: p.images ?? [],
    flagship: p.flagship ?? false,
  };
}

async function fetchParfums(): Promise<ParfumFull[]> {
  const { data, error } = await supabase
    .from('parfums')
    .select('*')
    .order('famille')
    .order('nom');
  if (error) throw new Error(error.message);
  return (data as ParfumDB[]).map(mapParfum);
}

export function useParfums() {
  const { data: parfums = [], isLoading: loading, error } = useQuery({
    queryKey: ['parfums'],
    queryFn: fetchParfums,
    staleTime: 5 * 60 * 1000,
  });

  const getByCollection = (col: Collection) =>
    parfums.filter(p => p.collection === col);

  const getById = (id: string) =>
    parfums.find(p => p.id === id);

  return { parfums, loading, error: error?.message ?? null, getByCollection, getById };
}
