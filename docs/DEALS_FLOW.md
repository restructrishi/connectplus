# Deals → Pre-Sales → SCM → Deployment flow

This document describes how the **Deals** section connects to Pre-Sales, Deployment, and Purchase Orders (SCM) so you can see data and run the full process.

## Why Deals was empty before

- The **Deals** page now uses **org-scoped deals** (CrmDeal), which are the same deals that link to Pre-Sales, Deployment, and Purchase Orders.
- If you had no contacts or deals in this org, the list was empty. You need at least one **contact** and one **deal** to see rows.

## How to see everything

### 1. Run the seed (if you haven’t)

```bash
npm run db:seed
```

This creates (among other things):

- A sample **contact**: Demo Contact, demo@acme.example.com, Acme Corp  
- A sample **deal**: “Acme Corp – Server Upgrade”, ₹5,00,000  

After seeding, log in as the seeded user (e.g. `admin@cachedigitech.com`). The **Deals** page should show the sample deal.

### 2. Create your own contact and deal

1. Go to **Deals**.
2. Click **Create deal**.
3. If you have no contacts yet:
   - Click **+ Add new contact**.
   - Fill First name, Last name, Email, Company (and optionally Phone), then **Save contact**.
4. Select the contact, enter **Deal name** and **Value (₹)**, choose **Stage**, optionally set **Expected close date**.
5. Click **Create deal**.

You’ll see the new deal in the table. Click **View & actions** to open the deal detail.

### 3. Deal detail: connect to other modules

On a deal’s detail page you can:

| Action | What it does |
|--------|-------------------------------|
| **Hand off to Pre-Sales** | Creates a Pre-Sales record for this deal (enter handover date and optional notes). You’re taken to the new Pre-Sales record. |
| **Create deployment** | Creates a Deployment for this deal using the deal’s contact. You’re taken to the new Deployment. |
| **Create purchase order** | Opens the SCM “New Purchase Order” form with this deal pre-linked. After creating the PO, you can use **Handoff to Deployment** on the PO if the deal has a contact. |

So the **process** is:

1. **Deals** – Create/look at deals (each deal has a contact).
2. From a deal: **Hand off to Pre-Sales** → Pre-Sales record created; open it to fill Requirement analysis, Solution design, BOQ.
3. From the same deal: **Create deployment** → Deployment created; open it to update workflow steps and kick-off/site survey.
4. From the same deal: **Create purchase order** → PO created and linked to the deal; on the PO detail you can do time calculation, MIP/MRN, invoice flow, and **Handoff to Deployment** (which also creates a deployment from the PO’s deal/contact).

### 4. Where to see data

- **Deals** – List of org-scoped deals; create deal (and contact) here.
- **Pre-Sales** – List shows records created via “Hand off to Pre-Sales” from a deal.
- **Deployment** – List shows deployments created from a deal (or from SCM handoff).
- **Purchase Orders (SCM)** – List shows POs; create from deal detail or from SCM, and link to a deal when creating.

## Pipeline Engine (Sales Pipeline → Stage flow)

The **Pipeline Engine** page shows a Jenkins-style stage flow (Open → BOQ → SOW → Quote → OVF → Approval → SCM) for **lifecycle opportunities**.

- **Select Opportunity** dropdown is filled from the **lifecycle** API. To see options:
  1. Run **npm run db:seed** – creates one sample lifecycle company + opportunity ("Acme Corp – Server Upgrade") so the dropdown has at least one option.
  2. Or use **Sales Pipeline** (dual-panel): create a company, add a lead, then **Convert** the lead. Converting a lead creates both a pipeline opportunity and a **lifecycle opportunity**, so the new opportunity appears in the Pipeline Engine dropdown.
- Use **Refresh list** on Pipeline Engine to reload the dropdown after converting leads or creating opportunities elsewhere.
- The horizontal **Stage flow** shows the current step and lets you move the deal through stages (approve/reject OVF, mark lost, etc.).

## Summary

- **Deals** is the hub: create contacts and deals here, then from each deal open **Pre-Sales**, **Deployment**, or **Purchase order**.
- **Pipeline Engine** shows the lifecycle stage workflow; its dropdown is populated by seed data and by **converting leads** in Sales Pipeline.
- Run **npm run db:seed** once to get a sample contact, deal, and one lifecycle opportunity.
- All of this uses the same org as your logged-in user; you only see data for your organization.
