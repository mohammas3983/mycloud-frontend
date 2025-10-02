// src/pages/AllCourses.tsx
import { useState, useEffect, useRef } from "react";
import Layout from "@/components/Layout/Layout";
import { Link } from "react-router-dom";
import { fetchCourses, Course as CourseType } from "@/lib/api";
import { Loader2, BookOpen, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion";

// --- کارت دوره با Tilt + Parallax ---
interface CourseCardProps {
  course: {
    id: string;
    title: string;
    description: string;
    code: string;
    instructor: { name: string; avatar: string };
  };
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);
  const rotateX = useTransform(y, [0, 1], [-8, 8]);
  const rotateY = useTransform(x, [0, 1], [8, -8]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width);
    y.set((e.clientY - rect.top) / rect.height);
  };
  const handleMouseLeave = () => { x.set(0.5); y.set(0.5); };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden perspective-[1000px]"
    >
      <Link to={`/course/${course.id}`}>
        <div className="p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-indigo-600 dark:text-cyan-400">{course.code}</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">{course.instructor.name}</span>
          </div>
          <h3 className="text-xl font-extrabold text-gray-900 dark:text-white">{course.title}</h3>
          <p className="text-gray-600 dark:text-gray-300 line-clamp-3">{course.description}</p>
        </div>
      </Link>
    </motion.div>
  );
};

// --- صفحه اصلی ---
const AllCourses = () => {
  const [courses, setCourses] = useState<CourseType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchCourses();
        setCourses(data);
      } catch (error) { console.error(error); }
      finally { setIsLoading(false); }
    };
    loadData();
  }, []);

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.professor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.faculty.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) return (
    <Layout>
      <div className="flex justify-center items-center p-16 min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-600 dark:text-cyan-400" />
      </div>
    </Layout>
  );

  return (
    <Layout>
      <div className="space-y-10 p-4 md:p-10">

        {/* Header + Search */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pb-4 border-b border-gray-200 dark:border-gray-700">
          <div className="space-y-2 text-center md:text-right">
            <h1 className="text-4xl md:text-5xl font-extrabold text-foreground">
              تمام دوره‌ها
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              تمام دوره‌های ارائه شده در <span className="text-indigo-600 dark:text-cyan-400 font-semibold">myCloud</span> را جستجو کنید
            </p>
          </div>
          <div className="relative w-full md:w-96">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-indigo-400 dark:text-cyan-400" />
            <Input
              placeholder="جستجو در نام دوره، استاد یا دانشکده..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-12 pl-4 py-3 border-2 border-indigo-200 dark:border-cyan-700 rounded-full focus:ring-4 focus:ring-indigo-100 dark:focus:ring-cyan-900 focus:border-indigo-500 dark:focus:border-cyan-500 transition duration-400 shadow-inner"
            />
          </div>
        </div>

        {/* جداکننده */}
        <div className="h-0.5 w-full bg-gradient-to-r from-indigo-300/50 via-indigo-500/50 to-purple-300/50 dark:from-cyan-800 dark:via-blue-800 dark:to-cyan-800 rounded-full my-6"/>

        {/* Courses Grid */}
        <div className="min-h-[50vh]">
          {filteredCourses.length > 0 ? (
            <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              <AnimatePresence>
                {filteredCourses.map((course) => (
                  <motion.div key={course.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.5 }}>
                    <CourseCard course={{
                      id: course.id.toString(),
                      title: course.title,
                      description: course.description,
                      code: course.faculty.name,
                      instructor: { name: course.professor.name, avatar: "" },
                    }} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <div className="text-center py-20 flex flex-col items-center gap-4 text-gray-500 dark:text-gray-400">
              <BookOpen className="h-16 w-16 text-red-400 dark:text-red-300" />
              <h3 className="text-2xl font-bold">هیچ دوره‌ای یافت نشد</h3>
              <p>عبارت جستجوی خود را تغییر دهید یا دوره دیگری را امتحان کنید.</p>
            </div>
          )}
        </div>

      </div>
    </Layout>
  );
};

export default AllCourses;
