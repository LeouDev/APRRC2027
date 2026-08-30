"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, ChevronLeft, ChevronRight, Copy, Loader2, ShieldCheck, Upload } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input, Select, Textarea } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { COUNTRIES } from "@/data/countries";
import { cn } from "@/lib/utils";
import {
  registrationSchema,
  GENDER_OPTIONS,
  SHIRT_SIZE_OPTIONS,
  RELATIONSHIP_OPTIONS,
  PAYMENT_METHOD_OPTIONS,
  MAX_PROOF_FILE_BYTES,
  ACCEPTED_PROOF_TYPES,
  type RegistrationFormValues,
} from "@/lib/registration-schema";

const STEPS = ["Consent", "Personal Details", "Emergency Contact", "Additional Info", "Payment"];

const STEP_FIELDS: Array<(keyof RegistrationFormValues)[]> = [
  ["consent"],
  [
    "firstName",
    "lastName",
    "gender",
    "dateOfBirth",
    "country",
    "passportNumber",
    "organization",
    "position",
    "email",
    "phone",
    "shirtSize",
  ],
  ["emergencyContactName", "emergencyContactRelationship", "emergencyContactPhone", "emergencyContactEmail"],
  ["dietaryRestrictions", "medicalConditions", "specialAssistance"],
  ["paymentMethod"],
];

const inputCls = "mt-1.5";
const errorCls = "mt-1 text-xs text-red-600";

