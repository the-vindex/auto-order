# Smart Purchase Reminder – Product Requirements Document (PRD)

---

## 1. Vision

Help people buy exactly **what they want, when it matters**—either because it’s the right moment (e.g., payday, holiday) or the right price—without wasting time repeatedly checking stores.

---

## 2. Problem & Value Proposition

Shoppers juggle wish‑lists, seasonal deals, and fluctuating prices across multiple stores. Our service automatically tracks desired items and notifies users **only when action is valuable**, reducing cognitive load and saving money.

---

## 3. Target Users & Personas

| Persona                     | Key Traits                                    | Pain Points                             | Goals                                    |
| --------------------------- | --------------------------------------------- | --------------------------------------- | ---------------------------------------- |
| **Savvy‑Saver Sam**         | 25‑35, budget‑conscious, shops online weekly  | Price volatility, FOMO on flash sales   | Buy favourite gadgets at lowest price    |
| **Busy Professional Petra** | 30‑45, limited time, higher disposable income | Forgets to reorder essentials           | Timely reminders aligned with schedule   |
| **Gift‑Planner Greg**       | 35‑55, shops for family events                | Tracks multiple gift ideas across sites | Nudge before birthdays when deals appear |

---

## 4. Key User Scenarios

1. **Schedule‑Based Reminder**\
   • User pastes product URL → chooses "remind me in X days/weeks".\
   • System stores item, sets timer, sends push/email at due time.\
   **Architecture:** DB entity `product_tracking`, job scheduler, notification service, basic auth (email/password or Magic Link/Auth0).
2. **Price‑Drop Reminder (single site)**\
   • User pastes supported URL → system scrapes current price.\
   • If future scrape returns lower price, notify.\
   **Architecture:** Headless scraper (Playwright), price history store, diff checker.
3. **Multi‑Site Monitoring**\
   • System maintains per‑site scrape scripts.\
   • On add, service validates URL → accepts/rejects.\
   • Scalable worker pool runs scrapers on CRON or event‑driven.\
   **Architecture:** Site registry table, queue‑based workers, rate‑limit & anti‑bot strategy.

---

## 5. Functional Requirements (MVP – 3‑Day Hackathon)

| ID   | Requirement                                                       | Priority |
| ---- | ----------------------------------------------------------------- | -------- |
| FR‑1 | User can sign‑in (simple Magic Link)                              | Must     |
| FR‑2 | Add product by URL with: reminder interval, optional target price | Must     |
| FR‑3 | Validate URL against supported list                               | Must     |
| FR‑4 | Persist tracking data in PostgreSQL/SQLite                        | Must     |
| FR‑5 | Scheduler triggers notifications (push + email)                   | Must     |
| FR‑6 | Scrape current price for Site #1 (e.g., Amazon.de)                | Must     |
| FR‑7 | If current price < recorded price, queue notification             | Must     |
| FR‑8 | UI shows active reminders & ability to cancel                     | Should   |
| FR‑9 | Basic analytics dashboard (price history chart)                   | Could    |

---

## 6. Extended Requirements (Post‑MVP)

- Multi‑site scraping via configurable Playwright scripts.
- User‑editable target price & currency conversion.
- AI price‑prediction to suggest "wait/buy now".
- Social sharing of deals.

---

## 7. Non‑Functional Requirements

- **Performance:** Notification latency <2 min.
- **Reliability:** ≥99% job execution success.
- **Security & Privacy:** OAuth + HTTPS; store minimal PII; GDPR‑compliant deletion.
- **Usability:** Mobile‑first; WCAG 2.1 AA.

---

## 8. UX Requirements

### Core Flows

1. **Add Reminder**
   1. Paste URL → inline support check.
   2. Choose: ▢ Reminder after X ⏲️  ▢ Alert when price below current/target €€.
   3. Confirm → success toast.
2. **Notification Handling**\
   • Push contains item name, new price, CTA "Open store".\
   • Email fallback if push fails.
3. **Manage Reminders**\
   • List with status (Active, Triggered, Failed).\
   • Swipe to delete / edit.

### Visual Style

- Clean card layouts, store favicon on item tile.
- Accent color derived from brand logo.
- Use system font stack for speed.
- Light & Dark themes auto.

---

## 9. Data Model (simplified)

```
User { id, email, created_at }
SiteConfig { id, domain, script_name, enabled }
ProductTracking {
  id, user_id, url, site_id,
  reminder_type ENUM('time','price'),
  trigger_at TIMESTAMP, target_price DECIMAL,
  initial_price DECIMAL, currency,
  status ENUM('active','notified','cancelled')
}
PriceSample { id, tracking_id, sampled_at, price }
NotificationLog { id, tracking_id, sent_at, channel }
```

---

## 10. System Architecture Overview

