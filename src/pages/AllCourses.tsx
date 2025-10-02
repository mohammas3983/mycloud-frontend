// src/pages/AllCourses.tsx
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion";

import Layout from "@/components/Layout/Layout";
import { Input } from "@/components/ui/input";
import { fetchCourses, Course as CourseType } from "@/lib/api";
import { BookOpen, Search } from "lucide-react";

// --- کارت دوره با Tilt + Parallax ---
interface CourseCardProps {
  course: {
    id: string;
    title: string;
    description: string;
    code: string; // نام دانشکده یا کد دوره
    instructor: { name: string; avatar: string };
  };
}

const getCourseGradient = (id: string) => {
  const hash = Array.from(id).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const gradients = [
    "bg-gradient-to-br from-red-500 to-orange-500",
    "bg-gradient-to-br from-teal-500 to-green-500",
    "bg-gradient-to-br from-pink-500 to-purple-500",
    "bg-gradient-to-br from-indigo-500 to-blue-500",
  ];
  return gradients[hash % gradients.length];
};

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);
  // کاهش چرخش برای بهبود خوانایی و ظاهر
  const rotateX = useTransform(y, [0, 1], [-5, 5]); 
  const rotateY = useTransform(x, [0, 1], [5, -5]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width);
    y.set((e.clientY - rect.top) / rect.height);
  };

  const handleMouseLeave = () => {
    x.set(0.5);
    y.set(0.5);
  };

  const gradientClass = getCourseGradient(course.id);

  return (
    <motion.div
      key={course.id}
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      whileHover={{ scale: 1.03, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)" }}
      whileTap={{ scale: 0.97 }}
      className="h-full bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl shadow-xl transition-all duration-300 cursor-pointer overflow-hidden perspective-[1000px] group"
    >
      <Link to={`/course/${course.id}`} className="block h-full">
        {/* فضای عمودی کارت کاهش یافت (space-y-3) */}
        <div className="p-6 space-y-3 flex flex-col items-start h-full">
          {/* آیکون گرد و گرادیانی */}
          <motion.div
            className={`p-4 rounded-full flex items-center justify-center shadow-lg ${gradientClass}`}
            style={{ transform: "translateZ(30px)" }}
            whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
            transition={{ type: "spring", stiffness: 300, damping: 10 }}
          >
            <BookOpen className="h-6 w-6 text-white" />
          </motion.div>

          {/* اطلاعات دوره */}
          <motion.div style={{ transform: "translateZ(10px)" }} className="flex-grow w-full space-y-2">
            {/* کنترل ارتفاع نام دانشکده و استاد (با استفاده از truncate) */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm gap-1 sm:gap-0">
              <span className="font-medium text-gray-500 dark:text-gray-400 group-hover:text-gray-700 transition-colors duration-300 truncate max-w-[60%] sm:max-w-full">
                {course.code}
              </span>
              <span className="text-indigo-600 dark:text-cyan-400 font-semibold group-hover:text-indigo-800 transition-colors duration-300 truncate max-w-[40%] sm:max-w-full">
                {course.instructor.name}
              </span>
            </div>

            {/* عنوان دوره (با استفاده از line-clamp-2 برای حداکثر دو خط) */}
            <h3 className="text-xl font-extrabold text-gray-900 dark:text-white group-hover:text-indigo-600 transition-colors duration-300 line-clamp-2">
              {course.title}
            </h3>

            {/* توضیحات دوره (با استفاده از line-clamp-3 برای حداکثر سه خط) */}
            <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3">
              {course.description}
            </p>
          </motion.div>
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
        // در اینجا فیلد instructor را به professor و code را به faculty.name نگاشت می‌کنیم
        const data = await fetchCourses();
        setCourses(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.professor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.faculty.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading)
    return (
      <Layout>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center p-16 min-h-[60vh] bg-gray-50 dark:bg-gray-900"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1], rotate: [0, 10, -10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="p-4 rounded-full bg-indigo-500/10 dark:bg-cyan-400/10"
          >
            <BookOpen className="h-16 w-16 text-indigo-600 dark:text-cyan-400" />
          </motion.div>
          <h2 className="mt-4 text-xl font-semibold text-gray-700 dark:text-gray-300">
            در حال بارگذاری دوره‌ها...
          </h2>
        </motion.div>
      </Layout>
    );

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-10 p-4 md:p-10"
      >
        {/* Header + Search - ✅ صاف و متعادل */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          // از کلاس items-center استفاده شده تا عنوان و جستجو در یک خط صاف باشند
          className="flex flex-col md:flex-row justify-between items-center gap-6 pb-4" 
        >
          <div className="space-y-2 text-right">
            {/* عنوان کاملاً صاف و بدون چرخش در سطح تگ h1 */}
            <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-cyan-400 dark:to-blue-600 inline-flex items-center gap-2">
              <span>فهرست کامل دوره‌ها</span>
              <motion.span
                animate={{ scale: [1, 1.1, 1], y: [0, -2, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="inline-block"
              >
                📚
              </motion.span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
              {courses.length} دوره فعال برای یادگیری، ارائه شده توسط بهترین اساتید.
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
        </motion.div>

        {/* جداکننده شیک */}
        <div className="h-0.5 w-full bg-gradient-to-r from-indigo-300/50 via-indigo-500/50 to-purple-300/50 dark:from-cyan-800 dark:via-blue-800 dark:to-cyan-800 rounded-full my-6" />

        {/* Courses Grid */}
        <div className="min-h-[50vh]">
          {filteredCourses.length > 0 ? (
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              <AnimatePresence>
                {filteredCourses.map((course) => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  >
                    <CourseCard
                      course={{
                        id: course.id.toString(),
                        title: course.title,
                        description: course.description,
                        code: course.faculty.name,
                        instructor: { name: course.professor.name, avatar: "" },
                      }}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              className="text-center py-20 flex flex-col items-center gap-4 text-gray-500 dark:text-gray-400"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 100 }}
            >
              <BookOpen className="h-16 w-16 text-red-400 dark:text-red-300" />
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                متأسفانه هیچ دوره‌ای یافت نشد
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                عبارت جستجوی خود را تغییر دهید یا دوره دیگری را امتحان کنید.
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </Layout>
  );
};

export default AllCourses;