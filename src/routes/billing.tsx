import { createFileRoute } from "@tanstack/react-router";
import { AppShell, Card, SectionHeader } from "@/components/AppShell";

export const Route = createFileRoute("/billing")({
  head: () => ({ meta: [{ title: "Billing — AutoEvolve" }] }),
  component: Billing,
});

function Billing() {
  return (
    <AppShell title="Billing & Subscription" subtitle="Plan, usage, and invoices">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="p-6 lg:col-span-2 relative overflow-hidden">
          <div className="relative">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">Current Plan</span>
            <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">
              No subscription data yet. Billing integration coming soon.
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <SectionHeader title="Usage This Month" />
          <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">
            No usage data yet.
          </div>
        </Card>
      </div>

      <Card className="p-6 mt-4">
        <SectionHeader title="Invoices" description="Download for accounting" />
        <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
          No invoices yet.
        </div>
      </Card>
    </AppShell>
  );
}
