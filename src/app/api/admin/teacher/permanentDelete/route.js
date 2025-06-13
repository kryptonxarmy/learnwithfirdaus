import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function DELETE(req) {
  try {
    const { id } = await req.json();

    const deletedTeacher = await prisma.teacher.delete({
      where: { 
        id: parseInt(id) 
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: "Data guru berhasil dihapus permanent"
    });

  } catch (error) {
    console.error("Error deleting teacher permanently:", error);
    return NextResponse.json({ 
      success: false, 
      message: error.message || "Gagal menghapus data guru"
    }, { 
      status: 500 
    });
  } finally {
    await prisma.$disconnect();
  }
}