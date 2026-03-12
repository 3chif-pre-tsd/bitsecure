import { useEffect, useState } from "react";
import type { PasswordEntry } from "../../models/passwordEntry";
import { copyTextToClipboard } from "../../utils/clipboard";
import Button from "../ui/Button";
import Icon from "../ui/Icon";
import Panel from "../ui/Panel";

interface EntryDetailsPanelProps {
  entry: PasswordEntry | null;
  isPasswordVisible: boolean;
  isSavingEntry: boolean;
  onTogglePasswordVisibility: () => void;
  onEditEntry: (entry: PasswordEntry) => void;
  onDeleteEntry: (entryId: string) => void;
}

function formatDateTime(value: string): string {
  return new Intl.DateTimeFormat("de-AT", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function EntryDetailsPanel({
  entry,
  isPasswordVisible,
  isSavingEntry,
  onTogglePasswordVisibility,
  onEditEntry,
  onDeleteEntry,
}: EntryDetailsPanelProps) {
  const [copyState, setCopyState] = useState<"idle" | "success" | "error">("idle");

  useEffect(() => {
    setCopyState("idle");
  }, [entry?.id]);

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

  return (
    <Panel
      eyebrow="Entry details"
      title={entry ? entry.title : "Open an entry"}
      description={
        entry
          ? "Review the current record, reveal the password, or copy it directly when needed."
          : "Select an entry from the list to inspect stored details."
      }
    >
      {entry ? (
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Username</p>
            <p className="mt-2 break-all text-lg font-semibold text-slate-950">{entry.username}</p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Password</p>
                <p className="mt-2 font-mono text-lg tracking-[0.25em] text-slate-950">
                  {isPasswordVisible ? entry.password : "************"}
                </p>
                {copyState === "success" ? (
                  <p className="mt-2 text-xs font-medium text-emerald-600">
                    Password copied to clipboard.
                  </p>
                ) : null}
                {copyState === "error" ? (
                  <p className="mt-2 text-xs font-medium text-rose-600">
                    Password could not be copied.
                  </p>
                ) : null}
              </div>
              <div className="flex flex-wrap gap-3">
                <Button variant="secondary" onClick={onTogglePasswordVisibility}>
                  <Icon name={isPasswordVisible ? "eyeOff" : "eye"} className="size-4" />
                  {isPasswordVisible ? "Hide" : "Show"}
                </Button>
                <Button variant="secondary" onClick={handleCopyPassword}>
                  <Icon name="copy" className="size-4" />
                  Copy password
                </Button>
              </div>
            </div>
          </div>

          <dl className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <dt className="text-xs uppercase tracking-[0.2em] text-slate-500">URL</dt>
              <dd className="mt-2 break-all text-sm leading-6 text-slate-700">
                {entry.url ? (
                  <a
                    className="inline-flex items-center gap-2 font-medium text-cyan-700 underline decoration-cyan-200 underline-offset-4"
                    href={entry.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Icon name="link" className="size-4" />
                    {entry.url}
                  </a>
                ) : (
                  "No URL"
                )}
              </dd>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <dt className="text-xs uppercase tracking-[0.2em] text-slate-500">Notes</dt>
              <dd className="mt-2 text-sm leading-6 text-slate-700">{entry.notes || "No notes"}</dd>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <dt className="text-xs uppercase tracking-[0.2em] text-slate-500">Created</dt>
              <dd className="mt-2 text-sm leading-6 text-slate-700">{formatDateTime(entry.createdAt)}</dd>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <dt className="text-xs uppercase tracking-[0.2em] text-slate-500">Updated</dt>
              <dd className="mt-2 text-sm leading-6 text-slate-700">{formatDateTime(entry.updatedAt)}</dd>
            </div>
          </dl>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button onClick={() => onEditEntry(entry)}>
              <Icon name="edit" className="size-4" />
              Edit entry
            </Button>
            <Button
              variant="danger"
              onClick={() => onDeleteEntry(entry.id)}
              disabled={isSavingEntry}
            >
              <Icon name="trash" className="size-4" />
              Delete entry
            </Button>
          </div>
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center text-sm leading-6 text-slate-500">
          Select an entry from the vault list to inspect its data.
        </div>
      )}
    </Panel>
  );
}
