"use client";

import React, { useState } from "react";
import type {
  CompletedCallsClientRow,
  DailyVolumePoint,
  OutcomeBreakdown,
} from "@/lib/adminTelephonyReport";

interface CallVolumeChartsProps {
  clientRows: CompletedCallsClientRow[];
  systemRows: CompletedCallsClientRow[];
  dailyTrend: DailyVolumePoint[];
}

interface CompletedCallsChartsProps {
  clientRows: CompletedCallsClientRow[];
  systemRows: CompletedCallsClientRow[];
  outcomeBreakdown: OutcomeBreakdown;
}

function formatShortDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  if (!year || !month || !day) return isoDate;
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

function ChartEmptyState({ message }: { message: string }) {
  return (
    <div className="flex h-44 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/60 px-4 text-center text-[12.5px] text-slate-500">
      {message}
    </div>
  );
}

export function CallVolumeCharts({
  clientRows,
  systemRows,
  dailyTrend,
}: CallVolumeChartsProps) {
  const [hoveredDay, setHoveredDay] = useState<DailyVolumePoint | null>(null);

  const systemByClient = new Map(
    systemRows.map((row) => [row.clientId, row.outboundCalls])
  );

  const clientTotals = clientRows.map((row) => {
    const clientCalls = row.outboundCalls;
    const systemCalls = systemByClient.get(row.clientId) ?? 0;
    return {
      clientId: row.clientId,
      clientName: row.clientName,
      clientCalls,
      systemCalls,
      totalCalls: clientCalls + systemCalls,
    };
  });

  const maxClientTotal = Math.max(
    1,
    ...clientTotals.map((item) => item.totalCalls)
  );
  const totalAllCalls = clientTotals.reduce(
    (sum, item) => sum + item.totalCalls,
    0
  );

  const maxDailyTotal = Math.max(
    1,
    ...dailyTrend.map((point) => point.totalCalls)
  );

  return (
    <div
      className="grid grid-cols-1 gap-4 lg:grid-cols-2"
      data-testid="call-volume-charts"
    >
      {/* Chart 1: Outbound Call Volume by Client & Source */}
      <div className="rounded-xl border border-slate-200/90 bg-white p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h4 className="text-[13.5px] font-semibold text-slate-800">
              Volume by Client &amp; Source
            </h4>
            <p className="text-[11.5px] text-slate-500">
              Total outbound attempts split by Client vs System numbers
            </p>
          </div>
          <div className="flex items-center gap-3 text-[11px] font-medium text-slate-600">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-xs bg-amber-500" />
              Client
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-xs bg-indigo-500" />
              System
            </span>
          </div>
        </div>

        {totalAllCalls === 0 ? (
          <ChartEmptyState message="No outbound calls recorded in the selected date range." />
        ) : (
          <div className="space-y-3 pt-1">
            {clientTotals.map((item) => {
              const clientWidthPct = (item.clientCalls / maxClientTotal) * 100;
              const systemWidthPct = (item.systemCalls / maxClientTotal) * 100;

              return (
                <div key={item.clientId} className="space-y-1">
                  <div className="flex items-center justify-between gap-2 text-[12px]">
                    <span className="truncate font-medium text-slate-800">
                      {item.clientName}
                    </span>
                    <span className="shrink-0 text-[11.5px] text-slate-500 tabular-nums">
                      <span className="font-semibold text-slate-800">
                        {item.totalCalls}
                      </span>{" "}
                      ({item.clientCalls}C / {item.systemCalls}S)
                    </span>
                  </div>
                  <div
                    className="flex h-3.5 w-full overflow-hidden rounded-full bg-slate-100"
                    role="img"
                    aria-label={`${item.clientName}: ${item.clientCalls} client calls, ${item.systemCalls} system calls`}
                  >
                    {item.clientCalls > 0 && (
                      <div
                        className="h-full bg-amber-500 transition-all duration-300"
                        style={{ width: `${clientWidthPct}%` }}
                        title={`Client Numbers: ${item.clientCalls}`}
                      />
                    )}
                    {item.systemCalls > 0 && (
                      <div
                        className="h-full bg-indigo-500 transition-all duration-300"
                        style={{ width: `${systemWidthPct}%` }}
                        title={`System Numbers: ${item.systemCalls}`}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Chart 2: Daily Outbound Call Trend (SVG Stacked Bar Chart) */}
      <div className="rounded-xl border border-slate-200/90 bg-white p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h4 className="text-[13.5px] font-semibold text-slate-800">
              Daily Outbound Trend
            </h4>
            <p className="text-[11.5px] text-slate-500">
              {hoveredDay
                ? `${formatShortDate(hoveredDay.date)}: ${hoveredDay.totalCalls} calls (${hoveredDay.clientCalls} Client, ${hoveredDay.systemCalls} System)`
                : "Outbound calls per active day (hover a bar for breakdown)"}
            </p>
          </div>
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-600 tabular-nums">
            {dailyTrend.length} active{" "}
            {dailyTrend.length === 1 ? "day" : "days"}
          </span>
        </div>

        {dailyTrend.length === 0 ? (
          <ChartEmptyState message="No daily outbound activity in the selected date range." />
        ) : (
          <div className="w-full overflow-x-auto">
            <svg
              viewBox="0 0 420 170"
              className="h-44 w-full min-w-[300px]"
              role="img"
              aria-label="Daily outbound call volume trend chart"
            >
              {/* Horizontal Grid Lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
                const y = 132 - ratio * 112;
                const val = Math.round(maxDailyTotal * ratio);
                return (
                  <g key={ratio}>
                    <line
                      x1="30"
                      x2="410"
                      y1={y}
                      y2={y}
                      stroke="#E2E8F0"
                      strokeDasharray={ratio === 0 ? undefined : "3 3"}
                    />
                    <text
                      x="24"
                      y={y + 3}
                      textAnchor="end"
                      fontSize="9.5"
                      fill="#94A3B8"
                    >
                      {val}
                    </text>
                  </g>
                );
              })}

              {/* Stacked Bars */}
              {dailyTrend.map((point, idx) => {
                const chartWidth = 372;
                const slotWidth = chartWidth / dailyTrend.length;
                const barWidth = Math.min(20, Math.max(6, slotWidth * 0.62));
                const x = 34 + idx * slotWidth + (slotWidth - barWidth) / 2;

                const clientHeight = (point.clientCalls / maxDailyTotal) * 112;
                const systemHeight = (point.systemCalls / maxDailyTotal) * 112;
                const clientY = 132 - clientHeight;
                const systemY = clientY - systemHeight;

                const showLabel =
                  dailyTrend.length <= 8 ||
                  idx === 0 ||
                  idx === dailyTrend.length - 1 ||
                  idx % Math.ceil(dailyTrend.length / 6) === 0;

                return (
                  <g
                    key={point.date}
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredDay(point)}
                    onMouseLeave={() => setHoveredDay(null)}
                  >
                    <title>
                      {`${point.date}: ${point.totalCalls} calls (${point.clientCalls} Client, ${point.systemCalls} System)`}
                    </title>
                    <rect
                      x={x - 2}
                      y={16}
                      width={barWidth + 4}
                      height={120}
                      fill="transparent"
                    />
                    {point.clientCalls > 0 && (
                      <rect
                        x={x}
                        y={clientY}
                        width={barWidth}
                        height={clientHeight}
                        rx={point.systemCalls === 0 ? 3 : 0}
                        fill="#F59E0B"
                      />
                    )}
                    {point.systemCalls > 0 && (
                      <rect
                        x={x}
                        y={systemY}
                        width={barWidth}
                        height={systemHeight}
                        rx={3}
                        fill="#6366F1"
                      />
                    )}
                    {showLabel && (
                      <text
                        x={x + barWidth / 2}
                        y={152}
                        textAnchor="middle"
                        fontSize="9"
                        fill="#64748B"
                      >
                        {formatShortDate(point.date)}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}

export function CompletedCallsCharts({
  clientRows,
  systemRows,
  outcomeBreakdown,
}: CompletedCallsChartsProps) {
  const systemByClient = new Map(systemRows.map((row) => [row.clientId, row]));

  const totalAttempts =
    outcomeBreakdown.completed +
    outcomeBreakdown.noAnswer +
    outcomeBreakdown.failed +
    outcomeBreakdown.busy;

  const overallCompletionPct =
    totalAttempts > 0
      ? Math.round((outcomeBreakdown.completed / totalAttempts) * 100)
      : 0;

  // Donut geometry
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const segments = [
    {
      label: "Completed",
      count: outcomeBreakdown.completed,
      color: "#10B981",
      dotClass: "bg-emerald-500",
    },
    {
      label: "No Answer",
      count: outcomeBreakdown.noAnswer,
      color: "#F59E0B",
      dotClass: "bg-amber-500",
    },
    {
      label: "Failed",
      count: outcomeBreakdown.failed,
      color: "#F43F5E",
      dotClass: "bg-rose-500",
    },
    {
      label: "Busy",
      count: outcomeBreakdown.busy,
      color: "#64748B",
      dotClass: "bg-slate-500",
    },
  ];

  let cumulativeOffset = 0;

  return (
    <div
      className="grid grid-cols-1 gap-4 lg:grid-cols-2"
      data-testid="completed-calls-charts"
    >
      {/* Chart 1: Completion Ratio by Client & Source */}
      <div className="rounded-xl border border-slate-200/90 bg-white p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h4 className="text-[13.5px] font-semibold text-slate-800">
              Completion Rate by Client
            </h4>
            <p className="text-[11.5px] text-slate-500">
              Client Numbers vs System Numbers completion percentage
            </p>
          </div>
          <div className="flex items-center gap-3 text-[11px] font-medium text-slate-600">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-xs bg-amber-500" />
              Client
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-xs bg-indigo-500" />
              System
            </span>
          </div>
        </div>

        {totalAttempts === 0 ? (
          <ChartEmptyState message="No outbound attempts to calculate completion rates." />
        ) : (
          <div className="space-y-3 pt-1">
            {clientRows.map((clientRow) => {
              const sysRow = systemByClient.get(clientRow.clientId);
              const clientPct =
                clientRow.outboundCalls > 0
                  ? (clientRow.completedCalls / clientRow.outboundCalls) * 100
                  : 0;
              const sysOutbound = sysRow?.outboundCalls ?? 0;
              const sysCompleted = sysRow?.completedCalls ?? 0;
              const sysPct =
                sysOutbound > 0 ? (sysCompleted / sysOutbound) * 100 : 0;

              return (
                <div key={clientRow.clientId} className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2 text-[12px]">
                    <span className="truncate font-medium text-slate-800">
                      {clientRow.clientName}
                    </span>
                    <span className="shrink-0 text-[11px] text-slate-500 tabular-nums">
                      C: {clientRow.completionRatio} • S:{" "}
                      {sysRow?.completionRatio ?? "—"}
                    </span>
                  </div>

                  {/* Client bar */}
                  <div className="flex items-center gap-2">
                    <span className="w-11 shrink-0 text-[10.5px] font-medium text-slate-400">
                      Client
                    </span>
                    <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-amber-500 transition-all duration-300"
                        style={{ width: `${clientPct}%` }}
                      />
                    </div>
                  </div>

                  {/* System bar */}
                  <div className="flex items-center gap-2">
                    <span className="w-11 shrink-0 text-[10.5px] font-medium text-slate-400">
                      System
                    </span>
                    <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-indigo-500 transition-all duration-300"
                        style={{ width: `${sysPct}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Chart 2: Call Outcomes Donut Breakdown */}
      <div className="rounded-xl border border-slate-200/90 bg-white p-4">
        <div className="mb-3">
          <h4 className="text-[13.5px] font-semibold text-slate-800">
            Outbound Call Outcomes
          </h4>
          <p className="text-[11.5px] text-slate-500">
            Status distribution across all outbound attempts in range
          </p>
        </div>

        {totalAttempts === 0 ? (
          <ChartEmptyState message="No outbound call outcomes recorded in this date range." />
        ) : (
          <div className="flex flex-col items-center gap-5 py-1 sm:flex-row">
            <div className="relative flex h-36 w-36 shrink-0 items-center justify-center">
              <svg
                viewBox="0 0 140 140"
                className="h-36 w-36 -rotate-90"
                role="img"
                aria-label={`Overall completion rate ${overallCompletionPct}% across ${totalAttempts} outbound attempts`}
              >
                <circle
                  cx="70"
                  cy="70"
                  r={radius}
                  fill="none"
                  stroke="#F1F5F9"
                  strokeWidth="16"
                />
                {segments.map((seg) => {
                  if (seg.count === 0) return null;
                  const segLength = (seg.count / totalAttempts) * circumference;
                  const dashArray = `${segLength} ${circumference - segLength}`;
                  const dashOffset = -cumulativeOffset;
                  cumulativeOffset += segLength;

                  return (
                    <circle
                      key={seg.label}
                      cx="70"
                      cy="70"
                      r={radius}
                      fill="none"
                      stroke={seg.color}
                      strokeWidth="16"
                      strokeDasharray={dashArray}
                      strokeDashoffset={dashOffset}
                    >
                      <title>{`${seg.label}: ${seg.count}`}</title>
                    </circle>
                  );
                })}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-[19px] font-bold text-slate-900 tabular-nums">
                  {overallCompletionPct}%
                </span>
                <span className="text-[10.5px] font-medium text-slate-500">
                  Completed
                </span>
              </div>
            </div>

            <div className="grid w-full flex-1 grid-cols-1 gap-2">
              {segments.map((seg) => {
                const pct = Math.round((seg.count / totalAttempts) * 100);
                return (
                  <div
                    key={seg.label}
                    className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50/70 px-3 py-1.5 text-[12px]"
                  >
                    <span className="inline-flex items-center gap-2 font-medium text-slate-700">
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${seg.dotClass}`}
                      />
                      {seg.label}
                    </span>
                    <span className="font-semibold text-slate-800 tabular-nums">
                      {seg.count}{" "}
                      <span className="font-normal text-slate-400">
                        ({pct}%)
                      </span>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

