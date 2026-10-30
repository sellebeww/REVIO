import React from 'react';

export interface RevioLogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  variant?: 'full' | 'mark' | 'white';
  layout?: 'auto' | 'horizontal' | 'stacked';
  showTagline?: boolean;
  useImage?: boolean;
}

export const RevioLogo: React.FC<RevioLogoProps> = ({
  className = '',
  size = 'md',
  variant = 'full',
  layout = 'auto',
  showTagline = false,
  useImage = true,
}) => {
  // Balanced dimensions: compact and sleek for navbars, bold for hero
  const dimensions = {
    xs: { h: 'h-6', iconH: 'h-5', iconSize: 20, text: 'text-sm font-bold', badge: 'text-[9px]' },
    sm: { h: 'h-8', iconH: 'h-7', iconSize: 28, text: 'text-lg font-bold', badge: 'text-[10px]' },
    md: { h: 'h-10', iconH: 'h-9', iconSize: 36, text: 'text-xl font-bold', badge: 'text-[11px]' },
    lg: { h: 'h-16', iconH: 'h-14', iconSize: 56, text: 'text-3xl font-extrabold', badge: 'text-xs' },
    xl: { h: 'h-28 sm:h-36', iconH: 'h-22 sm:h-28', iconSize: 96, text: 'text-4xl sm:text-5xl font-extrabold', badge: 'text-sm' },
    '2xl': { h: 'h-40 sm:h-48', iconH: 'h-32 sm:h-40', iconSize: 130, text: 'text-5xl sm:text-6xl font-black', badge: 'text-base' },
  }[size];

  // If white variant requested (e.g. for dark backdrops)
  const isWhite = variant === 'white';
  const textColor = isWhite ? 'text-white' : 'text-[#112A46]';

  // Mark only variant (transparent folded R refresh icon)
  if (variant === 'mark') {
    return (
      <div className={`inline-flex items-center justify-center bg-transparent select-none ${className}`}>
        {useImage && !isWhite ? (
          <img
            src="/brand/revio-mark-transparent.png"
            alt="Revio Mark"
            className={`${dimensions.iconH} w-auto object-contain bg-transparent mix-blend-multiply drop-shadow-xs hover:scale-105 transition-transform duration-200`}
            loading="eager"
            referrerPolicy="no-referrer"
          />
        ) : (
          <svg
            width={dimensions.iconSize}
            height={dimensions.iconSize}
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="transition-transform duration-300 hover:rotate-3"
          >
            <path
              d="M72 38H115C136 38 150 50 150 72C150 88 139 100 122 104L156 160H124L94 108H72V160H46V38H72ZM72 86H112C122 86 128 80 128 72C128 64 122 58 112 58H72V86Z"
              fill={isWhite ? '#FFFFFF' : '#112A46'}
            />
            <path
              d="M46 68C46 50 56 38 74 38C90 38 106 48 106 68C106 88 88 104 68 114C52 122 46 136 46 156C46 126 58 102 78 86C60 86 46 78 46 68Z"
              fill="url(#revioTealGrad)"
            />
            <g transform="translate(136, 122) scale(0.72)">
              <path
                d="M24 4C13 4 4 13 4 24C4 28 5.2 31.8 7.3 35L1 35L10 44L19 35L12.5 35C10.9 31.8 10 28.1 10 24C10 16.3 16.3 10 24 10C28.2 10 32 11.9 34.6 14.8L39 10.4C35.2 6.5 30 4 24 4Z"
                fill="#4EBA97"
              />
              <path
                d="M24 44C35 44 44 35 44 24C44 20 42.8 16.2 40.7 13L47 13L38 4L29 13L35.5 13C37.1 16.2 38 19.9 38 24C38 31.7 31.7 38 24 38C19.8 38 16 36.1 13.4 33.2L9 37.6C12.8 41.5 18 44 24 44Z"
                fill="#4EBA97"
              />
            </g>
            <defs>
              <linearGradient id="revioTealGrad" x1="46" y1="38" x2="106" y2="156" gradientUnits="userSpaceOnUse">
                <stop stopColor="#55C9A4" />
                <stop offset="1" stopColor="#268369" />
              </linearGradient>
            </defs>
          </svg>
        )}
      </div>
    );
  }

  // Horizontal layout (Mark + Clean Brand Typography side by side)
  if (layout === 'horizontal') {
    return (
      <div className={`inline-flex items-center gap-3 bg-transparent select-none ${className}`}>
        <img
          src="/brand/revio-mark-transparent.png"
          alt="Revio Mark"
          className={`${dimensions.iconH} w-auto object-contain bg-transparent mix-blend-multiply drop-shadow-xs hover:scale-105 transition-transform duration-200`}
          loading="eager"
          referrerPolicy="no-referrer"
        />
        <div className="flex flex-col">
          <div className="flex items-center tracking-tight">
            <span className={`font-display font-black tracking-tight ${dimensions.text} ${textColor}`}>
              Rev<span className="relative">i<span className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#4EBA97]" /></span>o
            </span>
          </div>
          {showTagline && (
            <span className={`text-[#5E6678] font-medium -mt-1 tracking-tight ${dimensions.badge}`}>
              Hak Revisi & Biaya Produksi
            </span>
          )}
        </div>
      </div>
    );
  }

  // Full Logo Layout (Official Lockup with no background, perfectly transparent)
  return (
    <div className={`inline-flex flex-col items-center justify-center bg-transparent select-none ${className}`}>
      {useImage && !isWhite ? (
        <img
          src="/brand/revio-logo-transparent.png"
          alt="Revio"
          className={`${dimensions.h} w-auto object-contain bg-transparent mix-blend-multiply drop-shadow-xs hover:scale-[1.02] transition-transform duration-200`}
          loading="eager"
          referrerPolicy="no-referrer"
        />
      ) : (
        <div className="inline-flex items-center gap-3">
          <svg
            width={dimensions.iconSize}
            height={dimensions.iconSize}
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M72 38H115C136 38 150 50 150 72C150 88 139 100 122 104L156 160H124L94 108H72V160H46V38H72ZM72 86H112C122 86 128 80 128 72C128 64 122 58 112 58H72V86Z"
              fill={isWhite ? '#FFFFFF' : '#112A46'}
            />
            <path
              d="M46 68C46 50 56 38 74 38C90 38 106 48 106 68C106 88 88 104 68 114C52 122 46 136 46 156C46 126 58 102 78 86C60 86 46 78 46 68Z"
              fill="url(#revioTealGradFull)"
            />
            <g transform="translate(136, 122) scale(0.72)">
              <path
                d="M24 4C13 4 4 13 4 24C4 28 5.2 31.8 7.3 35L1 35L10 44L19 35L12.5 35C10.9 31.8 10 28.1 10 24C10 16.3 16.3 10 24 10C28.2 10 32 11.9 34.6 14.8L39 10.4C35.2 6.5 30 4 24 4Z"
                fill="#4EBA97"
              />
              <path
                d="M24 44C35 44 44 35 44 24C44 20 42.8 16.2 40.7 13L47 13L38 4L29 13L35.5 13C37.1 16.2 38 19.9 38 24C38 31.7 31.7 38 24 38C19.8 38 16 36.1 13.4 33.2L9 37.6C12.8 41.5 18 44 24 44Z"
                fill="#4EBA97"
              />
            </g>
            <defs>
              <linearGradient id="revioTealGradFull" x1="46" y1="38" x2="106" y2="156" gradientUnits="userSpaceOnUse">
                <stop stopColor="#55C9A4" />
                <stop offset="1" stopColor="#268369" />
              </linearGradient>
            </defs>
          </svg>
          <div className="flex flex-col">
            <span className={`font-display font-extrabold tracking-tight ${dimensions.text} ${textColor}`}>
              Rev<span className="relative">i<span className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#4EBA97]" /></span>o
            </span>
          </div>
        </div>
      )}
      {showTagline && (
        <span className={`text-[#5E6678] font-medium tracking-tight mt-1 text-center ${dimensions.badge}`}>
          Hak Revisi & Biaya Produksi
        </span>
      )}
    </div>
  );
};

export default RevioLogo;
