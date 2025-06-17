import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(req) {
  try {
    const { id } = await req.json();

    const restoredProgress = await prisma.progress.update({
      where: { 
        id: parseInt(id) 
      },
      data: {
        isDeleted: false,
        deletedAt: null
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: "Data perkembangan berhasil dipulihkan" 
    });
  } catch (error) {
    console.error("Error restoring progress:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    });
  }
}