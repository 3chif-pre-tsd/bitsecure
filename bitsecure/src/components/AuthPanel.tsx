import type { AuthResult } from "../models/auth";

interface AuthPanelProps {
  hasMasterPassword: boolean;
  draftPassword: string;
  isSubmitting: boolean;
  authResult: AuthResult | null;
  onPasswordChange: (value: string) => void;
  onSubmit: () => void;
}

export default function AuthPanel({
  hasMasterPassword,
  draftPassword,
  isSubmitting,
  authResult,
  onPasswordChange,
  onSubmit,
}: AuthPanelProps) {
  const title = hasMasterPassword ? "Welcome back" : "Create your vault";
  const description = hasMasterPassword
    ? "Enter your master password to unlock your secure workspace."
    : "Start by setting a master password to encrypt the vault stored in your browser.";
  const buttonLabel = isSubmitting
    ? "Please wait..."
    : hasMasterPassword
      ? "Unlock vault"
      : "Create vault";

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid w-full max-w-5xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[32px] border border-white/60 bg-slate-950 px-8 py-10 text-white shadow-2xl shadow-slate-950/20">
          <span className="inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200">
            BitSecure
          </span>
          <h1 className="mt-6 max-w-xl text-4xl font-semibold tracking-tight sm:text-5xl">
            Password protection with a cleaner vault workflow.
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
            Your vault is encrypted locally, designed for quick entry access, and ready for
            deeper account controls in the next step of the refactor.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Local only</p>
              <p className="mt-2 text-lg font-medium">Encrypted browser storage</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Fast access</p>
              <p className="mt-2 text-lg font-medium">Open, edit, filter and protect</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Responsive</p>
              <p className="mt-2 text-lg font-medium">Built for desktop and mobile</p>
            </div>
          </div>
        </section>

        <section className="rounded-[32px] border border-slate-200/70 bg-white/90 p-8 shadow-xl shadow-slate-200/60 backdrop-blur">
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">
              Secure access
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-slate-950">{title}</h2>
            <p className="text-sm leading-6 text-slate-600">{description}</p>
          </div>

          <div className="mt-8 space-y-4">
            <label htmlFor="master-password" className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Master password</span>
              <input
                id="master-password"
                type="password"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-100"
                value={draftPassword}
                onChange={(event) => onPasswordChange(event.target.value)}
                placeholder="Enter your master password"
                autoComplete="current-password"
              />
            </label>

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

            <button
              type="button"
              className="w-full rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
              onClick={onSubmit}
              disabled={isSubmitting}
            >
              {buttonLabel}
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
