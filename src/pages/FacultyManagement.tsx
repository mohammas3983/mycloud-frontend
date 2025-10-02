// src/pages/admin-components/FacultyManagement.tsx
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Faculty } from "@/lib/api";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// توابع API (فرض می‌کنیم از قبل موجود هستند)
const fetchFaculties = async () => { /* ... */ };
const createFaculty = async (name: string, token: string) => { /* ... */ };
const updateFaculty = async (id: number, name: string, token: string) => { /* ... */ };
const deleteFaculty = async (id: number, token: string) => { /* ... */ };

const FacultyManagement = () => {
  const { token } = useAuth();
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentFaculty, setCurrentFaculty] = useState<Partial<Faculty>>({ name: '' });

  const loadFaculties = async () => {
    setIsLoading(true);
    try {
      const data = await fetchFaculties();
      setFaculties(data);
    } catch (error) { console.error(error); }
    setIsLoading(false);
  };

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
    <Card className="max-w-3xl mx-auto mt-8 shadow-lg border border-gray-200">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl font-bold text-gray-800">مدیریت دانشکده‌ها</CardTitle>
        <Button
          variant="secondary"
          onClick={() => { setCurrentFaculty({ name: '' }); setIsModalOpen(true); }}
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:scale-105 transition-transform duration-200"
        >
          <PlusCircle className="h-5 w-5" /> دانشکده جدید
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading ? (
          <p className="text-gray-500 animate-pulse">در حال بارگذاری...</p>
        ) : (
          <AnimatePresence>
            {faculties.map(faculty => (
              <motion.div
                key={faculty.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
                className="flex justify-between items-center p-4 bg-white rounded-lg shadow hover:shadow-xl transition-shadow duration-300 border border-gray-100"
              >
                <span className="text-lg font-medium text-gray-800">{faculty.name}</span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1 text-blue-600 hover:text-white hover:bg-blue-600 transition-colors duration-200"
                    onClick={() => { setCurrentFaculty(faculty); setIsModalOpen(true); }}
                  >
                    <Edit className="h-4 w-4" /> ویرایش
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1 text-red-600 hover:text-white hover:bg-red-600 transition-colors duration-200"
                    onClick={() => handleDelete(faculty.id)}
                  >
                    <Trash2 className="h-4 w-4" /> حذف
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </CardContent>

      {/* Modal Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent asChild>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.25 }}
            className="bg-white rounded-xl shadow-xl p-6 max-w-md mx-auto"
          >
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-gray-800">
                {currentFaculty.id ? "ویرایش دانشکده" : "افزودن دانشکده جدید"}
              </DialogTitle>
            </DialogHeader>
            <div className="mt-4 space-y-4">
              <div className="flex flex-col">
                <Label htmlFor="faculty-name">نام دانشکده</Label>
                <Input
                  id="faculty-name"
                  value={currentFaculty.name}
                  onChange={e => setCurrentFaculty({ ...currentFaculty, name: e.target.value })}
                  placeholder="نام دانشکده را وارد کنید..."
                />
              </div>
            </div>
            <DialogFooter className="mt-6 flex justify-end gap-2">
              <DialogClose asChild>
                <Button variant="ghost">انصراف</Button>
              </DialogClose>
              <Button onClick={handleSave} className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:scale-105 transition-transform duration-200">
                ذخیره
              </Button>
            </DialogFooter>
          </motion.div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default FacultyManagement;
