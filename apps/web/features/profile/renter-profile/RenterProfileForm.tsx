"use client";

import { useId, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePicker } from "@/components/ui/date-picker";
import { TextField } from "@/components/ui/form/TextField/TextField";
import { CurrencyInput } from "@/components/ui/form/CurrencyInput/CurrencyInput";
import { PillSelect } from "@/components/ui/form/PillSelect/PillSelect";
import { InfoTooltip } from "@/components/ui/form/InfoTooltip/InfoTooltip";
import type { PillOption } from "@/components/ui/form/PillSelect/PillSelect.types";
import {
  INITIAL_RENTER_PROFILE,
  type RenterProfileFormData,
  type RenterProfileFormErrors,
} from "./RenterProfile.types";

const HOUSEHOLD_SIZE_OPTIONS: readonly PillOption[] = [
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "3", label: "3" },
  { value: "4", label: "4" },
  { value: "5+", label: "5+" },
];

const PETS_OPTIONS: readonly PillOption[] = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
];

const CREDIT_SCORE_OPTIONS: readonly PillOption[] = [
  { value: "300-579", label: "300–579" },
  { value: "580-619", label: "580–619" },
  { value: "620-659", label: "620–659" },
  { value: "660-719", label: "660–719" },
  { value: "720+", label: "720+" },
];

const LEASE_OPTIONS: readonly PillOption[] = [
  { value: "month-to-month", label: "Month-to-month" },
  { value: "6", label: "6 months" },
  { value: "12", label: "12 months" },
  { value: "13+", label: "13+ months" },
];

const BEDROOM_OPTIONS: readonly PillOption[] = [
  { value: "studio", label: "Studio" },
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "3", label: "3" },
  { value: "4+", label: "4+" },
];

const PARKING_OPTIONS: readonly PillOption[] = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
];

type FormSectionProps = {
  legend: string;
  children: ReactNode;
};

function FormSection({ legend, children }: Readonly<FormSectionProps>) {
  return (
    <fieldset className="min-w-0">
      <legend className="mb-4 text-[15px] font-semibold tracking-tight text-neutral-900">
        {legend}
      </legend>
      {children}
    </fieldset>
  );
}

function validateRequired(form: RenterProfileFormData): RenterProfileFormErrors {
  const errors: RenterProfileFormErrors = {};
  if (form.firstName.trim() === "") errors.firstName = "Enter your first name.";
  if (form.lastName.trim() === "") errors.lastName = "Enter your last name.";
  if (form.phone.trim() === "") errors.phone = "Enter your phone number.";
  return errors;
}

