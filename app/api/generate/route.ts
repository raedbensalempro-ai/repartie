// =====================================================
// Repartie · POST /api/generate
// Génère 3 répliques de comeback dans le ton choisi, via OpenAI.
// MVP : modèle gpt-4o-mini (low cost), rate limit par COOKIE (1h, 3 essais).
// Pourquoi cookie : Vercel serverless = mémoire éphémère, in-memory ne tient pas.
// Bypassable en incognito → suffisant pour MVP. Upstash Redis quand on aura du trafic.
// =====================================================

import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ---------- RATE LIMIT (cookie-based) ----------
const COOKIE_NAME = "repartie_usage";
const RATE_LIMIT = 3; // 3 générations
const WINDOW_MS = 60 * 60 * 1000; // par heure

type UsageData = { count: number; resetAt: number };

function readUsage(req: NextRequest): UsageData {
  const cookie = req.cookies.get(COOKIE_NAME)?.value;
  if (!cookie) {
    return { count: 0, resetAt: Date.now() + WINDOW_MS };
  }
  try {
    const data = JSON.parse(cookie) as UsageData;
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

// ---------- TONS ----------
type Tone = "cinglant" | "piquant" | "elegant" | "glacant";

const TONE_INSTRUCTIONS: Record<Tone, string> = {
  cinglant: "Ton CINGLANT : direct, dur, qui pique fort. Tu vas droit au but sans détour. Tu touches là où ça fait mal mais sans insulte gratuite — l'intelligence du coup compte plus que la vulgarité.",
  piquant: "Ton PIQUANT : sarcastique, drôle, malin. Tu utilises l'ironie, le second degré, le retournement. Le but est de faire sourire tout en désarmant l'attaquant. Punchline > insulte.",
  elegant: "Ton ÉLÉGANT : classe, posé, désarmant. Tu réponds sans t'énerver, avec une formulation soignée presque littéraire. Le contraste entre la calme et la portée du message désarme l'autre.",
  glacant: "Ton GLAÇANT : court, froid, sans appel. Une ou deux phrases maximum. Pas d'émotion, pas de justification. Tu laisses l'autre face au silence et au vide.",
};

// ---------- PROMPT SYSTÈME ----------
function buildSystemPrompt(tone: Tone): string {
  return `Tu es Repartie, un assistant IA spécialisé dans les répliques cinglantes et les comebacks en français.

Ton job : on te donne un message méchant, condescendant ou attaquant qu'on a envoyé à quelqu'un, et tu génères 3 répliques de comeback différentes pour répondre du tac au tac.

${TONE_INSTRUCTIONS[tone]}

Règles strictes :
- Tu écris EXCLUSIVEMENT en français.
- Tu génères EXACTEMENT 3 répliques, chacune sur 1 à 3 phrases maximum.
- Chaque réplique doit être directement utilisable (copiable-collable dans un texto, DM, mail).
- Pas de préambule, pas d'explication, pas de "voici 3 propositions".
- Pas d'insultes vulgaires gratuites (con, pute, etc.). L'intelligence du coup prime.
- Pas d'attaques personnelles sur l'apparence, l'origine, l'orientation, la santé.
- Pas d'émojis (sauf si vraiment justifié par le ton piquant).
- Les 3 répliques doivent être DIFFÉRENTES dans leur angle d'attaque (pas 3 variantes de la même idée).

Format de sortie obligatoire — un objet JSON valide, RIEN d'autre :
{"replies": ["première réplique", "deuxième réplique", "troisième réplique"]}`;
}

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
      attachUsageCookie(limited, usage);
      return limited;
    }

    // 3. Validation input
    const body = await req.json().catch(() => null);
    const message = String(body?.message ?? "").trim();
    const toneRaw = String(body?.tone ?? "piquant").toLowerCase();
    const validTones: Tone[] = ["cinglant", "piquant", "elegant", "glacant"];
    const tone: Tone = (validTones.includes(toneRaw as Tone) ? toneRaw : "piquant") as Tone;

    if (!message) {
      return NextResponse.json({ error: "Message manquant." }, { status: 400 });
    }
    if (message.length > 500) {
      return NextResponse.json({ error: "Message trop long (max 500 caractères)." }, { status: 400 });
    }

    // 4. Appel OpenAI (mode JSON)
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: buildSystemPrompt(tone) },
        { role: "user", content: message },
      ],
      temperature: 0.9, // un peu plus créatif que Stayly
      max_tokens: 400,
      response_format: { type: "json_object" },
    });

    const raw = completion.choices[0]?.message?.content?.trim() ?? "";
    if (!raw) {
      return NextResponse.json({ error: "Réponse vide. Réessaie." }, { status: 502 });
    }

    // Parse JSON safely
    let replies: string[] = [];
    try {
      const parsed = JSON.parse(raw) as { replies?: unknown };
      if (Array.isArray(parsed.replies)) {
        replies = parsed.replies
          .filter((r): r is string => typeof r === "string")
          .map((r) => r.trim())
          .filter((r) => r.length > 0)
          .slice(0, 3);
      }
    } catch {
      // ignore parse error, replies stays empty
    }

    if (replies.length === 0) {
      return NextResponse.json(
        { error: "Format de réponse invalide. Réessaie." },
        { status: 502 },
      );
    }

    // 5. Incrément compteur + cookie maj
    const updated: UsageData = {
      count: usage.count + 1,
      resetAt: usage.resetAt,
    };
    const response = NextResponse.json({
      replies,
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
