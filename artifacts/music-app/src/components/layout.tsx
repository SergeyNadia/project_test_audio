import { ReactNode } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "./ui/button";
import { Disc3, LogOut, User } from "lucide-react";
import { motion } from "framer-motion";

export function Layout({ children }: { children: ReactNode }) {
  const { data: user } = useAuth();

  const handleSignOut = () => {
    window.location.href = "/api/logout";
  };

  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute top-0 left-1/4 w-full h-full max-w-4xl opacity-20 pointer-events-none blur-[120px] bg-gradient-to-br from-primary/40 via-transparent to-background rounded-full mix-blend-screen" />
      
      <header className="relative z-10 border-b border-white/5 bg-background/50 backdrop-blur-xl">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
              <Disc3 className="w-5 h-5 text-white" />
            </div>
            <h1 className="font-display font-bold text-xl tracking-tight">Sonic<span className="text-primary">AI</span></h1>
          </motion.div>

          {user && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4"
            >
              <div className="flex items-center gap-2 text-sm text-muted-foreground bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                <User className="w-4 h-4" />
                <span>{user.firstName ?? user.email ?? "User"}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-muted-foreground hover:text-white">
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </motion.div>
          )}
        </div>
      </header>

      <main className="flex-1 relative z-10 flex">
        {children}
      </main>
    </div>
  );
}
