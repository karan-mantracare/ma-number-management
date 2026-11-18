"use client";

import React from "react";
import Link from "next/link";

interface PortalSwitcherProps {
  current: "client" | "admin";
}

export function PortalSwitcher({ current }: PortalSwitcherProps) {
  return (
    <div
      className="inline-flex items-center rounded-full border border-slate-200/90 bg-slate-100/90 p-0.5 text-[12px] font-medium shadow-2xs"
      role="navigation"
      aria-label="Portal switcher"
    >
      <Link
        href="/cs/integration"
        aria-current={current === "client" ? "page" : undefined}
        className={`rounded-full px-3 py-1 transition-all ${
          current === "client"
            ? "bg-white font-semibold text-slate-900 shadow-xs"
            : "text-slate-600 hover:text-slate-900"
        }`}
      >
        Client
      </Link>
      <span className="px-0.5 text-slate-300 select-none">|</span>
      <Link
        href="/admin/integration"
        aria-current={current === "admin" ? "page" : undefined}
        className={`rounded-full px-3 py-1 transition-all ${
          current === "admin"
            ? "bg-white font-semibold text-slate-900 shadow-xs"
            : "text-slate-600 hover:text-slate-900"
        }`}
      >
        Admin
      </Link>
    </div>
  );
}
