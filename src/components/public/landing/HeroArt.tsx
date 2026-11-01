import { motion } from 'framer-motion';

// Ilustrasi hero vektor: dokumen revisi, pita yang mengalir, perisai terverifikasi.
// SVG murni supaya tetap tajam di layar apa pun, dan dianimasikan lewat framer-motion.
const SPARKS: [number, number, number, number][] = [
  [70, 80, 16, 0], [410, 120, 11, 0.8], [90, 350, 9, 1.6], [420, 330, 13, 0.4],
];

export default function HeroArt({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 480 440" className={className} role="img" aria-label="Dokumen revisi berlogo R dikelilingi pita hijau dengan perisai terverifikasi">
      <defs>
        <linearGradient id="ha-doc" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFFFFF" /><stop offset="1" stopColor="#E3EEFF" />
        </linearGradient>
        <linearGradient id="ha-green" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#0E9F8E" /><stop offset="1" stopColor="#22C55E" />
        </linearGradient>
        <linearGradient id="ha-navy" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#0A2A4D" /><stop offset="1" stopColor="#1F66B5" />
        </linearGradient>
        <linearGradient id="ha-shield" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#34D399" /><stop offset="1" stopColor="#0E9F6E" />
        </linearGradient>
        <radialGradient id="ha-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#0E9F8E" stopOpacity=".28" /><stop offset="1" stopColor="#0E9F8E" stopOpacity="0" />
        </radialGradient>
        <filter id="ha-shadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="18" stdDeviation="16" floodColor="#0B3A66" floodOpacity=".28" />
        </filter>
      </defs>

      <motion.ellipse
        cx="240" cy="398" rx="170" ry="22" fill="url(#ha-glow)"
        animate={{ opacity: [0.6, 1, 0.6], scaleX: [0.94, 1.04, 0.94] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: '240px 398px' }}
      />

      <motion.g animate={{ y: [0, -10, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}>
        <g transform="rotate(-22 240 220)">
          <path d="M62 220 A178 66 0 0 1 418 220" fill="none" stroke="url(#ha-navy)" strokeWidth="26" strokeLinecap="round" />
        </g>

        <g filter="url(#ha-shadow)">
          <path d="M150 50 H292 L350 108 V330 a16 16 0 0 1 -16 16 H150 a16 16 0 0 1 -16 -16 V66 a16 16 0 0 1 16 -16Z" fill="url(#ha-doc)" stroke="#FFFFFF" strokeWidth="2" />
          <path d="M292 50 V92 a16 16 0 0 0 16 16 H350Z" fill="#CFE0F7" />
        </g>
        <image href="/brand/revio-mark-transparent.png" x="158" y="96" width="150" height="86" preserveAspectRatio="xMidYMid meet" />
        {[0, 1, 2].map((i) => (
          <motion.rect
            key={i} x="158" y={222 + i * 26} height="9" rx="4.5" fill={i === 0 ? '#2F6FD0' : '#9DB8E6'}
            initial={{ width: 0 }} animate={{ width: 150 - i * 34 }}
            transition={{ duration: 1.1, delay: 0.5 + i * 0.25, ease: 'easeOut' }}
          />
        ))}

        <g transform="rotate(-22 240 220)">
          <path d="M62 220 A178 66 0 0 0 418 220" fill="none" stroke="url(#ha-green)" strokeWidth="26" strokeLinecap="round" />
          <motion.path
            d="M62 220 A178 66 0 0 0 418 220" fill="none" stroke="#FFFFFF" strokeOpacity=".7"
            strokeWidth="5" strokeLinecap="round" strokeDasharray="46 520"
            animate={{ strokeDashoffset: [0, -566] }} transition={{ duration: 4.5, repeat: Infinity, ease: 'linear' }}
          />
        </g>

        <motion.g
          animate={{ scale: [1, 1.06, 1] }} transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '338px 290px' }}
        >
          <path d="M338 226 L384 244 V292 C384 322 364 340 338 352 C312 340 292 322 292 292 V244Z" fill="url(#ha-shield)" stroke="#FFFFFF" strokeWidth="5" filter="url(#ha-shadow)" />
          <motion.path
            d="M316 292 L333 309 L362 274" fill="none" stroke="#FFFFFF" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round"
            animate={{ pathLength: [0, 1, 1, 0] }} transition={{ duration: 4, repeat: Infinity, times: [0, 0.3, 0.8, 1], ease: 'easeInOut' }}
          />
        </motion.g>
      </motion.g>

      {SPARKS.map(([x, y, s, d], i) => (
        <motion.path
          key={i} d={`M${x} ${y - s} Q${x} ${y} ${x + s} ${y} Q${x} ${y} ${x} ${y + s} Q${x} ${y} ${x - s} ${y} Q${x} ${y} ${x} ${y - s}Z`}
          fill="#22C55E" style={{ transformOrigin: `${x}px ${y}px` }}
          animate={{ scale: [0.4, 1.15, 0.4], opacity: [0.3, 1, 0.3], rotate: [0, 45, 0] }}
          transition={{ duration: 3, repeat: Infinity, delay: d, ease: 'easeInOut' }}
        />
      ))}
    </svg>
  );
}
