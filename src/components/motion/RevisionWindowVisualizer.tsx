import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Unlock, Eye, Sun, AlertTriangle } from 'lucide-react';

interface RevisionWindowVisualizerProps {
  initialProgress?: number; // 0 to 100 (stage progress)
  interactive?: boolean;
}

export const RevisionWindowVisualizer: React.FC<RevisionWindowVisualizerProps> = ({
  initialProgress = 35,
  interactive = true,
}) => {
  const [stageProgress, setStageProgress] = useState(initialProgress);

  // Remaining window aperture: 100% stage progress means 0% window open
  const apertureWidthPct = Math.max(0, 100 - stageProgress);
  const isLocked = apertureWidthPct <= 5;
  const isWarning = apertureWidthPct > 5 && apertureWidthPct < 40;

  return (
    <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#0E9F8E] bg-teal-950 px-2.5 py-0.5 rounded border border-teal-800">
            Animasi Signature #3: Jendela Revisi Menutup
          </span>
          <h3 className="font-display font-bold text-lg text-white mt-1">
            Simulasi Visual Jendela Revisi
          </h3>
          <p className="text-xs text-slate-400">
            Lihat bagaimana celah revisi perlahan merapat seiring kemajuan pekerjaan bengkel
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 ${
              isLocked
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                : isWarning
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
            }`}
          >
            {isLocked ? <Lock size={13} /> : <Unlock size={13} />}
            <span>{isLocked ? 'Jendela Tertutup (Terkunci)' : isWarning ? 'Jendela Menyempit!' : 'Jendela Terbuka Lebar'}</span>
          </span>
        </div>
      </div>

      {/* The Architectural Window Frame */}
      <div className="relative h-44 sm:h-52 w-full bg-slate-950 rounded-2xl overflow-hidden border-2 border-slate-700 flex items-center justify-center p-4">
        {/* Deep light coming from outside through the window opening */}
        <motion.div
          animate={{
            opacity: apertureWidthPct > 0 ? 0.3 + (apertureWidthPct / 100) * 0.7 : 0,
          }}
          className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-[#0E9F8E]/40 to-teal-400/20 pointer-events-none blur-xl"
        />

        {/* Left sliding mechanical shutter */}
        <motion.div
          animate={{ width: `${(100 - apertureWidthPct) / 2}%` }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="absolute left-0 top-0 bottom-0 bg-slate-800 border-r-2 border-slate-600 shadow-2xl flex flex-col justify-between p-3"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-slate-500" />
          <div className="w-4 h-12 rounded border border-slate-600 bg-slate-700 self-end mr-1" />
          <div className="w-1.5 h-1.5 rounded-full bg-slate-500" />
        </motion.div>

        {/* Right sliding mechanical shutter */}
        <motion.div
          animate={{ width: `${(100 - apertureWidthPct) / 2}%` }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="absolute right-0 top-0 bottom-0 bg-slate-800 border-l-2 border-slate-600 shadow-2xl flex flex-col justify-between p-3"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-slate-500" />
          <div className="w-4 h-12 rounded border border-slate-600 bg-slate-700 self-start ml-1" />
          <div className="w-1.5 h-1.5 rounded-full bg-slate-500" />
        </motion.div>

        {/* Center Light Aperture Area */}
        <div className="relative z-10 text-center space-y-1">
          {isLocked ? (
            <motion.div
              initial={{ scale: 0.5, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              className="inline-flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-900/90 border border-slate-700 text-rose-400 shadow-xl"
            >
              <Lock size={28} />
              <span className="text-xs font-bold mt-1 text-slate-300">
                Pintu Produksi Terkunci
              </span>
            </motion.div>
          ) : (
            <div className="text-center px-4 py-2 rounded-xl bg-slate-900/60 backdrop-blur-xs border border-white/10">
              <span className="font-mono text-2xl sm:text-3xl font-extrabold text-emerald-400 tabular-nums">
                {Math.round(apertureWidthPct)}%
              </span>
              <span className="text-xs text-slate-300 block font-semibold">
                Celah Revisi Terbuka
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Interactive slider controller */}
      {interactive && (
        <div className="space-y-3 pt-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400">Kemajuan Tahap Produksi Bengkel:</span>
            <span className="font-mono font-bold text-white bg-slate-800 px-2 py-0.5 rounded">
              {stageProgress}% Tahap Selesai
            </span>
          </div>

          <input
            type="range"
            min="0"
            max="100"
            value={stageProgress}
            onChange={(e) => setStageProgress(Number(e.target.value))}
            className="w-full accent-[#0E9F8E] cursor-pointer"
          />

          <div className="flex justify-between text-xs text-slate-500">
            <span>Awal (Desain / Pola: 100% Celah Bebas)</span>
            <span>Titik Kunci (Pemotongan / Semprot Melamik)</span>
            <span>Akhir (Terkunci Rapat)</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default RevisionWindowVisualizer;
