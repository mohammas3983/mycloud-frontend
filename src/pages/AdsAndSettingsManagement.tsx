import { FormEvent, useEffect, useState } from "react";
import { Loader2, PlusCircle, Save, Settings2, Trash2 } from "lucide-react";
import { API_BASE_URL } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type AdminAd = {
  id: number;
  title: string;
  link_url: string;
  media_url: string | null;
  media_type: "image" | "gif" | "video";
  is_active: boolean;
  show_on_course_list: boolean;
  show_on_course_detail: boolean;
  show_before_content: boolean;
  show_on_dashboard: boolean;
  priority: number;
  closeable: boolean;
  dismiss_for_hours: number;
};

type SiteSettings = {
  chat_enabled: boolean;
  comments_enabled: boolean;
  comments_require_approval: boolean;
};

const auth = (token: string) => ({ Authorization: `Token ${token}` });

export default function AdsAndSettingsManagement() {
  const { token } = useAuth();
  const [ads, setAds] = useState<AdminAd[]>([]);
  const [settings, setSettings] = useState<SiteSettings>({
    chat_enabled: true,
    comments_enabled: true,
    comments_require_approval: false,
  });
  const [loading, setLoading] = useState(true);
  const [savingAd, setSavingAd] = useState(false);

  const load = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [adsResponse, settingsResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/api/advertisement-admin/`, { headers: auth(token) }),
        fetch(`${API_BASE_URL}/api/site-settings-admin/settings/`, { headers: auth(token) }),
      ]);
      setAds(await adsResponse.json());
      setSettings(await settingsResponse.json());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [token]);

  const saveSettings = async () => {
    if (!token) return;
    const response = await fetch(`${API_BASE_URL}/api/site-settings-admin/settings/`, {
      method: "PATCH",
      headers: { ...auth(token), "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    if (!response.ok) throw new Error("settings failed");
    alert("تنظیمات ذخیره شد.");
  };

 const createAd = async (event: FormEvent<HTMLFormElement>) => {
  event.preventDefault();

  if (!token) return;

  const formElement = event.currentTarget;
  const formData = new FormData(formElement);

  setSavingAd(true);

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/advertisement-admin/`,
      {
        method: "POST",
        headers: auth(token),
        body: formData,
      },
    );

    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || "ثبت تبلیغ ناموفق بود.");
    }

    formElement.reset();
    await load();
  } catch (error) {
    alert(
      error instanceof Error
        ? error.message
        : "ثبت تبلیغ ناموفق بود.",
    );
  } finally {
    setSavingAd(false);
  }
};

  const toggleAd = async (ad: AdminAd) => {
    if (!token) return;
    await fetch(`${API_BASE_URL}/api/advertisement-admin/${ad.id}/`, {
      method: "PATCH",
      headers: { ...auth(token), "Content-Type": "application/json" },
      body: JSON.stringify({ is_active: !ad.is_active }),
    });
    load();
  };

  const removeAd = async (id: number) => {
    if (!token || !confirm("تبلیغ حذف شود؟")) return;
    await fetch(`${API_BASE_URL}/api/advertisement-admin/${id}/`, {
      method: "DELETE",
      headers: auth(token),
    });
    load();
  };

  if (loading) {
    return <div className="grid min-h-48 place-items-center"><Loader2 className="animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <Card className="rounded-[1.75rem]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings2 className="h-5 w-5 text-blue-600" />
            تنظیمات عمومی
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            ["chat_enabled", "فعال بودن چت برای همه کاربران"],
            ["comments_enabled", "فعال بودن کامنت درس‌ها"],
            ["comments_require_approval", "تأیید کامنت قبل از نمایش"],
          ].map(([key, label]) => (
            <label key={key} className="flex items-center justify-between rounded-xl border p-4">
              <span className="font-bold">{label}</span>
              <input
                type="checkbox"
                className="h-5 w-5"
                checked={Boolean(settings[key as keyof SiteSettings])}
                onChange={(event) =>
                  setSettings({ ...settings, [key]: event.target.checked })
                }
              />
            </label>
          ))}
          <Button onClick={saveSettings} className="rounded-xl">
            <Save className="ml-2 h-4 w-4" />
            ذخیره تنظیمات
          </Button>
        </CardContent>
      </Card>

      <Card className="rounded-[1.75rem]">
        <CardHeader><CardTitle>تبلیغ جدید</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={createAd} className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>عنوان</Label>
              <Input name="title" required className="mt-2" />
            </div>
            <div>
              <Label>لینک مقصد</Label>
              <Input name="link_url" type="url" className="mt-2" />
            </div>
            <div>
              <Label>فایل عکس، GIF یا ویدیو</Label>
              <Input name="media" type="file" accept="image/*,video/mp4,video/webm" required className="mt-2" />
            </div>
            <div>
              <Label>نوع رسانه</Label>
              <select name="media_type" className="mt-2 h-10 w-full rounded-md border bg-background px-3">
                <option value="image">تصویر</option>
                <option value="gif">GIF</option>
                <option value="video">ویدیو</option>
              </select>
            </div>
            <div>
              <Label>اولویت</Label>
              <Input name="priority" type="number" defaultValue="0" className="mt-2" />
            </div>
            <div>
              <Label>عدم نمایش مجدد پس از بستن (ساعت)</Label>
              <Input name="dismiss_for_hours" type="number" defaultValue="12" min="1" className="mt-2" />
            </div>

            <div className="md:col-span-2 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ["show_on_course_list", "فهرست درس‌ها"],
                ["show_on_course_detail", "صفحه درس"],
                ["show_before_content", "قبل محتوای درس"],
                ["show_on_dashboard", "داشبورد"],
              ].map(([name, label]) => (
                <label key={name} className="flex items-center gap-2 rounded-xl border p-3">
                  <input type="checkbox" name={name} value="true" />
                  <span>{label}</span>
                </label>
              ))}
            </div>

            <input type="hidden" name="is_active" value="true" />
            <input type="hidden" name="closeable" value="true" />

            <Button disabled={savingAd} className="w-fit rounded-xl">
              <PlusCircle className="ml-2 h-4 w-4" />
              {savingAd ? "در حال ثبت..." : "ثبت تبلیغ"}
            </Button>
          </form>
          <p className="mt-3 text-xs text-muted-foreground">
            برای ویدیو، فایل کوتاه و سبک حداکثر حدود ۴ ثانیه استفاده کن. پخش بدون صدا انجام می‌شود.
          </p>
        </CardContent>
      </Card>

      <Card className="rounded-[1.75rem]">
        <CardHeader><CardTitle>تبلیغ‌های ثبت‌شده</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {ads.map((ad) => (
            <div key={ad.id} className="flex flex-col gap-3 rounded-2xl border p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                {ad.media_url && ad.media_type !== "video" && (
                  <img src={ad.media_url} alt="" className="h-16 w-24 rounded-xl object-cover" />
                )}
                <div>
                  <p className="font-black">{ad.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {ad.is_active ? "فعال" : "غیرفعال"} · اولویت {ad.priority}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => toggleAd(ad)}>
                  {ad.is_active ? "غیرفعال کن" : "فعال کن"}
                </Button>
                <Button variant="ghost" size="icon" onClick={() => removeAd(ad.id)}>
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </div>
          ))}
          {!ads.length && <p className="text-sm text-muted-foreground">هنوز تبلیغی ثبت نشده.</p>}
        </CardContent>
      </Card>
    </div>
  );
}



