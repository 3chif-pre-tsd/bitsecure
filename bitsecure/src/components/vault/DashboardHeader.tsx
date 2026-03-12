import type { UserProfile } from "../../models/auth";
import Button from "../ui/Button";
import Icon from "../ui/Icon";
import Panel from "../ui/Panel";

interface DashboardHeaderProps {
  user: UserProfile;
  entryCount: number;
  filteredCount: number;
  selectedCount: number;
  onLogout: () => void;
}

export default function DashboardHeader({
  user,
  entryCount,
  filteredCount,
  selectedCount,
  onLogout,
}: DashboardHeaderProps) {
  return (
    <Panel
      eyebrow="Vault overview"
      title="Keep sensitive credentials organized and protected."
      description="Manage your encrypted browser vault through a cleaner dashboard with distinct areas for search, details, and editing."
      action={
        <div className="rounded-[26px] bg-slate-950 p-5 text-white">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Signed in</p>
          <p className="mt-1 text-lg font-semibold">{user.displayName}</p>
          <p className="text-sm text-slate-300">{user.email}</p>
          <Button className="mt-4" variant="secondary" onClick={onLogout}>
            <Icon name="logout" className="size-4" />
            Logout
          </Button>
        </div>
      }
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-[24px] border border-slate-200 bg-slate-50 px-5 py-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Stored entries</p>
          <p className="mt-2 text-3xl font-semibold text-slate-950">{entryCount}</p>
        </div>
        <div className="rounded-[24px] border border-slate-200 bg-slate-50 px-5 py-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Visible results</p>
          <p className="mt-2 text-3xl font-semibold text-slate-950">{filteredCount}</p>
        </div>
        <div className="rounded-[24px] border border-slate-200 bg-slate-50 px-5 py-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Selected entry</p>
          <p className="mt-2 text-3xl font-semibold text-slate-950">{selectedCount}</p>
        </div>
      </div>
    </Panel>
  );
}
