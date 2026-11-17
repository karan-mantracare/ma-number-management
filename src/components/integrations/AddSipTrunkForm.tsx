"use client";

import React, { useState } from "react";
import {
  PhoneIncoming,
  PhoneOutgoing,
  PlayCircle,
  Video,
} from "lucide-react";
import type { RoutingDirection, TelephonyProviderItem } from "@/data/telephony";
import { COUNTRY_DIAL_CODES } from "@/data/telephony";
import { CountryFlag } from "./CountryFlag";

export interface NewSipTrunkData {
  name: string;
  label: string;
  direction: RoutingDirection;
  countryIso: string;
  countryCode: string;
  phoneNumber: string;
  priority?: number;
}

interface AddSipTrunkFormProps {
  onCancel: () => void;
  onCreate: (data: NewSipTrunkData) => void;
}

export type SipProviderId =
  | "Twilio"
  | "Zadarma"
  | "Plivo"
  | "VoiceLink"
  | "Exotel"
  | "Vobiz"
  | "Vonage"
  | "Telnyx";

const SIP_PROVIDERS: SipProviderId[] = [
  "Twilio",
  "Zadarma",
  "Plivo",
  "VoiceLink",
  "Exotel",
  "Vobiz",
  "Vonage",
  "Telnyx",
];

