# ProAutoDial Phase 2 — Internal Admin Dashboard Architecture

**Status:** Proposed implementation baseline  
**Decision confirmed by product owner:** Build an internal ProAutoDial Admin Dashboard; do not depend on an external CRM for the initial release.  
**Repository:** `raghutujanakiram-jpg/PROAUTODIAL_WEBSITE`  
**Implementation branch:** `frontend-development`  
**Production protection:** Do not merge to `main` or change the production release process without explicit approval.

## 1. Executive decision

Build a first-party lead-management workspace for ProAutoDial. The public marketing website remains available at `https://www.proautodial.in`; the internal workspace is reached at `https://www.proautodial.in/admin`.

The dashboard will own the enquiry lifecycle from first website submission through assignment, contact, qualification, demo scheduling, proposal, and final outcome. It will also retain an auditable activity timeline and measurable acquisition source data.

### Recommended platform baseline

| Layer | Proposed implementation | Rationale |
|---|---|---|
| Public website | Existing static HTML/CSS/JavaScript SPA | Preserve the live site and avoid an unnecessary rewrite |
| Admin UI | Separate modular application under `/admin` (React + TypeScript + Vite) | Maintainable tables, filters, forms, dashboards and role-aware UI without changing public page code |
| Application API | Vercel Functions (Node.js) under `/api` | Server-side validation, authorisation, notifications and controlled database access |
| Database | Supabase Postgres | Relational lead records, workflow history, queries and reporting |
| Authentication | Supabase Auth, invite-only | No public account registration; controlled staff access |
| Authorisation | Application roles plus Postgres Row Level Security (RLS) | Enforce access in both API and data layers |
| Notifications | Transactional email provider selected during setup | Notify the assigned team and send demo confirmations |
| Abuse prevention | Server-side schema validation, rate limits and CAPTCHA/Turnstile | Protect public forms against automated submissions |
| Hosting | Existing Vercel team/project | Preserve current hosting and GitHub workflow |

**Region recommendation:** Create the Supabase project in **South Asia (Mumbai / ap-south-1)** and configure Vercel Functions to run in **Mumbai (bom1)**. Confirm data-residency, contract and regulatory requirements before creating the production database. Region selection controls where primary data is stored; it does not, by itself, establish legal compliance.

**Security rule:** Supabase secret/service-role credentials must remain in Vercel server-side environment variables. They must never appear in browser JavaScript, HTML, public GitHub commits or client-side build variables. Prefer user-scoped database access with RLS for ordinary operations; use elevated server credentials only for tightly controlled administrative operations after the API verifies the caller and their role.

## 2. Existing application baseline and constraints

The current public application is a static SPA implemented in a single `index.html` with inline CSS and JavaScript. It is not currently a React application and has no configured backend.

Current form behaviour is preview-only:
- Contact and demo forms validate in the browser but do not persist or transmit enquiries.
- The Live Call Simulator is a scripted interaction; it does not start a real call, access a microphone or record audio.
- Pricing values remain custom-quote placeholders.
- The initial Arabic experience is not yet full page-by-page localisation.

The current `vercel.json` contains explicit public-page rewrites. It does not contain a catch-all rewrite. Preserve that property so `/api/*` requests reach serverless functions and static admin assets are not incorrectly served as the public SPA.

Implementation must preserve the current public URL paths, original logo asset and brand styles. The admin UI can have its own design tokens and bundle while remaining visually consistent with ProAutoDial.

## 3. Target system architecture

```text
Visitor
  |
  | HTTPS
  v
www.proautodial.in
  |-- Public website (existing SPA)
  |     |-- Contact enquiry form
  |     |-- Request-a-demo form
  |     |-- Campaign / partnership enquiry entry points
  |
  |-- /admin (separate admin application)
  |     |-- Invite-only sign-in
  |     |-- Lead inbox and pipeline
  |     |-- Lead detail and activity timeline
  |     |-- Follow-up task queue
  |     |-- Demo calendar
  |     |-- Reports and access management
  |
  v
Vercel Functions (/api/*)
  |-- Public intake endpoint: validation, anti-abuse, deduplication
  |-- Admin endpoints: authentication verification, role checks
  |-- Lead, activity, assignment, task and booking services
  |-- Notification dispatch
  |
  v
Supabase
  |-- Auth users and staff profiles
  |-- Postgres CRM tables with RLS
  |-- Audit trail
  |-- Optional scheduled jobs / email event state
```

The browser must never write directly to privileged tables using a secret key. Public form submissions must pass through the server-side intake endpoint. Every administrative API request must verify the authenticated user, active staff profile and permission to perform the requested action.

## 4. Admin modules and user experience

