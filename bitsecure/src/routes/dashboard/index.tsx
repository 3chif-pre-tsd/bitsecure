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
    <div className="space-y-6">
      <section className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">Dashboard</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
            Password entries
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Browse saved entries, open details, or add a new one.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-700">
            <span className="font-semibold text-slate-950">{vault.entries.length}</span>
            <span>Total</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-700">
            <span className="font-semibold text-slate-950">{vault.visibleEntries.length}</span>
            <span>Shown</span>
          </div>
          <Link to="/dashboard/new">
            <Button>
              <Icon name="plus" className="size-4" />
              Create entry
            </Button>
          </Link>
        </div>
      </section>

      {vault.vaultFeedback ? (
        <FeedbackMessage status={vault.vaultFeedback.status} message={vault.vaultFeedback.message} />
      ) : null}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-slate-950">Entry list</h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Search and open saved credentials.
            </p>
          </div>

          <Link to="/dashboard/new">
            <Button>
              <Icon name="plus" className="size-4" />
              New entry
            </Button>
          </Link>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_220px_220px]">
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

        <div className="mt-6 overflow-hidden rounded-xl border border-slate-200">
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
                        <span className="rounded-full bg-slate-900 px-2.5 py-1 text-xs font-semibold text-white">
                          Open
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

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm leading-6 text-slate-600">
          Open an entry to view its full details or use the create page to add a new one.
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
