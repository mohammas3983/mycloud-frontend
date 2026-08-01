// src/lib/api.ts

// CORRECTED: Ensure the environment variable is read correctly.
// The Vite dev server must be restarted after changing .env files.
//export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
// A check to make sure you've set up your .env.local file correctly


// --- تایپ‌ها (Interfaces) ---
// CHANGED: Interface Content updated
export interface Content { 
    id: number; 
    title: string; 
    url: string | null; 
    rich_text_content: string | null; // <-- ADDED
    order: number; 
    content_type: 'pdf' | 'video' | 'link' | 'assignment' | 'text' | 'other'; // <-- ADDED 'text'
}
export interface Professor { id: number; name: string; }
export interface Faculty { id: number; name: string; }
export interface Course { id: number; title: string; description: string; image: string | null; professor: Professor; faculty: Faculty & { id: number }; contents: Content[]; }
export interface UserProfile {
    id: number;
    is_approved: boolean;
    is_supervisor: boolean;
    major: string;
    phone_number: string;
    faculty: number;
    email_verified: boolean;
}
export interface CustomUserSerializer { id: number; username: string; email?: string; first_name: string; last_name: string; is_active: boolean; profile: UserProfile; }

// --- توابع کمکی ---
const getAuthHeaders = (token: string) => ({ 'Content-Type': 'application/json', 'Authorization': `Token ${token}` });
const handleResponse = async (response: Response) => {
    if (!response.ok) {
        if (response.status === 204) return null;
        const errorBody = await response.text();
        try {
            const errorJson = JSON.parse(errorBody);
            console.error("API Error (JSON):", errorJson);
        } catch {
            console.error("API Error (Text):", errorBody);
        }
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.status === 204 ? null : response.json();
};

// --- توابع API ---

// User & Auth
export const registerUser = (data: any) => fetch(`${API_BASE_URL}/auth/users/`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
export const loginUser = (data: any) => fetch(`${API_BASE_URL}/auth/token/login/`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
export const fetchUserProfile = (token: string) => fetch(`${API_BASE_URL}/auth/users/me/`, { headers: getAuthHeaders(token) }).then(handleResponse);
export const updateUserProfile = (data: any, token: string) => fetch(`${API_BASE_URL}/auth/users/me/`, { method: 'PATCH', headers: getAuthHeaders(token), body: JSON.stringify(data) }).then(handleResponse);

export interface EmailAwareLoginResponse {
    auth_token?: string;
    requires_email_setup?: boolean;
    requires_email_verification?: boolean;
    setup_token?: string;
    masked_email?: string;
    message?: string;
    error?: string;
}

export const setLegacyEmail = (setup_token: string, email: string): Promise<Response> =>
    fetch(`${API_BASE_URL}/api/email-verification/set_email/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ setup_token, email }),
    });

export const confirmEmailVerification = (token: string): Promise<Response> =>
    fetch(`${API_BASE_URL}/api/email-verification/confirm/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
    });

export const resendEmailVerification = (setup_token: string): Promise<Response> =>
    fetch(`${API_BASE_URL}/api/email-verification/resend/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ setup_token }),
    });



// Courses
export const fetchCourses = (): Promise<Course[]> => fetch(`${API_BASE_URL}/api/courses/`).then(handleResponse);
export const fetchCourseById = (id: string): Promise<Course> => fetch(`${API_BASE_URL}/api/courses/${id}/`).then(handleResponse);
export const createCourse = (data: any, token: string): Promise<Course> => fetch(`${API_BASE_URL}/api/courses/`, { method: 'POST', headers: getAuthHeaders(token), body: JSON.stringify(data) }).then(handleResponse);
export const updateCourse = (id: number, data: any, token: string): Promise<Course> => fetch(`${API_BASE_URL}/api/courses/${id}/`, { method: 'PUT', headers: getAuthHeaders(token), body: JSON.stringify(data) }).then(handleResponse);
export const deleteCourse = (id: number, token: string): Promise<void> => fetch(`${API_BASE_URL}/api/courses/${id}/`, { method: 'DELETE', headers: getAuthHeaders(token) }).then(handleResponse);
export const fetchCoursesByFaculty = (facultyId: string): Promise<Course[]> => fetch(`${API_BASE_URL}/api/courses/?faculty=${facultyId}`).then(handleResponse);
export const fetchFeaturedCourses = (): Promise<Course[]> => fetch(`${API_BASE_URL}/api/courses/featured/`).then(handleResponse);

// Contents
export const createContent = (courseId: string, data: Partial<Content>, token: string): Promise<Content> => fetch(`${API_BASE_URL}/api/contents/`, { method: 'POST', headers: getAuthHeaders(token), body: JSON.stringify({ ...data, course: parseInt(courseId, 10) }) }).then(handleResponse);
export const updateContent = (contentId: number, data: Partial<Content>, token: string): Promise<Content> => fetch(`${API_BASE_URL}/api/contents/${contentId}/`, { method: 'PATCH', headers: getAuthHeaders(token), body: JSON.stringify(data) }).then(handleResponse);
export const deleteContent = (contentId: number, token: string): Promise<void> => fetch(`${API_BASE_URL}/api/contents/${contentId}/`, { method: 'DELETE', headers: getAuthHeaders(token) }).then(handleResponse);

// Faculties
export const fetchFacultyById = (facultyId: string): Promise<Faculty> => fetch(`${API_BASE_URL}/api/faculties/${facultyId}/`).then(handleResponse);
export const fetchFaculties = (): Promise<Faculty[]> => fetch(`${API_BASE_URL}/api/faculties/`).then(handleResponse);
export const createFaculty = (name: string, token: string): Promise<Faculty> => fetch(`${API_BASE_URL}/api/faculties/`, { method: 'POST', headers: getAuthHeaders(token), body: JSON.stringify({ name }) }).then(handleResponse);
export const updateFaculty = (id: number, name: string, token: string): Promise<Faculty> => fetch(`${API_BASE_URL}/api/faculties/${id}/`, { method: 'PUT', headers: getAuthHeaders(token), body: JSON.stringify({ name }) }).then(handleResponse);
export const deleteFaculty = (id: number, token: string): Promise<void> => fetch(`${API_BASE_URL}/api/faculties/${id}/`, { method: 'DELETE', headers: getAuthHeaders(token) }).then(handleResponse);

// Professors
export const fetchProfessors = (): Promise<Professor[]> => fetch(`${API_BASE_URL}/api/professors/`).then(handleResponse);
export const createProfessor = (name: string, token: string): Promise<Professor> => fetch(`${API_BASE_URL}/api/professors/`, { method: 'POST', headers: getAuthHeaders(token), body: JSON.stringify({ name }) }).then(handleResponse);
export const updateProfessor = (id: number, name: string, token: string): Promise<Professor> => fetch(`${API_BASE_URL}/api/professors/${id}/`, { method: 'PUT', headers: getAuthHeaders(token), body: JSON.stringify({ name }) }).then(handleResponse);
export const deleteProfessor = (id: number, token: string): Promise<void> => fetch(`${API_BASE_URL}/api/professors/${id}/`, { method: 'DELETE', headers: getAuthHeaders(token) }).then(handleResponse);

// Admin - User Management
export const fetchUsersAPI = (token: string): Promise<CustomUserSerializer[]> => fetch(`${API_BASE_URL}/api/users/`, { headers: getAuthHeaders(token) }).then(handleResponse);
export const toggleUserApprovalAPI = (profileId: number, status: boolean, token: string): Promise<void> => fetch(`${API_BASE_URL}/api/profiles/${profileId}/`, { method: 'PATCH', headers: getAuthHeaders(token), body: JSON.stringify({ is_approved: status }) }).then(handleResponse);
export const setUserActiveStatusAPI = (userId: number, status: boolean, token: string): Promise<void> => fetch(`${API_BASE_URL}/api/users/${userId}/set_active_status/`, { method: 'POST', headers: getAuthHeaders(token), body: JSON.stringify({ is_active: status }) }).then(handleResponse);
export interface ActivityLog {
  id: number;
  description: string;
  timestamp: string; // تاریخ به صورت رشته ISO می‌آید
}

export const fetchNotifications = (token: string): Promise<ActivityLog[]> => {
  return fetch(`${API_BASE_URL}/api/activity-logs/`, { headers: getAuthHeaders(token) }).then(handleResponse);
};

export interface SiteStats {
  daily_visits: number;
  weekly_visits: number;
  total_visits: number;
  total_users: number;
}

// ADDED: توابع جدید برای آمار
export const trackVisit = (): Promise<Response> => {
    return fetch(`${API_BASE_URL}/api/track-visit/`, { method: 'POST' });
};

export const fetchSiteStats = (token?: string | null): Promise<SiteStats> => {
    // یک هدر پایه می‌سازیم
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };

    // فقط اگر توکن وجود داشت، آن را به هدر اضافه می‌کنیم
    if (token) {
        headers['Authorization'] = `Token ${token}`;
    }

    // درخواست را با هدرهای درست ارسال می‌کنیم
    return fetch(`${API_BASE_URL}/api/site-stats/`, { headers }).then(handleResponse);
};

// ADD THESE FUNCTIONS TO THE END OF src/lib/api.ts

// --- Password Reset (Email link) ---
export const requestPasswordReset = (username: string): Promise<Response> => {
  return fetch(`${API_BASE_URL}/api/password-reset/request_reset/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username }),
  });
};

