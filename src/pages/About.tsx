// src/pages/About.tsx
import Layout from "@/components/Layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Send, Code } from "lucide-react";
import { motion } from "framer-motion";

const About = () => {
  const technologies = ["React", "TypeScript", "Django", "Django REST Framework", "TailwindCSS"];

  return (
    <Layout>
      <div className="min-h-screen py-8 md:py-12" dir="rtl">
        <div className="container mx-auto px-4 max-w-4xl">
          
          {/* Header Section */}
          <div className="text-center mb-12">
            {/* لوگوی ابری با افکت */}
            <motion.div 
              className="w-32 h-32 mx-auto mb-6 flex items-center justify-center bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full shadow-2xl"
              animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <span className="text-5xl font-bold text-white">☁️</span>
            </motion.div>

            <motion.h1 
              className="text-4xl md:text-5xl font-extrabold text-foreground mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              درباره <span className="text-blue-500">myCloud</span>
            </motion.h1>

            <motion.p
              className="text-xl text-muted-foreground max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              یک پروژه دانشجویی برای دسترسی آسان و منظم به منابع آموزشی دانشگاه، با هدف بهبود تجربه دانشجویان و صرفه‌جویی در زمان آن‌ها.
            </motion.p>
          </div>

          <div className="grid gap-8">

            {/* Mission Statement */}
            <Card className="shadow-md hover:shadow-xl transition-shadow hover:scale-[1.02] duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <User className="w-6 h-6 text-blue-500" />
                  درباره سازنده و پروژه
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-lg text-muted-foreground leading-relaxed text-justify">
                <p>
                  این پروژه توسط <strong>محمدصادق قاسمی</strong> به صورت کاملاً شخصی طراحی و توسعه داده شده است. هدف ایجاد یک پلتفرم مرکزی برای منابع آموزشی دانشگاه است تا دانشجویان بتوانند به راحتی و بدون اتلاف وقت به اطلاعات دسترسی داشته باشند.
                </p>
                <p>
                  منابع اصلی از کانال تلگرامی <a href="https://t.me/mycloudmsgh" target="_blank" rel="noopener noreferrer" className="text-blue-500 font-semibold hover:underline">mycloudmsgh@</a> جمع‌آوری شده‌اند و همه مطالب در دسته‌بندی‌های مشخص ارائه می‌شوند.
                </p>
                <p>
                  این پروژه بدون حمایت خارجی و صرفاً با انگیزه کمک به پیشرفت دانشجویان ایجاد شده است.
                </p>
              </CardContent>
            </Card>

            {/* Contact & Tech Stack */}
            <div className="grid md:grid-cols-2 gap-8">
              
              <Card className="shadow-md hover:shadow-xl transition-shadow hover:scale-[1.02] duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <Send className="w-6 h-6 text-cyan-500" />
                    ارتباط با من
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-justify">
                  <p className="text-muted-foreground">
                    هرگونه نظر، پیشنهاد یا گزارش مشکلات احتمالی، به بهبود و توسعه این پلتفرم کمک می‌کند. برای همکاری یا ارائه پیشنهاد می‌توانید از طریق تلگرام با من در ارتباط باشید:
                  </p>
                  <Button asChild className="w-full">
                    <a href="https://t.me/obsidian347" target="_blank" rel="noopener noreferrer">
                      ارسال پیام به obsidian347@
                    </a>
                  </Button>
                </CardContent>
              </Card>

              <Card className="shadow-md hover:shadow-xl transition-shadow hover:scale-[1.02] duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <Code className="w-6 h-6 text-green-500" />
                    تکنولوژی‌های استفاده شده
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 text-justify">
                    این پروژه با استفاده از جدیدترین تکنولوژی‌های وب ایجاد شده است:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {technologies.map((tech) => (
                      <Badge key={tech} variant="secondary" className="text-md px-3 py-1">{tech}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;
