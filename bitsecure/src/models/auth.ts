export type AuthStatus = "success" | "error";

export interface AuthResult {
  status: AuthStatus;
  message: string;
}

export interface StoredMasterPassword {
  value: string;
}

export interface UserProfile {
  displayName: string;
  email: string;
  role: string;
}
