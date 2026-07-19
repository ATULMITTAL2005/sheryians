import React from 'react';

export default function Logo({ className = '' }) {
  return (
    <span className={`logo ${className}`.trim()} aria-hidden="true">
      <svg viewBox="0 0 64 64" role="img" focusable="false">
        <defs>
          <linearGradient id="enqueueLogoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7cf2c6" />
            <stop offset="100%" stopColor="#88a6ff" />
          </linearGradient>
        </defs>
        <rect x="7" y="7" width="50" height="50" rx="18" fill="url(#enqueueLogoGradient)" />
        <path d="M20 21h24M20 32h18M20 43h24" stroke="#08111a" strokeWidth="4.8" strokeLinecap="round" />
        <path d="M42 31l6 6-6 6" stroke="#08111a" strokeWidth="4.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    </span>
  );
}