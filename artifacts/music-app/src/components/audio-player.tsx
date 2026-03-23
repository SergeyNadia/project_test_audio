import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, Download } from "lucide-react";
import { Button } from "./ui/button";

export function AudioPlayer({ src, title }: { src: string; title: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setProgress(value);
    if (audioRef.current) {
      audioRef.current.currentTime = (value / 100) * audioRef.current.duration;
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.addEventListener('ended', () => setIsPlaying(false));
      return () => audio.removeEventListener('ended', () => setIsPlaying(false));
    }
  }, []);

  return (
    <div className="glass-card rounded-2xl p-6 overflow-hidden relative group">
      {/* Decorative gradient blur behind player */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      
      <div className="relative z-10 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <Volume2 className="w-6 h-6 text-primary" />
            </div>
            <div className="truncate">
              <h4 className="font-semibold text-foreground truncate">{title || "Generated Track"}</h4>
              <p className="text-xs text-muted-foreground">AI Generated</p>
            </div>
          </div>
          
          <Button variant="ghost" size="icon" asChild>
            <a href={src} download="generated-track.mp3" target="_blank" rel="noreferrer">
              <Download className="w-5 h-5 text-muted-foreground hover:text-white" />
            </a>
          </Button>
        </div>

        <audio 
          ref={audioRef} 
          src={src} 
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          preload="metadata"
        />

        <div className="flex items-center gap-4">
          <Button 
            variant="default" 
            size="icon" 
            onClick={togglePlay}
            className="rounded-full w-12 h-12 flex-shrink-0"
          >
            {isPlaying ? <Pause className="w-5 h-5" fill="currentColor" /> : <Play className="w-5 h-5 ml-1" fill="currentColor" />}
          </Button>

          <div className="flex flex-col w-full gap-1">
            <input
              type="range"
              min="0"
              max="100"
              value={progress || 0}
              onChange={handleSeek}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
              style={{
                background: `linear-gradient(to right, var(--color-primary) ${progress}%, rgba(255,255,255,0.1) ${progress}%)`
              }}
            />
            <div className="flex justify-between text-xs text-muted-foreground font-mono mt-1">
              <span>{formatTime((progress / 100) * duration)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
