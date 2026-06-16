export type DragonTier = "premium" | "mid" | "low";

export interface RuneSet {
  name: string;
  slots: string;
}

export interface DragonBuild {
  runes: RuneSet[];
  stats: string[];
  orbs: string[];
}

export interface DragonRec {
  id: string;
  name: string;
  image?: string;    // sprite path relative to /public
  tier: DragonTier;
  note?: {
    fr: string;
    en: string;
  };
  build: DragonBuild;
}

export interface BossGuide {
  slug: string;
  name: {
    fr: string;
    en: string;
  };
  image: string;
  guide: {
    fr: string;
    en: string;
  };
  dragons: DragonRec[];
}

export const BOSSES: BossGuide[] = [
  {
    slug: "boss-1",
    name: { fr: "Crevasse", en: "Crevasse" },
    image: "/bosses/boss_1.png",
    guide: {
      fr: `Le boss Crevasse est un défi technique majeur qui nécessite une préparation spécifique pour éviter que l'équipe ne s'effondre. Voici les stratégies et compositions optimales pour en venir à bout.

La Mécanique Centrale : Le Piège du Sommeil
Le combat est centré sur une altération d'état très punitive : le Sommeil.
Le véritable danger survient lors du réveil des dragons. Chaque réveil inflige d'énormes malus cumulatifs :

• Une baisse drastique de la Défense et de la Vitesse (jusqu'à -6 niveaux).
• Une perte globale pouvant atteindre 75% des statistiques défensives et de rapidité.

L'objectif est de contourner cette mécanique en privilégiant l'élément Ténèbres et en utilisant des équipements capables de purifier les altérations d'état.`,
      en: "Guide coming soon.",
    },
    dragons: [
      {
        id: "dragon-serpent",
        name: "Dragon Serpent",
        image: "/bosses/dragons/dragon-serpent.png",
        tier: "premium",
        note: {
          fr: "Se réveille automatiquement du Sommeil — peut solo le raid Crevasse. Obtenable par breeding.",
          en: "Auto-wakes from Sleep — can solo the Crevasse raid. Obtainable via breeding.",
        },
        build: {
          runes: [],
          stats: [],
          orbs: [],
        },
      },
    ],
  },
  {
    slug: "boss-2",
    name: { fr: "Chasseur de Dragon", en: "Dragon Slayer" },
    image: "/bosses/boss_2.png",
    guide: {
      fr: "Guide à venir.",
      en: "Guide coming soon.",
    },
    dragons: [],
  },
  {
    slug: "boss-3",
    name: { fr: "Tiamat", en: "Tiamat" },
    image: "/bosses/boss_3.png",
    guide: {
      fr: "Guide à venir.",
      en: "Guide coming soon.",
    },
    dragons: [],
  },
];

export function getBoss(slug: string): BossGuide | undefined {
  return BOSSES.find((b) => b.slug === slug);
}
