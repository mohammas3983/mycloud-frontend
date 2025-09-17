import { Link } from "react-router-dom";
import Layout from "@/components/Layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  GraduationCap, 
  Users, 
  BookOpen,
  Cpu,
  Calculator,
  Atom,
  Stethoscope,
  Briefcase,
  Building,
  Palette
} from "lucide-react";

const Faculties = () => {
  const faculties = [
    {
      id: "engineering",
      name: "دانشکده مهندسی",
      description: "مهندسی کامپیوتر، برق، عمران، مکانیک",
      studentsCount: 2500,
      coursesCount: 145,
      icon: Cpu,
      color: "bg-blue-500",
      departments: ["مهندسی کامپیوتر", "مهندسی برق", "مهندسی عمران", "مهندسی مکانیک"]
    },
    {
      id: "science",
      name: "دانشکده علوم پایه",
      description: "ریاضی، فیزیک، شیمی، زیست شناسی",
      studentsCount: 1800,
      coursesCount: 98,
      icon: Atom,
      color: "bg-green-500",
      departments: ["ریاضی", "فیزیک", "شیمی", "زیست شناسی"]
    },
    {
      id: "medicine",
      name: "دانشکده پزشکی",
      description: "پزشکی عمومی، دندانپزشکی، پرستاری",
      studentsCount: 1200,
      coursesCount: 87,
      icon: Stethoscope,
      color: "bg-red-500",
      departments: ["پزشکی عمومی", "دندانپزشکی", "پرستاری", "داروسازی"]
    },
    {
      id: "humanities",
      name: "دانشکده علوم انسانی",
      description: "زبان و ادبیات، تاریخ، فلسفه، روانشناسی",
      studentsCount: 900,
      coursesCount: 76,
      icon: BookOpen,
      color: "bg-purple-500",
      departments: ["زبان و ادبیات فارسی", "تاریخ", "فلسفه", "روانشناسی"]
    },
    {
      id: "economics",
      name: "دانشکده اقتصاد و مدیریت",
      description: "اقتصاد، مدیریت، حسابداری، بازرگانی",
      studentsCount: 1500,
      coursesCount: 92,
      icon: Briefcase,
      color: "bg-orange-500",
      departments: ["اقتصاد", "مدیریت", "حسابداری", "بازرگانی"]
    },
    {
      id: "art",
      name: "دانشکده هنر و معماری",
      description: "معماری، طراحی صنعتی، نقاشی، مجسمه سازی",
      studentsCount: 600,
      coursesCount: 54,
      icon: Palette,
      color: "bg-pink-500",
      departments: ["معماری", "طراحی صنعتی", "نقاشی", "مجسمه سازی"]
    }
  ];

  return (
    <Layout>
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">دانشکده های دانشگاه</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            از بین دانشکده های مختلف دانشگاه، دانشکده مورد نظر خود را انتخاب کنید و دروس آن را مشاهده نمایید.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {faculties.map((faculty) => (
            <Link key={faculty.id} to={`/faculty/${faculty.id}`}>
              <Card className="card-gradient h-full hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-lg ${faculty.color} flex items-center justify-center text-white`}>
                      <faculty.icon className="h-6 w-6" />
                    </div>
                    <Badge variant="secondary">
                      {faculty.coursesCount} درس
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">{faculty.name}</CardTitle>
                  <CardDescription>{faculty.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{faculty.studentsCount.toLocaleString('fa-IR')} دانشجو</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4" />
                      <span>{faculty.coursesCount} درس</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium">گروه های آموزشی:</p>
                    <div className="flex flex-wrap gap-1">
                      {faculty.departments.slice(0, 3).map((dept, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {dept}
                        </Badge>
                      ))}
                      {faculty.departments.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{faculty.departments.length - 3} مورد دیگر
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Faculties;