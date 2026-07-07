# Stadeck — Design System & Engineering Handoff

GenAI stadium-operations + fan-experience app for World Cup 2026. Two moods, one family:
**Fan theme** (light, celebratory, "walking into the stadium") and **Ops theme** (dark control-room calm). Same green/gold accents bind them.

> **Mascot: Bolo** — an original anthropomorphic football with big eyes and stubby green limbs. NOT a FIFA mascot. Three poses (welcoming / celebrating / pointing) shipped as inline SVG at the bottom of this doc.

---

## 1. Color tokens

Paste into `tailwind.config.js → theme.extend.colors`. All values are hex.

```js
colors: {
  // Brand — shared across both themes
  pitch:   { DEFAULT: '#1B8A4A', deep: '#106634', darker: '#0C4F28', tint: '#E7F5EC', tintbdr: '#CDE8D6' },
  gold:    { DEFAULT: '#E8A93B', deep: '#B9791C', darker: '#96610E', tint: '#FDF3E1', tintbdr: '#F0DCAE' },
  glow:    '#4ED08A', // bright green for dark surfaces (LED, live dots, AI accents)

  // Fan theme (light)
  fan: {
    bg:      '#FBF9F4', // warm off-white page
    surface: '#FFFFFF',
    border:  '#E4E1D6',
    ink:     '#14181F', // headings/body
    muted:   '#5B6472', // secondary text
    faint:   '#657185', // captions/labels (fan theme — 4.69:1 on bg, AA)
    skeleton:'#F0EEE6',
  },

  // Ops theme (dark)
  ops: {
    bg:      '#0A0F1A', // page top
    bg2:     '#0C1526', // page bottom (use as gradient pair)
    surface: '#101B2E', // cards
    surface2:'#12233C', // raised cards / hover
    border:  'rgba(120,150,190,0.16)',
    ink:     '#FFFFFF',
    body:    '#E7ECF5',
    muted:   '#B7C2D6',
    faint:   '#8A97AD',
  },

  // Semantic severity (BOTH themes — see per-theme values below)
  danger:  { DEFAULT: '#FF6B5E', fan: '#B0241A' }, // ops critical / fan critical text (on #FDE8E5)
  warn:    '#E8A93B',
  ok:      '#4ED08A',
  info:    '#2A5CC4',
}
```

### Severity — per theme (text / bg / border)

| Level | Fan text | Fan bg | Fan border | Ops text | Ops bg |
|---|---|---|---|---|---|
| Critical | `#B0241A` | `#FDE8E5` | `#F5B8B1` | `#FF6B5E` | `rgba(255,107,94,0.10)` |
| Elevated | `#96610E` | `#FDF3E1` | `#F0DCAE` | `#E8A93B` | `rgba(232,169,59,0.10)` |
| Normal   | `#0C4F28` | `#E7F5EC` | `#CDE8D6` | `#4ED08A` | `rgba(78,208,138,0.10)` |
| Info     | `#234B9E` | `#EAF0FB` | `#C6D6F0` | `#B7C2D6` | `rgba(120,150,190,0.10)` |

### Verified WCAG AA contrast (computed, WCAG 2.1 relative luminance; all ≥ 4.5:1 for body text; badges use bold ≥14px)

| Pair | Ratio | Pass |
|---|---|---|
| `#14181F` on `#FBF9F4` (fan body) | 16.9:1 | AAA |
| `#5B6472` on `#FBF9F4` (fan muted) | 5.7:1 | AA |
| `#657185` on `#FBF9F4` (fan faint) | 4.7:1 | AA |
| `#FFFFFF` on `#106634` (primary btn) | 7.1:1 | AAA |
| `#14181F` on `#E8A93B` (accent btn) | 8.6:1 | AAA |
| `#B0241A` on `#FDE8E5` (fan critical) | 5.7:1 | AA |
| `#96610E` on `#FDF3E1` (fan elevated) | 4.8:1 | AA |
| `#FFFFFF` on `#0A0F1A` (ops ink) | 19.2:1 | AAA |
| `#B7C2D6` on `#101B2E` (ops muted) | 9.6:1 | AAA |
| `#8A97AD` on `#101B2E` (ops faint) | 5.8:1 | AA |
| `#FF6B5E` on `#101B2E` (ops critical) | 6.2:1 | AA |
| `#4ED08A` on `#101B2E` (ops ok) | 8.8:1 | AAA |
| `#E8A93B` on `#0C1526` (ops warn) | 8.8:1 | AAA |

> Faint tones are theme-specific: `fan.faint #657185` (light theme) and `ops.faint #8A97AD` (dark theme). **`#8A97AD` fails AA on light backgrounds (2.8:1) — never use it in the fan theme.** Both faints are for ≥12px captions/labels only, never primary body copy.

