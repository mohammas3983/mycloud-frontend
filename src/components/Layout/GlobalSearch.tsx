import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { fetchCourses, Course } from "@/lib/api";
import { BookOpen, Search } from "lucide-react";
import debounce from 'lodash.debounce';

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const navigate = useNavigate();

  // Load all courses once on component mount
  useEffect(() => {
    fetchCourses()
      .then(setAllCourses)
      .catch(console.error);
  }, []);

  // Hotkey to open search (Ctrl+K or Cmd+K)
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Debounced search function
  const handleSearch = useCallback(
    debounce((query: string) => {
      if (!query) {
        setFilteredCourses([]);
        return;
      }
      const lowerCaseQuery = query.toLowerCase();
      const results = allCourses.filter(course =>
        course.title.toLowerCase().includes(lowerCaseQuery) ||
        course.professor.name.toLowerCase().includes(lowerCaseQuery) ||
        course.faculty.name.toLowerCase().includes(lowerCaseQuery)
      );
      setFilteredCourses(results);
    }, 300), // 300ms delay
    [allCourses]
  );

  const onSelectCourse = (courseId: number) => {
    navigate(`/course/${courseId}`);
    setOpen(false);
  };

  return (
    <>
      <div className="relative w-full" onClick={() => setOpen(true)}>
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          readOnly
          placeholder="جستجوی دوره..."
          className="w-full pl-10 cursor-pointer"
        />
        <kbd className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-2 font-mono text-sm font-medium text-muted-foreground opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </div>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput 
          placeholder="نام دوره، استاد یا دانشکده را تایپ کنید..."
          onValueChange={handleSearch}
        />
        <CommandList>
          <CommandEmpty>هیچ نتیجه‌ای یافت نشد.</CommandEmpty>
          {filteredCourses.length > 0 && (
            <CommandGroup heading="دوره‌ها">
              {filteredCourses.map((course) => (
                <CommandItem
                  key={course.id}
                  value={`${course.title} ${course.professor.name}`}
                  onSelect={() => onSelectCourse(course.id)}
                  className="cursor-pointer"
                >
                  <BookOpen className="ml-2 h-4 w-4" />
                  <div className="flex flex-col">
                    <span>{course.title}</span>
                    <span className="text-xs text-muted-foreground">{course.professor.name} - {course.faculty.name}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}