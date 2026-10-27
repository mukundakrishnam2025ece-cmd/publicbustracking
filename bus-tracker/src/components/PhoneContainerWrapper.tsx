"use client";

import React from "react";

export default function PhoneContainerWrapper({ children }: { children: React.ReactNode }) {
  // Pure responsive container without external phone bezel frame wrapper!
  return (
    <div className="flex-1 w-full max-w-2xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
      {children}
    </div>
  );
}
