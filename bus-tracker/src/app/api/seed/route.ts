import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { routes, stops, buses } from "@/lib/mock-data";

export async function GET() {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({
        success: false,
        message: "DATABASE_URL environment variable is missing. Running in mock fallback mode.",
      });
    }

    // Reset transient seed tables to avoid constraint conflicts
    await db.routeStop.deleteMany();
    await db.bus.deleteMany();
    await db.route.deleteMany();
    await db.busStop.deleteMany();

    // Seed Stops
    for (const s of stops) {
      await db.busStop.upsert({
        where: { id: s.id },
        update: { name: s.name, latitude: s.lat, longitude: s.lng, description: s.description },
        create: { id: s.id, name: s.name, latitude: s.lat, longitude: s.lng, description: s.description },
      });
    }

    // Seed Routes & RouteStops
    for (const r of routes) {
      await db.route.upsert({
        where: { number: r.number },
        update: {
          name: r.name,
          origin: r.origin,
          destination: r.destination,
          distanceKm: r.distanceKm,
          averageTimeMin: r.averageTimeMin,
          fareRs: r.fareRs,
          operatingHours: r.operatingHours,
          frequency: r.frequency,
        },
        create: {
          id: r.id,
          number: r.number,
          name: r.name,
          origin: r.origin,
          destination: r.destination,
          distanceKm: r.distanceKm,
          averageTimeMin: r.averageTimeMin,
          fareRs: r.fareRs,
          operatingHours: r.operatingHours,
          frequency: r.frequency,
        },
      });

      // Insert stop associations
      for (let seq = 0; seq < r.stopIds.length; seq++) {
        const stopId = r.stopIds[seq];
        await db.routeStop.upsert({
          where: { routeId_stopId: { routeId: r.id, stopId } },
          update: { sequence: seq + 1 },
          create: { routeId: r.id, stopId, sequence: seq + 1 },
        });
      }
    }

    // Seed Buses
    for (const b of buses) {
      await db.bus.upsert({
        where: { id: b.id },
        update: { busNumber: b.busNumber, registrationNumber: b.registrationNumber, routeId: b.routeId, status: "ACTIVE" },
        create: { id: b.id, busNumber: b.busNumber, registrationNumber: b.registrationNumber, routeId: b.routeId, status: "ACTIVE" },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Database successfully seeded with routes, stops, and buses!",
    });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, error: errMessage }, { status: 500 });
  }
}
