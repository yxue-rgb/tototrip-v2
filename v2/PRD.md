# Product Requirements Document (PRD)
# TotoTrip AI Travel Companion

**Version:** 1.0
**Last Updated:** December 2024
**Product Owner:** TotoTrip Team
**Status:** MVP Development

---

## 1. Executive Summary

TotoTrip is an AI-powered travel companion specifically designed for foreign travelers visiting China. Unlike generic travel planning tools, TotoTrip provides real-time, conversational assistance that acts as a knowledgeable local friend, helping travelers navigate the unique challenges of traveling in China.

**Core Value Proposition:**
"Your 24/7 AI travel companion that understands both you and China"

---

## 2. Problem Statement

### 2.1 Market Problems

**Primary Pain Points:**

1. **Information Overload**
   - Traditional travel guides are outdated and overwhelming
   - Too many options, not enough personalized guidance
   - Conflicting information across platforms

2. **Cultural & Language Barriers**
   - Foreign travelers struggle with Chinese language
   - Payment systems (WeChat Pay, Alipay) are complex
   - Cultural norms and etiquette are unclear
   - Navigation without Google Maps is challenging

3. **Real-time Decision Making**
   - Need help during travel, not just planning phase
   - Unexpected situations require immediate assistance
   - Static itineraries don't adapt to reality

4. **China-Specific Challenges**
   - VPN and internet access issues
   - Train/metro ticket booking complexity
   - Finding foreigner-friendly establishments
   - Understanding local customs and taboos

### 2.2 Existing Solutions & Gaps

**Competitors:**
- **Mindtrip:** Global focus, lacks China-specific depth
- **TripAdvisor:** Static content, not conversational
- **Google Travel:** Blocked in China, generic recommendations
- **Local Apps (携程, 马蜂窝):** Chinese-only, not foreigner-friendly

**Gap in Market:**
No AI-first, real-time companion specifically built for foreign travelers in China.

---

## 3. Target Users

### 3.1 Primary Persona: "Alex the Explorer"

**Demographics:**
- Age: 25-45
- Nationality: Western countries (US, EU, Australia)
- Language: English primary, minimal Chinese
- Tech-savvy, comfortable with AI tools

**Characteristics:**
- First or second time visiting China
- Traveling solo or small groups (2-4 people)
- Budget: Mid-range ($100-300/day)
- Duration: 1-3 weeks
- Interests: Culture, food, authentic experiences

**Pain Points:**
- Overwhelmed by planning
- Anxious about language barriers
- Worried about getting lost
- Unsure about cultural norms
- Needs real-time help during trip

**Goals:**
- Have authentic local experiences
- Feel confident navigating China
- Maximize time (avoid tourist traps)
- Stay connected and safe
- Get personalized recommendations

### 3.2 Secondary Personas

**"Business Traveler Ben"**
- Age: 30-50, business trips to China
- Needs: Efficient recommendations, work-friendly venues
- Time: Limited free time, wants optimized experiences

**"Digital Nomad Diana"**
- Age: 25-35, remote worker living in China short-term
- Needs: Coworking spaces, expat-friendly areas, visa tips
- Duration: 1-6 months

---

## 4. Product Vision & Goals

### 4.1 Vision Statement

"To be the most trusted AI travel companion for foreign travelers in China, making every journey feel like traveling with a knowledgeable local friend."

### 4.2 Product Goals

**Short-term (3 months):**
- ✅ Launch MVP with AI chat and basic recommendations
- ✅ Implement map visualization
- 🎯 Achieve 100 active users
- 🎯 70% user satisfaction (NPS > 50)

**Mid-term (6 months):**
- 🎯 Add user accounts and saved itineraries
- 🎯 Integrate real-time data (weather, events, transport)
- 🎯 Reach 1,000 active users
- 🎯 Achieve 20% week-over-week retention

**Long-term (12 months):**
- 🎯 Booking integration (hotels, tickets, tours)
- 🎯 Mobile app launch
- 🎯 10,000+ active users
- 🎯 Revenue positive ($10k+ MRR)

### 4.3 Success Metrics

**Key Performance Indicators (KPIs):**

