import { ImageResponse } from "next/og";
import { EVENT } from "@/lib/event-config";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background:
            "radial-gradient(circle at 15% 15%, rgba(244,63,94,0.35), transparent 45%), radial-gradient(circle at 85% 10%, rgba(37,99,235,0.35), transparent 45%), #ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 30,
            fontWeight: 700,
            color: "#e11d48",
            textTransform: "uppercase",
            letterSpacing: 4,
          }}
        >
          {EVENT.city}, {EVENT.country}
        </div>
        <div style={{ display: "flex", fontSize: 120, fontWeight: 900, lineHeight: 1, marginTop: 24 }}>
          <span style={{ color: "#2563eb" }}>APRRC&nbsp;</span>
          <span style={{ color: "#c0392b" }}>&apos;27</span>
        </div>
        <div style={{ display: "flex", fontSize: 44, fontWeight: 800, color: "#0f172a", marginTop: 8 }}>
          Cebu, Philippines
        </div>
        <div style={{ display: "flex", fontSize: 32, color: "#475569", marginTop: 28 }}>
          {EVENT.dateLabel} &middot; {EVENT.venue}
        </div>
      </div>
    ),
    { ...size }
  );
}
