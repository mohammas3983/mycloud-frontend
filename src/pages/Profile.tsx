// src/pages/Profile.tsx
import Layout from "@/components/Layout/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";
import { Faculty, fetchFaculties, CustomUserSerializer } from "@/lib/api";
import { Loader2 } from "lucide-react";

async function updateUserProfile(data: any, token: string) {
    const response = await fetch('http://127.0.0.1:8000/auth/users/me/', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Token ${token}` },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        const errorData = await response.json();
        console.error("Profile update error:", errorData);
        throw new Error("Failed to update profile");
    }
    return response.json();
}

const ProfilePage = () => {
    const { user, token, isLoading: authLoading, refreshUser } = useAuth();
    const [formData, setFormData] = useState({ first_name: '', last_name: '', email: '', major: '', phone_number: '', faculty: 0 });
    const [faculties, setFaculties] = useState<Faculty[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                email: user.email || '',
                major: user.profile?.major || '',
                phone_number: user.profile?.phone_number || '',
                faculty: user.profile?.faculty || 0,
            });
        }
        fetchFaculties().then(setFaculties);
    }, [user]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSelectChange = (value: string) => {
        setFormData({ ...formData, faculty: parseInt(value, 10) });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return;
        setIsSubmitting(true);
        const profileData = { major: formData.major, phone_number: formData.phone_number, faculty: formData.faculty };
        const userData = { first_name: formData.first_name, last_name: formData.last_name, email: formData.email, profile: profileData };
        try {
            await updateUserProfile(userData, token);
            alert("پروفایل با موفقیت آپدیت شد!");
            refreshUser();
        } catch (error) {
            alert("خطا در آپدیت پروفایل.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (authLoading || !user) return <Layout><div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div></Layout>;

    return (
        <Layout>
            <div className="max-w-2xl mx-auto p-4 md:p-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">پروفایل کاربری</CardTitle>
                        <CardDescription>اطلاعات کاربری خود را در اینجا مشاهده و ویرایش کنید.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div><Label>نام</Label><Input name="first_name" value={formData.first_name} onChange={handleInputChange} /></div>
                                <div><Label>نام خانوادگی</Label><Input name="last_name" value={formData.last_name} onChange={handleInputChange} /></div>
                            </div>
                            <div><Label>شماره دانشجویی (غیرقابل تغییر)</Label><Input value={user.username} disabled /></div>
                            <div><Label>ایمیل</Label><Input name="email" type="email" value={formData.email} onChange={handleInputChange} /></div>
                            <div><Label>رشته تحصیلی</Label><Input name="major" value={formData.major} onChange={handleInputChange} /></div>
                            <div><Label>شماره موبایل</Label><Input name="phone_number" value={formData.phone_number} onChange={handleInputChange} /></div>
                            <div><Label>دانشکده</Label>
                                <Select value={formData.faculty?.toString()} onValueChange={handleSelectChange}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>{faculties.map(f => <SelectItem key={f.id} value={f.id.toString()}>{f.name}</SelectItem>)}</SelectContent>
                                </Select>
                            </div>
                            <Button type="submit" className="w-full" disabled={isSubmitting}>
                                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "ذخیره تغییرات"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </Layout>
    );
};
export default ProfilePage;