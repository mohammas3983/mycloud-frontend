// src/pages/About.tsx
import Layout from "@/components/Layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Send, Server, GitBranch, Code } from "lucide-react";

const About = () => {
  const technologies = ["React", "TypeScript", "Django", "Django REST Framework", "TailwindCSS"];

  return (
    <Layout>
      <div className="min-h-screen py-8 md:py-12" dir="rtl">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center shadow-lg">
              <span className="text-5xl font-bold text-white">mc</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">درباره myCloud</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              یک پروژه دانشجویی برای تسهیل دسترسی به منابع آموزشی دانشگاه
            </p>
          </div>

          <div className="grid gap-8">
            {/* Mission Statement */}
            <Card className="shadow-md hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <User className="w-6 h-6 text-primary" />
                  درباره سازنده و پروژه
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-lg text-muted-foreground leading-relaxed">
                <p>
                  این سایت توسط **محمدصادق قاسمی**، به صورت کاملاً شخصی و با هدف ایجاد یک پلتفرم متمرکز و منظم برای محتوای آموزشی دانشگاه توسعه داده شده است. هدف اصلی، گردآوری تمام منابع مفید از کانال تلگرامی <a href="https://t.me/mycloudmsgh" target="_blank" rel="noopener noreferrer" className="text-primary font-semibold hover:underline">@mycloudmsgh</a> و ارائه آن در یک ساختار دسته‌بندی شده است تا دانشجویان بتوانند به سادگی و بدون اتلاف وقت از این منابع استفاده کنند.
                </p>
                <p>
                  این پروژه بدون هیچ تیم یا حمایت خارجی، و صرفاً با انگیزه کمک به پیشرفت دانشجویان عزیز دانشگاه ایجاد شده است.
                </p>
              </CardContent>
            </Card>

            {/* Contact & Tech Stack */}
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="shadow-md hover:shadow-xl transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <Send className="w-6 h-6 text-accent" />
                    ارتباط با من
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    هرگونه نظر، پیشنهاد یا گزارشی از مشکلات احتمالی سایت، به بهبود و توسعه این پلتفرم کمک بزرگی خواهد کرد. اگر تمایل به همکاری یا ارائه پیشنهاد دارید، می‌توانید از طریق آیدی تلگرام زیر با من در ارتباط باشید:
                  </p>
                  <Button asChild className="w-full">
                    <a href="https://t.me/obsidian347" target="_blank" rel="noopener noreferrer">
                      ارسال پیام در تلگرام به @obsidian347
                    </a>
                  </Button>
                </CardContent>
              </Card>

              <Card className="shadow-md hover:shadow-xl transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <Code className="w-6 h-6 text-green-500" />
                    تکنولوژی‌های استفاده شده
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    این پروژه با استفاده از جدیدترین تکنولوژی‌های وب توسعه داده شده است:
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