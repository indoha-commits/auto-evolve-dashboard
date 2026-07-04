import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell, Card, StatCard, SectionHeader } from "@/components/AppShell";
import { Eye, MessageSquare, Share2, MousePointerClick } from "lucide-react";
import {
  Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart,
  Pie, PieChart, RadialBar, RadialBarChart, ResponsiveContainer,
  Tooltip, XAxis, YAxis,
} from "recharts";
import { supabase } from "../lib/supabase";

export const Route = createFileRoute("/analytics")({
  head: () => ({ meta: [{ title: "Analytics — AutoEvolve" }] }),
  component: Analytics,
});

const tooltipStyle = { background: "#111113", border: "1px solid #27272A", borderRadius: 8, fontSize: 12, color: "#FBFAFC" };
const colors = ["#22C55E", "#3B82F6", "#A855F7", "#F59E0B"];

function Analytics() {
  const [analysesCount, setAnalysesCount] = useState(0);

  useEffect(() => {
    supabase.from("analyses").select("id", { count: "exact", head: false }).then(({ count }) => {
      if (count !== null) setAnalysesCount(count);
    });
  }, []);

  const hooks = [
    { name: "Founder $ mistake", v: 24800 },
    { name: "Contrarian", v: 19200 },
    { name: "Behind scenes", v: 16400 },
    { name: "Problem→Solution", v: 14200 },
    { name: "Tactical tip", v: 11100 },
  ];

  const archetypes = [
    { name: "Founder Story", value: 42 },
    { name: "Contrarian", value: 28 },
    { name: "Tactical", value: 18 },
    { name: "Behind Scenes", value: 12 },
  ];

  const perf = Array.from({ length: 30 }, (_, i) => ({
    d: i + 1, a: 800 + Math.round(Math.sin(i / 4) * 200), b: 500 + Math.round(Math.cos(i / 3) * 180),
  }));

  return (
    <AppShell title="Analytics" subtitle="Performance intelligence">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Analyses" value={String(analysesCount)} hint="All time" icon={Eye} />
        <StatCard label="Engagements" value="86K" delta="+24%" hint="Likes, comments, shares" icon={MessageSquare} />
        <StatCard label="Shares" value="12.4K" delta="+9%" hint="Viral velocity rising" icon={Share2} />
        <StatCard label="CTR" value="3.2%" delta="+0.6pp" hint="Above industry avg" icon={MousePointerClick} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        <Card className="p-5 lg:col-span-2">
          <SectionHeader title="Performance Over Time" description="Views vs Engagements" />
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={perf}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1F1F22" vertical={false} />
                <XAxis dataKey="d" stroke="#52525B" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#52525B" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line type="monotone" dataKey="a" stroke="#22C55E" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="b" stroke="#A855F7" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5">
          <SectionHeader title="Top Performing Hooks" description="By total reach" />
          <ul className="space-y-3">
            {hooks.map((h, i) => {
              const pct = (h.v / hooks[0].v) * 100;
              return (
                <li key={h.name}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted-foreground">{h.name}</span>
                    <span className="font-semibold tabular-nums">{(h.v / 1000).toFixed(1)}k</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: i === 0 ? "#22C55E" : "linear-gradient(90deg,#22C55E,#16A34A)", opacity: 1 - i * 0.15 }} />
                  </div>
                </li>
              );
            })}
          </ul>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        <Card className="p-5">
          <SectionHeader title="Best Archetypes" description="Share of top 100 clips" />
          <div className="h-56">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={archetypes} dataKey="value" innerRadius={50} outerRadius={80} stroke="none" paddingAngle={2}>
                  {archetypes.map((_, i) => (<Cell key={i} fill={colors[i]} />))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="space-y-1.5 text-xs">
            {archetypes.map((a, i) => (
              <li key={a.name} className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ background: colors[i] }} />
                  {a.name}
                </span>
                <span className="font-semibold tabular-nums">{a.value}%</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-5 lg:col-span-2">
          <SectionHeader title="Best Topics" />
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={[
                { t: "Mining costs", v: 24000 }, { t: "Permit strategy", v: 19000 },
                { t: "Founder origin", v: 17500 }, { t: "ESG reality", v: 14200 },
                { t: "Field ops", v: 11800 }, { t: "Capital raise", v: 9100 },
              ]}>
                <CartesianGrid stroke="#1F1F22" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="t" stroke="#52525B" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#52525B" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "#1F1F22" }} />
                <Bar dataKey="v" fill="#22C55E" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
