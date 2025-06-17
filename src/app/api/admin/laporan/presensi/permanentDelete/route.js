import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function DELETE(req) {
  try {
    const { id } = await req.json();

    const deletedAttendance = await prisma.attendance.delete({
      where: { 
        id: parseInt(id) 
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: "Data presensi berhasil dihapus permanent" 
    });
  } catch (error) {
    console.error("Error deleting attendance permanently:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    });
  }
}