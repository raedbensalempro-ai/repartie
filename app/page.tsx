import Link from "next/link";
import { HeroChatMockup } from "./components/HeroChatMockup";
import { LiveDemo } from "./components/LiveDemo";
import { Logo } from "./components/Logo";

// =====================================================
// Landing page Stayly · V3 Hospitalité
// Direction : dark premium AI startup + chaleur Airbnb / hospitalité
// Mots-clés visuels : sunset glows, grain texture, italique serif, tons coral/amber/rose
// =====================================================

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0a0908] text-zinc-100">
      {/* === BACKGROUND : sunset glows + grille + grain === */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        {/* Grille fine */}
        <div
          className="absolute inset-0 opacity-[0.06]
                     bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)]
                     bg-[size:56px_56px]
                     [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
        />

        {/* Lumière chaude (sunset) en haut-gauche — statique pour économiser le GPU */}
        <div className="absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full bg-amber-500/15 blur-[100px]" />
        {/* Coral central — la signature */}
        <div className="absolute -top-20 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-rose-500/25 blur-[100px]" />
        {/* Rose-fuchsia à droite */}
        <div className="absolute top-[15%] -right-20 h-[450px] w-[500px] rounded-full bg-fuchsia-500/12 blur-[100px]" />
        {/* Petit accent orange en bas */}
        <div className="absolute bottom-[10%] left-[10%] h-[300px] w-[400px] rounded-full bg-orange-500/8 blur-[90px]" />
      </div>

      {/* === NAVIGATION === */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0a0908]/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2.5">
            <Logo size="sm" />
            <span className="font-semibold text-lg tracking-tight">Stayly</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm text-zinc-400">
            <a href="#how" className="hover:text-white transition">Comment ça marche</a>
            <a href="#demo" className="hover:text-white transition">L&apos;expérience</a>
            <a href="#benefits" className="hover:text-white transition">Hospitalité</a>
          </nav>

          <Link
            href="/login"
            className="rounded-full bg-white px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-100 transition"
          >
            Se connecter
          </Link>
        </div>
      </header>

      {/* === HERO === */}
      <section className="relative">
        <div className="mx-auto max-w-5xl px-6 pt-20 pb-20 text-center animate-fade-in-up">
          {/* Kicker italique serif — la touche humaine */}
          <p className="mb-6 font-serif italic text-base md:text-lg text-rose-300/90">
            Pour les hôtes qui prennent l&apos;accueil au sérieux.
          </p>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.05] bg-gradient-to-b from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent">
            Réponds à tes voyageurs
            <br />
            Airbnb{" "}
            <span className="bg-gradient-to-r from-amber-200 via-rose-300 to-fuchsia-300 bg-clip-text text-transparent">
              en quelques secondes
            </span>
            .
          </h1>

          <p className="mt-7 text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Stayly rédige des réponses pro et chaleureuses à ta place.
            Gagne du temps,{" "}
            <span className="font-serif italic text-zinc-200">garde l&apos;humain</span>.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/login"
              className="group relative inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-rose-500 to-orange-500 px-6 py-3 text-base font-medium text-white transition-all hover:from-rose-400 hover:to-orange-400 hover:scale-[1.02] shadow-[0_0_40px_-5px_rgba(251,113,133,0.6)]"
            >
              Essayer gratuitement
              <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </Link>
            <a
              href="#demo"
              className="rounded-full border border-white/10 bg-white/5 px-6 py-3 text-base font-medium text-white hover:bg-white/10 hover:border-white/20 transition backdrop-blur"
            >
              Voir la démo
            </a>
          </div>

          <p className="mt-6 text-sm text-zinc-500">
            5 réponses gratuites · Pas de carte requise · Pensé en France
          </p>
        </div>

        {/* === MOCKUP CHAT (hero visuel) avec typing effect === */}
        <HeroChatMockup />
      </section>

      {/* === HOW IT WORKS === */}
      <section id="how" className="relative border-t border-white/5 py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center mb-16">
            <p className="font-serif italic text-rose-300/80 mb-3">Le rituel</p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent">
              Trois gestes, et c&apos;est fait
            </h2>
            <p className="mt-4 text-zinc-400">
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
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.07] to-white/[0.02] p-6 ring-1 ring-inset ring-white/[0.03] transition-all duration-300 hover:-translate-y-1 hover:border-rose-400/40 hover:shadow-[0_0_40px_-10px_rgba(251,146,60,0.4)]"
              >
                {/* Highlight chaud subtil en haut au hover */}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-300/0 to-transparent group-hover:via-amber-300/70 transition-all duration-500" />
                <div className="text-3xl font-bold text-zinc-700 group-hover:text-rose-300 transition mb-4">
                  {step.num}
                </div>
                <h3 className="font-semibold text-lg mb-2 text-white">{step.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === BEFORE / AFTER DEMO === */}
      <section id="demo" className="relative border-t border-white/5 py-24">
        {/* Glow chaud derrière */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[400px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-amber-500/8 via-rose-500/12 to-fuchsia-500/8 blur-[100px]" />

        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center mb-16">
            <p className="font-serif italic text-rose-300/80 mb-3">L&apos;expérience</p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent">
              Essaie maintenant
            </h2>
            <p className="mt-4 text-zinc-400">
              Colle un message reçu, et regarde Stayly{" "}
              <span className="font-serif italic text-zinc-200">y répondre en direct</span>.
            </p>
          </div>

          <LiveDemo />
        </div>
      </section>

      {/* === BENEFITS === */}
      <section id="benefits" className="relative border-t border-white/5 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-16">
            <p className="font-serif italic text-rose-300/80 mb-3">Hospitalité</p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent">
              Pensé pour les hôtes,
              <br />
              <span className="font-serif italic font-normal bg-gradient-to-r from-amber-200 to-rose-300 bg-clip-text text-transparent">
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
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-transparent p-6 ring-1 ring-inset ring-white/[0.03] transition-all duration-300 hover:border-rose-400/40 hover:-translate-y-1"
              >
                {/* Glow radial chaud au hover */}
                <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(251,113,133,0.15),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                {/* Highlight haut au hover */}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-300/0 to-transparent group-hover:via-amber-300/70 transition-all duration-500" />
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-300/15 via-rose-400/15 to-rose-600/5 ring-1 ring-rose-400/20 group-hover:ring-amber-300/40 transition">
                  <span className="h-2 w-2 rounded-full bg-gradient-to-br from-amber-300 to-rose-400 group-hover:scale-125 transition-transform" />
                </div>
                <h3 className="font-semibold text-white mb-2">{b.title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === FINAL CTA === */}
      <section className="relative border-t border-white/5 py-28">
        {/* Sunset glow */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[400px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-amber-500/15 via-rose-500/25 to-fuchsia-500/15 blur-[90px]" />

        <div className="mx-auto max-w-3xl px-6 text-center">
          <p className="font-serif italic text-rose-300/80 mb-4">Bienvenue chez Stayly.</p>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent">
            Prêt à mieux accueillir,
            <br />
            <span className="font-serif italic font-normal bg-gradient-to-r from-amber-200 via-rose-300 to-fuchsia-300 bg-clip-text text-transparent">
              sans y passer la nuit ?
            </span>
          </h2>
          <p className="mt-5 text-lg text-zinc-400">
            Rejoins les hôtes qui répondent en quelques secondes au lieu de plusieurs minutes.
          </p>
          <Link
            href="/login"
            className="group mt-10 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-rose-500 to-orange-500 px-8 py-4 text-base font-medium text-white hover:from-rose-400 hover:to-orange-400 hover:scale-[1.02] transition-all shadow-[0_0_50px_-5px_rgba(251,113,133,0.7)]"
          >
            Commencer gratuitement
            <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>

      {/* === FOOTER === */}
      <footer className="border-t border-white/5 py-10">
        <div className="mx-auto max-w-6xl px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-zinc-500">
          <div className="flex items-center gap-3">
            <Logo size="xs" glow={false} />
            <span>© 2026 Stayly</span>
            <span className="hidden md:inline font-serif italic text-zinc-600">·</span>
            <span className="hidden md:inline font-serif italic text-zinc-600">
              fait avec soin pour les hôtes
            </span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-white transition">Confidentialité</a>
            <a href="#" className="hover:text-white transition">Conditions</a>
            <a href="#" className="hover:text-white transition">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
