// src/pages/AllFaculties.tsx
import { useState, useEffect } from "react";
import Layout from "@/components/Layout/Layout";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { fetchFaculties, Faculty } from "@/lib/api";
import { Loader2, Building2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";

const AllFaculties = () => {
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchFaculties();
        setFaculties(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const filteredFaculties = faculties.filter(faculty =>
    faculty.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center p-16">
          <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8 p-4 md:p-8">
        {/* Header + Search */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="space-y-2 text-center md:text-right">
            <h1 className="text-4xl font-bold text-gray-900">دانشکده‌ها</h1>
            <p className="text-lg text-gray-500">لیست تمام دانشکده‌های فعال</p>
          </div>
          <div className="relative w-full md:w-80">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="جستجوی نام دانشکده..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-10 focus:ring-indigo-500 focus:border-indigo-500 transition duration-300"
            />
          </div>
        </div>

        {/* Faculties Grid */}
        {filteredFaculties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredFaculties.map((faculty) => (
                <motion.div
                  key={faculty.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link to={`/faculty/${faculty.id}`}>
                    <Card className="h-full group border border-gray-200 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
                      <CardHeader className="flex flex-row items-center gap-4">
                        <motion.div
                          className="bg-gradient-to-r from-indigo-500 to-purple-500 p-4 rounded-lg flex items-center justify-center"
                          whileHover={{ scale: 1.2, rotate: 15 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <Building2 className="h-8 w-8 text-white" />
                        </motion.div>
                        <div>
                          <CardTitle className="group-hover:text-indigo-600 transition-colors duration-300 font-semibold text-lg">{faculty.name}</CardTitle>
                          <CardDescription className="text-gray-500 group-hover:text-gray-700 transition-colors duration-300">
                            مشاهده دوره‌ها
                          </CardDescription>
                        </div>
                      </CardHeader>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <motion.div
            className="text-center py-16 flex flex-col items-center gap-4 text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Building2 className="h-16 w-16 text-indigo-400 animate-bounce" />
            <h3 className="text-xl font-semibold text-gray-700">هیچ دانشکده‌ای با این نام یافت نشد</h3>
            <p className="text-gray-500">می‌توانید از طریق پنل مدیریت، دانشکده‌های جدید اضافه کنید.</p>
          </motion.div>
        )}
      </div>
    </Layout>
  );
};

export default AllFaculties;
