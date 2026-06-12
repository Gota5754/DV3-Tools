# DV3 Tools

Site compagnon pour **Dragon Village 3** — Sticker Book Tracker, Trade Board, et bientôt Tier Lists et guides World Boss.

**Stack :** Next.js (App Router) · Tailwind CSS v4 + shadcn/ui · Supabase (auth + PostgreSQL) · next-intl (FR/EN) · Vercel

## Démarrage

1. **Créer un projet Supabase** sur [supabase.com](https://supabase.com), puis exécuter `supabase/migrations/0001_initial_schema.sql` dans le SQL Editor.
2. **Configurer l'environnement** : copier `.env.example` vers `.env.local` et renseigner l'URL et la clé anon du projet (Project Settings → API).
3. **Ajouter les images de stickers** dans `public/stickers/` (voir nomenclature ci-dessous).
4. Lancer : `npm install && npm run dev`

## Images des stickers

Placer les 180 fichiers `.png` dans **`public/stickers/`** avec la nomenclature :

```
<numéro de collection sur 2 chiffres>-<position 1 à 9>.png
```

Exemples : `01-1.png` (collection 1, sticker 1) … `20-9.png` (collection 20, sticker 9).

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
