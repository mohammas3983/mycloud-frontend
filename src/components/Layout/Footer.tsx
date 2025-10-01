// src/components/Layout/Footer.tsx

import { Heart } from "lucide-react";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="w-full border-t bg-muted/40">
            <div className="container py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-right">
                <div className="text-sm text-muted-foreground space-y-1">
                    <p>
                        © {currentYear} تمامی حقوق مادی و معنوی این سایت متعلق به myCloud است.
                    </p>
                    <p className="flex items-center justify-center md:justify-start gap-1">
                        طراحی و توسعه با <Heart className="h-4 w-4 text-red-500" /> توسط محمدصادق قاسمی
                    </p>
                </div>
                <div className="text-sm text-muted-foreground">
                    <p>آخرین بروزرسانی: مهر ۱۴۰۴</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;