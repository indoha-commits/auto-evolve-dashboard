import { createFileRoute } from "@tanstack/react-router";
import { AppShell, Card, SectionHeader } from "@/components/AppShell";
import { Check, Download, Sparkles } from "lucide-react";

export const Route = createFileRoute("/billing")({
  head: () => ({ meta: [{ title: "Billing — AutoEvolve" }] }),
  component: Billing,
});

const usage = [
  { l: "Videos Processed", v: 24, max: 50 },
  { l: "Clips Generated", v: 132, max: 300 },
  { l: "Posts Published", v: 98, max: 200 },
  { l: "Storage", v: 18, max: 50, unit: "GB" },
];

const invoices = [
  { date: "May 12, 2025", amount: "$249.00", status: "Paid" },
  { date: "Apr 12, 2025", amount: "$249.00", status: "Paid" },
  { date: "Mar 12, 2025", amount: "$249.00", status: "Paid" },
  { date: "Feb 12, 2025", amount: "$249.00", status: "Paid" },
];

function Billing() {
  return (
    <AppShell title="Billing & Subscription" subtitle="Plan, usage, and invoices">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="p-6 lg:col-span-2 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-primary/10 blur-3xl" />
          <div className="relative">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">Current Plan</span>
            <div className="mt-2 flex items-baseline gap-3">
              <h2 className="text-3xl font-semibold tracking-tight">Growth</h2>
              <span className="rounded bg-primary/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
                Active
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">Next billing June 12, 2025</p>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-4xl font-bold tabular-nums">$249</span>
              <span className="text-sm text-muted-foreground">/month</span>
            </div>

            <ul className="mt-5 grid sm:grid-cols-2 gap-2 text-sm">
              {[
                "50 videos / month",
                "300 clips / month",
                "Learning Engine v2",
                "4 connected channels",
                "Priority rendering",
                "Advanced analytics",
              ].map((f) => (
                <li key={f} className="flex items-center gap-2 text-muted-foreground">
                  <Check className="h-3.5 w-3.5 text-primary" /> {f}
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-wrap gap-2">
              <button className="flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition">
                <Sparkles className="h-3.5 w-3.5" /> Upgrade to Scale
              </button>
              <button className="rounded-md border border-border bg-card px-4 py-2 text-sm hover:bg-sidebar-accent">
                Manage subscription
              </button>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <SectionHeader title="Usage This Month" />
          <ul className="space-y-4">
            {usage.map((u) => (
              <li key={u.l}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-muted-foreground">{u.l}</span>
                  <span className="tabular-nums">
                    {u.v}{u.unit ? ` ${u.unit}` : ""} / {u.max}{u.unit ? ` ${u.unit}` : ""}
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${(u.v / u.max) * 100}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card className="p-6 mt-4">
        <SectionHeader title="Invoices" description="Download for accounting" />
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-muted-foreground uppercase tracking-wider border-b border-border">
              <th className="py-2 font-medium">Date</th>
              <th className="py-2 font-medium">Amount</th>
              <th className="py-2 font-medium">Status</th>
              <th className="py-2 font-medium text-right">Invoice</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {invoices.map((inv) => (
              <tr key={inv.date}>
                <td className="py-3">{inv.date}</td>
                <td className="py-3 tabular-nums">{inv.amount}</td>
                <td className="py-3">
                  <span className="rounded bg-primary/15 px-2 py-0.5 text-[10px] uppercase tracking-wider text-primary">{inv.status}</span>
                </td>
                <td className="py-3 text-right">
                  <button className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-2.5 py-1 text-xs hover:bg-sidebar-accent">
                    <Download className="h-3 w-3" /> PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </AppShell>
  );
}
