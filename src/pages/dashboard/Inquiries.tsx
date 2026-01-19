import { useState, useMemo } from 'react';
import { useDashboard } from '@/hooks/useDashboard';
import { supabase } from '@/lib/supabase';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Briefcase, Mail, DollarSign, Clock,
    Check, Trash2, EyeOff, Search,
    ArrowUpRight, MessageSquare
} from 'lucide-react';
import { toast } from 'sonner';
import { useTitle } from '@/hooks/useTitle';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

interface Inquiry {
    id: string;
    sender_name: string;
    sender_email: string;
    contact_number: string | null;
    company_name: string | null;
    inquiry_type: string;
    message: string;
    budget_range: string | null;
    status: 'pending' | 'reviewed' | 'archived';
    created_at: string;
}

const Inquiries = () => {
    useTitle('Brand Inquiries | Dashboard');
    const { data } = useDashboard();
    const user = data?.profile;
    const queryClient = useQueryClient();

    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [filter, setFilter] = useState<'all' | 'pending' | 'reviewed' | 'archived'>('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Fetch inquiries
    const { data: inquiries = [], isLoading } = useQuery({
        queryKey: ['inquiries', user?.id],
        queryFn: async () => {
            if (!user) return [];
            const { data, error } = await supabase
                .from('inquiries')
                .select('*')
                .eq('profile_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data as Inquiry[];
        },
        enabled: !!user
    });

    const selectedInquiry = useMemo(() =>
        inquiries.find(i => i.id === selectedId) || null
        , [inquiries, selectedId]);

    // Update inquiry status
    const updateStatusMutation = useMutation({
        mutationFn: async ({ id, status }: { id: string; status: string }) => {
            const { error } = await supabase
                .from('inquiries')
                .update({ status })
                .eq('id', id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['inquiries'] });
            toast.success('Status updated successfully');
        },
        onError: () => {
            toast.error('Failed to update status');
        }
    });

    // Delete inquiry
    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase
                .from('inquiries')
                .delete()
                .eq('id', id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['inquiries'] });
            toast.success('Inquiry deleted successfully');
            setSelectedId(null);
        },
        onError: () => {
            toast.error('Failed to delete inquiry');
        }
    });

    const filteredInquiries = inquiries.filter(inquiry => {
        const matchesFilter = filter === 'all' ? true : inquiry.status === filter;
        const matchesSearch =
            inquiry.sender_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            inquiry.sender_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (inquiry.company_name?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
        return matchesFilter && matchesSearch;
    });

    const getInquiryTypeIcon = (type: string) => {
        switch (type) {
            case 'brand_deal': return <Briefcase size={16} />;
            case 'collaboration': return <MessageSquare size={16} />;
            case 'promotion': return <DollarSign size={16} />;
            default: return <Mail size={16} />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'text-luxury-gold';
            case 'reviewed': return 'text-emerald-500';
            case 'archived': return 'text-white/30';
            default: return 'text-white/40';
        }
    };

    if (isLoading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="w-12 h-12 border-2 border-luxury-gold/20 border-t-luxury-gold rounded-full animate-spin mx-auto" />
                    <p className="text-white/20 font-syncopate text-[10px] uppercase tracking-widest">Compiling Transmission...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-[calc(100vh-100px)] flex flex-col p-0 space-y-6">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-syncopate font-bold uppercase tracking-tighter">
                        Communications
                    </h1>
                    <p className="text-white/40 font-plus text-[10px] uppercase tracking-[0.2em] mt-2">
                        Nexus of strategic brand inquiries and collaborations
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    {['all', 'pending', 'reviewed', 'archived'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f as any)}
                            className={cn(
                                "px-4 py-2 rounded-xl text-[10px] font-syncopate uppercase tracking-widest transition-all duration-300 border",
                                filter === f
                                    ? "bg-luxury-gold/10 border-luxury-gold/40 text-luxury-gold"
                                    : "bg-white/[0.02] border-white/5 text-white/40 hover:border-white/20"
                            )}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content: Email Layout */}
            <div className="flex-1 flex gap-4 min-h-0 min-w-0">
                {/* Left Panel: List */}
                <div className="w-full md:w-[320px] lg:w-[380px] flex flex-col  gap-4 min-h-0 flex-shrink-0">
                    <div className="relative pr-2">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                        <input
                            type="text"
                            placeholder="SEARCH SENDER OR BRAND..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white/[0.02] border border-white/5 rounded-[1rem] py-4 pl-12 pr-4 text-[10px] font-syncopate tracking-widest uppercase focus:outline-none focus:border-luxury-gold/30 transition-all"
                        />
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3" data-lenis-prevent>
                        <AnimatePresence mode="popLayout">
                            {filteredInquiries.map((inquiry) => (
                                <motion.div
                                    key={inquiry.id}
                                    layout
                                    onClick={() => setSelectedId(inquiry.id)}
                                    className={cn(
                                        "p-5 rounded-[1rem] border  cursor-pointer group relative overflow-hidden",
                                        selectedId === inquiry.id
                                            ? "bg-luxury-gold/[0.05] border-luxury-gold/40"
                                            : "bg-white/[0.02] border-white/5 hover:border-white/20"
                                    )}
                                >
                                    {/* Selection Glow */}
                                    {selectedId === inquiry.id && (
                                        <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-1.5 h-12 bg-luxury-gold rounded-full shadow-[0_0_15px_rgba(212,175,55,0.5)]" />
                                    )}

                                    <div className="space-y-3">
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center gap-3">
                                                <div className={cn(
                                                    "w-8 h-8 rounded-xl flex items-center justify-center border",
                                                    selectedId === inquiry.id ? "bg-luxury-gold/20 border-luxury-gold/20" : "bg-white/5 border-white/10"
                                                )}>
                                                    {getInquiryTypeIcon(inquiry.inquiry_type)}
                                                </div>
                                                <div>
                                                    <h3 className="text-xs font-syncopate font-bold uppercase tracking-tight text-white/90">
                                                        {inquiry.sender_name}
                                                    </h3>
                                                    <p className="text-[9px] font-plus text-white/40 truncate max-w-[180px]">
                                                        {inquiry.company_name || inquiry.sender_email}
                                                    </p>
                                                </div>
                                            </div>
                                            <span className="text-[8px] font-syncopate text-white/20 whitespace-nowrap">
                                                {formatDistanceToNow(new Date(inquiry.created_at), { addSuffix: false })}
                                            </span>
                                        </div>

                                        <p className="text-[11px] font-plus text-white/50 line-clamp-2 leading-relaxed">
                                            {inquiry.message}
                                        </p>

                                        <div className="flex items-center justify-between pt-3 border-t border-white/[0.03]">
                                            <span className={cn("text-[9px] font-syncopate uppercase tracking-[0.2em]", getStatusColor(inquiry.status))}>
                                                {inquiry.status}
                                            </span>
                                            {inquiry.budget_range && (
                                                <div className="flex items-center gap-1.5 text-luxury-gold/60">
                                                    <DollarSign size={10} />
                                                    <span className="text-[9px] font-syncopate tracking-wider">{inquiry.budget_range}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {filteredInquiries.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-64 text-center">
                                <Mail className="text-white/5 mb-4" size={40} />
                                <p className="text-white/20 font-syncopate text-[9px] uppercase tracking-widest">No transmissions found</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Panel: Detail Area */}
                <div className="flex-1 flex flex-col min-h-0 bg-white/[0.01] border border-white/5 rounded-[1rem] overflow-hidden relative group/detail">
                    <AnimatePresence mode="wait">
                        {selectedInquiry ? (
                            <motion.div
                                key={selectedInquiry.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="flex flex-col h-full"
                            >
                                {/* Detail Header */}
                                <div className="p-6 md:p-10 border-b border-white/5 space-y-8 min-w-0">
                                    <div className="flex items-start justify-between gap-6 flex-wrap">
                                        <div className="flex items-center gap-4 md:gap-6 min-w-0">
                                            <div className="w-16 h-16 md:w-20 md:h-20 rounded-[2rem] md:rounded-[2.5rem] bg-luxury-gold/10 flex items-center justify-center border border-luxury-gold/20 relative flex-shrink-0">
                                                <Briefcase className="text-luxury-gold" size={32} />
                                                <div className="absolute -bottom-1 -right-1 w-5 h-5 md:w-6 md:h-6 rounded-full bg-emerald-500 border-4 border-[#0a0a0a]" />
                                            </div>
                                            <div className="min-w-0">
                                                <h2 className="text-2xl md:text-3xl font-syncopate font-bold uppercase tracking-tighter text-white truncate">
                                                    {selectedInquiry.sender_name}
                                                </h2>
                                                <div className="flex items-center gap-3 mt-2 flex-wrap">
                                                    <a href={`mailto:${selectedInquiry.sender_email}`} className="text-[9px] md:text-[10px] font-syncopate text-luxury-gold uppercase tracking-widest hover:underline flex items-center gap-2 group/email truncate max-w-full">
                                                        <Mail size={12} className="opacity-60 flex-shrink-0" />
                                                        <span className="truncate">{selectedInquiry.sender_email}</span>
                                                        <ArrowUpRight size={10} className="opacity-0 group-hover/email:opacity-100 transition-opacity flex-shrink-0" />
                                                    </a>
                                                    {selectedInquiry.contact_number && (
                                                        <>
                                                            <span className="text-white/20 hidden md:inline">•</span>
                                                            <span className="text-[9px] md:text-[10px] font-syncopate text-white/40 uppercase tracking-widest flex items-center gap-2">
                                                                <MessageSquare size={12} className="opacity-60" />
                                                                {selectedInquiry.contact_number}
                                                            </span>
                                                        </>
                                                    )}
                                                    <span className="text-white/20 hidden md:inline">•</span>
                                                    <span className={cn("text-[9px] md:text-[10px] font-syncopate uppercase tracking-widest", getStatusColor(selectedInquiry.status))}>
                                                        STA: {selectedInquiry.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => deleteMutation.mutate(selectedInquiry.id)}
                                                className="rounded-xl border-red-500/10 text-red-500/40 hover:text-red-500 hover:bg-red-500/10 transition-all h-10 w-10 p-0"
                                            >
                                                <Trash2 size={18} />
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Action Banner */}
                                    <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-5 md:p-6 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
                                        <div className="flex items-center gap-4 md:gap-8 flex-wrap">
                                            <div className="space-y-1">
                                                <span className="text-[7px] md:text-[8px] font-syncopate text-white/30 uppercase tracking-[0.2em]">TYPE</span>
                                                <p className="text-[10px] md:text-[11px] font-syncopate font-bold uppercase text-white/80">{selectedInquiry.inquiry_type.replace('_', ' ')}</p>
                                            </div>
                                            {selectedInquiry.company_name && (
                                                <div className="space-y-1">
                                                    <span className="text-[7px] md:text-[8px] font-syncopate text-white/30 uppercase tracking-[0.2em]">BRAND</span>
                                                    <p className="text-[10px] md:text-[11px] font-syncopate font-bold uppercase text-white/80 truncate max-w-[150px]">{selectedInquiry.company_name}</p>
                                                </div>
                                            )}
                                            {selectedInquiry.budget_range && (
                                                <div className="space-y-1 text-luxury-gold">
                                                    <span className="text-[7px] md:text-[8px] font-syncopate opacity-50 uppercase tracking-[0.2em]">INVEST</span>
                                                    <p className="text-[10px] md:text-[11px] font-syncopate font-bold uppercase">{selectedInquiry.budget_range}</p>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex gap-2 md:gap-3 flex-wrap">
                                            {selectedInquiry.status === 'pending' && (
                                                <Button
                                                    variant="luxury"
                                                    size="sm"
                                                    onClick={() => updateStatusMutation.mutate({ id: selectedInquiry.id, status: 'reviewed' })}
                                                    className="rounded-xl font-syncopate text-[8px] md:text-[9px] tracking-[0.1em] px-4 md:px-6 h-10"
                                                >
                                                    <Check size={12} className="mr-2" />
                                                    APPROVE
                                                </Button>
                                            )}
                                            {selectedInquiry.status !== 'archived' && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => updateStatusMutation.mutate({ id: selectedInquiry.id, status: 'archived' })}
                                                    className="rounded-xl font-syncopate text-[8px] md:text-[9px] tracking-[0.1em] px-4 md:px-6 h-10"
                                                >
                                                    <EyeOff size={12} className="mr-2" />
                                                    ARCHIVE
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Message Content */}
                                <div className="flex-1 overflow-y-auto p-8 md:p-12 custom-scrollbar" data-lenis-prevent>
                                    <div className="max-w-3xl">
                                        <div className="flex items-center gap-4 mb-8">
                                            <div className="h-px flex-1 bg-white/5" />
                                            <div className="flex items-center gap-2 text-white/20">
                                                <Clock size={12} />
                                                <span className="text-[9px] font-syncopate uppercase tracking-widest">
                                                    Transmission received {new Date(selectedInquiry.created_at).toLocaleString()}
                                                </span>
                                            </div>
                                            <div className="h-px flex-1 bg-white/5" />
                                        </div>

                                        <div className="relative">
                                            {/* Decorative Quote Mark */}
                                            <div className="absolute -left-6 -top-2 text-6xl font-serif text-white/5 select-none">"</div>
                                            <p className="text-lg font-plus text-white/80 leading-[1.8] whitespace-pre-wrap">
                                                {selectedInquiry.message}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-center p-12 space-y-6">
                                <div className="w-32 h-32 rounded-[3rem] bg-white/[0.02] border border-white/5 flex items-center justify-center relative">
                                    <Mail className="text-white/10" size={60} strokeWidth={0.5} />
                                    <div className="absolute inset-0 bg-luxury-gold/5 blur-3xl rounded-full opacity-50" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-syncopate font-bold text-white/20 uppercase tracking-tighter">
                                        Select Transmission
                                    </h3>
                                    <p className="text-white/10 font-plus text-[10px] uppercase tracking-widest mt-2">
                                        Choose an inquiry from the nexus to view details
                                    </p>
                                </div>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default Inquiries;
