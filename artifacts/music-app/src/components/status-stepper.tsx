import { motion } from "framer-motion";
import { CheckCircle2, Clock, Cpu, Sparkles, XCircle } from "lucide-react";
import type { TaskStatusStatus } from "@workspace/api-client-react";
import { cn } from "@/lib/utils";

interface StepperProps {
  status: TaskStatusStatus;
  error?: string | null;
}

const STEPS = [
  { id: "pending", label: "Queueing", icon: Clock },
  { id: "waking", label: "Waking GPU", icon: Cpu },
  { id: "generating", label: "Synthesizing", icon: Sparkles },
  { id: "complete", label: "Complete", icon: CheckCircle2 },
];

export function StatusStepper({ status, error }: StepperProps) {
  if (status === "error") {
    return (
      <div className="p-6 rounded-2xl bg-destructive/10 border border-destructive/20 flex flex-col items-center justify-center text-center">
        <XCircle className="w-12 h-12 text-destructive mb-3" />
        <h3 className="text-lg font-bold text-destructive">Generation Failed</h3>
        <p className="text-destructive/80 mt-1">{error || "An unknown error occurred"}</p>
      </div>
    );
  }

  const currentStepIndex = STEPS.findIndex(s => s.id === status);
  // If status is complete, all steps are done. If it's something else, find its index.
  const activeIndex = status === "complete" ? STEPS.length - 1 : Math.max(0, currentStepIndex);

  return (
    <div className="glass-card p-8 rounded-2xl w-full">
      <div className="relative flex justify-between">
        {/* Connecting Line */}
        <div className="absolute top-5 left-6 right-6 h-0.5 bg-white/10 rounded-full z-0">
          <motion.div 
            className="absolute top-0 left-0 h-full bg-primary rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: `${(activeIndex / (STEPS.length - 1)) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>

        {STEPS.map((step, index) => {
          const isCompleted = index <= activeIndex;
          const isCurrent = index === activeIndex && status !== "complete";
          const Icon = step.icon;

          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center gap-3">
              <motion.div
                initial={false}
                animate={{
                  backgroundColor: isCompleted ? "var(--color-primary)" : "rgba(255,255,255,0.05)",
                  borderColor: isCurrent ? "var(--color-primary)" : isCompleted ? "var(--color-primary)" : "rgba(255,255,255,0.1)",
                  scale: isCurrent ? 1.1 : 1,
                }}
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center border-2 shadow-lg transition-colors duration-300",
                  isCurrent && "shadow-primary/40 shadow-xl",
                  isCompleted ? "text-primary-foreground" : "text-muted-foreground"
                )}
              >
                <Icon className={cn("w-5 h-5", isCurrent && "animate-pulse")} />
              </motion.div>
              <span className={cn(
                "text-xs font-medium transition-colors duration-300",
                isCurrent ? "text-primary" : isCompleted ? "text-foreground" : "text-muted-foreground"
              )}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
      
      {status !== "complete" && status !== "error" && (
        <div className="mt-8 text-center text-sm text-muted-foreground animate-pulse">
          This usually takes 1-2 minutes depending on load...
        </div>
      )}
    </div>
  );
}
