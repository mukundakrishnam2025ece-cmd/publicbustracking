"use client";

import dynamic from "next/dynamic";

const LiveMap = dynamic(() => import("@/components/LiveMap"), { ssr: false });

export default function MapPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Live Map</h1>
        <p className="text-sm text-slate-500 mt-0.5">Real-time bus tracking across Coimbatore</p>
      </div>
      <LiveMap />
    </div>
  );
}
