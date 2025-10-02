// src/pages/Faculty.tsx
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/Layout/Layout";
import CourseCard from "@/components/Dashboard/CourseCard";
import { fetchCoursesByFaculty, Course as CourseType, Faculty as FacultyType, fetchFacultyById } from "@/lib/api";
import { Loader2, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
        const [facultyData, coursesData] = await Promise.all([
          fetchFacultyById(facultyId),
          fetchCoursesByFaculty(facultyId)
        ]);
        setFaculty(facultyData);
        setCourses(coursesData);
      } catch (error) {
        console.error(error);
        setError("خطا در دریافت اطلاعات دانشکده.");
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [facultyId]);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center p-16">
          <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
        </div>
      </Layout>
    );
  }

  if (error || !faculty) {
    return (
      <Layout>
        <div className="text-center p-16 text-red-600 font-medium">{error || "دانشکده مورد نظر یافت نشد."}</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8 p-4 md:p-8">
        {/* Breadcrumb + Title */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link to="/faculties" className="hover:text-indigo-500 transition-colors duration-200">دانشکده‌ها</Link>
            <span>/</span>
            <span className="text-gray-800 font-medium">{faculty.name}</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900">{faculty.name} - دوره‌ها</h1>
        </div>

        {/* Courses Grid */}
        {courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <AnimatePresence>
              {courses.map((course) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ scale: 1.03 }}
                >
                  <CourseCard
                    course={{
                      id: course.id.toString(),
                      title: course.title,
                      description: course.description,
                      code: course.faculty.name,
                      instructor: { name: course.professor.name, avatar: "" },
                      color: '#6366f1', // gradient-like purple
                      semester: '', year: 1403, status: 'enrolled', progress: 0, studentsCount: 0,
                      materialsCount: { videos: 0, pdfs: 0, assignments: 0 }
                    }}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <motion.div
            className="text-center py-16 flex flex-col items-center gap-4 text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <BookOpen className="h-16 w-16 text-indigo-400 animate-bounce" />
            <h3 className="text-xl font-semibold text-gray-700">هنوز دوره‌ای برای این دانشکده ثبت نشده است.</h3>
            <p className="text-gray-500">می‌توانید از طریق پنل مدیریت، دوره‌های جدیدی برای این دانشکده اضافه کنید.</p>
          </motion.div>
        )}
      </div>
    </Layout>
  );
};

export default FacultyPage;
