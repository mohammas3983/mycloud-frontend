// src/pages/Dashboard.tsx
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CourseCard from "@/components/Dashboard/CourseCard";
import Layout from "@/components/Layout/Layout";
import heroImage from "@/assets/hero-image.jpg";
import { BookOpen, Loader2, GraduationCap, Users, Send } from "lucide-react";
import { fetchFeaturedCourses, fetchFaculties, fetchProfessors, Course as CourseType, Faculty, Professor, fetchCourses } from "@/lib/api";

const Dashboard = () => {
  const [featuredCourses, setFeaturedCourses] = useState<CourseType[]>([]);
  const [stats, setStats] = useState({ courses: 0, faculties: 0, professors: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [coursesData, facultiesData, professorsData, allCoursesData] = await Promise.all([
          fetchFeaturedCourses(),
          fetchFaculties(),
          fetchProfessors(),
          fetchCourses() // برای گرفتن تعداد کل دوره‌ها
        ]);
        setFeaturedCourses(coursesData);
        setStats({
          courses: allCoursesData.length,
          faculties: facultiesData.length,
          professors: professorsData.length,
        });
      } catch (err) {
        setError("خطا در دریافت اطلاعات داشبورد.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  const statCards = [
    { title: "تعداد کل دوره‌ها", value: stats.courses, icon: BookOpen, color: "text-primary" },
    { title: "تعداد دانشکده‌ها", value: stats.faculties, icon: GraduationCap, color: "text-accent" },
    { title: "تعداد اساتید", value: stats.professors, icon: Users, color: "text-green-500" },
    { title: "کانال تلگرام", value: "عضو شوید", icon: Send, color: "text-sky-500", link: "https://t.me/mycloudmsgh" },
  ];

  return (
    <Layout>
      <div className="space-y-12">
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-accent text-white -mt-8 -mx-4 sm:-mx-8">
          <div className="absolute inset-0 bg-black/30" />
          <img src={heroImage} alt="University Learning" className="absolute inset-0 w-full h-full object-cover mix-blend-overlay"/>
          <div className="relative z-10 p-8 md:p-16 text-center">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">به myCloud خوش آمدید</h1>
              <p className="text-xl text-white/90">
                دروازه شما به یادگیری بی‌وقفه. دسترسی به تمام دروس، منابع و مطالب در یک مکان.
              </p>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => (
            <a key={index} href={stat.link || '#'} target={stat.link ? '_blank' : '_self'} rel="noopener noreferrer" className="block">
              <Card className="hover:shadow-lg hover:-translate-y-1 transition-all">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                      <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </CardHeader>
                  <CardContent>
                      <div className="text-2xl font-bold">{isLoading ? "..." : stat.value}</div>
                  </CardContent>
              </Card>
            </a>
          ))}
        </section>

        <section className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold">جدیدترین دوره‌های ارائه شده</h2>
            <p className="text-muted-foreground">نگاهی به آخرین دوره‌های اضافه شده به پلتفرم بیندازید.</p>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>
          ) : error ? (
            <div className="text-center py-12 text-destructive"><p>{error}</p></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {featuredCourses.map((course) => (
                <CourseCard key={course.id} course={{
                  id: course.id.toString(), title: course.title, description: course.description,
                  code: course.faculty.name, instructor: { name: course.professor.name, avatar: "" },
                  color: '#3b82f6', semester: '', year: 1403, status: 'enrolled', progress: 0, studentsCount: 0,
                  materialsCount: { videos: 0, pdfs: 0, assignments: 0 }
                }} />
              ))}
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
};
export default Dashboard;