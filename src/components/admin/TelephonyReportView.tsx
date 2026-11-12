"use client";

import React, { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  BarChart3,
  Calendar,
  CheckCircle2,
} from "lucide-react";
import {
  ADMIN_CLIENT_ORGS,
  DEFAULT_REPORT_DATE_RANGE,
  DEMO_CALL_LOGS,
} from "@/data/adminTelephony";
import type { NumberSource } from "@/data/telephony";
import {
  buildAdminTelephonyReport,
  formatCompletionRatio,
  type CallVolumeClientRow,
  type CompletedCallsClientRow,
  type DateRangeFilter,
} from "@/lib/adminTelephonyReport";
import { SourceBadge } from "@/components/integrations/Badges";
import { DemoDataBadge } from "./AdminBadges";
import {
  CallVolumeCharts,
  CompletedCallsCharts,
} from "./TelephonyReportCharts";

interface TelephonyReportViewProps {
  onBack: () => void;
}

const DATE_PRESETS: Array<{ label: string; range: DateRangeFilter }> = [
  { label: "Last 7 Days", range: { from: "2026-11-06", to: "2026-11-12" } },
  { label: "Last 30 Days", range: { from: "2026-10-14", to: "2026-11-12" } },
  { label: "All Demo Logs", range: { from: "2026-10-01", to: "2026-11-12" } },
  { label: "Sep (Zero Calls)", range: { from: "2026-09-01", to: "2026-09-30" } },
];

function sumOutboundCalls(rows: CompletedCallsClientRow[]): {
  outbound: number;
  completed: number;
} {
  return rows.reduce(
    (acc, row) => ({
      outbound: acc.outbound + row.outboundCalls,
      completed: acc.completed + row.completedCalls,
    }),
    { outbound: 0, completed: 0 }
  );
}

