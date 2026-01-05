import { NextResponse } from "next/server";
import { query } from "@/lib/db";

function getCurrentTimeMs(request: Request): number {
  if (process.env.TEST_MODE === "1") {
    const header = request.headers.get("x-test-now-ms");
    if (header) {
      const parsed = Number(header);
      if (!isNaN(parsed)) {
        return parsed;
      }
    }
  }
  return Date.now();
}

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params; // ✅ FIX HERE

  try {
    // 1️⃣ Fetch paste
    const result = await query(
      `
      SELECT id, content, expires_at, max_views, view_count
      FROM pastes
      WHERE id = $1
      `,
      [id]
    );

    if (result.rowCount === 0) {
      return NextResponse.json(
        { error: "Paste not found" },
        { status: 404 }
      );
    }

    const paste = result.rows[0];
    const nowMs = getCurrentTimeMs(request);

    // 2️⃣ Check TTL expiry
    if (paste.expires_at) {
      const expiresAtMs = new Date(paste.expires_at).getTime();
      if (nowMs >= expiresAtMs) {
        return NextResponse.json(
          { error: "Paste expired" },
          { status: 404 }
        );
      }
    }

    // 3️⃣ Check view limit
    if (paste.max_views !== null) {
      if (paste.view_count >= paste.max_views) {
        return NextResponse.json(
          { error: "View limit exceeded" },
          { status: 404 }
        );
      }
    }

    // 4️⃣ Increment view count
    await query(
      `
      UPDATE pastes
      SET view_count = view_count + 1
      WHERE id = $1
      `,
      [id]
    );

    // 5️⃣ Calculate remaining views
    let remainingViews: number | null = null;
    if (paste.max_views !== null) {
      remainingViews = paste.max_views - (paste.view_count + 1);
      if (remainingViews < 0) remainingViews = 0;
    }

    return NextResponse.json(
      {
        content: paste.content,
        remaining_views: remainingViews,
        expires_at: paste.expires_at,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
