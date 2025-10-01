// src/components/Dashboard/AnimatedStatCard.tsx
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

interface AnimatedStatCardProps {
    icon: React.ElementType;
    title: string;
    value: number | string;
    color?: string;
    gradient?: string;
    link?: string;
    isLoading: boolean;
    delay?: number;
}

const AnimatedStatCard = ({ icon: Icon, title, value, color, gradient, link, isLoading, delay = 0 }: AnimatedStatCardProps) => {
    const count = useMotionValue(0);
    const rounded = useTransform(count, (latest) => Math.round(latest).toLocaleString('fa-IR'));

    useEffect(() => {
        if (!isLoading && typeof value === 'number') {
            const controls = animate(count, value, {
                duration: 2,
                ease: "circOut",
            });
            return controls.stop;
        }
    }, [value, isLoading, count]);

    const cardVariants = {
        hidden: { opacity: 0, scale: 0.95, y: 20 },
        visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5, delay, ease: [0.25, 1, 0.5, 1] } },
    };

    const content = (
        <motion.div initial="hidden" animate="visible" variants={cardVariants}>
            <Card className="overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
                    <div className={`flex items-center justify-center h-10 w-10 rounded-full ${gradient}`}>
                        <Icon className={`h-6 w-6 ${color}`} />
                    </div>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <Skeleton className="h-9 w-2/3" />
                    ) : (
                        <div className="text-3xl font-bold">
                            {typeof value === 'number' ? <motion.span>{rounded}</motion.span> : value}
                        </div>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );

    return link ? <a href={link} target="_blank" rel="noopener noreferrer" className="block">{content}</a> : content;
};

export default AnimatedStatCard;