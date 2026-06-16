export type DragonTier = "premium" | "mid" | "low";

export interface RuneSet {
  name: string;
  slots: string; // e.g. "2/4/6 ATK"
}

export interface DragonBuild {
  runes: RuneSet[];
  stats: string[];   // priority stats
  orbs: string[];    // recommended orbs
}

export interface DragonRec {
  name: string;
  tier: DragonTier;
  build: DragonBuild;
}

export interface BossGuide {
  slug: string;
  name: {
    fr: string;
    en: string;
  };
  image: string;       // path relative to /public
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
        name: "Dragon Premium A",
        tier: "premium",
        build: {
          runes: [{ name: "Fatal", slots: "2/4/6 ATK" }],
          stats: ["ATK%", "CRI Rate", "CRI DMG"],
          orbs: ["Orbe de dégâts", "Orbe critique"],
        },
      },
      {
        name: "Dragon Mid B",
        tier: "mid",
        build: {
          runes: [{ name: "Swift", slots: "2/4/6 SPD" }],
          stats: ["SPD", "ATK%", "HP%"],
          orbs: ["Orbe de vitesse"],
        },
      },
      {
        name: "Dragon Low C",
        tier: "low",
        build: {
          runes: [{ name: "Revenge", slots: "2/4/6 ATK" }],
          stats: ["ATK%", "HP%", "DEF%"],
          orbs: ["Orbe basique"],
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
