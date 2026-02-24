import type { AuthData } from "../features/auth/authTypes";

export default function persistAuth(authData: AuthData, rememberMe: boolean) {
  const expiresInMs = 1000 * 60 * 60 * 4;
  const expiresAt = Date.now() + expiresInMs;

  const storage = rememberMe ? localStorage : sessionStorage;

  storage.setItem("auth_user", JSON.stringify(authData.user));
  storage.setItem("auth_token", JSON.stringify(authData.token));
  storage.setItem("auth_expires_at", expiresAt.toString());
}
