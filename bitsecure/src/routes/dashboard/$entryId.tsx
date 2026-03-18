import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import Button from "../../components/ui/Button";
import FeedbackMessage from "../../components/ui/FeedbackMessage";
import Icon from "../../components/ui/Icon";
import { useAppState } from "../../state/AppStateContext";
import { copyTextToClipboard } from "../../utils/clipboard";

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("de-AT", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function EntryDetailPage() {
  const navigate = useNavigate();
  const { entryId } = Route.useParams();
  const { vault } = useAppState();
  const entry = vault.entries.find((currentEntry) => currentEntry.id === entryId) ?? null;
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [copyState, setCopyState] = useState<"idle" | "success" | "error">("idle");

  useEffect(() => {
    setIsPasswordVisible(false);
    setCopyState("idle");
  }, [entryId]);

  async function handleDelete() {
    if (!entry) {
      return;
    }

    if (!window.confirm(`Delete "${entry.title}" from the vault?`)) {
      return;
    }

    await vault.removeEntry(entry.id);
    await navigate({ to: "/dashboard" });
  }

  async function handleCopyPassword() {
    if (!entry) {
      return;
    }

    try {
      await copyTextToClipboard(entry.password);
      setCopyState("success");
    } catch {
      setCopyState("error");
    }
  }

  if (!vault.isLoadingEntries && !entry) {
    return (
      <section className="rounded-[30px] border border-slate-200 bg-white p-8 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.35)]">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700">
          Entry details
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
          This entry is no longer available.
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">
          The selected record could not be found in the local vault. Return to the dashboard to choose another entry.
        </p>
        <div className="mt-6">
          <Link to="/dashboard">
            <Button>Back to dashboard</Button>
          </Link>
        </div>
      </section>
    );
  }

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-5 rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.35)] sm:flex-row sm:items-start sm:justify-between sm:p-8">
        <div>
          <Link to="/dashboard" className="text-sm font-semibold text-cyan-700 hover:text-cyan-800">
            Back to dashboard
          </Link>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700">
            Entry details
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
            {entry?.title ?? "Loading entry"}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
            Review the full record here, then edit or delete it from a dedicated action area instead of a crowded dashboard column.
          </p>
        </div>

        {entry ? (
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link to="/dashboard/$entryId/edit" params={{ entryId: entry.id }}>
              <Button>
                <Icon name="edit" className="size-4" />
                Edit entry
              </Button>
            </Link>
            <Button variant="danger" onClick={() => void handleDelete()} disabled={vault.isSavingEntry}>
              <Icon name="trash" className="size-4" />
              Delete entry
            </Button>
          </div>
        ) : null}
      </section>

      {vault.vaultFeedback ? (
        <FeedbackMessage status={vault.vaultFeedback.status} message={vault.vaultFeedback.message} />
      ) : null}

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_320px]">
        <section className="space-y-6 rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.35)] sm:p-8">
          <div className="grid gap-6 rounded-[28px] border border-slate-200 bg-slate-50 p-5 sm:grid-cols-[180px_minmax(0,1fr)] sm:items-start">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Username</p>
            <p className="break-all text-lg font-semibold text-slate-950">{entry?.username}</p>
          </div>

          <div className="grid gap-4 rounded-[28px] border border-slate-200 bg-slate-50 p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                  Password
                </p>
                <p className="mt-2 break-all font-mono text-lg tracking-[0.18em] text-slate-950">
                  {isPasswordVisible ? entry?.password : "************"}
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
          </div>

          <dl className="overflow-hidden rounded-[28px] border border-slate-200">
            <div className="grid gap-3 border-b border-slate-200 bg-white px-5 py-4 sm:grid-cols-[180px_minmax(0,1fr)] sm:items-start">
              <dt className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">URL</dt>
              <dd className="break-all text-sm leading-6 text-slate-700">
                {entry?.url ? (
                  <a
                    href={entry.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 font-semibold text-cyan-700 underline decoration-cyan-200 underline-offset-4"
                  >
                    <Icon name="link" className="size-4" />
                    {entry.url}
                  </a>
                ) : (
                  "No URL"
                )}
              </dd>
            </div>
            <div className="grid gap-3 border-b border-slate-200 bg-white px-5 py-4 sm:grid-cols-[180px_minmax(0,1fr)] sm:items-start">
              <dt className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                Notes
              </dt>
              <dd className="text-sm leading-6 text-slate-700">{entry?.notes || "No notes"}</dd>
            </div>
            <div className="grid gap-3 border-b border-slate-200 bg-white px-5 py-4 sm:grid-cols-[180px_minmax(0,1fr)] sm:items-start">
              <dt className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                Created
              </dt>
              <dd className="text-sm leading-6 text-slate-700">
                {entry ? formatDateTime(entry.createdAt) : ""}
              </dd>
            </div>
            <div className="grid gap-3 bg-white px-5 py-4 sm:grid-cols-[180px_minmax(0,1fr)] sm:items-start">
              <dt className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                Updated
              </dt>
              <dd className="text-sm leading-6 text-slate-700">
                {entry ? formatDateTime(entry.updatedAt) : ""}
              </dd>
            </div>
          </dl>
        </section>

        <aside className="space-y-6">
          <section className="rounded-[30px] border border-slate-200 bg-slate-950 p-6 text-white shadow-[0_24px_80px_-40px_rgba(15,23,42,0.85)]">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200">
              Action area
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight">Focused record review</h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Sensitive actions stay next to the selected entry only, so the dashboard remains dedicated to browsing.
            </p>
          </section>

          <section className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.35)]">
            <p className="text-sm font-semibold text-slate-950">Current status</p>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              {entry?.url || entry?.notes
                ? "This record includes extra context for faster recognition."
                : "This record only stores the essential credentials."}
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/dashboard/$entryId")({
  component: EntryDetailPage,
});
