"use client";

import { use } from "react";
import Link from "next/link";
import { routes, getRouteStops, getBusesForRoute } from "@/lib/mock-data";

export default function RouteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const route = routes.find((r) => r.id === resolvedParams.id) || routes[0];
  const stops = getRouteStops(route.id);
  const assignedBuses = getBusesForRoute(route.id);

  return (
    <main className="space-y-6 max-w-4xl mx-auto">
      {/* Route Header Card */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <Link href="/routes" className="text-xs font-bold text-slate-400 hover:text-slate-200">
            ← Back to All Routes
          </Link>
          <span className="bg-blue-600 text-white text-xs font-black px-3 py-1 rounded-full shadow">
            Route {route.number}
          </span>
        </div>

        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-100">{route.name}</h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Origin: <strong className="text-slate-200">{route.origin}</strong> • Destination: <strong className="text-slate-200">{route.destination}</strong>
          </p>
        </div>

        {/* Commercial Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
            <div className="text-[10px] font-bold text-slate-400 uppercase">Distance</div>
            <div className="text-base font-black text-blue-400 mt-0.5">{route.distanceKm} km</div>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
            <div className="text-[10px] font-bold text-slate-400 uppercase">Avg Duration</div>
            <div className="text-base font-black text-emerald-400 mt-0.5">{route.averageTimeMin} mins</div>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
            <div className="text-[10px] font-bold text-slate-400 uppercase">Ticket Fare</div>
            <div className="text-base font-black text-amber-400 mt-0.5">₹{route.fareRs.toFixed(2)}</div>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
            <div className="text-[10px] font-bold text-slate-400 uppercase">Bus Frequency</div>
            <div className="text-base font-black text-cyan-400 mt-0.5">{route.frequency}</div>
          </div>
        </div>

        <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 text-xs text-slate-400">
          <div>Operating Hours: <strong className="text-slate-200">{route.operatingHours}</strong></div>
          <Link
            href="/map"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow transition"
          >
            🗺️ Open Live Map →
          </Link>
        </div>
      </div>

      {/* Assigned Fleet Vehicles */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3 shadow-lg">
        <h2 className="text-xs font-extrabold text-slate-300 uppercase tracking-wider">
          Active Buses on Route {route.number} ({assignedBuses.length})
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {assignedBuses.map((b) => (
            <div key={b.id} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <div className="font-extrabold text-blue-400 text-sm">{b.busNumber}</div>
                <div className="text-xs text-slate-400">Reg: {b.registrationNumber}</div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30">
                  ● {b.status}
                </span>
                <div className="text-xs font-bold text-slate-300 mt-1">{b.speedKmh} km/h</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Visual Timeline of Stops */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-lg">
        <h2 className="text-xs font-extrabold text-slate-300 uppercase tracking-wider">
          Stop Sequence ({stops.length} Stops)
        </h2>

        <div className="relative pl-6 space-y-5 before:absolute before:left-2.5 before:top-2.5 before:bottom-2.5 before:w-0.5 before:bg-blue-600/50">
          {stops.map((s, idx) => (
            <div key={s.id} className="relative flex items-center justify-between">
              <div className="absolute -left-6 top-1 h-4 w-4 rounded-full bg-blue-600 border-2 border-slate-900"></div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-blue-400">#{idx + 1}</span>
                  <Link href={`/stops/${s.id}`} className="font-bold text-slate-100 hover:underline">
                    {s.name}
                  </Link>
                </div>
                {s.description && <p className="text-xs text-slate-400 mt-0.5">{s.description}</p>}
                {s.landmark && <p className="text-[11px] text-slate-500">Landmark: {s.landmark}</p>}
              </div>

              <span className="text-xs text-slate-400 font-mono">
                {s.lat.toFixed(4)}, {s.lng.toFixed(4)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
