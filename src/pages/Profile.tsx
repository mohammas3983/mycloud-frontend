// src/pages/Profile.tsx
import { useEffect, useState } from "react";
import Layout from "@/components/Layout/Layout";
import PageShell from "@/components/Layout/PageShell";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Faculty, fetchFaculties, updateUserProfile } from "@/lib/api";
import {
  getMessengerProfile,
  MessengerProfile,
  updateMessengerProfile,
} from "@/lib/messenger-api";
import { Loader2, MessageCircle, Save, ShieldCheck, UserRound } from "lucide-react";

const ToggleRow = ({
  title, description, checked, onChange,
}: {
  title: string; description: string; checked: boolean; onChange: (v: boolean) => void;
}) => (
  <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border p-4">
    <div>
      <p className="font-bold">{title}</p>
      <p className="mt-1 text-xs leading-6 text-muted-foreground">{description}</p>
    </div>
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="h-5 w-5 accent-blue-600"
    />
  </label>
);

const ProfilePage = () => {
  const { user, token, isLoading: authLoading, refreshUser } = useAuth();
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [saving, setSaving] = useState(false);
  const [messengerSaving, setMessengerSaving] = useState(false);
  const [messenger, setMessenger] = useState<MessengerProfile | null>(null);

  const [form, setForm] = useState({
    first_name: "", last_name: "", email: "", major: "", phone_number: "", faculty: 0,
  });

  useEffect(() => {
    if (user) {
      setForm({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        major: user.profile?.major || "",
        phone_number: user.profile?.phone_number || "",
        faculty: user.profile?.faculty || 0,
      });
    }
    fetchFaculties().then(setFaculties).catch(console.error);
  }, [user]);

  useEffect(() => {
    if (token) getMessengerProfile(token).then(setMessenger).catch(console.error);
  }, [token]);

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setSaving(true);
    try {
      await updateUserProfile({
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        profile: {
          major: form.major,
          phone_number: form.phone_number,
          faculty: form.faculty,
        },
      }, token);
      await refreshUser();
      alert("پروفایل ذخیره شد.");
    } catch {
      alert("ذخیره پروفایل ناموفق بود.");
    } finally {
      setSaving(false);
    }
  };

  const saveMessenger = async () => {
    if (!token || !messenger) return;
    setMessengerSaving(true);
    try {
      const updated = await updateMessengerProfile(token, messenger);
      setMessenger(updated);
      alert("تنظیمات پیام‌رسان ذخیره شد.");
    } catch (error) {
      alert(error instanceof Error ? error.message : "ذخیره تنظیمات ناموفق بود.");
    } finally {
      setMessengerSaving(false);
    }
  };

  if (authLoading || !user) {
    return <Layout><div className="grid min-h-[60vh] place-items-center"><Loader2 className="h-8 w-8 animate-spin" /></div></Layout>;
  }

  return (
    <Layout>
      <PageShell
        eyebrow="حساب کاربری"
        title="پروفایل و حریم خصوصی"
        subtitle="اطلاعات دانشگاهی و تنظیمات پیام‌رسان را از اینجا مدیریت کن."
        icon={<UserRound className="h-7 w-7" />}
      >
        <div className="grid gap-6 xl:grid-cols-2">
          <Card className="rounded-[1.75rem]">
            <CardContent className="p-6">
              <h2 className="text-xl font-black">اطلاعات حساب</h2>
              <form onSubmit={saveProfile} className="mt-6 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div><Label>نام</Label><Input className="mt-2 h-11 rounded-xl" value={form.first_name} onChange={(e)=>setForm({...form,first_name:e.target.value})}/></div>
                  <div><Label>نام خانوادگی</Label><Input className="mt-2 h-11 rounded-xl" value={form.last_name} onChange={(e)=>setForm({...form,last_name:e.target.value})}/></div>
                </div>
                <div><Label>شماره دانشجویی / شناسه ورود</Label><Input className="mt-2 h-11 rounded-xl" value={user.username} disabled /></div>
                <div><Label>ایمیل</Label><Input type="email" className="mt-2 h-11 rounded-xl" value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})}/></div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div><Label>رشته</Label><Input className="mt-2 h-11 rounded-xl" value={form.major} onChange={(e)=>setForm({...form,major:e.target.value})}/></div>
                  <div><Label>شماره موبایل</Label><Input className="mt-2 h-11 rounded-xl" value={form.phone_number} onChange={(e)=>setForm({...form,phone_number:e.target.value})}/></div>
                </div>
                <div>
                  <Label>دانشکده</Label>
                  <Select value={form.faculty ? String(form.faculty) : ""} onValueChange={(v)=>setForm({...form,faculty:Number(v)})}>
                    <SelectTrigger className="mt-2 h-11 rounded-xl"><SelectValue placeholder="انتخاب دانشکده"/></SelectTrigger>
                    <SelectContent>{faculties.map(f=><SelectItem key={f.id} value={String(f.id)}>{f.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <Button disabled={saving} className="h-11 rounded-xl bg-blue-600 font-bold hover:bg-blue-700">
                  {saving ? <Loader2 className="ml-2 h-4 w-4 animate-spin"/> : <Save className="ml-2 h-4 w-4"/>}
                  ذخیره اطلاعات
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="rounded-[1.75rem]">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-500/10">
                  <MessageCircle className="h-6 w-6"/>
                </div>
                <div>
                  <h2 className="text-xl font-black">پیام‌رسان</h2>
                  <p className="text-xs text-muted-foreground">این نام کاربری فقط داخل پیام‌رسان کاربرد دارد.</p>
                </div>
              </div>

              {!messenger ? <Loader2 className="mx-auto mt-10 animate-spin"/> : (
                <div className="mt-6 space-y-4">
                  <div>
                    <Label>نام کاربری پیام‌رسان</Label>
                    <div className="relative mt-2">
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">@</span>
                      <Input className="h-11 rounded-xl pr-8" value={messenger.messenger_id || ""} onChange={(e)=>setMessenger({...messenger,messenger_id:e.target.value.replace(/^@/,"")})} placeholder="مثلاً mohammad"/>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">۳ تا ۳۲ کاراکتر؛ حروف انگلیسی، عدد و _</p>
                  </div>

                  <div>
                    <Label>Bio</Label>
                    <Input className="mt-2 h-11 rounded-xl" maxLength={160} value={messenger.messenger_bio || ""} onChange={(e)=>setMessenger({...messenger,messenger_bio:e.target.value})} placeholder="یک توضیح کوتاه درباره خودت"/>
                  </div>

                  <ToggleRow title="قابل پیدا شدن در پیام‌رسان" description="دیگران با نام، @username یا چند حرف اول بخش قبل از @ ایمیلت پیدایت کنند." checked={messenger.messenger_searchable} onChange={(v)=>setMessenger({...messenger,messenger_searchable:v})}/>
                  <ToggleRow title="دریافت پیام از افراد جدید" description="اگر خاموش باشد فقط گفتگوهای قبلی می‌توانند ادامه پیدا کنند." checked={messenger.allow_new_messages} onChange={(v)=>setMessenger({...messenger,allow_new_messages:v})}/>
                  <ToggleRow title="نمایش آخرین بازدید" description="آخرین فعالیتت برای دیگران نمایش داده شود." checked={messenger.show_online_status} onChange={(v)=>setMessenger({...messenger,show_online_status:v})}/>
                  <ToggleRow title="نمایش ایمیل در پروفایل پیام‌رسان" description="پیشنهاد ما خاموش ماندن این گزینه است." checked={messenger.show_email_in_messenger} onChange={(v)=>setMessenger({...messenger,show_email_in_messenger:v})}/>

                  <div className="rounded-2xl bg-blue-50 p-4 text-sm leading-7 text-blue-900 dark:bg-blue-500/10 dark:text-blue-100">
                    <ShieldCheck className="ml-2 inline h-4 w-4"/>
                    ایمیل برای جستجو قابل استفاده است، اما تا وقتی گزینه نمایش ایمیل روشن نباشد در پروفایل عمومی نشان داده نمی‌شود.
                  </div>

                  <Button onClick={saveMessenger} disabled={messengerSaving} className="h-11 rounded-xl bg-slate-950 font-bold text-white hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-700">
                    {messengerSaving && <Loader2 className="ml-2 h-4 w-4 animate-spin"/>}
                    ذخیره تنظیمات پیام‌رسان
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </PageShell>
    </Layout>
  );
};

export default ProfilePage;