| Metric | Current | Target (3mo) | Target (6mo) |
|--------|---------|--------------|--------------|
| Active Users | 0 | 100 | 1,000 |
| Daily Messages | - | 50 | 500 |
| User Retention (D7) | - | 30% | 50% |
| NPS Score | - | 50 | 60 |
| Avg Session Time | - | 5 min | 8 min |
| Conversion to Save | - | 40% | 60% |

**North Star Metric:**
**Number of trips successfully planned and executed using TotoTrip**

---

## 5. Features & Requirements

### 5.1 Current Features (MVP)

#### F1: AI Conversational Chat
**Priority:** P0 (Must Have)
**Status:** ✅ Implemented

**Description:**
Real-time chat interface with Claude AI, providing conversational travel assistance.

**Functional Requirements:**
- ✅ FR1.1: Users can send text messages to AI
- ✅ FR1.2: AI responds with streaming text (visible as it types)
- ✅ FR1.3: AI understands travel context and provides China-specific advice
- ✅ FR1.4: Conversation history maintained during session
- ❌ FR1.5: Multi-language support (Chinese/English) [Planned]

**Technical Requirements:**
- Uses Claude 3 Haiku for fast responses
- Streaming response with Server-Sent Events
- Maximum 1500 tokens per response
- Session-based history (no persistence yet)

**User Stories:**
- As a traveler, I want to ask "What should I do in Beijing?" and get personalized recommendations
- As a user, I want to see the AI's response appear in real-time so I know it's working

---

#### F2: Location Recommendations
**Priority:** P0 (Must Have)
**Status:** ✅ Implemented

**Description:**
AI generates structured location recommendations with rich metadata displayed as cards.

**Functional Requirements:**
- ✅ FR2.1: AI returns 1-3 locations per query
- ✅ FR2.2: Each location includes name, description, category, address
- ✅ FR2.3: Locations show rating, price level, estimated cost
- ✅ FR2.4: Visit duration and tags displayed
- ⚠️ FR2.5: Images shown (currently placeholder URLs)
- ❌ FR2.6: Real-time availability data [Planned]

**Data Model:**
```typescript
interface Location {
  id: string;
  name: string;
  description: string;
  category: 'attraction' | 'restaurant' | 'hotel' | 'shopping' | 'transport' | 'other';
  address?: string;
  latitude?: number;
  longitude?: number;
  rating?: number;
  priceLevel?: 1 | 2 | 3 | 4;
  estimatedCost?: number;
  currency?: string;
  visitDuration?: string;
  tags?: string[];
  imageUrl?: string;
}
```

**User Stories:**
- As a traveler, I want to see recommended places with photos and ratings
- As a user, I want to know how much time and money each place requires

---

#### F3: Interactive Map
**Priority:** P0 (Must Have)
**Status:** ✅ Implemented

**Description:**
Visual map showing all recommended locations with markers and popups.

**Functional Requirements:**
- ✅ FR3.1: Display all recommended locations on a map
- ✅ FR3.2: Auto-center map based on location cluster
- ✅ FR3.3: Clickable markers show location details
- ✅ FR3.4: Zoom and pan controls
- ❌ FR3.5: Route planning between locations [Planned]
- ❌ FR3.6: User's current location marker [Planned]

**Technical Requirements:**
- Uses Leaflet with OpenStreetMap tiles
- Responsive design (mobile-friendly)
- Markers with custom icons
- Popup with location info

**User Stories:**
- As a traveler, I want to see where recommended places are located
- As a user, I want to visualize the spatial relationship between locations

---

### 5.2 Planned Features (Next Phase)

#### F4: User Accounts & Authentication
**Priority:** P0 (Must Have)
**Status:** 📋 Planned
**Timeline:** Week 1-2

**Description:**
User registration and login to save personal data and preferences.

**Functional Requirements:**
- FR4.1: Email/password registration
- FR4.2: Social login (Google, Apple)
- FR4.3: Password reset flow
- FR4.4: User profile management
- FR4.5: Email verification

**Technical Requirements:**
- Supabase Auth integration
- JWT token-based authentication
- Secure password hashing
- Rate limiting on auth endpoints

