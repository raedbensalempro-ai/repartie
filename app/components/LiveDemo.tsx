"use client";

// =====================================================
// Stayly · Live Demo · version light Airbnb-warm
// Bloc interactif sur la landing : input + génération IA en direct
// =====================================================

import { useEffect, useRef, useState } from "react";
import { Logo } from "./Logo";

const DEFAULT_MESSAGE =
  "Bonjour, on arrive demain à 22h, c'est possible de check-in tard ? Et est-ce qu'il y a un parking gratuit dans le coin ? Merci !";

export function LiveDemo() {
  const [input, setInput] = useState(DEFAULT_MESSAGE);
  const [reply, setReply] = useState("");
  const [displayed, setDisplayed] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Typing effect sur la réponse
  const typingTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (typingTimer.current) clearInterval(typingTimer.current);
    if (!reply) {
      setDisplayed("");
      return;
    }

    let i = 0;
    setDisplayed("");
    typingTimer.current = setInterval(() => {
      i++;
      setDisplayed(reply.slice(0, i));
      if (i >= reply.length && typingTimer.current) {
        clearInterval(typingTimer.current);
        typingTimer.current = null;
      }
    }, 16);

    return () => {
      if (typingTimer.current) clearInterval(typingTimer.current);
    };
  }, [reply]);

  const generate = async () => {
    if (!input.trim() || loading) return;
    setLoading(true);
    setError("");
    setReply("");
    setDisplayed("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input.trim() }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data?.error ?? "Erreur. Réessaie.");
      } else {
        setReply(data.reply ?? "");
      }
    } catch {
      setError("Connexion échouée. Réessaie dans un instant.");
    } finally {
      setLoading(false);
    }
  };

  const isTyping = loading || (reply && displayed.length < reply.length);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* === COLONNE GAUCHE : INPUT === */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-zinc-100 to-zinc-200 flex items-center justify-center text-sm font-medium text-zinc-700">
            ?
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-900">
              Le message du voyageur
            </p>
            <p className="text-xs text-zinc-500">Colle ou écris-le ici</p>
          </div>
          <span className="ml-auto rounded-full border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-zinc-500">
            Input
          </span>
        </div>

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={5}
          maxLength={2000}
          placeholder="Bonjour, on arrive demain à 22h..."
          className="w-full resize-none rounded-xl border border-zinc-200 bg-zinc-50/60 p-3 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-200 focus:bg-white"
        />

        <div className="mt-3 flex items-center justify-between text-[11px] text-zinc-500">
          <span>{input.length} / 2000</span>
          <span className="font-serif italic">3 essais gratuits / heure</span>
        </div>

        <button
          onClick={generate}
          disabled={loading || !input.trim()}
          className="group mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-rose-500 to-orange-500 px-5 py-3 text-sm font-medium text-white transition-all hover:from-rose-400 hover:to-orange-400 hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 shadow-[0_8px_24px_-5px_rgba(251,113,133,0.45)]"
        >
          {loading ? (
            <>
              <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
              Génération en cours…
            </>
          ) : (
            <>
              Générer la réponse
              <svg
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </>
          )}
        </button>
      </div>

      {/* === COLONNE DROITE : RÉPONSE === */}
      <div className="relative rounded-2xl bg-gradient-to-b from-amber-200/40 via-rose-300/40 to-rose-500/30 p-px shadow-[0_20px_60px_-15px_rgba(251,113,133,0.35)]">
        <div className="rounded-2xl bg-white p-6 min-h-[280px] flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <Logo size="md" shape="circle" />
            <div>
              <p className="text-sm font-medium text-zinc-900">Stayly</p>
              <p className="text-xs text-zinc-500">
                {loading
                  ? "Lecture du message…"
                  : reply
                    ? "Réponse suggérée"
                    : "En attente"}
              </p>
            </div>
            <span className="ml-auto rounded-full bg-gradient-to-r from-rose-500 to-orange-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
              Live
            </span>
          </div>

          {/* État initial */}
          {!reply && !loading && !error && (
            <p className="font-serif italic text-sm text-zinc-500">
              Clique sur «&nbsp;Générer la réponse&nbsp;» pour voir Stayly écrire en direct.
            </p>
          )}

          {/* Loading */}
          {loading && !reply && (
            <div className="flex items-center gap-2 text-sm text-zinc-600">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
              Stayly rédige une réponse…
            </div>
          )}

          {/* Erreur */}
          {error && (
            <div className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
              <span className="text-rose-500">·</span>
              <span>{error}</span>
            </div>
          )}

          {/* Réponse avec typing effect */}
          {reply && (
            <p className="text-sm text-zinc-800 leading-relaxed whitespace-pre-wrap">
              {displayed}
              {isTyping && (
                <span className="ml-0.5 inline-block h-3.5 w-[2px] -mb-0.5 align-middle bg-zinc-700 animate-blink" />
              )}
            </p>
          )}

          {/* Footer du panneau */}
          {reply && !isTyping && (
            <div className="mt-auto pt-4 flex items-center justify-between text-[11px] text-zinc-500">
              <span>Rédigé par Stayly · ton chaleureux</span>
              <button
                onClick={() => navigator.clipboard.writeText(reply)}
                className="rounded-md border border-zinc-200 bg-white px-2 py-1 text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300 transition"
              >
                Copier
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
