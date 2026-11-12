"use client";

import React from "react";

interface CountryFlagProps {
  iso: string;
  size?: number;
}

export function CountryFlag({ iso, size = 20 }: CountryFlagProps) {
  const code = iso.toUpperCase();

  return (
    <span
      className="inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-200/80 shadow-[0_0_0_1px_rgba(15,23,42,0.04)]"
      style={{ width: size, height: size }}
      aria-label={code}
      title={code}
    >
      <svg viewBox="0 0 24 24" width={size} height={size} className="block">
        {code === "IN" && (
          <>
            <rect width="24" height="8" y="0" fill="#FF9933" />
            <rect width="24" height="8" y="8" fill="#FFFFFF" />
            <rect width="24" height="8" y="16" fill="#138808" />
            <circle cx="12" cy="12" r="2.6" fill="none" stroke="#000080" strokeWidth="1.1" />
            <circle cx="12" cy="12" r="0.8" fill="#000080" />
          </>
        )}
        {code === "AU" && (
          <>
            <rect width="24" height="24" fill="#012169" />
            <rect width="12" height="10" fill="#012169" />
            <path d="M0 0 L12 10 M12 0 L0 10" stroke="#FFFFFF" strokeWidth="1.6" />
            <path d="M6 0 V10 M0 5 H12" stroke="#FFFFFF" strokeWidth="2.8" />
            <path d="M6 0 V10 M0 5 H12" stroke="#C8102E" strokeWidth="1.4" />
            <circle cx="6" cy="17" r="1.8" fill="#FFFFFF" />
            <circle cx="17" cy="7" r="1.1" fill="#FFFFFF" />
            <circle cx="20" cy="12" r="1.1" fill="#FFFFFF" />
            <circle cx="17" cy="17" r="1.1" fill="#FFFFFF" />
          </>
        )}
        {code === "GB" && (
          <>
            <rect width="24" height="24" fill="#012169" />
            <path d="M0 0 L24 24 M24 0 L0 24" stroke="#FFFFFF" strokeWidth="4" />
            <path d="M0 0 L24 24 M24 0 L0 24" stroke="#C8102E" strokeWidth="1.8" />
            <path d="M12 0 V24 M0 12 H24" stroke="#FFFFFF" strokeWidth="6" />
            <path d="M12 0 V24 M0 12 H24" stroke="#C8102E" strokeWidth="3.4" />
          </>
        )}
        {code === "DK" && (
          <>
            <rect width="24" height="24" fill="#C60C30" />
            <rect x="7" y="0" width="3.5" height="24" fill="#FFFFFF" />
            <rect x="0" y="10.2" width="24" height="3.5" fill="#FFFFFF" />
          </>
        )}
        {code === "BE" && (
          <>
            <rect x="0" width="8" height="24" fill="#1E1E1E" />
            <rect x="8" width="8" height="24" fill="#FDDA24" />
            <rect x="16" width="8" height="24" fill="#EF3340" />
          </>
        )}
        {code === "PH" && (
          <>
            <rect width="24" height="12" y="0" fill="#0038A8" />
            <rect width="24" height="12" y="12" fill="#CE1126" />
            <polygon points="0,0 13,12 0,24" fill="#FFFFFF" />
            <circle cx="5" cy="12" r="2.3" fill="#FCD116" />
          </>
        )}
        {code === "JP" && (
          <>
            <rect width="24" height="24" fill="#FFFFFF" />
            <circle cx="12" cy="12" r="5.5" fill="#BC002D" />
          </>
        )}
        {code === "SE" && (
          <>
            <rect width="24" height="24" fill="#006AA7" />
            <rect x="7.5" y="0" width="3.5" height="24" fill="#FECC00" />
            <rect x="0" y="10.2" width="24" height="3.5" fill="#FECC00" />
          </>
        )}
        {code === "ZA" && (
          <>
            <rect width="24" height="8" y="0" fill="#E03C31" />
            <rect width="24" height="8" y="8" fill="#FFFFFF" />
            <rect width="24" height="8" y="16" fill="#001489" />
            <polygon points="0,3 11,12 0,21" fill="#000000" stroke="#FFB81C" strokeWidth="1.5" />
            <path d="M0 0 L12 12 L24 12 M0 24 L12 12" stroke="#007749" strokeWidth="3.5" fill="none" />
          </>
        )}
        {code === "SG" && (
          <>
            <rect width="24" height="12" y="0" fill="#EF3340" />
            <rect width="24" height="12" y="12" fill="#FFFFFF" />
            <circle cx="7" cy="6.2" r="3" fill="#FFFFFF" />
            <circle cx="8.2" cy="6.2" r="2.6" fill="#EF3340" />
          </>
        )}
        {code === "US" && (
          <>
            <rect width="24" height="24" fill="#FFFFFF" />
            <rect width="24" height="3.4" y="0" fill="#B22234" />
            <rect width="24" height="3.4" y="6.8" fill="#B22234" />
            <rect width="24" height="3.4" y="13.6" fill="#B22234" />
            <rect width="24" height="3.6" y="20.4" fill="#B22234" />
            <rect width="12" height="13.6" x="0" y="0" fill="#3C3B6E" />
            <circle cx="3.5" cy="3.5" r="0.9" fill="#FFFFFF" />
            <circle cx="8" cy="3.5" r="0.9" fill="#FFFFFF" />
            <circle cx="5.8" cy="6.8" r="0.9" fill="#FFFFFF" />
            <circle cx="3.5" cy="10" r="0.9" fill="#FFFFFF" />
            <circle cx="8" cy="10" r="0.9" fill="#FFFFFF" />
          </>
        )}
        {!["IN", "AU", "GB", "DK", "BE", "PH", "JP", "SE", "ZA", "SG", "US"].includes(code) && (
          <>
            <rect width="24" height="24" fill="#E2E8F0" />
            <text
              x="12"
              y="15"
              textAnchor="middle"
              fontSize="8.5"
              fontWeight="700"
              fill="#334155"
            >
              {code}
            </text>
          </>
        )}
      </svg>
    </span>
  );
}

