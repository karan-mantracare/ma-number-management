import React from "react";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { AdminOrganizationsPage } from "../AdminOrganizationsPage";

afterEach(() => {
  cleanup();
});

describe("AdminOrganizationsPage", () => {
  it("renders organizations header, search, and table with ACTIONS column header", () => {
    render(<AdminOrganizationsPage />);

    // Header card
    expect(screen.getByRole("heading", { level: 2, name: "Organizations" })).toBeInTheDocument();
    expect(
      screen.getByText("Manage your organizations and their Voice AI providers.")
    ).toBeInTheDocument();

    // Search bar
    expect(
      screen.getByPlaceholderText("Search organizations...")
    ).toBeInTheDocument();

    // Table Column Headers - verified ACTIONS instead of STATUS
    expect(screen.getByRole("columnheader", { name: /organization name/i })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: /voice ai provider/i })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: /actions/i })).toBeInTheDocument();
    expect(screen.queryByRole("columnheader", { name: /^status$/i })).not.toBeInTheDocument();

    // Rows
    expect(screen.getByText("Test task organization 24-11-26")).toBeInTheDocument();
    expect(screen.getByText("Product Demo")).toBeInTheDocument();
    expect(screen.getByText("Radiant Dental Care")).toBeInTheDocument();
  });

  it("filters organizations by search query", () => {
    render(<AdminOrganizationsPage />);

    const searchInput = screen.getByPlaceholderText("Search organizations...");
    fireEvent.change(searchInput, { target: { value: "Product" } });

    expect(screen.getByText("Product Demo")).toBeInTheDocument();
    expect(screen.queryByText("Test task organization 24-11-26")).not.toBeInTheDocument();

    // Clear search
    fireEvent.click(screen.getByRole("button", { name: /clear search/i }));
    expect(screen.getByText("Test task organization 24-11-26")).toBeInTheDocument();
  });

  it("toggles active/inactive state using the switch", () => {
    render(<AdminOrganizationsPage />);

    const toggle = screen.getByRole("switch", {
      name: "Toggle Test task organization 24-11-26 active status",
    });
    expect(toggle).toHaveAttribute("aria-checked", "true");

    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-checked", "false");

    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-checked", "true");
  });

  it("opens right drawer when edit icon is clicked, displays company name, concurrency graph, highlights spikes/limit hits, and allows changing limit", () => {
    render(<AdminOrganizationsPage />);

    const editButton = screen.getByRole("button", {
      name: "Edit Product Demo",
    });
    fireEvent.click(editButton);

    // Left Drawer opens with company name displayed
    const drawer = screen.getByRole("dialog", {
      name: "Concurrency management for Product Demo",
    });
    expect(drawer).toBeInTheDocument();
    expect(
      within(drawer).getByRole("heading", { name: "Product Demo" })
    ).toBeInTheDocument();

    // Concurrency limit displayed
    expect(within(drawer).getByText("Current Concurrency Limit")).toBeInTheDocument();
    expect(within(drawer).getByText("30")).toBeInTheDocument();

    // Concurrency Graph and date range selectors
    expect(
      within(drawer).getByRole("heading", {
        name: "Concurrency Hits & Limit Monitoring",
      })
    ).toBeInTheDocument();
    expect(within(drawer).getByRole("button", { name: "24h" })).toBeInTheDocument();
    expect(within(drawer).getByRole("button", { name: "7 Days" })).toBeInTheDocument();
    expect(within(drawer).getByRole("button", { name: "30 Days" })).toBeInTheDocument();

    // Spikes and Limit breaches summary
    expect(within(drawer).getByText("Spikes Detected")).toBeInTheDocument();
    expect(within(drawer).getByText("Limit Hits")).toBeInTheDocument();

    // Bottom dates along the X-axis: all 7 days in 7 Days view
    ["Nov 18", "Nov 19", "Nov 20", "Nov 21", "Nov 22", "Nov 23", "Nov 24"].forEach((day) => {
      expect(within(drawer).getByText(day)).toBeInTheDocument();
    });

    // Option to change concurrency limit
    const limitInput = within(drawer).getByLabelText("Concurrency limit value");
    fireEvent.change(limitInput, { target: { value: "45" } });
    const saveButton = within(drawer).getByRole("button", { name: /save limit/i });
    fireEvent.click(saveButton);

    expect(screen.getByText(/concurrency limit updated to 45/i)).toBeInTheDocument();

    // Close drawer
    fireEvent.click(within(drawer).getAllByRole("button", { name: /close drawer/i })[0]);
    expect(
      screen.queryByRole("dialog", {
        name: "Concurrency management for Product Demo",
      })
    ).not.toBeInTheDocument();
  });

  it("shows date and concurrency number when user moves cursor on the graph", () => {
    render(<AdminOrganizationsPage />);

    // Open drawer
    fireEvent.click(screen.getByRole("button", { name: "Edit Product Demo" }));
    const drawer = screen.getByRole("dialog", {
      name: "Concurrency management for Product Demo",
    });

    const svg = within(drawer).getByTestId("concurrency-chart-svg");
    expect(svg).toBeInTheDocument();

    // Mock getBoundingClientRect for SVG pointer calculation
    svg.getBoundingClientRect = () => ({
      left: 0,
      top: 0,
      width: 560,
      height: 225,
      right: 560,
      bottom: 225,
      x: 0,
      y: 0,
      toJSON: () => {},
    });

    // Move cursor over SVG graph
    fireEvent.mouseMove(svg, { clientX: 280, clientY: 100 });

    // Expect date and concurrency number to be shown
    const hoverCard = within(drawer).getByTestId("concurrency-hover-card");
    expect(hoverCard).toBeInTheDocument();
    expect(within(hoverCard).getByText(/concurrent calls/i)).toBeInTheDocument();

    // Leaving cursor resets hover
    fireEvent.mouseLeave(svg);
  });

  it("opens row action menu and shows Update Voice AI Provider and Disable Organization", () => {
    render(<AdminOrganizationsPage />);

    const menuButton = screen.getByRole("button", {
      name: "Open menu for Test task organization 24-11-26",
    });
    fireEvent.click(menuButton);

    expect(screen.getByRole("menuitem", { name: /update voice ai provider/i })).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: /disable organization/i })).toBeInTheDocument();
  });

  it("handles Resync button for organizations with resync capability", () => {
    render(<AdminOrganizationsPage />);

    const resyncButton = screen.getAllByRole("button", { name: /resync/i })[0];
    expect(resyncButton).toBeInTheDocument();
    fireEvent.click(resyncButton);
    expect(screen.getByText("Syncing...")).toBeInTheDocument();
  });
});
