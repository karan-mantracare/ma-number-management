import type {
  AdminClientOrg,
  AdminPhoneNumberRecord,
  DemoCallLogRecord,
} from "@/data/adminTelephony";
import type { NumberSource } from "@/data/telephony";

export interface DateRangeFilter {
  from: string; // YYYY-MM-DD
  to: string; // YYYY-MM-DD
}

export interface RankedNumberEntry {
  phoneNumber: string;
  outboundCalls: number;
}

export interface CallVolumeClientRow {
  clientId: string;
  clientName: string;
  /** Up to 5 ranked entries (#1..#5); null when fewer than 5 numbers exist */
  ranks: [
    RankedNumberEntry | null,
    RankedNumberEntry | null,
    RankedNumberEntry | null,
    RankedNumberEntry | null,
    RankedNumberEntry | null,
  ];
}

export interface CompletedCallsClientRow {
  clientId: string;
  clientName: string;
  outboundCalls: number;
  completedCalls: number;
  completionRatio: string;
}

export interface DailyVolumePoint {
  date: string; // YYYY-MM-DD
  clientCalls: number;
  systemCalls: number;
  totalCalls: number;
}

export interface OutcomeBreakdown {
  completed: number;
  noAnswer: number;
  failed: number;
  busy: number;
}

export interface AdminTelephonyReportData {
  callVolume: {
    clientNumbers: CallVolumeClientRow[];
    systemNumbers: CallVolumeClientRow[];
    dailyTrend: DailyVolumePoint[];
  };
  completedCalls: {
    clientNumbers: CompletedCallsClientRow[];
    systemNumbers: CompletedCallsClientRow[];
    outcomeBreakdown: OutcomeBreakdown;
  };
}

/**
 * Filter number records to those explicitly recorded as Client-added, optionally
 * matching against client name or phone number.
 */
export function filterClientAddedNumbers(
  inventory: AdminPhoneNumberRecord[],
  searchQuery: string
): AdminPhoneNumberRecord[] {
  const query = searchQuery.trim().toLowerCase();
  const digitsQuery = query.replace(/\D/g, "");

  return inventory.filter((item) => {
    if (item.source !== "Client-added") return false;
    if (!query) return true;

    const clientMatches = item.clientName.toLowerCase().includes(query);
    const phoneLower = item.phoneNumber.toLowerCase();
    const phoneDigits = item.phoneNumber.replace(/\D/g, "");
    const phoneMatches =
      phoneLower.includes(query) ||
      (digitsQuery.length > 0 && phoneDigits.includes(digitsQuery));

    return clientMatches || phoneMatches;
  });
}

function isWithinDateRange(
  timestamp: string,
  dateRange: DateRangeFilter
): boolean {
  const datePart = timestamp.slice(0, 10);
  if (dateRange.from && datePart < dateRange.from) return false;
  if (dateRange.to && datePart > dateRange.to) return false;
  return true;
}

export function formatCompletionRatio(
  completed: number,
  attempts: number
): string {
  if (attempts === 0) return "—";
  const pct = (completed / attempts) * 100;
  return `${pct.toFixed(1).replace(/\.0$/, "")}%`;
}

