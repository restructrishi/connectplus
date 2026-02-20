-- CreateEnum
CREATE TYPE "UserDepartment" AS ENUM ('SCM', 'DEPLOYMENT', 'PRE_SALES', 'DATA_AI', 'CLOUD', 'LEGAL_COMPLIANCE', 'SALES', 'ISR', 'FINANCE');

-- CreateEnum
CREATE TYPE "CrmDealStage" AS ENUM ('LEAD_GENERATION', 'QUALIFICATION', 'PRE_SALES_HANDOVER', 'REQUIREMENT_ANALYSIS', 'SOLUTION_DESIGN', 'SYSTEM_DESIGN', 'TECHNOLOGY_STACK', 'BOQ_PREPARATION', 'POC', 'PROPOSAL_GENERATION', 'NEGOTIATION', 'AGREEMENT_PHASE', 'CLOSED_WON', 'CLOSED_LOST');

-- CreateEnum
CREATE TYPE "POStatus" AS ENUM ('CLIENT_PO_RECEIVED', 'PO_SENT_TO_DISTRIBUTOR', 'DISTRIBUTOR_DELIVERED', 'WAREHOUSE_TO_CUSTOMER', 'DOCUMENTS_COMPLETED', 'INVOICE_SENT_TO_ACCOUNTS', 'INVOICE_SENT_TO_CUSTOMER', 'COMPLETED');

-- AlterTable
ALTER TABLE "crm_users" ADD COLUMN     "department" "UserDepartment",
ADD COLUMN     "firstName" TEXT,
ADD COLUMN     "lastName" TEXT,
ADD COLUMN     "organizationId" TEXT;

