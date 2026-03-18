import { Navigate, createFileRoute } from "@tanstack/react-router";
import { useAppState } from "../state/AppStateContext";

function IndexRoute() {
  const { auth } = useAppState();

  return <Navigate to={auth.isAuthenticated ? "/dashboard" : "/login"} />;
}

export const Route = createFileRoute("/")({
  component: IndexRoute,
});
