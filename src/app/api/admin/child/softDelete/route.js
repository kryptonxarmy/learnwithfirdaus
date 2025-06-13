import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(req) {
  try {
    const { id } = await req.json();

    const updatedChild = await prisma.child.update({
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
      message: "Data berhasil dihapus ke sampah"
    });
  } catch (error) {
    console.error("Error soft deleting child:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    });
  }
}