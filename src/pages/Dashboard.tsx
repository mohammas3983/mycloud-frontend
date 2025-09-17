// src/pages/Dashboard.tsx

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CourseCard from "@/components/Dashboard/CourseCard";
import Layout from "@/components/Layout/Layout";
import heroImage from "@/assets/hero-image.jpg";
import { 
  BookOpen, 
  Clock, 
  TrendingUp, 
  Search,
  Calendar,
  Loader2
} from "lucide-react";
import { fetchCourses, Course as CourseType } from "@/lib/api";

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [courses, setCourses] = useState<CourseType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getCourses = async () => {
      setIsLoading(true);
      try {
        const data = await fetchCourses();
        setCourses(data);
      } catch (err) {
        setError("خطا در دریافت اطلاعات از سرور.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    getCourses();
  }, []);

  const stats = [
    {
      title: "تعداد کل دوره‌ها",
      value: isLoading ? "..." : courses.length.toString(),
      description: "ارائه شده در این پلتفرم",
      icon: BookOpen,
      color: "text-primary"
    },
    {
      title: "ساعات مطالعه",
      value: "۱۲۷",
      description: "این ماه",
      icon: Clock,
      color: "text-accent"
    },
    {
      title: "تکالیف باقی‌مانده",
      value: "۳",
      description: "۷ روز آینده",
      icon: Calendar,
      color: "text-warning"
    },
    {
      title: "پیشرفت کلی",
      value: "۷۳٪",
      description: "در تمام دروس",
      icon: TrendingUp,
      color: "text-success"
    }
  ];

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <div className="space-y-8">
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-accent text-white">
          <div className="absolute inset-0 bg-black/20" />
          <img 
            src={heroImage} 
            alt="University Learning" 
            className="absolute inset-0 w-full h-full object-cover mix-blend-overlay"
          />
          <div className="relative z-10 p-8 md:p-12">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">به myCloud خوش آمدید</h1>
              <p className="text-xl mb-6 text-white/90">دروازه شما به یادگیری بی‌وقفه. دسترسی به تمام دروس، منابع و مطالب در یک مکان.</p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90"><BookOpen className="ml-2 h-5 w-5" />مرور دروس</Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary"><Calendar className="ml-2 h-5 w-5" />مشاهده برنامه</Button>
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="card-gradient">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-2xl font-bold">لیست دوره‌ها</h2>
            <div className="relative"><Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="جستجو در دروس..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-64 pr-10"/></div>
          </div>
          
          {isLoading ? (
            <div className="text-center py-12 flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary mr-2" /><p className="text-muted-foreground">در حال بارگذاری دوره‌ها...</p></div>
          ) : error ? (
            <div className="text-center py-12 text-destructive"><p>{error}</p></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <CourseCard 
                  key={course.id} 
                  course={{
                    id: course.id.toString(),
                    title: course.title,
                    instructor: { name: course.professor.name, avatar: "" },
                    color: '#3b82f6',
                  }} 
                />
              ))}
            </div>
          )}

          {!isLoading && !error && filteredCourses.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">هیچ درسی یافت نشد</h3>
              <p className="text-muted-foreground">{searchQuery ? "لطفاً کلمات جستجو خود را تغییر دهید" : "هیچ درسی در حال حاضر وجود ندارد"}</p>
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
};

export default Dashboard;