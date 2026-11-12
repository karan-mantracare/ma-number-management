import type { NumberSource, RoutingDirection } from "./telephony";

export interface AdminClientOrg {
  id: string;
  name: string;
}

export interface AdminPhoneNumberRecord {
  id: string;
  clientId: string;
  clientName: string;
  phoneNumber: string;
  countryIso: string;
  provider: string;
  direction: RoutingDirection;
  source: NumberSource;
  isDefault?: boolean;
  status: "Active" | "Inactive";
  assignedOrgsLabel?: string;
}

export type CallAttemptStatus =
  | "completed"
  | "no-answer"
  | "failed"
  | "busy";

export interface DemoCallLogRecord {
  id: string;
  clientId: string;
  clientName: string;
  originatingNumber: string;
  numberSource: NumberSource;
  direction: RoutingDirection;
  status: CallAttemptStatus;
  /** ISO timestamp YYYY-MM-DDTHH:mm:ssZ */
  timestamp: string;
}

export const ADMIN_CLIENT_ORGS: AdminClientOrg[] = [
  { id: "org_radiant", name: "Radiant Dental Care" },
  { id: "org_apex", name: "Apex Health Clinic" },
  { id: "org_brightsmile", name: "BrightSmile Orthodontics" },
  { id: "org_northstar", name: "Northstar Wellness" },
];

export const ADMIN_SYSTEM_CONFIGS: AdminPhoneNumberRecord[] = [
  {
    id: "sys-1",
    clientId: "system_pool",
    clientName: "Shared System Pool",
    phoneNumber: "+14842918903",
    countryIso: "US",
    provider: "Plivo",
    direction: "outbound",
    source: "MantraAssist-provided",
    isDefault: true,
    status: "Active",
    assignedOrgsLabel: "Radiant Dental Care, Apex Health Clinic",
  },
  {
    id: "sys-2",
    clientId: "system_pool",
    clientName: "Shared System Pool",
    phoneNumber: "+919429399672",
    countryIso: "IN",
    provider: "VoiceLink",
    direction: "inbound",
    source: "MantraAssist-provided",
    isDefault: false,
    status: "Active",
    assignedOrgsLabel: "Radiant Dental Care",
  },
  {
    id: "sys-3",
    clientId: "system_pool",
    clientName: "Shared System Pool",
    phoneNumber: "+61485016743",
    countryIso: "AU",
    provider: "Plivo",
    direction: "outbound",
    source: "MantraAssist-provided",
    isDefault: true,
    status: "Active",
    assignedOrgsLabel: "Apex Health Clinic",
  },
  {
    id: "sys-4",
    clientId: "system_pool",
    clientName: "Shared System Pool",
    phoneNumber: "+447458038154",
    countryIso: "GB",
    provider: "Plivo",
    direction: "outbound",
    source: "MantraAssist-provided",
    isDefault: true,
    status: "Active",
    assignedOrgsLabel: "Radiant Dental Care",
  },
  {
    id: "sys-5",
    clientId: "system_pool",
    clientName: "Shared System Pool",
    phoneNumber: "+6531251652",
    countryIso: "SG",
    provider: "Twilio",
    direction: "outbound",
    source: "MantraAssist-provided",
    isDefault: true,
    status: "Active",
    assignedOrgsLabel: "BrightSmile Orthodontics",
  },
  {
    id: "sys-6",
    clientId: "system_pool",
    clientName: "Shared System Pool",
    phoneNumber: "+442079460198",
    countryIso: "GB",
    provider: "VoiceLink",
    direction: "outbound",
    source: "MantraAssist-provided",
    isDefault: false,
    status: "Inactive",
    assignedOrgsLabel: "Northstar Wellness",
  },
];

/**
 * Combined number inventory across organizations; Client Number view filters
 * strictly on `source === "Client-added"`.
 */
