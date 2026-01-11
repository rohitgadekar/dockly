import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Option {
    value: string;
    label: string;
    icon?: React.ReactNode;
}

interface LuxeSelectProps {
    options: Option[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export const LuxeSelect = ({ options, value, onChange, placeholder = "Select option", className }: LuxeSelectProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find(opt => opt.value === value);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className={cn("relative z-50", className)} ref={containerRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-5 px-8 flex items-center justify-between outline-none focus:border-luxury-gold/40 focus:bg-white/[0.05] transition-all duration-500 group"
            >
                <div className="flex items-center gap-4">
                    {selectedOption?.icon && (
                        <div className="text-luxury-gold">
                            {selectedOption.icon}
                        </div>
                    )}
                    <span className={cn(
                        "text-lg font-plus font-medium",
                        !selectedOption ? "text-white/20" : "text-white"
                    )}>
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>
                </div>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-white/20 group-hover:text-luxury-gold transition-colors"
                >
                    <ChevronDown size={20} />
                </motion.div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 5, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 w-full mt-2 bg-[#0F0F0F] border border-white/10 rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-3xl z-[100]"
                    >
                        <div className="max-h-64 overflow-y-auto custom-scrollbar p-2" data-lenis-prevent>
                            {options.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => {
                                        onChange(option.value);
                                        setIsOpen(false);
                                    }}
                                    className={cn(
                                        "w-full flex items-center justify-between px-6 py-4 rounded-xl transition-all duration-300 group/item",
                                        value === option.value
                                            ? "bg-luxury-gold/10 text-luxury-gold"
                                            : "text-white/40 hover:text-white hover:bg-white/5"
                                    )}
                                >
                                    <div className="flex items-center gap-4">
                                        {option.icon && (
                                            <div className={cn(
                                                "transition-colors",
                                                value === option.value ? "text-luxury-gold" : "text-white/20 group-hover/item:text-luxury-gold"
                                            )}>
                                                {option.icon}
                                            </div>
                                        )}
                                        <span className="font-plus font-bold text-sm tracking-wide uppercase">
                                            {option.label}
                                        </span>
                                    </div>
                                    {value === option.value && (
                                        <Check size={16} className="text-luxury-gold" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
