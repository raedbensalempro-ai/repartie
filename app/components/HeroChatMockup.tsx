"use client";

// =====================================================
// Mockup chat du hero avec effet "typing" sur la réponse IA.
// Boucle : thinking (1.8s) → typing (caractère par caractère) → pause (10s) → reset
// =====================================================

import { useEffect, useState } from "react";

const FULL_RESPONSE =
  "Bonjour Marc, merci pour votre message ! Pas de souci pour un check-in à 22h, je vous enverrai les instructions d'accès dans la journée. Pour le parking, il y a une zone gratuite à 100m du logement, je vous joindrai la localisation. À très vite !";

type Phase = "thinking" | "typing" | "done";

export function HeroChatMockup() {
  const [typed, setTyped] = useState("");
  const [phase, setPhase] = useState<Phase>("thinking");

  useEffect(() => {
    let cancelled = false;

    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

    const loop = async () => {
      while (!cancelled) {
        // 1. Phase "thinking" — affiche l'indicateur HostAI génère...
        setPhase("thinking");
        setTyped("");
        await sleep(1800);
        if (cancelled) return;

        // 2. Phase "typing" — caractère par caractère, vitesse légèrement variable
        setPhase("typing");
        for (let i = 0; i <= FULL_RESPONSE.length; i++) {
          if (cancelled) return;
          setTyped(FULL_RESPONSE.slice(0, i));
          await sleep(15 + Math.random() * 20);
        }

        // 3. Phase "done" — pause pour laisser le temps de lire
        setPhase("done");
        await sleep(10000);
      }
    };

    loop();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="relative mx-auto max-w-3xl px-6 pb-24">
      {/* Glow sunset derrière la carte (animé : pulse lent) */}
      <div className="absolute inset-x-0 -inset-y-8 -z-10 mx-auto max-w-2xl rounded-[3rem] bg-gradient-to-r from-amber-400/25 via-rose-500/30 to-fuchsia-500/25 blur-3xl animate-glow-pulse" />

      {/* Carte chat avec border en gradient + float très discret */}
      <div className="relative rounded-2xl bg-gradient-to-b from-white/15 via-white/8 to-white/5 p-px shadow-2xl animate-float-slow">
        <div className="rounded-2xl bg-[#0e0c0b]/85 backdrop-blur-xl ring-1 ring-inset ring-white/5">
          {/* Title bar — contexte hôte plutôt que générique */}
          <div className="flex items-center justify-between border-b border-white/5 px-5 py-3">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
                <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
                <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
              </div>
              <span className="ml-2 text-xs text-zinc-500">
                Marc · Check-in demain à 22h
              </span>
            </div>
            <span className="text-xs text-zinc-500">en direct</span>
          </div>

          {/* Conversation */}
          <div className="space-y-4 p-6 min-h-[280px]">
            {/* Message du voyageur */}
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-zinc-600 to-zinc-700 text-xs font-medium text-white">
                M
              </div>
              <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-zinc-800/80 px-4 py-2.5 text-sm text-zinc-200">
                Bonjour, on arrive demain à 22h, c&apos;est possible de check-in tard ? Et il y a un parking gratuit ?
              </div>
            </div>

            {/* Indicator pendant la phase thinking */}
            {phase === "thinking" && (
              <div className="flex items-center gap-2 pl-11 text-xs text-zinc-500">
                <span className="flex h-1.5 w-1.5 rounded-full bg-rose-400 animate-pulse" />
                HostAI rédige une réponse...
              </div>
            )}

            {/* Réponse IA (typing ou done) — gradient sunset */}
            {(phase === "typing" || phase === "done") && (
              <div className="flex items-start justify-end gap-3">
                <div className="relative max-w-[85%] rounded-2xl rounded-tr-sm bg-gradient-to-br from-orange-400 via-rose-500 to-rose-600 px-4 py-2.5 text-sm text-white shadow-lg shadow-rose-500/30">
                  {typed}
                  {phase === "typing" && (
                    <span className="ml-0.5 inline-block h-3.5 w-[2px] -mb-0.5 align-middle bg-white animate-blink" />
                  )}
                </div>
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-300 via-rose-400 to-rose-600 text-xs font-bold text-white shadow-lg shadow-rose-500/30">
                  H
                </div>
              </div>
            )}
          </div>

          {/* Footer du mockup */}
          <div className="flex items-center justify-between border-t border-white/5 px-5 py-3 text-xs text-zinc-500">
            <span>
              {phase === "thinking" && "Lecture du message..."}
              {phase === "typing" && "Rédaction en cours..."}
              {phase === "done" && "Rédigé en 1.2s · ton chaleureux"}
            </span>
            <span className="rounded-md bg-white/5 px-2 py-1 text-zinc-300">⌘ + C pour copier</span>
          </div>
        </div>
      </div>
    </div>
  );
}
