import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell, Card, SectionHeader } from "@/components/AppShell";
import { Send, Plus } from "lucide-react";
import { apiPost, API_ENDPOINTS } from "../lib/api";

export const Route = createFileRoute("/publishing")({
  head: () => ({ meta: [{ title: "Publishing — AutoEvolve" }] }),
  component: Publishing,
});

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
        <SectionHeader title="Connected Accounts" description="No accounts connected" />
        <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
          <div className="text-center">
            <Plus className="mx-auto h-6 w-6 mb-2 opacity-40" />
            <p>No connected accounts yet. Integration setup coming soon.</p>
          </div>
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