### 4.1 Overview dashboard
- New enquiries today and over the selected period.
- Unassigned leads and leads awaiting first response.
- Follow-ups due today and overdue.
- Demos scheduled this week.
- Qualified, won and lost counts with conversion rates.
- Lead source, campaign, country and industry breakdowns.
- First-response time and stage ageing.

All figures must be calculated from actual records and clearly labelled by date range. Do not seed production dashboards with invented results.

### 4.2 Lead inbox
- Search by name, email, phone, company and lead ID.
- Filters for status, owner, date, source, country, interest and industry.
- Sort by newest, oldest, priority and next follow-up.
- Lead preview, duplicate indicator and assignment control.
- Export limited to permitted roles; exports are logged.

### 4.3 Lead detail
- Contact and organisation details.
- Enquiry type, message, product interest, country and call-volume band.
- Original landing page, referrer and UTM attribution.
- Consent record and privacy-notice version.
- Current owner, status, priority and next action.
- Chronological activity timeline.
- Internal notes and follow-up tasks.

### 4.4 Pipeline
Initial stages:
1. New
2. Assigned
3. Contacted
4. Qualified
5. Demo Scheduled
6. Proposal Sent
7. Won
8. Lost
9. Spam / Duplicate

Changing a stage records the actor, timestamp and previous/new value. Lost and spam records require a reason. Won/lost reports must use the actual stage-change history.

### 4.5 Follow-up task queue
- Create a task against a lead.
- Set owner, due date/time, priority and description.
- Mark complete, reschedule or cancel.
- Show overdue tasks prominently.
- Send reminders through the selected notification channel.
- Record each task action in the lead timeline.

### 4.6 Demo booking
- Schedule, reschedule and cancel a demo.
- Store start/end in UTC and retain the selected IANA timezone.
- Link every booking to a lead and owner.
- Track requested, confirmed, completed, no-show and cancelled states.
- Send customer and internal confirmations when the email provider is configured.

### 4.7 Users and access
- Invite, activate, suspend and deactivate internal users.
- Assign roles and team membership.
- Enforce MFA for privileged roles where supported.
- Display last login and account status.
- Never provide public self-registration.

## 5. Roles and permissions

| Role | Access |
|---|---|
| Owner | Full access, including users, roles, configuration and audit review |
| Admin | Manage leads, tasks, bookings, reports and staff access, except owner-only controls |
| Sales Manager | View team leads, assign/reassign leads, manage pipeline and team reports |
| Sales Agent | View and update assigned leads, add notes, manage own tasks and bookings |
| Marketing | View acquisition and campaign reporting; access to personal lead data only where specifically required |
| Read Only | View approved dashboard and reports without editing or exporting personal data |

Permission checks must be performed in API code and database policies. Hiding a button or page in the browser is not an authorisation control. Role changes and user deactivation must take effect on subsequent requests.

## 6. Initial data model

Use UUID primary keys, UTC timestamps, foreign keys, indexes and explicit status constraints. Store only the personal information required to respond to the enquiry and manage the relationship.

### Core tables

- **staff_profiles** — auth user ID, name, role, team, active status, created/updated timestamps.
- **leads** — full name, work email, E.164 phone, company, country, industry, product interest, expected monthly call-volume band, message, enquiry type, status, priority, owner, source, landing page, referrer, UTM fields, consent fields, created/updated timestamps.
- **lead_activities** — lead ID, actor, event type, timestamp, safe structured metadata for stage changes, assignment, booking and task events.
- **lead_notes** — lead ID, author, note body, visibility (internal only), created/updated timestamps.
- **follow_up_tasks** — lead ID, assigned user, due timestamp, priority, status, description, completion timestamp.
- **demo_bookings** — lead ID, owner, start/end UTC, IANA timezone, booking status, meeting details.
- **audit_logs** — actor, action, entity type/ID, timestamp, request correlation ID and minimal change metadata.
- **notification_outbox** — event type, recipient reference, template, delivery state, retry count and provider message ID.
- **campaigns** (optional in first intake release) — campaign name, source, medium, active dates and tracking metadata.

### Lead capture fields

Capture:
- Name, email, phone, company/organisation.
- Industry, enquiry type and product/solution interest.
- Expected monthly call-volume band when relevant.
- Message / business requirement.
- Form type (contact or demo).
- Page path, locale, referrer and UTM parameters.
- Contact-purpose acknowledgement, separate optional marketing opt-in, timestamp and privacy-notice version.

Do not collect sensitive identity or payment data in the marketing form. Do not put names, phone numbers, messages or other personal data in URLs, analytics events or application logs.

### Duplicate handling

