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

1. **Schedule‑Based Reminder**
   • User pastes product URL → chooses "remind me in X days/weeks".
   • System stores item, sets timer, sends push/email at due time.
   **Architecture:** DB entity `product_tracking`, job scheduler, notification service, basic auth (email/password).
2. **Price‑Drop Reminder (single site)**
   • User pastes supported URL → system scrapes current price.
   • If future scrape returns lower price, notify.
   **Architecture:** Headless scraper (Playwright), price history store, diff checker.
3. **Multi‑Site Monitoring**
   • System maintains per‑site scrape scripts.
   • On add, service validates URL → accepts/rejects.
   • Scalable worker pool runs scrapers on CRON or event‑driven.
   **Architecture:** Site registry table, queue‑based workers, rate‑limit & anti‑bot strategy.

---

## 5. Functional Requirements (MVP – 3‑Day Hackathon)

| ID   | Requirement                                                       | Priority |
| ---- | ----------------------------------------------------------------- | -------- |
| FR‑1 | User can sign‑in (email/password)                                 | Must     |
| FR‑2 | Add product by URL with: reminder interval, optional target price | Must     |
| FR‑3 | Validate URL against supported list                               | Must     |
| FR‑4 | Persist tracking data in PostgreSQL/SQLite                        | Must     |
| FR‑5 | Scheduler triggers notifications (push + email)                   | Must     |
| FR‑6 | Scrape current price for Site #1 (e.g., Amazon.de)                | Must     |
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

- **Performance:** Notification latency <2 min.
- **Reliability:** ≥99% job execution success.
- **Security & Privacy:** HTTPS; store minimal PII; GDPR‑compliant deletion.
- **Usability:** Mobile‑first; WCAG 2.1 AA.

---

## 8. UX Requirements

### Core Flows

1. **Add Reminder**
   1. Paste URL → inline support check.
   2. Choose: ▢ Reminder after X ⏲️  ▢ Alert when price below current/target €€.
   3. Confirm → success toast.
2. **Notification Handling**
   • Push contains item name, new price, CTA "Open store".
   • Email fallback if push fails.
3. **Manage Reminders**
   • List with status (Active, Triggered, Failed).
   • Swipe to delete / edit.

### Visual Style

- Clean card layouts, store favicon on item tile.
- Accent color derived from brand logo.
- Use system font stack for speed.
- Light & Dark themes auto.

---

## 9. Data Model (simplified)

```
User { id, email, password_hash, created_at }
ProductReminder {
  id, user_id, name, urls,
  status ENUM('active','notified','cancelled'),
  reminderDetails JSONB
}
```

---

## 10. System Architecture Overview

```
[ React PWA ] ↔ [ REST API (Node/Express) ]
                             │
            ┌──────── DB (PostgreSQL) ────────┐
            │                                 │
   [ node-cron ]                   [ Resend (email) ]
            │                                 │
   [ Puppeteer Scraper ] ┴→ FCM / Email
```

- **Deployment:** Vercel (frontend), Render.com/Fly.io (API + workers).
- **CI/CD:** GitHub Actions.

---

## 11. Success Metrics

- **MAU** with ≥1 active reminder.
- **Reminder → Click rate** ≥25%.
- **Scrape accuracy** ≤2% price variance.
- **Avg. time to first notification** <6 hrs after add.

---

## 12. Constraints & Assumptions

- Hackathon time‑box: 72 h; prioritise boilerplate generators & SaaS.
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

*Last updated: 30 Jul 2025*

---

##

## 14. UI Screen & Flow Specification (MVP)

### 14.1 Navigation Model

- **Single‑stack navigation** (React Router).
- Left rail (desktop):
   1. **Reminders**
   2. **Add**
   3. **Settings**

### 14.2 Screen Details

1. **Sign‑In / Onboarding**

   - **Fields/UI:** Email input, Password input, “Sign In” button, legal links.
   - **Validation:** Must be valid email format; inline error.
   - **Primary Action:** `SIGN IN`.
   - **Success:** Redirect to reminders list.
   - **Edge Cases:** Invalid credentials toast.

2. **Reminders List**

   - **Components:** Title bar, Add Reminder button.
   - **Card layout:** Product name; reminder type; status.
   - **Gestures:** Tap → Detail;
   - **Empty State:** Illustration + guidance.

3. **Add Reminder**

   - **Field:** URL text field.
   - **Configuration:**
      - **Time Tab:** "Remind me in" number picker (days/weeks) or date picker.
      - **Price Tab:** Current price display; target price input.
   - **CTA:** `CREATE REMINDER`.

