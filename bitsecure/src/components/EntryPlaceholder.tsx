import type {
  PasswordEntry,
  PasswordEntryInput,
  PasswordEntryValidationErrors,
} from "../models/passwordEntry";

interface EntryPlaceholderProps {
  entries: PasswordEntry[];
  entryDraft: PasswordEntryInput;
  entryErrors: PasswordEntryValidationErrors;
  editingEntryId: string | null;
  isSavingEntry: boolean;
  onEntryDraftChange: (field: keyof PasswordEntryInput, value: string) => void;
  onSaveEntry: () => void;
  onCancelEdit: () => void;
}

function getInputClasses(hasError?: boolean): string {
  return `w-full rounded-2xl border px-4 py-3 text-sm outline-none transition ${
    hasError
      ? "border-rose-300 bg-rose-50 text-rose-900 focus:border-rose-400 focus:ring-4 focus:ring-rose-100"
      : "border-slate-200 bg-slate-50 text-slate-950 focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-100"
  }`;
}

export default function EntryPlaceholder({
  entries,
  entryDraft,
  entryErrors,
  editingEntryId,
  isSavingEntry,
  onEntryDraftChange,
  onSaveEntry,
  onCancelEdit,
}: EntryPlaceholderProps) {
  return (
    <section className="rounded-[28px] border border-slate-200/80 bg-white/90 p-6 shadow-lg shadow-slate-200/60 backdrop-blur">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700">
            Editor
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
            {editingEntryId ? "Edit entry" : "Add entry"}
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {editingEntryId
              ? "Adjust the selected credential and save the encrypted changes."
              : "Create a new vault entry with title, username, password, URL, and notes."}
          </p>
        </div>
        <div className="rounded-2xl bg-slate-100 px-3 py-2 text-right">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Entries</p>
          <p className="text-lg font-semibold text-slate-900">{entries.length}</p>
        </div>
      </div>

      <form
        className="mt-6 space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          void onSaveEntry();
        }}
        noValidate
      >
        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">Title</span>
          <input
            id="entry-title"
            type="text"
            className={getInputClasses(entryErrors.title)}
            value={entryDraft.title}
            onChange={(event) => onEntryDraftChange("title", event.target.value)}
            placeholder="GitHub"
          />
          {entryErrors.title ? <span className="text-xs text-rose-600">{entryErrors.title}</span> : null}
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">Username</span>
            <input
              id="entry-username"
              type="text"
              className={getInputClasses(entryErrors.username)}
              value={entryDraft.username}
              onChange={(event) => onEntryDraftChange("username", event.target.value)}
              placeholder="octocat"
            />
            {entryErrors.username ? (
              <span className="text-xs text-rose-600">{entryErrors.username}</span>
            ) : null}
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">Password</span>
            <input
              id="entry-password"
              type="password"
              className={getInputClasses(entryErrors.password)}
              value={entryDraft.password}
              onChange={(event) => onEntryDraftChange("password", event.target.value)}
              placeholder="Password"
            />
            {entryErrors.password ? (
              <span className="text-xs text-rose-600">{entryErrors.password}</span>
            ) : null}
          </label>
        </div>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">URL</span>
          <input
            id="entry-url"
            type="url"
            className={getInputClasses(entryErrors.url)}
            value={entryDraft.url}
            onChange={(event) => onEntryDraftChange("url", event.target.value)}
            placeholder="https://example.com"
          />
          {entryErrors.url ? <span className="text-xs text-rose-600">{entryErrors.url}</span> : null}
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">Notes</span>
          <textarea
            id="entry-notes"
            className={getInputClasses()}
            rows={4}
            value={entryDraft.notes}
            onChange={(event) => onEntryDraftChange("notes", event.target.value)}
            placeholder="Optional notes"
          />
        </label>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          {editingEntryId ? (
            <button
              type="button"
              className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              onClick={onCancelEdit}
              disabled={isSavingEntry}
            >
              Cancel
            </button>
          ) : null}
          <button
            type="submit"
            className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
            disabled={isSavingEntry}
          >
            {isSavingEntry ? "Saving..." : editingEntryId ? "Save changes" : "Add entry"}
          </button>
        </div>
      </form>
    </section>
  );
}
