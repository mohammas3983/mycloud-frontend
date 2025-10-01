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
    link?: string;
    isLoading: boolean;
    delay?: number;
}

const AnimatedStatCard = ({ icon: Icon, title, value, color, link, isLoading, delay = 0 }: AnimatedStatCardProps) => {
    const count = useMotionValue(0);
    const rounded = useTransform(count, (latest) => Math.round(latest));

    useEffect(() => {
        if (!isLoading && typeof value === 'number') {
            const controls = animate(count, value, {
                duration: 1.5,
                ease: "easeOut",
            });
            return controls.stop;
        }
    }, [value, isLoading, count]);

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay } },
    };

    const content = (
        <motion.div initial="hidden" animate="visible" variants={cardVariants}>
            <Card className="hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 shadow-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
                    <div className={`p-2 rounded-full ${color}/20`}>
                        <Icon className={`h-5 w-5 ${color}`} />
                    </div>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <Skeleton className="h-8 w-1/2" />
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