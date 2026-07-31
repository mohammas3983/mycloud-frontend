// src/pages/AllCourses.tsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout/Layout";
import PageShell from "@/components/Layout/PageShell";
import { Input } from "@/components/ui/input";
import { fetchCourses, Course as CourseType } from "@/lib/api";
import { BookOpen, GraduationCap, Search, UserRound } from "lucide-react";
import { motion } from "framer-motion";

const AllCourses = () => {
  const [courses, setCourses] = useState<CourseType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchCourses().then(setCourses).catch(console.error).finally(() => setIsLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return courses;
    return courses.filter(c =>
      c.title?.toLowerCase().includes(q) ||
      c.description?.toLowerCase().includes(q) ||
      c.professor?.name?.toLowerCase().includes(q) ||
      c.faculty?.name?.toLowerCase().includes(q)
    );
  }, [courses, search]);

  return (
    <Layout>
      <PageShell
        eyebrow="کتابخانه آموزشی"
        title="همه دوره‌ها"
        subtitle={`${courses.length} دوره در myCloud؛ با جستجو سریع‌تر به درس مورد نظرت برس.`}
        icon={<BookOpen className="h-7 w-7" />}
        action={
          <div className="relative w-full sm:w-72">
            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="جستجوی درس، استاد یا دانشکده..." className="h-11 rounded-xl bg-background pr-9" />
          </div>
        }
      >
        {isLoading ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{[0,1,2,3,4,5].map(i => <div key={i} className="h-60 animate-pulse rounded-[1.75rem] bg-muted" />)}</div>
        ) : filtered.length === 0 ? (
          <div className="mycloud-surface grid min-h-72 place-items-center p-8 text-center">
            <div><Search className="mx-auto h-10 w-10 text-muted-foreground/40" /><h3 className="mt-4 font-black">دوره‌ای پیدا نشد</h3><p className="mt-2 text-sm text-muted-foreground">عبارت دیگری را امتحان کن.</p></div>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((course, i) => (
              <motion.div key={course.id} initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{delay: Math.min(i*.03,.25)}}>
                <Link to={`/course/${course.id}`} className="group block h-full">
                  <div className="mycloud-card flex h-full min-h-60 flex-col p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/15"><BookOpen className="h-6 w-6" /></div>
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">{course.faculty?.name || "دانشکده"}</span>
                    </div>
                    <h2 className="mt-5 text-xl font-black tracking-tight transition group-hover:text-blue-600 dark:group-hover:text-blue-400">{course.title}</h2>
                    <p className="mt-3 line-clamp-3 text-sm leading-7 text-muted-foreground">{course.description || "توضیحی برای این دوره ثبت نشده است."}</p>
                    <div className="mt-auto flex flex-wrap gap-3 border-t border-slate-100 pt-5 text-xs text-muted-foreground dark:border-slate-800">
                      <span className="inline-flex items-center gap-1.5"><UserRound className="h-4 w-4" /> {course.professor?.name || "استاد نامشخص"}</span>
                      <span className="inline-flex items-center gap-1.5"><GraduationCap className="h-4 w-4" /> {course.faculty?.name || "—"}</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </PageShell>
    </Layout>
  );
};

export default AllCourses;
