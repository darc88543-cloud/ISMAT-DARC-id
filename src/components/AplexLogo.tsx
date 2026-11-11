import React from 'react';

interface AplexLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
  subtext?: string;
}

export const AplexLogo: React.FC<AplexLogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
  subtext,
}) => {
  const iconDimensions = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
    xl: 'w-14 h-14',
  }[size];

  const textStyles = {
    sm: 'text-base tracking-wider',
    md: 'text-xl tracking-wider',
    lg: 'text-2xl tracking-widest',
    xl: 'text-3xl tracking-widest',
  }[size];

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Dynamic Geometric APLEX Shield & Apex Monogram */}
      <div className={`relative ${iconDimensions} shrink-0`}>
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-[0_0_12px_rgba(0,230,118,0.45)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="aplexEmblemGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00F5D4" />
              <stop offset="50%" stopColor="#00E676" />
              <stop offset="100%" stopColor="#00C853" />
            </linearGradient>
            <linearGradient id="shieldBgGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0e3a24" />
              <stop offset="100%" stopColor="#05190f" />
            </linearGradient>
          </defs>

          {/* Shield Base */}
          <path
            d="M 50 8 
               L 84 22 
               L 84 56 
               C 84 76, 50 94, 50 94 
               C 50 94, 16 76, 16 56 
               L 16 22 Z"
            fill="url(#shieldBgGrad)"
            stroke="#165b38"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />

          {/* Glowing Ambient Core */}
          <circle cx="50" cy="50" r="22" fill="#00e676" opacity="0.2" filter="blur(4px)" />

          {/* Apex "A" Stylized Monogram */}
          {/* Left Wing */}
          <path
            d="M 50 20 L 32 72 L 42 72 L 47 57 L 53 57 L 50 44 Z"
            fill="url(#aplexEmblemGrad)"
          />
          {/* Right Wing */}
          <path
            d="M 50 20 L 68 72 L 58 72 L 53 57 L 47 57 L 50 44 Z"
            fill="url(#aplexEmblemGrad)"
            opacity="0.9"
          />

          {/* Apex Center Spark */}
          <polygon points="50,26 55,37 50,42 45,37" fill="#ffffff" />

          {/* Tech Blade Chevron Underneath */}
          <path
            d="M 43 77 L 50 82 L 57 77"
            stroke="#00F5D4"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-black uppercase text-transparent bg-clip-text bg-gradient-to-r from-white via-[#e8fbf2] to-[#00e676] ${textStyles}`}
            >
              APLEX
            </span>
          </div>
          {subtext && (
            <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-400/80 -mt-0.5">
              {subtext}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