---

#### F5: Trip Saving & Management
**Priority:** P0 (Must Have)
**Status:** 📋 Planned
**Timeline:** Week 2-3

**Description:**
Users can save chat conversations, locations, and create itineraries.

**Functional Requirements:**
- FR5.1: Save chat conversations with title
- FR5.2: Bookmark favorite locations
- FR5.3: Create named trips (e.g., "Beijing Adventure 2024")
- FR5.4: Organize locations into trips
- FR5.5: Share trips via link

**Database Schema:**
```sql
-- Trips
CREATE TABLE trips (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  title TEXT NOT NULL,
  destination TEXT,
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Saved Locations
CREATE TABLE saved_locations (
  id UUID PRIMARY KEY,
  trip_id UUID REFERENCES trips,
  location_data JSONB NOT NULL,
  notes TEXT,
  saved_at TIMESTAMP DEFAULT NOW()
);

-- Chat History
CREATE TABLE chat_sessions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  trip_id UUID REFERENCES trips,
  messages JSONB[],
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

#### F6: Itinerary Timeline View
**Priority:** P1 (Should Have)
**Status:** 📋 Planned
**Timeline:** Week 3-4

**Description:**
Visual day-by-day timeline showing planned activities with times and logistics.

**Functional Requirements:**
- FR6.1: Drag-and-drop locations into daily schedule
- FR6.2: Automatic time estimation and logistics
- FR6.3: Travel time calculation between locations
- FR6.4: Conflict detection (overlapping times)
- FR6.5: Export to calendar (iCal format)
- FR6.6: Print-friendly itinerary view

**UI Mockup Concept:**
```
Day 1 - June 15, 2024
├─ 9:00 AM  - Forbidden City (2-3 hours)
├─ 12:30 PM - Lunch at Dadong (1.5 hours)
├─ 2:30 PM  - Travel time: 30 min
└─ 3:00 PM  - Temple of Heaven (1.5 hours)

