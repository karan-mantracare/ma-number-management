"use client";

import React, { useState } from "react";
import {
  BarChart3,
  ListChecks,
  Phone,
  Plus,
  RefreshCw,
  Server,
  Trash2,
} from "lucide-react";
import { ADMIN_SYSTEM_CONFIGS } from "@/data/adminTelephony";
import {
  DefaultBadge,
  DirectionBadge,
  SourceBadge,
} from "@/components/integrations/Badges";
import { CountryFlag } from "@/components/integrations/CountryFlag";
import { DemoDataBadge, StatusBadge } from "./AdminBadges";
import { AdminShell } from "./AdminShell";
import { ClientNumbersView } from "./ClientNumbersView";
import { TelephonyReportView } from "./TelephonyReportView";

type AdminTelephonyView = "configs" | "client-numbers" | "report";

export function AdminTelephonyPage() {
  const [activeView, setActiveView] = useState<AdminTelephonyView>("configs");

  const toggleView = (target: AdminTelephonyView) => {
    setActiveView((prev) => (prev === target ? "configs" : target));
  };

  return (
    <AdminShell>
      <div className="space-y-5">
        {/* Integration Category Tabs */}
        <div
          className="flex flex-wrap items-center gap-2"
          role="tablist"
          aria-label="Admin integration categories"
        >
          <span
            role="tab"
            aria-selected="false"
            aria-disabled="true"
            className="inline-flex cursor-default items-center gap-2 rounded-full px-3.5 py-2 text-[13px] font-medium text-slate-500"
          >
            <RefreshCw className="h-3.5 w-3.5 text-slate-400" />
            Mantra Sync
          </span>
          <button
            type="button"
            role="tab"
            aria-selected="true"
            onClick={() => setActiveView("configs")}
            className="inline-flex items-center gap-2 rounded-full bg-[#1D4ED8] px-4 py-2 text-[13px] font-medium text-white shadow-sm shadow-blue-600/20"
          >
            <Phone className="h-3.5 w-3.5" />
            Telephony
          </button>
        </div>

        {/* Telephony Configs Panel */}
        <section
          aria-labelledby="telephony-configs-heading"
          className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs sm:p-6"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-blue-50/80 text-[#2563EB]">
                <Server className="h-5 w-5" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2
                    id="telephony-configs-heading"
                    className="text-[17px] font-semibold text-slate-900"
                  >
                    Telephony Configs
                  </h2>
                  {activeView === "configs" && <DemoDataBadge />}
                </div>
                <p className="mt-0.5 text-[13px] text-slate-500">
                  Manage system telephony configurations, inspect client-added
                  numbers, and review outbound usage reports.
                </p>
              </div>
            </div>

            {/* Header Actions: Client Number, Report, Add Configuration */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => toggleView("client-numbers")}
                aria-pressed={activeView === "client-numbers"}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-medium transition-colors focus:ring-2 focus:ring-blue-200 focus:outline-none ${
                  activeView === "client-numbers"
                    ? "bg-[#1D4ED8] text-white shadow-xs"
                    : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                <ListChecks className="h-3.5 w-3.5" />
                Client Number
              </button>

              <button
                type="button"
                onClick={() => toggleView("report")}
                aria-pressed={activeView === "report"}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-medium transition-colors focus:ring-2 focus:ring-blue-200 focus:outline-none ${
                  activeView === "report"
                    ? "bg-[#1D4ED8] text-white shadow-xs"
                    : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                <BarChart3 className="h-3.5 w-3.5" />
                Report
              </button>

              <button
                type="button"
                disabled
                aria-disabled="true"
                title="Add Configuration is a placeholder in this standalone demo"
                className="inline-flex cursor-not-allowed items-center gap-2 rounded-full bg-[#1E293B]/60 px-5 py-2 text-[13px] font-medium text-white/90"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Configuration
              </button>
            </div>
          </div>

          {/* Active Sub-View */}
          {activeView === "configs" && (
            <div className="mt-5" data-testid="system-configs-view">
              <div className="overflow-x-auto rounded-xl border border-slate-200/90">
                <table className="min-w-[860px] w-full border-collapse text-left">
                  <thead>
                    <tr className="bg-[#1E293B] text-[11px] font-semibold tracking-wider text-white uppercase">
                      <th scope="col" className="border-r border-slate-700/70 px-4 py-3">
                        Phone Number
                      </th>
                      <th scope="col" className="border-r border-slate-700/70 px-4 py-3">
                        Provider
                      </th>
                      <th scope="col" className="border-r border-slate-700/70 px-4 py-3">
                        Direction
                      </th>
                      <th scope="col" className="border-r border-slate-700/70 px-4 py-3">
                        Assigned Organizations
                      </th>
                      <th scope="col" className="border-r border-slate-700/70 px-4 py-3">
                        Status
                      </th>
                      <th scope="col" className="px-4 py-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white text-[13px]">
                    {ADMIN_SYSTEM_CONFIGS.map((cfg) => (
                      <tr
                        key={cfg.id}
                        data-testid={`system-config-row-${cfg.id}`}
                        className="transition-colors hover:bg-slate-50/70"
                      >
                        <td className="px-4 py-3.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <CountryFlag iso={cfg.countryIso} size={18} />
                            <span className="font-mono text-[13px] font-medium text-slate-800 tabular-nums">
                              {cfg.phoneNumber}
                            </span>
                            {cfg.isDefault && <DefaultBadge />}
                            <SourceBadge source={cfg.source} />
                          </div>
                        </td>
                        <td className="px-4 py-3.5 font-medium text-slate-700">
                          {cfg.provider}
                        </td>
                        <td className="px-4 py-3.5">
                          <DirectionBadge direction={cfg.direction} />
                        </td>
                        <td className="px-4 py-3.5 text-slate-600">
                          {cfg.assignedOrgsLabel ?? "Unassigned"}
                        </td>
                        <td className="px-4 py-3.5">
                          <StatusBadge status={cfg.status} />
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          <span
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400"
                            aria-hidden="true"
                          >
                            <Trash2 className="h-4 w-4" />
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeView === "client-numbers" && (
            <ClientNumbersView onBack={() => setActiveView("configs")} />
          )}

          {activeView === "report" && (
            <TelephonyReportView onBack={() => setActiveView("configs")} />
          )}
        </section>
      </div>
    </AdminShell>
  );
}

