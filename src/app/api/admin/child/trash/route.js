import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const children = await prisma.child.findMany({
      where: {
        isDeleted: true
      },
      include: {
        parent: {
          include: {
            user: true
          }
        },
        class: true
      }
    });

    return NextResponse.json({ success: true, children });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}