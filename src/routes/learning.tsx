import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell, Card, SectionHeader } from "@/components/AppShell";
import { GitBranch } from "lucide-react";
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

  const evolutions = promptVersions.map((v: any) => ({
    v: `v${v.version}`,
    date: v.created_at ? new Date(v.created_at).toLocaleDateString() : "",
    change: v.description || "",
    lift: v.score ? `+${v.score}%` : "",
  }));

  return (
    <AppShell title="Learning Engine" subtitle="Your strategy improves every week — automatically">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="p-6 lg:col-span-2">
          <SectionHeader title="Current Strategy" description="Active prompt directing all clip generation" />
          <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
            No strategy data yet. Process videos to start building your learning profile.
          </div>

          <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            {[
              { l: "Prompt Versions", v: String(promptVersions.length || 0) },
              { l: "Patterns Tracked", v: "0" },
              { l: "Confidence", v: "—" },
              { l: "Next Iteration", v: "—" },
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
          <div className="flex flex-1 items-center justify-center">
            <p className="text-sm text-muted-foreground">No data yet</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        <Card className="p-6">
          <SectionHeader title="Winning Patterns" description="What's driving outperformance" />
          <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
            No winning patterns identified yet.
          </div>
        </Card>

        <Card className="p-6">
          <SectionHeader title="Losing Patterns" description="What's been retired" />
          <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
            No losing patterns identified yet.
          </div>
        </Card>
      </div>

      {evolutions.length > 0 ? (
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
      ) : (
        <Card className="p-6 mt-4">
          <SectionHeader title="Evolution Timeline" description="Prompt version history" />
          <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
            No evolution data yet. Versions will appear as you iterate.
          </div>
        </Card>
      )}
    </AppShell>
  );
}
