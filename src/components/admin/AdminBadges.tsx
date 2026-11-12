"use client";

import React from "react";

export function StatusBadge({ status }: { status: "Active" | "Inactive" }) {
  const isActive = status === "Active";

  return (
    <span
      className={
        isActive
          ? "inline-flex items-center gap-1.5 rounded-full border border-emerald-200/90 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-medium text-emerald-700 whitespace-nowrap"
          : "inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-600 whitespace-nowrap"
      }
    >
      <span
        className={
          isActive
            ? "h-1.5 w-1.5 rounded-full bg-emerald-500"
            : "h-1.5 w-1.5 rounded-full bg-slate-400"
        }
      />
      {status}
    </span>
  );
}

export function DemoDataBadge({ label = "Demo Data" }: { label?: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-600 whitespace-nowrap">
      {label}
    </span>
  );
}

