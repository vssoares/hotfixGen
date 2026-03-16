# Design System: hotfixGen — projectManager

## 1. Visual Theme & Atmosphere

A **utilitarian terminal aesthetic** — dark, dense, and deliberately lo-fi. The interface evokes a developer's command-line workspace: monospaced type, scanline overlays, blinking cursors, and muted backgrounds that feel like a CRT display at 2am. The mood is focused and purposeful, stripped of decorative excess. Every element earns its place.

There is a deliberate tension between the dark default (nearly-black `#0a0a0a`) and a clean light mode (`zinc-50`), both anchored by a single vivid accent: amber. This accent serves as the only "warm" signal in an otherwise cold, grayscale palette — making it unmistakable as the interactive layer.

The texture is physical: scanline repeating gradients overlay the entire viewport, giving the illusion of a low-resolution screen. Scrollbars are razor-thin (4px), squared off, and turn amber on hover — reinforcing the terminal character even in peripheral details.

---

## 2. Color Palette & Roles

| Descriptive Name | Hex | Role |
|---|---|---|
| **Terminal Amber** | `#f59e0b` (amber-500) | Primary accent — active states, headings, CTAs, cursor blink, scrollbar hover |
| **Ember Glow** | `#d97706` (amber-600) | Hover and pressed states on amber elements; text on light backgrounds |
| **Pale Amber** | `#fbbf24` (amber-400) | Amber in dark mode — slightly lighter for contrast on near-black backgrounds |
| **Deep Ember** | `#451a03` (amber-950) | Scrollbar thumb in dark mode; active toggle backgrounds |
| **Void Black** | `#0a0a0a` | Root background in dark mode — warmer than pure black, avoids harshness |
| **Chalk White** | `#fafafa` (zinc-50) | Root background in light mode |
| **Graphite** | `#18181b` (zinc-900) | Input and card backgrounds in dark mode |
| **Ash** | `#3f3f46` (zinc-700) | Borders and dividers in dark mode |
| **Smoke** | `#d4d4d8` (zinc-300) | Borders and dividers in light mode; scrollbar thumb |
| **Carbon** | `#52525b` (zinc-600) | Secondary text, labels, placeholder text in light mode |
| **Fog** | `#71717a` (zinc-500) | Muted text, disabled states, idle button labels |
| **Signal Red** | `#ef4444` (red-500) | Error output in console; destructive action borders and hover |
| **Terminal Green** | `#4ade80` (green-400) | START action active state; success output |
| **Ice Blue** | `#60a5fa` (blue-400) | FINISH action active state; update notification accents |
| **Orchid** | `#a78bfa` (violet-400) | Outline button hover variant (subtle, secondary destructive) |

---

## 3. Typography Rules

**Primary Font:** `Poppins` — sans-serif, geometric, clean. Used universally for UI labels, buttons, inputs, and body text. Fallback: `Segoe UI`, then generic sans-serif.

**Secondary Font:** `JetBrains Mono` — loaded but applied selectively via `font-mono` to the console output area, giving terminal output an authentic fixed-width character. The mono font creates an explicit separation between "interface" and "output."

**Weight Usage:**
- `font-bold` (700): Page title (`projectManager`), CTA button labels
- `font-semibold` (600): Section labels (`// versão`, `// tipo`), tab labels, toggle buttons
- `font-medium` (500): Inputs, outline buttons, secondary controls
- `font-normal` (400): Console output text, body copy

**Sizing & Spacing:**
- Section labels: `10px`, `uppercase`, `tracking-widest` — creates a structured, editorial hierarchy
- Tab/button labels: `11px`–`12px`, `uppercase`, `tracking-widest`
- Input values: `14px` (sm), medium weight
- Console output: `12px`, monospaced, `leading-relaxed`
- Title: `16px` (base), bold, amber, `tracking-widest`, `uppercase`

The `tracking-widest` + `uppercase` combination is the defining typographic signature of this system — applied consistently to any label, tab, or button that acts as a category or action name.

