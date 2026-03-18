import { createContext, useContext, type PropsWithChildren } from "react";
import { useAuth } from "../hooks/useAuth";
import { useVault } from "../hooks/useVault";

type AppState = {
  auth: ReturnType<typeof useAuth>;
  vault: ReturnType<typeof useVault>;
};

const AppStateContext = createContext<AppState | null>(null);

export function AppStateProvider({ children }: PropsWithChildren) {
  const auth = useAuth();
  const vault = useVault(auth.isAuthenticated);

  return <AppStateContext.Provider value={{ auth, vault }}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const context = useContext(AppStateContext);

  if (!context) {
    throw new Error("useAppState must be used inside AppStateProvider.");
  }

  return context;
}
