// /api/admin/laporan/presensi-anak/route.js
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const semesterId = searchParams.get("semesterId");
  const academicYearId = searchParams.get("academicYearId");

  const whereClause = {
    isDeleted: false,
    type: "child", // Filter hanya untuk tipe child
    ...(semesterId && { semesterId: parseInt(semesterId) }),
    ...(academicYearId && { academicYearId: parseInt(academicYearId) }),
  };

  try {
    const attendances = await prisma.attendance.findMany({
      where: whereClause,
      include: {
        child: {
          select: {
            id: true,
            name: true,
            studentId: true,
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
        semester: {
          select: {
            id: true,
            number: true,
          },
        },
        academicYear: {
          select: {
            id: true,
            year: true,
          },
        },
      },
      orderBy: {
        date: 'desc'
      }
    });

    return NextResponse.json({ success: true, attendances });
  } catch (error) {
    console.error("Error fetching child attendance:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}

export async function POST(req) {
  const { 
    date, 
    childId, 
    status, 
    arrivalTime, 
    departureTime, 
    remarks, 
    penjemput, 
    pengantar, 
    semesterId, 
    academicYearId 
  } = await req.json();

  try {
    const attendance = await prisma.attendance.create({
      data: {
        date: new Date(date),
        type: "child", // Fixed type untuk child
        childId: parseInt(childId),
        teacherId: null, // Null untuk presensi anak
        status,
        arrivalTime: arrivalTime || null,
        departureTime: departureTime || null,
        remarks,
        penjemput: penjemput || null,
        pengantar: pengantar || null,
        semesterId: parseInt(semesterId),
        academicYearId: parseInt(academicYearId),
      },
      include: {
        child: {
          select: {
            id: true,
            name: true,
            studentId: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, attendance });
  } catch (error) {
    console.error("Error creating child attendance:", error);
    return NextResponse.json({ success: false, error: error.message });
  }
}

export async function PUT(req) {
  const { 
    id, 
    date, 
    childId, 
    status, 
    arrivalTime, 
    departureTime, 
    remarks, 
    penjemput, 
    pengantar, 
    semesterId, 
    academicYearId 
  } = await req.json();

  try {
    const attendance = await prisma.attendance.update({
      where: { id: parseInt(id) },
      data: {
        date: new Date(date),
        type: "child", // Fixed type untuk child
        childId: parseInt(childId),
        teacherId: null, // Null untuk presensi anak
        status,
        arrivalTime: arrivalTime || null,
        departureTime: departureTime || null,
        remarks,
        penjemput: penjemput || null,
        pengantar: pengantar || null,
        semesterId: parseInt(semesterId),
        academicYearId: parseInt(academicYearId),
      },
      include: {
        child: {
          select: {
            id: true,
            name: true,
            studentId: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, attendance });
  } catch (error) {
    console.error("Error updating child attendance:", error);
    return NextResponse.json({ success: false, error: error.message });
  }
}

export async function DELETE(req) {
  const { id } = await req.json();

  try {
    const updatedAttendance = await prisma.attendance.update({
      where: { id: parseInt(id) },
      data: {
        isDeleted: true,
        deletedAt: new Date()
      },
    });
    
    return NextResponse.json({ 
      success: true,
      message: "Data presensi anak berhasil dipindahkan ke sampah"
    });
  } catch (error) {
    console.error("Error soft deleting child attendance:", error);
    return NextResponse.json({ success: false, error: error.message });
  }
}