import { ImageResponse } from "next/og";

interface RouteParams {
  params: Promise<{ size: string }>;
}

const VALID_SIZES = new Set(["192", "512"]);

export async function GET(_request: Request, { params }: RouteParams) {
  const { size: sizeParam } = await params;
  const dimension = VALID_SIZES.has(sizeParam) ? Number(sizeParam) : 192;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#F2622E",
          color: "#FFFFFF",
          fontSize: dimension * 0.55,
          fontWeight: 700,
          fontFamily: "sans-serif",
        }}
      >
        S
      </div>
    ),
    { width: dimension, height: dimension },
  );
}