export function RegistrationForm() {
  const [step, setStep] = useState(0);
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofError, setProofError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [registrationNumber, setRegistrationNumber] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      country: "Philippines",
      shirtSize: "M",
      dietaryRestrictions: "None",
      medicalConditions: "None",
      specialAssistance: "None",
      consent: false,
    },
  });

  const shirtSize = watch("shirtSize");

  async function handleNext() {
    const valid = await trigger(STEP_FIELDS[step]);
    if (valid) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function handleBack() {
    setStep((s) => Math.max(s - 1, 0));
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setProofError(null);
    if (!file) {
      setProofFile(null);
      return;
    }
    if (file.size > MAX_PROOF_FILE_BYTES) {
      setProofError("File is too large — max 8MB.");
      setProofFile(null);
      return;
    }
    if (!ACCEPTED_PROOF_TYPES.includes(file.type)) {
      setProofError("Use an image (JPG, PNG, WEBP, HEIC) or PDF.");
      setProofFile(null);
      return;
    }
    setProofFile(file);
  }

  async function onSubmit(values: RegistrationFormValues) {
    if (!proofFile) {
      setProofError("Proof of payment is required.");
      return;
    }
    setSubmitting(true);
    setSubmitError(null);
    try {
      const fd = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        fd.append(key, value === undefined || value === null ? "" : String(value));
      });
      fd.append("proofOfPayment", proofFile);

      const res = await fetch("/api/register", { method: "POST", body: fd });
      const data = await res.json();

      if (!res.ok) {
        setSubmitError(data?.error ?? "Something went wrong. Please try again.");
        return;
      }
      setRegistrationNumber(data.registrationNumber);
    } catch {
      setSubmitError("Network error — please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (registrationNumber) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center sm:p-12">
        <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-500" />
        <h2 className="mt-5 text-2xl font-bold text-slate-900 sm:text-3xl">Registration Received</h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-slate-600">
          Thank you for registering for APRRC &apos;27! Your application is now <strong>Pending</strong>{" "}
          review. You&apos;ll receive a confirmation email once the organizing committee verifies your
          payment.
        </p>
        <div className="mx-auto mt-6 inline-flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-5 py-3">
          <span className="font-mono text-lg font-bold text-slate-900">{registrationNumber}</span>
          <button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(registrationNumber);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="flex items-center gap-1 text-xs font-semibold text-amber-600 hover:text-amber-700"
          >
            <Copy className="h-3.5 w-3.5" />
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
        <p className="mt-6 text-xs text-slate-500">
          Save this reference number — you&apos;ll need it if you contact the organizing committee.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Progress */}
      <div className="border-b border-slate-100 px-6 pt-6 sm:px-8">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-6">
          {STEPS.map((label, i) => (
            <div key={label} className="flex shrink-0 items-center gap-1.5">
              <div
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                  i < step
                    ? "bg-emerald-500 text-white"
                    : i === step
                      ? "bg-amber-500 text-white"
                      : "bg-slate-100 text-slate-400"
                )}
              >
                {i < step ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
              </div>
              <span className={cn("text-xs font-medium", i === step ? "text-slate-900" : "text-slate-400")}>
                {label}
              </span>
              {i < STEPS.length - 1 && <div className="mx-1 h-px w-4 shrink-0 bg-slate-200 sm:w-8" />}
            </div>
          ))}
        </div>
      </div>

      <div className="px-6 py-8 sm:px-8">
        {/* Step 0: Consent */}
        {step === 0 && (
          <div className="space-y-5">
            <h2 className="text-lg font-semibold text-slate-900">Data Privacy Notice</h2>
            <div className="max-h-64 space-y-3 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 p-5 text-sm leading-relaxed text-slate-600">
              <p>
                The Rotaract Clubs of Rotary International District 3860 know their responsibilities
                under Republic Act No. 10173, the Data Privacy Act of 2012, with respect to the data
                collected, recorded, organized, updated, used, consolidated and extracted from
                registrants of this event. Personal data obtained through this form is entered and
                stored within the organization&apos;s database and is only accessed by designated
                organization officers.
              </p>
              <p>The information collected shall only be used to:</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>Process and report documents related to registration and confirmation of participation, as required by law;</li>
                <li>Disseminate announcements and promotions of events organized by the Rotaract Clubs of Rotary International District 3860 and its partners;</li>
                <li>Establish and maintain connections with participants, partners and other stakeholders.</li>
              </ul>
              <p>
                Your information will not be disclosed without consent and will be retained for five
                years for the effective implementation of the organization&apos;s initiatives. By
                registering, you affirm your right to be informed, object to processing, access and
                rectify, suspend or withdraw your personal data, and be indemnified in case of damages
                pursuant to RA 10173 and its Implementing Rules and Regulations.
              </p>
            </div>
            <label className="flex items-start gap-3 rounded-xl border border-slate-200 p-4">
              <Checkbox
                checked={watch("consent") === true}
                onCheckedChange={(checked) => setValue("consent", checked === true, { shouldValidate: true })}
              />
              <span className="text-sm text-slate-700">
                <strong>CONSENT.</strong> I hereby declare that I have read and comprehended the terms of
                the preceding Privacy Notice. As a result, I agree to the processing and storage of my
                personal information collected through this form. <span className="text-amber-600">*</span>
              </span>
            </label>
            {errors.consent && <p className={errorCls}>{errors.consent.message as string}</p>}
          </div>
        )}

        {/* Step 1: Personal Details */}
        {step === 1 && (
          <div className="space-y-5">
            <h2 className="text-lg font-semibold text-slate-900">Personal Details</h2>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <Label required>First Name</Label>
                <Input className={inputCls} invalid={!!errors.firstName} {...register("firstName")} />
                {errors.firstName && <p className={errorCls}>{errors.firstName.message}</p>}
              </div>
              <div>
                <Label>Middle Name</Label>
                <Input className={inputCls} placeholder="Leave blank if not applicable" {...register("middleName")} />
              </div>
              <div>
                <Label required>Last Name</Label>
                <Input className={inputCls} invalid={!!errors.lastName} {...register("lastName")} />
                {errors.lastName && <p className={errorCls}>{errors.lastName.message}</p>}
              </div>
              <div>
                <Label required>Gender</Label>
                <Select className={inputCls} invalid={!!errors.gender} {...register("gender")}>
                  <option value="">Select…</option>
                  {GENDER_OPTIONS.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </Select>
                {errors.gender && <p className={errorCls}>{errors.gender.message}</p>}
              </div>
              <div>
                <Label required>Date of Birth</Label>
                <Input type="date" className={inputCls} invalid={!!errors.dateOfBirth} {...register("dateOfBirth")} />
                {errors.dateOfBirth && <p className={errorCls}>{errors.dateOfBirth.message}</p>}
              </div>
              <div>
                <Label required>Nationality</Label>
                <Select className={inputCls} invalid={!!errors.country} {...register("country")}>
                  {COUNTRIES.map((c) => (
                    <option key={c.code} value={c.name}>{c.name}</option>
                  ))}
                </Select>
              </div>
              <div>
                <Label required>Passport Number</Label>
                <Input className={inputCls} invalid={!!errors.passportNumber} {...register("passportNumber")} />
                {errors.passportNumber && <p className={errorCls}>{errors.passportNumber.message}</p>}
              </div>
              <div>
                <Label>Rotary International ID Number</Label>
                <Input className={inputCls} {...register("rotaryId")} />
              </div>
              <div>
                <Label required>Club Name</Label>
                <Input className={inputCls} invalid={!!errors.organization} {...register("organization")} />
                {errors.organization && <p className={errorCls}>{errors.organization.message}</p>}
              </div>
              <div>
                <Label required>Club Position</Label>
                <Input className={inputCls} invalid={!!errors.position} {...register("position")} />
                {errors.position && <p className={errorCls}>{errors.position.message}</p>}
              </div>
              <div>
                <Label required>Email</Label>
                <Input type="email" className={inputCls} invalid={!!errors.email} {...register("email")} />
                {errors.email && <p className={errorCls}>{errors.email.message}</p>}
              </div>
              <div>
                <Label required>Phone Number</Label>
                <Input type="tel" className={inputCls} invalid={!!errors.phone} {...register("phone")} />
                {errors.phone && <p className={errorCls}>{errors.phone.message}</p>}
              </div>
              <div>
                <Label>Alternate Phone Number</Label>
                <Input type="tel" className={inputCls} {...register("alternatePhone")} />
              </div>
              <div>
                <Label>Facebook Account</Label>
                <Input className={inputCls} placeholder="Leave blank if not applicable" {...register("facebookAccount")} />
              </div>
              <div>
                <Label>WhatsApp</Label>
                <Input className={inputCls} placeholder="Leave blank if not applicable" {...register("whatsapp")} />
              </div>
              <div>
                <Label>Instagram</Label>
                <Input className={inputCls} placeholder="Leave blank if not applicable" {...register("instagram")} />
              </div>
            </div>

            <div>
              <Label required>APRRC Shirt Size</Label>
              <div className="mt-2 flex flex-wrap gap-2">
                {SHIRT_SIZE_OPTIONS.map((size) => (
                  <label key={size} className="cursor-pointer">
                    <input type="radio" value={size} className="peer sr-only" {...register("shirtSize")} />
                    <span className="inline-flex items-center rounded-full border border-slate-300 px-4 py-1.5 text-sm font-medium text-slate-600 peer-checked:border-amber-500 peer-checked:bg-amber-500 peer-checked:text-white">
                      {size}
                    </span>
                  </label>
                ))}
              </div>
              {shirtSize === "Other" && (
                <Input className="mt-3 max-w-xs" placeholder="Specify size" {...register("shirtSizeOther")} />
              )}
              {errors.shirtSize && <p className={errorCls}>{errors.shirtSize.message}</p>}
            </div>
          </div>
        )}

        {/* Step 2: Emergency Contact */}
        {step === 2 && (
          <div className="space-y-5">
            <h2 className="text-lg font-semibold text-slate-900">Emergency Contact Details</h2>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Label required>Complete Name (First, Middle, Last)</Label>
                <Input className={inputCls} invalid={!!errors.emergencyContactName} {...register("emergencyContactName")} />
                {errors.emergencyContactName && <p className={errorCls}>{errors.emergencyContactName.message}</p>}
              </div>
              <div>
                <Label required>Relationship</Label>
                <Select className={inputCls} invalid={!!errors.emergencyContactRelationship} {...register("emergencyContactRelationship")}>
                  <option value="">Select…</option>
                  {RELATIONSHIP_OPTIONS.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </Select>
                {errors.emergencyContactRelationship && <p className={errorCls}>{errors.emergencyContactRelationship.message}</p>}
              </div>
              <div>
                <Label required>Phone Number</Label>
                <Input type="tel" className={inputCls} invalid={!!errors.emergencyContactPhone} {...register("emergencyContactPhone")} />
                {errors.emergencyContactPhone && <p className={errorCls}>{errors.emergencyContactPhone.message}</p>}
              </div>
              <div className="sm:col-span-2">
                <Label required>Email Address</Label>
                <Input type="email" className={inputCls} invalid={!!errors.emergencyContactEmail} {...register("emergencyContactEmail")} />
                {errors.emergencyContactEmail && <p className={errorCls}>{errors.emergencyContactEmail.message}</p>}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Additional Information */}
        {step === 3 && (
          <div className="space-y-5">
            <h2 className="text-lg font-semibold text-slate-900">Additional Information</h2>
            <div>
              <Label required>
                Do you have any dietary restrictions (Vegetarian, Vegan, Halal, etc.) we should be informed about?
              </Label>
              <Textarea className={inputCls} rows={2} placeholder="Type “None” if not applicable" {...register("dietaryRestrictions")} />
              {errors.dietaryRestrictions && <p className={errorCls}>{errors.dietaryRestrictions.message}</p>}
            </div>
            <div>
              <Label required>Do you have any medical conditions or allergies we should be informed about?</Label>
              <Textarea className={inputCls} rows={2} placeholder="Type “None” if not applicable" {...register("medicalConditions")} />
              {errors.medicalConditions && <p className={errorCls}>{errors.medicalConditions.message}</p>}
            </div>
            <div>
              <Label required>Will you require any special assistance or support during APRRC &apos;27?</Label>
              <Textarea className={inputCls} rows={2} placeholder="Type “None” if not applicable" {...register("specialAssistance")} />
              {errors.specialAssistance && <p className={errorCls}>{errors.specialAssistance.message}</p>}
            </div>
          </div>
        )}

        {/* Step 4: Payment */}
        {step === 4 && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-slate-900">Payment</h2>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
              <p className="font-semibold text-slate-900">Bank: EastWest Bank</p>
              <p>Account Name: APRRC Convention Management Service</p>
              <p>Account Number (USD): 300002597377 &middot; Bank Code: 010620014 &middot; SWIFT: EWBCPHMM</p>
              <p className="mt-2 font-semibold text-slate-900">For Philippine Rotaractors</p>
              <p>Account Number (PHP): 200069419746</p>
            </div>

            <div>
              <Label required>Payment Method</Label>
              <div className="mt-2 space-y-2">
                {PAYMENT_METHOD_OPTIONS.map((opt) => (
                  <label
                    key={opt.value}
                    className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-3.5 has-[:checked]:border-amber-400 has-[:checked]:bg-amber-50"
                  >
                    <input type="radio" value={opt.value} className="h-4 w-4" {...register("paymentMethod")} />
                    <span className="text-sm text-slate-700">{opt.label}</span>
                  </label>
                ))}
              </div>
              {errors.paymentMethod && <p className={errorCls}>{errors.paymentMethod.message}</p>}
            </div>

            <div>
              <Label required>Proof of Payment</Label>
              <label className="mt-1.5 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 px-6 py-8 text-center hover:border-amber-400">
                <Upload className="h-6 w-6 text-slate-400" />
                <span className="text-sm font-medium text-slate-600">
                  {proofFile ? proofFile.name : "Click to upload a receipt (image or PDF, max 8MB)"}
                </span>
                <input
                  type="file"
                  accept={ACCEPTED_PROOF_TYPES.join(",")}
                  onChange={handleFileChange}
                  className="sr-only"
                />
              </label>
              {proofError && <p className={errorCls}>{proofError}</p>}
            </div>

            <div className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
              Your registration will be marked <strong>Pending</strong> until the organizing committee
              verifies your payment.
            </div>

            {submitError && (
              <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                {submitError}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Nav */}
      <div className="flex items-center justify-between border-t border-slate-100 px-6 py-5 sm:px-8">
        <Button type="button" variant="outline" onClick={handleBack} disabled={step === 0 || submitting}>
          <ChevronLeft className="h-4 w-4" />
          Back
        </Button>
        {step < STEPS.length - 1 ? (
          <Button type="button" onClick={handleNext}>
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button type="submit" disabled={submitting}>
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {submitting ? "Submitting…" : "Submit Registration"}
          </Button>
        )}
      </div>
    </form>
  );
}
