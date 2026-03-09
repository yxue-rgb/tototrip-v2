# TotoTrip Sprint Status

## Sprint v4.2 — P1 + P2 Batch Fix (2026-03-09)

**Status**: ✅ DEPLOYED  
**Deployed at**: https://v2-gray-nu.vercel.app  
**Build**: Zero errors, 43 pages generated

### Fixes Applied

| Bug | Severity | Status | Details |
|-----|----------|--------|---------|
| **#8: "Guides" nav not translated** | P1 | ✅ Fixed | Added `nav.guides` key to `en.json` and `zh.json`. All nav references in homepage (desktop + mobile + footer) now use `t("nav.guides")`. |
| **#9: "PACK LIGHT-HEARTED" not translated** | P1 | ✅ Fixed | Added `cta.packLine1` and `cta.packLine2` i18n keys. Chinese: "轻装出发 / 快乐同行". Homepage CTA section now uses `t()`. |
| **#10: Privacy Policy inaccurate info** | P1 | ✅ Fixed | Replaced "OpenAI and Anthropic" → "Google Gemini AI" and "Zeabur" → "Vercel" in both EN and ZH content of `/privacy`. Terms page had no such references. |
| **#11: Trust bar not translated** | P2 | ✅ Fixed | Added `trustBar.*` keys to both locale files. Trust badges now use `t("trustBar.poweredByAI")` etc. Chinese: "谷歌 AI 驱动", "覆盖 50+ 城市", etc. |
| **#12: FAQ missing footer** | P2 | ✅ Fixed | Replaced minimal header with `SharedNavbar`, added `SharedFooter` at bottom. Adjusted padding for fixed nav. |
| **#13: Footer inconsistent** | P2 | ✅ Fixed | Created `components/SharedFooter.tsx` — full footer with brand, product/company/connect columns, copyright. Applied to: about, privacy, terms, faq, guides, inspiration, toolkit, destinations. |
| **#16: Navigation inconsistent** | P2 | ✅ Fixed | Created `components/SharedNavbar.tsx` — unified nav with Destinations, Inspiration, Guides, Toolkit links + mobile menu. Applied to: guides, inspiration, toolkit, faq (4 pages). Homepage keeps its own expanded nav. |

### New Components
- `components/SharedNavbar.tsx` — Reusable nav with `activePage` prop for highlight
- `components/SharedFooter.tsx` — Full footer matching homepage style

### Files Changed
- `messages/en.json` — Added `nav.guides`, `trustBar.*`, `cta.packLine1/packLine2`
- `messages/zh.json` — Added `nav.guides`, `trustBar.*`, `cta.packLine1/packLine2`
- `app/page.tsx` — Trust bar i18n, CTA i18n, Guides nav i18n (5 occurrences)
- `app/privacy/page.tsx` — OpenAI→Gemini, Zeabur→Vercel (EN+ZH), SharedFooter
- `app/terms/page.tsx` — SharedFooter
- `app/about/page.tsx` — SharedFooter
- `app/faq/page.tsx` — SharedNavbar + SharedFooter (replaces custom header)
- `app/guides/page.tsx` — SharedNavbar + SharedFooter (replaces custom header+footer)
- `app/inspiration/page.tsx` — SharedNavbar + SharedFooter (replaces custom header+footer)
- `app/toolkit/page.tsx` — SharedNavbar + SharedFooter (replaces custom header+footer)
- `app/destinations/[city]/page.tsx` — SharedFooter

---

## Sprint v4.1 — P0 Bug Fix (2026-03-09)

**Status**: ✅ DEPLOYED  
**Deployed at**: https://v2-gray-nu.vercel.app  
**Build**: Zero errors, 43 pages generated

### Fixes Applied

| Bug | Severity | Status | Details |
|-----|----------|--------|---------|
| **Chat input permanently disabled** | P0 | ✅ Fixed | Added `isSendingRef` guard to prevent concurrent `handleSendMessage` calls. The `finally` block now reliably resets both `isLoading` state and the ref. |
| **Guide detail pages 404** | P0 | ✅ Fixed | `app/guides/[slug]/page.tsx` had sync `params` — updated to `Promise<{ slug: string }>` for Next.js 16 compatibility. `generateMetadata` also updated to async. All 6 guide slugs now SSG correctly. |
| **AI double reply (ghost message)** | P0 | ✅ Fixed | Two causes addressed: (1) `isSendingRef` prevents double invocation of `handleSendMessage`. (2) Error `catch` block now replaces the existing blank assistant placeholder instead of appending a second message. |
| **Dark logo 400 error** | P1 | ✅ Fixed | `toto_logo_plain_dark.png` doesn't exist — corrected to `toto_logo_plain.png` in `/privacy`, `/terms`, `/about` pages. |
| **Unsplash image 404** | P1 | ⚠️ No code change needed | `images.unsplash.com` was already in `next.config.mjs` `remotePatterns`. 404s are likely from Unsplash removing specific photos — not a config issue. |
| **Toolkit footer links** | P1 | ✅ Fixed | Changed `href="#"` to `/faq` (Help Center), `/privacy`, `/terms` in toolkit page footer. |

### Files Changed
- `app/chat/[id]/page.tsx` — concurrency guard + error message dedup
- `app/guides/[slug]/page.tsx` — async params for Next.js 16
- `app/privacy/page.tsx` — logo path fix
- `app/terms/page.tsx` — logo path fix
- `app/about/page.tsx` — logo path fix
- `app/toolkit/page.tsx` — footer link fix
