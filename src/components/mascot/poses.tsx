import type { ReactElement } from 'react';

/** Bolo's three poses (DESIGN.md §7): welcoming (landing), celebrating (success), pointing (empty states). */
export type MascotPose = 'welcoming' | 'celebrating' | 'pointing';

/**
 * Pose artwork from DESIGN.md §7, shared 220×220 viewBox. Same body (white
 * ball, pentagon panels, green limbs, big eyes) — only limbs, eyes, and mouth
 * change between poses. Rendered inside the <svg> wrapper in Mascot.tsx.
 */
export const MASCOT_POSE_ART: Record<MascotPose, ReactElement> = {
  welcoming: (
    <>
      <ellipse cx="110" cy="196" fill="#000" opacity="0.15" rx="56" ry="9" />
      <circle cx="110" cy="120" fill="#FFFFFF" r="70" stroke="#14181F" strokeWidth="4" />
      <polygon fill="#14181F" opacity="0.9" points="110,72 132,88 124,114 96,114 88,88" />
      <polygon fill="#14181F" opacity="0.85" points="60,110 76,100 76,128 62,138" />
      <polygon fill="#14181F" opacity="0.85" points="160,110 144,100 144,128 158,138" />
      {/* raised waving arm */}
      <line
        stroke="#1B8A4A"
        strokeLinecap="round"
        strokeWidth="14"
        x1="163"
        x2="196"
        y1="128"
        y2="82"
      />
      <circle cx="196" cy="82" fill="#FFFFFF" r="12" stroke="#14181F" strokeWidth="3" />
      {/* legs */}
      <line
        stroke="#1B8A4A"
        strokeLinecap="round"
        strokeWidth="15"
        x1="82"
        x2="70"
        y1="150"
        y2="180"
      />
      <ellipse cx="68" cy="184" fill="#106634" rx="10" ry="7" />
      <line
        stroke="#1B8A4A"
        strokeLinecap="round"
        strokeWidth="15"
        x1="138"
        x2="148"
        y1="150"
        y2="180"
      />
      <ellipse cx="150" cy="184" fill="#106634" rx="10" ry="7" />
      {/* blush + eyes + smile */}
      <ellipse cx="82" cy="140" fill="#E8A93B" opacity="0.55" rx="9" ry="5" />
      <ellipse cx="140" cy="140" fill="#E8A93B" opacity="0.55" rx="9" ry="5" />
      <ellipse cx="86" cy="104" fill="#FFFFFF" rx="13" ry="16" stroke="#14181F" strokeWidth="2.5" />
      <ellipse
        cx="134"
        cy="104"
        fill="#FFFFFF"
        rx="13"
        ry="16"
        stroke="#14181F"
        strokeWidth="2.5"
      />
      <circle cx="89" cy="108" fill="#14181F" r="5.5" />
      <circle cx="137" cy="108" fill="#14181F" r="5.5" />
      <path
        d="M92 132 Q110 148 128 132"
        fill="none"
        stroke="#14181F"
        strokeLinecap="round"
        strokeWidth="4"
      />
    </>
  ),
  celebrating: (
    <>
      <circle cx="60" cy="46" fill="#1B8A4A" r="4" />
      <circle cx="160" cy="40" fill="#E8A93B" r="4" />
      <circle cx="110" cy="30" fill="#4ED08A" r="4" />
      <circle cx="180" cy="70" fill="#B9791C" r="4" />
      <circle cx="40" cy="80" fill="#E8A93B" r="4" />
      <circle cx="110" cy="120" fill="#FFFFFF" r="70" stroke="#14181F" strokeWidth="4" />
      <polygon fill="#14181F" opacity="0.9" points="110,72 132,88 124,114 96,114 88,88" />
      {/* both arms up */}
      <line
        stroke="#1B8A4A"
        strokeLinecap="round"
        strokeWidth="14"
        x1="72"
        x2="42"
        y1="140"
        y2="86"
      />
      <circle cx="42" cy="86" fill="#FFFFFF" r="12" stroke="#14181F" strokeWidth="3" />
      <line
        stroke="#1B8A4A"
        strokeLinecap="round"
        strokeWidth="14"
        x1="148"
        x2="178"
        y1="140"
        y2="86"
      />
      <circle cx="178" cy="86" fill="#FFFFFF" r="12" stroke="#14181F" strokeWidth="3" />
      <line
        stroke="#1B8A4A"
        strokeLinecap="round"
        strokeWidth="15"
        x1="86"
        x2="76"
        y1="152"
        y2="182"
      />
      <line
        stroke="#1B8A4A"
        strokeLinecap="round"
        strokeWidth="15"
        x1="134"
        x2="144"
        y1="152"
        y2="182"
      />
      {/* happy closed eyes + open smile */}
      <path
        d="M84 100 Q89 92 94 100"
        fill="none"
        stroke="#14181F"
        strokeLinecap="round"
        strokeWidth="4"
      />
      <path
        d="M126 100 Q131 92 136 100"
        fill="none"
        stroke="#14181F"
        strokeLinecap="round"
        strokeWidth="4"
      />
      <path
        d="M86 128 Q110 156 134 128"
        fill="none"
        stroke="#14181F"
        strokeLinecap="round"
        strokeWidth="4"
      />
    </>
  ),
  pointing: (
    <>
      <circle cx="110" cy="120" fill="#FFFFFF" r="70" stroke="#14181F" strokeWidth="4" />
      <polygon fill="#14181F" opacity="0.9" points="110,72 132,88 124,114 96,114 88,88" />
      {/* arm pointing right */}
      <line
        stroke="#1B8A4A"
        strokeLinecap="round"
        strokeWidth="14"
        x1="165"
        x2="204"
        y1="126"
        y2="118"
      />
      <polygon fill="#106634" points="204,118 218,113 210,126" />
      <line
        stroke="#1B8A4A"
        strokeLinecap="round"
        strokeWidth="15"
        x1="82"
        x2="88"
        y1="150"
        y2="180"
      />
      <line
        stroke="#1B8A4A"
        strokeLinecap="round"
        strokeWidth="15"
        x1="138"
        x2="132"
        y1="150"
        y2="180"
      />
      {/* eyes look toward the point */}
      <ellipse cx="90" cy="104" fill="#FFFFFF" rx="13" ry="16" stroke="#14181F" strokeWidth="2.5" />
      <ellipse
        cx="138"
        cy="104"
        fill="#FFFFFF"
        rx="13"
        ry="16"
        stroke="#14181F"
        strokeWidth="2.5"
      />
      <circle cx="95" cy="107" fill="#14181F" r="5.5" />
      <circle cx="143" cy="107" fill="#14181F" r="5.5" />
      <path
        d="M96 132 Q112 144 128 133"
        fill="none"
        stroke="#14181F"
        strokeLinecap="round"
        strokeWidth="4"
      />
    </>
  ),
};
