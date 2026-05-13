# Repartie

L'IA qui te trouve la réplique parfaite, en 3 secondes.

Tu reçois un message méchant — texto, DM, mail. Tu le colles dans Repartie, tu choisis un ton (Cinglant / Piquant / Élégant / Glaçant), et tu reçois 3 propositions de comebacks prêtes à copier-coller.

## Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- OpenAI `gpt-4o-mini`
- Déployé sur Vercel

## Lancer en local

```bash
npm install
cp .env.example .env.local  # et ajoute ta clé OPENAI_API_KEY
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000).

## Variables d'environnement

```
OPENAI_API_KEY=sk-...
```

## Roadmap MVP

- [x] Landing page style LarpGPT (dark, bold, tight)
- [x] Génération de 3 répliques avec choix de ton
- [x] Rate limit cookie-based (3/h)
- [ ] Stripe : Pro à 4,99 €/mois (illimité + tons exclusifs)
- [ ] Page `/exemples` avec 50+ scénarios
- [ ] Carrousels TikTok auto-générés

## Auteur

Construit par [@raedbensalempro](https://github.com/raedbensalempro-ai), un projet de la série « micro SaaS rapides ».
