import Link from "next/link";
import { HeroChatMockup } from "./components/HeroChatMockup";
import { LiveDemo } from "./components/LiveDemo";
import { Logo } from "./components/Logo";

// =====================================================
// Landing page Stayly · V4 Light Airbnb-warm
// Thème clair (cream) + accent sunset coral/rose
// CTAs scrollent vers #demo (la vraie démo IA est sur la page)
// =====================================================

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#fbf7f2] text-zinc-900">
      {/* === BACKGROUND : glows chauds doux === */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        {/* Lumière chaude haut-gauche */}
        <div className="absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full bg-amber-200/50 blur-[100px]" />
        {/* Coral central */}
        <div className="absolute -top-20 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-rose-200/60 blur-[100px]" />
        {/* Rose à droite */}
        <div className="absolute top-[15%] -right-20 h-[450px] w-[500px] rounded-full bg-pink-200/50 blur-[100px]" />
      </div>

      {/* === NAVIGATION === */}
      <header className="sticky top-0 z-50 border-b border-zinc-200/60 bg-[#fbf7f2]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2.5">
            <Logo size="sm" />
            <span className="font-semibold text-lg tracking-tight">Stayly</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm text-zinc-600">
            <a href="#how" className="hover:text-zinc-900 transition">Comment ça marche</a>
            <a href="#demo" className="hover:text-zinc-900 transition">Tester en live</a>
            <a href="#testimonials" className="hover:text-zinc-900 transition">Avis</a>
          </nav>

          <a
            href="#demo"
            className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 transition"
          >
            Essayer
          </a>
        </div>
      </header>

      {/* === HERO === */}
      <section className="relative">
        <div className="mx-auto max-w-5xl px-6 pt-20 pb-20 text-center animate-fade-in-up">
          {/* Kicker italique serif */}
          <p className="mb-6 font-serif italic text-base md:text-lg text-rose-500">
            Pour les hôtes qui prennent l&apos;accueil au sérieux.
          </p>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.05] text-zinc-900">
            Réponds à tes voyageurs
            <br />
            Airbnb{" "}
            <span className="bg-gradient-to-r from-amber-500 via-rose-500 to-pink-500 bg-clip-text text-transparent">
              en quelques secondes
            </span>
            .
          </h1>

          <p className="mt-7 text-lg md:text-xl text-zinc-600 max-w-2xl mx-auto leading-relaxed">
            Stayly rédige des réponses pro et chaleureuses à ta place.
            Gagne du temps,{" "}
            <span className="font-serif italic text-zinc-900">garde l&apos;humain</span>.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="#demo"
              className="group relative inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-rose-500 to-orange-500 px-6 py-3 text-base font-medium text-white transition-all hover:from-rose-400 hover:to-orange-400 hover:scale-[1.02] shadow-[0_8px_30px_-5px_rgba(251,113,133,0.5)]"
            >
              Essayer gratuitement
              <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </a>
            <a
              href="#how"
              className="rounded-full border border-zinc-300 bg-white px-6 py-3 text-base font-medium text-zinc-900 hover:bg-zinc-50 hover:border-zinc-400 transition"
            >
              Voir comment ça marche
            </a>
          </div>

          <p className="mt-6 text-sm text-zinc-500">
            Sans inscription · 3 essais gratuits · Pensé en France
          </p>
        </div>

        {/* === MOCKUP CHAT (hero visuel) avec typing effect === */}
        <HeroChatMockup />
      </section>

      {/* === HOW IT WORKS === */}
      <section id="how" className="relative border-t border-zinc-200/60 py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center mb-16">
            <p className="font-serif italic text-rose-500 mb-3">Le rituel</p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-zinc-900">
              Trois gestes, et c&apos;est fait
            </h2>
            <p className="mt-4 text-zinc-600">
              Pas d&apos;onboarding, pas de configuration. Juste tes messages, mieux écrits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { num: "01", title: "Colle le message", desc: "Copie le message reçu d'un voyageur depuis Airbnb." },
              { num: "02", title: "Génère la réponse", desc: "L'IA rédige une réponse pro et chaleureuse en 2 secondes." },
              { num: "03", title: "Copie et envoie", desc: "Relis, ajuste si besoin, puis colle dans Airbnb. Voilà." },
            ].map((step) => (
              <div
                key={step.num}
                className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-rose-300 hover:shadow-[0_20px_40px_-15px_rgba(251,113,133,0.25)]"
              >
                <div className="text-3xl font-bold text-zinc-300 group-hover:text-rose-500 transition mb-4">
                  {step.num}
                </div>
                <h3 className="font-semibold text-lg mb-2 text-zinc-900">{step.title}</h3>
                <p className="text-zinc-600 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === LIVE DEMO === */}
      <section id="demo" className="relative border-t border-zinc-200/60 py-24">
        {/* Glow chaud derrière */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[400px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-amber-200/40 via-rose-200/50 to-pink-200/40 blur-[100px]" />

        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center mb-16">
            <p className="font-serif italic text-rose-500 mb-3">L&apos;expérience</p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-zinc-900">
              Essaie maintenant
            </h2>
            <p className="mt-4 text-zinc-600">
              Colle un message reçu, et regarde Stayly{" "}
              <span className="font-serif italic text-zinc-900">y répondre en direct</span>.
            </p>
          </div>

          <LiveDemo />
        </div>
      </section>

      {/* === TESTIMONIALS === */}
      <section id="testimonials" className="relative border-t border-zinc-200/60 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-16">
            <p className="font-serif italic text-rose-500 mb-3">Ce qu&apos;on en dit</p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-zinc-900">
              Des hôtes qui respirent
              <br />
              <span className="font-serif italic font-normal bg-gradient-to-r from-amber-500 to-rose-500 bg-clip-text text-transparent">
                un peu mieux.
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              {
                quote:
                  "Avant, je passais 30 minutes par jour à répondre. Maintenant, c'est 5 minutes et mes réponses sont plus chaleureuses qu'avant. Mes voyageurs le sentent.",
                name: "Marie",
                where: "Paris · Appartement 11ᵉ",
              },
              {
                quote:
                  "Je gère 4 logements en parallèle. Stayly m'a évité des nuits blanches à répondre tard. Le ton tombe juste à chaque fois, je relis et j'envoie.",
                name: "Thomas",
                where: "Annecy · Chalet en montagne",
              },
              {
                quote:
                  "L'IA capte des trucs que j'aurais oubliés — proposer le check-in adapté, mentionner le parking, finir avec une formule cordiale. Mes notes ont monté.",
                name: "Sophie",
                where: "Bordeaux · Maison de ville",
              },
              {
                quote:
                  "J'aime le fait que ça reste mes mots, juste mieux organisés. Pas une réponse robotique. C'est exactement ce qu'il fallait pour Airbnb.",
                name: "Antoine",
                where: "Nice · Studio bord de mer",
              },
            ].map((t) => (
              <div
                key={t.name}
                className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-rose-300 hover:shadow-[0_20px_40px_-15px_rgba(251,113,133,0.2)]"
              >
                {/* 5 étoiles */}
                <div className="flex items-center gap-0.5 mb-4">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <svg key={i} className="h-4 w-4 text-rose-500 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2l2.94 6.94L22 10l-5.5 5.36L17.88 22 12 18.27 6.12 22l1.38-6.64L2 10l7.06-1.06L12 2z" />
                    </svg>
                  ))}
                </div>

                <p className="text-zinc-700 leading-relaxed mb-5">
                  «&nbsp;{t.quote}&nbsp;»
                </p>

                <div className="flex items-center gap-3 pt-4 border-t border-zinc-100">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-amber-200 to-rose-300 text-zinc-900 text-sm font-semibold">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-zinc-900">{t.name}</p>
                    <p className="text-xs text-zinc-500">{t.where}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === BENEFITS === */}
      <section id="benefits" className="relative border-t border-zinc-200/60 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-16">
            <p className="font-serif italic text-rose-500 mb-3">Hospitalité</p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-zinc-900">
              Pensé pour les hôtes,
              <br />
              <span className="font-serif italic font-normal bg-gradient-to-r from-amber-500 to-rose-500 bg-clip-text text-transparent">
                pas pour les algorithmes.
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { title: "Gagne du temps", desc: "5 minutes économisées par message. Multiplié par 50 messages par mois." },
              { title: "Toujours chaleureux", desc: "Le ton qu'il faut, à chaque fois. Plus de fautes, plus de réponses sèches." },
              { title: "Multi-langues", desc: "Réponds en français, anglais, espagnol, italien... sans effort." },
              { title: "Meilleurs avis", desc: "Des voyageurs satisfaits, plus de 5 étoiles, plus de réservations." },
            ].map((b) => (
              <div
                key={b.title}
                className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 transition-all duration-300 hover:border-rose-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(251,113,133,0.2)]"
              >
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-100 to-rose-100 ring-1 ring-rose-200">
                  <span className="h-2 w-2 rounded-full bg-gradient-to-br from-amber-400 to-rose-500 group-hover:scale-125 transition-transform" />
                </div>
                <h3 className="font-semibold text-zinc-900 mb-2">{b.title}</h3>
                <p className="text-sm text-zinc-600 leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === FINAL CTA === */}
      <section className="relative border-t border-zinc-200/60 py-28">
        {/* Glow sunset */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[400px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-amber-200/40 via-rose-200/60 to-pink-200/40 blur-[100px]" />

        <div className="mx-auto max-w-3xl px-6 text-center">
          <p className="font-serif italic text-rose-500 mb-4">Bienvenue chez Stayly.</p>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-zinc-900">
            Prêt à mieux accueillir,
            <br />
            <span className="font-serif italic font-normal bg-gradient-to-r from-amber-500 via-rose-500 to-pink-500 bg-clip-text text-transparent">
              sans y passer la nuit&nbsp;?
            </span>
          </h2>
          <p className="mt-5 text-lg text-zinc-600">
            Rejoins les hôtes qui répondent en quelques secondes au lieu de plusieurs minutes.
          </p>
          <a
            href="#demo"
            className="group mt-10 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-rose-500 to-orange-500 px-8 py-4 text-base font-medium text-white hover:from-rose-400 hover:to-orange-400 hover:scale-[1.02] transition-all shadow-[0_10px_40px_-5px_rgba(251,113,133,0.5)]"
          >
            Tester gratuitement
            <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </a>
          <p className="mt-4 text-sm text-zinc-500">
            Aucun compte requis · 3 essais gratuits par heure
          </p>
        </div>
      </section>

      {/* === FOOTER === */}
      <footer className="border-t border-zinc-200/60 py-10">
        <div className="mx-auto max-w-6xl px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-zinc-500">
          <div className="flex items-center gap-3">
            <Logo size="xs" glow={false} />
            <span>© 2026 Stayly</span>
            <span className="hidden md:inline font-serif italic text-zinc-400">·</span>
            <span className="hidden md:inline font-serif italic text-zinc-400">
              fait avec soin pour les hôtes
            </span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-zinc-900 transition">Confidentialité</a>
            <a href="#" className="hover:text-zinc-900 transition">Conditions</a>
            <a href="#" className="hover:text-zinc-900 transition">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
