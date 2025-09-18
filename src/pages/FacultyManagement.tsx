// src/pages/admin-components/FacultyManagement.tsx
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Faculty } from "@/lib/api"; // از تایپ موجود استفاده می‌کنیم
import { PlusCircle, Edit, Trash2 } from "lucide-react";

// توابع API
const fetchFaculties = async () => { /* ... */ }; // این تابع از قبل در api.ts هست
const createFaculty = async (name: string, token: string) => { /* ... */ };
const updateFaculty = async (id: number, name: string, token: string) => { /* ... */ };
const deleteFaculty = async (id: number, token: string) => { /* ... */ };

const FacultyManagement = () => {
    const { token } = useAuth();
    const [faculties, setFaculties] = useState<Faculty[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentFaculty, setCurrentFaculty] = useState<Partial<Faculty>>({ name: '' });

    const loadFaculties = async () => { /* ... */ };
    useEffect(() => { loadFaculties(); }, []);

    const handleSave = async () => {
        if (!token || !currentFaculty.name) return;
        try {
            if (currentFaculty.id) {
                await updateFaculty(currentFaculty.id, currentFaculty.name, token);
            } else {
                await createFaculty(currentFaculty.name, token);
            }
            setIsModalOpen(false);
            loadFaculties();
        } catch (error) { alert("خطا در ذخیره دانشکده"); }
    };

    const handleDelete = async (id: number) => {
        if (!token || !window.confirm("آیا از حذف این دانشکده مطمئن هستید؟")) return;
        try {
            await deleteFaculty(id, token);
            loadFaculties();
        } catch (error) { alert("خطا در حذف دانشکده"); }
    };
    
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>مدیریت دانشکده‌ها</CardTitle>
                <Button onClick={() => { setCurrentFaculty({ name: '' }); setIsModalOpen(true); }}>
                    <PlusCircle className="mr-2 h-4 w-4" /> دانشکده جدید
                </Button>
            </CardHeader>
            <CardContent>
                {/* ... لیست دانشکده‌ها با دکمه‌های ویرایش و حذف ... */}
            </CardContent>

            {/* Modal Dialog */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                {/* ... فرم افزودن/ویرایش دانشکده ... */}
            </Dialog>
        </Card>
    );
}
export default FacultyManagement;