export const confirmPasswordReset = (
  uid: string,
  token: string,
  new_password: string,
  confirm_password: string
): Promise<Response> => {
  return fetch(`${API_BASE_URL}/api/password-reset/confirm_reset/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ uid, token, new_password, confirm_password }),
  });
};

// src/lib/api.ts

export interface Message {
    id: number;
    sender: number;
    sender_username: string;
    sender_name: string;
    receiver: number;
    content: string;
    timestamp: string;
    is_read: boolean;
    unread_count?: number;
}

export interface Contact {
    id: number;
    name: string;
    username: string;
    unread_count?: number;
}

export interface Contact {
    id: number;
    name: string;
    username: string;
    last_message?: string;
    timestamp?: string;
    unread_count?: number;
}

// 1. جستجوی کاربر (مثل تلگرام)
export const searchUsers = async (query: string, token: string): Promise<Contact[]> => {
    const response = await fetch(`${API_BASE_URL}/api/messages/search_users/?q=${query}`, {
        headers: { 'Authorization': `Token ${token}` }
    });
    return handleResponse(response);
};

// 2. دریافت لیست چت‌های اخیر
export const fetchRecentChats = async (token: string, spyUserId?: number): Promise<Contact[]> => {
    let url = `${API_BASE_URL}/api/messages/recent_chats/`;
    // 👇 این خط حیاتی است: اگر spyUserId باشد، به آدرس اضافه می‌شود
    if (spyUserId) url += `?spy_user_id=${spyUserId}`;
    
    const response = await fetch(url, {
        headers: { 'Authorization': `Token ${token}` }
    });
    return handleResponse(response);
};
// دریافت پیام‌های یک مکالمه
export const fetchConversation = async (userId: number, token: string, spyUserId?: number): Promise<Message[]> => {
    let url = `${API_BASE_URL}/api/messages/conversation/?user_id=${userId}`;
    // 👇 این خط حیاتی است
    if (spyUserId) url += `&spy_user_id=${spyUserId}`;

    const response = await fetch(url, {
        headers: { 'Authorization': `Token ${token}` }
    });
    return handleResponse(response);
};

// ارسال پیام جدید
export const sendMessage = async (receiverId: number, content: string, token: string): Promise<Message> => {
    const response = await fetch(`${API_BASE_URL}/api/messages/`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`
        },
        body: JSON.stringify({ receiver: receiverId, content })
    });
    return handleResponse(response);
};
export const deleteMessage = async (msgId: number, token: string) => {
    const response = await fetch(`${API_BASE_URL}/api/messages/${msgId}/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Token ${token}` }
    });
    if (response.status === 204) return true;
    return handleResponse(response);
};

