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

1. **Time‑based Reminder (implemented)**\
   • User pastes an Amazon product URL and selects a future date and time.\
   • The system stores the reminder and sends an email on the due date.\
   **Implementation:** Express route `/api/v1/product-reminders` persists the reminder in `product_reminders` with type `date`, and a cron job checks due reminders and triggers email notifications.
2. **Price‑drop Reminder (implemented)**\
   • User pastes an Amazon product URL and sets a target price.\
   • The backend scrapes the current price at creation time and stores it as `initialPrice`.  A background job periodically re‑scrapes the page.  When the price drops below the target, the user receives an email.\
   **Implementation:** The scraping logic uses Puppeteer, scheduled via a cron job in `jobs/sendreminders.ts`.  Only Amazon is currently supported.
3. **Future enhancements (not yet implemented)**\
   • Support additional e‑commerce sites via pluggable scraper modules.\
   • Provide multi‑site monitoring and selection from a list of supported retailers.\
   • Persist detailed price history and surface charts in the UI.

---

## 5. Functional Requirements (MVP – 3‑Day Hackathon)

| ID   | Requirement                                                       | Priority |
| ---- | ----------------------------------------------------------------- | -------- |
| FR‑1 | Users can register and log in with email and password (JWT‑based authentication) | Must |
| FR‑2 | Add product by URL with: reminder interval, optional target price | Must     |
| FR‑3 | Validate URL against supported list                               | Must     |
| FR‑4 | Persist tracking data in PostgreSQL/SQLite                        | Must     |
| FR‑5 | Scheduler triggers notifications (email via Resend)              | Must     |
| FR‑6 | Scrape current price for Site #1 (e.g., Amazon.de)                | Must     |
| FR‑7 | If current price < recorded price, queue notification             | Must     |
| FR‑8 | UI shows active reminders & ability to cancel                     | Should   |
| FR‑9 | Basic analytics dashboard (price history chart)                   | Future   |

---

## 6. Extended Requirements (Future work)

The current implementation covers the core reminder functionality for Amazon.  Future enhancements could include:

* **Multi‑site scraping:** Add support for multiple online retailers by implementing additional scraper modules and a site registry.
* **Currency conversion & localisation:** Allow users to specify currency and convert prices automatically.
* **Rich notification channels:** Support push notifications and SMS in addition to email.
* **Analytics & insights:** Store full price histories, display charts in the UI, and provide AI‑based suggestions (e.g., "wait for further drop").
* **Magic‑link login:** Replace email/password auth with passwordless login for convenience.

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
[ React SPA (Vite) ] ↔ [ REST API (Node/Express) ]
                          │
                ┌─── DB (PostgreSQL via Drizzle) ───┐
                │                                    │
   [ Cron job → Scraper ]                 [ Email Notification Service ]
                │                                    │
         [ Puppeteer scraping Amazon ]  ─────────────┘
```

*The application is deployed as a single Dockerised service with the frontend and backend served separately.  Continuous integration is configured via GitHub Actions.*

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
      - (Future) Notifications: toggle Push, Email; "Test notification".
      - (Future) App: Theme (Auto/Light/Dark), Currency preference.
      - (Future) Danger Zone: Delete account modal.

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

Postponed until when needed:

| Method     | Path                        | Purpose                                          |
|------------|-----------------------------|--------------------------------------------------|
| **GET**    | `/product-reminders/{id}`   | Detail incl. price sparkline                     |
| **PATCH**  | `/product-reminders/{id}`   | Update target price / date / status              |

### 15.5 Price Samples (history)

| Method  | Path                     | Purpose                            |
| ------- | ------------------------ | ---------------------------------- |
| **GET** | `/product-reminders/{id}/prices` | Latest N price points (default 30) |

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