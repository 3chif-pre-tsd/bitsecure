export type AuthStatus = "success" | "error";

export interface AuthResult {
  status: AuthStatus;
  message: string;
}

export interface StoredMasterPassword {
  salt: string;
  iv: string;
  verifier: string;
}

export interface UserProfile {
  displayName: string;
  email: string;
  role: string;
}