// ویرایش پیام
export const editMessage = async (msgId: number, newContent: string, token: string) => {
    const response = await fetch(`${API_BASE_URL}/api/messages/${msgId}/`, {
        method: 'PATCH',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`
        },
        body: JSON.stringify({ content: newContent })
    });
    return handleResponse(response);
};
export const deleteChatHistory = async (userId: number, token: string) => {
    return fetch(`${API_BASE_URL}/api/messages/delete_history/?user_id=${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Token ${token}` }
    });
};

// بلاک کردن
export const blockUser = async (userId: number, token: string) => {
    return fetch(`${API_BASE_URL}/api/messages/block_user/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Token ${token}` },
        body: JSON.stringify({ user_id: userId })
    });
};


// =========================================================
// Advertisements / site settings / course comments
// =========================================================
export type AdvertisementPlacement =
  | "course_list"
  | "course_detail"
  | "before_content"
  | "dashboard";

export interface Advertisement {
  id: number;
  title: string;
  link_url: string;
  media_url: string | null;
  media_type: "image" | "gif" | "video";
  is_active: boolean;
  show_on_course_list: boolean;
  show_on_course_detail: boolean;
  show_before_content: boolean;
  show_on_dashboard: boolean;
  priority: number;
  starts_at: string | null;
  ends_at: string | null;
  closeable: boolean;
  dismiss_for_hours: number;
}

export interface PublicSiteSettings {
  chat_enabled: boolean;
  comments_enabled: boolean;
  comments_require_approval: boolean;
  updated_at: string;
}

export interface CourseComment {
  id: number;
  course: number;
  author_id: number;
  author_name: string;
  body: string;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
}

export const fetchAdvertisements = (
  placement: AdvertisementPlacement,
): Promise<Advertisement[]> =>
  fetch(`${API_BASE_URL}/api/advertisements/?placement=${placement}`).then(handleResponse);

export const fetchPublicSiteSettings = (): Promise<PublicSiteSettings> =>
  fetch(`${API_BASE_URL}/api/site-settings/`).then(handleResponse);

export const fetchCourseComments = (courseId: number): Promise<CourseComment[]> =>
  fetch(`${API_BASE_URL}/api/course-comments/?course=${courseId}`).then(handleResponse);

export const createCourseComment = (
  courseId: number,
  body: string,
  token: string,
): Promise<CourseComment> =>
  fetch(`${API_BASE_URL}/api/course-comments/`, {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify({ course: courseId, body }),
  }).then(handleResponse);

export const deleteCourseComment = (
  commentId: number,
  token: string,
): Promise<void> =>
  fetch(`${API_BASE_URL}/api/course-comments/${commentId}/`, {
    method: "DELETE",
    headers: getAuthHeaders(token),
  }).then(handleResponse);
