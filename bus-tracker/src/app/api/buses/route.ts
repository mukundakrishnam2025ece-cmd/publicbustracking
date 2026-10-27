import { NextResponse } from "next/server";
import { buses } from "@/lib/mock-data";
import { db } from "@/lib/db";

export async function GET() {
  try {
    if (process.env.DATABASE_URL) {
      const dbBuses = await db.bus.findMany({
        include: { route: true },
      });
      if (dbBuses && dbBuses.length > 0) {
        return NextResponse.json(dbBuses);
      }
    }
  } catch (error) {
    console.warn("DB query fallback to mock buses:", error);
  }

  return NextResponse.json(buses);
}
