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

  it("opens edit modal when edit icon is clicked and saves changes", () => {
    render(<AdminOrganizationsPage />);

    const editButton = screen.getByRole("button", {
      name: "Edit Product Demo",
    });
    fireEvent.click(editButton);

    expect(screen.getByRole("heading", { name: "Edit Organization" })).toBeInTheDocument();
    const nameInput = screen.getByLabelText("Organization Name");
    fireEvent.change(nameInput, { target: { value: "Product Demo Updated" } });

    fireEvent.click(screen.getByRole("button", { name: /save changes/i }));
    expect(screen.getByText("Product Demo Updated")).toBeInTheDocument();
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
