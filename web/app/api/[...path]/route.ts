import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

// Внутренний адрес бэкенда для серверного прокси (в Docker — http://server:3001).
// Если не задан, падаем на публичный NEXT_PUBLIC_API_URL (как в локальной разработке).
const API_URL = process.env.API_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL!;
const API_KEY = process.env.API_KEY!;
const ALLOWED_ORIGIN = process.env.NEXT_PUBLIC_APP_URL!;

// Middleware to verify the request is coming from our frontend
function isValidRequest(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");

  // In development, allow requests without origin (like from Postman)
  if (process.env.NODE_ENV === "development") {
    return true;
  }

  // Verify the request is coming from our frontend
  if (
    (!origin || origin !== ALLOWED_ORIGIN) &&
    (!referer || !referer.startsWith(ALLOWED_ORIGIN))
  ) {
    return false;
  }

  return true;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;

  if (!isValidRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  return handleRequest(request, path);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;

  if (!isValidRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  return handleRequest(request, path);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;

  if (!isValidRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  return handleRequest(request, path);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;

  if (!isValidRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  return handleRequest(request, path);
}


async function handleRequest(request: NextRequest, path: string[]) {
  if (!API_KEY) {
    return NextResponse.json(
      { error: "API key not configured" },
      { status: 500 }
    );
  }

  try {
    const targetUrl = `${API_URL}/${path.join("/")}`;
    const body = request.body ? await request.json() : undefined;

    const response = await axios({
      method: request.method,
      url: targetUrl,
      data: body,
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": API_KEY,
        host: new URL(API_URL).host,
      },
      validateStatus: () => true,
    });

    const headers = new Headers();

    // Forward rate limit headers
    const rateLimitHeaders = [
      "X-RateLimit-Limit",
      "X-RateLimit-Remaining",
      "X-RateLimit-Reset",
    ];

    rateLimitHeaders.forEach((header) => {
      const value = response.headers[header.toLowerCase()];
      if (value) {
        headers.set(header, value.toString());
      }
    });

    return NextResponse.json(response.data, {
      status: response.status,
      headers,
    });
  } catch (error) {
    console.error("API proxy error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
