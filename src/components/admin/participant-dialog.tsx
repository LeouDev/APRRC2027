"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input, Select, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { COUNTRIES } from "@/data/countries";
import { formatDate } from "@/lib/utils";
import type { Participant } from "@/types/participant";

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
    if (participant) setForm(participant);
  }, [participant]);

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

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
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
