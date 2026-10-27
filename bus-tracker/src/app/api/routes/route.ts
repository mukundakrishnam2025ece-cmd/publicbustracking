import { NextResponse } from "next/server";
import { routes } from "@/lib/mock-data";
import { db } from "@/lib/db";

export async function GET() {
  try {
    if (process.env.DATABASE_URL) {
      const dbRoutes = await db.route.findMany({
        include: {
          stops: {
            include: { stop: true },
            orderBy: { sequence: "asc" },
          },
          buses: true,
        },
      });
      if (dbRoutes && dbRoutes.length > 0) {
        return NextResponse.json(dbRoutes);
      }
    }
  } catch (error) {
    console.warn("DB query fallback to mock routes:", error);
  }

  return NextResponse.json(routes);
}
