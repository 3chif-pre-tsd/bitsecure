import type { UserProfile } from "../models/auth";
import type { PasswordEntry, PasswordEntryInput } from "../models/passwordEntry";

interface DashboardProps {
  user: UserProfile;
  entries: PasswordEntry[];
  entryDraft: PasswordEntryInput;
  onEntryDraftChange: (field: keyof PasswordEntryInput, value: string) => void;
  onAddEntry: () => void;
}

const maskedPassword = "••••••••";

export default function Dashboard({
  user,
  entries,
  entryDraft,
  onEntryDraftChange,
  onAddEntry,
}: DashboardProps) {
  return (
    <main className="dashboard-shell">
      <section className="panel hero-panel">
        <div>
          <span className="eyebrow">Dashboard</span>
          <h1>{user.displayName}</h1>
          <p>
            BitSecure Sprint 1 provides the first vault structure, a master password
            entry point, and the base for storing password items.
          </p>
        </div>

        <div className="hero-metrics">
          <article>
            <span>Role</span>
            <strong>{user.role}</strong>
          </article>
          <article>
            <span>Email</span>
            <strong>{user.email}</strong>
          </article>
          <article>
            <span>Entries</span>
            <strong>{entries.length}</strong>
          </article>
        </div>
      </section>

      <section className="dashboard-grid">
        <article className="panel">
          <div className="panel-heading">
            <span className="eyebrow">Vault</span>
            <h2>Password entries</h2>
            <p>The list structure is ready for future encrypted entry management.</p>
          </div>

          <div className="entry-list">
            {entries.length === 0 ? (
              <div className="empty-state">
                <strong>No entries yet</strong>
                <p>Add your first password entry to populate the dashboard list.</p>
              </div>
            ) : (
              entries.map((entry) => (
                <article key={entry.id} className="entry-card">
                  <div>
                    <h3>{entry.title}</h3>
                    <p>{entry.url || "No URL provided"}</p>
                  </div>
                  <dl>
                    <div>
                      <dt>Username</dt>
                      <dd>{entry.username}</dd>
                    </div>
                    <div>
                      <dt>Password</dt>
                      <dd>{maskedPassword}</dd>
                    </div>
                  </dl>
                </article>
              ))
            )}
          </div>
        </article>

        <article className="panel">
          <div className="panel-heading">
            <span className="eyebrow">Preparation</span>
            <h2>Add entry</h2>
            <p>The UI is minimal, but the entry logic is active and stored locally.</p>
          </div>

          <div className="entry-form">
            <label className="field">
              <span>Title</span>
              <input
                type="text"
                value={entryDraft.title}
                onChange={(event) => onEntryDraftChange("title", event.target.value)}
                placeholder="GitHub"
              />
            </label>

            <label className="field">
              <span>Username</span>
              <input
                type="text"
                value={entryDraft.username}
                onChange={(event) => onEntryDraftChange("username", event.target.value)}
                placeholder="octocat"
              />
            </label>

            <label className="field">
              <span>Password</span>
              <input
                type="password"
                value={entryDraft.password}
                onChange={(event) => onEntryDraftChange("password", event.target.value)}
                placeholder="Vault item password"
              />
            </label>

            <label className="field">
              <span>URL</span>
              <input
                type="url"
                value={entryDraft.url}
                onChange={(event) => onEntryDraftChange("url", event.target.value)}
                placeholder="https://github.com"
              />
            </label>

            <button type="button" className="secondary-button" onClick={onAddEntry}>
              Add entry
            </button>
          </div>
        </article>
      </section>
    </main>
  );
}
