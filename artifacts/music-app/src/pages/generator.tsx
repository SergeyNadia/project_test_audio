import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useGenerateMusic } from "@workspace/api-client-react";
import { useMusicSession } from "@/hooks/use-music-session";
import { ActiveTask } from "@/components/active-task";
import { AudioPlayer } from "@/components/audio-player";
import { Music, Plus, History } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function GeneratorPage() {
  const [prompt, setPrompt] = useState("");
  const { history, activeTaskId, addTask, updateTask, setActiveTaskId } = useMusicSession();
  const generateMutation = useGenerateMusic();

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    
    generateMutation.mutate({ data: { prompt } }, {
      onSuccess: (data) => {
        addTask(data);
        setPrompt(""); // Clear input on success
      },
    });
  };

  return (
    <div className="flex-1 w-full flex flex-col md:flex-row overflow-hidden max-h-[calc(100vh-64px)]">
      
      {/* Main Generation Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
        <div className="max-w-3xl mx-auto space-y-10">
          
          {/* Prompt Input Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div>
              <h2 className="text-3xl font-display font-bold mb-2">What do you want to hear?</h2>
              <p className="text-muted-foreground">Describe the genre, mood, instruments, and tempo.</p>
            </div>
            
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 to-accent/50 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
              <Textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., A cinematic orchestral piece with slow strings building up to a dramatic brass climax..."
                className="relative z-10 min-h-[140px] text-lg"
                disabled={generateMutation.isPending || !!(activeTaskId && history.find(t => t.taskId === activeTaskId)?.status !== "complete")}
              />
            </div>

            <div className="flex justify-end">
              <Button 
                size="lg" 
                onClick={handleGenerate} 
                disabled={!prompt.trim() || generateMutation.isPending}
                isLoading={generateMutation.isPending}
                className="w-full md:w-auto"
              >
                {!generateMutation.isPending && <Music className="w-5 h-5 mr-2" />}
                Generate Music
              </Button>
            </div>
          </motion.div>

          {/* Active Generation Status */}
          <AnimatePresence mode="popLayout">
            {activeTaskId && (
              <ActiveTask 
                key={activeTaskId} 
                taskId={activeTaskId} 
                onComplete={updateTask} 
              />
            )}
          </AnimatePresence>

          {/* Empty state when starting */}
          {!activeTaskId && history.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-20 text-center flex flex-col items-center justify-center border border-dashed border-white/10 rounded-3xl bg-white/5"
            >
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                <Music className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-1">No generations yet</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                Enter a prompt above and let the AI craft a unique soundscape for you.
              </p>
            </motion.div>
          )}
        </div>
      </div>

      {/* History Sidebar */}
      <div className="w-full md:w-80 lg:w-96 glass-panel border-l border-white/5 flex flex-col">
        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-background/50">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-primary" />
            <h3 className="font-display font-semibold text-lg">Session History</h3>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => {
              setActiveTaskId(null);
              setPrompt("");
            }}
            title="New Generation"
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {history.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground text-sm">
              Your generated tracks will appear here.
            </div>
          ) : (
            history.map((task) => (
              <motion.div 
                key={task.taskId}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  activeTaskId === task.taskId 
                    ? "bg-primary/10 border-primary/30" 
                    : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10"
                }`}
                onClick={() => setActiveTaskId(task.taskId)}
              >
                <div className="flex justify-between items-start mb-2">
                  <p className="text-sm font-medium text-foreground line-clamp-2 leading-snug">
                    {task.prompt}
                  </p>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className={`px-2 py-0.5 rounded-md ${
                    task.status === "complete" ? "bg-emerald-500/10 text-emerald-400" :
                    task.status === "error" ? "bg-destructive/10 text-destructive" :
                    "bg-blue-500/10 text-blue-400"
                  }`}>
                    {task.status}
                  </span>
                  <span className="text-muted-foreground">
                    {new Date(task.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
