# TotoTrip v2 — Development Progress

## Phase 7: Dark Mode ✅ COMPLETE
**Completed**: 2026-03-09

### What Changed

1. **ThemeProvider + System Preference Detection**
   - New `contexts/ThemeContext.tsx` — provides `theme`, `resolvedTheme`, `setTheme`, `toggleTheme`
   - Supports 3 modes: `light`, `dark`, `system` (follows OS preference)
   - Persists user preference in `localStorage` key `tototrip-theme`
   - Inline `<script>` in `<head>` prevents FOUC (flash of unstyled content)
   - Auto-detects system `prefers-color-scheme` changes in real time
   - Updates `<meta name="theme-color">` dynamically (#0F1117 dark / #E8453C light)

2. **ThemeToggle Component**
   - New `components/ThemeToggle.tsx` — 🌙/☀️ toggle button
   - Added to: Homepage nav, Inspiration nav, AppHeader (trips/locations pages), Chat header (via nav)
   - Smooth hover animation, adapts styling to current theme

3. **CSS Variables & Design Tokens (globals.css)**
   - Extended `.dark` block with spec-accurate colors:
     - Background: `#0F1117` (deep blue-black)
     - Card: `#1A1B2E`
     - Elevated card/popover: `#1E1F33`
     - Border: subtle `hsl(237 22% 22%)`
   - Brand colors (Chinese Red #E8453C, Gold #D4A853) unchanged in dark mode
   - Dark overrides for: `.glass`, `.shadow-soft`, `.shadow-elevated`, `.destination-card`, `.border-animated`
   - Dark prose styles: links, code blocks, headings, strong, lists all inverted
   - Dark scrollbar, typing dots, map popup styles
   - Dark mode for `.custom-popup` Leaflet styles (background, tip, close button)

4. **Pages Updated with Dark Mode**
   - **Homepage (`page.tsx`)**: Nav (glass + border), Hero section, Destinations (bg), Social Proof (stats, testimonials), Why TotoTrip (pain point cards), How It Works (steps), Recent Conversations, CTA, Footer — all have `dark:` variants
   - **Chat Page (`chat/[id]/page.tsx`)**: Header, quick actions, loading state — dark backgrounds + borders
   - **Inspiration Page (`inspiration/page.tsx`)**: Grid header, template cards, template detail view (hero, info bar, route, overview, highlights, best-for, day-by-day accordion, tips, CTA), mobile menu
   - **Auth Page (`auth/page.tsx`)**: Background gradient inverted, headings + text
   - **Trips Page (`trips/page.tsx`)**: Background, headers, trip cards, empty state
   - **Locations Page (`locations/page.tsx`)**: Background, headers
   - **Trip Detail/Edit/New Pages**: Background color

5. **Components Updated with Dark Mode**
   - **MessageList**: AI message bubbles (bg-white → #1E1F33 + border), typing indicator
   - **MessageInput**: Input container, textarea, send button, footer text
   - **SessionList**: Sidebar bg, header, collapsed trigger, session items (active/inactive states), overlay
   - **LocationCard**: Card bg, title, description, rating text, price, tags, borders
   - **LocationMap**: View toggle header, toggle buttons, list items (hover, text colors)
   - **ItineraryTimeline**: Item cards, transport bar, header text
   - **AppHeader**: Sticky nav, active states, user section, mobile dropdown

6. **Tailwind Config**
   - `darkMode: ["class"]` was already configured ✅
   - Layout updated: `<html suppressHydrationWarning>`, `<body className="bg-background text-foreground">`
   - ThemeProvider wraps AuthProvider in layout

### Technical Details
- Zero new dependencies — uses existing Tailwind `dark:` variant
- Anti-FOUC inline script runs before React hydration
- `suppressHydrationWarning` on `<html>` prevents React mismatch from inline script
- Build: `npx next build` — zero errors, zero warnings
- All 24 routes compile successfully
- Deployed to Zeabur (service ID: 69a1be8a79f74da9ed5a8f43)
- Live at https://tototrip.zeabur.app

---

## Phase 6: Itinerary Timeline + UX ✅ COMPLETE
**Completed**: 2026-03-09

### What Changed

1. **ItineraryTimeline Component (`app/chat/components/ItineraryTimeline.tsx`)**
   - Day-by-Day accordion view with collapsible/expandable sections
   - Day headers: dark gradient bar with day number badge (brand red→gold gradient), title, chevron toggle
   - First 2 days auto-expanded, rest collapsed
   - Each day has a vertical timeline line (red→gold gradient, 30% opacity) connecting items
   - Timeline nodes: colored circles matching category (attraction=red, restaurant=orange, hotel=purple, etc.)
   - Item cards: white rounded cards with category icon, name, time-of-day icon (☀️ Morning / 🌅 Afternoon / 🌙 Evening), duration
   - Transport connector: bottom bar on each card showing "→ Metro Line 2" / "→ Walk 15min" with transport icon
   - Optional note field for insider tips
   - Header shows total days + total stops count
   - Framer Motion animations: staggered card entrance, smooth accordion expand/collapse
   - Fully mobile responsive

2. **Itinerary Data Parsing (`lib/parseItinerary.ts`)**
   - Mirrors `parseLocations.ts` pattern for streaming safety
   - Parses `<ITINERARY_DATA>{...}</ITINERARY_DATA>` JSON blocks
   - During streaming: strips incomplete `<ITINERARY_DATA>...` from displayed text (no raw JSON flashes)
   - Strips partially-typed opening tags (e.g. `<ITINERA`, `<ITINERARY_D`)
   - Uses JSON5 for lenient parsing (trailing commas, etc.)
   - Type exports: `Itinerary`, `ItineraryDay`, `ItineraryItem`

3. **System Prompt Update**
   - Added `<ITINERARY_DATA>` output format instructions after `<LOCATION_DATA>` section
   - Trigger: user asks to "plan a trip", "create an itinerary", "X-day trip to Y", etc.
   - Format: `{"days":[{"day":1,"title":"...","items":[{"time":"Morning","name":"...","duration":"2h","transport":"...","category":"attraction","note":"..."}]}]}`
   - Rules: both `<LOCATION_DATA>` and `<ITINERARY_DATA>` should be included when planning trips
   - `<ITINERARY_DATA>` placed after `<LOCATION_DATA>` in output

4. **MessageList Integration**
   - `MessageBubble` now chains both parsers: `parseLocationsFromMessage` → `parseItineraryFromMessage`
   - Itinerary rendered below location cards + map (if present)
   - Both can appear independently or together in the same message

### Technical Details
- Zero new dependencies — uses existing `framer-motion`, `lucide-react`, `json5`
- Build: `npx next build` — zero errors, zero warnings
- Deployed to Zeabur (service ID: 69a1be8a79f74da9ed5a8f43)
- Live at https://tototrip.zeabur.app

---

## Phase 1: Visual Rebrand + Design System ✅ COMPLETE
**Completed**: 2026-03-09

### What Changed
1. **Complete Homepage Redesign**
   - Dark hero section with gradient brand text ("Discover China Like Never Before")
   - Animated search CTA with "Where in China do you want to go?" prompt
   - Animated stat counters (24/7, 100+ cities, 50k+ tips)
   - Popular Destinations grid (6 cities with photo cards + hover effects)
   - "Why TotoTrip" section — 6 China-specific pain points solved (WeChat Pay, VPN, Rail, Food, Language, Safety)
   - "How It Works" 3-step timeline
   - Dark CTA section with brand gradients
   - Dark-themed footer

2. **Brand Identity Overhaul**
   - New color palette: Chinese Red (#E8453C) + Gold (#D4A853) + Ink Dark (#1A1A2E)
   - Brand logo: 途 character in gradient circle
   - Bilingual branding: "TotoTrip 途图旅行"
   - Consistent gradients and shadows across all components
   - Custom favicon using 途 character

3. **Design System**
   - CSS custom properties for all brand tokens
   - Glass morphism utilities (`.glass`)
   - Gradient text utilities (`.text-gradient-brand`, `.text-gradient-gold`, `.text-gradient-warm`)
   - Card hover effects (`.card-hover`)
   - Shadow system (`.shadow-soft`, `.shadow-elevated`, `.shadow-brand`)
   - Glow effects (`.glow-brand`, `.glow-gold`)
   - Animation utilities (fadeUp, shimmer, float, pulseGlow)
   - Photo card overlays (`.photo-card`)

4. **Chat Page UI Refresh**
   - New brand colors in header, avatars, and message bubbles
   - User messages: dark ink gradient background
   - AI messages: white with soft shadow
   - AI avatar: red-gold gradient with 途 character
   - Improved quick actions with China-specific prompts (6 instead of 4)
   - Enhanced welcome message with emoji bullets and clear service categories
   - Green "Online" status badge
   - "Powered by Gemini AI" footer text

5. **Component Updates**
   - LocationCard: Category emojis (🍜🏛️🏨🛍️🚄📍), brand-colored save button
   - LocationMap: Cleaner CARTO Voyager tiles, rounded corners
   - SessionList: Brand gradient buttons and active states
   - MessageInput: Simplified (removed AI provider picker)

---

## Phase 2: AI System + Backend ✅ COMPLETE
**Completed**: 2026-03-09

### What Changed
1. **AI Backend: Anthropic → Gemini 2.5 Pro**
   - Primary: Gemini 2.5 Pro via OpenAI-compatible API
   - Fallback chain: Gemini → DeepSeek → Groq
   - Single unified streaming format (SSE)
   - Removed multi-provider picker from UI
   - API key configured in `.env.local`

2. **System Prompt: Complete Rewrite**
   - Professional China travel consultant personality
   - Warm, knowledgeable, practical tone ("like a friend who's lived in China 10 years")
   - Structured conversation flow (welcome → planning → recommendations → during-trip support)
   - Deep China-specific knowledge:
     - Payment setup (WeChat/Alipay for foreigners)
     - Transportation (高铁, metro, DiDi)
     - Communication (VPN, eSIM)
     - Accommodation (外宾 certification)
     - Food & dining (QR menus, dietary phrases)
     - Culture & etiquette
   - Output formatting rules (markdown, Chinese + pinyin, costs in ¥)
   - Location data format preserved (<LOCATION_DATA> JSON)

3. **New Welcome Message**
   - Professional bilingual greeting (Nǐ hǎo! 你好!)
   - 6 service categories with emojis
   - Clear call-to-action

4. **Quick Actions Updated**
   - "Plan a 5-day Beijing & Shanghai trip"
   - "How do I set up WeChat Pay?"
   - "Best street food in Chengdu"
   - "Help me book high-speed rail tickets"
   - "What VPN works best in China?"
   - "Essential Chinese phrases for travelers"

### Technical Details
- Gemini API: `gemini-2.5-pro-preview-06-05` via `generativelanguage.googleapis.com/v1beta/openai/`
- Uses existing `openai` SDK (no new dependencies needed)
- Rate limiting: 20 req/min per IP (unchanged)
- Guest access: still supported (no auth required)

---

## Phase 3: Map Overhaul ✅ COMPLETE
**Completed**: 2026-03-09

### What Changed
1. **Map Tile Upgrade: CartoDB Positron**
   - Switched from CARTO Voyager to CartoDB Positron (light_all)
   - Clean, minimal monochrome base map that lets markers and routes pop
   - Better visual hierarchy — map content takes center stage

2. **Custom Category Marker Icons**
   - Beautiful SVG drop-pin markers colored by category:
     - 🍜 Restaurant — Orange (#F97316)
     - 🏛️ Attraction — Chinese Red (#E8453C)
     - 🏨 Hotel — Purple (#8B5CF6)
     - 🚄 Transport — Blue (#3B82F6)
     - 🛍️ Shopping — Pink (#EC4899)
     - 📍 Other — Slate (#64748B)
   - White inner circle with emoji icon for instant recognition
   - Numbered badges (top-right of pin) show visit order
   - Drop shadow + hover scale animation for interactivity
   - Hidden default leaflet shadows for clean look

3. **Rich Popup Overlays on Click**
   - Category-colored gradient header with emoji + name + order badge
   - Address shown under name
   - Body section with description (2-line clamp), rating (⭐), cost (¥), duration (⏱)
   - Category-colored tags at bottom
   - Custom popup CSS: rounded corners, soft shadows, styled close button
   - Min-width 260px, max-width 320px for consistent sizing

4. **Route Polyline Connections**
   - Dashed line connecting locations in order (ink-dark #1A1A2E)
   - Weight 2.5, opacity 50%, dash pattern 8/12 for subtle but clear route
   - Rounded line caps and joins
   - Only shows when 2+ locations exist

5. **Map ↔ List View Toggle**
   - Toggle bar at top of map component: "Map" and "List" buttons
   - Pill-style toggle with active state (white bg + shadow) vs inactive (muted text)
   - Location count + "route view" indicator in header
   - **Map view**: Full interactive Leaflet map with all markers + route
   - **List view**: Scrollable card list with:
     - Numbered category-colored badges
     - Name, address, rating, cost, duration
     - Gradient connector lines between items
     - Hover states and chevron arrows
   - Smooth transitions between views

6. **Smarter Map Zoom**
   - Auto-calculates zoom based on geographic spread of locations:
     - Single location: zoom 14
     - Spread > 5°: zoom 6 (cross-country)
     - Spread > 2°: zoom 8 (regional)
     - Spread > 0.5°: zoom 10 (city area)
     - Spread > 0.1°: zoom 12 (neighborhood)
     - Tight cluster: zoom 13

7. **CSS Improvements**
   - Custom `.custom-marker-icon` styles (transparent bg, no border)
   - `.custom-popup` styles: rounded wrappers, soft shadows, styled close buttons
   - Marker hover scale animation (1.1x with z-index boost)
   - Hidden default leaflet marker shadows

### Technical Details
- Map tiles: CartoDB Positron (`light_all/{z}/{x}/{y}{r}.png`)
- Markers: SVG-based `L.divIcon` with inline SVG (no external image deps)
- Route: react-leaflet `<Polyline>` with dashed styling
- View toggle: React state (`'map' | 'list'`) with conditional rendering
- Icons memoized per location to avoid re-creation on render
- Build verified: zero TypeScript errors

---

## Phase 4: Feature Completion + Deploy ✅ COMPLETE
**Completed**: 2026-03-09

### What Changed
1. **Inspiration Page (`/inspiration`)**
   - Full curated itineraries page with 3 hand-crafted templates:
     - **Classic Beijing & Shanghai** (7 days) — Imperial history + modern skyline
     - **Deep Southwest Explorer** (14 days) — Chengdu + Chongqing + Yunnan
     - **Xi'an Silk Road Heritage** (5 days) — Terracotta Warriors + Muslim Quarter
   - Grid view with beautiful cover cards (duration badge, difficulty level, highlights, budget)
   - Detail view with:
     - Hero image + quick info bar (cities, duration, budget, best season)
     - Route visualization (city → city arrows)
     - Trip highlights grid with brand gradients
     - Day-by-day collapsible itinerary (expandable accordion with highlights, meals, transport)
     - Insider tips section
     - "Use This Plan" CTA that launches AI chat with pre-filled template context
   - "Have a different destination?" custom itinerary CTA at bottom
   - Consistent brand header + footer

2. **Homepage → Inspiration Integration**
   - Added "Inspiration" link in top navigation
   - Added "View curated itineraries →" link in Popular Destinations section
   - Added "Inspiration" link in footer Product section
   - Homepage search + city clicks now auto-send message to AI chat via `?q=` param

3. **Auto-Send from URL Query**
   - Chat page now reads `?q=` search param and auto-sends as first message
   - Works from homepage search, city clicks, and inspiration "Use this plan" button

4. **PWA Support**
   - `manifest.json` with app name, description, theme color, icons
   - PWA icons: 192×192 and 512×512 PNG (gradient 途 logo)
   - Apple Web App meta tags (capable, status-bar-style, title)
   - `theme-color` meta tag (#E8453C brand red)
   - `apple-touch-icon` link
   - Standalone display mode — installable on mobile home screen

5. **Responsive Improvements**
   - Explicit `Viewport` export with device-width, no user scaling, viewport-fit cover
   - Safe area inset support for notched phones (PWA mode)
   - Mobile-specific CSS overrides (tighter hero text, section padding)
   - Chat quick actions horizontally scrollable on small screens
   - Map container max-width constraint for mobile
   - Inspiration page fully responsive (single column on mobile, 3-col on desktop)

6. **Build Verification**
   - `npx next build` — zero errors, zero warnings
   - All 23 routes compile successfully (static + dynamic)
   - `/inspiration` pre-rendered as static content for fast loading

7. **Zeabur Deployment**
   - Successfully deployed to Zeabur (service ID: 69a1be8a79f74da9ed5a8f43)
   - No `output: 'standalone'` — compatible with `next start`
   - Live at https://tototrip.zeabur.app

### Technical Details
- Inspiration page: ~37KB, fully client-side rendered with framer-motion
- PWA icons generated from SVG via macOS qlmanage
- Viewport config uses Next.js 14+ `Viewport` export (not meta tag)
- No new dependencies added — uses existing framer-motion, lucide-react, next/image

---

## Phase 5: Bug Fixes (Experience Report v1) ✅ COMPLETE
**Completed**: 2026-03-09

### Bugs Fixed

#### P0-1: LOCATION_DATA JSON Raw Text Exposed in Chat UI ✅
- **Problem**: During streaming, `<LOCATION_DATA>{"locations":[...]}</LOCATION_DATA>` raw JSON was visible to users for 5-10 seconds before being parsed into LocationCards
- **Root Cause**: `parseLocationsFromMessage()` returned content as-is when `<LOCATION_DATA>` tag was open but not closed (streaming state)
- **Fix**: In `lib/parseLocations.ts`:
  1. Strip incomplete `<LOCATION_DATA>...` block from displayed text during streaming (regex replace from opening tag to end of string)
  2. Strip partially-typed opening tags (e.g. `<LOCATIO`, `<LOCATION_D`) from the end of streaming content
  3. Only parse and render LocationCards after the complete `</LOCATION_DATA>` closing tag arrives

#### P0-2: Zeabur 502 Deployment Fix ✅
- **Problem**: https://tototrip.zeabur.app returning 502 SERVICE_UNAVAILABLE
- **Verified**: `next.config.mjs` has NO `output: 'standalone'` (confirmed compatible with Zeabur's `next start`)
- **Verified**: `package.json` start script is `next start -p ${PORT:-3000}` (correct)
- **Action**: Rebuilt (`npx next build` — zero errors) and redeployed via `zeabur deploy`
- **Result**: Site now returns HTTP 200

#### P1-1: Excessive Section Spacing on Homepage ✅
- **Problem**: Page total height ~5000px with too much whitespace between sections
- **Fix**: Reduced section padding across the board:
  - All content sections: `py-20 md:py-28` → `py-14 md:py-20`
  - Hero section: `pt-20 pb-24 md:pt-28 md:pb-32` → `pt-16 pb-16 md:pt-24 md:pb-24`
  - CTA section: `py-24` → `py-16 md:py-20`
  - Section heading margins: `mb-14`/`mb-16` → `mb-10`
- **Result**: Estimated ~800-1000px reduction in total page height

#### P1-2: Social Proof Counter Shows "0+" Initially ✅
- **Problem**: `AnimatedCounter` component initialized with `useState(0)`, showing "0+" / "0★" / "0/7" until scroll-triggered animation
- **Fix**:
  1. Changed initial state to `useState(end)` — counter always shows the target number
  2. Increased IntersectionObserver margin from `-50px` to `100px` (triggers earlier)
  3. Animation now starts from 80% of target value for a subtle count-up effect (less jarring)
  4. Added `hasAnimated` ref to prevent re-triggering
- **Result**: Users always see "10,000+" / "50+" / "48★" / "24/7" on page load

---

## Phase 5b: Navigation + Mobile Optimization ✅ COMPLETE
**Completed**: 2026-03-09

### Bugs Fixed

#### 1. Mobile Hamburger Menu (P2/P3) ✅
- **Problem**: Mobile (<768px) showed desktop nav links, no hamburger menu
- **Fix**: Added hamburger menu to both Homepage and Inspiration page
  - `<Menu>` / `<X>` toggle button visible on `md:hidden`
  - Animated dropdown (`motion.div`) with all nav links: Home, Destinations, Inspiration, Why TotoTrip, How it Works
  - Auth buttons (Login/Get Started or My Trips/Logout) in mobile dropdown
  - Desktop nav links and auth buttons hidden on mobile (`hidden md:inline-flex`)
  - Menu auto-closes on link click
  - Glass-morphism backdrop + elevation shadow for premium feel

#### 2. Sticky Nav Occlusion Fix (P2) ✅
- **Problem**: Sticky navigation bar overlapping content when scrolling through city cards and other sections
- **Fix**: Added `relative z-0` to all content sections (Hero, Destinations, Social Proof, Why TotoTrip, How it Works)
  - Creates proper stacking context hierarchy: header at `z-50` always above content at `z-0`
  - Prevents card hover animations (scale 1.03 + translate-y) from visually overlapping the nav

#### 3. Mobile LocationCard Price Truncation (P3) ✅
- **Problem**: Price text (e.g. ¥350) cut off on small screens, only showing "¥"
- **Fix**: Changed price row from `justify-between` to `flex-wrap gap-2` with `whitespace-nowrap` on the price element
  - Price symbols (¥¥¥) and exact price (¥350) now wrap to next line on narrow cards instead of being truncated

#### 4. Chat List View Input Occlusion (P2) ✅
- **Problem**: Map's List view bottom content hidden behind the chat input box
- **Fix**:
  1. Added `pb-4` to LocationMap list view inner container for extra bottom breathing room
  2. Increased MessageList bottom padding from `py-4` to `py-4 pb-8`, ensuring last message (with map/cards) has clearance above the input bar

### Deployment
- `npx next build` — zero errors, zero warnings
- Deployed to Zeabur via `zeabur deploy`
- Live at https://tototrip.zeabur.app
