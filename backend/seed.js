const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function ensureRole(name) {
  const existing = await prisma.role.findFirst({ where: { name } });
  if (existing) return existing;
  return prisma.role.create({
    data: {
      name,
      permissionsJson: {},
    },
  });
}

async function main() {
  const superAdminRole = await ensureRole("SUPER_ADMIN");
  const adminRole = await ensureRole("ADMIN");
  const userRole = await ensureRole("USER");

  const superAdminPwd = await bcrypt.hash("SuperAdmin@123", 10);
  const adminPwd = await bcrypt.hash("Admin@123", 10);
  const userPwd = await bcrypt.hash("User@123", 10);

  const defaultOrg = await prisma.organization.upsert({
    where: { code: "cachedigitech-internal" },
    update: {},
    create: {
      name: "Cachedigitech Internal",
      code: "cachedigitech-internal",
      modules: ["CRM", "HRMS"],
    },
  });

  const admin = await prisma.user.findFirst({
    where: { email: "admin@cachedigitech.com" },
  });

  await prisma.user.upsert({
    where: { email: "superadmin@cachedigitech.com" },
    update: {},
    create: {
      name: "Super Admin",
      email: "superadmin@cachedigitech.com",
      passwordHash: superAdminPwd,
      roleId: superAdminRole.id,
      isActive: true,
    },
  });

  await prisma.user.upsert({
    where: { email: "admin@cachedigitech.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@cachedigitech.com",
      passwordHash: adminPwd,
      roleId: adminRole.id,
      organizationId: defaultOrg.id,
      isActive: true,
    },
  });

  await prisma.user.upsert({
    where: { email: "user@cachedigitech.com" },
    update: {},
    create: {
      name: "User",
      email: "user@cachedigitech.com",
      passwordHash: userPwd,
      roleId: userRole.id,
      organizationId: defaultOrg.id,
      isActive: true,
    },
  });

  const leadCount = await prisma.lead.count();
  if (leadCount === 0) {
    const assignedToId = admin?.id ?? null;

    await prisma.lead.createMany({
      data: [
        {
          companyName: "Zenora Health Systems",
          contactName: "Aritra Singh",
          designation: "IT Head",
          phone: "+91-9876543210",
          email: "aritra.singh@zenorahealth.com",
          source: "Inbound – Website",
          industry: "Healthcare",
          city: "Mumbai",
          state: "Maharashtra",
          requirement: "Enterprise CRM rollout across 12 hospitals with OPD integration",
          estimatedValue: 18000000,
          status: "Qualified",
          assignedToId,
        },
        {
          companyName: "Northfield Logistics",
          contactName: "Megha Rao",
          designation: "COO",
          phone: "+91-9833011122",
          email: "megha.rao@northfieldlogistics.in",
          source: "Partner – Channel",
          industry: "Logistics",
          city: "Bengaluru",
          state: "Karnataka",
          requirement: "Control tower for fleet, invoicing and collections",
          estimatedValue: 12500000,
          status: "Proposal",
          assignedToId,
        },
        {
          companyName: "Aurelius Finance",
          contactName: "Rahul Verma",
          designation: "CIO",
          phone: "+91-9819002211",
          email: "rahul.verma@aureliusfinance.com",
          source: "Outbound – SDR",
          industry: "Financial Services",
          city: "Delhi",
          state: "Delhi NCR",
          requirement: "Unified CRM for wealth, retail and SME lending teams",
          estimatedValue: 22000000,
          status: "New",
          assignedToId,
        },
      ],
    });
  }

  const presalesCount = await prisma.presalesProject.count();
  if (presalesCount === 0) {
    const leadsForPresales = await prisma.lead.findMany({
      orderBy: { createdAt: "asc" },
      take: 3,
    });

    for (const [index, lead] of leadsForPresales.entries()) {
      const project = await prisma.presalesProject.create({
        data: {
          leadId: String(lead.id),
          title:
            index === 0
              ? "Enterprise CRM rollout – Phase 1"
              : index === 1
              ? "Control tower and invoicing stack"
              : "Unified CRM for multi‑segment finance",
          clientName: lead.companyName,
          assignedTo: admin ? admin.name : "Presales Engineer",
          assignedBy: admin ? admin.name : "Admin",
          currentStage: index === 0 ? "SOLUTION_DESIGN" : index === 1 ? "BOQ_CREATION" : "POC",
          priority: index === 2 ? "URGENT" : "HIGH",
          estimatedValue: lead.estimatedValue ?? null,
          expectedCloseDate: new Date(new Date().getTime() + (index + 1) * 30 * 24 * 60 * 60 * 1000),
          winProbability: 35,
          status: "active",
          notes: "Seeded presales project for demo purposes.",
        },
      });

      await prisma.presalesStageLog.createMany({
        data: [
          {
            projectId: project.id,
            stage: "INITIATED",
            completedBy: project.assignedBy,
            notes: "Presales project created from lead.",
            timeTakenMinutes: 60,
          },
          {
            projectId: project.id,
            stage: "REQUIREMENT_ANALYSIS",
            completedBy: project.assignedTo,
            notes: "Initial discovery call and requirement notes captured.",
            timeTakenMinutes: 8 * 60,
          },
        ],
      });

      await prisma.requirementDoc.create({
        data: {
          projectId: project.id,
          rawNotes:
            "Customer expects a unified CRM with strong integrations into existing billing and support systems.",
          functionalReq: [
            { id: "F1", description: "360° customer view with ticket and invoice history." },
            { id: "F2", description: "Lead to opportunity to presales tracking in single pane." },
          ],
          technicalReq: [
            { id: "T1", description: "REST APIs for integration with ERP and support tools." },
            { id: "T2", description: "Role‑based access control and audit trail." },
          ],
          constraints: "Go‑live within 3 months with minimal downtime during migration.",
          stakeholders: [
            { name: "IT Head", role: "Technical Sponsor", contact: lead.email },
            { name: "Sales Director", role: "Business Owner", contact: lead.email },
          ],
        },
      });

      await prisma.solutionDesign.create({
        data: {
          projectId: project.id,
          architectureUrl: "https://example.com/architecture/crm-saas",
          diagramUrl: "https://example.com/diagrams/crm-reference",
          techStack: {
            frontend: ["React", "Vite", "Tailwind"],
            backend: ["Node.js", "Express"],
            database: ["PostgreSQL"],
            analytics: ["Recharts"],
          },
          competitors: [
            { name: "GlobalSuite CRM", advantage: "Brand", riskLevel: "Medium" },
            { name: "NicheCloud CRM", advantage: "Deep industry templates", riskLevel: "High" },
          ],
          recommendedOption: "Cachedigitech CRM with phased roll‑out.",
          justification:
            "Balances time‑to‑value with flexibility; strong fit for existing infra and future data projects.",
        },
      });

      const boqLineItems = [
        {
          id: "L1",
          item: "CRM licences – core users",
          description: "Full‑featured CRM seats for sales and presales",
          quantity: 25,
          negotiatedPrice: 18000,
        },
        {
          id: "L2",
          item: "Implementation services",
          description: "Discovery, configuration, integrations, and training",
          quantity: 1,
          negotiatedPrice: 350000,
        },
      ];

      const boqTotal = boqLineItems.reduce((sum, item) => sum + item.quantity * item.negotiatedPrice, 0);

      await prisma.bOQ.create({
        data: {
          projectId: project.id,
          lineItems: boqLineItems,
          totalValue: boqTotal,
          oemName: "Cachedigitech",
          validity: new Date(new Date().getTime() + 45 * 24 * 60 * 60 * 1000),
          attachmentUrl: null,
          effortDays: 40,
          resourceCount: 3,
          status: index === 1 ? "submitted" : "draft",
        },
      });

      await prisma.pOC.create({
        data: {
          projectId: project.id,
          objective: "Validate integration flows and performance benchmarks for CRM rollout.",
          scope: "Limited to sales and presales teams with sample production‑like data.",
          successCriteria: [
            "Create and update leads and opportunities from external system.",
            "View presales project dashboards within 2s for top users.",
          ],
          environment: "Sandbox CRM instance with VPN access.",
          assignedEngineer: project.assignedTo,
          startDate: new Date(),
          endDate: new Date(new Date().getTime() + 14 * 24 * 60 * 60 * 1000),
          outcome: index === 2 ? "partial" : "success",
          findings:
            "Minor configuration tweaks required for lead scoring; otherwise flows match expectations.",
          evidenceUrls: ["https://example.com/poc/session-recording"],
          status: index === 2 ? "in_progress" : "completed",
        },
      });

      await prisma.proposal.create({
        data: {
          projectId: project.id,
          executiveSummary:
            "Cachedigitech CRM will unify your sales and presales workflows and provide a single pane of glass for revenue operations.",
          scopeOfWork:
            "Discovery, configuration, integrations, UAT support, and go‑live assistance across 3 months.",
          technicalApproach:
            "Modular implementation using existing tech stack, with APIs and configurable data model.",
          commercials: boqLineItems.map(item => ({
            id: item.id,
            item: item.item,
            description: item.description,
            price: item.negotiatedPrice * item.quantity,
          })),
          timeline: [
            { id: "T1", name: "Discovery and design", weeks: 3 },
            { id: "T2", name: "Build and integrations", weeks: 6 },
            { id: "T3", name: "UAT and go‑live", weeks: 3 },
          ],
          teamStructure: [
            { id: "TS1", role: "Engagement Lead", count: 1 },
            { id: "TS2", role: "Presales Engineer", count: 2 },
            { id: "TS3", role: "Developer", count: 2 },
          ],
          termsConditions:
            "Standard payment terms with 30‑day credit; proposal valid for 45 days from issue date.",
          status: index === 0 ? "sent" : "draft",
          sentAt: index === 0 ? new Date(new Date().getTime() - 10 * 24 * 60 * 60 * 1000) : null,
        },
      });

      await prisma.presalesActivity.createMany({
        data: [
          {
            projectId: project.id,
            type: "NOTE",
            description: "Kick‑off call completed; customer aligned on high‑level scope.",
            createdBy: project.assignedTo,
          },
          {
            projectId: project.id,
            type: "FILE_UPLOAD",
            description: "Uploaded initial requirement spreadsheet and architecture diagram.",
            createdBy: project.assignedTo,
            fileUrl: "https://example.com/files/requirements-v1.xlsx",
          },
        ],
      });
    }
  }
}

main()
  .then(async () => {
    console.log("Seed complete");
    await prisma.$disconnect();
  })
  .catch(async e => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
