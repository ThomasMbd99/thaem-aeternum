import sacraBottle from '@/assets/bottles/sacrae-bottle.png';
import vitaeaBottle from '@/assets/bottles/vitaea-bottle.png';
import umbraeBottle from '@/assets/bottles/umbrae-bottle.png';
import floraeBottle from '@/assets/bottles/florae-bottle.png';
import type { Collection } from '@/data/products';

const bottleImages: Record<Collection, string> = {
  sacrae: sacraBottle,
  vitae: vitaeaBottle,
  umbrae: umbraeBottle,
  nerolae: floraeBottle,
  aera: floraeBottle,
};

export const getBottleImage = (collection: Collection): string =>
  bottleImages[collection] ?? sacraBottle;