export const ADMIN_NUMBERS_INVENTORY: AdminPhoneNumberRecord[] = [
  ...ADMIN_SYSTEM_CONFIGS,
  {
    id: "cli-1",
    clientId: "org_radiant",
    clientName: "Radiant Dental Care",
    phoneNumber: "+918065531573",
    countryIso: "IN",
    provider: "Plivo",
    direction: "outbound",
    source: "Client-added",
    status: "Active",
  },
  {
    id: "cli-2",
    clientId: "org_radiant",
    clientName: "Radiant Dental Care",
    phoneNumber: "+918065531574",
    countryIso: "IN",
    provider: "Plivo",
    direction: "outbound",
    source: "Client-added",
    status: "Active",
  },
  {
    id: "cli-3",
    clientId: "org_radiant",
    clientName: "Radiant Dental Care",
    phoneNumber: "+14155550192",
    countryIso: "US",
    provider: "Twilio",
    direction: "outbound",
    source: "Client-added",
    status: "Active",
  },
  {
    id: "cli-4",
    clientId: "org_radiant",
    clientName: "Radiant Dental Care",
    phoneNumber: "+14155550193",
    countryIso: "US",
    provider: "Twilio",
    direction: "outbound",
    source: "Client-added",
    status: "Active",
  },
  {
    id: "cli-5",
    clientId: "org_radiant",
    clientName: "Radiant Dental Care",
    phoneNumber: "+14155550194",
    countryIso: "US",
    provider: "Twilio",
    direction: "outbound",
    source: "Client-added",
    status: "Active",
  },
  {
    id: "cli-6",
    clientId: "org_radiant",
    clientName: "Radiant Dental Care",
    phoneNumber: "+14155550195",
    countryIso: "US",
    provider: "Twilio",
    direction: "outbound",
    source: "Client-added",
    status: "Active",
  },
  {
    id: "cli-7",
    clientId: "org_apex",
    clientName: "Apex Health Clinic",
    phoneNumber: "+12125550181",
    countryIso: "US",
    provider: "Twilio",
    direction: "outbound",
    source: "Client-added",
    status: "Active",
  },
  {
    id: "cli-8",
    clientId: "org_apex",
    clientName: "Apex Health Clinic",
    phoneNumber: "+12125550182",
    countryIso: "US",
    provider: "Twilio",
    direction: "outbound",
    source: "Client-added",
    status: "Active",
  },
  {
    id: "cli-9",
    clientId: "org_brightsmile",
    clientName: "BrightSmile Orthodontics",
    phoneNumber: "+447700900123",
    countryIso: "GB",
    provider: "Vonage",
    direction: "outbound",
    source: "Client-added",
    status: "Active",
  },
  {
    id: "cli-10",
    clientId: "org_brightsmile",
    clientName: "BrightSmile Orthodontics",
    phoneNumber: "+447700900124",
    countryIso: "GB",
    provider: "Vonage",
    direction: "inbound",
    source: "Client-added",
    status: "Inactive",
  },
  {
    id: "cli-11",
    clientId: "org_northstar",
    clientName: "Northstar Wellness",
    phoneNumber: "+13125550140",
    countryIso: "US",
    provider: "Exotel",
    direction: "outbound",
    source: "Client-added",
    status: "Active",
  },
];

function makeLog(
  id: string,
  clientId: string,
  clientName: string,
  originatingNumber: string,
  numberSource: NumberSource,
  status: CallAttemptStatus,
  date: string,
  direction: RoutingDirection = "outbound"
): DemoCallLogRecord {
  return {
    id,
    clientId,
    clientName,
    originatingNumber,
    numberSource,
    direction,
    status,
    timestamp: `${date}T10:00:00Z`,
  };
}

function expandCalls(
  prefix: string,
  clientId: string,
  clientName: string,
  originatingNumber: string,
  numberSource: NumberSource,
  entries: Array<{ date: string; status: CallAttemptStatus; direction?: RoutingDirection }>
): DemoCallLogRecord[] {
  return entries.map((entry, idx) =>
    makeLog(
      `${prefix}-${idx + 1}`,
      clientId,
      clientName,
      originatingNumber,
      numberSource,
      entry.status,
      entry.date,
      entry.direction ?? "outbound"
    )
  );
}

/**
 * Demo outbound & inbound call logs spanning Oct 2026 - Nov 12, 2026.
 * System number +14842918903 is intentionally shared by Radiant Dental Care
 * (7 outbound calls) and Apex Health Clinic (3 outbound calls) to demonstrate
 * accurate per-client attribution.
 */
