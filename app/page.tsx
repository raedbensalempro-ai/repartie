"use client";

import { useState } from "react";

// =====================================================
// Repartie · Landing + Generator
// Style inspiré LarpGPT : fond noir, typo bold + tight, ALL CAPS.
// 1 input → choix de ton → 3 répliques générées.
// =====================================================

type Tone = "cinglant" | "piquant" | "elegant" | "glacant";

const TONES: { id: Tone; label: string; emoji: string; desc: string }[] = [
  { id: "cinglant", label: "CINGLANT", emoji: "🔪", desc: "Direct, qui pique fort." },
  { id: "piquant", label: "PIQUANT", emoji: "🌶️", desc: "Sarcastique, drôle, malin." },
  { id: "elegant", label: "ÉLÉGANT", emoji: "🥂", desc: "Classe, posé, désarmant." },
  { id: "glacant", label: "GLAÇANT", emoji: "❄️", desc: "Froid, court, sans appel." },
];

const EXAMPLES: { category: string; message: string; reply: string }[] = [
  {
    category: "Ex",
    message: "T'as encore grossi on dirait.",
    reply: "Toi par contre t'as gardé exactement le même niveau de conversation. C'est ça, la constance.",
  },
  {
    category: "Famille",
    message: "Toujours pas de boulot stable hein ?",
    reply: "Je préfère un parcours qui me ressemble qu'un CDI qui me déprime. Mais merci de l'intérêt.",
  },
  {
    category: "Travail",
    message: "T'es sûr que t'es capable de gérer ça ?",
    reply: "Si tu avais autant de temps pour bosser que pour douter de moi, on aurait fini hier.",
  },
  {
    category: "Inconnu",
    message: "Tu te crois mieux que tout le monde.",
    reply: "Non, juste mieux que toi. Et c'est déjà beaucoup de boulot.",
  },
  {
    category: "DM",
    message: "T'es bonne mais t'as un sale caractère.",
    reply: "Et toi t'es ni l'un ni l'autre. Bonne soirée.",
  },
  {
    category: "Famille",
    message: "Tu devrais te marier avant qu'il soit trop tard.",
    reply: "Tu devrais arrêter de projeter tes regrets sur ma vie. Ça aussi, c'est un timing.",
  },
];

