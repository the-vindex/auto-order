# Code Review of Timely Buyer (auto-order)

This document summarises a high‑level review of the existing codebase for **Timely Buyer**.  The application is a full‑stack solution using a Node.js/Express backend with a PostgreSQL/Drizzle ORM data layer and a React frontend powered by Vite, React Query and Radix UI.  The review focuses on overall architecture, patterns used and proposals for improvement.

## Backend review

### Positive aspects

* **Separation of concerns:** The backend is structured by feature.  Routes live under `src/api/` and call functions in `src/db/queries` for persistence, while `src/auth` contains authentication logic.  Middleware modules handle JSON schema validation, error translation and request logging.  This separation makes it easier to reason about each layer.

* **TypeScript and Drizzle ORM:** The project leverages TypeScript throughout the backend for type safety.  Database interactions are encapsulated via the Drizzle ORM, which exposes typed query builders and schema definitions.  Tests cover database operations and integration endpoints using Vitest and SuperTest【328275728904082†L43-L90】.

* **JSON schema validation:** Input validation is performed by the `validateWithSchema` middleware, which caches compiled JSON schemas to avoid recompilation on every request【72098649204112†L10-L34】.  This improves runtime performance while providing clear error messages.

* **JWT authentication:** Authentication uses JWT tokens stored in HTTP‑only cookies.  Passwords are hashed with bcrypt and tokens are signed using a secret loaded from disk or environment variables【301115892044435†L81-L104】.

### Areas for improvement

