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
import AnimatedStatCard from "@/components/Dashboard/AnimatedStatCard"; // <-- Import the new component

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
        setError("خطا در ارتباط با سرور.");
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
            {/* ... Hero content ... */}
        </section>

        <section className="space-y-6">
          {/* General Stats Row (Visible on all devices) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <AnimatedStatCard icon={BookOpen} title="تعداد کل دوره‌ها" value={generalStats.courses} color="text-primary" isLoading={isLoading} delay={0} />
            <AnimatedStatCard icon={GraduationCap} title="تعداد دانشکده‌ها" value={generalStats.faculties} color="text-accent" isLoading={isLoading} delay={0.1} />
            <AnimatedStatCard icon={Users} title="تعداد اساتید" value={generalStats.professors} color="text-green-500" isLoading={isLoading} delay={0.2} />
            <AnimatedStatCard icon={Send} title="کانال تلگرام" value="عضو شوید" color="text-sky-500" link="https://t.me/mycloudmsgh" isLoading={isLoading} delay={0.3} />
          </div>
          
          {/* Visit Stats Row (Hidden on mobile) */}
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
            {/* ... Featured courses content ... */}
        </section>
      </div>
    </Layout>
  );
};

export default Dashboard;