---

## 2. Type scale

Two families, one Google import each. `Poppins` for display/headings, `Inter` for UI/body, `JetBrains Mono` for data/labels/timers.

```
Import: Poppins 600/700/800 · Inter 400/500/600/700 · JetBrains Mono 500/700
Load as ONE combined Google Fonts request with display=swap; subset to the listed weights only.
Fallback stack: 'Inter', system-ui, -apple-system, sans-serif
```

| Token | Font / weight | Size / line-height | Use |
|---|---|---|---|
| `display` | Poppins 800 | 46px / 1.04 | Landing hero |
| `h1` | Poppins 800 | 30px / 1.05 | Screen title |
| `h2` | Poppins 700 | 20px / 1.2 | Section title |
| `h3` | Poppins 700 | 17px / 1.25 | Card title |
| `body` | Inter 400 | 15px / 1.6 | Paragraph |
| `body-sm` | Inter 400 | 13.5px / 1.5 | Card copy |
| `label` | Inter 600 | 12px / 1.4 | Form labels |
| `mono-stat` | JetBrains Mono 700 | 22–34px / 1 | KPIs, timers |
| `mono-tag` | JetBrains Mono 700 | 11–12px / 1, `letter-spacing: 0.08–0.16em` | Badges, LED, eyebrows |

Minimums: fan/ops UI body never below 12px; slide-scale not applicable.

---

## 3. Spacing, radius, shadow scales

```js
// spacing (Tailwind default 4px base is fine; these are the values in use)
spacing: { card: '24px', section: '30px', gutter: '18px', page: '40px' }

borderRadius: {
  sm:  '7px',   // badges
  md:  '10px',  // inputs, small buttons
  lg:  '12px',  // buttons
  xl:  '14px',  // inner cards
  '2xl':'16px', // panels
  '3xl':'20px', // role cards / module cards
  '4xl':'24px', // hero strips
  pill:'100px',
}

boxShadow: {
  'card':     '0 1px 2px rgba(20,24,31,0.04)',        // fan resting card
  'raised':   '0 12px 30px rgba(16,102,52,0.28)',     // featured green card
  'float':    '0 18px 40px rgba(0,0,0,0.32)',         // role cards on dark
  'hero':     '0 24px 60px rgba(0,0,0,0.45)',         // jumbotron
  'toast':    '0 8px 24px rgba(20,24,31,0.2)',
  'inputfocus':'0 0 0 3px rgba(16,102,52,0.15)',      // focus ring
}
```

---

## 4. Component style rules

- **Buttons** — radius `lg` (12px), padding `12–13px / 18–22px`, weight 700. Primary `bg-pitch-deep` → hover `bg-pitch-darker`. Accent `bg-gold` w/ ink text → hover `#D2941F`. Secondary = white + 1.5px pitch border. Destructive `bg-danger` → `#E5564A`. Disabled `#E4E1D6`/`#9AA2AF`, `cursor:not-allowed`. Focus = `inputfocus` ring. **State is never color-only** — pair with label/icon.
- **Cards** — fan: white, 1px `fan.border`, radius `3xl`, `shadow-card`; top accent bar (4px) colors by role (pitch/gold/`#4A5A80`). Ops: `ops.surface`, 1px `ops.border`, radius `2xl`. **Penalty-box corner detail** = 20–22px right-angle SVG bracket, top corner, `stroke-width 2.5`, accent color, `aria-hidden`.
- **Badges** — radius `sm`, mono-tag type. Always `icon/glyph + WORD + optional %`. Critical=triangle, Elevated=●/circle-alert, Normal=check, Info=○. Never rely on fill alone.
- **Inputs** — radius `md`, 1px `fan.border`, bg `fan.bg`. Focus = 1.5px pitch border + `inputfocus` ring. Error = 1.5px `#E5564A` + message with ⚠.
- **Demo-data badge** — `mono-tag`, gold on `gold.tint` (fan) or gold on `rgba(232,169,59,0.1)` w/ border (ops). Persistent, top-right.
- **LED ribbon** — 30–34px tall, `#0C1830` bg, gold/glow text, mono-tag, horizontal marquee (`translateX 0 → -50%`, content duplicated).

---

## 5. Animation specs — all use ONLY transform/opacity

