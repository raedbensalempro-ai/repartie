// =====================================================
// Stayly · POST /api/generate
// Génère une réponse Airbnb pro et chaleureuse via OpenAI.
// MVP : modèle gpt-4o-mini (low cost), rate limit en mémoire par IP.
// =====================================================

import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// On force le runtime Node (pas Edge) pour rester compatible avec le SDK OpenAI
export const runtime = "nodejs";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ---------- RATE LIMIT (in-memory, best-effort) ----------
// Fonctionne par instance serverless. Suffisant pour un MVP démo public.
// Pour passer à l'échelle : remplacer par Upstash Redis ou Vercel KV.
const RATE_LIMIT = 3;            // 3 générations
const WINDOW_MS = 60 * 60 * 1000; // par heure
const store = new Map<string, { count: number; resetAt: number }>();

function getClientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "anonymous";
}

function checkRateLimit(ip: string):
  | { ok: true }
  | { ok: false; resetInMin: number } {
  const now = Date.now();
  const entry = store.get(ip);

  // Pas d'entrée ou fenêtre expirée → on (re)démarre
  if (!entry || entry.resetAt < now) {
    store.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { ok: true };
  }

  if (entry.count >= RATE_LIMIT) {
    return {
      ok: false,
      resetInMin: Math.max(1, Math.ceil((entry.resetAt - now) / 60_000)),
    };
  }

  entry.count++;
  return { ok: true };
}

// ---------- PROMPT SYSTÈME ----------
const SYSTEM_PROMPT = `Tu es Stayly, un assistant IA qui aide les hôtes Airbnb à répondre à leurs voyageurs.

Ton objectif : générer une réponse professionnelle, chaleureuse et personnalisée au message reçu d'un voyageur.

Règles strictes :
- Réponds DANS LA MÊME LANGUE que le message reçu.
- Ton chaleureux, professionnel, sincère. Évite la rigidité et les phrases trop génériques.
- Concis : 3 à 6 phrases maximum.
- Si le voyageur pose des questions précises (parking, check-in, équipements, restaurants…), réponds-y de manière plausible et utile, sans inventer de détails très spécifiques (pas de noms de rues précis ni de numéros de téléphone).
- Pas de signature à la fin — l'hôte la complétera lui-même.
- Termine par une formule chaleureuse type "À très vite !", "Au plaisir de vous accueillir !", "Bon voyage !".
- Pas d'emojis, sauf si le voyageur en utilise.
- Pas de listes à puces : style conversationnel naturel et fluide.

Tu génères UNIQUEMENT le contenu de la réponse, sans préambule du type "Voici une réponse :".`;

// ---------- HANDLER ----------
export async function POST(req: NextRequest) {
  try {
    // 1. Garde-fou : clé API présente ?
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "Service indisponible (clé API manquante côté serveur)." },
        { status: 500 },
      );
    }

    // 2. Rate limit par IP
    const ip = getClientIp(req);
    const rl = checkRateLimit(ip);
    if (!rl.ok) {
      return NextResponse.json(
        {
          error: `Limite gratuite atteinte (3 essais / heure). Reviens dans ${rl.resetInMin} minute${rl.resetInMin > 1 ? "s" : ""}.`,
        },
        { status: 429 },
      );
    }

    // 3. Validation input
    const body = await req.json().catch(() => null);
    const message = String(body?.message ?? "").trim();

    if (!message) {
      return NextResponse.json(
        { error: "Message manquant." },
        { status: 400 },
      );
    }
    if (message.length > 2000) {
      return NextResponse.json(
        { error: "Message trop long (max 2000 caractères)." },
        { status: 400 },
      );
    }

    // 4. Appel OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: message },
      ],
      temperature: 0.7,
      max_tokens: 350,
    });

    const reply = completion.choices[0]?.message?.content?.trim() ?? "";
    if (!reply) {
      return NextResponse.json(
        { error: "Réponse vide. Réessaie." },
        { status: 502 },
      );
    }

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("[/api/generate] error:", err);
    return NextResponse.json(
      { error: "Erreur serveur. Réessaie dans un instant." },
      { status: 500 },
    );
  }
}
