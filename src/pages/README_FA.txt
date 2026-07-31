# بسته نوسازی UI myCloud

## 1) فونت محلی (بدون CDN)
در ریشه پروژه فرانت اجرا کن:

npm install @fontsource-variable/vazirmatn

سپس فایل `main.tsx` این بسته را جایگزین `src/main.tsx` کن.
فونت از داخل node_modules وارد build Vite می‌شود و در زمان باز شدن سایت از Google/CDN دانلود نمی‌شود.

## 2) فایل‌های جدید
- PageShell.tsx -> src/components/Layout/PageShell.tsx
- mycloud-ui.css -> src/styles/mycloud-ui.css

اگر پوشه `src/styles` نیست، بساز.

## 3) فایل‌های جایگزین
- main.tsx -> src/main.tsx
- index.css -> src/index.css
- Dashboard.tsx -> src/pages/Dashboard.tsx
- Profile.tsx -> src/pages/Profile.tsx
- About.tsx -> src/pages/About.tsx
- AllCourses.tsx -> src/pages/AllCourses.tsx
- AllFaculties.tsx -> src/pages/AllFaculties.tsx
- Faculty.tsx -> src/pages/Faculty.tsx
- Messenger.tsx -> src/pages/Messenger.tsx
- AdminPanel.tsx -> src/pages/AdminPanel.tsx
- CourseDetail.tsx -> src/pages/CourseDetail.tsx
- NotFound.tsx -> src/pages/NotFound.tsx

## 4) اجرا
npm run dev -- --port 3000
