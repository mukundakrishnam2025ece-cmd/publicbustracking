"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { validate10DigitPhone, sanitizePhoneInput } from "@/lib/validators";

export default function DriverLoginPage() {
  const router = useRouter();
  const { user, loginAsDriver, logout } = useAuth();

  const [driverPhone, setDriverPhone] = useState("");
  const [driverBadge, setDriverBadge] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDriverPhone(sanitizePhoneInput(e.target.value));
    setErrorMsg("");
  };

  const handleDriverSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const phoneCheck = validate10DigitPhone(driverPhone);
    if (!phoneCheck.isValid) {
      setErrorMsg(phoneCheck.message);
      return;
    }

    if (!driverBadge || driverBadge.trim().length < 3) {
      setErrorMsg("Please enter a valid Driver Badge ID.");
      return;
    }

    if (!pinCode || pinCode.length < 4) {
      setErrorMsg("Please enter your 4-digit security PIN.");
      return;
    }

    loginAsDriver(driverPhone, driverBadge.trim());
    router.push("/driver");
  };

  return (
    <main className="max-w-md mx-auto py-4 space-y-5 text-slate-900">
      {/* Header */}
      <div className="text-center space-y-1">
        <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-200 text-xs font-black">
          <span>🚌 Official Driver Portal</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900">Coimbatore Transit Driver Login</h1>
        <p className="text-xs text-slate-500 font-medium">Authenticated driver access for live GPS location broadcasting</p>
      </div>

      {user && user.role === "DRIVER" ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 text-center space-y-4 shadow-sm">
          <div className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 font-extrabold text-xs rounded-full border border-emerald-200">
            ✓ Logged in as Driver ({user.badgeNumber})
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-black text-slate-900">{user.name}</h2>
            <p className="text-xs text-slate-500">Phone: +91 {user.emailOrPhone}</p>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => router.push("/driver")}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black rounded-2xl shadow-md transition"
            >
              Open Driver GPS Console →
            </button>
            <button
              onClick={logout}
              className="w-full py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-black rounded-2xl border border-rose-200 transition"
            >
              🚪 Sign Out / Logout
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-5">
          <form onSubmit={handleDriverSubmit} className="space-y-4">
            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold rounded-2xl">
                ⚠️ {errorMsg}
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-extrabold text-slate-700 uppercase">
                Driver Phone Number (10 Digits):
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-xs font-black text-slate-400">+91</span>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  placeholder="9876543210"
                  value={driverPhone}
                  onChange={handlePhoneChange}
                  className="w-full bg-slate-50 text-slate-900 text-xs font-bold rounded-2xl pl-12 pr-3 py-3 border border-slate-200 focus:outline-none focus:border-blue-600"
                />
              </div>
              <p className="text-[11px] text-slate-400">Only 10 digits allowed (e.g. 9876543210)</p>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-extrabold text-slate-700 uppercase">
                Driver Badge ID:
              </label>
              <input
                type="text"
                required
                placeholder="DRV-2024-001"
                value={driverBadge}
                onChange={(e) => setDriverBadge(e.target.value.toUpperCase())}
                className="w-full bg-slate-50 text-slate-900 text-xs font-mono rounded-2xl p-3 border border-slate-200 focus:outline-none focus:border-blue-600 uppercase"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-extrabold text-slate-700 uppercase">
                Driver Security PIN Code:
              </label>
              <input
                type="password"
                required
                maxLength={6}
                placeholder="••••"
                value={pinCode}
                onChange={(e) => setPinCode(e.target.value.replace(/\D/g, ""))}
                className="w-full bg-slate-50 text-slate-900 text-xs font-mono rounded-2xl p-3 border border-slate-200 focus:outline-none focus:border-blue-600"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-sm rounded-2xl transition shadow-lg shadow-blue-600/30"
            >
              Sign In to Driver Console →
            </button>
          </form>

          <div className="pt-3 border-t border-slate-100 text-center">
            <Link href="/login" className="text-xs font-bold text-slate-500 hover:text-blue-600 transition">
              ← Back to Passenger Login
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}
