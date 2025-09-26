// src/components/Layout/Header.tsx
import { Link, useLocation } from "react-router-dom";
import { useState } from "react"; // ۱. این را اضافه کنید
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"; // ۲. این‌ها را اضافه کنید
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  User, 
  LogOut,
  BookOpen,
  Home,
  GraduationCap,
  Info,
  Shield,
  Menu // ۳. آیکون منو را اضافه کنید
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { GlobalSearch } from "@/components/GlobalSearch";

const Header = () => {
    const location = useLocation();
    const { user, logout, isLoading } = useAuth();
    const isActive = (path: string) => location.pathname === path;
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // ۴. یک state برای منوی موبایل اضافه کنید

    const navItems = [
        { path: "/dashboard", label: "داشبورد", icon: Home },
        { path: "/courses", label: "دوره‌ها", icon: BookOpen },
        { path: "/faculties", label: "دانشکده‌ها", icon: GraduationCap },
        { path: "/about", label: "درباره ما", icon: Info },
    ];

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between">
                <div className="flex items-center gap-8">
                    {/* ===== بخش لوگو و منوی دسکتاپ (بدون تغییر) ===== */}
                    <Link to="/dashboard" className="flex items-center gap-2">
                        <div className="hero-gradient w-10 h-10 rounded-lg flex items-center justify-center">
                            <BookOpen className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-col hidden sm:flex"> {/* این بخش در موبایل خیلی کوچک مخفی می‌شود */}
                            <span className="text-xl font-bold text-foreground">myCloud</span>
                            <span className="text-xs text-muted-foreground">سامانه یادگیری دانشگاه</span>
                        </div>
                    </Link>
                    <nav className="hidden md:flex items-center gap-1">
                        {navItems.map((item) => (
                            <Link key={item.path} to={item.path}>
                                <Button variant={isActive(item.path) ? "secondary" : "ghost"} size="sm">
                                    <item.icon className="mr-2 h-4 w-4" />{item.label}
                                </Button>
                            </Link>
                        ))}
                    </nav>
                </div>

                <div className="flex items-center gap-4">
                    <div className="w-64 hidden sm:block">
                        <GlobalSearch />
                    </div>

                    {/* ===== بخش پروفایل کاربر (بدون تغییر) ===== */}
                    {isLoading ? (
                         <div className="h-9 w-9 rounded-full bg-muted animate-pulse" />
                    ) : user ? (
                        <DropdownMenu>
                           {/* ... محتوای دراپ‌داون پروفایل ... */}
                        </DropdownMenu>
                    ) : (
                        <Link to="/login" className="hidden sm:block"><Button>ورود / ثبت‌نام</Button></Link>
                    )}

                    {/* ===== ۵. دکمه منوی همبرگری برای موبایل ===== */}
                    <div className="md:hidden">
                        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <Menu className="h-6 w-6" />
                                    <span className="sr-only">باز کردن منو</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left">
                                <Link to="/dashboard" className="flex items-center gap-2 mb-8">
                                    <div className="hero-gradient w-10 h-10 rounded-lg flex items-center justify-center">
                                        <BookOpen className="h-6 w-6 text-white" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xl font-bold text-foreground">myCloud</span>
                                    </div>
                                </Link>
                                <nav className="flex flex-col gap-2">
                                    {navItems.map((item) => (
                                        <Link key={item.path} to={item.path} onClick={() => setIsMobileMenuOpen(false)}>
                                            <Button variant={isActive(item.path) ? "secondary" : "ghost"} className="w-full justify-start">
                                                <item.icon className="mr-2 h-4 w-4" />{item.label}
                                            </Button>
                                        </Link>
                                    ))}
                                </nav>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </header>
    );
};
export default Header;