import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(req) {
  try {
    const { id } = await req.json();

    const updatedProgress = await prisma.progress.update({
      where: { 
        id: parseInt(id) 
      },
      data: {
        isDeleted: true,
        deletedAt: new Date()
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: "Data perkembangan berhasil dipindahkan ke sampah"
    });
  } catch (error) {
    console.error("Error soft deleting progress:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}