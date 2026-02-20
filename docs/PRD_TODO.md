# PRD Implementation To-Do List

**Source:** Custom Zoho-Inspired CRM PRD v1.0 (Feb 19, 2026)  
**Last updated:** Feb 19, 2026

This document maps PRD requirements to the current codebase and lists actionable to-dos.  
**Legend:** ✅ Done / In codebase | 🟡 Partial | ❌ Not started

---

## 1. EXECUTIVE SUMMARY ALIGNMENT

| Objective | Status | Notes |
|-----------|--------|------|
| Replace Zoho dependency | 🟡 | Foundation in place; full workflow coverage pending |
| Unified system for all departments | 🟡 | Sales, SCM, Pre-Sales, Deployment, Data/AI, Cloud, Legal modules exist (list/detail) |
| Visibility across sales-to-delivery | ❌ | Executive dashboard and cross-module reports pending |
| Data-driven analytics | ❌ | Department dashboards and Recharts pending |
| Multi-tenant SaaS | 🟡 | Organization + CrmUser.organizationId; org management UI pending |

---

## 2. USER ROLES & PERMISSIONS (PRD §3)

### 2.1 Role Hierarchy

| PRD Role | Current Schema | To-Do |
|----------|----------------|------|
| SUPER_ADMIN | ✅ CrmRole.SUPER_ADMIN | Align middleware to PRD (org management, escalated tickets) |
| ORG_ADMIN | ❌ | Add ORG_ADMIN to CrmRole; scope all APIs by organizationId |
| DEPARTMENT_HEAD | ❌ | Add DEPT_HEAD; link to OrgDepartment.headId |
| TEAM_LEAD / TL | 🟡 | Implicit in Project.tlId, CloudProject.tlId; add TEAM_LEAD role if needed |
| EXECUTIVE | 🟡 | Maps to SALES_EXECUTIVE / VIEWER; standardize as EXECUTIVE |

**To-Do:**
- [ ] Extend CrmRole: add ORG_ADMIN, DEPARTMENT_HEAD, TEAM_LEAD, EXECUTIVE per PRD.
- [ ] Implement RBAC middleware: permission matrix (Org mgmt, User mgmt, Ticket mgmt, Approve, View reports).
- [ ] Scope all list/create/update/delete by organizationId for non–SUPER_ADMIN.

### 2.2 Permission Matrix

- [ ] Implement feature-level checks (Organization Management, User Management, Department Config, etc.).
- [ ] Ticket access: All / Org / Dept / Team / Create-only by role.
- [ ] Report visibility: All / Org / Dept / Team / Own by role.

---

## 3. CORE MODULES (PRD §4)

### 3.1 Authentication & Authorization (§4.1)

| Requirement | Status | To-Do |
|-------------|--------|-------|
| Email/password + JWT | ✅ | — |
| JWT 8-hour expiry | 🟡 | Confirm config.jwt.expiresIn (e.g. 8h). |
| Refresh token (7-day) | ❌ | Add refresh token model, endpoint, and rotation. |
| Password reset via email | ❌ | Add forgot-password flow + email (Nodemailer/Resend). |
| MFA (Phase 2) | ❌ | Defer. |
| Session management | ❌ | Optional: session store + logout-all. |
| Login history | ❌ | Add LoginHistory model and log on login. |
| “Remember me” / session timeout warning | ❌ | Frontend: optional “Remember me”, timeout warning. |

**To-Do:**
- [ ] Set JWT expiry to 8h in config.
- [ ] Design refresh token (table, expiry 7d, rotation) and add `/auth/refresh`, `/auth/logout`.
- [ ] Forgot password: token generation, email template, reset-password page.
- [ ] Login history: Prisma model + write on login; optional UI in profile.

### 3.2 Organization Management (§4.2)

