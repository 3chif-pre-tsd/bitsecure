import { Link, createFileRoute } from "@tanstack/react-router";
import ResetPasswordPanel from "../../components/auth/ResetPasswordPanel";
import Button from "../../components/ui/Button";
import FeedbackMessage from "../../components/ui/FeedbackMessage";
import { InputField, SelectField } from "../../components/ui/Field";
import Icon from "../../components/ui/Icon";
import type {
  PasswordEntryFilterOption,
  PasswordEntrySortOption,
} from "../../models/passwordEntry";
import { useAppState } from "../../state/AppStateContext";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("de-AT", {
    dateStyle: "medium",
  }).format(new Date(value));
}

function DashboardPage() {
  const { auth, vault } = useAppState();

  return (
    <div className="space-y-8">
      <section className="grid gap-6 rounded-[32px] bg-slate-950 px-6 py-8 text-white shadow-[0_32px_100px_-45px_rgba(15,23,42,0.85)] sm:px-8 lg:grid-cols-[1.3fr_0.7fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200">
            Vault overview
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            Manage your local credentials with clearer separation between browsing, reviewing, and editing.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
            The dashboard focuses on the entry list and account controls. Open any entry for details or jump straight to a dedicated form when you need to create or edit.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/dashboard/new">
              <Button className="bg-white text-slate-950 hover:bg-slate-100 focus-visible:ring-white/40">
                <Icon name="plus" className="size-4" />
                Create entry
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Stored entries</p>
            <p className="mt-3 text-3xl font-semibold text-white">{vault.entries.length}</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Visible now</p>
            <p className="mt-3 text-3xl font-semibold text-white">{vault.visibleEntries.length}</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Vault status</p>
            <p className="mt-3 text-lg font-semibold text-emerald-300">
              {vault.isLoadingEntries ? "Refreshing" : "Ready"}
            </p>
          </div>
        </div>
      </section>

      {vault.vaultFeedback ? (
        <FeedbackMessage status={vault.vaultFeedback.status} message={vault.vaultFeedback.message} />
      ) : null}

      <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.35)] sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700">
              Entry list
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
              Browse and open stored credentials
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Search the vault, narrow the results, and open a record from a structured list instead of a stacked dashboard column.
            </p>
          </div>

          <Link to="/dashboard/new">
            <Button>
              <Icon name="plus" className="size-4" />
              New entry
            </Button>
          </Link>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_220px_220px]">
          <InputField
            id="entry-search"
            label="Search entries"
            placeholder="Search title, username, URL or notes"
            value={vault.searchQuery}
            onChange={(event) => vault.setSearchQuery(event.target.value)}
          />
          <SelectField
            id="entry-filter"
            label="Filter"
            value={vault.filterOption}
            onChange={(event) =>
              vault.setFilterOption(event.target.value as PasswordEntryFilterOption)
            }
          >
            <option value="all">All entries</option>
            <option value="with-url">Only with URL</option>
            <option value="with-notes">Only with notes</option>
          </SelectField>
          <SelectField
            id="entry-sort"
            label="Sort"
            value={vault.sortOption}
            onChange={(event) =>
              vault.setSortOption(event.target.value as PasswordEntrySortOption)
            }
          >
            <option value="updated-desc">Recently updated</option>
            <option value="created-desc">Recently created</option>
            <option value="title-asc">Title A-Z</option>
          </SelectField>
        </div>

        <div className="mt-8 overflow-hidden rounded-[28px] border border-slate-200">
          <div className="hidden grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)_132px] gap-4 border-b border-slate-200 bg-slate-50 px-6 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 md:grid">
            <span>Entry</span>
            <span>Notes and URL</span>
            <span>Updated</span>
          </div>

          {vault.isLoadingEntries ? (
            <div className="px-6 py-12 text-center text-sm text-slate-500">
              Loading encrypted entries...
            </div>
          ) : vault.visibleEntries.length > 0 ? (
            <div className="divide-y divide-slate-200 bg-white">
              {vault.visibleEntries.map((entry) => (
                <Link
                  key={entry.id}
                  to="/dashboard/$entryId"
                  params={{ entryId: entry.id }}
                  className="grid gap-4 px-6 py-5 transition hover:bg-slate-50 focus-visible:bg-slate-50 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)_132px]"
                  onClick={() => {
                    vault.setSelectedEntryId(entry.id);
                  }}
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate text-base font-semibold text-slate-950">{entry.title}</p>
                      {vault.selectedEntry?.id === entry.id ? (
                        <span className="rounded-full bg-cyan-100 px-2.5 py-1 text-xs font-semibold text-cyan-700">
                          Selected
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-1 truncate text-sm text-slate-600">{entry.username}</p>
                  </div>

                  <div className="flex min-w-0 flex-wrap items-center gap-2">
                    {entry.url ? (
                      <span className="rounded-full bg-cyan-50 px-2.5 py-1 text-xs font-semibold text-cyan-700">
                        URL
                      </span>
                    ) : null}
                    {entry.notes ? (
                      <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                        Notes
                      </span>
                    ) : null}
                    <p className="basis-full truncate text-sm text-slate-500">
                      {entry.url || entry.notes || "No URL or notes added."}
                    </p>
                  </div>

                  <div className="text-sm text-slate-500 md:text-right">{formatDate(entry.updatedAt)}</div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="px-6 py-12 text-center text-sm leading-6 text-slate-500">
              No entries match the current search and filter combination.
            </div>
          )}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.35)] sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700">
            Workflow
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
            Keep actions focused
          </h2>
          <div className="mt-6 space-y-4 text-sm leading-6 text-slate-600">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              Open any entry to inspect its details and use password-specific actions without crowding the list.
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              Use the dedicated form page for creating and editing so validation, generated passwords, and notes stay grouped logically.
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              Account-level actions remain available here, separated from everyday credential browsing.
            </div>
          </div>
        </div>

        <ResetPasswordPanel
          currentPassword={auth.resetDraft.currentPassword}
          newPassword={auth.resetDraft.newPassword}
          confirmPassword={auth.resetDraft.confirmPassword}
          currentPasswordError={auth.resetErrors.currentPassword}
          newPasswordError={auth.resetErrors.newPassword}
          confirmPasswordError={auth.resetErrors.confirmPassword}
          isSubmitting={auth.isResettingPassword}
          resetResult={auth.resetResult}
          onChange={auth.updateResetDraft}
          onSubmit={() => {
            void auth.submitResetMasterPassword();
          }}
        />
      </section>
    </div>
  );
}

export const Route = createFileRoute("/dashboard/")({
  component: DashboardPage,
});
