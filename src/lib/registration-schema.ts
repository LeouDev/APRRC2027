import { z } from "zod";

export const GENDER_OPTIONS = ["Male", "Female", "Prefer not to say"] as const;
export const SHIRT_SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "XXL", "XXXL", "Other"] as const;
export const RELATIONSHIP_OPTIONS = ["Spouse", "Mother", "Father", "Siblings", "Other"] as const;
export const DISTRICT_OPTIONS = [
  "2580", "3300", "3310", "3330", "3340", "3350",
  "3360", "3410", "3420", "3450", "3460", "3490", "3501", "3502", "3510",
  "3521", "3640", "3650", "3690", "3721", "3770", "3780", "3790", "3800",
  "3810", "3820", "3830", "3850", "3860", "3870",
  "Other",
] as const;
export const PAYMENT_METHOD_OPTIONS = [
  { value: "CASH_LEADERS_SUMMIT", label: "USD Cash during the APRRC Leaders Summit" },
  { value: "BANK_PHP", label: "Bank Payment through Peso (PHP) Account" },
  { value: "BANK_USD", label: "Bank Payment through USD Account" },
] as const;

const requiredText = (label: string, max = 200) =>
  z.string().trim().min(1, `${label} is required.`).max(max);

export const personalDetailsSchema = z.object({
  firstName: requiredText("First name", 100),
  middleName: z.string().trim().max(100).optional().or(z.literal("")),
  lastName: requiredText("Last name", 100),
  gender: z.enum(GENDER_OPTIONS, { message: "Please select a gender." }),
  dateOfBirth: requiredText("Date of birth", 20),
  country: requiredText("Nationality", 100),
  passportNumber: requiredText("Passport number", 50),
  rotaryId: z.string().trim().max(50).optional().or(z.literal("")),
  district: requiredText("District", 20),
  districtOther: z.string().trim().max(20).optional().or(z.literal("")),
  organization: requiredText("Club name", 150),
  position: requiredText("Club position", 100),
  email: z.string().trim().email("Enter a valid email address."),
  phone: requiredText("Phone number", 30),
  alternatePhone: z.string().trim().max(30).optional().or(z.literal("")),
  facebookAccount: z.string().trim().max(200).optional().or(z.literal("")),
  whatsapp: z.string().trim().max(50).optional().or(z.literal("")),
  instagram: z.string().trim().max(100).optional().or(z.literal("")),
  shirtSize: requiredText("Shirt size", 20),
  shirtSizeOther: z.string().trim().max(20).optional().or(z.literal("")),
});

export const emergencyContactSchema = z.object({
  emergencyContactName: requiredText("Emergency contact name", 150),
  emergencyContactRelationship: requiredText("Relationship", 50),
  emergencyContactPhone: requiredText("Emergency contact phone", 30),
  emergencyContactEmail: z.string().trim().email("Enter a valid email address."),
});

export const additionalInfoSchema = z.object({
  dietaryRestrictions: requiredText("This field", 500),
  medicalConditions: requiredText("This field", 500),
  specialAssistance: requiredText("This field", 500),
});

export const paymentSchema = z.object({
  paymentMethod: z.enum(
    PAYMENT_METHOD_OPTIONS.map((o) => o.value) as [string, ...string[]],
    { message: "Please select a payment method." }
  ),
});

export const consentSchema = z.object({
  consent: z
    .boolean()
    .refine((v) => v === true, { message: "You must agree to the Data Privacy Notice to register." }),
});

export const registrationSchema = personalDetailsSchema
  .extend(emergencyContactSchema.shape)
  .extend(additionalInfoSchema.shape)
  .extend(paymentSchema.shape)
  .extend(consentSchema.shape);

export type RegistrationFormValues = z.infer<typeof registrationSchema>;

export const MAX_PROOF_FILE_BYTES = 8 * 1024 * 1024; // 8MB
export const ACCEPTED_PROOF_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic", "application/pdf"];