| Requirement | Status | To-Do |
|-------------|--------|-------|
| Create org (name, domain) | 🟡 | Backend can create via seed; no SUPER_ADMIN UI. |
| Subscription tier (BASIC/PRO/ENT) | ✅ | In schema. |
| Org settings, logo, primary color | ✅ | In schema. |
| Suspend/activate | ❌ | Add status or isActive; API + UI. |
| Usage metrics | ❌ | Add analytics or usage tables + API. |
| Defaults (currency, timezone) | 🟡 | Can live in settings JSON; expose in UI. |

**To-Do:**
- [ ] SUPER_ADMIN: Organization list/create/edit UI (name, domain, tier, logo, color, settings).
- [ ] Suspend/activate organization (status or isActive) + API.
- [ ] Optional: usage metrics API and simple dashboard.

### 3.3 User Management (§4.3)

| Requirement | Status | To-Do |
|-------------|--------|-------|
| Add/remove users | 🟡 | Auth register exists; no org-scoped user CRUD UI. |
| Assign roles and departments | 🟡 | CrmUser has role + department; no UI. |
| Department permissions | ❌ | departmentAccess/permissions JSON in schema; implement logic + UI. |
| Bulk import (CSV) | ❌ | Endpoint + parsing + validation. |
| Profile, password reset (admin), activity log | 🟡 | Profile API exists; add admin reset + activity log. |

**To-Do:**
- [ ] Org-scoped user list/create/edit UI (role, department, permissions).
- [ ] Deactivate/reactivate user (isActive) + API.
- [ ] Admin-initiated password reset endpoint.
- [ ] User activity log (model or reuse AuditLog) + display in profile.
- [ ] Bulk user import (CSV) with validation and error report.

### 3.4 Ticketing System (§4.4)

| Requirement | Status | To-Do |
|-------------|--------|-------|
| Ticket model | ❌ | Not in schema. |
| Context-aware creation (dept, page) | ❌ | — |
| Categories, priority, attachments | ❌ | — |
| Assignment, escalation (DEPT → ORG → SUPER) | ❌ | — |
| Notifications, history, comments | ❌ | — |

**To-Do:**
- [ ] Add Ticket (and optional TicketComment) model to Prisma; migration.
- [ ] Ticket API: create, list, get, update status, assign, escalate, add comment.
- [ ] Frontend: floating “Help” button, ticket modal (context), list/detail views, admin views.
- [ ] Email on status change (optional).
- [ ] RBAC: assignment and escalation rules by role.

---

## 4. DEPARTMENT-SPECIFIC MODULES (PRD §5)

### 4.1 Sales (§5.1)

| Requirement | Status | To-Do |
|-------------|--------|-------|
| Contact/Lead management | ✅ | Leads, Clients, CrmContact; CrmDeal. |
| Deal pipeline, stages | ✅ | CrmDealStage; pipeline/sales-lifecycle in code. |
| Lead source (WEBSITE, REFERRAL, OEM, etc.) | 🟡 | Add enum/field if not present; use in filters. |
| Activity logging, meetings, MoM | 🟡 | Activity exists; Meeting/MoM per PRD to be aligned. |
| Handoff to Pre-Sales | 🟡 | Stage PRE_SALES_HANDOVER; enforce handoff in UI. |

**To-Do:**
- [ ] Align lead source with PRD (WEBSITE, REFERRAL, OEM, ALIGNMENT, SHIFT, BOUGHT, FINANCIAL).
- [ ] Kanban pipeline view (by CrmDealStage) + list view.
- [ ] Deal detail tabs: Details, Activities, Meetings, Documents.
- [ ] Meeting scheduler + MoM (Minutes of Meeting) form and storage.
- [ ] Lost reason capture on deal close.

### 4.2 Pre-Sales (§5.2)

| Requirement | Status | To-Do |
|-------------|--------|-------|
| Lead handover acceptance | 🟡 | PreSales linked to Deal; UI for “accept handover”. |
| Requirement/solution/system design docs | 🟡 | JSON fields in PreSales; rich forms. |
| Technology stack selection | 🟡 | JSON; UI selector. |
| BOQ builder (software, cloud, hardware, manpower, third-party) | ❌ | Structured BOQ model or JSON + UI. |
| POC management | ❌ | POC JSON + status + timeline UI. |
| Proposal generation (PDF) | ❌ | PDFKit/React-PDF; template. |
| Timeline (20 days / 1 month) | ❌ | Field + UI indicator. |

