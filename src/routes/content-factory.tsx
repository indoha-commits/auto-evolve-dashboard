import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useRef, useCallback } from "react";
import { AppShell, Card, SectionHeader } from "@/components/AppShell";
import { UploadCloud, Youtube, Link2, Check, Loader2, Sparkles, FileText, Brain, Scissors, Film, Eye, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { apiPost, apiFetch, API_ENDPOINTS } from "../lib/api";

export const Route = createFileRoute("/content-factory")({
  head: () => ({ meta: [{ title: "Content Factory — AutoEvolve" }] }),
  component: ContentFactory,
});

const FILE_SIZE_LIMIT = 500 * 1024 * 1024;

function ContentFactory() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<"upload" | "uploading" | "processing" | "done" | "error">("upload");
  const [error, setError] = useState("");
  const [jobId, setJobId] = useState("");
  const [pipeline, setPipeline] = useState([
    { key: "download", label: "Downloading", icon: FileText, status: "queued", detail: "Waiting" },
    { key: "transcription", label: "Transcription", icon: FileText, status: "queued", detail: "Waiting" },
    { key: "analysis", label: "AI Analysis", icon: Brain, status: "queued", detail: "Waiting" },
    { key: "selection", label: "Clip Selection", icon: Scissors, status: "queued", detail: "Waiting" },
    { key: "rendering", label: "Rendering", icon: Film, status: "queued", detail: "Waiting" },
  ]);

  const pollJob = useCallback(async (id: string) => {
    const interval = setInterval(async () => {
      const res = await apiFetch(`${API_ENDPOINTS.jobStatus}?jobId=${id}`);
      if (!res.ok) { clearInterval(interval); return; }
      const data = await res.json();
      if (data.status === "completed" || data.status === "failed") {
        clearInterval(interval);
        if (data.status === "completed") {
          setStep("done");
          setPipeline(p => p.map(s => ({ ...s, status: "done", detail: "Complete" })));
        } else {
          setStep("error");
          setError(data.error || "Processing failed");
        }
        return;
      }
      const runningIdx = data.progress ? Math.min(Math.floor(data.progress * pipeline.length), pipeline.length - 1) : 0;
      setPipeline(p => p.map((s, i) => ({
        ...s,
        status: i < runningIdx ? "done" as const : i === runningIdx ? "running" as const : "queued" as const,
        detail: i < runningIdx ? "Complete" : i === runningIdx ? "Processing…" : "Waiting",
      })));
    }, 3000);
  }, [pipeline.length]);

  async function handleFileUpload(file: File) {
    if (file.size > FILE_SIZE_LIMIT) {
      setError("File too large (max 500MB)");
      setStep("error");
      return;
    }
    setStep("uploading");
    setError("");

    try {
      const initRes = await apiPost(API_ENDPOINTS.initiateUpload, {
        filename: file.name,
        content_type: file.type || "video/mp4",
      });
      if (!initRes.ok) {
        const err = await initRes.json();
        throw new Error(err.error || "Failed to initiate upload");
      }
      const { upload_url, job_id, key } = await initRes.json();
      setJobId(job_id);

      const uploadRes = await fetch(upload_url, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type || "video/mp4" },
      });
      if (!uploadRes.ok) throw new Error("Upload to R2 failed");

      setStep("processing");
      setPipeline(p => p.map((s, i) => ({
        ...s,
        status: i === 0 ? "running" as const : "queued" as const,
        detail: i === 0 ? "Starting…" : "Waiting",
      })));

      const completeRes = await apiPost(API_ENDPOINTS.uploadComplete, { job_id, key });
      if (!completeRes.ok) {
        const err = await completeRes.json();
        throw new Error(err.error || "Failed to queue job");
      }

      pollJob(job_id);
    } catch (e: any) {
      setError(e.message);
      setStep("error");
    }
  }

  return (
    <AppShell title="Content Factory" subtitle="Turn long-form video into high-performing content">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="p-6 lg:col-span-2">
          <SectionHeader title="Upload New Video" description="Upload a file or paste a URL" />

          {step === "upload" && (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="relative rounded-xl border border-dashed border-border bg-background/50 p-10 text-center hover:border-primary/50 transition cursor-pointer group"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFileUpload(f);
                }}
              />
              <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 ring-1 ring-primary/30 grid place-items-center group-hover:scale-110 transition">
                <UploadCloud className="h-5 w-5 text-primary" />
              </div>
              <p className="mt-4 text-sm font-medium">Drop your video here</p>
              <p className="mt-1 text-xs text-muted-foreground">MP4, MOV, WEBM up to 500MB · or click to browse</p>
            </div>
          )}

          {step === "uploading" && (
            <div className="rounded-xl border border-border bg-background/50 p-10 text-center">
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
              <p className="mt-4 text-sm font-medium">Uploading to R2…</p>
            </div>
          )}

          {step === "error" && (
            <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center">
              <AlertCircle className="mx-auto h-8 w-8 text-destructive" />
              <p className="mt-3 text-sm font-medium text-destructive">{error}</p>
              <button
                onClick={() => setStep("upload")}
                className="mt-3 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground"
              >
                Try again
              </button>
            </div>
          )}

          {step === "done" && (
            <div className="rounded-xl border border-primary/30 bg-primary/5 p-10 text-center">
              <Check className="mx-auto h-8 w-8 text-primary" />
              <p className="mt-4 text-sm font-medium">Analysis complete!</p>
              <button
                onClick={() => navigate({ to: "/clips" })}
                className="mt-3 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
              >
                View Clips
              </button>
            </div>
          )}
        </Card>

        <Card className="p-6">
          <SectionHeader title="Processing Pipeline" />
          <ol className="relative space-y-5">
            <span className="absolute left-[15px] top-2 bottom-2 w-px bg-border" />
            {pipeline.map((s, i) => {
              const Icon = s.icon;
              const done = s.status === "done";
              const running = s.status === "running";
              return (
                <motion.li
                  key={s.key}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="relative flex gap-3"
                >
                  <div className={`relative z-10 h-8 w-8 shrink-0 rounded-full grid place-items-center border ${
                    done ? "bg-primary/15 border-primary/40 text-primary" : running ? "bg-primary/10 border-primary text-primary" : "bg-card border-border text-muted-foreground"
                  }`}>
                    {done ? <Check className="h-4 w-4" /> : running ? <Loader2 className="h-4 w-4 animate-spin" /> : <Icon className="h-3.5 w-3.5" />}
                    {running && <span className="absolute inset-0 rounded-full bg-primary/30 animate-ping" />}
                  </div>
                  <div className="flex-1 min-w-0 pt-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{s.label}</p>
                      <span className={`text-[10px] uppercase tracking-wider ${done ? "text-primary" : running ? "text-primary" : "text-muted-foreground"}`}>{s.status}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{s.detail}</p>
                  </div>
                </motion.li>
              );
            })}
          </ol>
        </Card>
      </div>

      <Card className="mt-4 p-6">
        <SectionHeader title="YouTube URL" description="Paste a YouTube link for analysis" />
        <div className="flex gap-2">
          <input
            placeholder="https://youtube.com/watch?v=…"
            className="flex-1 rounded-md border border-border bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary/60"
            onKeyDown={async (e) => {
              if (e.key === "Enter" && (e.target as HTMLInputElement).value) {
                setStep("processing");
                try {
                  const res = await apiPost(API_ENDPOINTS.analyze, { videoUrl: (e.target as HTMLInputElement).value });
                  if (!res.ok) { const err = await res.json(); throw new Error(err.error); }
                  setStep("done");
                } catch (err: any) {
                  setError(err.message);
                  setStep("error");
                }
              }
            }}
          />
          <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">Analyze</button>
        </div>
      </Card>
    </AppShell>
  );
}
