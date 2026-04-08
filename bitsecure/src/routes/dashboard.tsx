import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import ResetPasswordPanel from "../components/auth/ResetPasswordPanel";
import Button from "../components/ui/Button";
import FeedbackMessage from "../components/ui/FeedbackMessage";
import { InputField, SelectField, TextareaField } from "../components/ui/Field";
import Icon from "../components/ui/Icon";
import type {
  PasswordEntry,
  PasswordEntryFilterOption,
  PasswordEntrySortOption,
} from "../models/passwordEntry";
import { useAppState } from "../state/AppStateContext";
import { copyTextToClipboard } from "../utils/clipboard";
import { mergeClasses } from "../utils/mergeClasses";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("de-AT", {
    dateStyle: "medium",
  }).format(new Date(value));
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("de-AT", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function WorkspacePanel({
  eyebrow,
  title,
  description,
  action,
  className,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section className={mergeClasses("rounded-2xl border border-slate-200 bg-white", className)}>
      <header className="border-b border-slate-200 px-5 py-4 sm:px-6">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
              {eyebrow}
            </p>
            <h2 className="mt-2 text-lg font-semibold tracking-tight text-slate-950">{title}</h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">{description}</p>
          </div>
          {action}
        </div>
      </header>
      <div>{children}</div>
    </section>
  );
}

function EntryMetaRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="grid gap-2 border-b border-slate-200 px-5 py-4 last:border-b-0 sm:grid-cols-[132px_minmax(0,1fr)] sm:items-start">
      <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</dt>
      <dd className="min-w-0 text-sm leading-6 text-slate-700">{value}</dd>
    </div>
  );
}

