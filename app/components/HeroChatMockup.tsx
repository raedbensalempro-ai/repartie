"use client";

// =====================================================
// Mockup chat du hero · version light Airbnb-warm
// Boucle : thinking (1.8s) → typing → pause (10s) → reset
// =====================================================

import { useEffect, useState } from "react";
import { Logo } from "./Logo";

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
        setPhase("thinking");
        setTyped("");
        await sleep(1800);
        if (cancelled) return;

        setPhase("typing");
        for (let i = 0; i <= FULL_RESPONSE.length; i++) {
          if (cancelled) return;
          setTyped(FULL_RESPONSE.slice(0, i));
          await sleep(15 + Math.random() * 20);
        }

        setPhase("done");
        await sleep(10000);
      }
    };

    loop();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="relative mx-auto max-w-3xl px-6 pb-24">
      {/* Glow sunset doux derrière la carte */}
      <div className="absolute inset-x-0 -inset-y-8 -z-10 mx-auto max-w-2xl rounded-[3rem] bg-gradient-to-r from-amber-200/60 via-rose-200/70 to-pink-200/60 blur-2xl" />

      {/* Carte chat — fond blanc, ombre douce */}
      <div className="relative rounded-2xl bg-white shadow-[0_20px_60px_-15px_rgba(251,113,133,0.25)] ring-1 ring-zinc-200/80 animate-float-slow">
        {/* Title bar */}
        <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-3">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-zinc-200" />
              <span className="h-2.5 w-2.5 rounded-full bg-zinc-200" />
              <span className="h-2.5 w-2.5 rounded-full bg-zinc-200" />
            </div>
            <span className="ml-2 text-xs text-zinc-500">
              Marc · Check-in demain à 22h
            </span>
          </div>
          <span className="text-xs text-zinc-400">en direct</span>
        </div>

        {/* Conversation */}
        <div className="space-y-4 p-6 min-h-[280px]">
          {/* Message du voyageur */}
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-zinc-100 to-zinc-200 text-xs font-medium text-zinc-700">
              M
            </div>
            <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-zinc-100 px-4 py-2.5 text-sm text-zinc-800">
              Bonjour, on arrive demain à 22h, c&apos;est possible de check-in tard ? Et il y a un parking gratuit ?
            </div>
          </div>

          {/* Indicator pendant la phase thinking */}
          {phase === "thinking" && (
            <div className="flex items-center gap-2 pl-11 text-xs text-zinc-500">
              <span className="flex h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
              Stayly rédige une réponse...
            </div>
          )}

          {/* Réponse IA — gradient sunset */}
          {(phase === "typing" || phase === "done") && (
            <div className="flex items-start justify-end gap-3">
              <div className="relative max-w-[85%] rounded-2xl rounded-tr-sm bg-gradient-to-br from-orange-400 via-rose-500 to-rose-600 px-4 py-2.5 text-sm text-white shadow-md shadow-rose-500/20">
                {typed}
                {phase === "typing" && (
                  <span className="ml-0.5 inline-block h-3.5 w-[2px] -mb-0.5 align-middle bg-white animate-blink" />
                )}
              </div>
              <Logo size="sm" shape="circle" />
            </div>
          )}
        </div>

        {/* Footer du mockup */}
        <div className="flex items-center justify-between border-t border-zinc-100 px-5 py-3 text-xs text-zinc-500">
          <span>
            {phase === "thinking" && "Lecture du message..."}
            {phase === "typing" && "Rédaction en cours..."}
            {phase === "done" && "Rédigé en 1.2s · ton chaleureux"}
          </span>
          <span className="rounded-md bg-zinc-100 px-2 py-1 text-zinc-700">⌘ + C pour copier</span>
        </div>
      </div>
    </div>
  );
}
