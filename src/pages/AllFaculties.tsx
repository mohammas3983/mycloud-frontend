// src/pages/AllFaculties.tsx
import { useState, useEffect } from "react";
import Layout from "@/components/Layout/Layout";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Link } from "react-router-dom";
// فرض بر این است که fetchFaculties و Faculty در دسترس هستند
import { fetchFaculties, Faculty } from "@/lib/api"; 
import { Loader2, Building2, Search, Zap, GraduationCap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";

// 💡 برای افکت 3D Tilt نیاز به useRef و useMotionValue داریم
import { useRef } from "react";
import { useMotionValue, useSpring, useTransform } from "framer-motion";

// ---
// کامپوننت کارت دانشکده با انیمیشن‌های پیشرفته (Parallax + Tilt)
// ---

interface FacultyCardProps {
  faculty: Faculty;
}

const FacultyCard: React.FC<FacultyCardProps> = ({ faculty }) => {
  const ref = useRef<HTMLDivElement>(null);

  // Motion values برای موقعیت موس (Mouse Position)
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // تبدیل موقعیت موس به چرخش‌های (Rotation) کارت
  // این مقادیر افکت 3D Tilt را ایجاد می‌کنند
  const rotateX = useTransform(y, [0, 1], [-10, 10]);
  const rotateY = useTransform(x, [0, 1], [10, -10]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    // محاسبه مختصات موس نسبت به مرکز کارت
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // نرمال‌سازی مختصات به بازه 0 تا 1
    x.set(mouseX / width);
    y.set(mouseY / height);
  };

  const handleMouseLeave = () => {
    // بازگرداندن کارت به حالت اولیه با انیمیشن بهاری (Spring)
    x.set(0.5); // تنظیم به مرکز برای بازگشت نرم
    y.set(0.5);
  };

  // رنگ گرادیان‌های جذاب برای آیکون
  const iconGradientClasses = [
    "from-blue-500 to-cyan-500",
    "from-pink-500 to-red-500",
    "from-green-500 to-lime-500",
    "from-purple-500 to-indigo-500",
  ];
  // انتخاب گرادیان بر اساس ID دانشکده (برای تنوع)
  const gradientClass = iconGradientClasses[faculty.id % iconGradientClasses.length];

  return (
    <motion.div
      key={faculty.id}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      // انیمیشن‌های ورودی/خروجی فیلترینگ
    >
      <Link to={`/faculty/${faculty.id}`}>
        <motion.div
          ref={ref}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d", // فعال‌سازی پرسپکتیو 3D
          }}
          // انیمیشن هاور برای Tilt
          whileTap={{ scale: 0.98 }} // انیمیشن کلیک
          className="h-full border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden group perspective-[1000px]"
        >
          <Card className="h-full border-none bg-transparent">
            <CardHeader className="flex flex-col items-center p-6 gap-4 text-center">
              {/* انیمیشن آیکون با گرادیان رنگی */}
              <motion.div
                className={`p-5 rounded-full flex items-center justify-center shadow-lg transform-gpu ${gradientClass}`}
                style={{ transform: "translateZ(50px)" }} // افکت پرالاکس به سمت جلو
                whileHover={{ scale: 1.1, rotate: [0, -10, 10, -10, 0] }} // انیمیشن لرزش
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
              >
                <GraduationCap className="h-10 w-10 text-white" />
              </motion.div>
              
              {/* نام دانشکده */}
              <motion.div style={{ transform: "translateZ(20px)" }}> {/* افکت پرالاکس */}
                <CardTitle className="group-hover:text-indigo-600 dark:group-hover:text-cyan-400 transition-colors duration-300 font-extrabold text-xl">
                  {faculty.name}
                </CardTitle>
                <CardDescription className="text-gray-500 dark:text-gray-400 mt-1">
                  مشاهده دوره‌ها و جزئیات
                </CardDescription>
              </motion.div>
            </CardHeader>
          </Card>
        </motion.div>
      </Link>
    </motion.div>
  );
};

// ---
// کامپوننت اصلی
// ---

const AllFaculties = () => {
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchFaculties();
        setFaculties(data);
      } catch (error) {
        console.error("Error fetching faculties:", error);
        // نمایش یک پیام خطا به کاربر می‌تواند ایده خوبی باشد
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const filteredFaculties = faculties.filter(faculty =>
    faculty.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ---
  // حالت بارگذاری با انیمیشن جذاب
  // ---
  if (isLoading) {
    return (
      <Layout>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center p-16 min-h-[60vh] bg-gray-50 dark:bg-gray-900"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          >
            <GraduationCap className="h-16 w-16 text-indigo-500 dark:text-cyan-400" />
          </motion.div>
          <h2 className="mt-4 text-xl font-semibold text-gray-700 dark:text-gray-300">
            در حال بارگذاری دانشکده‌ها...
          </h2>
        </motion.div>
      </Layout>
    );
  }

  // ---
  // رابط کاربری اصلی
  // ---
  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-10 p-4 md:p-10"
      >
        {/* Header + Search با انیمیشن ورود */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-4 border-b border-gray-200 dark:border-gray-700"
        >
          <div className="space-y-2 text-right">
            <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-cyan-400 dark:to-blue-600">
              دانشکده‌های فعال 🚀
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              بیش از {faculties.length} دانشکده برای آینده‌ی روشن شما.
            </p>
          </div>
          
          <div className="relative w-full md:w-96">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-indigo-400 dark:text-cyan-400" />
            <Input
              placeholder="جستجوی نام دانشکده..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-12 pl-4 py-3 border-2 border-indigo-200 dark:border-cyan-700 rounded-full focus:ring-4 focus:ring-indigo-100 dark:focus:ring-cyan-900 focus:border-indigo-500 dark:focus:border-cyan-500 transition duration-400 shadow-inner"
            />
          </div>
        </motion.div>

        {/* Faculties Grid */}
        <div className="min-h-[50vh]">
          {filteredFaculties.length > 0 ? (
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              <AnimatePresence>
                {filteredFaculties.map((faculty) => (
                  // استفاده از کامپوننت FacultyCard جدید
                  <FacultyCard key={faculty.id} faculty={faculty} />
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            // ---
            // حالت عدم وجود نتیجه با انیمیشن
            // ---
            <motion.div
              className="text-center py-20 flex flex-col items-center gap-4 text-gray-500"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 100 }}
            >
              <Zap className="h-16 w-16 text-red-400 dark:text-red-300" />
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                اوپس! هیچ دانشکده‌ای یافت نشد.
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                لطفاً عبارت جستجو ({searchQuery}) را بررسی کنید یا عبارت دیگری را امتحان کنید.
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </Layout>
  );
};

export default AllFaculties;