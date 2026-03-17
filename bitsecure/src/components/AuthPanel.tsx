import type { AuthResult } from "../models/auth";
import Button from "./ui/Button";
import { InputField } from "./ui/Field";
import FeedbackMessage from "./ui/FeedbackMessage";
import Icon from "./ui/Icon";
import Panel from "./ui/Panel";

interface AuthPanelProps {
  hasAccount: boolean;
  draftPassword: string;
  draftConfirmPassword: string;
  passwordError?: string;
  confirmPasswordError?: string;
  isSubmitting: boolean;
  authResult: AuthResult | null;
  onPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
  onSubmit: () => void;
  onResetLocalVault: () => void;
}

export default function AuthPanel({
  hasAccount,
  draftPassword,
  draftConfirmPassword,
  passwordError,
  confirmPasswordError,
  isSubmitting,
  authResult,
  onPasswordChange,
  onConfirmPasswordChange,
  onSubmit,
  onResetLocalVault,
}: AuthPanelProps) {
  const title = hasAccount ? "Unlock your vault" : "Set your master password";
  const description = hasAccount
    ? "Enter the master password to unlock the encrypted local vault stored in this browser."
    : "Create a master password to initialize the encrypted local vault for this prototype.";
  const buttonLabel = isSubmitting
    ? "Please wait..."
    : hasAccount
      ? "Unlock vault"
      : "Create vault";

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid w-full max-w-6xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="overflow-hidden rounded-[36px] border border-slate-900/10 bg-slate-950 px-8 py-10 text-white shadow-2xl shadow-slate-950/20 sm:px-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200">
            <Icon name="vault" className="size-4" />
            BitSecure
          </span>
          <h1 className="mt-6 max-w-xl text-4xl font-semibold tracking-tight sm:text-5xl">
            Secure local credentials with one consistent master password flow.
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
            BitSecure keeps the project focused on a presentation-ready local prototype with
            encrypted browser storage, reliable vault access, and streamlined credential handling.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Local storage</p>
              <p className="mt-2 text-lg font-medium">No API, no database, no extra setup</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Encrypted vault
              </p>
              <p className="mt-2 text-lg font-medium">Entries stay protected in the browser</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Focused access
              </p>
              <p className="mt-2 text-lg font-medium">One master password for setup and unlock</p>
            </div>
          </div>
        </section>

        <Panel eyebrow="Secure access" title={title} description={description} className="self-center">
          <form
            className="space-y-5"
            onSubmit={(event) => {
              event.preventDefault();
              onSubmit();
            }}
            noValidate
          >
            <InputField
              id="master-password"
              type="password"
              label={hasAccount ? "Master password" : "Create master password"}
              value={draftPassword}
              onChange={(event) => onPasswordChange(event.target.value)}
              placeholder={hasAccount ? "Enter your master password" : "Choose a master password"}
              autoComplete={hasAccount ? "current-password" : "new-password"}
              error={passwordError}
              hint={!hasAccount ? "Use at least 8 characters for a reliable local demo." : undefined}
            />

            {!hasAccount ? (
              <InputField
                id="confirm-master-password"
                type="password"
                label="Confirm master password"
                value={draftConfirmPassword}
                onChange={(event) => onConfirmPasswordChange(event.target.value)}
                placeholder="Repeat the master password"
                autoComplete="new-password"
                error={confirmPasswordError}
              />
            ) : null}

            {authResult ? (
              <FeedbackMessage status={authResult.status} message={authResult.message} />
            ) : null}

            <Button type="submit" fullWidth disabled={isSubmitting}>
              <Icon name="vault" className="size-4" />
              {buttonLabel}
            </Button>

            {hasAccount ? (
              <div className="rounded-2xl border border-rose-200 bg-rose-50/80 p-4">
                <p className="text-sm font-semibold text-rose-900">Locked out or vault not loading?</p>
                <p className="mt-1 text-sm leading-6 text-rose-700">
                  Reset the local vault to remove all stored entries and master-password data from
                  this browser, then start again with a fresh setup.
                </p>
                <Button
                  variant="danger"
                  className="mt-3 w-full sm:w-auto"
                  onClick={onResetLocalVault}
                >
                  Reset local vault
                </Button>
              </div>
            ) : null}
          </form>
        </Panel>
      </div>
    </main>
  );
}
