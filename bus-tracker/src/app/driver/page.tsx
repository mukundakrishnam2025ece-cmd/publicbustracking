"use client";

import { buses, routes } from "@/lib/mock-data";
import { useAuth } from "@/lib/auth-context";

export default function DriverConsolePage() {
  const {
    user,
    isBroadcasting,
    setIsBroadcasting,
    selectedBusId,
    setSelectedBusId,
    occupancy,
    setOccupancy,
    coords,
    lastPing,
    geoError,
  } = useAuth();

  const activeBus = buses.find((b) => b.id === selectedBusId) || buses[0];
  const activeRoute = routes.find((r) => r.id === activeBus.routeId);

  return (
    <main className="space-y-5 max-w-md mx-auto text-slate-900">
      {/* Header */}
      <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-sm flex items-center justify-between">
        <div>
          <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
            Official Driver Portal
          </span>
          <h1 className="text-xl font-black text-slate-900 mt-1">GPS Live Broadcast</h1>
          <p className="text-xs text-slate-500 font-medium">Transmit real-time vehicle position to passengers</p>
        </div>
        <div
          className={`px-3 py-1.5 rounded-2xl font-extrabold text-xs flex items-center space-x-2 shadow-sm ${
            isBroadcasting
              ? "bg-emerald-500 text-white shadow-emerald-500/20"
              : "bg-slate-100 text-slate-500 border border-slate-200"
          }`}
        >
          <span className={`h-2.5 w-2.5 rounded-full ${isBroadcasting ? "bg-white animate-ping" : "bg-slate-400"}`}></span>
          <span>{isBroadcasting ? "LIVE" : "OFFLINE"}</span>
        </div>
      </div>

      {/* Driver Identity Card */}
      {user && (
        <div className="bg-blue-600 text-white p-4 rounded-2xl flex items-center justify-between shadow-md">
          <div>
            <div className="text-[10px] font-bold text-blue-200 uppercase">Authenticated Driver</div>
            <div className="text-sm font-black">{user.name}</div>
            <div className="text-xs text-blue-100">Badge: {user.badgeNumber || "DRV-2024-001"}</div>
          </div>
          <div className="text-2xl">🚌</div>
        </div>
      )}

      {/* Vehicle Selection */}
      <div className="bg-white border border-slate-200 p-5 rounded-3xl space-y-4 shadow-sm">
        <h2 className="text-xs font-black text-slate-500 uppercase tracking-wider">Vehicle & Route Assignment</h2>

        <div>
          <label className="block text-xs text-slate-700 font-extrabold mb-1">Select Assigned Bus Vehicle:</label>
          <select
            value={selectedBusId}
            onChange={(e) => setSelectedBusId(e.target.value)}
            disabled={isBroadcasting}
            className="w-full bg-slate-50 text-slate-900 text-xs font-bold rounded-2xl p-3 border border-slate-200 focus:outline-none focus:border-blue-600"
          >
            {buses.map((b) => (
              <option key={b.id} value={b.id}>
                {b.busNumber} — Route {routes.find((r) => r.id === b.routeId)?.number}
              </option>
            ))}
          </select>
        </div>

        {/* Bus Occupancy Status */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <label className="block text-xs text-slate-700 font-extrabold uppercase">Live Occupancy Status:</label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setOccupancy("SEATS_AVAILABLE")}
              className={`py-2.5 rounded-2xl font-black text-xs border transition ${
                occupancy === "SEATS_AVAILABLE"
                  ? "bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-600/20"
                  : "bg-slate-50 text-slate-600 border-slate-200"
              }`}
            >
              🟢 Free Seats
            </button>

            <button
              type="button"
              onClick={() => setOccupancy("STANDING_ONLY")}
              className={`py-2.5 rounded-2xl font-black text-xs border transition ${
                occupancy === "STANDING_ONLY"
                  ? "bg-amber-500 text-white border-amber-400 shadow-md shadow-amber-500/20"
                  : "bg-slate-50 text-slate-600 border-slate-200"
              }`}
            >
              🟡 Standing
            </button>

            <button
              type="button"
              onClick={() => setOccupancy("CROWDED")}
              className={`py-2.5 rounded-2xl font-black text-xs border transition ${
                occupancy === "CROWDED"
                  ? "bg-rose-600 text-white border-rose-500 shadow-md shadow-rose-600/20"
                  : "bg-slate-50 text-slate-600 border-slate-200"
              }`}
            >
              🔴 Crowded
            </button>
          </div>
        </div>
      </div>

      {/* Broadcast Toggle Controls */}
      <div className="bg-white border border-slate-200 p-5 rounded-3xl space-y-4 shadow-sm">
        {geoError && <div className="text-[11px] text-amber-700 bg-amber-50 p-2.5 rounded-xl border border-amber-200 font-medium">{geoError}</div>}

        <button
          onClick={() => setIsBroadcasting(!isBroadcasting)}
          className={`w-full py-4 rounded-2xl font-black text-base transition-all shadow-lg ${
            isBroadcasting
              ? "bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30"
              : "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30"
          }`}
        >
          {isBroadcasting ? "🛑 Stop Location Broadcast" : "📡 Start Live Location Broadcast"}
        </button>

        {isBroadcasting && (
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-500">Broadcasting Coordinates:</span>
              <span className="font-mono font-black text-blue-600">
                {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
              </span>
            </div>
            {lastPing && (
              <div className="text-center text-xs text-emerald-600 font-extrabold pt-1">
                ✓ Transmitted Live Location at {lastPing}
              </div>
            )}
            <div className="text-center text-[11px] text-blue-600 font-bold pt-1">
              ✨ Live broadcast stays running active even if you open other tabs or options!
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
