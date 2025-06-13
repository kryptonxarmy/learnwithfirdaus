import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(req) {
  try {
    const { id } = await req.json();

    const updatedTeacher = await prisma.teacher.update({
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
      message: "Guru berhasil dipindahkan ke sampah" 
    });
  } catch (error) {
    console.error("Error in softDelete:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}