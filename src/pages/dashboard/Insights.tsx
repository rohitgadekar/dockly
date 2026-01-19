import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import {
    Users,
    MousePointer2,
    Globe,
    Sparkles,
    Lock,
    Zap,
    Activity,
    Loader2,
    ShoppingBag,
    ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useDashboard } from "@/hooks/useDashboard";
import { useMemo, useState, useEffect } from "react";
import { useTitle } from "@/hooks/useTitle";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

const Insights = () => {
    useTitle("Analytics");
    const { data, isLoading } = useDashboard();

    const metrics = useMemo(() => {
        if (!data?.analytics) return [];

        const totalViews = data.analytics.profileViews.length;
        const totalClicks = data.analytics.linkClicks.length;
        const clickThroughRate = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : "0";

        // Calculate unique visitors
        const uniqueIdentities = new Set(data.analytics.profileViews.map((v: any) => v.viewer_ip || v.id)).size;

        return [
            { label: "Profile Views", value: totalViews.toLocaleString(), delta: "+100%", icon: Globe, color: "text-blue-400" },
            { label: "Unique Visitors", value: uniqueIdentities.toLocaleString(), delta: "Live", icon: Users, color: "text-purple-400" },
            { label: "Total Clicks", value: totalClicks.toLocaleString(), delta: "Live", icon: MousePointer2, color: "text-luxury-gold" },
            { label: "Click Rate", value: `${clickThroughRate}%`, delta: "Optimal", icon: Activity, color: "text-emerald-400" },
        ];
    }, [data?.analytics]);

    const linkIntelligence = useMemo(() => {
        if (!data) return [];

        const clickCounts: Record<string, number> = {};
        data.analytics.linkClicks.forEach((click: any) => {
            clickCounts[click.link_id] = (clickCounts[click.link_id] || 0) + 1;
        });

        const isValid = (url: string | null | undefined) => {
            if (!url) return false;
            const normalized = url.toLowerCase().trim();
            return normalized !== "" && normalized !== "about:blank" && normalized !== "null";
        };

        const socials = (data.socials || []).filter((s: any) => isValid(s.url)).map((s: any) => ({
            id: s.id,
            title: s.platform,
            type: "Social",
            url: s.url,
            clicks: clickCounts[s.id] || 0,
            icon: Globe
        }));

        const ventures = (data.ventures || []).filter((v: any) => isValid(v.url)).map((v: any) => ({
            id: v.id,
            title: v.title,
            type: "Project",
            url: v.url,
            clicks: clickCounts[v.id] || 0,
            icon: Zap
        }));

        const products = (data.products || []).filter((p: any) => isValid(p.url)).map((p: any) => ({
            id: p.id,
            title: p.title,
            type: "Product",
            url: p.url,
            clicks: clickCounts[p.id] || 0,
            icon: ShoppingBag
        }));

        const groups = [
            { id: 'socials', label: 'Socials', items: socials },
            { id: 'ventures', label: 'Projects', items: ventures },
            { id: 'products', label: 'Store Items', items: products }
        ].filter(g => g.items.length > 0);

        return groups;
    }, [data]);

    const maxClicks = useMemo(() => {
        if (!linkIntelligence.length) return 1;
        return Math.max(...linkIntelligence.flatMap(g => g.items.map(i => i.clicks))) || 1;
    }, [linkIntelligence]);

    const isNewUser =
        (data?.analytics?.profileViews?.length || 0) === 0 &&
        (data?.ventures?.length || 0) === 0 &&
        (data?.products?.length || 0) === 0 &&
        (data?.socials?.length || 0) === 0;

    const overallEngagement = useMemo(() => {
        if (!data?.analytics) return [];

        const totalViews = data.analytics.profileViews.length;

        const clicksByCategory = {
            social: 0,
            venture: 0,
            product: 0
        };

        data.analytics.linkClicks.forEach((click: any) => {
            if (clicksByCategory.hasOwnProperty(click.link_type)) {
                clicksByCategory[click.link_type as keyof typeof clicksByCategory]++;
            }
        });

        return [
            { name: "Views", value: totalViews, color: "#3b82f6", displayLabel: "Profile Views" },
            { name: "Socials", value: clicksByCategory.social, color: "#a855f7", displayLabel: "Social Clicks" },
            { name: "Projects", value: clicksByCategory.venture, color: "#10b981", displayLabel: "Project Clicks" },
            { name: "Store", value: clicksByCategory.product, color: "#D4AF37", displayLabel: "Store Clicks" }
        ];
    }, [data]);

    if (isLoading) {
        return (
            <div className="h-[70vh] flex flex-col items-center justify-center gap-6">
                <Loader2 className="animate-spin text-luxury-gold" size={48} />
                <p className="text-white/20 font-syncopate uppercase tracking-[0.5em] text-[10px]">Loading Analytics...</p>
            </div>
        );
    }

    return (
        <div className="space-y-16 py-8">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 pb-12 border-b border-white/5 relative">
                <div className="absolute top-0 left-0 w-96 h-96 bg-luxury-gold/5 blur-[120px] -ml-48 -mt-48 pointer-events-none" />

                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <Activity className="text-luxury-gold w-5 h-5 opacity-50" />
                        <span className="text-[10px] font-syncopate uppercase tracking-[0.4em] text-luxury-gold opacity-60">Analytics</span>
                    </div>
                    <h1 className="text-6xl font-syncopate font-bold uppercase tracking-tighter leading-none">Analytics</h1>
                    <p className="text-white/30 font-plus text-xl mt-6 max-w-2xl leading-relaxed">
                        Performance metrics and traffic analysis.
                    </p>
                </div>
                <div className="flex items-center gap-3 px-6 py-3 bg-luxury-gold/5 rounded-full border border-luxury-gold/10">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]" />
                    <span className="text-[10px] font-syncopate uppercase tracking-[0.3em] text-luxury-gold">Status: Live</span>
                </div>
            </header>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {metrics.map((metric, idx) => (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        key={metric.label}
                    >
                        <Card className="group hover:border-luxury-gold/30  bg-white/[0.01] hover:bg-white/[0.03] p-8 border-white/5">
                            <div className="flex justify-between items-start mb-8">
                                <div className={`w-14 h-14 bg-white/[0.03] rounded-[2rem] flex items-center justify-center ${metric.color} group-hover:scale-110 transition-transform duration-500`}>
                                    <metric.icon size={24} strokeWidth={1.5} />
                                </div>
                                <div className="text-[10px] font-syncopate text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                                    {metric.delta}
                                </div>
                            </div>
                            <div className="text-4xl font-syncopate font-bold mb-2 tracking-tighter text-white">{metric.value}</div>
                            <div className="text-[10px] font-syncopate uppercase tracking-[0.3em] text-white/20 group-hover:text-white/40 transition-colors">{metric.label}</div>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Categorical Engagement Distribution */}
            <Card className="p-10 border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all duration-700">
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <h2 className="text-2xl font-syncopate font-bold text-white mb-2 uppercase tracking-tight">Engagement Overview</h2>
                        <p className="text-white/40 font-plus text-sm">Traffic breakdown by category</p>
                    </div>
                    <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-syncopate uppercase tracking-widest text-white/40">
                        Live Data
                    </div>
                </div>

                <div className="h-[400px] w-full bg-white/[0.01] rounded-[2.5rem] border border-white/5 overflow-hidden p-8 pt-12">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={overallEngagement} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                            <defs>
                                <linearGradient id="engagementGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={false} />
                            <XAxis
                                dataKey="name"
                                stroke="rgba(255,255,255,0.1)"
                                fontSize={10}
                                tickLine={false}
                                axisLine={false}
                                fontFamily="Syncopate"
                                dy={15}
                            />
                            <YAxis
                                stroke="rgba(255,255,255,0.1)"
                                fontSize={10}
                                tickLine={false}
                                axisLine={false}
                                fontFamily="Syncopate"
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#050505',
                                    border: '1px solid rgba(255,255,255,0.05)',
                                    borderRadius: '1.5rem',
                                    fontSize: '10px',
                                    fontFamily: 'Syncopate',
                                    padding: '1.5rem'
                                }}
                                formatter={(value: any, name: any, props: any) => [value, props.payload.displayLabel]}
                                labelStyle={{ display: 'none' }}
                            />
                            <Area
                                type="monotone"
                                dataKey="value"
                                stroke="#D4AF37"
                                strokeWidth={3}
                                fill="url(#engagementGradient)"
                                fillOpacity={1}
                                isAnimationActive={false}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </Card>
            {/* Node Performance Intelligence */}
            <div className="pt-16 border-t border-white/5">
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <h2 className="text-2xl font-syncopate font-bold text-white mb-2 uppercase tracking-tight">Link Performance</h2>
                        <p className="text-white/40 font-plus text-sm">Performance metrics for individual links</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-syncopate uppercase tracking-widest text-emerald-500">Real-time Tracking Active</span>
                    </div>
                </div>

                <div className="space-y-24">
                    {linkIntelligence.map((group, groupIdx) => (
                        <div key={group.id} className="space-y-12">
                            <div className="flex items-center gap-6">
                                <h3 className="text-xl font-syncopate font-bold uppercase tracking-[0.3em] text-white/40 whitespace-nowrap">{group.label}</h3>
                                <div className="h-[1px] w-full bg-white/5" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                {group.items.map((link, idx) => (
                                    <motion.div
                                        key={link.id}
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: (groupIdx * 0.2) + (idx * 0.1), duration: 0.8 }}
                                    >
                                        <div className="group relative overflow-hidden rounded-[2.5rem] border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all duration-700 p-10 hover:border-luxury-gold/20">
                                            {/* Hover Glow */}
                                            <div className="absolute top-0 right-0 w-64 h-64 bg-luxury-gold/5 blur-[80px] -mr-32 -mt-32 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

                                            <div className="relative z-10">
                                                <div className="flex justify-between items-start mb-12">
                                                    <div className="flex items-center gap-6">
                                                        <div className="w-16 h-16 bg-white/5 rounded-[1.5rem] flex items-center justify-center text-white/40 group-hover:text-luxury-gold transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 border border-white/5">
                                                            <link.icon size={28} strokeWidth={1} />
                                                        </div>
                                                        <div>
                                                            <div className="text-[9px] font-syncopate text-luxury-gold uppercase tracking-[0.3em] mb-2">{link.type}</div>
                                                            <h4 className="text-2xl font-syncopate font-bold text-white uppercase tracking-tighter leading-none">{link.title}</h4>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <motion.div
                                                            className="text-5xl font-syncopate font-bold text-white mb-1 tracking-tighter"
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                        >
                                                            {link.clicks}
                                                        </motion.div>
                                                        <div className="text-[9px] font-syncopate text-white/20 uppercase tracking-[0.3em]">Activations</div>
                                                    </div>
                                                </div>

                                                <div className="space-y-6">
                                                    {/* Performance Bar Architecture */}
                                                    <div className="relative pt-2">
                                                        <div className="flex justify-between mb-3">
                                                            <span className="text-[8px] font-syncopate text-white/30 uppercase tracking-widest">Engagement Strength</span>
                                                            <span className="text-[8px] font-syncopate text-luxury-gold uppercase tracking-widest">
                                                                {Math.round((link.clicks / maxClicks) * 100)}%
                                                            </span>
                                                        </div>
                                                        <div className="h-[2px] w-full bg-white/5 rounded-full overflow-hidden">
                                                            <motion.div
                                                                initial={{ width: 0 }}
                                                                animate={{ width: `${(link.clicks / maxClicks) * 100}%` }}
                                                                transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                                                                className="h-full bg-gradient-to-r from-luxury-gold/40 via-luxury-gold to-luxury-gold/40 shadow-[0_0_15px_rgba(212,175,55,0.4)]"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="flex justify-between items-center pt-8 border-t border-white/5">
                                                        <div className="flex items-center gap-3 opacity-30 group-hover:opacity-100 transition-opacity">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                            <span className="text-[9px] font-syncopate text-white uppercase tracking-widest line-clamp-1 max-w-[200px]">Node Verified</span>
                                                        </div>

                                                        <div
                                                            className="text-[9px] font-syncopate text-luxury-gold/40 uppercase tracking-[0.2em] group-hover:text-luxury-gold transition-colors"
                                                        >
                                                            Data Node Active
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {linkIntelligence.length === 0 && (
                    <div className="py-32 border border-dashed border-white/5 rounded-[4rem] flex flex-col items-center justify-center bg-white/[0.01]">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-20 border border-dashed border-white/10 rounded-[2rem]"
                        >
                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Activity className="text-white/20" size={32} />
                            </div>
                            <h3 className="text-xl font-syncopate font-bold text-white mb-2">No Data Available</h3>
                            <p className="text-white/40 font-plus max-w-sm mx-auto">
                                Share links to start tracking performance.
                            </p>
                        </motion.div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Insights;
