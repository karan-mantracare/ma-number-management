"use client";

import React, { useState } from "react";
import {
  Ban,
  Building2,
  CheckCircle2,
  Headphones,
  Menu as MenuIcon,
  Pencil,
  RefreshCw,
  Search,
  Settings,
  X,
} from "lucide-react";
import {
  AdminOrganization,
  INITIAL_ADMIN_ORGANIZATIONS,
  VoiceAiProvider,
} from "@/data/adminOrganizations";
import { AdminShell } from "./AdminShell";

export function AdminOrganizationsPage() {
  const [organizations, setOrganizations] = useState<AdminOrganization[]>(
    INITIAL_ADMIN_ORGANIZATIONS
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [editingOrg, setEditingOrg] = useState<AdminOrganization | null>(null);
  const [resyncingId, setResyncingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3000);
  };

  const filteredOrgs = organizations.filter((org) =>
    org.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  const handleToggleActive = (id: string) => {
    setOrganizations((prev) =>
      prev.map((org) => {
        if (org.id === id) {
          const newState = !org.isActive;
          showToast(
            `${org.name} marked ${newState ? "active" : "inactive"}`
          );
          return { ...org, isActive: newState };
        }
        return org;
      })
    );
  };

  const handleResync = (id: string, name: string) => {
    setResyncingId(id);
    setTimeout(() => {
      setResyncingId(null);
      showToast(`Voice AI provider resynced for ${name}`);
    }, 1000);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOrg) return;
    setOrganizations((prev) =>
      prev.map((org) => (org.id === editingOrg.id ? editingOrg : org))
    );
    showToast(`Updated organization: ${editingOrg.name}`);
    setEditingOrg(null);
  };

  return (
    <AdminShell activeItem="Organization" title="Organizations">
      <div className="space-y-5">
        {/* Toast Alert */}
        {toastMessage && (
          <div
            role="status"
            className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-[13px] font-medium text-slate-800 shadow-lg animate-in fade-in slide-in-from-bottom-2"
          >
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Organizations Top Header Card */}
        <div className="flex flex-col gap-4 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#0F172A] text-white shadow-xs">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-[18px] font-bold text-slate-900 sm:text-[20px]">
                Organizations
              </h2>
              <p className="text-[13px] text-slate-500">
                Manage your organizations and their Voice AI providers.
              </p>
            </div>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-[280px]">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search organizations..."
              aria-label="Search organizations"
              className="w-full rounded-full border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-4 text-[13px] text-slate-800 placeholder-slate-400 transition-colors focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-slate-400 hover:text-slate-600"
                aria-label="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Organizations Table Container */}
        <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead>
                <tr className="bg-[#222D3D] text-[11px] font-semibold uppercase tracking-wider text-slate-200">
                  <th scope="col" className="w-12 px-4 py-3.5 text-center">
                    <span className="sr-only">Settings</span>
                    <Settings className="mx-auto h-4 w-4 text-slate-300" />
                  </th>
                  <th scope="col" className="px-4 py-3.5">
                    ORGANIZATION NAME
                  </th>
                  <th scope="col" className="px-4 py-3.5">
                    VOICE AI PROVIDER
                  </th>
                  <th scope="col" className="px-6 py-3.5 text-right">
                    ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrgs.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-12 text-center text-[13px] text-slate-500"
                    >
                      No organizations match &ldquo;{searchQuery}&rdquo;.
                      <button
                        type="button"
                        onClick={() => setSearchQuery("")}
                        className="ml-2 font-medium text-blue-600 hover:underline"
                      >
                        Clear search
                      </button>
                    </td>
                  </tr>
                ) : (
                  filteredOrgs.map((org) => {
                    const isMenuOpen = openMenuId === org.id;
                    const isResyncing = resyncingId === org.id;

                    return (
                      <tr
                        key={org.id}
                        className="transition-colors hover:bg-slate-50/60"
                      >
                        {/* Column 1: Row Menu */}
                        <td className="relative px-4 py-3 text-center">
                          <button
                            type="button"
                            onClick={() =>
                              setOpenMenuId((prev) =>
                                prev === org.id ? null : org.id
                              )
                            }
                            aria-label={`Open menu for ${org.name}`}
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                          >
                            <MenuIcon className="h-4 w-4" />
                          </button>

                          {/* Row Action Dropdown Menu */}
                          {isMenuOpen && (
                            <>
                              <div
                                className="fixed inset-0 z-40"
                                onClick={() => setOpenMenuId(null)}
                              />
                              <div
                                role="menu"
                                className="absolute left-6 top-10 z-50 w-56 rounded-xl border border-slate-200 bg-white py-1.5 shadow-xl animate-in fade-in zoom-in-95"
                              >
                                <button
                                  type="button"
                                  role="menuitem"
                                  onClick={() => {
                                    setEditingOrg(org);
                                    setOpenMenuId(null);
                                  }}
                                  className="flex w-full items-center gap-2.5 px-3.5 py-2 text-[12.5px] font-medium text-slate-700 hover:bg-slate-50 text-left transition-colors"
                                >
                                  <Headphones className="h-4 w-4 text-slate-500" />
                                  <span>Update Voice AI Provider</span>
                                </button>
                                <button
                                  type="button"
                                  role="menuitem"
                                  onClick={() => {
                                    handleToggleActive(org.id);
                                    setOpenMenuId(null);
                                  }}
                                  className={`flex w-full items-center gap-2.5 px-3.5 py-2 text-[12.5px] font-medium text-left transition-colors ${
                                    org.isActive
                                      ? "text-red-600 hover:bg-red-50/60"
                                      : "text-emerald-600 hover:bg-emerald-50/60"
                                  }`}
                                >
                                  <Ban className="h-4 w-4" />
                                  <span>
                                    {org.isActive
                                      ? "Disable Organization"
                                      : "Enable Organization"}
                                  </span>
                                </button>
                              </div>
                            </>
                          )}
                        </td>

                        {/* Column 2: Organization Avatar + Name */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 border border-slate-200/60">
                              <Building2 className="h-4 w-4" />
                            </div>
                            <span className="font-semibold text-slate-800">
                              {org.name}
                            </span>
                          </div>
                        </td>

                        {/* Column 3: Voice AI Provider + Resync */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-100/90 px-3 py-0.5 text-[11px] font-semibold tracking-wide text-slate-700 uppercase">
                              {org.provider}
                            </span>
                            {org.hasResync && (
                              <button
                                type="button"
                                onClick={() => handleResync(org.id, org.name)}
                                disabled={isResyncing}
                                className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-[11px] font-semibold text-blue-600 hover:bg-blue-100 transition-colors disabled:opacity-60"
                              >
                                <RefreshCw
                                  className={`h-3 w-3 ${
                                    isResyncing ? "animate-spin text-blue-500" : ""
                                  }`}
                                />
                                <span>
                                  {isResyncing ? "Syncing..." : "Resync"}
                                </span>
                              </button>
                            )}
                          </div>
                        </td>

                        {/* Column 4: ACTIONS (Edit Icon + Active/Inactive Toggle) */}
                        <td className="px-6 py-3 text-right">
                          <div className="inline-flex items-center justify-end gap-3.5">
                            {/* Edit Icon Button */}
                            <button
                              type="button"
                              onClick={() => setEditingOrg(org)}
                              aria-label={`Edit ${org.name}`}
                              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-blue-600 transition-colors"
                              title="Edit organization"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>

                            {/* Active / Inactive Toggle Switch */}
                            <button
                              type="button"
                              role="switch"
                              aria-checked={org.isActive}
                              aria-label={`Toggle ${org.name} active status`}
                              onClick={() => handleToggleActive(org.id)}
                              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                                org.isActive ? "bg-blue-600" : "bg-slate-200"
                              }`}
                            >
                              <span
                                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                                  org.isActive
                                    ? "translate-x-5"
                                    : "translate-x-0"
                                }`}
                              />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Edit Organization Modal */}
        {editingOrg && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px]"
              onClick={() => setEditingOrg(null)}
            />
            <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95">
              <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <Pencil className="h-4 w-4" />
                  </div>
                  <h3 className="text-[16px] font-bold text-slate-900">
                    Edit Organization
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingOrg(null)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleSaveEdit} className="space-y-4">
                <div>
                  <label
                    htmlFor="edit-org-name"
                    className="mb-1 block text-[12px] font-medium text-slate-700"
                  >
                    Organization Name
                  </label>
                  <input
                    id="edit-org-name"
                    type="text"
                    required
                    value={editingOrg.name}
                    onChange={(e) =>
                      setEditingOrg({ ...editingOrg, name: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-[13px] text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="edit-org-provider"
                    className="mb-1 block text-[12px] font-medium text-slate-700"
                  >
                    Voice AI Provider
                  </label>
                  <select
                    id="edit-org-provider"
                    value={editingOrg.provider}
                    onChange={(e) =>
                      setEditingOrg({
                        ...editingOrg,
                        provider: e.target.value as VoiceAiProvider,
                      })
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-[13px] text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="LIVEKIT">LIVEKIT</option>
                    <option value="DOGRAH">DOGRAH</option>
                    <option value="VAPI">VAPI</option>
                    <option value="RETELL">RETELL</option>
                  </select>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/70 p-3">
                  <div>
                    <span className="text-[13px] font-medium text-slate-800">
                      Organization Status
                    </span>
                    <p className="text-[11px] text-slate-500">
                      Active organizations can initiate outbound AI calls.
                    </p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={editingOrg.isActive}
                    onClick={() =>
                      setEditingOrg({
                        ...editingOrg,
                        isActive: !editingOrg.isActive,
                      })
                    }
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                      editingOrg.isActive ? "bg-blue-600" : "bg-slate-200"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                        editingOrg.isActive ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                <div className="mt-5 flex items-center justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingOrg(null)}
                    className="rounded-full border border-slate-200 px-4 py-2 text-[13px] font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-full bg-[#1E293B] px-5 py-2 text-[13px] font-medium text-white hover:bg-slate-800 transition-colors shadow-xs"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
