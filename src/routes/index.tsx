import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell, Card, StatCard, SectionHeader } from "@/components/AppShell";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Video,
  Scissors,
  Send,
  Brain,
  TrendingUp,
  Sparkles,
  Clock,
  Target,
  ArrowUpRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "../lib/supabase";
import { apiFetch } from "../lib/api";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — AutoEvolve" },
      { name: "description", content: "AI content operating system dashboard." },
    ],
  }),
  component: Dashboard,
});

const tooltipStyle = {
  background: "#111113",
  border: "1px solid #27272A",
  borderRadius: 8,
  fontSize: 12,
  color: "#FBFAFC",
};

function Dashboard() {
  const [stats, setStats] = useState({ videos: 0, clips: 0, published: 0 });
  const [activity, setActivity] = useState<any[]>([]);

  useEffect(() => {
    supabase.from("usage").select("analyses_count, renders_count, publishes_count").then(({ data }) => {
      if (data?.length) {
        const row = data.reduce((a: any, b: any) => ({
          analyses_count: (a.analyses_count || 0) + (b.analyses_count || 0),
          renders_count: (a.renders_count || 0) + (b.renders_count || 0),
          publishes_count: (a.publishes_count || 0) + (b.publishes_count || 0),
        }));
        setStats({
          videos: row.analyses_count || 0,
          clips: row.renders_count || 0,
          published: row.publishes_count || 0,
        });
      }
    });

    supabase.from("activity_log").select("action, metadata, created_at").order("created_at", { ascending: false }).limit(10).then(({ data }) => {
      if (data) setActivity(data);
    });
  }, []);

  const perfData = Array.from({ length: 30 }, (_, i) => ({
    d: i + 1,
    views: 12000 + Math.round(Math.sin(i / 3) * 4000),
    engagement: 800 + Math.round(Math.cos(i / 4) * 200),
  }));

  const learningData = Array.from({ length: 15 }, (_, i) => ({
    v: `v${i + 1}`,
    score: 42 + i * 3,
  }));

  const engagementData = Array.from({ length: 12 }, (_, i) => ({
    w: `W${i + 1}`,
    linkedin: 200 + i * 40,
    twitter: 120 + i * 25,
    tiktok: 80 + i * 35,
  }));

  return (
    <AppShell title="Dashboard" subtitle="Real-time content intelligence">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Videos Processed" value={String(stats.videos)} hint="All time" icon={Video} />
        <StatCard label="Clips Generated" value={String(stats.clips)} hint="Total rendered" icon={Scissors} />
        <StatCard label="Posts Published" value={String(stats.published)} hint="Across all platforms" icon={Send} />
        <StatCard label="Learning Score" value="87" hint="Strategy v15" icon={Brain} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
        <Card className="p-5 lg:col-span-2">
          <SectionHeader title="Performance Trend" description="Views vs engagement · last 30 days" />
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={perfData}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22C55E" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#22C55E" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1F1F22" vertical={false} />
                <XAxis dataKey="d" stroke="#52525B" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#52525B" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="views" stroke="#22C55E" strokeWidth={2} fill="url(#g1)" />
                <Area type="monotone" dataKey="engagement" stroke="#3B82F6" strokeWidth={2} fill="url(#g1)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5">
          <SectionHeader title="Live Activity" />
          <ul className="space-y-3 text-sm">
            {activity.length === 0 && <li className="text-xs text-muted-foreground">No recent activity</li>}
            {activity.map((a: any, i: number) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex gap-3"
              >
                <div className="mt-1 h-2 w-2 rounded-full bg-primary shadow-[0_0_6px_#22C55E]" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{a.action}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {a.created_at ? new Date(a.created_at).toLocaleDateString() : ""}
                  </p>
                </div>
              </motion.li>
            ))}
          </ul>
        </Card>
      </div>
    </AppShell>
  );
}
