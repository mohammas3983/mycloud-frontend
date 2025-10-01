// src/components/Dashboard/SiteStatsCard.tsx
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { fetchSiteStats, SiteStats as SiteStatsType } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Eye, CalendarDays, BarChart3 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const StatItem = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: number | string }) => (
    <div className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50">
        <div className="flex items-center gap-3">
            <Icon className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm font-medium">{label}</span>
        </div>
        <span className="text-lg font-semibold">{value}</span>
    </div>
);

export const SiteStatsCard = () => {
    const [stats, setStats] = useState<SiteStatsType | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { token } = useAuth();

    useEffect(() => {
        if (token) {
            setIsLoading(true);
            fetchSiteStats(token).then(setStats).catch(console.error).finally(() => setIsLoading(false));
        }
    }, [token]);

    const renderSkeletons = () => (
        <div className="space-y-4"><Skeleton className="h-8 w-full" /><Skeleton className="h-8 w-full" /><Skeleton className="h-8 w-full" /><Skeleton className="h-8 w-full" /></div>
    );

    return (
        <Card>
            <CardHeader><CardTitle>آمار پلتفرم</CardTitle></CardHeader>
            <CardContent className="space-y-2">
                {isLoading ? renderSkeletons() : stats && (
                    <>
                        <StatItem icon={Users} label="کل کاربران" value={stats.total_users.toLocaleString('fa-IR')} />
                        <StatItem icon={Eye} label="بازدید امروز" value={stats.daily_visits.toLocaleString('fa-IR')} />
                        <StatItem icon={CalendarDays} label="بازدید این هفته" value={stats.weekly_visits.toLocaleString('fa-IR')} />
                        <StatItem icon={BarChart3} label="کل بازدیدها" value={stats.total_visits.toLocaleString('fa-IR')} />
                    </>
                )}
            </CardContent>
        </Card>
    );
};