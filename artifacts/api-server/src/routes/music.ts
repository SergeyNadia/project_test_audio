import { Router, type IRouter } from "express";
import { randomUUID } from "crypto";
import { GenerateMusicBody, GetTaskStatusParams, GetTaskStatusResponse } from "@workspace/api-zod";
import { logger } from "../lib/logger";

const router: IRouter = Router();

type TaskStatus = "pending" | "waking" | "generating" | "complete" | "error";

interface Task {
  taskId: string;
  status: TaskStatus;
  prompt: string;
  resultUrl: string | null;
  error: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// In-memory task store. In production, replace with a persistent store (DB, Redis, etc.)
const tasks = new Map<string, Task>();

/**
 * Mock GPU worker — simulates the async ML inference pipeline.
 *
 * Replace the `sleep()` calls below with real external HTTP calls to a GPU
 * service such as RunPod or Modal:
 *
 *   // ==== REPLACE THIS (RunPod example) ====
 *   // const response = await fetch("https://api.runpod.io/v2/<endpoint_id>/run", {
 *   //   method: "POST",
 *   //   headers: {
 *   //     "Authorization": `Bearer ${process.env.RUNPOD_API_KEY}`,
 *   //     "Content-Type": "application/json",
 *   //   },
 *   //   body: JSON.stringify({ input: { prompt } }),
 *   // });
 *   // const job = await response.json();
 *   // Poll job.id until status === "COMPLETED", then extract result URL
 *   // ========================================
 */
async function runMockGpuWorker(taskId: string, prompt: string): Promise<void> {
  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const update = (status: TaskStatus, extra: Partial<Task> = {}) => {
    const task = tasks.get(taskId);
    if (!task) return;
    tasks.set(taskId, { ...task, status, updatedAt: new Date(), ...extra });
    logger.info({ taskId, status }, "Task status updated");
  };

  // ==== MOCK: Cold start / waking up GPU (~3 seconds) ====
  // REPLACE: Start the job on RunPod/Modal here, then poll until GPU is ready
  update("waking");
  await sleep(3000);

  // ==== MOCK: Model inference (~10 seconds) ====
  // REPLACE: Poll the job status endpoint until inference completes
  update("generating");
  await sleep(10000);

  // ==== MOCK: Complete — attach a hardcoded sample audio URL ====
  // REPLACE: Extract the result URL from the completed GPU job response
  const sampleAudioUrl =
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";

  update("complete", { resultUrl: sampleAudioUrl });
}

// POST /generate — start a music generation task
router.post("/generate", async (req, res): Promise<void> => {
  const parsed = GenerateMusicBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { prompt } = parsed.data;
  const taskId = randomUUID();
  const now = new Date();

  const task: Task = {
    taskId,
    status: "pending",
    prompt,
    resultUrl: null,
    error: null,
    createdAt: now,
    updatedAt: now,
  };

  tasks.set(taskId, task);
  req.log.info({ taskId, prompt }, "Music generation task queued");

  // Fire-and-forget background task — does NOT block the HTTP response
  runMockGpuWorker(taskId, prompt).catch((err) => {
    logger.error({ taskId, err }, "GPU worker failed");
    const t = tasks.get(taskId);
    if (t) {
      tasks.set(taskId, {
        ...t,
        status: "error",
        error: "Generation failed",
        updatedAt: new Date(),
      });
    }
  });

  res.status(202).json(
    GetTaskStatusResponse.parse(task)
  );
});

// GET /status/:taskId — poll the current task status
router.get("/status/:taskId", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.taskId)
    ? req.params.taskId[0]
    : req.params.taskId;
  const params = GetTaskStatusParams.safeParse({ taskId: raw });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const task = tasks.get(params.data.taskId);
  if (!task) {
    res.status(404).json({ error: "Task not found" });
    return;
  }

  res.json(GetTaskStatusResponse.parse(task));
});

export default router;