```
[ React PWA ] ↔ [ GraphQL/REST API (Node/Express) ]
                             │
            ┌──────── DB (PostgreSQL) ────────┐
            │                                 │
   [ Bull Queue ]                    [ Notification Service ]
            │                                 │
   [ Scraper Workers (Playwright in Docker) ] ┴→ FCM / Email
```

- **Deployment:** Vercel (frontend), Render.com/Fly.io (API + workers).
- **CI/CD:** GitHub Actions.

---

## 11. Success Metrics

- **MAU** with ≥1 active reminder.
- **Reminder → Click rate** ≥25%.
- **Scrape accuracy** ≤2% price variance.
- **Avg. time to first notification** <6 hrs after add.

---

## 12. Constraints & Assumptions

- Hackathon time‑box: 72 h; prioritise boilerplate generators & SaaS (Auth0, Railway).
- Limited to EU e‑shops using Euro or CZK.
- No server‑side rendering needed.

---

## 13. Open Questions / Decisions Needed

1. Multi‑tenant VS single‑user prototype?
2. Preferred primary notification: push, SMS, email?
3. How to handle anti‑bot measures (CAPTCHAs, Cloudflare)?
4. Currency conversion service choice?
5. Should we auto‑pause reminders after purchase link click?

---

*Last updated: 25 Jul 2025*

---

##

## 14. UI Screen & Flow Specification (MVP)

### 14.1 Navigation Model

- **Single‑stack navigation** (React Router).
- Bottom tab bar (mobile) or left rail (desktop):
   1. **Reminders**
   2. **Add**
   3. **Settings**

### 14.2 Screen Details

1. **Sign‑In / Onboarding**

   - **Fields/UI:** Email input, “Send magic link” button, legal links.
   - **Validation:** Must be valid email format; inline error.
   - **Primary Action:** `SEND LINK`.
   - **Success:** Illustration + “Check your inbox”.
   - **Edge Cases:** Expired link toast.

2. **Reminders List**

   - **Components:** Title bar, Floating Action Button `+`.
   - **Card layout:** Product image 48×48; title; latest price; badge for reminder type (⏲ or €↓); relative time.
   - **Gestures:** Tap → Detail; swipe left → delete; long‑press → multi‑select.
   - **Empty State:** Illustration + guidance.

3. **Add Reminder – Step 1: Paste URL**

   - **Field:** URL text field with Paste shortcut.
   - **Validation:** Real‑time; shows ✅ Supported / ❌ Unsupported.
   - **CTA:** `NEXT` disabled until supported.

4. **Add Reminder – Step 2: Configure Trigger**

   - **Tabs:** Time • Price.
      - **Time Tab:** "Remind me in" number picker (days/weeks) or date picker.
      - **Price Tab:** Current price display; target price input (default current – 5%).
   - **Preview card** summarizing action.
   - **CTA:** `CREATE REMINDER`.

5. **Reminder Detail**

   - **Header:** Product image + title + external link icon.
   - **Price history sparkline** with tooltips.
   - **Editable fields:** Target price / time.
   - **Actions:** Save • Delete • Mark Done.
   - **Status banner:** e.g., "Waiting for next price check in 3 h".

6. **Settings**

   - **Sections:**
      - Account: email, Log out.
      - Notifications: toggle Push, Email; "Test notification".
      - App: Theme (Auto/Light/Dark), Currency preference.
      - Danger Zone: Delete account modal.

### 14.3 Primary User Flows

**Flow A: Add Time‑based Reminder**

1. Dashboard → `+`.
2. Paste URL → NEXT.
3. Pick 2 weeks → CREATE.
4. Toast "Reminder set"; list updates.

**Flow B: Price‑drop Reminder**

1. Dashboard → `+`.
2. Paste URL → NEXT.
3. Switch to Price tab; set target → CREATE.
4. List shows badge €↓.

**Flow C: Act on Notification**

1. Push arrives → tap.
2. App opens Reminder Detail.
3. Tap "Open store" → external; prompt "Mark as purchased?".

### 14.4 Data Capture per Screen

| Screen            | Key Fields                                 | API                       |
| ----------------- | ------------------------------------------ | ------------------------- |
| Add URL           | url                                        | `POST /tracking/validate` |
| Configure Trigger | reminder\_type, target\_price, trigger\_at | `POST /tracking`          |
| Edit Reminder     | id + fields                                | `PATCH /tracking/:id`     |
| Settings          | notification prefs                         | `PATCH /user`             |

### 14.5 Error & Edge States

- Invalid URL: inline error + link to feedback.
- Scrape failure: banner "Price check failed", option to retry.
- Offline: local queue; banner "Changes will sync when online".

*Last updated: 25 Jul 2025*



## 15. REST API Surface (MVP)

