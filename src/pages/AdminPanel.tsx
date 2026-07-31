// src/pages/AdminPanel.tsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout/Layout";
import { useAuth } from "@/contexts/AuthContext";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";

import {
  Ban, CheckCircle, Database, Download, Edit, Eye, Loader2,
  Mail, MessageSquare, PlusCircle, RefreshCcw, RotateCcw,
  Save, Search, ShieldAlert, Trash2, UserRound
} from "lucide-react";

import {
  Faculty, Course, Professor,
  fetchFaculties, createFaculty, updateFaculty, deleteFaculty,
  fetchProfessors, createProfessor, updateProfessor, deleteProfessor,
  fetchCourses, createCourse, updateCourse, deleteCourse,
  toggleUserApprovalAPI, setUserActiveStatusAPI,
} from "@/lib/api";

import {
  AdminUserDetail, BackupLog, BackupSettings,
  createDatabaseBackup, downloadDatabaseBackup,
  fetchAdminUsers, fetchBackupLogs, fetchBackupSettings,
  restoreDatabaseBackup, saveBackupSettings,
} from "@/lib/admin-api";


const Info = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="rounded-xl border bg-muted/20 p-3">
    <p className="text-[11px] text-muted-foreground">{label}</p>
    <div className="mt-1 break-words text-sm font-bold">{value || "—"}</div>
  </div>
);


