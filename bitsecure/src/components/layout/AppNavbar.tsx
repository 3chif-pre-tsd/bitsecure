import { Link, useRouterState } from "@tanstack/react-router";
import Button from "../ui/Button";
import Icon from "../ui/Icon";

interface AppNavbarProps {
  onLogout: () => void;
}

function getNavItemClasses(isActive: boolean) {
  return [
    "rounded-full px-4 py-2 text-sm font-semibold transition",
    isActive
      ? "bg-slate-950 text-white"
      : "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
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
    <header className="border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <Link to="/dashboard" className="inline-flex items-center gap-3">
            <span className="inline-flex size-11 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-sm shadow-slate-950/20">
              <Icon name="vault" className="size-5" />
            </span>
            <span>
              <span className="block text-xs font-semibold uppercase tracking-[0.24em] text-cyan-700">
                BitSecure
              </span>
              <span className="block text-lg font-semibold tracking-tight text-slate-950">
                Vault workspace
              </span>
            </span>
          </Link>

          <Button variant="ghost" className="lg:hidden" onClick={onLogout}>
            <Icon name="logout" className="size-4" />
            Logout
          </Button>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between lg:gap-4">
          <nav className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 p-1">
            <Link to="/dashboard" className={getNavItemClasses(isDashboardActive)}>
              Dashboard
            </Link>
            <Link to="/dashboard/new" className={getNavItemClasses(isCreateActive)}>
              Create entry
            </Link>
          </nav>

          <Button variant="ghost" className="hidden lg:inline-flex" onClick={onLogout}>
            <Icon name="logout" className="size-4" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
