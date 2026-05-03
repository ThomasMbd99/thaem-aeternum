import type { ParfumFull } from '@/hooks/useParfums';
import type { Product } from '@/data/products';

export const normalizeNom = (s: string) =>
  s.toLowerCase().trim().replace(/æ/g, 'ae').replace(/œ/g, 'oe').replace(/\s+/g, '');

export const buildDbMap = (parfumsDB: ParfumFull[]) =>
  new Map(parfumsDB.map(p => [normalizeNom(p.nom), p]));

export const enrichProduct = (p: Product, dbMap: Map<string, ParfumFull>): Product & { en_promo?: boolean } => {
  const db = dbMap.get(normalizeNom(p.name));
  return db ? { ...p, statut: db.statut, stock: db.stock, en_promo: db.en_promo } : p;
};
