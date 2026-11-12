"use client";

import React from "react";
import { PhoneIncoming, PhoneOutgoing } from "lucide-react";
import type { NumberSource, RoutingDirection } from "@/data/telephony";

export function DirectionBadge({ direction }: { direction: RoutingDirection }) {
  if (direction === "inbound") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200/80 bg-emerald-50 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-700 whitespace-nowrap">
        <PhoneIncoming className="h-3 w-3" />
        INBOUND
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-blue-200/80 bg-blue-50 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-blue-700 whitespace-nowrap">
      <PhoneOutgoing className="h-3 w-3" />
      OUTBOUND
    </span>
  );
}

export function DefaultBadge() {
  return (
    <span className="inline-flex items-center rounded-full border border-cyan-200/80 bg-cyan-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-cyan-700 whitespace-nowrap">
      DEFAULT
    </span>
  );
}

export function SourceBadge({ source }: { source: NumberSource }) {
  const isMantraAssist = source === "MantraAssist-provided";

  return (
    <span
      className={
        isMantraAssist
          ? "inline-flex items-center gap-1.5 rounded-full border border-indigo-200/90 bg-indigo-50 px-2 py-0.5 text-[10.5px] font-medium text-indigo-700 whitespace-nowrap"
          : "inline-flex items-center gap-1.5 rounded-full border border-amber-200/90 bg-amber-50 px-2 py-0.5 text-[10.5px] font-medium text-amber-800 whitespace-nowrap"
      }
      data-testid="number-source-badge"
    >
      <span
        className={
          isMantraAssist
            ? "h-1.5 w-1.5 rounded-full bg-indigo-500"
            : "h-1.5 w-1.5 rounded-full bg-amber-500"
        }
      />
      {source}
    </span>
  );
}

