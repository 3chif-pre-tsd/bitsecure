import { Link } from "@tanstack/react-router";
import Button from "../ui/Button";
import Icon from "../ui/Icon";

interface AppNavbarProps {
  onLogout: () => void;
}

export default function AppNavbar({ onLogout }: AppNavbarProps) {
  return (
    <header className="fixed inset-x-0 top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/dashboard" className="inline-flex items-center gap-3 rounded-lg">
          <span className="inline-flex size-10 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-sm shadow-slate-900/15">
            <Icon name="vault" className="size-4.5" />
          </span>
          <span>
            <span className="block text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
              BitSecure
            </span>
            <span className="block text-base font-semibold tracking-tight text-slate-950">Vault</span>
          </span>
        </Link>

        <Button
          variant="secondary"
          className="min-h-10 rounded-xl border-slate-300 px-3 py-2 text-slate-700"
          onClick={onLogout}
        >
          <Icon name="logout" className="size-4" />
          Logout
        </Button>
      </div>
    </header>
  );
}
