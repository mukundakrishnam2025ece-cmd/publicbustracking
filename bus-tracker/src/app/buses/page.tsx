import Link from "next/link";
import { buses, routes } from "@/lib/mock-data";

export default function BusesPage() {
  return (
    <main className="space-y-6">
      <div className="flex items-center justify-between glass-panel p-5 rounded-2xl border border-slate-800">
        <div>
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Fleet Operational Status</span>
          <h1 className="text-2xl font-black text-slate-100 mt-1">Active Buses</h1>
        </div>
        <span className="text-xs font-bold bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-xl border border-emerald-500/20">
          {buses.length} Fleet Vehicles
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {buses.map((b) => {
          const route = routes.find((r) => r.id === b.routeId);
          return (
            <Link
              key={b.id}
              href={`/buses/${b.id}`}
              className="glass-panel-interactive p-5 rounded-3xl block space-y-4 border border-slate-800"
            >
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-blue-400 text-sm">{b.busNumber}</span>
                <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  ● {b.status}
                </span>
              </div>

              <div>
                <div className="font-bold text-slate-100 text-base">{route?.name}</div>
                <div className="text-xs text-slate-400 mt-0.5">{route?.origin} → {route?.destination}</div>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-400">Current Speed:</span>
                <span className="font-bold text-slate-200">{b.speedKmh} km/h</span>
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
