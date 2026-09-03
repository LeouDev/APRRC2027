"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ExternalLink, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input, Select, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { COUNTRIES } from "@/data/countries";
import { formatDate } from "@/lib/utils";
import type { Participant } from "@/types/participant";

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  CASH_LEADERS_SUMMIT: "USD Cash during the APRRC Leaders Summit",
  BANK_PHP: "Bank Payment through Peso (PHP) Account",
  BANK_USD: "Bank Payment through USD Account",
};

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="border-b border-slate-100 py-2.5 last:border-0">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-0.5 text-sm text-slate-800">{value || "—"}</p>
    </div>
  );
}

export function ParticipantDialog({
  participant,
  open,
  onOpenChange,
  onSaved,
}: {
  participant: Participant | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<Partial<Participant>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open && participant) setForm(participant);
  }, [open, participant]);

  if (!participant) return null;

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/participants/${participant!.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone || null,
          country: form.country,
          city: form.city || null,
          organization: form.organization || null,
          position: form.position || null,
          status: form.status,
          adminNotes: form.adminNotes || null,
        }),
      });
      if (!res.ok) throw new Error("Failed to save changes.");
      toast.success("Participant updated.");
      onSaved();
      onOpenChange(false);
    } catch {
      toast.error("Could not save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <DialogTitle>
              {participant.firstName} {participant.lastName}
            </DialogTitle>
            <StatusBadge status={(form.status as Participant["status"]) ?? participant.status} />
          </div>
          <DialogDescription>
            {participant.registrationNumber} &middot; Registered {formatDate(participant.registrationDate)}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="edit">
          <TabsList>
            <TabsTrigger value="edit">Edit</TabsTrigger>
            <TabsTrigger value="details">Registration Details</TabsTrigger>
          </TabsList>

          <TabsContent value="edit" className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>First Name</Label>
                <Input
                  className="mt-1.5"
                  value={form.firstName ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                />
              </div>
              <div>
                <Label>Last Name</Label>
                <Input
                  className="mt-1.5"
                  value={form.lastName ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  className="mt-1.5"
                  value={form.email ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                />
              </div>
              <div>
                <Label>Phone</Label>
                <Input
                  className="mt-1.5"
                  value={form.phone ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                />
              </div>
              <div>
                <Label>Country</Label>
                <Select
                  className="mt-1.5"
                  value={form.country ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
                >
                  {COUNTRIES.map((c) => (
                    <option key={c.code} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <Label>City</Label>
                <Input
                  className="mt-1.5"
                  value={form.city ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                />
              </div>
              <div>
                <Label>Organization</Label>
                <Input
                  className="mt-1.5"
                  value={form.organization ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, organization: e.target.value }))}
                />
              </div>
              <div>
                <Label>Position</Label>
                <Input
                  className="mt-1.5"
                  value={form.position ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, position: e.target.value }))}
                />
              </div>
              <div>
                <Label>Status</Label>
                <Select
                  className="mt-1.5"
                  value={form.status ?? "PENDING"}
                  onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as Participant["status"] }))}
                >
                  <option value="PENDING">Pending</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="CANCELLED">Cancelled</option>
                  <option value="REJECTED">Rejected</option>
                </Select>
              </div>
            </div>

            <div>
              <Label>Admin Notes</Label>
              <Textarea
                className="mt-1.5"
                rows={3}
                placeholder="Internal notes visible to organizers only…"
                value={form.adminNotes ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, adminNotes: e.target.value }))}
              />
            </div>

            <p className="text-xs text-slate-400">
              Created {formatDate(participant.createdAt)} &middot; Last updated {formatDate(participant.updatedAt)}
            </p>
          </TabsContent>

          <TabsContent value="details" className="max-h-[55vh] space-y-6 overflow-y-auto pr-1">
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wide text-amber-600">Personal</h4>
              <div className="mt-1">
                <DetailRow
                  label="Full Name"
                  value={[participant.firstName, participant.middleName, participant.lastName].filter(Boolean).join(" ")}
                />
                <DetailRow label="Gender" value={participant.gender} />
                <DetailRow
                  label="Date of Birth"
                  value={participant.dateOfBirth ? formatDate(participant.dateOfBirth) : null}
                />
                <DetailRow label="Nationality" value={participant.country} />
                <DetailRow label="Passport Number" value={participant.passportNumber} />
                <DetailRow label="Rotary International ID" value={participant.rotaryId} />
                <DetailRow label="District Number" value={participant.district} />
                <DetailRow label="Club Name" value={participant.organization} />
                <DetailRow label="Club Position" value={participant.position} />
                <DetailRow label="Shirt Size" value={participant.shirtSize} />
                <DetailRow label="Alternate Phone" value={participant.alternatePhone} />
                <DetailRow label="Facebook" value={participant.facebookAccount} />
                <DetailRow label="WhatsApp" value={participant.whatsapp} />
                <DetailRow label="Instagram" value={participant.instagram} />
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wide text-amber-600">Emergency Contact</h4>
              <div className="mt-1">
                <DetailRow label="Name" value={participant.emergencyContactName} />
                <DetailRow label="Relationship" value={participant.emergencyContactRelationship} />
                <DetailRow label="Phone" value={participant.emergencyContactPhone} />
                <DetailRow label="Email" value={participant.emergencyContactEmail} />
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wide text-amber-600">Additional Information</h4>
              <div className="mt-1">
                <DetailRow label="Dietary Restrictions" value={participant.dietaryRestrictions} />
                <DetailRow label="Medical Conditions / Allergies" value={participant.medicalConditions} />
                <DetailRow label="Special Assistance" value={participant.specialAssistance} />
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wide text-amber-600">Payment</h4>
              <div className="mt-1">
                <DetailRow
                  label="Payment Method"
                  value={participant.paymentMethod ? PAYMENT_METHOD_LABELS[participant.paymentMethod] ?? participant.paymentMethod : null}
                />
                <div className="py-2.5">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Proof of Payment</p>
                  {participant.proofOfPaymentFileName ? (
                    <a
                      href={`/api/admin/participants/${participant.id}/proof-of-payment`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium text-amber-600 hover:text-amber-700 hover:underline"
                    >
                      {participant.proofOfPaymentFileName}
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  ) : (
                    <p className="mt-0.5 text-sm text-slate-800">—</p>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              if (participant) setForm(participant);
              onOpenChange(false);
            }}
          >
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
