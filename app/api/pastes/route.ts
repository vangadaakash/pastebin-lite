import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { content, ttl_seconds, max_views } = body;

    // 1️⃣ Validate content
    if (!content || typeof content !== "string" || content.trim() === "") {
      return NextResponse.json(
        { error: "content is required and must be a non-empty string" },
        { status: 400 }
      );
    }

    // 2️⃣ Validate ttl_seconds
    if (
      ttl_seconds !== undefined &&
      (!Number.isInteger(ttl_seconds) || ttl_seconds < 1)
    ) {
      return NextResponse.json(
        { error: "ttl_seconds must be an integer >= 1" },
        { status: 400 }
      );
    }

    // 3️⃣ Validate max_views
    if (
      max_views !== undefined &&
      (!Number.isInteger(max_views) || max_views < 1)
    ) {
      return NextResponse.json(
        { error: "max_views must be an integer >= 1" },
        { status: 400 }
      );
    }

    // 4️⃣ Generate ID
    const id = uuidv4();

    // 5️⃣ Calculate expires_at
    let expiresAt: Date | null = null;
    if (ttl_seconds) {
      expiresAt = new Date(Date.now() + ttl_seconds * 1000);
    }

    // 6️⃣ Insert into DB
    await query(
      `
      INSERT INTO pastes (id, content, expires_at, max_views)
      VALUES ($1, $2, $3, $4)
      `,
      [id, content, expiresAt, max_views ?? null]
    );

    // 7️⃣ Build URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    return NextResponse.json(
      {
        id,
        url: `${baseUrl}/p/${id}`,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid JSON or server error" },
      { status: 400 }
    );
  }
}
