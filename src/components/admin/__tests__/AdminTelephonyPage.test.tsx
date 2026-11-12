import React from "react";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { AdminTelephonyPage } from "../AdminTelephonyPage";

afterEach(() => {
  cleanup();
});

describe("AdminTelephonyPage", () => {
  it("renders default Telephony Configs table with Mantra Sync / Telephony tabs and Client Number, Report, Add Configuration buttons", () => {
    render(<AdminTelephonyPage />);

    expect(screen.getByRole("tab", { name: /mantra sync/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /telephony/i })).toHaveAttribute(
      "aria-selected",
      "true"
    );

    expect(
      screen.getByRole("button", { name: /client number/i })
    ).toBeEnabled();
    expect(screen.getByRole("button", { name: /report/i })).toBeEnabled();
    expect(
      screen.getByRole("button", { name: /add configuration/i })
    ).toBeDisabled();

    expect(screen.getByTestId("system-configs-view")).toBeInTheDocument();
    expect(screen.getByText("+14842918903")).toBeInTheDocument();
  });

  it("opens read-only Client Number view showing only Client-added numbers, supports search by client or phone, and returns to configs", () => {
    render(<AdminTelephonyPage />);

    fireEvent.click(screen.getByRole("button", { name: /client number/i }));

    const view = screen.getByTestId("client-number-view");
    expect(view).toBeInTheDocument();

    // Contains client-added numbers, excludes system-only numbers
    expect(within(view).getByText("+918065531573")).toBeInTheDocument();
    expect(within(view).getByText("+12125550181")).toBeInTheDocument();
    expect(within(view).queryByText("+14842918903")).not.toBeInTheDocument();
    expect(within(view).queryByText("+61485016743")).not.toBeInTheDocument();

    const searchInput = within(view).getByLabelText("Search client numbers");

    // Search by client name
    fireEvent.change(searchInput, { target: { value: "Apex Health" } });
    expect(within(view).getByText("+12125550181")).toBeInTheDocument();
    expect(within(view).queryByText("+918065531573")).not.toBeInTheDocument();

    // Search by phone number
    fireEvent.change(searchInput, { target: { value: "900123" } });
    expect(
      within(view).getByText("BrightSmile Orthodontics")
    ).toBeInTheDocument();
    expect(within(view).getByText("+447700900123")).toBeInTheDocument();
    expect(within(view).queryByText("Apex Health Clinic")).not.toBeInTheDocument();

    // Search with no match and recover via Clear search button
    fireEvent.change(searchInput, { target: { value: "no-match-xyz" } });
    expect(
      within(view).getByText(/no client-added numbers match/i)
    ).toBeInTheDocument();
    fireEvent.click(within(view).getByRole("button", { name: /clear search/i }));
    expect(within(view).getByText("+918065531573")).toBeInTheDocument();

    // Return to system configuration table
    fireEvent.click(
      within(view).getByRole("button", { name: /back to telephony configs/i })
    );
    expect(screen.getByTestId("system-configs-view")).toBeInTheDocument();
  });

  it("renders Report view with Call Volume rankings, shared system number attribution, Completed Calls across all numbers, date filtering, and zero-call states", () => {
    render(<AdminTelephonyPage />);

    fireEvent.click(screen.getByRole("button", { name: /report/i }));
    const reportView = screen.getByTestId("report-view");
    expect(reportView).toBeInTheDocument();

    // Category differentiation headers & source badges inside each category
    const callVolumeCategory = within(reportView).getByTestId(
      "category-call-volume"
    );
    expect(
      within(callVolumeCategory).getByRole("heading", { name: "Call Volume" })
    ).toBeInTheDocument();
    expect(
      within(callVolumeCategory).getByText("Client-added")
    ).toBeInTheDocument();
    expect(
      within(callVolumeCategory).getByText("MantraAssist-provided")
    ).toBeInTheDocument();

    const completedCallsCategory = within(reportView).getByTestId(
      "category-completed-calls"
    );
    expect(
      within(completedCallsCategory).getByRole("heading", {
        name: "Completed Calls",
      })
    ).toBeInTheDocument();
    expect(
      within(completedCallsCategory).getByText("Client-added")
    ).toBeInTheDocument();
    expect(
      within(completedCallsCategory).getByText("MantraAssist-provided")
    ).toBeInTheDocument();

    // Graphs in both categories
    const volumeCharts = within(callVolumeCategory).getByTestId(
      "call-volume-charts"
    );
    expect(
      within(volumeCharts).getByText("Volume by Client & Source")
    ).toBeInTheDocument();
    expect(
      within(volumeCharts).getByRole("img", {
        name: /daily outbound call volume trend chart/i,
      })
    ).toBeInTheDocument();

    const completedCharts = within(completedCallsCategory).getByTestId(
      "completed-calls-charts"
    );
    expect(
      within(completedCharts).getByText("Completion Rate by Client")
    ).toBeInTheDocument();
    expect(
      within(completedCharts).getByText("Outbound Call Outcomes")
    ).toBeInTheDocument();

    // 1. Call Volume — Client Numbers
    const volClientTable = within(reportView).getByTestId(
      "call-volume-client-table"
    );
    const radiantVolRow = within(volClientTable)
      .getByText("Radiant Dental Care")
      .closest("tr")!;
    // Top 5 ranked highest first (#1..#5), 6th number (+14155550195) omitted from #1..#5
    expect(within(radiantVolRow).getByText("+918065531573")).toBeInTheDocument();
    expect(within(radiantVolRow).getByText("6 calls")).toBeInTheDocument();
    expect(within(radiantVolRow).getByText("+14155550194")).toBeInTheDocument();
    expect(within(radiantVolRow).getByText("2 calls")).toBeInTheDocument();
    expect(
      within(radiantVolRow).queryByText("+14155550195")
    ).not.toBeInTheDocument();

    // Apex has only 2 client numbers -> #3..#5 blank
    const apexVolRow = within(volClientTable)
      .getByText("Apex Health Clinic")
      .closest("tr")!;
    expect(within(apexVolRow).getByText("+12125550181")).toBeInTheDocument();
    expect(within(apexVolRow).getByText("4 calls")).toBeInTheDocument();
    expect(within(apexVolRow).getByText("+12125550182")).toBeInTheDocument();
    expect(within(apexVolRow).getByText("2 calls")).toBeInTheDocument();

    // 2. Call Volume — System Numbers: shared +14842918903 attributed per client
    const volSystemTable = within(reportView).getByTestId(
      "call-volume-system-table"
    );
    const radiantSysRow = within(volSystemTable)
      .getByText("Radiant Dental Care")
      .closest("tr")!;
    expect(within(radiantSysRow).getByText("+14842918903")).toBeInTheDocument();
    expect(within(radiantSysRow).getByText("7 calls")).toBeInTheDocument();

    const apexSysRow = within(volSystemTable)
      .getByText("Apex Health Clinic")
      .closest("tr")!;
    expect(within(apexSysRow).getByText("+14842918903")).toBeInTheDocument();
    expect(within(apexSysRow).getByText("3 calls")).toBeInTheDocument();

    // 3. Completed Calls — Client Numbers (includes 6th number outside top 5 + zero-call state)
    const compClientTable = within(reportView).getByTestId(
      "completed-calls-client-table"
    );
    const radiantCompRow = within(compClientTable)
      .getByText("Radiant Dental Care")
      .closest("tr")!;
    // 6+5+4+3+2+1 = 21 outbound (inbound ignored), 16 completed -> 76.2%
    expect(within(radiantCompRow).getByText("21")).toBeInTheDocument();
    expect(within(radiantCompRow).getByText("16")).toBeInTheDocument();
    expect(within(radiantCompRow).getByText("76.2%")).toBeInTheDocument();

    const northstarCompRow = within(compClientTable)
      .getByText("Northstar Wellness")
      .closest("tr")!;
    expect(within(northstarCompRow).getByText("—")).toBeInTheDocument();

    // 4. Date filtering updates all 4 tables: Last 7 Days -> BrightSmile Client Numbers becomes 0 / 0 / —
    fireEvent.click(within(reportView).getByRole("button", { name: "Last 7 Days" }));
    const brightSmile7dRow = within(compClientTable)
      .getByText("BrightSmile Orthodontics")
      .closest("tr")!;
    expect(within(brightSmile7dRow).getByText("—")).toBeInTheDocument();

    // All Demo Logs -> Northstar System Numbers picks up Oct 5-6 logs (2 attempts, 1 completed -> 50%)
    fireEvent.click(
      within(reportView).getByRole("button", { name: "All Demo Logs" })
    );
    const compSystemTable = within(reportView).getByTestId(
      "completed-calls-system-table"
    );
    const northstarSysAllRow = within(compSystemTable)
      .getByText("Northstar Wellness")
      .closest("tr")!;
    expect(within(northstarSysAllRow).getByText("2")).toBeInTheDocument();
    expect(within(northstarSysAllRow).getByText("1")).toBeInTheDocument();
    expect(within(northstarSysAllRow).getByText("50%")).toBeInTheDocument();

    // Custom date range with zero calls across all tables
    fireEvent.change(within(reportView).getByLabelText("Report start date"), {
      target: { value: "2026-09-01" },
    });
    fireEvent.change(within(reportView).getByLabelText("Report end date"), {
      target: { value: "2026-09-30" },
    });
    expect(within(compClientTable).getAllByText("—").length).toBe(4);
    expect(within(compSystemTable).getAllByText("—").length).toBe(4);
    expect(
      within(volumeCharts).getByText(
        /no outbound calls recorded in the selected date range/i
      )
    ).toBeInTheDocument();
    expect(
      within(completedCharts).getByText(
        /no outbound attempts to calculate completion rates/i
      )
    ).toBeInTheDocument();

    // Inverted date range shows warning and lets user reset
    fireEvent.change(within(reportView).getByLabelText("Report start date"), {
      target: { value: "2026-11-12" },
    });
    fireEvent.change(within(reportView).getByLabelText("Report end date"), {
      target: { value: "2026-11-01" },
    });
    expect(within(reportView).getByRole("alert")).toHaveTextContent(
      /start date cannot be after end date/i
    );
    fireEvent.click(
      within(reportView).getByRole("button", { name: /reset to last 30 days/i })
    );
    expect(within(reportView).queryByRole("alert")).not.toBeInTheDocument();

    // Return to Telephony Configs
    fireEvent.click(
      within(reportView).getByRole("button", {
        name: /back to telephony configs/i,
      })
    );
    expect(screen.getByTestId("system-configs-view")).toBeInTheDocument();
  });
});

