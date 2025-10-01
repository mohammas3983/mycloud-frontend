// src/components/Layout/Header.tsx

import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
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
  Cloud,
  Bell,      // آیکون زنگوله
  Loader2    // آیکون لودر
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { GlobalSearch } from "@/components/GlobalSearch";

// Imports for new functionality
import { ActivityLog, fetchNotifications } from "@/lib/api";
import { formatDistanceToNow } from 'date-fns-jalali'; // برای تاریخ فارسی

const Header = () => {
    const location = useLocation();
    const { user, logout, isLoading, token } = useAuth(); // token برای فراخوانی API لازم است
    const isActive = (path: string) => location.pathname === path;
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    
    // State for notifications
    const [notifications, setNotifications] = useState<ActivityLog[]>([]);
    const [isLoadingNotifs, setIsLoadingNotifs] = useState(true);

    const navItems = [
        { path: "/dashboard", label: "داشبورد", icon: Home },
        { path: "/courses", label: "دوره‌ها", icon: BookOpen },
        { path: "/faculties", label: "دانشکده‌ها", icon: GraduationCap },
        { path: "/about", label: "درباره ما", icon: Info },
    ];

    // Effect to fetch notifications when user logs in
    useEffect(() => {
        if (user && token) {
            setIsLoadingNotifs(true);
            fetchNotifications(token)
                .then(setNotifications)
                .catch(console.error)
                .finally(() => setIsLoadingNotifs(false));
        }
    }, [user, token]);

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between">
                {/* Logo and Main Navigation */}
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

                {/* Search, Notifications, and User Menu */}
                <div className="flex items-center gap-4">
                    <div className="w-48 md:w-64 hidden sm:block">
                        <GlobalSearch />
                    </div>

                    {isLoading ? (
                        <div className="h-9 w-9 rounded-full bg-muted animate-pulse" />
                    ) : user ? (
                        <>
                            {/* Notification Bell Dropdown */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="rounded-full">
                                        <Bell className="h-5 w-5" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-80" align="end">
                                    <DropdownMenuLabel>آخرین فعالیت‌ها</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    {isLoadingNotifs ? (
                                        <div className="flex justify-center items-center p-4">
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                        </div>
                                    ) : notifications.length > 0 ? (
                                        notifications.map((notif) => (
                                            <DropdownMenuItem key={notif.id} className="flex flex-col items-start gap-1 p-2 cursor-default">
                                                <p className="text-sm text-foreground whitespace-normal">{notif.description}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {formatDistanceToNow(new Date(notif.timestamp), { addSuffix: true })}
                                                </p>
                                            </DropdownMenuItem>
                                        ))
                                    ) : (
                                        <p className="p-4 text-sm text-muted-foreground text-center">فعالیت جدیدی وجود ندارد.</p>
                                    )}
                                </DropdownMenuContent>
                            </DropdownMenu>

                            {/* User Profile Dropdown */}
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
                        </>
                    ) : (
                        <Link to="/login" className="hidden sm:block"><Button>ورود / ثبت‌نام</Button></Link>
                    )}

                    {/* Mobile Menu */}
                    <div className="md:hidden">
                        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <Menu className="h-6 w-6" />
                                    <span className="sr-only">باز کردن منو</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left">
                                <Link to="/dashboard" className="flex items-center gap-2 mb-8" onClick={() => setIsMobileMenuOpen(false)}>
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