**To-Do:**
- [x] Pre-Sales detail: Requirement Analysis, Solution Design, BOQ (JSON forms).
- [ ] BOQ builder UI (structured line items, categories, totals) — currently JSON.
- [ ] POC tracker (status, dates, result) and link to deal.
- [ ] Proposal PDF export.
- [ ] Timeline field and dashboard widget.

### 4.3 SCM / Procurement (§5.3)

| Requirement | Status | To-Do |
|-------------|--------|-------|
| PO from client, time calculation | ✅ | PurchaseOrderDetail: dates, total days. |
| Distributor flow (send, delivered, warehouse) | ✅ | Date inputs and save on PO detail. |
| MIP/MRN documents | ✅ | List/add/remove MIP/MRN docs on PO detail. |
| SCM invoice → Accounts → Customer invoice | ✅ | Invoice flow section (SCM→Accounts→Customer). |
| Handoff to Deployment | ❌ | Link PO/Deal to Deployment; “Handoff” action. |

**To-Do:**
- [ ] SCM PO detail: time calculation (dates, total days), distributor steps, MIP/MRN uploads.
- [ ] Invoice tracking (SCM → Accounts → Customer) with file upload and status.
- [ ] “Handoff to Deployment” button and create/link Deployment from PO/Deal.

### 4.4 Deployment (§5.4)

| Requirement | Status | To-Do |
|-------------|--------|-------|
| Workflow steps (schema enum) | ✅ | DeploymentDetail: 9-step progress + status dropdown. |
| Kick-off, site survey | ✅ | kickOffMeeting + siteSurvey JSON editors on detail. |
| Timeline (20 days / 1 month) | 🟡 | timeline JSON; add UI. |
| Engineer assignment, material, issues | 🟡 | projectManagerId/assignedTeam; add UI. |

**To-Do:**
- [x] Deployment detail: step progress bar, status update, kick-off/site survey sections.
- [ ] Timeline Gantt or bar (target vs actual).
- [ ] Engineer assignment and issue log UI.

### 4.5 Data/AI (§5.5)

| Requirement | Status | To-Do |
|-------------|--------|-------|
| Projects assigned to TL | ✅ | Project.tlId. |
| Skill-based task assignment | 🟡 | teamMembers/skillMapping JSON; no skill matrix UI. |
| Daily updates with evidence | ❌ | DailyUpdate model exists; no UI. |
| Task validation by TL | 🟡 | ProjectTask.validated; no validation UI. |
| Performance reports | ❌ | Reports (employee, manager) + charts. |

**To-Do:**
- [ ] Data/AI: skill matrix view and assign task by skill.
- [ ] Daily update form (tasks completed/in progress, blockers, evidence upload).
- [ ] TL: validate/reject task with notes.
- [ ] Reports: employee performance, task completion, manager report (Recharts).

### 4.6 Cloud (§5.6)

| Requirement | Status | To-Do |
|-------------|--------|-------|
| Assessment & strategy | 🟡 | assessment JSON; form UI. |
| Architecture & cost planning | 🟡 | architecture JSON; UI. |
| Implementation & migration | 🟡 | implementation JSON; UI. |
| Testing by TL, optimization | 🟡 | testingValidation, optimization JSON; UI. |

**To-Do:**
- [ ] Cloud project detail: Assessment, Architecture, Implementation, Testing, Optimization sections.
- [ ] Cost calculator / budgeting UI.
- [ ] Migration tracker and security checklist.

### 4.7 Legal & Compliance (§5.7)

| Requirement | Status | To-Do |
|-------------|--------|-------|
| Agreements: create, send, vet, negotiate, sign | 🟡 | Agreement model; workflow flags (sentToClient, vetted, signed). |
| Policy: create, review, approve, communicate, acknowledge | 🟡 | Policy model; acknowledgements JSON. |
| Expiry and reminders | ❌ | expiryDate + cron or job for reminders. |

