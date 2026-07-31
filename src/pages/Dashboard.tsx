// src/pages/Dashboard.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout/Layout";
import CourseCard from "@/components/Dashboard/CourseCard";
import AnimatedStatCard from "@/components/Dashboard/AnimatedStatCard";
import heroImage from "@/assets/hero-image.jpg";
import { useAuth } from "@/contexts/AuthContext";
import {
  fetchCourses, fetchFaculties, fetchFeaturedCourses, fetchProfessors, fetchSiteStats,
  Course as CourseType, SiteStats
} from "@/lib/api";
import {
  ArrowLeft, BarChart3, BookOpen, Eye, GraduationCap,
  MessageCircle, Send, Sparkles, Users
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const Dashboard = () => {
  const { user, token } = useAuth();
  const [featured, setFeatured] = useState<CourseType[]>([]);
  const [stats, setStats] = useState({ courses: 0, faculties: 0, professors: 0 });
  const [site, setSite] = useState<SiteStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchFeaturedCourses(), fetchCourses(), fetchFaculties(), fetchProfessors(), fetchSiteStats(token),
    ]).then(([f, c, fac, p, s]) => {
      setFeatured(f);
      setStats({ courses: c.length, faculties: fac.length, professors: p.length });
      setSite(s);
    }).catch(console.error).finally(() => setLoading(false));
  }, [token]);

  return (
    <Layout>
      <div dir="rtl" className="mx-auto max-w-7xl space-y-8">
        <section className="relative min-h-[360px] overflow-hidden rounded-[2.25rem] text-white shadow-2xl">
          <img src={heroImage} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-l from-slate-950/95 via-blue-950/82 to-blue-700/45" />
          <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:30px_30px]" />
          <div className="relative flex min-h-[360px] max-w-3xl flex-col justify-center p-7 sm:p-10 lg:p-14">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-bold backdrop-blur">
              <Sparkles className="h-4 w-4 text-cyan-300" /> سامانه آموزشی دانشجوها
            </div>
            <h1 className="mt-5 text-3xl font-black leading-[1.5] sm:text-5xl">
              {user?.first_name ? `${user.first_name}، ` : ""}به myCloud خوش اومدی
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-8 text-blue-100 sm:text-base">
              دوره‌ها، دانشکده‌ها، پیام‌رسان دانشجویی و پشتیبانی؛ همه در یک محیط مرتب و سریع.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/courses" className="inline-flex h-11 items-center gap-2 rounded-xl bg-white px-5 text-sm font-black text-blue-700 hover:bg-blue-50">
                مشاهده دوره‌ها <ArrowLeft className="h-4 w-4" />
              </Link>
              <Link to="/faculties" className="inline-flex h-11 items-center rounded-xl border border-white/20 bg-white/10 px-5 text-sm font-bold backdrop-blur hover:bg-white/15">
                دانشکده‌ها
              </Link>
              <Link to="/messenger" className="inline-flex h-11 items-center gap-2 rounded-xl border border-cyan-300/20 bg-cyan-300/10 px-5 text-sm font-bold text-cyan-100 hover:bg-cyan-300/15">
                <MessageCircle className="h-4 w-4" /> پیام‌رسان
              </Link>
            </div>
          </div>
        </section>

        <section>
          <p className="text-xs font-black text-blue-600 dark:text-blue-400">در یک نگاه</p>
          <h2 className="mt-1 text-2xl font-black">آمار myCloud</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <AnimatedStatCard icon={BookOpen} title="کل دوره‌ها" value={stats.courses} gradient="bg-gradient-to-br from-blue-500 to-blue-700" color="text-white" isLoading={loading} />
            <AnimatedStatCard icon={GraduationCap} title="دانشکده‌ها" value={stats.faculties} gradient="bg-gradient-to-br from-violet-500 to-purple-700" color="text-white" isLoading={loading} delay={0.06} />
            <AnimatedStatCard icon={Users} title="اساتید" value={stats.professors} gradient="bg-gradient-to-br from-emerald-400 to-green-600" color="text-white" isLoading={loading} delay={0.12} />
            <AnimatedStatCard icon={Users} title="کاربران" value={site?.total_users || 0} gradient="bg-gradient-to-br from-cyan-500 to-sky-700" color="text-white" isLoading={loading} delay={0.18} />
          </div>
        </section>

        <section className="grid gap-4 xl:grid-cols-[280px_1fr]">
          <a
            href="https://t.me/mycloudmsgh"
            target="_blank"
            rel="noreferrer"
            className="group relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-sky-500 to-blue-700 p-5 text-white shadow-lg transition hover:-translate-y-1"
          >
            <div className="relative flex h-full min-h-36 flex-col justify-between">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/15"><Send className="h-5 w-5" /></div>
              <div className="mt-5">
                <p className="text-xs text-blue-100">کانال تلگرام</p>
                <h3 className="mt-1 text-xl font-black">عضو شوید</h3>
              </div>
            </div>
          </a>

          <div className="grid gap-4 sm:grid-cols-3">
            <AnimatedStatCard icon={Eye} title="بازدید امروز" value={site?.daily_visits || 0} isLoading={loading} />
            <AnimatedStatCard icon={BarChart3} title="این هفته" value={site?.weekly_visits || 0} isLoading={loading} delay={0.05} />
            <AnimatedStatCard icon={BarChart3} title="کل بازدید" value={site?.total_visits || 0} isLoading={loading} delay={0.1} />
          </div>
        </section>

        <section className="rounded-[2rem] border bg-card p-5 shadow-sm sm:p-7">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <p className="text-xs font-black text-blue-600 dark:text-blue-400">تازه‌ها</p>
              <h2 className="mt-1 text-2xl font-black">جدیدترین دوره‌های ارائه‌شده</h2>
            </div>
            <Link to="/courses" className="text-sm font-bold text-blue-600 hover:underline">مشاهده همه</Link>
          </div>

          {loading ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {[1,2,3].map(i => <Skeleton key={i} className="h-64 rounded-3xl" />)}
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {featured.map(course => (
                <CourseCard
                  key={course.id}
                  course={{
                    id: String(course.id),
                    title: course.title,
                    description: course.description,
                    code: course.faculty.name,
                    instructor: { name: course.professor.name, avatar: "" },
                  }}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
};

export default Dashboard;
