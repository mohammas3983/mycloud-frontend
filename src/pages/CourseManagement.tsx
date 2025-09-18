// src/pages/admin-components/CourseManagement.tsx
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Course, Faculty, Professor, fetchCourses, fetchFaculties, fetchProfessors, createCourse, updateCourse, deleteCourse } from "@/lib/api";
import { PlusCircle, Edit, Trash2, Loader2 } from "lucide-react";

const CourseManagementTab = () => {
    const { token } = useAuth();
    const [courses, setCourses] = useState<Course[]>([]);
    const [faculties, setFaculties] = useState<Faculty[]>([]);
    const [professors, setProfessors] = useState<Professor[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentCourse, setCurrentCourse] = useState<Partial<Course> & { faculty?: number, professor?: number }>({});

    const loadData = async () => {
        try {
            setIsLoading(true);
            const [coursesData, facultiesData, professorsData] = await Promise.all([
                fetchCourses(),
                fetchFaculties(),
                fetchProfessors()
            ]);
            setCourses(coursesData);
            setFaculties(facultiesData);
            setProfessors(professorsData);
        } catch (error) { console.error(error); } 
        finally { setIsLoading(false); }
    };

    useEffect(() => { loadData(); }, []);

    const handleSave = async () => {
        if (!token || !currentCourse.title || !currentCourse.faculty || !currentCourse.professor) {
            alert("لطفاً تمام فیلدهای اجباری را پر کنید.");
            return;
        }
        const courseData = {
            title: currentCourse.title,
            description: currentCourse.description || '',
            faculty: currentCourse.faculty,
            professor: currentCourse.professor
        };
        try {
            if (currentCourse.id) {
                await updateCourse(currentCourse.id, courseData, token);
            } else {
                await createCourse(courseData, token);
            }
            setIsModalOpen(false);
            loadData();
        } catch (error) { alert("خطا در ذخیره دوره"); }
    };

    const handleDelete = async (id: number) => {
        if (!token || !window.confirm("آیا از حذف این دوره مطمئن هستید؟")) return;
        try {
            await deleteCourse(id, token);
            loadData();
        } catch (error) { alert("خطا در حذف دوره"); }
    };
    
    if (isLoading) { return <div className="flex items-center justify-center p-8"><Loader2 className="h-6 w-6 animate-spin" /></div>; }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>مدیریت دوره‌ها</CardTitle>
                <Button onClick={() => { setCurrentCourse({ title: '', description: '' }); setIsModalOpen(true); }}>
                    <PlusCircle className="mr-2 h-4 w-4" /> دوره جدید
                </Button>
            </CardHeader>
            <CardContent className="space-y-2">
                {courses.map(course => (
                    <div key={course.id} className="flex items-center justify-between p-2 border rounded-md">
                        <div>
                            <p className="font-semibold">{course.title}</p>
                            <p className="text-sm text-muted-foreground">{course.faculty.name} - {course.professor.name}</p>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="ghost" size="icon" onClick={() => { setCurrentCourse({ ...course, faculty: course.faculty.id, professor: course.professor.id }); setIsModalOpen(true); }}><Edit className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDelete(course.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                        </div>
                    </div>
                ))}
            </CardContent>
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent>
                    <DialogHeader><DialogTitle>{currentCourse.id ? 'ویرایش دوره' : 'دوره جدید'}</DialogTitle></DialogHeader>
                    <div className="py-4 space-y-4">
                        <div className="grid gap-2"><Label>عنوان دوره</Label><Input value={currentCourse.title || ''} onChange={e => setCurrentCourse({...currentCourse, title: e.target.value})} /></div>
                        <div className="grid gap-2"><Label>توضیحات</Label><Input value={currentCourse.description || ''} onChange={e => setCurrentCourse({...currentCourse, description: e.target.value})} /></div>
                        <div className="grid gap-2"><Label>دانشکده</Label>
                            <Select value={currentCourse.faculty?.toString()} onValueChange={(value) => setCurrentCourse({...currentCourse, faculty: parseInt(value, 10)})}>
                                <SelectTrigger><SelectValue placeholder="انتخاب کنید..." /></SelectTrigger>
                                <SelectContent>{faculties.map(f => <SelectItem key={f.id} value={f.id.toString()}>{f.name}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2"><Label>استاد</Label>
                            <Select value={currentCourse.professor?.toString()} onValueChange={(value) => setCurrentCourse({...currentCourse, professor: parseInt(value, 10)})}>
                                <SelectTrigger><SelectValue placeholder="انتخاب کنید..." /></SelectTrigger>
                                <SelectContent>{professors.map(p => <SelectItem key={p.id} value={p.id.toString()}>{p.name}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter><DialogClose asChild><Button variant="ghost">لغو</Button></DialogClose><Button onClick={handleSave}>ذخیره</Button></DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    );
}

export default CourseManagementTab;
