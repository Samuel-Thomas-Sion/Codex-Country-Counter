import { motion } from "motion/react";
import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  progress: number;
  total: number;
  message: string;
}

export function LoadingState({ progress, total, message }: LoadingStateProps) {
  const percentage = total > 0 ? Math.round((progress / total) * 100) : 0;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="w-full max-w-md mx-auto mt-12 p-8 bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl flex flex-col items-center justify-center text-center space-y-6 shadow-xl relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5" />
      
      <div className="relative">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-16 h-16 border-4 border-slate-800 border-t-cyan-500 rounded-full" />
        </motion.div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="w-6 h-6 text-cyan-400 animate-spin" />
        </div>
      </div>

      <div className="space-y-2 relative w-full z-10">
        <h3 className="text-lg font-medium text-slate-200">{message}</h3>
        {total > 0 && (
          <div className="space-y-3">
            <p className="text-sm text-slate-400 font-mono">
              {progress} / {total} members analyzed
            </p>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ ease: "easeOut" }}
              />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
