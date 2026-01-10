import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import {
    Users,
    MousePointer2,
    Globe,
    Sparkles,
    Lock,
    Zap,
    ArrowUpRight,
    BarChart3,
    Activity,
    Loader2
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
    useTitle("Intelligence Matrix");
    const { data, isLoading } = useDashboard();

    const metrics = useMemo(() => {
        if (!data?.analytics) return [];

        const totalViews = data.analytics.profileViews.length;
        const totalClicks = data.analytics.linkClicks.length;
        const clickThroughRate = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : "0";

        // Calculate unique visitors
        const uniqueIdentities = new Set(data.analytics.profileViews.map((v: any) => v.viewer_ip || v.id)).size;

        return [
            { label: "Total Projections", value: totalViews.toLocaleString(), delta: "+100%", icon: Globe, color: "text-blue-400" },
            { label: "Unique Identities", value: uniqueIdentities.toLocaleString(), delta: "Live", icon: Users, color: "text-purple-400" },
            { label: "Neural Clicks", value: totalClicks.toLocaleString(), delta: "Live", icon: MousePointer2, color: "text-luxury-gold" },
            { label: "Sync Rate", value: `${clickThroughRate}%`, delta: "Optimal", icon: Activity, color: "text-emerald-400" },
        ];
    }, [data?.analytics]);

    // Realtime Simulation State
    const [realtimeData, setRealtimeData] = useState<any[]>([]);

    useEffect(() => {
        // Generate initial data
        const initialData = Array.from({ length: 24 }).map((_, i) => ({
            time: `${i}:00`,
            velocity: Math.floor(Math.random() * 40) + 20,
            intensity: Math.floor(Math.random() * 60) + 10
        }));
        setRealtimeData(initialData);

        const interval = setInterval(() => {
            setRealtimeData(prev => {
                const newData = [...prev.slice(1)];
                const lastTime = prev[prev.length - 1].time;
                const [hours] = lastTime.split(':').map(Number);
                const nextHour = (hours + 1) % 24;

                newData.push({
                    time: `${nextHour}:00`,
                    velocity: Math.floor(Math.random() * 40) + 20,
                    intensity: Math.floor(Math.random() * 60) + 10
                });
                return newData;
            });
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    if (isLoading) {
        return (
            <div className="h-[80vh] flex flex-col items-center justify-center gap-6">
                <Loader2 className="animate-spin text-luxury-gold" size={48} />
                <p className="text-white/20 font-syncopate uppercase tracking-[0.5em] text-[10px]">Decrypting Intelligence...</p>
            </div>
        );
    }

    return (
        <div className="space-y-16 py-8">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 pb-12 border-b border-white/5 relative">
                <div className="absolute top-0 left-0 w-96 h-96 bg-luxury-gold/5 blur-[120px] -ml-48 -mt-48 pointer-events-none" />

                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <Sparkles className="text-luxury-gold w-5 h-5 opacity-50" />
                        <span className="text-[10px] font-syncopate uppercase tracking-[0.4em] text-luxury-gold opacity-60">Intelligence Hub</span>
                    </div>
                    <h1 className="text-6xl font-syncopate font-bold uppercase tracking-tighter leading-none">Insights<span className="text-luxury-gold">.</span></h1>
                    <p className="text-white/30 font-plus text-xl mt-6 max-w-2xl leading-relaxed">
                        Processing high-fidelity telemetry from your digital estate in real-time.
                    </p>
                </div>

                <div className="flex gap-4">
                    <div className="px-6 py-4 bg-white/[0.02] border border-white/5 rounded-[2rem] flex items-center gap-4 group hover:border-luxury-gold/30 ">
                        <div className="w-10 h-10 bg-luxury-gold/10 rounded-xl flex items-center justify-center text-luxury-gold">
                            <Lock size={18} />
                        </div>
                        <div className="text-left">
                            <div className="text-[8px] font-syncopate text-white/20 uppercase tracking-widest">Data Stream</div>
                            <div className="text-xs font-syncopate font-bold text-white uppercase tracking-tight">Authenticated</div>
                        </div>
                    </div>
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2">
                    <Card className="p-10 border-white/5 bg-white/[0.01] hover:bg-white/[0.03]  h-full">
                        <div className="flex justify-between items-center mb-10">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-white/40">
                                    <Activity size={20} />
                                </div>
                                <h3 className="text-lg font-syncopate font-bold uppercase tracking-tight text-white">Engagement Velocity</h3>
                            </div>
                            <Button variant="ghost" size="sm" className="text-[10px] font-syncopate tracking-widest uppercase">Deep Audit <ArrowUpRight size={14} className="ml-2" /></Button>
                        </div>
                        <div className="aspect-[2/1] bg-white/[0.01] rounded-[2rem] border border-white/5 overflow-hidden p-6">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={realtimeData}>
                                    <defs>
                                        <linearGradient id="velocityGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                                    <XAxis
                                        dataKey="time"
                                        stroke="rgba(255,255,255,0.1)"
                                        fontSize={10}
                                        tickLine={false}
                                        axisLine={false}
                                        fontFamily="Syncopate"
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
                                            border: '1px solid rgba(212,175,55,0.2)',
                                            borderRadius: '1rem',
                                            fontSize: '10px',
                                            fontFamily: 'Syncopate'
                                        }}
                                        itemStyle={{ color: '#D4AF37' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="velocity"
                                        stroke="#D4AF37"
                                        strokeWidth={2}
                                        fillOpacity={1}
                                        fill="url(#velocityGradient)"
                                        animationDuration={1500}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </div>

                <div className="space-y-8">
                    <Card className="p-8 border-white/5 bg-white/[0.01] flex flex-col justify-center text-center py-16 group">
                        <div className="w-16 h-16 bg-luxury-gold/10 rounded-[2rem] flex items-center justify-center text-luxury-gold mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
                            <BarChart3 size={32} strokeWidth={1} />
                        </div>
                        <h4 className="text-lg font-syncopate font-bold uppercase tracking-widest text-white mb-2">Neural Engine</h4>
                        <p className="text-xs text-white/20 font-plus leading-relaxed uppercase tracking-widest">Synthesizing behavioral patterns from {data?.analytics?.profileViews.length || 0} unique vectors.</p>
                    </Card>

                    <Card className="p-8 border-luxury-gold/10 bg-luxury-gold/[0.01] hover:bg-luxury-gold/[0.03] transition-colors duration-700">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-xl bg-luxury-gold/10 flex items-center justify-center text-luxury-gold shrink-0">
                                <Zap size={20} />
                            </div>
                            <div>
                                <h4 className="text-sm font-syncopate font-bold uppercase tracking-widest text-white mb-2">Matrix Status</h4>
                                <p className="text-xs text-white/40 font-plus leading-relaxed">
                                    Operational efficiency is currently <span className="text-emerald-500">Peak</span>. All nodes are reporting clear engagement flows.
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Insights;
