import Link from "next/link";
import { stops, routes } from "@/lib/mock-data";

export default function StopsPage() {
  return (
    <div className="space-y-4 text-slate-900">
      <div className="flex items-center justify-between pt-1">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Bus Stops</h1>
          <p className="text-xs text-slate-500 font-medium">Passenger Terminals & Stops</p>
        </div>
        <span className="text-xs font-extrabold bg-blue-50 text-blue-600 px-3 py-1 rounded-full border border-blue-100">
          {stops.length} Active Stops
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {stops.map((s) => {
          const servingRoutes = routes.filter((r) => r.stopIds.includes(s.id));
          return (
            <Link
              key={s.id}
              href={`/stops/${s.id}`}
              className="bg-white border border-slate-200 hover:border-blue-500 p-4 rounded-2xl block space-y-2 shadow-sm transition hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="font-extrabold text-slate-900 text-base">{s.name}</h2>
                  <p className="text-xs text-slate-500 mt-0.5">{s.description || "Passenger Stop"}</p>
                </div>
                <div className="h-8 w-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-sm shadow-sm">
                  📍
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Serving Routes:</span>
                <div className="flex space-x-1">
                  {servingRoutes.map((r) => (
                    <span key={r.id} className="bg-blue-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-sm">
                      {r.number}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
