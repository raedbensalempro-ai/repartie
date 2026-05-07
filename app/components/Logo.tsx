// =====================================================
// Stayly · Logo
// Logo réutilisable, premium minimal.
// - carré arrondi (ou cercle pour les avatars de chat)
// - gradient sunset warm (amber → rose)
// - lettre S blanche bold, tracking serré
// - inner ring + top highlight pour la profondeur
// - glow optionnel (rose) — désactivable pour les contextes discrets
// =====================================================

type LogoSize = "xs" | "sm" | "md" | "lg";
type LogoShape = "square" | "circle";

const SIZE_STYLES: Record<LogoSize, { box: string; rounded: string; text: string }> = {
  xs: { box: "h-6 w-6",  rounded: "rounded-md",  text: "text-[13px]" },
  sm: { box: "h-8 w-8",  rounded: "rounded-lg",  text: "text-[15px]" },
  md: { box: "h-9 w-9",  rounded: "rounded-lg",  text: "text-[17px]" },
  lg: { box: "h-10 w-10", rounded: "rounded-xl", text: "text-[19px]" },
};

export function Logo({
  size = "sm",
  shape = "square",
  glow = true,
  className = "",
}: {
  size?: LogoSize;
  shape?: LogoShape;
  glow?: boolean;
  className?: string;
}) {
  const s = SIZE_STYLES[size];
  const shapeClass = shape === "circle" ? "rounded-full" : s.rounded;

  return (
    <span
      className={[
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden",
        s.box,
        shapeClass,
        // Gradient sunset (cohérent avec la DA actuelle)
        "bg-gradient-to-br from-amber-300 via-rose-400 to-rose-600",
        // Anneau intérieur subtil pour la profondeur
        "ring-1 ring-inset ring-white/15",
        // Glow rose optionnel
        glow ? "shadow-lg shadow-rose-500/30" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Highlight chaud en haut — donne le côté "3D premium" */}
      <span className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/25 to-transparent" />
      {/* Lettre S — bold, tracking serré pour un mark net */}
      <span
        className={`relative font-bold leading-none tracking-tighter text-white ${s.text}`}
      >
        S
      </span>
    </span>
  );
}
