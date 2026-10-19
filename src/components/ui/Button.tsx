import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline" | "luxury" | "ghost";
    size?: "sm" | "md" | "lg";
    children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
        const variants = {
            primary: "bg-white text-black hover:bg-white/90",
            secondary: "bg-white/10 text-white hover:bg-white/20",
            outline: "border border-white/20 text-white hover:bg-white/10",
            luxury: "bg-[#3ECF8E] hover:bg-[#34d399] text-black font-semibold shadow-lg shadow-[#3ECF8E]/20 hover:shadow-[#3ECF8E]/35 transition-all duration-300",
            ghost: "text-white/60 hover:text-white hover:bg-white/5",
        };

        const sizes = {
            sm: "px-4 py-2 text-sm",
            md: "px-6 py-3 text-base",
            lg: "px-8 py-4 text-lg",
        };

        return (
            <motion.button
                ref={ref}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                    "rounded-2xl font-plus transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed",
                    variants[variant],
                    sizes[size],
                    className
                )}
                {...(props as any)}
            >
                {children}
            </motion.button>
        );
    }
);

Button.displayName = "Button";
