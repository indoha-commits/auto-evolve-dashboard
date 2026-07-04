import { createFileRoute } from "@tanstack/react-router";
import { AppShell, Card, SectionHeader } from "@/components/AppShell";
import { useState } from "react";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — AutoEvolve" }] }),
  component: SettingsPage,
});

const tabs = ["Profile", "Brand Settings", "Learning Settings", "Integrations", "Team"];

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full rounded-md border border-border bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/40 transition"
    />
  );
}

function Select({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className="w-full rounded-md border border-border bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary/60"
    >
      {children}
    </select>
  );
}

function Toggle({ defaultOn = false, label }: { defaultOn?: boolean; label: string }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
      <span className="text-sm">{label}</span>
      <button
        onClick={() => setOn(!on)}
        className={`relative h-5 w-9 rounded-full transition ${on ? "bg-primary" : "bg-muted"}`}
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition ${on ? "left-4" : "left-0.5"}`}
        />
      </button>
    </div>
  );
}

function SettingsPage() {
  return (
    <AppShell title="Settings" subtitle="Configure your AutoEvolve workspace">
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-1 border-b border-border -mx-4 px-4 pb-3">
          {tabs.map((t, i) => (
            <button
              key={t}
              className={`relative px-3 py-1.5 text-xs font-medium transition ${
                i === 0 ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t}
              {i === 0 && <span className="absolute -bottom-3 left-0 right-0 h-px bg-primary" />}
            </button>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        <Card className="p-6">
          <SectionHeader title="Brand Information" description="How AutoEvolve introduces you" />
          <div className="space-y-4">
            <Field label="Company Name">
              <Input defaultValue="Acme Mining Co." />
            </Field>
            <Field label="Industry">
              <Select defaultValue="mining">
                <option value="mining">Mining</option>
                <option value="energy">Energy</option>
                <option value="industrial">Industrial</option>
                <option value="saas">SaaS</option>
              </Select>
            </Field>
            <Field label="Target Audience">
              <Input defaultValue="Mining Executives, Operations Managers" />
            </Field>
            <Field label="Brand Voice">
              <Input defaultValue="Direct, data-driven, contrarian" />
            </Field>
          </div>
        </Card>

        <Card className="p-6">
          <SectionHeader title="Learning Settings" description="How aggressively to evolve your strategy" />
          <div className="space-y-4">
            <Field label="Learning Mode">
              <Select defaultValue="balanced">
                <option value="conservative">Conservative</option>
                <option value="balanced">Balanced</option>
                <option value="aggressive">Aggressive</option>
              </Select>
            </Field>
            <Field label="Update Frequency">
              <Select defaultValue="weekly">
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="biweekly">Bi-weekly</option>
              </Select>
            </Field>
            <Field label="Auto-apply winning patterns">
              <Select defaultValue="suggest">
                <option value="auto">Apply automatically</option>
                <option value="suggest">Suggest, await approval</option>
                <option value="manual">Manual only</option>
              </Select>
            </Field>
            <Field label="Confidence Threshold">
              <div className="flex items-center gap-3">
                <input type="range" min={50} max={99} defaultValue={85} className="flex-1 accent-primary" />
                <span className="text-sm tabular-nums w-10 text-right">85%</span>
              </div>
            </Field>
          </div>
        </Card>

        <Card className="p-6">
          <SectionHeader title="Integrations" description="Connect data sources & destinations" />
          <ul className="divide-y divide-border">
            {[
              ["Slack", "Notify team on new clip approvals"],
              ["Notion", "Sync content calendar"],
              ["HubSpot", "Track attribution"],
              ["Zapier", "10,000+ apps via webhooks"],
            ].map(([n, d]) => (
              <li key={n} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium">{n}</p>
                  <p className="text-xs text-muted-foreground">{d}</p>
                </div>
                <button className="rounded-md border border-border bg-card px-3 py-1 text-xs hover:bg-sidebar-accent">
                  Connect
                </button>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-6">
          <SectionHeader title="Notifications" description="What pings you and when" />
          <Toggle defaultOn label="Clip ready for review" />
          <Toggle defaultOn label="Weekly insights digest" />
          <Toggle label="Strategy version published" />
          <Toggle defaultOn label="Post failed to publish" />
          <Toggle label="Daily performance summary" />
        </Card>
      </div>

      <div className="mt-6 flex justify-end gap-2">
        <button className="rounded-md border border-border bg-card px-4 py-2 text-sm hover:bg-sidebar-accent">
          Cancel
        </button>
        <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          Save changes
        </button>
      </div>
    </AppShell>
  );
}
