import { motion } from 'framer-motion';

// Ilustrasi masalah: revisi kusut, biaya yang membengkak, tanda tanya yang bergoyang.
export default function ProblemArt({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 170" className={className} role="img" aria-label="Coretan kusut dan tanda tanya yang menggambarkan revisi yang membingungkan">
      <defs>
        <linearGradient id="pa-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFF4E5" /><stop offset="1" stopColor="#FDE3E3" />
        </linearGradient>
      </defs>
      <rect width="200" height="170" rx="20" fill="url(#pa-bg)" />
      <motion.path
        d="M52 70 C20 40 90 20 100 52 C112 88 36 96 50 60 C62 30 128 38 124 72 C120 104 64 108 70 76"
        fill="none" stroke="#E5484D" strokeWidth="3.2" strokeLinecap="round"
        animate={{ pathLength: [0, 1, 1, 0] }} transition={{ duration: 5, repeat: Infinity, times: [0, 0.45, 0.85, 1], ease: 'easeInOut' }}
      />
      <motion.text
        x="148" y="82" fontSize="64" fontWeight="800" fill="#0B3A66" textAnchor="middle" fontFamily="Sora, sans-serif"
        style={{ transformOrigin: '148px 60px' }} animate={{ rotate: [-8, 8, -8] }} transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
      >
        ?
      </motion.text>
      {[['Rp', 40, 0], ['Rp', 92, 1.1], ['Rp', 140, 2.2]].map(([t, x, d]) => (
        <motion.g key={String(x)} animate={{ y: [150, 96], opacity: [0, 1, 0] }} transition={{ duration: 3.3, repeat: Infinity, delay: d as number, ease: 'easeOut' }}>
          <rect x={(x as number) - 16} y="0" width="32" height="20" rx="10" fill="#E5484D" />
          <text x={x as number} y="14" fontSize="11" fontWeight="800" fill="#fff" textAnchor="middle">{t} ↑</text>
        </motion.g>
      ))}
    </svg>
  );
}
