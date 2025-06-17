// /pages/api/admin/laporan/presensi/route.js
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const semesterId = searchParams.get("semesterId");
  const academicYearId = searchParams.get("academicYearId");

  const whereClause = {
    isDeleted: false,
    ...(semesterId && { semesterId: parseInt(semesterId) }),
    ...(academicYearId && { academicYearId: parseInt(academicYearId) }),
  };

  try {
    const attendances = await prisma.attendance.findMany({
      where: whereClause,
      include: {
        child: true,
        teacher: true, // Menambahkan include teacher
        semester: true,
        academicYear: true
      },
      orderBy: {
        date: 'desc'
      }
    });

    return NextResponse.json({ success: true, attendances });
  } catch (error) {
    console.error("Error fetching attendance:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
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
        arrivalTime: arrivalTime || null,
        departureTime: departureTime || null,
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
  const { id, date, type, childId, teacherId, status, arrivalTime, departureTime, remarks, semesterId, academicYearId } = await req.json();

  try {
    const attendance = await prisma.attendance.update({
      where: { id: parseInt(id) },
      data: {
        date: new Date(date),
        type,
        childId: childId ? parseInt(childId) : null,
        teacherId: teacherId ? parseInt(teacherId) : null,
        status,
        arrivalTime: arrivalTime || null,
        departureTime: departureTime || null,
        remarks,
        semesterId: parseInt(semesterId),
        academicYearId: parseInt(academicYearId),
      },
    });

    return NextResponse.json({ success: true, attendance });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}

// Modify DELETE to perform soft delete instead of hard delete
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
      message: "Data presensi berhasil dipindahkan ke sampah"
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}