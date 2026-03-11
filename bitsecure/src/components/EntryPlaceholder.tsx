import type { PasswordEntry, PasswordEntryInput } from "../models/passwordEntry";

interface EntryPlaceholderProps {
  entries: PasswordEntry[];
  entryDraft: PasswordEntryInput;
  onEntryDraftChange: (field: keyof PasswordEntryInput, value: string) => void;
  onAddEntry: () => void;
}

export default function EntryPlaceholder({
  entries,
  entryDraft,
  onEntryDraftChange,
  onAddEntry,
}: EntryPlaceholderProps) {
  return (
    <div className="card">
      <div className="card-body">
        <h2 className="h5 card-title">Entry preparation</h2>
        <p className="card-text text-body-secondary">
          This is a placeholder for future password entry management.
        </p>

        <div className="row g-3 mb-3">
          <div className="col-12 col-md-6">
            <label htmlFor="entry-title" className="form-label">
              Title
            </label>
            <input
              id="entry-title"
              type="text"
              className="form-control"
              value={entryDraft.title}
              onChange={(event) => onEntryDraftChange("title", event.target.value)}
              placeholder="GitHub"
            />
          </div>
          <div className="col-12 col-md-6">
            <label htmlFor="entry-username" className="form-label">
              Username
            </label>
            <input
              id="entry-username"
              type="text"
              className="form-control"
              value={entryDraft.username}
              onChange={(event) => onEntryDraftChange("username", event.target.value)}
              placeholder="octocat"
            />
          </div>
          <div className="col-12 col-md-6">
            <label htmlFor="entry-password" className="form-label">
              Password
            </label>
            <input
              id="entry-password"
              type="password"
              className="form-control"
              value={entryDraft.password}
              onChange={(event) => onEntryDraftChange("password", event.target.value)}
              placeholder="Password"
            />
          </div>
          <div className="col-12 col-md-6">
            <label htmlFor="entry-url" className="form-label">
              URL
            </label>
            <input
              id="entry-url"
              type="url"
              className="form-control"
              value={entryDraft.url}
              onChange={(event) => onEntryDraftChange("url", event.target.value)}
              placeholder="https://example.com"
            />
          </div>
        </div>

        <div className="d-flex justify-content-between align-items-center">
          <span className="text-body-secondary">Stored placeholders: {entries.length}</span>
          <button type="button" className="btn btn-outline-primary" onClick={onAddEntry}>
            Add entry
          </button>
        </div>
      </div>
    </div>
  );
}
