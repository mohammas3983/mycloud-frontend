// src/lib/api.ts

const API_BASE_URL = "http://127.0.0.1:8000";

export interface Course {
  id: number;
  title: string;
  description: string;
  image: string | null; 
  professor: {
    name: string;
  };
  faculty: {
    name: string;
  };
}

export interface Content {
  id: number;
  title: string;
  url: string;
  order: number;
  content_type: 'pdf' | 'video' | 'link' | 'assignment' | 'other';
}


export async function fetchCourses(): Promise<Course[]> {

  const response = await fetch(`${API_BASE_URL}/api/courses/`);
  

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }


  return response.json();
}

export async function fetchCourseById(courseId: string): Promise<Course> {
  const response = await fetch(`${API_BASE_URL}/api/courses/${courseId}/`);
  
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
}

export interface Faculty {
  id: number;
  name: string;
}

export async function fetchFaculties(): Promise<Faculty[]> {
  const response = await fetch(`${API_BASE_URL}/api/faculties/`);
  if (!response.ok) {
    throw new Error("Failed to fetch faculties");
  }
  return response.json();
}

export interface CustomUserSerializer {
  id: number;
  username: string; // این همان شماره دانشجویی است
  first_name: string;
  last_name: string;
  profile: {
    is_approved: boolean;
  };
}


export async function createContent(courseId: string, title: string, url: string, contentType: string, token: string): Promise<Content> {
  const response = await fetch(`${API_BASE_URL}/api/courses/${courseId}/contents/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`, // <-- توکن برای احراز هویت
    },
    body: JSON.stringify({ title, url, content_type: contentType }),
  });
  if (!response.ok) {
    throw new Error("Failed to create content");
  }
  return response.json();
}