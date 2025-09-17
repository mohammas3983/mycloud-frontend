import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/Layout/Layout";
import CourseCard from "@/components/Dashboard/CourseCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  Search, 
  Filter, 
  Users, 
  BookOpen,
  GraduationCap,
  Cpu,
  Calculator,
  Atom,
  Stethoscope,
  Briefcase,
  Palette
} from "lucide-react";

const Faculty = () => {
  const { facultyId } = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const facultyData: Record<string, any> = {
    engineering: {
      name: "دانشکده مهندسی",
      description: "یکی از بزرگترین دانشکده های دانشگاه با تمرکز بر علوم فنی و مهندسی",
      icon: Cpu,
      color: "bg-blue-500",
      studentsCount: 2500,
      coursesCount: 145,
      departments: [
        { name: "مهندسی کامپیوتر", courses: 45, students: 800 },
        { name: "مهندسی برق", courses: 38, students: 600 },
        { name: "مهندسی عمران", courses: 32, students: 550 },
        { name: "مهندسی مکانیک", courses: 30, students: 550 }
      ],
      courses: [
        {
          id: "cs101",
          title: "مبانی علوم کامپیوتر",
          code: "CS 101",
          instructor: { name: "دکتر سارا احمدی", avatar: "/avatars/instructor1.jpg" },
          semester: "پاییز",
          year: 1403,
          status: "in-progress" as const,
          progress: 68,
          nextClass: "دوشنبه ۱۰:۰۰",
          studentsCount: 120,
          description: "مفاهیم بنیادی علوم کامپیوتر شامل برنامه‌نویسی پایه، الگوریتم‌ها و ساختار داده‌ها.",
          color: "#3b82f6",
          materialsCount: { videos: 24, pdfs: 18, assignments: 8 }
        },
        {
          id: "ee201",
          title: "مدارهای الکتریکی",
          code: "EE 201",
          instructor: { name: "پروفسور رضا کریمی", avatar: "/avatars/instructor2.jpg" },
          semester: "پاییز",
          year: 1403,
          status: "enrolled" as const,
          progress: 35,
          nextClass: "یکشنبه ۱۴:۰۰",
          studentsCount: 95,
          description: "تحلیل مدارهای الکتریکی خطی و غیرخطی با استفاده از قوانین کیرشهف.",
          color: "#10b981",
          materialsCount: { videos: 28, pdfs: 22, assignments: 10 }
        }
      ]
    },
    science: {
      name: "دانشکده علوم پایه", 
      description: "مرکز آموزش علوم پایه دانشگاه شامل ریاضی، فیزیک، شیمی و زیست شناسی",
      icon: Atom,
      color: "bg-green-500",
      studentsCount: 1800,
      coursesCount: 98,
      departments: [
        { name: "ریاضی", courses: 28, students: 450 },
        { name: "فیزیک", courses: 25, students: 400 },
        { name: "شیمی", courses: 23, students: 480 },
        { name: "زیست شناسی", courses: 22, students: 470 }
      ],
      courses: [
        {
          id: "math201",
          title: "حساب دیفرانسیل و انتگرال ۲",
          code: "MATH 201",
          instructor: { name: "پروفسور میلاد کریمی", avatar: "/avatars/instructor2.jpg" },
          semester: "پاییز",
          year: 1403,
          status: "enrolled" as const,
          progress: 45,
          nextClass: "سه‌شنبه ۱۴:۰۰",
          studentsCount: 85,
          description: "مباحث پیشرفته حساب دیفرانسیل و انتگرال شامل تکنیک‌های انتگرال‌گیری و سری‌ها.",
          color: "#8b5cf6",
          materialsCount: { videos: 32, pdfs: 25, assignments: 12 }
        }
      ]
    }
  };

  const faculty = facultyData[facultyId || ""] || facultyData.engineering;

  const filteredCourses = faculty.courses.filter((course: any) => {
    if (activeTab === "all") return true;
    return course.status === activeTab;
  }).filter((course: any) =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <div className="space-y-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/faculties" className="hover:text-foreground">دانشکده ها</Link>
          <ArrowRight className="h-4 w-4 rotate-180" />
          <span className="text-foreground">{faculty.name}</span>
        </div>

        {/* Faculty Header */}
        <div className="space-y-6">
          <div className="flex items-start gap-6">
            <div className={`w-16 h-16 rounded-2xl ${faculty.color} flex items-center justify-center text-white`}>
              <faculty.icon className="h-8 w-8" />
            </div>
            <div className="flex-1 space-y-2">
              <h1 className="text-4xl font-bold">{faculty.name}</h1>
              <p className="text-lg text-muted-foreground">{faculty.description}</p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{faculty.studentsCount.toLocaleString('fa-IR')} دانشجو</span>
                </div>
                <div className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  <span>{faculty.coursesCount} درس</span>
                </div>
              </div>
            </div>
          </div>

          {/* Departments */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {faculty.departments.map((dept: any, index: number) => (
              <Card key={index} className="card-gradient">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{dept.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">دروس:</span>
                      <span className="font-medium">{dept.courses}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">دانشجویان:</span>
                      <span className="font-medium">{dept.students.toLocaleString('fa-IR')}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Courses Section */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-2xl font-bold">دروس {faculty.name}</h2>
            
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
                {filteredCourses.map((course: any) => (
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

export default Faculty;