function RatioPill({
  ratio,
  outboundCalls,
  completedCalls,
}: {
  ratio: string;
  outboundCalls: number;
  completedCalls: number;
}) {
  if (outboundCalls === 0) {
    return <span className="font-medium text-slate-400">{ratio}</span>;
  }

  const pct = (completedCalls / outboundCalls) * 100;
  const colorClasses =
    pct >= 75
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : pct >= 50
        ? "border-amber-200 bg-amber-50 text-amber-800"
        : "border-rose-200 bg-rose-50 text-rose-700";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[12px] font-semibold tabular-nums ${colorClasses}`}
    >
      {ratio}
    </span>
  );
}

export function TelephonyReportView({ onBack }: TelephonyReportViewProps) {
  const [dateRange, setDateRange] = useState<DateRangeFilter>(
    DEFAULT_REPORT_DATE_RANGE
  );

  const isInvalidRange = Boolean(
    dateRange.from && dateRange.to && dateRange.from > dateRange.to
  );

  const report = useMemo(
    () =>
      isInvalidRange
        ? buildAdminTelephonyReport(ADMIN_CLIENT_ORGS, [], dateRange)
        : buildAdminTelephonyReport(
            ADMIN_CLIENT_ORGS,
            DEMO_CALL_LOGS,
            dateRange
          ),
    [dateRange, isInvalidRange]
  );

  const clientTotals = useMemo(
    () => sumOutboundCalls(report.completedCalls.clientNumbers),
    [report.completedCalls.clientNumbers]
  );
  const systemTotals = useMemo(
    () => sumOutboundCalls(report.completedCalls.systemNumbers),
    [report.completedCalls.systemNumbers]
  );

  const totalOutbound = clientTotals.outbound + systemTotals.outbound;
  const totalCompleted = clientTotals.completed + systemTotals.completed;
  const overallRatio = formatCompletionRatio(totalCompleted, totalOutbound);

  return (
    <div className="mt-5 space-y-6" data-testid="report-view">
      {/* Top Toolbar + Date-Range Filter */}
      <div className="flex flex-col gap-4 rounded-xl border border-slate-200/80 bg-slate-50/70 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[12.5px] font-medium text-slate-700 transition-colors hover:bg-slate-100"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Telephony Configs
            </button>
            <span className="inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-slate-800">
              <BarChart3 className="h-4 w-4 text-[#1D4ED8]" />
              Outbound Telephony Report
            </span>
            <DemoDataBadge label="Demo Data • Demo Call Logs" />
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {DATE_PRESETS.map((preset) => {
              const isActive =
                dateRange.from === preset.range.from &&
                dateRange.to === preset.range.to;

              return (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => setDateRange(preset.range)}
                  className={`rounded-full px-3 py-1 text-[12px] font-medium transition-colors ${
                    isActive
                      ? "bg-[#1D4ED8] text-white shadow-2xs"
                      : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Date Inputs */}
        <div className="flex flex-wrap items-center gap-3 border-t border-slate-200/70 pt-3">
          <span className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-slate-600">
            <Calendar className="h-3.5 w-3.5 text-slate-400" />
            Date Range:
          </span>
          <label className="inline-flex items-center gap-2 text-[12.5px] text-slate-600">
            <span>From</span>
            <input
              type="date"
              aria-label="Report start date"
              max={dateRange.to || undefined}
              value={dateRange.from}
              onChange={(e) =>
                setDateRange((prev) => ({ ...prev, from: e.target.value }))
              }
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[12.5px] text-slate-800 outline-none focus:border-[#1D4ED8] focus:ring-2 focus:ring-blue-100"
            />
          </label>
          <label className="inline-flex items-center gap-2 text-[12.5px] text-slate-600">
            <span>To</span>
            <input
              type="date"
              aria-label="Report end date"
              min={dateRange.from || undefined}
              value={dateRange.to}
              onChange={(e) =>
                setDateRange((prev) => ({ ...prev, to: e.target.value }))
              }
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[12.5px] text-slate-800 outline-none focus:border-[#1D4ED8] focus:ring-2 focus:ring-blue-100"
            />
          </label>
        </div>

        {isInvalidRange && (
          <div
            role="alert"
            className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-[12.5px] text-amber-900"
          >
            <span className="inline-flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600" />
              Start date cannot be after end date. Adjust the range to view call
              data.
            </span>
            <button
              type="button"
              onClick={() => setDateRange(DEFAULT_REPORT_DATE_RANGE)}
              className="font-medium text-amber-900 underline underline-offset-2 hover:text-amber-700"
            >
              Reset to Last 30 Days
            </button>
          </div>
        )}
      </div>

      {/* Call Volume */}
      <section
        aria-labelledby="call-volume-heading"
        data-testid="category-call-volume"
        className="space-y-4 rounded-2xl border border-blue-200/80 bg-blue-50/20 p-4 sm:p-5"
      >
        <div className="flex flex-col gap-2 border-b border-blue-200/60 pb-3.5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-100/90 text-[#1D4ED8]">
              <BarChart3 className="h-4.5 w-4.5" />
            </div>
            <div>
              <h3
                id="call-volume-heading"
                className="text-[15.5px] font-semibold text-slate-900"
              >
                Call Volume
              </h3>
              <p className="mt-0.5 text-[12.5px] text-slate-600">
                Top 5 outbound originating numbers per client and number source,
                ranked highest call count first.
              </p>
            </div>
          </div>

          <span className="self-start rounded-full border border-blue-200 bg-white px-3 py-1 text-[12px] font-medium text-blue-800 tabular-nums sm:self-center">
            Total Outbound: {totalOutbound}
          </span>
        </div>

        <CallVolumeCharts
          clientRows={report.completedCalls.clientNumbers}
          systemRows={report.completedCalls.systemNumbers}
          dailyTrend={report.callVolume.dailyTrend}
        />

        <CallVolumeTable
          title="Client Numbers"
          source="Client-added"
          subtotalCalls={clientTotals.outbound}
          testId="call-volume-client-table"
          rows={report.callVolume.clientNumbers}
        />

        <CallVolumeTable
          title="System Numbers"
          source="MantraAssist-provided"
          subtotalCalls={systemTotals.outbound}
          testId="call-volume-system-table"
          rows={report.callVolume.systemNumbers}
        />
      </section>

      {/* Completed Calls */}
      <section
        aria-labelledby="completed-calls-heading"
        data-testid="category-completed-calls"
        className="space-y-4 rounded-2xl border border-emerald-200/80 bg-emerald-50/20 p-4 sm:p-5"
      >
        <div className="flex flex-col gap-2 border-b border-emerald-200/60 pb-3.5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100/90 text-emerald-700">
              <CheckCircle2 className="h-4.5 w-4.5" />
            </div>
            <div>
              <h3
                id="completed-calls-heading"
                className="text-[15.5px] font-semibold text-slate-900"
              >
                Completed Calls
              </h3>
              <p className="mt-0.5 text-[12.5px] text-slate-600">
                All outbound call attempts and completed calls across all numbers
                for each client and source.
              </p>
            </div>
          </div>

          <span className="self-start rounded-full border border-emerald-200 bg-white px-3 py-1 text-[12px] font-medium text-emerald-800 tabular-nums sm:self-center">
            Completed: {totalCompleted} / {totalOutbound} ({overallRatio})
          </span>
        </div>

        <CompletedCallsCharts
          clientRows={report.completedCalls.clientNumbers}
          systemRows={report.completedCalls.systemNumbers}
          outcomeBreakdown={report.completedCalls.outcomeBreakdown}
        />

        <CompletedCallsTable
          title="Client Numbers"
          source="Client-added"
          subtotal={clientTotals}
          testId="completed-calls-client-table"
          rows={report.completedCalls.clientNumbers}
        />

        <CompletedCallsTable
          title="System Numbers"
          source="MantraAssist-provided"
          subtotal={systemTotals}
          testId="completed-calls-system-table"
          rows={report.completedCalls.systemNumbers}
        />
      </section>
    </div>
  );
}

function SubTableHeader({
  title,
  source,
  metricLabel,
}: {
  title: string;
  source: NumberSource;
  metricLabel: string;
}) {
  const isClient = source === "Client-added";

  return (
    <div
      className={`flex flex-wrap items-center justify-between gap-2 rounded-t-xl border border-b-0 border-slate-200/90 border-l-4 bg-white px-4 py-2.5 ${
        isClient ? "border-l-amber-500" : "border-l-indigo-500"
      }`}
    >
      <div className="flex flex-wrap items-center gap-2">
        <h4 className="text-[13.5px] font-semibold text-slate-800">{title}</h4>
        <SourceBadge source={source} />
      </div>
      <span className="text-[12px] font-medium text-slate-500 tabular-nums">
        {metricLabel}
      </span>
    </div>
  );
}

function CallVolumeTable({
  title,
  source,
  subtotalCalls,
  testId,
  rows,
}: {
  title: string;
  source: NumberSource;
  subtotalCalls: number;
  testId: string;
  rows: CallVolumeClientRow[];
}) {
  return (
    <div data-testid={testId}>
      <SubTableHeader
        title={title}
        source={source}
        metricLabel={`${subtotalCalls} outbound ${subtotalCalls === 1 ? "call" : "calls"}`}
      />
      <div className="overflow-x-auto rounded-b-xl border border-slate-200/90">
        <table className="min-w-[820px] w-full border-collapse text-left">
          <thead>
            <tr className="bg-[#1E293B] text-[11px] font-semibold tracking-wider text-white uppercase">
              <th scope="col" className="border-r border-slate-700/70 px-4 py-3">
                Client Name
              </th>
              <th scope="col" className="border-r border-slate-700/70 px-4 py-3">
                #1
              </th>
              <th scope="col" className="border-r border-slate-700/70 px-4 py-3">
                #2
              </th>
              <th scope="col" className="border-r border-slate-700/70 px-4 py-3">
                #3
              </th>
              <th scope="col" className="border-r border-slate-700/70 px-4 py-3">
                #4
              </th>
              <th scope="col" className="px-4 py-3">
                #5
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white text-[13px]">
            {rows.map((row) => (
              <tr key={row.clientId} className="hover:bg-slate-50/70">
                <td className="px-4 py-3 font-medium text-slate-900">
                  {row.clientName}
                </td>
                {row.ranks.map((rank, index) => (
                  <td key={index} className="px-4 py-3 align-middle">
                    {rank ? (
                      <div className="flex flex-col gap-0.5">
                        <span className="font-mono text-[12.5px] font-medium text-slate-800 tabular-nums">
                          {rank.phoneNumber}
                        </span>
                        <span className="text-[11.5px] font-medium text-blue-700 tabular-nums">
                          {rank.outboundCalls}{" "}
                          {rank.outboundCalls === 1 ? "call" : "calls"}
                        </span>
                      </div>
                    ) : (
                      <span
                        className="select-none text-slate-300"
                        aria-hidden="true"
                      >
                        —
                      </span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CompletedCallsTable({
  title,
  source,
  subtotal,
  testId,
  rows,
}: {
  title: string;
  source: NumberSource;
  subtotal: { outbound: number; completed: number };
  testId: string;
  rows: CompletedCallsClientRow[];
}) {
  const subtotalRatio = formatCompletionRatio(
    subtotal.completed,
    subtotal.outbound
  );

  return (
    <div data-testid={testId}>
      <SubTableHeader
        title={title}
        source={source}
        metricLabel={`${subtotal.completed} / ${subtotal.outbound} completed (${subtotalRatio})`}
      />
      <div className="overflow-x-auto rounded-b-xl border border-slate-200/90">
        <table className="min-w-[640px] w-full border-collapse text-left">
          <thead>
            <tr className="bg-[#1E293B] text-[11px] font-semibold tracking-wider text-white uppercase">
              <th scope="col" className="border-r border-slate-700/70 px-4 py-3">
                Client Name
              </th>
              <th scope="col" className="border-r border-slate-700/70 px-4 py-3">
                Outbound Calls
              </th>
              <th scope="col" className="border-r border-slate-700/70 px-4 py-3">
                Completed Calls
              </th>
              <th scope="col" className="px-4 py-3">
                Completion Ratio
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white text-[13px]">
            {rows.map((row) => (
              <tr key={row.clientId} className="hover:bg-slate-50/70">
                <td className="px-4 py-3 font-medium text-slate-900">
                  {row.clientName}
                </td>
                <td className="px-4 py-3 font-medium text-slate-700 tabular-nums">
                  {row.outboundCalls}
                </td>
                <td className="px-4 py-3 font-medium text-slate-700 tabular-nums">
                  {row.completedCalls}
                </td>
                <td className="px-4 py-3">
                  <RatioPill
                    ratio={row.completionRatio}
                    outboundCalls={row.outboundCalls}
                    completedCalls={row.completedCalls}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
