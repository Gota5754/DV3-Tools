// Static structure of the sticker book: 20 collections × 9 stickers = 180.
// The database holds the same IDs; this module provides the client-side
// mapping (image paths, grid layout) without a round-trip.

export const SEASON = 1;
export const COLLECTION_COUNT = 20;
export const STICKERS_PER_COLLECTION = 9;
export const TOTAL_STICKERS = COLLECTION_COUNT * STICKERS_PER_COLLECTION;

export const COLLECTION_NAMES: Record<"fr" | "en", string[]> = {
  fr: [
    "Monstre sauvage",
    "Monstre sous-marin",
    "Monstre de Donjon",
    "Histoire principale",
    "Vie en forêt",
    "Zone volcanique",
    "Être des ténèbres",
    "Lieu spécial",
    "Temps de jeu",
    "Choc d'Acier",
    "Forêt des fées",
    "Sous la mer",
    "Village fantôme",
    "Sous la lumière",
    "Royaume du Ciel",
    "Été chaleureux",
    "Hiver froid",
    "Matin doux",
    "Après-midi animé",
    "Nuit calme",
  ],
  en: [
    "Wild Monsters",
    "Water Monsters",
    "Dungeon Monsters",
    "Main Story",
    "Forest Life",
    "Volcanic Zone",
    "Beings in the Dark",
    "Special Places",
    "Playtime",
    "Steel Shock",
    "Fairy Forest",
    "Under the Sea",
    "Ghost Village",
    "Under the Light",
    "Sky Kingdom",
    "Warm Summer",
    "Cold Winter",
    "Lazy Morning",
    "Lively Afternoon",
    "Quiet Night",
  ],
};

/** Global sticker id (1..180) from collection number (1..20) and position (1..9). */
export function stickerId(collection: number, position: number): number {
  return (collection - 1) * STICKERS_PER_COLLECTION + position;
}

/** Collection number (1..20) and position (1..9) from a global sticker id. */
export function stickerCoords(id: number): { collection: number; position: number } {
  return {
    collection: Math.ceil(id / STICKERS_PER_COLLECTION),
    position: ((id - 1) % STICKERS_PER_COLLECTION) + 1,
  };
}

/**
 * Image path for a sticker. Files live in `public/stickers/` and are named
 * `sticker_s<season>_p<collection>_<position>.png`,
 * e.g. `/stickers/sticker_s1_p1_1.png` … `/stickers/sticker_s1_p20_9.png`.
 */
export function stickerImagePath(id: number): string {
  const { collection, position } = stickerCoords(id);
  return `/stickers/sticker_s${SEASON}_p${collection}_${position}.png`;
}

/**
 * Cover image of a whole collection, named
 * `sticker_list_s<season>_p<collection>.png`,
 * e.g. `/stickers/sticker_list_s1_p1.png`.
 */
export function collectionImagePath(collection: number): string {
  return `/stickers/sticker_list_s${SEASON}_p${collection}.png`;
}

export const COLLECTION_NUMBERS = Array.from(
  { length: COLLECTION_COUNT },
  (_, i) => i + 1
);

export const POSITION_NUMBERS = Array.from(
  { length: STICKERS_PER_COLLECTION },
  (_, i) => i + 1
);
