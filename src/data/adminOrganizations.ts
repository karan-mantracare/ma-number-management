export type VoiceAiProvider = "LIVEKIT" | "DOGRAH" | "VAPI" | "RETELL";

export interface AdminOrganization {
  id: string;
  name: string;
  provider: VoiceAiProvider;
  hasResync?: boolean;
  isActive: boolean;
}

export const INITIAL_ADMIN_ORGANIZATIONS: AdminOrganization[] = [
  {
    id: "org-1",
    name: "Test task organization 24-11-26",
    provider: "LIVEKIT",
    isActive: true,
  },
  {
    id: "org-2",
    name: "Product Demo",
    provider: "LIVEKIT",
    isActive: true,
  },
  {
    id: "org-3",
    name: "Radiant Dental Care",
    provider: "DOGRAH",
    hasResync: true,
    isActive: true,
  },
  {
    id: "org-4",
    name: "Apex Health Clinic",
    provider: "LIVEKIT",
    isActive: true,
  },
  {
    id: "org-5",
    name: "BrightSmile Orthodontics",
    provider: "LIVEKIT",
    isActive: true,
  },
  {
    id: "org-6",
    name: "Northstar Wellness",
    provider: "DOGRAH",
    hasResync: true,
    isActive: false,
  },
];
