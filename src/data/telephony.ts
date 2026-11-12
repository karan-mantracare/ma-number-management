export type NumberSource = "MantraAssist-provided" | "Client-added";
export type RoutingDirection = "inbound" | "outbound";

export interface TelephonyProviderItem {
  id: string;
  name: string;
  label: string;
  direction: RoutingDirection;
  countryIso: string;
  countryCode: string;
  phoneNumber: string;
  source: NumberSource;
  enabled: boolean;
}

export interface RoutingNumberItem {
  id: string;
  phoneNumber: string;
  countryIso: string;
  isDefault: boolean;
  source: NumberSource;
  direction: RoutingDirection;
  priority: number;
  processes: string[];
  extraProcessesCount?: number;
  targetedCountries: string[];
}

export const SELECTED_ORGANIZATION = {
  id: "org_radiant_dental",
  initial: "R",
  name: "Radiant Dental Care",
};

export const COUNTRY_DIAL_CODES = [
  { code: "+1", label: "US / CA (+1)", iso: "US" },
  { code: "+91", label: "IN (+91)", iso: "IN" },
  { code: "+44", label: "UK (+44)", iso: "GB" },
  { code: "+61", label: "AU (+61)", iso: "AU" },
  { code: "+65", label: "SG (+65)", iso: "SG" },
  { code: "+81", label: "JP (+81)", iso: "JP" },
  { code: "+45", label: "DK (+45)", iso: "DK" },
  { code: "+32", label: "BE (+32)", iso: "BE" },
  { code: "+46", label: "SE (+46)", iso: "SE" },
  { code: "+63", label: "PH (+63)", iso: "PH" },
  { code: "+27", label: "ZA (+27)", iso: "ZA" },
  { code: "+971", label: "AE (+971)", iso: "AE" },
];

export const TELEPHONY_PROVIDERS: TelephonyProviderItem[] = [
  {
    id: "prov-voicelink-1",
    name: "VoiceLink",
    label: "No label",
    direction: "inbound",
    countryIso: "IN",
    countryCode: "IN",
    phoneNumber: "+919429399672",
    source: "MantraAssist-provided",
    enabled: true,
  },
  {
    id: "prov-plivo-1",
    name: "Plivo",
    label: "plivo-30-10-2026",
    direction: "outbound",
    countryIso: "IN",
    countryCode: "IN",
    phoneNumber: "+918065531573",
    source: "Client-added",
    enabled: true,
  },
];

export const ROUTING_NUMBERS: RoutingNumberItem[] = [
  // Outbound numbers (matching screenshot order + explicit source field)
  {
    id: "out-1",
    phoneNumber: "+918065531573",
    countryIso: "IN",
    isDefault: false,
    source: "Client-added",
    direction: "outbound",
    priority: 1,
    processes: [
      "Feedback Pipeline (5 sta...",
      "Appointment Managem...",
      "Old Clients/Re-engage P...",
    ],
    extraProcessesCount: 3,
    targetedCountries: ["India"],
  },
  {
    id: "out-2",
    phoneNumber: "+61485016743",
    countryIso: "AU",
    isDefault: true,
    source: "MantraAssist-provided",
    direction: "outbound",
    priority: 15,
    processes: [],
    targetedCountries: ["Australia"],
  },
  {
    id: "out-3",
    phoneNumber: "+447458038154",
    countryIso: "GB",
    isDefault: true,
    source: "MantraAssist-provided",
    direction: "outbound",
    priority: 13,
    processes: [],
    targetedCountries: ["United Kingdom"],
  },
  {
    id: "out-4",
    phoneNumber: "+4578724799",
    countryIso: "DK",
    isDefault: true,
    source: "MantraAssist-provided",
    direction: "outbound",
    priority: 19,
    processes: [],
    targetedCountries: ["Denmark"],
  },
  {
    id: "out-5",
    phoneNumber: "32480204376",
    countryIso: "BE",
    isDefault: true,
    source: "MantraAssist-provided",
    direction: "outbound",
    priority: 18,
    processes: [],
    targetedCountries: ["Belgium"],
  },
  {
    id: "out-6",
    phoneNumber: "63454971000",
    countryIso: "PH",
    isDefault: true,
    source: "MantraAssist-provided",
    direction: "outbound",
    priority: 17,
    processes: [],
    targetedCountries: ["Philippines"],
  },
  {
    id: "out-7",
    phoneNumber: "815050500727",
    countryIso: "JP",
    isDefault: true,
    source: "MantraAssist-provided",
    direction: "outbound",
    priority: 16,
    processes: [],
    targetedCountries: ["Japan"],
  },
  {
    id: "out-8",
    phoneNumber: "46766920242",
    countryIso: "SE",
    isDefault: true,
    source: "MantraAssist-provided",
    direction: "outbound",
    priority: 14,
    processes: [],
    targetedCountries: ["Sweden"],
  },
  {
    id: "out-9",
    phoneNumber: "2760050573",
    countryIso: "ZA",
    isDefault: true,
    source: "MantraAssist-provided",
    direction: "outbound",
    priority: 12,
    processes: [],
    targetedCountries: ["South Africa"],
  },
  {
    id: "out-10",
    phoneNumber: "6531251652",
    countryIso: "SG",
    isDefault: true,
    source: "MantraAssist-provided",
    direction: "outbound",
    priority: 11,
    processes: [],
    targetedCountries: ["Singapore"],
  },
  {
    id: "out-11",
    phoneNumber: "14842918903",
    countryIso: "US",
    isDefault: true,
    source: "MantraAssist-provided",
    direction: "outbound",
    priority: 10,
    processes: [],
    targetedCountries: ["United States", "Canada"],
  },

  // Inbound numbers (demonstrating both sources + Default badge)
  {
    id: "in-1",
    phoneNumber: "+919429399672",
    countryIso: "IN",
    isDefault: false,
    source: "MantraAssist-provided",
    direction: "inbound",
    priority: 1,
    processes: ["Inbound Triage (4 sta...", "Appointment Booking"],
    targetedCountries: ["India"],
  },
  {
    id: "in-2",
    phoneNumber: "+14155550192",
    countryIso: "US",
    isDefault: false,
    source: "Client-added",
    direction: "inbound",
    priority: 2,
    processes: ["After-Hours Support", "Emergency Dental Line"],
    targetedCountries: ["United States", "Canada"],
  },
  {
    id: "in-3",
    phoneNumber: "+442079460198",
    countryIso: "GB",
    isDefault: true,
    source: "MantraAssist-provided",
    direction: "inbound",
    priority: 10,
    processes: [],
    targetedCountries: ["United Kingdom"],
  },
  {
    id: "in-4",
    phoneNumber: "+61280149210",
    countryIso: "AU",
    isDefault: true,
    source: "MantraAssist-provided",
    direction: "inbound",
    priority: 11,
    processes: [],
    targetedCountries: ["Australia"],
  },
];

