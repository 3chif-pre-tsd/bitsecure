import type {
  PasswordEntry,
  PasswordEntryFilterOption,
  PasswordEntrySortOption,
} from "../../models/passwordEntry";
import { mergeClasses } from "../../utils/mergeClasses";
import { InputField, SelectField } from "../ui/Field";
import Icon from "../ui/Icon";
import Panel from "../ui/Panel";

interface EntryListPanelProps {
  entries: PasswordEntry[];
  totalEntries: number;
  selectedEntryId: string | null;
  searchQuery: string;
  filterOption: PasswordEntryFilterOption;
  sortOption: PasswordEntrySortOption;
  isLoadingEntries: boolean;
  onSearchQueryChange: (value: string) => void;
  onFilterOptionChange: (value: PasswordEntryFilterOption) => void;
  onSortOptionChange: (value: PasswordEntrySortOption) => void;
  onSelectEntry: (entryId: string) => void;
  onResetPasswordVisibility: () => void;
}

export default function EntryListPanel({
  entries,
  totalEntries,
  selectedEntryId,
  searchQuery,
  filterOption,
  sortOption,
  isLoadingEntries,
  onSearchQueryChange,
  onFilterOptionChange,
  onSortOptionChange,
  onSelectEntry,
  onResetPasswordVisibility,
}: EntryListPanelProps) {
  return (
    <Panel
      eyebrow="Vault list"
      title="Entries"
      description="Search, filter, and sort the vault before opening a record."
      action={
        <div className="rounded-2xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700">
          {entries.length} / {totalEntries}
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
            id="entry-search"
            label="Search entries"
            placeholder="Search title, username, URL or notes"
            value={searchQuery}
            onChange={(event) => onSearchQueryChange(event.target.value)}
            className="pl-11"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField
            id="entry-filter"
            label="Filter"
            value={filterOption}
            onChange={(event) =>
              onFilterOptionChange(event.target.value as PasswordEntryFilterOption)
            }
          >
            <option value="all">All entries</option>
            <option value="with-url">Only with URL</option>
            <option value="with-notes">Only with notes</option>
          </SelectField>

          <SelectField
            id="entry-sort"
            label="Sort"
            value={sortOption}
            onChange={(event) =>
              onSortOptionChange(event.target.value as PasswordEntrySortOption)
            }
          >
            <option value="updated-desc">Recently updated</option>
            <option value="created-desc">Recently created</option>
            <option value="title-asc">Title A-Z</option>
          </SelectField>
        </div>

        <div className="space-y-3">
          {isLoadingEntries ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center text-sm leading-6 text-slate-500">
              Loading encrypted entries...
            </div>
          ) : entries.length > 0 ? (
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
                    <div className="flex flex-wrap justify-end gap-2">
                      {entry.url ? (
                        <span className="rounded-full bg-cyan-100 px-2.5 py-1 text-xs font-medium text-cyan-700">
                          URL
                        </span>
                      ) : null}
                      {entry.notes ? (
                        <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700">
                          Notes
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <p className="mt-3 truncate text-sm text-slate-500">
                    {entry.url || entry.notes || "No URL or notes added yet."}
                  </p>
                </button>
              );
            })
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center text-sm leading-6 text-slate-500">
              No entries match the current search and filter combination.
            </div>
          )}
        </div>
      </div>
    </Panel>
  );
}
