// /api/admin/laporan/presensi-guru/route.js
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const semesterId = searchParams.get("semesterId");
  const academicYearId = searchParams.get("academicYearId");

  const whereClause = {
    isDeleted: false,
    type: "teacher", // Filter hanya untuk tipe teacher
    ...(semesterId && { semesterId: parseInt(semesterId) }),
    ...(academicYearId && { academicYearId: parseInt(academicYearId) }),
  };

  try {
    const attendances = await prisma.attendance.findMany({
      where: whereClause,
      include: {
        teacher: {
          select: {
            id: true,
            name: true,
            nip: true,
            email: true,
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
    console.error("Error fetching teacher attendance:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}

export async function POST(req) {
  const { 
    date, 
    teacherId, 
    status, 
    arrivalTime, 
    departureTime, 
    remarks, 
    semesterId, 
    academicYearId 
  } = await req.json();

  try {
    const attendance = await prisma.attendance.create({
      data: {
        date: new Date(date),
        type: "teacher", // Fixed type untuk teacher
        childId: null, // Null untuk presensi guru
        teacherId: parseInt(teacherId),
        status,
        arrivalTime: arrivalTime || null,
        departureTime: departureTime || null,
        remarks,
        penjemput: null, // Null untuk presensi guru
        pengantar: null, // Null untuk presensi guru
        semesterId: parseInt(semesterId),
        academicYearId: parseInt(academicYearId),
      },
      include: {
        teacher: {
          select: {
            id: true,
            name: true,
            nip: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, attendance });
  } catch (error) {
    console.error("Error creating teacher attendance:", error);
    return NextResponse.json({ success: false, error: error.message });
  }
}

export async function PUT(req) {
  const { 
    id, 
    date, 
    teacherId, 
    status, 
    arrivalTime, 
    departureTime, 
    remarks, 
    semesterId, 
    academicYearId 
  } = await req.json();

  try {
    const attendance = await prisma.attendance.update({
      where: { id: parseInt(id) },
      data: {
        date: new Date(date),
        type: "teacher", // Fixed type untuk teacher
        childId: null, // Null untuk presensi guru
        teacherId: parseInt(teacherId),
        status,
        arrivalTime: arrivalTime || null,
        departureTime: departureTime || null,
        remarks,
        penjemput: null, // Null untuk presensi guru
        pengantar: null, // Null untuk presensi guru
        semesterId: parseInt(semesterId),
        academicYearId: parseInt(academicYearId),
      },
      include: {
        teacher: {
          select: {
            id: true,
            name: true,
            nip: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, attendance });
  } catch (error) {
    console.error("Error updating teacher attendance:", error);
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
      message: "Data presensi guru berhasil dipindahkan ke sampah"
    });
  } catch (error) {
    console.error("Error soft deleting teacher attendance:", error);
    return NextResponse.json({ success: false, error: error.message });
  }
}