| Name | What | Duration / timing | Reduced-motion |
|---|---|---|---|
| `floatBall` | mascot/decor footballs bob + rotate | 6s ease-in-out infinite, `translateY 0→-16px, rotate 0→12°` | **none (static)** |
| `beamPulse` | floodlight beam opacity | 4s, opacity 0.32→0.5 | **none** |
| `floodGlow` | tower glow opacity | 5s, opacity 0.5→0.9 | **none** |
| `ledScroll` | ribbon marquee | 22–26s linear infinite, `translateX -50%` | **none (freezes)** |
| `msgIn` | chat bubble enter | 0.35s ease-out, `translateY 8px→0` + fade | **none** |
| `typingBounce` | 3 dots | 1.1s infinite, `translateY 0→-5px` staggered | **none** |
| `cardIn` | action-plan cards enter | 0.4s ease-out staggered | **none** |
| `pulseRing` | map alert ring | 2.2s ease-out infinite, `scale 0.85→1.6` + fade | **none** |
| `blink` | LIVE dot | 1.6s, opacity 1→0.35 | **none** |
| `confetti` | celebration burst | ≤1.5s, `translateY + rotate` + fade, then unmounts | **renders zero pieces** |

**Reduced-motion rule (global):** every decorative/celebration animation resolves to **nothing** — static element, no movement.
```css
@media (prefers-reduced-motion: reduce) {
  .float-ball, .beam, .led-track, .flood-glow, .msg-in, .dot, .pulse-ring, .blink, .card-in { animation: none !important; }
  .confetti-piece { animation: none !important; opacity: 0 !important; }
}
```
Confetti is also gated in JS: `matchMedia('(prefers-reduced-motion: reduce)').matches` → build 0 pieces. Celebration moments are non-blocking (`pointer-events:none` overlay, `z-50`), ≤2s, and auto-dismiss.

---

## 6. Do / Don't

**Do**
- Anchor with pitch green, celebrate with gold, keep fan surfaces warm-white and ops surfaces deep navy.
- Give every decorative element `aria-hidden="true"` (mascot, footballs, confetti, floodlights, pitch lines, LED, hex texture).
- Encode meaning with **icon + label + (pattern)** — the critical heatmap zone also gets a hatch pattern, not just red.
- Keep Bolo present but out of the content path (corner, helper strip, empty states).
- Verify every new text/bg pair against §1 before shipping.

**Don't**
- ❌ No FIFA IP — no Maple/Zayu/Clutch, no FIFA logos, no World Cup trophy, no national flags. Host-nation warmth only as abstract micro-accents.
- ❌ No color-only meaning anywhere (heatmap, badges, severity).
- ❌ No animation on properties other than transform/opacity; nothing blocks interaction; nothing >2s.
- ❌ Don't let decorative art carry information or crowd content areas.
- ❌ Don't mix the two themes on one surface — pick fan OR ops per screen.

---

## 7. Mascot "Bolo" — inline SVG (aria-hidden, one file per pose)

All poses share the 220×220 viewBox and the same body (white ball, pentagon panel, green limbs, big eyes). Swap only limbs + mouth + eyes.

### Pose A — Welcoming (landing, waving)
```html
<svg aria-hidden="true" viewBox="0 0 220 220" width="120" height="120">
  <ellipse cx="110" cy="196" rx="56" ry="9" fill="#000" opacity="0.15"/>
  <circle cx="110" cy="120" r="70" fill="#FFFFFF" stroke="#14181F" stroke-width="4"/>
  <polygon points="110,72 132,88 124,114 96,114 88,88" fill="#14181F" opacity="0.9"/>
  <polygon points="60,110 76,100 76,128 62,138" fill="#14181F" opacity="0.85"/>
  <polygon points="160,110 144,100 144,128 158,138" fill="#14181F" opacity="0.85"/>
  <!-- raised waving arm -->
  <line x1="163" y1="128" x2="196" y2="82" stroke="#1B8A4A" stroke-width="14" stroke-linecap="round"/>
  <circle cx="196" cy="82" r="12" fill="#FFFFFF" stroke="#14181F" stroke-width="3"/>
  <!-- legs -->
  <line x1="82" y1="150" x2="70" y2="180" stroke="#1B8A4A" stroke-width="15" stroke-linecap="round"/>
  <ellipse cx="68" cy="184" rx="10" ry="7" fill="#106634"/>
  <line x1="138" y1="150" x2="148" y2="180" stroke="#1B8A4A" stroke-width="15" stroke-linecap="round"/>
  <ellipse cx="150" cy="184" rx="10" ry="7" fill="#106634"/>
  <!-- blush + eyes + smile -->
  <ellipse cx="82" cy="140" rx="9" ry="5" fill="#E8A93B" opacity="0.55"/>
  <ellipse cx="140" cy="140" rx="9" ry="5" fill="#E8A93B" opacity="0.55"/>
  <ellipse cx="86" cy="104" rx="13" ry="16" fill="#FFFFFF" stroke="#14181F" stroke-width="2.5"/>
  <ellipse cx="134" cy="104" rx="13" ry="16" fill="#FFFFFF" stroke="#14181F" stroke-width="2.5"/>
  <circle cx="89" cy="108" r="5.5" fill="#14181F"/>
  <circle cx="137" cy="108" r="5.5" fill="#14181F"/>
  <path d="M92 132 Q110 148 128 132" stroke="#14181F" stroke-width="4" fill="none" stroke-linecap="round"/>
</svg>
```

