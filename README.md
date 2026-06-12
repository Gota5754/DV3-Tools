# DV3 Tools

Site compagnon pour **Dragon Village 3** — Sticker Book Tracker, Trade Board, et bientôt Tier Lists et guides World Boss.

**Stack :** Next.js (App Router) · Tailwind CSS v4 + shadcn/ui · Supabase (auth + PostgreSQL) · next-intl (FR/EN) · Vercel

## Démarrage

1. **Créer un projet Supabase** sur [supabase.com](https://supabase.com), puis exécuter `supabase/migrations/0001_initial_schema.sql` dans le SQL Editor.
2. **Configurer l'environnement** : copier `.env.example` vers `.env.local` et renseigner l'URL et la clé anon du projet (Project Settings → API).
3. **Ajouter les images de stickers** dans `public/stickers/` (voir nomenclature ci-dessous).
4. Lancer : `npm install && npm run dev`

## Images des stickers

Placer les fichiers `.png` dans **`public/stickers/`** avec la nomenclature :

```
sticker_s<saison>_p<collection 1-20>_<position 1-9>.png   # les 180 stickers
sticker_list_s<saison>_p<collection 1-20>.png             # les 20 couvertures de collection
```

Exemples : `sticker_s1_p1_1.png` (saison 1, collection 1, sticker 1) … `sticker_s1_p20_9.png`, et `sticker_list_s1_p1.png` pour la couverture de la collection 1.

Le mapping vers la base de données est automatique : `sticker_id = (collection - 1) × 9 + position`.

## Architecture

```
src/
├── app/[locale]/          # Routage i18n (fr par défaut, en)
│   ├── page.tsx           # Accueil
│   ├── (auth)/login/      # Connexion / inscription
│   ├── (app)/             # Pages protégées (redirection si non connecté)
│   │   ├── profile/       # Pseudo in-game (IGN)
│   │   ├── stickers/      # Sticker Book Tracker
│   │   └── trade/         # Trade Board (matchmaking)
│   ├── tier-list/         # Placeholder — futur module
│   └── boss-guides/       # Placeholder — futurs guides ([boss] dynamique)
├── components/            # ui/ (shadcn), layout/, auth/, stickers/, trade/
├── i18n/                  # Config next-intl (routing, navigation, request)
├── lib/
│   ├── supabase/          # Clients browser/server/middleware + types DB
│   └── data/stickers.ts   # Structure statique (20 × 9) + chemins d'images
└── locales/               # fr.json / en.json
supabase/migrations/       # Schéma SQL (tables, RLS, RPC de matchmaking)
```

## Déploiement Vercel

Importer le repo sur Vercel et ajouter les variables d'environnement `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Aucune autre configuration nécessaire.
