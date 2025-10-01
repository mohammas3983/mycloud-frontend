// src/components/GlobalSearch.tsx

import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { fetchCourses, Course } from "@/lib/api";
import { BookOpen } from "lucide-react";
import debounce from 'lodash.debounce';

// ADDED: Props to control the dialog from the parent component
interface GlobalSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GlobalSearch({ open, onOpenChange }: GlobalSearchProps) {
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const navigate = useNavigate();

  // Load all courses once
  useEffect(() => {
    fetchCourses()
      .then(setAllCourses)
      .catch(console.error);
  }, []);

  // Keyboard shortcut still works
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, onOpenChange]);

  // Debounced search logic remains the same
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
    }, 300),
    [allCourses]
  );

  const onSelectCourse = (courseId: number) => {
    navigate(`/course/${courseId}`);
    onOpenChange(false);
  };

  return (
    // The dialog is now controlled by props from the Header
    <CommandDialog open={open} onOpenChange={onOpenChange}>
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
  );
}