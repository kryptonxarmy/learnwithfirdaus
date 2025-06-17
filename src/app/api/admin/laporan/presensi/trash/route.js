import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const attendance = await prisma.attendance.findMany({
      where: {
        isDeleted: true
      },
      include: {
        child: {
          select: {
            name: true,
            parent: {
              select: {
                user: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
        teacher: {
          select: {
            name: true,
          },
        },
        semester: {
          select: {
            number: true,
          },
        },
        academicYear: {
          select: {
            year: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, attendance });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}