Budget: ¥450 (~$65)
Walking: 2.3 km | Transit: 5 km
```

---

#### F7: Budget Tracker
**Priority:** P1 (Should Have)
**Status:** 📋 Planned
**Timeline:** Week 4-5

**Description:**
Track estimated vs actual costs for the trip.

**Functional Requirements:**
- FR7.1: Automatic budget estimation from AI recommendations
- FR7.2: Manual expense tracking
- FR7.3: Category breakdown (food, transport, attractions)
- FR7.4: Currency conversion
- FR7.5: Budget alerts when approaching limits
- FR7.6: Export expenses to CSV

---

#### F8: Real-time Data Integration
**Priority:** P1 (Should Have)
**Status:** 📋 Planned
**Timeline:** Week 5-6

**Description:**
Live data from external APIs for accuracy and relevance.

**Data Sources:**
- **Weather:** OpenWeatherMap API
- **Maps:** Amap (高德地图) API for China
- **Events:** Web scraping from local event sites
- **Transport:** Real-time subway/train status
- **Reviews:** TripAdvisor API (if available)

**Functional Requirements:**
- FR8.1: Show current weather for destinations
- FR8.2: Highlight events happening during travel dates
- FR8.3: Real-time opening hours
- FR8.4: Transport disruption alerts

---

#### F9: Offline Mode
**Priority:** P2 (Nice to Have)
**Status:** 💡 Future
**Timeline:** Month 3+

**Description:**
Core features work without internet (critical for VPN issues in China).

**Functional Requirements:**
- FR9.1: Download itinerary for offline access
- FR9.2: Offline maps for saved areas
- FR9.3: Sync when back online
- FR9.4: Basic AI chat with cached responses

---

#### F10: Booking Integration
**Priority:** P1 (Should Have)
**Status:** 💡 Future
**Timeline:** Month 4+

**Description:**
One-click booking for recommended places.

**Functional Requirements:**
- FR10.1: Hotel booking (Booking.com, Agoda)
- FR10.2: Activity tickets (Klook, GetYourGuide)
- FR10.3: Train tickets (Trip.com API)
- FR10.4: Restaurant reservations (if available)

**Revenue Model:**
- Affiliate commissions (5-15% per booking)
- Target: $10-30 per trip conversion

---

### 5.3 China-Specific Features

#### F11: Cultural Guide
**Priority:** P1 (Should Have)
**Status:** 📋 Planned

**Description:**
Built-in cultural tips and etiquette guidance.

**Topics:**
- Tipping customs (not expected)
- Gift giving etiquette
- Dining manners (tea, chopsticks, lazy susan)
- Greeting and business cards
- Taboo topics and behaviors
- Festival meanings and traditions

---

#### F12: Payment Assistant
**Priority:** P0 (Must Have)
**Status:** 📋 Planned

**Description:**
Guide for setting up and using WeChat Pay / Alipay.

**Content:**
- Step-by-step setup guides
- Foreign credit card linking
- QR code payment tutorial
- Cash withdrawal tips
- Currency exchange advice

---

#### F13: Translation Helper
**Priority:** P1 (Should Have)
**Status:** 💡 Future

**Description:**
Quick translations for common situations.

**Features:**
- Common phrases (taxi, restaurant, emergency)
- Photo translation (menu OCR)
- Voice input/output
- Saved phrases library

---

## 6. Technical Architecture

### 6.1 Current Stack

**Frontend:**
- Framework: Next.js 15 (App Router)
- Language: TypeScript
- Styling: Tailwind CSS
- Components: shadcn/ui
- Animations: Framer Motion
- Maps: Leaflet + react-leaflet
- Markdown: react-markdown

**Backend:**
- Runtime: Next.js API Routes (Node.js)
- AI: Anthropic Claude API (Haiku model)
- Database: None (planned: Supabase PostgreSQL)
- Storage: None (planned: Supabase Storage)

**Infrastructure:**
- Hosting: Vercel (planned)
- CDN: Vercel Edge Network
- Domain: TBD
- Analytics: None (planned: Vercel Analytics)

**Development:**
- Version Control: Git
- Package Manager: npm
- Code Style: ESLint + Prettier
- Environment: Local development, Turbopack

### 6.2 Planned Infrastructure

**Phase 1 (Month 1-2):**
```
Frontend (Next.js) → Vercel
         ↓
API Routes → Anthropic Claude API
         ↓
Supabase → PostgreSQL + Auth + Storage
```

**Phase 2 (Month 3-4):**
```
Frontend → Vercel Edge
    ↓
API Routes
    ├→ Anthropic Claude
    ├→ Amap API (Maps)
    ├→ Weather API
    └→ Booking APIs
    ↓
Supabase + Redis (Caching)
```

**Phase 3 (Month 5+):**
```
Web App (Next.js)
Mobile App (React Native) → Same Backend
         ↓
API Gateway (Rate Limiting)
         ↓
Microservices Architecture
├─ AI Service
├─ Booking Service
├─ Payment Service
└─ Notification Service
```

### 6.3 Data Flow

**User Query Flow:**
```
1. User types message
   ↓
2. Frontend validates input
   ↓
3. POST /api/chat with message + context
   ↓
4. API constructs Claude prompt
   ↓
5. Claude streams response (SSE)
   ↓
6. Parse location data (JSON5)
   ↓
7. Display text + cards + map
   ↓
