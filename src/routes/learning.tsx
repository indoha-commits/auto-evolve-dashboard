import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell, Card, SectionHeader } from "@/components/AppShell";
import { motion } from "framer-motion";
import { Brain, TrendingUp, TrendingDown, Sparkles, ChevronRight, GitBranch } from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { supabase } from "../lib/supabase";

export const Route = createFileRoute("/learning")({
  head: () => ({ meta: [{ title: "Learning Engine — AutoEvolve" }] }),
  component: LearningEngine,
});

function LearningEngine() {
  const [promptVersions, setPromptVersions] = useState<any[]>([]);

  useEffect(() => {
    supabase.from("prompt_versions").select("*").order("version", { ascending: false }).limit(10).then(({ data }) => {
      if (data) setPromptVersions(data);
    });
  }, []);

  const scoreData = [
    { name: "score", value: 87 },
    { name: "rest", value: 13 },
  ];

  const evolutions = promptVersions.length > 0
    ? promptVersions.map((v: any) => ({
        v: `v${v.version}`,
        date: v.created_at ? new Date(v.created_at).toLocaleDateString() : "",
        change: v.description || "",
        lift: v.score ? `+${v.score}%` : "",
      }))
    : [
        { v: "v15", date: "May 12", change: "More founder stories", lift: "+10%" },
        { v: "v14", date: "Apr 28", change: "Added numeric data", lift: "+13%" },
      ];

  const winning = [
    { p: "Founder stories with $ amounts in hook", lift: "+38%" },
    { p: "Contrarian openers ('Everyone says X, but…')", lift: "+34%" },
    { p: "9:00 AM Tuesday posting window", lift: "+28%" },
    { p: "Vertical 9:16 with hard-cut at 0:02", lift: "+19%" },
  ];

  const losing = [
    { p: "Tutorial-style intros over 5 seconds", lift: "-27%" },
    { p: "Generic industry stats without source", lift: "-19%" },
    { p: "Friday afternoon posting window", lift: "-14%" },
  ];

  return (
    <AppShell title="Learning Engine" subtitle="Your strategy improves every week — automatically">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="p-6 lg:col-span-2">
          <SectionHeader title={`Current Strategy · ${evolutions[0]?.v || "v1"}`} description="Active prompt directing all clip generation" />
          <div className="rounded-lg border border-border bg-background/40 p-4 text-sm leading-relaxed font-mono text-muted-foreground">
            <span className="text-primary">Focus on</span> founder stories, problem → cost → solution
            structure, and contrarian angles with numeric data.
          </div>

          <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            {[
              { l: "Prompt Versions", v: String(promptVersions.length || evolutions.length) },
              { l: "Patterns Tracked", v: "47" },
              { l: "Confidence", v: "94%" },
              { l: "Next Iteration", v: "3d" },
            ].map((m) => (
              <div key={m.l} className="rounded-md border border-border bg-background/40 p-3">
                <div className="text-xs text-muted-foreground">{m.l}</div>
                <div className="mt-1 text-lg font-semibold tabular-nums">{m.v}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 flex flex-col items-center justify-center text-center">
          <span className="text-xs uppercase tracking-wider text-muted-foreground">Learning Score</span>
          <div className="relative my-3 h-44 w-44">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={scoreData} innerRadius={62} outerRadius={82} startAngle={90} endAngle={-270} dataKey="value" stroke="none">
                  <Cell fill="#22C55E" />
                  <Cell fill="#1F1F22" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-4xl font-bold tabular-nums">87</div>
              <div className="text-[10px] uppercase tracking-wider text-primary mt-1">Excellent</div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">+5 points in last 7 days</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        <Card className="p-6">
          <SectionHeader title="Winning Patterns" description="What's driving outperformance" action={<TrendingUp className="h-4 w-4 text-primary" />} />
          <ul className="space-y-2">
            {winning.map((p, i) => (
              <motion.li key={p.p} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                className="flex items-center gap-3 rounded-md border border-border bg-background/40 px-3 py-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_6px_#22C55E]" />
                <span className="flex-1 text-sm">{p.p}</span>
                <span className="text-xs font-semibold text-primary tabular-nums">{p.lift}</span>
              </motion.li>
            ))}
          </ul>
        </Card>

        <Card className="p-6">
          <SectionHeader title="Losing Patterns" description="What's been retired" action={<TrendingDown className="h-4 w-4 text-destructive" />} />
          <ul className="space-y-2">
            {losing.map((p, i) => (
              <motion.li key={p.p} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                className="flex items-center gap-3 rounded-md border border-border bg-background/40 px-3 py-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-destructive" />
                <span className="flex-1 text-sm line-through decoration-destructive/40 text-muted-foreground">{p.p}</span>
                <span className="text-xs font-semibold text-destructive tabular-nums">{p.lift}</span>
              </motion.li>
            ))}
          </ul>
        </Card>
      </div>

      {evolutions.length > 0 && (
        <Card className="p-6 mt-4">
          <SectionHeader title="Evolution Timeline" description="Prompt version history" />
          <div className="relative overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-muted-foreground uppercase tracking-wider border-b border-border">
                  <th className="py-2 font-medium">Version</th>
                  <th className="py-2 font-medium">Date</th>
                  <th className="py-2 font-medium">Change</th>
                  <th className="py-2 font-medium text-right">Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {evolutions.map((e) => (
                  <tr key={e.v} className="hover:bg-sidebar-accent/40">
                    <td className="py-3"><span className="inline-flex items-center gap-1.5 rounded bg-muted px-2 py-0.5 text-xs font-mono"><GitBranch className="h-3 w-3 text-primary" />{e.v}</span></td>
                    <td className="py-3 text-muted-foreground tabular-nums">{e.date}</td>
                    <td className="py-3">{e.change}</td>
                    <td className="py-3 text-right font-semibold text-primary tabular-nums">{e.lift}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </AppShell>
  );
}
