// src/pages/Dashboard.tsx
import { useState, useEffect } from "react";
import Layout from "@/components/Layout/Layout";
import CourseCard from "@/components/Dashboard/CourseCard";
import heroImage from "@/assets/hero-image.jpg";
import { BookOpen, Loader2, GraduationCap, Users, Send, Eye, CalendarDays, BarChart3 } from "lucide-react";
import { 
  fetchFeaturedCourses, fetchFaculties, fetchProfessors, fetchCourses, 
  fetchSiteStats, SiteStats as SiteStatsType, Course as CourseType 
} from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
// === FIXED: Correctly import the component with its extension ===
import AnimatedStatCard from "@/components/Dashboard/AnimatedStatCard.tsx"; 

const Dashboard = () => {
  const { token } = useAuth();
  const [featuredCourses, setFeaturedCourses] = useState<CourseType[]>([]);
  const [generalStats, setGeneralStats] = useState({ courses: 0, faculties: 0, professors: 0 });
  const [visitStats, setVisitStats] = useState<SiteStatsType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      try {
        const promises: Promise<any>[] = [
          fetchFeaturedCourses(), fetchFaculties(), fetchProfessors(), fetchCourses(),
          token ? fetchSiteStats(token) : Promise.resolve(null),
        ];

        const [coursesData, facultiesData, professorsData, allCoursesData, siteStatsData] = await Promise.all(promises);
        
        setFeaturedCourses(coursesData);
        setGeneralStats({
          courses: allCoursesData.length,
          faculties: facultiesData.length,
          professors: professorsData.length,
        });
        if (siteStatsData) {
          setVisitStats(siteStatsData);
        }

      } catch (err) {
        setError("خطا در ارتباط با سرور. لطفاً لحظاتی دیگر دوباره امتحان کنید.");
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

        <section className="space-y-8">
          {/* General Stats Row (Visible on all devices) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <AnimatedStatCard icon={BookOpen} title="تعداد کل دوره‌ها" value={generalStats.courses} gradient="bg-gradient-to-br from-blue-400 to-blue-600" color="text-white" isLoading={isLoading} delay={0} />
            <AnimatedStatCard icon={GraduationCap} title="تعداد دانشکده‌ها" value={generalStats.faculties} gradient="bg-gradient-to-br from-purple-400 to-purple-600" color="text-white" isLoading={isLoading} delay={0.1} />
            <AnimatedStatCard icon={Users} title="تعداد اساتید" value={generalStats.professors} gradient="bg-gradient-to-br from-green-400 to-green-600" color="text-white" isLoading={isLoading} delay={0.2} />
            <AnimatedStatCard icon={Send} title="کانال تلگرام" value="عضو شوید" gradient="bg-gradient-to-br from-sky-400 to-sky-600" color="text-white" link="https://t.me/mycloudmsgh" isLoading={isLoading} delay={0.3} />
          </div>
          
          {/* Visit Stats Row (Hidden on mobile, visible on sm and up) */}
          {token && (
            <div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <AnimatedStatCard icon={Users} title="کل کاربران" value={visitStats?.total_users ?? 0} isLoading={!visitStats} delay={0} />
              <AnimatedStatCard icon={Eye} title="بازدید امروز" value={visitStats?.daily_visits ?? 0} isLoading={!visitStats} delay={0.1} />
              <AnimatedStatCard icon={CalendarDays} title="بازدید این هفته" value={visitStats?.weekly_visits ?? 0} isLoading={!visitStats} delay={0.2} />
              <AnimatedStatCard icon={BarChart3} title="کل بازدیدها" value={visitStats?.total_visits ?? 0} isLoading={!visitStats} delay={0.3} />
            </div>
          )}
        </section>

        {/* Featured Courses Section */}
        <section className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold">جدیدترین دوره‌های ارائه شده</h2>
            <p className="text-muted-foreground">نگاهی به آخرین دوره‌های اضافه شده به پلتفرم بیندازید.</p>
          </div>
          
          {isLoading ? (
             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-64 w-full rounded-xl" />)}
            </div>
          ) : error && !featuredCourses.length ? (
            <div className="text-center py-12 text-destructive"><p>{error}</p></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {featuredCourses.map((course) => (
                <CourseCard key={course.id} course={{
                  id: course.id.toString(), title: course.title, description: course.description,
                  code: course.faculty.name, instructor: { name: course.professor.name, avatar: "" }
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