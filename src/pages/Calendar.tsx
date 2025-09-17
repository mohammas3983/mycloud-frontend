import { useState } from "react";
import Layout from "@/components/Layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  User,
  BookOpen,
  AlertCircle,
  Plus,
  Filter,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const events = [
    {
      id: 1,
      title: "کلاس مبانی علوم کامپیوتر",
      course: "CS 101",
      instructor: "دکتر سارا احمدی",
      time: "10:00 - 11:30",
      location: "سالن ۱۰۱",
      type: "class",
      date: new Date(2024, 10, 18),
      color: "bg-blue-500"
    },
    {
      id: 2,
      title: "تمرین حساب دیفرانسیل",
      course: "MATH 201",
      instructor: "پروفسور میلاد کریمی",
      time: "14:00 - 15:30",
      location: "سالن ۲۰۵",
      type: "assignment",
      date: new Date(2024, 10, 19),
      color: "bg-purple-500",
      deadline: true
    },
    {
      id: 3,
      title: "آزمون میان ترم فیزیک",
      course: "PHYS 101",
      instructor: "دکتر علی حسینی",
      time: "09:00 - 11:00",
      location: "سالن امتحانات",
      type: "exam",
      date: new Date(2024, 10, 22),
      color: "bg-red-500"
    },
    {
      id: 4,
      title: "ارائه پروژه نگارش",
      course: "ENG 102",
      instructor: "دکتر زهرا رضایی",
      time: "16:00 - 17:30",
      location: "سالن ۳۰۲",
      type: "presentation",
      date: new Date(2024, 10, 25),
      color: "bg-green-500"
    }
  ];

  const today = new Date();
  const todayEvents = events.filter(event => 
    event.date.toDateString() === today.toDateString()
  );

  const upcomingEvents = events.filter(event => 
    event.date > today
  ).slice(0, 5);

  const getEventTypeLabel = (type: string) => {
    switch (type) {
      case 'class': return 'کلاس';
      case 'assignment': return 'تکلیف';
      case 'exam': return 'آزمون';
      case 'presentation': return 'ارائه';
      default: return 'رویداد';
    }
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'class': return 'bg-blue-100 text-blue-800';
      case 'assignment': return 'bg-purple-100 text-purple-800';
      case 'exam': return 'bg-red-100 text-red-800';
      case 'presentation': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold">تقویم آموزشی</h1>
            <p className="text-lg text-muted-foreground">
              برنامه کلاس ها، تکالیف و آزمون های خود را مدیریت کنید
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
            <Button>
              <Plus className="h-4 w-4 ml-2" />
              رویداد جدید
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Today's Events */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="card-gradient">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  برنامه امروز
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {todayEvents.length === 0 ? (
                  <div className="text-center py-8">
                    <CalendarIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">برنامه ای برای امروز ندارید</p>
                  </div>
                ) : (
                  todayEvents.map((event) => (
                    <div key={event.id} className="border rounded-lg p-4 space-y-2">
                      <div className="flex items-start justify-between">
                        <h4 className="font-medium">{event.title}</h4>
                        <Badge className={getEventTypeColor(event.type)}>
                          {getEventTypeLabel(event.type)}
                        </Badge>
                      </div>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4" />
                          <span>{event.course}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <span>{event.instructor}</span>
                        </div>
                      </div>
                      {event.deadline && (
                        <div className="flex items-center gap-2 text-red-600 text-sm">
                          <AlertCircle className="h-4 w-4" />
                          <span>ضرب الاجل نزدیک</span>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card className="card-gradient">
              <CardHeader>
                <CardTitle>رویدادهای آینده</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className={`w-3 h-3 rounded-full ${event.color}`}></div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{event.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {event.date.toLocaleDateString('fa-IR')} - {event.time}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {getEventTypeLabel(event.type)}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Calendar View */}
          <div className="lg:col-span-2">
            <Card className="card-gradient">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>
                    {currentDate.toLocaleDateString('fa-IR', { 
                      year: 'numeric', 
                      month: 'long' 
                    })}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      امروز
                    </Button>
                    <Button variant="outline" size="icon">
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'].map((day) => (
                    <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {Array.from({ length: 35 }, (_, i) => {
                    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i - 6);
                    const isCurrentMonth = date.getMonth() === currentDate.getMonth();
                    const isToday = date.toDateString() === today.toDateString();
                    const hasEvents = events.some(event => event.date.toDateString() === date.toDateString());
                    
                    return (
                      <div
                        key={i}
                        className={`
                          aspect-square p-2 text-center cursor-pointer rounded-lg transition-colors
                          ${isCurrentMonth ? 'hover:bg-muted' : 'text-muted-foreground'}
                          ${isToday ? 'bg-primary text-primary-foreground' : ''}
                          ${hasEvents ? 'bg-accent/20' : ''}
                        `}
                      >
                        <span className="text-sm">{date.getDate()}</span>
                        {hasEvents && (
                          <div className="w-1 h-1 bg-primary rounded-full mx-auto mt-1"></div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Calendar;