const UserManagementTab = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState<AdminUserDetail[]>([]);
  const [selected, setSelected] = useState<AdminUserDetail | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!token) return;
    setLoading(true);
    try {
      setUsers(await fetchAdminUsers(token));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [token]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) =>
      `${u.first_name} ${u.last_name}`.toLowerCase().includes(q) ||
      u.username?.toLowerCase().includes(q) ||
      u.student_id?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.phone_number?.toLowerCase().includes(q) ||
      u.messenger_id?.toLowerCase().includes(q)
    );
  }, [users, search]);

  const toggleApproval = async (user: AdminUserDetail) => {
    if (!token) return;
    try {
      // endpoint قبلی profile id می‌خواست؛ در نسخه جدید admin-users profile id نداریم.
      // بنابراین از student user data دوباره profile را از endpoint عمومی می‌گیریم.
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:8000"}/api/users/${user.id}/`, {
        headers: { Authorization: `Token ${token}` },
      });
      const data = await response.json();
      if (!data?.profile?.id) throw new Error("profile id missing");
      await toggleUserApprovalAPI(data.profile.id, !user.is_approved, token);
      load();
    } catch {
      alert("تغییر وضعیت تأیید ناموفق بود.");
    }
  };

  const toggleActive = async (user: AdminUserDetail) => {
    if (!token) return;
    try {
      await setUserActiveStatusAPI(user.id, !user.is_active, token);
      load();
    } catch {
      alert("تغییر وضعیت حساب ناموفق بود.");
    }
  };

  if (loading) return <div className="grid min-h-48 place-items-center"><Loader2 className="animate-spin" /></div>;

  return (
    <>
      <Card className="rounded-[1.75rem]">
        <CardHeader className="gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-2xl">مدیریت کاربران ({users.length})</CardTitle>
            <p className="mt-1 text-xs text-muted-foreground">برای مشاهده جزئیات کامل روی نام کاربر کلیک کن.</p>
          </div>
          <div className="relative w-full sm:w-80">
            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="نام، ایمیل، موبایل، شماره دانشجویی..." className="h-11 rounded-xl pr-9" />
          </div>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-right text-sm">
              <thead className="bg-muted/60 text-xs">
                <tr>
                  <th className="px-4 py-3">نام</th>
                  <th className="px-4 py-3">شماره دانشجویی</th>
                  <th className="px-4 py-3">رشته</th>
                  <th className="px-4 py-3">ایمیل</th>
                  <th className="px-4 py-3">تأیید</th>
                  <th className="px-4 py-3">حساب</th>
                  <th className="px-4 py-3">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr key={u.id} className="border-b transition hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <button onClick={() => setSelected(u)} className="font-black text-blue-600 hover:underline dark:text-blue-400">
                        {u.first_name} {u.last_name}
                      </button>
                    </td>
                    <td className="px-4 py-3">{u.student_id || u.username}</td>
                    <td className="px-4 py-3">{u.major || "—"}</td>
                    <td className="max-w-56 truncate px-4 py-3" dir="ltr">{u.email || "—"}</td>
                    <td className="px-4 py-3">
                      <Badge className={u.is_approved ? "bg-emerald-500" : "bg-amber-500"}>
                        {u.is_approved ? "تأیید شده" : "در انتظار"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={u.is_active ? "outline" : "destructive"}>{u.is_active ? "فعال" : "غیرفعال"}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <Button variant="outline" size="icon" title="جزئیات" onClick={() => setSelected(u)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" title={u.is_approved ? "لغو تأیید" : "تأیید"} onClick={() => toggleApproval(u)}>
                          {u.is_approved ? <ShieldAlert className="h-4 w-4 text-amber-500" /> : <CheckCircle className="h-4 w-4 text-emerald-500" />}
                        </Button>
                        <Button variant="ghost" size="icon" title={u.is_active ? "غیرفعال کردن" : "فعال کردن"} onClick={() => toggleActive(u)}>
                          {u.is_active ? <Ban className="h-4 w-4 text-red-500" /> : <CheckCircle className="h-4 w-4 text-emerald-500" />}
                        </Button>
                        <Link to={`/messenger?spy_id=${u.id}`} target="_blank">
                          <Button variant="secondary" size="icon" title="مشاهده پیام‌های کاربر">
                            <MessageSquare className="h-4 w-4 text-blue-600" />
                          </Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <UserRound className="h-5 w-5 text-blue-600" />
              جزئیات کاربر
            </DialogTitle>
          </DialogHeader>

          {selected && (
            <div className="grid gap-3 py-2 sm:grid-cols-2 lg:grid-cols-3">
              <Info label="نام کامل" value={`${selected.first_name} ${selected.last_name}`} />
              <Info label="شماره دانشجویی" value={selected.student_id || selected.username} />
              <Info label="ایمیل" value={<span dir="ltr">{selected.email || "—"}</span>} />
              <Info label="ایمیل تأیید شده" value={selected.email_verified ? "بله" : "خیر"} />
              <Info label="شماره موبایل" value={<span dir="ltr">{selected.phone_number || "—"}</span>} />
              <Info label="رشته" value={selected.major} />
              <Info label="دانشکده" value={selected.faculty_name} />
              <Info label="آیدی پیام‌رسان" value={selected.messenger_id ? `@${selected.messenger_id}` : "—"} />
              <Info label="Bio پیام‌رسان" value={selected.messenger_bio} />
              <Info label="حساب" value={selected.is_active ? "فعال" : "غیرفعال"} />
              <Info label="سطح دسترسی" value={selected.is_supervisor ? "مدیر / Supervisor" : "کاربر"} />
              <Info label="وضعیت تأیید" value={selected.is_approved ? "تأیید شده" : "در انتظار"} />
              <Info label="قابل جستجو در پیام‌رسان" value={selected.messenger_searchable ? "بله" : "خیر"} />
              <Info label="دریافت پیام جدید" value={selected.allow_new_messages ? "بله" : "خیر"} />
              <Info label="عضویت" value={new Date(selected.date_joined).toLocaleString("fa-IR")} />
              <Info label="آخرین ورود" value={selected.last_login ? new Date(selected.last_login).toLocaleString("fa-IR") : "—"} />
              <Info label="آخرین فعالیت پیام‌رسان" value={selected.last_seen ? new Date(selected.last_seen).toLocaleString("fa-IR") : "—"} />
            </div>
          )}

          <DialogFooter className="gap-2">
            {selected && (
              <Button asChild variant="secondary">
                <Link to={`/messenger?spy_id=${selected.id}`} target="_blank">
                  <MessageSquare className="ml-2 h-4 w-4" />
                  مشاهده چت‌ها
                </Link>
              </Button>
            )}
            <DialogClose asChild><Button variant="outline">بستن</Button></DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};


const FacultyManagementTab = () => {
  const { token } = useAuth();
  const [items, setItems] = useState<Faculty[]>([]);
  const [current, setCurrent] = useState<Partial<Faculty> | null>(null);

  const load = () => fetchFaculties().then(setItems);
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!token || !current?.name) return;
    if (current.id) await updateFaculty(current.id, current.name, token);
    else await createFaculty(current.name, token);
    setCurrent(null); load();
  };

  return (
    <Card className="rounded-[1.75rem]">
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>مدیریت دانشکده‌ها</CardTitle>
        <Button onClick={() => setCurrent({ name: "" })}><PlusCircle className="ml-2 h-4 w-4" /> جدید</Button>
      </CardHeader>
      <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between rounded-xl border p-4">
            <b>{item.name}</b>
            <div>
              <Button variant="ghost" size="icon" onClick={() => setCurrent(item)}><Edit className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" onClick={async()=>{if(token && confirm("حذف شود؟")){await deleteFaculty(item.id,token);load();}}}><Trash2 className="h-4 w-4 text-red-500" /></Button>
            </div>
          </div>
        ))}
      </CardContent>
      <Dialog open={!!current} onOpenChange={(o)=>!o&&setCurrent(null)}>
        <DialogContent><DialogHeader><DialogTitle>دانشکده</DialogTitle></DialogHeader>
          <Label>نام</Label><Input value={current?.name||""} onChange={e=>setCurrent({...current,name:e.target.value})}/>
          <DialogFooter><DialogClose asChild><Button variant="outline">لغو</Button></DialogClose><Button onClick={save}>ذخیره</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};