---

## 4. Component Stylings

**Buttons — Solid (Primary CTA):**
Amber-filled with jet-black text. Square-edged (`rounded-sm` — nearly sharp corners). Labels are bold, uppercase, and widely spaced. On hover, lightens to amber-400. Disabled state drops opacity to 30%. The shape feels like a keyboard key or a terminal command block.

**Buttons — Outline:**
Transparent background with a zinc border that transitions to amber on hover. Text color mirrors the border transition (zinc → amber). Lightweight and secondary — used for "gitk master", "clear", "baixar". Same `rounded-sm` geometry.

**Buttons — Tab:**
Active tab: amber-tinted text (`amber-600` / `amber-400`) on a subtle amber wash background (`amber-100/60` dark: `amber-950/40`). Inactive: zinc-500 text that brightens on hover. No border — the group border wraps the entire tab bar as a single container.

**Buttons — Toggle (Action Selectors):**
Each action (START, FINISH, DELETE, branch types) has its own idle/active color pair. Idle is transparent with zinc borders and subtle hover color. Active is a semi-transparent tinted background (`green-950/50`, `blue-950/50`, `red-950/50`) with a matching colored glow shadow (`box-shadow` with color-coded rgba). This creates a "lit LED" effect for the active state.

**Inputs / Forms:**
Near-transparent backgrounds (`bg-white dark:bg-zinc-900/50`). Zinc borders with amber focus ring. No border-radius beyond `rounded-sm`. Leading arrow icon (`›`) in amber inside the input for visual anchor. Placeholder text in zinc-400/500. Clean, terminal-inspired form fields.

**Cards / Containers:**
No explicit card components. Sections are separated by thin 1px zinc dividers (`border-zinc-200 dark:border-zinc-900`). The console output area uses a white/black background with a subtle border — the darkest surface in the hierarchy. Panels are flat, relying on spacing and labels rather than shadows or elevation.

**Console Output:**
Full monospaced (`font-mono`) panel with `12px` text. Three semantic text colors: zinc for stdout, red-500 for stderr, amber-600 for system messages. Begins with an idle state in italic zinc-400/500: *"awaiting input..."*. Blinking amber block cursor alongside the "running" indicator reinforces the terminal metaphor.

**Notifications / Banners:**
Appear between header and main content via `AnimatePresence`. Each state (available, downloading, error, ready) uses a distinct border+background pair (blue, zinc, red, green) at low opacity (`/40`). Consistent `10px` uppercase tracking-widest labels. Action buttons match the banner's accent color and invert on hover.

---

## 5. Layout Principles

**Structure:** Single-column, full-height viewport layout (`h-screen flex flex-col`). Content flows top-to-bottom: header → project selector → divider → mode panel → console → footer. No grid or multi-column layout — everything stacks linearly, like a vertical terminal session.

**Spacing:** `gap-4` between major sections; `gap-3` within panels; `gap-2` between inline elements. Padding is `p-6` on the root container. The system uses uniform, predictable spacing that creates visual rhythm without decoration.

**Density:** Medium-high. The interface is compact but not cramped — elements have enough breathing room to be scannable at a glance, but there is no wasted space. Every vertical pixel is purposeful.

**Alignment:** All elements are left-aligned or space-between within rows. No center-aligned content (except inline icons within buttons). Labels sit above their controls in a consistent `flex flex-col gap-1.5` pattern.

**Texture Overlay:** A full-viewport `::after` pseudo-element applies a `repeating-linear-gradient` scanline texture (`rgba(0,0,0,0.06)` every 4px). This is the single most distinctive visual treatment — it unifies the entire surface under a subtle CRT-like texture without obscuring content.

**Animations:** Panel transitions use `framer-motion` with `opacity` + `y` (8px shift) on enter/exit. Duration: 200ms in, 150ms out. Subtly kinetic — responsive without being flashy.

**Scrollbar:** 4px wide, no track background, squared thumb (`border-radius: 0`), amber on hover. Minimal and on-brand.
