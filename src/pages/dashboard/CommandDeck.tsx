import { motion } from "framer-motion";
import { useDashboard } from "@/hooks/useDashboard";
import { useTitle } from "@/hooks/useTitle";
import {
    Activity,
    Users,
    Zap,
    ShoppingBag,
    ArrowUpRight,
    Globe,
    MousePointer2,
    TrendingUp
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { useState, useEffect } from "react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell
} from 'recharts';

const CommandDeck = () => {
    useTitle("Command Deck");
    const { data } = useDashboard();

    // Realtime simulation
    const [realtimeData, setRealtimeData] = useState<any[]>([]);
    const [pulseData, setPulseData] = useState<any[]>([]);

    useEffect(() => {
        const initialData = Array.from({ length: 24 }).map((_, i) => ({
            time: `${i}:00`,
            traffic: Math.floor(Math.random() * 50) + 30,
            engagement: Math.floor(Math.random() * 70) + 10
        }));
        setRealtimeData(initialData);

        const initialPulse = Array.from({ length: 12 }).map((_, i) => ({
            name: `P${i}`,
            value: Math.floor(Math.random() * 100)
        }));
        setPulseData(initialPulse);

        const interval = setInterval(() => {
            setRealtimeData(prev => {
                const newData = [...prev.slice(1)];
                const lastTime = prev[prev.length - 1].time;
                const [hours] = lastTime.split(':').map(Number);
                const nextHour = (hours + 1) % 24;
                newData.push({
                    time: `${nextHour}:00`,
                    traffic: Math.floor(Math.random() * 50) + 30,
                    engagement: Math.floor(Math.random() * 70) + 10
                });
                return newData;
            });
            setPulseData(Array.from({ length: 12 }).map((_, i) => ({
                name: `P${i}`,
                value: Math.floor(Math.random() * 100)
            })));
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    const stats = [
        {
            label: "Total Views",
            value: data?.analytics?.profileViews?.length || 0,
            change: "+12.5%",
            icon: Users,
            color: "#D4AF37"
        },
        {
            label: "Active Ventures",
            value: data?.ventures?.length || 0,
            change: "+2",
            icon: Zap,
            color: "#3B82F6"
        },
        {
            label: "Acquisition Targets",
            value: data?.products?.length || 0,
            change: "Stable",
            icon: ShoppingBag,
            color: "#10B981"
        },
        {
            label: "Network Nodes",
            value: data?.socials?.length || 0,
            change: "Optimal",
            icon: Globe,
            color: "#C084FC"
        }
    ];

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="flex-1 space-y-8 p-8">
            {/* Header Section */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-syncopate font-bold uppercase tracking-tighter text-white mb-2">
                        Command Deck
                    </h1>
                    <p className="text-white/40 font-plus italic">
                        Welcome back, <span className="text-white">{data?.profile?.full_name || "Architect"}</span>. Systems operational.
                    </p>
                </div>
                <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-full border border-white/10 backdrop-blur-sm">
                    <div className="relative">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                        <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-20" />
                    </div>
                    <span className="text-[10px] font-syncopate uppercase tracking-widest text-emerald-500">
                        Citadel Protocol Active
                    </span>
                </div>
            </div>

            {/* Stats Grid */}
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
                {stats.map((stat, idx) => (
                    <motion.div key={idx} variants={item}>
                        <Card className="p-6 bg-[#0A0A0A]/80 border-white/5 hover:border-white/10  group relative overflow-hidden">
                            <div
                                className="absolute top-0 right-0 p-24 opacity-5 group-hover:opacity-10 transition-opacity blur-3xl rounded-full translate-x-10 -translate-y-10 pointer-events-none"
                                style={{ backgroundColor: stat.color }}
                            />

                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                                    <stat.icon size={20} style={{ color: stat.color }} />
                                </div>
                                <div className="flex items-center gap-1 text-[10px] bg-white/5 px-2 py-1 rounded-full text-white/40">
                                    <span>{stat.change}</span>
                                    <ArrowUpRight size={10} />
                                </div>
                            </div>

                            <h3 className="text-3xl font-syncopate font-bold text-white mb-1">
                                {stat.value}
                            </h3>
                            <p className="text-[10px] font-syncopate uppercase tracking-widest text-white/40">
                                {stat.label}
                            </p>
                        </Card>
                    </motion.div>
                ))}
            </motion.div>

            {/* Main Content Split */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Neural Activity Graph */}
                <div className="lg:col-span-2">
                    <Card className="p-8 bg-[#0A0A0A]/80 border-white/5 relative overflow-hidden group h-[500px]">
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-luxury-gold/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />

                        <div className="flex justify-between items-center mb-10">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-luxury-gold/10 rounded-lg">
                                    <Activity size={18} className="text-luxury-gold" />
                                </div>
                                <div>
                                    <h2 className="text-sm font-syncopate font-bold uppercase tracking-widest text-white">
                                        Neural Trajectory
                                    </h2>
                                    <p className="text-[9px] font-syncopate text-white/20 uppercase tracking-widest mt-1">Live Telemetry Stram</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                {['1H', '24H', '7D', '30D'].map(range => (
                                    <button
                                        key={range}
                                        className={`px-3 py-1.5 rounded-lg text-[9px] font-syncopate  border ${range === '24H' ? 'bg-luxury-gold/10 border-luxury-gold/20 text-luxury-gold' : 'border-transparent text-white/20 hover:text-white hover:bg-white/5'}`}
                                    >
                                        {range}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="w-full h-[320px] relative z-10">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={realtimeData}>
                                    <defs>
                                        <linearGradient id="deckGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.2} />
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
                                        dataKey="traffic"
                                        stroke="#D4AF37"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#deckGradient)"
                                        animationDuration={1000}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </div>

                {/* Secondary Engagement Column */}
                <div className="space-y-8">
                    <Card className="p-8 bg-[#0A0A0A]/80 border-white/5 group relative overflow-hidden h-[234px]">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-3">
                                <MousePointer2 size={16} className="text-blue-400" />
                                <span className="text-[10px] font-syncopate font-bold uppercase tracking-widest text-white/60">Pulse Stream</span>
                            </div>
                            <span className="text-[10px] font-mono text-blue-400">LIVE</span>
                        </div>
                        <div className="h-24 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={pulseData}>
                                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                        {pulseData.map((_entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={index % 2 === 0 ? '#3B82F6' : '#2563EB'}
                                                fillOpacity={0.4 + (index * 0.05)}
                                            />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-4 flex justify-between items-end">
                            <div>
                                <div className="text-2xl font-syncopate font-bold text-white">89.4%</div>
                                <div className="text-[8px] font-syncopate text-white/20 uppercase tracking-widest">Network Saturation</div>
                            </div>
                            <div className="text-emerald-500 text-[10px] font-syncopate">+2.4%</div>
                        </div>
                    </Card>

                    <Card className="p-8 bg-[#0A0A0A]/80 border-white/5 group relative overflow-hidden h-[234px]">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-3">
                                <TrendingUp size={16} className="text-purple-400" />
                                <span className="text-[10px] font-syncopate font-bold uppercase tracking-widest text-white/60">Node Integrity</span>
                            </div>
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_#10B981]" />
                        </div>
                        <div className="space-y-4">
                            {[
                                { label: 'Sovereignty', level: '98%', color: 'bg-purple-500' },
                                { label: 'Latency', level: '12ms', color: 'bg-emerald-500' },
                                { label: 'Sync', level: 'Optimal', color: 'bg-blue-500' }
                            ].map((stat, i) => (
                                <div key={i} className="flex justify-between items-center">
                                    <span className="text-[9px] font-syncopate text-white/30 uppercase tracking-widest">{stat.label}</span>
                                    <div className="flex items-center gap-3">
                                        <div className="w-24 h-1 bg-white/5 rounded-full overflow-hidden">
                                            <motion.div
                                                className={`h-full ${stat.color} opacity-40`}
                                                initial={{ width: 0 }}
                                                animate={{ width: '100%' }}
                                                transition={{ delay: 1 + (i * 0.2), duration: 1.5 }}
                                            />
                                        </div>
                                        <span className="text-[10px] font-mono text-white/60 w-10 text-right">{stat.level}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default CommandDeck;