8. (Future) Save to database
```

---

## 7. User Experience & Design

### 7.1 Design Principles

1. **Conversational First**
   - Natural language over forms
   - Progressive disclosure
   - Context-aware responses

2. **Mobile-First**
   - Used during travel
   - Touch-friendly
   - Fast loading

3. **Visual Hierarchy**
   - Key info prominent
   - Clear CTAs
   - Scannable content

4. **Trustworthy**
   - Real data, real reviews
   - Transparent pricing
   - Safety first

### 7.2 Key User Flows

#### Flow 1: First-time User Discovery
```
Landing Page → Sign Up → Onboarding Quiz →
First AI Chat → Recommendation → Save Location →
Create Trip → Share with Friends
```

#### Flow 2: Planning a Trip
```
Home → "Plan Beijing Trip" Chat →
AI asks preferences → Generate itinerary →
View timeline → Adjust schedule →
Add to saved trips → Book activities
```

#### Flow 3: During Travel
```
Open App → Current location → "What's nearby?" →
AI suggests based on time/weather →
Select activity → Get directions →
Check-in / Share experience
```

### 7.3 UI Components

**Core Components:**
- Chat interface (messages, input, suggestions)
- Location cards (image, info, actions)
- Interactive map (markers, clusters, routes)
- Timeline view (day schedule, drag-drop)
- Budget tracker (charts, categories)
- Profile settings (preferences, saved items)

---

## 8. Competitive Analysis

### 8.1 Competitive Matrix

| Feature | TotoTrip | Mindtrip | TripAdvisor | Google Travel |
|---------|----------|----------|-------------|---------------|
| AI Chat | ✅ Core | ✅ Yes | ❌ No | ⚠️ Limited |
| China Focus | ✅ Yes | ❌ Global | ❌ Global | ❌ Blocked |
| Real-time Help | ✅ 24/7 | ❌ Planning only | ❌ Static | ❌ Static |
| Cultural Guide | 🎯 Planned | ❌ No | ⚠️ Limited | ❌ No |
| Local Payment Help | 🎯 Planned | ❌ No | ❌ No | ❌ No |
| Booking | 💡 Future | ✅ Yes | ✅ Yes | ✅ Yes |
| Price | Free (MVP) | Free/Premium | Free | Free |

### 8.2 Differentiation Strategy

**What makes TotoTrip unique:**

1. **Hyper-specialized** - Only China, done right
2. **AI-first** - Conversation beats navigation
3. **Real-time companion** - Help during travel, not just planning
4. **Cultural bridge** - Not just translations, but context
5. **Foreigner-focused** - Designed for non-Chinese speakers

**Positioning Statement:**
"For foreign travelers visiting China, TotoTrip is the AI travel companion that provides real-time, culturally-aware assistance throughout your journey, unlike generic travel apps that focus on static planning and lack China-specific expertise."

---

## 9. Go-to-Market Strategy

### 9.1 Launch Plan

**Phase 1: Soft Launch (Month 1)**
- Target: 100 beta users
- Channels: Friends/family, travel forums
- Goal: Gather feedback, fix bugs

**Phase 2: Public Launch (Month 2)**
- Target: 1,000 users
- Channels:
  - Reddit (r/solotravel, r/china)
  - Travel Facebook groups
  - Product Hunt launch
  - Travel blogger partnerships

**Phase 3: Growth (Month 3-6)**
- Target: 10,000 users
- Channels:
  - SEO content marketing
  - YouTube travel influencers
  - Paid ads (Google, Meta)
  - Referral program

### 9.2 Marketing Channels

**Content Marketing:**
- Blog: "Ultimate Guide to Traveling China"
- YouTube: "How to Use WeChat Pay in China"
- TikTok: Quick travel tips
- Newsletter: Weekly China travel insights

**Partnerships:**
- Travel bloggers (China specialists)
- Hostels and hotels (QR code posters)
- Language schools (student travelers)
- Corporate travel agencies (business travelers)

### 9.3 Pricing Strategy

**Free Tier (MVP):**
- 50 AI messages per month
- Basic location recommendations
- Map visualization
- No trip saving

**Pro Tier ($9.99/month or $99/year):**
- Unlimited AI messages
- Advanced itinerary planning
- Offline mode
- Priority support
- Custom recommendations
- Group trip planning

**Premium Tier ($29.99/month):**
- Everything in Pro
- Personal travel advisor
- Booking concierge
- VIP partnerships
- 24/7 emergency hotline

---

## 10. Risk & Mitigation

### 10.1 Technical Risks

**R1: AI Accuracy**
- **Risk:** Claude generates incorrect information
- **Impact:** High - Loss of trust
- **Mitigation:**
  - Integrate real-time data verification
  - User feedback loop
  - Disclaimer on AI limitations

**R2: API Costs**
- **Risk:** Claude API expensive at scale
- **Impact:** Medium - Profitability
- **Mitigation:**
  - Cache common responses
  - Optimize prompts
  - Rate limiting
  - Tiered pricing

**R3: China Internet Restrictions**
- **Risk:** Services blocked in China
- **Impact:** High - Core functionality broken
- **Mitigation:**
  - Host in China-accessible regions
  - Offline mode
  - Partner with local CDN

### 10.2 Business Risks

**R4: User Acquisition Cost**
- **Risk:** CAC too high vs LTV
- **Impact:** High - Not sustainable
- **Mitigation:**
  - Organic growth first
  - Referral incentives
  - Content marketing

**R5: Competition**
- **Risk:** Established players copy features
- **Impact:** Medium - Market share loss
- **Mitigation:**
  - Move fast, iterate quickly
  - Build strong brand
  - Focus on niche (China)

### 10.3 Legal & Compliance

**R6: Data Privacy (GDPR, CCPA)**
- **Risk:** Non-compliance fines
- **Impact:** High - Legal issues
- **Mitigation:**
  - Privacy policy
  - Cookie consent
  - Data encryption
  - Right to deletion

**R7: Content Liability**
- **Risk:** AI generates offensive/incorrect content
- **Impact:** Medium - Reputation damage
- **Mitigation:**
  - Content moderation
  - Clear disclaimers
  - User reporting
  - Human review layer

---

## 11. Success Criteria

### 11.1 MVP Launch Criteria

✅ **Required for Launch:**
- AI chat works reliably (95% uptime)
- Location recommendations accurate
- Map displays correctly on mobile
- No critical bugs
- Privacy policy published
- Analytics installed

### 11.2 Product-Market Fit Signals

🎯 **Indicators we've achieved PMF:**
- 40%+ retention rate (D7)
- NPS > 50
- Users organically sharing
- Press mentions without outreach
- Inbound partnership requests
- 20%+ users upgrade to paid

### 11.3 Pivot Triggers

⚠️ **When to consider pivot:**
- <10% retention after 3 months
- <100 users after 6 months
- NPS < 20 consistently
- CAC > 3x LTV
- Major competitor launches identical product

---

## 12. Roadmap

### 12.1 Timeline Overview

```
Month 1-2: Foundation
├─ ✅ MVP Launch (Chat + Map)
├─ 🎯 User Authentication
├─ 🎯 Trip Saving
└─ 🎯 Real Data Integration

