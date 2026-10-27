import { NextResponse } from "next/server";
import { buses, getRouteStops } from "@/lib/mock-data";
import { getSimulatedPosition } from "@/lib/gps-simulator";
import { db } from "@/lib/db";

// Store in-memory driver location updates for live driver broadcasting
const liveDriverLocations = new Map<string, { lat: number; lng: number; speedKmh: number; headingDeg: number; updatedAt: number }>();

export async function GET() {
  const activeBusesPositions = buses.map((bus) => {
    // Check if live driver broadcast exists
    const driverFix = liveDriverLocations.get(bus.id);
    if (driverFix && Date.now() - driverFix.updatedAt < 60000) {
      return {
        busId: bus.id,
        busNumber: bus.busNumber,
        routeId: bus.routeId,
        lat: driverFix.lat,
        lng: driverFix.lng,
        speedKmh: driverFix.speedKmh,
        headingDeg: driverFix.headingDeg,
        isLiveDriver: true,
        recordedAt: new Date(driverFix.updatedAt).toISOString(),
      };
    }

    // Fall back to simulation
    const stops = getRouteStops(bus.routeId);
    const elapsedSeconds = (Date.now() / 1000) % 3600;
    const pos = getSimulatedPosition(stops, elapsedSeconds, bus.speedKmh);

    return {
      busId: bus.id,
      busNumber: bus.busNumber,
      routeId: bus.routeId,
      lat: pos.lat,
      lng: pos.lng,
      speedKmh: pos.speedKmh,
      headingDeg: pos.headingDeg,
      nextStopName: pos.nextStop?.name ?? null,
      etaToNextStopMin: pos.etaToNextStopMin,
      isLiveDriver: false,
      recordedAt: new Date().toISOString(),
    };
  });

  return NextResponse.json(activeBusesPositions);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { busId, latitude, longitude, speedKmh, headingDeg } = body;

    if (!busId || latitude === undefined || longitude === undefined) {
      return NextResponse.json({ error: "Missing busId or coordinates" }, { status: 400 });
    }

    liveDriverLocations.set(busId, {
      lat: latitude,
      lng: longitude,
      speedKmh: speedKmh ?? 30,
      headingDeg: headingDeg ?? 0,
      updatedAt: Date.now(),
    });

    // Optionally record to PostgreSQL if available
    if (process.env.DATABASE_URL) {
      try {
        await db.busLocation.create({
          data: {
            busId,
            tripId: "demo-trip",
            latitude,
            longitude,
            speed: speedKmh ?? 30,
            heading: headingDeg ?? 0,
            recordedAt: new Date(),
          },
        });
      } catch (e) {
        console.warn("DB save skipped:", e);
      }
    }

    return NextResponse.json({ success: true, busId, timestamp: new Date().toISOString() });
  } catch (error) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 500 });
  }
}