function buildSourceTables(
  clients: AdminClientOrg[],
  outboundLogs: DemoCallLogRecord[],
  source: NumberSource
): {
  volumeRows: CallVolumeClientRow[];
  completedRows: CompletedCallsClientRow[];
} {
  // Attribute every outbound call once to (clientId, originatingNumber) for this source
  const perClientNumberCounts = new Map<string, Map<string, number>>();
  const perClientTotals = new Map<
    string,
    { outboundCalls: number; completedCalls: number }
  >();

  for (const client of clients) {
    perClientNumberCounts.set(client.id, new Map());
    perClientTotals.set(client.id, { outboundCalls: 0, completedCalls: 0 });
  }

  for (const log of outboundLogs) {
    if (log.numberSource !== source) continue;

    let numberMap = perClientNumberCounts.get(log.clientId);
    if (!numberMap) {
      numberMap = new Map();
      perClientNumberCounts.set(log.clientId, numberMap);
    }
    numberMap.set(
      log.originatingNumber,
      (numberMap.get(log.originatingNumber) ?? 0) + 1
    );

    let totals = perClientTotals.get(log.clientId);
    if (!totals) {
      totals = { outboundCalls: 0, completedCalls: 0 };
      perClientTotals.set(log.clientId, totals);
    }
    totals.outboundCalls += 1;
    if (log.status === "completed") {
      totals.completedCalls += 1;
    }
  }

  const volumeRows: CallVolumeClientRow[] = clients.map((client) => {
    const numberMap = perClientNumberCounts.get(client.id) ?? new Map();
    const sorted = Array.from(numberMap.entries())
      .map(([phoneNumber, outboundCalls]) => ({ phoneNumber, outboundCalls }))
      .sort((a, b) => {
        if (b.outboundCalls !== a.outboundCalls) {
          return b.outboundCalls - a.outboundCalls;
        }
        return a.phoneNumber.localeCompare(b.phoneNumber);
      });

    return {
      clientId: client.id,
      clientName: client.name,
      ranks: [
        sorted[0] ?? null,
        sorted[1] ?? null,
        sorted[2] ?? null,
        sorted[3] ?? null,
        sorted[4] ?? null,
      ],
    };
  });

  const completedRows: CompletedCallsClientRow[] = clients.map((client) => {
    const totals = perClientTotals.get(client.id) ?? {
      outboundCalls: 0,
      completedCalls: 0,
    };
    return {
      clientId: client.id,
      clientName: client.name,
      outboundCalls: totals.outboundCalls,
      completedCalls: totals.completedCalls,
      completionRatio: formatCompletionRatio(
        totals.completedCalls,
        totals.outboundCalls
      ),
    };
  });

  return { volumeRows, completedRows };
}

/**
 * Compute all four report tables (Call Volume Client/System + Completed Calls
 * Client/System) from outbound call logs inside the selected date range.
 */
export function buildAdminTelephonyReport(
  clients: AdminClientOrg[],
  callLogs: DemoCallLogRecord[],
  dateRange: DateRangeFilter
): AdminTelephonyReportData {
  // Deduplicate by log id so each call attempt is counted at most once
  const seenIds = new Set<string>();
  const outboundInRange: DemoCallLogRecord[] = [];

  for (const log of callLogs) {
    if (seenIds.has(log.id)) continue;
    seenIds.add(log.id);
    if (log.direction !== "outbound") continue;
    if (!isWithinDateRange(log.timestamp, dateRange)) continue;
    outboundInRange.push(log);
  }

  const clientTables = buildSourceTables(
    clients,
    outboundInRange,
    "Client-added"
  );
  const systemTables = buildSourceTables(
    clients,
    outboundInRange,
    "MantraAssist-provided"
  );

  const dailyMap = new Map<string, { clientCalls: number; systemCalls: number }>();
  const outcomeBreakdown: OutcomeBreakdown = {
    completed: 0,
    noAnswer: 0,
    failed: 0,
    busy: 0,
  };

  for (const log of outboundInRange) {
    const dateKey = log.timestamp.slice(0, 10);
    const current = dailyMap.get(dateKey) ?? { clientCalls: 0, systemCalls: 0 };
    if (log.numberSource === "Client-added") {
      current.clientCalls += 1;
    } else {
      current.systemCalls += 1;
    }
    dailyMap.set(dateKey, current);

    if (log.status === "completed") outcomeBreakdown.completed += 1;
    else if (log.status === "no-answer") outcomeBreakdown.noAnswer += 1;
    else if (log.status === "failed") outcomeBreakdown.failed += 1;
    else if (log.status === "busy") outcomeBreakdown.busy += 1;
  }

  const dailyTrend: DailyVolumePoint[] = Array.from(dailyMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, counts]) => ({
      date,
      clientCalls: counts.clientCalls,
      systemCalls: counts.systemCalls,
      totalCalls: counts.clientCalls + counts.systemCalls,
    }));

  return {
    callVolume: {
      clientNumbers: clientTables.volumeRows,
      systemNumbers: systemTables.volumeRows,
      dailyTrend,
    },
    completedCalls: {
      clientNumbers: clientTables.completedRows,
      systemNumbers: systemTables.completedRows,
      outcomeBreakdown,
    },
  };
}

