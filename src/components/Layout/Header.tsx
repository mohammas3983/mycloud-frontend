// src/components/Layout/Header.tsx

import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  User, LogOut, BookOpen, Home, GraduationCap, Info, Shield, Menu, Cloud, Bell, Loader2, Search
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { GlobalSearch } from "@/components/GlobalSearch";
import { ActivityLog, fetchNotifications } from "@/lib/api";
import { formatDistanceToNow } from 'date-fns-jalali';
import { Separator } from "@/components/ui/separator";

const Header = () => {
    const location = useLocation();
    const { user, logout, isLoading, token } = useAuth();
    const isActive = (path: string) => location.pathname === path;
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    
    const [notifications, setNotifications] = useState<ActivityLog[]>([]);
    const [isLoadingNotifs, setIsLoadingNotifs] = useState(true);
    
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const navItems = [
        { path: "/dashboard", label: "داشبورد", icon: Home },
        { path: "/courses", label: "دوره‌ها", icon: BookOpen },
        { path: "/faculties", label: "دانشکده‌ها", icon: GraduationCap },
        { path: "/about", label: "درباره ما", icon: Info },
    ];

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
            {/* The actual search dialog, placed here to be accessible globally */}
            <GlobalSearch open={isSearchOpen} onOpenChange={setIsSearchOpen} />

            <div className="container flex h-16 items-center justify-between">
                <div className="flex items-center gap-4 md:gap-8">
                    {/* Logo with Text (visible on all screen sizes) */}
                    <Link to="/dashboard" className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                            <Cloud className="h-8 w-8" style={{ color: '#007AFF' }} />
                        </div>
                        <div className="flex-col flex">
                            <span className="text-xl font-bold text-foreground">myCloud</span>
                            <span className="text-xs text-muted-foreground">سامانه یادگیری</span>
                        </div>
                    </Link>
                    {/* Desktop Navigation */}
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

                <div className="flex items-center gap-2">
                    {/* --- UNIFIED SEARCH TRIGGER --- */}
                    {/* Desktop Search Trigger */}
                    <div className="w-48 md:w-56 hidden sm:block">
                        <Button variant="outline" className="w-full justify-start text-muted-foreground" onClick={() => setIsSearchOpen(true)}>
                            <Search className="ml-2 h-4 w-4" />
                            <span>جستجوی دوره...</span>
                        </Button>
                    </div>
                    {/* Mobile Search Trigger */}
                    <Button variant="ghost" size="icon" className="sm:hidden rounded-full" onClick={() => setIsSearchOpen(true)}>
                        <Search className="h-5 w-5" />
                    </Button>

                    {isLoading ? (
                        <div className="h-9 w-9 rounded-full bg-muted animate-pulse" />
                    ) : user ? (
                        <>
                            {/* Notification Bell Dropdown */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="rounded-full"><Bell className="h-5 w-5" /></Button></DropdownMenuTrigger>
                                <DropdownMenuContent className="w-80" align="end">
                                    <DropdownMenuLabel>آخرین فعالیت‌ها</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    {isLoadingNotifs ? (<div className="flex justify-center items-center p-4"><Loader2 className="h-5 w-5 animate-spin" /></div>
                                    ) : notifications.length > 0 ? (
                                        notifications.map((notif) => (
                                            <DropdownMenuItem key={notif.id} className="flex flex-col items-start gap-1 p-2 cursor-default">
                                                <p className="text-sm text-foreground whitespace-normal">{notif.description}</p>
                                                <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(notif.timestamp), { addSuffix: true })}</p>
                                            </DropdownMenuItem>
                                        ))
                                    ) : (<p className="p-4 text-sm text-muted-foreground text-center">فعالیت جدیدی وجود ندارد.</p>)}
                                </DropdownMenuContent>
                            </DropdownMenu>

                            {/* User Profile Dropdown */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild><Button variant="ghost" className="relative h-9 w-9 rounded-full"><Avatar className="h-9 w-9"><AvatarFallback>{user.first_name?.[0]}{user.last_name?.[0]}</AvatarFallback></Avatar></Button></DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56" align="end" forceMount>
                                    <DropdownMenuLabel className="font-normal"><div className="flex flex-col space-y-1"><p className="text-sm font-medium leading-none">{user.first_name} {user.last_name}</p><p className="text-xs leading-none text-muted-foreground">{user.username}</p></div></DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <Link to="/profile"><DropdownMenuItem className="cursor-pointer"><User className="ml-2 h-4 w-4" /><span>پروفایل من</span></DropdownMenuItem></Link>
                                    {user.profile.is_supervisor && (<Link to="/admin-panel"><DropdownMenuItem className="cursor-pointer"><Shield className="ml-2 h-4 w-4" /><span>پنل مدیریت</span></DropdownMenuItem></Link>)}
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={logout} className="cursor-pointer text-destructive focus:text-destructive"><LogOut className="ml-2 h-4 w-4" /><span>خروج</span></DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </>
                    ) : (
                        <Link to="/login" className="hidden sm:block"><Button>ورود / ثبت‌نام</Button></Link>
                    )}

                    {/* Mobile Menu Trigger with Text */}
                    <div className="md:hidden">
                        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" className="flex items-center gap-1.5 px-2">
                                    <Menu className="h-6 w-6" />
                                    <span className="font-medium text-sm">منو</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="flex flex-col">
                                <Link to="/dashboard" className="flex items-center gap-2 mb-4" onClick={() => setIsMobileMenuOpen(false)}><div className="w-10 h-10 rounded-lg flex items-center justify-center"><Cloud className="h-8 w-8" style={{ color: '#007AFF' }}/></div><span className="text-xl font-bold text-foreground">myCloud</span></Link>
                                <Separator />
                                <nav className="flex flex-col gap-2 mt-4">
                                    {navItems.map((item) => (<Link key={item.path} to={item.path} onClick={() => setIsMobileMenuOpen(false)}><Button variant={isActive(item.path) ? "secondary" : "ghost"} className="w-full justify-start text-base py-6"><item.icon className="mr-2 h-5 w-5" />{item.label}</Button></Link>))}
                                </nav>
                                <div className="mt-auto"><Separator /><div className="py-4">
                                    {user ? (<div className="flex flex-col gap-2">
                                        <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)}><Button variant="ghost" className="w-full justify-start"><User className="ml-2 h-4 w-4" />پروفایل من</Button></Link>
                                        {user.profile.is_supervisor && (<Link to="/admin-panel" onClick={() => setIsMobileMenuOpen(false)}><Button variant="ghost" className="w-full justify-start"><Shield className="ml-2 h-4 w-4" />پنل مدیریت</Button></Link>)}
                                        <Button variant="destructive" className="w-full justify-start" onClick={() => { logout(); setIsMobileMenuOpen(false); }}><LogOut className="ml-2 h-4 w-4" />خروج</Button>
                                    </div>) : (<Link to="/login" onClick={() => setIsMobileMenuOpen(false)}><Button className="w-full">ورود / ثبت‌نام</Button></Link>)}
                                </div></div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </header>
    );
};
export default Header;