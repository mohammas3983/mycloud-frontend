// src/pages/About.tsx
import { useState } from "react";
import Layout from "@/components/Layout/Layout";
import PageShell from "@/components/Layout/PageShell";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Cloud, Code2, Github, HeartHandshake, Send, Sparkles, TicketCheck, UserRound
} from "lucide-react";
import { createSupportTicket, SupportTicket } from "@/lib/messenger-api";

const About = () => {
  const { token } = useAuth();
  const [category, setCategory] = useState<SupportTicket["category"]>("technical");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const sendTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      alert("برای ارسال تیکت ابتدا وارد حساب شوید.");
      return;
    }
    if (!subject.trim() || !message.trim()) return;

    setSending(true);
    try {
      await createSupportTicket({ category, subject: subject.trim(), message: message.trim() }, token);
      setSubject("");
      setMessage("");
      alert("تیکت ثبت شد. پاسخ را از بخش پشتیبانی پیام‌رسان می‌توانی دنبال کنی.");
    } catch (error) {
      alert(error instanceof Error ? error.message : "ارسال تیکت ناموفق بود.");
    } finally {
      setSending(false);
    }
  };

  return (
    <Layout>
      <PageShell
        eyebrow="درباره پروژه"
        title="درباره myCloud"
        subtitle="یک پروژه دانشجویی برای دسترسی آسان و منظم به منابع آموزشی دانشگاه."
        icon={<Cloud className="h-7 w-7" />}
      >
        <div className="space-y-6">
          <Card className="overflow-hidden rounded-[2rem] border-slate-800 bg-gradient-to-br from-slate-950 via-blue-950 to-blue-700 text-white shadow-xl">
            <CardContent className="relative p-7 sm:p-10">
              <div className="absolute inset-0 opacity-15 [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:28px_28px]" />
              <div className="relative max-w-4xl">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs">
                  <Sparkles className="h-4 w-4 text-cyan-300" />
                  ساخته‌شده برای دانشجوها
                </div>
                <h2 className="mt-5 text-2xl font-black leading-relaxed sm:text-3xl">
                  هدف ساده است: منابع دانشگاهی را بدون اتلاف وقت پیدا کنید.
                </h2>
                <p className="mt-4 text-sm leading-8 text-blue-100">
                  myCloud یک پروژه دانشجویی مستقل است که برای جمع‌آوری و مرتب‌سازی منابع آموزشی،
                  دوره‌ها و ابزارهای مورد نیاز دانشجویان ساخته شده؛ تا به جای جست‌وجو بین چندین
                  کانال و منبع پراکنده، اطلاعات مهم در یک محیط واحد و قابل دسترس قرار بگیرد.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[1.75rem] border-slate-200/80 shadow-sm dark:border-slate-800">
            <CardContent className="p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-500/10">
                  <UserRound className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black">درباره سازنده و پروژه</h3>
                  <div className="mt-4 space-y-4 text-sm leading-8 text-muted-foreground">
                    <p>
                      این پروژه به صورت شخصی طراحی و توسعه داده شده است. هدف، ایجاد یک پلتفرم مرکزی
                      برای منابع آموزشی دانشگاه است تا دانشجویان بتوانند راحت‌تر، سریع‌تر و بدون اتلاف
                      وقت به اطلاعات و محتوای مورد نیازشان دسترسی داشته باشند.
                    </p>
                    <p>
                      بخشی از منابع اولیه از کانال تلگرامی <strong className="text-foreground">@mycloudmsgh</strong>
                      جمع‌آوری شده‌اند و محتوا در دسته‌بندی‌های مشخص در اختیار دانشجویان قرار می‌گیرد.
                    </p>
                    <p>
                      myCloud پروژه‌ای مستقل است و با هدف کمک به جامعه دانشجویی توسعه پیدا می‌کند.
                      پیشنهادها، گزارش خطاها و بازخورد کاربران مستقیماً روی مسیر توسعه پروژه تأثیر دارند.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-5 lg:grid-cols-3">
            <InfoCard icon={<Code2 className="h-6 w-6" />} title="توسعه و فناوری">
              <p>React و TypeScript در فرانت‌اند و Django REST Framework و PostgreSQL در بک‌اند استفاده می‌شوند.</p>
              <a
                href="https://github.com/mohammas3983"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 font-bold text-blue-600 hover:underline dark:text-blue-400"
              >
                <Github className="h-4 w-4" /> GitHub: mohammas3983
              </a>
            </InfoCard>

            <InfoCard icon={<HeartHandshake className="h-6 w-6" />} title="ارتباط با من">
              <p>برای پیشنهاد، همکاری یا گزارش مشکل می‌توانی از تلگرام یا سیستم تیکت استفاده کنی.</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button asChild variant="outline" size="sm" className="rounded-xl">
                  <a href="https://t.me/obsidian347" target="_blank" rel="noopener noreferrer">@obsidian347</a>
                </Button>
                <Button asChild variant="outline" size="sm" className="rounded-xl">
                  <a href="https://t.me/obsidian347m" target="_blank" rel="noopener noreferrer">@obsidian347m</a>
                </Button>
              </div>
            </InfoCard>

            <InfoCard icon={<Send className="h-6 w-6" />} title="کانال myCloud">
              <p>اطلاعیه‌ها و تازه‌های پروژه در کانال رسمی myCloud منتشر می‌شوند.</p>
              <Button asChild size="sm" className="mt-4 rounded-xl bg-blue-600 hover:bg-blue-700">
                <a href="https://t.me/mycloudmsgh" target="_blank" rel="noopener noreferrer">مشاهده کانال</a>
              </Button>
            </InfoCard>
          </div>


          <Card className="overflow-hidden rounded-[1.75rem] border-amber-200 bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950 text-white shadow-lg">
            <CardContent className="p-6 sm:p-8">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-black text-amber-300">حامی زیرساخت myCloud</p>
                  <h3 className="mt-2 text-2xl font-black">عقاب سرور</h3>
                  <p className="mt-3 max-w-2xl text-sm leading-8 text-slate-200">
                    ارائه‌دهنده VPS، سرور و سرویس‌های ارتباطی برای دسترسی پایدار و گذر از محدودیت‌ها.
                    بخشی از زیرساخت این پروژه با حمایت عقاب سرور فراهم شده است.
                  </p>
                </div>
                <Button asChild className="shrink-0 rounded-xl bg-amber-400 font-black text-slate-950 hover:bg-amber-300">
                  <a href="https://t.me/EagleVPS_VIP" target="_blank" rel="noopener noreferrer">
                    مشاهده کانال عقاب سرور
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[1.75rem] border-slate-200/80 shadow-sm dark:border-slate-800">
            <CardContent className="p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-500/10">
                  <TicketCheck className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black">ارسال تیکت به مدیریت</h3>
                  <p className="text-xs text-muted-foreground">برای پیگیری بهتر، درخواست‌های فنی را از این بخش ارسال کن.</p>
                </div>
              </div>

              <form onSubmit={sendTicket} className="mt-6 grid gap-4">
                <div>
                  <Label>نوع درخواست</Label>
                  <Select value={category} onValueChange={(v) => setCategory(v as SupportTicket["category"])}>
                    <SelectTrigger className="mt-2 h-11 rounded-xl"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technical">مشکل فنی</SelectItem>
                      <SelectItem value="content">گزارش محتوا</SelectItem>
                      <SelectItem value="account">حساب کاربری</SelectItem>
                      <SelectItem value="suggestion">پیشنهاد</SelectItem>
                      <SelectItem value="other">سایر</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>موضوع</Label>
                  <Input
                    className="mt-2 h-11 rounded-xl"
                    maxLength={150}
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </div>

                <div>
                  <Label>توضیحات</Label>
                  <Textarea
                    className="mt-2 min-h-32 rounded-xl"
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>

                <Button disabled={sending} className="h-11 w-fit rounded-xl bg-blue-600 px-6 font-bold hover:bg-blue-700">
                  <Send className="ml-2 h-4 w-4" />
                  {sending ? "در حال ارسال..." : "ارسال تیکت"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </PageShell>
    </Layout>
  );
};

const InfoCard = ({
  icon, title, children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) => (
  <Card className="rounded-[1.75rem] border-slate-200/80 shadow-sm dark:border-slate-800">
    <CardContent className="p-6">
      <div className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-500/10">
        {icon}
      </div>
      <h3 className="mt-5 font-black">{title}</h3>
      <div className="mt-2 text-sm leading-7 text-muted-foreground">{children}</div>
    </CardContent>
  </Card>
);

export default About;
