// src/pages/CourseDetail.tsx
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, Loader2, FileText, Video, Link as LinkIcon, FileQuestion, PlusCircle, Trash2, Edit, MessageSquareText } from "lucide-react";
import { fetchCourseById, createContent, updateContent, deleteContent, Course as CourseType, Content } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { Textarea } from "@/components/ui/textarea";

const RenderRichText = ({ text }: { text: string | null }) => {
    if (!text) return null;
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);

    return (
        <p className="whitespace-pre-wrap">
            {parts.map((part, index) =>
                urlRegex.test(part) ? (
                    <a key={index} href={part} target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">
                        {part}
                    </a>
                ) : (
                    part
                )
            )}
        </p>
    );
};

const contentIcons: { [key: string]: React.ElementType } = {
  pdf: FileText, video: Video, link: LinkIcon, assignment: FileQuestion, text: MessageSquareText, other: BookOpen,
};

const CourseDetail = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [course, setCourse] = useState<CourseType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentContent, setCurrentContent] = useState<Partial<Content>>({ title: '', url: '', rich_text_content: '', content_type: 'other' });
  const [expandedContentId, setExpandedContentId] = useState<number | null>(null);

  const fetchCourse = async () => {
    if (!courseId) { setError("آیدی دوره یافت نشد."); setIsLoading(false); return; }
    try {
      setIsLoading(true);
      const data = await fetchCourseById(courseId);
      setCourse(data);
    } catch (err) { setError("خطا در دریافت جزئیات دوره."); } 
    finally { setIsLoading(false); }
  };

  useEffect(() => { fetchCourse(); }, [courseId]);

  const handleContentClick = (content: Content) => {
    if (!user) {
      alert("برای دسترسی به این محتوا، لطفاً ابتدا وارد شوید.");
      navigate('/login');
      return;
    }
    if (content.content_type === 'text') {
      setExpandedContentId(expandedContentId === content.id ? null : content.id);
    } else if (content.url) {
      window.open(content.url, '_blank');
    }
  };

  const openModalForCreate = () => {
    setCurrentContent({ title: '', url: '', rich_text_content: '', content_type: 'other', order: (course?.contents?.length || 0) + 1 });
    setIsModalOpen(true);
  };

  const openModalForEdit = (content: Content) => {
    setCurrentContent(content);
    setIsModalOpen(true);
  };

  // =================================================================
  // ===== CHANGED: Logic inside this function is updated ==========
  // =================================================================
  const handleFormSubmit = async () => {
    if (!courseId || !token || !currentContent?.title) return;

    // ADDED: Create a clean payload to send to the server
    const payload: Partial<Content> = {
        ...currentContent,
    };

    if (payload.content_type === 'text') {
        payload.url = null; // Set URL to null for text content
    } else {
        payload.rich_text_content = null; // Set rich_text to null for URL-based content
    }

    try {
      if (payload.id) {
        await updateContent(payload.id, payload, token);
      } else {
        await createContent(courseId, payload, token);
      }
      setIsModalOpen(false);
      fetchCourse();
    } catch (err) { 
        console.error(err);
        alert('خطا در ذخیره محتوا. لطفاً از صحت اطلاعات وارد شده و دسترسی سرپرست خود اطمینان حاصل کنید.'); 
    }
  };
  
  const handleDelete = async (contentId: number) => {
    if (!token || !window.confirm('آیا از حذف این محتوا مطمئن هستید؟')) return;
    try {
      await deleteContent(contentId, token);
      fetchCourse();
    } catch (err) { alert('خطا در حذف محتوا.'); }
  };

  if (isLoading) return <Layout><div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div></Layout>;
  if (error || !course) return <Layout><div className="text-center text-destructive p-8">{error || "دوره مورد نظر یافت نشد."}</div></Layout>;

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/dashboard" className="hover:text-foreground transition-colors">داشبورد</Link>
          <span>/</span>
          <span className="text-foreground font-medium">{course.title}</span>
        </div>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1 space-y-2"><h1 className="text-4xl font-bold">{course.title}</h1><p className="text-xl text-muted-foreground">{course.faculty.name}</p></div>
          <Card className="md:w-72"><CardHeader><CardTitle>استاد درس</CardTitle></CardHeader><CardContent className="flex items-center gap-3"><Avatar className="h-12 w-12"><AvatarFallback>{course.professor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback></Avatar><div><h3 className="font-semibold">{course.professor.name}</h3><p className="text-sm text-muted-foreground">استاد</p></div></CardContent></Card>
        </div>

        <div className="bg-card p-6 rounded-lg border">
          <div className="flex justify-between items-center mb-6 border-b pb-4">
            <h2 className="text-2xl font-semibold">محتوای دوره</h2>
            {user?.profile.is_supervisor && (<Button onClick={openModalForCreate}><PlusCircle className="mr-2 h-4 w-4" />افزودن محتوا</Button>)}
          </div>
          <div className="space-y-4">
            {course.contents?.sort((a, b) => a.order - b.order).map((content) => {
              const Icon = contentIcons[content.content_type] || BookOpen;
              return (
                <div key={content.id} className="border rounded-lg bg-background shadow-sm transition-all">
                  <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50" onClick={() => handleContentClick(content)}>
                    <div className="flex items-center gap-4 flex-grow"><span className="text-lg font-mono text-muted-foreground">{content.order}.</span><div className="bg-primary/10 p-3 rounded-full"><Icon className="h-6 w-6 text-primary" /></div><span className="text-lg font-medium">{content.title}</span></div>
                    {user?.profile.is_supervisor && (<div className="flex gap-2"><Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); openModalForEdit(content); }}><Edit className="h-4 w-4" /></Button><Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handleDelete(content.id); }}><Trash2 className="h-4 w-4 text-destructive" /></Button></div>)}
                  </div>
                  {expandedContentId === content.id && content.content_type === 'text' && (
                    <div className="p-4 border-t bg-muted/30">
                      <RenderRichText text={content.rich_text_content} />
                    </div>
                  )}
                </div>
              );
            })}
             {course.contents?.length === 0 && (<p className="text-muted-foreground text-center py-8">هنوز محتوایی برای این دوره اضافه نشده است.</p>)}
          </div>
        </div>
        
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>{currentContent?.id ? 'ویرایش محتوا' : 'افزودن محتوای جدید'}</DialogTitle></DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2"><Label>نوع محتوا</Label>
                <Select value={currentContent?.content_type || 'other'} onValueChange={(value) => setCurrentContent({...currentContent, content_type: value as any})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF</SelectItem><SelectItem value="video">Video</SelectItem><SelectItem value="link">Link</SelectItem><SelectItem value="assignment">Assignment</SelectItem><SelectItem value="text">متن غنی (Rich Text)</SelectItem><SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2"><Label>عنوان</Label><Input value={currentContent?.title || ''} onChange={(e) => setCurrentContent({...currentContent, title: e.target.value})} /></div>
              
              {currentContent.content_type === 'text' ? (
                 <div className="grid gap-2"><Label>محتوای متنی</Label><Textarea rows={10} value={currentContent?.rich_text_content || ''} onChange={(e) => setCurrentContent({...currentContent, rich_text_content: e.target.value})} /></div>
              ) : (
                 <div className="grid gap-2"><Label>لینک (URL)</Label><Input value={currentContent?.url || ''} onChange={(e) => setCurrentContent({...currentContent, url: e.target.value})} /></div>
              )}

              <div className="grid gap-2"><Label>ترتیب نمایش</Label><Input type="number" value={currentContent?.order || 0} onChange={(e) => setCurrentContent({...currentContent, order: parseInt(e.target.value, 10)})} /></div>
            </div>
            <DialogFooter>
              <DialogClose asChild><Button variant="ghost">لغو</Button></DialogClose>
              <Button onClick={handleFormSubmit}>ذخیره</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default CourseDetail;