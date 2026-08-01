// src/pages/Messenger.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Layout from "@/components/Layout/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Archive, ArrowRight, BellOff, Edit2, Forward, Loader2,
  MessageCircle, Pin, Reply, Search, Send, TicketCheck,
  Trash2, UserX, X
} from "lucide-react";
import {
  blockMessengerUser,
  Contact,
  deleteMessengerHistory,
  deleteMessengerMessage,
  editMessengerMessage,
  fetchConversation,
  fetchRecentChats,
  fetchSupportTickets,
  forwardMessengerMessage,
  Message,
  messengerHeartbeat,
  replySupportTicket,
  searchMessengerUsers,
  sendMessengerMessage,
  SupportTicket,
  updateConversationSettings,
} from "@/lib/messenger-api";
import { toast } from "sonner";
import { fetchPublicSiteSettings } from "@/lib/api";

const Messenger = () => {
  const { user, token } = useAuth();
  const [searchParams] = useSearchParams();
  const spyUserId = searchParams.get("spy_id") ? Number(searchParams.get("spy_id")) : undefined;

  const [query, setQuery] = useState("");
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selected, setSelected] = useState<Contact | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [searching, setSearching] = useState(false);
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const [editing, setEditing] = useState<Message | null>(null);
  const [forwarding, setForwarding] = useState<Message | null>(null);
  const [mode, setMode] = useState<"chats" | "tickets">("chats");
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [chatEnabled, setChatEnabled] = useState(true);
  const [settingsLoading, setSettingsLoading] = useState(true);
  const endRef = useRef<HTMLDivElement>(null);

  const isSupervisor = Boolean(user?.profile?.is_supervisor);

  const loadChats = async () => {
    if (!token || !chatEnabled) return;
    try {
      setContacts(await fetchRecentChats(token, spyUserId));
    } catch (error) {
      console.error(error);
    }
  };

  const loadConversation = async (contact: Contact) => {
    if (!token || !chatEnabled) return;
    try {
      const data = await fetchConversation(contact.id, token, spyUserId);
      setMessages(data);
      setTimeout(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), 20);
      loadChats();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "دریافت گفتگو ناموفق بود.");
    }
  };

  const loadTickets = async () => {
    if (!token) return;
    try {
      const data = await fetchSupportTickets(token);
      setTickets(data);
      if (selectedTicket) {
        const updated = data.find((ticket) => ticket.id === selectedTicket.id);
        if (updated) setSelectedTicket(updated);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPublicSiteSettings()
      .then((data) => setChatEnabled(data.chat_enabled))
      .finally(() => setSettingsLoading(false));
  }, []);

  useEffect(() => {
    if (!token) return;
    loadChats();
    messengerHeartbeat(token).catch(() => {});

    const timer = window.setInterval(() => {
      messengerHeartbeat(token).catch(() => {});
      if (mode === "chats") {
        loadChats();
        if (selected) loadConversation(selected);
      } else if (isSupervisor) {
        loadTickets();
      }
    }, 4000);

    return () => window.clearInterval(timer);
  }, [token, selected?.id, mode, spyUserId]);

  useEffect(() => {
    if (!token) return;

    const cleanQuery = query.trim();
    if (!cleanQuery) {
      loadChats();
      return;
    }

    if (cleanQuery.replace(/^@/, "").length < 3) {
      setContacts([]);
      return;
    }

    const timer = window.setTimeout(async () => {
      setSearching(true);
      try {
        setContacts(await searchMessengerUsers(cleanQuery, token));
      } finally {
        setSearching(false);
      }
    }, 350);

    return () => window.clearTimeout(timer);
  }, [query, token]);

  useEffect(() => {
    if (mode === "tickets" && token && isSupervisor) loadTickets();
  }, [mode, token, isSupervisor]);

  const send = async () => {
    if (!chatEnabled || !token || !selected || !text.trim() || spyUserId) return;

    try {
      if (editing) {
        const updated = await editMessengerMessage(editing.id, text.trim(), token);
        setMessages((prev) => prev.map((message) => message.id === updated.id ? updated : message));
        setEditing(null);
      } else {
        const sent = await sendMessengerMessage(selected.id, text.trim(), token, replyTo?.id);
        setMessages((prev) => [...prev, sent]);
        setReplyTo(null);
      }

      setText("");
      setTimeout(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), 20);
      loadChats();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "ارسال ناموفق بود.");
    }
  };

  const deleteMessage = async (message: Message) => {
    if (!token || !confirm("پیام حذف شود؟")) return;

    try {
      await deleteMessengerMessage(message.id, token);
      setMessages((prev) => prev.filter((item) => item.id !== message.id));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "حذف ناموفق بود.");
    }
  };

  const chooseForwardReceiver = async (receiver: Contact) => {
    if (!token || !forwarding) return;

    try {
      await forwardMessengerMessage(forwarding.id, receiver.id, token);
      setForwarding(null);
      toast.success("پیام فوروارد شد.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "فوروارد ناموفق بود.");
    }
  };

  const updateSetting = async (
    patch: { is_pinned?: boolean; is_muted?: boolean; is_archived?: boolean },
  ) => {
    if (!token || !selected) return;

    try {
      await updateConversationSettings(selected.id, patch, token);
      setSelected({ ...selected, ...patch });
      loadChats();
    } catch {
      toast.error("تغییر تنظیمات گفتگو ناموفق بود.");
    }
  };

  const replyTicket = async () => {
    if (!token || !selectedTicket || !text.trim()) return;

    try {
      const updated = await replySupportTicket(selectedTicket.id, text.trim(), token);
      setSelectedTicket(updated);
      setText("");
      loadTickets();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "ارسال پاسخ ناموفق بود.");
    }
  };

  const listTitle = useMemo(
    () => mode === "chats" ? "پیام‌ها" : "تیکت‌های پشتیبانی",
    [mode],
  );

  if (!token) return null;
  if (settingsLoading) {
    return <Layout><div className="grid min-h-[50vh] place-items-center"><Loader2 className="animate-spin" /></div></Layout>;
  }
  if (!chatEnabled) {
    return (
      <Layout>
        <div className="mx-auto mt-16 max-w-xl rounded-[2rem] border bg-card p-8 text-center shadow-sm">
          <MessageCircle className="mx-auto h-12 w-12 text-blue-600" />
          <h1 className="mt-4 text-2xl font-black">پیام‌رسان موقتاً غیرفعال است</h1>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            مدیریت سایت چت را موقتاً غیرفعال کرده است. سایر بخش‌های سایت در دسترس هستند.
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div
        dir="rtl"
        className="relative flex h-[calc(100dvh-64px)] min-h-[520px] overflow-hidden bg-slate-100 dark:bg-slate-950"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(37,99,235,.08),transparent_30%),radial-gradient(circle_at_90%_90%,rgba(6,182,212,.08),transparent_28%)]" />

        {spyUserId && (
          <div className="absolute inset-x-0 top-0 z-30 bg-gradient-to-l from-red-700 to-rose-600 px-4 py-2 text-center text-xs font-black text-white shadow">
            حالت مشاهده مدیر فعال است — ارسال و ویرایش پیام غیرفعال است
          </div>
        )}

        <aside
          className={`${selected || selectedTicket ? "hidden md:flex" : "flex"} relative z-10 w-full flex-col border-l border-slate-200/80 bg-white/95 shadow-xl backdrop-blur md:w-[370px] dark:border-slate-800 dark:bg-slate-900/95`}
        >
          <div className={`${spyUserId ? "pt-10" : ""} border-b border-slate-200/80 p-4 dark:border-slate-800`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xl font-black">{listTitle}</p>
                <p className="text-xs text-muted-foreground">myCloud Messenger</p>
              </div>

              {isSupervisor && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-xl"
                  onClick={() => {
                    setMode(mode === "chats" ? "tickets" : "chats");
                    setSelected(null);
                    setSelectedTicket(null);
                  }}
                >
                  {mode === "chats" ? (
                    <TicketCheck className="ml-2 h-4 w-4" />
                  ) : (
                    <MessageCircle className="ml-2 h-4 w-4" />
                  )}
                  {mode === "chats" ? "تیکت‌ها" : "چت‌ها"}
                </Button>
              )}
            </div>

            {mode === "chats" && (
              <div className="relative mt-4">
                <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-blue-500" />
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  className="h-12 rounded-2xl border-blue-100 bg-blue-50/70 pr-10 shadow-inner focus-visible:ring-blue-500 dark:border-slate-700 dark:bg-slate-800"
                  placeholder="نام، @username یا ۳ حرف اول ایمیل..."
                />
              </div>
            )}
          </div>

          <ScrollArea className="flex-1">
            {mode === "chats" ? (
              <div className="p-2">
                {searching && <Loader2 className="mx-auto my-8 animate-spin text-blue-600" />}

                {!searching && query.trim().length > 0 && query.replace(/^@/, "").length < 3 && (
                  <p className="p-6 text-center text-sm text-muted-foreground">حداقل ۳ کاراکتر وارد کن.</p>
                )}

                {contacts.map((contact) => (
                  <button
                    key={contact.id}
                    onClick={() => {
                      if (forwarding) return void chooseForwardReceiver(contact);
                      setSelected(contact);
                      setSelectedTicket(null);
                      setQuery("");
                      loadConversation(contact);
                    }}
                    className={`mb-1 flex w-full items-center gap-3 rounded-2xl p-3 text-right transition ${
                      selected?.id === contact.id
                        ? "bg-gradient-to-l from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/15"
                        : "hover:bg-blue-50 dark:hover:bg-slate-800"
                    }`}
                  >
                    <Avatar className="h-12 w-12 shrink-0 shadow">
                      <AvatarFallback className="bg-gradient-to-br from-cyan-400 to-blue-600 font-black text-white">
                        {contact.name.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate font-black">{contact.name}</p>
                        {contact.timestamp && (
                          <span className={`text-[10px] ${selected?.id === contact.id ? "text-blue-100" : "text-muted-foreground"}`}>
                            {new Date(contact.timestamp).toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        )}
                      </div>

                      <div className="mt-1 flex items-center gap-2">
                        <span
                          dir="ltr"
                          className={`truncate text-xs ${
                            selected?.id === contact.id ? "text-cyan-100" : "text-blue-600 dark:text-blue-400"
                          }`}
                        >
                          {contact.messenger_id ? `@${contact.messenger_id}` : "بدون نام کاربری"}
                        </span>
                        {contact.is_pinned && <Pin className="h-3 w-3" />}
                        {contact.is_muted && <BellOff className="h-3 w-3" />}
                      </div>

                      <div className="mt-1 flex items-center justify-between gap-2">
                        <p className={`truncate text-xs ${selected?.id === contact.id ? "text-blue-100" : "text-muted-foreground"}`}>
                          {contact.last_message || contact.bio || "شروع گفتگو"}
                        </p>

                        {!!contact.unread_count && (
                          <span className={`grid min-w-5 place-items-center rounded-full px-1.5 text-[10px] font-black ${
                            selected?.id === contact.id ? "bg-white text-blue-600" : "bg-blue-600 text-white"
                          }`}>
                            {contact.unread_count}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-2">
                {tickets.map((ticket) => (
                  <button
                    key={ticket.id}
                    onClick={() => {
                      setSelectedTicket(ticket);
                      setSelected(null);
                    }}
                    className="mb-1 w-full rounded-2xl p-4 text-right transition hover:bg-blue-50 dark:hover:bg-slate-800"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate font-black">{ticket.user_name}</p>
                      <span
                        className={`rounded-full px-2 py-1 text-[10px] font-black ${
                          ticket.status === "open"
                            ? "bg-red-100 text-red-700"
                            : ticket.status === "answered"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        {ticket.status === "open" ? "باز" : ticket.status === "answered" ? "پاسخ داده شده" : "بسته"}
                      </span>
                    </div>
                    <p className="mt-1 truncate text-sm">{ticket.subject}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {new Date(ticket.updated_at).toLocaleString("fa-IR")}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </ScrollArea>
        </aside>

        <section
          className={`${selected || selectedTicket ? "flex" : "hidden md:flex"} relative z-10 min-w-0 flex-1 flex-col bg-[linear-gradient(to_bottom,rgba(239,246,255,.7),rgba(248,250,252,.96))] dark:bg-[linear-gradient(to_bottom,rgba(15,23,42,.98),rgba(2,6,23,.98))]`}
        >
          {mode === "chats" && selected ? (
            <>
              <header className={`${spyUserId ? "pt-10" : ""} flex min-h-16 items-center gap-3 border-b border-slate-200/80 bg-white/90 px-4 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90`}>
                <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSelected(null)}>
                  <ArrowRight className="h-5 w-5" />
                </Button>

                <Avatar className="shadow">
                  <AvatarFallback className="bg-gradient-to-br from-cyan-400 to-blue-600 font-black text-white">
                    {selected.name.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0 flex-1">
                  <p className="truncate font-black">{selected.name}</p>
                  <p dir="ltr" className="w-fit text-xs text-blue-600 dark:text-blue-400">
                    {selected.messenger_id ? `@${selected.messenger_id}` : "myCloud user"}
                  </p>
                </div>

                {!spyUserId && (
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="rounded-xl" title="Pin" onClick={() => updateSetting({ is_pinned: !selected.is_pinned })}>
                      <Pin className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="rounded-xl" title="Mute" onClick={() => updateSetting({ is_muted: !selected.is_muted })}>
                      <BellOff className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="rounded-xl" title="Archive" onClick={() => updateSetting({ is_archived: true })}>
                      <Archive className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-xl"
                      title="Block"
                      onClick={async () => {
                        if (confirm("کاربر بلاک شود؟")) {
                          await blockMessengerUser(selected.id, token);
                          toast.success("کاربر بلاک شد.");
                        }
                      }}
                    >
                      <UserX className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-xl"
                      title="Delete chat"
                      onClick={async () => {
                        if (confirm("کل تاریخچه حذف شود؟")) {
                          await deleteMessengerHistory(selected.id, token);
                          setMessages([]);
                          loadChats();
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </header>

              <ScrollArea className="flex-1">
                <div className="mx-auto max-w-4xl space-y-2 p-4 sm:p-6">
                  {messages.map((message) => {
                    const mine = message.sender === user?.id;

                    return (
                      <div key={message.id} className={`group flex ${mine ? "justify-start" : "justify-end"}`}>
                        <div
                          className={`max-w-[86%] rounded-2xl px-4 py-2.5 shadow-sm sm:max-w-[72%] ${
                            mine
                              ? "rounded-br-sm bg-gradient-to-l from-blue-600 to-blue-500 text-white"
                              : "rounded-bl-sm border border-slate-200/70 bg-white text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                          }`}
                        >
                          {message.forwarded_from_name && (
                            <p className={`mb-1 text-[11px] font-black ${mine ? "text-cyan-100" : "text-blue-600"}`}>
                              فوروارد از {message.forwarded_from_name}
                            </p>
                          )}

                          {message.reply_preview && (
                            <div
                              className={`mb-2 rounded-xl border-r-2 p-2 text-xs ${
                                mine
                                  ? "border-white/60 bg-white/10"
                                  : "border-blue-500 bg-blue-50 dark:bg-slate-700"
                              }`}
                            >
                              <p className="font-black">{message.reply_preview.sender_name}</p>
                              <p className="mt-1 line-clamp-2 opacity-80">{message.reply_preview.content}</p>
                            </div>
                          )}

                          <p className="whitespace-pre-wrap text-sm leading-7">{message.content}</p>

                          <div className="mt-1 flex items-center justify-end gap-1 text-[10px] opacity-70">
                            {message.is_edited && <span>ویرایش‌شده</span>}
                            <span>
                              {new Date(message.timestamp).toLocaleTimeString("fa-IR", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                            {mine && <span>{message.is_read ? "✓✓" : "✓"}</span>}
                          </div>

                          {!spyUserId && (
                            <div className="mt-1 flex justify-end gap-2 opacity-0 transition group-hover:opacity-100">
                              <button onClick={() => setReplyTo(message)} title="پاسخ">
                                <Reply className="h-3.5 w-3.5" />
                              </button>
                              <button onClick={() => setForwarding(message)} title="فوروارد">
                                <Forward className="h-3.5 w-3.5" />
                              </button>
                              {mine && (
                                <button
                                  onClick={() => {
                                    setEditing(message);
                                    setText(message.content);
                                  }}
                                  title="ویرایش"
                                >
                                  <Edit2 className="h-3.5 w-3.5" />
                                </button>
                              )}
                              {mine && (
                                <button onClick={() => deleteMessage(message)} title="حذف">
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  <div ref={endRef} />
                </div>
              </ScrollArea>

              {!spyUserId && (
                <footer className="border-t border-slate-200/80 bg-white/90 p-3 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
                  {(replyTo || editing || forwarding) && (
                    <div className="mx-auto mb-2 flex max-w-4xl items-center justify-between rounded-xl border border-blue-100 bg-blue-50 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800">
                      <span>
                        {forwarding
                          ? "یک کاربر را برای فوروارد از لیست انتخاب کن"
                          : editing
                            ? "در حال ویرایش پیام"
                            : `پاسخ به ${replyTo?.sender_name}`}
                      </span>

                      <X
                        className="h-4 w-4 cursor-pointer"
                        onClick={() => {
                          setReplyTo(null);
                          setEditing(null);
                          setForwarding(null);
                          setText("");
                        }}
                      />
                    </div>
                  )}

                  <div className="mx-auto flex max-w-4xl gap-2">
                    <Input
                      value={text}
                      onChange={(event) => setText(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" && !event.shiftKey) {
                          event.preventDefault();
                          send();
                        }
                      }}
                      className="h-12 rounded-2xl border-blue-100 bg-blue-50/70 shadow-inner dark:border-slate-700 dark:bg-slate-800"
                      placeholder="پیام متنی بنویس..."
                    />

                    <Button
                      size="icon"
                      onClick={send}
                      className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 shadow-lg shadow-blue-500/20 hover:from-blue-500 hover:to-cyan-400"
                    >
                      <Send className="h-5 w-5" />
                    </Button>
                  </div>
                </footer>
              )}
            </>
          ) : mode === "tickets" && selectedTicket ? (
            <>
              <header className="flex min-h-16 items-center gap-3 border-b border-slate-200/80 bg-white/90 px-4 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
                <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSelectedTicket(null)}>
                  <ArrowRight className="h-5 w-5" />
                </Button>
                <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white">
                  <TicketCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-black">{selectedTicket.subject}</p>
                  <p className="text-xs text-muted-foreground">{selectedTicket.user_name}</p>
                </div>
              </header>

              <ScrollArea className="flex-1">
                <div className="mx-auto max-w-3xl space-y-3 p-6">
                  <div className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                    <p className="text-xs font-black text-blue-600">متن اولیه تیکت</p>
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-7">{selectedTicket.message}</p>
                  </div>

                  {selectedTicket.replies.map((reply) => (
                    <div key={reply.id} className={`flex ${reply.is_admin ? "justify-start" : "justify-end"}`}>
                      <div
                        className={`max-w-[80%] rounded-2xl p-4 text-sm shadow-sm ${
                          reply.is_admin
                            ? "bg-gradient-to-l from-blue-600 to-blue-500 text-white"
                            : "bg-white dark:bg-slate-800"
                        }`}
                      >
                        <p className="mb-1 text-xs font-black opacity-80">{reply.author_name}</p>
                        <p className="whitespace-pre-wrap leading-7">{reply.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <footer className="border-t border-slate-200/80 bg-white/90 p-3 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
                <div className="mx-auto flex max-w-3xl gap-2">
                  <Input
                    value={text}
                    onChange={(event) => setText(event.target.value)}
                    className="h-12 rounded-2xl"
                    placeholder="پاسخ مدیر..."
                  />
                  <Button size="icon" onClick={replyTicket} className="h-12 w-12 rounded-2xl bg-blue-600">
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              </footer>
            </>
          ) : (
            <div className="grid flex-1 place-items-center p-8 text-center text-slate-500">
              <div>
                <div className="mx-auto grid h-28 w-28 place-items-center rounded-[2rem] bg-gradient-to-br from-blue-100 to-cyan-50 text-blue-500 dark:from-slate-800 dark:to-slate-900">
                  <MessageCircle className="h-14 w-14" />
                </div>
                <p className="mt-5 text-lg font-black text-slate-700 dark:text-slate-200">یک گفتگو را انتخاب کن</p>
                <p className="mt-2 text-sm">برای شروع، یک کاربر را جستجو کن یا یکی از گفتگوهای اخیر را باز کن.</p>
              </div>
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
};

export default Messenger;
