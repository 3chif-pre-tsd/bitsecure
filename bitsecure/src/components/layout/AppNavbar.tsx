import { Link, useRouterState } from "@tanstack/react-router";
import Button from "../ui/Button";
import Icon from "../ui/Icon";

interface AppNavbarProps {
  onLogout: () => void;
}

function getNavItemClasses(isActive: boolean) {
  return [
    "rounded-lg px-3.5 py-2 text-sm font-medium transition-colors",
    isActive
      ? "bg-slate-900 text-white shadow-sm"
      : "text-slate-700 hover:bg-slate-100 hover:text-slate-950",
  ].join(" ");
}

export default function AppNavbar({ onLogout }: AppNavbarProps) {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  const isDashboardActive =
    pathname === "/dashboard" || (pathname.startsWith("/dashboard/") && pathname !== "/dashboard/new");
  const isCreateActive = pathname === "/dashboard/new";

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <Link to="/dashboard" className="inline-flex items-center gap-3 rounded-lg">
            <span className="inline-flex size-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-100 text-slate-900">
              <Icon name="vault" className="size-4.5" />
            </span>
            <span>
              <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                BitSecure
              </span>
              <span className="block text-base font-semibold tracking-tight text-slate-950">Vault</span>
            </span>
          </Link>

          <Button
            variant="secondary"
            className="border-slate-300 text-slate-700 lg:hidden"
            onClick={onLogout}
          >
            <Icon name="logout" className="size-4" />
            Logout
          </Button>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between lg:gap-4">
          <nav className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1">
            <Link to="/dashboard" className={getNavItemClasses(isDashboardActive)}>
              Dashboard
            </Link>
            <Link to="/dashboard/new" className={getNavItemClasses(isCreateActive)}>
              Create entry
            </Link>
          </nav>

          <Button
            variant="secondary"
            className="hidden border-slate-300 text-slate-700 lg:inline-flex"
            onClick={onLogout}
          >
            <Icon name="logout" className="size-4" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
