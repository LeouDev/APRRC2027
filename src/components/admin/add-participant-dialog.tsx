"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2, UserPlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input, Select } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { COUNTRIES } from "@/data/countries";

const EMPTY = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  country: "Philippines",
  city: "",
  organization: "",
  position: "",
  status: "PENDING",
};

export function AddParticipantDialog({ onCreated }: { onCreated: () => void }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCreate() {
    if (!form.firstName || !form.lastName || !form.email || !form.country) {
      setError("First name, last name, email and country are required.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/participants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? "Failed to add participant.");
      }
      toast.success("Participant added.");
      setForm(EMPTY);
      setOpen(false);
      onCreated();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to add participant.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="dark" size="md">
          <UserPlus className="h-4 w-4" />
          Add Participant
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Participant</DialogTitle>
          <DialogDescription>Manually register a delegate. A reference number is generated automatically.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label required>First Name</Label>
            <Input className="mt-1.5" value={form.firstName} onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))} />
          </div>
          <div>
            <Label required>Last Name</Label>
            <Input className="mt-1.5" value={form.lastName} onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))} />
          </div>
          <div className="sm:col-span-2">
            <Label required>Email</Label>
            <Input type="email" className="mt-1.5" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
          </div>
          <div>
            <Label>Phone</Label>
            <Input className="mt-1.5" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
          </div>
          <div>
            <Label required>Country</Label>
            <Select className="mt-1.5" value={form.country} onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}>
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.name}>
                  {c.name}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label>City</Label>
            <Input className="mt-1.5" value={form.city} onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))} />
          </div>
          <div>
            <Label>Organization</Label>
            <Input className="mt-1.5" value={form.organization} onChange={(e) => setForm((f) => ({ ...f, organization: e.target.value }))} />
          </div>
          <div>
            <Label>Position</Label>
            <Input className="mt-1.5" value={form.position} onChange={(e) => setForm((f) => ({ ...f, position: e.target.value }))} />
          </div>
          <div className="sm:col-span-2">
            <Label>Status</Label>
            <Select className="mt-1.5" value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}>
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="REJECTED">Rejected</option>
            </Select>
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={saving}>
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            Add Participant
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
