import { Outlet, createFileRoute } from "@tanstack/react-router";

function DashboardRouteLayout() {
  return <Outlet />;
}

export const Route = createFileRoute("/dashboard")({
  component: DashboardRouteLayout,
});
