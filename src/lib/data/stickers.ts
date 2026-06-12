// Static structure of the sticker book: 20 collections × 9 stickers = 180.
// The database holds the same IDs; this module provides the client-side
// mapping (image paths, grid layout) without a round-trip.

export const COLLECTION_COUNT = 20;
export const STICKERS_PER_COLLECTION = 9;
export const TOTAL_STICKERS = COLLECTION_COUNT * STICKERS_PER_COLLECTION;

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
 * `<collection 2 digits>-<position>.png`, e.g. `/stickers/01-1.png`,
 * `/stickers/20-9.png`.
 */
export function stickerImagePath(id: number): string {
  const { collection, position } = stickerCoords(id);
  return `/stickers/${String(collection).padStart(2, "0")}-${position}.png`;
}

export const COLLECTION_NUMBERS = Array.from(
  { length: COLLECTION_COUNT },
  (_, i) => i + 1
);

export const POSITION_NUMBERS = Array.from(
  { length: STICKERS_PER_COLLECTION },
  (_, i) => i + 1
);
