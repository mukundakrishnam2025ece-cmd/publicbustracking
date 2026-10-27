"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { routes, stops } from "@/lib/mock-data";

export default function FavouritesPage() {
  const [savedRouteIds, setSavedRouteIds] = useState<string[]>([]);
  const [savedStopIds, setSavedStopIds] = useState<string[]>([]);

  useEffect(() => {
    const savedR = localStorage.getItem("tnstc_fav_routes");
    const savedS = localStorage.getItem("tnstc_fav_stops");
    if (savedR) setSavedRouteIds(JSON.parse(savedR));
    if (savedS) setSavedStopIds(JSON.parse(savedS));
  }, []);

  const toggleRoute = (id: string) => {
    const updated = savedRouteIds.includes(id)
      ? savedRouteIds.filter((r) => r !== id)
      : [...savedRouteIds, id];
    setSavedRouteIds(updated);
    localStorage.setItem("tnstc_fav_routes", JSON.stringify(updated));
  };

  const toggleStop = (id: string) => {
    const updated = savedStopIds.includes(id)
      ? savedStopIds.filter((s) => s !== id)
      : [...savedStopIds, id];
    setSavedStopIds(updated);
    localStorage.setItem("tnstc_fav_stops", JSON.stringify(updated));
  };

  return (
    <main className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between glass-panel p-5 rounded-2xl border border-slate-800">
        <div>
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">User Preferences</span>
          <h1 className="text-2xl font-black text-slate-100 mt-1">Saved Routes & Stops</h1>
        </div>
        <span className="text-xs font-bold bg-amber-500/10 text-amber-400 px-3 py-1.5 rounded-xl border border-amber-500/20">
          ⭐ Local Storage Saved
        </span>
      </div>

      {/* Routes Bookmark Section */}
      <div className="glass-panel p-6 rounded-3xl space-y-4 border border-slate-800">
        <h2 className="text-sm font-extrabold text-slate-200 uppercase tracking-wider">
          Saved Bus Routes
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {routes.map((r) => {
            const isSaved = savedRouteIds.includes(r.id);
            return (
              <div key={r.id} className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
                <div>
                  <Link href={`/routes/${r.id}`} className="font-extrabold text-blue-400 text-sm hover:underline">
                    Route {r.number} - {r.name}
                  </Link>
                  <div className="text-xs text-slate-400 mt-0.5">{r.origin} → {r.destination}</div>
                </div>

                <button
                  onClick={() => toggleRoute(r.id)}
                  className={`p-2 rounded-xl text-lg transition ${
                    isSaved ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" : "bg-slate-800 text-slate-500 hover:text-slate-300"
                  }`}
                >
                  {isSaved ? "★" : "☆"}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stops Bookmark Section */}
      <div className="glass-panel p-6 rounded-3xl space-y-4 border border-slate-800">
        <h2 className="text-sm font-extrabold text-slate-200 uppercase tracking-wider">
          Saved Bus Stops
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {stops.map((s) => {
            const isSaved = savedStopIds.includes(s.id);
            return (
              <div key={s.id} className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
                <div>
                  <Link href={`/stops/${s.id}`} className="font-bold text-slate-200 text-sm hover:underline">
                    {s.name}
                  </Link>
                  <div className="text-xs text-slate-400 mt-0.5">{s.description || "Active Stop"}</div>
                </div>

                <button
                  onClick={() => toggleStop(s.id)}
                  className={`p-2 rounded-xl text-lg transition ${
                    isSaved ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" : "bg-slate-800 text-slate-500 hover:text-slate-300"
                  }`}
                >
                  {isSaved ? "★" : "☆"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
