// Static structure of the sticker book: 20 collections × 9 stickers = 180.
// The database holds the same IDs; this module provides the client-side
// mapping (image paths, grid layout) without a round-trip.

/**
 * Sticker IDs that cannot be traded between players.
 * They still appear in the sticker book (markable as owned) but the duplicate
 * counter is hidden and they are excluded from trade matching.
 */
export const NON_TRADEABLE_IDS = new Set([
  108, 117, 125, 133, 135, 141, 144, 149, 150, 153,
  157, 158, 161, 162, 166, 167, 170, 171,
  172, 173, 174, 178, 179, 180,
]);

export function isTradeable(id: number): boolean {
  return !NON_TRADEABLE_IDS.has(id);
}

/**
 * Number of stars (rarity) per sticker ID. Omitted = 1 star.
 * Filled in progressively as in-game screenshots are provided.
 */
export const STICKER_STARS: Partial<Record<number, 2 | 3>> = {
  // Collection 2 — Water Monsters
  18: 2,
  // Collection 3 — Dungeon Monsters
  26: 2, 27: 2,
  // Collection 4 — Main Story
  34: 2, 35: 2, 36: 2,
  // Collection 5 — Forest Life
  41: 2, 42: 2, 43: 2, 44: 2, 45: 2,
  // Collection 6 — Volcanic Zone
  49: 2, 50: 2, 51: 2, 52: 2, 53: 2, 54: 3,
  // Collection 7 — Beings in the Dark
  57: 2, 58: 2, 59: 2, 60: 2, 61: 2, 62: 3, 63: 3,
  // Collection 8 — Special Places
  65: 2, 66: 2, 67: 2, 68: 2, 69: 3, 70: 3, 71: 3, 72: 3,
  // Collection 9 — Playtime (all ≥ 2⭐)
  73: 2, 74: 2, 75: 2, 76: 2, 77: 2, 78: 3, 79: 3, 80: 3, 81: 3,
  // Collection 10 — Steel Shock
  82: 2, 83: 2, 84: 2, 85: 2, 86: 3, 87: 3, 88: 3, 89: 3, 90: 3,
};

export function stickerStars(id: number): 1 | 2 | 3 {
  return (STICKER_STARS[id] ?? 1) as 1 | 2 | 3;
}

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

