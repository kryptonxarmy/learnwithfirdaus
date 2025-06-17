import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(req) {
  try {
    const { progressId } = await req.json();

    // Update semua detail perkembangan yang terkait
    await prisma.progressDetail.updateMany({
      where: { 
        progressId: parseInt(progressId)
      },
      data: {
        isDeleted: true,
        deletedAt: new Date()
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: "Detail perkembangan berhasil dipindahkan ke sampah"
    });
  } catch (error) {
    console.error("Error soft deleting progress details:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}