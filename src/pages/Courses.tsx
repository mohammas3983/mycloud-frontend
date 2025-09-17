import { useState } from "react";
import Layout from "@/components/Layout/Layout";
import CourseCard from "@/components/Dashboard/CourseCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Search, 
  Filter, 
  BookOpen,
  Clock,
  Calendar,
  TrendingUp
} from "lucide-react";

const Courses = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const courses = [
    {
      id: "cs101",
      title: "مبانی علوم کامپیوتر",
      code: "CS 101",
      instructor: {
        name: "دکتر سارا احمدی",
        avatar: "/avatars/instructor1.jpg"
      },
      semester: "پاییز",
      year: 1403,
      status: "in-progress" as const,
      progress: 68,
      nextClass: "دوشنبه ۱۰:۰۰",
      studentsCount: 120,
      description: "مفاهیم بنیادی علوم کامپیوتر شامل برنامه‌نویسی پایه، الگوریتم‌ها و ساختار داده‌ها.",
      color: "#3b82f6",
      materialsCount: {
        videos: 24,
        pdfs: 18,
        assignments: 8
      }
    },
    {
      id: "math201",
      title: "حساب دیفرانسیل و انتگرال ۲",
      code: "MATH 201",
      instructor: {
        name: "پروفسور میلاد کریمی",
        avatar: "/avatars/instructor2.jpg"
      },
      semester: "پاییز",
      year: 1403,
      status: "enrolled" as const,
      progress: 45,
      nextClass: "سه‌شنبه ۱۴:۰۰",
      studentsCount: 85,
      description: "مباحث پیشرفته حساب دیفرانسیل و انتگرال شامل تکنیک‌های انتگرال‌گیری و سری‌ها.",
      color: "#8b5cf6",
      materialsCount: {
        videos: 32,
        pdfs: 25,
        assignments: 12
      }
    },
    {
      id: "eng102",
      title: "نگارش آکادمیک",
      code: "ENG 102",
      instructor: {
        name: "دکتر زهرا رضایی",
        avatar: "/avatars/instructor3.jpg"
      },
      semester: "پاییز",
      year: 1403,
      status: "completed" as const,
      progress: 100,
      studentsCount: 45,
      description: "توسعه مهارت‌های نوشتاری پیشرفته برای متون آکادمیک و حرفه‌ای.",
      color: "#10b981",
      materialsCount: {
        videos: 16,
        pdfs: 22,
        assignments: 15
      }
    },
    {
      id: "phys101",
      title: "فیزیک عمومی ۱",
      code: "PHYS 101",
      instructor: {
        name: "دکتر علی حسینی",
        avatar: "/avatars/instructor4.jpg"
      },
      semester: "پاییز",
      year: 1403,
      status: "enrolled" as const,
      progress: 23,
      nextClass: "چهارشنبه ۹:۰۰",
      studentsCount: 95,
      description: "مکانیک، ترمودینامیک و حرکت موجی همراه با بخش آزمایشگاهی.",
      color: "#f59e0b",
      materialsCount: {
        videos: 28,
        pdfs: 20,
        assignments: 10
      }
    }
  ];

  const stats = [
    {
      title: "کل دروس ثبت شده",
      value: courses.length.toString(),
      description: "در ترم جاری",
      icon: BookOpen,
      color: "text-primary"
    },
    {
      title: "در حال انجام",
      value: courses.filter(c => c.status === 'in-progress').length.toString(),
      description: "دروس فعال",
      icon: Clock,
      color: "text-accent"
    },
    {
      title: "تکمیل شده",
      value: courses.filter(c => c.status === 'completed').length.toString(),
      description: "دروس گذرانده شده",
      icon: TrendingUp,
      color: "text-success"
    },
    {
      title: "میانگین پیشرفت",
      value: Math.round(courses.reduce((acc, c) => acc + c.progress, 0) / courses.length) + "٪",
      description: "کل دروس",
      icon: Calendar,
      color: "text-warning"
    }
  ];

  const filteredCourses = courses.filter(course => {
    if (activeTab === "all") return true;
    return course.status === activeTab;
  }).filter(course =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <div className="space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">دروس من</h1>
          <p className="text-lg text-muted-foreground">
            مدیریت و پیگیری تمام دروس ثبت شده در سامانه یادگیری myCloud
          </p>
        </div>

        {/* Stats Overview */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="card-gradient">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </section>

        {/* Courses Section */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-2xl font-bold">لیست دروس</h2>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="جستجو در دروس..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 pr-10"
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 lg:w-[400px]">
              <TabsTrigger value="all">همه</TabsTrigger>
              <TabsTrigger value="in-progress">در حال انجام</TabsTrigger>
              <TabsTrigger value="enrolled">ثبت شده</TabsTrigger>
              <TabsTrigger value="completed">تکمیل شده</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredCourses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
              
              {filteredCourses.length === 0 && (
                <div className="text-center py-12">
                  <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">هیچ درسی یافت نشد</h3>
                  <p className="text-muted-foreground">
                    {searchQuery 
                      ? "لطفاً کلمات جستجو خود را تغییر دهید"
                      : "هیچ درسی با فیلتر انتخابی مطابقت ندارد"
                    }
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </section>
      </div>
    </Layout>
  );
};

export default Courses;