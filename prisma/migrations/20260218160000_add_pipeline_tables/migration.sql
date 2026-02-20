-- CreateTable (ADD ONLY - no alter/drop of existing tables)
CREATE TABLE "pipeline_companies" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pipeline_companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pipeline_leads" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "convertedAt" TIMESTAMP(3),
    "convertedToId" TEXT,
    "lostReason" TEXT,

    CONSTRAINT "pipeline_leads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pipeline_opportunities" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "leadId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'LEAD_CONVERTED',
    "attachments" JSONB NOT NULL DEFAULT '{}',
    "technicalDetails" JSONB NOT NULL DEFAULT '{}',
    "approvals" JSONB NOT NULL DEFAULT '[]',
    "emailsSent" JSONB NOT NULL DEFAULT '[]',
    "ovfDetails" JSONB NOT NULL DEFAULT '{}',
    "lostDeal" BOOLEAN NOT NULL DEFAULT false,
    "lostReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pipeline_opportunities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pipeline_companies_name_key" ON "pipeline_companies"("name");

-- CreateIndex
CREATE INDEX "pipeline_leads_companyId_idx" ON "pipeline_leads"("companyId");

-- CreateIndex
CREATE INDEX "pipeline_leads_status_idx" ON "pipeline_leads"("status");

-- CreateIndex
CREATE UNIQUE INDEX "pipeline_opportunities_leadId_key" ON "pipeline_opportunities"("leadId");

-- CreateIndex
CREATE INDEX "pipeline_opportunities_status_idx" ON "pipeline_opportunities"("status");

-- CreateIndex
CREATE INDEX "pipeline_opportunities_companyId_idx" ON "pipeline_opportunities"("companyId");

-- AddForeignKey
ALTER TABLE "pipeline_leads" ADD CONSTRAINT "pipeline_leads_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "pipeline_companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pipeline_opportunities" ADD CONSTRAINT "pipeline_opportunities_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "pipeline_companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pipeline_opportunities" ADD CONSTRAINT "pipeline_opportunities_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "pipeline_leads"("id") ON DELETE SET NULL ON UPDATE CASCADE;
