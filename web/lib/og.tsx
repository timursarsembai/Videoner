import { ImageResponse } from "next/og";

export const ogImageSize = { width: 1200, height: 630 };
export const ogImageContentType = "image/png";

export function renderOgImage(subtitle: string) {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #524DBE 0%, #1A1730 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 84,
            fontWeight: 700,
            color: "#ffffff",
            letterSpacing: -2,
          }}
        >
          Videoner
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 38,
            marginTop: 28,
            color: "#D9D6FF",
          }}
        >
          {subtitle}
        </div>
      </div>
    ),
    { ...ogImageSize }
  );
}
