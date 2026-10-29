import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const markBuffer = await readFile(join(process.cwd(), "src/app/icon.png"));
  const markDataUrl = `data:image/png;base64,${markBuffer.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundImage: "linear-gradient(135deg, #4c86ff 0%, #1f5eff 55%, #1440b8 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- next/og's ImageResponse renders via Satori, not the DOM; next/image doesn't apply here */}
        <img
          src={markDataUrl}
          width={120}
          height={120}
          alt=""
          style={{ borderRadius: "9999px" }}
        />
        <div style={{ marginTop: 36, fontSize: 64, fontWeight: 800, letterSpacing: "-0.02em" }}>
          Markidly
        </div>
        <div style={{ marginTop: 16, fontSize: 32, color: "rgba(255,255,255,0.85)" }}>
          Amazon Account Management &amp; Growth Partner
        </div>
      </div>
    ),
    { ...size }
  );
}
