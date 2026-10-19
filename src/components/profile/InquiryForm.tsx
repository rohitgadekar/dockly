import { useState } from 'react';
import { motion } from 'framer-motion';
import { LuxeSelect } from '@/components/ui/LuxeSelect';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Briefcase, DollarSign, Loader2, ArrowUpRight } from 'lucide-react';

interface InquiryFormProps {
    profileId: string;
    theme: any;
    isLight: boolean;
    textPrimary: string;
    cardBorder: string;
}

const inquiryTypeOptions = [
    { value: 'brand_deal', label: 'Brand Deal', icon: <Briefcase size={18} /> },
    { value: 'collaboration', label: 'Collaboration', icon: <Briefcase size={18} /> },
    { value: 'promotion', label: 'Promotion', icon: <DollarSign size={18} /> },
    { value: 'other', label: 'Other', icon: <Briefcase size={18} /> }
];



export const InquiryForm = ({ profileId, theme, isLight, textPrimary, cardBorder }: InquiryFormProps) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        sender_name: '',
        sender_email: '',
        contact_number: '',
        company_name: '',
        inquiry_type: 'brand_deal',
        message: '',
        budget_range: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.sender_name || !formData.sender_email || !formData.message) {
            toast.error('Please fill in all required fields');
            return;
        }

        setIsSubmitting(true);
        try {
            const budgetValue = formData.budget_range || null;

            const { error } = await supabase.from('inquiries').insert({
                profile_id: profileId,
                sender_name: formData.sender_name,
                sender_email: formData.sender_email,
                contact_number: formData.contact_number || null,
                company_name: formData.company_name || null,
                inquiry_type: formData.inquiry_type,
                message: formData.message,
                budget_range: budgetValue
            });

            if (error) throw error;

            toast.success('Inquiry sent successfully! You\'ll hear back soon.');
            setFormData({
                sender_name: '',
                sender_email: '',
                contact_number: '',
                company_name: '',
                inquiry_type: 'brand_deal',
                message: '',
                budget_range: ''
            });
        } catch (error) {
            console.error('Error sending inquiry:', error);
            toast.error('Failed to send inquiry. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <motion.div
            className="w-full max-w-4xl relative"
        >
            {/* Architectural Glow */}
            <div
                className="absolute -inset-2 blur-3xl opacity-30"
                style={{
                    background: `linear-gradient(to right, ${theme.primary}0D, ${isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)'}, ${theme.primary}0D)`
                }}
            />

            <div
                className="relative backdrop-blur-2xl border rounded-[2.5rem] p-8 md:p-12 overflow-hidden group transition-colors duration-500"
                style={{
                    backgroundColor: isLight ? 'rgba(255,255,255,0.6)' : 'rgba(5,5,5,0.6)',
                    borderColor: cardBorder
                }}
            >
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity duration-1000 transform rotate-12">
                    <Briefcase size={120} strokeWidth={0.5} style={{ color: textPrimary }} />
                </div>
                <div
                    className="absolute bottom-0 left-0 w-32 h-32 blur-3xl rounded-full pointer-events-none"
                    style={{ backgroundColor: `${theme.primary}0D` }}
                />

                <div className="flex flex-col md:flex-row gap-12 relative z-10 w-full">
                    {/* Text Content */}
                    <div className="flex-1 space-y-6 text-center md:text-left md:max-w-[300px]">
                        <div>
                            <div className="flex items-center justify-center md:justify-start gap-2 mb-3 opacity-60">
                                <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: theme.primary }} />
                                <span className="text-[9px] font-syncopate uppercase tracking-widest" style={{ color: theme.primary }}>
                                    Message
                                </span>
                            </div>
                            <h3 className="text-3xl md:text-4xl font-bold uppercase tracking-tight leading-none mb-4" style={{ color: textPrimary, fontFamily: theme.font }}>
                                Let's <br className="hidden md:block" /> Connect
                            </h3>
                        </div>
                        <p className="text-base font-light leading-relaxed opacity-50" style={{ color: textPrimary }}>
                            Have a project in mind, an opportunity, or a question? Send a message and I'll get back to you soon.
                        </p>

                        <div className="hidden md:flex flex-col gap-4 pt-8">
                            <div className="flex items-center gap-3 opacity-40">
                                <Briefcase size={16} />
                                <span className="text-[10px] uppercase tracking-widest font-syncopate">Quick Response</span>
                            </div>
                            <div className="flex items-center gap-3 opacity-40">
                                <ArrowUpRight size={16} />
                                <span className="text-[10px] uppercase tracking-widest font-syncopate">Direct Contact</span>
                            </div>
                        </div>
                    </div>

                    {/* Form Interaction Zone */}
                    <div className="flex-[1.5] w-full">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <input
                                        type="text"
                                        required
                                        value={formData.sender_name}
                                        onChange={(e) => setFormData({ ...formData, sender_name: e.target.value })}
                                        placeholder="Your Name"
                                        className="w-full border rounded-2xl px-6 py-4 text-sm focus:outline-none transition-all font-syncopate tracking-wider placeholder:opacity-30"
                                        style={{
                                            backgroundColor: isLight ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.03)',
                                            borderColor: cardBorder,
                                            color: textPrimary,
                                            fontFamily: theme.font
                                        }}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <input
                                        type="email"
                                        required
                                        value={formData.sender_email}
                                        onChange={(e) => setFormData({ ...formData, sender_email: e.target.value })}
                                        placeholder="Your Email"
                                        className="w-full border rounded-2xl px-6 py-4 text-sm focus:outline-none transition-all font-syncopate tracking-wider placeholder:opacity-30"
                                        style={{
                                            backgroundColor: isLight ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.03)',
                                            borderColor: cardBorder,
                                            color: textPrimary,
                                            fontFamily: theme.font
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <input
                                        type="text"
                                        value={formData.company_name}
                                        onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                                        placeholder="Company Name"
                                        className="w-full border rounded-2xl px-6 py-4 text-sm focus:outline-none transition-all font-syncopate tracking-wider placeholder:opacity-30"
                                        style={{
                                            backgroundColor: isLight ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.03)',
                                            borderColor: cardBorder,
                                            color: textPrimary,
                                            fontFamily: theme.font
                                        }}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <input
                                        type="tel"
                                        value={formData.contact_number}
                                        onChange={(e) => setFormData({ ...formData, contact_number: e.target.value })}
                                        placeholder="Contact Number"
                                        className="w-full border rounded-2xl px-6 py-4 text-sm focus:outline-none transition-all font-syncopate tracking-wider placeholder:opacity-30"
                                        style={{
                                            backgroundColor: isLight ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.03)',
                                            borderColor: cardBorder,
                                            color: textPrimary,
                                            fontFamily: theme.font
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="relative">
                                    <LuxeSelect
                                        options={inquiryTypeOptions}
                                        value={formData.inquiry_type}
                                        onChange={(value) => setFormData({ ...formData, inquiry_type: value })}
                                        placeholder="Inquiry Type"
                                        style={{
                                            backgroundColor: isLight ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.03)',
                                            borderColor: cardBorder,
                                            color: textPrimary,
                                            fontFamily: theme.font
                                        }}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <input
                                        type="text"
                                        value={formData.budget_range}
                                        onChange={(e) => setFormData({ ...formData, budget_range: e.target.value })}
                                        placeholder="Budget Range (Optional)"
                                        className="w-full border rounded-2xl px-6 py-4 text-sm focus:outline-none transition-all font-syncopate tracking-wider placeholder:opacity-30"
                                        style={{
                                            backgroundColor: isLight ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.03)',
                                            borderColor: cardBorder,
                                            color: textPrimary,
                                            fontFamily: theme.font
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <textarea
                                    required
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    rows={4}
                                    placeholder="Tell me about your vision..."
                                    className="w-full border rounded-2xl px-6 py-4 text-sm focus:outline-none transition-all font-syncopate tracking-wider placeholder:opacity-30 resize-none"
                                    style={{
                                        backgroundColor: isLight ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.03)',
                                        borderColor: cardBorder,
                                        color: textPrimary,
                                        fontFamily: theme.font
                                    }}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <p className="text-[10px] font-syncopate tracking-widest opacity-30 uppercase hidden sm:block">
                                    Secure Transmission
                                </p>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full sm:w-auto px-10 h-14 rounded-2xl flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed group/btn"
                                    style={{
                                        backgroundColor: isLight ? '#000000' : '#FFFFFF',
                                        color: isLight ? '#FFFFFF' : '#000000'
                                    }}
                                >
                                    <span className="text-[10px] font-syncopate font-bold uppercase tracking-widest">
                                        {isSubmitting ? 'Sending...' : 'Send Inquiry'}
                                    </span>
                                    {isSubmitting ? (
                                        <Loader2 size={18} className="animate-spin" />
                                    ) : (
                                        <ArrowUpRight size={20} className="group-hover/btn:rotate-45 transition-transform duration-300" />
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
