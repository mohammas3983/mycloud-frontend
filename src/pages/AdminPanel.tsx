// src/pages/AdminPanel.tsx

import Layout from "@/components/Layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
import { 
    CheckCircle, ShieldAlert, Loader2, Ban, PlusCircle, Edit, Trash2, MessageSquare, Search 
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

// ==========================================
// 1. کامپوننت مدیریت کاربران
// ==========================================
const UserManagementTab = () => {
    const { token } = useAuth();
    const [users, setUsers] = useState<CustomUserSerializer[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<CustomUserSerializer[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState("");

    const loadUsers = async () => {
        setIsLoading(true);
        try {
            const data = await fetchUsersAPI(token);
            setUsers(data);
            setFilteredUsers(data);
        } catch (error) { console.error(error); } 
        finally { setIsLoading(false); }
    };

    useEffect(() => { if (token) loadUsers(); }, [token]);

    // فیلتر جستجو
    useEffect(() => {
        setFilteredUsers(
            users.filter(u => 
                u.first_name?.includes(search) || 
                u.last_name?.includes(search) || 
                u.username?.includes(search)
            )
        );
    }, [search, users]);

    const handleToggleApproval = async (userId: number, currentStatus: boolean) => {
        try { await toggleUserApprovalAPI(userId, !currentStatus, token!); loadUsers(); } catch (err) { console.error(err); }
    };

    const handleToggleActive = async (userId: number, currentStatus: boolean) => {
        try { await setUserActiveStatusAPI(userId, !currentStatus, token!); loadUsers(); } catch (err) { console.error(err); }
    };

    if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>مدیریت کاربران ({users.length})</CardTitle>
                <div className="relative w-64">
                    <Search className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="جستجو..." 
                        className="pr-8" 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-right">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th className="px-4 py-3">نام</th>
                                <th className="px-4 py-3">شماره دانشجویی</th>
                                <th className="px-4 py-3">رشته</th>
                                <th className="px-4 py-3">وضعیت تایید</th>
                                <th className="px-4 py-3">اکانت</th>
                                <th className="px-4 py-3">عملیات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50">
                                    <td className="px-4 py-3 font-medium">{user.first_name} {user.last_name}</td>
                                    <td className="px-4 py-3">{user.username}</td>
                                    <td className="px-4 py-3">{user.profile?.major || '-'}</td>
                                    <td className="px-4 py-3">
                                        <Badge variant={user.profile?.is_approved ? "default" : "secondary"} className={user.profile?.is_approved ? "bg-green-500 hover:bg-green-600" : "bg-yellow-500 hover:bg-yellow-600"}>
                                            {user.profile?.is_approved ? "تایید شده" : "در انتظار"}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3">
                                        <Badge variant={user.is_active ? "outline" : "destructive"}>
                                            {user.is_active ? "فعال" : "غیرفعال"}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3 flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            title={user.profile?.is_approved ? "لغو تایید" : "تایید"}
                                            disabled={!user.profile?.id}
                                            onClick={() => {
                                                if (!user.profile?.id) return;
                                                handleToggleApproval(user.profile.id, user.profile.is_approved || false);
                                            }}
                                        >
                                            {user.profile?.is_approved ? <ShieldAlert className="h-4 w-4 text-orange-500"/> : <CheckCircle className="h-4 w-4 text-green-500"/>}
                                        </Button>
                                        <Button variant="ghost" size="icon" title={user.is_active ? "مسدود کردن" : "فعال کردن"} onClick={() => handleToggleActive(user.id, user.is_active)}>
                                            {user.is_active ? <Ban className="h-4 w-4 text-red-500" /> : <CheckCircle className="h-4 w-4 text-green-500" />}
                                        </Button>
                                        {/* دکمه جاسوسی (Spy) */}
                                        <Link to={`/messenger?spy_id=${user.id}`} target="_blank">
                                            <Button variant="secondary" size="icon" title="مشاهده پیام‌ها">
                                                <MessageSquare className="h-4 w-4 text-blue-500" />
                                            </Button>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
};

// ==========================================
// 2. کامپوننت مدیریت دانشکده‌ها
// ==========================================
const FacultyManagementTab = () => {
    const { token } = useAuth();
    const [faculties, setFaculties] = useState<Faculty[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentFaculty, setCurrentFaculty] = useState<Partial<Faculty>>({ name: '' });

    const loadFaculties = async () => { 
        try { 
            setIsLoading(true); 
            const data = await fetchFaculties(); 
            setFaculties(data); 
        } catch (error) { console.error(error); } 
        finally { setIsLoading(false); } 
    };

    useEffect(() => { loadFaculties(); }, []);

    const handleSave = async () => { 
        if (!token || !currentFaculty.name) return; 
        try { 
            if (currentFaculty.id) { await updateFaculty(currentFaculty.id, currentFaculty.name, token); } 
            else { await createFaculty(currentFaculty.name, token); } 
            setIsModalOpen(false); 
            loadFaculties(); 
        } catch (error) { alert("خطا در ذخیره دانشکده"); } 
    };

    const handleDelete = async (id: number) => { 
        if (!token || !window.confirm("آیا از حذف این دانشکده مطمئن هستید؟")) return; 
        try { await deleteFaculty(id, token); loadFaculties(); } 
        catch (error) { alert("خطا در حذف دانشکده"); } 
    };

    if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>مدیریت دانشکده‌ها</CardTitle>
                <Button onClick={() => { setCurrentFaculty({ name: '' }); setIsModalOpen(true); }}>
                    <PlusCircle className="mr-2 h-4 w-4" /> دانشکده جدید
                </Button>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {faculties.map(faculty => (
                        <div key={faculty.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                            <span className="font-medium">{faculty.name}</span>
                            <div className="flex gap-2">
                                <Button variant="ghost" size="icon" onClick={() => { setCurrentFaculty(faculty); setIsModalOpen(true); }}><Edit className="h-4 w-4 text-blue-500" /></Button>
                                <Button variant="ghost" size="icon" onClick={() => handleDelete(faculty.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent>
                    <DialogHeader><DialogTitle>{currentFaculty.id ? 'ویرایش دانشکده' : 'دانشکده جدید'}</DialogTitle></DialogHeader>
                    <div className="py-4 space-y-2">
                        <Label>نام دانشکده</Label>
                        <Input value={currentFaculty.name || ''} onChange={e => setCurrentFaculty({ ...currentFaculty, name: e.target.value })} />
                    </div>
                    <DialogFooter>
                        <DialogClose asChild><Button variant="ghost">لغو</Button></DialogClose>
                        <Button onClick={handleSave}>ذخیره</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    );
};

// ==========================================
// 3. کامپوننت مدیریت اساتید
// ==========================================
const ProfessorManagementTab = () => {
    const { token } = useAuth();
    const [professors, setProfessors] = useState<Professor[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentProfessor, setCurrentProfessor] = useState<Partial<Professor>>({ name: '' });

    const loadProfessors = async () => { 
        try { 
            setIsLoading(true); 
            const data = await fetchProfessors(); 
            setProfessors(data); 
        } catch (error) { console.error(error); } 
        finally { setIsLoading(false); } 
    };

    useEffect(() => { loadProfessors(); }, []);

    const handleSave = async () => { 
        if (!token || !currentProfessor.name) return; 
        try { 
            if (currentProfessor.id) { await updateProfessor(currentProfessor.id, currentProfessor.name, token); } 
            else { await createProfessor(currentProfessor.name, token); } 
            setIsModalOpen(false); 
            loadProfessors(); 
        } catch (error) { alert("خطا در ذخیره استاد"); } 
    };

    const handleDelete = async (id: number) => { 
        if (!token || !window.confirm("آیا از حذف این استاد مطمئن هستید؟")) return; 
        try { await deleteProfessor(id, token); loadProfessors(); } 
        catch (error) { alert("خطا در حذف استاد"); } 
    };

    if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>مدیریت اساتید</CardTitle>
                <Button onClick={() => { setCurrentProfessor({ name: '' }); setIsModalOpen(true); }}>
                    <PlusCircle className="mr-2 h-4 w-4" /> استاد جدید
                </Button>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {professors.map(prof => (
                        <div key={prof.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                            <span className="font-medium">{prof.name}</span>
                            <div className="flex gap-2">
                                <Button variant="ghost" size="icon" onClick={() => { setCurrentProfessor(prof); setIsModalOpen(true); }}><Edit className="h-4 w-4 text-blue-500" /></Button>
                                <Button variant="ghost" size="icon" onClick={() => handleDelete(prof.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent>
                    <DialogHeader><DialogTitle>{currentProfessor.id ? 'ویرایش استاد' : 'استاد جدید'}</DialogTitle></DialogHeader>
                    <div className="py-4 space-y-2">
                        <Label>نام استاد</Label>
                        <Input value={currentProfessor.name || ''} onChange={e => setCurrentProfessor({ ...currentProfessor, name: e.target.value })} />
                    </div>
                    <DialogFooter>
                        <DialogClose asChild><Button variant="ghost">لغو</Button></DialogClose>
                        <Button onClick={handleSave}>ذخیره</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    );
};

// ==========================================
// 4. کامپوننت مدیریت دوره‌ها
// ==========================================
const CourseManagementTab = () => {
    const { token } = useAuth();
    const [courses, setCourses] = useState<Course[]>([]);
    const [faculties, setFaculties] = useState<Faculty[]>([]);
    const [professors, setProfessors] = useState<Professor[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentCourse, setCurrentCourse] = useState<Partial<Course> & { faculty_id?: number, professor_id?: number }>({});
    
    // مدال افزودن سریع استاد
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
        if (!token || !currentCourse.title || !currentCourse.faculty_id || !currentCourse.professor_id) { 
            alert("لطفاً تمام فیلدهای اجباری را پر کنید."); return; 
        }
        const courseData = { 
            title: currentCourse.title, 
            description: currentCourse.description || '', 
            faculty: currentCourse.faculty_id, 
            professor: currentCourse.professor_id 
        };
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

    const handleAddNewProfessor = async () => {
        if (!token || !newProfessorName.trim()) { alert("نام استاد الزامی است"); return; }
        try {
            const newProfessor = await createProfessor(newProfessorName, token);
            setProfessors(prev => [...prev, newProfessor]);
            setCurrentCourse(prev => ({ ...prev, professor_id: newProfessor.id }));
            setIsProfessorModalOpen(false);
            setNewProfessorName("");
        } catch (error) { alert("خطا در افزودن استاد"); }
    };
    
    if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>مدیریت دوره‌ها</CardTitle>
                <Button onClick={() => { setCurrentCourse({ title: '', description: '' }); setIsModalOpen(true); }}>
                    <PlusCircle className="mr-2 h-4 w-4" /> دوره جدید
                </Button>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    {courses.map(course => (
                        <div key={course.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                            <div>
                                <p className="font-semibold">{course.title}</p>
                                <p className="text-sm text-muted-foreground">{course.faculty?.name} - {course.professor?.name}</p>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="ghost" size="icon" onClick={() => { setCurrentCourse({ ...course, faculty_id: course.faculty?.id, professor_id: course.professor?.id }); setIsModalOpen(true); }}><Edit className="h-4 w-4 text-blue-500" /></Button>
                                <Button variant="ghost" size="icon" onClick={() => handleDelete(course.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
            
            {/* مدال افزودن/ویرایش دوره */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent>
                    <DialogHeader><DialogTitle>{currentCourse.id ? 'ویرایش دوره' : 'دوره جدید'}</DialogTitle></DialogHeader>
                    <div className="py-4 space-y-4">
                        <div className="grid gap-2"><Label>عنوان دوره</Label><Input value={currentCourse.title || ''} onChange={e => setCurrentCourse({ ...currentCourse, title: e.target.value })} /></div>
                        <div className="grid gap-2"><Label>توضیحات</Label><Textarea value={currentCourse.description || ''} onChange={e => setCurrentCourse({ ...currentCourse, description: e.target.value })} /></div>
                        
                        <div className="grid gap-2">
                            <Label>دانشکده</Label>
                            <Select value={currentCourse.faculty_id?.toString()} onValueChange={(val) => setCurrentCourse({ ...currentCourse, faculty_id: parseInt(val) })}>
                                <SelectTrigger><SelectValue placeholder="انتخاب دانشکده..." /></SelectTrigger>
                                <SelectContent>{faculties.map(f => <SelectItem key={f.id} value={f.id.toString()}>{f.name}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>
                        
                        <div className="grid gap-2">
                            <Label>استاد</Label>
                            <div className="flex gap-2">
                                <Select value={currentCourse.professor_id?.toString()} onValueChange={(val) => setCurrentCourse({ ...currentCourse, professor_id: parseInt(val) })}>
                                    <SelectTrigger className="w-full"><SelectValue placeholder="انتخاب استاد..." /></SelectTrigger>
                                    <SelectContent>{professors.map(p => <SelectItem key={p.id} value={p.id.toString()}>{p.name}</SelectItem>)}</SelectContent>
                                </Select>
                                <Button variant="outline" size="icon" onClick={() => setIsProfessorModalOpen(true)} title="افزودن استاد جدید"><PlusCircle className="h-4 w-4" /></Button>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild><Button variant="ghost">لغو</Button></DialogClose>
                        <Button onClick={handleSave}>ذخیره</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* مدال افزودن سریع استاد */}
            <Dialog open={isProfessorModalOpen} onOpenChange={setIsProfessorModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader><DialogTitle>افزودن استاد جدید</DialogTitle></DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="prof-name" className="text-right">نام استاد</Label>
                            <Input id="prof-name" value={newProfessorName} onChange={(e) => setNewProfessorName(e.target.value)} className="col-span-3" />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild><Button variant="ghost">لغو</Button></DialogClose>
                        <Button onClick={handleAddNewProfessor}>افزودن</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    );
};

// ==========================================
// 5. صفحه اصلی پنل ادمین
// ==========================================
const AdminPanel = () => {
    const { user, isLoading } = useAuth();
    if (isLoading) return <Layout><div className="text-center p-8">در حال بررسی...</div></Layout>;
    if (!user?.profile?.is_supervisor) return <Layout><div className="text-center p-8 text-red-500 font-bold">شما دسترسی ندارید.</div></Layout>;
    
    return (
        <Layout>
            <div className="space-y-8 p-4 md:p-8">
                <h1 className="text-3xl font-bold">پنل مدیریت</h1>
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