import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  try {
    // lightweight DB check
    await query("SELECT 1");
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
