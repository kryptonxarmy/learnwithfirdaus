import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const progress = await prisma.progress.findMany({
      where: {
        isDeleted: true
      },
      include: {
        child: true,
        semester: true,
        academicYear: true,
      },
    });

    return NextResponse.json({ success: true, progress });
  } catch (error) {
    console.error("Error fetching deleted progress:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    });
  }
}