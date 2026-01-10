import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";
import { Button } from "./Button";

interface DeleteDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    description?: string;
    isDeleting?: boolean;
}

export const DeleteDialog = ({
    isOpen,
    onClose,
    onConfirm,
    title = "Confirm Deletion",
    description = "This action is irreversible. The data will be permanently expunged from the matrix.",
    isDeleting = false
}: DeleteDialogProps) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
                    />
                    <div className="fixed inset-0 flex items-center justify-center z-[101] pointer-events-none p-4">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="w-full max-w-md bg-[#080808] border border-red-500/20 rounded-[2rem] overflow-hidden pointer-events-auto relative shadow-[0_0_50px_rgba(220,38,38,0.1)]"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />
                            <div className="p-8 space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center border border-red-500/20 text-red-500 shadow-[0_0_15px_rgba(220,38,38,0.2)]">
                                        <AlertTriangle size={24} />
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="text-white/20 hover:text-white transition-colors"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                <div className="space-y-2">
                                    <h3 className="text-2xl font-syncopate font-bold uppercase tracking-tight text-white">
                                        {title}
                                    </h3>
                                    <p className="text-white/40 font-plus text-sm leading-relaxed">
                                        {description}
                                    </p>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <Button
                                        variant="ghost"
                                        onClick={onClose}
                                        className="flex-1 h-12 rounded-xl text-xs font-syncopate uppercase tracking-widest text-white/40 hover:text-white border border-white/5 hover:border-white/10"
                                    >
                                        Abort
                                    </Button>
                                    <Button
                                        variant="luxury"
                                        onClick={onConfirm}
                                        disabled={isDeleting}
                                        className="flex-1 h-12 rounded-xl text-xs font-syncopate uppercase tracking-widest bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 hover:border-red-500/40 shadow-[0_0_20px_rgba(220,38,38,0.1)] hover:shadow-[0_0_30px_rgba(220,38,38,0.2)]"
                                    >
                                        {isDeleting ? "Expunging..." : "Confirm Purge"}
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};
