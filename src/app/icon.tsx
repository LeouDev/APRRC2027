import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #fbbf24 0%, #e11d48 60%, #2563eb 100%)",
          color: "white",
          fontSize: 16,
          fontWeight: 900,
          fontFamily: "sans-serif",
        }}
      >
        AP
      </div>
    ),
    { ...size }
  );
}
