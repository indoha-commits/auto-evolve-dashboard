import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell, Card, StatCard, SectionHeader } from "@/components/AppShell";
import { Eye } from "lucide-react";
import { supabase } from "../lib/supabase";

export const Route = createFileRoute("/analytics")({
  head: () => ({ meta: [{ title: "Analytics — AutoEvolve" }] }),
  component: Analytics,
});

function Analytics() {
  const [analysesCount, setAnalysesCount] = useState(0);

  useEffect(() => {
    supabase.from("analyses").select("id", { count: "exact", head: false }).then(({ count }) => {
      if (count !== null) setAnalysesCount(count);
    });
  }, []);

  return (
    <AppShell title="Analytics" subtitle="Performance intelligence">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Analyses" value={String(analysesCount)} hint="All time" icon={Eye} />
        <StatCard label="Engagements" value="—" hint="Waiting for data" icon={Eye} />
        <StatCard label="Shares" value="—" hint="Waiting for data" icon={Eye} />
        <StatCard label="CTR" value="—" hint="Waiting for data" icon={Eye} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        <Card className="p-5 lg:col-span-2">
          <SectionHeader title="Performance Over Time" description="Views vs Engagements" />
          <div className="flex h-72 items-center justify-center text-sm text-muted-foreground">
            No performance data yet. Process videos to see analytics.
          </div>
        </Card>

        <Card className="p-5">
          <SectionHeader title="Top Performing Hooks" description="By total reach" />
          <div className="flex h-56 items-center justify-center text-sm text-muted-foreground">
            No hook data yet.
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        <Card className="p-5">
          <SectionHeader title="Best Archetypes" description="Share of top 100 clips" />
          <div className="flex h-56 items-center justify-center text-sm text-muted-foreground">
            No archetype data yet.
          </div>
        </Card>

        <Card className="p-5 lg:col-span-2">
          <SectionHeader title="Best Topics" />
          <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
            No topic data yet.
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
