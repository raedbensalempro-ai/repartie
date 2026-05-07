# Stayly

> L'IA qui répond à tes voyageurs Airbnb en quelques secondes, sans perdre le ton humain.

Stayly est un micro SaaS qui aide les hôtes Airbnb à générer rapidement des réponses professionnelles et chaleureuses à leurs voyageurs grâce à l'IA.

## Stack

- **Next.js 15** (App Router) + **TypeScript**
- **Tailwind CSS v4**
- **Supabase** — auth + base de données *(à venir)*
- **Stripe** — paiement *(à venir)*
- **OpenAI** — génération de réponses *(à venir)*
- **Vercel** — hébergement

## Démarrer en local

```bash
npm install
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000).

## Structure

```
app/
  layout.tsx              # Layout racine + métadonnées
  page.tsx                # Landing page
  globals.css             # Styles globaux + animations
  components/
    HeroChatMockup.tsx    # Mockup chat animé (typing effect)
```

## Roadmap MVP

- [x] Landing page
- [ ] Authentification Supabase
- [ ] Dashboard
- [ ] Génération de réponse IA (OpenAI)
- [ ] Historique
- [ ] Stripe Checkout

---

Build in public · 2026
