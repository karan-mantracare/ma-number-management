"use client";

import React, { useMemo, useState } from "react";
import { ArrowLeft, Eye, Search } from "lucide-react";
import { ADMIN_NUMBERS_INVENTORY } from "@/data/adminTelephony";
import { filterClientAddedNumbers } from "@/lib/adminTelephonyReport";
import { DirectionBadge, SourceBadge } from "@/components/integrations/Badges";
import { CountryFlag } from "@/components/integrations/CountryFlag";
import { DemoDataBadge, StatusBadge } from "./AdminBadges";

interface ClientNumbersViewProps {
  onBack: () => void;
}

export function ClientNumbersView({ onBack }: ClientNumbersViewProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const totalClientNumbers = useMemo(
    () => filterClientAddedNumbers(ADMIN_NUMBERS_INVENTORY, "").length,
    []
  );

  const filteredNumbers = useMemo(
    () => filterClientAddedNumbers(ADMIN_NUMBERS_INVENTORY, searchQuery),
    [searchQuery]
  );

  const hasSearch = searchQuery.trim().length > 0;

  return (
    <div className="mt-5 space-y-4" data-testid="client-number-view">
      {/* Sub-view Bar */}
      <div className="flex flex-col gap-3 rounded-xl border border-slate-200/80 bg-slate-50/70 p-3.5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[12.5px] font-medium text-slate-700 transition-colors hover:bg-slate-100"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Telephony Configs
          </button>
          <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-slate-800">
            <Eye className="h-4 w-4 text-[#1D4ED8]" />
            Client Numbers (Read-only)
          </span>
          <span className="rounded-full border border-slate-200 bg-white px-2.5 py-0.5 text-[11.5px] font-medium text-slate-600 tabular-nums">
            {hasSearch
              ? `${filteredNumbers.length} of ${totalClientNumbers}`
              : `${totalClientNumbers} numbers`}
          </span>
          <DemoDataBadge label="Demo Data • Source: Client-added" />
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by client name or phone number..."
            aria-label="Search client numbers"
            className="w-full rounded-full border border-slate-200 bg-white py-2 pr-4 pl-10 text-[13px] text-slate-800 transition-colors outline-none placeholder:text-slate-400 focus:border-[#1D4ED8] focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      {/* Read-only Client Numbers Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200/90">
        <table className="min-w-[780px] w-full border-collapse text-left">
          <thead>
            <tr className="bg-[#1E293B] text-[11px] font-semibold tracking-wider text-white uppercase">
              <th scope="col" className="border-r border-slate-700/70 px-4 py-3">
                Client Name
              </th>
              <th scope="col" className="border-r border-slate-700/70 px-4 py-3">
                Phone Number
              </th>
              <th scope="col" className="border-r border-slate-700/70 px-4 py-3">
                Provider
              </th>
              <th scope="col" className="border-r border-slate-700/70 px-4 py-3">
                Direction
              </th>
              <th scope="col" className="px-4 py-3">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white text-[13px]">
            {filteredNumbers.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-10 text-center text-[13px] text-slate-500"
                >
                  <p>
                    No client-added numbers match &ldquo;{searchQuery}&rdquo;.
                  </p>
                  {hasSearch && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="mt-2 inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-[12px] font-medium text-[#1D4ED8] hover:bg-slate-50"
                    >
                      Clear search
                    </button>
                  )}
                </td>
              </tr>
            ) : (
              filteredNumbers.map((item) => (
                <tr
                  key={item.id}
                  data-testid={`client-number-row-${item.id}`}
                  className="transition-colors hover:bg-slate-50/70"
                >
                  <td className="px-4 py-3.5 font-medium text-slate-900">
                    {item.clientName}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <CountryFlag iso={item.countryIso} size={18} />
                      <span className="font-mono text-[13px] font-medium text-slate-800 tabular-nums">
                        {item.phoneNumber}
                      </span>
                      <SourceBadge source={item.source} />
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-slate-700">{item.provider}</td>
                  <td className="px-4 py-3.5">
                    <DirectionBadge direction={item.direction} />
                  </td>
                  <td className="px-4 py-3.5">
                    <StatusBadge status={item.status} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
