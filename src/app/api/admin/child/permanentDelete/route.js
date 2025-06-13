import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function DELETE(req) {
  try {
    const { id } = await req.json();

    const deletedChild = await prisma.child.delete({
      where: { 
        id: parseInt(id) 
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: "Data berhasil dihapus permanent" 
    });
  } catch (error) {
    console.error("Error deleting child permanently:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    });
  }
}