### Pose B — Celebrating (success, both arms up + sparkles)
```html
<svg aria-hidden="true" viewBox="0 0 220 220" width="120" height="120">
  <circle cx="60" cy="46" r="4" fill="#1B8A4A"/><circle cx="160" cy="40" r="4" fill="#E8A93B"/>
  <circle cx="110" cy="30" r="4" fill="#4ED08A"/><circle cx="180" cy="70" r="4" fill="#B9791C"/>
  <circle cx="40" cy="80" r="4" fill="#E8A93B"/>
  <circle cx="110" cy="120" r="70" fill="#FFFFFF" stroke="#14181F" stroke-width="4"/>
  <polygon points="110,72 132,88 124,114 96,114 88,88" fill="#14181F" opacity="0.9"/>
  <!-- both arms up -->
  <line x1="72" y1="140" x2="42" y2="86" stroke="#1B8A4A" stroke-width="14" stroke-linecap="round"/>
  <circle cx="42" cy="86" r="12" fill="#FFFFFF" stroke="#14181F" stroke-width="3"/>
  <line x1="148" y1="140" x2="178" y2="86" stroke="#1B8A4A" stroke-width="14" stroke-linecap="round"/>
  <circle cx="178" cy="86" r="12" fill="#FFFFFF" stroke="#14181F" stroke-width="3"/>
  <line x1="86" y1="152" x2="76" y2="182" stroke="#1B8A4A" stroke-width="15" stroke-linecap="round"/>
  <line x1="134" y1="152" x2="144" y2="182" stroke="#1B8A4A" stroke-width="15" stroke-linecap="round"/>
  <!-- happy closed eyes + open smile -->
  <path d="M84 100 Q89 92 94 100" stroke="#14181F" stroke-width="4" fill="none" stroke-linecap="round"/>
  <path d="M126 100 Q131 92 136 100" stroke="#14181F" stroke-width="4" fill="none" stroke-linecap="round"/>
  <path d="M86 128 Q110 156 134 128" stroke="#14181F" stroke-width="4" fill="none" stroke-linecap="round"/>
</svg>
```

### Pose C — Pointing / guiding (empty states, onboarding)
```html
<svg aria-hidden="true" viewBox="0 0 220 220" width="120" height="120">
  <circle cx="110" cy="120" r="70" fill="#FFFFFF" stroke="#14181F" stroke-width="4"/>
  <polygon points="110,72 132,88 124,114 96,114 88,88" fill="#14181F" opacity="0.9"/>
  <!-- arm pointing right -->
  <line x1="165" y1="126" x2="204" y2="118" stroke="#1B8A4A" stroke-width="14" stroke-linecap="round"/>
  <polygon points="204,118 218,113 210,126" fill="#106634"/>
  <line x1="82" y1="150" x2="88" y2="180" stroke="#1B8A4A" stroke-width="15" stroke-linecap="round"/>
  <line x1="138" y1="150" x2="132" y2="180" stroke="#1B8A4A" stroke-width="15" stroke-linecap="round"/>
  <!-- eyes look toward the point -->
  <ellipse cx="90" cy="104" rx="13" ry="16" fill="#FFFFFF" stroke="#14181F" stroke-width="2.5"/>
  <ellipse cx="138" cy="104" rx="13" ry="16" fill="#FFFFFF" stroke="#14181F" stroke-width="2.5"/>
  <circle cx="95" cy="107" r="5.5" fill="#14181F"/>
  <circle cx="143" cy="107" r="5.5" fill="#14181F"/>
  <path d="M96 132 Q112 144 128 133" stroke="#14181F" stroke-width="4" fill="none" stroke-linecap="round"/>
</svg>
```

> Scale by setting `width`/`height` (e.g. 30px inline avatar, 52px helper, 120px hero). Stroke widths are tuned for the 220 viewBox and scale cleanly. On dark surfaces, change the ball fill to `#FBF9F4` for a touch more warmth.

---

## 8. Screen reference

The interactive mockups (landing/role select, fan home, multilingual chat, crowd management, decision support, component sheet) live in the Claude Design workspace and are **not part of this repository** — this document is the complete engineering source of truth. Screens implement: landing = fan theme with dark hero; fan home, chat = fan theme; crowd management, decision support = ops theme; components follow §4.
