"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { routes, getRouteStops } from "@/lib/mock-data";

export default function RoutesPage() {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return routes;
    const q = search.toLowerCase();
    return routes.filter(
      (r) =>
        r.number.toLowerCase().includes(q) ||
        r.name.toLowerCase().includes(q) ||
        r.origin.toLowerCase().includes(q) ||
        r.destination.toLowerCase().includes(q)
    );
  }, [search]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Bus Routes</h1>
          <p className="text-sm text-slate-500 mt-0.5">Coimbatore city network</p>
        </div>
        <span className="text-xs font-bold bg-blue-50 text-blue-600 px-3 py-1 rounded-full border border-blue-100">
          {routes.length} Routes
        </span>
      </div>

      {/* Search */}
      <div className="relative">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          type="text"
          placeholder="Search route number, name or stop..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white border border-slate-200 text-slate-900 text-sm rounded-2xl pl-10 pr-4 py-3 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 shadow-sm transition"
        />
      </div>

      {/* Routes List */}
      <div className="space-y-2.5">
        {filtered.slice(0, 50).map((r) => {
          const stops = getRouteStops(r.id);
          return (
            <Link
              key={r.id}
              href={`/routes/${r.id}`}
              className="bg-white border border-slate-200 hover:border-blue-200 hover:shadow-md rounded-2xl p-4 block transition group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-xl bg-blue-600 text-white font-black flex items-center justify-center text-xs shadow-md shadow-blue-600/20 flex-shrink-0">
                    {r.number}
                  </div>
                  <div className="min-w-0">
                    <h2 className="font-bold text-slate-900 text-sm truncate leading-tight">{r.name}</h2>
                    <p className="text-xs text-slate-500 truncate">{r.origin} → {r.destination}</p>
                  </div>
                </div>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="w-4 h-4 text-slate-400 group-hover:text-blue-600 flex-shrink-0 ml-2 transition"
                >
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </div>

              {/* Metrics */}
              <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                <div className="bg-slate-50 rounded-xl py-2 px-1 border border-slate-100">
                  <div className="text-[9px] font-bold text-slate-400 uppercase">Distance</div>
                  <div className="font-black text-slate-800 text-xs mt-0.5">{r.distanceKm} km</div>
                </div>
                <div className="bg-slate-50 rounded-xl py-2 px-1 border border-slate-100">
                  <div className="text-[9px] font-bold text-slate-400 uppercase">Duration</div>
                  <div className="font-black text-emerald-600 text-xs mt-0.5">{r.averageTimeMin} min</div>
                </div>
                <div className="bg-slate-50 rounded-xl py-2 px-1 border border-slate-100">
                  <div className="text-[9px] font-bold text-slate-400 uppercase">Fare</div>
                  <div className="font-black text-blue-600 text-xs mt-0.5">₹{r.fareRs}</div>
                </div>
              </div>

              <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center space-x-1">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                  <span>{r.frequency}</span>
                </span>
                <span>{stops.length} stops · {r.operatingHours}</span>
              </div>
            </Link>
          );
        })}
        {filtered.length === 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">
            <div className="text-2xl mb-2">🔍</div>
            <div className="font-bold text-slate-800">No routes found</div>
            <div className="text-xs text-slate-500 mt-1">Try a different route number or stop name</div>
          </div>
        )}
        {filtered.length > 50 && (
          <div className="text-center text-xs text-slate-400 py-2">
            Showing 50 of {filtered.length} routes
          </div>
        )}
      </div>
    </div>
  );
}
