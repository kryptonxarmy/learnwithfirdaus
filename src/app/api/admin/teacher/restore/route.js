import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(req) {
  try {
    const { id } = await req.json();

    const restoredTeacher = await prisma.teacher.update({
      where: { id: parseInt(id) },
      data: {
        isDeleted: false,
        deletedAt: null
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}