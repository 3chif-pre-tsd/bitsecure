import type {
  PasswordEntry,
  PasswordEntryInput,
  PasswordEntryValidationErrors,
} from "../models/passwordEntry";

interface EntryPlaceholderProps {
  entries: PasswordEntry[];
  entryDraft: PasswordEntryInput;
  entryErrors: PasswordEntryValidationErrors;
  isSavingEntry: boolean;
  onEntryDraftChange: (field: keyof PasswordEntryInput, value: string) => void;
  onSaveEntry: () => void;
}

export default function EntryPlaceholder({
  entries,
  entryDraft,
  entryErrors,
  isSavingEntry,
  onEntryDraftChange,
  onSaveEntry,
}: EntryPlaceholderProps) {
  return (
    <div className="card h-100">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <h2 className="h5 card-title mb-1">Add entry</h2>
            <p className="card-text text-body-secondary mb-0">
              Create a new credential entry in your encrypted vault.
            </p>
          </div>
          <span className="badge text-bg-light">{entries.length} total</span>
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            void onSaveEntry();
          }}
          noValidate
        >
          <div className="row g-3 mb-3">
            <div className="col-12">
              <label htmlFor="entry-title" className="form-label">
                Title
              </label>
              <input
                id="entry-title"
                type="text"
                className={`form-control${entryErrors.title ? " is-invalid" : ""}`}
                value={entryDraft.title}
                onChange={(event) => onEntryDraftChange("title", event.target.value)}
                placeholder="GitHub"
              />
              {entryErrors.title ? <div className="invalid-feedback">{entryErrors.title}</div> : null}
            </div>
            <div className="col-12 col-md-6">
              <label htmlFor="entry-username" className="form-label">
                Username
              </label>
              <input
                id="entry-username"
                type="text"
                className={`form-control${entryErrors.username ? " is-invalid" : ""}`}
                value={entryDraft.username}
                onChange={(event) => onEntryDraftChange("username", event.target.value)}
                placeholder="octocat"
              />
              {entryErrors.username ? (
                <div className="invalid-feedback">{entryErrors.username}</div>
              ) : null}
            </div>
            <div className="col-12 col-md-6">
              <label htmlFor="entry-password" className="form-label">
                Password
              </label>
              <input
                id="entry-password"
                type="password"
                className={`form-control${entryErrors.password ? " is-invalid" : ""}`}
                value={entryDraft.password}
                onChange={(event) => onEntryDraftChange("password", event.target.value)}
                placeholder="Password"
              />
              {entryErrors.password ? (
                <div className="invalid-feedback">{entryErrors.password}</div>
              ) : null}
            </div>
            <div className="col-12">
              <label htmlFor="entry-url" className="form-label">
                URL
              </label>
              <input
                id="entry-url"
                type="url"
                className={`form-control${entryErrors.url ? " is-invalid" : ""}`}
                value={entryDraft.url}
                onChange={(event) => onEntryDraftChange("url", event.target.value)}
                placeholder="https://example.com"
              />
              {entryErrors.url ? <div className="invalid-feedback">{entryErrors.url}</div> : null}
            </div>
            <div className="col-12">
              <label htmlFor="entry-notes" className="form-label">
                Notes
              </label>
              <textarea
                id="entry-notes"
                className="form-control"
                rows={4}
                value={entryDraft.notes}
                onChange={(event) => onEntryDraftChange("notes", event.target.value)}
                placeholder="Optional notes"
              />
            </div>
          </div>

          <div className="d-flex gap-2 justify-content-end">
            <button type="submit" className="btn btn-primary" disabled={isSavingEntry}>
              {isSavingEntry ? "Saving..." : "Add entry"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
