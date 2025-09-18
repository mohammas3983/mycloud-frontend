// src/lib/api.ts

const API_BASE_URL = "http://127.0.0.1:8000";

// --- تایپ‌ها (Interfaces) ---
export interface Content { id: number; title: string; url: string; order: number; content_type: 'pdf' | 'video' | 'link' | 'assignment' | 'other'; }
export interface Professor { id: number; name: string; }
export interface Faculty { id: number; name: string; }
export interface Course { id: number; title: string; description: string; image: string | null; professor: Professor; faculty: Faculty & { id: number }; contents: Content[]; }
export interface UserProfile { id: number; is_approved: boolean; is_supervisor: boolean; }
export interface CustomUserSerializer { id: number; username: string; first_name: string; last_name: string; is_active: boolean; profile: UserProfile; }

// --- توابع کمکی ---
const getAuthHeaders = (token: string) => ({ 'Content-Type': 'application/json', 'Authorization': `Token ${token}` });
const handleResponse = async (response: Response) => {
    if (!response.ok) {
        if (response.status === 204) return null;
        const errorBody = await response.text();
        console.error("API Error:", errorBody);
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.status === 204 ? null : response.json();
};

// --- توابع API ---
export const fetchCourses = (): Promise<Course[]> => fetch(`${API_BASE_URL}/api/courses/`).then(handleResponse);
export const fetchCourseById = (id: string): Promise<Course> => fetch(`${API_BASE_URL}/api/courses/${id}/`).then(handleResponse);
export const createCourse = (data: any, token: string): Promise<Course> => fetch(`${API_BASE_URL}/api/courses/`, { method: 'POST', headers: getAuthHeaders(token), body: JSON.stringify(data) }).then(handleResponse);
export const updateCourse = (id: number, data: any, token: string): Promise<Course> => fetch(`${API_BASE_URL}/api/courses/${id}/`, { method: 'PUT', headers: getAuthHeaders(token), body: JSON.stringify(data) }).then(handleResponse);
export const deleteCourse = (id: number, token: string): Promise<void> => fetch(`${API_BASE_URL}/api/courses/${id}/`, { method: 'DELETE', headers: getAuthHeaders(token) }).then(handleResponse);
export const fetchCoursesByFaculty = (facultyId: string): Promise<Course[]> => fetch(`${API_BASE_URL}/api/courses/?faculty=${facultyId}`).then(handleResponse);
export const fetchFacultyById = (facultyId: string): Promise<Faculty> => fetch(`${API_BASE_URL}/api/faculties/${facultyId}/`).then(handleResponse);
export const fetchFeaturedCourses = (): Promise<Course[]> => fetch(`${API_BASE_URL}/api/courses/featured/`).then(handleResponse); // <-- تابع جدید

export const fetchFaculties = (): Promise<Faculty[]> => fetch(`${API_BASE_URL}/api/faculties/`).then(handleResponse);
export const createFaculty = (name: string, token: string): Promise<Faculty> => fetch(`${API_BASE_URL}/api/faculties/`, { method: 'POST', headers: getAuthHeaders(token), body: JSON.stringify({ name }) }).then(handleResponse);
export const updateFaculty = (id: number, name: string, token: string): Promise<Faculty> => fetch(`${API_BASE_URL}/api/faculties/${id}/`, { method: 'PUT', headers: getAuthHeaders(token), body: JSON.stringify({ name }) }).then(handleResponse);
export const deleteFaculty = (id: number, token: string): Promise<void> => fetch(`${API_BASE_URL}/api/faculties/${id}/`, { method: 'DELETE', headers: getAuthHeaders(token) }).then(handleResponse);

export const fetchProfessors = (): Promise<Professor[]> => fetch(`${API_BASE_URL}/api/professors/`).then(handleResponse);
export const createProfessor = (name: string, token: string): Promise<Professor> => fetch(`${API_BASE_URL}/api/professors/`, { method: 'POST', headers: getAuthHeaders(token), body: JSON.stringify({ name }) }).then(handleResponse);
export const updateProfessor = (id: number, name: string, token: string): Promise<Professor> => fetch(`${API_BASE_URL}/api/professors/${id}/`, { method: 'PUT', headers: getAuthHeaders(token), body: JSON.stringify({ name }) }).then(handleResponse);
export const deleteProfessor = (id: number, token: string): Promise<void> => fetch(`${API_BASE_URL}/api/professors/${id}/`, { method: 'DELETE', headers: getAuthHeaders(token) }).then(handleResponse);

export const fetchUsersAPI = (token: string): Promise<CustomUserSerializer[]> => fetch(`${API_BASE_URL}/api/users/`, { headers: getAuthHeaders(token) }).then(handleResponse);
export const toggleUserApprovalAPI = (profileId: number, status: boolean, token: string): Promise<void> => fetch(`${API_BASE_URL}/api/profiles/${profileId}/`, { method: 'PATCH', headers: getAuthHeaders(token), body: JSON.stringify({ is_approved: status }) }).then(handleResponse);
export const setUserActiveStatusAPI = (userId: number, status: boolean, token: string): Promise<void> => fetch(`${API_BASE_URL}/api/users/${userId}/set_active_status/`, { method: 'POST', headers: getAuthHeaders(token), body: JSON.stringify({ is_active: status }) }).then(handleResponse);