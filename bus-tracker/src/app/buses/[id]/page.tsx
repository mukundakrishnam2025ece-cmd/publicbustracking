"use client";

import { use } from "react";
import Link from "next/link";
import { buses, routes, getRouteStops } from "@/lib/mock-data";

export default function BusDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const bus = buses.find((b) => b.id === resolvedParams.id) || buses[0];
  const route = routes.find((r) => r.id === bus.routeId);
  const stops = getRouteStops(bus.routeId);

  return (
    <main className="space-y-6">
      {/* Bus Header */}
      <div className="glass-panel p-6 rounded-3xl space-y-4 border border-slate-800">
        <div className="flex items-center justify-between">
          <Link href="/buses" className="text-xs font-bold text-slate-400 hover:text-slate-200">
            ← Back to Fleet List
          </Link>
          <span className="bg-emerald-500/20 text-emerald-400 text-xs font-extrabold px-3 py-1 rounded-full border border-emerald-500/30">
            ● Active Vehicle
          </span>
        </div>

        <div>
          <h1 className="text-3xl font-black text-slate-100">{bus.busNumber}</h1>
          <p className="text-sm text-slate-400 mt-1">
            Vehicle Registration: {bus.registrationNumber || "TN-34-N-1842"}
          </p>
        </div>

        <div className="pt-2 flex flex-wrap gap-3">
          <Link
            href="/map"
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-extrabold rounded-xl shadow-lg shadow-blue-500/20 transition"
          >
            🗺️ Track Live on Map
          </Link>
        </div>
      </div>

      {/* Telemetry Card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
          <div className="text-xs font-semibold text-slate-400">Target Route</div>
          <div className="text-lg font-bold text-blue-400">{route?.number}</div>
          <div className="text-xs text-slate-500">{route?.name}</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
          <div className="text-xs font-semibold text-slate-400">Current Speed</div>
          <div className="text-lg font-bold text-emerald-400">{bus.speedKmh} km/h</div>
          <div className="text-xs text-slate-500 font-semibold">Normal City Pace</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
          <div className="text-xs font-semibold text-slate-400">Route Waypoints</div>
          <div className="text-lg font-bold text-cyan-400">{stops.length} Stops</div>
          <div className="text-xs text-slate-500">{route?.origin} → {route?.destination}</div>
        </div>
      </div>
    </main>
  );
}
