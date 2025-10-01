// src/lib/api.ts

// CORRECTED: Ensure the environment variable is read correctly.
// The Vite dev server must be restarted after changing .env files.
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// A check to make sure you've set up your .env.local file correctly
if (!API_BASE_URL) {
  alert("FATAL ERROR: VITE_API_BASE_URL is not defined. Please check your .env.local file and restart the dev server.");
}

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
}
export interface CustomUserSerializer { id: number; username: string; first_name: string; last_name: string; is_active: boolean; profile: UserProfile; }

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