Month 3-4: Growth
├─ 🎯 Itinerary Timeline
├─ 🎯 Budget Tracker
├─ 🎯 Mobile Optimization
└─ 🎯 Social Sharing

Month 5-6: Monetization
├─ 💡 Booking Integration
├─ 💡 Premium Features
├─ 💡 Affiliate Partnerships
└─ 💡 Content Marketing

Month 7-12: Scale
├─ 💡 Mobile App
├─ 💡 Offline Mode
├─ 💡 Multi-language
└─ 💡 API for B2B
```

### 12.2 Sprint Planning (Next 6 Weeks)

**Sprint 1 (Week 1-2): User System**
- Set up Supabase
- Implement authentication
- User profile page
- Session persistence

**Sprint 2 (Week 3-4): Trip Management**
- Save conversations
- Bookmark locations
- Create trips
- Share trips

**Sprint 3 (Week 5-6): Real Data**
- Amap API integration
- Weather API
- Real images (Unsplash)
- Review scraping (basic)

---

## 13. Appendix

### 13.1 Glossary

- **MVP:** Minimum Viable Product
- **NPS:** Net Promoter Score
- **CAC:** Customer Acquisition Cost
- **LTV:** Lifetime Value
- **PMF:** Product-Market Fit
- **SSE:** Server-Sent Events

### 13.2 References

- Anthropic Claude API Documentation
- Mindtrip Platform Analysis
- China Travel Statistics 2024
- Supabase Documentation
- Leaflet.js Documentation

### 13.3 Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Dec 2024 | Claude | Initial PRD creation |

---

## 14. Contact & Feedback

**Product Team:**
- Product Owner: [Your Name]
- Technical Lead: [Name]
- Design Lead: [Name]

**Feedback:**
- Email: product@tototrip.com
- Slack: #product-feedback
- GitHub Issues: [repo-link]

---

**End of PRD**
