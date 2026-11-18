import React from "react";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { TelephonyIntegrationsPage } from "../TelephonyIntegrationsPage";

afterEach(() => {
  cleanup();
});

describe("TelephonyIntegrationsPage", () => {
  it("renders provider cards with explicit number source badges and working Add SIP Trunk button", () => {
    render(<TelephonyIntegrationsPage />);

    const voiceLinkCard = screen.getByTestId("provider-card-prov-voicelink-1");
    expect(within(voiceLinkCard).getByText("VoiceLink")).toBeInTheDocument();
    expect(within(voiceLinkCard).getByText("+919429399672")).toBeInTheDocument();
    expect(within(voiceLinkCard).getByText("INBOUND")).toBeInTheDocument();
    expect(
      within(voiceLinkCard).getByText("MantraAssist-provided")
    ).toBeInTheDocument();

    const plivoCard = screen.getByTestId("provider-card-prov-plivo-1");
    expect(within(plivoCard).getByText("Plivo")).toBeInTheDocument();
    expect(within(plivoCard).getByText("+918065531573")).toBeInTheDocument();
    expect(within(plivoCard).getByText("OUTBOUND")).toBeInTheDocument();
    expect(within(plivoCard).getByText("Client-added")).toBeInTheDocument();

    const addSipBtn = screen.getByRole("button", { name: /add sip trunk/i });
    expect(addSipBtn).toBeEnabled();

    // Clicking Add SIP Trunk opens the configuration form
    fireEvent.click(addSipBtn);
    expect(screen.getByText("Tutorial Video")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Create" })).toBeInTheDocument();

    // Cancel returns to provider cards view
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(screen.getByRole("button", { name: /add sip trunk/i })).toBeInTheDocument();

    const requestBtn = screen.getByRole("button", { name: /request number/i });
    expect(requestBtn).toBeEnabled();

    // Portal Switcher: Client | Admin
    const switcher = screen.getByRole("navigation", { name: /portal switcher/i });
    expect(within(switcher).getByRole("link", { name: "Client" })).toHaveAttribute(
      "href",
      "/cs/integration"
    );
    expect(within(switcher).getByRole("link", { name: "Admin" })).toHaveAttribute(
      "href",
      "/admin/integration"
    );
  });

  it("supports switching between Outbound and Inbound routing tabs and filtering by phone number", () => {
    render(<TelephonyIntegrationsPage />);

    // Outbound tab active by default
    const outRow1 = screen.getByTestId("routing-row-out-1");
    expect(within(outRow1).getByText("+918065531573")).toBeInTheDocument();
    expect(within(outRow1).getByText("Client-added")).toBeInTheDocument();

    const outRow2 = screen.getByTestId("routing-row-out-2");
    expect(within(outRow2).getByText("+61485016743")).toBeInTheDocument();
    expect(within(outRow2).getByText("DEFAULT")).toBeInTheDocument();
    expect(
      within(outRow2).getByText("MantraAssist-provided")
    ).toBeInTheDocument();

    // Filter outbound numbers
    const searchInput = screen.getByLabelText("Search numbers");
    fireEvent.change(searchInput, { target: { value: "8065" } });
    expect(screen.getByTestId("routing-row-out-1")).toBeInTheDocument();
    expect(screen.queryByTestId("routing-row-out-2")).not.toBeInTheDocument();

    // Switch to Inbound tab and clear search
    fireEvent.change(searchInput, { target: { value: "" } });
    fireEvent.click(screen.getByRole("tab", { name: /inbound/i }));

    const inRow1 = screen.getByTestId("routing-row-in-1");
    expect(within(inRow1).getByText("+919429399672")).toBeInTheDocument();
    expect(
      within(inRow1).getByText("MantraAssist-provided")
    ).toBeInTheDocument();

    const inRow2 = screen.getByTestId("routing-row-in-2");
    expect(within(inRow2).getByText("+14155550192")).toBeInTheDocument();
    expect(within(inRow2).getByText("Client-added")).toBeInTheDocument();

    const inRow3 = screen.getByTestId("routing-row-in-3");
    expect(within(inRow3).getByText("DEFAULT")).toBeInTheDocument();
    expect(
      within(inRow3).getByText("MantraAssist-provided")
    ).toBeInTheDocument();

    // Filter inbound numbers with empty result check
    fireEvent.change(searchInput, { target: { value: "415555" } });
    expect(screen.getByTestId("routing-row-in-2")).toBeInTheDocument();
    expect(screen.queryByTestId("routing-row-in-1")).not.toBeInTheDocument();

    fireEvent.change(searchInput, { target: { value: "00000000" } });
    expect(
      screen.getByText(/No inbound numbers match/i)
    ).toBeInTheDocument();
  });

  it("validates Request Number form fields, preserves entered values on error, and shows demo submission banner on valid submit", () => {
    render(<TelephonyIntegrationsPage />);

    fireEvent.click(screen.getByRole("button", { name: /request number/i }));
    const dialog = screen.getByRole("dialog", {
      name: /request a phone number/i,
    });
    expect(dialog).toBeInTheDocument();
    expect(
      within(dialog).getByText(/Single Point of Contact \(SPOC\)/i)
    ).toBeInTheDocument();
    expect(
      within(dialog).getByText(
        "Our team will contact you to complete the KYC process. We may ask you to fill out a form or provide company documents, company information, or both."
      )
    ).toBeInTheDocument();

    const companyInput = within(dialog).getByLabelText(/company name/i);
    const nameInput = within(dialog).getByLabelText(/^name/i);
    const addressInput = within(dialog).getByLabelText(/address/i);
    const emailInput = within(dialog).getByLabelText(/email/i);
    const countrySelect = within(dialog).getByLabelText(/country code/i);
    const phoneInput = within(dialog).getByLabelText(/phone number/i);

    // Invalid submission: clear company name, invalid email & phone
    fireEvent.change(companyInput, { target: { value: "" } });
    fireEvent.change(emailInput, { target: { value: "invalid-email" } });
    fireEvent.change(phoneInput, { target: { value: "123" } });

    fireEvent.click(within(dialog).getByRole("button", { name: /submit request/i }));

    expect(within(dialog).getByText("Company Name is required.")).toBeInTheDocument();
    expect(within(dialog).getByText("SPOC Name is required.")).toBeInTheDocument();
    expect(within(dialog).getByText("SPOC Address is required.")).toBeInTheDocument();
    expect(
      within(dialog).getByText(/enter a valid email address/i)
    ).toBeInTheDocument();
    expect(
      within(dialog).getByText(/enter a valid phone number with country code/i)
    ).toBeInTheDocument();

    // Preserves entered values on validation error
    expect(emailInput).toHaveValue("invalid-email");
    expect(phoneInput).toHaveValue("123");

    // Fill valid sample details and submit
    fireEvent.change(companyInput, { target: { value: "Radiant Dental Care" } });
    fireEvent.change(nameInput, { target: { value: "Alex Rivera" } });
    fireEvent.change(addressInput, {
      target: { value: "420 Market St, Suite 500\nSan Francisco, CA 94111" },
    });
    fireEvent.change(emailInput, {
      target: { value: "alex.rivera@radiantdental.example" },
    });
    fireEvent.change(countrySelect, { target: { value: "+1" } });
    fireEvent.change(phoneInput, { target: { value: "415 555 0149" } });

    fireEvent.click(within(dialog).getByRole("button", { name: /submit request/i }));

    // Modal closes and exact demo confirmation banner appears
    expect(
      screen.queryByRole("dialog", { name: /request a phone number/i })
    ).not.toBeInTheDocument();
    expect(
      screen.getByText("Demo request submitted. No request was sent to the team.")
    ).toBeInTheDocument();
  });

  it("allows configuring and adding a new SIP trunk", () => {
    render(<TelephonyIntegrationsPage />);

    fireEvent.click(screen.getByRole("button", { name: /add sip trunk/i }));

    // Select Zadarma provider
    fireEvent.click(screen.getByRole("button", { name: "Zadarma" }));
    expect(screen.getByText(/Video Player Placeholder/i)).toBeInTheDocument();

    // Fill phone number
    const phoneInput = screen.getByPlaceholderText("415 555 0100");
    fireEvent.change(phoneInput, { target: { value: "4155550999" } });

    // Fill Zadarma credentials
    const apiKeyInput = screen.getByPlaceholderText("admin@mantracare.com");
    fireEvent.change(apiKeyInput, { target: { value: "zadarma-key-123" } });

    // Submit form
    fireEvent.click(screen.getByRole("button", { name: "Create" }));

    // Returns to provider view with new provider card and routing entry
    expect(
      screen.getByText("SIP Trunk successfully connected for Zadarma.")
    ).toBeInTheDocument();
    expect(screen.getByText("Zadarma")).toBeInTheDocument();
    expect(screen.getAllByText("+14155550999")).toHaveLength(2);
  });
});

