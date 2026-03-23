import { useEffect } from "react";
import { useGetTaskStatus } from "@workspace/api-client-react";
import { StatusStepper } from "./status-stepper";
import { AudioPlayer } from "./audio-player";
import { motion } from "framer-motion";

interface ActiveTaskProps {
  taskId: string;
  onComplete: (task: any) => void;
}

export function ActiveTask({ taskId, onComplete }: ActiveTaskProps) {
  const { data: task, error } = useGetTaskStatus(taskId, {
    query: {
      // Poll every 2 seconds until complete or error
      refetchInterval: (query) => {
        const state = query.state.data?.status;
        if (state === "complete" || state === "error") return false;
        return 2000;
      },
    }
  });

  // Call onComplete when done so parent can update history
  useEffect(() => {
    if (task && (task.status === "complete" || task.status === "error")) {
      onComplete(task);
    }
  }, [task?.status, task, onComplete]);

  if (error) {
    return (
      <div className="text-destructive p-4 border border-destructive/20 bg-destructive/10 rounded-xl">
        Failed to fetch task status.
      </div>
    );
  }

  if (!task) {
    return <div className="animate-pulse h-32 bg-white/5 rounded-2xl w-full"></div>;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-3 px-2">
        <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Current Generation
        </h3>
      </div>
      
      <StatusStepper status={task.status} error={task.error} />

      {task.status === "complete" && task.resultUrl && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <AudioPlayer src={task.resultUrl} title={task.prompt} />
        </motion.div>
      )}
    </motion.div>
  );
}
