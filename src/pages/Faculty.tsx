// src/pages/Faculty.tsx
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/Layout/Layout";
import CourseCard from "@/components/Dashboard/CourseCard";
import { fetchCoursesByFaculty, Course as CourseType, Faculty as FacultyType, fetchFacultyById } from "@/lib/api";
import { Loader2, BookOpen } from "lucide-react";

const FacultyPage = () => {
    const { facultyId } = useParams<{ facultyId: string }>();
    const [faculty, setFaculty] = useState<FacultyType | null>(null);
    const [courses, setCourses] = useState<CourseType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!facultyId) {
            setError("آیدی دانشکده مشخص نشده است.");
            setIsLoading(false);
            return;
        }
        
        const loadData = async () => {
            try {
                setIsLoading(true);
                // با استفاده از Promise.all هر دو درخواست را همزمان اجرا می‌کنیم
                const [facultyData, coursesData] = await Promise.all([
                    fetchFacultyById(facultyId),
                    fetchCoursesByFaculty(facultyId)
                ]);
                setFaculty(facultyData);
                setCourses(coursesData);
            } catch (error) {
                console.error(error);
                setError("خطا در دریافت اطلاعات دانشکده.");
            }
            finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, [facultyId]);
    
    if (isLoading) {
        return <Layout><div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div></Layout>;
    }
    
    if (error || !faculty) {
        return <Layout><div className="text-center p-8 text-destructive">{error || "دانشکده مورد نظر یافت نشد."}</div></Layout>;
    }

    return (
        <Layout>
            <div className="space-y-8 p-4 md:p-8">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Link to="/faculties" className="hover:text-foreground">دانشکده‌ها</Link>
                        <span>/</span>
                        <span className="text-foreground font-medium">{faculty.name}</span>
                    </div>
                    <h1 className="text-4xl font-bold">دوره‌های {faculty.name}</h1>
                </div>
                {courses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {courses.map((course) => (
                            <CourseCard key={course.id} course={{
                                id: course.id.toString(),
                                title: course.title,
                                description: course.description,
                                code: course.faculty.name,
                                instructor: { name: course.professor.name, avatar: "" },
                                color: '#10b981', // رنگ ثابت برای این صفحه
                                semester: '', year: 1403, status: 'enrolled', progress: 0, studentsCount: 0,
                                materialsCount: { videos: 0, pdfs: 0, assignments: 0 }
                            }} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <BookOpen className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                        <h3 className="text-xl font-medium mb-2">هنوز دوره‌ای برای این دانشکده ثبت نشده است.</h3>
                        <p className="text-muted-foreground">می‌توانید از طریق پنل مدیریت، دوره‌های جدیدی برای این دانشکده اضافه کنید.</p>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default FacultyPage;