const ProfessorManagementTab = () => {
  const { token } = useAuth();
  const [items, setItems] = useState<Professor[]>([]);
  const [current, setCurrent] = useState<Partial<Professor> | null>(null);

  const load = () => fetchProfessors().then(setItems);
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!token || !current?.name) return;
    if (current.id) await updateProfessor(current.id, current.name, token);
    else await createProfessor(current.name, token);
    setCurrent(null); load();
  };

  return (
    <Card className="rounded-[1.75rem]">
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>مدیریت اساتید</CardTitle>
        <Button onClick={() => setCurrent({ name: "" })}><PlusCircle className="ml-2 h-4 w-4" /> جدید</Button>
      </CardHeader>
      <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between rounded-xl border p-4">
            <b>{item.name}</b>
            <div>
              <Button variant="ghost" size="icon" onClick={() => setCurrent(item)}><Edit className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" onClick={async()=>{if(token && confirm("حذف شود؟")){await deleteProfessor(item.id,token);load();}}}><Trash2 className="h-4 w-4 text-red-500" /></Button>
            </div>
          </div>
        ))}
      </CardContent>
      <Dialog open={!!current} onOpenChange={(o)=>!o&&setCurrent(null)}>
        <DialogContent><DialogHeader><DialogTitle>استاد</DialogTitle></DialogHeader>
          <Label>نام</Label><Input value={current?.name||""} onChange={e=>setCurrent({...current,name:e.target.value})}/>
          <DialogFooter><DialogClose asChild><Button variant="outline">لغو</Button></DialogClose><Button onClick={save}>ذخیره</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};


