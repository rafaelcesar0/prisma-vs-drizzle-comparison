// app/opengraph-image.tsx
import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Ultrablue - Drizzle vs Prisma (🐋)";

const TWEMOJI_VERSION = "14.0.2";
const emojiCache = new Map<string, Promise<string>>();

function emojiToCodePoint(emoji: string) {
  return Array.from(emoji)
    .map((c) => c.codePointAt(0)!.toString(16))
    .join("-");
}

async function twemojiDataUrl(emoji: string) {
  if (!emojiCache.has(emoji)) {
    emojiCache.set(
      emoji,
      (async () => {
        const code = emojiToCodePoint(emoji);
        const url = `https://cdnjs.cloudflare.com/ajax/libs/twemoji/${TWEMOJI_VERSION}/svg/${code}.svg`;
        const res = await fetch(url);

        if (!res.ok) {
          throw new Error(`Twemoji request failed (${res.status})`);
        }

        const svg = await res.text();
        return `data:image/svg+xml,${encodeURIComponent(svg)}`;
      })()
    );
  }

  return emojiCache.get(emoji)!;
}

export default async function OpenGraphImage() {
  let whale: string | null = null;

  try {
    whale = await twemojiDataUrl("🐋");
  } catch {
    whale = null;
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0b1220",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          {whale ? (
            <img src={whale} width={220} height={220} alt="whale" />
          ) : (
            <div style={{ fontSize: 180, lineHeight: 1 }}>🐋</div>
          )}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 64, fontWeight: 800, color: "white" }}>
              Drizzle vs Prisma
            </div>
            <div style={{ fontSize: 34, color: "rgba(255,255,255,0.85)" }}>
              Compare ORMs
            </div>
          </div>
        </div>
      </div>
    ),
    size
  );
}
