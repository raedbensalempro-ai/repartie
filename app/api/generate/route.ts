// =====================================================
// Repartie · POST /api/generate
// Génère 3 répliques de comeback dans le ton choisi, via OpenAI.
// Lazy init de OpenAI pour que le build passe même sans OPENAI_API_KEY.
// =====================================================

import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";

// Lazy init pour que le build passe même sans OPENAI_API_KEY défini.
let _openai: OpenAI | null = null;
function getOpenAI(): OpenAI {
  if (!_openai) {
    _openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return _openai;
}

// Rate limit cookie-based
const COOKIE_NAME = "repartie_usage";
const RATE_LIMIT = 3;
const WINDOW_MS = 60 * 60 * 1000;

type UsageData = { count: number; resetAt: number };

function readUsage(req: NextRequest): UsageData {
  const cookie = req.cookies.get(COOKIE_NAME)?.value;
  if (!cookie) return { count: 0, resetAt: Date.now() + WINDOW_MS };
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

type Tone = "cinglant" | "piquant" | "elegant" | "glacant";

const TONE_INSTRUCTIONS: Record<Tone, string> = {
  cinglant: "Ton CINGLANT : direct, dur, qui pique fort. Sans insulte gratuite, l'intelligence du coup prime.",
  piquant: "Ton PIQUANT : sarcastique, drôle, malin. Ironie, second degré, retournement. Punchline > insulte.",
  elegant: "Ton ÉLÉGANT : classe, posé, désarmant. Formulation soignée, presque littéraire.",
  glacant: "Ton GLAÇANT : court, froid, sans appel. Une ou deux phrases max, sans émotion ni justification.",
};

function buildSystemPrompt(tone: Tone): string {
  return `Tu es Repartie, un assistant IA spécialisé dans les comebacks en français.

On te donne un message méchant ou attaquant. Tu génères 3 répliques différentes pour répondre du tac au tac.

${TONE_INSTRUCTIONS[tone]}

Règles :
- Réponse EXCLUSIVEMENT en français.
- EXACTEMENT 3 répliques, 1 à 3 phrases chacune.
- Pas de préambule, pas d'explication.
- Pas d'insultes vulgaires (con, pute…). Pas d'attaques sur apparence/origine/santé.
- Les 3 répliques doivent être DIFFÉRENTES dans leur angle.

Format de sortie obligatoire (JSON valide, rien d'autre) :
{"replies": ["réplique 1", "réplique 2", "réplique 3"]}`;
}

export async function POST(req: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "Service indisponible (clé API manquante côté serveur)." },
        { status: 500 },
      );
    }

    const usage = readUsage(req);
    if (usage.count >= RATE_LIMIT) {
      const resetInMin = Math.max(1, Math.ceil((usage.resetAt - Date.now()) / 60_000));
      const limited = NextResponse.json(
        { error: `Limite gratuite atteinte (${RATE_LIMIT} essais / heure). Reviens dans ${resetInMin} minute${resetInMin > 1 ? "s" : ""}.` },
        { status: 429 },
      );
      attachUsageCookie(limited, usage);
      return limited;
    }

    const body = await req.json().catch(() => null);
    const message = String(body?.message ?? "").trim();
    const toneRaw = String(body?.tone ?? "piquant").toLowerCase();
    const validTones: Tone[] = ["cinglant", "piquant", "elegant", "glacant"];
    const tone: Tone = (validTones.includes(toneRaw as Tone) ? toneRaw : "piquant") as Tone;

    if (!message) return NextResponse.json({ error: "Message manquant." }, { status: 400 });
    if (message.length > 500) return NextResponse.json({ error: "Message trop long (max 500 caractères)." }, { status: 400 });

    const completion = await getOpenAI().chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: buildSystemPrompt(tone) },
        { role: "user", content: message },
      ],
      temperature: 0.9,
      max_tokens: 400,
      response_format: { type: "json_object" },
    });

    const raw = completion.choices[0]?.message?.content?.trim() ?? "";
    if (!raw) return NextResponse.json({ error: "Réponse vide. Réessaie." }, { status: 502 });

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
    } catch {}

    if (replies.length === 0) {
      return NextResponse.json({ error: "Format de réponse invalide. Réessaie." }, { status: 502 });
    }

    const updated: UsageData = { count: usage.count + 1, resetAt: usage.resetAt };
    const response = NextResponse.json({ replies, usage: { used: updated.count, limit: RATE_LIMIT } });
    attachUsageCookie(response, updated);
    return response;
  } catch (err) {
    console.error("[/api/generate] error:", err);
    return NextResponse.json({ error: "Erreur serveur. Réessaie dans un instant." }, { status: 500 });
  }
}
