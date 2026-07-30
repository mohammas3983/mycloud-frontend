// src/pages/Messenger.tsx
import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom"; // useSearchParams برای خواندن spy_id
import Layout from "@/components/Layout/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { 
    fetchRecentChats, searchUsers, fetchConversation, sendMessage, 
    deleteMessage, editMessage, deleteChatHistory, blockUser, 
    Contact, Message 
} from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
    Send, Search, ArrowLeft, MessageCircle, Loader2, MoreVertical, 
    Trash2, Edit2, X, UserX 
} from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns-jalali";

const Messenger = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // 👇👇 خواندن آی‌دی کاربر برای جاسوسی ادمین 👇👇
  const spyUserId = searchParams.get('spy_id') ? parseInt(searchParams.get('spy_id')!) : undefined;

  const [query, setQuery] = useState("");
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState<number | null>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  // ریدایرکت اگر لاگین نباشد
  useEffect(() => {
    if (!token) navigate("/login");
  }, [token, navigate]);

  // --- سیستم Polling ---
  useEffect(() => {
    if (!token) return;
    let interval: NodeJS.Timeout;

    const syncData = async () => {
      // 1. آپدیت سایدبار
      if (!query) {
        try {
          // 👇👇 ارسال spyUserId به تابع API 👇👇
          const recentChats = await fetchRecentChats(token, spyUserId);
          setContacts(prev => JSON.stringify(prev) !== JSON.stringify(recentChats) ? recentChats : prev);
        } catch (err) { console.error(err); }
      }

      // 2. آپدیت چت باز شده
      if (selectedContact) {
        try {
          // 👇👇 ارسال spyUserId به تابع API 👇👇
          const chatMsgs = await fetchConversation(selectedContact.id, token, spyUserId);
          setMessages(prev => {
            if (JSON.stringify(prev) !== JSON.stringify(chatMsgs)) return chatMsgs;
            return prev;
          });
        } catch (err) { console.error(err); }
      }
    };

    syncData();
    interval = setInterval(syncData, 3000); 
    return () => clearInterval(interval);
  }, [token, selectedContact, query, spyUserId]); // وابستگی به spyUserId مهم است

  // --- اسکرول هوشمند ---
  useEffect(() => {
    if (messages.length > 0) {
        const lastMsg = messages[messages.length - 1];
        if (lastMsg.sender === user?.id || !scrollRef.current) {
            scrollRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }
  }, [messages.length, selectedContact?.id]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newMessage.trim() || !selectedContact || !token) return;

    try {
      if (editingMessageId) {
        await editMessage(editingMessageId, newMessage, token);
        setMessages(prev => prev.map(m => m.id === editingMessageId ? { ...m, content: newMessage, is_edited: true } : m));
        setEditingMessageId(null);
        toast.success("پیام ویرایش شد");
      } else {
        const sentMsg = await sendMessage(selectedContact.id, newMessage, token);
        setMessages(prev => [...prev, sentMsg]);
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
      }
      setNewMessage("");
      if (!query) fetchRecentChats(token, spyUserId).then(setContacts);
    } catch (err) {
      toast.error("خطا در ارسال");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        handleSendMessage();
    }
  };

  // عملیات‌های حذف و بلاک (فقط برای خود کاربر، نه ادمین جاسوس)
  const handleDeleteMessage = async (msgId: number) => {
    if(!confirm("حذف شود؟")) return;
    try { await deleteMessage(msgId, token!); setMessages(prev => prev.filter(m => m.id !== msgId)); } catch {}
  }

  const handleDeleteHistory = async () => {
      if(!selectedContact || !confirm("کل چت پاک شود؟")) return;
      try { await deleteChatHistory(selectedContact.id, token!); setMessages([]); toast.success("پاک شد"); } catch {}
  }

  const handleBlockUser = async () => {
      if(!selectedContact || !confirm("بلاک شود؟")) return;
      try { await blockUser(selectedContact.id, token!); toast.success("بلاک شد"); } catch {}
  }

  const startEdit = (msg: Message) => { setNewMessage(msg.content); setEditingMessageId(msg.id); }
  const cancelEdit = () => { setNewMessage(""); setEditingMessageId(null); }

  useEffect(() => {
    if (!token || !query) return;
    const t = setTimeout(() => {
      setIsSearching(true);
      searchUsers(query, token).then(setContacts).finally(() => setIsSearching(false));
    }, 500);
    return () => clearTimeout(t);
  }, [query, token]);

  if (!token) return null;

  return (
    <Layout>
      {/* نوار هشدار جاسوسی */}
      {spyUserId && (
          <div className="bg-destructive text-destructive-foreground text-center p-2 text-sm font-bold shadow-md z-10">
              ⚠️ حالت نظارت: شما در حال مشاهده پیام‌های کاربر (ID: {spyUserId}) هستید.
          </div>
      )}
      
      {/* بدنه اصلی مسنجر */}
      <div className="flex flex-1 h-full overflow-hidden bg-background">
        
        {/* سایدبار لیست چت‌ها */}
        <div className={`${selectedContact ? 'hidden md:flex' : 'flex'} w-full md:w-80 flex-col border-l bg-muted/30`}>
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="جستجو..." 
                className="pr-9"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>
          <ScrollArea className="flex-1">
            <div className="flex flex-col">
              {isSearching ? <div className="p-4 text-center"><Loader2 className="animate-spin mx-auto"/></div> : 
               contacts.map((contact) => (
                  <div
                    key={contact.id}
                    onClick={() => { setSelectedContact(contact); setQuery(""); }}
                    className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-accent/50 transition-colors border-b ${selectedContact?.id === contact.id ? "bg-accent" : ""}`}
                  >
                    <Avatar><AvatarFallback>{contact.name.slice(0, 1)}</AvatarFallback></Avatar>
                    <div className="flex-1 overflow-hidden">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium text-sm">{contact.name}</span>
                        {contact.timestamp && <span className="text-[10px] text-muted-foreground">{formatDistanceToNow(new Date(contact.timestamp), { addSuffix: false })}</span>}
                      </div>
                      <div className="flex justify-between items-center">
                        <p className={`text-xs truncate max-w-[150px] ${contact.unread_count ? "text-primary font-bold" : "text-muted-foreground"}`}>
                            {contact.last_message || "..."}
                        </p>
                        {contact.unread_count ? (
                            <span className="bg-primary text-primary-foreground text-[10px] w-5 h-5 flex items-center justify-center rounded-full">
                                {contact.unread_count}
                            </span>
                        ) : null}
                      </div>
                    </div>
                  </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* صفحه چت */}
        <div className={`${!selectedContact ? 'hidden md:flex' : 'flex'} flex-1 flex-col bg-slate-50 dark:bg-slate-950/50`}>
          {selectedContact ? (
            <>
              <div className="h-16 border-b flex items-center px-4 bg-background justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSelectedContact(null)}><ArrowLeft className="h-5 w-5" /></Button>
                  <Avatar><AvatarFallback>{selectedContact.name.slice(0,1)}</AvatarFallback></Avatar>
                  <div>
                    <h3 className="font-bold text-sm">{selectedContact.name}</h3>
                    <span className="text-xs text-muted-foreground">@{selectedContact.username}</span>
                  </div>
                </div>
                {/* منو فقط اگر جاسوس نباشیم */}
                {!spyUserId && (
                    <DropdownMenu>
                        <DropdownMenuTrigger><MoreVertical className="h-5 w-5 text-muted-foreground cursor-pointer" /></DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={handleDeleteHistory} className="text-red-600"><Trash2 className="mr-2 h-4 w-4"/> حذف تاریخچه</DropdownMenuItem>
                            <DropdownMenuItem onClick={handleBlockUser} className="text-orange-600"><UserX className="mr-2 h-4 w-4"/> مسدود کردن</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
              </div>

              <ScrollArea className="flex-1 p-4">
                <div className="flex flex-col gap-2 max-w-3xl mx-auto pb-4">
                  {messages.map((msg) => {
                    const isMe = msg.sender === (spyUserId || user?.id); // تشخیص فرستنده در حالت عادی یا جاسوسی
                    
                    return (
                      <div key={msg.id} className={`flex ${isMe ? "justify-start" : "justify-end"} group`}>
                        <div className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm shadow-sm relative ${isMe ? "bg-background border rounded-tr-sm" : "bg-primary text-primary-foreground rounded-tl-sm"}`}>
                          <div className="flex justify-between items-start gap-4">
                              <p className="whitespace-pre-wrap">{msg.content}</p>
                              {isMe && !spyUserId && (
                                  <DropdownMenu>
                                      <DropdownMenuTrigger className="opacity-0 group-hover:opacity-100 transition-opacity">
                                          <MoreVertical className="h-3 w-3 cursor-pointer opacity-50" />
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                          <DropdownMenuItem onClick={() => startEdit(msg)}><Edit2 className="h-3 w-3 mr-2"/> ویرایش</DropdownMenuItem>
                                          <DropdownMenuItem onClick={() => handleDeleteMessage(msg.id)} className="text-red-600"><Trash2 className="h-3 w-3 mr-2"/> حذف</DropdownMenuItem>
                                      </DropdownMenuContent>
                                  </DropdownMenu>
                              )}
                          </div>
                          <span className={`text-[9px] block text-right mt-1 opacity-70`}>
                            {new Date(msg.timestamp).toLocaleTimeString("fa-IR", {hour:'2-digit', minute:'2-digit'})}
                            {isMe && <span className="mr-1">{msg.is_read ? "✓✓" : "✓"}</span>}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={scrollRef} />
                </div>
              </ScrollArea>

              {/* ورودی پیام (غیرفعال در حالت جاسوسی) */}
              {!spyUserId ? (
                  <div className="p-3 border-t bg-background shrink-0">
                    {editingMessageId && (
                        <div className="flex items-center justify-between bg-muted p-2 mb-2 rounded-lg text-xs">
                            <span>در حال ویرایش پیام...</span>
                            <X className="h-4 w-4 cursor-pointer" onClick={cancelEdit} />
                        </div>
                    )}
                    <div className="flex gap-2 max-w-3xl mx-auto">
                      <Input 
                        value={newMessage} 
                        onChange={e => setNewMessage(e.target.value)} 
                        onKeyDown={handleKeyDown} 
                        placeholder={editingMessageId ? "متن جدید..." : "پیام خود را بنویسید..."} 
                        className="rounded-full" 
                      />
                      <Button onClick={() => handleSendMessage()} size="icon" className="rounded-full">
                        {editingMessageId ? <Edit2 className="h-4 w-4" /> : <Send className="h-5 w-5 ml-0.5" />}
                      </Button>
                    </div>
                  </div>
              ) : (
                  <div className="p-4 bg-muted text-center text-muted-foreground text-sm font-bold border-t">
                      🚫 شما در حالت نظارت هستید و امکان ارسال پیام ندارید.
                  </div>
              )}
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
              <MessageCircle className="w-16 h-16 opacity-20 mb-4" />
              <p>یک گفتگو را انتخاب کنید</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Messenger;