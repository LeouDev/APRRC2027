export type Participant = {
  id: string;
  registrationNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  country: string;
  countryCode: string;
  city: string | null;
  organization: string | null;
  position: string | null;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "REJECTED";
  adminNotes: string | null;
  registrationDate: string;
  createdAt: string;
  updatedAt: string;
};
