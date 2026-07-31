// src/lib/messenger-api.ts
import { API_BASE_URL } from "@/lib/api";

const authHeaders = (token: string) => ({
  "Content-Type": "application/json",
  Authorization: `Token ${token}`,
});

async function parse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    const message =
      body?.detail ||
      body?.error ||
      (Array.isArray(body?.non_field_errors) ? body.non_field_errors[0] : undefined) ||
      "درخواست ناموفق بود.";
    throw new Error(message);
  }
  if (response.status === 204) return undefined as T;
  return response.json();
}

export interface MessengerProfile {
  messenger_id: string | null;
  messenger_bio: string;
  messenger_searchable: boolean;
  allow_new_messages: boolean;
  show_online_status: boolean;
  show_email_in_messenger: boolean;
  last_seen: string | null;
  email: string;
  name: string;
}

export interface Contact {
  id: number;
  name: string;
  messenger_id: string | null;
  email?: string | null;
  bio?: string;
  last_seen?: string | null;
  last_message?: string;
  timestamp?: string;
  unread_count?: number;
  is_pinned?: boolean;
  is_muted?: boolean;
  is_archived?: boolean;
}

export interface Message {
  id: number;
  sender: number;
  sender_name: string;
  sender_messenger_id?: string | null;
  receiver: number;
  content: string;
  timestamp: string;
  is_read: boolean;
  is_edited: boolean;
  reply_to?: number | null;
  reply_preview?: { id: number; sender_name: string; content: string } | null;
  forwarded_from?: number | null;
  forwarded_from_name?: string | null;
}

export interface SupportReply {
  id: number;
  author_name: string;
  is_admin: boolean;
  message: string;
  created_at: string;
}

export interface SupportTicket {
  id: number;
  user_name: string;
  category: "technical" | "content" | "account" | "suggestion" | "other";
  subject: string;
  message: string;
  status: "open" | "answered" | "closed";
  created_at: string;
  updated_at: string;
  replies: SupportReply[];
}

export const getMessengerProfile = (token: string) =>
  fetch(`${API_BASE_URL}/api/messenger-profile/`, { headers: authHeaders(token) }).then(parse<MessengerProfile>);

export const updateMessengerProfile = (token: string, data: Partial<MessengerProfile>) =>
  fetch(`${API_BASE_URL}/api/messenger-profile/update_me/`, {
    method: "PATCH",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  }).then(parse<MessengerProfile>);

export const messengerHeartbeat = (token: string) =>
  fetch(`${API_BASE_URL}/api/messenger-profile/heartbeat/`, {
    method: "POST",
    headers: authHeaders(token),
  }).then(parse<{ ok: boolean }>);

export const searchMessengerUsers = (query: string, token: string) =>
  fetch(`${API_BASE_URL}/api/messages/search_users/?q=${encodeURIComponent(query)}`, {
    headers: authHeaders(token),
  }).then(parse<Contact[]>);

export const fetchRecentChats = (token: string, spyUserId?: number) => {
  const qs = spyUserId ? `?spy_user_id=${spyUserId}` : "";
  return fetch(`${API_BASE_URL}/api/messages/recent_chats/${qs}`, {
    headers: authHeaders(token),
  }).then(parse<Contact[]>);
};

export const fetchConversation = (userId: number, token: string, spyUserId?: number) => {
  const extra = spyUserId ? `&spy_user_id=${spyUserId}` : "";
  return fetch(`${API_BASE_URL}/api/messages/conversation/?user_id=${userId}${extra}`, {
    headers: authHeaders(token),
  }).then(parse<Message[]>);
};

export const sendMessengerMessage = (
  receiver: number,
  content: string,
  token: string,
  reply_to?: number | null,
) =>
  fetch(`${API_BASE_URL}/api/messages/`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify({ receiver, content, reply_to: reply_to || null }),
  }).then(parse<Message>);

export const editMessengerMessage = (id: number, content: string, token: string) =>
  fetch(`${API_BASE_URL}/api/messages/${id}/`, {
    method: "PATCH",
    headers: authHeaders(token),
    body: JSON.stringify({ content }),
  }).then(parse<Message>);

export const deleteMessengerMessage = (id: number, token: string) =>
  fetch(`${API_BASE_URL}/api/messages/${id}/`, {
    method: "DELETE",
    headers: authHeaders(token),
  }).then(parse<void>);

export const forwardMessengerMessage = (id: number, receiver: number, token: string) =>
  fetch(`${API_BASE_URL}/api/messages/${id}/forward/`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify({ receiver }),
  }).then(parse<Message>);

export const blockMessengerUser = (user_id: number, token: string) =>
  fetch(`${API_BASE_URL}/api/messages/block_user/`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify({ user_id }),
  }).then(parse<{ status: string }>);

export const unblockMessengerUser = (user_id: number, token: string) =>
  fetch(`${API_BASE_URL}/api/messages/unblock_user/`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify({ user_id }),
  }).then(parse<{ status: string }>);

export const deleteMessengerHistory = (userId: number, token: string) =>
  fetch(`${API_BASE_URL}/api/messages/delete_history/?user_id=${userId}`, {
    method: "DELETE",
    headers: authHeaders(token),
  }).then(parse<{ status: string }>);

export const updateConversationSettings = (
  user_id: number,
  data: { is_pinned?: boolean; is_muted?: boolean; is_archived?: boolean },
  token: string,
) =>
  fetch(`${API_BASE_URL}/api/messages/conversation_settings/`, {
    method: "PATCH",
    headers: authHeaders(token),
    body: JSON.stringify({ user_id, ...data }),
  }).then(parse<{ is_pinned: boolean; is_muted: boolean; is_archived: boolean }>);

export const fetchSupportTickets = (token: string) =>
  fetch(`${API_BASE_URL}/api/support-tickets/`, { headers: authHeaders(token) }).then(parse<SupportTicket[]>);

export const createSupportTicket = (
  data: { category: SupportTicket["category"]; subject: string; message: string },
  token: string,
) =>
  fetch(`${API_BASE_URL}/api/support-tickets/`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  }).then(parse<SupportTicket>);

export const replySupportTicket = (ticketId: number, message: string, token: string) =>
  fetch(`${API_BASE_URL}/api/support-tickets/${ticketId}/reply/`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify({ message }),
  }).then(parse<SupportTicket>);

export const updateSupportTicketStatus = (
  ticketId: number,
  status: SupportTicket["status"],
  token: string,
) =>
  fetch(`${API_BASE_URL}/api/support-tickets/${ticketId}/`, {
    method: "PATCH",
    headers: authHeaders(token),
    body: JSON.stringify({ status }),
  }).then(parse<SupportTicket>);
