import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell, Card, StatCard, SectionHeader } from "@/components/AppShell";
import {
  Video,
  Scissors,
  Send,
  Brain,
} from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "../lib/supabase";
export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — AutoEvolve" },
      { name: "description", content: "AI content operating system dashboard." },
    ],
  }),
  component: Dashboard,
});

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

  return (
    <AppShell title="Dashboard" subtitle="Real-time content intelligence">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Videos Processed" value={String(stats.videos)} hint="All time" icon={Video} />
        <StatCard label="Clips Generated" value={String(stats.clips)} hint="Total rendered" icon={Scissors} />
        <StatCard label="Posts Published" value={String(stats.published)} hint="Across all platforms" icon={Send} />
        <StatCard label="Learning Score" value="—" hint="Connect your accounts" icon={Brain} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
        <Card className="p-5 lg:col-span-2">
          <SectionHeader title="Performance Trend" description="Waiting for data" />
          <div className="flex h-72 items-center justify-center text-sm text-muted-foreground">
            No performance data yet. Process your first video to see trends.
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
