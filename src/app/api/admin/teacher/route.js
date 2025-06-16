// /pages/api/teacher/addTeacher.js
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// /api/admin/teacher/route.js
export async function POST(req) {
  const { 
    name, 
    email, 
    phone, 
    nip, 
    birthDate, 
    gender, 
    address, 
    city, 
    postalCode, 
    country, 
    profilePhoto,
    academicYear,  // ID tahun ajaran
    semester       // ID semester
  } = await req.json();

  try {
    const teacher = await prisma.teacher.create({
      data: {
        name,
        email,
        phone,
        nip,
        birthDate: new Date(birthDate),
        gender,
        address,
        city,
        postalCode,
        country,
        profilePhoto,
        // Relasi dengan semester dan tahun ajaran
        semesterId: semester ? parseInt(semester) : null,
        academicYearId: academicYear ? parseInt(academicYear) : null,
      },
    });
    return NextResponse.json({ success: true, teacher });
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
      ...(academicYearId && { academicYearId: parseInt(academicYearId) })
    };

    const teachers = await prisma.teacher.findMany({
      where: whereClause,
      include: {
        semester: {
          include: {
            academicYear: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    return NextResponse.json({ success: true, teachers });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}

// /api/admin/teacher/route.js
export async function PUT(req) {
  const { 
    id,
    name, 
    email, 
    phone, 
    nip, 
    birthDate, 
    gender, 
    address, 
    city, 
    postalCode, 
    country, 
    profilePhoto,
    academicYear,  // ID tahun ajaran
    semester       // ID semester
  } = await req.json();

  try {
    const teacher = await prisma.teacher.update({
      where: { id: parseInt(id) },
      data: {
        name,
        email,
        phone,
        nip,
        birthDate: new Date(birthDate),
        gender,
        address,
        city,
        postalCode,
        country,
        profilePhoto,
        // Update relasi dengan semester dan tahun ajaran
        semesterId: semester ? parseInt(semester) : null,
        academicYearId: academicYear ? parseInt(academicYear) : null,
      },
    });
    return NextResponse.json({ success: true, teacher });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}

export async function DELETE(req) {
  const { id } = await req.json();

  try {
    await prisma.teacher.delete({
      where: { id: parseInt(id) },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}