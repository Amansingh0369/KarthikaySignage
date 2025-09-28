-- CreateEnum
CREATE TYPE "NeonSignType" AS ENUM ('DEFAULT', 'CUSTOM');

-- AlterTable
ALTER TABLE "NeonSign" ADD COLUMN     "type" "NeonSignType" NOT NULL DEFAULT 'DEFAULT';
