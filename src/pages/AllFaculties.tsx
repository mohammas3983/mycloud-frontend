// src/pages/AllFaculties.tsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout/Layout";
import PageShell from "@/components/Layout/PageShell";
import { Input } from "@/components/ui/input";
import { fetchFaculties, Faculty } from "@/lib/api";
import { ArrowLeft, Building2, GraduationCap, Search } from "lucide-react";
import { motion } from "framer-motion";

const AllFaculties = () => {
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchFaculties().then(setFaculties).catch(console.error).finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() =>
    faculties.filter(f => f.name.toLowerCase().includes(search.trim().toLowerCase())),
    [faculties, search]
  );

  return (
    <Layout>
      <PageShell
        eyebrow="ساختار دانشگاه"
        title="دانشکده‌ها"
        subtitle="دوره‌ها را بر اساس دانشکده مرور کن."
        icon={<Building2 className="h-7 w-7" />}
        action={
          <div className="relative w-full sm:w-64">
            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={search} onChange={e=>setSearch(e.target.value)} placeholder="جستجوی دانشکده..." className="h-11 rounded-xl pr-9" />
          </div>
        }
      >
        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{[0,1,2,3,4,5].map(i=><div key={i} className="h-52 animate-pulse rounded-[1.75rem] bg-muted" />)}</div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((faculty, i) => (
              <motion.div key={faculty.id} initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay: Math.min(i*.04,.25)}}>
                <Link to={`/faculty/${faculty.id}`} className="group block">
                  <div className="mycloud-card relative min-h-52 overflow-hidden p-6">
                    <div className="absolute -left-10 -top-10 h-32 w-32 rounded-full bg-blue-500/5" />
                    <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/15">
                      <GraduationCap className="h-7 w-7" />
                    </div>
                    <h2 className="mt-6 text-xl font-black tracking-tight transition group-hover:text-blue-600 dark:group-hover:text-blue-400">{faculty.name}</h2>
                    <div className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-blue-600 dark:text-blue-400">
                      مشاهده دوره‌ها <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </PageShell>
    </Layout>
  );
};

export default AllFaculties;