function EntryListItem({
  entry,
  isSelected,
  onSelect,
}: {
  entry: PasswordEntry;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={mergeClasses(
        "grid w-full gap-2 border-b border-slate-200 px-5 py-4 text-left transition-colors last:border-b-0 hover:bg-slate-50 focus-visible:bg-slate-50 focus-visible:outline-none",
        isSelected && "border-l-2 border-l-slate-900 bg-slate-100 text-slate-950 hover:bg-slate-100 focus-visible:bg-slate-100",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{entry.title}</p>
          <p
            className={mergeClasses(
              "mt-1 truncate text-sm",
              isSelected ? "text-slate-600" : "text-slate-500",
            )}
          >
            {entry.username}
          </p>
        </div>
        <span className="text-xs text-slate-500">{formatDate(entry.updatedAt)}</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {entry.url ? (
          <span
            className={mergeClasses(
              "rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600",
              isSelected && "bg-white text-slate-700",
            )}
          >
            URL
          </span>
        ) : null}
        {entry.notes ? (
          <span
            className={mergeClasses(
              "rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600",
              isSelected && "bg-white text-slate-700",
            )}
          >
            Notes
          </span>
        ) : null}
      </div>
    </button>
  );
}

function DashboardPage() {
  const { auth, vault } = useAppState();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [copyState, setCopyState] = useState<"idle" | "success" | "error">("idle");
  const titleInputRef = useRef<HTMLInputElement | null>(null);
  const selectedEntry = vault.selectedEntry;
  const isEditing = vault.workspaceMode === "edit";
  const isCreating = vault.workspaceMode === "create";
  const isViewing = vault.workspaceMode === "view";
  const isIdle = vault.workspaceMode === "idle";
  const isFormMode = isCreating || isEditing;

  useEffect(() => {
    setIsPasswordVisible(false);
    setCopyState("idle");
  }, [selectedEntry?.id, vault.workspaceMode]);

  useEffect(() => {
    if (isFormMode) {
      titleInputRef.current?.focus();
    }
  }, [isFormMode]);

  async function handleSaveEntry() {
    await vault.saveEntry();
  }

  async function handleDeleteEntry() {
    if (!selectedEntry) {
      return;
    }

    if (!window.confirm(`Delete "${selectedEntry.title}" from the vault?`)) {
      return;
    }

    await vault.removeEntry(selectedEntry.id);
  }

  async function handleCopyPassword() {
    if (!selectedEntry) {
      return;
    }

    try {
      await copyTextToClipboard(selectedEntry.password);
      setCopyState("success");
    } catch {
      setCopyState("error");
    }
  }

  return (
    <div className="space-y-4">
      {vault.vaultFeedback ? (
        <FeedbackMessage
          status={vault.vaultFeedback.status}
          message={vault.vaultFeedback.message}
        />
      ) : null}

      <div className="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
        <WorkspacePanel
          className="bg-slate-50/70"
          eyebrow="Entries"
          title="Entry list"
          description={`${vault.visibleEntries.length} visible of ${vault.entries.length} entries.`}
          action={
            <Button
              variant={isCreating ? "secondary" : "primary"}
              onClick={() => vault.startCreateEntry()}
            >
              <Icon name="plus" className="size-4" />
              New entry
            </Button>
          }
        >
          <div className="space-y-4 border-b border-slate-200 px-5 py-4 sm:px-6">
            <InputField
              id="entry-search"
              label="Search entries"
              placeholder="Search title, username, URL or notes"
              value={vault.searchQuery}
              onChange={(event) => vault.setSearchQuery(event.target.value)}
            />

            <div className="grid gap-4">
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
          </div>

          <div className="max-h-[32rem] overflow-y-auto">
            {vault.isLoadingEntries ? (
              <div className="px-5 py-12 text-center text-sm text-slate-500">
                Loading encrypted entries...
              </div>
            ) : vault.visibleEntries.length > 0 ? (
              <div>
                {vault.visibleEntries.map((entry) => (
                  <EntryListItem
                    key={entry.id}
                    entry={entry}
                    isSelected={selectedEntry?.id === entry.id}
                    onSelect={() => vault.selectEntry(entry.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="px-5 py-12 text-center text-sm leading-6 text-slate-500">
                No entries match the current search and filter combination.
              </div>
            )}
          </div>
        </WorkspacePanel>

        <WorkspacePanel
          className="min-w-0"
          eyebrow={
            isEditing ? "Edit mode" : isCreating ? "Create mode" : isViewing ? "View mode" : "Idle"
          }
          title={
            isViewing && selectedEntry
              ? selectedEntry.title
              : isEditing
                ? "Edit credential"
                : isCreating
                  ? "Add new credential"
                  : "Entry details"
          }
          description={
            isViewing && selectedEntry
              ? "View and manage the selected credential."
              : isEditing
                ? "Update the selected credential below."
                : isCreating
                  ? "Enter the details for a new credential."
                  : "Select an entry from the list or start a new one."
          }
          action={
            isViewing && selectedEntry ? (
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="secondary"
                  onClick={() => vault.editEntry(selectedEntry)}
                  disabled={vault.isSavingEntry}
                >
                  <Icon name="edit" className="size-4" />
                  Edit
                </Button>
                <Button
                  variant="danger"
                  onClick={() => void handleDeleteEntry()}
                  disabled={vault.isSavingEntry}
                >
                  <Icon name="trash" className="size-4" />
                  Delete
                </Button>
              </div>
            ) : null
          }
        >
          {isViewing && selectedEntry ? (
            <div className="space-y-5 px-5 py-4 sm:px-6">
              <section className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                      Password
                    </p>
                    <p className="mt-2 break-all font-mono text-lg tracking-[0.18em] text-slate-950">
                      {isPasswordVisible ? selectedEntry.password : "************"}
                    </p>
                    {copyState === "success" ? (
                      <p className="mt-2 text-xs font-semibold text-emerald-600">
                        Password copied to clipboard.
                      </p>
                    ) : null}
                    {copyState === "error" ? (
                      <p className="mt-2 text-xs font-semibold text-rose-600">
                        Password could not be copied.
                      </p>
                    ) : null}
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Button
                      variant="secondary"
                      onClick={() => setIsPasswordVisible((currentValue) => !currentValue)}
                    >
                      <Icon name={isPasswordVisible ? "eyeOff" : "eye"} className="size-4" />
                      {isPasswordVisible ? "Hide" : "Show"}
                    </Button>
                    <Button variant="secondary" onClick={() => void handleCopyPassword()}>
                      <Icon name="copy" className="size-4" />
                      Copy password
                    </Button>
                  </div>
                </div>
              </section>

              <dl className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <EntryMetaRow label="Username" value={selectedEntry.username} />
                <EntryMetaRow
                  label="URL"
                  value={
                    selectedEntry.url ? (
                      <a
                        href={selectedEntry.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 font-medium text-slate-700 underline decoration-slate-300 underline-offset-4"
                      >
                        <Icon name="link" className="size-4" />
                        {selectedEntry.url}
                      </a>
                    ) : (
                      "No URL"
                    )
                  }
                />
                <EntryMetaRow label="Notes" value={selectedEntry.notes || "No notes"} />
                <EntryMetaRow label="Created" value={formatDateTime(selectedEntry.createdAt)} />
                <EntryMetaRow label="Updated" value={formatDateTime(selectedEntry.updatedAt)} />
              </dl>
            </div>
          ) : isFormMode ? (
            <div className="px-5 py-4 sm:px-6">
              <form
                className="space-y-6"
                onSubmit={(event) => {
                  event.preventDefault();
                  void handleSaveEntry();
                }}
                noValidate
              >
                {vault.entryErrors.form ? (
                  <FeedbackMessage status="error" message={vault.entryErrors.form} />
                ) : null}

                {vault.vaultFeedback?.status === "error" ? (
                  <FeedbackMessage status="error" message={vault.vaultFeedback.message} />
                ) : null}

                <section className="grid gap-5 rounded-xl border border-slate-200 bg-white p-5">
                  <InputField
                    id="entry-title"
                    ref={titleInputRef}
                    label="Title"
                    required
                    aria-required="true"
                    value={vault.entryDraft.title}
                    onChange={(event) => vault.updateEntryDraft("title", event.target.value)}
                    placeholder="GitHub"
                    error={vault.entryErrors.title}
                  />

                  <InputField
                    id="entry-username"
                    label="Username"
                    required
                    aria-required="true"
                    value={vault.entryDraft.username}
                    onChange={(event) => vault.updateEntryDraft("username", event.target.value)}
                    placeholder="octocat"
                    error={vault.entryErrors.username}
                  />

                  <InputField
                    id="entry-password"
                    type="text"
                    label="Password"
                    required
                    aria-required="true"
                    value={vault.entryDraft.password}
                    onChange={(event) => vault.updateEntryDraft("password", event.target.value)}
                    placeholder="Password"
                    error={vault.entryErrors.password}
                    hint="Generate a strong random password when needed."
                  />

                  <Button variant="secondary" className="w-full sm:w-fit" onClick={vault.generatePassword}>
                    <Icon name="plus" className="size-4" />
                    Generate random password
                  </Button>

                  <InputField
                    id="entry-url"
                    type="url"
                    label="URL"
                    optional
                    value={vault.entryDraft.url}
                    onChange={(event) => vault.updateEntryDraft("url", event.target.value)}
                    placeholder="https://example.com"
                    error={vault.entryErrors.url}
                  />

                  <TextareaField
                    id="entry-notes"
                    label="Notes"
                    optional
                    value={vault.entryDraft.notes}
                    onChange={(event) => vault.updateEntryDraft("notes", event.target.value)}
                    placeholder="Optional notes"
                    className="min-h-32"
                  />
                </section>

                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  <Button
                    variant="secondary"
                    onClick={() => vault.cancelEdit()}
                    disabled={vault.isSavingEntry}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={vault.isSavingEntry}>
                    <Icon name={isEditing ? "edit" : "plus"} className="size-4" />
                    {vault.isSavingEntry
                      ? "Saving..."
                      : isEditing
                        ? "Save changes"
                        : "Save entry"}
                  </Button>
                </div>
              </form>
            </div>
          ) : (
            <div className="px-5 py-10 sm:px-6">
              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-sm leading-6 text-slate-500">
                {isIdle
                  ? "No entry is selected. Choose one from the list or start a new entry."
                  : "Select an entry from the list to view its details."}
              </div>
            </div>
          )}
        </WorkspacePanel>
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
    </div>
  );
}

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
});