export function RenterProfileForm() {
  const [form, setForm] = useState<RenterProfileFormData>(INITIAL_RENTER_PROFILE);
  const [errors, setErrors] = useState<RenterProfileFormErrors>({});
  const [savedSnapshot, setSavedSnapshot] = useState<RenterProfileFormData | null>(null);
  const moveInDateId = useId();

  const patch = <K extends keyof RenterProfileFormData>(
    key: K,
    value: RenterProfileFormData[K],
  ) => {
    setForm((previous) => ({ ...previous, [key]: value }));
  };

  const clearError = (key: keyof RenterProfileFormErrors) => {
    setErrors((previous) => {
      if (previous[key] === undefined) return previous;
      const next = { ...previous };
      delete next[key];
      return next;
    });
  };

  const handleSubmit = () => {
    const nextErrors = validateRequired(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      setSavedSnapshot(form);
    }
  };

  const handleCancel = () => {
    setForm(INITIAL_RENTER_PROFILE);
    setErrors({});
    setSavedSnapshot(null);
  };

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        handleSubmit();
      }}
      className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-subtle"
    >
      <div className="space-y-10 p-6 sm:p-8">
        <FormSection legend="Personal Information">
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <TextField
              label="First name"
              required
              value={form.firstName}
              placeholder="Iraima"
              error={errors.firstName}
              onChange={(event) => {
                patch("firstName", event.target.value);
                clearError("firstName");
              }}
            />
            <TextField
              label="Last name"
              required
              value={form.lastName}
              placeholder="Hurtado"
              error={errors.lastName}
              onChange={(event) => {
                patch("lastName", event.target.value);
                clearError("lastName");
              }}
            />
            <TextField
              label="Email"
              readOnly
              value={form.email}
              helper="Used to sign in. Contact the team to change it."
            />
            <TextField
              label="Phone number"
              required
              type="tel"
              value={form.phone}
              placeholder="+54 11 5555 5555"
              error={errors.phone}
              onChange={(event) => {
                patch("phone", event.target.value);
                clearError("phone");
              }}
            />
          </div>
        </FormSection>

        <FormSection legend="Household Details">
          <div className="space-y-5">
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label
                  htmlFor={moveInDateId}
                  className="mb-1.5 block text-sm font-medium text-neutral-900"
                >
                  Preferred move-in date
                </label>
                <DatePicker
                  id={moveInDateId}
                  value={form.moveInDate}
                  onChange={(value) => {
                    patch("moveInDate", value);
                  }}
                />
              </div>
              <CurrencyInput
                label="Estimated household income (optional)"
                labelHint={
                  <InfoTooltip content="Your total annual household income before taxes." />
                }
                value={form.householdIncome}
                onValueChange={(digits) => {
                  patch("householdIncome", digits);
                }}
                suffix="/year"
                placeholder="90000"
              />
            </div>
            <PillSelect
              label="Total people in household"
              labelHint={
                <InfoTooltip content="Include everyone who will live in the home, including children." />
              }
              options={HOUSEHOLD_SIZE_OPTIONS}
              value={form.householdSize}
              onChange={(value) => {
                patch("householdSize", value);
              }}
            />
            <Checkbox
              label="I have a housing voucher"
              checked={form.hasHousingVoucher}
              onChange={(event) => {
                patch("hasHousingVoucher", event.target.checked);
              }}
            />
          </div>
        </FormSection>

        <FormSection legend="Pets & Financials">
          <div className="space-y-5">
            <PillSelect
              label="Pets"
              options={PETS_OPTIONS}
              value={form.hasPets}
              onChange={(value) => {
                patch("hasPets", value);
              }}
              helper="Assistance animals, including those trained to assist with a disability, don't need to be listed."
            />
            <PillSelect
              label="Your credit score"
              labelHint={
                <InfoTooltip content="Approximate range of your credit score, if you have one." />
              }
              options={CREDIT_SCORE_OPTIONS}
              value={form.creditScoreRange}
              onChange={(value) => {
                patch("creditScoreRange", value);
              }}
              disabled={form.noCreditScore}
            />
            <Checkbox
              label="I don't have a credit score yet"
              checked={form.noCreditScore}
              onChange={(event) => {
                patch("noCreditScore", event.target.checked);
                if (event.target.checked) {
                  patch("creditScoreRange", null);
                }
              }}
            />
          </div>
        </FormSection>

        <FormSection legend="Lease Preferences">
          <div className="space-y-5">
            <PillSelect
              label="Preferred lease duration"
              options={LEASE_OPTIONS}
              value={form.leaseDuration}
              onChange={(value) => {
                patch("leaseDuration", value);
              }}
            />
            <PillSelect
              label="Preferred bedroom count"
              options={BEDROOM_OPTIONS}
              value={form.bedroomCount}
              onChange={(value) => {
                patch("bedroomCount", value);
              }}
            />
            <PillSelect
              label="Parking needed"
              options={PARKING_OPTIONS}
              value={form.parkingNeeded}
              onChange={(value) => {
                patch("parkingNeeded", value);
              }}
            />
          </div>
        </FormSection>
      </div>

      <div className="border-t border-neutral-200 px-6 py-4 sm:px-8">
        {savedSnapshot !== null ? (
          <output className="mb-3 block rounded-xl bg-neutral-100 px-4 py-3 text-sm leading-relaxed text-neutral-700">
            Profile saved: {savedSnapshot.firstName} {savedSnapshot.lastName} ·{" "}
            {savedSnapshot.phone} · Household of {savedSnapshot.householdSize ?? "—"} ·{" "}
            Income ${savedSnapshot.householdIncome === "" ? "—" : savedSnapshot.householdIncome}/year
          </output>
        ) : null}
        <div className="flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center">
          <Button type="submit" size="lg" className="w-full sm:w-auto">
            Save
          </Button>
          <button
            type="button"
            onClick={handleCancel}
            className="inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold text-neutral-600 transition-colors hover:text-neutral-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
}
