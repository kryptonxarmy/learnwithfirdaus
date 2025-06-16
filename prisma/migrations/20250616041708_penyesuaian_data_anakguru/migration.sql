-- AlterTable
ALTER TABLE "Child" ADD COLUMN     "academicYearId" INTEGER,
ADD COLUMN     "semesterId" INTEGER;

-- AlterTable
ALTER TABLE "Teacher" ADD COLUMN     "academicYearId" INTEGER,
ADD COLUMN     "semesterId" INTEGER;

-- AddForeignKey
ALTER TABLE "Child" ADD CONSTRAINT "Child_semesterId_fkey" FOREIGN KEY ("semesterId") REFERENCES "Semester"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Child" ADD CONSTRAINT "Child_academicYearId_fkey" FOREIGN KEY ("academicYearId") REFERENCES "AcademicYear"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Teacher" ADD CONSTRAINT "Teacher_semesterId_fkey" FOREIGN KEY ("semesterId") REFERENCES "Semester"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Teacher" ADD CONSTRAINT "Teacher_academicYearId_fkey" FOREIGN KEY ("academicYearId") REFERENCES "AcademicYear"("id") ON DELETE SET NULL ON UPDATE CASCADE;
