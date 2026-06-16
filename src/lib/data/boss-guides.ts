export type DragonTier = "premium" | "mid" | "low";
export type OrbTier = "S" | "A" | "B";

export interface RuneSet {
  name: { fr: string; en: string };
  image: string;
  count: number;
}

export interface Orb {
  name: { fr: string; en: string };
  tier: OrbTier;
}

export interface DragonBuild {
  runes: RuneSet[];
  stats: { fr: string; en: string }[];
  orbs: Orb[];
}

export interface DragonRec {
  id: string;
  name: { fr: string; en: string };
  image?: string;
  tier: DragonTier;
  note?: {
    fr: string;
    en: string;
  };
  build: DragonBuild;
}

export interface BossGuide {
  slug: string;
  name: { fr: string; en: string };
  image: string;
  guide: { fr: string; en: string };
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
      en: `The Crevasse boss is a major technical challenge that requires specific preparation to prevent the team from collapsing. Here are the optimal strategies and compositions to overcome it.

The Core Mechanic: The Sleep Trap
The fight is centered around a highly punishing status ailment: Sleep.
The real danger occurs when the dragons wake up. Each awakening inflicts massive stacking debuffs:

• A drastic drop in Defense and Speed (up to -6 stages).
• An overall loss of up to 75% in defensive and speed stats.

The objective is to bypass this mechanic by prioritizing the Dark element and using equipment capable of cleansing status ailments.`,
    },
    dragons: [
      {
        id: "dragon-serpent",
        name: { fr: "Dragon Serpent", en: "Serpent Dragon" },
        image: "/bosses/dragons/dragon-serpent.png",
        tier: "premium",
        note: {
          fr: "Dragon GRATUIT — obtenable par reproduction (Aquadragon × Nox). Son vol de vie couplé au set Vampirisme lui permet de soloter le raid Crevasse !",
          en: "FREE Dragon — obtainable through breeding (Aqua Dragon × Nox). Its Life Steal ability, combined with the Lifesteal set, allows it to solo the Crevasse raid!",
        },
        build: {
          runes: [
            { name: { fr: "Vampirisme", en: "Lifesteal" }, image: "/bosses/gems/gem_bloodlust.png", count: 4 },
            { name: { fr: "Flamme",     en: "Flame"     }, image: "/bosses/gems/gem_blaze.png",     count: 2 },
          ],
          stats: [
            { fr: "Prob. Double Attaque", en: "Double Attack Chance" },
            { fr: "Prob. Triple Attaque", en: "Triple Attack Chance" },
            { fr: "Attaque",              en: "Attack"               },
            { fr: "Vitesse",              en: "Speed"                },
          ],
          orbs: [
            { name: { fr: "Trou Noir",          en: "Black Hole"  }, tier: "S" },
            { name: { fr: "Bombe des ténèbres", en: "Dark Bomb"   }, tier: "A" },
          ],
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
