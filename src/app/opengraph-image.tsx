// app/opengraph-image.tsx
import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

function emojiToCodePoint(emoji: string) {
  return Array.from(emoji)
    .map((c) => c.codePointAt(0)!.toString(16))
    .join("-");
}

async function twemojiDataUrl(emoji: string) {
  const code = emojiToCodePoint(emoji);
  const url = `https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/${code}.svg`;
  const svg = await fetch(url).then((r) => r.text());
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export default async function OpenGraphImage() {
  const whale = await twemojiDataUrl("🐋");

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
          <img src={whale} width={220} height={220} alt="whale" />
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
