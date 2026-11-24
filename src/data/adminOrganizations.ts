export type VoiceAiProvider = "LIVEKIT" | "DOGRAH" | "VAPI" | "RETELL";

export interface ConcurrencyDataPoint {
  id: string;
  timestamp: string; // ISO or human format
  label: string; // e.g. "Nov 24 14:00"
  date: string; // "YYYY-MM-DD"
  concurrency: number;
  isSpike: boolean;
}

export interface AdminOrganization {
  id: string;
  name: string;
  provider: VoiceAiProvider;
  hasResync?: boolean;
  isActive: boolean;
  concurrencyLimit: number;
  concurrencyHistory: ConcurrencyDataPoint[];
}

// Helper to generate realistic concurrency logs for past 30 days
function generateConcurrencyData(
  limit: number,
  baseLoad: number,
  peakLoad: number,
  spikeDays: number[]
): ConcurrencyDataPoint[] {
  const points: ConcurrencyDataPoint[] = [];
  const now = new Date("2026-11-24T16:00:00Z");

  for (let i = 29; i >= 0; i--) {
    const dayDate = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const dateStr = dayDate.toISOString().split("T")[0];
    const dayMonth = dayDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

    // 4 data checkpoints per day (06:00, 11:00, 15:00, 20:00)
    const hours = [6, 11, 15, 20];
    hours.forEach((hour) => {
      const timeStr = `${hour.toString().padStart(2, "0")}:00`;
      const isSpikeDay = spikeDays.includes(i);

      let val = Math.floor(
        baseLoad + Math.sin((hour / 24) * Math.PI) * (peakLoad - baseLoad)
      );

      // Add day variations
      const noise = ((i * 7 + hour * 3) % 9) - 4;
      val = Math.max(5, val + noise);

      let isSpike = false;
      if (isSpikeDay && (hour === 11 || hour === 15)) {
        // Surge that spikes and can hit/exceed limit
        val = Math.floor(limit * (hour === 15 ? 1.08 : 0.96));
        isSpike = true;
      }

      points.push({
        id: `${dateStr}-${timeStr}`,
        timestamp: `${dateStr}T${timeStr}:00Z`,
        label: `${dayMonth} ${timeStr}`,
        date: dateStr,
        concurrency: val,
        isSpike,
      });
    });
  }

  return points;
}

export const INITIAL_ADMIN_ORGANIZATIONS: AdminOrganization[] = [
  {
    id: "org-1",
    name: "Test task organization 24-11-26",
    provider: "LIVEKIT",
    isActive: true,
    concurrencyLimit: 50,
    concurrencyHistory: generateConcurrencyData(50, 18, 38, [1, 3, 7, 14, 21]),
  },
  {
    id: "org-2",
    name: "Product Demo",
    provider: "LIVEKIT",
    isActive: true,
    concurrencyLimit: 30,
    concurrencyHistory: generateConcurrencyData(30, 8, 22, [2, 5, 12, 19]),
  },
  {
    id: "org-3",
    name: "Radiant Dental Care",
    provider: "DOGRAH",
    hasResync: true,
    isActive: true,
    concurrencyLimit: 75,
    concurrencyHistory: generateConcurrencyData(75, 25, 60, [0, 4, 9, 16, 25]),
  },
  {
    id: "org-4",
    name: "Apex Health Clinic",
    provider: "LIVEKIT",
    isActive: true,
    concurrencyLimit: 40,
    concurrencyHistory: generateConcurrencyData(40, 12, 32, [1, 8, 15, 22]),
  },
  {
    id: "org-5",
    name: "BrightSmile Orthodontics",
    provider: "LIVEKIT",
    isActive: true,
    concurrencyLimit: 35,
    concurrencyHistory: generateConcurrencyData(35, 10, 26, [3, 10, 18]),
  },
  {
    id: "org-6",
    name: "Northstar Wellness",
    provider: "DOGRAH",
    hasResync: true,
    isActive: false,
    concurrencyLimit: 60,
    concurrencyHistory: generateConcurrencyData(60, 20, 48, [2, 6, 13, 20, 27]),
  },
];
