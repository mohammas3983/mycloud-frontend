// src/pages/AllFaculties.tsx
import { useState, useEffect } from "react";
import Layout from "@/components/Layout/Layout";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { fetchFaculties, Faculty } from "@/lib/api";
import { Loader2, Building2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const AllFaculties = () => {
    const [faculties, setFaculties] = useState<Faculty[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await fetchFaculties();
                setFaculties(data);
            } catch (error) { console.error(error); }
            finally { setIsLoading(false); }
        };
        loadData();
    }, []);

    const filteredFaculties = faculties.filter(faculty =>
        faculty.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (isLoading) return <Layout><div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div></Layout>;

    return (
        <Layout>
            <div className="space-y-8 p-4 md:p-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="space-y-2 text-center md:text-right">
                        <h1 className="text-4xl font-bold">دانشکده‌ها</h1>
                        <p className="text-lg text-muted-foreground">لیست تمام دانشکده‌های فعال</p>
                    </div>
                    <div className="relative w-full md:w-auto">
                        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="جستجوی نام دانشکده..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full md:w-80 pr-10"
                        />
                    </div>
                </div>
                {filteredFaculties.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredFaculties.map((faculty) => (
                            <Link to={`/faculty/${faculty.id}`} key={faculty.id}>
                                <Card className="h-full hover:border-primary transition-all hover:shadow-lg group">
                                    <CardHeader className="flex flex-row items-center gap-4">
                                        <div className="bg-primary/10 p-4 rounded-lg group-hover:scale-110 transition-transform">
                                            <Building2 className="h-8 w-8 text-primary" />
                                        </div>
                                        <div>
                                            <CardTitle className="group-hover:text-primary">{faculty.name}</CardTitle>
                                            <CardDescription>مشاهده دوره‌ها</CardDescription>
                                        </div>
                                    </CardHeader>
                                </Card>
                            </Link>
                        ))}
                    </div>
                 ) : (
                    <div className="text-center py-16">
                        <Building2 className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                        <h3 className="text-xl font-medium mb-2">هیچ دانشکده‌ای با این نام یافت نشد</h3>
                    </div>
                )}
            </div>
        </Layout>
    );
};
export default AllFaculties;