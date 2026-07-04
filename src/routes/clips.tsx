import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell, Card, SectionHeader } from "@/components/AppShell";
import { Check, X, Edit2, Play, Filter, Search, FileVideo } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "../lib/supabase";

export const Route = createFileRoute("/clips")({
  head: () => ({ meta: [{ title: "Generated Clips — AutoEvolve" }] }),
  component: Clips,
});

function Clips() {
  const [analyses, setAnalyses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("analyses")
      .select("id, source_url, clips, created_at")
      .order("created_at", { ascending: false })
      .limit(20)
      .then(({ data }) => {
        if (data) setAnalyses(data);
        setLoading(false);
      });
  }, []);

  return (
    <AppShell title="Generated Clips" subtitle={`${analyses.length} analyses`}>
      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      )}

      {!loading && analyses.length === 0 && (
        <Card className="p-10 text-center">
          <FileVideo className="mx-auto h-10 w-10 text-muted-foreground" />
          <p className="mt-3 text-sm text-muted-foreground">No analyses yet. Upload a video in Content Factory.</p>
        </Card>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
        {analyses.map((a: any, i: number) => {
          const clips = typeof a.clips === "string" ? JSON.parse(a.clips) : (a.clips || []);
          return (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <Card className="group overflow-hidden">
                <div className="relative aspect-[9/12] bg-gradient-to-br from-zinc-800 via-zinc-900 to-black">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(34,197,94,0.15),transparent_60%)]" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-12 w-12 rounded-full bg-black/60 backdrop-blur grid place-items-center ring-1 ring-white/10 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition">
                      <Play className="h-5 w-5 text-white fill-white ml-0.5" />
                    </div>
                  </div>
                  <div className="absolute top-2 left-2 rounded bg-black/70 backdrop-blur px-2 py-1 text-[10px] font-medium text-white">
                    {a.source_url?.slice(0, 24) || "untitled"}
                  </div>
                  <div className="absolute top-2 right-2 rounded bg-primary/90 backdrop-blur px-2 py-1 text-[10px] font-semibold text-primary-foreground">
                    {clips.length} clips
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black to-transparent">
                    <p className="text-sm font-semibold text-white leading-tight">
                      {a.created_at ? new Date(a.created_at).toLocaleDateString() : ""}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 p-2 border-t border-border">
                  <button className="flex-1 flex items-center justify-center gap-1 rounded-md bg-primary/10 text-primary px-2 py-1.5 text-xs font-medium hover:bg-primary/20 transition">
                    <Check className="h-3 w-3" /> Approve
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-1 rounded-md bg-muted text-muted-foreground px-2 py-1.5 text-xs font-medium hover:text-foreground hover:bg-sidebar-accent transition">
                    <Edit2 className="h-3 w-3" /> Edit
                  </button>
                  <button className="rounded-md bg-muted text-muted-foreground px-2 py-1.5 text-xs hover:text-destructive hover:bg-destructive/10 transition">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </AppShell>
  );
}
