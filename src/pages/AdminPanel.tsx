// src/pages/AdminPanel.tsx
import Layout from "@/components/Layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import {
  CustomUserSerializer, Faculty, Course, Professor,
  fetchUsersAPI, toggleUserApprovalAPI, setUserActiveStatusAPI,
  fetchFaculties, createFaculty, updateFaculty, deleteFaculty,
  fetchCourses, fetchProfessors, createProfessor, updateProfessor, deleteProfessor,
  createCourse, updateCourse, deleteCourse
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, ShieldAlert, Loader2, Ban, PlusCircle, Edit, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

// کامپوننت مدیریت کاربران (بدون تغییر)
const UserManagementTab = () => {
    // ... محتوای این کامپوننت بدون تغییر باقی می‌ماند ...
    const { token } = useAuth();
    const [users, setUsers] = useState<CustomUserSerializer[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const fetchUsers = async () => { if (!token) { setIsLoading(false); return; } try { setIsLoading(true); const data = await fetchUsersAPI(token); setUsers(data); } catch (error) { setError("خطا در دریافت لیست کاربران."); } finally { setIsLoading(false); } };
    useEffect(() => { fetchUsers(); }, [token]);
    const handleToggleApproval = async (profileId: number, isApproved: boolean) => { if (!token) return; try { await toggleUserApprovalAPI(profileId, !isApproved, token); await fetchUsers(); } catch (error) { alert('خطا در تغییر وضعیت تایید کاربر.'); } };
    const handleToggleBan = async (user: CustomUserSerializer) => { if (!token || !window.confirm(`آیا از ${user.is_active ? 'غیرفعال' : 'فعال'} کردن کاربر ${user.first_name} مطمئن هستید؟`)) return; try { await setUserActiveStatusAPI(user.id, !user.is_active, token); fetchUsers(); } catch (error) { alert('خطا در تغییر وضعیت کاربر.'); } };
    if (isLoading) { return <div className="flex items-center justify-center p-8"><Loader2 className="h-6 w-6 animate-spin" /></div>; }
    if (error) { return <p className="text-destructive text-center p-8">{error}</p>; }
    return (
        <Card>
            <CardHeader><CardTitle>مدیریت کاربران</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                {users.map(user => (user.profile && (
                    <div key={user.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg gap-4">
                        <div>
                            <p className="font-semibold">{user.first_name} {user.last_name}</p>
                            <p className="text-sm text-muted-foreground">شماره دانشجویی: {user.username}</p>
                            <div className="flex items-center gap-2 mt-1">
                                <Badge variant={user.profile.is_approved ? "default" : "secondary"}>{user.profile.is_approved ? "تایید شده" : "تایید نشده"}</Badge>
                                <Badge variant={user.is_active ? "outline" : "destructive"}>{user.is_active ? "فعال" : "غیرفعال"}</Badge>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 self-end sm:self-center">
                            <Button size="sm" title={user.profile.is_approved ? "لغو تایید" : "تایید کاربر"} variant="outline" onClick={() => handleToggleApproval(user.profile.id, user.profile.is_approved)}>{user.profile.is_approved ? <ShieldAlert className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}</Button>
                            <Button size="sm" title={user.is_active ? "غیرفعال کردن" : "فعال کردن"} variant="destructive" onClick={() => handleToggleBan(user)}><Ban className="h-4 w-4" /></Button>
                        </div>
                    </div>
                )))}
            </CardContent>
        </Card>
    );
};

// کامپوننت مدیریت دانشکده‌ها (بدون تغییر)
const FacultyManagementTab = () => {
    // ... محتوای این کامپوننت بدون تغییر باقی می‌ماند ...
    const { token } = useAuth();
    const [faculties, setFaculties] = useState<Faculty[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentFaculty, setCurrentFaculty] = useState<Partial<Faculty>>({ name: '' });
    const loadFaculties = async () => { try { setIsLoading(true); const data = await fetchFaculties(); setFaculties(data); } catch (error) { console.error(error); } finally { setIsLoading(false); } };
    useEffect(() => { loadFaculties(); }, []);
    const handleSave = async () => { if (!token || !currentFaculty.name) return; try { if (currentFaculty.id) { await updateFaculty(currentFaculty.id, currentFaculty.name, token); } else { await createFaculty(currentFaculty.name, token); } setIsModalOpen(false); loadFaculties(); } catch (error) { alert("خطا در ذخیره دانشکده"); } };
    const handleDelete = async (id: number) => { if (!token || !window.confirm("آیا از حذف این دانشکده مطمئن هستید؟")) return; try { await deleteFaculty(id, token); loadFaculties(); } catch (error) { alert("خطا در حذف دانشکده"); } };
    if (isLoading) { return <div className="flex items-center justify-center p-8"><Loader2 className="h-6 w-6 animate-spin" /></div>; }
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between"><CardTitle>مدیریت دانشکده‌ها</CardTitle><Button onClick={() => { setCurrentFaculty({ name: '' }); setIsModalOpen(true); }}><PlusCircle className="mr-2 h-4 w-4" /> دانشکده جدید</Button></CardHeader>
            <CardContent className="space-y-2">
                {faculties.map(faculty => (<div key={faculty.id} className="flex items-center justify-between p-2 border rounded-md"><p className="font-medium">{faculty.name}</p><div className="flex gap-2"><Button variant="ghost" size="icon" onClick={() => { setCurrentFaculty(faculty); setIsModalOpen(true); }}><Edit className="h-4 w-4" /></Button><Button variant="ghost" size="icon" onClick={() => handleDelete(faculty.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button></div></div>))}
            </CardContent>
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}><DialogContent><DialogHeader><DialogTitle>{currentFaculty.id ? 'ویرایش دانشکده' : 'دانشکده جدید'}</DialogTitle></DialogHeader><div className="py-4 space-y-2"><Label htmlFor="faculty-name">نام دانشکده</Label><Input id="faculty-name" value={currentFaculty.name || ''} onChange={e => setCurrentFaculty({ ...currentFaculty, name: e.target.value })} /></div><DialogFooter><DialogClose asChild><Button variant="ghost">لغو</Button></DialogClose><Button onClick={handleSave}>ذخیره</Button></DialogFooter></DialogContent></Dialog>
        </Card>
    );
};

// کامپوننت مدیریت اساتید (بدون تغییر)
const ProfessorManagementTab = () => {
    // ... محتوای این کامپوننت بدون تغییر باقی می‌ماند ...
    const { token } = useAuth();
    const [professors, setProfessors] = useState<Professor[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentProfessor, setCurrentProfessor] = useState<Partial<Professor>>({ name: '' });
    const loadProfessors = async () => { try { setIsLoading(true); const data = await fetchProfessors(); setProfessors(data); } catch (error) { console.error(error); } finally { setIsLoading(false); } };
    useEffect(() => { loadProfessors(); }, []);
    const handleSave = async () => { if (!token || !currentProfessor.name) return; try { if (currentProfessor.id) { await updateProfessor(currentProfessor.id, currentProfessor.name, token); } else { await createProfessor(currentProfessor.name, token); } setIsModalOpen(false); loadProfessors(); } catch (error) { alert("خطا در ذخیره استاد"); } };
    const handleDelete = async (id: number) => { if (!token || !window.confirm("آیا از حذف این استاد مطمئن هستید؟")) return; try { await deleteProfessor(id, token); loadProfessors(); } catch (error) { alert("خطا در حذف استاد"); } };
    if (isLoading) { return <div className="flex items-center justify-center p-8"><Loader2 className="h-6 w-6 animate-spin" /></div>; }
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between"><CardTitle>مدیریت اساتید</CardTitle><Button onClick={() => { setCurrentProfessor({ name: '' }); setIsModalOpen(true); }}><PlusCircle className="mr-2 h-4 w-4" /> استاد جدید</Button></CardHeader>
            <CardContent className="space-y-2">
                {professors.map(prof => (<div key={prof.id} className="flex items-center justify-between p-2 border rounded-md"><p className="font-medium">{prof.name}</p><div className="flex gap-2"><Button variant="ghost" size="icon" onClick={() => { setCurrentProfessor(prof); setIsModalOpen(true); }}><Edit className="h-4 w-4" /></Button><Button variant="ghost" size="icon" onClick={() => handleDelete(prof.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button></div></div>))}
            </CardContent>
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}><DialogContent><DialogHeader><DialogTitle>{currentProfessor.id ? 'ویرایش استاد' : 'استاد جدید'}</DialogTitle></DialogHeader><div className="py-4 space-y-2"><Label htmlFor="prof-name">نام استاد</Label><Input id="prof-name" value={currentProfessor.name || ''} onChange={e => setCurrentProfessor({ ...currentProfessor, name: e.target.value })} /></div><DialogFooter><DialogClose asChild><Button variant="ghost">لغو</Button></DialogClose><Button onClick={handleSave}>ذخیره</Button></DialogFooter></DialogContent></Dialog>
        </Card>
    );
};

// ===================================================================
// ===== کامپوننت مدیریت دوره‌ها (تغییرات اصلی در اینجا اعمال شده) =====
// ===================================================================
const CourseManagementTab = () => {
    const { token } = useAuth();
    const [courses, setCourses] = useState<Course[]>([]);
    const [faculties, setFaculties] = useState<Faculty[]>([]);
    const [professors, setProfessors] = useState<Professor[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentCourse, setCurrentCourse] = useState<Partial<Course> & { faculty_id?: number, professor_id?: number }>({});
    
    // ADDED: State for the new "Add Professor" modal
    const [isProfessorModalOpen, setIsProfessorModalOpen] = useState(false);
    const [newProfessorName, setNewProfessorName] = useState("");

    const loadData = async () => { 
        try { 
            setIsLoading(true); 
            const [coursesData, facultiesData, professorsData] = await Promise.all([fetchCourses(), fetchFaculties(), fetchProfessors()]); 
            setCourses(coursesData); 
            setFaculties(facultiesData); 
            setProfessors(professorsData); 
        } catch (error) { console.error(error); } 
        finally { setIsLoading(false); } 
    };

    useEffect(() => { loadData(); }, []);

    const handleSave = async () => {
        if (!token || !currentCourse.title || !currentCourse.faculty_id || !currentCourse.professor_id) { alert("لطفاً تمام فیلدهای اجباری را پر کنید."); return; }
        const courseData = { title: currentCourse.title, description: currentCourse.description || '', faculty: currentCourse.faculty_id, professor: currentCourse.professor_id };
        try { 
            if (currentCourse.id) { await updateCourse(currentCourse.id, courseData, token); } 
            else { await createCourse(courseData, token); } 
            setIsModalOpen(false); 
            loadData(); 
        } catch (error) { alert("خطا در ذخیره دوره"); }
    };

    const handleDelete = async (id: number) => { 
        if (!token || !window.confirm("آیا از حذف این دوره مطمئن هستید؟")) return; 
        try { await deleteCourse(id, token); loadData(); } catch (error) { alert("خطا در حذف دوره"); } 
    };

    // ADDED: Function to handle adding a new professor
    const handleAddNewProfessor = async () => {
        if (!token || !newProfessorName.trim()) {
            alert("لطفاً نام استاد را وارد کنید.");
            return;
        }
        try {
            const newProfessor = await createProfessor(newProfessorName, token);
            // Add the new professor to the list and auto-select them
            setProfessors(prev => [...prev, newProfessor]);
            setCurrentCourse(prev => ({ ...prev, professor_id: newProfessor.id }));
            // Close the modal and reset the form
            setIsProfessorModalOpen(false);
            setNewProfessorName("");
        } catch (error) {
            alert("خطا در افزودن استاد جدید.");
        }
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
                            <Button variant="ghost" size="icon" onClick={() => { setCurrentCourse({ ...course, faculty_id: course.faculty.id, professor_id: course.professor.id }); setIsModalOpen(true); }}><Edit className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDelete(course.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                        </div>
                    </div>
                ))}
            </CardContent>
            
            {/* Course Add/Edit Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent>
                    <DialogHeader><DialogTitle>{currentCourse.id ? 'ویرایش دوره' : 'دوره جدید'}</DialogTitle></DialogHeader>
                    <div className="py-4 space-y-4">
                        <div className="grid gap-2"><Label>عنوان دوره</Label><Input value={currentCourse.title || ''} onChange={e => setCurrentCourse({ ...currentCourse, title: e.target.value })} /></div>
                        <div className="grid gap-2"><Label>توضیحات</Label><Textarea value={currentCourse.description || ''} onChange={e => setCurrentCourse({ ...currentCourse, description: e.target.value })} /></div>
                        <div className="grid gap-2"><Label>دانشکده</Label><Select value={currentCourse.faculty_id?.toString()} onValueChange={(value) => setCurrentCourse({ ...currentCourse, faculty_id: parseInt(value, 10) })}><SelectTrigger><SelectValue placeholder="انتخاب کنید..." /></SelectTrigger><SelectContent>{faculties.map(f => <SelectItem key={f.id} value={f.id.toString()}>{f.name}</SelectItem>)}</SelectContent></Select></div>
                        
                        {/* CHANGED: Professor selection now has an "Add" button */}
                        <div className="grid gap-2">
                            <Label>استاد</Label>
                            <div className="flex items-center gap-2">
                                <Select value={currentCourse.professor_id?.toString()} onValueChange={(value) => setCurrentCourse({ ...currentCourse, professor_id: parseInt(value, 10) })}>
                                    <SelectTrigger><SelectValue placeholder="انتخاب کنید..." /></SelectTrigger>
                                    <SelectContent>{professors.map(p => <SelectItem key={p.id} value={p.id.toString()}>{p.name}</SelectItem>)}</SelectContent>
                                </Select>
                                <Button variant="outline" size="icon" onClick={() => setIsProfessorModalOpen(true)}>
                                    <PlusCircle className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                    <DialogFooter><DialogClose asChild><Button variant="ghost">لغو</Button></DialogClose><Button onClick={handleSave}>ذخیره</Button></DialogFooter>
                </DialogContent>
            </Dialog>

            {/* ADDED: New Modal for adding a professor */}
            <Dialog open={isProfessorModalOpen} onOpenChange={setIsProfessorModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>افزودن استاد جدید</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="prof-name" className="text-right">نام استاد</Label>
                            <Input id="prof-name" value={newProfessorName} onChange={(e) => setNewProfessorName(e.target.value)} className="col-span-3" />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild><Button variant="ghost">لغو</Button></DialogClose>
                        <Button onClick={handleAddNewProfessor}>ذخیره</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    );
};

// کامپوننت اصلی پنل مدیریت (بدون تغییر)
const AdminPanel = () => {
    // ... محتوای این کامپوننت بدون تغییر باقی می‌ماند ...
    const { user, isLoading } = useAuth();
    if (isLoading) { return <Layout><div className="text-center p-8">در حال بررسی دسترسی...</div></Layout>; }
    if (!user?.profile?.is_supervisor) { return <Layout><div className="text-center p-8"><h1 className="text-2xl font-bold text-destructive">عدم دسترسی</h1><p className="text-muted-foreground">شما اجازه دسترسی به این صفحه را ندارید.</p></div></Layout>; }
    return (
        <Layout>
            <div className="space-y-8 p-4 md:p-8">
                <h1 className="text-4xl font-bold">پنل مدیریت سرپرست</h1>
                <Tabs defaultValue="users" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="users">کاربران</TabsTrigger>
                        <TabsTrigger value="faculties">دانشکده‌ها</TabsTrigger>
                        <TabsTrigger value="professors">اساتید</TabsTrigger>
                        <TabsTrigger value="courses">دوره‌ها</TabsTrigger>
                    </TabsList>
                    <TabsContent value="users" className="mt-6"><UserManagementTab /></TabsContent>
                    <TabsContent value="faculties" className="mt-6"><FacultyManagementTab /></TabsContent>
                    <TabsContent value="professors" className="mt-6"><ProfessorManagementTab /></TabsContent>
                    <TabsContent value="courses" className="mt-6"><CourseManagementTab /></TabsContent>
                </Tabs>
            </div>
        </Layout>
    );
};

export default AdminPanel;