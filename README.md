# Cachedigitech CRM

Production-grade internal CRM for Cachedigitech (200 employees, 4–5 new hires/month).  
Runs on **crm.cachedigitech.com** with API at **api.cachedigitech.com**.

## Tech stack

- **Backend:** Node.js + Express + TypeScript  
- **Database:** PostgreSQL  
- **ORM:** Prisma  
- **Auth:** JWT + Role-Based Access Control  
- **Frontend:** React + Vite + Tailwind CSS  
- **Architecture:** Modular monolith (Controller → Service → Repository → Prisma)

## Features

- **Leads:** Create, list, filter by status, update status, assign, convert qualified leads to clients  
- **Clients:** Create, list, paginate  
- **Deals:** Create per client, track stage (Proposal → Negotiation → Won/Lost), value and expected closure date  
- **Activities:** Log call, meeting, email, follow-up (linked to lead or client)  
- **Tasks:** Create, assign to employee ID, due date, pending/completed  
- **Dashboard:** Total leads, leads by status, total clients, deals won this month, revenue summary, team performance (leads per executive)  
- **Audit logs:** Track actions by user, entity type, entity ID (Super Admin / Sales Manager)  
- **HRMS integration:** Read-only; CRM stores only `employee_id`, fetches details via HRMS service  
- **Sales Lifecycle Workflow:** Stage-driven pipeline: Company → Lead → Opportunity → BOQ/SOW → OEM Quote → Quote → OVF → Approval → SCM. Role-based actions, timeline, document versioning, approval locking, lost-deal handling. See [Sales Lifecycle](#sales-lifecycle-workflow) below.

## Roles

| Role           | Capabilities |
|----------------|--------------|
| **Super Admin** | Full access |
| **Sales Manager** | View all leads, assign leads, view team performance |
| **Sales Executive** | View assigned leads only, update lead status, add activity |
| **Viewer** | Read-only |
| **Pre-Sales** | Upload BOQ/SOW/OEM quote, set OEM received |
| **Sales Head** | Create opportunity, quote, OVF, send for approval |
| **Management** | Approve/Reject OVF |
| **SCM** | View SCM stage, handoff |

## Sales Lifecycle Workflow

Strict state-machine pipeline with RBAC, audit, and stage locking.

**Stages:** Company (Open/Closed) → Lead (Open/Converted/Dead) → Opportunity → BOQ Submitted → SOW Attached → OEM Quotation Received → Quote Created → OVF Created → Approval Pending → Approved → Sent to SCM. **Lost Deal** available at Opportunity, OEM, Quote, Approval.

**Rules:**
- Company must exist before Lead; cannot delete company with active opportunity.
- Lead: Convert to Opportunity (reason required) or Mark Dead (reason required).
- Opportunity: stage transitions validated; no skip; DR number or "NA" required at OEM stage.
- Documents: BOQ/SOW/OEM/Quote supporting (PDF, DOC, XLS); versioned; editable until approval.
- Quote locked when OVF created; OVF sent for approval; Management approves/rejects; SCM handoff only after approval.
- Lost deal: reason mandatory; deal locked.
- Timeline and audit log on every action; soft delete only.

**API base path:** `/api/lifecycle/*` (companies, leads, opportunities, quotes, ovf, approvals, scm, documents, dashboard). All require JWT.

## Project structure

```
CRM/
├── prisma/
│   ├── schema.prisma      # Leads, clients, deals, activities, tasks, audit_logs, crm_users
│   ├── migrations/
│   └── seed.ts            # Creates admin@cachedigitech.com (SUPER_ADMIN)
├── src/
│   ├── config/
│   ├── lib/               # prisma, audit, hrms
│   ├── middleware/        # auth (JWT + RBAC), errorHandler, validate
│   ├── modules/
│   │   ├── auth/          # login, register, profile
│   │   └── crm/           # controllers, services, repositories, routes, validation
│   ├── app.ts
│   └── server.ts
├── client/                # React + Vite + Tailwind
│   └── src/
│       ├── api/           # API client (auth, dashboard, leads, clients, deals, tasks)
│       ├── components/
│       ├── contexts/      # AuthContext
│       └── pages/         # Login, Dashboard, Leads, Clients, Deals, Tasks
├── .env
├── .env.example
└── package.json
```

## Setup

### 1. Environment

Copy `.env.example` to `.env` and set:

- `DATABASE_URL` – PostgreSQL URL (e.g. `postgresql://crm_user:StrongPassword2@172.16.110.46:5432/cachedigitech_crm`)
- `JWT_SECRET` – Min 32 characters for production
- `PORT` – API port (default 4000)
- `HRMS_SERVICE_URL` – HRMS base URL for employee lookup (read-only)

### 2. Database

Ensure PostgreSQL is reachable, then:

```bash
npx prisma generate       # writes to generated/prisma-client (avoids EPERM on Windows)
npm run db:migrate        # or db:migrate:prod for production
npm run db:seed           # creates admin@cachedigitech.com / Admin@123
```

The Prisma client is generated into `generated/prisma-client` so you can run `prisma generate` even while the dev server is running (no need to stop it to avoid file locks on Windows).

If the DB is not reachable from your machine, run the SQL in `prisma/migrations/.../migration.sql` on the server, then:

```bash
npx prisma migrate resolve --applied <migration_name>
npx prisma generate
npm run db:seed
```

**Seeding when `DATABASE_URL` points to an unreachable host (e.g. 172.16.x.x):**  
Use a local PostgreSQL instance for development. Create a DB (e.g. `createdb cachedigitech_crm`), run migrations, then in `.env` add:

```env
SEED_DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/cachedigitech_crm
```

Then run `npm run db:seed`. The app can keep using `DATABASE_URL` for the real server; only the seed uses `SEED_DATABASE_URL` when set.

### 3. Run

**Development (API + frontend):**

```bash
npm install
npm run dev
```

- API: http://localhost:4000  
- Frontend: http://localhost:5173 (proxies `/api` to 4000)

**Production:**

```bash
npm run build
npm run db:migrate:prod
npm start
```

Serve the `client/dist` folder from crm.cachedigitech.com and run the API on api.cachedigitech.com.

## API summary

All APIs (except `/api/auth/login`, `/api/auth/register`, `/health`) require:

```http
Authorization: Bearer <token>
```

Standard response:

```json
{ "success": true, "data": { ... }, "message": "" }
```

- **Auth:** `POST /api/auth/login`, `POST /api/auth/register`, `GET /api/auth/profile`  
- **Dashboard:** `GET /api/dashboard`  
- **Leads:** `GET/POST /api/leads`, `GET/PATCH /api/leads/:id`, `POST /api/leads/:id/convert-to-client`  
- **Clients:** `GET/POST /api/clients`, `GET/PATCH /api/clients/:id`  
- **Deals:** `GET/POST /api/deals`, `GET/PATCH /api/deals/:id`, `GET /api/clients/:clientId/deals`  
- **Activities:** `GET/POST /api/activities`, `GET /api/activities/:id`  
- **Tasks:** `GET/POST /api/tasks`, `GET/PATCH /api/tasks/:id`  
- **Audit:** `GET /api/audit-logs` (Super Admin / Sales Manager)

List endpoints support `page` and `pageSize` (mobile-friendly, paginated).

## Security

- JWT on all CRM routes  
- Role middleware on write/assign endpoints  
- Rate limiting (default 200 req/15 min per IP)  
- Request body validation (Zod)  
- No direct DB access in controllers; no cross-module DB access

## Default login (after seed)

- **Email:** admin@cachedigitech.com  
- **Password:** Admin@123  

Change the password after first login in production.

## Troubleshooting

### "The table `public.crm_users` does not exist"

The database is reachable but migrations have not been applied. Create tables and the admin user by running (in the same environment where the app runs):

```bash
npm run db:setup
```

Or step by step:

```bash
npm run db:migrate
npm run db:seed
```

Then restart the app (`npm run dev`). Use **admin@cachedigitech.com** / **Admin@123** to log in.

### Login returns "Internal server error" (500) or "Database client out of date" (503)

The app uses a **custom Prisma client output** (`generated/prisma-client`) so you can run `npx prisma generate` **even while the dev server is running** (avoids Windows EPERM on `node_modules/.prisma`).

1. **Regenerate the Prisma client** (no need to stop the server)
   ```bash
   npx prisma generate
   ```

2. **Seed the database** (creates default org and links admin to it). Ensure PostgreSQL is reachable (see `DATABASE_URL` in `.env`).
   ```bash
   npm run db:seed
   ```

3. **Restart the app** so it loads the new client, then log in with **admin@cachedigitech.com** / **Admin@123**.

### "Can't reach database server" when running `npm run db:seed`

`DATABASE_URL` in `.env` points to a host (e.g. `172.16.110.46`) that your machine cannot reach (VPN off, server down, or different network).

- **Option A – Use local PostgreSQL for seeding**  
  1. Install and start PostgreSQL on your machine.  
  2. Create the database: `createdb cachedigitech_crm` (or via pgAdmin).  
  3. Run migrations against it: set `DATABASE_URL` to your local URL temporarily, then `npm run db:migrate`, or run the migration SQL on the local DB.  
  4. In `.env` add (use your local user/password):  
     `SEED_DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/cachedigitech_crm`  
  5. Run `npm run db:seed`. Seed will use `SEED_DATABASE_URL`; the app can keep using the main `DATABASE_URL` for the real server.

- **Option B – Make the main DB reachable**  
  Connect to VPN (or the network where `172.16.110.46` lives), ensure PostgreSQL is running on that host, then run `npm run db:seed` again.

### "Permission denied for schema public"

The database user (`crm_user`) cannot create tables. Use one of these:

**Option A – Run migrations with a superuser (recommended)**

1. In `.env`, add a line with a **superuser** URL (e.g. `postgres`), same host/database:
   ```env
   MIGRATE_DATABASE_URL=postgresql://postgres:YOUR_POSTGRES_PASSWORD@172.16.110.46:5432/cachedigitech_crm
   ```
2. Keep your existing `DATABASE_URL` as `crm_user` (the app uses it at runtime).
3. From the project root run:
   ```bash
   npm run db:setup:admin
   ```
4. Restart the app and log in with **admin@cachedigitech.com** / **Admin@123**.

**Option B – Temporary switch in terminal (PowerShell)**

```powershell
$env:DATABASE_URL="postgresql://postgres:YOUR_POSTGRES_PASSWORD@172.16.110.46:5432/cachedigitech_crm"
npm run db:setup
```
Then run the app as usual (it will use `DATABASE_URL` from `.env` again).

**Option C – DBA grants permissions**

Have a DB admin run (as superuser in `psql`):
```sql
GRANT ALL ON SCHEMA public TO crm_user;
GRANT ALL ON ALL TABLES IN SCHEMA public TO crm_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO crm_user;
```
Then run `npm run db:setup` again.