* **Environment configuration:** The backend relies on many environment variables (e.g., database URL, JWT secret, resend API key) but lacks a centralised configuration module.  The `initAuth` function exits the process when `JWT_SECRET` is missing, causing integration tests to terminate unexpectedly【72098649204112†L10-L34】.  A better approach is to validate all required variables at startup and throw descriptive errors rather than calling `process.exit()`.  Using a library like [`env-var`](https://www.npmjs.com/package/env-var) or [`zod`](https://github.com/colinhacks/zod) for config validation would improve reliability.

* **Error handling consistency:** The `errorMiddleWare` maps custom error classes to status codes【850350720574613†L17-L41】, but many API functions still call `res.status(...).json(...)` directly or re‑throw database errors.  Consolidating error handling by always throwing known error objects (e.g. `BadRequestError`, `AuthenticationError`) and letting the middleware convert them to responses results in a cleaner flow and avoids duplicated logic.

* **Authentication middleware:** The `authMiddleWare` reads the `access-token` cookie and attaches the user id to the request object, but it silently continues when the cookie is invalid【850350720574613†L17-L41】.  Consider requiring authentication for protected routes by returning a 401 when the token is missing or invalid.  Additionally, storing tokens in HTTP‑only cookies prevents cross‑site scripting, but the code also sets a `username` cookie for convenience which is accessible to client scripts; avoid leaking user information.

* **Database migrations and tests:** The database tests call `migrate()` to apply Drizzle migrations, but the test environment assumes a running PostgreSQL instance on `localhost:5432`.  Integration tests fail when no database is available.  Provide a Docker Compose file for tests (there is one) and document how to run tests locally.  Using an in‑memory database or mocking the DB layer for unit tests would make testing simpler.

* **Job scheduling and scraping:** The cron job in `jobs/sendreminders.ts` runs every 15 seconds【72068650462471†L7-L31】, scraping Amazon pages using Puppeteer.  Running a headless browser this frequently will consume significant resources and risk being rate‑limited.  Increase the interval (e.g., hourly) and implement exponential back‑off and caching.  Use a scraping API or Amazon Product Advertising API when possible.  Also, error handling around the scraper is minimal; network failures or CAPTCHAs will cause unhandled promise rejections.  Wrap scraping logic in try/catch and log errors.

* **Domain vs. API separation:** The route handlers often contain business logic directly, such as mapping request bodies to DB objects and performing permission checks【999191134439291†L45-L74】.  Consider extracting domain services (e.g., `productReminderService.createReminder`) that encapsulate validation, scraping and database operations.  This separation makes code easier to test and reuse.

* **Security considerations:**
  * **Unused endpoints:** There is a commented‑out route for listing all users; currently it returns a 403 with an “easter egg” message【687607408084028†L33-L47】.  Remove unused code instead of leaving commented code or hidden easter eggs in production.
  * **Logging sensitive data:** The logging middleware redacts passwords【512347228546744†L2-L24】, which is good, but other sensitive fields (email, reset tokens) may still be logged in errors.  Ensure all secrets and user data are excluded from logs.
  * **Input sanitisation:** While JSON schemas validate shape and types, they do not protect against injection or XSS if data is later rendered.  Always sanitise user‑provided text when generating HTML or using query builders.

* **Project structure:**
  * Group related files into feature folders (e.g., `product-reminder/` containing API routes, DB queries and services) instead of splitting by layer only.  This aligns with domain‑driven design and reduces cross‑cutting dependencies.
  * Adopt consistent naming.  For instance, the folder `productReminders` uses camel case whereas `product_reminders` is snake case.  Consistency improves readability.

### Suggested refactoring tasks

1. **Centralise configuration:** Create a `src/config.ts` that reads and validates environment variables at startup.  Provide defaults where appropriate (e.g., cron interval).  Remove direct calls to `process.exit()`.
2. **Define error types and services:** Introduce domain services (e.g., `UserService`, `ProductReminderService`) that encapsulate business rules and throw custom errors.  Update API handlers to call these services and let the `errorMiddleWare` translate errors to HTTP responses.
3. **Refactor authentication:** Move token reading and validation into its own middleware.  Only expose user identity for authenticated routes; for public routes, omit the middleware entirely.  Avoid exposing non‑HTTP‑only cookies.
4. **Improve scraping job:** Increase the reminder check interval, add caching and robust error handling.  Consider storing scraped prices with timestamps to avoid repeated scraping for the same product within a short window.
5. **Clean up code:** Remove commented‑out or unused code, lighten console logs, and adopt consistent naming conventions.

## Frontend review

### Positive aspects

* **Modern stack:** The frontend uses React with Vite and React Query, providing fast development and efficient data fetching.  Tailwind CSS and Radix UI give a consistent look and feel, and components are broken down into smaller units such as `ReminderHeader`, `RemindersList` and `SettingsPage`.

* **API abstraction:** Fetch calls are wrapped in dedicated functions under `src/api/`, simplifying error handling and enabling consistent use of `credentials: 'include'` and proper JSON parsing【116080607024984†L0-L105】.

* **State management with React Query:** The app uses `useQuery` and `useMutation` hooks to fetch and update reminders, handling caching and background refetching automatically.  This reduces manual state management.

### Areas for improvement

* **Typos and bugs:** Several typos break the application:
  * In `src/main.jsx`, the `QueryClientProvider` is passed a prop named `clent` instead of `client`, preventing the query client from working.  This is a critical bug that needs fixing.
  * In `src/App.jsx`, the root `<Route>` uses the attribute `patd` instead of `path`【83139787804704†L7-L15】, meaning the router never matches.  Additionally, `App.jsx` attempts to wrap the root in `RequireAuth` incorrectly.  Correcting these typos is essential.

* **Input validation duplication:** `Login.jsx` and `Register.jsx` implement custom validation logic and error state, duplicating similar patterns.  Consider using a form library such as [React Hook Form](https://react-hook-form.com) or [Formik](https://formik.org) to centralise validation, reduce boilerplate, and improve accessibility.  These libraries integrate nicely with Radix UI components.

* **Code organisation:** The `Home` component mixes page layout, state management, and API calls.  Splitting it into separate components (e.g., `RemindersView`, `SettingsView`) and moving data fetching to custom hooks (e.g., `useReminders`) would enhance readability and reusability.

* **Routing structure:** The router is defined in `App.jsx` with nested routes, but the presence of the typo `patd` and misconfigured default route indicates a need for automated testing of routing.  Write unit tests for route definitions and use a central `routes.ts` configuration to avoid typos.

* **Client‑side security:** The application stores the username and email in non‑HTTP‑only cookies in `user.js`【487184166976164†L0-L95】.  These are accessible to scripts and could expose user data.  Rely on server‑set cookies or local storage instead, and avoid storing sensitive information on the client when not necessary.

* **Fallback UX:** Components such as `Home` check for `isLoading` and display a loading spinner, but there is little error UI when the API fails.  Provide user‑friendly error messages and actions (e.g., retry button, logout when session expires).

* **Unused environment variables:** The frontend does not read the API base URL from environment variables consistently.  Consolidate configuration into a `config.js` file and read `VITE_API_BASE_URL` with a default fallback.

### Suggested refactoring tasks

1. **Fix typos:** Correct `clent` → `client` in `main.jsx` and `patd` → `path` in `App.jsx`, verify all routes, and add unit tests for routing.
2. **Adopt a form library:** Replace bespoke form handling in login and registration pages with a form library.  Centralise validation rules (e.g., email format, password strength) and reuse them across pages.
3. **Refactor components:** Break down large components such as `Home` into smaller presentational components.  Move data fetching to custom hooks (e.g., `useRemindersQuery`) to isolate side effects from UI.
4. **Improve error handling:** Provide meaningful error states for failed API calls (e.g., network issues).  Integrate toast notifications or inline alerts using Radix UI to inform users.
5. **Configuration and security:** Create a `config.js` module that reads environment variables.  Avoid storing personally identifiable information in plain cookies; rely on server‑managed sessions.

## Summary

The Timely Buyer project demonstrates a well‑structured full‑stack application with good use of TypeScript, Drizzle ORM and modern React patterns.  However, several areas require attention to improve reliability, security and developer experience.  Fixing critical typos, centralising configuration and error handling, refactoring domain logic and adopting form management libraries will make the codebase more maintainable and robust.