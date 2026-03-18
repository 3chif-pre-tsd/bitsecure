import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import Button from "../../components/ui/Button";
import FeedbackMessage from "../../components/ui/FeedbackMessage";
import { InputField, TextareaField } from "../../components/ui/Field";
import Icon from "../../components/ui/Icon";
import { useAppState } from "../../state/AppStateContext";

function CreateEntryPage() {
  const navigate = useNavigate();
  const { vault } = useAppState();

  useEffect(() => {
    vault.cancelEdit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700">
              Create entry
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
              Add a new credential record
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              Keep required fields together, add optional context below, and save the encrypted entry into the local vault.
            </p>
          </div>

          <Link to="/dashboard">
            <Button variant="secondary">Back to dashboard</Button>
          </Link>
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
                Required fields are grouped here for faster entry creation.
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
                Store the URL and any notes that help identify this credential later.
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
            <Link to="/dashboard">
              <Button variant="secondary" disabled={vault.isSavingEntry}>
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={vault.isSavingEntry}>
              <Icon name="plus" className="size-4" />
              {vault.isSavingEntry ? "Saving..." : "Save entry"}
            </Button>
          </div>
        </form>
      </section>

      <aside className="space-y-6">
        <section className="rounded-[30px] border border-slate-200 bg-slate-950 p-6 text-white shadow-[0_24px_80px_-40px_rgba(15,23,42,0.85)]">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200">
            Form guidance
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight">One page, one responsibility</h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            This screen is dedicated to creating a single vault entry, so validation feedback and save actions stay easy to scan.
          </p>
        </section>

        <section className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.35)]">
          <p className="text-sm font-semibold text-slate-950">Required fields</p>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
            <li>Title identifies the service or account.</li>
            <li>Username and password are required for encrypted storage.</li>
            <li>URL and notes stay optional and can be added later.</li>
          </ul>
        </section>
      </aside>
    </div>
  );
}

export const Route = createFileRoute("/dashboard/new")({
  component: CreateEntryPage,
});
