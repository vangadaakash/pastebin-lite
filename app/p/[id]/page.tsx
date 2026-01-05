import { notFound } from "next/navigation";
import { query } from "@/lib/db";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PastePage({ params }: PageProps) {
  const { id } = await params;

  const result = await query(
    `
    SELECT content, expires_at, max_views, view_count
    FROM pastes
    WHERE id = $1
    `,
    [id]
  );

  if (result.rowCount === 0) {
    notFound();
  }

  const paste = result.rows[0];
  const now = Date.now();

  // TTL check
  if (paste.expires_at) {
    if (now >= new Date(paste.expires_at).getTime()) {
      notFound();
    }
  }

  // View limit check
  if (paste.max_views !== null && paste.view_count >= paste.max_views) {
    notFound();
  }

  // Increment view count
  await query(
    `UPDATE pastes SET view_count = view_count + 1 WHERE id = $1`,
    [id]
  );

  return (
    <main style={{ padding: "2rem", fontFamily: "monospace" }}>
      <h1>Paste</h1>
      <pre
        style={{
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          background: "#f5f5f5",
          padding: "1rem",
          borderRadius: "6px",
        }}
      >
        {paste.content}
      </pre>
    </main>
  );
}
