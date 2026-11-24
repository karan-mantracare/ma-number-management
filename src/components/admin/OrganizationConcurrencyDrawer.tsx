"use client";

import React, { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowUpRight,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Minus,
  Plus,
  TrendingUp,
  X,
  Zap,
} from "lucide-react";
import { AdminOrganization, ConcurrencyDataPoint } from "@/data/adminOrganizations";

interface OrganizationConcurrencyDrawerProps {
  organization: AdminOrganization;
  isOpen: boolean;
  onClose: () => void;
  onUpdateLimit: (orgId: string, newLimit: number) => void;
}

type DatePreset = "24h" | "7d" | "14d" | "30d" | "custom";

export function OrganizationConcurrencyDrawer({
  organization,
  isOpen,
  onClose,
  onUpdateLimit,
}: OrganizationConcurrencyDrawerProps) {
  const [datePreset, setDatePreset] = useState<DatePreset>("7d");
  const [startDate, setStartDate] = useState("2026-11-17");
  const [endDate, setEndDate] = useState("2026-11-24");
  const [limitInput, setLimitInput] = useState<number>(
    organization.concurrencyLimit
  );
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activePoint, setActivePoint] = useState<ConcurrencyDataPoint | null>(
    null
  );

  // Sync state if organization changes
  React.useEffect(() => {
    setLimitInput(organization.concurrencyLimit);
    setSaveSuccess(false);
  }, [organization.concurrencyLimit, organization.id]);

  // Filter concurrency history based on date preset or range
  const filteredData = useMemo(() => {
    const all = organization.concurrencyHistory || [];
    if (all.length === 0) return [];

    if (datePreset === "24h") {
      return all.slice(-4); // last 24h (4 checkpoints)
    }
    if (datePreset === "7d") {
      return all.slice(-28); // last 7 days (28 checkpoints)
    }
    if (datePreset === "14d") {
      return all.slice(-56);
    }
    if (datePreset === "30d") {
      return all;
    }

    // Custom date range
    return all.filter((pt) => pt.date >= startDate && pt.date <= endDate);
  }, [organization.concurrencyHistory, datePreset, startDate, endDate]);

  // Concurrency analytics
  const { maxConcurrency, avgConcurrency, spikeCount, limitHits, maxScale } =
    useMemo(() => {
      if (filteredData.length === 0) {
        return {
          maxConcurrency: 0,
          avgConcurrency: 0,
          spikeCount: 0,
          limitHits: 0,
          maxScale: organization.concurrencyLimit || 50,
        };
      }

      let max = 0;
      let sum = 0;
      let spikes = 0;
      let hits = 0;

      filteredData.forEach((d) => {
        if (d.concurrency > max) max = d.concurrency;
        sum += d.concurrency;
        if (d.isSpike) spikes++;
        if (d.concurrency >= organization.concurrencyLimit) hits++;
      });

      const avg = Math.round(sum / filteredData.length);
      const topScale = Math.max(
        Math.ceil(organization.concurrencyLimit * 1.2),
        Math.ceil(max * 1.15),
        30
      );

      return {
        maxConcurrency: max,
        avgConcurrency: avg,
        spikeCount: spikes,
        limitHits: hits,
        maxScale: topScale,
      };
    }, [filteredData, organization.concurrencyLimit]);

  const handleSaveLimit = () => {
    if (limitInput > 0) {
      onUpdateLimit(organization.id, limitInput);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    }
  };

  if (!isOpen) return null;

  // SVG Chart Dimensions
  const chartWidth = 560;
  const chartHeight = 200;
  const paddingX = 40;
  const paddingY = 25;
  const usableWidth = chartWidth - paddingX * 2;
  const usableHeight = chartHeight - paddingY * 2;

  // Calculate coordinates
  const points = filteredData.map((d, index) => {
    const x =
      filteredData.length > 1
        ? paddingX + (index / (filteredData.length - 1)) * usableWidth
        : paddingX + usableWidth / 2;
    const y =
      chartHeight -
      paddingY -
      (Math.min(d.concurrency, maxScale) / maxScale) * usableHeight;
    const hitsLimit = d.concurrency >= organization.concurrencyLimit;
    return { ...d, x, y, hitsLimit };
  });

  // Construct SVG paths
  const linePath =
    points.length > 1
      ? points.reduce(
          (acc, p, i) => `${acc} ${i === 0 ? "M" : "L"} ${p.x.toFixed(1)},${p.y.toFixed(1)}`,
          ""
        )
      : "";

  const areaPath =
    points.length > 1
      ? `${linePath} L ${points[points.length - 1].x.toFixed(1)},${chartHeight - paddingY} L ${points[0].x.toFixed(1)},${chartHeight - paddingY} Z`
      : "";

  // Concurrency Limit horizontal reference line
  const limitY =
    chartHeight -
    paddingY -
    (Math.min(organization.concurrencyLimit, maxScale) / maxScale) * usableHeight;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Concurrency management for ${organization.name}`}
      className="fixed inset-0 z-50 flex justify-end overflow-hidden"
    >
      {/* Dimmed Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] transition-opacity"
        onClick={onClose}
      />

      {/* Right Drawer Container */}
      <aside className="relative z-50 flex h-full w-full max-w-2xl flex-col bg-white shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Drawer Header: Company Name & Close */}
        <div className="flex items-center justify-between border-b border-slate-200/90 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0F172A] text-white shadow-xs">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2
                  id="drawer-company-name"
                  className="text-[17px] font-bold text-slate-900"
                >
                  {organization.name}
                </h2>
                <span className="rounded-full border border-slate-200 bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700 uppercase">
                  {organization.provider}
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                    organization.isActive
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-slate-100 text-slate-500 border border-slate-200"
                  }`}
                >
                  {organization.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              <p className="text-[12px] text-slate-500">
                Organization Concurrency Monitoring &amp; Throttle Limits
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close drawer"
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 space-y-6 overflow-y-auto px-6 py-5">
          {/* Section: Concurrency Limit Configuration */}
          <div className="rounded-2xl border border-slate-200/90 bg-slate-50/70 p-4 shadow-2xs">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <span className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                  Current Concurrency Limit
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-[28px] font-black text-slate-900">
                    {organization.concurrencyLimit}
                  </span>
                  <span className="text-[13px] font-medium text-slate-500">
                    concurrent calls allowed
                  </span>
                </div>
              </div>

              {/* Concurrency Limit Stepper / Editor */}
              <div className="flex items-center gap-2">
                <div className="flex items-center rounded-xl border border-slate-300 bg-white p-1 shadow-2xs">
                  <button
                    type="button"
                    onClick={() =>
                      setLimitInput((prev) => Math.max(5, prev - 5))
                    }
                    className="rounded-lg p-1.5 text-slate-600 hover:bg-slate-100 transition-colors"
                    aria-label="Decrease limit"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    value={limitInput}
                    onChange={(e) =>
                      setLimitInput(Math.max(1, parseInt(e.target.value) || 1))
                    }
                    aria-label="Concurrency limit value"
                    className="w-16 text-center text-[15px] font-bold text-slate-900 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setLimitInput((prev) => prev + 5)}
                    className="rounded-lg p-1.5 text-slate-600 hover:bg-slate-100 transition-colors"
                    aria-label="Increase limit"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleSaveLimit}
                  disabled={limitInput === organization.concurrencyLimit}
                  className="rounded-xl bg-[#0F172A] px-4 py-2 text-[13px] font-medium text-white shadow-2xs hover:bg-slate-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {saveSuccess ? (
                    <span className="inline-flex items-center gap-1.5 text-emerald-400">
                      <Check className="h-4 w-4" /> Saved
                    </span>
                  ) : (
                    "Save Limit"
                  )}
                </button>
              </div>
            </div>

            {/* Quick Limit Presets */}
            <div className="mt-3 flex items-center gap-2 pt-2 border-t border-slate-200/60">
              <span className="text-[11.5px] font-medium text-slate-500">
                Quick presets:
              </span>
              {[25, 50, 75, 100, 150].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setLimitInput(preset)}
                  className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                    limitInput === preset
                      ? "bg-blue-600 text-white"
                      : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* KPI Summary Cards */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-2xs">
              <span className="text-[11px] font-medium text-slate-500">
                Peak Concurrency
              </span>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="text-[20px] font-bold text-slate-900">
                  {maxConcurrency}
                </span>
                <span className="text-[11px] text-slate-400">calls</span>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-2xs">
              <span className="text-[11px] font-medium text-slate-500">
                Average Load
              </span>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="text-[20px] font-bold text-slate-900">
                  {avgConcurrency}
                </span>
                <span className="text-[11px] text-slate-400">calls</span>
              </div>
            </div>

            <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-3 shadow-2xs">
              <span className="flex items-center gap-1 text-[11px] font-medium text-amber-700">
                <Zap className="h-3.5 w-3.5" /> Spikes Detected
              </span>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="text-[20px] font-bold text-amber-900">
                  {spikeCount}
                </span>
                <span className="text-[11px] text-amber-600">surges</span>
              </div>
            </div>

            <div
              className={`rounded-xl p-3 shadow-2xs border ${
                limitHits > 0
                  ? "border-red-200 bg-red-50/60"
                  : "border-slate-200 bg-white"
              }`}
            >
              <span
                className={`flex items-center gap-1 text-[11px] font-medium ${
                  limitHits > 0 ? "text-red-700" : "text-slate-500"
                }`}
              >
                <AlertTriangle className="h-3.5 w-3.5" /> Limit Hits
              </span>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span
                  className={`text-[20px] font-bold ${
                    limitHits > 0 ? "text-red-700" : "text-slate-900"
                  }`}
                >
                  {limitHits}
                </span>
                <span
                  className={`text-[11px] ${
                    limitHits > 0 ? "text-red-600" : "text-slate-400"
                  }`}
                >
                  breaches
                </span>
              </div>
            </div>
          </div>

          {/* Section: Concurrency Hits Graph */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs">
            {/* Graph Header with Date Range Filter */}
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                  <h3 className="text-[14px] font-bold text-slate-900">
                    Concurrency Hits &amp; Limit Monitoring
                  </h3>
                </div>
                <p className="text-[11.5px] text-slate-500">
                  Track real-time session volume vs allocated limits
                </p>
              </div>

              {/* Date Range Selector */}
              <div className="flex flex-wrap items-center gap-1 rounded-full border border-slate-200 bg-slate-50 p-1">
                {(
                  [
                    { id: "24h", label: "24h" },
                    { id: "7d", label: "7 Days" },
                    { id: "14d", label: "14 Days" },
                    { id: "30d", label: "30 Days" },
                    { id: "custom", label: "Custom" },
                  ] as const
                ).map((range) => (
                  <button
                    key={range.id}
                    type="button"
                    onClick={() => setDatePreset(range.id)}
                    className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition-all ${
                      datePreset === range.id
                        ? "bg-white text-slate-900 shadow-2xs font-bold"
                        : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Date Pickers if 'custom' selected */}
            {datePreset === "custom" && (
              <div className="mb-4 flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/70 p-2.5 text-[12px]">
                <Calendar className="h-4 w-4 text-slate-400" />
                <div className="flex items-center gap-2">
                  <label htmlFor="drawer-start-date" className="text-slate-600 font-medium">
                    From:
                  </label>
                  <input
                    id="drawer-start-date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-[12px] font-medium text-slate-800"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label htmlFor="drawer-end-date" className="text-slate-600 font-medium">
                    To:
                  </label>
                  <input
                    id="drawer-end-date"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-[12px] font-medium text-slate-800"
                  />
                </div>
              </div>
            )}

            {/* Alert Banner if Limit Hits Detected */}
            {limitHits > 0 && (
              <div
                role="alert"
                className="mb-3 flex items-center justify-between rounded-xl border border-red-200 bg-red-50/80 px-3.5 py-2.5 text-[12px] text-red-800"
              >
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 shrink-0 text-red-600" />
                  <span>
                    <strong>Limit Exceeded:</strong> Concurrency hit the threshold{" "}
                    <strong>{limitHits} time{limitHits > 1 ? "s" : ""}</strong> in
                    this date range. Consider raising the limit.
                  </span>
                </div>
              </div>
            )}

            {/* Visual SVG Chart */}
            <div className="relative overflow-hidden rounded-xl border border-slate-100 bg-slate-50/40 p-2">
              <svg
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                className="w-full overflow-visible"
              >
                <defs>
                  {/* Concurrency Area Gradient */}
                  <linearGradient
                    id="concurrencyGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.28" />
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.0" />
                  </linearGradient>

                  {/* Limit Hit Pulse Filter */}
                  <filter
                    id="limitGlow"
                    x="-20%"
                    y="-20%"
                    width="140%"
                    height="140%"
                  >
                    <feDropShadow
                      dx="0"
                      dy="0"
                      stdDeviation="2"
                      floodColor="#EF4444"
                    />
                  </filter>
                </defs>

                {/* Y-Axis Horizontal Grid Lines */}
                {[0, 0.25, 0.5, 0.75, 1].map((pct) => {
                  const y = chartHeight - paddingY - pct * usableHeight;
                  const labelVal = Math.round(pct * maxScale);
                  return (
                    <g key={pct}>
                      <line
                        x1={paddingX}
                        y1={y}
                        x2={chartWidth - paddingX}
                        y2={y}
                        stroke="#E2E8F0"
                        strokeDasharray={pct === 0 ? "none" : "3,3"}
                        strokeWidth="1"
                      />
                      <text
                        x={paddingX - 8}
                        y={y + 3}
                        fontSize="9"
                        fill="#94A3B8"
                        textAnchor="end"
                        fontWeight="500"
                      >
                        {labelVal}
                      </text>
                    </g>
                  );
                })}

                {/* Shaded Area Under Curve */}
                {areaPath && (
                  <path d={areaPath} fill="url(#concurrencyGradient)" />
                )}

                {/* Limit Reference Line (RED DASHED) */}
                <line
                  x1={paddingX}
                  y1={limitY}
                  x2={chartWidth - paddingX}
                  y2={limitY}
                  stroke="#EF4444"
                  strokeWidth="1.75"
                  strokeDasharray="5,4"
                />
                {/* Limit Line Badge */}
                <g transform={`translate(${chartWidth - paddingX - 60}, ${limitY - 10})`}>
                  <rect
                    width="60"
                    height="16"
                    rx="4"
                    fill="#EF4444"
                    className="opacity-95"
                  />
                  <text
                    x="30"
                    y="11"
                    fontSize="9"
                    fill="#FFFFFF"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    Limit: {organization.concurrencyLimit}
                  </text>
                </g>

                {/* Main Concurrency Line */}
                {linePath && (
                  <path
                    d={linePath}
                    fill="none"
                    stroke="#2563EB"
                    strokeWidth="2.25"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}

                {/* Data Points with Spike & Limit Hit Highlights */}
                {points.map((p) => {
                  if (p.hitsLimit) {
                    // LIMIT HIT (RED HIGHLIGHT)
                    return (
                      <g
                        key={p.id}
                        className="cursor-pointer"
                        onMouseEnter={() => setActivePoint(p)}
                        onClick={() => setActivePoint(p)}
                      >
                        <circle
                          cx={p.x}
                          cy={p.y}
                          r="7"
                          fill="#FEE2E2"
                          stroke="#EF4444"
                          strokeWidth="1.5"
                          filter="url(#limitGlow)"
                        />
                        <circle cx={p.x} cy={p.y} r="3.5" fill="#EF4444" />
                      </g>
                    );
                  }

                  if (p.isSpike) {
                    // SPIKE HIT (AMBER HIGHLIGHT)
                    return (
                      <g
                        key={p.id}
                        className="cursor-pointer"
                        onMouseEnter={() => setActivePoint(p)}
                        onClick={() => setActivePoint(p)}
                      >
                        <circle
                          cx={p.x}
                          cy={p.y}
                          r="6"
                          fill="#FEF3C7"
                          stroke="#F59E0B"
                          strokeWidth="1.5"
                        />
                        <circle cx={p.x} cy={p.y} r="3" fill="#D97706" />
                      </g>
                    );
                  }

                  // Normal point
                  return (
                    <circle
                      key={p.id}
                      cx={p.x}
                      cy={p.y}
                      r="2"
                      fill="#3B82F6"
                      className="opacity-70 hover:opacity-100 hover:r-3 cursor-pointer transition-all"
                      onMouseEnter={() => setActivePoint(p)}
                      onClick={() => setActivePoint(p)}
                    />
                  );
                })}
              </svg>

              {/* Interactive Tooltip Card */}
              {activePoint && (
                <div className="mt-2 flex items-center justify-between rounded-xl border border-slate-200 bg-white p-2.5 text-[12px] shadow-sm animate-in fade-in">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-slate-400" />
                    <span className="font-medium text-slate-700">
                      {activePoint.label}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="font-bold text-slate-900">
                      {activePoint.concurrency} concurrent calls
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {activePoint.concurrency >= organization.concurrencyLimit && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-[10.5px] font-bold text-red-700">
                        <AlertTriangle className="h-3 w-3" /> Hit Limit ({organization.concurrencyLimit})
                      </span>
                    )}
                    {activePoint.isSpike &&
                      activePoint.concurrency < organization.concurrencyLimit && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10.5px] font-bold text-amber-700">
                          <Zap className="h-3 w-3" /> Surge Spike
                        </span>
                      )}
                    <button
                      type="button"
                      onClick={() => setActivePoint(null)}
                      className="rounded-full p-1 text-slate-400 hover:text-slate-600"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Graph Legend & Explanation */}
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-2 text-[11px] text-slate-500">
              <div className="flex items-center gap-4">
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-4 rounded-sm bg-blue-600" /> Concurrency
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-0.5 w-4 border-b-2 border-dashed border-red-500" />
                  Limit Line ({organization.concurrencyLimit})
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full border border-amber-500 bg-amber-200" />
                  Spike
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full border border-red-500 bg-red-400" />
                  Limit Hit
                </span>
              </div>
              <span className="text-slate-400">
                Click any point to inspect timestamp
              </span>
            </div>
          </div>

          {/* Section: Recent Concurrency Incident Log */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs">
            <h4 className="mb-3 text-[13px] font-bold text-slate-900">
              Significant Concurrency Events
            </h4>
            <div className="space-y-2">
              {filteredData
                .filter((d) => d.concurrency >= organization.concurrencyLimit || d.isSpike)
                .slice(-5)
                .reverse()
                .map((event) => {
                  const isBreach =
                    event.concurrency >= organization.concurrencyLimit;
                  const delta =
                    event.concurrency - organization.concurrencyLimit;

                  return (
                    <div
                      key={event.id}
                      className={`flex items-center justify-between rounded-xl border p-2.5 text-[12px] transition-colors ${
                        isBreach
                          ? "border-red-200 bg-red-50/40"
                          : "border-amber-200 bg-amber-50/30"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`flex h-7 w-7 items-center justify-center rounded-lg ${
                            isBreach
                              ? "bg-red-100 text-red-600"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {isBreach ? (
                            <AlertTriangle className="h-4 w-4" />
                          ) : (
                            <Zap className="h-4 w-4" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">
                            {isBreach
                              ? "Concurrency Limit Hit"
                              : "Traffic Spike Surge"}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            {event.label}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="font-bold text-slate-900">
                          {event.concurrency} calls
                        </span>
                        <p
                          className={`text-[11px] font-medium ${
                            isBreach ? "text-red-600" : "text-amber-600"
                          }`}
                        >
                          {isBreach
                            ? delta > 0
                              ? `+${delta} over limit`
                              : "Reached limit"
                            : `${event.concurrency} vs ${organization.concurrencyLimit} cap`}
                        </p>
                      </div>
                    </div>
                  );
                })}

              {filteredData.filter(
                (d) => d.concurrency >= organization.concurrencyLimit || d.isSpike
              ).length === 0 && (
                <div className="py-6 text-center text-[12.5px] text-slate-400">
                  <CheckCircle2 className="mx-auto mb-1 h-5 w-5 text-emerald-500" />
                  No spikes or limit breaches recorded in this date range.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="border-t border-slate-200/90 px-6 py-4 flex items-center justify-between bg-slate-50/50">
          <span className="text-[12px] text-slate-500">
            Changes to the limit take effect immediately for active Voice AI workers.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-200 bg-white px-5 py-2 text-[13px] font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
          >
            Close Drawer
          </button>
        </div>
      </aside>
    </div>
  );
}
