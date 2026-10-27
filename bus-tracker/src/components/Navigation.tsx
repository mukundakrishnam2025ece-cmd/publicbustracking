"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

// Bottom Nav Items
const mobileNavItems = [
  { href: "/", label: "Home", icon: (active: boolean) => (
    <svg viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  )},
  { href: "/map", label: "Live Map", icon: (active: boolean) => (
    <svg viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/>
      <line x1="8" y1="2" x2="8" y2="18"/>
      <line x1="16" y1="6" x2="16" y2="22"/>
    </svg>
  )},
  { href: "/routes", label: "Routes", icon: (active: boolean) => (
    <svg viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <rect x="1" y="3" width="15" height="13" rx="2"/>
      <path d="M16 8h4l3 3v5h-7V8z"/>
      <circle cx="5.5" cy="18.5" r="2.5"/>
      <circle cx="18.5" cy="18.5" r="2.5"/>
    </svg>
  )},
  { href: "/tickets", label: "Tickets", icon: (active: boolean) => (
    <svg viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z"/>
      <line x1="9" y1="2" x2="9" y2="22"/>
    </svg>
  )},
  { href: "/profile", label: "Profile", icon: (active: boolean) => (
    <svg viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  )},
];

export default function Navigation() {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <>
      {/* Top App Header */}
      <header className="sticky top-0 z-40 w-full bg-white border-b border-slate-100 shadow-sm">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2.5">
            <div className="h-8 w-8 rounded-xl bg-blue-600 text-white font-black text-base flex items-center justify-center shadow-md shadow-blue-600/30">
              <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4">
                <rect x="1" y="3" width="15" height="13" rx="2"/>
                <path d="M16 8h4l3 3v5h-7V8z"/>
                <circle cx="5.5" cy="18.5" r="2.5" fill="none" stroke="white" strokeWidth="1.5"/>
                <circle cx="18.5" cy="18.5" r="2.5" fill="none" stroke="white" strokeWidth="1.5"/>
              </svg>
            </div>
            <div>
              <div className="font-black text-slate-900 text-sm tracking-tight leading-none">Coimbatore Transit</div>
              <div className="text-[9px] font-semibold text-slate-400 tracking-wider uppercase">Live City Network</div>
            </div>
          </Link>

          {/* Profile Pill */}
          <Link
            href="/profile"
            className="flex items-center space-x-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-full transition"
          >
            {user ? (
              <>
                <div className="h-5 w-5 rounded-full bg-blue-600 text-white text-[9px] font-black flex items-center justify-center">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs font-bold text-slate-700">{user.name.split(" ")[0]}</span>
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-slate-500">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                <span className="text-xs font-bold text-slate-600">Sign In</span>
              </>
            )}
          </Link>
        </div>
      </header>

      {/* Floating Active Broadcast Banner for Drivers */}
      {useAuth().isBroadcasting && (
        <div className="bg-emerald-600 text-white text-xs py-2 px-4 shadow-md flex items-center justify-between sticky top-[57px] z-30 max-w-lg mx-auto border-b border-emerald-700 animate-pulse">
          <div className="flex items-center space-x-2 font-black">
            <span className="h-2.5 w-2.5 rounded-full bg-white animate-ping"></span>
            <span>📡 Live Driver Broadcast Active</span>
          </div>
          <button
            onClick={() => useAuth().setIsBroadcasting(false)}
            className="bg-white/20 hover:bg-white/30 text-white px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase transition"
          >
            Stop
          </button>
        </div>
      )}

      {/* Fixed Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-100 shadow-[0_-4px_24px_rgba(0,0,0,0.06)] max-w-lg mx-auto">
        <div className="flex items-center">
          {mobileNavItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex-1 flex flex-col items-center justify-center py-2.5 px-1 transition-all duration-200 relative
                  ${isActive ? "text-blue-600" : "text-slate-400 hover:text-slate-600"}`}
              >
                {isActive && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-blue-600 rounded-b-full" />
                )}
                {item.icon(isActive)}
                <span className={`text-[9px] mt-1 font-semibold ${isActive ? "font-bold" : ""}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
