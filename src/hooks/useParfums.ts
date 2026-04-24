import { useEffect, useState } from 'react';
import { supabase, type ParfumDB } from '@/lib/supabase';
import type { Collection } from '@/data/products';

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
    top: string[];
    heart: string[];
    base: string[];
  };
  texte_long: string | null;
  texte_court: string | null;
  phrase_signature: string | null;
  note: number | null;
  statut: string;
}

function parseNotes(str: string | null): string[] {
  if (!str) return [];
  return str.split(',').map(s => s.trim()).filter(Boolean);
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
    },
    texte_long: p.texte_long,
    texte_court: p.texte_court,
    phrase_signature: p.phrase_signature,
    note: p.note,
    statut: p.statut,
  };
}

export function useParfums() {
  const [parfums, setParfums] = useState<ParfumFull[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetch() {
      setLoading(true);
      const { data, error } = await supabase
        .from('parfums')
        .select('*')
        .order('famille')
        .order('nom');
      if (error) setError(error.message);
      else setParfums((data as ParfumDB[]).map(mapParfum));
      setLoading(false);
    }
    fetch();
  }, []);

  const getByCollection = (col: Collection) =>
    parfums.filter(p => p.collection === col);

  const getById = (id: string) =>
    parfums.find(p => p.id === id);

  return { parfums, loading, error, getByCollection, getById };
}
