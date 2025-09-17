// src/lib/api.ts

// آدرس اصلی بک‌اند ما
const API_BASE_URL = "http://127.0.0.1:8000";

// تعریف ساختار داده‌ای یک دوره، دقیقاً مطابق با چیزی که از API میگیریم
// این کار به ما کمک می‌کنه که در ادامه کد، اشتباهات تایپی نداشته باشیم
export interface Course {
  id: number;
  title: string;
  description: string;
  image: string | null; // تصویر می‌تونه وجود نداشته باشه
  professor: {
    name: string;
  };
  faculty: {
    name: string;
  };
}

// این تابع "گارسون" اصلی ماست. میره به بک‌اند و لیست دوره‌ها رو میاره
export async function fetchCourses(): Promise<Course[]> {
  // به آدرس API که ساختیم درخواست میفرستیم
  const response = await fetch(`${API_BASE_URL}/api/courses/`);
  
  // اگر درخواست موفقیت‌آمیز نبود، یک ارور نمایش بده
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  // داده‌های دریافتی (که به فرمت JSON هستن) رو برگردون
  return response.json();
}