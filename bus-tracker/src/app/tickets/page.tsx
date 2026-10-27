"use client";

import { useState, useEffect } from "react";
import { routes, stops } from "@/lib/mock-data";
import { useAuth } from "@/lib/auth-context";

export type TicketItem = {
  id: string;
  ticketNumber: string;
  type: "SINGLE_JOURNEY" | "DAILY_PASS";
  routeName: string;
  fromStopName: string;
  toStopName: string;
  fare: number;
  purchasedAt: string;
  validUntil: string;
  passengerName: string;
};

export default function TicketsPage() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<TicketItem[]>([]);
  const [activeTab, setActiveTab] = useState<"MY_TICKETS" | "BUY_TICKET">("BUY_TICKET");

  const [ticketType, setTicketType] = useState<"SINGLE_JOURNEY" | "DAILY_PASS">("SINGLE_JOURNEY");
  const [selectedRouteId, setSelectedRouteId] = useState<string>(routes[0].id);
  const [fromStopId, setFromStopId] = useState<string>(stops[0].id);
  const [toStopId, setToStopId] = useState<string>(stops[4].id);
  const [passengerName, setPassengerName] = useState<string>(user?.name || "Passenger");

  useEffect(() => {
    const saved = localStorage.getItem("tnstc_digital_tickets");
    if (saved) {
      try {
        setTickets(JSON.parse(saved));
      } catch (e) {
        console.error("Ticket restore error:", e);
      }
    }
  }, []);

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    const route = routes.find((r) => r.id === selectedRouteId) || routes[0];
    const fromStop = stops.find((s) => s.id === fromStopId) || stops[0];
    const toStop = stops.find((s) => s.id === toStopId) || stops[1];

    const fare = ticketType === "DAILY_PASS" ? 50.0 : route.fareRs;
    const ticketNumber = "TNSTC-" + Math.floor(100000 + Math.random() * 900000);

    const now = new Date();
    const validUntil = new Date(now.getTime() + (ticketType === "DAILY_PASS" ? 24 * 3600 * 1000 : 3 * 3600 * 1000));

    const newTicket: TicketItem = {
      id: "t_" + Date.now(),
      ticketNumber,
      type: ticketType,
      routeName: ticketType === "DAILY_PASS" ? "All Regional Routes" : route.name,
      fromStopName: ticketType === "DAILY_PASS" ? "Any Bus Stop" : fromStop.name,
      toStopName: ticketType === "DAILY_PASS" ? "Unlimited Trips" : toStop.name,
      fare,
      purchasedAt: now.toLocaleTimeString(),
      validUntil: validUntil.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      passengerName: passengerName || user?.name || "Passenger",
    };

    const updated = [newTicket, ...tickets];
    setTickets(updated);
    localStorage.setItem("tnstc_digital_tickets", JSON.stringify(updated));
    setActiveTab("MY_TICKETS");
  };

  return (
    <div className="space-y-4 max-w-md mx-auto text-slate-900">
      {/* Header */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Tickets & Passes</h1>
          <p className="text-xs text-slate-500 font-medium">Digital QR Ticketing Portal</p>
        </div>
        <span className="text-2xl">🎟️</span>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-2 gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200">
        <button
          onClick={() => setActiveTab("BUY_TICKET")}
          className={`py-2 text-xs font-bold rounded-xl transition ${
            activeTab === "BUY_TICKET" ? "bg-blue-600 text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
          }`}
        >
          ➕ Book Pass
        </button>
        <button
          onClick={() => setActiveTab("MY_TICKETS")}
          className={`py-2 text-xs font-bold rounded-xl transition ${
            activeTab === "MY_TICKETS" ? "bg-blue-600 text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
          }`}
        >
          🎫 My Tickets ({tickets.length})
        </button>
      </div>

      {/* Booking Form */}
      {activeTab === "BUY_TICKET" && (
        <form onSubmit={handleBook} className="bg-white border border-slate-200 p-5 rounded-3xl shadow-sm space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-extrabold text-slate-700 uppercase">Pass Type:</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setTicketType("SINGLE_JOURNEY")}
                className={`p-3 rounded-2xl border text-left space-y-1 transition ${
                  ticketType === "SINGLE_JOURNEY"
                    ? "bg-blue-50 border-blue-600 text-slate-900 shadow-sm"
                    : "bg-slate-50 border-slate-200 text-slate-500"
                }`}
              >
                <div className="font-black text-xs text-blue-600">Single Ride</div>
                <div className="text-[10px] text-slate-500">Route fare</div>
              </button>

              <button
                type="button"
                onClick={() => setTicketType("DAILY_PASS")}
                className={`p-3 rounded-2xl border text-left space-y-1 transition ${
                  ticketType === "DAILY_PASS"
                    ? "bg-emerald-50 border-emerald-600 text-slate-900 shadow-sm"
                    : "bg-slate-50 border-slate-200 text-slate-500"
                }`}
              >
                <div className="font-black text-xs text-emerald-600">Day Pass (₹50)</div>
                <div className="text-[10px] text-slate-500">Unlimited 24h</div>
              </button>
            </div>
          </div>

          {ticketType === "SINGLE_JOURNEY" && (
            <>
              <div className="space-y-1">
                <label className="text-xs font-extrabold text-slate-700 uppercase">Select Route:</label>
                <select
                  value={selectedRouteId}
                  onChange={(e) => setSelectedRouteId(e.target.value)}
                  className="w-full bg-slate-50 text-slate-900 text-xs font-bold rounded-2xl p-3 border border-slate-200 focus:outline-none focus:border-blue-600"
                >
                  {routes.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.number} - {r.name} (₹{r.fareRs})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs font-extrabold text-slate-700 uppercase">From:</label>
                  <select
                    value={fromStopId}
                    onChange={(e) => setFromStopId(e.target.value)}
                    className="w-full bg-slate-50 text-slate-900 text-[11px] font-bold rounded-2xl p-2.5 border border-slate-200"
                  >
                    {stops.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-extrabold text-slate-700 uppercase">To:</label>
                  <select
                    value={toStopId}
                    onChange={(e) => setToStopId(e.target.value)}
                    className="w-full bg-slate-50 text-slate-900 text-[11px] font-bold rounded-2xl p-2.5 border border-slate-200"
                  >
                    {stops.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          )}

          <div className="space-y-1">
            <label className="text-xs font-extrabold text-slate-700 uppercase">Passenger Name:</label>
            <input
              type="text"
              required
              value={passengerName}
              onChange={(e) => setPassengerName(e.target.value)}
              className="w-full bg-slate-50 text-slate-900 text-xs font-medium rounded-2xl p-3 border border-slate-200 focus:outline-none focus:border-blue-600"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-sm rounded-2xl shadow-lg shadow-blue-600/30 transition"
          >
            💳 Pay & Issue Digital Ticket ({ticketType === "DAILY_PASS" ? "₹50.00" : `₹${routes.find(r=>r.id===selectedRouteId)?.fareRs || 25}`})
          </button>
        </form>
      )}

      {/* Active Tickets List */}
      {activeTab === "MY_TICKETS" && (
        <div className="space-y-3">
          {tickets.length > 0 ? (
            tickets.map((t) => (
              <div key={t.id} className="bg-white border border-slate-200 p-4 rounded-3xl shadow-sm space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                      {t.type}
                    </span>
                    <h3 className="font-extrabold text-slate-900 text-base mt-1">{t.routeName}</h3>
                    <p className="text-xs text-slate-500">{t.fromStopName} ➔ {t.toStopName}</p>
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <div className="text-[9px] font-bold text-slate-400">TICKET NO:</div>
                    <div className="font-mono font-black text-blue-600 text-sm">{t.ticketNumber}</div>
                    <div className="text-[11px] text-slate-600 font-medium">Passenger: {t.passengerName}</div>
                  </div>

                  <div className="h-12 w-12 bg-slate-900 text-white p-1 rounded-xl flex items-center justify-center font-black text-[10px] shadow-sm">
                    QR CODE
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-1 font-medium">
                  <span>Fare: <strong className="text-emerald-600 font-black">₹{t.fare.toFixed(2)}</strong></span>
                  <span>Valid Until: <strong className="text-slate-800 font-extrabold">{t.validUntil}</strong></span>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white border border-slate-200 p-8 rounded-3xl text-center space-y-2 shadow-sm">
              <div className="text-3xl">🎫</div>
              <h3 className="text-sm font-extrabold text-slate-800">No Active Tickets</h3>
              <p className="text-xs text-slate-500">Book a single ride ticket or ₹50 daily pass above.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
