import Button from "../ui/Button";
import Icon from "../ui/Icon";
import Panel from "../ui/Panel";

interface DashboardHeaderProps {
  entryCount: number;
  filteredCount: number;
  selectedCount: number;
  isLoadingEntries: boolean;
  onLogout: () => void;
}

export default function DashboardHeader({
  entryCount,
  filteredCount,
  selectedCount,
  isLoadingEntries,
  onLogout,
}: DashboardHeaderProps) {
  return (
    <Panel
      eyebrow="Vault overview"
      title="Encrypted credentials in one clear local workflow."
      description="Manage search, entry details, editing, and master password updates from a single consistent dashboard."
      action={
        <div className="rounded-[28px] bg-slate-950 p-5 text-white">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Session</p>
          <p className="mt-1 text-lg font-semibold">Master password unlocked</p>
          <p className="text-sm text-slate-300">Encrypted local vault session</p>
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
          <p className="mt-2 text-3xl font-semibold text-slate-950">
            {isLoadingEntries ? "..." : selectedCount}
          </p>
        </div>
      </div>
    </Panel>
  );
}
