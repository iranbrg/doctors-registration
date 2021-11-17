-- CreateEnum
CREATE TYPE "Specialty" AS ENUM ('Allergology', 'Angiology', 'Maxillofacial', 'ClinicalCardiology', 'ChildrensCardiology', 'HeadAndNeckSurgery', 'CardiacSurgery', 'ChestSurgery');

-- CreateTable
CREATE TABLE "doctors" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "crm" TEXT NOT NULL,
    "landline" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "zip_code" TEXT NOT NULL,
    "specialties" "Specialty" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "doctors_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "doctors_crm_key" ON "doctors"("crm");

-- CreateIndex
CREATE UNIQUE INDEX "doctors_landline_key" ON "doctors"("landline");

-- CreateIndex
CREATE UNIQUE INDEX "doctors_phone_number_key" ON "doctors"("phone_number");
