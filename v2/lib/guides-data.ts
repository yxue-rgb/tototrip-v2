export interface Guide {
  title: string;
  slug: string;
  category: "getting-started" | "destinations" | "tips";
  excerpt: string;
  content: string;
  coverImage: string;
  readTime: number;
}

export const GUIDES: Guide[] = [
  {
    title: "First Time in China: Everything You Need to Know",
    slug: "first-time-in-china",
    category: "getting-started",
    excerpt: "From visa applications to cultural etiquette — your complete survival guide for a first trip to China.",
    readTime: 12,
    coverImage: "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800&h=600&fit=crop",
    content: `# First Time in China: Everything You Need to Know

Planning your first trip to China? It's one of the most rewarding — and occasionally bewildering — travel experiences on the planet. This guide covers everything you need to arrive confident and leave amazed.

## Before You Go

### Visa Requirements

Most nationalities need a visa to enter mainland China. As of 2026, China offers **144-hour transit visa-free** entry at major cities (Beijing, Shanghai, Guangzhou, Chengdu, and more) for citizens of 54 countries. For longer stays, apply for a **Tourist (L) Visa** at your nearest Chinese embassy or consulate.

**What you'll need:**
- Passport valid for 6+ months
- Completed visa application form
- Recent passport photo (48mm × 33mm, white background)
- Flight booking and hotel reservation
- Bank statement (some consulates)

Processing typically takes 4-7 business days. Expedited service is available for an extra fee.

### Travel Insurance

Strongly recommended. Medical care in China is affordable but communication barriers can complicate things. Make sure your policy covers:
- Medical evacuation
- Trip cancellation
- Lost luggage
- Adventure activities (if applicable)

### What to Pack

- **Power adapter**: China uses Type A/I plugs (220V). Bring a universal adapter.
- **VPN app**: Download and set up before you arrive (see our VPN guide).
- **Cash & cards**: Bring some USD/EUR to exchange. Visa/Mastercard work at international hotels but rarely elsewhere.
- **Toilet paper/tissues**: Public restrooms often don't provide them.
- **Comfortable walking shoes**: You'll walk 15,000-25,000 steps a day.
- **Light layers**: Weather varies wildly by region and season.

## Getting Around

### Flights

China's domestic flight network is extensive. Book via **Trip.com** (formerly Ctrip) — it's the most reliable English-language platform. Domestic flights are affordable but often delayed; leave buffer time.

### High-Speed Rail

China's HSR network is the world's largest and most impressive. The **Fuxing** trains hit 350 km/h and connect major cities faster than flying (when you factor in airport time). Book tickets on **Trip.com** or **12306** (official app, Chinese UI).

**Key routes:**
- Beijing → Shanghai: 4.5 hours
- Shanghai → Hangzhou: 1 hour
- Beijing → Xi'an: 4.5 hours
- Guangzhou → Shenzhen: 30 minutes

### Metro Systems

Every major city has a clean, efficient metro. Buy a ticket at the machine (English available) or use Alipay/WeChat to scan in. Beijing and Shanghai metros run roughly 5:30 AM - 11:00 PM.

### Taxis & Ride-Hailing

**DiDi** is China's Uber. It has an English-language version. Taxis are cheap and metered in most cities. Always have your destination written in Chinese characters — most drivers don't speak English.

## Money & Payments

### The Big Shift: Mobile Payments

China is essentially cashless. **WeChat Pay** and **Alipay** are used for everything — street food, taxis, hotels, even temples. As of 2025-2026, both platforms support **international credit cards** for tourists.

**Setup steps:**
1. Download WeChat or Alipay
2. Link your Visa/Mastercard/Amex
3. Set up your payment profile
4. Scan QR codes to pay

See our dedicated [WeChat Pay guide](/guides/wechat-pay-foreigners) for detailed walkthrough.

### Cash & ATMs

Carry some RMB (¥) as backup. ATMs at airports and Bank of China branches accept international cards. Most accept UnionPay; Visa/Mastercard ATMs are rarer outside tier-1 cities.

## Food & Drink

### Ordering Food

- **Point and order**: Many restaurants have picture menus. Point at what looks good.
- **WeChat translate**: Use the built-in camera translate feature for Chinese-only menus.
- **Street food**: Safe and delicious. Follow the crowds — busy stalls mean fresh food.
- **Breakfast**: Try **jianbing** (savory crêpe), **baozi** (steamed buns), or **congee** (rice porridge).

### Dietary Notes

- Vegetarian/vegan: Possible but requires effort. Buddhist restaurants (素菜馆) are fully vegetarian.
- Allergies: Write your allergies in Chinese and show your phone. "I'm allergic to peanuts" = 我对花生过敏.
- Water: Don't drink tap water. Bottled water is everywhere and cheap (¥2-3).

## Language & Communication

### Essential Phrases

| English | Pinyin | Chinese |
|---------|--------|---------|
| Hello | Nǐ hǎo | 你好 |
| Thank you | Xièxie | 谢谢 |
| How much? | Duōshao qián? | 多少钱？ |
| I don't understand | Wǒ tīng bù dǒng | 我听不懂 |
| Where is…? | …zài nǎlǐ? | …在哪里？ |
| Check please | Mǎidān | 买单 |
| No spicy | Bú yào là | 不要辣 |

### Translation Apps

- **WeChat**: Built-in translate (text and camera)
- **Google Translate**: Download the Chinese offline pack before you arrive
- **Pleco**: Best Chinese dictionary app, works offline

## Internet & Connectivity

### The Great Firewall

Google, YouTube, Instagram, WhatsApp, and most Western social media are blocked in mainland China. You need a **VPN** to access them. Download and test your VPN before arriving.

### SIM Cards & eSIM

- **Airport SIM**: Available at major airports. China Mobile and China Unicom offer tourist plans.
- **eSIM**: Services like Airalo, Nomad, and Holafly offer China eSIMs with data. Some include VPN bypass.
- **Pocket WiFi**: Rent at the airport or pre-order online.

## Safety & Etiquette

### Safety

China is one of the safest countries for tourists. Violent crime against foreigners is extremely rare. Common-sense precautions apply:
- Watch for pickpockets in crowded tourist areas
- Be cautious of "tea ceremony" scams in Beijing/Shanghai (friendly strangers invite you for tea, then present a huge bill)
- Avoid unlicensed taxis at airports

### Cultural Etiquette

- **Face (面子)**: Avoid causing embarrassment. Don't raise your voice or publicly criticize.
- **Business cards**: Receive with both hands, study briefly, don't write on them.
- **Tipping**: Not expected anywhere. Seriously, don't tip.
- **Temples**: Remove hats, speak quietly, don't point at Buddha statues.
- **Chopsticks**: Never stick them upright in rice (funeral symbolism). Don't point with them.

## When to Visit

| Season | Months | Pros | Cons |
|--------|--------|------|------|
| Spring | Mar-May | Pleasant weather, cherry blossoms | Rain in south |
| Summer | Jun-Aug | Lush landscapes, long days | Hot, humid, crowded |
| Autumn | Sep-Nov | Best weather, golden foliage | Peak season = higher prices |
| Winter | Dec-Feb | Fewer crowds, Harbin Ice Festival | Cold in north, pollution |

**Best overall**: September-October (Golden Week crowds aside) and April-May.

## Budget Planning

| Category | Budget | Mid-Range | Luxury |
|----------|--------|-----------|--------|
| Accommodation | $15-30/night | $50-120/night | $150+/night |
| Food | $10-20/day | $25-50/day | $60+/day |
| Transport | $15-30/day | $30-60/day | $80+/day |
| Activities | $5-15/day | $20-40/day | $50+/day |

China is remarkably affordable once you're there. A comfortable mid-range trip runs about **$80-150/day** including accommodation, food, transport, and activities.

## Final Tips

1. **Download apps before you arrive**: WeChat, Alipay, DiDi, Maps.me, VPN
2. **Carry your passport**: You'll need it for hotels, train tickets, and some attractions
3. **Learn 10 Chinese phrases**: Even bad pronunciation gets smiles and better service
4. **Be flexible**: Things won't always go to plan. That's part of the adventure
5. **Talk to toto**: Your AI travel buddy is available 24/7 for real-time advice 🐕

---

*Ready to plan? [Start chatting with toto](/chat) and get personalized advice for your China trip.*`,
  },
  {
    title: "How to Use WeChat Pay as a Foreigner",
    slug: "wechat-pay-foreigners",
    category: "tips",
    excerpt: "Step-by-step guide to setting up WeChat Pay with an international card and navigating China's cashless society.",
    readTime: 8,
    coverImage: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop",
    content: `# How to Use WeChat Pay as a Foreigner

China runs on mobile payments. In 2026, carrying only cash will make your trip harder — many vendors, restaurants, and even some taxis prefer (or only accept) WeChat Pay or Alipay. The good news? Foreigners can now use both with international credit and debit cards.

## Why You Need Mobile Payment in China

- Street food vendors often only have QR codes, no cash
- Taxis (especially DiDi) require mobile payment
- Many restaurants use QR-code ordering systems
- Convenience stores, supermarkets, and vending machines all use it
- Even some public toilets charge ¥0.5 via QR code

## Setting Up WeChat Pay: Step-by-Step

### Step 1: Download WeChat

Download **WeChat** (微信) from the App Store or Google Play. Create an account using your phone number.

> ⚠️ **Do this before your trip!** WeChat sometimes requires an existing WeChat user to verify new accounts. Ask a friend who has WeChat, or contact us for help.

### Step 2: Access WeChat Pay

1. Open WeChat → tap **Me** (bottom right)
2. Tap **Services** (or **Wallet**)
3. Tap **Activate WeChat Pay**
4. You'll be asked to verify your identity

### Step 3: Identity Verification

WeChat requires real-name verification. As a foreigner, you'll need:
- Your **passport** (photo + info page)
- A clear selfie for face verification
- Your passport number and name exactly as printed

The verification usually completes within minutes. Occasionally it takes up to 24 hours.

### Step 4: Link Your International Card

1. In WeChat Pay, tap **Cards** → **Add Card**
2. Select **International Card**
3. Enter your Visa, Mastercard, or Amex details
4. Set a 6-digit payment PIN

**Supported cards:**
- ✅ Visa
- ✅ Mastercard
- ✅ American Express
- ✅ JCB
- ✅ Discover/Diners Club
- ❌ UnionPay (use directly, not through WeChat)

### Step 5: Start Paying

To pay at a store:
1. Open WeChat → **Services** → **Pay**
2. Show your QR code to the cashier's scanner
3. **Or** tap **Scan** to scan the merchant's QR code
4. Enter the amount (if scanning merchant code)
5. Confirm with your 6-digit PIN or Face ID

## Transaction Limits

International cards on WeChat Pay have spending limits:
- **Per transaction**: ¥6,000 (~$830 USD)
- **Daily limit**: ¥50,000 (~$6,900 USD)
- **Annual limit**: ¥50,000 (~$6,900 USD) without further verification
- **With additional verification**: Up to ¥200,000/year

For most tourists, these limits are more than sufficient.

## Fees & Exchange Rates

- **WeChat Pay**: Charges a **3% foreign transaction fee** on international cards
- **Exchange rate**: Uses the Visa/Mastercard network rate (generally fair)
- **Your bank**: May charge additional foreign transaction fees (check with your bank)
- **Total cost**: Usually 3-5% above the mid-market rate

**Pro tip**: Some travelers find Alipay's rates slightly better. Set up both and compare.

## Alipay Alternative

Alipay (支付宝) works similarly and also accepts international cards:

1. Download **Alipay** (Tour Pass version redirects to main app)
2. Register with your phone number
3. Add international card under **Bank Cards**
4. Verify identity with passport

Some venues accept only Alipay or only WeChat — having both installed gives you full coverage.

## Common Issues & Fixes

### "Payment failed"
- Check your card hasn't blocked international transactions
- Ensure you have sufficient credit limit
- Try a different card
- Restart the app

### "Verification failed"
- Make sure your name matches your passport exactly (including middle names)
- Use good lighting for the selfie
- Try again after 24 hours

### "Account restricted"
- New accounts sometimes have temporary restrictions
- Send a few messages first to establish account activity
- Contact WeChat support via the in-app help center

## Tips for Smooth Mobile Payments

1. **Keep your phone charged**: No battery = no payment. Carry a power bank.
2. **Screenshot important QR codes**: Hotel booking confirmations, tickets, etc.
3. **Have backup cash**: Keep ¥500-1000 for emergencies (rural areas, small temples)
4. **Practice before your trip**: Make a small test payment (send a red packet to a friend)
5. **Disable VPN when paying**: VPN can interfere with payment verification
6. **Cellular over WiFi**: Mobile payments work better on cellular data

## Quick Reference

| Action | Steps |
|--------|-------|
| Pay at a store | Me → Services → Pay → Show QR |
| Scan to pay | Me → Services → Scan → Enter amount |
| Send money to friend | Chat → + → Transfer → Amount |
| Check balance | Me → Services → Wallet |
| View transactions | Me → Services → Wallet → Transaction History |

---

*Need help setting up payments? [Chat with toto](/chat) — we'll walk you through it step by step.* 🐕`,
  },
  {
    title: "China's High-Speed Rail: The Complete Guide",
    slug: "china-high-speed-rail",
    category: "tips",
    excerpt: "How to book, board, and enjoy the world's most impressive train network — covering routes, classes, and insider tips.",
    readTime: 10,
    coverImage: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=800&h=600&fit=crop",
    content: `# China's High-Speed Rail: The Complete Guide

China's high-speed rail (HSR) network is the largest in the world — over 45,000 km of track connecting virtually every major city. It's fast, affordable, punctual, and one of the best ways to experience the country.

## Why Take the Train?

- **Speed**: Up to 350 km/h on Fuxing trains
- **Reliability**: 99%+ on-time rate
- **City-center to city-center**: No airport commutes
- **Scenic**: Watch China's landscapes glide past your window
- **Affordable**: Beijing → Shanghai costs ~$85 in second class (vs. $150+ for flights)

## How to Book Tickets

### Option 1: Trip.com (Recommended for Foreigners)
1. Download the **Trip.com** app
2. Search your route and date
3. Select train and class
4. Enter passport details
5. Pay with international card
6. Receive e-ticket on your phone

### Option 2: 12306 (Official App)
- Chinese interface (improving English support)
- Requires Chinese phone number for registration
- Cheapest option with no booking fees

### Option 3: Station Counter
- Bring your passport
- Write your destination in Chinese
- Available up to 15 days before departure

**Book early**: Popular routes (especially during holidays) sell out fast. Golden Week (Oct 1-7) and Chinese New Year are the hardest times to get tickets.

## Boarding the Train

1. Arrive at the station **30-45 minutes early**
2. Pass through security (like airport screening)
3. Show passport + e-ticket at the gate
4. Find your platform on the departure board
5. Board 10-15 minutes before departure
6. Find your seat (car number + seat number on ticket)

> 💡 **Passport tip**: Foreigners use the staffed lane, not the automated gates (which require Chinese ID). Look for the manual checkpoint.

## Seat Classes

| Class | Description | Price Range |
|-------|-------------|------------|
| Second Class | Standard, comfortable, 5-abreast | $ |
| First Class | Wider seats, 4-abreast, more legroom | $$ |
| Business Class | Lie-flat seats, meals included | $$$ |

**Our recommendation**: First Class for trips over 3 hours. The extra ¥100-200 is worth the comfort. Business Class is a treat for the Beijing-Shanghai route.

## Useful Tips

- **Food**: Bring snacks. Station shops have instant noodles, fruit, and drinks. A hot water dispenser is in every car.
- **Luggage**: No strict weight limits, but overhead racks are smaller than planes. One large suitcase + one carry-on is fine.
- **WiFi**: Limited on most trains. Download entertainment beforehand.
- **Quiet car**: Some trains designate Car 3 as a quiet car. Perfect for naps.
- **Charging**: Every seat has a power outlet (Chinese standard + USB on newer trains).

---

*Planning a rail trip? [Ask toto](/chat) to build your perfect route with connections and timing.* 🚄`,
  },
  {
    title: "Best Street Food in China by Region",
    slug: "best-street-food-china",
    category: "destinations",
    excerpt: "A mouth-watering tour of China's best street food — from Beijing's jianbing to Chengdu's spicy skewers.",
    readTime: 7,
    coverImage: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&h=600&fit=crop",
    content: `# Best Street Food in China by Region

China's street food scene is arguably the best in the world. Every region has its own specialties, flavors, and traditions. Here's your guide to eating like a local.

## Beijing & the North

- **Jianbing (煎饼)**: The ultimate breakfast crêpe — egg, crispy cracker, scallions, cilantro, and sauces
- **Lamb skewers (羊肉串)**: Cumin-dusted and charcoal-grilled, best near Niujie
- **Zhajiangmian (炸酱面)**: Thick wheat noodles with savory soybean paste
- **Tanghulu (糖葫芦)**: Candied hawthorn berries on a stick — winter's favorite snack

## Shanghai & the East

- **Xiaolongbao (小笼包)**: Soup dumplings — bite, sip, devour
- **Shengjianbao (生煎包)**: Pan-fried soup buns with crispy bottoms
- **Scallion oil noodles (葱油拌面)**: Simple, aromatic, addictive
- **Cong you bing (葱油饼)**: Flaky scallion pancakes

## Chengdu & Sichuan

- **Malatang (麻辣烫)**: Pick your ingredients, they cook it in spicy broth
- **Dan dan noodles (担担面)**: Sesame paste, chili oil, Sichuan peppercorn
- **Chuanchuanxiang (串串香)**: Skewers you dip in hot chili oil
- **Douhua (豆花)**: Silky tofu pudding with spicy or sweet toppings

## Guangzhou & the South

- **Dim sum (点心)**: Har gow, siu mai, char siu bao — best before 11 AM
- **Cheung fun (肠粉)**: Silky rice noodle rolls with shrimp or beef
- **Wonton noodle soup**: Paper-thin wontons in clear broth
- **Egg waffles (鸡蛋仔)**: Bubble-shaped waffles, crispy outside, soft inside

## Xi'an & the Silk Road

- **Roujiamo (肉夹馍)**: "Chinese hamburger" — stewed meat in a flatbread
- **Yangrou paomo (羊肉泡馍)**: Lamb soup where you tear your own bread
- **Biangbiang noodles**: Hand-pulled belt noodles, impossibly wide
- **Persimmon cakes (柿子饼)**: Sweet, fried, autumn perfection

## Street Food Safety Tips

1. **Follow the crowds**: Busy stalls = fresh food
2. **Watch it being cooked**: Hot and freshly made = safe
3. **Avoid pre-cut fruit**: Unless from a reputable shop
4. **Carry tissues**: Street stalls rarely have napkins
5. **Use mobile payment**: Most stalls accept WeChat/Alipay

---

*Hungry yet? [Tell toto your food preferences](/chat) and get a custom food crawl itinerary.* 🍜`,
  },
  {
    title: "China Visa Guide 2026",
    slug: "china-visa-guide-2026",
    category: "getting-started",
    excerpt: "Updated visa policies, 144-hour transit options, and application tips for visiting China in 2026.",
    readTime: 9,
    coverImage: "https://images.unsplash.com/photo-1569254979530-1a4e0dac7e89?w=800&h=600&fit=crop",
    content: `# China Visa Guide 2026

China's visa policies have become significantly more tourist-friendly in 2025-2026. Here's what you need to know.

## Visa-Free Options

### 144-Hour Transit Visa-Free
Citizens of **54 countries** can enter China visa-free for up to 144 hours (6 days) when transiting through designated cities. Key requirements:
- You must have a confirmed onward ticket to a third country
- Entry and exit must be through designated ports
- Stay is limited to the administrative region of entry

**Eligible cities**: Beijing, Shanghai, Guangzhou, Chengdu, Chongqing, Xi'an, Hangzhou, Kunming, Qingdao, Xiamen, Wuhan, and more.

### Bilateral Visa Exemptions
China has signed visa-free agreements with several countries. Check if your passport qualifies for 15-30 day visa-free entry.

## Tourist (L) Visa

For stays longer than 144 hours or without a third-country ticket, apply for an L visa.

**Documents needed:**
- Passport (6+ months validity, blank pages)
- Completed application form with photo
- Round-trip flight booking
- Hotel reservations for full stay
- Bank statement (3 months)
- Travel itinerary

**Processing**: 4-7 business days, $140 USD for US citizens, varies by nationality.

## Application Tips

1. Apply 1-2 months before travel
2. Use an agency if your consulate is far away
3. Don't mention Tibet, Xinjiang, or journalism in your itinerary
4. Hotel bookings can be refundable — you just need the confirmation
5. Multi-entry visas (6 months or 10 years) are available for some nationalities

---

*Questions about your specific situation? [Ask toto](/chat) for personalized visa advice.* 🐕`,
  },
  {
    title: "Staying Connected: VPN & eSIM Guide for China",
    slug: "vpn-esim-guide-china",
    category: "tips",
    excerpt: "How to stay online and access your favorite apps behind the Great Firewall — VPN picks, eSIM options, and WiFi tips.",
    readTime: 7,
    coverImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop",
    content: `# Staying Connected: VPN & eSIM Guide for China

The Great Firewall blocks Google, WhatsApp, Instagram, YouTube, and most Western services. Here's how to stay connected.

## What's Blocked in China?

**Blocked**: Google (all services), YouTube, Facebook, Instagram, WhatsApp, Twitter/X, Telegram, most Western news sites, ChatGPT, Spotify

**Not blocked**: WeChat, Apple services (iCloud, App Store), Bing, Outlook/Hotmail, LinkedIn, most banking apps

## VPN Solutions

### Before You Arrive
Download and set up your VPN **before** entering China. VPN websites are blocked inside China, making it nearly impossible to download one after arrival.

**Recommended VPNs for China (2026):**
- **ExpressVPN**: Most reliable for China, dedicated China servers
- **Astrill VPN**: Popular among expats, good speeds
- **NordVPN**: Budget-friendly, works most of the time

**Tips:**
- Download the app AND manual configuration files
- Set up multiple VPN protocols (IKEv2, WireGuard, OpenVPN)
- During sensitive political periods, VPNs may be throttled
- Morning/evening = better speeds than midday

## eSIM & SIM Cards

### eSIM (Recommended)
- **Airalo**: China plans from $5/1GB. Easy setup, good coverage.
- **Nomad**: Competitive China plans with some VPN bypass features.
- **Holafly**: Unlimited data plans available.

> ⚠️ Most eSIMs use roaming data and are NOT subject to the Great Firewall — meaning you may not need a VPN at all!

### Physical SIM
- Buy at airport arrival halls (China Mobile or China Unicom counters)
- Tourist SIM: ~¥200 for 20GB/30 days
- Requires passport registration

## WiFi Tips

- **Hotel WiFi**: Usually decent in 4-5 star hotels, behind the firewall
- **Café WiFi**: Available at Starbucks, Luckin, McDonald's — scan QR to connect
- **Airport WiFi**: Free but requires phone number verification
- **Pocket WiFi**: Rent for ¥25-40/day at airports or pre-order online

## Our Recommendation

**Best combo**: China eSIM for data (firewall-free) + WeChat for local communication + ExpressVPN as backup on hotel WiFi.

---

*Need help choosing the right plan? [Ask toto](/chat) based on your trip length and data needs.* 📱`,
  },
];

export const GUIDE_CATEGORIES = [
  { key: "all", label: "All" },
  { key: "getting-started", label: "Getting Started" },
  { key: "destinations", label: "Destinations" },
  { key: "tips", label: "Tips" },
] as const;
