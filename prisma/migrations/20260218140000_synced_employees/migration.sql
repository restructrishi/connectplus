-- CreateTable
CREATE TABLE "synced_employees" (
    "id" TEXT NOT NULL,
    "employeeCode" TEXT,
    "firstName" TEXT,
    "lastName" TEXT,
    "email" TEXT,
    "designation" TEXT,
    "employmentType" TEXT,
    "dateOfJoining" TIMESTAMP(3),
    "departmentName" TEXT,
    "syncedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "synced_employees_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "synced_employees_email_idx" ON "synced_employees"("email");

-- CreateIndex
CREATE INDEX "synced_employees_syncedAt_idx" ON "synced_employees"("syncedAt");
