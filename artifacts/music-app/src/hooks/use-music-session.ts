import { useState, useCallback } from "react";
import type { TaskStatus } from "@workspace/api-client-react";

// Manages local history of generations for the current session
export function useMusicSession() {
  const [history, setHistory] = useState<TaskStatus[]>([]);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  const addTask = useCallback((task: TaskStatus) => {
    setHistory((prev) => {
      // Don't add duplicates
      if (prev.some(t => t.taskId === task.taskId)) return prev;
      return [task, ...prev];
    });
    setActiveTaskId(task.taskId);
  }, []);

  const updateTask = useCallback((updatedTask: TaskStatus) => {
    setHistory((prev) =>
      prev.map((t) => (t.taskId === updatedTask.taskId ? updatedTask : t))
    );
  }, []);

  return {
    history,
    activeTaskId,
    setActiveTaskId,
    addTask,
    updateTask,
  };
}
