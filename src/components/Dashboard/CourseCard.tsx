// src/components/Dashboard/CourseCard.tsx

import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  BookOpen,
} from "lucide-react";

// CHANGE: اینترفیس رو ساده کردیم تا دقیقاً با داده‌هایی که بهش پاس میدیم مطابقت داشته باشه
interface CourseCardProps {
  course: {
    id: string;
    title: string;
    instructor: {
      name: string;
      avatar?: string;
    };
    // این فیلدها از Dashboard.tsx به صورت ثابت ارسال میشن
    color: string;
  };
}

const CourseCard = ({ course }: CourseCardProps) => {
  return (
    // CHANGE: لینک به `/course/${course.id}` همچنان کار می‌کنه
    <Link to={`/course/${course.id}`}>
      <Card className="course-card group h-full flex flex-col">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center text-white"
                style={{ backgroundColor: course.color }}
              >
                <BookOpen className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                  {course.title}
                </h3>
                {/* CHANGE: اطلاعات اضافی که نداریم رو موقتاً حذف کردیم */}
              </div>
            </div>
            {/* CHANGE: بج وضعیت حذف شد */}
          </div>
        </CardHeader>

        <CardContent className="space-y-4 flex-grow">
          {/* CHANGE: توضیحات، پروگرس بار و آمار مواد درسی حذف شدن چون در API نیستن */}
          <p className="text-sm text-muted-foreground line-clamp-2">
            اطلاعات بیشتر درباره این دوره...
          </p>
        </CardContent>

        <CardFooter className="pt-4 border-t">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={course.instructor.avatar} />
                <AvatarFallback>
                  {course.instructor.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{course.instructor.name}</p>
                <p className="text-xs text-muted-foreground">استاد</p>
              </div>
            </div>
            {/* CHANGE: زمان کلاس بعدی حذف شد */}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default CourseCard;