export default function Home() {
  const [message, setMessage] = useState("");
  const [tone, setTone] = useState<Tone>("piquant");
  const [replies, setReplies] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  async function handleGenerate() {
    if (!message.trim()) return;
    setLoading(true);
    setError(null);
    setReplies([]);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: message.trim(), tone }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Erreur. Réessaie.");
      } else {
        setReplies(Array.isArray(data.replies) ? data.replies : []);
      }
    } catch {
      setError("Connexion impossible. Réessaie.");
    } finally {
      setLoading(false);
    }
  }

  async function copyReply(text: string, idx: number) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 1500);
    } catch {
      // ignore
    }
  }

  return (
    <div className="min-h-screen bg-[#050505] text-neutral-200 antialiased selection:bg-white selection:text-black">
      {/* === NAV === */}
      <header className="border-b border-neutral-900">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <a href="#" className="text-lg font-bold tracking-tight text-white">
            Repartie
          </a>
          <nav className="hidden gap-7 text-sm text-neutral-400 md:flex">
            <a href="#generator" className="transition hover:text-white">Générateur</a>
            <a href="#how" className="transition hover:text-white">Comment ça marche</a>
            <a href="#examples" className="transition hover:text-white">Exemples</a>
          </nav>
        </div>
      </header>

      {/* === HERO === */}
      <section className="px-6 pb-20 pt-24 text-center">
        <h1 className="mx-auto text-7xl font-black leading-none tracking-tighter text-white md:text-[120px]">
          Repartie
        </h1>
        <p className="mx-auto mt-8 max-w-2xl text-sm font-bold uppercase tracking-[0.2em] text-neutral-400 md:text-base">
          La réplique parfaite, en 3 secondes.
        </p>

        <div className="mt-12 flex flex-col items-center justify-center gap-3 md:flex-row">
          <a
            href="#generator"
            className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-bold uppercase tracking-wider text-black transition hover:bg-neutral-200"
          >
            Générer une réplique
          </a>
          <a
            href="#examples"
            className="inline-flex items-center justify-center rounded-full border border-neutral-700 bg-transparent px-6 py-3 text-sm font-bold uppercase tracking-wider text-white transition hover:border-neutral-400"
          >
            Voir des exemples
          </a>
        </div>
      </section>

      {/* === HOW IT WORKS === */}
      <section id="how" className="border-t border-neutral-900 px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <p className="text-center text-xs font-bold uppercase tracking-[0.3em] text-neutral-500">
            Comment ça marche
          </p>
          <h2 className="mt-4 text-center text-4xl font-black tracking-tighter text-white md:text-5xl">
            Trois étapes. C&apos;est tout.
          </h2>
          <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-3">
            {[
              { num: "01", title: "Colle le message", desc: "Le message qu'on t'a balancé. Texto, DM, mail." },
              { num: "02", title: "Choisis le ton", desc: "Cinglant, Piquant, Élégant ou Glaçant." },
              { num: "03", title: "Copie ta réplique", desc: "3 versions. Tu prends la meilleure. Tu colles." },
            ].map((step) => (
              <div
                key={step.num}
                className="rounded-2xl border border-neutral-900 bg-neutral-950 p-6 transition hover:border-neutral-700"
              >
                <div className="text-3xl font-black text-neutral-700">{step.num}</div>
                <h3 className="mt-4 text-lg font-bold text-white">{step.title}</h3>
                <p className="mt-2 text-sm text-neutral-400">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === GENERATOR === */}
      <section id="generator" className="border-t border-neutral-900 px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <p className="text-center text-xs font-bold uppercase tracking-[0.3em] text-neutral-500">
            Générateur
          </p>
          <h2 className="mt-4 text-center text-4xl font-black tracking-tighter text-white md:text-5xl">
            Ton clapback, tout de suite.
          </h2>

          {/* Input */}
          <div className="mt-12">
            <label className="mb-3 block text-xs font-bold uppercase tracking-wider text-neutral-400">
              Le message qu&apos;on t&apos;a envoyé
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ex : T'es chiant·e en ce moment, qu'est-ce qui te prend ?"
              rows={4}
              maxLength={500}
              className="w-full resize-none rounded-2xl border border-neutral-800 bg-neutral-950 px-5 py-4 text-base text-white placeholder:text-neutral-600 focus:border-neutral-500 focus:outline-none"
            />
            <p className="mt-1 text-right text-xs text-neutral-600">{message.length} / 500</p>
          </div>

          {/* Tone selector */}
          <div className="mt-8">
            <label className="mb-3 block text-xs font-bold uppercase tracking-wider text-neutral-400">
              Choisis ton ton
            </label>
            <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
              {TONES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTone(t.id)}
                  className={`rounded-xl border px-4 py-4 text-left transition ${
                    tone === t.id
                      ? "border-white bg-white text-black"
                      : "border-neutral-800 bg-neutral-950 text-white hover:border-neutral-600"
                  }`}
                >
                  <div className="text-2xl">{t.emoji}</div>
                  <div className="mt-2 text-xs font-black uppercase tracking-wider">{t.label}</div>
                  <div
                    className={`mt-1 text-xs ${tone === t.id ? "text-neutral-700" : "text-neutral-500"}`}
                  >
                    {t.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={handleGenerate}
            disabled={loading || !message.trim()}
            className="mt-8 w-full rounded-full bg-white px-6 py-4 text-sm font-bold uppercase tracking-wider text-black transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {loading ? "Génération…" : "Générer 3 répliques"}
          </button>

          {/* Error */}
          {error && (
            <p className="mt-4 rounded-xl border border-red-900 bg-red-950/40 px-4 py-3 text-sm text-red-300">
              {error}
            </p>
          )}

          {/* Results */}
          {replies.length > 0 && (
            <div className="mt-8 space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                Tes 3 répliques
              </p>
              {replies.map((r, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-neutral-800 bg-neutral-950 p-5"
                >
                  <p className="text-base leading-relaxed text-white">{r}</p>
                  <button
                    onClick={() => copyReply(r, idx)}
                    className="mt-4 text-xs font-bold uppercase tracking-wider text-neutral-400 transition hover:text-white"
                  >
                    {copiedIdx === idx ? "✓ Copié" : "Copier"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* === EXAMPLES === */}
      <section id="examples" className="border-t border-neutral-900 px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <p className="text-center text-xs font-bold uppercase tracking-[0.3em] text-neutral-500">
            Exemples
          </p>
          <h2 className="mt-4 text-center text-4xl font-black tracking-tighter text-white md:text-5xl">
            Pour t&apos;inspirer.
          </h2>
          <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-2">
            {EXAMPLES.map((ex, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-neutral-900 bg-neutral-950 p-6"
              >
                <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                  {ex.category}
                </p>
                <p className="mt-3 text-sm italic text-neutral-400">« {ex.message} »</p>
                <div className="my-4 h-px bg-neutral-900" />
                <p className="text-base leading-relaxed text-white">{ex.reply}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === FINAL CTA === */}
      <section className="border-t border-neutral-900 px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-black tracking-tighter text-white md:text-6xl">
            T&apos;as plus jamais à
            <br />
            <span className="text-neutral-500">chercher tes mots.</span>
          </h2>
          <a
            href="#generator"
            className="mt-10 inline-flex items-center justify-center rounded-full bg-white px-8 py-4 text-sm font-bold uppercase tracking-wider text-black transition hover:bg-neutral-200"
          >
            Essayer maintenant
          </a>
          <p className="mt-5 text-xs text-neutral-600">
            Gratuit · 3 essais par heure · Pensé en France
          </p>
        </div>
      </section>

      {/* === FOOTER === */}
      <footer className="border-t border-neutral-900 px-6 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 text-xs text-neutral-600 md:flex-row">
          <span>© 2026 Repartie</span>
          <span>fait avec malice en France</span>
        </div>
      </footer>
    </div>
  );
}