const CourseManagementTab = () => {
  const { token } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [current, setCurrent] = useState<any>(null);

  const load = async () => {
    const [c,f,p] = await Promise.all([fetchCourses(),fetchFaculties(),fetchProfessors()]);
    setCourses(c); setFaculties(f); setProfessors(p);
  };
  useEffect(()=>{load();},[]);

  const save = async () => {
    if(!token || !current?.title || !current?.faculty || !current?.professor) return alert("فیلدهای اجباری را کامل کن.");
    const payload={title:current.title,description:current.description||"",faculty:Number(current.faculty),professor:Number(current.professor)};
    if(current.id) await updateCourse(current.id,payload,token); else await createCourse(payload,token);
    setCurrent(null); load();
  };

  return (
    <Card className="rounded-[1.75rem]">
      <CardHeader className="flex-row items-center justify-between"><CardTitle>مدیریت دوره‌ها</CardTitle><Button onClick={()=>setCurrent({title:"",description:""})}><PlusCircle className="ml-2 h-4 w-4"/> جدید</Button></CardHeader>
      <CardContent className="space-y-3">
        {courses.map(c=><div key={c.id} className="flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between">
          <div><b>{c.title}</b><p className="text-xs text-muted-foreground">{c.faculty?.name} — {c.professor?.name}</p></div>
          <div><Button variant="ghost" size="icon" onClick={()=>setCurrent({id:c.id,title:c.title,description:c.description,faculty:c.faculty?.id,professor:c.professor?.id})}><Edit className="h-4 w-4"/></Button><Button variant="ghost" size="icon" onClick={async()=>{if(token&&confirm("حذف شود؟")){await deleteCourse(c.id,token);load();}}}><Trash2 className="h-4 w-4 text-red-500"/></Button></div>
        </div>)}
      </CardContent>
      <Dialog open={!!current} onOpenChange={o=>!o&&setCurrent(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>دوره</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>عنوان</Label><Input value={current?.title||""} onChange={e=>setCurrent({...current,title:e.target.value})}/></div>
            <div><Label>توضیحات</Label><Textarea value={current?.description||""} onChange={e=>setCurrent({...current,description:e.target.value})}/></div>
            <div><Label>دانشکده</Label><Select value={current?.faculty?String(current.faculty):""} onValueChange={v=>setCurrent({...current,faculty:Number(v)})}><SelectTrigger><SelectValue placeholder="انتخاب"/></SelectTrigger><SelectContent>{faculties.map(f=><SelectItem key={f.id} value={String(f.id)}>{f.name}</SelectItem>)}</SelectContent></Select></div>
            <div><Label>استاد</Label><Select value={current?.professor?String(current.professor):""} onValueChange={v=>setCurrent({...current,professor:Number(v)})}><SelectTrigger><SelectValue placeholder="انتخاب"/></SelectTrigger><SelectContent>{professors.map(p=><SelectItem key={p.id} value={String(p.id)}>{p.name}</SelectItem>)}</SelectContent></Select></div>
          </div>
          <DialogFooter><DialogClose asChild><Button variant="outline">لغو</Button></DialogClose><Button onClick={save}>ذخیره</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};


const BackupManagementTab = () => {
  const { token } = useAuth();
  const [settings, setSettings] = useState<BackupSettings | null>(null);
  const [logs, setLogs] = useState<BackupLog[]>([]);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    if(!token) return;
    const [s,l] = await Promise.all([fetchBackupSettings(token),fetchBackupLogs(token)]);
    setSettings(s); setLogs(l);
  };
  useEffect(()=>{load();},[token]);

  const saveSettings = async () => {
    if(!token || !settings) return;
    setBusy(true);
    try { setSettings(await saveBackupSettings(token,settings)); alert("تنظیمات ذخیره شد."); }
    finally { setBusy(false); }
  };

  const manualBackup = async (emailCopy:boolean) => {
    if(!token) return;
    setBusy(true);
    try {
      const log=await createDatabaseBackup(token,emailCopy);
      alert(log.status==="success" ? "بکاپ ساخته شد." : log.message);
      load();
    } catch(e){alert(e instanceof Error?e.message:"خطا در بکاپ");}
    finally{setBusy(false);}
  };

  const restore = async (log:BackupLog) => {
    if(!token || !log.filename) return;
    const text=prompt(`این عملیات دیتابیس فعلی را با ${log.filename} جایگزین می‌کند.\nبرای ادامه دقیقاً RESTORE بنویس:`);
    if(text!=="RESTORE") return;
    setBusy(true);
    try{await restoreDatabaseBackup(token,log.filename);alert("بازیابی انجام شد. بهتر است backend را restart کنی.");load();}
    catch(e){alert(e instanceof Error?e.message:"بازیابی ناموفق بود.");}
    finally{setBusy(false);}
  };

  if(!settings) return <div className="grid min-h-48 place-items-center"><Loader2 className="animate-spin"/></div>;

  return <div className="space-y-6">
    <Card className="rounded-[1.75rem]">
      <CardHeader><CardTitle className="flex items-center gap-2"><Database className="h-5 w-5 text-blue-600"/> تنظیمات بکاپ دیتابیس</CardTitle></CardHeader>
      <CardContent className="grid gap-4 lg:grid-cols-2">
        <div>
          <Label>ایمیل پشتیبان</Label>
          <Input type="email" dir="ltr" className="mt-2 h-11 rounded-xl" value={settings.support_email} onChange={e=>setSettings({...settings,support_email:e.target.value})} placeholder="backup@example.com"/>
        </div>
        <div>
          <Label>فاصله بکاپ خودکار (ساعت)</Label>
          <Input type="number" min={1} max={168} className="mt-2 h-11 rounded-xl" value={settings.interval_hours} onChange={e=>setSettings({...settings,interval_hours:Number(e.target.value)})}/>
        </div>
        <div>
          <Label>تعداد بکاپ محلی</Label>
          <Input type="number" min={1} max={100} className="mt-2 h-11 rounded-xl" value={settings.keep_last} onChange={e=>setSettings({...settings,keep_last:Number(e.target.value)})}/>
        </div>

        <div className="space-y-3 rounded-2xl border p-4">
          <label className="flex items-center justify-between gap-4"><span><b>بکاپ خودکار</b><small className="block text-muted-foreground">worker هر دقیقه بررسی می‌کند و طبق فاصله تعیین‌شده بکاپ می‌گیرد.</small></span><input type="checkbox" checked={settings.auto_backup_enabled} onChange={e=>setSettings({...settings,auto_backup_enabled:e.target.checked})} className="h-5 w-5 accent-blue-600"/></label>
          <label className="flex items-center justify-between gap-4"><span><b>ارسال فایل بکاپ با ایمیل</b><small className="block text-muted-foreground">برای بکاپ‌های خودکار به ایمیل پشتیبان ارسال می‌شود.</small></span><input type="checkbox" checked={settings.email_backup_enabled} onChange={e=>setSettings({...settings,email_backup_enabled:e.target.checked})} className="h-5 w-5 accent-blue-600"/></label>
        </div>

        <div className="flex flex-wrap gap-2 lg:col-span-2">
          <Button onClick={saveSettings} disabled={busy}><Save className="ml-2 h-4 w-4"/> ذخیره تنظیمات</Button>
          <Button variant="secondary" onClick={()=>manualBackup(false)} disabled={busy}><Database className="ml-2 h-4 w-4"/> بکاپ همین الان</Button>
          <Button variant="outline" onClick={()=>manualBackup(true)} disabled={busy}><Mail className="ml-2 h-4 w-4"/> بکاپ + ارسال ایمیل</Button>
          <Button variant="ghost" onClick={load}><RefreshCcw className="ml-2 h-4 w-4"/> تازه‌سازی</Button>
        </div>
      </CardContent>
    </Card>

    <Card className="rounded-[1.75rem]">
      <CardHeader><CardTitle>لاگ بکاپ‌ها</CardTitle></CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-right text-sm">
            <thead className="bg-muted/60 text-xs"><tr><th className="px-3 py-3">زمان</th><th className="px-3 py-3">نوع</th><th className="px-3 py-3">وضعیت</th><th className="px-3 py-3">فایل</th><th className="px-3 py-3">حجم</th><th className="px-3 py-3">ایمیل</th><th className="px-3 py-3">پیام</th><th className="px-3 py-3">عملیات</th></tr></thead>
            <tbody>
              {logs.map(log=><tr key={log.id} className="border-b">
                <td className="px-3 py-3">{new Date(log.started_at).toLocaleString("fa-IR")}</td>
                <td className="px-3 py-3">{log.backup_type}</td>
                <td className="px-3 py-3"><Badge className={log.status==="success"?"bg-emerald-500":log.status==="failed"?"bg-red-500":"bg-amber-500"}>{log.status}</Badge></td>
                <td className="max-w-52 truncate px-3 py-3" dir="ltr">{log.filename||"—"}</td>
                <td className="px-3 py-3">{log.size_mb} MB</td>
                <td className="px-3 py-3">{log.email_sent?"ارسال شد":log.email_to?"ارسال نشد":"—"}</td>
                <td className="max-w-72 truncate px-3 py-3" title={log.message}>{log.message||"—"}</td>
                <td className="px-3 py-3"><div className="flex gap-1">
                  {log.status==="success" && log.filename && <Button variant="outline" size="icon" title="دانلود" onClick={()=>token&&downloadDatabaseBackup(token,log)}><Download className="h-4 w-4"/></Button>}
                  {log.status==="success" && log.filename && log.backup_type!=="restore" && <Button variant="ghost" size="icon" title="بازیابی این بکاپ" onClick={()=>restore(log)}><RotateCcw className="h-4 w-4 text-amber-600"/></Button>}
                </div></td>
              </tr>)}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  </div>;
};


const AdminPanel = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <Layout><div className="p-8 text-center">در حال بررسی دسترسی...</div></Layout>;
  if (!user?.profile?.is_supervisor) return <Layout><div className="p-8 text-center font-bold text-red-500">شما دسترسی ندارید.</div></Layout>;

  return (
    <Layout>
      <div dir="rtl" className="space-y-7 py-2">
        <div>
          <p className="text-xs font-black text-blue-600">ADMIN CENTER</p>
          <h1 className="mt-1 text-3xl font-black">پنل مدیریت</h1>
          <p className="mt-2 text-sm text-muted-foreground">کاربران، ساختار آموزشی و پشتیبان‌گیری دیتابیس را از یکجا مدیریت کن.</p>
        </div>

        <Tabs defaultValue="users">
          <TabsList className="grid h-auto w-full grid-cols-2 gap-1 rounded-2xl p-1 md:grid-cols-5">
            <TabsTrigger value="users">کاربران</TabsTrigger>
            <TabsTrigger value="faculties">دانشکده‌ها</TabsTrigger>
            <TabsTrigger value="professors">اساتید</TabsTrigger>
            <TabsTrigger value="courses">دوره‌ها</TabsTrigger>
            <TabsTrigger value="backups">بکاپ</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="mt-6"><UserManagementTab /></TabsContent>
          <TabsContent value="faculties" className="mt-6"><FacultyManagementTab /></TabsContent>
          <TabsContent value="professors" className="mt-6"><ProfessorManagementTab /></TabsContent>
          <TabsContent value="courses" className="mt-6"><CourseManagementTab /></TabsContent>
          <TabsContent value="backups" className="mt-6"><BackupManagementTab /></TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AdminPanel;
