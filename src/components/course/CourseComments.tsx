import { FormEvent, useEffect, useState } from "react";
import { MessageSquareText, Send, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  CourseComment,
  createCourseComment,
  deleteCourseComment,
  fetchCourseComments,
  fetchPublicSiteSettings,
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CourseComments({ courseId }: { courseId: number }) {
  const { user, token } = useAuth();
  const [enabled, setEnabled] = useState(true);
  const [comments, setComments] = useState<CourseComment[]>([]);
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);

  const load = async () => {
    const settings = await fetchPublicSiteSettings();
    setEnabled(settings.comments_enabled);
    if (settings.comments_enabled) {
      setComments(await fetchCourseComments(courseId));
    }
  };

  useEffect(() => {
    load().catch(console.error);
  }, [courseId]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!token || !body.trim()) return;
    setSending(true);
    try {
      const created = await createCourseComment(courseId, body.trim(), token);
      setBody("");
      setComments((items) => [created, ...items]);
    } finally {
      setSending(false);
    }
  };

  const remove = async (comment: CourseComment) => {
    if (!token || !confirm("کامنت حذف شود؟")) return;
    await deleteCourseComment(comment.id, token);
    setComments((items) => items.filter((item) => item.id !== comment.id));
  };

  if (!enabled) return null;

  return (
    <Card className="rounded-[1.75rem]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquareText className="h-5 w-5 text-blue-600" />
          دیدگاه‌های درس
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {token ? (
          <form onSubmit={submit} className="space-y-3">
            <Textarea
              value={body}
              onChange={(event) => setBody(event.target.value)}
              maxLength={2000}
              placeholder="دیدگاهت را بنویس..."
              className="min-h-24 rounded-xl"
            />
            <Button disabled={sending || !body.trim()} className="rounded-xl">
              <Send className="ml-2 h-4 w-4" />
              {sending ? "در حال ارسال..." : "ثبت دیدگاه"}
            </Button>
          </form>
        ) : (
          <p className="text-sm text-muted-foreground">برای ثبت دیدگاه وارد حساب شوید.</p>
        )}

        <div className="space-y-3">
          {comments.map((comment) => {
            const canDelete =
              user?.id === comment.author_id || Boolean(user?.profile?.is_supervisor);
            return (
              <div key={comment.id} className="rounded-2xl border p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-black">{comment.author_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(comment.created_at).toLocaleString("fa-IR")}
                    </p>
                  </div>
                  {canDelete && (
                    <Button variant="ghost" size="icon" onClick={() => remove(comment)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  )}
                </div>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-7">{comment.body}</p>
                {!comment.is_approved && (
                  <p className="mt-2 text-xs text-amber-600">در انتظار تأیید مدیر</p>
                )}
              </div>
            );
          })}
          {!comments.length && (
            <p className="py-6 text-center text-sm text-muted-foreground">
              هنوز دیدگاهی ثبت نشده است.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