export const DEMO_CALL_LOGS: DemoCallLogRecord[] = [
  // Radiant Dental Care - Client-added numbers (6 numbers -> tests top 5 vs total)
  ...expandCalls("rad-c1", "org_radiant", "Radiant Dental Care", "+918065531573", "Client-added", [
    { date: "2026-10-20", status: "completed" },
    { date: "2026-10-22", status: "completed" },
    { date: "2026-11-08", status: "completed" },
    { date: "2026-11-09", status: "completed" },
    { date: "2026-11-10", status: "completed" },
    { date: "2026-11-11", status: "no-answer" },
  ]),
  ...expandCalls("rad-c2", "org_radiant", "Radiant Dental Care", "+918065531574", "Client-added", [
    { date: "2026-11-07", status: "completed" },
    { date: "2026-11-08", status: "completed" },
    { date: "2026-11-09", status: "completed" },
    { date: "2026-11-10", status: "completed" },
    { date: "2026-11-11", status: "failed" },
  ]),
  ...expandCalls("rad-c3", "org_radiant", "Radiant Dental Care", "+14155550192", "Client-added", [
    { date: "2026-10-25", status: "completed" },
    { date: "2026-10-26", status: "completed" },
    { date: "2026-11-09", status: "completed" },
    { date: "2026-11-10", status: "busy" },
    // Inbound call on same number -> must be ignored in outbound report
    { date: "2026-11-11", status: "completed", direction: "inbound" },
  ]),
  ...expandCalls("rad-c4", "org_radiant", "Radiant Dental Care", "+14155550193", "Client-added", [
    { date: "2026-11-02", status: "completed" },
    { date: "2026-11-03", status: "completed" },
    { date: "2026-11-04", status: "no-answer" },
  ]),
  ...expandCalls("rad-c5", "org_radiant", "Radiant Dental Care", "+14155550194", "Client-added", [
    { date: "2026-10-18", status: "completed" },
    { date: "2026-10-19", status: "failed" },
  ]),
  ...expandCalls("rad-c6", "org_radiant", "Radiant Dental Care", "+14155550195", "Client-added", [
    { date: "2026-11-11", status: "completed" },
  ]),

  // Radiant Dental Care - System numbers (includes shared +14842918903)
  ...expandCalls("rad-s1", "org_radiant", "Radiant Dental Care", "+14842918903", "MantraAssist-provided", [
    { date: "2026-10-21", status: "completed" },
    { date: "2026-10-24", status: "completed" },
    { date: "2026-11-07", status: "completed" },
    { date: "2026-11-08", status: "completed" },
    { date: "2026-11-09", status: "completed" },
    { date: "2026-11-10", status: "completed" },
    { date: "2026-11-11", status: "no-answer" },
  ]),
  ...expandCalls("rad-s2", "org_radiant", "Radiant Dental Care", "+919429399672", "MantraAssist-provided", [
    { date: "2026-10-29", status: "completed" },
    { date: "2026-11-03", status: "completed" },
    { date: "2026-11-08", status: "completed" },
    { date: "2026-11-09", status: "failed" },
    // Inbound call on system number -> must be ignored in outbound report
    { date: "2026-11-10", status: "completed", direction: "inbound" },
  ]),
  ...expandCalls("rad-s3", "org_radiant", "Radiant Dental Care", "+447458038154", "MantraAssist-provided", [
    { date: "2026-11-01", status: "completed" },
    { date: "2026-11-02", status: "busy" },
  ]),

  // Apex Health Clinic - Client-added numbers (2 numbers -> #3..#5 blank)
  ...expandCalls("apx-c1", "org_apex", "Apex Health Clinic", "+12125550181", "Client-added", [
    { date: "2026-10-28", status: "completed" },
    { date: "2026-11-08", status: "completed" },
    { date: "2026-11-09", status: "completed" },
    { date: "2026-11-10", status: "no-answer" },
  ]),
  ...expandCalls("apx-c2", "org_apex", "Apex Health Clinic", "+12125550182", "Client-added", [
    { date: "2026-11-06", status: "completed" },
    { date: "2026-11-07", status: "failed" },
  ]),

  // Apex Health Clinic - System numbers (shares +14842918903 with Radiant)
  ...expandCalls("apx-s1", "org_apex", "Apex Health Clinic", "+61485016743", "MantraAssist-provided", [
    { date: "2026-10-23", status: "completed" },
    { date: "2026-11-07", status: "completed" },
    { date: "2026-11-08", status: "completed" },
    { date: "2026-11-09", status: "completed" },
    { date: "2026-11-10", status: "no-answer" },
  ]),
  ...expandCalls("apx-s2", "org_apex", "Apex Health Clinic", "+14842918903", "MantraAssist-provided", [
    { date: "2026-11-08", status: "completed" },
    { date: "2026-11-09", status: "completed" },
    { date: "2026-11-10", status: "failed" },
  ]),

  // BrightSmile Orthodontics - Client-added (October only -> 0 in Last 7 Days)
  ...expandCalls("brt-c1", "org_brightsmile", "BrightSmile Orthodontics", "+447700900123", "Client-added", [
    { date: "2026-10-16", status: "completed" },
    { date: "2026-10-19", status: "completed" },
    { date: "2026-10-22", status: "no-answer" },
  ]),

  // BrightSmile Orthodontics - System numbers (Nov 8-10)
  ...expandCalls("brt-s1", "org_brightsmile", "BrightSmile Orthodontics", "+6531251652", "MantraAssist-provided", [
    { date: "2026-11-08", status: "completed" },
    { date: "2026-11-10", status: "completed" },
  ]),

  // Northstar Wellness - System numbers in early Oct (outside default 30d window,
  // visible when date range includes 2026-10-05). Zero client-added calls anywhere.
  ...expandCalls("nth-s1", "org_northstar", "Northstar Wellness", "+442079460198", "MantraAssist-provided", [
    { date: "2026-10-05", status: "completed" },
    { date: "2026-10-06", status: "no-answer" },
  ]),
];

export const DEFAULT_REPORT_DATE_RANGE = {
  from: "2026-10-14",
  to: "2026-11-12",
};

