"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

const menuItems = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
        <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z"/>
        <line x1="9" y1="2" x2="9" y2="22"/>
      </svg>
    ),
    label: "My Tickets",
    desc: "View your digital passes",
    href: "/tickets",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
        <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/>
        <line x1="8" y1="2" x2="8" y2="18"/>
        <line x1="16" y1="6" x2="16" y2="22"/>
      </svg>
    ),
    label: "Live Map",
    desc: "Track buses in real-time",
    href: "/map",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
        <rect x="1" y="3" width="15" height="13" rx="2"/>
        <path d="M16 8h4l3 3v5h-7V8z"/>
        <circle cx="5.5" cy="18.5" r="2.5"/>
        <circle cx="18.5" cy="18.5" r="2.5"/>
      </svg>
    ),
    label: "All Routes",
    desc: "Browse 100+ Coimbatore routes",
    href: "/routes",
    color: "text-violet-600",
    bg: "bg-violet-50",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
        <circle cx="12" cy="10" r="3"/>
      </svg>
    ),
    label: "Bus Stops",
    desc: "View stops & schedules",
    href: "/stops",
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
];

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (!user) {
    return (
      <div className="space-y-5">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-black text-slate-900">Account</h1>
          <p className="text-sm text-slate-500 mt-0.5">Sign in to access your profile</p>
        </div>

        {/* Guest Card */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl p-6 text-white shadow-lg shadow-blue-600/25">
          <div className="h-16 w-16 rounded-2xl bg-white/20 flex items-center justify-center mb-4">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" className="w-8 h-8">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <h2 className="text-xl font-black">Welcome, Guest</h2>
          <p className="text-blue-100 text-sm mt-1">Sign in to book tickets, save routes & more</p>
          <Link
            href="/login"
            className="mt-4 inline-flex items-center space-x-2 bg-white text-blue-700 font-black text-sm px-5 py-2.5 rounded-2xl shadow-md transition hover:shadow-lg"
          >
            <span>Sign In / Register</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>

        {/* Driver Portal Link */}
        <Link
          href="/driver/login"
          className="block bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between shadow-sm hover:border-slate-300 transition"
        >
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-slate-600">
                <rect x="1" y="3" width="15" height="13" rx="2"/>
                <path d="M16 8h4l3 3v5h-7V8z"/>
                <circle cx="5.5" cy="18.5" r="2.5"/>
                <circle cx="18.5" cy="18.5" r="2.5"/>
              </svg>
            </div>
            <div>
              <div className="font-bold text-sm text-slate-800">Driver Portal</div>
              <div className="text-xs text-slate-500">GPS location broadcast</div>
            </div>
          </div>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-slate-400">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </Link>

        {/* Quick Links */}
        <div className="grid grid-cols-2 gap-3">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="bg-white border border-slate-200 rounded-2xl p-4 space-y-2 shadow-sm hover:border-slate-300 transition block"
            >
              <div className={`h-9 w-9 rounded-xl ${item.bg} ${item.color} flex items-center justify-center`}>
                {item.icon}
              </div>
              <div className="font-bold text-sm text-slate-900">{item.label}</div>
              <div className="text-xs text-slate-500 leading-tight">{item.desc}</div>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  const authBadge =
    user.authMethod === "GOOGLE" ? "Google Account" :
    user.authMethod === "OTP_EMAIL" ? "Email OTP" :
    user.authMethod === "OTP_PHONE" ? "Phone OTP" :
    user.authMethod === "DRIVER_BADGE" ? "Driver Badge" : "Verified";

  const authColor =
    user.authMethod === "GOOGLE" ? "text-blue-600 bg-blue-50" :
    user.authMethod === "OTP_PHONE" ? "text-emerald-600 bg-emerald-50" :
    "text-violet-600 bg-violet-50";

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900">Profile</h1>
        <p className="text-sm text-slate-500 mt-0.5">Your account & settings</p>
      </div>

      {/* Profile Card */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl p-5 text-white shadow-lg shadow-blue-600/25">
        <div className="flex items-center space-x-4">
          <div className="h-14 w-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-2xl font-black text-white border border-white/30">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-black text-white truncate">{user.name}</h2>
            <p className="text-sm text-blue-100 truncate">{user.emailOrPhone}</p>
            <div className="mt-1.5 flex items-center space-x-2">
              <span className="inline-flex items-center space-x-1 bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-2.5 h-2.5"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                <span>{user.role === "DRIVER" ? "Driver" : "Passenger"}</span>
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-white`}>
                {authBadge}
              </span>
            </div>
          </div>
        </div>

        {user.badgeNumber && (
          <div className="mt-4 pt-4 border-t border-white/20 flex items-center justify-between text-sm">
            <span className="text-blue-100">Driver Badge</span>
            <span className="font-black">{user.badgeNumber}</span>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="bg-white border border-slate-200 rounded-2xl p-4 space-y-2 shadow-sm hover:border-slate-300 transition block"
          >
            <div className={`h-9 w-9 rounded-xl ${item.bg} ${item.color} flex items-center justify-center`}>
              {item.icon}
            </div>
            <div className="font-bold text-sm text-slate-900">{item.label}</div>
            <div className="text-xs text-slate-500 leading-tight">{item.desc}</div>
          </Link>
        ))}
      </div>

      {/* Driver Portal if driver */}
      {user.role === "DRIVER" && (
        <Link
          href="/driver"
          className="block bg-blue-600 rounded-2xl p-4 flex items-center justify-between shadow-md shadow-blue-600/25 text-white hover:bg-blue-700 transition"
        >
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-5 h-5">
                <circle cx="12" cy="12" r="10"/>
                <polygon points="10 8 16 12 10 16 10 8"/>
              </svg>
            </div>
            <div>
              <div className="font-bold text-sm">Driver Console</div>
              <div className="text-xs text-blue-100">GPS Broadcast</div>
            </div>
          </div>
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-4 h-4">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </Link>
      )}

      {/* Sign Out */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-between px-5 py-4 hover:bg-rose-50 transition group"
        >
          <div className="flex items-center space-x-3">
            <div className="h-9 w-9 rounded-xl bg-rose-50 group-hover:bg-rose-100 flex items-center justify-center text-rose-600 transition">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
            </div>
            <div className="text-left">
              <div className="font-bold text-sm text-rose-600">Sign Out</div>
              <div className="text-xs text-slate-500">Logout from this device</div>
            </div>
          </div>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-slate-400">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </button>
      </div>

      {/* App Version */}
      <div className="text-center text-xs text-slate-400 pb-2">
        Coimbatore Transit v2.0 · 100+ Routes · Live GPS Tracking
      </div>
    </div>
  );
}
