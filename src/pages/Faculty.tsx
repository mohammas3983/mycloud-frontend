// src/pages/Faculty.tsx
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Layout from "@/components/Layout/Layout";
import PageShell from "@/components/Layout/PageShell";
import CourseCard from "@/components/Dashboard/CourseCard";
import { fetchCoursesByFaculty, Course as CourseType, Faculty as FacultyType, fetchFacultyById } from "@/lib/api";
import { ArrowRight, BookOpen, GraduationCap, Loader2 } from "lucide-react";

const FacultyPage = () => {
  const { facultyId } = useParams<{ facultyId: string }>();
  const [faculty, setFaculty] = useState<FacultyType | null>(null);
  const [courses, setCourses] = useState<CourseType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!facultyId) { setError("دانشکده مشخص نشده است."); setLoading(false); return; }
    Promise.all([fetchFacultyById(facultyId), fetchCoursesByFaculty(facultyId)])
      .then(([f,c]) => { setFaculty(f); setCourses(c); })
      .catch(() => setError("دریافت اطلاعات دانشکده ناموفق بود."))
      .finally(() => setLoading(false));
  }, [facultyId]);

  if (loading) return <Layout><div className="grid min-h-[60vh] place-items-center"><Loader2 className="h-9 w-9 animate-spin text-blue-600" /></div></Layout>;

  if (error || !faculty) return (
    <Layout><div dir="rtl" className="mx-auto max-w-xl px-4 py-24 text-center"><p className="font-bold text-red-600">{error || "دانشکده پیدا نشد."}</p><Link to="/faculties" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-blue-600"><ArrowRight className="h-4 w-4" /> بازگشت به دانشکده‌ها</Link></div></Layout>
  );

  return (
    <Layout>
      <PageShell
        eyebrow="دانشکده"
        title={faculty.name}
        subtitle={`${courses.length} دوره برای این دانشکده در myCloud موجود است.`}
        icon={<GraduationCap className="h-7 w-7" />}
        action={<Link to="/faculties" className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 dark:text-blue-400"><ArrowRight className="h-4 w-4" /> همه دانشکده‌ها</Link>}
      >
        {courses.length ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {courses.map(course => (
              <CourseCard key={course.id} course={{
                id: course.id.toString(),
                title: course.title,
                description: course.description,
                code: course.faculty.name,
                instructor: { name: course.professor.name, avatar: "" }
              }} />
            ))}
          </div>
        ) : (
          <div className="mycloud-surface grid min-h-72 place-items-center p-8 text-center">
            <div><BookOpen className="mx-auto h-11 w-11 text-muted-foreground/40" /><h3 className="mt-4 font-black">هنوز دوره‌ای اضافه نشده</h3><p className="mt-2 text-sm text-muted-foreground">دوره‌های این دانشکده بعداً اینجا نمایش داده می‌شوند.</p></div>
          </div>
        )}
      </PageShell>
    </Layout>
  );
};

export default FacultyPage;
