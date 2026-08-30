"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Search, ArrowUpDown, Eye, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { Input, Select } from "@/components/ui/input";
import { StatusBadge } from "@/components/ui/status-badge";
import { ExportButton } from "@/components/admin/export-button";
import { AddParticipantDialog } from "@/components/admin/add-participant-dialog";
import { ImportCsvDialog } from "@/components/admin/import-csv-dialog";
import { ParticipantDialog } from "@/components/admin/participant-dialog";
import { DeleteConfirmDialog } from "@/components/admin/delete-confirm-dialog";
import { flagForCountryName } from "@/data/countries";
import { formatDate } from "@/lib/utils";
import type { Participant } from "@/types/participant";

function useDebounced<T>(value: T, delay = 350): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

export default function ParticipantsPage() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounced(search);
  const [country, setCountry] = useState("");
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState("registrationDate");
  const [dir, setDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);

  const [participants, setParticipants] = useState<Participant[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [countryOptions, setCountryOptions] = useState<string[]>([]);

  const [selected, setSelected] = useState<Participant | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Participant | null>(null);

  const query = useMemo(() => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (country) params.set("country", country);
    if (status) params.set("status", status);
    params.set("sort", sort);
    params.set("dir", dir);
    params.set("page", String(page));
    params.set("pageSize", "20");
    return params.toString();
  }, [debouncedSearch, country, status, sort, dir, page]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/participants?${query}`);
      const data = await res.json();
      setParticipants(data.participants ?? []);
      setTotal(data.total ?? 0);
      setTotalPages(data.totalPages ?? 1);
      const countries = Array.from(new Set((data.participants ?? []).map((p: Participant) => p.country) as string[]));
      setCountryOptions((prev) => Array.from(new Set([...prev, ...countries])).sort());
    } catch {
      toast.error("Failed to load participants.");
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, country, status]);

  function toggleSort(field: string) {
    if (sort === field) {
      setDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSort(field);
      setDir("desc");
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/admin/participants/${deleteTarget.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Participant deleted.");
      setDeleteTarget(null);
      load();
    } catch {
      toast.error("Failed to delete participant.");
    }
  }

  function resetFilters() {
    setSearch("");
    setCountry("");
    setStatus("");
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Participants</h1>
          <p className="text-sm text-slate-500">{total.toLocaleString()} total registrations.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <ImportCsvDialog onImported={load} />
          <AddParticipantDialog onCreated={load} />
          <ExportButton />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="relative min-w-[14rem] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search name, email, reference #…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={country} onChange={(e) => setCountry(e.target.value)} className="w-auto min-w-[10rem]">
          <option value="">All countries</option>
          {countryOptions.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Select>
        <Select value={status} onChange={(e) => setStatus(e.target.value)} className="w-auto min-w-[9rem]">
          <option value="">All statuses</option>
          <option value="PENDING">Pending</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="CANCELLED">Cancelled</option>
          <option value="REJECTED">Rejected</option>
        </Select>
        {(search || country || status) && (
          <button onClick={resetFilters} className="text-xs font-semibold text-amber-600 hover:text-amber-700">
            Reset Filters
          </button>
        )}
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Reg #</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Country</th>
                <th className="px-4 py-3">Organization</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">
                  <button onClick={() => toggleSort("registrationDate")} className="inline-flex items-center gap-1 hover:text-slate-800">
                    Date <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-slate-400">
                    Loading participants…
                  </td>
                </tr>
              )}
              {!loading && participants.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-slate-400">
                    No participants match your search.
                  </td>
                </tr>
              )}
              {!loading &&
                participants.map((p) => (
                  <tr key={p.id} className="border-t border-slate-100 hover:bg-slate-50/60">
                    <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-slate-500">{p.registrationNumber}</td>
                    <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-900">
                      {p.firstName} {p.lastName}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                      <span className="mr-1.5">{flagForCountryName(p.country)}</span>
                      {p.country}
                    </td>
                    <td className="max-w-[10rem] truncate px-4 py-3 text-slate-600">{p.organization || "—"}</td>
                    <td className="max-w-[12rem] truncate px-4 py-3 text-slate-600">{p.email}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-600">{formatDate(p.registrationDate)}</td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <StatusBadge status={p.status} />
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          title="View / Edit"
                          onClick={() => {
                            setSelected(p);
                            setDialogOpen(true);
                          }}
                          className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          title="Edit"
                          onClick={() => {
                            setSelected(p);
                            setDialogOpen(true);
                          }}
                          className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          title="Delete"
                          onClick={() => setDeleteTarget(p)}
                          className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3">
          <p className="text-xs text-slate-500">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <ParticipantDialog
        participant={selected}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSaved={load}
      />

      <DeleteConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(v) => !v && setDeleteTarget(null)}
        title="Delete this participant?"
        description={`This will permanently remove ${deleteTarget?.firstName} ${deleteTarget?.lastName} (${deleteTarget?.registrationNumber}). This cannot be undone.`}
        onConfirm={handleDelete}
      />
    </div>
  );
}
