import { useState } from "react";
import Layout from "@/components/Layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Filter, 
  Download,
  Eye,
  FileText,
  Video,
  Link as LinkIcon,
  BookOpen,
  Clock,
  Star,
  Share
} from "lucide-react";

const Resources = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const resources = [
    {
      id: 1,
      title: "جزوه مبانی برنامه نویسی",
      type: "pdf",
      course: "مبانی علوم کامپیوتر",
      courseCode: "CS 101",
      instructor: "دکتر سارا احمدی",
      uploadDate: "۱۰ آبان ۱۴۰۳",
      size: "2.5 MB",
      downloads: 245,
      views: 1250,
      description: "جزوه کامل مبانی برنامه نویسی شامل مفاهیم پایه و مثال های کاربردی",
      tags: ["برنامه نویسی", "پایتون", "جاوا"],
      rating: 4.8
    },
    {
      id: 2,
      title: "ویدیو آموزش الگوریتم های مرتب سازی",
      type: "video",
      course: "ساختمان داده ها",
      courseCode: "CS 201",
      instructor: "پروفسور احمد کریمی", 
      uploadDate: "۵ آبان ۱۴۰۳",
      duration: "45 دقیقه",
      views: 890,
      description: "توضیح کامل الگوریتم های مرتب سازی با نمایش تصویری و کد",
      tags: ["الگوریتم", "مرتب سازی", "ویژوال"],
      rating: 4.9
    },
    {
      id: 3,
      title: "لینک مفید: مستندات React",
      type: "link",
      course: "برنامه نویسی وب",
      courseCode: "WEB 301",
      instructor: "دکتر فاطمه احمدی",
      uploadDate: "۲ آبان ۱۴۰۳", 
      clicks: 156,
      description: "لینک مستقیم به مستندات رسمی React برای یادگیری بهتر",
      tags: ["React", "JavaScript", "وب"],
      url: "https://react.dev"
    },
    {
      id: 4,
      title: "نمونه سوالات آزمون میان ترم",
      type: "pdf",
      course: "حساب دیفرانسیل و انتگرال",
      courseCode: "MATH 201",
      instructor: "پروفسور میلاد کریمی",
      uploadDate: "۱ آبان ۱۴۰۳",
      size: "1.2 MB",
      downloads: 340,
      views: 780,
      description: "مجموعه سوالات آزمون های سال های گذشته همراه با پاسخ تشریحی",
      tags: ["آزمون", "ریاضی", "نمونه سوال"],
      rating: 4.7
    },
    {
      id: 5,
      title: "ویدیو آزمایش فیزیک: حرکت پرتابی",
      type: "video",
      course: "فیزیک عمومی ۱",
      courseCode: "PHYS 101",
      instructor: "دکتر علی حسینی",
      uploadDate: "۲۸ مهر ۱۴۰۳",
      duration: "30 دقیقه",
      views: 456,
      description: "نحوه انجام آزمایش حرکت پرتابی در آزمایشگاه فیزیک",
      tags: ["آزمایش", "فیزیک", "حرکت"],
      rating: 4.6
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'pdf': return FileText;
      case 'video': return Video;
      case 'link': return LinkIcon;
      default: return FileText;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'pdf': return 'PDF';
      case 'video': return 'ویدیو';
      case 'link': return 'لینک';
      default: return 'فایل';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'pdf': return 'bg-red-100 text-red-800';
      case 'video': return 'bg-blue-100 text-blue-800';
      case 'link': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredResources = resources.filter(resource => {
    if (activeTab === "all") return true;
    return resource.type === activeTab;
  }).filter(resource =>
    resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resource.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const stats = [
    { label: "کل منابع", value: resources.length.toString(), icon: BookOpen },
    { label: "فایل های PDF", value: resources.filter(r => r.type === 'pdf').length.toString(), icon: FileText },
    { label: "ویدیوها", value: resources.filter(r => r.type === 'video').length.toString(), icon: Video },
    { label: "لینک ها", value: resources.filter(r => r.type === 'link').length.toString(), icon: LinkIcon }
  ];

  return (
    <Layout>
      <div className="space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">منابع آموزشی</h1>
          <p className="text-lg text-muted-foreground">
            دسترسی به تمام منابع درسی شامل جزوات، ویدیوها و لینک های مفید
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className="card-gradient text-center">
              <CardContent className="pt-6">
                <stat.icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="جستجو در منابع..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 pr-10"
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Resources */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:w-[400px]">
            <TabsTrigger value="all">همه</TabsTrigger>
            <TabsTrigger value="pdf">PDF</TabsTrigger>
            <TabsTrigger value="video">ویدیو</TabsTrigger>
            <TabsTrigger value="link">لینک</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredResources.map((resource) => {
                const TypeIcon = getTypeIcon(resource.type);
                return (
                  <Card key={resource.id} className="card-gradient">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className="bg-primary/10 p-2 rounded-lg">
                            <TypeIcon className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <CardTitle className="text-lg leading-tight">{resource.title}</CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">
                              {resource.course} ({resource.courseCode})
                            </p>
                          </div>
                        </div>
                        <Badge className={getTypeColor(resource.type)}>
                          {getTypeLabel(resource.type)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">{resource.description}</p>
                      
                      <div className="flex flex-wrap gap-1">
                        {resource.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>{resource.instructor}</span>
                        <span>{resource.uploadDate}</span>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        {resource.type === 'pdf' && (
                          <>
                            <div className="flex items-center gap-1">
                              <Download className="h-4 w-4" />
                              <span>{resource.downloads}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="h-4 w-4" />
                              <span>{resource.views}</span>
                            </div>
                            <span>{resource.size}</span>
                          </>
                        )}
                        {resource.type === 'video' && (
                          <>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>{resource.duration}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="h-4 w-4" />
                              <span>{resource.views}</span>
                            </div>
                          </>
                        )}
                        {resource.type === 'link' && (
                          <div className="flex items-center gap-1">
                            <LinkIcon className="h-4 w-4" />
                            <span>{resource.clicks} کلیک</span>
                          </div>
                        )}
                        {resource.rating && (
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span>{resource.rating}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t">
                        <div className="flex items-center gap-2">
                          {resource.type === 'pdf' && (
                            <Button size="sm">
                              <Download className="h-4 w-4 ml-1" />
                              دانلود
                            </Button>
                          )}
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 ml-1" />
                            {resource.type === 'link' ? 'بازدید' : 'مشاهده'}
                          </Button>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Share className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            
            {filteredResources.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">منبعی یافت نشد</h3>
                <p className="text-muted-foreground">
                  {searchQuery 
                    ? "لطفاً کلمات جستجو خود را تغییر دهید"
                    : "در این دسته منبعی موجود نیست"
                  }
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Resources;