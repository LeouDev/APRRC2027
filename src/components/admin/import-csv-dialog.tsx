"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { Loader2, Upload } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type ImportResult = { imported: number; skipped: number; errors: string[] };

export function ImportCsvDialog({ onImported }: { onImported: () => void }) {
  const [open, setOpen] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [csvText, setCsvText] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  function handleFile(file: File) {
    setFileName(file.name);
    setResult(null);
    const reader = new FileReader();
    reader.onload = () => setCsvText(String(reader.result ?? ""));
    reader.readAsText(file);
  }

  async function handleImport() {
    if (!csvText) return;
    setImporting(true);
    try {
      const res = await fetch("/api/admin/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ csv: csvText }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Import failed.");
      setResult(data);
      if (data.imported > 0) {
        toast.success(`Imported ${data.imported} participant(s).`);
        onImported();
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Import failed.");
    } finally {
      setImporting(false);
    }
  }

  function reset() {
    setFileName(null);
    setCsvText(null);
    setResult(null);
    if (fileInput.current) fileInput.current.value = "";
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) reset();
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" size="md">
          <Upload className="h-4 w-4" />
          Import CSV
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Import Participants from CSV</DialogTitle>
          <DialogDescription>
            Upload a Google Sheets export of your registration responses, or a CSV exported from this
            dashboard. Rows are matched by column name (Name / First Name / Email / Country, etc.) and
            new participants are added as <strong>Pending</strong>. Duplicate emails are skipped.
          </DialogDescription>
        </DialogHeader>

        <input
          ref={fileInput}
          type="file"
          accept=".csv,text/csv"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
          className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-full file:border-0 file:bg-slate-100 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-slate-700 hover:file:bg-slate-200"
        />
        {fileName && <p className="text-xs text-slate-500">Selected: {fileName}</p>}

        {result && (
          <div className="rounded-lg bg-slate-50 p-4 text-sm">
            <p className="font-medium text-slate-800">
              Imported {result.imported}, skipped {result.skipped}.
            </p>
            {result.errors.length > 0 && (
              <ul className="mt-2 max-h-32 space-y-1 overflow-y-auto text-xs text-slate-500">
                {result.errors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Close
          </Button>
          <Button onClick={handleImport} disabled={!csvText || importing}>
            {importing && <Loader2 className="h-4 w-4 animate-spin" />}
            Import
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
