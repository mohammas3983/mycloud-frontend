// src/components/Dashboard/CourseCard.tsx
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

// اینترفیس بدون تغییر باقی می‌ماند
interface Course {
    id: string;
    title: string;
    description: string;
    code: string; // نام دانشکده
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
        y: -10, // حرکت به بالا
        boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)", // سایه برجسته‌تر
        transition: { type: "spring", stiffness: 200, damping: 15 }
    };

    return (
        <motion.div 
            whileHover={hoverAnimation} 
            className="h-full rounded-xl" // انیمیشن روی این div اعمال می‌شود
        >
            <Link to={`/course/${course.id}`} className="block h-full">
                {/* 
                  کلاس group برای کنترل کردن المان‌های فرزند در حالت هاور استفاده می‌شود
                  (مثلاً نمایش آیکون فلش) 
                */}
                <Card className="group h-full flex flex-col transition-colors duration-300 overflow-hidden border-border/60 hover:border-primary">
                    
                    {/* یک نوار رنگی زیبا در بالای کارت */}
                    <div className="w-full h-2 bg-gradient-to-r from-primary to-accent" />
                    
                    <CardHeader>
                        <div className="flex justify-between items-start gap-4">
                            <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
                                {course.title}
                            </CardTitle>
                            {/* آیکون فلش که در حالت هاور ظاهر می‌شود */}
                            <div className="opacity-0 group-hover:opacity-100 transform -translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                                <ArrowUpRight className="h-6 w-6 text-primary" />
                            </div>
                        </div>
                        <Badge variant="outline">{course.code}</Badge>
                    </CardHeader>
                    
                    {/* 
                      کلاس flex-grow باعث می‌شود این بخش فضای خالی را پر کند
                      و فوتر همیشه در پایین کارت قرار بگیرد
                    */}
                    <CardContent className="flex-grow">
                        <p className="text-sm text-muted-foreground line-clamp-3">
                            {course.description || "توضیحی برای این دوره ثبت نشده است."}
                        </p>
                    </CardContent>

                    <CardFooter>
                        <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                                <AvatarFallback className="text-sm">
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