**To-Do:**
- [ ] Agreement workflow UI: send to client, vetting, negotiation notes, mark signed + file.
- [ ] Policy workflow: review, approve, communicate; acknowledgment capture (who, when).
- [ ] Expiry calendar and optional email reminders.

### 4.8 Network & Security (§5.8)

- [ ] Placeholder module (Phase 2); optional stub in nav.

---

## 5. CROSS-FUNCTIONAL FEATURES (PRD §6)

### 5.1 Minutes of Meeting (MoM)

- [ ] Meeting model or reuse existing; MoM template (agenda, decisions, action items).
- [ ] MoM form (rich text) and link to Deal/Project/Deployment.
- [ ] Action items with assignee and due date; track completion.

### 5.2 Dashboard & Analytics

| Dashboard | Status | To-Do |
|-----------|--------|-------|
| Executive | 🟡 | Basic dashboard; add lead conversion, pipeline, tickets, deployment. |
| SCM | ❌ | PO status, avg time, invoice status. |
| Deployment | ❌ | Active deployments, timeline adherence, issues. |
| Pre-Sales | ❌ | Handover volume, time to proposal, POC success. |
| Data/AI | ❌ | Performance, task completion, validation. |
| Cloud | ❌ | Migration, cost, compliance. |
| Legal | ❌ | Agreement status, acknowledgments, expiring. |

**To-Do:**
- [ ] Recharts: add charts to Executive dashboard.
- [ ] Department-specific dashboard pages and widgets.
- [ ] Date range filters and export (PDF/Excel) where required.

### 5.3 File Management

- [ ] Multer config (size, types); S3-compatible option.
- [ ] Upload endpoints (per module: PO, Deployment, Agreement, etc.).
- [ ] Store file keys/paths in DB; link to records.
- [ ] Frontend: upload component, preview (image/PDF), download.

### 5.4 Notifications

- [ ] Socket.io server and client; auth by user/org.
- [ ] Notification model (title, message, type, link, read).
- [ ] Events: task assigned, approval pending, ticket update, etc.
- [ ] Frontend: notification bell, dropdown, mark read.
- [ ] Optional: email for high-priority events.

### 5.5 Activity Timeline

- [ ] Timeline component (by date, type); reuse Activity + Meeting.
- [ ] Add activity from timeline (call, email, meeting, note).
- [ ] Filter by type and link to Deal/Contact/Project.

---

## 6. USER INTERFACE (PRD §7)

### 6.1 Layout

- [ ] Left sidebar: collapsible, module icons, active state, sub-nav.
- [ ] Header: global search, quick create, notifications, user menu.
- [ ] Theme toggle (light/dark) and persist (localStorage).
- [ ] Org branding: logo and primary color from Organization.

### 6.2 List & Detail Views

- [ ] List: sortable columns, filters, search, bulk actions, export (where needed).
- [ ] View selector: list / Kanban (pipeline, tasks) / Gantt (deployment) where applicable.
- [ ] Detail: tabs (Details, Activities, Meetings, Documents), edit-in-place where appropriate.

### 6.3 Forms & Validation

- [ ] React Hook Form + Zod for all major forms.
- [ ] Label above field, validation on submit, save draft where specified.
- [ ] Field-level help text for complex fields.

---

## 7. TECHNICAL REQUIREMENTS (PRD §8)

### 7.1 Stack Alignment

| Layer | PRD | Current | To-Do |
|-------|-----|---------|-------|
| Frontend | React 18, TS, Vite, Tailwind, Lucide, RHF, Zod, Recharts | ✅ | Add Axios if not present; ensure RHF+Zod everywhere. |
| Backend | Node, Express, TS, JWT, bcrypt, Multer | ✅ | Multer + S3 option. |
| DB | PostgreSQL, Prisma | ✅ | — |
| Real-time | Socket.io | ❌ | Add Socket.io server and client. |
| Email | Nodemailer/Resend | ❌ | Add and use for password reset, notifications. |
| Testing | Jest, RTL | 🟡 | Increase coverage. |

