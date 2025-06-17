import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(req) {
  try {
    const { progressId } = await req.json();

    await prisma.progressDetail.updateMany({
      where: { 
        progressId: parseInt(progressId)
      },
      data: {
        isDeleted: false,
        deletedAt: null
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: "Detail perkembangan berhasil dipulihkan" 
    });
  } catch (error) {
    console.error("Error restoring progress details:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    });
  }
}