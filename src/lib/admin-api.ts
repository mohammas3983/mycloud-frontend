// src/lib/admin-api.ts
import { API_BASE_URL } from "@/lib/api";

const authHeaders = (token: string) => ({
  "Content-Type": "application/json",
  Authorization: `Token ${token}`,
});

async function parse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body?.error || body?.detail || "درخواست ناموفق بود.");
  }
  return response.status === 204 ? (undefined as T) : response.json();
}

export interface AdminUserDetail {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  date_joined: string;
  last_login: string | null;

  student_id: string;
  major: string;
  phone_number: string;
  faculty_id: number | null;
  faculty_name: string | null;

  messenger_id: string | null;
  messenger_bio: string;
  email_verified: boolean;
  is_approved: boolean;
  is_supervisor: boolean;
  messenger_searchable: boolean;
  allow_new_messages: boolean;
  show_online_status: boolean;
  last_seen: string | null;
}

export interface BackupSettings {
  support_email: string;
  auto_backup_enabled: boolean;
  interval_hours: number;
  email_backup_enabled: boolean;
  keep_last: number;
  updated_at: string;
}

export interface BackupLog {
  id: number;
  backup_type: "manual" | "automatic" | "pre_restore" | "restore";
  status: "running" | "success" | "failed";
  filename: string;
  file_size: number;
  size_mb: number;
  email_to: string;
  email_sent: boolean;
  message: string;
  started_at: string;
  finished_at: string | null;
}

export const fetchAdminUsers = (token: string) =>
  fetch(`${API_BASE_URL}/api/admin-users/`, {
    headers: authHeaders(token),
  }).then(parse<AdminUserDetail[]>);

export const fetchBackupSettings = (token: string) =>
  fetch(`${API_BASE_URL}/api/backup-admin/settings/`, {
    headers: authHeaders(token),
  }).then(parse<BackupSettings>);

export const saveBackupSettings = (token: string, data: Partial<BackupSettings>) =>
  fetch(`${API_BASE_URL}/api/backup-admin/settings/`, {
    method: "PATCH",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  }).then(parse<BackupSettings>);

export const fetchBackupLogs = (token: string) =>
  fetch(`${API_BASE_URL}/api/backup-admin/logs/`, {
    headers: authHeaders(token),
  }).then(parse<BackupLog[]>);

export const createDatabaseBackup = (token: string, email_copy = false) =>
  fetch(`${API_BASE_URL}/api/backup-admin/create_backup/`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify({ email_copy }),
  }).then(parse<BackupLog>);

export const restoreDatabaseBackup = (
  token: string,
  filename: string,
) =>
  fetch(`${API_BASE_URL}/api/backup-admin/restore/`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify({
      filename,
      confirmation: "RESTORE",
    }),
  }).then(parse<BackupLog>);

export const downloadDatabaseBackup = async (
  token: string,
  log: BackupLog,
) => {
  const response = await fetch(
    `${API_BASE_URL}/api/backup-admin/download/${log.id}/`,
    { headers: { Authorization: `Token ${token}` } },
  );

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body?.error || "دانلود بکاپ ناموفق بود.");
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = log.filename || `mycloud-backup-${log.id}.dump`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
};
