// =====================================================
// Stayly · POST /api/generate
// Génère une réponse Airbnb pro et chaleureuse via OpenAI.
// MVP : modèle gpt-4o-mini (low cost), rate limit par COOKIE (1h, 3 essais).
// Pourquoi cookie : Vercel serverless = mémoire éphémère, in-memory ne tient pas.
// Bypassable en incognito → suffisant pour MVP. Upstash Redis quand on aura du trafic.
// =====================================================

import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ---------- RATE LIMIT (cookie-based) ----------
const COOKIE_NAME = "stayly_usage";
const RATE_LIMIT = 3;                  // 3 générations
const WINDOW_MS = 60 * 60 * 1000;      // par heure

type UsageData = { count: number; resetAt: number };

function readUsage(req: NextRequest): UsageData {
  const cookie = req.cookies.get(COOKIE_NAME)?.value;
  if (!cookie) {
    return { count: 0, resetAt: Date.now() + WINDOW_MS };
  }
  try {
    const data = JSON.parse(cookie) as UsageData;
    // Fenêtre expirée → reset (nouveau cycle d'1h)
    if (typeof data.resetAt !== "number" || data.resetAt < Date.now()) {
      return { count: 0, resetAt: Date.now() + WINDOW_MS };
    }
    return { count: typeof data.count === "number" ? data.count : 0, resetAt: data.resetAt };
  } catch {
    return { count: 0, resetAt: Date.now() + WINDOW_MS };
  }
}

function attachUsageCookie(response: NextResponse, data: UsageData) {
  const remainingMs = Math.max(60_000, data.resetAt - Date.now());
  response.cookies.set(COOKIE_NAME, JSON.stringify(data), {
    maxAge: Math.ceil(remainingMs / 1000),
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
  });
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

    // 2. Rate limit par cookie
    const usage = readUsage(req);
    if (usage.count >= RATE_LIMIT) {
      const resetInMin = Math.max(1, Math.ceil((usage.resetAt - Date.now()) / 60_000));
      const limited = NextResponse.json(
        {
          error: `Limite gratuite atteinte (${RATE_LIMIT} essais / heure). Reviens dans ${resetInMin} minute${resetInMin > 1 ? "s" : ""}.`,
        },
        { status: 429 },
      );
      // On ré-attache le cookie pour rafraîchir son TTL
      attachUsageCookie(limited, usage);
      return limited;
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

    // 5. Incrément du compteur + cookie mis à jour
    const updated: UsageData = {
      count: usage.count + 1,
      resetAt: usage.resetAt, // on garde la fin de fenêtre actuelle
    };
    const response = NextResponse.json({
      reply,
      usage: { used: updated.count, limit: RATE_LIMIT },
    });
    attachUsageCookie(response, updated);
    return response;
  } catch (err) {
    console.error("[/api/generate] error:", err);
    return NextResponse.json(
      { error: "Erreur serveur. Réessaie dans un instant." },
      { status: 500 },
    );
  }
}
