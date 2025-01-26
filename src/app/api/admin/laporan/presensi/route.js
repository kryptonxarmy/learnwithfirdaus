// /pages/api/admin/laporan/presensi/route.js
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const semesterId = searchParams.get("semesterId");
  const academicYearId = searchParams.get("academicYearId");

  const whereClause = {
    ...(semesterId && { semesterId: parseInt(semesterId) }),
    ...(academicYearId && { academicYearId: parseInt(academicYearId) }),
  };

  try {
    const attendance = await prisma.attendance.findMany({
      where: whereClause,
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

export async function POST(req) {
  const { date, type, childId, teacherId, status, arrivalTime, departureTime, remarks, penjemput, pengantar, semesterId, academicYearId } = await req.json();

  try {
    const attendance = await prisma.attendance.create({
      data: {
        date: new Date(date),
        type,
        childId: childId ? parseInt(childId) : null,
        teacherId: teacherId ? parseInt(teacherId) : null,
        status,
        arrivalTime: arrivalTime ? new Date(arrivalTime).toISOString() : null,
        departureTime: departureTime ? new Date(departureTime).toISOString() : null,
        remarks,
        penjemput,
        pengantar,
        semesterId: parseInt(semesterId),
        academicYearId: parseInt(academicYearId),
      },
    });

    return NextResponse.json({ success: true, attendance });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}

export async function PUT(req) {
  const { id, date, type, childId, teacherId, status, arrivalTime, departureTime, remarks, penjemput, pengantar, semesterId, academicYearId } = await req.json();

  try {
    const attendance = await prisma.attendance.update({
      where: { id: parseInt(id) },
      data: {
        date: new Date(date),
        type,
        child: childId ? { connect: { id: parseInt(childId) } } : { disconnect: true },
        teacher: teacherId ? { connect: { id: parseInt(teacherId) } } : { disconnect: true },
        status,
        arrivalTime: arrivalTime ? new Date(arrivalTime).toISOString() : null,
        departureTime: departureTime ? new Date(departureTime).toISOString() : null,
        remarks,
        penjemput,
        pengantar,
        semester: { connect: { id: parseInt(semesterId) } },
        academicYear: { connect: { id: parseInt(academicYearId) } },
      },
    });

    return NextResponse.json({ success: true, attendance });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}

export async function DELETE(req) {
  const { id } = await req.json();

  try {
    await prisma.attendance.delete({
      where: { id: parseInt(id) },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}