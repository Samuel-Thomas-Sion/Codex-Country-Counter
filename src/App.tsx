import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, ChevronRight, BarChart3, AlertCircle } from "lucide-react";
import { Leaderboard } from "./components/Leaderboard";
import { LoadingState } from "./components/LoadingState";
import { CountryStat, ClubMembersResponse, PlayerProfile } from "./types";
import { extractUsernames, getCountryName, getFlagEmoji } from "./utils";

type AppState = 'idle' | 'fetching_members' | 'analyzing' | 'complete' | 'error';

export default function App() {
  const [appState, setAppState] = useState<AppState>('idle');
  const [stats, setStats] = useState<CountryStat[]>([]);
  const [progress, setProgress] = useState(0);
  const [total, setTotal] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  const analyzeDemographics = useCallback(async () => {
    try {
      setAppState('fetching_members');
      setErrorMessage("");
      setStats([]);
      setProgress(0);
      setTotal(0);

      // Fetch club members
      const clubRes = await fetch("https://api.chess.com/pub/club/the-codex/members");
      if (!clubRes.ok) throw new Error("Failed to fetch club members.");
      const clubData: ClubMembersResponse = await clubRes.json();
      
      const usernames = extractUsernames(clubData);
      setTotal(usernames.length);
      setAppState('analyzing');

      // Fetch profiles in batches to avoid overwhelming the API
      const BATCH_SIZE = 15;
      const countryCounts: Record<string, number> = {};
      let completed = 0;

      for (let i = 0; i < usernames.length; i += BATCH_SIZE) {
        const batch = usernames.slice(i, i + BATCH_SIZE);
        const promises = batch.map(async (username) => {
          try {
            const res = await fetch(`https://api.chess.com/pub/player/${username}`);
            if (res.ok) {
              const profile: PlayerProfile = await res.json();
              const countryUrl = profile.country;
              // Extract country code from URL (e.g., https://api.chess.com/pub/country/US)
              const countryCode = countryUrl ? countryUrl.split('/').pop() : 'XX';
              const code = countryCode || 'XX';
              
              if (countryCounts[code]) {
                countryCounts[code]++;
              } else {
                countryCounts[code] = 1;
              }
            }
          } catch (e) {
            // Ignore individual profile fetch errors to keep progressing
          }
        });

        await Promise.all(promises);
        completed += batch.length;
        setProgress(Math.min(completed, usernames.length));
      }

      // Convert to array and sort
      const finalStats: CountryStat[] = Object.entries(countryCounts)
        .map(([code, count]) => ({
          code,
          name: getCountryName(code),
          flag: getFlagEmoji(code),
          count,
        }))
        .sort((a, b) => b.count - a.count);

      setStats(finalStats);
      setAppState('complete');
    } catch (err: any) {
      setAppState('error');
      setErrorMessage(err.message || "An unexpected error occurred.");
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-cyan-500/30">
      <div className="max-w-6xl mx-auto px-4 py-12 md:py-20">
        
        {/* Header Section */}
        <header className="text-center space-y-6 mb-16 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-cyan-500/20 blur-[120px] rounded-full pointer-events-none" />
          
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold tracking-tight text-white"
          >
            Club Demographics
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 max-w-2xl mx-auto text-lg"
          >
            Analyze and map the geographic distribution of members in the <span className="text-slate-200 font-medium border-b border-dashed border-slate-600">the-codex</span> club.
          </motion.p>
        </header>

        {/* Action / State Area */}
        <div className="flex flex-col items-center min-h-[400px]">
          <AnimatePresence mode="wait">
            
            {appState === 'idle' && (
              <motion.div
                key="idle"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="pt-8"
              >
                <button
                  onClick={analyzeDemographics}
                  className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-cyan-500 text-slate-950 font-semibold rounded-2xl overflow-hidden transition-transform hover:scale-105 active:scale-95 shadow-[0_0_40px_-10px_rgba(6,182,212,0.5)]"
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                  <BarChart3 className="w-5 h-5 relative z-10" />
                  <span className="relative z-10 text-lg">Analyze Global Demographics</span>
                  <ChevronRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            )}

            {appState === 'fetching_members' && (
              <LoadingState key="fetching" progress={0} total={0} message="Locating club members..." />
            )}

            {appState === 'analyzing' && (
              <LoadingState key="analyzing" progress={progress} total={total} message="Analyzing geographic profiles..." />
            )}

            {appState === 'error' && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="w-full max-w-md p-6 bg-red-500/10 border border-red-500/20 rounded-2xl text-center space-y-4 mt-8"
              >
                <AlertCircle className="w-8 h-8 text-red-400 mx-auto" />
                <div className="space-y-1">
                  <h3 className="text-red-400 font-medium">Analysis Failed</h3>
                  <p className="text-sm text-red-400/80">{errorMessage}</p>
                </div>
                <button 
                  onClick={() => setAppState('idle')}
                  className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors mt-4"
                >
                  Try Again
                </button>
              </motion.div>
            )}

            {appState === 'complete' && (
              <motion.div
                key="complete"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full"
              >
                <div className="flex justify-center mb-8">
                  <button 
                    onClick={() => setAppState('idle')}
                    className="text-sm font-medium text-slate-400 hover:text-cyan-400 transition-colors flex items-center gap-2"
                  >
                    <Search className="w-4 h-4" />
                    New Analysis
                  </button>
                </div>
                <Leaderboard stats={stats} />
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