All endpoints are prefixed with `/v1` and require a Bearer JWT obtained via the **Magic‑Link Auth** flow. All request/response bodies are JSON and use ISO‑8601 timestamps.

### 15.1 Authentication

| Method   | Path               | Purpose                           | Request                     | Response                     |
| -------- | ------------------ | --------------------------------- | --------------------------- | ---------------------------- |
| **POST** | `/auth/magic‑link` | Send sign‑in link                 | `{ "email": "user@x.com" }` | `202 Accepted`               |
| **POST** | `/auth/session`    | Exchange magic‑link token for JWT | `{ "token": "<one‑time>" }` | `200 { access_token, user }` |

### 15.2 User & Settings

| Method     | Path        | Purpose                      | Notes          |
| ---------- | ----------- | ---------------------------- | -------------- |
| **GET**    | `/users/me` | Current user profile         | —              |
| **PATCH**  | `/users/me` | Update notif. prefs or theme | Partial update |
| **DELETE** | `/users/me` | Delete account & data        | 204 No Content |

### 15.3 Merchants & URL Validation

| Method   | Path                  | Purpose                       | Request          | Response                                 |
| -------- | --------------------- | ----------------------------- | ---------------- | ---------------------------------------- |
| **GET**  | `/merchants`          | List supported merchants      | —                | array                                    |
| **GET**  | `/merchants/support`  | Check if URL is supported     | `?url=https://…` | `{ supported, merchant_id }`             |
| **POST** | `/trackings/validate` | Scrape URL once & return meta | `{ url }`        | `{ supported, merchant, current_price }` |

### 15.4 Product Tracking (combined item + reminder)

| Method     | Path              | Purpose                                  |
| ---------- | ----------------- | ---------------------------------------- |
| **GET**    | `/trackings`      | List user’s trackings, filter `?status=` |
| **POST**   | `/trackings`      | Create new tracking & reminder           |
| **GET**    | `/trackings/{id}` | Detail incl. price sparkline             |
| **PATCH**  | `/trackings/{id}` | Update target price / date / status      |
| **DELETE** | `/trackings/{id}` | Cancel tracking                          |

### 15.5 Price Samples (history)

| Method  | Path                     | Purpose                            |
| ------- | ------------------------ | ---------------------------------- |
| **GET** | `/trackings/{id}/prices` | Latest N price points (default 30) |

### 15.6 Notifications

| Method    | Path                  | Purpose                       |
| --------- | --------------------- | ----------------------------- |
| **GET**   | `/notifications`      | List sent notifications (log) |
| **PATCH** | `/notifications/{id}` | Mark read = true              |

### 15.7 Error Codes

| Code | Meaning       | Common Causes                            |
| ---- | ------------- | ---------------------------------------- |
| 400  | Bad Request   | malformed JSON                           |
| 401  | Unauthorized  | missing/expired JWT                      |
| 403  | Forbidden     | URL from unsupported domain              |
| 404  | Not Found     | unknown tracking ID                      |
| 409  | Conflict      | duplicate URL for same user              |
| 422  | Unprocessable | validation failed (e.g., negative price) |
| 500  | Server Error  | scrape failure, etc.                     |

---

### 15.8 UI ↔ API Call‑Flow Mapping

#### Flow A – Add Time‑Based Reminder

1. **Paste URL** `POST /trackings/validate` → `{ supported:true, current_price:49.99 }`.
2. **Create** `POST /trackings`
   ````
   {
     "url": "https://…",
     "rule_type": "on_specific_datetime",
     "target_date": "2025-08-15T09:00:00Z",
     "notification_channel": "push"
   }
   ``` → `201 { id, status:"active" }`.
   ````
3. UI navigates back, shows new card from `GET /trackings`.

#### Flow B – Price‑Drop Reminder

1. Validate URL as above.
2. `POST /trackings` with `rule_type:"target_price", target_price:44.99`.

#### Flow C – Dashboard Load

- On app start: parallel `GET /trackings?status=active` and `GET /users/me`.
- Uses results to render cards & prefs.

#### Flow D – Edit Reminder

- `PATCH /trackings/{id}` with updated fields (e.g., new target\_price).

#### Flow E – Delete Reminder

- `DELETE /trackings/{id}` → 204.

#### Flow F – Settings Change

- `PATCH /users/me` `{ "push_enabled": false }`.

#### Flow G – Open Notification

1. Push deep‑link → `/trackings/{id}` call to refresh.
2. Optional: `PATCH /notifications/{notif_id}` `{ "read": true }`.

---

### 15.9 Versioning & Pagination

- Version in URL `/v1/…`.
- List endpoints support `limit` & `cursor` params (RFC 5988 `Link` header).

---

*Next update: flesh out WebSocket push for real‑time status.*
