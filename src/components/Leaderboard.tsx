import { motion } from "motion/react";
import { Users, Globe2, Trophy, ArrowUpRight } from "lucide-react";
import { CountryStat } from "../types";

interface LeaderboardProps {
  stats: CountryStat[];
}

export function Leaderboard({ stats }: LeaderboardProps) {
  if (stats.length === 0) return null;

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 relative">
      <div className="absolute inset-0 bg-cyan-500/10 blur-3xl rounded-full" />
      
      <div className="relative bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-400">
              <Globe2 className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-medium text-slate-100">Global Distribution</h2>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Users className="w-4 h-4" />
            <span>{stats.reduce((acc, stat) => acc + stat.count, 0)} Total Members</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-900/30 text-xs uppercase tracking-wider text-slate-500 border-b border-slate-800">
              <tr>
                <th className="px-6 py-4 font-medium">Rank</th>
                <th className="px-6 py-4 font-medium">Country</th>
                <th className="px-6 py-4 font-medium text-right">Members</th>
                <th className="px-6 py-4 font-medium text-right">% of Club</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {stats.map((stat, index) => {
                const total = stats.reduce((acc, s) => acc + s.count, 0);
                const percentage = ((stat.count / total) * 100).toFixed(1);
                
                return (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    key={stat.code}
                    className="group hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {index < 3 ? (
                          <Trophy className={`w-4 h-4 ${
                            index === 0 ? 'text-yellow-400' : 
                            index === 1 ? 'text-slate-300' : 
                            'text-amber-600'
                          }`} />
                        ) : (
                          <span className="text-slate-500 font-mono text-sm w-4 text-center">
                            {index + 1}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl" role="img" aria-label={`Flag of ${stat.name}`}>
                          {stat.flag}
                        </span>
                        <span className="font-medium text-slate-200 group-hover:text-cyan-400 transition-colors">
                          {stat.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-mono text-slate-300 font-medium">{stat.count.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <span className="text-sm text-slate-400 font-mono">{percentage}%</span>
                        <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 1, delay: index * 0.05 + 0.3 }}
                            className="h-full bg-cyan-500 rounded-full"
                          />
                        </div>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
