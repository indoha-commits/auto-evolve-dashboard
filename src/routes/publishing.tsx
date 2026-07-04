import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell, Card, SectionHeader } from "@/components/AppShell";
import { Linkedin, Plus, Check, Send } from "lucide-react";
import { apiPost, API_ENDPOINTS } from "../lib/api";

export const Route = createFileRoute("/publishing")({
  head: () => ({ meta: [{ title: "Publishing — AutoEvolve" }] }),
  component: Publishing,
});

const accounts = [
  { name: "LinkedIn", icon: Linkedin, color: "#0A66C2", handle: "@auto-evolve", connected: true },
];

function Publishing() {
  const [hook, setHook] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [publishing, setPublishing] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  async function handlePublish() {
    if (!hook) return;
    setPublishing(true);
    setResult(null);
    try {
      const res = await apiPost(API_ENDPOINTS.publish, { hook, text: hook, video_url: videoUrl });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Publish failed");
      }
      const data = await res.json();
      setResult(data.post_url || "Published successfully!");
    } catch (e: any) {
      setResult(`Error: ${e.message}`);
    } finally {
      setPublishing(false);
    }
  }

  return (
    <AppShell title="Publishing" subtitle="Schedule and publish across every channel">
      <Card className="p-5">
        <SectionHeader title="Connected Accounts" description={`${accounts.length} channel active`} />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {accounts.map((a) => (
            <div key={a.name} className="rounded-lg border border-border bg-background/40 p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-md grid place-items-center text-white" style={{ background: a.color }}>
                <a.icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-medium truncate">{a.name}</p>
                  <span className="rounded bg-primary/15 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-primary flex items-center gap-0.5">
                    <Check className="h-2 w-2" /> Live
                  </span>
                </div>
                <p className="text-xs text-muted-foreground truncate">{a.handle}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-5 mt-4">
        <SectionHeader title="Publish Now" description="Post to your connected channels" />
        <div className="space-y-4">
          <input
            placeholder="Hook / post text"
            value={hook}
            onChange={(e) => setHook(e.target.value)}
            className="w-full rounded-md border border-border bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary/60"
          />
          <input
            placeholder="Video URL (optional)"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            className="w-full rounded-md border border-border bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary/60"
          />
          <button
            onClick={handlePublish}
            disabled={publishing || !hook}
            className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {publishing ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" /> : <Send className="h-4 w-4" />}
            {publishing ? "Publishing…" : "Publish"}
          </button>
          {result && (
            <p className={`text-sm ${result.startsWith("Error") ? "text-destructive" : "text-primary"}`}>{result}</p>
          )}
        </div>
      </Card>
    </AppShell>
  );
}
