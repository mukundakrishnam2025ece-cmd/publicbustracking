"use client";

import { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { routes, buses, getRouteStops } from "@/lib/mock-data";
import { getSimulatedPosition } from "@/lib/gps-simulator";

// Fix Leaflet default icon path for Next.js
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// ─── Stop Marker (circular dot) ──────────────────────────────────────────────
const stopMarkerIcon = L.divIcon({
  className: "",
  html: `<div style="
    width:12px; height:12px;
    border-radius:50%;
    background:#1d4ed8;
    border:2.5px solid #fff;
    box-shadow:0 1px 4px rgba(0,0,0,0.28);
  "></div>`,
  iconSize: [12, 12],
  iconAnchor: [6, 6],
});

// ─── Bus Marker (card-style like transit apps) ────────────────────────────────
function createBusMarkerIcon(routeNumber: string, isLive: boolean = false): L.DivIcon {
  const bg = isLive ? "#059669" : "#1d4ed8";
  const ring = isLive ? "rgba(5,150,105,0.25)" : "rgba(29,78,216,0.2)";

  return L.divIcon({
    className: "",
    html: `
      <div style="position:relative;display:flex;align-items:center;justify-content:center;width:48px;height:48px;">
        <!-- Pulse ring -->
        <div style="
          position:absolute;inset:0;
          border-radius:50%;
          background:${ring};
          animation:ctPulse 2s ease-in-out infinite;
        "></div>
        <!-- Bus card pill -->
        <div style="
          position:relative;
          background:${bg};
          border-radius:10px;
          padding:3px 6px;
          box-shadow:0 3px 10px rgba(0,0,0,0.28);
          border:2px solid #fff;
          display:flex;align-items:center;gap:3px;
        ">
          <!-- Bus SVG icon -->
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <rect x="1" y="3" width="15" height="13" rx="2"/>
            <path d="M16 8h4l3 3v5h-7V8z"/>
            <circle cx="5.5" cy="18.5" r="2.5"/>
            <circle cx="18.5" cy="18.5" r="2.5"/>
          </svg>
          <!-- Route number -->
          <span style="color:#fff;font-size:9px;font-weight:900;font-family:system-ui,sans-serif;letter-spacing:-0.3px;white-space:nowrap;">${routeNumber}</span>
        </div>
        <!-- Downward pointer -->
        <div style="
          position:absolute;bottom:-5px;left:50%;transform:translateX(-50%);
          width:0;height:0;
          border-left:5px solid transparent;
          border-right:5px solid transparent;
          border-top:6px solid ${bg};
        "></div>
      </div>
      <style>
        @keyframes ctPulse {
          0%,100%{transform:scale(1);opacity:0.6}
          50%{transform:scale(1.6);opacity:0.15}
        }
      </style>
    `,
    iconSize: [48, 48],
    iconAnchor: [24, 44],
    popupAnchor: [0, -44],
  });
}

// ─── Map auto-fly & resize ────────────────────────────────────────────────────
function MapFlyToAndResize({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, map.getZoom(), { animate: true, duration: 0.8 });
    const t = setTimeout(() => map.invalidateSize(), 200);
    return () => clearTimeout(t);
  }, [center, map]);
  return null;
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function LiveMap({ initialRouteId }: { initialRouteId?: string }) {
  const [selectedRouteId, setSelectedRouteId] = useState<string>(
    initialRouteId || routes[0].id
  );
  const [elapsed, setElapsed] = useState<number>(0);
  const [liveDriverFixes, setLiveDriverFixes] = useState<Record<string, unknown>>({});

  // Sync when parent provides a route
  useEffect(() => {
    if (initialRouteId) setSelectedRouteId(initialRouteId);
  }, [initialRouteId]);

  // Smooth movement timer
  useEffect(() => {
    let last = Date.now();
    const id = setInterval(() => {
      const now = Date.now();
      setElapsed((p) => p + (now - last) / 1000);
      last = now;
    }, 1000);
    return () => clearInterval(id);
  }, []);

  // Live driver API poll
  useEffect(() => {
    const poll = async () => {
      try {
        const res = await fetch("/api/locations");
        if (!res.ok) return;
        const data = await res.json();
        const map: Record<string, unknown> = {};
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data.forEach((b: any) => { if (b.isLiveDriver) map[b.busId] = b; });
        setLiveDriverFixes(map);
      } catch { /* silent */ }
    };
    poll();
    const id = setInterval(poll, 4000);
    return () => clearInterval(id);
  }, []);

  const activeRoute = useMemo(
    () => routes.find((r) => r.id === selectedRouteId) || routes[0],
    [selectedRouteId]
  );
  const routeStops = useMemo(() => getRouteStops(activeRoute.id), [activeRoute.id]);
  const activeBuses = useMemo(
    () => buses.filter((b) => b.routeId === activeRoute.id),
    [activeRoute.id]
  );

  const mapCenter: [number, number] = routeStops[0]
    ? [routeStops[0].lat, routeStops[0].lng]
    : [11.0168, 76.9558];

  const routePolyline: [number, number][] = routeStops.map((s) => [s.lat, s.lng]);

  return (
    <div className="space-y-3">
      {/* Route pill selector */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
        {routes.slice(0, 12).map((r) => {
          const sel = r.id === selectedRouteId;
          return (
            <button
              key={r.id}
              onClick={() => setSelectedRouteId(r.id)}
              className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold transition ${
                sel
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/25"
                  : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              {r.number}
            </button>
          );
        })}
      </div>

      {/* Map Container */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-md" style={{ height: 320 }}>
        <MapContainer
          center={mapCenter}
          zoom={13}
          scrollWheelZoom={false}
          style={{ height: "100%", width: "100%" }}
        >
          <MapFlyToAndResize center={mapCenter} />

          {/* OpenStreetMap tiles */}
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />

          {/* Route polyline */}
          <Polyline
            positions={routePolyline}
            pathOptions={{ color: "#1d4ed8", weight: 5, opacity: 0.85, dashArray: undefined }}
          />

          {/* Stop markers */}
          {routeStops.map((stop, idx) => (
            <Marker key={stop.id} position={[stop.lat, stop.lng]} icon={stopMarkerIcon}>
              <Popup>
                <div className="text-xs p-0.5">
                  <div className="font-bold text-blue-700">
                    Stop {idx + 1}: {stop.name}
                  </div>
                  {stop.description && (
                    <div className="text-slate-600 mt-0.5">{stop.description}</div>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Bus markers */}
          {activeBuses.map((bus) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const driverFix = liveDriverFixes[bus.id] as any;
            const isLive = Boolean(driverFix);

            let lat: number, lng: number, headingDeg: number, speedKmh: number;
            let nextStopName: string, etaMin: number;

            if (isLive) {
              lat = driverFix.lat;
              lng = driverFix.lng;
              headingDeg = driverFix.headingDeg || 0;
              speedKmh = driverFix.speedKmh || 35;
              nextStopName = routeStops[1]?.name || "Next Stop";
              etaMin = 3.5;
            } else {
              const pos = getSimulatedPosition(routeStops, elapsed, bus.speedKmh);
              lat = pos.lat;
              lng = pos.lng;
              headingDeg = pos.headingDeg;
              speedKmh = pos.speedKmh;
              nextStopName = pos.nextStop?.name ?? "Destination";
              etaMin = pos.etaToNextStopMin;
            }

            return (
              <Marker
                key={bus.id}
                position={[lat, lng]}
                icon={createBusMarkerIcon(activeRoute.number, isLive)}
              >
                <Popup>
                  <div className="text-xs space-y-1.5 p-0.5 min-w-[160px]">
                    <div className="flex items-center justify-between">
                      <span className="font-black text-blue-700">{bus.busNumber}</span>
                      {isLive && (
                        <span className="bg-emerald-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                          LIVE
                        </span>
                      )}
                    </div>
                    <div className="text-slate-600">
                      Route <strong>{activeRoute.number}</strong> ·{" "}
                      {activeRoute.origin} → {activeRoute.destination}
                    </div>
                    <div className="text-slate-600">
                      Next: <strong>{nextStopName}</strong>
                    </div>
                    <div className="flex items-center justify-between text-slate-600">
                      <span>ETA: <strong>{etaMin.toFixed(1)} min</strong></span>
                      <span>{speedKmh.toFixed(0)} km/h</span>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      {/* Route summary card */}
      <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3 flex items-center justify-between shadow-sm">
        <div>
          <div className="text-xs font-bold text-slate-900">{activeRoute.name}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            {activeRoute.origin} → {activeRoute.destination}
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm font-black text-blue-600">₹{activeRoute.fareRs}</div>
          <div className="text-[10px] text-slate-400">{activeRoute.frequency}</div>
        </div>
      </div>
    </div>
  );
}
