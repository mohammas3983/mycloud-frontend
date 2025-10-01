// src/pages/AllCourses.tsx
import { useState, useEffect } from "react";
import Layout from "@/components/Layout/Layout";
import CourseCard from "@/components/Dashboard/CourseCard";
import { fetchCourses, Course as CourseType } from "@/lib/api";
import { Loader2, BookOpen, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

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
    
    // تعریف انیمیشن برای کانتینر و آیتم‌ها
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.08 }, // تاخیر بین نمایش هر کارت
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
    };
    
    if (isLoading) return <Layout><div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div></Layout>;

    return (
        <Layout>
            <div className="space-y-8 p-4 md:p-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="space-y-2 text-center md:text-right">
                        <h1 className="text-4xl font-bold">لیست تمام دوره‌ها</h1>
                        <p className="text-lg text-muted-foreground">تمام دوره‌های ارائه شده در myCloud را جستجو کنید</p>
                    </div>
                    <div className="relative w-full md:w-auto">
                        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="جستجو در نام دوره، استاد یا دانشکده..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full md:w-80 pr-10"
                        />
                    </div>
                </div>
                {filteredCourses.length > 0 ? (
                    <motion.div 
                        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {filteredCourses.map((course) => (
                            <motion.div key={course.id} variants={itemVariants}>
                                <CourseCard course={{
                                    id: course.id.toString(),
                                    title: course.title,
                                    description: course.description,
                                    code: course.faculty.name,
                                    instructor: { name: course.professor.name, avatar: "" },
                                }} />
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <div className="text-center py-16">
                        <BookOpen className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                        <h3 className="text-xl font-medium mb-2">هیچ دوره‌ای با این مشخصات یافت نشد</h3>
                        <p className="text-muted-foreground">عبارت جستجوی خود را تغییر دهید.</p>
                    </div>
                )}
            </div>
        </Layout>
    );
};
export default AllCourses;