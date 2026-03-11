import type { UserProfile } from "../models/auth";
import type { PasswordEntry, PasswordEntryInput } from "../models/passwordEntry";
import EntryPlaceholder from "./EntryPlaceholder";

interface DashboardProps {
  user: UserProfile;
  entries: PasswordEntry[];
  entryDraft: PasswordEntryInput;
  onEntryDraftChange: (field: keyof PasswordEntryInput, value: string) => void;
  onAddEntry: () => void;
}

export default function Dashboard({
  user,
  entries,
  entryDraft,
  onEntryDraftChange,
  onAddEntry,
}: DashboardProps) {
  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary border-bottom">
        <div className="container">
          <span className="navbar-brand">BitSecure</span>
          <div className="navbar-nav">
            <span className="nav-link active">Dashboard</span>
            <span className="nav-link">Entries</span>
            <span className="nav-link">Settings</span>
          </div>
        </div>
      </nav>

      <main className="container py-4">
        <div className="row g-4">
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <h1 className="h3 card-title mb-3">Dashboard</h1>
                <p className="card-text text-body-secondary">
                  This page contains the initial dashboard layout and placeholder navigation.
                </p>
                <div className="row g-3">
                  <div className="col-12 col-md-4">
                    <div className="border rounded p-3 h-100">
                      <h2 className="h6">User</h2>
                      <p className="mb-1">{user.displayName}</p>
                      <p className="mb-1 text-body-secondary">{user.email}</p>
                      <p className="mb-0 text-body-secondary">{user.role}</p>
                    </div>
                  </div>
                  <div className="col-12 col-md-4">
                    <div className="border rounded p-3 h-100">
                      <h2 className="h6">Status</h2>
                      <p className="mb-0 text-body-secondary">Authenticated and ready for future features.</p>
                    </div>
                  </div>
                  <div className="col-12 col-md-4">
                    <div className="border rounded p-3 h-100">
                      <h2 className="h6">Entries</h2>
                      <p className="mb-0 text-body-secondary">{entries.length} placeholder entries stored.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-6">
            <div className="card h-100">
              <div className="card-body">
                <h2 className="h5 card-title">Navigation structure</h2>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item px-0">Dashboard overview</li>
                  <li className="list-group-item px-0">Entries placeholder</li>
                  <li className="list-group-item px-0">Settings placeholder</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-6">
            <EntryPlaceholder
              entries={entries}
              entryDraft={entryDraft}
              onEntryDraftChange={onEntryDraftChange}
              onAddEntry={onAddEntry}
            />
          </div>
        </div>
      </main>
    </>
  );
}
