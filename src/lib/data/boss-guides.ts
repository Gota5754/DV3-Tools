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
    name: { fr: "Boss 1", en: "Boss 1" },
    image: "/bosses/boss_1.png",
    guide: {
      fr: "Guide à venir.",
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
    name: { fr: "Boss 2", en: "Boss 2" },
    image: "/bosses/boss_2.png",
    guide: {
      fr: "Guide à venir.",
      en: "Guide coming soon.",
    },
    dragons: [],
  },
  {
    slug: "boss-3",
    name: { fr: "Boss 3", en: "Boss 3" },
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
