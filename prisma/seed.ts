// Use same generated client as app (custom output avoids EPERM on Windows)
import "dotenv/config";
import { PrismaClient } from "../generated/prisma-client/index.js";
import bcrypt from "bcryptjs";

// Optional: set SEED_DATABASE_URL in .env to seed a different DB (e.g. local PostgreSQL)
const databaseUrl = process.env.SEED_DATABASE_URL || process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("Missing DATABASE_URL (or SEED_DATABASE_URL) in .env");
  process.exit(1);
}

const prisma = new PrismaClient({ datasourceUrl: databaseUrl });

async function main() {
  let org = await prisma.organization.findFirst({ where: { name: "Cachedigitech" } });
  if (!org) {
    org = await prisma.organization.create({
      data: {
        name: "Cachedigitech",
        domain: "cachedigitech.com",
        subscriptionTier: "BASIC",
        status: "ACTIVE",
      },
    });
    console.log("Seed: Created default organization Cachedigitech.");
  }

  const existing = await prisma.crmUser.findUnique({
    where: { email: "admin@cachedigitech.com" },
  });
  let adminId: string;
  if (existing) {
    if (!existing.organizationId) {
      await prisma.crmUser.update({
        where: { id: existing.id },
        data: { organizationId: org.id, firstName: "Super", lastName: "Admin" },
      });
      console.log("Seed: Linked admin user to organization.");
    }
    adminId = existing.id;
  } else {
    const passwordHash = await bcrypt.hash("Admin@123", 10);
    const admin = await prisma.crmUser.create({
      data: {
        employeeId: "EMP-ADMIN-001",
        email: "admin@cachedigitech.com",
        passwordHash,
        role: "SUPER_ADMIN",
        organizationId: org.id,
        firstName: "Super",
        lastName: "Admin",
      },
    });
    adminId = admin.id;
    console.log("Seed: Created Super Admin admin@cachedigitech.com / Admin@123");
  }

  // Sample contact + deal so Deals page shows data (org-scoped flow)
  const sampleContact = await prisma.crmContact.findFirst({
    where: { organizationId: org.id, email: "demo@acme.example.com" },
  });
  if (!sampleContact) {
    const contact = await prisma.crmContact.create({
      data: {
        firstName: "Demo",
        lastName: "Contact",
        email: "demo@acme.example.com",
        companyName: "Acme Corp",
        phone: "+91 9876543210",
        organizationId: org.id,
        ownerId: adminId,
      },
    });
    await prisma.crmDeal.create({
      data: {
        dealName: "Acme Corp – Server Upgrade",
        dealValue: 500_000,
        stage: "LEAD_GENERATION",
        contactId: contact.id,
        organizationId: org.id,
        ownerId: adminId,
      },
    });
    console.log("Seed: Created sample contact and deal for Deals / Pre-Sales / Deployment flow.");
  }

  // One lifecycle company + opportunity so Pipeline Engine dropdown has an option
  const empId = "EMP-ADMIN-001";
  let salesCompany = await prisma.salesCompany.findFirst({
    where: { name: "Acme Corp", deletedAt: null },
  });
  if (!salesCompany) {
    salesCompany = await prisma.salesCompany.create({
      data: { name: "Acme Corp", createdBy: empId, status: "OPEN" },
    });
    await prisma.opportunity.create({
      data: {
        name: "Acme Corp – Server Upgrade",
        companyId: salesCompany.id,
        assignedSalesPerson: empId,
        stage: "OPEN",
      },
    });
    console.log("Seed: Created lifecycle company + opportunity for Pipeline Engine.");
  }
}

main()
  .catch((e) => {
    const msg = e?.message ?? String(e);
    if (
      msg.includes("Can't reach database server") ||
      msg.includes("connect ECONNREFUSED") ||
      msg.includes("connect ETIMEDOUT")
    ) {
      console.error("\n❌ Database connection failed.\n");
      console.error("  • Check that PostgreSQL is running and reachable.");
      console.error("  • Your .env DATABASE_URL is set to:", databaseUrl.replace(/:[^:@]+@/, ":****@"));
      console.error("  • If 172.16.x.x is a remote server: connect to VPN or ensure the host is up.");
      console.error("  • For local dev with PostgreSQL on this machine, add to .env:");
      console.error('    SEED_DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/cachedigitech_crm"');
      console.error("    Then run: npm run db:seed\n");
    } else {
      console.error(e);
    }
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
