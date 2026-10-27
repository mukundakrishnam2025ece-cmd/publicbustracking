"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { stops, routes, buses } from "@/lib/mock-data";
import { useAuth } from "@/lib/auth-context";

// Dynamic client-side Leaflet map
const LiveMap = dynamic(() => import("@/components/LiveMap"), { ssr: false });

export default function Home() {
  const { user } = useAuth();
  const [fromStopId, setFromStopId] = useState<string>(stops[0].id);
  const [toStopId, setToStopId] = useState<string>(stops[1].id);
  const [isSearched, setIsSearched] = useState<boolean>(false);
  const [activeTabRouteId, setActiveTabRouteId] = useState<string | null>(null);

  const fromStop = useMemo(() => stops.find((s) => s.id === fromStopId) || stops[0], [fromStopId]);
  const toStop = useMemo(() => stops.find((s) => s.id === toStopId) || stops[1], [toStopId]);

  // Find routes matching Source & Destination
  const matchingRoutes = useMemo(() => {
    return routes.filter((r) => {
      const fromIdx = r.stopIds.indexOf(fromStopId);
      const toIdx = r.stopIds.indexOf(toStopId);
      return fromIdx !== -1 && toIdx !== -1 && fromIdx < toIdx;
    });
  }, [fromStopId, toStopId]);

  const handleSwap = () => {
    setFromStopId(toStopId);
    setToStopId(fromStopId);
    setIsSearched(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearched(true);
    if (matchingRoutes.length > 0) {
      setActiveTabRouteId(matchingRoutes[0].id);
    }
  };

  // Popular corridors for quick tap
  const popularCorridors = [
    { fromId: "c1", toId: "c2", label: "Gandhipuram → Ukkadam", time: "~25 min" },
    { fromId: "c4", toId: "c6", label: "Railway St → Peelamedu", time: "~30 min" },
    { fromId: "c1", toId: "c9", label: "Gandhipuram → Marudhamalai", time: "~40 min" },
    { fromId: "c2", toId: "c8", label: "Ukkadam → Saravanampatti", time: "~45 min" },
  ];

  return (
    <div className="space-y-5">
      {/* Welcome Banner */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-slate-900">
            {user ? `Hello, ${user.name.split(" ")[0]} 👋` : "Plan Your Journey"}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            100+ routes · Live GPS tracking · Coimbatore
          </p>
        </div>
        <div className="h-10 w-10 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
            <path d="M22 17H2a3 3 0 0 0 3-3V9a7 7 0 0 1 14 0v5a3 3 0 0 0 3 3z"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
        </div>
      </div>

      {/* Search Card */}
      <form
        onSubmit={handleSearch}
        className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden"
      >
        {/* Source */}
        <div className="px-4 pt-4 pb-2">
          <div className="flex items-center space-x-2.5">
            <div className="flex flex-col items-center space-y-0.5 flex-shrink-0">
              <div className="h-2.5 w-2.5 rounded-full bg-blue-600" />
              <div className="w-0.5 h-5 bg-slate-200" />
              <div className="h-2.5 w-2.5 rounded-full bg-rose-500" />
            </div>
            <div className="flex-1 space-y-2">
              <div>
                <label className="text-[10px] font-black text-blue-600 uppercase tracking-wider block mb-1">
                  From
                </label>
                <select
                  value={fromStopId}
                  onChange={(e) => {
                    setFromStopId(e.target.value);
                    setIsSearched(false);
                  }}
                  className="w-full bg-slate-50 text-slate-900 text-xs font-semibold rounded-xl px-3 py-2.5 border border-slate-200 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                >
                  {stops.map((s) => (
                    <option key={s.id} value={s.id} disabled={s.id === toStopId}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black text-rose-600 uppercase tracking-wider block mb-1">
                  To
                </label>
                <select
                  value={toStopId}
                  onChange={(e) => {
                    setToStopId(e.target.value);
                    setIsSearched(false);
                  }}
                  className="w-full bg-slate-50 text-slate-900 text-xs font-semibold rounded-xl px-3 py-2.5 border border-slate-200 focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
                >
                  {stops.map((s) => (
                    <option key={s.id} value={s.id} disabled={s.id === fromStopId}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Swap Button */}
            <button
              type="button"
              onClick={handleSwap}
              className="flex-shrink-0 h-9 w-9 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-500 hover:text-blue-600 flex items-center justify-center transition border border-slate-200"
              title="Swap stops"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
                <path d="M7 16V4m0 0L3 8m4-4l4 4"/>
                <path d="M17 8v12m0 0l4-4m-4 4l-4-4"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Search Button */}
        <div className="px-4 pb-4 pt-2">
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-black text-sm rounded-2xl shadow-md shadow-blue-600/25 transition transform active:scale-[0.98] flex items-center justify-center space-x-2"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
            <span>Search Buses</span>
          </button>
        </div>
      </form>

      {/* BEFORE SEARCH: Popular Corridors & Stats */}
      {!isSearched && (
        <>
          {/* Live Stats Strip */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Active Routes", value: "105+", color: "text-blue-600" },
              { label: "Live Buses", value: "120+", color: "text-emerald-600" },
              { label: "Stops", value: "25+", color: "text-violet-600" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white border border-slate-200 rounded-2xl p-3 text-center shadow-sm">
                <div className={`text-lg font-black ${stat.color}`}>{stat.value}</div>
                <div className="text-[10px] text-slate-500 font-medium mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Popular Corridors */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-black text-slate-900">Popular Corridors</h2>
              <Link href="/routes" className="text-xs font-bold text-blue-600">
                View all →
              </Link>
            </div>
            <div className="space-y-2">
              {popularCorridors.map((c, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setFromStopId(c.fromId);
                    setToStopId(c.toId);
                    setIsSearched(true);
                    const matching = routes.filter((r) => {
                      const fi = r.stopIds.indexOf(c.fromId);
                      const ti = r.stopIds.indexOf(c.toId);
                      return fi !== -1 && ti !== -1 && fi < ti;
                    });
                    if (matching.length > 0) setActiveTabRouteId(matching[0].id);
                  }}
                  className="w-full bg-white border border-slate-200 hover:border-blue-200 hover:bg-blue-50 rounded-2xl px-4 py-3 flex items-center justify-between transition shadow-sm group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 rounded-xl bg-slate-100 group-hover:bg-blue-100 flex items-center justify-center transition">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-slate-500 group-hover:text-blue-600">
                        <rect x="1" y="3" width="15" height="13" rx="2"/>
                        <path d="M16 8h4l3 3v5h-7V8z"/>
                        <circle cx="5.5" cy="18.5" r="2.5"/>
                        <circle cx="18.5" cy="18.5" r="2.5"/>
                      </svg>
                    </div>
                    <div className="text-left">
                      <div className="text-xs font-bold text-slate-900">{c.label}</div>
                      <div className="text-[10px] text-slate-500">{c.time} • Tap to view live buses</div>
                    </div>
                  </div>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition">
                    <path d="M9 18l6-6-6-6"/>
                  </svg>
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* AFTER SEARCH: Results */}
      {isSearched && (
        <div className="space-y-4">
          {/* Trip Summary */}
          <div className="bg-blue-600 text-white rounded-2xl px-4 py-3 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-bold text-blue-200 uppercase tracking-wider">Your Trip</div>
              <div className="font-black text-sm mt-0.5">
                {fromStop.name.split(" ")[0]} → {toStop.name.split(" ")[0]}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="bg-white/20 text-white text-[10px] font-black px-2.5 py-1 rounded-full">
                {matchingRoutes.length} Route{matchingRoutes.length !== 1 ? "s" : ""}
              </span>
              <button
                onClick={() => setIsSearched(false)}
                className="h-7 w-7 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center transition"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" className="w-3.5 h-3.5">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>

          {matchingRoutes.length > 0 ? (
            <div className="space-y-4">
              {/* Route Tabs */}
              <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
                {matchingRoutes.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setActiveTabRouteId(r.id)}
                    className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold transition ${
                      activeTabRouteId === r.id
                        ? "bg-blue-600 text-white shadow-md shadow-blue-600/25"
                        : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    Route {r.number}
                  </button>
                ))}
              </div>

              {/* Active Route Cards */}
              {matchingRoutes.map((route) => {
                if (activeTabRouteId && route.id !== activeTabRouteId) return null;
                const routeBuses = buses.filter((b) => b.routeId === route.id);
                const fromIdx = route.stopIds.indexOf(fromStopId);
                const toIdx = route.stopIds.indexOf(toStopId);
                const stopsCount = Math.max(1, toIdx - fromIdx);
                const estMins = Math.max(10, Math.round((stopsCount / route.stopIds.length) * route.averageTimeMin));
                const estFare = Math.max(10, Math.round((stopsCount / route.stopIds.length) * route.fareRs));

                return (
                  <div key={route.id} className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
                    {/* Route Header */}
                    <div className="p-4 flex items-center justify-between border-b border-slate-100">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-2xl bg-blue-600 text-white font-black text-sm flex items-center justify-center shadow-md shadow-blue-600/20">
                          {route.number}
                        </div>
                        <div>
                          <h3 className="font-extrabold text-slate-900 text-sm leading-tight">{route.name}</h3>
                          <p className="text-[11px] text-slate-500">{stopsCount} stops · {route.frequency}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-base font-black text-blue-600">₹{estFare}</div>
                        <div className="text-[10px] text-slate-500 font-semibold">{estMins} mins</div>
                      </div>
                    </div>

                    {/* Live Buses */}
                    <div className="p-4 space-y-2">
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Live Buses Now</div>
                      {routeBuses.length > 0 ? (
                        <div className="space-y-1.5">
                          {routeBuses.slice(0, 3).map((b) => (
                            <div
                              key={b.id}
                              className="bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 flex items-center justify-between"
                            >
                              <div className="flex items-center space-x-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-xs font-bold text-slate-900">{b.busNumber}</span>
                              </div>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                b.occupancy === "Seats Available" ? "bg-emerald-100 text-emerald-700" :
                                b.occupancy === "Standing Only" ? "bg-amber-100 text-amber-700" :
                                "bg-rose-100 text-rose-700"
                              }`}>
                                {b.occupancy}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-xs text-slate-500 bg-slate-50 rounded-xl px-3 py-2 border border-slate-100">
                          🚌 TN-38-N-1014 arriving in ~4 mins
                        </div>
                      )}
                    </div>

                    {/* Book Button */}
                    <div className="px-4 pb-4">
                      <Link
                        href={`/tickets?route=${route.id}`}
                        className="block w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-black text-sm rounded-2xl text-center shadow-md shadow-blue-600/20 transition"
                      >
                        Book Ticket · ₹{estFare}
                      </Link>
                    </div>
                  </div>
                );
              })}

              {/* Live Map */}
              <div>
                <h2 className="text-sm font-black text-slate-900 mb-2">Live Tracking Map</h2>
                <LiveMap initialRouteId={activeTabRouteId || matchingRoutes[0].id} />
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center space-y-3 shadow-sm">
              <div className="h-14 w-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7 text-slate-400">
                  <rect x="1" y="3" width="15" height="13" rx="2"/>
                  <path d="M16 8h4l3 3v5h-7V8z"/>
                  <circle cx="5.5" cy="18.5" r="2.5"/>
                  <circle cx="18.5" cy="18.5" r="2.5"/>
                </svg>
              </div>
              <h3 className="text-sm font-extrabold text-slate-800">No Direct Route Found</h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                No direct bus connects {fromStop.name} to {toStop.name}. Try different stops.
              </p>
              <button
                onClick={() => setIsSearched(false)}
                className="text-xs font-bold text-blue-600 underline"
              >
                Change stops
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
