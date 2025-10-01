// src/pages/Dashboard.tsx
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CourseCard from "@/components/Dashboard/CourseCard";
import Layout from "@/components/Layout/Layout";
import heroImage from "@/assets/hero-image.jpg";
import { BookOpen, Loader2, GraduationCap, Users, Send, Eye, CalendarDays, BarChart3 } from "lucide-react";
import { 
  fetchFeaturedCourses, 
  fetchFaculties, 
  fetchProfessors, 
  fetchCourses, 
  fetchSiteStats,
  SiteStats as SiteStatsType, 
  Course as CourseType 
} from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";

// Reusable Stat Card Component
const StatCard = ({ icon: Icon, title, value, color, link, isLoading }: { 
  icon: React.ElementType, 
  title: string, 
  value: string | number, 
  color?: string,
  link?: string,
  isLoading: boolean 
}) => {
  const content = (
    <Card className="hover:shadow-lg hover:-translate-y-1 transition-all">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className={`h-5 w-5 ${color || 'text-muted-foreground'}`} />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-7 w-1/2" />
        ) : (
          <div className="text-2xl font-bold">{typeof value === 'number' ? value.toLocaleString('fa-IR') : value}</div>
        )}
      </CardContent>
    </Card>
  );

  return link ? <a href={link} target="_blank" rel="noopener noreferrer" className="block">{content}</a> : content;
};

const Dashboard = () => {
  const { token } = useAuth();
  const [featuredCourses, setFeaturedCourses] = useState<CourseType[]>([]);
  const [generalStats, setGeneralStats] = useState({ courses: 0, faculties: 0, professors: 0 });
  const [visitStats, setVisitStats] = useState<SiteStatsType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const promises: Promise<any>[] = [
          fetchFeaturedCourses(),
          fetchFaculties(),
          fetchProfessors(),
          fetchCourses(),
        ];

        if (token) {
          promises.push(fetchSiteStats(token));
        }

        const results = await Promise.all(promises);
        
        setFeaturedCourses(results[0]);
        setGeneralStats({
          courses: results[3].length,
          faculties: results[1].length,
          professors: results[2].length,
        });

        if (results.length > 4) {
          setVisitStats(results[4]);
        }

      } catch (err) {
        setError("خطا در دریافت اطلاعات داشبورد. ممکن است سرور با مشکل مواجه شده باشد.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadDashboardData();
  }, [token]);
  
  return (
    <Layout>
      <div className="space-y-12">
        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-accent text-white -mt-8 -mx-4 sm:-mx-8">
          <div className="absolute inset-0 bg-black/30" />
          <img src={heroImage} alt="University Learning" className="absolute inset-0 w-full h-full object-cover mix-blend-overlay"/>
          <div className="relative z-10 p-8 md:p-16 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">به myCloud خوش آمدید</h1>
            <p className="text-xl text-white/90">دروازه شما به یادگیری بی‌وقفه.</p>
          </div>
        </section>

        <section className="space-y-6">
          {/* General Stats Row (Visible on all devices) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard icon={BookOpen} title="تعداد کل دوره‌ها" value={generalStats.courses} color="text-primary" isLoading={isLoading} />
            <StatCard icon={GraduationCap} title="تعداد دانشکده‌ها" value={generalStats.faculties} color="text-accent" isLoading={isLoading} />
            <StatCard icon={Users} title="تعداد اساتید" value={generalStats.professors} color="text-green-500" isLoading={isLoading} />
            <StatCard icon={Send} title="کانال تلگرام" value="عضو شوید" color="text-sky-500" link="https://t.me/mycloudmsgh" isLoading={isLoading} />
          </div>
          
          {/* Visit Stats Row (Hidden on mobile, visible on sm and up) */}
          {token && (
            <div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard icon={Users} title="کل کاربران" value={visitStats?.total_users ?? 0} isLoading={!visitStats} />
              <StatCard icon={Eye} title="بازدید امروز" value={visitStats?.daily_visits ?? 0} isLoading={!visitStats} />
              <StatCard icon={CalendarDays} title="بازدید این هفته" value={visitStats?.weekly_visits ?? 0} isLoading={!visitStats} />
              <StatCard icon={BarChart3} title="کل بازدیدها" value={visitStats?.total_visits ?? 0} isLoading={!visitStats} />
            </div>
          )}
        </section>

        {/* Featured Courses Section */}
        <section className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold">جدیدترین دوره‌های ارائه شده</h2>
            <p className="text-muted-foreground">نگاهی به آخرین دوره‌های اضافه شده به پلتفرم بیندا_زید.</p>
          </div>
          
          {isLoading ? (
             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-64 w-full rounded-xl" />)}
            </div>
          ) : error && !featuredCourses.length ? ( // Show error only if courses also failed
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