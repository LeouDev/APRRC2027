import Link from "next/link";
import { LayoutDashboard, Users, Globe2, BarChart3, Settings, LogOut } from "lucide-react";
import { getSession } from "@/lib/session";
import { logoutAction } from "@/app/admin/login/actions";
import { Photo } from "@/components/site/photo";

function LogoBadge({ className }: { className: string }) {
  return (
    <Photo
      src="/images/logo.png"
      alt="APRRC '27 logo"
      className={`${className} rounded-full object-cover`}
      fallback={
        <span
          className={`${className} flex items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-600 font-black text-white`}
        >
          AP
        </span>
      }
    />
  );
}

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/participants", label: "Participants", icon: Users },
  { href: "/admin#countries", label: "Countries", icon: Globe2 },
  { href: "/admin#trend", label: "Analytics", icon: BarChart3 },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  return (
    <div className="flex min-h-screen bg-slate-100">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-slate-200 bg-slate-950 lg:flex">
        <Link href="/" className="flex items-center gap-2.5 px-6 py-6 transition-opacity hover:opacity-80">
          <LogoBadge className="h-9 w-9 text-sm" />
          <div>
            <p className="text-sm font-bold text-white">APRRC 2027</p>
            <p className="text-xs text-slate-400">Organizer Dashboard</p>
          </div>
        </Link>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {NAV.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="border-t border-white/10 p-4">
          <p className="truncate px-2 text-xs text-slate-500">{session?.email}</p>
          <form action={logoutAction}>
            <button
              type="submit"
              className="mt-2 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </form>
        </div>
      </aside>

      <MobileNav email={session?.email} />

      <div className="flex-1 lg:pl-64">
        <div className="mx-auto max-w-7xl px-5 pb-8 pt-20 sm:px-8 lg:pt-8">{children}</div>
      </div>
    </div>
  );
}

function MobileNav({ email }: { email?: string }) {
  return (
    <header className="fixed inset-x-0 top-0 z-40 flex items-center justify-between border-b border-slate-200 bg-slate-950 px-5 py-3 lg:hidden">
      <Link href="/" className="flex items-center gap-2 text-sm font-bold text-white">
        <LogoBadge className="h-8 w-8 text-xs" />
        APRRC Admin
      </Link>
      <form action={logoutAction}>
        <button type="submit" className="text-xs font-medium text-slate-300">
          Logout
        </button>
      </form>
      <span className="sr-only">{email}</span>
    </header>
  );
}
