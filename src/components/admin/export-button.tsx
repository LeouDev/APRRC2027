"use client";

import { useSearchParams } from "next/navigation";
import { Download } from "lucide-react";

export function ExportButton() {
  const searchParams = useSearchParams();
  const query = searchParams.toString();

  return (
    <a
      href={`/api/admin/export${query ? `?${query}` : ""}`}
      className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-slate-800"
    >
      <Download className="h-4 w-4" />
      Export Participants
    </a>
  );
}
