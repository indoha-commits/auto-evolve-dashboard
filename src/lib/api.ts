import { supabase } from "./supabase";

export const API_BASE =
  (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_API_BASE) ||
  "https://hermes.indataflow.com";

export const API_ENDPOINTS = {
  analyze: `${API_BASE}/api/analyze`,
  associateAnalysis: `${API_BASE}/api/associate-analysis`,
  publish: `${API_BASE}/api/publish`,
  renderClips: `${API_BASE}/api/render-clips`,
  features: `${API_BASE}/api/features`,
  initiateUpload: `${API_BASE}/api/initiate-upload`,
  uploadComplete: `${API_BASE}/api/webhook/upload-complete`,
  jobStatus: `${API_BASE}/api/job-status`,
} as const;

async function getToken(): Promise<string | null> {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;
}

export async function apiFetch(
  url: string,
  options: RequestInit = {},
): Promise<Response> {
  const token = await getToken();
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = headers["Content-Type"] || "application/json";
  }
  return fetch(url, { ...options, headers });
}

export async function apiPost(url: string, body?: unknown): Promise<Response> {
  return apiFetch(url, {
    method: "POST",
    body: body instanceof FormData ? body : JSON.stringify(body),
  });
}
