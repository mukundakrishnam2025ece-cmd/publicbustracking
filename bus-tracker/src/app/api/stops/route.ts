import { NextResponse } from "next/server";
import { stops } from "@/lib/mock-data";
import { db } from "@/lib/db";

export async function GET() {
  try {
    if (process.env.DATABASE_URL) {
      const dbStops = await db.busStop.findMany();
      if (dbStops && dbStops.length > 0) {
        return NextResponse.json(dbStops);
      }
    }
  } catch (error) {
    console.warn("DB query fallback to mock stops:", error);
  }

  return NextResponse.json(stops);
}
