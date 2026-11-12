"use client";

import React, { useEffect, useState } from "react";
import { Info, Phone, X } from "lucide-react";
import { COUNTRY_DIAL_CODES, SELECTED_ORGANIZATION } from "@/data/telephony";

export interface RequestNumberFormValues {
  companyName: string;
  spocName: string;
  spocAddress: string;
  spocEmail: string;
  countryCode: string;
  spocPhone: string;
}

type FormErrors = Partial<Record<keyof RequestNumberFormValues, string>>;

interface RequestNumberModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (values: RequestNumberFormValues) => void;
}

const INITIAL_VALUES: RequestNumberFormValues = {
  companyName: SELECTED_ORGANIZATION.name,
  spocName: "",
  spocAddress: "",
  spocEmail: "",
  countryCode: "+91",
  spocPhone: "",
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateRequestNumberForm(
  values: RequestNumberFormValues
): FormErrors {
  const errors: FormErrors = {};

  if (!values.companyName.trim()) {
    errors.companyName = "Company Name is required.";
  }

  if (!values.spocName.trim()) {
    errors.spocName = "SPOC Name is required.";
  }

  if (!values.spocAddress.trim()) {
    errors.spocAddress = "SPOC Address is required.";
  }

  const trimmedEmail = values.spocEmail.trim();
  if (!trimmedEmail) {
    errors.spocEmail = "SPOC Email is required.";
  } else if (!EMAIL_REGEX.test(trimmedEmail)) {
    errors.spocEmail = "Enter a valid email address (e.g. name@company.com).";
  }

  const trimmedCode = values.countryCode.trim();
  const rawPhone = values.spocPhone.trim();
  if (!trimmedCode || !/^\+\d{1,4}$/.test(trimmedCode)) {
    errors.countryCode = "Select a valid country code.";
  }

  if (!rawPhone) {
    errors.spocPhone = "Phone Number is required.";
  } else if (!/^[0-9\s\-().]+$/.test(rawPhone)) {
    errors.spocPhone =
      "Enter a valid phone number using digits, spaces, hyphens, or parentheses.";
  } else {
    const localDigits = rawPhone.replace(/\D/g, "");
    const codeDigits = trimmedCode.replace(/\D/g, "");
    const totalDigits = codeDigits.length + localDigits.length;

    if (localDigits.length < 6 || totalDigits < 7 || totalDigits > 15) {
      errors.spocPhone =
        "Enter a valid phone number with country code (7–15 digits total).";
    }
  }

  return errors;
}

export function RequestNumberModal({
  open,
  onClose,
  onSuccess,
}: RequestNumberModalProps) {
  const [values, setValues] = useState<RequestNumberFormValues>(INITIAL_VALUES);
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const updateField = <K extends keyof RequestNumberFormValues>(
    field: K,
    value: RequestNumberFormValues[K]
  ) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const validationErrors = validateRequestNumberForm(values);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    onSuccess({
      ...values,
      companyName: values.companyName.trim(),
      spocName: values.spocName.trim(),
      spocAddress: values.spocAddress.trim(),
      spocEmail: values.spocEmail.trim(),
      spocPhone: values.spocPhone.trim(),
    });
    setValues(INITIAL_VALUES);
    setErrors({});
  };

  const handleCancel = () => {
    setErrors({});
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-[1.5px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="request-number-modal-title"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          handleCancel();
        }
      }}
    >
      <div className="flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#1D4ED8]">
              <Phone className="h-4.5 w-4.5" />
            </div>
            <div>
              <h2
                id="request-number-modal-title"
                className="text-[16px] font-semibold text-slate-900"
              >
                Request a Phone Number
              </h2>
              <p className="text-[12px] text-slate-500">
                Submit organization and SPOC details to initiate number provisioning.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleCancel}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close modal"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} noValidate className="flex flex-1 flex-col overflow-hidden">
          <div className="space-y-5 overflow-y-auto px-5 py-5 sm:px-6">
            {/* Company Name */}
            <div>
              <label
                htmlFor="company-name"
                className="mb-1.5 block text-[12.5px] font-medium text-slate-700"
              >
                Company Name <span className="text-red-500">*</span>
              </label>
              <input
                id="company-name"
                name="companyName"
                type="text"
                value={values.companyName}
                onChange={(e) => updateField("companyName", e.target.value)}
                placeholder="Enter company name"
                aria-invalid={Boolean(errors.companyName)}
                className={`w-full rounded-xl border px-3.5 py-2.5 text-[13.5px] text-slate-900 transition-colors outline-none placeholder:text-slate-400 ${
                  errors.companyName
                    ? "border-red-400 bg-red-50/30 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                    : "border-slate-200 bg-white focus:border-[#1D4ED8] focus:ring-2 focus:ring-blue-100"
                }`}
              />
              {errors.companyName && (
                <p className="mt-1 text-[12px] text-red-600" role="alert">
                  {errors.companyName}
                </p>
              )}
            </div>

            {/* SPOC Group */}
            <fieldset className="rounded-xl border border-slate-200/90 bg-slate-50/50 p-4">
              <legend className="px-1.5 text-[12px] font-semibold tracking-wide text-slate-700 uppercase">
                Single Point of Contact (SPOC)
              </legend>

              <div className="mt-1 space-y-4">
                {/* SPOC Name */}
                <div>
                  <label
                    htmlFor="spoc-name"
                    className="mb-1.5 block text-[12.5px] font-medium text-slate-700"
                  >
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="spoc-name"
                    name="spocName"
                    type="text"
                    value={values.spocName}
                    onChange={(e) => updateField("spocName", e.target.value)}
                    placeholder="Full name of primary contact"
                    aria-invalid={Boolean(errors.spocName)}
                    className={`w-full rounded-xl border px-3.5 py-2.5 text-[13.5px] text-slate-900 transition-colors outline-none placeholder:text-slate-400 ${
                      errors.spocName
                        ? "border-red-400 bg-red-50/40 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                        : "border-slate-200 bg-white focus:border-[#1D4ED8] focus:ring-2 focus:ring-blue-100"
                    }`}
                  />
                  {errors.spocName && (
                    <p className="mt-1 text-[12px] text-red-600" role="alert">
                      {errors.spocName}
                    </p>
                  )}
                </div>

                {/* SPOC Address */}
                <div>
                  <label
                    htmlFor="spoc-address"
                    className="mb-1.5 block text-[12.5px] font-medium text-slate-700"
                  >
                    Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="spoc-address"
                    name="spocAddress"
                    rows={3}
                    value={values.spocAddress}
                    onChange={(e) => updateField("spocAddress", e.target.value)}
                    placeholder="Street address, city, state/province, postal code, country"
                    aria-invalid={Boolean(errors.spocAddress)}
                    className={`w-full resize-y rounded-xl border px-3.5 py-2.5 text-[13.5px] text-slate-900 transition-colors outline-none placeholder:text-slate-400 ${
                      errors.spocAddress
                        ? "border-red-400 bg-red-50/40 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                        : "border-slate-200 bg-white focus:border-[#1D4ED8] focus:ring-2 focus:ring-blue-100"
                    }`}
                  />
                  {errors.spocAddress && (
                    <p className="mt-1 text-[12px] text-red-600" role="alert">
                      {errors.spocAddress}
                    </p>
                  )}
                </div>

                {/* SPOC Email */}
                <div>
                  <label
                    htmlFor="spoc-email"
                    className="mb-1.5 block text-[12.5px] font-medium text-slate-700"
                  >
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="spoc-email"
                    name="spocEmail"
                    type="email"
                    value={values.spocEmail}
                    onChange={(e) => updateField("spocEmail", e.target.value)}
                    placeholder="spoc@company.com"
                    aria-invalid={Boolean(errors.spocEmail)}
                    className={`w-full rounded-xl border px-3.5 py-2.5 text-[13.5px] text-slate-900 transition-colors outline-none placeholder:text-slate-400 ${
                      errors.spocEmail
                        ? "border-red-400 bg-red-50/40 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                        : "border-slate-200 bg-white focus:border-[#1D4ED8] focus:ring-2 focus:ring-blue-100"
                    }`}
                  />
                  {errors.spocEmail && (
                    <p className="mt-1 text-[12px] text-red-600" role="alert">
                      {errors.spocEmail}
                    </p>
                  )}
                </div>

                {/* SPOC Phone Number with Country Code */}
                <div>
                  <label
                    htmlFor="spoc-phone"
                    className="mb-1.5 block text-[12.5px] font-medium text-slate-700"
                  >
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <select
                      id="spoc-country-code"
                      name="countryCode"
                      aria-label="Country code"
                      value={values.countryCode}
                      onChange={(e) => updateField("countryCode", e.target.value)}
                      className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-[13.5px] text-slate-900 outline-none focus:border-[#1D4ED8] focus:ring-2 focus:ring-blue-100 sm:w-[148px] sm:shrink-0"
                    >
                      {COUNTRY_DIAL_CODES.map((dial) => (
                        <option key={dial.code} value={dial.code}>
                          {dial.label}
                        </option>
                      ))}
                    </select>
                    <input
                      id="spoc-phone"
                      name="spocPhone"
                      type="tel"
                      value={values.spocPhone}
                      onChange={(e) => updateField("spocPhone", e.target.value)}
                      placeholder="98765 43210"
                      aria-invalid={Boolean(errors.spocPhone)}
                      className={`min-w-0 flex-1 rounded-xl border px-3.5 py-2.5 text-[13.5px] text-slate-900 transition-colors outline-none placeholder:text-slate-400 ${
                        errors.spocPhone
                          ? "border-red-400 bg-red-50/40 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                          : "border-slate-200 bg-white focus:border-[#1D4ED8] focus:ring-2 focus:ring-blue-100"
                      }`}
                    />
                  </div>
                  {(errors.countryCode || errors.spocPhone) && (
                    <p className="mt-1 text-[12px] text-red-600" role="alert">
                      {errors.countryCode || errors.spocPhone}
                    </p>
                  )}
                </div>
              </div>
            </fieldset>

            {/* KYC Notice */}
            <div className="flex items-start gap-2.5 rounded-xl border border-blue-200/80 bg-blue-50/70 px-3.5 py-3 text-[12.5px] leading-relaxed text-slate-700">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#1D4ED8]" />
              <p>
                Our team will contact you to complete the KYC process. We may ask
                you to fill out a form or provide company documents, company
                information, or both.
              </p>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex flex-wrap items-center justify-end gap-2.5 border-t border-slate-100 bg-slate-50/70 px-5 py-3.5 sm:px-6">
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-[13px] font-medium text-slate-700 transition-colors hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-full bg-[#1D4ED8] px-5 py-2 text-[13px] font-medium text-white shadow-xs transition-colors hover:bg-[#1E40AF] focus:ring-2 focus:ring-blue-200 focus:outline-none"
            >
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

