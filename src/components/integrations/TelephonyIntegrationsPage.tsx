"use client";

import React, { useMemo, useState } from "react";
import {
  CheckCircle2,
  ChevronDown,
  Database,
  DollarSign,
  Globe,
  Link2,
  Phone,
  PhoneIncoming,
  PhoneOutgoing,
  Plus,
  Search,
  Server,
  Trash2,
  X,
} from "lucide-react";
import {
  ROUTING_NUMBERS,
  TELEPHONY_PROVIDERS,
  type RoutingDirection,
} from "@/data/telephony";
import { AppShell } from "./AppShell";
import { DefaultBadge, DirectionBadge, SourceBadge } from "./Badges";
import { CountryFlag } from "./CountryFlag";
import {
  RequestNumberModal,
  type RequestNumberFormValues,
} from "./RequestNumberModal";

export function TelephonyIntegrationsPage() {
  const [routingTab, setRoutingTab] = useState<RoutingDirection>("outbound");
  const [searchQuery, setSearchQuery] = useState("");
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [submissionNotice, setSubmissionNotice] = useState<string | null>(null);

  const filteredRoutingNumbers = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    const digitsQuery = normalizedQuery.replace(/\D/g, "");

    return ROUTING_NUMBERS.filter((item) => {
      if (item.direction !== routingTab) return false;
      if (!normalizedQuery) return true;

      const phoneLower = item.phoneNumber.toLowerCase();
      const phoneDigits = item.phoneNumber.replace(/\D/g, "");

      return (
        phoneLower.includes(normalizedQuery) ||
        (digitsQuery.length > 0 && phoneDigits.includes(digitsQuery))
      );
    });
  }, [routingTab, searchQuery]);

  const handleRequestSuccess = (_values: RequestNumberFormValues) => {
    setIsRequestModalOpen(false);
    setSubmissionNotice("Demo request submitted. No request was sent to the team.");
  };

  return (
    <AppShell>
      <div className="space-y-5">
        {/* Integration Category Tabs */}
        <div
          className="flex flex-wrap items-center gap-2"
          role="tablist"
          aria-label="Integration categories"
        >
          <button
            type="button"
            role="tab"
            aria-selected="true"
            className="inline-flex items-center gap-2 rounded-full bg-[#1D4ED8] px-4 py-2 text-[13px] font-medium text-white shadow-sm shadow-blue-600/20"
          >
            <Phone className="h-3.5 w-3.5" />
            Telephony
          </button>
          <span
            role="tab"
            aria-selected="false"
            className="inline-flex cursor-default items-center gap-2 rounded-full px-3.5 py-2 text-[13px] font-medium text-slate-600"
          >
            <Database className="h-3.5 w-3.5 text-slate-400" />
            EHR
          </span>
          <span
            role="tab"
            aria-selected="false"
            className="inline-flex cursor-default items-center gap-2 rounded-full px-3.5 py-2 text-[13px] font-medium text-slate-600"
          >
            <Link2 className="h-3.5 w-3.5 text-slate-400" />
            CRM &amp; Data Source
          </span>
          <span
            role="tab"
            aria-selected="false"
            className="inline-flex cursor-default items-center gap-2 rounded-full px-3.5 py-2 text-[13px] font-medium text-slate-600"
          >
            <DollarSign className="h-3.5 w-3.5 text-slate-400" />
            Payment Provider
          </span>
        </div>

        {/* Demo Submission Success Banner */}
        {submissionNotice && (
          <div
            role="status"
            aria-live="polite"
            className="flex items-center justify-between gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-[13.5px] font-medium text-emerald-900 shadow-xs"
          >
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="h-4.5 w-4.5 shrink-0 text-emerald-600" />
              <span>{submissionNotice}</span>
            </div>
            <button
              type="button"
              onClick={() => setSubmissionNotice(null)}
              className="rounded-lg p-1 text-emerald-700 transition-colors hover:bg-emerald-100"
              aria-label="Dismiss message"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Section 1: Telephony Provider */}
        <section
          aria-labelledby="telephony-provider-heading"
          className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs sm:p-6"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-blue-50/80 text-[#2563EB]">
                <Server className="h-5 w-5" />
              </div>
              <div>
                <h2
                  id="telephony-provider-heading"
                  className="text-[17px] font-semibold text-slate-900"
                >
                  Telephony Provider
                </h2>
                <p className="mt-0.5 text-[13px] text-slate-500">
                  Configure your SIP trunks and voice provider credentials
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => setIsRequestModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-full bg-[#1D4ED8] px-4.5 py-2.5 text-[13px] font-medium text-white shadow-xs transition-colors hover:bg-[#1E40AF] focus:ring-2 focus:ring-blue-200 focus:outline-none"
              >
                <Phone className="h-3.5 w-3.5" />
                Request Number
              </button>

              <button
                type="button"
                disabled
                aria-disabled="true"
                title="Add SIP Trunk is disabled in this standalone demo"
                className="inline-flex cursor-not-allowed items-center gap-2 rounded-full bg-[#1E293B]/55 px-5 py-2.5 text-[13px] font-medium text-white/90"
              >
                <Plus className="h-3.5 w-3.5" />
                Add SIP Trunk
              </button>
            </div>
          </div>

          {/* Provider Cards */}
          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:max-w-3xl">
            {TELEPHONY_PROVIDERS.map((provider) => (
              <div
                key={provider.id}
                data-testid={`provider-card-${provider.id}`}
                className="rounded-xl border border-slate-200/90 bg-white p-4 shadow-2xs transition-shadow hover:shadow-xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[14.5px] font-semibold text-slate-900">
                        {provider.name}
                      </span>
                      <DirectionBadge direction={provider.direction} />
                    </div>
                    <p className="mt-0.5 text-[12px] text-slate-400">
                      {provider.label}
                    </p>
                  </div>

                  {/* Toggle Switch (display state matching screenshot) */}
                  <div
                    role="switch"
                    aria-checked={provider.enabled}
                    aria-label={`${provider.name} status`}
                    className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${
                      provider.enabled ? "bg-[#2563EB]" : "bg-slate-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-xs transition-transform ${
                        provider.enabled ? "translate-x-4.5" : "translate-x-1"
                      }`}
                    />
                  </div>
                </div>

                {/* Country */}
                <div className="mt-3.5 flex items-center gap-2">
                  <CountryFlag iso={provider.countryIso} size={18} />
                  <span className="text-[13px] font-semibold text-slate-800">
                    {provider.countryCode}
                  </span>
                </div>

                {/* Phone Number + Source Badge + Delete Icon */}
                <div className="mt-2.5 flex items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[13px] font-medium text-slate-600 tabular-nums">
                      {provider.phoneNumber}
                    </span>
                    <SourceBadge source={provider.source} />
                  </div>
                  <span
                    className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-red-400"
                    aria-hidden="true"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2: Telephony Routing */}
        <section
          aria-labelledby="telephony-routing-heading"
          className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs sm:p-6"
        >
          <div className="flex items-start gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-blue-50/80 text-[#2563EB]">
              <Globe className="h-5 w-5" />
            </div>
            <div>
              <h2
                id="telephony-routing-heading"
                className="text-[17px] font-semibold text-slate-900"
              >
                Telephony Routing
              </h2>
              <p className="mt-0.5 text-[13px] text-slate-500">
                Manage number routing, process assignments, and country targeting.
                Higher priority wins when multiple numbers match.
              </p>
            </div>
          </div>

          {/* Routing Tabs + Search */}
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div
              className="inline-flex items-center gap-1.5 self-start"
              role="tablist"
              aria-label="Routing direction tabs"
            >
              <button
                type="button"
                role="tab"
                aria-selected={routingTab === "outbound"}
                onClick={() => setRoutingTab("outbound")}
                className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[13px] font-medium transition-colors ${
                  routingTab === "outbound"
                    ? "bg-[#1D4ED8] text-white shadow-sm shadow-blue-600/20"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <PhoneOutgoing className="h-3.5 w-3.5" />
                Outbound
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={routingTab === "inbound"}
                onClick={() => setRoutingTab("inbound")}
                className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[13px] font-medium transition-colors ${
                  routingTab === "inbound"
                    ? "bg-[#1D4ED8] text-white shadow-sm shadow-blue-600/20"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <PhoneIncoming className="h-3.5 w-3.5" />
                Inbound
              </button>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search numbers..."
                aria-label="Search numbers"
                className="w-full rounded-full border border-slate-200 bg-white py-2 pr-4 pl-10 text-[13px] text-slate-800 transition-colors outline-none placeholder:text-slate-400 focus:border-[#1D4ED8] focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          {/* Routing Table */}
          <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200/90">
            <table className="min-w-[920px] w-full border-collapse text-left">
              <thead>
                <tr className="bg-[#1E293B] text-[11px] font-semibold tracking-wider text-white uppercase">
                  <th className="border-r border-slate-700/70 px-4 py-3">
                    PHONE NUMBER
                  </th>
                  <th className="border-r border-slate-700/70 px-4 py-3">
                    TYPE
                  </th>
                  <th className="border-r border-slate-700/70 px-4 py-3">
                    PRIORITY
                  </th>
                  <th className="border-r border-slate-700/70 px-4 py-3">
                    PROCESSES &amp; STAGES
                  </th>
                  <th className="border-r border-slate-700/70 px-4 py-3">
                    TARGETED COUNTRIES
                  </th>
                  <th className="px-4 py-3 text-center">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white text-[13px]">
                {filteredRoutingNumbers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-10 text-center text-[13px] text-slate-500"
                    >
                      No {routingTab} numbers match &ldquo;{searchQuery}&rdquo;.
                    </td>
                  </tr>
                ) : (
                  filteredRoutingNumbers.map((row) => (
                    <tr
                      key={row.id}
                      data-testid={`routing-row-${row.id}`}
                      className="transition-colors hover:bg-slate-50/70"
                    >
                      {/* Phone Number + Default Badge + Source Badge */}
                      <td className="px-4 py-3.5 align-middle">
                        <div className="flex flex-wrap items-center gap-2">
                          <CountryFlag iso={row.countryIso} size={20} />
                          <span className="font-mono text-[13px] font-medium text-slate-800 tabular-nums">
                            {row.phoneNumber}
                          </span>
                          {row.isDefault && <DefaultBadge />}
                          <SourceBadge source={row.source} />
                        </div>
                      </td>

                      {/* Type */}
                      <td className="px-4 py-3.5 align-middle">
                        <DirectionBadge direction={row.direction} />
                      </td>

                      {/* Priority */}
                      <td className="px-4 py-3.5 align-middle">
                        <span
                          className={`inline-flex min-w-[44px] items-center justify-center rounded-lg border px-3 py-1.5 text-[12.5px] font-medium tabular-nums ${
                            row.isDefault
                              ? "border-slate-200/70 bg-slate-50 text-slate-400"
                              : "border-slate-200 bg-white text-slate-800"
                          }`}
                        >
                          {row.priority}
                        </span>
                      </td>

                      {/* Processes & Stages */}
                      <td className="px-4 py-3.5 align-middle">
                        {row.processes.length > 0 ? (
                          <div className="flex max-w-[270px] items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white px-2.5 py-2">
                            <div className="flex flex-wrap gap-1.5">
                              {row.processes.map((proc) => (
                                <span
                                  key={proc}
                                  className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700"
                                >
                                  <span className="max-w-[140px] truncate">
                                    {proc}
                                  </span>
                                  <X className="h-3 w-3 shrink-0 text-slate-400" />
                                </span>
                              ))}
                              {row.extraProcessesCount && (
                                <span className="inline-flex items-center px-1 text-[11px] font-medium text-slate-500">
                                  +{row.extraProcessesCount} more
                                </span>
                              )}
                            </div>
                            <ChevronDown className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                          </div>
                        ) : (
                          <div className="flex max-w-[270px] items-center justify-between rounded-xl border border-slate-200/80 bg-slate-50/70 px-3 py-2 text-[12px] text-slate-400">
                            <span>Assign processes &amp; stages</span>
                            <ChevronDown className="h-3.5 w-3.5 shrink-0 text-slate-300" />
                          </div>
                        )}
                      </td>

                      {/* Targeted Countries */}
                      <td className="px-4 py-3.5 align-middle">
                        <div
                          className={`flex max-w-[220px] items-center justify-between gap-2 rounded-xl border px-2.5 py-1.5 ${
                            row.isDefault
                              ? "border-slate-200/80 bg-slate-50/70"
                              : "border-slate-200 bg-white"
                          }`}
                        >
                          <div className="flex flex-wrap gap-1">
                            {row.targetedCountries.map((country) => (
                              <span
                                key={country}
                                className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11.5px] font-medium ${
                                  row.isDefault
                                    ? "bg-blue-50/60 text-blue-400"
                                    : "bg-blue-50 text-[#1D4ED8]"
                                }`}
                              >
                                {country}
                                {!row.isDefault && (
                                  <X className="h-3 w-3 shrink-0" />
                                )}
                              </span>
                            ))}
                          </div>
                          <ChevronDown
                            className={`h-3.5 w-3.5 shrink-0 ${
                              row.isDefault ? "text-slate-300" : "text-slate-400"
                            }`}
                          />
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5 text-center align-middle">
                        <span
                          className={`inline-flex h-8 w-8 items-center justify-center rounded-lg ${
                            row.isDefault ? "text-slate-300" : "text-slate-500"
                          }`}
                          aria-hidden="true"
                        >
                          <Trash2 className="h-4 w-4" />
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* Request a Phone Number Modal */}
      <RequestNumberModal
        open={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        onSuccess={handleRequestSuccess}
      />
    </AppShell>
  );
}