export const STICKER_NAMES: Record<"fr" | "en", string[]> = {
  en: [
    "Whoosh from all directions!","Sharp Claw","Confident Swordsman","Ominous Sign","Soul's Whisper","Sharp as a Spear","Chicken? Eagle?","Small Wing's Rest","Evil Bone",
    "Grumpy","Caution: Electric Shock","Pink Cloud","Fluffy Cloud","Apathy","Flower in the Cave","Rock Fist","Frontal Breakthrough","Secret of the Ghost Ship",
    "Boring Daily Life","Staring blankly...","Iron Wall Defense","Resolute Strike","Beast's Rage","Sobbing Night","Painful Charge","Forbidden Sorcery","At the Top Floor of the Tower",
    "Great Birth","Black Energy","Colliding Lightning","Concentration of Power","Call of the Glacier","Roar's Power","Gentleness within the Rock","Tense Moment","Brillant Descent",
    "Natural Umbrella","Mud Face Wash","Collapsed Totem","Yawn Time","Running Rabbit","Dangerous Prank","Sanctuary on a Rainy Day","What's going on?","Snake in the Forest",
    "Flame Sprint","Lava's Guardian","Hot Water Play","Ruler of Flame","Fiery Gaze","Flame's Roar","Birth of Flame","Collapsing Mountain Range","Hellfire",
    "Stealthy Attack","Under the Moonlight","Universe","Crystal Shard","Dark Chains","Lava Zone","Black Aura","Magic","Destination",
    "Nest of Greed","Chivalry","Lamp","Academic Research","Performance Preparation","Christmas Pierrot","Circus Stage","Witch's House","Two Faces",
    "Go Away!","Beware of Bombs!","Wrapped in Wind","Similar Pair","After Swimming","Stop There!","Agile Movement","Electrocution","Heavy Metal",
    "Rabbit Friends","Striking Lightning","Pouring Lightning","Stealthy Shot","Electric Charge","Apple Slice!","Sharp Sword","Winding Gear","Clockwork Castle",
    "Honey Collector","Flower Crown","Mushro","Stars and Sleep","Ghost and Lantern","Ants and Dessert","Dessert Party","Candy Rain","Rose Garden",
    "Hello!","Where Am I?","Lick","Light of Sleep","Sea Storm","Swimming Contest","What's Everyone Doing?","Sharp Eyes","Underwater Predator",
    "Bandage","Even Blindfolded","Black and White","Sand Diving","Cool Bones","Will-o'-the-wisp","Hide-and-Seek","Stealthily","Show Lightning",
    "Resort","I Want to Be Pretty Too","Gift Time","Little Friend","Hatch","Wave","Descent","Flowers and Butterflies","Tarot",
    "Light and Butterflies","Cloud-like","Acrobatics","Gliding","Sleep on Clouds","Haechi","It's Fun","Fairy Dust","Flight of Light",
    "Cintamani","Curiosity","Warm Morning","Happies Time","Meat is the Best","Under the Waterfall","Broken Rock","Lake View","Wounds and Friends",
    "Frost Wind","Roar of Extreme Cold","Blizzard","You're Too Cold","Penguin...?","Scattering Snowflakes","Chilling Cold","Magic Light","Winter Wind",
    "Blooming Flower","Beauty of Nature","Chirping Birds","Rainbow Walk","Coward","Friend","Everyone Get Along","Song and Nap","Spring Sunshine",
    "Swimming in the Sea","Ouch!","Stare","This is Mine","This is Mine Too","One More Time","Who Are You?","Hunting Time","Free Performance",
    "Want to Sleep Together?","I'm Scared Alone","Shining Tail","Cave Guide","Ominous Aura","Castle of Fear","Moon and Night","Moonlit Lake","Gloomy Omen",
  ],
  fr: [
    "Sifflement de partout!","Griffe aiguisée","Epéiste confiant","Présage Sinistre","Murmure de l'Âme","Aiguisé comme une lance","Poulet ? Aigle ?","Repos de la petite aile","Os maléfique",
    "Mécontentement","Attention à l'électrocution","Nuage rose","Nuage moelleux","Apathie","Fleur de la grotte","Poing de roche","Percée frontale","Secret du bateau fantôme",
    "Quotidien ennuyeux","Dans le vide...","Défense de fer","Coup décisif","Colère de la bête","Nuit sanglotante","Charge douloureuse","Sorcellerie interdite","Au dernier étage de la tour",
    "Grande naissance","Energie noire","Foudre en collision","Concentration de force","Appel de la neige éternelle","Force du Rugissement","Douceur dans la roche","Moment tendu","Avènement radieux",
    "Parapluie naturel","Lavage du visage à la boue","Totem effondré","Temps de bâillement","Lapin en fuite","Blague dangereuse","Refuge du jour de pluie","Qu'est-ce qui se passe ?","Serpent de la forêt",
    "Course de la flamme","Gardien de la lave","Jeu d'eau chaud","Maître de la flamme","Regard de feu","Rugissement de la flamme","Naissance de la flamme","Chaîne de montagnes qui s'éffondre","Flamme de l'enfer",
    "Attaque furtive","Sous le clair de lune","Univers","Fragment de cristal","Chaîne sombre","Zone de lave","Aure noire","Magique","Destination",
    "Nid de la cupidité","Chevalerie","Lampe","Recherche académique","Préparation du spectacle","Pierrot de Noël","Scène de cirque","Maison de la sorcière","Deux visages",
    "Va-t'en !","Attention à la bombe !","Enveloppé par le vent","Ressemblance","Après la nage","Arrête-toi là !","Mouvement agile","Electrocution","Heavy Metal",
    "Amis lapins","Foudre qui frappe","Foudre abondante","Tir furtif","Charge électrique","Couper la pomme !","Epée aiguisée","Remontoir qui tourne","Château du remontoir",
    "Collectionneur de miel","Couronne de fleurs","Champignon","Etoiles et sommeil","Fantômes et lanterne","Fourmis et dessert","Fête de dessert","Pluie de bonbons","Jardin de roses",
    "Bonjour !","Où est-ce ?","Lèchement","Lumière de la surface de l'eau","Tempête de la mer","Compétition de nage","Que faites-vous tous ?","Œil aiguisé","Prédateur sous-marin",
    "Bandage","Même les yeux bandés","Noir et blanc","Plongée dans le sable","Os magnifique","Feu follet","Cache-cache","Furtivement","Foudre d'ombre",
    "Lieu de villégiature","Je veux être jolie aussi","Heure des cadeaux","Petit ami","Eclosion","Onde","Descente","Fleurs et papillons","Tarot",
    "Lumière et papillons","Comme un nuage","Acrobatie","Vol plané","Sommeil sur les nuages","Haechi","C'est amusant","Poussière de fée","Vol de lumière",
    "Yeouiju","Curiosité","Matin doux","Le moment le plus heureux","La viande est la meilleure","Sous la cascade","Rocher brisé","Vue sur le lac","Blessure et ami",
    "Vent glacial","Rugissement glacial","Blizzard","Tu es trop froid","Manchot...?","Flocons de neiges virevoltants","Froid mordant","Lumière magique","Vent d'hiver",
    "Fleurs épanouies","Beauté de la nature","Chant des oiseaux","Promenade arc-en-ciel","Lâche","Ami","Tous en harmonie","Chant et sieste","Rayons de soleil printaniers",
    "Nage sous-marine","Aïe !","Regard noir","C'est à moi","C'est aussi à moi","Encore une fois","Qui es-tu ?","Heure de la chasse","Spectacle libre",
    "Tu veux dormir avec moi ?","J'ai peur seul","Queue brillante","Guide dans la grotte","Aura sinistre","Château de la terreur","Lune et nuit","Lac au clair de lune","Sombre présage",
  ],
};

/** Name of a sticker in the given locale (fallback to EN). */
export function stickerName(id: number, locale: "fr" | "en"): string {
  return (STICKER_NAMES[locale] ?? STICKER_NAMES.en)[id - 1] ?? `#${id}`;
}
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
