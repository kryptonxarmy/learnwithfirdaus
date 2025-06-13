import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const teachers = await prisma.teacher.findMany({
      where: {
        isDeleted: true
      },
      orderBy: {
        deletedAt: 'desc'
      }
    });

    return NextResponse.json({ 
      success: true, 
      teachers: teachers 
    });

  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ 
      success: false, 
      message: error.message,
      teachers: [] 
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}