### 7.2 API & Security

- [ ] API versioning: e.g. `/api/v1/` (optional but recommended).
- [ ] Rate limiting: 100 req/min per user (or per IP if no user).
- [ ] Swagger/OpenAPI for public API docs.
- [ ] Audit logging for sensitive actions (already have AuditLog; ensure coverage).

### 7.3 Non-Functional (PRD §10)

- [ ] Target: page load <2s, API p95 <300ms.
- [ ] Ensure DB indexes and query patterns for list/dashboard.
- [ ] Backup and recovery procedure documented.

---

## 8. IMPLEMENTATION PHASES (PRD §12) – MAPPED TO TO-DOs

### Phase 1: Foundation (Weeks 1–3)
- [ ] Auth: JWT 8h, refresh token, login history.
- [ ] Org management UI (SUPER_ADMIN).
- [ ] User management UI (org-scoped, roles, departments).
- [ ] RBAC middleware and permission matrix.
- [ ] Ticketing: schema + API + minimal UI (floating Help, create, list).

### Phase 2: Core CRM (Weeks 4–6)
- [ ] Sales: Kanban pipeline, deal detail tabs, lead source enum.
- [ ] Meeting + MoM (model if needed, form, link to deal).
- [ ] Activity logging from deal/contact.
- [ ] File upload (Multer + one module e.g. Deal docs).
- [ ] Executive dashboard (Recharts, key metrics).

### Phase 3: SCM & Pre-Sales (Weeks 7–9)
- [ ] SCM: PO time calculation, MIP/MRN, invoice flow, handoff to Deployment.
- [ ] Pre-Sales: BOQ builder, POC tracker, proposal PDF.
- [ ] Handoff flows and status sync.

### Phase 4: Deployment & Data/AI (Weeks 10–12)
- [ ] Deployment: 26-step UI, timeline, engineer assignment, issues.
- [ ] Data/AI: daily updates, evidence upload, TL validation, reports.

### Phase 5: Cloud & Legal (Weeks 13–15)
- [ ] Cloud: assessment/architecture/implementation/optimization UI.
- [ ] Legal: agreement vetting/signing workflow; policy acknowledgment.

### Phase 6: Analytics & Polish (Weeks 16–18)
- [ ] All department dashboards.
- [ ] Notifications (Socket.io + optional email).
- [ ] Dark mode, theme, org branding.
- [ ] Export PDF/Excel where specified.

### Phase 7: Testing & Deployment (Weeks 19–20)
- [ ] Test coverage >80%, security review, load test.
- [ ] Production deploy and training materials.

---

## 9. RECOMMENDED NEXT STEPS (PRIORITY ORDER)

1. **Roles & RBAC:** Add ORG_ADMIN, DEPT_HEAD, TEAM_LEAD, EXECUTIVE; implement permission checks and org scoping.
2. **Ticketing:** Add Ticket (and comments), API, and floating Help + list/detail UI.
3. **Auth:** Refresh token, 8h JWT, forgot password, login history.
4. **Organization & User management UI:** SUPER_ADMIN org CRUD; org-scoped user CRUD.
5. **Sales:** Kanban pipeline, deal tabs, MoM, activity timeline.
6. **SCM:** PO workflow UI (time calc, MIP/MRN, invoices, handoff).
7. **Pre-Sales:** BOQ builder, POC, proposal PDF.
8. **Deployment:** 26-step workflow UI and timeline.
9. **Data/AI:** Daily updates, validation UI, reports.
10. **Dashboards:** Executive + one department dashboard (e.g. SCM or Deployment).
11. **File upload:** Multer + S3 option; reuse across modules.
12. **Notifications:** Socket.io + Notification model + bell UI.

---

*Use this document as the master checklist; update status as items are completed.*
