-- AlterTable: extend Lead for Zoho-style form (industry, expected closure/amount, details JSON)
ALTER TABLE "leads" ADD COLUMN "industry" TEXT;
ALTER TABLE "leads" ADD COLUMN "expectedClosureDate" TIMESTAMP(3);
ALTER TABLE "leads" ADD COLUMN "expectedBusinessAmount" DECIMAL(14,2);
ALTER TABLE "leads" ADD COLUMN "details" JSONB;
