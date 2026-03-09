# 🗺️ TotoTrip Product Roadmap — From MVP to Reddit Launch

> **Goal:** Polish the product to a level where real users from Reddit can sign up, plan trips, and have a smooth experience
> **Standard:** Must feel like a real product, not a prototype
> **Timeline:** Phased approach, each phase deployable

---

## 📊 Current State Assessment (v2.2)

### ✅ What Works
- AI chat with streaming (Gemini 2.5 Pro)
- 6 city detail pages + destinations navigation
- Inspiration page (10 templates, 6 themes)
- Travel Toolkit (6 guides: payment/visa/internet/transport/food/language)
- Brand identity (Toto mascot, custom fonts, brand colors)
- Itinerary timeline + interactive map
- Trip save/share (localStorage)
- i18n (en + zh)
- Dark mode
- SEO + OG cards + sitemap
- 404/Error/Loading branded pages
- PWA-ready
- Deployed on Zeabur

### 🔴 What's Missing for Real Users
1. **Auth doesn't work in production** — Google OAuth needs Supabase dashboard config (redirect URL, Google Cloud credentials)
2. **Data is localStorage only** — Trips/chat not synced to Supabase; switch device = lose everything
3. **No analytics** — Zero visibility on user behavior
4. **No feedback mechanism** — No way for users to report issues or suggest features
5. **No custom domain** — `tototrip.zeabur.app` looks unprofessional
6. **No rate limiting** — AI API could be abused
7. **No legal pages** — Privacy policy, Terms of Service required
8. **Chat history not persistent** — New session = fresh start
9. **No email verification flow** — Signup exists but unpolished
10. **Performance unaudited** — No Lighthouse/Core Web Vitals check

---

## 🚀 Roadmap Phases

### Phase 1: Auth & Data Persistence 🔐 ⭐⭐⭐
> **"Users can sign up, log in, and keep their data"**

| Task | Priority | Details |
|------|----------|---------|
| Google OAuth setup | 🔴 Critical | Configure in Supabase dashboard: Google Cloud OAuth credentials, redirect URLs |
| Email/password auth polish | 🔴 Critical | Email verification flow, password reset, error messages |
| Supabase trip sync | 🔴 Critical | Replace localStorage with Supabase for logged-in users; keep localStorage as guest fallback |
| Chat history persistence | 🔴 Critical | Save chat sessions to Supabase, load on return |
| Profile page | 🟠 High | View/edit profile, change language/currency, avatar |
| Guest → User migration | 🟠 High | When guest signs up, migrate their localStorage trips to Supabase |

**Deliverable:** Users can Google login → plan trip → close browser → come back → everything's there

---

### Phase 2: Production Hardening 🛡️ ⭐⭐⭐
> **"The product doesn't break under real traffic"**

| Task | Priority | Details |
|------|----------|---------|
| API rate limiting | 🔴 Critical | Limit AI chat requests (e.g., 20/hour for guests, 50/hour for logged-in) |
| Error monitoring | 🔴 Critical | Sentry or similar — catch crashes before users report them |
| API key security | 🔴 Critical | Move AI API calls server-side only (already done), add request validation |
| Performance audit | 🟠 High | Lighthouse score > 90, optimize images, lazy load, code split |
| Mobile experience QA | 🟠 High | Full test on iOS Safari + Android Chrome |
| Edge cases | 🟠 High | Empty states, network failures, token limits, concurrent requests |

**Deliverable:** Product handles 100+ concurrent users without breaking

---

### Phase 3: Trust & Polish ✨ ⭐⭐
> **"It looks and feels like a real product people would trust"**

| Task | Priority | Details |
|------|----------|---------|
| Custom domain | 🔴 Critical | `tototrip.com` or `toto.travel` — looks professional |
| Privacy Policy | 🔴 Critical | GDPR-compliant, covers data collection/AI usage |
| Terms of Service | 🔴 Critical | Standard ToS for web app |
| About page | 🟠 High | Who built this, why, contact info |
| In-app feedback | 🟠 High | "Report a bug" / "Suggest a feature" button → collects to Discord/email |
| Social proof | 🟡 Medium | Testimonials (can start with beta testers), usage stats |
| Cookie consent | 🟡 Medium | GDPR banner if needed |
| Favicon + app icons | 🟡 Medium | Toto branded icons for all platforms |

**Deliverable:** Users trust the product enough to create an account

---

### Phase 4: Analytics & Growth 📈 ⭐⭐
> **"We know what users do and can improve based on data"**

| Task | Priority | Details |
|------|----------|---------|
| Analytics setup | 🔴 Critical | Plausible/Umami (privacy-friendly) or Google Analytics |
| Event tracking | 🔴 Critical | Track: signups, chat messages sent, trips saved, pages visited |
| Funnel analysis | 🟠 High | Landing → Chat → Save Trip → Share — where do users drop? |
| Feedback collection | 🟠 High | Auto-aggregate Reddit comments, in-app feedback, Discord #反馈 |
| A/B testing framework | 🟡 Medium | Test different landing page CTAs, chat prompts |
| Email capture | 🟡 Medium | "Get China travel tips" newsletter signup for non-registered users |

**Deliverable:** Data-driven iteration loop

---

### Phase 5: Reddit Launch 🚀 ⭐
> **"Go live on Reddit with confidence"**

| Task | Priority | Details |
|------|----------|---------|
| Reddit account setup | 🔴 Critical | Dedicated TotoTrip account, build karma first |
| Launch post drafts | 🔴 Critical | r/travelchina, r/chinalife, r/travel, r/digitalnomad |
| Value-first content | 🔴 Critical | Post genuine China travel tips with Toto link naturally embedded |
| Comment monitoring | 🟠 High | Auto-alert on mentions, quick response to feedback |
| Landing page optimization | 🟠 High | Clear CTA for Reddit traffic: "Plan your China trip in 2 minutes" |
| OG/share cards | 🟡 Medium | When someone shares tototrip.com, the preview looks great |

**Deliverable:** First 100 real users from Reddit

---

## 📅 Timeline Estimate

| Phase | Est. Duration | Status |
|-------|--------------|--------|
| Phase 1: Auth & Data | 2-3 days | 🔜 Next |
| Phase 2: Production Hardening | 1-2 days | Queued |
| Phase 3: Trust & Polish | 1-2 days | Queued |
| Phase 4: Analytics & Growth | 1 day | Queued |
| Phase 5: Reddit Launch | 1 day + ongoing | Queued |

**Total: ~7-10 days to Reddit-ready**

---

## 🎯 Reddit Launch Criteria (Must-Have Checklist)

- [ ] Google OAuth works end-to-end
- [ ] Trip data persists in Supabase (not just localStorage)
- [ ] Chat history saved per user
- [ ] Rate limiting on AI API
- [ ] Custom domain live
- [ ] Privacy Policy + ToS pages
- [ ] Error monitoring active
- [ ] Lighthouse score > 85
- [ ] Mobile experience verified
- [ ] In-app feedback mechanism
- [ ] Analytics tracking key events
- [ ] OG cards / share previews look professional

---

_Roadmap by Morty | 瑞莫科技 | 2026-03-09_
_Last updated: v3.0_
