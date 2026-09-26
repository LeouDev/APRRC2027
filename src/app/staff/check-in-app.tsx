"use client";

import { useEffect, useEffectEvent, useReducer, useRef, useState, useTransition } from "react";
import jsQR from "jsqr";
import { toast } from "sonner";
import { AlertTriangle, Camera, CheckCircle2, Loader2, Search, ShieldCheck, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/ui/status-badge";
import { flagForCountryName } from "@/data/countries";
import { cn } from "@/lib/utils";
import { checkIn, denyCheckIn, findTicket, listAttendance, undoCheckIn, type Ticket } from "./actions";

type Filter = "out" | "in" | "all";
type Panel =
  | { kind: "idle" }
  | { kind: "scanning" }
  | { kind: "loading" }
  | { kind: "missing" }
  | { kind: "ticket"; ticket: Ticket; justCheckedIn?: boolean };

const FILTERS: [Filter, string][] = [
  ["out", "Not yet"],
  ["in", "Checked in"],
  ["all", "All"],
];

// Ticket QRs encode `${siteUrl}/ticket/<id>` — see app/(site)/ticket/[id]/page.tsx.
function ticketIdFrom(text: string) {
  try {
    return new URL(text).pathname.match(/^\/ticket\/([\w-]+)\/?$/)?.[1] ?? null;
  } catch {
    return null;
  }
}

const when = (d: Date) =>
  new Date(d).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });

