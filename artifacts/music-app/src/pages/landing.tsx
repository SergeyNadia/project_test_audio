import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Disc3, Headphones, Sparkles, Zap } from "lucide-react";

export function LandingPage() {
  const handleSignIn = () => {
    window.location.href = "/api/login?returnTo=/";
  };

  return (
    <div className="min-h-screen w-full bg-background relative flex items-center justify-center overflow-hidden">
      {/* Immersive background image from requirements */}
      <div 
        className="absolute inset-0 z-0 opacity-40 mix-blend-screen transition-opacity duration-1000"
        style={{
          backgroundImage: `url(${import.meta.env.BASE_URL}images/ambient-bg.png)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(8px)',
        }}
      />
      
      {/* Vignette overlay for depth */}
      <div className="absolute inset-0 z-0 bg-radial-gradient from-transparent via-background/80 to-background" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-20 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary to-[#a78bfa] flex items-center justify-center shadow-2xl shadow-primary/30 mb-8"
        >
          <Disc3 className="w-10 h-10 text-white" />
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-5xl md:text-7xl font-bold tracking-tight text-foreground mb-6"
        >
          Compose with <span className="text-gradient-primary">Intelligence</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-12 leading-relaxed"
        >
          Transform your text descriptions into high-fidelity ambient soundscapes, beats, and melodies in seconds using our advanced neural audio engine.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Button size="lg" onClick={handleSignIn} className="group">
            Start Creating Free
            <Sparkles className="w-4 h-4 ml-2 group-hover:text-yellow-300 transition-colors" />
          </Button>
          <Button size="lg" variant="glass" onClick={handleSignIn}>
            View Examples
          </Button>
        </motion.div>

        {/* Feature Highlights */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 w-full"
        >
          <div className="glass-card p-6 rounded-2xl text-left">
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mb-4 text-primary">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Lightning Fast</h3>
            <p className="text-sm text-muted-foreground">Our clustered GPU architecture returns pristine audio in under 2 minutes.</p>
          </div>
          <div className="glass-card p-6 rounded-2xl text-left">
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mb-4 text-primary">
              <Headphones className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Studio Quality</h3>
            <p className="text-sm text-muted-foreground">Generated at 48kHz stereo, ready for immediate inclusion in your DAW.</p>
          </div>
          <div className="glass-card p-6 rounded-2xl text-left">
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mb-4 text-primary">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Endless Variety</h3>
            <p className="text-sm text-muted-foreground">From lo-fi beats to orchestral sweeps, limited only by your imagination.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
