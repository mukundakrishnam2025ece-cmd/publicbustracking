"use client";

import { use } from "react";
import Link from "next/link";
import { stops, routes, buses } from "@/lib/mock-data";

export default function StopDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const stop = stops.find((s) => s.id === resolvedParams.id) || stops[0];
  const servingRoutes = routes.filter((r) => r.stopIds.includes(stop.id));
  const activeBusesOnStop = buses.filter((b) => servingRoutes.some((r) => r.id === b.routeId));

  return (
    <main className="space-y-6">
      {/* Stop Header */}
      <div className="glass-panel p-6 rounded-3xl space-y-4 border border-slate-800">
        <div className="flex items-center justify-between">
          <Link href="/stops" className="text-xs font-bold text-slate-400 hover:text-slate-200">
            ← Back to Bus Stops
          </Link>
          <span className="bg-cyan-500/20 text-cyan-400 text-xs font-extrabold px-3 py-1 rounded-full border border-cyan-500/30">
            Bus Stop
          </span>
        </div>

        <div>
          <h1 className="text-3xl font-black text-slate-100">{stop.name}</h1>
          <p className="text-sm text-slate-400 mt-1">{stop.description || "Active passenger terminal"}</p>
        </div>

        <div className="text-xs text-slate-500 font-mono">
          Coordinates: {stop.lat}, {stop.lng}
        </div>
      </div>

      {/* Upcoming Arrivals timetable forecast */}
      <div className="glass-panel p-6 rounded-3xl space-y-4 border border-slate-800">
        <h2 className="text-sm font-extrabold text-slate-200 uppercase tracking-wider">
          Predicted Bus Arrivals
        </h2>

        <div className="space-y-3">
          {activeBusesOnStop.map((b) => {
            const route = routes.find((r) => r.id === b.routeId);
            return (
              <div key={b.id} className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-extrabold text-blue-400 text-sm">{b.busNumber}</span>
                    <span className="bg-blue-500/20 text-blue-300 text-[10px] font-bold px-2 py-0.5 rounded border border-blue-500/30">
                      Route {route?.number}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">{route?.origin} → {route?.destination}</div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-bold text-emerald-400">Arriving Soon</div>
                  <div className="text-[11px] text-slate-400">Speed: {b.speedKmh} km/h</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Serving Routes */}
      <div className="glass-panel p-6 rounded-3xl space-y-4 border border-slate-800">
        <h2 className="text-sm font-extrabold text-slate-200 uppercase tracking-wider">
          Routes Passing Through This Stop
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {servingRoutes.map((r) => (
            <Link
              key={r.id}
              href={`/routes/${r.id}`}
              className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 hover:border-blue-500/40 transition block"
            >
              <div className="font-bold text-blue-400">{r.number} - {r.name}</div>
              <div className="text-xs text-slate-400 mt-1">{r.origin} → {r.destination}</div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
