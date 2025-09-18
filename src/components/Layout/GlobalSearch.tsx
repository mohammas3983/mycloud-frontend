// src/components/GlobalSearch.tsx
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { fetchCourses, Course } from "@/lib/api";
import { BookOpen } from "lucide-react";

export function GlobalSearch() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<Course[]>([]);
    const [allCourses, setAllCourses] = useState<Course[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const searchRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchCourses().then(setAllCourses).catch(err => console.error("GlobalSearch: Failed to fetch courses", err));
    }, []);

    useEffect(() => {
        if (query.length > 1) {
            const filtered = allCourses.filter(course => 
                course.title.toLowerCase().includes(query.toLowerCase())
            );
            setResults(filtered);
            setIsOpen(true);
        } else {
            setResults([]);
            setIsOpen(false);
        }
    }, [query, allCourses]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleSelect = (courseId: number) => {
        setQuery("");
        setIsOpen(false);
        navigate(`/course/${courseId}`);
    };
    
    return (
        <div ref={searchRef} className="relative w-full">
            <Command className="overflow-visible">
                <CommandInput
                    placeholder="جستجو در دوره‌ها..."
                    value={query}
                    onValueChange={setQuery}
                    onFocus={() => { if (query.length > 1) setIsOpen(true); }}
                />
                {isOpen && (
                    // --- CHANGE START: اضافه کردن کلاس z-50 ---
                    // z-50 یک کلاس استاندارد TailwindCSS است که z-index: 50 را اعمال می‌کند
                    // این عدد بسیار بزرگ است و تضمین می‌کند که این عنصر روی بقیه قرار بگیرد
                    <div className="absolute top-full mt-2 w-full bg-background border rounded-md shadow-lg z-50">
                    // --- CHANGE END ---
                        <CommandList>
                            {results.length > 0 ? (
                                <CommandGroup heading="نتایج یافت شده">
                                    {results.map((course) => (
                                        <CommandItem key={course.id} onSelect={() => handleSelect(course.id)} className="cursor-pointer">
                                            <BookOpen className="ml-2 h-4 w-4" />
                                            <span>{course.title}</span>
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            ) : (
                                <div className="p-2 text-sm text-center text-muted-foreground">هیچ دوره‌ای با این مشخصات یافت نشد.</div>
                            )}
                        </CommandList>
                    </div>
                )}
            </Command>
        </div>
    );
}