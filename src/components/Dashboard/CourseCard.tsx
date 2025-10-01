// src/components/Dashboard/CourseCard.tsx
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// ADDED: Import framer-motion برای انیمیشن
import { motion } from "framer-motion";
// ADDED: Import یک آیکون برای حالت بدون تصویر
import { BookImage } from "lucide-react";

// CHANGED: اینترفیس برای پشتیبانی از تصویر آپدیت شد
interface Course {
    id: string;
    title: string;
    description: string;
    code: string; // این همان نام دانشکده است
    image_url?: string | null; // آدرس تصویر دوره
    instructor: {
        name: string;
        avatar: string;
    };
}

interface CourseCardProps {
    course: Course;
}

const CourseCard = ({ course }: CourseCardProps) => {
    
    // تعریف انیمیشن برای هاور شدن کارت
    const hoverAnimation = {
        y: -8, // کارت کمی به بالا حرکت می‌کند
        scale: 1.03, // کارت کمی بزرگتر می‌شود
        transition: { type: "spring", stiffness: 300, damping: 20 }
    };

    return (
        <motion.div whileHover={hoverAnimation} className="h-full">
            <Link to={`/course/${course.id}`} className="block h-full">
                <Card className="h-full flex flex-col transition-all duration-300 overflow-hidden shadow-md hover:shadow-xl border">
                    {/* بخش تصویر کارت */}
                    <div className="relative h-40 w-full">
                        {course.image_url ? (
                            <img 
                                src={course.image_url} 
                                alt={course.title} 
                                className="h-full w-full object-cover" 
                            />
                        ) : (
                            // یک جایگزین زیبا برای حالتی که دوره عکس ندارد
                            <div className="h-full w-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                                <BookImage className="h-12 w-12 text-muted-foreground/50" />
                            </div>
                        )}
                        {/* یک لایه گرادینت برای خوانایی بهتر متن روی عکس */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        
                        {/* عنوان و Badge روی عکس */}
                        <div className="absolute bottom-0 left-0 p-4 w-full">
                           <div className="flex justify-between items-end">
                                <CardTitle className="text-lg font-bold text-white text-shadow">{course.title}</CardTitle>
                                <Badge variant="secondary" className="backdrop-blur-sm bg-white/20 border-0">{course.code}</Badge>
                           </div>
                        </div>
                    </div>
                    
                    {/* توضیحات دوره */}
                    <CardContent className="pt-4 flex-grow">
                        <p className="text-sm text-muted-foreground line-clamp-3">
                            {course.description || "توضیحی برای این دوره ثبت نشده است."}
                        </p>
                    </CardContent>

                    {/* اطلاعات استاد */}
                    <CardFooter>
                        <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                                <AvatarFallback>
                                    {course.instructor.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="text-sm font-semibold">{course.instructor.name}</p>
                                <p className="text-xs text-muted-foreground">استاد درس</p>
                            </div>
                        </div>
                    </CardFooter>
                </Card>
            </Link>
        </motion.div>
    );
};

export default CourseCard;