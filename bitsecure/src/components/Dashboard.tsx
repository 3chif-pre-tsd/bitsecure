import { useState } from "react";
import type { UserProfile } from "../models/auth";
import type {
  PasswordEntry,
  PasswordEntryInput,
  PasswordEntryValidationErrors,
} from "../models/passwordEntry";
import EntryPlaceholder from "./EntryPlaceholder";

interface DashboardProps {
  user: UserProfile;
  entries: PasswordEntry[];
  filteredEntries: PasswordEntry[];
  selectedEntry: PasswordEntry | null;
  entryDraft: PasswordEntryInput;
  entryErrors: PasswordEntryValidationErrors;
  filterQuery: string;
  editingEntryId: string | null;
  isSavingEntry: boolean;
  onEntryDraftChange: (field: keyof PasswordEntryInput, value: string) => void;
  onSaveEntry: () => void;
  onSelectEntry: (entryId: string) => void;
  onEditEntry: (entry: PasswordEntry) => void;
  onCancelEdit: () => void;
  onDeleteEntry: (entryId: string) => void;
  onFilterQueryChange: (value: string) => void;
  onLogout: () => void;
}

function formatDateTime(value: string): string {
  return new Intl.DateTimeFormat("de-AT", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function Dashboard({
  user,
  entries,
  filteredEntries,
  selectedEntry,
  entryDraft,
  entryErrors,
  filterQuery,
  editingEntryId,
  isSavingEntry,
  onEntryDraftChange,
  onSaveEntry,
  onSelectEntry,
  onEditEntry,
  onCancelEdit,
  onDeleteEntry,
  onFilterQueryChange,
  onLogout,
}: DashboardProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-[30px] border border-slate-200/70 bg-white/80 p-6 shadow-lg shadow-slate-200/60 backdrop-blur">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">
                Vault overview
              </p>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                Keep sensitive credentials organized and protected.
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-slate-600">
                Open entries, inspect details, edit fields, and manage encrypted browser
                storage in one responsive dashboard.
              </p>
            </div>

            <div className="flex flex-col items-start gap-3 rounded-[26px] bg-slate-950 p-5 text-white sm:flex-row sm:items-center">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Signed in</p>
                <p className="mt-1 text-lg font-semibold">{user.displayName}</p>
                <p className="text-sm text-slate-300">{user.email}</p>
              </div>
              <button
                type="button"
                className="rounded-2xl border border-white/15 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                onClick={onLogout}
              >
                Logout
              </button>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-[24px] border border-slate-200 bg-slate-50 px-5 py-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Stored entries</p>
              <p className="mt-2 text-3xl font-semibold text-slate-950">{entries.length}</p>
            </div>
            <div className="rounded-[24px] border border-slate-200 bg-slate-50 px-5 py-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Visible results</p>
              <p className="mt-2 text-3xl font-semibold text-slate-950">{filteredEntries.length}</p>
            </div>
            <div className="rounded-[24px] border border-slate-200 bg-slate-50 px-5 py-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Selected entry</p>
              <p className="mt-2 text-3xl font-semibold text-slate-950">
                {selectedEntry ? "1" : "0"}
              </p>
            </div>
          </div>
        </header>

        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr_1fr]">
          <section className="rounded-[28px] border border-slate-200/80 bg-white/90 p-6 shadow-lg shadow-slate-200/60 backdrop-blur">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700">
                  Vault list
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                  Entries
                </h2>
              </div>
              <div className="rounded-2xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700">
                {filteredEntries.length} items
              </div>
            </div>

            <label htmlFor="entry-filter" className="mt-6 block space-y-2">
              <span className="text-sm font-medium text-slate-700">Search entries</span>
              <input
                id="entry-filter"
                type="search"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-100"
                value={filterQuery}
                onChange={(event) => onFilterQueryChange(event.target.value)}
                placeholder="Search title, username, URL or notes"
              />
            </label>

            <div className="mt-5 space-y-3">
              {filteredEntries.length > 0 ? (
                filteredEntries.map((entry) => {
                  const isSelected = selectedEntry?.id === entry.id;

                  return (
                    <button
                      key={entry.id}
                      type="button"
                      className={`w-full rounded-3xl border px-4 py-4 text-left transition ${
                        isSelected
                          ? "border-cyan-500 bg-cyan-50 shadow-sm shadow-cyan-100"
                          : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                      }`}
                      onClick={() => {
                        onSelectEntry(entry.id);
                        setIsPasswordVisible(false);
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
          </section>

          <section className="rounded-[28px] border border-slate-200/80 bg-white/90 p-6 shadow-lg shadow-slate-200/60 backdrop-blur">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700">
                Entry details
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                {selectedEntry ? selectedEntry.title : "Open an entry"}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {selectedEntry
                  ? "Review the current record, reveal the password, or switch to edit mode."
                  : "Select an entry from the list to inspect stored details."}
              </p>
            </div>

            {selectedEntry ? (
              <div className="mt-6 space-y-6">
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Username</p>
                  <p className="mt-2 break-all text-lg font-semibold text-slate-950">
                    {selectedEntry.username}
                  </p>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Password</p>
                      <p className="mt-2 font-mono text-lg tracking-[0.25em] text-slate-950">
                        {isPasswordVisible ? selectedEntry.password : "************"}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="rounded-2xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-white"
                      onClick={() => setIsPasswordVisible((currentValue) => !currentValue)}
                    >
                      {isPasswordVisible ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                <dl className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                    <dt className="text-xs uppercase tracking-[0.2em] text-slate-500">URL</dt>
                    <dd className="mt-2 break-all text-sm leading-6 text-slate-700">
                      {selectedEntry.url ? (
                        <a
                          className="font-medium text-cyan-700 underline decoration-cyan-200 underline-offset-4"
                          href={selectedEntry.url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {selectedEntry.url}
                        </a>
                      ) : (
                        "No URL"
                      )}
                    </dd>
                  </div>
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                    <dt className="text-xs uppercase tracking-[0.2em] text-slate-500">Notes</dt>
                    <dd className="mt-2 text-sm leading-6 text-slate-700">
                      {selectedEntry.notes || "No notes"}
                    </dd>
                  </div>
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                    <dt className="text-xs uppercase tracking-[0.2em] text-slate-500">Created</dt>
                    <dd className="mt-2 text-sm leading-6 text-slate-700">
                      {formatDateTime(selectedEntry.createdAt)}
                    </dd>
                  </div>
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                    <dt className="text-xs uppercase tracking-[0.2em] text-slate-500">Updated</dt>
                    <dd className="mt-2 text-sm leading-6 text-slate-700">
                      {formatDateTime(selectedEntry.updatedAt)}
                    </dd>
                  </div>
                </dl>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                    onClick={() => onEditEntry(selectedEntry)}
                  >
                    Edit entry
                  </button>
                  <button
                    type="button"
                    className="rounded-2xl border border-rose-200 px-4 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
                    onClick={() => onDeleteEntry(selectedEntry.id)}
                    disabled={isSavingEntry}
                  >
                    Delete entry
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-6 rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center text-sm leading-6 text-slate-500">
                Select an entry from the vault list to inspect its data.
              </div>
            )}
          </section>

          <EntryPlaceholder
            entries={entries}
            entryDraft={entryDraft}
            entryErrors={entryErrors}
            editingEntryId={editingEntryId}
            isSavingEntry={isSavingEntry}
            onEntryDraftChange={onEntryDraftChange}
            onSaveEntry={onSaveEntry}
            onCancelEdit={onCancelEdit}
          />
        </div>
      </div>
    </main>
  );
}
