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
  selectedEntry: PasswordEntry | null;
  entryDraft: PasswordEntryInput;
  entryErrors: PasswordEntryValidationErrors;
  editingEntryId: string | null;
  isSavingEntry: boolean;
  onEntryDraftChange: (field: keyof PasswordEntryInput, value: string) => void;
  onSaveEntry: () => void;
  onSelectEntry: (entryId: string) => void;
  onEditEntry: (entry: PasswordEntry) => void;
  onCancelEdit: () => void;
  onDeleteEntry: (entryId: string) => void;
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
  selectedEntry,
  entryDraft,
  entryErrors,
  editingEntryId,
  isSavingEntry,
  onEntryDraftChange,
  onSaveEntry,
  onSelectEntry,
  onEditEntry,
  onCancelEdit,
  onDeleteEntry,
  onLogout,
}: DashboardProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary border-bottom">
        <div className="container">
          <span className="navbar-brand">BitSecure</span>
          <div className="d-flex align-items-center gap-3">
            <div className="text-end">
              <div className="fw-semibold">{user.displayName}</div>
              <div className="small text-body-secondary">{user.email}</div>
            </div>
            <button type="button" className="btn btn-outline-secondary btn-sm" onClick={onLogout}>
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="container py-4">
        <div className="row g-4 mb-4">
          <div className="col-12 col-md-4">
            <div className="card h-100">
              <div className="card-body">
                <h1 className="h4 card-title mb-3">Dashboard</h1>
                <p className="text-body-secondary mb-0">
                  Manage encrypted password entries with filtering, editing, and secure
                  visibility controls.
                </p>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div className="card h-100">
              <div className="card-body">
                <h2 className="h6 text-uppercase text-body-secondary">Stored entries</h2>
                <p className="display-6 mb-0">{entries.length}</p>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div className="card h-100">
              <div className="card-body">
                <h2 className="h6 text-uppercase text-body-secondary">Selected entry</h2>
                <p className="display-6 mb-0">{selectedEntry ? 1 : 0}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="row g-4">
          <div className="col-12 col-xl-4">
            <div className="card h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h2 className="h5 card-title mb-0">Entries</h2>
                  <span className="badge text-bg-light">{entries.length}</span>
                </div>

                <div className="list-group">
                  {entries.length > 0 ? (
                    entries.map((entry) => (
                      <button
                        key={entry.id}
                        type="button"
                        className={`list-group-item list-group-item-action${
                          selectedEntry?.id === entry.id ? " active" : ""
                        }`}
                        onClick={() => {
                          onSelectEntry(entry.id);
                          setIsPasswordVisible(false);
                        }}
                      >
                        <div className="d-flex w-100 justify-content-between">
                          <span className="fw-semibold">{entry.title}</span>
                          <small>{entry.username}</small>
                        </div>
                        <small className={selectedEntry?.id === entry.id ? "text-white-50" : "text-body-secondary"}>
                          {entry.url || "No URL"}
                        </small>
                      </button>
                    ))
                  ) : (
                    <div className="border rounded p-3 text-body-secondary">
                      No entries have been stored yet.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-xl-4">
            <div className="card h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <h2 className="h5 card-title mb-1">Entry details</h2>
                    <p className="text-body-secondary mb-0">Open an entry to inspect its data.</p>
                  </div>
                </div>

                {selectedEntry ? (
                  <>
                    <div className="mb-3">
                      <h3 className="h4 mb-1">{selectedEntry.title}</h3>
                      <p className="text-body-secondary mb-0">{selectedEntry.username}</p>
                    </div>

                    <dl className="row mb-4">
                      <dt className="col-sm-4">Username</dt>
                      <dd className="col-sm-8">{selectedEntry.username}</dd>

                      <dt className="col-sm-4">Password</dt>
                      <dd className="col-sm-8">
                        <div className="d-flex gap-2 align-items-center">
                          <code>{isPasswordVisible ? selectedEntry.password : "••••••••••••"}</code>
                          <button
                            type="button"
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => setIsPasswordVisible((currentValue) => !currentValue)}
                          >
                            {isPasswordVisible ? "Hide" : "Show"}
                          </button>
                        </div>
                      </dd>

                      <dt className="col-sm-4">URL</dt>
                      <dd className="col-sm-8">
                        {selectedEntry.url ? (
                          <a href={selectedEntry.url} target="_blank" rel="noreferrer">
                            {selectedEntry.url}
                          </a>
                        ) : (
                          "No URL"
                        )}
                      </dd>

                      <dt className="col-sm-4">Notes</dt>
                      <dd className="col-sm-8">{selectedEntry.notes || "No notes"}</dd>

                      <dt className="col-sm-4">Created</dt>
                      <dd className="col-sm-8">{formatDateTime(selectedEntry.createdAt)}</dd>

                      <dt className="col-sm-4">Updated</dt>
                      <dd className="col-sm-8">{formatDateTime(selectedEntry.updatedAt)}</dd>
                    </dl>

                    <div className="d-flex gap-2">
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => onEditEntry(selectedEntry)}
                      >
                        Edit entry
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-danger"
                        onClick={() => onDeleteEntry(selectedEntry.id)}
                        disabled={isSavingEntry}
                      >
                        Delete entry
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="border rounded p-3 text-body-secondary">
                    Select an entry from the list to open it.
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="col-12 col-xl-4">
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
    </>
  );
}
