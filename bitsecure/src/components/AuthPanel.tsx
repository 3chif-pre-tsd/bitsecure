import type { AuthResult } from "../models/auth";
import Button from "./ui/Button";
import { InputField } from "./ui/Field";
import Icon from "./ui/Icon";
import Panel from "./ui/Panel";

interface AuthPanelProps {
  hasAccount: boolean;
  draftUsername: string;
  draftPassword: string;
  isSubmitting: boolean;
  authResult: AuthResult | null;
  onUsernameChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: () => void;
}

export default function AuthPanel({
  hasAccount,
  draftUsername,
  draftPassword,
  isSubmitting,
  authResult,
  onUsernameChange,
  onPasswordChange,
  onSubmit,
}: AuthPanelProps) {
  const title = hasAccount ? "Unlock your vault" : "Create your secure account";
  const description = hasAccount
    ? "Sign in with your username and master password to decrypt the stored vault."
    : "Set up a username and master password to create your encrypted vault in this browser.";
  const buttonLabel = isSubmitting
    ? "Please wait..."
    : hasAccount
      ? "Unlock vault"
      : "Create account";

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid w-full max-w-5xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[32px] border border-white/60 bg-slate-950 px-8 py-10 text-white shadow-2xl shadow-slate-950/20">
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200">
            <Icon name="vault" className="size-4" />
            BitSecure
          </span>
          <h1 className="mt-6 max-w-xl text-4xl font-semibold tracking-tight sm:text-5xl">
            Secure local vault access with encrypted credentials.
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
            BitSecure stores account metadata and entries in encrypted browser storage so the
            session can be unlocked only with the correct username and master password.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Username based</p>
              <p className="mt-2 text-lg font-medium">Vault access tied to your account</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Master password</p>
              <p className="mt-2 text-lg font-medium">Encryption key derived locally</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Reset ready</p>
              <p className="mt-2 text-lg font-medium">Re-encrypt your vault safely</p>
            </div>
          </div>
        </section>

        <Panel eyebrow="Secure access" title={title} description={description}>
          <div className="space-y-5">
            <InputField
              id="username"
              type="text"
              label="Username"
              value={draftUsername}
              onChange={(event) => onUsernameChange(event.target.value)}
              placeholder="Enter your username"
              autoComplete="username"
            />

            <InputField
              id="master-password"
              type="password"
              label="Master password"
              value={draftPassword}
              onChange={(event) => onPasswordChange(event.target.value)}
              placeholder="Enter your master password"
              autoComplete={hasAccount ? "current-password" : "new-password"}
            />

            {authResult ? (
              <div
                className={`rounded-2xl border px-4 py-3 text-sm ${
                  authResult.status === "success"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-rose-200 bg-rose-50 text-rose-700"
                }`}
                role="alert"
              >
                {authResult.message}
              </div>
            ) : null}

            <Button fullWidth onClick={onSubmit} disabled={isSubmitting}>
              <Icon name="vault" className="size-4" />
              {buttonLabel}
            </Button>
          </div>
        </Panel>
      </div>
    </main>
  );
}
