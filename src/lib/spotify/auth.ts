// Spotify Client ID is a publishable value (safe in client code with PKCE).
const CLIENT_ID =
  (import.meta.env['VITE_SPOTIFY_CLIENT_ID'] as string | undefined) ??
  "c178a973042745fe93e2dfb46d3180a0";
const AUTH_URL = "https://accounts.spotify.com/authorize";
const TOKEN_URL = "https://accounts.spotify.com/api/token";

const SCOPES = [
  "user-read-email",
  "user-read-private",
  "user-read-playback-state",
  "user-modify-playback-state",
  "user-read-currently-playing",
  "streaming",
].join(" ");

const STORE_KEY = "bus.wtf.spotify.token";
const VERIFIER_KEY = "bus.wtf.spotify.verifier";
const STATE_KEY = "bus.wtf.spotify.state";

export type TokenSet = {
  access_token: string;
  refresh_token?: string;
  expires_at: number;
};

export const hasClientId = () => Boolean(CLIENT_ID);

function redirectUri() {
  return `${window.location.origin}/callback`;
}

function randomString(len: number) {
  const bytes = new Uint8Array(len);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => ("0" + b.toString(16)).slice(-2)).join("");
}

async function challengeFrom(verifier: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier));
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export function readToken(): TokenSet | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORE_KEY);
    return raw ? (JSON.parse(raw) as TokenSet) : null;
  } catch {
    return null;
  }
}

function writeToken(t: TokenSet) {
  window.localStorage.setItem(STORE_KEY, JSON.stringify(t));
}

export function logout() {
  window.localStorage.removeItem(STORE_KEY);
}

export async function beginLogin() {
  if (!CLIENT_ID) throw new Error("missing_client_id");
  const verifier = randomString(48);
  const state = randomString(8);
  sessionStorage.setItem(VERIFIER_KEY, verifier);
  sessionStorage.setItem(STATE_KEY, state);
  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: "code",
    redirect_uri: redirectUri(),
    scope: SCOPES,
    state,
    code_challenge_method: "S256",
    code_challenge: await challengeFrom(verifier),
  });
  window.location.assign(`${AUTH_URL}?${params.toString()}`);
}

export async function completeLogin(code: string, state: string) {
  if (!CLIENT_ID) throw new Error("missing_client_id");
  const expected = sessionStorage.getItem(STATE_KEY);
  const verifier = sessionStorage.getItem(VERIFIER_KEY);
  if (!expected || expected !== state) throw new Error("state_mismatch");
  if (!verifier) throw new Error("missing_verifier");

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri(),
      code_verifier: verifier,
    }),
  });
  if (!res.ok) throw new Error("token_exchange_failed");
  const json = (await res.json()) as {
    access_token: string;
    refresh_token?: string;
    expires_in: number;
  };
  sessionStorage.removeItem(VERIFIER_KEY);
  sessionStorage.removeItem(STATE_KEY);
  const token: TokenSet = {
    access_token: json.access_token,
    ...(json.refresh_token ? { refresh_token: json.refresh_token } : {}),
    expires_at: Date.now() + json.expires_in * 1000,
  };
  writeToken(token);
  return token;
}

async function refresh(token: TokenSet): Promise<TokenSet | null> {
  if (!CLIENT_ID || !token.refresh_token) return null;
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      grant_type: "refresh_token",
      refresh_token: token.refresh_token,
    }),
  });
  if (!res.ok) return null;
  const json = (await res.json()) as {
    access_token: string;
    refresh_token?: string;
    expires_in: number;
  };
  const next: TokenSet = {
    access_token: json.access_token,
    refresh_token: json.refresh_token ?? token.refresh_token,
    expires_at: Date.now() + json.expires_in * 1000,
  };
  writeToken(next);
  return next;
}

export async function getAccessToken(): Promise<string | null> {
  const token = readToken();
  if (!token) return null;
  if (Date.now() < token.expires_at - 30_000) return token.access_token;
  const next = await refresh(token);
  if (!next) {
    logout();
    return null;
  }
  return next.access_token;
}
