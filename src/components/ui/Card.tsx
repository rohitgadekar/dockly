import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface CardProps {
    children: React.ReactNode;
    className?: string;
    animate?: boolean;
    style?: React.CSSProperties;
    onClick?: () => void;
}

export const Card = ({ children, className, animate = true, style, onClick }: CardProps) => {
    const Component = animate ? motion.div : "div";

    return (
        <Component
            initial={animate ? { opacity: 0, y: 20 } : undefined}
            whileInView={animate ? { opacity: 1, y: 0 } : undefined}
            viewport={{ once: true }}
            style={style}
            onClick={onClick}
            className={cn(
                "glass rounded-[2.5rem] p-8 relative group",
                !className?.includes('overflow-') && "overflow-hidden",
                className
            )}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2.5rem]" />
            <div className="relative z-10">{children}</div>
        </Component>
    );
};