export function CheckInApp() {
  const [panel, setPanel] = useState<Panel>({ kind: "idle" });
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("out");
  const [list, setList] = useState<Awaited<ReturnType<typeof listAttendance>> | null>(null);
  const [reloadKey, reload] = useReducer((n: number) => n + 1, 0);

  useEffect(() => {
    const t = setTimeout(() => {
      listAttendance(search, filter).then(setList, () => toast.error("Couldn't load the attendance list."));
    }, 300);
    return () => clearTimeout(t);
  }, [search, filter, reloadKey]);

  function show(ticket: Ticket | null, justCheckedIn = false) {
    setPanel(ticket ? { kind: "ticket", ticket, justCheckedIn } : { kind: "missing" });
    reload();
  }

  async function lookUp(id: string) {
    navigator.vibrate?.(80);
    setPanel({ kind: "loading" });
    try {
      show(await findTicket(id));
    } catch {
      toast.error("Couldn't look up that ticket. Check your connection and try again.");
      setPanel({ kind: "idle" });
    }
  }

  return (
    <div className="space-y-6">
      <section className="space-y-3">
        {panel.kind === "idle" && (
          <button
            onClick={() => setPanel({ kind: "scanning" })}
            className="flex w-full flex-col items-center gap-2 rounded-2xl bg-slate-900 py-10 text-white shadow-lg transition active:scale-[0.99]"
          >
            <Camera className="h-10 w-10" />
            <span className="text-lg font-semibold">Scan Ticket QR</span>
          </button>
        )}

        {panel.kind === "scanning" && (
          <>
            <Scanner onScan={lookUp} />
            <Button variant="outline" className="w-full" onClick={() => setPanel({ kind: "idle" })}>
              Cancel
            </Button>
          </>
        )}

        {panel.kind === "loading" && (
          <div className="flex items-center justify-center gap-2 rounded-2xl bg-white py-16 text-sm text-slate-500">
            <Loader2 className="h-5 w-5 animate-spin" />
            Looking up ticket…
          </div>
        )}

        {panel.kind === "missing" && (
          <div className="rounded-2xl bg-red-50 p-5 text-red-800 ring-1 ring-red-200">
            <p className="flex items-center gap-2 font-semibold">
              <XCircle className="h-5 w-5" />
              Ticket not found
            </p>
            <p className="mt-1 text-sm">
              This registration doesn&apos;t exist (it may have been deleted). Don&apos;t admit — send them to the
              organizers&apos; desk.
            </p>
          </div>
        )}

        {panel.kind === "ticket" && (
          <TicketCard key={panel.ticket.id} ticket={panel.ticket} justCheckedIn={panel.justCheckedIn} onChange={show} />
        )}

        {(panel.kind === "ticket" || panel.kind === "missing") && (
          <div className="grid grid-cols-2 gap-2">
            <Button variant="dark" onClick={() => setPanel({ kind: "scanning" })}>
              <Camera />
              Scan Next
            </Button>
            <Button variant="outline" onClick={() => setPanel({ kind: "idle" })}>
              Done
            </Button>
          </div>
        )}
      </section>

      <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="font-semibold text-slate-900">Attendance</h2>
          {list && (
            <p className="text-sm text-slate-500">
              <span className="font-bold text-slate-900">{list.checkedIn}</span> / {list.confirmed} checked in
            </p>
          )}
        </div>

        <div className="relative mt-3">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            type="search"
            enterKeyHint="search"
            placeholder="Search name, reg #, club…"
            aria-label="Search participants"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="mt-3 grid grid-cols-3 gap-1 rounded-full bg-slate-100 p-1">
          {FILTERS.map(([value, label]) => (
            <button
              key={value}
              aria-pressed={filter === value}
              onClick={() => setFilter(value)}
              className={cn(
                "rounded-full py-1.5 text-sm font-medium text-slate-600 transition-colors",
                filter === value && "bg-white text-slate-900 shadow-sm"
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {!list && <p className="py-8 text-center text-sm text-slate-400">Loading…</p>}
        {list?.rows.length === 0 && <p className="py-8 text-center text-sm text-slate-400">No one matches.</p>}

        <ul className="mt-2 divide-y divide-slate-100">
          {list?.rows.map((t) => (
            <li key={t.id}>
              <button
                onClick={() => {
                  setPanel({ kind: "ticket", ticket: t });
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="flex w-full items-center gap-3 py-3 text-left"
              >
                <span className="text-lg">{flagForCountryName(t.country)}</span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium text-slate-900">
                    {t.firstName} {t.lastName}
                    {t.preferredEnglishName && <span className="font-normal text-slate-500"> ({t.preferredEnglishName})</span>}
                  </span>
                  <span className="block truncate text-xs text-slate-500">
                    {t.registrationNumber}
                    {t.organization && ` · ${t.organization}`}
                  </span>
                </span>
                {t.checkedInAt ? (
                  <span className="flex shrink-0 items-center gap-1 text-xs font-semibold text-emerald-600">
                    <CheckCircle2 className="h-4 w-4" />
                    {when(t.checkedInAt)}
                  </span>
                ) : (
                  t.checkInDeniedAt && <span className="shrink-0 text-xs font-semibold text-red-600">Denied</span>
                )}
              </button>
            </li>
          ))}
        </ul>

        {list?.more && (
          <p className="pt-2 text-center text-xs text-slate-400">Showing the first 50. Search to narrow it down.</p>
        )}
      </section>
    </div>
  );
}

function TicketCard({
  ticket,
  justCheckedIn,
  onChange,
}: {
  ticket: Ticket;
  justCheckedIn?: boolean;
  onChange: (ticket: Ticket | null, justCheckedIn?: boolean) => void;
}) {
  const [pending, startTransition] = useTransition();
  const [denying, setDenying] = useState(false);
  const confirmed = ticket.status === "CONFIRMED";

  function run(action: () => Promise<void>) {
    startTransition(async () => {
      try {
        await action();
      } catch {
        toast.error("Something went wrong. Check your connection and try again.");
      }
    });
  }

  const approve = () =>
    run(async () => {
      const { ok, ticket: fresh } = await checkIn(ticket.id);
      if (!ok) toast.warning("Not checked in. See the ticket's current status.");
      onChange(fresh, ok);
    });

  const undo = () => run(async () => onChange(await undoCheckIn(ticket.id)));

  function deny(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const reason = String(new FormData(e.currentTarget).get("reason") ?? "");
    run(async () => {
      onChange(await denyCheckIn(ticket.id, reason));
      setDenying(false);
    });
  }

  let banner: { tone: string; icon: React.ReactNode; text: string };
  if (ticket.checkedInAt && justCheckedIn) {
    banner = { tone: "bg-emerald-600 text-white", icon: <CheckCircle2 />, text: "Checked in. Welcome!" };
  } else if (ticket.checkedInAt) {
    banner = {
      tone: "bg-amber-400 text-amber-950",
      icon: <AlertTriangle />,
      text: `Already checked in ${when(ticket.checkedInAt)} by ${ticket.checkedInBy ?? "staff"}`,
    };
  } else if (!confirmed) {
    banner = {
      tone: "bg-red-600 text-white",
      icon: <XCircle />,
      text: "Registration not confirmed. Don't admit; send them to the organizers' desk.",
    };
  } else {
    banner = { tone: "bg-slate-800 text-white", icon: <ShieldCheck />, text: "Check their ID matches, then approve." };
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
      <p className={cn("flex items-center gap-2 px-5 py-3 text-sm font-semibold [&_svg]:h-5 [&_svg]:w-5 [&_svg]:shrink-0", banner.tone)}>
        {banner.icon}
        {banner.text}
      </p>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-xl font-bold leading-tight text-slate-900">
              {ticket.firstName} {ticket.lastName}
            </h2>
            {ticket.preferredEnglishName && (
              <p className="text-sm text-slate-500">Goes by &ldquo;{ticket.preferredEnglishName}&rdquo;</p>
            )}
          </div>
          <StatusBadge status={ticket.status} />
        </div>

        <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
          {(
            [
              ["Reg #", ticket.registrationNumber],
              ["Country", `${flagForCountryName(ticket.country)} ${ticket.country}`],
              ["Club", ticket.organization],
              ["Position", ticket.position],
              ["Reg Group", ticket.regGroup],
              ["Shirt Size", ticket.shirtSize],
            ] as const
          ).map(([label, value]) => (
            <div key={label} className="min-w-0">
              <dt className="text-xs text-slate-400">{label}</dt>
              <dd className="truncate font-medium text-slate-900">{value || "—"}</dd>
            </div>
          ))}
        </dl>

        {ticket.checkInDeniedAt && !ticket.checkedInAt && (
          <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            Denied {when(ticket.checkInDeniedAt)} by {ticket.checkInDeniedBy}: {ticket.checkInDeniedReason}
          </p>
        )}

        <div className="mt-5">
          {ticket.checkedInAt ? (
            <Button variant="outline" size="sm" className="w-full" disabled={pending} onClick={undo}>
              Undo Check-in
            </Button>
          ) : denying ? (
            <form onSubmit={deny} className="space-y-2">
              <Input
                name="reason"
                required
                maxLength={200}
                list="deny-reasons"
                placeholder="Reason for denying entry"
                aria-label="Reason for denying entry"
                autoFocus
              />
              <datalist id="deny-reasons">
                <option value="ID doesn't match the name" />
                <option value="No valid ID shown" />
                <option value="Ticket already used by someone else" />
              </datalist>
              <div className="grid grid-cols-2 gap-2">
                <Button type="submit" variant="destructive" disabled={pending}>
                  {pending && <Loader2 className="animate-spin" />}
                  Record Denial
                </Button>
                <Button type="button" variant="outline" onClick={() => setDenying(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <Button
                size="lg"
                variant="dark"
                disabled={!confirmed || pending}
                onClick={approve}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {pending ? <Loader2 className="animate-spin" /> : <CheckCircle2 />}
                Approve
              </Button>
              <Button size="lg" variant="outline" disabled={pending} onClick={() => setDenying(true)}>
                <XCircle />
                Deny
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Scanner({ onScan }: { onScan: (ticketId: string) => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [message, setMessage] = useState("Point the camera at the ticket's QR code.");
  const [failed, setFailed] = useState(false);
  const scanned = useEffectEvent(onScan);

  useEffect(() => {
    let stream: MediaStream | undefined;
    let frame = 0;
    let stopped = false;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d", { willReadFrequently: true });

    function tick() {
      if (stopped) return;
      const video = videoRef.current;
      if (video && ctx && video.readyState >= video.HAVE_ENOUGH_DATA) {
        // A downscaled frame is plenty for a QR held up to the camera and keeps
        // decoding smooth on older phones.
        const scale = Math.min(1, 640 / video.videoWidth);
        canvas.width = Math.round(video.videoWidth * scale);
        canvas.height = Math.round(video.videoHeight * scale);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const image = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(image.data, image.width, image.height, { inversionAttempts: "dontInvert" });
        const id = code && ticketIdFrom(code.data);
        if (id) return scanned(id); // stop looping; the parent unmounts us
        if (code) setMessage("That QR code isn't an APRRC ticket.");
      }
      frame = requestAnimationFrame(tick);
    }

    (async () => {
      try {
        const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: false });
        // Unmounted while the permission prompt was open: cleanup had no stream to stop yet.
        if (stopped) return s.getTracks().forEach((t) => t.stop());
        stream = s;
        videoRef.current!.srcObject = s;
        await videoRef.current!.play();
        tick();
      } catch {
        setFailed(true);
      }
    })();

    return () => {
      stopped = true;
      cancelAnimationFrame(frame);
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  if (failed) {
    return (
      <p className="rounded-2xl bg-amber-50 p-5 text-sm text-amber-900 ring-1 ring-amber-200">
        Couldn&apos;t open the camera. Allow camera access for this site in your phone&apos;s settings, or find the
        person in the attendance list below.
      </p>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl bg-black">
      <video ref={videoRef} playsInline muted className="aspect-square w-full object-cover" />
      <div className="pointer-events-none absolute inset-12 rounded-2xl border-4 border-white/80" />
      <p className="absolute inset-x-0 bottom-0 bg-black/60 px-4 py-3 text-center text-sm text-white">{message}</p>
    </div>
  );
}
