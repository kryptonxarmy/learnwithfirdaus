// /pages/api/parent/addChild.js
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
  const { 
    parentId, 
    name, 
    studentId, 
    phone, 
    birthDate, 
    gender, 
    address, 
    city, 
    postalCode, 
    country, 
    classId, 
    profilePhoto,
    academicYear,  // ID tahun ajaran
    semester       // ID semester
  } = await req.json();

  try {
    const child = await prisma.child.create({
      data: {
        name,
        studentId,
        phone,
        birthDate: new Date(birthDate),
        gender,
        address,
        city,
        postalCode,
        country,
        parentId: parseInt(parentId),        // Convert ke integer
        classId: parseInt(classId),          // Convert ke integer
        profilePhoto,
        // Tambahkan relasi langsung ke semester dan academicYear
        semesterId: semester ? parseInt(semester) : null,
        academicYearId: academicYear ? parseInt(academicYear) : null,
      },
    });
    return NextResponse.json({ success: true, child });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const semesterId = searchParams.get("semesterId");
  const academicYearId = searchParams.get("academicYearId");

  try {
    const whereClause = {
      isDeleted: false,
      ...(semesterId && { semesterId: parseInt(semesterId) }),
      ...(academicYearId && { academicYearId: parseInt(academicYearId) }),
    };

    const children = await prisma.child.findMany({
      where: whereClause,
      include: {
        parent: {
          include: {
            user: {
              select: {
                name: true,
                email: true
              }
            }
          }
        },
        class: {
          include: {
            semester: {
              include: {
                academicYear: true
              }
            }
          }
        },
        // Include relasi langsung semester dan academicYear
        semester: {
          include: {
            academicYear: true
          }
        },
        academicYear: true
      },
      orderBy: {
        name: 'asc'
      }
    });

    return NextResponse.json({ success: true, children });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}

export async function PUT(req) {
  const { 
    id, 
    parentId, 
    name, 
    studentId, 
    phone, 
    birthDate, 
    gender, 
    address, 
    city, 
    postalCode, 
    country, 
    classId, 
    profilePhoto,
    academicYear,  // ID tahun ajaran
    semester       // ID semester
  } = await req.json();

  try {
    const child = await prisma.child.update({
      where: { id: parseInt(id) },
      data: {
        name,
        studentId,
        phone,
        birthDate: new Date(birthDate),
        gender,
        address,
        city,
        postalCode,
        country,
        parentId: parseInt(parentId),        // Convert ke integer
        classId: parseInt(classId),          // Convert ke integer
        profilePhoto,
        // Update relasi langsung ke semester dan academicYear
        semesterId: semester ? parseInt(semester) : null,
        academicYearId: academicYear ? parseInt(academicYear) : null,
      },
    });
    return NextResponse.json({ success: true, child });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}

export async function DELETE(req) {
  const { id } = await req.json();

  try {
    await prisma.child.delete({
      where: { id: parseInt(id) },    // Convert ke integer
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}