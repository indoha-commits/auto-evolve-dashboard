import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useCallback, useRef } from "react";
import { AppShell, Card } from "@/components/AppShell";
import { supabase } from "../lib/supabase";
import { apiPost, apiFetch, API_BASE } from "../lib/api";
import {
  Play,
  Check,
  X,
  Loader2,
  Sparkles,
  ChevronDown,
  ChevronRight,
  Clock,
  TrendingUp,
  FileVideo,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const Route = createFileRoute("/clips")({
  head: () => ({ meta: [{ title: "Generated Clips — AutoEvolve" }] }),
  component: Clips,
});

interface Clip {
  n: number;
  score: number;
  hook: string;
  reason: string;
  start: number;
  end: number;
}

interface Analysis {
  id: string;
  source_url: string;
  clips: string;
  created_at: string;
  r2_key: string | null;
  kept_clips: string;
  discarded_clips: string;
}

interface PreviewJob {
  jobId: string;
  clipIndex: number;
  analysisId: string;
  status: "queued" | "downloading" | "rendering" | "uploading" | "completed" | "failed";
  previewUrl?: string;
  error?: string;
}

function Clips() {
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewJobs, setPreviewJobs] = useState<Map<string, PreviewJob>>(new Map());
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const pollTimers = useRef<Map<string, ReturnType<typeof setInterval>>>(new Map());

  useEffect(() => {
    supabase
      .from("analyses")
      .select("id, source_url, clips, created_at, r2_key, kept_clips, discarded_clips")
      .order("created_at", { ascending: false })
      .limit(50)
      .then(({ data }) => {
        if (data) {
          setAnalyses(data as Analysis[]);
          data.forEach((a) => setExpandedGroups((prev) => prev.add(a.id)));
        }
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const timers = pollTimers.current;
    return () => {
      timers.forEach((timer) => clearInterval(timer));
    };
  }, []);

  const startPolling = useCallback((jobId: string, analysisId: string, clipIndex: number) => {
    const timer = setInterval(async () => {
      try {
        const res = await apiFetch(`${API_BASE}/api/preview-status?jobId=${jobId}`);
        const data = await res.json();
        if (data.status === "completed" || data.status === "failed") {
          clearInterval(timer);
          pollTimers.current.delete(jobId);
        }
        setPreviewJobs((prev) => {
          const next = new Map(prev);
          next.set(`${analysisId}-${clipIndex}`, {
            jobId,
            clipIndex,
            analysisId,
            status: data.status,
            previewUrl: data.preview_url,
            error: data.error,
          });
          return next;
        });
      } catch {
        clearInterval(timer);
        pollTimers.current.delete(jobId);
      }
    }, 1500);
    pollTimers.current.set(jobId, timer);
  }, []);

  const handlePreview = useCallback(
    async (analysisId: string, clipIndex: number) => {
      setPreviewJobs((prev) => {
        const next = new Map(prev);
        next.set(`${analysisId}-${clipIndex}`, {
          jobId: "pending",
          clipIndex,
          analysisId,
          status: "queued",
        });
        return next;
      });

      try {
        const res = await apiPost(`${API_BASE}/api/preview-clip`, {
          analysis_id: analysisId,
          clip_index: clipIndex,
        });
        const data = await res.json();
        if (data.job_id) {
          startPolling(data.job_id, analysisId, clipIndex);
        } else {
          setPreviewJobs((prev) => {
            const next = new Map(prev);
            next.set(`${analysisId}-${clipIndex}`, {
              jobId: "error",
              clipIndex,
              analysisId,
              status: "failed",
              error: data.error || "Failed to start preview",
            });
            return next;
          });
        }
      } catch (e) {
        setPreviewJobs((prev) => {
          const next = new Map(prev);
          next.set(`${analysisId}-${clipIndex}`, {
            jobId: "error",
            clipIndex,
            analysisId,
            status: "failed",
            error: "Network error",
          });
          return next;
        });
      }
    },
    [startPolling],
  );

  const handleKeep = useCallback(async (analysisId: string, clipIndex: number) => {
    try {
      await apiPost(`${API_BASE}/api/keep-clip`, {
        analysis_id: analysisId,
        clip_index: clipIndex,
      });
      setAnalyses((prev) =>
        prev.map((a) => {
          if (a.id !== analysisId) return a;
          const kept = JSON.parse(typeof a.kept_clips === "string" ? a.kept_clips : "[]");
          if (!kept.includes(clipIndex)) kept.push(clipIndex);
          return { ...a, kept_clips: JSON.stringify(kept) };
        }),
      );
    } catch {
      /* ignore */
    }
  }, []);

  const handleDiscard = useCallback(async (analysisId: string, clipIndex: number) => {
    try {
      await apiPost(`${API_BASE}/api/discard-clip`, {
        analysis_id: analysisId,
        clip_index: clipIndex,
      });
      setAnalyses((prev) =>
        prev.map((a) => {
          if (a.id !== analysisId) return a;
          const discarded = JSON.parse(
            typeof a.discarded_clips === "string" ? a.discarded_clips : "[]",
          );
          if (!discarded.includes(clipIndex)) discarded.push(clipIndex);
          const kept = JSON.parse(typeof a.kept_clips === "string" ? a.kept_clips : "[]");
          return {
            ...a,
            discarded_clips: JSON.stringify(discarded),
            kept_clips: JSON.stringify(kept.filter((i: number) => i !== clipIndex)),
          };
        }),
      );
      setPreviewJobs((prev) => {
        const next = new Map(prev);
        next.delete(`${analysisId}-${clipIndex}`);
        return next;
      });
    } catch {
      /* ignore */
    }
  }, []);

  const toggleGroup = (id: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const renderClipActions = (analysisId: string, clip: Clip, job: PreviewJob | undefined) => {
    if (job?.status === "completed" && job.previewUrl) {
      return (
        <div className="space-y-3">
          <div className="overflow-hidden rounded-lg border border-border bg-black">
            <video
              src={job.previewUrl}
              controls
              className="w-full aspect-[9/16] max-h-[320px] object-contain bg-black"
              preload="metadata"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleKeep(analysisId, clip.n - 1)}
              className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-primary text-primary-foreground px-3 py-2 text-xs font-semibold hover:bg-primary/90 transition"
            >
              <Check className="h-3.5 w-3.5" /> Keep
            </button>
            <button
              onClick={() => handleDiscard(analysisId, clip.n - 1)}
              className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-destructive/10 text-destructive px-3 py-2 text-xs font-semibold hover:bg-destructive/20 transition"
            >
              <X className="h-3.5 w-3.5" /> Discard
            </button>
          </div>
        </div>
      );
    }

    if (job?.status && job.status !== "completed" && job.status !== "failed") {
      return (
        <div className="flex flex-col items-center gap-2 py-3">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <span className="text-[11px] text-muted-foreground capitalize">{job.status}...</span>
        </div>
      );
    }

    const isKept = (() => {
      const analysis = analyses.find((a) => a.id === analysisId);
      if (!analysis) return false;
      const kept = JSON.parse(typeof analysis.kept_clips === "string" ? analysis.kept_clips : "[]");
      return kept.includes(clip.n - 1);
    })();

    return (
      <div className="flex gap-2">
        <button
          onClick={() => handlePreview(analysisId, clip.n - 1)}
          className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-primary/10 text-primary px-3 py-2 text-xs font-semibold hover:bg-primary/20 transition"
        >
          <Play className="h-3.5 w-3.5 fill-primary" /> Preview
        </button>
        {isKept ? (
          <button
            onClick={() => handleDiscard(analysisId, clip.n - 1)}
            className="flex items-center justify-center gap-1.5 rounded-lg bg-destructive/10 text-destructive px-3 py-2 text-xs font-semibold hover:bg-destructive/20 transition"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        ) : (
          <button
            onClick={() => handleKeep(analysisId, clip.n - 1)}
            className="flex items-center justify-center gap-1.5 rounded-lg bg-primary/10 text-primary px-3 py-2 text-xs font-semibold hover:bg-primary/20 transition"
          >
            <Check className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    );
  };

  return (
    <AppShell title="Generated Clips" subtitle={`${analyses.length} analyses`}>
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      )}

      {!loading && analyses.length === 0 && (
        <Card className="p-10 text-center">
          <FileVideo className="mx-auto h-10 w-10 text-muted-foreground" />
          <p className="mt-3 text-sm text-muted-foreground">
            No analyses yet. Upload a video in Content Factory.
          </p>
        </Card>
      )}

      <div className="mt-4 space-y-4">
        {analyses.map((analysis, ai) => {
          const allClips: Clip[] = (() => {
            try {
              return JSON.parse(typeof analysis.clips === "string" ? analysis.clips : "[]");
            } catch {
              return [];
            }
          })();
          const discarded = JSON.parse(
            typeof analysis.discarded_clips === "string" ? analysis.discarded_clips : "[]",
          );
          const kept = JSON.parse(
            typeof analysis.kept_clips === "string" ? analysis.kept_clips : "[]",
          );
          const visibleClips = allClips.filter((c) => !discarded.includes(c.n - 1));
          const isExpanded = expandedGroups.has(analysis.id);

          if (visibleClips.length === 0) return null;

          return (
            <motion.div
              key={analysis.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: ai * 0.04 }}
            >
              <Card className="overflow-hidden">
                <button
                  onClick={() => toggleGroup(analysis.id)}
                  className="flex items-center gap-3 w-full px-5 py-3.5 border-b border-border hover:bg-sidebar-accent/40 transition text-left"
                >
                  <div className="rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 p-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {analysis.source_url?.split("/").pop()?.slice(0, 40) || "Untitled"}
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      {new Date(analysis.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                      {" · "}
                      {visibleClips.length} clip{visibleClips.length !== 1 ? "s" : ""}
                      {kept.length > 0 && ` · ${kept.length} kept`}
                    </p>
                  </div>
                  {kept.length > 0 && (
                    <span className="shrink-0 rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold text-primary">
                      {kept.length} kept
                    </span>
                  )}
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                  )}
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 p-4">
                        {visibleClips.map((clip) => {
                          const jobKey = `${analysis.id}-${clip.n - 1}`;
                          const job = previewJobs.get(jobKey);
                          return (
                            <div
                              key={clip.n}
                              className="rounded-xl border border-border bg-card overflow-hidden"
                            >
                              <div className="p-4 space-y-3">
                                <div className="flex items-start justify-between gap-2">
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold leading-snug line-clamp-2">
                                      {clip.hook || `Clip ${clip.n}`}
                                    </p>
                                    {clip.reason && (
                                      <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2">
                                        {clip.reason}
                                      </p>
                                    )}
                                  </div>
                                  <div className="shrink-0 flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                                    <TrendingUp className="h-3 w-3" />
                                    {clip.score}
                                  </div>
                                </div>

                                <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {formatTime(clip.start)} – {formatTime(clip.end)}
                                  </span>
                                  <span className="font-mono">
                                    {clip.n}/{visibleClips.length}
                                  </span>
                                </div>
                              </div>

                              <div className="px-4 pb-4">
                                {renderClipActions(analysis.id, clip, job)}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </AppShell>
  );
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}
