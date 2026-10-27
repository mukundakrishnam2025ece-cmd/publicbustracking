"use client";

import { useState } from "react";
import Link from "next/link";
import { stops, routes, buses } from "@/lib/mock-data";

export default function TripPlannerPage() {
  const [fromStopId, setFromStopId] = useState<string>(stops[0].id);
  const [toStopId, setToStopId] = useState<string>(stops[4].id);
  const [hasSearched, setHasSearched] = useState<boolean>(true);

  const fromStop = stops.find((s) => s.id === fromStopId) || stops[0];
  const toStop = stops.find((s) => s.id === toStopId) || stops[1];

  const matchingRoutes = routes.filter((r) => {
    const fromIdx = r.stopIds.indexOf(fromStopId);
    const toIdx = r.stopIds.indexOf(toStopId);
    return fromIdx !== -1 && toIdx !== -1 && fromIdx < toIdx;
  });

  const handleSwap = () => {
    const temp = fromStopId;
    setFromStopId(toStopId);
    setToStopId(temp);
  };

  return (
    <div className="space-y-4 max-w-md mx-auto text-slate-900">
      {/* Header */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Trip Planner</h1>
          <p className="text-xs text-slate-500 font-medium">Find direct bus routes</p>
        </div>
        <span className="text-2xl">🗺️</span>
      </div>

      {/* Input Selection Box */}
      <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-sm space-y-4">
        <div className="space-y-3 relative">
          <div>
            <label className="text-xs font-extrabold text-slate-700 uppercase block mb-1">From (Boarding Stop):</label>
            <select
              value={fromStopId}
              onChange={(e) => setFromStopId(e.target.value)}
              className="w-full bg-slate-50 text-slate-900 text-xs font-bold rounded-2xl p-3 border border-slate-200 focus:outline-none focus:border-blue-600"
            >
              {stops.map((s) => (
                <option key={s.id} value={s.id} disabled={s.id === toStopId}>
                  📍 {s.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-center -my-2 relative z-10">
            <button
              onClick={handleSwap}
              className="bg-white hover:bg-slate-50 text-blue-600 px-3 py-1 rounded-full border border-slate-200 shadow-sm text-xs font-black transition"
            >
              ⇅ Swap Stops
            </button>
          </div>

          <div>
            <label className="text-xs font-extrabold text-slate-700 uppercase block mb-1">To (Destination Stop):</label>
            <select
              value={toStopId}
              onChange={(e) => setToStopId(e.target.value)}
              className="w-full bg-slate-50 text-slate-900 text-xs font-bold rounded-2xl p-3 border border-slate-200 focus:outline-none focus:border-blue-600"
            >
              {stops.map((s) => (
                <option key={s.id} value={s.id} disabled={s.id === fromStopId}>
                  🏁 {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={() => setHasSearched(true)}
          className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-sm rounded-2xl shadow-lg shadow-blue-600/30 transition"
        >
          🔍 Find Direct Bus Routes
        </button>
      </div>

      {/* Results */}
      {hasSearched && (
        <div className="space-y-3">
          <h2 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
            Available Direct Routes ({matchingRoutes.length})
          </h2>

          {matchingRoutes.length > 0 ? (
            <div className="space-y-3">
              {matchingRoutes.map((route) => {
                const activeBus = buses.find((b) => b.routeId === route.id);
                const fromIdx = route.stopIds.indexOf(fromStopId);
                const toIdx = route.stopIds.indexOf(toStopId);
                const stopsCount = toIdx - fromIdx;
                const estMins = Math.max(10, Math.round((stopsCount / route.stopIds.length) * route.averageTimeMin));
                const estFare = Math.max(10, Math.round((stopsCount / route.stopIds.length) * route.fareRs));

                return (
                  <div key={route.id} className="bg-white border border-slate-200 p-4 rounded-3xl shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="h-10 w-10 rounded-2xl bg-blue-600 text-white font-black text-sm flex items-center justify-center shadow-md shadow-blue-600/20">
                          {route.number}
                        </span>
                        <div>
                          <h3 className="font-extrabold text-slate-900 text-sm leading-tight">{route.name}</h3>
                          <p className="text-[11px] text-slate-500">{stopsCount} stops • Departs {route.frequency}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-sm font-black text-blue-600">₹{estFare}</div>
                        <div className="text-[10px] text-slate-500 font-bold">{estMins} mins</div>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-200 flex items-center justify-between text-[11px] text-slate-700">
                      <div>From: <strong className="text-blue-600">{fromStop.name}</strong></div>
                      <span className="text-slate-400">➔</span>
                      <div>To: <strong className="text-emerald-600">{toStop.name}</strong></div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <div className="text-[11px] text-emerald-600 font-black">
                        ● Bus: {activeBus?.busNumber || "TN-34-N-1842"}
                      </div>

                      <div className="flex space-x-2">
                        <Link
                          href={`/tickets?route=${route.id}`}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-[11px] rounded-xl shadow-sm transition"
                        >
                          🎟️ Ticket (₹{estFare})
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white border border-slate-200 p-6 rounded-3xl text-center space-y-2 shadow-sm">
              <div className="text-3xl">🚌</div>
              <h3 className="text-sm font-extrabold text-slate-800">No Direct Route Found</h3>
              <p className="text-xs text-slate-500">
                No direct bus connects {fromStop.name} to {toStop.name}.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
