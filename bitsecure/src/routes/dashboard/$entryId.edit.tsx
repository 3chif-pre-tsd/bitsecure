import { Link, Navigate, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import Button from "../../components/ui/Button";
import FeedbackMessage from "../../components/ui/FeedbackMessage";
import { InputField, TextareaField } from "../../components/ui/Field";
import Icon from "../../components/ui/Icon";
import { useAppState } from "../../state/AppStateContext";

function EditEntryPage() {
  const navigate = useNavigate();
  const { entryId } = Route.useParams();
  const { vault } = useAppState();
  const entry = vault.entries.find((currentEntry) => currentEntry.id === entryId) ?? null;

  useEffect(() => {
    if (entry) {
      vault.editEntry(entry);
    }

    return () => {
      vault.cancelEdit();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entryId, entry]);

  if (!vault.isLoadingEntries && !entry) {
    return <Navigate to="/dashboard" />;
  }

  async function handleSubmit() {
    const savedEntryId = await vault.saveEntry();

    if (savedEntryId) {
      await navigate({
        to: "/dashboard/$entryId",
        params: {
          entryId: savedEntryId,
        },
      });
    }
  }

  return (
    <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_320px]">
      <section className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.35)] sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Link
              to="/dashboard/$entryId"
              params={{ entryId }}
              className="text-sm font-semibold text-cyan-700 hover:text-cyan-800"
            >
              Back to entry
            </Link>
            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700">
              Edit entry
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
              Update {entry?.title ?? "entry"}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              Edit the stored credential on a dedicated page so field validation, generated passwords, and save actions stay grouped clearly.
            </p>
          </div>
        </div>

        <form
          className="mt-8 space-y-8"
          onSubmit={(event) => {
            event.preventDefault();
            void handleSubmit();
          }}
          noValidate
        >
          {vault.entryErrors.form ? (
            <FeedbackMessage status="error" message={vault.entryErrors.form} />
          ) : null}

          {vault.vaultFeedback?.status === "error" ? (
            <FeedbackMessage status="error" message={vault.vaultFeedback.message} />
          ) : null}

          <section className="grid gap-6 rounded-[28px] border border-slate-200 bg-slate-50 p-5 sm:p-6">
            <div>
              <h2 className="text-lg font-semibold text-slate-950">Credential basics</h2>
              <p className="mt-1 text-sm text-slate-600">
                Update the primary fields first, then revise optional details below.
              </p>
            </div>

            <InputField
              id="entry-title"
              label="Title"
              required
              aria-required="true"
              value={vault.entryDraft.title}
              onChange={(event) => vault.updateEntryDraft("title", event.target.value)}
              placeholder="GitHub"
              error={vault.entryErrors.title}
            />

            <div className="grid gap-4 sm:grid-cols-2">
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
              <div className="space-y-3">
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
                <Button
                  variant="secondary"
                  className="w-full sm:w-auto"
                  onClick={vault.generatePassword}
                >
                  <Icon name="plus" className="size-4" />
                  Generate random password
                </Button>
              </div>
            </div>
          </section>

          <section className="grid gap-6 rounded-[28px] border border-slate-200 bg-white p-5 sm:p-6">
            <div>
              <h2 className="text-lg font-semibold text-slate-950">Additional details</h2>
              <p className="mt-1 text-sm text-slate-600">
                Keep the supporting context accurate for easier recognition later.
              </p>
            </div>

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
            />
          </section>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Link to="/dashboard/$entryId" params={{ entryId }}>
              <Button variant="secondary" disabled={vault.isSavingEntry}>
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={vault.isSavingEntry}>
              <Icon name="edit" className="size-4" />
              {vault.isSavingEntry ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </form>
      </section>

      <aside className="space-y-6">
        <section className="rounded-[30px] border border-slate-200 bg-slate-950 p-6 text-white shadow-[0_24px_80px_-40px_rgba(15,23,42,0.85)]">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200">
            Edit workflow
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight">Dedicated update screen</h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Editing happens outside the list and detail view, which keeps accidental changes easier to avoid.
          </p>
        </section>

        <section className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.35)]">
          <p className="text-sm font-semibold text-slate-950">Current entry</p>
          <p className="mt-4 text-sm leading-6 text-slate-600">
            {entry?.title
              ? `You are editing the record for ${entry.title}.`
              : "The selected entry is still loading."}
          </p>
        </section>
      </aside>
    </div>
  );
}

export const Route = createFileRoute("/dashboard/$entryId/edit")({
  component: EditEntryPage,
});
