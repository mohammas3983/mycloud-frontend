import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import Layout from "@/components/Layout/Layout";
import {
  ArrowLeft,
  BookOpen,
  PlayCircle,
  FileText,
  Download,
  Clock,
  Users,
  Calendar,
  MessageSquare,
  Share2,
  Star,
  CheckCircle2,
  Circle
} from "lucide-react";

const CourseDetail = () => {
  const { courseId } = useParams();
  const [activeModule, setActiveModule] = useState(0);

  // Mock course data - in real app this would come from API
  const course = {
    id: courseId,
    title: "Introduction to Computer Science",
    code: "CS 101",
    instructor: {
      name: "Dr. Sarah Johnson",
      avatar: "/avatars/instructor1.jpg",
      email: "sarah.johnson@university.edu",
      office: "CS Building, Room 301"
    },
    semester: "Fall 2024",
    credits: 3,
    status: "in-progress",
    progress: 68,
    enrolledStudents: 120,
    rating: 4.8,
    description: "This course introduces fundamental concepts of computer science including programming basics, algorithms, data structures, and computational thinking. Students will learn to solve problems using programming and develop a solid foundation for advanced computer science topics.",
    color: "#3b82f6",
    modules: [
      {
        id: 1,
        title: "Introduction to Programming",
        description: "Basic programming concepts and syntax",
        completed: true,
        progress: 100,
        materials: [
          { type: "video", title: "Welcome to Programming", duration: "15:30", completed: true },
          { type: "pdf", title: "Programming Fundamentals.pdf", size: "2.4 MB", completed: true },
          { type: "video", title: "Variables and Data Types", duration: "22:15", completed: true },
          { type: "pdf", title: "Exercises - Week 1.pdf", size: "1.8 MB", completed: false }
        ]
      },
      {
        id: 2,
        title: "Control Structures",
        description: "Loops, conditionals, and decision making",
        completed: false,
        progress: 75,
        materials: [
          { type: "video", title: "If Statements and Conditionals", duration: "18:45", completed: true },
          { type: "video", title: "Loops and Iteration", duration: "25:20", completed: true },
          { type: "pdf", title: "Control Structures Guide.pdf", size: "3.1 MB", completed: true },
          { type: "video", title: "Nested Control Structures", duration: "20:10", completed: false },
          { type: "pdf", title: "Practice Problems.pdf", size: "1.5 MB", completed: false }
        ]
      },
      {
        id: 3,
        title: "Functions and Methods",
        description: "Creating reusable code with functions",
        completed: false,
        progress: 30,
        materials: [
          { type: "video", title: "Introduction to Functions", duration: "19:30", completed: true },
          { type: "pdf", title: "Function Basics.pdf", size: "2.8 MB", completed: false },
          { type: "video", title: "Parameters and Return Values", duration: "24:15", completed: false },
          { type: "video", title: "Scope and Local Variables", duration: "16:40", completed: false }
        ]
      }
    ],
    announcements: [
      {
        id: 1,
        title: "Midterm Exam Schedule",
        content: "The midterm exam will be held on October 25th at 2:00 PM in the main auditorium.",
        date: "2024-10-15",
        author: "Dr. Sarah Johnson"
      },
      {
        id: 2,
        title: "Assignment 3 Due Date Extended",
        content: "Due to technical issues, Assignment 3 deadline has been extended to October 30th.",
        date: "2024-10-12",
        author: "Dr. Sarah Johnson"
      }
    ]
  };

  const getModuleIcon = (completed: boolean, progress: number) => {
    if (completed) return <CheckCircle2 className="h-5 w-5 text-success" />;
    if (progress > 0) return <Circle className="h-5 w-5 text-primary fill-primary/20" />;
    return <Circle className="h-5 w-5 text-muted-foreground" />;
  };

  const getMaterialIcon = (type: string) => {
    switch (type) {
      case "video":
        return <PlayCircle className="h-4 w-4 text-primary" />;
      case "pdf":
        return <FileText className="h-4 w-4 text-accent" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors">
            Dashboard
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium">{course.title}</span>
        </div>

        {/* Course Header */}
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <div className="flex items-start gap-4 mb-4">
              <div 
                className="w-16 h-16 rounded-xl flex items-center justify-center text-white"
                style={{ backgroundColor: course.color }}
              >
                <BookOpen className="h-8 w-8" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-3xl font-bold">{course.title}</h1>
                  <Badge variant="secondary">{course.code}</Badge>
                </div>
                <p className="text-lg text-muted-foreground mb-3">
                  {course.semester} • {course.credits} Credits
                </p>
                <p className="text-foreground leading-relaxed">
                  {course.description}
                </p>
              </div>
            </div>

            {/* Course Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <Users className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                <div className="font-semibold">{course.enrolledStudents}</div>
                <div className="text-xs text-muted-foreground">Students</div>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <Star className="h-5 w-5 mx-auto mb-1 text-warning" />
                <div className="font-semibold">{course.rating}</div>
                <div className="text-xs text-muted-foreground">Rating</div>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <Clock className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                <div className="font-semibold">{course.progress}%</div>
                <div className="text-xs text-muted-foreground">Complete</div>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <BookOpen className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                <div className="font-semibold">{course.modules.length}</div>
                <div className="text-xs text-muted-foreground">Modules</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Overall Progress</span>
                <span className="font-medium">{course.progress}%</span>
              </div>
              <Progress value={course.progress} className="h-3" />
            </div>
          </div>

          {/* Instructor Card */}
          <Card className="lg:w-80">
            <CardHeader>
              <CardTitle className="text-lg">Instructor</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={course.instructor.avatar} />
                  <AvatarFallback>
                    {course.instructor.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{course.instructor.name}</h3>
                  <p className="text-sm text-muted-foreground">Professor</p>
                </div>
              </div>
              <Separator />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email:</span>
                  <span>{course.instructor.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Office:</span>
                  <span>{course.instructor.office}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Message
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Course Content */}
        <Tabs defaultValue="modules" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="modules">Course Materials</TabsTrigger>
            <TabsTrigger value="announcements">Announcements</TabsTrigger>
            <TabsTrigger value="grades">Grades</TabsTrigger>
          </TabsList>

          <TabsContent value="modules" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Module List */}
              <div className="lg:col-span-1">
                <h3 className="font-semibold mb-4">Course Modules</h3>
                <div className="space-y-2">
                  {course.modules.map((module, index) => (
                    <button
                      key={module.id}
                      onClick={() => setActiveModule(index)}
                      className={`w-full text-left p-4 rounded-lg border transition-colors ${
                        activeModule === index 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border hover:bg-muted/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {getModuleIcon(module.completed, module.progress)}
                        <div className="flex-1">
                          <h4 className="font-medium">{module.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {module.description}
                          </p>
                          <div className="mt-2">
                            <Progress value={module.progress} className="h-1" />
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Module Content */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>{course.modules[activeModule].title}</CardTitle>
                      <Badge variant={course.modules[activeModule].completed ? "default" : "secondary"}>
                        {course.modules[activeModule].progress}% Complete
                      </Badge>
                    </div>
                    <p className="text-muted-foreground">
                      {course.modules[activeModule].description}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {course.modules[activeModule].materials.map((material, index) => (
                        <div
                          key={index}
                          className={`flex items-center gap-3 p-3 rounded-lg border transition-colors hover:bg-muted/50 cursor-pointer ${
                            material.completed ? 'bg-success/5 border-success/20' : ''
                          }`}
                        >
                          {getMaterialIcon(material.type)}
                          <div className="flex-1">
                            <h4 className="font-medium">{material.title}</h4>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              {material.duration && (
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {material.duration}
                                </span>
                              )}
                              {material.size && (
                                <span className="flex items-center gap-1">
                                  <Download className="h-3 w-3" />
                                  {material.size}
                                </span>
                              )}
                            </div>
                          </div>
                          {material.completed && (
                            <CheckCircle2 className="h-5 w-5 text-success" />
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="announcements" className="mt-6">
            <div className="space-y-4">
              {course.announcements.map((announcement) => (
                <Card key={announcement.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{announcement.title}</CardTitle>
                      <Badge variant="outline">{announcement.date}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-3">{announcement.content}</p>
                    <div className="text-sm text-muted-foreground">
                      Posted by {announcement.author}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="grades" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Grade Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Grades Coming Soon</h3>
                  <p className="text-muted-foreground">
                    Your grades and assessment results will appear here once available.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default CourseDetail;