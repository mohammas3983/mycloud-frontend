// src/components/Layout/Header.tsx

import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Search, 
  Bell, 
  Settings, 
  User, 
  LogOut,
  BookOpen,
  Home,
  Calendar,
  FileText,
  GraduationCap
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext"; // هوک مدیریت وضعیت کاربر

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  // اطلاعات کاربر، تابع خروج و وضعیت لودینگ رو از کانتکست می‌گیریم
  const { user, logout, isLoading } = useAuth();

  const isActive = (path: string) => location.pathname === path || (path === "/dashboard" && location.pathname === "/");

  const navItems = [
    { path: "/dashboard", label: "داشبورد", icon: Home },
    { path: "/courses", label: "دروس من", icon: BookOpen },
    { path: "/faculties", label: "دانشکده ها", icon: GraduationCap },
    { path: "/calendar", label: "تقویم", icon: Calendar },
    { path: "/resources", label: "منابع", icon: FileText },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo and Nav */}
        <div className="flex items-center gap-8">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="hero-gradient w-10 h-10 rounded-lg flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col">
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

        {/* Search and User Actions */}
        <div className="flex items-center gap-4">
          <div className="relative hidden sm:block">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="جستجو در دروس..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-64 pr-10"/>
          </div>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-2 w-2 bg-destructive rounded-full"></span>
          </Button>

          {/* منوی کاربری کاملاً هوشمند */}
          {isLoading ? (
            // وقتی در حال چک کردن وضعیت لاگین هستیم، یک اسکلت لودینگ نشون میدیم
            <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
          ) : user ? (
            // اگر کاربر لاگین کرده بود، منوی پروفایل رو نشون میدیم
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{user.first_name?.[0]}{user.last_name?.[0]}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.first_name} {user.last_name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.username}</p>
                  </div>
                  {!user.profile.is_approved && (
                    <div className="mt-2 text-xs text-orange-600 bg-orange-100 p-1 rounded-md text-center">
                      در انتظار تایید مدیر
                    </div>
                  )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem><User className="ml-2 h-4 w-4" /><span>پروفایل</span></DropdownMenuItem>
                <DropdownMenuItem><Settings className="ml-2 h-4 w-4" /><span>تنظیمات</span></DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="cursor-pointer text-destructive focus:text-destructive">
                  <LogOut className="ml-2 h-4 w-4" />
                  <span>خروج</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            // اگر کاربر لاگین نکرده بود، دکمه ورود رو نشون میدیم
            <Link to="/login">
              <Button>ورود / ثبت‌نام</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;