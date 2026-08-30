import { Badge } from "@/components/ui/badge";
import type { ParticipantStatus } from "@prisma/client";

const LABELS: Record<ParticipantStatus, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  CANCELLED: "Cancelled",
  REJECTED: "Rejected",
};

const VARIANTS: Record<ParticipantStatus, "confirmed" | "pending" | "cancelled" | "rejected"> = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  CANCELLED: "cancelled",
  REJECTED: "rejected",
};

export function StatusBadge({ status }: { status: ParticipantStatus }) {
  return <Badge variant={VARIANTS[status]}>{LABELS[status]}</Badge>;
}
