"use client";

import React, { useState } from "react";
import {
  Bell,
  Building2,
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  CreditCard,
  GitBranch,
  Info,
  LogOut,
  Menu,
  PhoneCall,
  Plug,
  ShieldCheck,
  SlidersHorizontal,
  User,
  Users,
  Volume2,
  X,
} from "lucide-react";
import { SELECTED_ORGANIZATION } from "@/data/telephony";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const sidebarContent = (isMobile = false) => (
    <div className="flex h-full flex-col bg-white">
      {/* Brand Header */}
      <div className="flex h-14 items-center justify-between border-b border-slate-100 px-4">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center">
            <svg viewBox="0 0 28 28" className="h-7 w-7" aria-hidden="true">
              <path
                d="M3 22V8.5L9.5 14L14 6L18.5 14L25 8.5V22H20.5V14.8L14 20.5L7.5 14.8V22H3Z"
                fill="#1D4ED8"
              />
              <path
                d="M14 6L18.5 14L25 8.5V22H20.5V14.8L14 20.5V6Z"
                fill="#0F172A"
              />
            </svg>
          </div>
          {(!sidebarCollapsed || isMobile) && (
            <span className="truncate text-[17px] font-bold tracking-tight text-[#0F172A]">
              Mantra<span className="text-[#1D4ED8]">Assist</span>
            </span>
          )}
        </div>

        {isMobile ? (
          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100"
            aria-label="Close navigation menu"
          >
            <X className="h-5 w-5" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setSidebarCollapsed((prev) => !prev)}
            className="hidden h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 shadow-xs hover:bg-slate-50 hover:text-slate-600 lg:inline-flex"
            aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {sidebarCollapsed ? (
              <ChevronRight className="h-3.5 w-3.5" />
            ) : (
              <ChevronLeft className="h-3.5 w-3.5" />
            )}
          </button>
        )}
      </div>

      {/* Organization Switcher */}
      {(!sidebarCollapsed || isMobile) && (
        <div className="px-3.5 pt-3.5 pb-2">
          <p className="mb-1.5 px-1 text-[10.5px] font-medium text-slate-400">
            Switch Organization
          </p>
          <div className="flex items-center justify-between rounded-xl border border-slate-200/90 bg-white px-2.5 py-2 shadow-2xs">
            <div className="flex min-w-0 items-center gap-2.5">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#1E293B] text-[11px] font-semibold text-white">
                {SELECTED_ORGANIZATION.initial}
              </span>
              <span className="truncate text-[12.5px] font-medium text-slate-800">
                {SELECTED_ORGANIZATION.name}
              </span>
            </div>
            <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 text-slate-400" />
          </div>
        </div>
      )}

      {/* Navigation Items */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-3 text-[13px]">
        <NavItem
          icon={<Users className="h-4 w-4" />}
          label="Contacts"
          collapsed={sidebarCollapsed && !isMobile}
        />
        <NavItem
          icon={<PhoneCall className="h-4 w-4" />}
          label="Call Logs"
          collapsed={sidebarCollapsed && !isMobile}
        />
        <NavItem
          icon={<GitBranch className="h-4 w-4" />}
          label="Processes"
          collapsed={sidebarCollapsed && !isMobile}
        />
        <NavItem
          icon={<Calendar className="h-4 w-4" />}
          label="Appointments"
          collapsed={sidebarCollapsed && !isMobile}
        />

        {/* Collapsible Visual Sections */}
        {(!sidebarCollapsed || isMobile) && (
          <>
            <div className="pt-2">
              <div className="flex items-center justify-between rounded-lg px-2.5 py-2 text-[12px] font-medium text-slate-500">
                <span>Revenue &amp; Insights</span>
                <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
              </div>
              <div className="flex items-center justify-between rounded-lg px-2.5 py-2 text-[12px] font-medium text-slate-500">
                <span>Customization</span>
                <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
              </div>
              <div className="flex items-center justify-between rounded-lg px-2.5 py-2 text-[12px] font-medium text-slate-600">
                <span>Settings</span>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
              </div>
            </div>
          </>
        )}

        <div className="space-y-0.5">
          <NavItem
            icon={<Building2 className="h-4 w-4" />}
            label="Organizations"
            collapsed={sidebarCollapsed && !isMobile}
          />
          <NavItem
            icon={<SlidersHorizontal className="h-4 w-4" />}
            label="Section/Fields"
            collapsed={sidebarCollapsed && !isMobile}
          />
          <NavItem
            icon={<CreditCard className="h-4 w-4" />}
            label="Billing"
            hasSubmenu
            collapsed={sidebarCollapsed && !isMobile}
          />
          <NavItem
            icon={<Plug className="h-4 w-4" />}
            label="Integrations"
            active
            collapsed={sidebarCollapsed && !isMobile}
          />
          <NavItem
            icon={<ShieldCheck className="h-4 w-4" />}
            label="Roles & Permissions"
            collapsed={sidebarCollapsed && !isMobile}
          />
          <NavItem
            icon={<Volume2 className="h-4 w-4" />}
            label="AI Voices"
            collapsed={sidebarCollapsed && !isMobile}
          />
          <NavItem
            icon={<User className="h-4 w-4" />}
            label="Account"
            collapsed={sidebarCollapsed && !isMobile}
          />
          <NavItem
            icon={<Bell className="h-4 w-4" />}
            label="Notifications"
            collapsed={sidebarCollapsed && !isMobile}
          />
        </div>
      </nav>

      {/* Footer Logout */}
      <div className="border-t border-slate-100 p-3">
        <div
          className={`flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-[13px] font-medium text-red-500 ${
            sidebarCollapsed && !isMobile ? "justify-center" : ""
          }`}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {(!sidebarCollapsed || isMobile) && <span>Log out</span>}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#f4f6f9]">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden shrink-0 border-r border-slate-200/80 bg-white transition-all duration-200 lg:block ${
          sidebarCollapsed ? "w-[72px]" : "w-[232px]"
        }`}
      >
        <div className="sticky top-0 h-screen">{sidebarContent(false)}</div>
      </aside>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-[1px]"
            onClick={() => setMobileMenuOpen(false)}
          />
          <aside className="relative z-10 w-[250px] max-w-[82vw] bg-white shadow-xl">
            {sidebarContent(true)}
          </aside>
        </div>
      )}

      {/* Main Column */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 backdrop-blur-sm sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="rounded-lg border border-slate-200 p-1.5 text-slate-600 hover:bg-slate-50 lg:hidden"
              aria-label="Open navigation menu"
            >
              <Menu className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-1.5">
              <h1 className="text-[16px] font-semibold text-slate-900">
                Integrations
              </h1>
              <span
                title="Manage telephony, EHR, CRM, and payment provider integrations"
                className="inline-flex text-slate-400"
              >
                <Info className="h-3.5 w-3.5" />
              </span>
            </div>
          </div>

          <button
            type="button"
            className="rounded-full p-2 text-slate-500 hover:bg-slate-100"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
          </button>
        </header>

        {/* Page Content */}
        <main className="mx-auto w-full max-w-[1440px] flex-1 px-4 py-5 sm:px-6 lg:px-7">
          {children}
        </main>
      </div>
    </div>
  );
}

function NavItem({
  icon,
  label,
  active = false,
  hasSubmenu = false,
  collapsed = false,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  hasSubmenu?: boolean;
  collapsed?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between rounded-xl px-2.5 py-2 transition-colors ${
        active
          ? "bg-[#1E293B] font-medium text-white shadow-xs"
          : "text-slate-600"
      } ${collapsed ? "justify-center px-2" : ""}`}
      title={collapsed ? label : undefined}
    >
      <div className="flex min-w-0 items-center gap-2.5">
        <span className={active ? "text-white" : "text-slate-400"}>{icon}</span>
        {!collapsed && <span className="truncate">{label}</span>}
      </div>
      {!collapsed && hasSubmenu && (
        <ChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-400" />
      )}
    </div>
  );
}