4. **Reminder Detail**

   - **Header:** Product name + external link icon.
   - **Editable fields:** Target price / time.
   - **Actions:** Save • Delete • Mark Done.

5. **Settings**

   - **Sections:**
      - Account: email, Log out.
      - Danger Zone: Delete account modal.

### 14.3 Primary User Flows

**Flow A: Add Time‑based Reminder**

1. Dashboard → `Add Reminder`.
2. Paste URL.
3. Pick 2 weeks → CREATE.
4. Toast "Reminder set"; list updates.

**Flow B: Price‑drop Reminder**

1. Dashboard → `Add Reminder`.
2. Paste URL.
3. Switch to Price tab; set target → CREATE.
4. List shows badge €↓.

**Flow C: Act on Notification**

1. Email arrives → tap link.
2. App opens Reminder Detail.
3. Tap "Open store" → external.

### 14.4 Data Capture per Screen

| Screen            | Key Fields                                 | API                       |
| ----------------- | ------------------------------------------ | ------------------------- |
| Add Reminder      | url, reminder_type, target_price, trigger_at | `POST /product-reminders` |
| Edit Reminder     | id + fields                                | `PUT /product-reminders/:id` |
| Settings          | notification prefs                         | `PATCH /users/me`         |

### 14.5 Error & Edge States

- Invalid URL: inline error.
- Scrape failure: banner "Price check failed", option to retry.
- Offline: banner "You are offline".

*Last updated: 30 Jul 2025*



## 15. REST API Surface (MVP)

All endpoints are prefixed with `/v1` and require a Bearer JWT obtained via the **email/password** flow. All request/response bodies are JSON and use ISO‑8601 timestamps.

### 15.1 Authentication

| Method   | Path      | Purpose         | Request                                 | Response                     |
| -------- | --------- | --------------- | --------------------------------------- | ---------------------------- |
| **POST** | `/users`  | Register a user | `{ "email": "user@x.com", "password": "..." }` | `201 Created`                |
| **POST** | `/login`  | Log in a user   | `{ "email": "user@x.com", "password": "..." }` | `200 { access_token, user }` |
| **POST** | `/logout` | Log out a user  |                                         | `204 No Content`             |

### 15.2 User & Settings

| Method     | Path    | Purpose              | Notes          |
| ---------- | ------- | -------------------- | -------------- |
| **GET**    | `/me`   | Current user profile | —              |
| **PATCH**  | `/me`   | Update user settings | Partial update |
| **DELETE** | `/me`   | Delete account & data | 204 No Content |

### 15.3 Product Reminders

| Method     | Path                        | Purpose                                          |
|------------|-----------------------------|--------------------------------------------------|
| **GET**    | `/product-reminders`        | List user’s product-reminders, filter `?status=` |
| **POST**   | `/product-reminders`        | Create new product & reminder                    |
| **PUT**    | `/product-reminders/{id}`   | Update product reminder                          |
| **DELETE** | `/product-reminders/{id}`   | Cancel reminder                                  |

### 15.4 Error Codes

| Code | Meaning       | Common Causes                            |
| ---- | ------------- | ---------------------------------------- |
| 400  | Bad Request   | malformed JSON                           |
| 401  | Unauthorized  | missing/expired JWT                      |
| 404  | Not Found     | unknown tracking ID                      |
| 500  | Server Error  | scrape failure, etc.                     |

---

### 15.5 UI ↔ API Call‑Flow Mapping

#### Flow A – Add Time‑Based Reminder

1. **Create** `POST /product-reminders`
   ````
   {
     "name": "My Reminder",
     "urls": ["https://..."],
     "reminderDetails": {
        "type": "on_specific_datetime",
        "targetDate": "2025-08-15T09:00:00Z"
     }
   }
   ``` → `201 { id, status:"active" }`.
   ````
2. UI navigates back, shows new card from `GET /product-reminders`.

#### Flow B – Price‑Drop Reminder

1. `POST /product-reminders` with `reminderDetails: { "type": "priceDrop", "targetPrice": 44.99 }`.

#### Flow C – Dashboard Load

- On app start: parallel `GET /product-reminders?status=active` and `GET /me`.
- Uses results to render cards & prefs.

#### Flow D – Edit Reminder

- `PUT /product-reminders/{id}` with updated fields.

#### Flow E – Delete Reminder

- `DELETE /product-reminders/{id}` → 204.

---

### 15.6 Versioning & Pagination

- Version in URL `/v1/…`.
- List endpoints could support `limit` & `cursor` params in the future.

---