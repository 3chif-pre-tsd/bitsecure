import { createRootRoute, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import AppNavbar from "../components/layout/AppNavbar";
import { useAppState } from "../state/AppStateContext";

function NotFoundPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl items-center px-4 py-16 sm:px-6">
      <section className="w-full rounded-[28px] border border-slate-200 bg-white p-8 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.35)]">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-700">
          Navigation error
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
          This page is not available.
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">
          Return to the vault workspace and continue from the main screen.
        </p>
      </section>
    </main>
  );
}

function RootLayout() {
  const navigate = useNavigate();
  const { auth } = useAppState();
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });
  const showAppLayout = auth.isAuthenticated && pathname !== "/login";

  return (
    <div className="min-h-screen bg-transparent">
      {showAppLayout ? (
        <AppNavbar
          onLogout={() => {
            auth.logout();
            void navigate({ to: "/login" });
          }}
        />
      ) : null}
      {showAppLayout ? (
        <main className="mx-auto h-screen w-full max-w-7xl overflow-hidden px-4 pb-4 pt-20 sm:px-6 sm:pb-6 sm:pt-22 lg:px-8">
          <Outlet />
        </main>
      ) : (
        <Outlet />
      )}
    </div>
  );
}

export const Route = createRootRoute({
  component: RootLayout,
  notFoundComponent: NotFoundPage,
});
