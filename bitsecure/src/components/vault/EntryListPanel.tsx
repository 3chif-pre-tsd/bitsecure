import type { PasswordEntry } from "../../models/passwordEntry";
import Panel from "../ui/Panel";
import { InputField } from "../ui/Field";
import Icon from "../ui/Icon";
import { mergeClasses } from "../../utils/mergeClasses";

interface EntryListPanelProps {
  entries: PasswordEntry[];
  selectedEntryId: string | null;
  filterQuery: string;
  onFilterQueryChange: (value: string) => void;
  onSelectEntry: (entryId: string) => void;
  onResetPasswordVisibility: () => void;
}

export default function EntryListPanel({
  entries,
  selectedEntryId,
  filterQuery,
  onFilterQueryChange,
  onSelectEntry,
  onResetPasswordVisibility,
}: EntryListPanelProps) {
  return (
    <Panel
      eyebrow="Vault list"
      title="Entries"
      description="Select an entry to inspect its details or prepare it for editing."
      action={
        <div className="rounded-2xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700">
          {entries.length} items
        </div>
      }
    >
      <div className="space-y-5">
        <div className="relative">
          <Icon
            name="search"
            className="pointer-events-none absolute left-4 top-[46px] size-4 text-slate-400"
          />
          <InputField
            id="entry-filter"
            label="Search entries"
            placeholder="Search title, username, URL or notes"
            value={filterQuery}
            onChange={(event) => onFilterQueryChange(event.target.value)}
            className="pl-11"
          />
        </div>

        <div className="space-y-3">
          {entries.length > 0 ? (
            entries.map((entry) => {
              const isSelected = selectedEntryId === entry.id;

              return (
                <button
                  key={entry.id}
                  type="button"
                  className={mergeClasses(
                    "w-full rounded-3xl border px-4 py-4 text-left transition",
                    isSelected
                      ? "border-cyan-500 bg-cyan-50 shadow-sm shadow-cyan-100"
                      : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50",
                  )}
                  onClick={() => {
                    onSelectEntry(entry.id);
                    onResetPasswordVisibility();
                  }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-950">{entry.title}</p>
                      <p className="mt-1 text-sm text-slate-600">{entry.username}</p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                      {entry.url ? "URL" : "Vault"}
                    </span>
                  </div>
                  <p className="mt-3 truncate text-sm text-slate-500">
                    {entry.url || entry.notes || "No URL or notes added yet."}
                  </p>
                </button>
              );
            })
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center text-sm leading-6 text-slate-500">
              No entries match the current filter.
            </div>
          )}
        </div>
      </div>
    </Panel>
  );
}
