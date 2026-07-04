import { createFileRoute } from "@tanstack/react-router";
import { AppShell, Card, SectionHeader } from "@/components/AppShell";

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
              <Input placeholder="e.g. Acme Mining Co." />
            </Field>
            <Field label="Industry">
              <Select defaultValue="">
                <option value="" disabled>Select industry</option>
                <option value="mining">Mining</option>
                <option value="energy">Energy</option>
                <option value="industrial">Industrial</option>
                <option value="saas">SaaS</option>
              </Select>
            </Field>
            <Field label="Target Audience">
              <Input placeholder="e.g. Mining Executives" />
            </Field>
            <Field label="Brand Voice">
              <Input placeholder="e.g. Direct, data-driven" />
            </Field>
          </div>
        </Card>

        <Card className="p-6">
          <SectionHeader title="Learning Settings" description="How aggressively to evolve your strategy" />
          <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">
            Learning settings will be configurable once your strategy has enough data.
          </div>
        </Card>

        <Card className="p-6">
          <SectionHeader title="Integrations" description="Connect data sources & destinations" />
          <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
            Integrations coming soon.
          </div>
        </Card>

        <Card className="p-6">
          <SectionHeader title="Notifications" description="What pings you and when" />
          <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
            Notification preferences coming soon.
          </div>
        </Card>
      </div>

      <div className="mt-6 flex justify-end">
        <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          Save changes
        </button>
      </div>
    </AppShell>
  );
}
