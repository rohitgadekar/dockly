import React from "react";
import { cn } from "@/lib/utils";

interface CardProps {
    children: React.ReactNode;
    className?: string;
    animate?: boolean;
    style?: React.CSSProperties;
    onClick?: () => void;
}

export const Card = ({ children, className, style, onClick }: CardProps) => {
    return (
        <div
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
        </div>
    );
};
