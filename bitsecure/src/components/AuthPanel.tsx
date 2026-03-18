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
  const title = hasAccount ? "Unlock vault" : "Create vault";
  const description = hasAccount
    ? "Enter your master password to continue."
    : "Choose a master password to start using this browser vault.";
  const buttonLabel = isSubmitting
    ? "Please wait..."
    : hasAccount
      ? "Unlock"
      : "Create vault";

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid w-full max-w-5xl gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="rounded-[24px] border border-slate-200 bg-slate-50 px-6 py-7 sm:px-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
            <Icon name="vault" className="size-4" />
            BitSecure
          </span>
          <h1 className="mt-5 max-w-lg text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            Local password manager
          </h1>
          <p className="mt-3 max-w-lg text-sm leading-6 text-slate-600">
            Your entries stay in this browser and are protected by one master password.
          </p>
          <ul className="mt-6 space-y-3 text-sm leading-6 text-slate-600">
            <li>No backend or extra setup.</li>
            <li>Entries are encrypted before storage.</li>
            <li>Resetting the vault clears local data only.</li>
          </ul>
        </section>

        <Panel eyebrow="Access" title={title} description={description} className="self-center">
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
              hint={!hasAccount ? "Use at least 8 characters." : undefined}
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
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-4">
                <p className="text-sm font-semibold text-rose-900">Need to start over?</p>
                <p className="mt-1 text-sm leading-6 text-rose-700">
                  Reset the local vault to remove all saved entries and password data from this
                  browser.
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
