"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BarChart3,
  Bell,
  BookOpen,
  Building2,
  CheckSquare,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  FileText,
  GitFork,
  Info,
  Link2,
  List,
  LogOut,
  Menu,
  Mic,
  Package,
  PhoneCall,
  ShieldCheck,
  Sliders,
  SlidersHorizontal,
  SlidersVertical,
  UserCheck,
  Wrench,
  X,
} from "lucide-react";
import { PortalSwitcher } from "@/components/common/PortalSwitcher";

interface AdminShellProps {
  children: React.ReactNode;
  activeItem?: string;
  title?: string;
}

export function AdminShell({
  children,
  activeItem = "Integrations",
  title = "Integrations",
}: AdminShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentActive, setCurrentActive] = useState(activeItem);

  const [sectionsOpen, setSectionsOpen] = useState({
    prebuilt: true,
    manage: true,
    observability: false,
  });

  const toggleSection = (section: "prebuilt" | "manage" | "observability") => {
    setSectionsOpen((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const sidebarContent = (isMobile = false) => (
    <div className="flex h-full flex-col bg-white">
      {/* Brand Header */}
      <div className="relative flex h-14 items-center justify-between border-b border-slate-100 px-4">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center">
            <svg viewBox="0 0 28 28" className="h-7 w-7" aria-hidden="true">
              <path
                d="M3 22V8.5L9.5 14L14 6L18.5 14L25 8.5V22H20.5V14.8L14 20.5L7.5 14.8V22H3Z"
                fill="#002B5E"
              />
              <path
                d="M14 6L18.5 14L25 8.5V22H20.5V14.8L14 20.5V6Z"
                fill="#00A3FF"
              />
            </svg>
          </div>
          {(!sidebarCollapsed || isMobile) && (
            <div className="flex items-center overflow-hidden">
              <span className="truncate text-[18px] font-bold tracking-tight text-[#0A2540]">
                Mantra<span className="text-[#00A3FF]">Assist</span>
              </span>
            </div>
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

      {/* Admin Navigation */}
      <nav className="flex-1 space-y-3 overflow-y-auto px-3 py-3 text-[13px]">
        {/* Section 1: Prebuilt Templates */}
        <div>
          <AdminSectionHeader
            label="Prebuilt Templates"
            isOpen={sectionsOpen.prebuilt}
            onToggle={() => toggleSection("prebuilt")}
            collapsed={sidebarCollapsed && !isMobile}
          />
          {(sectionsOpen.prebuilt || (sidebarCollapsed && !isMobile)) && (
            <div className="mt-1 space-y-0.5">
              <AdminNavItem
                icon={<Building2 className="h-4 w-4" />}
                label="Industry & Services"
                active={currentActive === "Industry & Services"}
                collapsed={sidebarCollapsed && !isMobile}
                onClick={() => setCurrentActive("Industry & Services")}
              />
              <AdminNavItem
                icon={<Package className="h-4 w-4" />}
                label="Products & Services"
                active={currentActive === "Products & Services"}
                collapsed={sidebarCollapsed && !isMobile}
                onClick={() => setCurrentActive("Products & Services")}
              />
              <AdminNavItem
                icon={<CreditCard className="h-4 w-4" />}
                label="Plans & Credits"
                active={currentActive === "Plans & Credits"}
                collapsed={sidebarCollapsed && !isMobile}
                onClick={() => setCurrentActive("Plans & Credits")}
              />
              <AdminNavItem
                icon={<ShieldCheck className="h-4 w-4" />}
                label="Roles & Permissions"
                active={currentActive === "Roles & Permissions"}
                collapsed={sidebarCollapsed && !isMobile}
                onClick={() => setCurrentActive("Roles & Permissions")}
              />
              <AdminNavItem
                icon={<SlidersHorizontal className="h-4 w-4" />}
                label="Custom Fields"
                active={currentActive === "Custom Fields"}
                collapsed={sidebarCollapsed && !isMobile}
                onClick={() => setCurrentActive("Custom Fields")}
              />
              <AdminNavItem
                icon={<BarChart3 className="h-4 w-4" />}
                label="Report Templates"
                active={currentActive === "Report Templates"}
                collapsed={sidebarCollapsed && !isMobile}
                onClick={() => setCurrentActive("Report Templates")}
              />
              <AdminNavItem
                icon={<FileText className="h-4 w-4" />}
                label="Document Templates"
                active={currentActive === "Document Templates"}
                collapsed={sidebarCollapsed && !isMobile}
                onClick={() => setCurrentActive("Document Templates")}
              />
              <AdminNavItem
                icon={<Sliders className="h-4 w-4" />}
                label="Forms"
                active={currentActive === "Forms"}
                collapsed={sidebarCollapsed && !isMobile}
                onClick={() => setCurrentActive("Forms")}
              />
              <AdminNavItem
                icon={<GitFork className="h-4 w-4" />}
                label="Workflows"
                active={currentActive === "Workflows"}
                collapsed={sidebarCollapsed && !isMobile}
                onClick={() => setCurrentActive("Workflows")}
              />
              <AdminNavItem
                icon={<Wrench className="h-4 w-4" />}
                label="Automations"
                active={currentActive === "Automations"}
                collapsed={sidebarCollapsed && !isMobile}
                onClick={() => setCurrentActive("Automations")}
              />
              <AdminNavItem
                icon={<BookOpen className="h-4 w-4" />}
                label="Knowledge Base"
                active={currentActive === "Knowledge Base"}
                collapsed={sidebarCollapsed && !isMobile}
                onClick={() => setCurrentActive("Knowledge Base")}
              />
              <AdminNavItem
                icon={<CheckSquare className="h-4 w-4" />}
                label="Tasks"
                active={currentActive === "Tasks"}
                collapsed={sidebarCollapsed && !isMobile}
                onClick={() => setCurrentActive("Tasks")}
              />
            </div>
          )}
        </div>

        {/* Section 2: Manage */}
        <div>
          <AdminSectionHeader
            label="Manage"
            isOpen={sectionsOpen.manage}
            onToggle={() => toggleSection("manage")}
            collapsed={sidebarCollapsed && !isMobile}
          />
          {(sectionsOpen.manage || (sidebarCollapsed && !isMobile)) && (
            <div className="mt-1 space-y-0.5">
              <AdminNavItem
                icon={<UserCheck className="h-4 w-4" />}
                label="Admin Users"
                active={currentActive === "Admin Users"}
                collapsed={sidebarCollapsed && !isMobile}
                onClick={() => setCurrentActive("Admin Users")}
              />
              <AdminNavItem
                icon={<Building2 className="h-4 w-4" />}
                label="Organization"
                active={currentActive === "Organization"}
                collapsed={sidebarCollapsed && !isMobile}
                href="/admin/organization"
                onClick={() => setCurrentActive("Organization")}
              />
              <AdminNavItem
                icon={<Link2 className="h-4 w-4" />}
                label="Integrations"
                active={currentActive === "Integrations"}
                collapsed={sidebarCollapsed && !isMobile}
                href="/admin/integration"
                onClick={() => setCurrentActive("Integrations")}
              />
              <AdminNavItem
                icon={<Mic className="h-4 w-4" />}
                label="AI Voices"
                active={currentActive === "AI Voices"}
                collapsed={sidebarCollapsed && !isMobile}
                onClick={() => setCurrentActive("AI Voices")}
              />
              <AdminNavItem
                icon={<SlidersVertical className="h-4 w-4" />}
                label="Feature Switches"
                active={currentActive === "Feature Switches"}
                collapsed={sidebarCollapsed && !isMobile}
                onClick={() => setCurrentActive("Feature Switches")}
              />
            </div>
          )}
        </div>

        {/* Section 3: Observability */}
        <div>
          <AdminSectionHeader
            label="Observability"
            isOpen={sectionsOpen.observability}
            onToggle={() => toggleSection("observability")}
            collapsed={sidebarCollapsed && !isMobile}
          />
          {(sectionsOpen.observability || (sidebarCollapsed && !isMobile)) && (
            <div className="mt-1 space-y-0.5">
              <AdminNavItem
                icon={<List className="h-4 w-4" />}
                label="logs"
                active={currentActive === "logs"}
                collapsed={sidebarCollapsed && !isMobile}
                onClick={() => setCurrentActive("logs")}
              />
              <AdminNavItem
                icon={<PhoneCall className="h-4 w-4" />}
                label="Calls Monitoring"
                active={currentActive === "Calls Monitoring"}
                collapsed={sidebarCollapsed && !isMobile}
                onClick={() => setCurrentActive("Calls Monitoring")}
              />
            </div>
          )}
        </div>
      </nav>

      {/* Footer Logout */}
      <div className="border-t border-slate-100 p-3">
        <button
          type="button"
          className={`flex w-full items-center gap-2.5 rounded-full px-3 py-2 text-[13px] font-medium text-red-500 hover:bg-red-50/50 transition-colors ${
            sidebarCollapsed && !isMobile ? "justify-center" : ""
          }`}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {(!sidebarCollapsed || isMobile) && <span>Log out</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#f4f6f9]">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden shrink-0 border-r border-slate-200/80 bg-white transition-all duration-200 lg:block ${
          sidebarCollapsed ? "w-[72px]" : "w-[244px]"
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
          <aside className="relative z-10 w-[260px] max-w-[85vw] bg-white shadow-xl">
            {sidebarContent(true)}
          </aside>
        </div>
      )}

      {/* Main Column */}
      <div className="flex min-w-0 flex-1 flex-col">
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
            <div className="flex items-center gap-2">
              <h1 className="text-[16px] font-semibold text-slate-900">
                {title}
              </h1>
              <span
                title={
                  title === "Organizations"
                    ? "Manage organizations and their Voice AI providers"
                    : "Admin Telephony Configurations, Client Numbers, and Outbound Reports"
                }
                className="inline-flex text-slate-400"
              >
                <Info className="h-3.5 w-3.5" />
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <PortalSwitcher current="admin" />
            <button
              type="button"
              className="rounded-full p-2 text-slate-500 hover:bg-slate-100"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
            </button>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1440px] flex-1 px-4 py-5 sm:px-6 lg:px-7">
          {children}
        </main>
      </div>
    </div>
  );
}

function AdminSectionHeader({
  label,
  isOpen,
  onToggle,
  collapsed,
}: {
  label: string;
  isOpen: boolean;
  onToggle: () => void;
  collapsed: boolean;
}) {
  if (collapsed) {
    return <div className="my-2 border-t border-slate-100" />;
  }

  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex w-full items-center justify-between px-3 py-1.5 text-[12px] font-medium text-slate-400 hover:text-slate-600 transition-colors text-left"
    >
      <span>{label}</span>
      {isOpen ? (
        <ChevronDown className="h-3.5 w-3.5 text-slate-400 shrink-0" />
      ) : (
        <ChevronRight className="h-3.5 w-3.5 text-slate-400 shrink-0" />
      )}
    </button>
  );
}

function AdminNavItem({
  icon,
  label,
  active = false,
  collapsed = false,
  href,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  collapsed?: boolean;
  href?: string;
  onClick?: () => void;
}) {
  const content = (
    <>
      <span
        className={`shrink-0 transition-colors ${
          active
            ? "text-white"
            : "text-slate-400 group-hover:text-slate-600"
        }`}
      >
        {icon}
      </span>
      {!collapsed && <span className="truncate">{label}</span>}
    </>
  );

  const className = `group flex w-full items-center gap-3 rounded-full px-3.5 py-2 text-[13px] transition-colors text-left ${
    active
      ? "bg-[#2c3545] font-medium text-white shadow-2xs"
      : "text-slate-600 hover:bg-slate-100/70 hover:text-slate-900"
  } ${collapsed ? "justify-center px-2" : ""}`;

  if (href) {
    return (
      <Link
        href={href}
        role="button"
        onClick={onClick}
        className={className}
        title={collapsed ? label : undefined}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={className}
      title={collapsed ? label : undefined}
    >
      {content}
    </button>
  );
}

