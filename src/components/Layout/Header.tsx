// src/components/Layout/Header.tsx
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
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
  Menu,
  Cloud // آیکون ابر
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { GlobalSearch } from "@/components/GlobalSearch";

const Header = () => {
    const location = useLocation();
    const { user, logout, isLoading } = useAuth();
    const isActive = (path: string) => location.pathname === path;
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
                    <Link to="/dashboard" className="flex items-center gap-2">
                        <div className="hero-gradient w-10 h-10 rounded-lg flex items-center justify-center">
                            <Cloud className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-col hidden sm:flex">
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

                    {isLoading ? (
                        <div className="h-9 w-9 rounded-full bg-muted animate-pulse" />
                    ) : user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                                    <Avatar className="h-9 w-9"><AvatarFallback>{user.first_name?.[0]}{user.last_name?.[0]}</AvatarFallback></Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end" forceMount>
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">{user.first_name} {user.last_name}</p>
                                        <p className="text-xs leading-none text-muted-foreground">{user.username}</p>
                                    </div>
                                    {!user.profile.is_approved && (<div className="mt-2 text-xs text-orange-600 bg-orange-100 p-1 rounded-md text-center">در انتظار تایید مدیر</div>)}
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <Link to="/profile">
                                    <DropdownMenuItem className="cursor-pointer"><User className="ml-2 h-4 w-4" /><span>پروفایل من</span></DropdownMenuItem>
                                </Link>
                                {user.profile.is_supervisor && (
                                    <Link to="/admin-panel"><DropdownMenuItem className="cursor-pointer"><Shield className="ml-2 h-4 w-4" /><span>پنل مدیریت</span></DropdownMenuItem></Link>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={logout} className="cursor-pointer text-destructive focus:text-destructive"><LogOut className="ml-2 h-4 w-4" /><span>خروج</span></DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Link to="/login" className="hidden sm:block"><Button>ورود / ثبت‌نام</Button></Link>
                    )}

                    {/* منوی موبایل */}
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
                                        <Cloud className="h-6 w-6 text-white" />
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