Use normalised email and E.164 phone matching to flag likely duplicates. Do not silently discard an enquiry: retain a safe duplicate indicator, link the records or offer a controlled merge action to authorised staff. Preserve the original source attribution and submission history.

## 7. API contract

Initial endpoint set:

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/public/leads` | Accept contact, demo and partnership enquiries |
| GET | `/api/admin/session` | Return authenticated staff identity and permissions |
| GET | `/api/admin/leads` | Search, filter and paginate leads |
| GET | `/api/admin/leads/:id` | Retrieve permitted lead detail and timeline |
| PATCH | `/api/admin/leads/:id` | Update status, owner, priority and editable details |
| POST | `/api/admin/leads/:id/notes` | Add internal note |
| POST | `/api/admin/leads/:id/tasks` | Create follow-up task |
| POST | `/api/admin/tasks/:id/complete` | Complete a task |
| GET | `/api/admin/bookings` | List permitted demo bookings |
| POST | `/api/admin/bookings` | Create demo booking |
| PATCH | `/api/admin/bookings/:id` | Reschedule or update booking |
| GET | `/api/admin/reports/overview` | Return aggregate dashboard metrics |
| GET/POST/PATCH | `/api/admin/users` | Owner/admin-controlled staff management |

All endpoints return a consistent JSON envelope, safe error codes and HTTP status codes. List endpoints use server-side pagination, bounded page sizes and allow-listed sort fields.

## 8. Public enquiry intake workflow

1. Browser submits the form to `POST /api/public/leads`.
2. Server enforces HTTPS, method, content-type and request-size limits.
3. Validate and normalise fields server-side; reject malformed email/phone and unexpected properties.
4. Verify anti-abuse token and apply rate limits.
5. Record source, landing page, locale, UTM attribution and consent metadata.
6. Check for probable duplicates without losing the new enquiry.
7. Persist the lead and initial activity atomically.
8. Add notification work to the outbox.
9. Return a neutral success reference to the browser.
10. Send internal notification and, where configured, a customer acknowledgement.

Do not return a raw database error or whether a particular email/phone already exists. If notification delivery fails after the lead has been stored, keep the lead and retry notification separately.

## 9. Security, privacy and resilience controls

- Invite-only authentication; disable public sign-up.
- Strong password / email verification controls and MFA for Owner/Admin.
- Short-lived sessions, secure cookie handling where supported, logout and session revocation.
- Check active account and role on every administrative request.
- RLS enabled for every exposed table, with explicit grants and separate policies for SELECT, INSERT, UPDATE and DELETE.
- Test both allowed and denied cases for anonymous users, each staff role and inactive users.
- Keep Supabase secret/service-role keys in server-only Vercel environment variables; never expose them to the browser.
- Validate all public and admin payloads with a shared schema.
- Rate-limit public submissions by IP and other abuse signals; add CAPTCHA/Turnstile with server-side verification.
- Apply CSRF/origin protections to cookie-authenticated write endpoints.
- Use security headers and a restrictive Content Security Policy; avoid unsafe HTML rendering of user-submitted notes/messages.
- Use parameterised database queries; never build SQL from client input.
- Use least-privilege access, encrypted transport and managed backups appropriate to the selected database plan.
- Redact personal information from logs; log security events and administrative changes.
- Define retention, deletion, correction, access-request and breach-response procedures with the organisation's legal/privacy owner.
- Review privacy notice, consent language, processor agreements, retention and cross-border data handling against the applicable Indian and target-market privacy requirements before collecting real customer data.

## 10. Analytics and reporting

Track business events rather than exposing personal data:
- `lead_form_view`, `lead_form_submit_success`, `demo_request_submit_success`.
- Lead source, medium, campaign, landing page, locale, country and device category.
- Pipeline transitions, demo attendance and final outcomes.

Use aggregate metrics. Do not send email, phone, name, free-text message or full lead ID to third-party analytics. Keep business CRM reporting as the system of record; analytics tools are for traffic and conversion attribution.

## 11. Implementation sequence and release gates

### Milestone 1 — Platform and repository foundation
- Create Supabase project in approved region.
- Configure Vercel environment variables separately for Preview and Production.
- Add admin application scaffold and build scripts without modifying public site rendering.
- Add serverless API structure and shared validation/error handling.
- Add database migrations and seed only development test data.
- Add admin route handling while preserving existing public rewrites.

**Gate:** Public site routes and assets remain unchanged; preview build passes.

### Milestone 2 — Security and identity
- Configure invite-only Auth.
- Implement staff profiles, role resolution and active-user checks.
- Implement API authentication middleware.
- Add grants, RLS policies and database policy tests.
- Add audit event helpers.

**Gate:** Anonymous users cannot access admin data; every role passes positive and negative access tests.

### Milestone 3 — Lead intake
- Connect Contact and Request a Demo forms to the public intake API.
- Add server-side validation, abuse controls, deduplication and notification outbox.
- Store attribution and consent metadata.
- Add customer-safe confirmation and operational error states.

**Gate:** Enquiries persist, are visible to permitted staff, and are not lost when email delivery is temporarily unavailable.

### Milestone 4 — Admin CRM workflow
- Build overview, inbox, filters, lead detail and timeline.
- Implement assignments, statuses, notes and tasks.
- Add audit trail for all sensitive changes.

**Gate:** A staff user can process a new lead end-to-end with permission enforcement and a complete timeline.

### Milestone 5 — Demo operations and reporting
- Add demo scheduling and lifecycle.
- Add follow-up reminders and team notifications.
- Add source, campaign, pipeline and response-time reporting.

**Gate:** Demo lifecycle and reporting reconcile with database records; metrics are not hardcoded.

### Milestone 6 — Production hardening and controlled launch
- Complete accessibility, responsive, browser and security testing.
- Verify backups, monitoring, error handling and support ownership.
- Approve privacy notice, retention and consent language.
- Run user acceptance testing with Owner, Admin, Sales Manager and Sales Agent accounts.
- Release through an approved pull request and production deployment.

**Gate:** Product owner signs off; rollback path is documented; no production secrets or test records are present.

## 12. Test strategy

- Unit tests: schema validation, normalisation, permissions and pipeline transitions.
- API tests: valid/invalid submissions, oversized payloads, rate limits, duplicate signals, notification retries and safe error responses.
- Database tests: RLS allow/deny matrix for anonymous and every staff role.
- Workflow tests: lead creation → assignment → contact → qualification → demo → proposal → won/lost.
- Security tests: unauthenticated admin access, role escalation, inactive-user session, CSRF/origin, XSS in user-submitted notes, secret leakage and export permissions.
- UI tests: mobile, tablet and desktop; keyboard navigation; accessible form labels; empty, loading, error and success states.
- Regression: all existing public routes, Arabic overview, logo/brand assets and current domain deployment.

## 13. Environment and operations checklist

Required server-side configuration (actual values are provisioned securely, never committed):
- `SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY` (client-visible only if needed)
- `SUPABASE_SECRET_KEY` (server-only)
- `TURNSTILE_SECRET_KEY`
- `EMAIL_PROVIDER_API_KEY`
- `EMAIL_FROM_ADDRESS`
- Any rate-limit provider credentials selected for production

Maintain separate Preview and Production databases or clearly isolated environments. Do not allow preview submissions to reach live sales users. Use synthetic test contacts in Preview.

## 14. Explicitly out of scope for the first Admin release

- Live telephony controls, outbound dialling, call recordings and agent monitoring.
- Billing, invoices, subscription management and payment collection.
- Full marketing campaign automation or WhatsApp/SMS delivery.
- Customer portal and self-service logins.
- AI call summaries, speech analytics and automated lead scoring.
- Multi-company / multi-tenant CRM resale.

These can be designed as later modules once lead-management workflows are stable.

## 15. Open setup dependencies

The following require authorised account access or an explicit operational choice:
1. Create and own the Supabase organisation/project and approve Mumbai as the data region.
2. Configure Auth email delivery and invite the first Owner account.
3. Select the transactional email provider and sender domain.
4. Choose the CAPTCHA/anti-abuse provider and configure its domain keys.
5. Confirm the privacy notice, consent wording, retention period and who can export lead data.
6. Provide the initial internal staff list and role assignments.
7. Confirm whether the first production admin URL should remain `/admin` or move to `admin.proautodial.in`.

No database or email credentials are assumed to exist until these items are configured.

## 16. References

- [Vercel Functions](https://vercel.com/docs/functions) — server-side functions and API handling.
- [Vercel Function regions](https://vercel.com/docs/functions/configuring-functions/region) — place functions close to data services.
- [Vercel region list](https://vercel.com/docs/regions) — Mumbai function region is `bom1`.
- [Supabase available regions](https://supabase.com/docs/guides/platform/regions) — Mumbai database region is `ap-south-1`.
- [Supabase Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security) — enable RLS, set grants and test allow/deny policies.
- [Supabase API keys](https://supabase.com/docs/guides/getting-started/api-keys) — secret keys bypass RLS and must remain server-side.
- [Supabase server-side Auth](https://supabase.com/docs/guides/auth/server-side) — secure session handling guidance.
- [MeitY DPDP Rules 2025](https://www.meity.gov.in/documents/act-and-policies/digital-personal-data-protection-rules-2025-gDOxUjMtQWa) — official rules and enforcement timeline; obtain current legal review before launch.
