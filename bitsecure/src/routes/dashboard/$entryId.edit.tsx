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
    <div className="mx-auto max-w-4xl">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Link
              to="/dashboard/$entryId"
              params={{ entryId }}
              className="text-sm font-semibold text-slate-600 hover:text-slate-950"
            >
              Back to entry
            </Link>
            <p className="mt-4 text-sm font-medium text-slate-500">Edit entry</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
              Update {entry?.title ?? "entry"}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              Update the saved details and save your changes.
            </p>
          </div>
        </div>

        <form
          className="mt-8 space-y-6"
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

          <section className="grid gap-6 rounded-xl border border-slate-200 bg-slate-50 p-5 sm:p-6">
            <div>
              <h2 className="text-lg font-semibold text-slate-950">Credential basics</h2>
              <p className="mt-1 text-sm text-slate-600">Required fields.</p>
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

          <section className="grid gap-6 rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
            <div>
              <h2 className="text-lg font-semibold text-slate-950">Additional details</h2>
              <p className="mt-1 text-sm text-slate-600">Optional fields.</p>
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
    </div>
  );
}

export const Route = createFileRoute("/dashboard/$entryId/edit")({
  component: EditEntryPage,
});