export function AddSipTrunkForm({ onCancel, onCreate }: AddSipTrunkFormProps) {
  const [selectedProvider, setSelectedProvider] =
    useState<SipProviderId>("Twilio");
  const [direction, setDirection] = useState<RoutingDirection>("outbound");
  const [label, setLabel] = useState("");
  const [priority, setPriority] = useState("1");
  const [countryCode, setCountryCode] = useState("+1");
  const [phoneDigits, setPhoneDigits] = useState("");

  // Provider credentials state
  const [accountSid, setAccountSid] = useState("admin@mantracare.com");
  const [authToken, setAuthToken] = useState("••••••••••");
  const [apiKey, setApiKey] = useState("");
  const [apiSecret, setApiSecret] = useState("••••••••••");
  const [sipUri, setSipUri] = useState("sip.zadarma.com");
  const [apiBaseUrl, setApiBaseUrl] = useState("https://api.in.exotel.com");
  const [applicationId, setApplicationId] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [signatureSecret, setSignatureSecret] = useState("");

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const selectedDial =
    COUNTRY_DIAL_CODES.find((c) => c.code === countryCode) ||
    COUNTRY_DIAL_CODES[0];

  const handleProviderSelect = (prov: SipProviderId) => {
    setSelectedProvider(prov);
    setErrors({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    const cleanPhone = phoneDigits.trim();
    if (!cleanPhone) {
      newErrors.phone = "Phone number is required";
    }

    if (selectedProvider === "Twilio") {
      if (!accountSid.trim()) newErrors.accountSid = "Account SID is required";
      if (!authToken.trim()) newErrors.authToken = "Auth Token is required";
    } else if (selectedProvider === "Zadarma") {
      if (!apiKey.trim()) newErrors.apiKey = "API Key is required";
      if (!apiSecret.trim()) newErrors.apiSecret = "API Secret is required";
    } else if (selectedProvider === "Plivo") {
      if (!accountSid.trim()) newErrors.accountSid = "Auth ID is required";
      if (!authToken.trim()) newErrors.authToken = "Auth Token is required";
    } else if (selectedProvider === "VoiceLink") {
      if (!accountSid.trim()) newErrors.accountSid = "Username / API Key is required";
      if (!apiSecret.trim()) newErrors.apiSecret = "Password / API Secret is required";
    } else if (selectedProvider === "Exotel") {
      if (!accountSid.trim()) newErrors.accountSid = "Account SID is required";
      if (!apiKey.trim()) newErrors.apiKey = "API Key is required";
      if (!authToken.trim()) newErrors.authToken = "API Token is required";
    } else if (selectedProvider === "Vobiz") {
      if (!accountSid.trim()) newErrors.accountSid = "Account ID is required";
      if (!authToken.trim()) newErrors.authToken = "Auth Token is required";
    } else if (selectedProvider === "Vonage") {
      if (!applicationId.trim()) newErrors.applicationId = "Application ID is required";
      if (!apiKey.trim()) newErrors.apiKey = "API Key is required";
      if (!apiSecret.trim()) newErrors.apiSecret = "API Secret is required";
      if (!privateKey.trim()) newErrors.privateKey = "Private Key is required";
    } else if (selectedProvider === "Telnyx") {
      if (!apiKey.trim()) newErrors.apiKey = "API Key / Token is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const fullPhoneNumber = `${countryCode}${cleanPhone.replace(/\D/g, "")}`;
    const generatedLabel =
      label.trim() ||
      (direction === "outbound" ? "Primary US Number" : "Inbound Support Line");

    onCreate({
      name: selectedProvider,
      label: generatedLabel,
      direction,
      countryIso: selectedDial.iso,
      countryCode: selectedDial.iso,
      phoneNumber: fullPhoneNumber,
      priority: direction === "outbound" ? parseInt(priority, 10) || 1 : undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="mt-5 space-y-6">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Column: Number Type & Provider Selector */}
        <div className="space-y-6 lg:col-span-3">
          {/* Number Type */}
          <div>
            <label className="mb-2 block text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
              Number Type
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setDirection("outbound")}
                className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[13px] font-medium transition-colors ${
                  direction === "outbound"
                    ? "bg-[#1D4ED8] text-white shadow-sm shadow-blue-600/20"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <PhoneOutgoing className="h-3.5 w-3.5" />
                Outbound
              </button>
              <button
                type="button"
                onClick={() => setDirection("inbound")}
                className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[13px] font-medium transition-colors ${
                  direction === "inbound"
                    ? "bg-[#1D4ED8] text-white shadow-sm shadow-blue-600/20"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <PhoneIncoming className="h-3.5 w-3.5" />
                Inbound
              </button>
            </div>
          </div>

          {/* Provider List */}
          <div>
            <label className="mb-2 block text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
              Provider
            </label>
            <div className="space-y-1">
              {SIP_PROVIDERS.map((prov) => {
                const isSelected = selectedProvider === prov;
                return (
                  <button
                    key={prov}
                    type="button"
                    onClick={() => handleProviderSelect(prov)}
                    className={`flex w-full items-center justify-between rounded-xl px-4 py-2.5 text-left text-[13.5px] transition-colors ${
                      isSelected
                        ? "bg-[#0F172A] font-semibold text-white shadow-xs"
                        : "font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    <span>{prov}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Middle Column: Provider Fields */}
        <div className="space-y-4 lg:col-span-5">
          {/* Label */}
          <div>
            <label className="mb-1.5 block text-[12.5px] font-medium text-slate-700">
              Label
            </label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder={
                direction === "outbound"
                  ? "e.g. Primary US Number"
                  : "e.g. Inbound Support Line"
              }
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-[13px] text-slate-800 transition-colors outline-none placeholder:text-slate-400 focus:border-[#1D4ED8] focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Priority (Outbound only) */}
          {direction === "outbound" && (
            <div>
              <label className="mb-1.5 block text-[12.5px] font-medium text-slate-700">
                Priority
              </label>
              <input
                type="number"
                min="1"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-[13px] text-slate-800 transition-colors outline-none focus:border-[#1D4ED8] focus:ring-2 focus:ring-blue-100"
              />
            </div>
          )}

          {/* Phone Number */}
          <div>
            <label className="mb-1.5 block text-[12.5px] font-medium text-slate-700">
              Phone Number
            </label>
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-1.5 focus-within:border-[#1D4ED8] focus-within:ring-2 focus-within:ring-blue-100">
              <div className="flex items-center gap-1.5 pr-2 border-r border-slate-200">
                <CountryFlag iso={selectedDial.iso} size={18} />
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="bg-transparent text-[13px] font-medium text-slate-700 outline-none cursor-pointer"
                  aria-label="Country Code"
                >
                  {COUNTRY_DIAL_CODES.map((dial) => (
                    <option key={dial.code} value={dial.code}>
                      {dial.code} ({dial.iso})
                    </option>
                  ))}
                </select>
              </div>
              <input
                type="tel"
                value={phoneDigits}
                onChange={(e) => setPhoneDigits(e.target.value)}
                placeholder="415 555 0100"
                className="w-full bg-transparent px-2 py-1 text-[13.5px] text-slate-900 outline-none placeholder:text-slate-400"
              />
            </div>
            {errors.phone && (
              <p className="mt-1 text-[11.5px] text-rose-500">{errors.phone}</p>
            )}
          </div>

          {/* Provider-specific Credentials */}
          {selectedProvider === "Twilio" && (
            <>
              <div>
                <label className="mb-1.5 block text-[12.5px] font-medium text-slate-700">
                  Account SID <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={accountSid}
                  onChange={(e) => setAccountSid(e.target.value)}
                  className="w-full rounded-xl border border-blue-100 bg-blue-50/40 px-3.5 py-2.5 text-[13px] text-slate-800 transition-colors outline-none focus:border-[#1D4ED8] focus:ring-2 focus:ring-blue-100"
                />
                {errors.accountSid && (
                  <p className="mt-1 text-[11.5px] text-rose-500">
                    {errors.accountSid}
                  </p>
                )}
              </div>
              <div>
                <label className="mb-1.5 block text-[12.5px] font-medium text-slate-700">
                  Auth Token <span className="text-rose-500">*</span>
                </label>
                <input
                  type="password"
                  value={authToken}
                  onChange={(e) => setAuthToken(e.target.value)}
                  className="w-full rounded-xl border border-blue-100 bg-blue-50/40 px-3.5 py-2.5 text-[13px] text-slate-800 transition-colors outline-none focus:border-[#1D4ED8] focus:ring-2 focus:ring-blue-100"
                />
                {errors.authToken && (
                  <p className="mt-1 text-[11.5px] text-rose-500">
                    {errors.authToken}
                  </p>
                )}
              </div>
            </>
          )}

          {selectedProvider === "Zadarma" && (
            <>
              <div>
                <label className="mb-1.5 block text-[12.5px] font-medium text-slate-700">
                  API Key (User Key) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="admin@mantracare.com"
                  className="w-full rounded-xl border border-blue-100 bg-blue-50/40 px-3.5 py-2.5 text-[13px] text-slate-800 transition-colors outline-none focus:border-[#1D4ED8] focus:ring-2 focus:ring-blue-100"
                />
                {errors.apiKey && (
                  <p className="mt-1 text-[11.5px] text-rose-500">{errors.apiKey}</p>
                )}
              </div>
              <div>
                <label className="mb-1.5 block text-[12.5px] font-medium text-slate-700">
                  API Secret <span className="text-rose-500">*</span>
                </label>
                <input
                  type="password"
                  value={apiSecret}
                  onChange={(e) => setApiSecret(e.target.value)}
                  className="w-full rounded-xl border border-blue-100 bg-blue-50/40 px-3.5 py-2.5 text-[13px] text-slate-800 transition-colors outline-none focus:border-[#1D4ED8] focus:ring-2 focus:ring-blue-100"
                />
                {errors.apiSecret && (
                  <p className="mt-1 text-[11.5px] text-rose-500">
                    {errors.apiSecret}
                  </p>
                )}
              </div>
              <div>
                <label className="mb-1.5 block text-[12.5px] font-medium text-slate-700">
                  SIP URI <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={sipUri}
                  onChange={(e) => setSipUri(e.target.value)}
                  placeholder="sip.zadarma.com"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-[13px] text-slate-800 transition-colors outline-none focus:border-[#1D4ED8] focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </>
          )}

          {selectedProvider === "Plivo" && (
            <>
              <div>
                <label className="mb-1.5 block text-[12.5px] font-medium text-slate-700">
                  Auth ID <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={accountSid}
                  onChange={(e) => setAccountSid(e.target.value)}
                  className="w-full rounded-xl border border-blue-100 bg-blue-50/40 px-3.5 py-2.5 text-[13px] text-slate-800 transition-colors outline-none focus:border-[#1D4ED8] focus:ring-2 focus:ring-blue-100"
                />
                {errors.accountSid && (
                  <p className="mt-1 text-[11.5px] text-rose-500">
                    {errors.accountSid}
                  </p>
                )}
              </div>
              <div>
                <label className="mb-1.5 block text-[12.5px] font-medium text-slate-700">
                  Auth Token <span className="text-rose-500">*</span>
                </label>
                <input
                  type="password"
                  value={authToken}
                  onChange={(e) => setAuthToken(e.target.value)}
                  className="w-full rounded-xl border border-blue-100 bg-blue-50/40 px-3.5 py-2.5 text-[13px] text-slate-800 transition-colors outline-none focus:border-[#1D4ED8] focus:ring-2 focus:ring-blue-100"
                />
                {errors.authToken && (
                  <p className="mt-1 text-[11.5px] text-rose-500">
                    {errors.authToken}
                  </p>
                )}
              </div>
            </>
          )}

          {selectedProvider === "VoiceLink" && (
            <>
              <div>
                <label className="mb-1.5 block text-[12.5px] font-medium text-slate-700">
                  Username / API Key <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={accountSid}
                  onChange={(e) => setAccountSid(e.target.value)}
                  className="w-full rounded-xl border border-blue-100 bg-blue-50/40 px-3.5 py-2.5 text-[13px] text-slate-800 transition-colors outline-none focus:border-[#1D4ED8] focus:ring-2 focus:ring-blue-100"
                />
                {errors.accountSid && (
                  <p className="mt-1 text-[11.5px] text-rose-500">
                    {errors.accountSid}
                  </p>
                )}
              </div>
              <div>
                <label className="mb-1.5 block text-[12.5px] font-medium text-slate-700">
                  Password / API Secret <span className="text-rose-500">*</span>
                </label>
                <input
                  type="password"
                  value={apiSecret}
                  onChange={(e) => setApiSecret(e.target.value)}
                  className="w-full rounded-xl border border-blue-100 bg-blue-50/40 px-3.5 py-2.5 text-[13px] text-slate-800 transition-colors outline-none focus:border-[#1D4ED8] focus:ring-2 focus:ring-blue-100"
                />
                {errors.apiSecret && (
                  <p className="mt-1 text-[11.5px] text-rose-500">
                    {errors.apiSecret}
                  </p>
                )}
              </div>
            </>
          )}

          {selectedProvider === "Exotel" && (
            <>
              <div>
                <label className="mb-1.5 block text-[12.5px] font-medium text-slate-700">
                  Account SID <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={accountSid}
                  onChange={(e) => setAccountSid(e.target.value)}
                  className="w-full rounded-xl border border-blue-100 bg-blue-50/40 px-3.5 py-2.5 text-[13px] text-slate-800 transition-colors outline-none focus:border-[#1D4ED8] focus:ring-2 focus:ring-blue-100"
                />
                {errors.accountSid && (
                  <p className="mt-1 text-[11.5px] text-rose-500">
                    {errors.accountSid}
                  </p>
                )}
              </div>
              <div>
                <label className="mb-1.5 block text-[12.5px] font-medium text-slate-700">
                  API Key <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter Exotel API Key"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-[13px] text-slate-800 transition-colors outline-none focus:border-[#1D4ED8] focus:ring-2 focus:ring-blue-100"
                />
                {errors.apiKey && (
                  <p className="mt-1 text-[11.5px] text-rose-500">{errors.apiKey}</p>
                )}
              </div>
              <div>
                <label className="mb-1.5 block text-[12.5px] font-medium text-slate-700">
                  API Token <span className="text-rose-500">*</span>
                </label>
                <input
                  type="password"
                  value={authToken}
                  onChange={(e) => setAuthToken(e.target.value)}
                  placeholder="Enter Exotel API Token"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-[13px] text-slate-800 transition-colors outline-none focus:border-[#1D4ED8] focus:ring-2 focus:ring-blue-100"
                />
                {errors.authToken && (
                  <p className="mt-1 text-[11.5px] text-rose-500">
                    {errors.authToken}
                  </p>
                )}
              </div>
              <div>
                <label className="mb-1.5 block text-[12.5px] font-medium text-slate-700">
                  API Base URL <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={apiBaseUrl}
                  onChange={(e) => setApiBaseUrl(e.target.value)}
                  placeholder="https://api.in.exotel.com"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-[13px] text-slate-800 transition-colors outline-none focus:border-[#1D4ED8] focus:ring-2 focus:ring-blue-100"
                />
                <p className="mt-1 text-[11px] text-slate-400">
                  Default: https://api.in.exotel.com (use https://api.exotel.com for non-India accounts)
                </p>
              </div>
            </>
          )}

          {selectedProvider === "Vobiz" && (
            <>
              <div>
                <label className="mb-1.5 block text-[12.5px] font-medium text-slate-700">
                  Account ID (Auth ID) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={accountSid}
                  onChange={(e) => setAccountSid(e.target.value)}
                  className="w-full rounded-xl border border-blue-100 bg-blue-50/40 px-3.5 py-2.5 text-[13px] text-slate-800 transition-colors outline-none focus:border-[#1D4ED8] focus:ring-2 focus:ring-blue-100"
                />
                {errors.accountSid && (
                  <p className="mt-1 text-[11.5px] text-rose-500">
                    {errors.accountSid}
                  </p>
                )}
              </div>
              <div>
                <label className="mb-1.5 block text-[12.5px] font-medium text-slate-700">
                  Auth Token <span className="text-rose-500">*</span>
                </label>
                <input
                  type="password"
                  value={authToken}
                  onChange={(e) => setAuthToken(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-[13px] text-slate-800 transition-colors outline-none focus:border-[#1D4ED8] focus:ring-2 focus:ring-blue-100"
                />
                {errors.authToken && (
                  <p className="mt-1 text-[11.5px] text-rose-500">
                    {errors.authToken}
                  </p>
                )}
              </div>
              <div>
                <label className="mb-1.5 block text-[12.5px] font-medium text-slate-700">
                  Application ID <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={applicationId}
                  onChange={(e) => setApplicationId(e.target.value)}
                  placeholder="Leave blank to auto-create on save"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-[13px] text-slate-800 transition-colors outline-none focus:border-[#1D4ED8] focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </>
          )}

          {selectedProvider === "Vonage" && (
            <>
              <div>
                <label className="mb-1.5 block text-[12.5px] font-medium text-slate-700">
                  Application ID <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={applicationId}
                  onChange={(e) => setApplicationId(e.target.value)}
                  placeholder="Vonage Application ID"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-[13px] text-slate-800 transition-colors outline-none focus:border-[#1D4ED8] focus:ring-2 focus:ring-blue-100"
                />
                {errors.applicationId && (
                  <p className="mt-1 text-[11.5px] text-rose-500">
                    {errors.applicationId}
                  </p>
                )}
              </div>
              <div>
                <label className="mb-1.5 block text-[12.5px] font-medium text-slate-700">
                  API Key <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full rounded-xl border border-blue-100 bg-blue-50/40 px-3.5 py-2.5 text-[13px] text-slate-800 transition-colors outline-none focus:border-[#1D4ED8] focus:ring-2 focus:ring-blue-100"
                />
                {errors.apiKey && (
                  <p className="mt-1 text-[11.5px] text-rose-500">{errors.apiKey}</p>
                )}
              </div>
              <div>
                <label className="mb-1.5 block text-[12.5px] font-medium text-slate-700">
                  API Secret <span className="text-rose-500">*</span>
                </label>
                <input
                  type="password"
                  value={apiSecret}
                  onChange={(e) => setApiSecret(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-[13px] text-slate-800 transition-colors outline-none focus:border-[#1D4ED8] focus:ring-2 focus:ring-blue-100"
                />
                {errors.apiSecret && (
                  <p className="mt-1 text-[11.5px] text-rose-500">
                    {errors.apiSecret}
                  </p>
                )}
              </div>
              <div>
                <label className="mb-1.5 block text-[12.5px] font-medium text-slate-700">
                  Private Key <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  value={privateKey}
                  onChange={(e) => setPrivateKey(e.target.value)}
                  placeholder="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
                  className="w-full font-mono text-[11.5px] rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-slate-800 transition-colors outline-none focus:border-[#1D4ED8] focus:ring-2 focus:ring-blue-100"
                />
                {errors.privateKey && (
                  <p className="mt-1 text-[11.5px] text-rose-500">
                    {errors.privateKey}
                  </p>
                )}
              </div>
              <div>
                <label className="mb-1.5 block text-[12.5px] font-medium text-slate-700">
                  Signature Secret <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={signatureSecret}
                  onChange={(e) => setSignatureSecret(e.target.value)}
                  placeholder="Optional webhook signature secret"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-[13px] text-slate-800 transition-colors outline-none focus:border-[#1D4ED8] focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </>
          )}

          {selectedProvider === "Telnyx" && (
            <>
              <div>
                <label className="mb-1.5 block text-[12.5px] font-medium text-slate-700">
                  API Key / Token <span className="text-rose-500">*</span>
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter Telnyx API Key"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-[13px] text-slate-800 transition-colors outline-none focus:border-[#1D4ED8] focus:ring-2 focus:ring-blue-100"
                />
                {errors.apiKey && (
                  <p className="mt-1 text-[11.5px] text-rose-500">{errors.apiKey}</p>
                )}
              </div>
              <div>
                <label className="mb-1.5 block text-[12.5px] font-medium text-slate-700">
                  SIP Connection ID <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={applicationId}
                  onChange={(e) => setApplicationId(e.target.value)}
                  placeholder="Optional SIP Connection ID"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-[13px] text-slate-800 transition-colors outline-none focus:border-[#1D4ED8] focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </>
          )}

          {/* Buttons: Cancel & Create */}
          <div className="flex items-center gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-full px-5 py-2 text-[13px] font-medium text-slate-600 transition-colors hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-full bg-[#1E293B] px-8 py-2 text-[13px] font-medium text-white shadow-xs transition-colors hover:bg-[#0F172A]"
            >
              Create
            </button>
          </div>
        </div>

        {/* Right Column: Tutorial Video */}
        <div className="space-y-3 lg:col-span-4">
          <div className="flex items-center gap-2 text-[#1D4ED8]">
            <PlayCircle className="h-4.5 w-4.5" />
            <h4 className="text-[13.5px] font-semibold text-slate-900">
              Tutorial Video
            </h4>
          </div>
          <p className="text-[12px] leading-relaxed text-slate-500">
            Learn how to properly configure your telephony integration and sip
            trunking settings.
          </p>

          <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-slate-200/80 bg-slate-50/50 p-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-slate-400 shadow-2xs">
              <PlayCircle className="h-6 w-6 stroke-[1.5]" />
            </div>
            <p className="mt-3 text-[12.5px] font-medium text-slate-500">
              {selectedProvider === "Zadarma"
                ? "Video Player Placeholder: https://docs.dograh.com/integrations/telephony/zadarma"
                : "No tutorial video available for this provider yet"}
            </p>
          </div>
        </div>
      </div>
    </form>
  );
}
