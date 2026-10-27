"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { validate10DigitPhone, sanitizePhoneInput } from "@/lib/validators";

type AuthMode = "SIGN_IN" | "REGISTER";
type Method = "EMAIL_OTP" | "PHONE_OTP";

export default function PassengerLoginPage() {
  const router = useRouter();
  const { user, loginAsPassengerWithGoogle, loginAsPassengerWithOtp, logout } = useAuth();

  const [authMode, setAuthMode] = useState<AuthMode>("SIGN_IN");
  const [method, setMethod] = useState<Method>("EMAIL_OTP");

  const [passengerName, setPassengerName] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [phoneInput, setPhoneInput] = useState("");

  const [otpStep, setOtpStep] = useState<boolean>(false);
  const [otpCode, setOtpCode] = useState<string>("");
  const [generatedOtp, setGeneratedOtp] = useState<string>("");
  const [showNotificationToast, setShowNotificationToast] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [otpTimer, setOtpTimer] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneInput(sanitizePhoneInput(e.target.value));
    setErrorMsg("");
  };

  const triggerSendOtp = () => {
    setErrorMsg("");
    if (method === "EMAIL_OTP") {
      if (!emailInput || !emailInput.includes("@")) {
        setErrorMsg("Please enter a valid email address.");
        return;
      }
    } else {
      const phoneCheck = validate10DigitPhone(phoneInput);
      if (!phoneCheck.isValid) {
        setErrorMsg(phoneCheck.message);
        return;
      }
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setOtpStep(true);
    setShowNotificationToast(true);
    setOtpTimer(30);

    const interval = setInterval(() => {
      setOtpTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (otpCode !== generatedOtp && otpCode !== "123456") {
      setErrorMsg("Invalid OTP code. Please enter the code sent to your inbox or try '123456'.");
      return;
    }

    const targetIdentifier = method === "EMAIL_OTP" ? emailInput : phoneInput;
    loginAsPassengerWithOtp(
      targetIdentifier,
      passengerName || (method === "EMAIL_OTP" ? emailInput.split("@")[0] : "Passenger")
    );
    router.push("/");
  };

  const handleGoogleSignIn = () => {
    setLoading(true);
    // Use the email entered in the input, or default to passenger@gmail.com
    const targetEmail = emailInput && emailInput.includes("@") ? emailInput : "passenger@gmail.com";
    const targetName = passengerName || (targetEmail.split("@")[0].replace(/\./g, " "));
    
    setTimeout(() => {
      loginAsPassengerWithGoogle(targetEmail, targetName);
      router.push("/");
    }, 800);
  };

  // Already logged in state
  if (user) {
    return (
      <div className="space-y-5">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Account</h1>
          <p className="text-sm text-slate-500 mt-0.5">You are signed in</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-sm">
          {/* Avatar */}
          <div className="flex items-center space-x-4">
            <div className="h-14 w-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-xl font-black shadow-md shadow-blue-600/25">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="font-black text-slate-900 text-lg">{user.name}</h2>
              <p className="text-xs text-slate-500">{user.emailOrPhone}</p>
              <span className="inline-block mt-1 text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                ✓ Signed In
              </span>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <button
              onClick={() => router.push("/")}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-black text-sm rounded-2xl shadow-md shadow-blue-600/20 transition"
            >
              Go to Home
            </button>
            <button
              onClick={logout}
              className="w-full py-3 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-sm rounded-2xl border border-rose-200 transition"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900">
          {authMode === "SIGN_IN" ? "Welcome back" : "Create account"}
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          {authMode === "SIGN_IN"
            ? "Sign in to book tickets & track buses"
            : "Join Coimbatore Transit for digital tickets"}
        </p>
      </div>

      {/* Auth Mode Tabs */}
      <div className="grid grid-cols-2 gap-1 bg-slate-100 p-1 rounded-2xl">
        <button
          onClick={() => { setAuthMode("SIGN_IN"); setOtpStep(false); setErrorMsg(""); }}
          className={`py-2.5 text-sm font-bold rounded-xl transition ${
            authMode === "SIGN_IN"
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          Sign In
        </button>
        <button
          onClick={() => { setAuthMode("REGISTER"); setOtpStep(false); setErrorMsg(""); }}
          className={`py-2.5 text-sm font-bold rounded-xl transition ${
            authMode === "REGISTER"
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          Register
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
        <div className="p-5 space-y-4">
          {/* Google Sign In */}
          <button
            onClick={handleGoogleSignIn}
            type="button"
            disabled={loading}
            className="w-full py-3 bg-white border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-sm rounded-2xl flex items-center justify-center space-x-3 transition shadow-sm disabled:opacity-60"
          >
            {loading ? (
              <svg className="w-4 h-4 animate-spin text-blue-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
            ) : (
              <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
            )}
            <span>Continue with Google</span>
          </button>

          {/* Divider */}
          <div className="relative flex items-center">
            <div className="flex-1 border-t border-slate-200" />
            <span className="mx-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-white px-1">
              or use OTP
            </span>
            <div className="flex-1 border-t border-slate-200" />
          </div>

          {/* Error */}
          {errorMsg && (
            <div className="flex items-start space-x-2.5 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 flex-shrink-0 mt-0.5">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
              </svg>
              <span>{errorMsg}</span>
            </div>
          )}

          {!otpStep ? (
            <div className="space-y-4">
              {/* Method Toggle */}
              <div className="flex items-center space-x-2 bg-slate-50 rounded-xl p-1 border border-slate-200">
                <button
                  type="button"
                  onClick={() => { setMethod("EMAIL_OTP"); setErrorMsg(""); }}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
                    method === "EMAIL_OTP" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
                  }`}
                >
                  Email OTP
                </button>
                <button
                  type="button"
                  onClick={() => { setMethod("PHONE_OTP"); setErrorMsg(""); }}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
                    method === "PHONE_OTP" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
                  }`}
                >
                  Phone OTP
                </button>
              </div>

              {/* Name (Register only) */}
              {authMode === "REGISTER" && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Full Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Ramesh Kumar"
                    value={passengerName}
                    onChange={(e) => setPassengerName(e.target.value)}
                    className="w-full bg-slate-50 text-slate-900 text-sm rounded-xl px-4 py-3 border border-slate-200 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition"
                  />
                </div>
              )}

              {/* Email or Phone Input */}
              {method === "EMAIL_OTP" ? (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Email Address</label>
                  <div className="relative">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                    <input
                      type="email"
                      placeholder="name@gmail.com"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      className="w-full bg-slate-50 text-slate-900 text-sm rounded-xl pl-10 pr-4 py-3 border border-slate-200 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    Mobile Number
                    <span className="ml-1.5 text-[10px] font-semibold text-slate-400">(10 digits)</span>
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-0 flex items-center h-full pl-3.5 pr-2.5 border-r border-slate-200">
                      <span className="text-xs font-bold text-slate-600 whitespace-nowrap">+91</span>
                    </div>
                    <input
                      type="tel"
                      maxLength={10}
                      placeholder="9876543210"
                      value={phoneInput}
                      onChange={handlePhoneChange}
                      className="w-full bg-slate-50 text-slate-900 text-sm rounded-xl pl-14 pr-4 py-3 border border-slate-200 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition"
                    />
                    <div className="absolute right-3 text-[10px] font-bold text-slate-400">
                      {phoneInput.length}/10
                    </div>
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={triggerSendOtp}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-sm rounded-2xl shadow-md shadow-blue-600/25 transition transform active:scale-[0.98]"
              >
                Send OTP Code →
              </button>
            </div>
          ) : (
            /* OTP Verification */
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              {/* Inbox Dispatch Banner */}
              <div className="bg-slate-900 text-white p-4 rounded-2xl space-y-2 shadow-lg relative overflow-hidden">
                <div className="flex items-center space-x-2 text-xs text-blue-400 font-bold uppercase tracking-wider">
                  <span className="h-2 w-2 rounded-full bg-blue-400 animate-ping"></span>
                  <span>{method === "EMAIL_OTP" ? "Email Inbox Notification" : "SMS Inbox Notification"}</span>
                </div>
                <div className="text-xs text-slate-300">
                  Verification code sent to <span className="font-bold text-white">{method === "EMAIL_OTP" ? emailInput : `+91 ${phoneInput}`}</span>.
                </div>
                
                {/* Simulated Notification Banner */}
                {showNotificationToast && (
                  <div className="bg-blue-600/90 backdrop-blur text-white text-xs p-3 rounded-xl flex items-center justify-between border border-blue-400/30 mt-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-base">📩</span>
                      <div>
                        <div className="font-bold">New Notification</div>
                        <div className="text-[11px] text-blue-100">Your OTP Code is <span className="font-mono font-black text-yellow-300 tracking-wider">{generatedOtp}</span></div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setOtpCode(generatedOtp)}
                      className="bg-white text-blue-700 px-2.5 py-1 rounded-lg text-[10px] font-black hover:bg-blue-50 transition"
                    >
                      Auto-fill
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 text-center block">
                  Enter 6-Digit OTP Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="• • • • • •"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                  className="w-full bg-slate-50 text-slate-900 text-center text-2xl font-mono tracking-[0.5em] rounded-2xl py-3.5 border-2 border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
                  autoFocus
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm rounded-2xl shadow-md shadow-emerald-600/25 transition transform active:scale-[0.98]"
              >
                Verify & Continue →
              </button>

              <div className="flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => { setOtpStep(false); setOtpCode(""); }}
                  className="text-slate-500 hover:text-slate-900 font-semibold flex items-center space-x-1"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                    <path d="M19 12H5M12 19l-7-7 7-7"/>
                  </svg>
                  <span>Edit details</span>
                </button>
                <button
                  type="button"
                  disabled={otpTimer > 0}
                  onClick={triggerSendOtp}
                  className={`font-semibold ${otpTimer > 0 ? "text-slate-400" : "text-blue-600 hover:underline"}`}
                >
                  {otpTimer > 0 ? `Resend in ${otpTimer}s` : "Resend OTP"}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Driver Portal Footer */}
        <div className="px-5 py-4 bg-slate-50 border-t border-slate-100">
          <Link
            href="/driver/login"
            className="flex items-center justify-center space-x-2 text-xs text-slate-500 hover:text-blue-600 transition font-semibold"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <rect x="1" y="3" width="15" height="13" rx="2"/>
              <path d="M16 8h4l3 3v5h-7V8z"/>
              <circle cx="5.5" cy="18.5" r="2.5"/>
              <circle cx="18.5" cy="18.5" r="2.5"/>
            </svg>
            <span>Bus Driver? Access <span className="text-blue-600 font-bold">Driver Portal →</span></span>
          </Link>
        </div>
      </div>
    </div>
  );
}
