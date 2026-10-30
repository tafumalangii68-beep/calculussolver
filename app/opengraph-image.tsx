import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site-config";

export const alt = `${siteConfig.name}: ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#faf9f7", padding: 80, fontFamily: "serif" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div style={{ width: 96, height: 96, borderRadius: 22, background: "#1f1e1c", color: "#faf9f7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 64, fontStyle: "italic" }}>∫</div>
          <div style={{ fontSize: 64, color: "#1f1e1c", fontWeight: 600 }}>{siteConfig.name}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 48, color: "#1f1e1c" }}>Step-by-step derivatives, integrals and limits</div>
          <div style={{ fontSize: 30, color: "#625d56" }}>Free · Runs in your browser · Every answer checked</div>
        </div>
        <div style={{ height: 8, width: 160, background: "#2f6b66", borderRadius: 4 }} />
      </div>
    ),
    size,
  );
}
