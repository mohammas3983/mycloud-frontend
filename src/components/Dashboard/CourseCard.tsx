// src/components/Dashboard/CourseCard.tsx
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// Define the type for the props this component expects
interface Course {
    id: string;
    title: string;
    description: string;
    code: string;
    instructor: {
        name: string;
        avatar: string;
    };
}

interface CourseCardProps {
    course: Course;
}

const CourseCard = ({ course }: CourseCardProps) => {
    return (
        <Link to={`/course/${course.id}`}>
            <Card className="h-full flex flex-col hover:border-primary transition-all duration-300 hover:shadow-lg">
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <CardTitle className="text-lg font-bold">{course.title}</CardTitle>
                        <Badge variant="secondary">{course.code}</Badge>
                    </div>
                </CardHeader>
                <CardContent className="flex-grow">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                        {course.description || "توضیحی برای این دوره ثبت نشده است."}
                    </p>
                </CardContent>
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
    );
};

export default CourseCard;