-- CreateTable
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "domain" TEXT,
    "subscriptionTier" TEXT NOT NULL DEFAULT 'BASIC',
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "logo" TEXT,
    "primaryColor" TEXT DEFAULT '#0F62FE',
    "settings" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrgDepartment" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "headId" TEXT,
    "settings" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrgDepartment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CrmContact" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "mobile" TEXT,
    "companyName" TEXT NOT NULL,
    "designation" TEXT,
    "website" TEXT,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "country" TEXT,
    "pincode" TEXT,
    "contactType" TEXT NOT NULL DEFAULT 'CUSTOMER',
    "leadSource" TEXT,
    "organizationId" TEXT NOT NULL,
    "ownerId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastContactedAt" TIMESTAMP(3),
    "customFields" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CrmContact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CrmDeal" (
    "id" TEXT NOT NULL,
    "dealName" TEXT NOT NULL,
    "dealValue" DOUBLE PRECISION NOT NULL,
    "stage" "CrmDealStage" NOT NULL,
    "subStage" TEXT,
    "contactId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "scmPersonId" TEXT,
    "preSalesPersonId" TEXT,
    "expectedCloseDate" TIMESTAMP(3),
    "actualCloseDate" TIMESTAMP(3),
    "probability" INTEGER,
    "documents" JSONB NOT NULL DEFAULT '{}',
    "isWon" BOOLEAN NOT NULL DEFAULT false,
    "isLost" BOOLEAN NOT NULL DEFAULT false,
    "lostReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CrmDeal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrgProduct" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "description" TEXT,
    "unitPrice" DOUBLE PRECISION NOT NULL,
    "costPrice" DOUBLE PRECISION NOT NULL,
    "currentStock" INTEGER NOT NULL DEFAULT 0,
    "minimumStock" INTEGER NOT NULL DEFAULT 5,
    "category" TEXT,
    "specifications" JSONB NOT NULL DEFAULT '{}',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "organizationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrgProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PurchaseOrder" (
    "id" TEXT NOT NULL,
    "poNumber" TEXT NOT NULL,
    "clientPOReceived" BOOLEAN NOT NULL DEFAULT false,
    "clientPOReceivedAt" TIMESTAMP(3),
    "clientPOFile" TEXT,
    "timeCalculation" JSONB NOT NULL DEFAULT '{}',
    "poSentToDistributor" BOOLEAN NOT NULL DEFAULT false,
    "poSentToDistributorAt" TIMESTAMP(3),
    "distributorPOFile" TEXT,
    "distributorDelivered" BOOLEAN NOT NULL DEFAULT false,
    "distributorDeliveredAt" TIMESTAMP(3),
    "deliveryChallan" TEXT,
    "warehouseToCustomer" BOOLEAN NOT NULL DEFAULT false,
    "warehouseToCustomerAt" TIMESTAMP(3),
    "proofOfDelivery" TEXT,
    "mipMrnDocuments" JSONB NOT NULL DEFAULT '[]',
    "scmInvoiceSent" BOOLEAN NOT NULL DEFAULT false,
    "scmInvoiceSentAt" TIMESTAMP(3),
    "scmInvoiceFile" TEXT,
    "accountsInvoiceSent" BOOLEAN NOT NULL DEFAULT false,
    "accountsInvoiceSentAt" TIMESTAMP(3),
    "customerInvoiceFile" TEXT,
    "status" "POStatus" NOT NULL DEFAULT 'CLIENT_PO_RECEIVED',
    "subtotal" DOUBLE PRECISION NOT NULL,
    "tax" DOUBLE PRECISION NOT NULL,
    "shipping" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "total" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "dealId" TEXT,
    "organizationId" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PurchaseOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PurchaseOrderItem" (
    "id" TEXT NOT NULL,
    "purchaseOrderId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPrice" DOUBLE PRECISION NOT NULL,
    "totalPrice" DOUBLE PRECISION NOT NULL,
    "receivedQuantity" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PurchaseOrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Organization_name_key" ON "Organization"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Organization_domain_key" ON "Organization"("domain");

-- CreateIndex
CREATE INDEX "OrgDepartment_organizationId_idx" ON "OrgDepartment"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "OrgDepartment_name_organizationId_key" ON "OrgDepartment"("name", "organizationId");

-- CreateIndex
CREATE INDEX "CrmContact_organizationId_idx" ON "CrmContact"("organizationId");

-- CreateIndex
CREATE INDEX "CrmContact_email_idx" ON "CrmContact"("email");

-- CreateIndex
CREATE INDEX "CrmContact_companyName_idx" ON "CrmContact"("companyName");

-- CreateIndex
CREATE UNIQUE INDEX "CrmContact_email_organizationId_key" ON "CrmContact"("email", "organizationId");

-- CreateIndex
CREATE INDEX "CrmDeal_organizationId_idx" ON "CrmDeal"("organizationId");

-- CreateIndex
CREATE INDEX "CrmDeal_stage_idx" ON "CrmDeal"("stage");

-- CreateIndex
CREATE INDEX "CrmDeal_contactId_idx" ON "CrmDeal"("contactId");

-- CreateIndex
CREATE INDEX "CrmDeal_ownerId_idx" ON "CrmDeal"("ownerId");

-- CreateIndex
CREATE INDEX "OrgProduct_organizationId_idx" ON "OrgProduct"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "OrgProduct_sku_organizationId_key" ON "OrgProduct"("sku", "organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "PurchaseOrder_poNumber_key" ON "PurchaseOrder"("poNumber");

-- CreateIndex
CREATE INDEX "PurchaseOrder_organizationId_idx" ON "PurchaseOrder"("organizationId");

-- CreateIndex
CREATE INDEX "PurchaseOrder_dealId_idx" ON "PurchaseOrder"("dealId");

-- CreateIndex
CREATE INDEX "PurchaseOrder_status_idx" ON "PurchaseOrder"("status");

-- CreateIndex
CREATE INDEX "PurchaseOrderItem_purchaseOrderId_idx" ON "PurchaseOrderItem"("purchaseOrderId");

-- CreateIndex
CREATE INDEX "PurchaseOrderItem_productId_idx" ON "PurchaseOrderItem"("productId");

-- CreateIndex
CREATE INDEX "crm_users_organizationId_idx" ON "crm_users"("organizationId");

-- CreateIndex
CREATE INDEX "ovfs_status_idx" ON "ovfs"("status");

-- AddForeignKey
ALTER TABLE "crm_users" ADD CONSTRAINT "crm_users_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "opportunity_timeline" ADD CONSTRAINT "opportunity_timeline_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "opportunities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrgDepartment" ADD CONSTRAINT "OrgDepartment_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CrmContact" ADD CONSTRAINT "CrmContact_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CrmDeal" ADD CONSTRAINT "CrmDeal_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "CrmContact"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CrmDeal" ADD CONSTRAINT "CrmDeal_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrgProduct" ADD CONSTRAINT "OrgProduct_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseOrder" ADD CONSTRAINT "PurchaseOrder_dealId_fkey" FOREIGN KEY ("dealId") REFERENCES "CrmDeal"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseOrder" ADD CONSTRAINT "PurchaseOrder_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseOrder" ADD CONSTRAINT "PurchaseOrder_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "crm_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseOrderItem" ADD CONSTRAINT "PurchaseOrderItem_purchaseOrderId_fkey" FOREIGN KEY ("purchaseOrderId") REFERENCES "PurchaseOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseOrderItem" ADD CONSTRAINT "PurchaseOrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "OrgProduct"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
