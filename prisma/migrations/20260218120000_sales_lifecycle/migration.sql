-- CreateEnum
CREATE TYPE "CompanyStatus" AS ENUM ('OPEN', 'CLOSED');

-- CreateEnum
CREATE TYPE "LeadLifecycleStatus" AS ENUM ('OPEN', 'CONVERTED', 'DEAD');

-- CreateEnum
CREATE TYPE "OpportunityStage" AS ENUM ('OPEN', 'BOQ_SUBMITTED', 'SOW_ATTACHED', 'OEM_QUOTATION_RECEIVED', 'QUOTE_CREATED', 'OVF_CREATED', 'APPROVAL_PENDING', 'APPROVED', 'SENT_TO_SCM', 'LOST_DEAL');

-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('BOQ', 'SOW', 'OEM_QUOTE', 'QUOTE_SUPPORTING', 'OVF_ATTACHMENT');

-- CreateEnum
CREATE TYPE "OVFStatus" AS ENUM ('DRAFT', 'APPROVAL_PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "ApprovalStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterEnum (add new roles to CrmRole)
ALTER TYPE "CrmRole" ADD VALUE 'PRE_SALES';
ALTER TYPE "CrmRole" ADD VALUE 'SALES_HEAD';
ALTER TYPE "CrmRole" ADD VALUE 'MANAGEMENT';
ALTER TYPE "CrmRole" ADD VALUE 'SCM';

-- CreateTable
CREATE TABLE "sales_companies" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "CompanyStatus" NOT NULL DEFAULT 'OPEN',
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "sales_companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sales_leads" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "contactInfo" TEXT,
    "createdBy" TEXT NOT NULL,
    "assignedTo" TEXT,
    "status" "LeadLifecycleStatus" NOT NULL DEFAULT 'OPEN',
    "convertedAt" TIMESTAMP(3),
    "convertedBy" TEXT,
    "convertedReason" TEXT,
    "deadAt" TIMESTAMP(3),
    "deadBy" TEXT,
    "deadReason" TEXT,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "sales_leads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "opportunities" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "leadId" TEXT,
    "estimatedValue" DECIMAL(14,2),
    "assignedSalesPerson" TEXT NOT NULL,
    "stage" "OpportunityStage" NOT NULL DEFAULT 'OPEN',
    "probability" INTEGER,
    "expectedClosureDate" TIMESTAMP(3),
    "drNumber" TEXT,
    "drNumberNa" BOOLEAN NOT NULL DEFAULT false,
    "oemQuotationReceived" BOOLEAN,
    "isLocked" BOOLEAN NOT NULL DEFAULT false,
    "lostAt" TIMESTAMP(3),
    "lostBy" TEXT,
    "lostReason" TEXT,
    "lostStage" TEXT,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "opportunities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documents" (
    "id" TEXT NOT NULL,
    "opportunityId" TEXT NOT NULL,
    "type" "DocumentType" NOT NULL,
    "filePath" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "uploadedBy" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quotes" (
    "id" TEXT NOT NULL,
    "opportunityId" TEXT NOT NULL,
    "amount" DECIMAL(14,2) NOT NULL,
    "marginPercent" DECIMAL(8,2),
    "marginAmount" DECIMAL(14,2),
    "details" JSONB,
    "lockedAt" TIMESTAMP(3),
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "quotes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ovfs" (
    "id" TEXT NOT NULL,
    "opportunityId" TEXT NOT NULL,
    "quoteId" TEXT NOT NULL,
    "dealName" TEXT NOT NULL,
    "finalAmount" DECIMAL(14,2) NOT NULL,
    "marginPercent" DECIMAL(8,2),
    "paymentTerms" TEXT,
    "status" "OVFStatus" NOT NULL DEFAULT 'DRAFT',
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sentForApprovalAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ovfs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "approvals" (
    "id" TEXT NOT NULL,
    "ovfId" TEXT NOT NULL,
    "opportunityId" TEXT NOT NULL,
    "status" "ApprovalStatus" NOT NULL DEFAULT 'PENDING',
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "decidedAt" TIMESTAMP(3),
    "decidedBy" TEXT,
    "comments" TEXT,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "approvals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scm_handoffs" (
    "id" TEXT NOT NULL,
    "opportunityId" TEXT NOT NULL,
    "ovfId" TEXT NOT NULL,
    "handedOffAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "handedOffBy" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'SENT',
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "scm_handoffs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "opportunity_timeline" (
    "id" TEXT NOT NULL,
    "opportunityId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "stageFrom" TEXT,
    "stageTo" TEXT,
    "userId" TEXT NOT NULL,
    "comment" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "opportunity_timeline_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "opportunities_leadId_key" ON "opportunities"("leadId");

-- CreateIndex
CREATE UNIQUE INDEX "quotes_opportunityId_key" ON "quotes"("opportunityId");

-- CreateIndex
CREATE UNIQUE INDEX "ovfs_opportunityId_key" ON "ovfs"("opportunityId");

-- CreateIndex
CREATE UNIQUE INDEX "ovfs_quoteId_key" ON "ovfs"("quoteId");

-- CreateIndex
CREATE UNIQUE INDEX "scm_handoffs_opportunityId_key" ON "scm_handoffs"("opportunityId");

-- CreateIndex
CREATE INDEX "sales_companies_createdBy_idx" ON "sales_companies"("createdBy");

-- CreateIndex
CREATE INDEX "sales_companies_status_idx" ON "sales_companies"("status");

-- CreateIndex
CREATE INDEX "sales_leads_companyId_idx" ON "sales_leads"("companyId");

-- CreateIndex
CREATE INDEX "sales_leads_status_idx" ON "sales_leads"("status");

-- CreateIndex
CREATE INDEX "sales_leads_assignedTo_idx" ON "sales_leads"("assignedTo");

-- CreateIndex
CREATE INDEX "opportunities_companyId_idx" ON "opportunities"("companyId");

-- CreateIndex
CREATE INDEX "opportunities_stage_idx" ON "opportunities"("stage");

-- CreateIndex
CREATE INDEX "opportunities_assignedSalesPerson_idx" ON "opportunities"("assignedSalesPerson");

-- CreateIndex
CREATE INDEX "documents_opportunityId_idx" ON "documents"("opportunityId");

-- CreateIndex
CREATE INDEX "documents_type_idx" ON "documents"("type");

-- CreateIndex
CREATE INDEX "approvals_ovfId_idx" ON "approvals"("ovfId");

-- CreateIndex
CREATE INDEX "approvals_status_idx" ON "approvals"("status");

-- CreateIndex
CREATE INDEX "scm_handoffs_ovfId_idx" ON "scm_handoffs"("ovfId");

-- CreateIndex
CREATE INDEX "opportunity_timeline_opportunityId_idx" ON "opportunity_timeline"("opportunityId");

-- CreateIndex
CREATE INDEX "opportunity_timeline_createdAt_idx" ON "opportunity_timeline"("createdAt");

-- AddForeignKey
ALTER TABLE "sales_leads" ADD CONSTRAINT "sales_leads_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "sales_companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "opportunities" ADD CONSTRAINT "opportunities_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "sales_companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "opportunities" ADD CONSTRAINT "opportunities_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "sales_leads"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "opportunities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quotes" ADD CONSTRAINT "quotes_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "opportunities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ovfs" ADD CONSTRAINT "ovfs_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "opportunities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ovfs" ADD CONSTRAINT "ovfs_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "quotes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "approvals" ADD CONSTRAINT "approvals_ovfId_fkey" FOREIGN KEY ("ovfId") REFERENCES "ovfs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "approvals" ADD CONSTRAINT "approvals_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "opportunities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scm_handoffs" ADD CONSTRAINT "scm_handoffs_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "opportunities"("id") ON DELETE CASCADE ON UPDATE CASCADE;
